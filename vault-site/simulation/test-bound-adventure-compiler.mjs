import test from 'node:test';
import assert from 'node:assert/strict';
import {compileBoundEdition,startBoundEdition,confirmBoundChoice,boundChoiceView} from './bound-adventure-compiler.mjs';
import {prepareFixture,compileEdition,startEdition,confirmChoice} from './adventure-compiler.mjs';
function fixture(){
 let calls=0;
 const module={id:'synthetic-guard',version:'1',mode:'mechanical-fixture',intentIds:['talk','leave'],endingIds:['allowed','withdrawn']};
 const initial={revision:0,status:'offered',secret:'synthetic-private-marker',trust:0};
 const bindings={
  enumerate:s=>s.status==='offered'?[{intentId:'talk'},{intentId:'leave'}]:[],
  ending:s=>s.status==='offered'?null:s.status,
  prepare:(s,a,{branchId})=>{
   calls++;const status=a.intentId==='talk'?'allowed':'withdrawn';
   const state={...s,status,revision:s.revision+1,trust:a.intentId==='talk'?1:0};
   return {state,event:{id:branchId,revision:state.revision,checks:[],facts:[{kind:status}]},context:{intent:a.intentId,trust:state.trust},slotId:'dialogue-'+a.intentId};
  }
 };
 return {module,initial,bindings,calls:()=>calls};
}
test('two legal routes, distinct contexts, deterministic IDs, no resolution on confirmation',()=>{
 const f=fixture(),e=compileBoundEdition(f);assert.equal(f.calls(),2);assert.deepEqual(e,compileBoundEdition(fixture()));
 const s=startBoundEdition(e),v=boundChoiceView(e,s);
 assert.equal(v.choices.length,2);assert.equal(e.jobs.length,2);assert.notDeepEqual(e.jobs[0].context,e.jobs[1].context);
 for(const a of v.choices){
  const c={commandId:'cmd-'+a.intentId,expectedRevision:0,branchId:a.branchId};
  const r=confirmBoundChoice(e,s,c);assert.equal(r.session.state.trust,a.intentId==='talk'?1:0);
  assert.equal(boundChoiceView(e,r.session).ending,a.intentId==='talk'?'allowed':'withdrawn');
  assert.equal(confirmBoundChoice(e,r.session,c).duplicate,true);
  assert.throws(()=>confirmBoundChoice(e,r.session,{...c,commandId:'other'}),/Revision conflict/);
 }
 assert.equal(f.calls(),2);assert.equal(s.state.revision,0);assert.equal(e.publicationReady,false);
 assert.ok(!JSON.stringify(v).includes('synthetic-private-marker'));assert.ok(!JSON.stringify(v).includes('context'));
});
test('fails closed on incomplete coverage, depth, budget, broken references and invalid endings',()=>{
 const f=fixture();assert.throws(()=>compileBoundEdition({...f,maxEdges:1}),/Edge limit/);
 assert.throws(()=>compileBoundEdition({...f,module:{...f.module,intentIds:['talk','leave','missing']}}),/Uncovered authored intent/);
 assert.throws(()=>compileBoundEdition({...f,module:{...f.module,intentIds:['talk']}}),/Broken intent/);
 assert.throws(()=>compileBoundEdition({...f,module:{...f.module,endingIds:['allowed','other']}}),/Invalid ending/);
 assert.throws(()=>compileBoundEdition({...f,bindings:{...f.bindings,ending:()=>null,enumerate:()=>[]}}),/Uncovered dead end/);
 const endless={...f,bindings:{...f.bindings,ending:()=>null,enumerate:()=>[{intentId:'talk'}]}};
 assert.throws(()=>compileBoundEdition({...endless,maxDepth:1}),/Depth limit/);
 assert.throws(()=>compileBoundEdition({...f,module:{...f.module,mode:'approved'}}),/synthetic/);
});
test('tampered prepared result and illegal branch rejected',()=>{
 const e=compileBoundEdition(fixture()),s=startBoundEdition(e),edge=e.nodes[e.rootId].edges[0];
 assert.throws(()=>confirmBoundChoice(e,s,{commandId:'wrong',expectedRevision:0,branchId:'unknown'}),/Illegal branch/);
 edge.event.facts.push({kind:'tampered'});
 assert.throws(()=>confirmBoundChoice(e,s,{commandId:'cmd',expectedRevision:0,branchId:edge.branchId}),/Prepared transition mismatch/);
});
test('legacy pilot rejects adulterated prepared event and marks unresolved as not meaningful',()=>{
 const e=compileEdition(prepareFixture({seed:'module-development-001'})),s=startEdition(e);
 assert.equal(e.coverage.meaningfulEndingsComplete,false);
 const edge=e.nodes[e.rootId].edges[0];edge.event.facts.push({kind:'tampered'});
 assert.throws(()=>confirmChoice(e,s,{commandId:'tamper',expectedRevision:0,worldRevision:e.worldRevision,action:edge.action}),/Compiled result mismatch/);
});
