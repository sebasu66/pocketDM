// QA-03: server-only persistence against the isolated Firestore emulator.
// Production adapter/authentication is deliberately not enabled by this module.
import {confirmCommand,playerState,previewCommand} from './campaign-state.mjs';
import {snapshot} from './world-context.mjs';
const ok=(condition,message)=>{if(!condition)throw Error(message)};
const id=s=>typeof s==='string'&&/^[a-z][a-z0-9_.-]{0,100}$/.test(s)&&!['constructor','prototype','__proto__'].includes(s);
const textBytes=x=>Buffer.byteLength(x,'utf8');
const encode=x=>{const data=JSON.stringify(x);ok(textBytes(data)<=850000,'Campaign document capacity exceeded');return {stringValue:data}};
const decode=x=>JSON.parse(x.stringValue);
const fail=(status,message)=>Object.assign(Error(message),{httpStatus:status});
export class FirestoreCampaignStore {
 constructor({host=process.env.FIRESTORE_EMULATOR_HOST,project='demo-pocketdm-qa03',fetchImpl=fetch}={}){
  ok(typeof host==='string'&&/^(127\.0\.0\.1|localhost):[0-9]{1,5}$/.test(host),'Local emulator required');
  ok(project==='demo-pocketdm-qa03','Only isolated QA demo project allowed');
  this.root='http://'+host+'/v1/projects/'+project+'/databases/(default)/documents';
  this.prefix='projects/'+project+'/databases/(default)/documents';
  this.fetch=fetchImpl;
 }
 async request(path,{method='GET',body}={}){
  const r=await this.fetch(this.root+path,{method,headers:{Authorization:'Bearer owner','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
  if(!r.ok){const e=await r.json().catch(()=>({}));throw fail(r.status,e.error?.status||'Firestore request failed')}
  return r.json();
 }
 path(campaignId){ok(id(campaignId),'Invalid campaign ID');return '/qa_campaigns/'+campaignId}
 async read(campaignId){
  const doc=await this.request(this.path(campaignId));
  const base=decode(doc.fields.base),state=decode(doc.fields.state);
  // Recompute the immutable snapshot identity before allowing replay.
  const checked=snapshot({canon:base.canon,nodes:Object.values(base.nodes),entities:Object.values(base.entities),routes:Object.values(base.routes)});
  ok(checked.id===base.id&&state.delta.baseSnapshotId===base.id&&state.id===campaignId,'Stored snapshot mismatch');
  return {base:checked,state,ownerUid:doc.fields.ownerUid.stringValue,version:doc.updateTime};
 }
 authorize(row,principal,campaignId){
  ok(principal&&typeof principal.uid==='string'&&principal.uid===row.ownerUid&&principal.campaignId===campaignId&&principal.actorId===row.state.actorId,'Access denied');
 }
 async write(campaignId,base,state,ownerUid,precondition){
  const name=this.prefix+this.path(campaignId);
  const fields={base:encode(base),state:encode(state),ownerUid:{stringValue:ownerUid},revision:{integerValue:String(state.delta.revision)}};
  ok(textBytes(JSON.stringify(fields))<950000,'Campaign document capacity exceeded');
  return this.request(':commit',{method:'POST',body:{writes:[{update:{name,fields},currentDocument:precondition}]}});
 }
 async create(base,state,{ownerUid}={}){
  ok(typeof ownerUid==='string'&&ownerUid.length>0&&ownerUid.length<=128,'Invalid owner');
  ok(state.phase==='confirmed'&&state.delta.baseSnapshotId===base.id,'Invalid initial state');
  playerState(base,state,{campaignId:state.id,actorId:state.actorId,role:'player'});
  // An existing campaign is never silently replaced.
  await this.write(state.id,base,state,ownerUid,{exists:false});
 }
 async view(principal){
  ok(principal?.role==='player','Player access required');
  const row=await this.read(principal.campaignId);this.authorize(row,principal,principal.campaignId);
  return playerState(row.base,row.state,{campaignId:principal.campaignId,actorId:principal.actorId,role:'player'});
 }
 async preview(principal,command){
  const row=await this.read(principal.campaignId);this.authorize(row,principal,principal.campaignId);
  // Trusted worker only. Never expose this method as a player HTTP endpoint.
  ok(principal.role==='worker','Worker access required');
  return previewCommand(row.base,row.state,{campaignId:principal.campaignId,actorId:principal.actorId,role:'worker'},command);
 }
 async confirm(principal,command,{expectedPreviewHash}={}){
  ok(principal.role==='player','Player access required');
  for(let attempt=0;attempt<8;attempt++){
   const row=await this.read(principal.campaignId);this.authorize(row,principal,principal.campaignId);
   const access={campaignId:principal.campaignId,actorId:principal.actorId,role:'player'};
   const r=confirmCommand(row.base,row.state,access,command,{expectedPreviewHash});
   if(!r.duplicate){
    try{await this.write(principal.campaignId,row.base,r.state,row.ownerUid,{updateTime:row.version})}
    catch(e){if([409,412].includes(e.httpStatus)||e.message==='FAILED_PRECONDITION'||e.message==='ABORTED')continue;throw e}
   }
   // No private receipt fingerprint, snapshot or seed returned to player.
   const {event}=r.receipt;
   const view=playerState(row.base,r.state,access);
   const projected=view.journal.find(e=>e.id===event.id);
   ok(projected,'Confirmed event projection missing');
   return {duplicate:r.duplicate,receipt:{commandId:r.receipt.commandId,revision:r.receipt.revision,event:projected},view};
  }
  throw Error('Concurrent update retry budget exhausted');
 }
}
