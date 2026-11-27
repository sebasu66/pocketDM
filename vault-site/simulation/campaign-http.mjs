import {readCampaignProjection} from '../public/libro/campaign-projection.mjs';
// SYS-06 candidate: server-only Fetch API boundary, not a mounted route.
// No fallback to confirmCommand: prepared transitions must be provided by SYS-04.
const id = s => typeof s === 'string' && /^[a-z][a-z0-9_.-]{0,100}$/.test(s) && !['constructor','prototype','__proto__'].includes(s);
const commandId = s => typeof s === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,120}$/.test(s) && !['constructor','prototype','__proto__'].includes(s);
const plain = x => x !== null && typeof x === 'object' && Object.getPrototypeOf(x) === Object.prototype;
const fail = (status, code) => Object.assign(new Error(code), {status,code});
const json = (status, data) => new Response(JSON.stringify(data), {status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
const actions = Object.freeze({'consume-ration':null,travel:'targetId',duel:'encounterId','module-intent':'intentId'});
const own = (x,k) => Object.prototype.hasOwnProperty.call(x,k);
async function body(req) {
 if (!/^application\/json(?:\s*;|$)/i.test(req.headers.get('content-type') || '')) throw fail(415,'JSON_REQUIRED');
 if (!req.body) throw fail(400,'INVALID_COMMAND');
 const reader=req.body.getReader(); const chunks=[]; let size=0;
 try { for (;;) { const {done,value}=await reader.read(); if(done) break; size+=value.byteLength; if(size>8192){await reader.cancel();throw fail(413,'BODY_TOO_LARGE');} chunks.push(value); } }
 finally {reader.releaseLock();}
 try {return JSON.parse(Buffer.concat(chunks).toString('utf8'));} catch {throw fail(400,'INVALID_JSON');}
}
function command(input, scope) {
 if(!plain(input)||!commandId(input.commandId)||!Number.isSafeInteger(input.expectedRevision)||input.expectedRevision<0||!own(actions,input.action)) throw fail(400,'INVALID_COMMAND');
 const extra=actions[input.action], fields=['commandId','expectedRevision','action',...(extra?[extra]:[])];
 if(Object.keys(input).length!==fields.length||!fields.every(k=>own(input,k))||(extra&&!id(input[extra]))) throw fail(400,'INVALID_COMMAND');
 return {...input,campaignId:scope.campaignId,actorId:scope.actorId};
}
// Player authority is a server-only port: start, view, confirmPrepared.
// Every operation must return only playerState-compatible confirmed projections.
// Grant lookup must use trusted storage, not request claims or custom role headers.
export function createCampaignHttp({verifyIdToken,lookupGrant,player}={}) {
 if(typeof verifyIdToken!=='function'||typeof lookupGrant!=='function') throw new Error('Trusted authentication and grant lookup required');
 return async function handle(req) {
  try {
   const match=new URL(req.url).pathname.match(/^\/api\/campaigns\/([a-z][a-z0-9_.-]{0,100})(?:\/(start|options|commands|book(?:\/commands)?))?$/);
   if(!match||!id(match[1])) throw fail(404,'NOT_FOUND');
   const [,campaignId,part]=match, method=part==='start'||part==='commands'||part==='book/commands'?'POST':'GET';
   if(req.method!==method) throw fail(405,'METHOD_NOT_ALLOWED');
   const token=req.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/i)?.[1];
   if(!token) throw fail(401,'UNAUTHENTICATED');
   let identity; try {identity=await verifyIdToken(token,true);} catch {throw fail(401,'UNAUTHENTICATED');}
   if(typeof identity?.uid!=='string'||!identity.uid) throw fail(401,'UNAUTHENTICATED');
   const grant=await lookupGrant(identity.uid,campaignId);
   if(!grant||grant.role!=='player'||grant.campaignId!==campaignId||grant.uid!==identity.uid||!id(grant.actorId)) throw fail(404,'NOT_FOUND');
   const scope=Object.freeze({uid:identity.uid,campaignId,actorId:grant.actorId,role:'player'});
   if(part==='book'||part==='book/commands'){
    const fn=part==='book'?'book':'confirmBook';
    if(typeof player?.[fn]!=='function')throw fail(503,'PREPARATION_UNAVAILABLE');
    let edition;
    if(part==='book/commands'){
     const input=await body(req),keys=['commandId','expectedRevision','pageId','choiceId'];
     if(!plain(input)||Object.keys(input).length!==keys.length||!keys.every(k=>own(input,k))||!commandId(input.commandId)||!Number.isSafeInteger(input.expectedRevision)||input.expectedRevision<0||!id(input.pageId)||!id(input.choiceId))throw fail(400,'INVALID_COMMAND');
     edition=await player.confirmBook(scope,input);
    }else edition=await player.book(scope);
    if(!plain(edition)||edition.kind!=='pocketdm-player-edition'||edition.campaignId!==campaignId||edition.actorId!==scope.actorId||!Number.isSafeInteger(edition.revision)||!Array.isArray(edition.pages))throw fail(503,'INVALID_PROJECTION');
    const keys=['schemaVersion','kind','campaignId','actorId','revision','title','pages'];
    if(edition.projection!==undefined){try{readCampaignProjection(edition.projection,edition);keys.push('projection')}catch{throw fail(503,'INVALID_PROJECTION')}}
    return json(200,Object.fromEntries(keys.map(k=>[k,edition[k]])));
   }
   const operation=part==='commands'?'confirmPrepared':part==='start'?'start':'view';
   if(typeof player?.[operation]!=='function') throw fail(503,'PREPARATION_UNAVAILABLE');
   let result, submitted;
   if(part==='commands') {submitted=command(await body(req),scope);result=await player.confirmPrepared(scope,submitted);}
   else if(part==='start') {
    // The grant identifies a preassigned campaign; no client-authored seed or definition.
    if(req.body!==null) throw fail(400,'START_BODY_FORBIDDEN');
    result=await player.start(scope);
   } else result=await player.view(scope);
   const view=part==='commands'?result?.view:result;
   if(!plain(view)||view.campaignId!==campaignId||view.actorId!==scope.actorId||!Number.isSafeInteger(view.revision)||!Array.isArray(view.actions)||!Array.isArray(view.journal)) throw fail(503,'INVALID_PROJECTION');
   // Top-level allowlist. Nested objects must already be authorized by playerState.
   const keys=['schemaVersion','campaignId','revision','actorId','locationId','elapsedSeconds','sheet','derived','effectiveAP','module','nodes','routes','actions','journal'];
   const safe=Object.fromEntries(keys.filter(k=>own(view,k)).map(k=>[k,view[k]]));
   if(part==='options') return json(200,{campaignId,actorId:scope.actorId,revision:safe.revision,actions:safe.actions});
   if(part==='commands'){
    const receipt=result.receipt, event=safe.journal.find(e=>e.id===receipt?.event?.id&&e.revision===receipt?.revision);
    if(typeof result.duplicate!=='boolean'||receipt?.commandId!==submitted.commandId||!event) throw fail(503,'INVALID_RECEIPT');
    return json(200,{duplicate:result.duplicate,receipt:{commandId:receipt.commandId,revision:receipt.revision,event},view:safe});
   }
   return json(200,safe);
  } catch(e) {
   // Only stable, explicitly known errors reach the client. Never serialize stack or source.
   const known={UNAUTHENTICATED:401,NOT_FOUND:404,METHOD_NOT_ALLOWED:405,INVALID_COMMAND:400,INVALID_JSON:400,START_BODY_FORBIDDEN:400,JSON_REQUIRED:415,BODY_TOO_LARGE:413,REVISION_CONFLICT:409,COMMAND_ID_REUSED:409,ACTION_NOT_ALLOWED:422,PREPARATION_UNAVAILABLE:503,INVALID_PROJECTION:503,INVALID_RECEIPT:503};
   const recognized=typeof e?.code==='string'&&own(known,e.code);
   return json(recognized?known[e.code]:500,{error:recognized?e.code:'INTERNAL_ERROR'});
  }
 };
}
