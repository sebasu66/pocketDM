import test from 'node:test';
import assert from 'node:assert/strict';
import {galahadSheet,wolfSheet} from '../public/laboratorio/character-sheet.mjs';
import {callMasterRules,checkSkill,checkProfile,checkOpposed,checkDifferential,checkResistance,checkLift,checkGroup,resolveCombatExchange,resolveCombatEncounter} from './master-rules.mjs';
import {validateCheck} from '../public/libro/check-contract.mjs';
const person=(id='galahad')=>{const s=galahadSheet();s.id=id;Object.assign(s.skills,{ride:65,deceit:60,insight:65,commerce:50});return s};
const input=(character=person(),skill='ride',roll=30,difficulty='standard')=>({character,skill,roll,difficulty,reason:'Situación de prueba'});
test('master API requires explicit difficulty and reads actual actor skill; no story state or mutation',()=>{
 const a=person(),before=structuredClone(a),params={id:'ride.1',...input(a,'ride',42,'hard')};
 const r=callMasterRules('checkSkill',params);
 assert.equal(r.result.checks[0].target,43);assert.equal(r.result.outcome,'success');validateCheck(r.result.checks[0]);
 assert.deepEqual(r,callMasterRules('checkSkill',params));assert.deepEqual(a,before);
 assert.throws(()=>checkSkill({...params,difficulty:undefined}),/explicit difficulty/);
 assert.throws(()=>checkSkill({...params,character:galahadSheet()}),/Skill missing/);
 assert.throws(()=>callMasterRules('unknown',params),/Unknown/);
});
test('condition modifiers: relative load, fatigue strongest grade, mental skill unaffected, disabled task',()=>{
 const a=person();a.state.extraLoad=23;
 const ride=checkProfile(input(a,'ride',30,'hard'));assert.equal(ride.difficulty,'formidable');assert.equal(ride.target,33);
 assert.equal(checkProfile(input(a,'insight',30,'hard')).target,43);
 a.state.fatigue=5;assert.equal(checkProfile(input(a,'ride',30,'standard')).difficulty,'herculean');
 a.state.fatigue=0;a.state.extraLoad=0;
 a.locations.find(l=>l.id==='right-arm').disabled=true;
 assert.equal(checkSkill({id:'hands',...input(a),requirements:{functionalHands:2}}).status,'blocked');
 assert.equal(checkSkill({id:'mind',...input(a,'insight')}).status,'resolved');
 a.state.unconscious=true;assert.equal(checkSkill({id:'out',...input(a)}).status,'blocked');
});
test('ordinary and impossible actions do not produce fictitious dice',()=>{
 const a=person();
 assert.deepEqual(checkSkill({id:'routine',...input(a,'ride',undefined,'automatic')}).checks,[]);
 assert.equal(checkSkill({id:'routine',...input(a,'ride',undefined,'automatic')}).status,'automatic');
 assert.equal(checkSkill({id:'impossible',...input(a,'ride',undefined,'hopeless')}).status,'blocked');
});
test('opposed social checks use degree first, then highest successful roll; no fabricated winner',()=>{
 const a=person('a'),b=person('b'),p={id:'lie',actor:input(a,'deceit',45),opponent:input(b,'insight',62)};
 assert.equal(checkOpposed(p).winner,'opponent');
 assert.equal(checkOpposed({...p,actor:{...p.actor,roll:5}}).winner,'actor');
 assert.equal(checkOpposed({...p,actor:{...p.actor,roll:95},opponent:{...p.opponent,roll:95}}).winner,null);
 assert.equal(checkDifferential(p).advantage.count,0);
 assert.equal(checkDifferential({...p,actor:{...p.actor,roll:5}}).advantage.count,1);
 a.skills.deceit=130;const r=checkOpposed(p);assert.equal(r.oppositionPenalty,30);assert.deepEqual(r.checks.map(c=>c.target),[100,35]);
});
test('resistance, lifting and group checks use existing rules; all output checks renderable',()=>{
 const a=person('a'),b=person('b');b.skills.ride=30;
 const r=checkResistance({id:'poison',actor:input(a,'endurance',10),potency:60,potencyRoll:90,sourceName:'Peligro de prueba'});assert.equal(r.winner,'resistance');r.checks.forEach(validateCheck);
 assert.equal(checkLift({id:'box',...input(a),mode:'lift',weightSIZ:15}).status,'automatic');
 assert.equal(checkLift({id:'box',...input(a),mode:'lift',weightSIZ:29}).status,'blocked');
 assert.equal(checkLift({id:'box',...input(a,'brawn',99),mode:'lift',weightSIZ:20}).followUp,'injury');
 const group={id:'group',members:[input(a),input(b)],roll:40};
 assert.equal(checkGroup({...group,mode:'team'}).outcome,'success');assert.equal(checkGroup({...group,mode:'reverse-team'}).outcome,'failure');
 assert.deepEqual(checkGroup({...group,mode:'sorting'}).results.map(x=>x.outcome),['success','failure']);
});
test('combat API wraps existing deterministic exchange and encounter, does not mutate input',()=>{
 const a=person(),b=wolfSheet(),before=structuredClone([a,b]),p={id:'fight',seed:'TEST-ONLY',attacker:a,defender:b,defense:'evade'};
 const r=resolveCombatExchange(p);assert.ok(r.checks.length);assert.deepEqual(r,resolveCombatExchange(p));r.checks.forEach(validateCheck);
 const d=resolveCombatEncounter({...p,maxRounds:3});assert.ok(d.events.length);assert.deepEqual(d,resolveCombatEncounter({...p,maxRounds:3}));assert.deepEqual([a,b],before);assert.equal(Object.hasOwn(d,'seed'),false);
});
