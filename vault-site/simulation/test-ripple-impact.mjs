import test from 'node:test';import assert from 'node:assert/strict';
import {snapshot} from './world-context.mjs';
import {buildImpactContext,validateImpactAnalysis,createRoleplayJobs} from './ripple-impact.mjs';
const w=snapshot({canon:{fixture:true},nodes:[
{id:'town',kind:'settlement',name:'Pueblo',generation:'visitable',visibility:'public'},
{id:'gate',parentId:'town',kind:'site',name:'Puerta',generation:'visitable',visibility:'public'},
{id:'hall',parentId:'town',kind:'site',name:'Salón',generation:'visitable',visibility:'public'}
],entities:[
{id:'hero',kind:'player',locationId:'gate',visibility:'public'},
{id:'guard',kind:'npc',locationId:'gate',visibility:'public',privateState:{motivation:'proteger el puesto'}},
{id:'witness',kind:'npc',locationId:'gate',visibility:'public'},
{id:'captain',kind:'npc',locationId:'hall',visibility:'known',privateState:{motivation:'evitar una crisis'}},
{id:'family',kind:'npc',locationId:'hall',visibility:'known'},
{id:'watch',kind:'faction',visibility:'public'},
{id:'stranger',kind:'npc',locationId:'hall',visibility:'public'}
]});
const relations=[{id:'command',kind:'superior-of',from:'captain',to:'guard'},{id:'kin',kind:'family-of',from:'guard',to:'family'},{id:'membership',kind:'member-of',from:'captain',to:'watch'}];
const event={id:'fight-1',revision:7,locationId:'gate',participantIds:['hero','guard'],facts:[{id:'fight',kind:'combat',description:'El viajero luchó con el guardia.'},{id:'injury',kind:'wound',description:'El guardia sufrió una herida.'}],knowledge:[{entityId:'guard',source:'participant',factIds:['fight','injury']},{entityId:'witness',source:'witness',factIds:['fight']}]};
const packet=()=>buildImpactContext(w,relations,event);
const find=(p,id)=>p.candidates.find(c=>c.entityId===id);
const response=(p,ids)=>({schemaVersion:1,eventId:p.event.id,revision:p.event.revision,affected:ids.map(entityId=>({entityId,impact:'potential',reason:'Vínculo relevante para revisión narrativa.',pathIds:[find(p,entityId).paths[0].id]}))});
test('typed relations find superior, family and faction without flooding remote room',()=>{const p=packet();assert.ok(find(p,'captain'));assert.ok(find(p,'family'));assert.ok(find(p,'watch'));assert.equal(find(p,'stranger'),undefined);const step=find(p,'captain').paths[0].steps[0];assert.equal(step.edgeId,'command');assert.equal(step.relationFrom,'captain');assert.equal(step.relationTo,'guard');assert.deepEqual(p,packet())});
test('knowledge is fact-scoped, not inferred from relation or location',()=>{const p=packet(),a=validateImpactAnalysis(p,response(p,['guard','captain','family','watch','witness']));assert.equal(a.find(x=>x.entityId==='captain').knowledgeStatus,'unconfirmed');const jobs=createRoleplayJobs(p,response(p,['guard','captain','family','watch','witness']));assert.deepEqual(jobs.map(x=>x.actorId),['guard','witness']);assert.deepEqual(jobs[1].knownFacts.map(x=>x.id),['fight']);assert.equal(jobs[0].actor.privateState.motivation,'proteger el puesto');assert.ok(jobs.every(j=>j.status==='awaiting-narrator'&&!('action' in j)))});
test('explicit delivery allows roleplay without leaking unreported injury',()=>{const p=buildImpactContext(w,relations,{...event,knowledge:[...event.knowledge,{entityId:'captain',source:'delivered',fromId:'witness',factIds:['fight']}]});const jobs=createRoleplayJobs(p,response(p,['captain']));assert.equal(jobs.length,1);assert.deepEqual(jobs[0].knownFacts.map(x=>x.id),['fight'])});
test('untrusted analyst cannot create entities, invent path or mark knowledge or actions',()=>{const p=packet(),r=response(p,['captain']);assert.throws(()=>validateImpactAnalysis(p,{...r,revision:8}),/Invalid impact/);for(const patch of [{entityId:'invented'},{pathIds:['invented-path']},{knowledgeStatus:'informed'},{action:'attack'}])assert.throws(()=>validateImpactAnalysis(p,{...r,affected:[{...r.affected[0],...patch}]}));assert.throws(()=>validateImpactAnalysis(p,{...r,affected:[r.affected[0],r.affected[0]]}),/Invalid affected/)});
test('bounded incomplete traversal and invalid world references are explicit',()=>{const p=buildImpactContext(w,relations,event,{maxRecords:4,maxDepth:2});assert.equal(p.candidates.length,4);assert.equal(p.coverage.incomplete,true);assert.throws(()=>buildImpactContext(w,[...relations,{id:'bad',kind:'superior-of',from:'missing',to:'guard'}],event),/Invalid graph relation/);assert.throws(()=>buildImpactContext(w,relations,{...event,knowledge:[{entityId:'family',source:'participant',factIds:['fight']}]}),/Not a participant/)});
