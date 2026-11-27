import test from 'node:test';
import assert from 'node:assert/strict';
import {skillCheck} from './skill-check-core.mjs';
test('pure skill check: inputs alone determine all four outcomes',()=>{
 const input={skill:55,difficulty:'hard',modifiers:[-5]};
 for(const [roll,outcome] of [[2,'critical'],[30,'success'],[60,'failure'],[99,'fumble']]){
  const a=skillCheck({...input,roll});
  assert.equal(a.target,32);assert.equal(a.outcome,outcome);
  assert.deepEqual(a,skillCheck({...input,roll}));
 }
 assert.throws(()=>skillCheck({...input,roll:101}));
 assert.throws(()=>skillCheck({...input,modifiers:['-5'],roll:30}));
});
