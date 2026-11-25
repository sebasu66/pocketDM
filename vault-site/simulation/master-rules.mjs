// Master/narrator API v1. Pure operations on snapshots; no narrative, history or writes.
// All supplied rolls and seeds originate in private branch preparation, never the player UI.
import {skillProfile,checkFromProfile,DIFFICULTIES,SKILL_METADATA} from './skill-check.mjs';
import {contestTargets,opposed,differential,gradeOf,effectiveSkill,successful} from '../public/laboratorio/percentile.mjs';
import {validateSheet} from '../public/laboratorio/character-sheet.mjs';
import {validateCheck} from '../public/libro/check-contract.mjs';
import {exchange,simulateDuel} from '../public/laboratorio/duel.mjs';
import {die} from './engine.mjs';
import {encounterOperations} from './encounter-rules.mjs';
const ok=(v,m)=>{if(!v)throw Error(m)};
const own=Object.hasOwn;
const version='master-rules-v1';
const combatGrade=x=>ok(['very-easy','easy','standard','hard','formidable','herculean'].includes(x),'Explicit combat difficulty required');
const bool=(x,name)=>ok(typeof x==='boolean','Explicit '+name+' required');
const spec=x=>({skillId:x.skill,difficulty:x.difficulty,reason:x.reason,modifiers:x.modifiers,requirements:x.requirements,augmentation:x.augmentation});
function profile(x){ok(x&&x.character,'Missing actor snapshot');return skillProfile(x.character,spec(x))}
function single(x,id,p=profile(x),target=p.target){
 if(!p.legal)return {status:'blocked',reasons:p.blocked,warnings:p.warnings,checks:[]};
 if(p.grade==='automatic')return {status:'automatic',outcome:'success',checks:[],warnings:p.warnings};
 const c=checkFromProfile(x.character,spec(x),p,{id,roll:x.roll,target});
 return {status:'resolved',outcome:c.outcome,checks:[c]};
}
const checkId=id=>{ok(typeof id==='string'&&/^[a-zA-Z0-9_.-]{1,180}$/.test(id),'Explicit check ID required');return id};
export function checkSkill(x){return single(x,checkId(x.id))}
export function checkProfile(x){
 const p=profile(x);return {base:p.base,baseDifficulty:p.baseDifficulty,difficulty:p.grade,target:p.target,legal:p.legal,blocked:p.blocked,modifiers:[...p.mods.filter(m=>m.grade!=='standard'),...p.modifiers,...(p.augmentationDetail?[p.augmentationDetail]:[])],augmentation:p.augmentation,unaugmentedTarget:p.unaugmentedTarget,warnings:p.warnings};
}
function contest(x,mode){
 const id=checkId(x.id),a=profile(x.actor),b=profile(x.opponent);
 if(!a.legal||!b.legal)return {status:'blocked',actorBlocked:a.blocked,opponentBlocked:b.blocked,checks:[]};
 ok(a.target!==null&&b.target!==null,'Contested check requires rolled difficulties');
 ok(x.actor.character.id!==x.opponent.character.id,'Distinct participants required');
 const t=contestTargets(a.target,b.target),left=single(x.actor,id+'.actor',a,t.attacker).checks[0],right=single(x.opponent,id+'.opponent',b,t.defender).checks[0];
 const checks=[left,right];
 if(mode==='differential')return {status:'resolved',checks,oppositionPenalty:t.penalty,advantage:differential(left.outcome,right.outcome)};
 const winner=opposed(left,right);
 return {status:'resolved',checks,oppositionPenalty:t.penalty,winner:winner==='attacker'?'actor':winner==='defender'?'opponent':null,unresolved:winner===null};
}
export const checkOpposed=x=>contest(x,'opposed');
export const checkDifferential=x=>contest(x,'differential');
// Potency opposition for poisons, disease, etc. Caller chooses applicable resistance skill.
export function checkResistance(x){
 const id=checkId(x.id),p=profile(x.actor);
 if(!p.legal)return {status:'blocked',reasons:p.blocked,checks:[]};
 ok(p.target!==null,'Resistance requires a rolled difficulty');
 ok(Number.isInteger(x.potency)&&x.potency>=0&&x.potency<=300&&typeof x.sourceName==='string'&&x.sourceName.trim(),'Invalid hazard potency');
 const t=contestTargets(p.target,x.potency);
 const a=single(x.actor,id+'.resistance',p,t.attacker).checks[0];
 const b=validateCheck({schemaVersion:1,id:id+'.potency',actorId:'hazard:'+id,actorName:x.sourceName,skillId:'potency',skillName:'Potencia',base:x.potency,target:t.defender,difficulty:'Estándar',reason:'Potencia indicada por el máster',dice:'D100',roll:x.potencyRoll,outcome:gradeOf(x.potencyRoll,t.defender),visibility:'player',source:version});
 const winner=opposed(a,b);
 return {status:'resolved',checks:[a,b],oppositionPenalty:t.penalty,winner:winner==='attacker'?'resistance':winner==='defender'?'hazard':null,unresolved:winner===null};
}
// Mythras p.40: STR + trained Brawn determines ordinary and brief maximum lifting mass.
export function checkLift(x){
 const id=checkId(x.id),input={...x,skill:'brawn',requirements:{...x.requirements,functionalHands:x.requirements?.functionalHands??2}},p=profile(input);
 ok(Number.isFinite(x.weightSIZ)&&x.weightSIZ>0,'Positive weight SIZ required');
 ok(['lift','drag'].includes(x.mode),'Explicit lifting mode required');
 const str=x.character.attributes.STR,bonus=Math.floor(p.base/10),ordinary=(str+bonus)*(x.mode==='drag'?2:1);
 // Manual provides a brief maximum lift; exceptional dragging beyond ordinary
 // capacity is intentionally left to the master's difficulty rather than invented.
 const max=x.mode==='lift'?2*str+bonus:null;
 const capacity={ordinarySIZ:ordinary,maximumSIZ:max,weightSIZ:x.weightSIZ};
 if(!p.legal||max!==null&&x.weightSIZ>max)return {status:'blocked',capacity,reasons:[...p.blocked,...(max!==null&&x.weightSIZ>max?['Supera la capacidad máxima de levantamiento']:[])],checks:[]};
 if(x.weightSIZ<=ordinary)return {status:'automatic',outcome:'success',capacity,checks:[]};
 ok(p.grade!=='automatic','Exceptional lifting requires a rolled difficulty');
 const r=single(input,id,p);
 return {...r,capacity,followUp:r.outcome==='fumble'?'injury':r.outcome==='failure'?'endurance-to-avoid-injury':null};
}
export function checkGroup(x){
 const id=checkId(x.id);ok(Array.isArray(x.members)&&x.members.length>0&&x.members.length<=30,'Invalid group');
 ok(['team','reverse-team','sorting'].includes(x.mode),'Invalid group mode');
 const profiles=x.members.map(m=>profile(m));
 ok(profiles.every(p=>p.legal&&p.target!==null),'All group members must have a legal rolled check');
 if(x.mode==='sorting'){
  const checks=x.members.map((m,i)=>single({...m,roll:x.roll},id+'.'+i,profiles[i]).checks[0]);
  return {status:'resolved',checks,results:checks.map(c=>({actorId:c.actorId,outcome:c.outcome}))};
 }
 const target=x.mode==='team'?Math.max(...profiles.map(p=>p.target)):Math.min(...profiles.map(p=>p.target));
 const index=profiles.findIndex(p=>p.target===target),r=single({...x.members[index],roll:x.roll},id,profiles[index]);
 return {...r,representative:x.members[index].character.id,results:x.members.map(m=>({actorId:m.character.id,outcome:r.outcome}))};
}
function roller(x){
 ok(typeof x.seed==='string'&&x.seed.length>0,'Private seed required');
 const address=checkId(x.id);
 return (sides,purpose,ordinal=0)=>{ok(typeof purpose==='string'&&purpose.length>0,'Unaddressed combat draw');return die(x.seed,[version,address,purpose,ordinal],sides)};
}
export function resolveCombatExchange(x){
 validateSheet(x.attacker);validateSheet(x.defender);ok(x.attacker.id!==x.defender.id,'Distinct combatants required');
 ok(['auto','parry','evade','none'].includes(x.defense),'Explicit defense required');
 combatGrade(x.attackDifficulty);combatGrade(x.defenseDifficulty);bool(x.defenseAvailable,'defenseAvailable');bool(x.surpriseBonus,'surpriseBonus');bool(x.limbLifeThreat,'limbLifeThreat');ok(own(x,'context'),'Explicit range/grip context required (null allowed)');
 return exchange(x.attacker,x.defender,{id:checkId(x.id),roll:roller(x),defense:x.defense,defenseAvailable:x.defenseAvailable??true,context:x.context??null,surpriseBonus:x.surpriseBonus??false,limbLifeThreat:x.limbLifeThreat,attackDifficulty:x.attackDifficulty,defenseDifficulty:x.defenseDifficulty});
}
export function resolveCombatEncounter(x){
 validateSheet(x.attacker);validateSheet(x.defender);ok(x.attacker.id!==x.defender.id,'Distinct combatants required');
 ok(Number.isInteger(x.maxRounds)&&x.maxRounds>=1&&x.maxRounds<=100,'Explicit round limit required');
 ok(['long','short'].includes(x.initialRange),'Explicit initial range required');ok(Array.isArray(x.surprisedIds)&&x.surprisedIds.every(id=>[x.attacker.id,x.defender.id].includes(id)),'Explicit surprised actor IDs required');bool(x.limbLifeThreat,'limbLifeThreat');
 for(const actor of [x.attacker,x.defender]){combatGrade(x.combatDifficulties?.[actor.id]?.attack);combatGrade(x.combatDifficulties?.[actor.id]?.defense)}
 const {seed,...result}=simulateDuel(x.attacker,x.defender,{seed:'private-provider',roll:roller(x),maxRounds:x.maxRounds,tactical:true,initialRange:x.initialRange??'long',surprisedIds:x.surprisedIds??[],limbLifeThreat:x.limbLifeThreat??false,eventPrefix:x.id+'.',combatDifficulties:x.combatDifficulties});
 return result;
}
// JSON-callable surface for the narrator's trusted preparation process.
export const {resolveSurprise,resolveFear,resolveWithdrawal,resolveWound,advanceWounds,resolveFirstAid}=encounterOperations({checkSkill,checkOpposed});
export const operations=Object.freeze({resolveSurprise,resolveFear,resolveWithdrawal,resolveWound,advanceWounds,resolveFirstAid,checkProfile,checkSkill,checkOpposed,checkDifferential,checkResistance,checkLift,checkGroup,resolveCombatExchange,resolveCombatEncounter});
export function callMasterRules(operation,params){
 ok(typeof operation==='string'&&own(operations,operation),'Unknown master rules operation');
 return {apiVersion:version,operation,result:operations[operation](params)};
}
