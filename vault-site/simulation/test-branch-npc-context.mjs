import test from 'node:test';
import assert from 'node:assert/strict';
import {buildBranchContext,contextKey,evaluateReaction,prepareSocialCheck} from './branch-npc-context.mjs';
import {fixture,fixturePolicy} from './branch-npc-fixture.mjs';
function exercise(assert){
 const x=fixture(),c=buildBranchContext(x),p=fixturePolicy(),a=evaluateReaction(c,p);assert.equal(a.posture,"neutral");assert.equal(a.trace[0].clauses[0].result,"unknown");assert.equal(a.grantsConsent,false);assert.equal(contextKey(c),contextKey(buildBranchContext(fixture())));assert.deepEqual(a,evaluateReaction(c,p));
 const dirty=buildBranchContext(fixture({observedActor:{hygiene:"dirty",attitude:"hostile"}}));assert.equal(evaluateReaction(dirty,p).posture,"guarded");
 const known=buildBranchContext(fixture({npcKnowledge:[{factId:"stolen",belief:true,source:"reported",evidenceId:"report"}]}));assert.equal(evaluateReaction(known,p).posture,"questioning");
 const rumor=buildBranchContext(fixture({worldFacts:[{id:"stolen",value:false}],npcKnowledge:[{factId:"stolen",belief:true,source:"reported",evidenceId:"report"}]}));assert.equal(evaluateReaction(rumor,p).posture,"questioning");assert.equal(rumor.worldTruth.stolen,false);
 const missing=buildBranchContext(fixture({observedActor:{}}));assert.equal(evaluateReaction(missing,p).posture,"uncertain");assert.deepEqual(evaluateReaction(missing,p).optionIds,["wait"]);
 assert.throws(()=>evaluateReaction(c,p,{production:true}),/Unapproved/);assert.throws(()=>evaluateReaction(c,{...p,fallbackOptionIds:["enter"]}),/Illegal/);assert.throws(()=>buildBranchContext(fixture({npcKnowledge:[{factId:"stolen",belief:false,source:"witnessed",evidenceId:"witness"}]})),/contradicts/);
 assert.equal(prepareSocialCheck(c,{callMasterRules(){throw Error("must not call")}}).status,"not-required");
 for(const [kind,skills] of [["deceit",["deceit","insight"]],["persuasion",["influence","willpower"]]]){
  const s=buildBranchContext(fixture({intentKind:kind,intentId:"ask"})),calls=[],draws=[];
  const authorization={branchId:s.branchId,contextRevision:s.contextRevision,intentId:s.intent.id,eventId:"social-event",actorDifficulty:"standard",npcDifficulty:"hard",reason:"Synthetic contested claim"};
  const adapter=(operation,params)=>{calls.push({operation,params});return {apiVersion:"master-rules-v1",operation,result:operation==="checkProfile"?{legal:true}:{status:"resolved",winner:"actor",checks:[{id:"a"},{id:"b"}]}}};
  assert.equal(prepareSocialCheck(s).status,"not-authorized");
  const result=prepareSocialCheck(s,{authorization,world:x.world,callMasterRules:adapter,rollD100:a=>{draws.push(a);return 25}});
  assert.deepEqual(calls.map(z=>z.operation),["checkProfile","checkProfile","checkOpposed"]);assert.deepEqual([calls[2].params.actor.skill,calls[2].params.opponent.skill],skills);assert.equal(draws.length,2);assert.equal(result.grantsConsent,false);assert.equal(result.rulesResult.result.winner,"actor");
  assert.throws(()=>prepareSocialCheck(s,{authorization:{...authorization,contextRevision:2},world:x.world,callMasterRules:adapter,rollD100:()=>25}),/Unbound/);
  assert.equal(prepareSocialCheck(s,{authorization,world:x.world,callMasterRules:(operation)=>({apiVersion:"master-rules-v1",operation,result:{legal:false}}),rollD100(){throw Error("no draw on blocked")}}).status,"blocked");
 }
}
test('SYS-03 synthetic context, perception, deterministic reaction and rules adapter',()=>exercise(assert));
