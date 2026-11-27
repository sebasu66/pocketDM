import test from 'node:test';
import assert from 'node:assert/strict';
import {galahadSheet,wolfSheet} from '../public/laboratorio/character-sheet.mjs';
import {callMasterRules,checkSkill,resolveSurprise,resolveFear,resolveWound,advanceWounds,resolveFirstAid,resolveWithdrawal,resolveCombatEncounter,resolveCombatExchange} from './master-rules.mjs';
const input=(character,skill,roll,difficulty='standard')=>({character,skill,roll,difficulty,reason:'Prueba de contexto'});
const a=galahadSheet,b=wolfSheet;
const attack={id:'hit',outcome:'success',roll:40};
test('surprise requires explicit context and changes initiative and first round',()=>{
 const observer=input(a(),'perception',90),initiator=input(b(),'stealth',15);
 const r=resolveSurprise({id:'ambush',kind:'ambush',unexpected:true,observer,initiator});
 assert.deepEqual(r.surprisedIds,['galahad']);assert.equal(r.checks.length,2);
 assert.deepEqual(resolveSurprise({id:'seen',kind:'ambush',unexpected:true,observer:{...observer,roll:50},initiator}).surprisedIds,[]);
 assert.throws(()=>resolveSurprise({id:'x',kind:'ambush',observer,initiator}),/Explicit/);
 const params={id:'duel',seed:'test',attacker:a(),defender:b(),maxRounds:1,initialRange:'short',limbLifeThreat:false,combatDifficulties:{galahad:{attack:'standard',defense:'standard'},'wolf-1':{attack:'standard',defense:'standard'}}};
 const normal=resolveCombatEncounter({...params,surprisedIds:[]}),surprised=resolveCombatEncounter({...params,surprisedIds:r.surprisedIds});
 assert.deepEqual(surprised.initiativeDice,normal.initiativeDice);assert.equal(surprised.initiative[0],normal.initiative[0]-10);
 assert.ok(!surprised.events.some(e=>e.kind==='exchange'&&e.actor==='Galahad'));
 assert.throws(()=>resolveCombatEncounter(params),/Explicit surprised/);
});
test('fear and intimidation have distinct consequences, generic morale does not assert escape',()=>{
 for(const [roll,effect] of [[1,'immune'],[20,'shaken'],[60,'flee'],[99,'unconscious']]){
  const r=resolveFear({id:'fear',kind:'terrifying',immune:false,actor:input(a(),'willpower',roll)});
  assert.equal(r.effect,effect);
  if(effect==='unconscious')assert.equal(r.actor.state.unconscious,true);
 }
 assert.equal(resolveFear({id:'intimidate',kind:'intimidate',immune:false,actor:input(a(),'willpower',60)}).effect,'back-away');
 assert.equal(resolveFear({id:'morale',kind:'morale',immune:false,actor:input(a(),'willpower',60)}).effect,'withdraw-request');
});
test('major vital wound can kill instantly or require immediate stabilization; elapsed time is explicit',()=>{
 const s=a();s.skills.endurance=80;
 const params={id:'wound',character:s,locationId:'head',netDamage:10,attackCheck:attack,resistance:input(s,'endurance',60),limbLifeThreat:false,bleeding:false,roundSeconds:5};
 const r=resolveWound(params);assert.equal(r.actor.state.incapacitated,true);assert.equal(r.wound.severity,'major');assert.equal(r.wound.remainingSeconds,20);assert.ok(!r.actor.state.dead);
 assert.equal(advanceWounds({character:r.actor,seconds:19}).dead,false);
 assert.equal(advanceWounds({character:r.actor,seconds:20}).dead,true);
 const failed=resolveWound({...params,resistance:input(s,'endurance',95)});assert.equal(failed.actor.state.dead,true);
 const healer=a();healer.id='healer';healer.skills.firstAid=80;
 const aid={id:'aid',patient:r.actor,woundId:'wound',healer:input(healer,'firstAid',40),accessible:true,suppliesAvailable:true,durationRoll:2};
 const treated=resolveFirstAid(aid);assert.equal(treated.patient.locations.find(l=>l.id==='head').hp,-5);assert.equal(treated.wound.stabilized,true);
 assert.equal(advanceWounds({character:treated.patient,seconds:1000}).dead,false);
 assert.equal(resolveFirstAid({...aid,patient:treated.patient}).status,'blocked');
 assert.equal(s.locations.find(l=>l.id==='head').hp,5);
});
test('serious limb wound and major limb bleeding; one first aid per injury',()=>{
 const s=a(),params={id:'limb',character:s,locationId:'right-arm',netDamage:4,attackCheck:attack,resistance:input(s,'endurance',95),stunTurns:2,limbLifeThreat:false,bleeding:false,roundSeconds:5};
 const r=resolveWound(params);assert.equal(r.actor.locations.find(l=>l.id==='right-arm').disabled,true);assert.equal(r.actor.state.stunTurns,2);
 const major=resolveWound({...params,netDamage:8,limbLifeThreat:true});assert.equal(major.wound.remainingSeconds,600);
 const healer=a();healer.id='medic';healer.skills.firstAid=75;
 const minor=resolveWound({...params,id:'minor',netDamage:2});
 const treated=resolveFirstAid({id:'minor-aid',patient:minor.actor,woundId:'minor',healer:input(healer,'firstAid',15),accessible:true,suppliesAvailable:true,durationRoll:1,healRoll:3});
 assert.equal(treated.patient.locations.find(l=>l.id==='right-arm').hp,4);
});
test('withdrawal distinguishes disengaging, pursuit, successful escape and blocked exits',()=>{
 const f=input(a(),'athletics',30),p=input(b(),'athletics',90),base={id:'leave',fugitive:f,engaged:true,held:false,exitAvailable:true,withdrawEffect:false,pursued:true,actionPoints:1,disengage:{actor:f,opponent:p},pursuit:{actor:f,opponent:p}};
 assert.equal(resolveWithdrawal(base).disengaged,true);assert.equal(resolveWithdrawal(base).escaped,false);
 assert.equal(resolveWithdrawal({...base,engaged:false}).escaped,true);
 assert.equal(resolveWithdrawal({...base,held:true}).status,'blocked');
 assert.equal(resolveWithdrawal({...base,actionPoints:0}).status,'blocked');
 assert.equal(resolveWithdrawal({...base,engaged:false,pursued:false}).status,'automatic');
});
test('augmentation adds success range without broadening critical/fumble range',()=>{
 const s=a();s.skills.ride=45;s.skills.locale=60;
 const p={id:'ride',...input(s,'ride',6),augmentation:{character:s,skill:'locale',difficulty:'standard',reason:'Knows the route'}};
 const r=checkSkill(p);assert.equal(r.checks[0].target,57);assert.equal(r.outcome,'success');
 assert.equal(checkSkill({...p,roll:52}).outcome,'success');assert.equal(checkSkill({...p,roll:5}).outcome,'critical');
 assert.equal(checkSkill({...p,roll:99}).outcome,'fumble');
 assert.throws(()=>checkSkill({...p,augmentation:{...p.augmentation,skill:'ride'}}),/itself/);
});
test('combat context difficulty is explicit and appears in resolved check',()=>{
 const params={id:'exchange',seed:'test',attacker:a(),defender:b(),defense:'none',defenseAvailable:false,surpriseBonus:false,limbLifeThreat:false,context:null,attackDifficulty:'hard',defenseDifficulty:'standard'};
 const r=resolveCombatExchange(params);assert.equal(r.attack.target,38);assert.ok(r.attack.modifiers.some(m=>m.source==='master'));
 assert.throws(()=>resolveCombatExchange({...params,attackDifficulty:undefined}),/Explicit combat difficulty/);
});

test('bleeding is explicit, first aid stops only the treated bleeding injury',()=>{
 const s=a(),params={character:s,locationId:'right-arm',netDamage:1,limbLifeThreat:false,bleeding:true,roundSeconds:5};
 const first=resolveWound({...params,id:'bleed-a'}),second=resolveWound({...params,character:first.actor,locationId:'left-arm',id:'bleed-b'});
 assert.equal(second.actor.state.bleeding,true);
 const healer=a();healer.id='healer';healer.skills.firstAid=80;
 const aid={id:'bandage',patient:second.actor,woundId:'bleed-a',healer:input(healer,'firstAid',40),accessible:true,suppliesAvailable:true,durationRoll:1,healRoll:1};
 const done=resolveFirstAid(aid);assert.equal(done.wound.bleeding,false);assert.equal(done.patient.state.bleeding,true);
 assert.equal(resolveFirstAid({...aid,patient:done.patient,woundId:'bleed-b'}).patient.state.bleeding,false);
 assert.throws(()=>resolveWound({...params,id:'missing',bleeding:undefined}),/Explicit bleeding/);
 assert.throws(()=>resolveFirstAid({...aid,suppliesAvailable:undefined}),/Explicit supplies/);
});
