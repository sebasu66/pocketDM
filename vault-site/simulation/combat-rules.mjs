// Verified subset: Mythras core, printed pp.37-38,51,94-95.
// Deliberate open interpretations: nearest-integer difficulty, half-parry round up remaining damage,
// fumble threshold uses effective skill; these require final review. No full rules compliance claim.
import {die} from './engine.mjs';
import {SIZE} from './combat-catalog.mjs';
export const PROFILE='mythras-subset-v0.1';
export const GRADES=Object.freeze({'very-easy':2,easy:1.5,standard:1,hard:2/3,formidable:.5,herculean:.1});
const rank={fumble:0,failure:1,success:2,critical:3};
const check=(ok,msg)=>{if(!ok)throw Error(msg)};
export function effectiveSkill(base,grade='standard'){
 check(Number.isFinite(base)&&base>=0&&base<=10000&&Object.hasOwn(GRADES,grade),'Invalid skill/grade');
 return Math.round(base*GRADES[grade]);
}
export function gradeOf(roll,target){
 check(Number.isInteger(roll)&&roll>=1&&roll<=100&&Number.isInteger(target)&&target>=0,'Invalid percentile');
 if(roll===100||(roll===99&&target<=100))return 'fumble';
 if(roll>=96)return 'failure';
 if(roll<=Math.ceil(target/10))return 'critical';
 return roll<=Math.max(5,target)?'success':'failure';
}
export function contestTargets(a,b){
 check(Number.isInteger(a)&&a>=0&&Number.isInteger(b)&&b>=0,'Invalid contest');
 const penalty=Math.max(0,a-100,b-100);
 return {attacker:Math.max(0,a-penalty),defender:Math.max(0,b-penalty),penalty};
}
export function differential(a,b){
 check(Object.hasOwn(rank,a)&&Object.hasOwn(rank,b),'Invalid degrees');
 const delta=rank[a]-rank[b];
 if(Math.max(rank[a],rank[b])<2||delta===0)return {side:null,count:0};
 return {side:delta>0?'attacker':'defender',count:Math.abs(delta)};
}
export function opposed(a,b){
 check(Object.hasOwn(rank,a.outcome)&&Object.hasOwn(rank,b.outcome)&&[a.roll,b.roll].every(x=>Number.isInteger(x)&&x>=1&&x<=100),'Invalid opposed result');
 if(Math.max(rank[a.outcome],rank[b.outcome])<2)return null;
 const diff=rank[a.outcome]-rank[b.outcome]||a.roll-b.roll;
 return diff>0?'attacker':diff<0?'defender':null;
}
export function parryDamage(damage,attackSize,defendSize,outcome){
 check(Number.isInteger(damage)&&damage>=0&&SIZE.includes(attackSize)&&SIZE.includes(defendSize)&&Object.hasOwn(rank,outcome),'Invalid parry');
 if(rank[outcome]<2)return damage;
 const difference=SIZE.indexOf(attackSize)-SIZE.indexOf(defendSize);
 return difference<=0?0:difference===1?Math.ceil(damage/2):damage;
}
export const successful=outcome=>outcome==='success'||outcome==='critical';
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
