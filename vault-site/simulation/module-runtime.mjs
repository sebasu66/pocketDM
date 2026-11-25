// QA-02/07 capability pilot. Server-authored test definitions only, never import narrative drafts as rules.
import {conditionProfile} from '../public/laboratorio/conditions.mjs';
import {successful} from '../public/laboratorio/percentile.mjs';
import {validateSkillSpec,skillProfile,resolveSkillCheck} from './skill-check.mjs';
const ok=(v,m)=>{if(!v)throw Error(m)},own=Object.hasOwn,copy=structuredClone;
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.-]{0,100}$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
const kinds=['module-accept','module-decline','module-withdraw','module-close','dialogue','inspect','negotiate','skill-check','transfer-cargo','report','offer-resource'];
const live=['offered','active'];
const outcomes=['critical','success','failure','fumble'];
const opportunity=i=>i.opportunityId??i.challengeId;
const dependencies=i=>[...i.requires,...(i.requiresSuccess??[]),...(i.requiresFailure??[]),...(i.requiresOutcomes??[]).map(r=>r.intentId)];
const visible=(r,known)=>r&&(r.visibility==='public'||r.visibility==='known'&&known.includes(r.id));
const person=(r)=>r&&['player','npc','creature'].includes(r.kind);
const coLocated=(w,actor,target)=>person(w.entities[target])&&w.entities[target].locationId===w.entities[actor].locationId;
const qty=n=>Number.isSafeInteger(n)&&n>0&&n<=100000;
const conditions=['standard','hard','formidable','herculean'];
const labels={standard:'Estándar',hard:'Difícil',formidable:'Formidable',herculean:'Hercúlea'};
function cargo(w,r){
 const e=w.entities[r],c=e?.privateState?.cargo;
 ok(e?.kind==='item'&&c&&id(c.ownerId)&&person(w.entities[c.ownerId])&&qty(c.total)&&c.allocations&&Object.keys(c.allocations).every(k=>person(w.entities[k])&&qty(c.allocations[k]))&&Object.values(c.allocations).reduce((a,b)=>a+b,0)===c.total,'Invalid cargo ledger');
 return c;
}
export function createModule(def,w,actorId){
 ok(def?.schemaVersion===1&&def.mode==='mechanical-fixture'&&id(def.id)&&typeof def.version==='string'&&def.version.length>0&&def.version.length<=40,'Only mechanical fixture modules supported');
 ok(Array.isArray(def.intents)&&def.intents.length>0&&def.intents.length<=80&&Array.isArray(def.evidence)&&def.evidence.length<=80,'Invalid definition');
 const evidence={},intents={};
 for(const e of def.evidence){
  ok(id(e.id)&&!own(evidence,e.id)&&typeof e.description==='string'&&e.description.length>0&&e.description.length<=500,'Invalid evidence');evidence[e.id]={id:e.id,description:e.description};
 }
 for(const i of def.intents){
  ok(id(i.id)&&!own(intents,i.id)&&kinds.includes(i.capability)&&w.nodes[i.locationId]&&Array.isArray(i.requires)&&i.requires.every(id)&&Array.isArray(i.knownEvidence)&&i.knownEvidence.every(k=>own(evidence,k)),'Invalid intent');
  ok(Number.isInteger(i.seconds)&&i.seconds>=0&&i.seconds<=86400,'Invalid duration');
  const allowedStatus=['module-accept','module-decline'].includes(i.capability)?['offered']:i.capability==='dialogue'?['offered','active']:['active'];ok(allowedStatus.includes(i.status),'Invalid intent status');
  ok(i.authoringIntentId===undefined||id(i.authoringIntentId),'Invalid authoring intent reference');
  ok(i.requiresSuccess===undefined||Array.isArray(i.requiresSuccess)&&i.requiresSuccess.every(id),'Invalid success prerequisite');
  ok(i.requiresFailure===undefined||Array.isArray(i.requiresFailure)&&i.requiresFailure.every(id),'Invalid failure prerequisite');
  if(['dialogue','negotiate','report','offer-resource','transfer-cargo'].includes(i.capability))ok(person(w.entities[i.targetId])&&i.targetId!==actorId,'Invalid target');
  if(i.capability==='dialogue'||i.capability==='inspect'||i.capability==='report')ok(own(evidence,i.evidenceId),'Unknown evidence');
  if(i.capability==='report')ok(i.knownEvidence.includes(i.evidenceId),'Report requires observed evidence');
  if(['inspect','negotiate'].includes(i.capability))ok(conditions.includes(i.difficulty),'Invalid check difficulty');
  ok(i.requiresOutcomes===undefined||Array.isArray(i.requiresOutcomes)&&i.requiresOutcomes.every(r=>r&&id(r.intentId)&&Array.isArray(r.outcomes)&&r.outcomes.length>0&&r.outcomes.every(o=>outcomes.includes(o))),'Invalid exact outcome prerequisite');
  if(i.capability==='skill-check'){validateSkillSpec(i.check);ok(id(i.challengeId),'Missing challenge ID');ok(i.opportunityId===undefined||id(i.opportunityId),'Invalid opportunity ID');}
  if(i.capability==='transfer-cargo'){
   const c=cargo(w,i.cargoId);ok(i.ownerId===c.ownerId&&person(w.entities[i.fromId])&&person(w.entities[i.toId])&&i.fromId!==i.toId&&i.targetId===(i.fromId===actorId?i.toId:i.fromId)&&[i.fromId,i.toId].includes(actorId)&&qty(i.quantity)&&i.quantity<=c.total&&i.authorization==='fixture-explicit-consent','Invalid transfer authorization');
  }
  if(i.capability==='offer-resource')ok(id(i.itemId)&&qty(i.quantity),'Invalid offer');
  if(i.capability==='module-close'){
   ok(i.requires.length>0,'Closure requires a confirmed dependency');
   ok(i.endingId===undefined||id(i.endingId),'Invalid ending ID');
   ok(i.cargoRequirements===undefined||Array.isArray(i.cargoRequirements)&&i.cargoRequirements.every(r=>person(w.entities[r.custodianId])&&qty(r.quantity)&&r.quantity<=cargo(w,r.cargoId).total),'Invalid ending cargo requirement');
  }
  intents[i.id]=copy(i);
 }
 for(const i of Object.values(intents)){ok(dependencies(i).every(k=>own(intents,k)&&k!==i.id),'Unknown prerequisite');ok([...(i.requiresSuccess??[]),...(i.requiresFailure??[]),...(i.requiresOutcomes??[]).map(r=>r.intentId)].every(k=>['inspect','negotiate','skill-check'].includes(intents[k].capability)),'Success prerequisite is not a check')}
 // Reject dependency cycles, not just direct self-reference.
 const done=new Set(),visiting=new Set();
 function visit(k){if(done.has(k))return;ok(!visiting.has(k),'Intent dependency cycle');visiting.add(k);for(const r of dependencies(intents[k]))visit(r);visiting.delete(k);done.add(k)}
 Object.keys(intents).forEach(visit);
 ok(Object.values(intents).some(i=>i.capability==='module-accept')&&Object.values(intents).some(i=>i.capability==='module-close'),'Missing contract lifecycle');
 return {id:def.id,version:def.version,mode:def.mode,status:'offered',intents,evidence,completed:[],observed:[],results:{}};
}
export function moduleActions(w,state,sheet){
 const m=state.module;if(!m||!live.includes(m.status))return [];
 const a=state.actorId,location=w.entities[a].locationId;
 return Object.values(m.intents).filter(i=>{
  if(i.status!==m.status||i.locationId!==location||m.completed.includes(i.id)||!i.requires.every(k=>m.completed.includes(k))||!(i.requiresSuccess??[]).every(k=>successful(m.results?.[k]?.outcome))||!(i.requiresFailure??[]).every(k=>['failure','fumble'].includes(m.results?.[k]?.outcome))||!(i.requiresOutcomes??[]).every(r=>r.outcomes.includes(m.results?.[r.intentId]?.outcome))||!i.knownEvidence.every(k=>m.observed.includes(k)))return false;
  if(i.targetId&&(!coLocated(w,a,i.targetId)||!visible(w.entities[i.targetId],state.knownIds)))return false;
  if(i.capability==='module-close'&&!(i.cargoRequirements??[]).every(r=>(cargo(w,r.cargoId).allocations[r.custodianId]??0)>=r.quantity))return false;
  if(i.capability==='transfer-cargo'){
   const c=cargo(w,i.cargoId);return c.ownerId===i.ownerId&&coLocated(w,a,i.fromId)&&coLocated(w,a,i.toId)&&(c.allocations[i.fromId]??0)>=i.quantity;
  }
  if(i.capability==='offer-resource')return sheet.inventory.some(x=>x.id===i.itemId&&x.kind==='gear'&&x.carried&&x.quantity>=i.quantity);
  if(i.capability==='skill-check')return skillProfile(sheet,i.check).legal&&!Object.values(m.intents).some(other=>other.capability==='skill-check'&&other.challengeId===i.challengeId&&opportunity(other)===opportunity(i)&&m.completed.includes(other.id));
  if(['inspect','negotiate'].includes(i.capability))return conditionProfile(sheet,i.capability==='inspect'?'perception':'influence','skill').legal;
  return true;
 }).map(i=>({action:'module-intent',intentId:i.id}));
}
export function resolveModule(w,state,next,sheet,intentId,{eventId,roll,fact,checks,entities,participants,observations}){
 ok(moduleActions(w,state,sheet).some(a=>a.intentId===intentId),'Illegal module intent');
 const m=next.module,i=m.intents[intentId],a=state.actorId;
 if(i.targetId&&!participants.includes(i.targetId))participants.push(i.targetId);
 const observed=()=>{if(!m.observed.includes(i.evidenceId))m.observed.push(i.evidenceId);fact('evidence-observed',m.evidence[i.evidenceId].description,{evidenceId:i.evidenceId})};
 const record=(kind,description,data={})=>fact(kind,description,{moduleId:m.id,intentId,...data});
 switch(i.capability){
 case 'module-accept':m.status='active';record('module-accepted','Contrato aceptado.');break;
 case 'module-decline':m.status='declined';record('module-declined','Contrato rechazado.');break;
 case 'module-withdraw':m.status='withdrawn';record('module-withdrawn','Retirada confirmada.');break;
 case 'module-close':m.status='closed';m.endingId=i.endingId??'closed';record('module-closed','Cierre de módulo confirmado.',{endingId:m.endingId});break;
 case 'dialogue':record('dialogue-observed','Información autorizada comunicada.',{targetId:i.targetId});observed();break;
 case 'skill-check':
 case 'inspect':
 case 'negotiate':{
  const spec=i.capability==='skill-check'?i.check:{skillId:i.capability==='inspect'?'perception':'influence',difficulty:i.difficulty,reason:'Dificultad autorizada de la escena.'};
  const check=resolveSkillCheck(sheet,spec,{eventId,slot:'module.'+i.id,roll});
  checks.push(check);m.results??={};m.results[i.id]={outcome:check.outcome};
  record(i.capability==='inspect'?'inspection-resolved':i.capability==='negotiate'?'negotiation-check':'skill-check-resolved','Chequeo resuelto.',{outcome:check.outcome,checkId:check.id,...(i.challengeId?{challengeId:i.challengeId,opportunityId:opportunity(i)}:{})});
  if(i.capability==='inspect'&&successful(check.outcome))observed();
  break;
 }
 case 'report':{
 const factId=record('evidence-reported','Informe de evidencia observada.',{evidenceId:i.evidenceId,targetId:i.targetId,reportedDescription:m.evidence[i.evidenceId].description});
 observations.push({entityId:i.targetId,source:'delivered',fromId:a,factIds:[factId]});break;
 }
 case 'offer-resource':record('resource-offered','Oferta presentada; aceptación y transferencia no confirmadas.',{targetId:i.targetId,itemId:i.itemId,quantity:i.quantity});break;
 case 'transfer-cargo':{
  const e=w.entities[i.cargoId],c=copy(cargo(w,i.cargoId));
  c.allocations[i.fromId]-=i.quantity;if(c.allocations[i.fromId]===0)delete c.allocations[i.fromId];
  c.allocations[i.toId]=(c.allocations[i.toId]??0)+i.quantity;
  ok(Object.values(c.allocations).reduce((x,y)=>x+y,0)===c.total,'Cargo conservation failed');
  entities[e.id]={...e,privateState:{...e.privateState,cargo:c}};
  const factId=record('cargo-transferred','Custodia de cargamento transferida por autorización explícita.',{cargoId:e.id,fromId:i.fromId,toId:i.toId,quantity:i.quantity});
 observations.push({entityId:i.targetId,source:'participant',factIds:[factId]});break;
 }
 }
 m.completed.push(i.id);return i.seconds;
}
export function moduleView(m){if(!m)return null;return {id:m.id,version:m.version,mode:m.mode,status:m.status,...(m.endingId?{endingId:m.endingId}:{}),evidence:m.observed.map(k=>copy(m.evidence[k]))}}
