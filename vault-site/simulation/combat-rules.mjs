// Verified subset: Mythras core, printed pp.37-38,51,94-95.
// Deliberate open interpretations: nearest-integer difficulty, half-parry round up remaining damage,
// fumble threshold uses effective skill; these require final review. No full rules compliance claim.
import {die} from './engine.mjs';
export const PROFILE='mythras-subset-v0.1';
import {effectiveSkill,gradeOf,contestTargets,differential,successful} from '../public/laboratorio/percentile.mjs';
export {GRADES,effectiveSkill,gradeOf,contestTargets,differential,opposed,parryDamage,successful} from '../public/laboratorio/percentile.mjs';
const check=(ok,msg)=>{if(!ok)throw Error(msg)};
export function rollCheck({seed,address,actor,grade='standard',target,reason='Resolución de prueba',role}){
 const base=actor.skill,adjusted=target??effectiveSkill(base,grade),roll=die(seed,[PROFILE,address,role,actor.id],100);
 const labels={'very-easy':'Muy fácil',easy:'Fácil',standard:'Estándar',hard:'Difícil',formidable:'Formidable',herculean:'Hercúlea'};
 return {schemaVersion:1,id:address+'.'+role+'.'+actor.id,actorId:actor.id,actorName:actor.name,skillId:actor.styleId,skillName:'Estilo de combate',base,target:adjusted,difficulty:labels[grade],reason,dice:'D100',roll,outcome:gradeOf(roll,adjusted),source:PROFILE,visibility:'player'};
}
// First stage: entitlement only. No damage until policy has selected legal special effects.
export function prepareExchange({seed,address,attacker,defender,attackGrade='standard',defenseGrade='standard',defend=true}){
 check(typeof seed==='string'&&seed.length>0&&typeof address==='string'&&address.length>0,'Invalid encounter identity');
 check(attacker.id!==defender.id&&attacker.actionPoints>=1&&(!defend||defender.actionPoints>=1),'Invalid action budget');
 const a=effectiveSkill(attacker.skill,attackGrade),b=effectiveSkill(defender.skill,defenseGrade);
 const targets=defend?contestTargets(a,b):{attacker:a,defender:null,penalty:0};
 const attack=rollCheck({seed,address,actor:attacker,grade:attackGrade,target:targets.attacker,role:'attack'});
 const defense=defend?rollCheck({seed,address,actor:defender,grade:defenseGrade,target:targets.defender,role:'parry'}):null;
 return {profile:PROFILE,address,attackerId:attacker.id,defenderId:defender.id,checks:defense?[attack,defense]:[attack],oppositionPenalty:targets.penalty,attackSucceeded:successful(attack.outcome),defenseSucceeded:!!defense&&successful(defense.outcome),entitlement:differential(attack.outcome,defense?.outcome??'failure'),actionCosts:{attacker:1,defender:defend?1:0}};
}
