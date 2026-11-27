// Finite edition pilot. Server-side only. Uses the existing simplified pilot rules,
// not the advanced combat core; no real host accounts, persistence or LLM calls.
import {createHash} from 'node:crypto';
import {createCampaign,options,resolve,RULES} from './engine.mjs';
import {initialWorld,materializePilot} from './world-pilot.mjs';
import {campaign,effective} from './world-context.mjs';
import {validateCheck} from '../public/libro/check-contract.mjs';
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const digest=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
const copy=structuredClone;
const check=(ok,msg)=>{if(!ok)throw Error(msg)};
const terminal=new Set(['resolved','withdrawn','incapacitated','unresolved']);
const skills=['perception','influence','combat','evade'];
const actions=s=>options(s).filter(a=>a!=='help'||s.hero.rations>0);
const endings={resolved:'module-resolved',withdrawn:'module-withdrawn',incapacitated:'module-incapacitated',unresolved:'module-unresolved'};
// Mechanical fixture only, pending the narrator's authored Stormkeep module.
export const MODULE=Object.freeze({id:'stormkeep-corridor-fixture',version:1,startLocation:'pilot.village',hub:'stormkeep',maxDecisions:6,rules:RULES});
const assetSpecs=[
 ['cover','module','stormkeep-corridor-fixture'],['location','location','pilot.village'],['location','location','pilot.bridge'],
 ['portrait','npc','pilot.mara'],['portrait','npc','pilot.ivo'],['portrait','npc','pilot.neris']
];
export function prepareFixture({campaignId='development-campaign',seed,profile={},base=initialWorld(),delta=campaign(base,campaignId)}={}){
 check(typeof seed==='string'&&seed.length>0,'Private development seed required');
 check(delta.id===campaignId,'Campaign mismatch');
 const w=effective(base,delta);
 check(w.nodes[MODULE.hub]?.generation==='visitable','Module hub unavailable');
 check(w.entities.galahad?.locationId===MODULE.hub,'Actor must begin at hub in this fixture');
 const materialized=materializePilot(base,delta),world=effective(base,materialized);
 for(const id of ['pilot.village','pilot.bridge'])check(world.nodes[id]?.generation==='visitable','Missing module location');
 for(const id of ['pilot.mara','pilot.ivo','pilot.neris'])check(world.entities[id],'Missing module actor');
 const s=createCampaign(seed);
 const p={locale:'es-AR',tone:'dark-fantasy',archetype:'guard',temperament:'balanced',tactics:'balanced',...profile};
 // No arbitrary user data in cache compatibility. Only supported fields.
 const clean={locale:p.locale,tone:p.tone,archetype:p.archetype,temperament:p.temperament,tactics:p.tactics};
 for(const v of Object.values(clean))check(typeof v==='string'&&/^[a-zA-Z0-9-]{1,40}$/.test(v),'Invalid profile label');
 const hero={...s.hero,...(p.hero||{}),skills:{...s.hero.skills,...(p.hero?.skills||{})}};
 check(hero.id==='galahad'&&typeof hero.name==='string'&&hero.name.length>0&&hero.name.length<=80,'Unsupported fixture actor');
 for(const k of skills)check(Number.isInteger(hero.skills[k])&&hero.skills[k]>=0&&hero.skills[k]<=100,'Invalid skill '+k);
 for(const k of ['hp','fatigue','rations'])check(Number.isInteger(hero[k])&&hero[k]>=0&&hero[k]<=100,'Invalid resource '+k);
 check(hero.hp>0,'Actor incapacitated');
 s.hero={id:hero.id,name:hero.name,skills:Object.fromEntries(skills.map(k=>[k,hero.skills[k]])),hp:hero.hp,fatigue:hero.fatigue,rations:hero.rations};
 s.place=world.nodes[MODULE.startLocation].name;
 // This is a preparation projection, not a committed move or a new independent campaign DB.
 const editionId='edition-'+digest([MODULE,campaignId,base.id,delta,seed,s.hero,clean,s.cargo]).slice(0,32);
 s.id=editionId;
 return {module:MODULE,editionId,campaignId,baseSnapshotId:base.id,worldRevision:delta.revision,preparedWorld:materialized,profile:clean,initial:s};
}
export function compatibilitySignature(prepared){
 const {initial:s,profile:p}=prepared;
 return digest([MODULE,p,Object.fromEntries(skills.map(k=>[k,Math.floor(s.hero.skills[k]/20)]))]);
}
// Exact visible semantics, conservative scope: campaign-local only in v0.1.
// IDs and numeric rolls remain bindings to the real event, never cached outcomes.
// Include exact visible before/after and checks except ids/rolls: prose must use check slots,
// not claim numeric roll. Name included to avoid accidental personalization mismatch.
function jobFor(prepared,before,event){
 const semantic={module:MODULE.id,moduleVersion:MODULE.version,rules:RULES,profile:prepared.profile,place:prepared.initial.place,cargo:prepared.initial.cargo,
 actorName:before.hero.name,action:event.action,before:{hp:before.hero.hp,fatigue:before.hero.fatigue,rations:before.hero.rations,scene:before.scene},after:event.visibleState,
 facts:event.facts,checks:event.checks.map(({skillId,base,target,difficulty,outcome})=>({skillId,base,target,difficulty,outcome}))};
 const key=digest(['campaign-private',prepared.campaignId,'narrator-v1',semantic]);
 return {key,semantic,eventId:event.id,checkIds:event.checks.map(c=>c.id),mode:'fixture',scope:'campaign-private'};
}
export function compileEdition(prepared,{maxEdges=1200,cachedKeys=[],availableAssets=[]}={}){
 check(Number.isInteger(maxEdges)&&maxEdges>=1&&maxEdges<=10000,'Invalid compilation budget');
 check(prepared.module.id===MODULE.id&&prepared.module.version===MODULE.version,'Unsupported module');
 const nodes=Object.create(null),jobs=new Map(),endingsCount={},cached=new Set(cachedKeys),assetsReady=new Set(availableAssets);
 let edges=0,leaves=0,maxDepth=0;
 function walk(s){
  const id='node-'+digest([prepared.editionId,s.path]).slice(0,32);
  check(!nodes[id],'Duplicate node');
  const node=nodes[id]={id,revision:s.revision,scene:s.scene,status:s.status,stateDigest:digest(s),edges:[]};
  maxDepth=Math.max(maxDepth,s.revision);
  if(terminal.has(s.status)){leaves++;endingsCount[s.status]=(endingsCount[s.status]||0)+1;node.ending=endings[s.status];return id}
  check(s.revision<MODULE.maxDecisions,'Missing terminal condition');
  const legal=actions(s);check(legal.length>0,'Nonterminal without legal actions');
  for(const action of legal){
   check(++edges<=maxEdges,'Compilation budget exceeded; edition not ready');
   const {state,event}=resolve(s,action);event.checks.forEach(validateCheck);
   const job=jobFor(prepared,s,event);
   if(!jobs.has(job.key))jobs.set(job.key,{key:job.key,semantic:job.semantic,mode:'fixture',scope:job.scope,eventBindings:[],status:cached.has(job.key)?'candidate':'missing'});
   jobs.get(job.key).eventBindings.push({eventId:event.id,checkIds:job.checkIds});
   const nextId=walk(state);
   const branchId='branch-'+digest([prepared.editionId,id,action,nextId]).slice(0,32);
   node.edges.push({action,branchId,event,nextId,preparedState:copy(state),preparedDigest:digest([branchId,event,state,nextId]),narrativeKey:job.key});
  }
  return id;
 }
 const rootId=walk(prepared.initial),assets=assetSpecs.map(([role,kind,id])=>{
  const key=digest([MODULE.id,MODULE.version,role,kind,id,'art-direction-pending-v1']);
  return {key,role,entityType:kind,entityId:id,status:assetsReady.has(key)?'candidate':'missing',required:true};
 });
 const narrativeJobs=[...jobs.values()];
 return {schemaVersion:1,mode:'fixture',editionId:prepared.editionId,moduleId:MODULE.id,moduleVersion:MODULE.version,baseSnapshotId:prepared.baseSnapshotId,worldRevision:prepared.worldRevision,campaignId:prepared.campaignId,compatibilitySignature:compatibilitySignature(prepared),
 rootId,nodes,narrativeJobs,assets,coverage:{mechanicalComplete:true,meaningfulEndingsComplete:!endingsCount.unresolved,nodes:Object.keys(nodes).length,edges,leaves,maxDepth,endings:endingsCount,uniqueNarrativeJobs:jobs.size,candidateNarrativeJobs:narrativeJobs.filter(j=>j.status==='candidate').length,missingNarrativeJobs:narrativeJobs.filter(j=>j.status==='missing').length,missingAssets:assets.filter(a=>a.status==='missing').length},
 publicationReady:false, // candidate keys are NOT evidence of validated text/asset contents.
 privatePreparation:copy(prepared)};
}
export function startEdition(edition){
 return {editionId:edition.editionId,nodeId:edition.rootId,state:copy(edition.privatePreparation.initial),receipts:{}};
}
// In-memory single-authority reference. Atomic persistence and concurrent duplicate handling pending.
export function confirmChoice(edition,session,command){
 check(session.editionId===edition.editionId,'Wrong edition');
 check(typeof command.commandId==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(command.commandId),'Invalid command ID');
 const key=digest(command);
 if(Object.hasOwn(session.receipts,command.commandId)){const old=session.receipts[command.commandId];check(old.key===key,'Command ID reused');return {session:copy(session),event:copy(old.event),duplicate:true}}
 check(command.expectedRevision===session.state.revision,'Revision conflict');
 check(command.worldRevision===edition.worldRevision,'World revision conflict');
 const node=edition.nodes[session.nodeId];check(node?.revision===session.state.revision&&node.stateDigest===digest(session.state),'Node/state mismatch');
 const edge=node.edges.find(e=>e.action===command.action);check(edge&&actions(session.state).includes(command.action),'Action not allowed');
 const state=copy(edge.preparedState),event=copy(edge.event);
 check(edge.preparedDigest===digest([edge.branchId,event,state,edge.nextId])&&edition.nodes[edge.nextId]?.stateDigest===digest(state),'Compiled result mismatch');
 const next=copy(session);next.state=state;next.nodeId=edge.nextId;next.receipts[command.commandId]={key,event:copy(event)};
 return {session:next,event:copy(event),duplicate:false};
}
export function playerView(edition,session){
 check(session.editionId===edition.editionId,'Wrong edition');
 const node=edition.nodes[session.nodeId];
 return {mode:'fixture',editionId:edition.editionId,revision:session.state.revision,scene:node.scene,status:node.status,choices:node.edges.map(e=>e.action),history:copy(session.state.history),ending:node.ending??null};
}
export function completion(edition,session){
 check(session.editionId===edition.editionId&&terminal.has(session.state.status),'Adventure not finished');
 return {mode:'fixture',editionId:edition.editionId,ending:endings[session.state.status],hero:copy(session.state.hero),facts:session.state.history.flatMap(e=>copy(e.facts)),privateConsequences:{keeperTrust:session.state.npcs.keeper.trust,guardAlert:session.state.npcs.guard.alert,rivalHp:session.state.npcs.rival.hp},nextModuleIds:[],committed:false};
}
