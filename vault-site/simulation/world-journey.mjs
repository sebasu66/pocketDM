// Campaign-local world progression. Pure functions, server-side reference only.
// No persistent database, ACL, real clock or generic narrative generation.
import {createHash} from 'node:crypto';
import {campaign,effective,applyChanges,context} from './world-context.mjs';
import {initialWorld,materializePilot} from './world-pilot.mjs';
import {MODULE,startEdition,confirmChoice,completion} from './adventure-compiler.mjs';
const copy=structuredClone;
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
const requireThat=(ok,msg)=>{if(!ok)throw Error(msg)};
const own=(o,k)=>Object.hasOwn(o,k);
const isVisible=(x,known)=>x.visibility==='public'||(x.visibility==='known'&&known.has(x.id));
// Continuation candidates, not authored or ready-to-play modules. Labels deliberately neutral.
const catalog=[
 {id:MODULE.id,title:'Corredor de Stormkeep',entry:'stormkeep',status:'mechanical-fixture',condition:{op:'not-completed',moduleId:MODULE.id}},
 {id:'followup.resolved',title:'Continuación tras resolver el conflicto',entry:'pilot.bridge',status:'awaiting-authoring',condition:{op:'ending',moduleId:MODULE.id,equals:'module-resolved'}},
 {id:'followup.withdrawn',title:'Continuación tras la retirada',entry:'pilot.village',status:'awaiting-authoring',condition:{op:'ending',moduleId:MODULE.id,equals:'module-withdrawn'}},
 {id:'followup.recovery',title:'Recuperación y consecuencias',entry:'pilot.bridge',status:'awaiting-authoring',condition:{op:'ending',moduleId:MODULE.id,equals:'module-incapacitated'}},
 {id:'followup.unresolved',title:'Continuación del conflicto pendiente',entry:'pilot.bridge',status:'awaiting-authoring',condition:{op:'ending',moduleId:MODULE.id,equals:'module-unresolved'}},
 {id:'followup.ally',title:'Oportunidad por ayuda a la aldea',entry:'pilot.village',status:'awaiting-authoring',condition:{op:'all',conditions:[{op:'ending',moduleId:MODULE.id,equals:'module-resolved'},{op:'fact',moduleId:MODULE.id,kind:'supplies_shared'}]}}
];
export function newJourney(id='world-campaign',base=initialWorld()){
 return {schemaVersion:1,id,delta:campaign(base,id),minute:0,knownIds:['stormkeep','hex.0.0','galahad'],completed:{},receipts:{},journal:[]};
}
function validateJourney(base,j){
 requireThat(j?.schemaVersion===1&&j.id===j.delta.id&&Number.isSafeInteger(j.minute)&&j.minute>=0&&Array.isArray(j.knownIds)&&Array.isArray(j.journal),'Invalid journey');
 return effective(base,j.delta);
}
// Dijkstra over explicit, open routes; discovery-only edges cannot be traversed.
export function findRoute(w,from,to,{knownIds=null}={}){
 const known=knownIds===null?null:new Set(knownIds);
 const allowed=n=>n&&['visitable','detailed'].includes(n.generation)&&(!known||isVisible(n,known));
 if(!allowed(w.nodes[from])||!allowed(w.nodes[to]))return null;
 const dist=new Map([[from,0]]),previous=new Map(),pending=new Set([from]),done=new Set();
 while(pending.size){
  const here=[...pending].sort((a,b)=>dist.get(a)-dist.get(b)||a.localeCompare(b))[0];pending.delete(here);
  if(here===to){const nodes=[to],routes=[];let id=to;while(id!==from){const p=previous.get(id);routes.unshift(p.route);nodes.unshift(p.from);id=p.from}return {nodes,routes,minutes:dist.get(to)}}
  done.add(here);
  for(const r of Object.values(w.routes).sort((a,b)=>a.id.localeCompare(b.id))){
   if(r.status!=='open'||known&&!isVisible(r,known))continue;
   const next=r.a===here?r.b:r.b===here?r.a:null;if(!next||done.has(next)||!allowed(w.nodes[next]))continue;
   const cost=dist.get(here)+r.minutes;if(cost<(dist.get(next)??Infinity)){dist.set(next,cost);previous.set(next,{from:here,route:r.id});pending.add(next)}
  }
 }
 return null;
}
export function evaluateCondition(j,expr){
 requireThat(expr&&typeof expr.op==='string','Invalid continuation condition');
 if(expr.op==='all'||expr.op==='any'){requireThat(Array.isArray(expr.conditions)&&expr.conditions.length>0,'Empty condition');const values=expr.conditions.map(x=>evaluateCondition(j,x));return expr.op==='all'?values.every(Boolean):values.some(Boolean)}
 const r=own(j.completed,expr.moduleId)?j.completed[expr.moduleId]:null;
 switch(expr.op){
  case 'not-completed':return !r;
  case 'ending':return r?.ending===expr.equals;
  case 'fact':return !!r?.factKinds.includes(expr.kind);
  default:throw Error('Unsupported continuation condition '+expr.op)
 }
}
export function availableModules(base,j){
 const w=validateJourney(base,j),known=new Set(j.knownIds),actor=w.entities.galahad;
 return catalog.filter(m=>evaluateCondition(j,m.condition)&&w.nodes[m.entry]&&isVisible(w.nodes[m.entry],known)).map(({condition,...m})=>{
  const route=findRoute(w,actor.locationId,m.entry,{knownIds:j.knownIds});
  return {...m,reachable:!!route,travelMinutes:route?.minutes??null,playable:false}; // no published narrative editions yet
 });
}
// Commit only from trusted compiler edition and trusted in-memory command history. Replays
// selected path; does not accept a claimed completion delta or an arbitrary client session.
export function finishModule(base,j,edition,session,{commandId,expectedRevision}={}){
 const w=validateJourney(base,j);
 requireThat(typeof commandId==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(commandId),'Invalid command id');
 requireThat(edition.campaignId===j.id&&edition.baseSnapshotId===base.id&&edition.moduleId===MODULE.id,'Edition mismatch');
 requireThat(Array.isArray(session?.state?.path)&&session.state.path.length<=MODULE.maxDecisions,'Invalid path');
 const fingerprint=hash([edition.editionId,session.state.path]);
 if(own(j.receipts,commandId)){const r=j.receipts[commandId];requireThat(r.fingerprint===fingerprint,'Command id reused');return {journey:copy(j),receipt:copy(r),duplicate:true}}
 requireThat(expectedRevision===j.delta.revision&&edition.worldRevision===j.delta.revision,'Revision conflict');
 requireThat(!own(j.completed,edition.moduleId),'Module already completed');
 requireThat(edition.privatePreparation.baseSnapshotId===base.id,'Preparation mismatch');
 requireThat(w.entities.galahad.locationId===MODULE.hub,'Actor not at start');
 // Verify exact prepared dependency overlay against current snapshot and current delta.
 const prepared=edition.privatePreparation.preparedWorld;
 requireThat(prepared.id===j.id&&prepared.baseSnapshotId===base.id&&prepared.revision>=j.delta.revision&&prepared.revision<=j.delta.revision+1,'Prepared world mismatch');
 requireThat(hash(prepared)===hash(materializePilot(base,j.delta)),'Prepared overlay conflict');
 let replay=startEdition(edition);
 for(const [i,action] of session.state.path.entries())replay=confirmChoice(edition,replay,{commandId:'finish-replay-'+i,expectedRevision:i,worldRevision:edition.worldRevision,action}).session;
 requireThat(replay.nodeId===session.nodeId&&hash(replay.state)===hash(session.state),'Session replay mismatch');
 const c=completion(edition,replay),world=effective(base,prepared);
 const arrival=findRoute(world,w.entities.galahad.locationId,MODULE.startLocation);requireThat(arrival,'Module dependencies unreachable');
 const bridge=findRoute(world,MODULE.startLocation,'pilot.bridge');requireThat(bridge,'Bridge unreachable');
 // Pilot actions after arrival take place at bridge; withdrawal returns to village.
 const crossed=replay.state.revision>1,withdrawn=c.ending==='module-withdrawn';
 const destination=crossed&&!withdrawn?'pilot.bridge':MODULE.startLocation;
 const minutes=arrival.minutes+(crossed?bridge.minutes:0)+(crossed&&withdrawn?bridge.minutes:0);
 const changes=copy(prepared.changes);
 const actor=world.entities.galahad;
 changes.entities.galahad={...actor,locationId:destination,publicState:{...actor.publicState,fatigue:c.hero.fatigue},privateState:{...actor.privateState,pilotLegacyResources:{hp:c.hero.hp,rations:c.hero.rations,fatigue:c.hero.fatigue},pilotIncapacitated:c.ending==='module-incapacitated'}};
 for(const [id,key,value] of [['pilot.mara','trust',c.privateConsequences.keeperTrust],['pilot.ivo','alert',c.privateConsequences.guardAlert],['pilot.neris','pilotHp',c.privateConsequences.rivalHp]]){
  const e=world.entities[id];changes.entities[id]={...e,privateState:{...e.privateState,[key]:value}};
 }
 const next=copy(j);next.delta=applyChanges(base,j.delta,j.delta.revision,changes);next.minute+=minutes;
 next.knownIds=[...new Set([...j.knownIds,...arrival.nodes,...arrival.routes,...(crossed?[...bridge.nodes,...bridge.routes,'pilot.ivo','pilot.neris']:[]),'pilot.mara'])].sort();
 const factKinds=[...new Set(c.facts.map(x=>x.kind))].sort(),receipt={commandId,fingerprint,moduleId:edition.moduleId,editionId:edition.editionId,ending:c.ending,revision:next.delta.revision,locationId:destination,travelMinutes:minutes,completedAtMinute:next.minute};
 next.completed[edition.moduleId]={ending:c.ending,factKinds,revision:next.delta.revision,editionId:edition.editionId};
 next.receipts[commandId]=receipt;next.journal.push({kind:'module-completed',moduleId:edition.moduleId,ending:c.ending,minute:next.minute,locationId:destination});
 return {journey:next,receipt:copy(receipt),duplicate:false};
}
// Public atlas omits undiscovered nodes/routes, NPC agendas, future edition states and seed.
export function playerJourney(base,j){
 const w=validateJourney(base,j),known=new Set(j.knownIds),actor=w.entities.galahad;
 const nodes=Object.values(w.nodes).filter(n=>isVisible(n,known)).map(n=>({id:n.id,name:n.name,kind:n.kind,generation:n.generation,...(n.parentId&&isVisible(w.nodes[n.parentId],known)?{parentId:n.parentId}:{}),...(n.kind==='hex'?{q:n.q,r:n.r,terrain:n.terrain}:{})}));
 const ids=new Set(nodes.map(n=>n.id)),routes=Object.values(w.routes).filter(r=>isVisible(r,known)&&ids.has(r.a)&&ids.has(r.b)).map(({id,a,b,status,minutes})=>({id,a,b,status,minutes}));
 return {schemaVersion:1,campaignId:j.id,revision:j.delta.revision,minute:j.minute,actorLocationId:actor.locationId,nodes,routes,opportunities:availableModules(base,j),journal:copy(j.journal),context:context(base,j.delta,{actorId:'galahad',knownIds:j.knownIds,role:'player'})};
}
