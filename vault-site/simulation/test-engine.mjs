import test from 'node:test';import assert from 'node:assert/strict';import {die,createCampaign,resolve,branchTree,narrativeKey,narrativeInput,options} from './engine.mjs';
import {validateCheck} from '../public/libro/check-contract.mjs';
test('replay',()=>assert.deepEqual(branchTree(createCampaign('test'),4),branchTree(createCampaign('test'),4)));
test('address independence and range',()=>{const a=die('test',['a']);die('test',['b']);assert.equal(die('test',['a']),a);for(let i=0;i<1000;i++){const x=die('test',[i],6);assert.ok(x>=1&&x<=6)}});
test('branch isolation and distinct ids',()=>{const a=createCampaign('test'),copy=structuredClone(a);const h=resolve(a,'help'),c=resolve(a,'cross');assert.equal(h.state.hero.rations,2);assert.deepEqual(a,copy);assert.equal(c.state.hero.rations,3);assert.notEqual(resolve(h.state,'negotiate').event.id,resolve(c.state,'negotiate').event.id)});
test('illegal actions',()=>assert.throws(()=>resolve(createCampaign('test'),'strike')));
test('existing book check contract',()=>{const {event}=resolve(createCampaign('test'),'inspect');const c=event.checks[0];validateCheck(c);assert.equal(c.outcome,c.roll<=c.target?'success':'failure')});
test('narrative visibility and cache keys',()=>{const {event}=resolve(createCampaign('test'),'inspect');assert.ok(!JSON.stringify(narrativeInput(event)).includes('seed'));assert.notEqual(narrativeKey(event,'context A'),narrativeKey(event,'context B'));assert.notEqual(narrativeKey(event,'x'),narrativeKey(event,'x','en'))});
test('bounded combat',()=>{let s=resolve(createCampaign('combat'),'cross').state;s=resolve(s,'defend').state;while(options(s).length){s=resolve(s,'strike').state;assert.ok(s.revision<=6);assert.ok(s.hero.hp>=0)}});
