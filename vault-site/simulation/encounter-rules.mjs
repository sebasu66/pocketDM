// Explicit scene inputs, pure operations; actor snapshots are returned, never committed here.
import {validateSheet} from '../public/laboratorio/character-sheet.mjs';
import {opposed,successful} from '../public/laboratorio/percentile.mjs';
import {conditionProfile} from '../public/laboratorio/conditions.mjs';
import {isDead,advanceTrauma,woundAfterHit} from '../public/laboratorio/trauma.mjs';
const ok=(v,m)=>{if(!v)throw Error(m)};
const bool=(v,m)=>ok(typeof v==='boolean',m);
const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
const copy=s=>structuredClone(validateSheet(s));
// Inject checks to share the master API without a second implementation.
export function encounterOperations({checkSkill,checkOpposed}){
 function resolveSurprise(x){
  ok(['ambush','betrayal'].includes(x.kind),'Explicit surprise kind required');
  bool(x.unexpected,'Explicit unexpected attack required');
  const skills=x.kind==='ambush'?['perception','stealth']:['insight','deceit'];
  ok(x.observer?.skill===skills[0]&&x.initiator?.skill===skills[1],'Incorrect surprise skill pair');
  if(!x.unexpected)return {status:'automatic',surprisedIds:[],checks:[]};
  const r=checkOpposed({id:x.id,actor:x.observer,opponent:x.initiator});
  // The observer must win to negate surprise. Both fail/tie is not an invented success.
  return {...r,surprisedIds:r.status==='resolved'?(r.winner==='actor'?[]:[x.observer.character.id]):null,initiativePenalty:-10,firstRoundNoOffense:true,firstAttackBonus:1};
 }
 function resolveFear(x){
  ok(['intimidate','terrifying','morale'].includes(x.kind),'Explicit fear kind required');
  bool(x.immune,'Explicit immunity required');
  ok(x.actor?.skill==='willpower','Fear requires willpower');
  const actor=copy(x.actor.character);
  if(x.immune)return {status:'automatic',effect:'immune',actor,checks:[]};
  // Generic morale is an authored decision gate, not a universal Mythras trigger.
  const r=checkSkill({...x.actor,id:x.id});
  if(!r.outcome)return {...r,actor,effect:null};
  let effect='stand';
  if(x.kind==='terrifying')effect={critical:'immune',success:'shaken',failure:'flee',fumble:'unconscious'}[r.outcome];
  else if(x.kind==='intimidate')effect={critical:'immune',success:'stand',failure:'back-away',fumble:'flee'}[r.outcome];
  else effect=successful(r.outcome)?'stand':'withdraw-request';
  if(effect==='shaken'||effect==='flee')actor.state.fear=effect;
  if(effect==='unconscious')actor.state.unconscious=true;
  return {...r,actor,effect,immuneForEncounter:effect==='immune',offensiveBlockedRounds:effect==='shaken'||effect==='back-away'?1:0};
 }
 function resolveWithdrawal(x){
  bool(x.engaged,'Explicit engagement state required');bool(x.held,'Explicit grip state required');bool(x.exitAvailable,'Explicit exit availability required');bool(x.withdrawEffect,'Explicit special effect entitlement required');bool(x.pursued,'Explicit pursuit decision required');
  ok(int(x.actionPoints,0,100),'Current AP required');
  ok(x.fugitive?.character,'Missing fugitive');
  const s=x.fugitive.character;validateSheet(s);
  if(isDead(s)||!conditionProfile(s,'evade','move').legal||conditionProfile(s,'evade','move').move===0||s.state.prone||x.held||!x.exitAvailable)return {status:'blocked',escaped:false,checks:[],reason:'Cannot leave; resolve grip, posture, mobility or exit'};
  if(x.actionPoints<1&&!(x.engaged&&x.withdrawEffect))return {status:'blocked',escaped:false,checks:[],reason:'No AP to withdraw or flee'};
  if(x.engaged&&!x.withdrawEffect){
   ok(x.disengage&&x.disengage.actor.character.id===s.id,'Disengagement contest required');
   const r=checkOpposed({...x.disengage,actor:{...x.disengage.actor,character:s},id:x.id+'.disengage'});
   return {...r,stage:'disengage',disengaged:r.winner==='actor',escaped:false,apCost:1};
  }
  if(x.engaged&&x.withdrawEffect)return {status:'automatic',stage:'disengage',disengaged:true,escaped:false,apCost:0,checks:[]};
  if(!x.pursued)return {status:'automatic',stage:'escape',escaped:true,apCost:1,checks:[]};
  ok(x.pursuit&&x.pursuit.actor.character.id===s.id,'Pursuit contest required');
  const r=checkOpposed({...x.pursuit,actor:{...x.pursuit.actor,character:s},id:x.id+'.pursuit'});
  return {...r,stage:'pursuit',escaped:r.winner==='actor',caught:r.winner==='opponent',apCost:1};
 }
 function resolveWound(x){
  const s=copy(x.character),l=s.locations.find(l=>l.id===x.locationId);ok(l&&int(x.netDamage,1,1000),'Location and positive net damage required');
  bool(x.limbLifeThreat,'Explicit limb trauma type required');bool(x.bleeding,'Explicit bleeding effect required');
  ok(int(x.roundSeconds,1,60),'Explicit round duration required');
  ok(!isDead(s),'Dead character cannot take another resolved wound');
  const after=l.hp-x.netDamage;let checks=[],resisted=null;
  if(after<=0){
   ok(x.resistance?.character?.id===s.id&&x.resistance.skill==='endurance','Endurance input required');
   ok(x.attackCheck&&successful(x.attackCheck.outcome)&&int(x.attackCheck.roll,1,100),'Original successful attack required');
   // Evaluate the victim snapshot supplied here, never a second or stale character.
   const r=checkSkill({id:x.id+'.resist',...x.resistance,character:s});
   ok(r.status==='resolved','Wound resistance must resolve');
   checks=r.checks;resisted=opposed(x.attackCheck,checks[0])==='defender';
  }
  l.hp=after;
  const wound=woundAfterHit(s,{id:x.id,locationId:l.id,net:x.netDamage,resisted,stunTurns:x.stunTurns,limbLifeThreat:x.limbLifeThreat,roundSeconds:x.roundSeconds,bleeding:x.bleeding});
  return {status:'resolved',actor:s,wound,checks};
 }
 function advanceWounds(x){const s=copy(x.character);advanceTrauma(s,x.seconds);return {actor:s,dead:isDead(s)}}
 function resolveFirstAid(x){
  const patient=copy(x.patient);bool(x.accessible,'Explicit physical access required');bool(x.suppliesAvailable,'Explicit supplies availability required');
  ok(x.healer?.skill==='firstAid','First Aid skill required');ok(int(x.durationRoll,1,3),'D3 treatment duration required');
  const wound=patient.state.wounds?.find(w=>w.id===x.woundId);
  ok(wound,'Unknown injury');if(isDead(patient)||wound.treated||!x.accessible||!x.suppliesAvailable)return {status:'blocked',patient,checks:[],durationSeconds:0,reason:'Dead patient, previously treated wound or unavailable treatment'};
  const r=checkSkill({...x.healer,character:x.healer.character.id===patient.id?patient:x.healer.character,id:x.id});if(!r.outcome)return {...r,patient,durationSeconds:0};
  const seconds=x.durationRoll*60;
  // Pause the selected life-threatening wound while being treated; other wounds still progress.
  advanceTrauma(patient,seconds,{pausedWoundId:wound.id});wound.treated=true;
  if(successful(r.outcome)&&!isDead(patient)){
   const l=patient.locations.find(l=>l.id===wound.locationId);wound.stabilized=true;
   if(wound.bleeding){wound.bleeding=false;patient.state.bleeding=patient.state.wounds.some(w=>w.bleeding)}
   if(wound.severity==='minor'){ok(int(x.healRoll,1,3),'D3 healing required for minor injury');l.hp=Math.min(l.maxHp,l.hp+Math.min(x.healRoll,wound.netDamage??x.healRoll))}
   else if(wound.severity==='serious'&&l.hp>-l.maxHp){l.disabled=false;wound.partialFunction=true;}
   // No HP restoration or return to combat for major injury.
  }
  return {...r,patient,wound,durationSeconds:seconds,dead:isDead(patient)};
 }
 return {resolveSurprise,resolveFear,resolveWithdrawal,resolveWound,advanceWounds,resolveFirstAid};
}
