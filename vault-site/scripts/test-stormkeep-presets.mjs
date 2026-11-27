import assert from 'node:assert/strict';
import {presetIds,presetInfo,stormkeepSheet,presetSummary} from '../public/laboratorio/stormkeep-presets.mjs';
import {validateSheet,derived,equipped} from '../public/laboratorio/character-sheet.mjs';
import {conditionProfile} from '../public/laboratorio/conditions.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const hashes=['14f2793dde20b0f9aaab0df623fbf6fd53c8f7bf080bd8acd1688572de1eabc0','8280a585095fc5de114ca64b769ba3b22297cb9e2960dc59eebcaba8a202296a','250353e1641a215c9edebcc3cc31eec2696ade3a12561b8e04cf260db21d2884'];
assert.deepEqual(presetIds,['paladin','rogue','mage']);
assert.throws(()=>stormkeepSheet('arbitrary'));
for(const [i,id] of presetIds.entries()){
 const s=stormkeepSheet(id),p=presetSummary(id);
 assert.equal(validateSheet(s),s);
 assert.equal(Object.values(s.attributes).reduce((a,b)=>a+b),86);
 assert.equal(s.magicPoints,s.attributes.POW);
 assert.equal(s.locations.length,7);
 assert.ok(s.locations.every(x=>x.hp===x.maxHp));
 assert.ok(derived(s).enc<=derived(s).normalCapacity);
 assert.ok(conditionProfile(s).legal);
 assert.equal(derived(s).baseAP,[2,3,3][i]);
 assert.equal(equipped(s).hands,[2,1,2][i]);
 assert.equal(createHash('sha256').update(readFileSync(new URL('../public'+presetInfo(id).portrait,import.meta.url))).digest('hex'),hashes[i]);
 const copy=stormkeepSheet(id,'actor-test');assert.equal(copy.id,'actor-test');copy.inventory[0].hp=1;assert.notEqual(stormkeepSheet(id).inventory[0].hp,1);
 assert.equal(p.armor.head,0);
 assert.ok(s.pendingAbilities.length>0);
}
assert.equal(stormkeepSheet('rogue').inventory.filter(i=>i.kind==='weapon').length,2);
assert.equal(stormkeepSheet('mage').skills.willpower,75);
console.log('PASS: 3 fixed presets, shared sheet, 86 characteristics, equipment, derivatives, fresh copies, original portrait hashes.');
