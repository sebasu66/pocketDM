import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const m=read(process.argv[2]);const pop=read('public/data/stormkeep-population-v02.json');
const unique=(items,label)=>{const ids=items.map(x=>typeof x==='string'?x:x.id);assert.equal(new Set(ids).size,ids.length,label);return new Set(ids)};
assert.equal(m.status,'proposal');assert.equal(m.visibility,'author-only');assert.equal(m.canonGate,'user-approval-required');
const d=m.dependencies;
const siteIds=new Set(pop.sites.map(x=>x.id)),actorIds=new Set(pop.actors.map(x=>x.id));
for(const id of [...d.proposedSites,...d.optionalSites])assert.ok(siteIds.has(id),id);
for(const id of [...d.proposedResidents,...d.optionalResidents])assert.ok(actorIds.has(id),id);
const places=unique([...d.existingNodes,...d.proposedSites,...d.optionalSites],'duplicate place');
const actors=unique(m.actors,'duplicate actor');const expected=unique([...d.proposedResidents,...d.fixtureActors],'duplicate actor dependencies');
assert.deepEqual(actors,expected);
const scenes=unique(m.scenes,'duplicate scene'),intents=unique(m.intents,'duplicate intent'),ends=unique(m.endings,'duplicate ending'),assets=unique(m.assets,'duplicate asset');
const used=new Set(),seenActors=new Set();
for(const s of m.scenes){assert.ok(places.has(s.place),s.place);for(const a of s.participants){assert.ok(actors.has(a),a);seenActors.add(a)}assert.ok(s.entry.length&&s.readAloud&&s.exit);assert.equal(s.visibility,'on-entry-confirmed');for(const i of s.choices){assert.ok(intents.has(i),i);used.add(i)}}
assert.deepEqual(used,intents);assert.deepEqual(seenActors,actors);
for(const r of m.routeCandidates){assert.ok(ends.has(r.terminalCandidate));assert.ok(intents.has(r.criticalIntent));for(const s of r.sequence)assert.ok(scenes.has(s),s);assert.ok(m.scenes.some(s=>r.sequence.includes(s.id)&&s.choices.includes(r.criticalIntent)))}
assert.equal(new Set(m.routeCandidates.map(x=>x.terminalCandidate)).size,m.routeCandidates.length);
for(const e of m.endings){assert.ok(e.conditions.length&&e.consequences.length&&e.epilogue)}
for(const a of m.assets)for(const id of a.subjectIds)assert.ok(places.has(id)||actors.has(id)||id===d.resource,id);
assert.equal(m.fragmentPolicy.cacheScope,'campaign-private initially');assert.equal(m.fragmentPolicy.noAutoReactions,true);
console.log(JSON.stringify({status:'authoring-references-valid',scenes:scenes.size,actors:actors.size,intents:intents.size,routes:m.routeCandidates.length,endings:ends.size,assets:assets.size,mechanicalValidation:false}));
