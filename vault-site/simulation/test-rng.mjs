import test from 'node:test';
import assert from 'node:assert/strict';
import {die} from './engine.mjs';
import {addressedRoll,createCombatRoller,createLegacyCombatRoller,editorialIndex,newSeed,RNG_VERSION,legacyCampaignRoll,createLegacyCampaignRoller,LEGACY_CAMPAIGN_VERSION} from './rng.mjs';

const seed='sys02-public-test-fixture'; // Synthetic, never a campaign seed.
const address={moduleId:'mod',branchId:'branch',eventId:'event',purpose:'attack',ordinal:0,actorId:'hero'};
const draw=(sides=100,overrides={})=>addressedRoll({seed,sides,address:{...address,...overrides}});
test('fixed HMAC vectors and explicit version',()=>{
 assert.deepEqual([2,6,20,100,1000000].map(sides=>draw(sides)),[1,5,8,3,458257]);
 assert.equal(addressedRoll({seed,address,sides:100,version:RNG_VERSION}),3);
 assert.equal(editorialIndex({seed,address,count:6}),4);
 assert.equal(editorialIndex({seed,address,count:1}),0);
});
test('replay, order independence, editorial and paired policies',()=>{
 const purposes=['initiative','attack','damage','defense'];
 const policy=order=>Object.fromEntries(order.map(purpose=>[purpose,draw(100,{purpose})]));
 const first=policy(purposes);
 draw(20,{purpose:'diagnostic'});
 editorialIndex({seed,address,count:9});
 assert.deepEqual(policy([...purposes].reverse()),first);
 const seeds=Array.from({length:64},(_,i)=>'synthetic-paired-'+i);
 const traces=diagnostic=>seeds.map(seed=>{
  const roll=createCombatRoller({seed,moduleId:'mod',branchId:'branch',eventId:'event'});
  if(diagnostic)roll(6,'unrelated',0);
  return [roll(100,'attack.hero',0),roll(6,'damage.hero',0)];
 });
 assert.deepEqual(traces(false),traces(true));
});
test('reject malformed requests and addresses',()=>{
 for(const sides of [0,1,2.5,NaN,Infinity,1000001,'6',undefined])
  assert.throws(()=>addressedRoll({seed,address,sides}),/Invalid die/);
 for(const change of [{ordinal:-1},{ordinal:1.5},{ordinal:undefined},{purpose:''},{moduleId:undefined},{branchId:' '},{eventId:null},{actorId:42},{extra:1}])
  assert.throws(()=>draw(100,change));
 assert.throws(()=>addressedRoll({seed:'',address,sides:6}));
 assert.throws(()=>addressedRoll({seed,address,sides:6,version:'future'}));
 assert.throws(()=>editorialIndex({seed,address,count:0}));
 const roll=createCombatRoller({seed,moduleId:'mod',branchId:'branch',eventId:'event'});
 assert.throws(()=>roll(6,'attack'));
});
test('legacy candidate preserves historical mapping and defaults',()=>{
 const roll=createLegacyCombatRoller({seed,address:'event'});
 assert.equal(roll(100,'attack.hero'),65);
 for(const purpose of ['initiative.hero','attack.hero','damage.hero'])
  for(const ordinal of [0,1,2])
   for(const sides of [6,20,100])
    assert.equal(roll(sides,purpose,ordinal),die(seed,['master-rules-v1','event',purpose,ordinal],sides));
});
test('fixed-sample distribution smoke test D6 and D100',()=>{
 for(const sides of [6,100]){
  const n=12000,bins=Array(sides).fill(0);
  for(let ordinal=0;ordinal<n;ordinal++){
   const value=draw(sides,{ordinal});
   assert.ok(value>=1&&value<=sides);
   bins[value-1]++;
  }
  const mean=n/sides,chi=bins.reduce((sum,x)=>sum+(x-mean)**2/mean,0);
  assert.ok(chi<(sides===6?25:160),`chi-square ${chi}`);
 }
});
test('seed creation and provider output do not expose seed',()=>{
 const a=newSeed(),b=newSeed();
 assert.match(a,/^[a-f0-9]{64}$/);assert.notEqual(a,b);
 const roll=createCombatRoller({seed,moduleId:'mod',branchId:'branch',eventId:'event'});
 const result=roll(6,'attack',0);
 assert.equal(typeof result,'number');
 assert.equal(JSON.stringify(roll),undefined);
 assert.ok(!JSON.stringify({roll:result}).includes(seed));
});

test('QA-01 campaign legacy adapter matches actual existing provider',async()=>{
 const old=await import('./campaign-state.mjs');
 assert.equal(LEGACY_CAMPAIGN_VERSION,old.RNG_VERSION);
 const scope=['campaign',7,'module','v1'];
 const a=createLegacyCampaignRoller(seed,scope),b=old.combatRoller(seed,scope);
 for(const purpose of ['attack.hero','initiative.hero','damage.hero'])
  for(const ordinal of [0,1,2])
   for(const sides of [6,20,100]){
    assert.equal(a(sides,purpose,ordinal),b(sides,purpose,ordinal));
    assert.equal(legacyCampaignRoll(seed,[...scope,purpose,ordinal],sides),old.addressedRoll(seed,[...scope,purpose,ordinal],sides));
   }
 const before=a(100,'attack.hero');scope.push('unrelated');
 assert.equal(a(100,'attack.hero'),before);
 assert.throws(()=>legacyCampaignRoll(seed,[],6));
});
test('actual duel accepts common RNG; same trace, unrelated draw, paired policies',async()=>{
 const {simulateDuel}=await import('../public/laboratorio/duel.mjs');
 const {galahadSheet,wolfSheet}=await import('../public/laboratorio/character-sheet.mjs');
 function run(tactical,diagnostics){
  const provider=createCombatRoller({seed,moduleId:'module',branchId:'branch',eventId:'duel'});
  const draws=new Map();
  const roll=(sides,purpose,ordinal)=>{
   if(diagnostics)provider(20,'sys02.unrelated-diagnostic',draws.size);
   const key=JSON.stringify([purpose,ordinal]);
   assert.ok(!draws.has(key),'Duplicate semantic draw '+key);
   const value=provider(sides,purpose,ordinal);
   draws.set(key,{sides,value});
   return value;
  };
  const result=simulateDuel(galahadSheet(),wolfSheet(),{seed:'private-provider',roll,tactical});
  assert.ok(!JSON.stringify(result).includes(seed));
  return {result,draws};
 }
 const a=run(true,false),b=run(true,true),c=run(false,false);
 assert.deepEqual(a,b);
 let common=0;
 for(const [key,value] of a.draws){
  const other=c.draws.get(key);
  if(other&&other.sides===value.sides){assert.equal(value.value,other.value);common++}
 }
 assert.ok(common>=2);
});
