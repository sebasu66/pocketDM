import test from 'node:test';import assert from 'node:assert/strict';import {preset,derive,recordChoice,threatSuggestion} from './public/v2/engine.mjs';
test('load is inventory derived',()=>{const p=preset();const a=derive(p);p.inventory.rations+=10;assert.equal(derive(p).load,a.load+5)});
test('fatigue reduces combat and endurance',()=>{const p=preset();const a=derive(p);p.condition.fatigue=90;assert.ok(derive(p).melee<a.melee);assert.ok(derive(p).endurance<a.endurance)});
test('no arrows means no ranged readiness',()=>{const p=preset();p.inventory.arrows=0;assert.equal(derive(p).ranged,0)});
test('darkvision improves vision',()=>{const p=preset();const a=derive(p);p.senses.darkvision=false;assert.ok(derive(p).vision<a.vision)});
test('knowledge improves prediction',()=>{const p=preset();const a=derive(p);p.knowledge.wolf=100;assert.ok(derive(p).prediction>a.prediction)});
test('repeated scene replaces evidence',()=>{const p=preset();recordChoice(p,'storm',2);assert.ok(p.behavior.compassion>50);recordChoice(p,'storm',0);assert.equal(p.evidence.length,1);assert.equal(p.behavior.compassion,50)});
test('explicit doctrine overrides inferred response',()=>{const p=preset();p.doctrine='defend';assert.equal(threatSuggestion(p),'defend')});
