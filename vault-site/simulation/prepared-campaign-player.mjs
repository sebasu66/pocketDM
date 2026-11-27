// SYS-06: bridge to SYS-04/05/07, no simulation or authoring at play time.
// Dependency functions are injected from the reviewed agent revisions.
import {createHash} from 'node:crypto';
import {makeCampaignProjection} from '../public/libro/campaign-projection.mjs';
import {playerState} from './campaign-state.mjs';
import {narrativeManifest,persistApprovedArtifact,confirmedNarrativeFragment} from './narrative-integration.mjs';
const need=(v,m)=>{if(!v)throw Error(m)};
const fail=code=>Object.assign(Error(code),{code});
const own=(o,k)=>Object.hasOwn(o,k);
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,120}$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
const pageId=r=>'page-'+r;
export const preparedChoiceId=e=>'choice-'+hash(e.branchId).slice(0,32);
const worker=(campaignId)=>({uid:'sys06-internal',role:'worker',campaignId});
const same=(a,b)=>hash(a)===hash(b);
export function createPreparedPlayer({store,startBoundEdition,confirmBoundChoice,boundChoiceView,confirmedModuleNarration,projectVisibleContext,environment}={}){
 need(environment==='fixture'&&[startBoundEdition,confirmBoundChoice,boundChoiceView,confirmedModuleNarration,projectVisibleContext].every(f=>typeof f==='function'),'Fixture-only reviewed dependency ports required');
 need(['read','create','cas','put','get'].every(k=>typeof store?.[k]==='function'),'Transactional store required');
 function access(scope){return {campaignId:scope.campaignId,actorId:scope.actorId,role:'player'}}
 function verifyScope(row,scope){if(scope?.role!=='player'||row.ownerUid!==scope.uid||row.actorId!==scope.actorId||row.campaignId!==scope.campaignId)throw fail('NOT_FOUND')}
 async function getPrivate(c,ref){const item=await store.get(worker(c),ref);if(!item||item.digest!==ref.digest)throw fail('PREPARATION_UNAVAILABLE');return item.payload}
 function choices(edition,session){const v=boundChoiceView(edition,session),node=edition.nodes[session.nodeId];need(node.edges.length===v.choices.length,'Prepared choice mismatch');return node.edges.map(e=>({id:preparedChoiceId(e),edge:e}))}
 function viewFor(row,pkg,scope){
  const v=playerState(pkg.base,row.session.state,access(scope));
  const cs=choices(pkg.edition,row.session);
  const actions=cs.map(({edge})=>({action:'module-intent',intentId:edge.action.intentId}));
  need(actions.every(a=>v.actions.some(x=>same(x,a))),'Prepared choice not legal in effective state');
  return {...v,actions};
 }
 async function load(scope){
  const record=await store.read(scope.campaignId);if(!record)throw fail('NOT_FOUND');
  const row=record.value;verifyScope(row,scope);
  const pkg=await getPrivate(row.campaignId,row.editionRef);need(pkg.edition.editionId===row.session.editionId,'Edition identity mismatch');
  return {row,pkg,version:record.version};
 }
 async function narration(pkg,scope,state,edge){
  const binding=pkg.fragments[edge.branchId];if(!binding)throw fail('PREPARATION_UNAVAILABLE');
  const event=playerState(pkg.base,state,access(scope)).journal.find(e=>e.id===edge.event.id);
  const f=await confirmedNarrativeFragment({store,scope:{...worker(scope.campaignId),editionId:pkg.edition.editionId},job:binding.job,binding:binding.binding,reference:binding.ref,confirmed:{branchId:edge.branchId,campaignId:scope.campaignId,editionId:pkg.edition.editionId,actorId:scope.actorId,event}});
  return confirmedModuleNarration(pkg.base,state,access(scope),edge.event.id,async()=>f);
 }
 async function bookFor(row,pkg,scope){
  const v=viewFor(row,pkg,scope),pages=[{id:pageId(pkg.edition.initial.delta.revision),type:'location',title:pkg.title,text:[],events:[],choices:[]}];
  for(const h of row.history){
   const edge=pkg.edition.nodes[h.nodeId]?.edges.find(x=>x.branchId===h.branchId);need(edge,'Confirmed history mismatch');
   const envelope=await narration(pkg,scope,row.session.state,edge);
   pages.push({id:pageId(edge.event.revision),type:edge.nextId&&pkg.edition.nodes[edge.nextId].ending?'resolution':'dialogue',title:envelope.presentation.title,text:[],events:[envelope],choices:[]});
  }
  pages.at(-1).choices=choices(pkg.edition,row.session).map(({id,edge})=>({id,label:pkg.labels[edge.action.intentId]}));
  need(pages.at(-1).id===pageId(v.revision),'Book revision mismatch');
  return {schemaVersion:1,kind:'pocketdm-player-edition',campaignId:scope.campaignId,actorId:scope.actorId,revision:v.revision,title:pkg.title,pages,projection:makeCampaignProjection(v)};
 }
 // Private install only. All candidate branches must have exact validated artifacts before first play.
 // No production approval is implied by this fixture path.
 async function install(scope,{base,edition,artifacts,title,labels,ownerUid,actorId}){
  need(scope?.role==='worker'&&scope.campaignId===edition?.initial?.id&&id(actorId)&&typeof ownerUid==='string'&&ownerUid&&edition.initial.actorId===actorId,'Invalid installation scope');
  need(edition.mode==='mechanical-fixture'&&edition.publicationReady===false&&edition.coverage?.complete===true,'Only complete synthetic edition supported');
  need(typeof title==='string'&&title.trim()&&title.length<=240,'Invalid title');
  const c=scope.campaignId,player={uid:ownerUid,campaignId:c,actorId,role:'player'},fragments=Object.create(null);
  const edges=Object.values(edition.nodes).flatMap(n=>n.edges);
  need(labels&&typeof labels==='object'&&edges.every(e=>own(labels,e.action.intentId)&&typeof labels[e.action.intentId]==='string'&&labels[e.action.intentId].trim()&&labels[e.action.intentId].length<=500),'Missing approved choice label');
  need(edges.length>0&&edges.length===edition.coverage.edges&&edges.length===artifacts.length,'Incomplete artifact coverage');
  // A single authoritative manifest and slot numbering from SYS-05, using explicit audience projection.
  const versions=artifacts[0]?.job?.versions,manifest=narrativeManifest({edition,campaignId:c,actorId,versions,projectVisible:(edge,next)=>{
   const projected=playerState(base,edge.state,access(player)),event=projected.journal.find(e=>e.id===edge.event.id);
   need(event&&event.action==='module-intent'&&same(event,edge.event),'Prepared visible event mismatch');
   return {context:projectVisibleContext({edge,next,player:projected}),event,facts:event.facts.map(f=>({id:f.id,text:f.description})),options:next.edges.map(e=>({id:preparedChoiceId(e),text:labels[e.action.intentId]}))};
  }});
  for(const {job,binding} of manifest){
   const input=artifacts.find(x=>x.job.branchId===job.branchId);
   need(input&&!own(fragments,job.branchId)&&same(job,input.job),'Narrative manifest mismatch');
   const checkMap=Object.fromEntries(binding.checks.map(c=>[c.slotId,c.id]));
   if(input.checkMap!==undefined)need(same(input.checkMap,checkMap),'Narrative check binding mismatch');
   const ref=await persistApprovedArtifact({store,scope:{...scope,editionId:edition.editionId},job,artifact:input.artifact});
   fragments[job.branchId]={job,binding,ref};
  }
  const pkg={base,edition,fragments,title,labels},session=startBoundEdition(edition);
  // Validate every actual confirmed projection before publishing even the fixture.
  for(const edge of edges)await narration(pkg,player,edge.state,edge);
  const ref={kind:'edition',key:edition.editionId,version:'v-'+hash(pkg).slice(0,32)},stored=await store.put(scope,{...ref,payload:pkg});
  const row={campaignId:c,ownerUid,actorId,editionRef:{...ref,digest:stored.digest},session,history:[],commands:{}};
  viewFor(row,pkg,player);
  if(!await store.create(c,row)){const existing=await store.read(c);verifyScope(existing.value,player);need(same(existing.value.editionRef,row.editionRef),'Campaign already assigned');}
  return {campaignId:c,editionId:edition.editionId};
 }
 async function select(scope,command,book){
  need(id(command.commandId),'Invalid command ID');
  const fingerprint=hash(command);
  for(let retry=0;retry<8;retry++){
   const {row,pkg,version}=await load(scope);
   let duplicate=false,eventId;
   if(own(row.commands,command.commandId)){
    const prior=row.commands[command.commandId];if(prior.fingerprint!==fingerprint)throw fail('COMMAND_ID_REUSED');duplicate=true;eventId=prior.eventId;
   }else{
    const view=viewFor(row,pkg,scope);
    if(view.revision!==command.expectedRevision)throw fail('REVISION_CONFLICT');
    const available=choices(pkg.edition,row.session);
    const matches=book?available.filter(x=>x.id===command.choiceId&&command.pageId===pageId(view.revision)):available.filter(x=>command.action==='module-intent'&&x.edge.action.intentId===command.intentId);
    if(matches.length!==1)throw fail('ACTION_NOT_ALLOWED');
    const edge=matches[0].edge;
    const result=confirmBoundChoice(pkg.edition,row.session,{commandId:command.commandId,expectedRevision:command.expectedRevision,branchId:edge.branchId});
    need(!result.duplicate&&same(result.event,edge.event),'Prepared receipt mismatch');
    eventId=result.event.id;
    // Validate confirmed candidate and narration before the single atomic write.
    await narration(pkg,scope,result.session.state,edge);
    row.history.push({nodeId:row.session.nodeId,branchId:edge.branchId});
    row.session=result.session;row.commands[command.commandId]={fingerprint,eventId};
    viewFor(row,pkg,scope);
    if(!await store.cas(scope.campaignId,row,version))continue;
   }
   if(book)return bookFor(row,pkg,scope);
   const view=viewFor(row,pkg,scope),event=view.journal.find(e=>e.id===eventId);need(event,'Confirmed receipt absent');
   return {duplicate,receipt:{commandId:command.commandId,revision:event.revision,event},view};
  }
  throw fail('REVISION_CONFLICT');
 }
 return Object.freeze({install,async start(s){const {row,pkg}=await load(s);return viewFor(row,pkg,s)},async view(s){const {row,pkg}=await load(s);return viewFor(row,pkg,s)},async book(s){const {row,pkg}=await load(s);return bookFor(row,pkg,s)},confirmPrepared:(s,c)=>select(s,c,false),confirmBook:(s,c)=>select(s,c,true)});
}
