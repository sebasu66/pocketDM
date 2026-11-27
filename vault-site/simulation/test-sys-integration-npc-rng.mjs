import test from 'node:test';
import assert from 'node:assert/strict';
import {galahadSheet} from '../public/laboratorio/character-sheet.mjs';
import {fixture} from './branch-npc-fixture.mjs';
import {buildBranchContext,prepareSocialCheck} from './branch-npc-context.mjs';
import {addressedRoll,RNG_VERSION} from './rng.mjs';
import {callMasterRules,resolveCombatEncounter} from './master-rules.mjs';
import {wolfSheet} from '../public/laboratorio/character-sheet.mjs';
test('real NPC checks use authoritative sheets and common RNG only during preparation',()=>{
 const x=fixture({intentId:'ask',intentKind:'persuasion'});
 for(const id of ['traveler','guard']){const sheet={...galahadSheet(),id,name:'Synthetic '+id};x.world.entities[id].privateState.sheet=sheet}
 const c=buildBranchContext(x),auth={branchId:c.branchId,contextRevision:c.contextRevision,intentId:c.intent.id,eventId:'social-event',actorDifficulty:'standard',npcDifficulty:'hard',reason:'Synthetic opposed claim'};
 const draws=[];
 const rollD100=({sides,...address})=>{draws.push(address);return addressedRoll({seed:'SYNTHETIC-ONLY',address,sides})};
 const result=prepareSocialCheck(c,{authorization:auth,world:x.world,callMasterRules,rollD100});
 assert.equal(result.status,'resolved');assert.equal(result.grantsConsent,false);assert.equal(result.checks.length,2);assert.equal(draws.length,2);assert.notEqual(draws[0].purpose,draws[1].purpose);
 assert.deepEqual(prepareSocialCheck(c,{authorization:auth,world:x.world,callMasterRules,rollD100}).checks,result.checks);
 assert.equal(prepareSocialCheck(buildBranchContext(fixture()),{callMasterRules(){throw Error('unexpected call')},rollD100(){throw Error('unexpected draw')}}).status,'not-required');
});
test('master API supports explicit new RNG version and rejects missing semantic address',()=>{
 const a=galahadSheet(),b=wolfSheet(),p={id:'encounter-a',seed:'SYNTHETIC-ONLY',attacker:a,defender:b,maxRounds:2,initialRange:'short',surprisedIds:[],limbLifeThreat:false,combatDifficulties:{[a.id]:{attack:'standard',defense:'standard'},[b.id]:{attack:'standard',defense:'standard'}}};
 const next={...p,rngVersion:RNG_VERSION,rngAddress:{moduleId:'synthetic',branchId:'branch-a',eventId:p.id}};
 assert.deepEqual(resolveCombatEncounter(next),resolveCombatEncounter(next));
 assert.throws(()=>resolveCombatEncounter({...next,rngAddress:undefined}),/stable RNG address/);
 assert.deepEqual(resolveCombatEncounter(p),resolveCombatEncounter({...p,rngVersion:'master-rules-v1'}));
});
