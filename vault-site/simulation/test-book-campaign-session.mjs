import test from 'node:test';
import assert from 'node:assert/strict';
import {createBookCampaignSession} from '../public/libro/book-campaign-session.mjs';
import {readConfirmedNarration} from '../public/libro/confirmed-narration.mjs';
const scope={campaignId:'fixture',actorId:'actor'};
const check={schemaVersion:1,id:'event.1.check',actorId:'actor',actorName:'Actor',skillId:'influence',skillName:'Influencia',base:50,target:50,difficulty:'Estándar',reason:'Fixture',dice:'D100',roll:35,outcome:'success',visibility:'player',source:'fixture'};
const envelope=(status='approved')=>({schemaVersion:1,kind:'confirmed-narration',...scope,revision:1,eventId:'event.1',locale:'es-AR',narratorVersion:'narrative-confirmed-v1',presentationStatus:status,presentation:{id:'event.1',revision:1,phase:'module-intent',title:'Prueba sintética',roman:'',text:['Texto sintético aprobado.',{check:check.id}],checks:[check]}});
const edition=(revision=0,status='approved')=>({...scope,revision,pages:[{id:'page'+revision,choices:[{id:'choice'},{id:'other'}],events:revision?[envelope(status)]:[]}]});
// Explicit fixture reader, not DOM or actual HTTP.
function fixture(transport){
 let loaded=[],bound,ids=0;
 const reader={load:e=>loaded.push(e),bindTransport:f=>{bound=f}};
 const session=createBookCampaignSession({reader,readEdition:e=>{for(const p of e.pages)for(const v of p.events)readConfirmedNarration(v,e);return structuredClone(e)},transport,scope,makeCommandId:()=>String(++ids)});
 return {session,loaded,bound:()=>bound};
}
const request={...scope,expectedRevision:0,pageId:'page0',choiceId:'choice'};
test('approved event uses original check exactly once and rejects injection',()=>{
 const e=envelope();assert.deepEqual(readConfirmedNarration(e,{...scope,revision:1}).checks,[check]);
 assert.throws(()=>readConfirmedNarration({...e,seed:'private'},{...scope,revision:1}),/Unknown/);
 const duplicate=structuredClone(e);duplicate.presentation.text.push({check:check.id});
 assert.throws(()=>readConfirmedNarration(duplicate,{...scope,revision:1}),/repetida/);
 const empty=structuredClone(e);empty.presentation.text=[{check:check.id}];assert.throws(()=>readConfirmedNarration(empty,{...scope,revision:1}),/preparación/);
});
test('resume and confirm only send scope and legal choice; replay uses same command',async()=>{
 const calls=[];const f=fixture({resume:async s=>{assert.deepEqual(s,scope);return edition()},confirm:async c=>{calls.push(c);if(calls.length===1)throw Error('network');return edition(1)}});
 await f.session.resume();assert.equal(f.loaded.length,1);
 await assert.rejects(f.bound()({...request,choiceId:'illegal'}),/no autorizada/);
 await assert.rejects(f.bound()(request),/network/);
 await assert.rejects(f.bound()({...request,choiceId:'other'}),/pendiente/);
 await f.bound()(request);assert.deepEqual(calls[0],calls[1]);assert.equal(f.loaded.length,2);
 await assert.rejects(f.bound()(request),/revisión/);
 f.session.close();assert.equal(f.bound(),null);
});
test('reject missing approved module narration, wrong scope and stale response',async()=>{
 let r=edition(1,'fallback');const f=fixture({resume:async()=>edition(),confirm:async()=>r});
 await f.session.resume();await assert.rejects(f.session.confirm(request),/preparación/);
 r={...edition(1),campaignId:'other'};r.pages[0].events[0].campaignId='other';await assert.rejects(f.session.confirm(request),/ámbito/);
 r=edition();await assert.rejects(f.session.confirm(request),/desactualizada/);
 assert.equal(f.loaded.length,1);
});
test('concurrent click blocked and re-open recovers confirmed revision',async()=>{
 let finish;const f=fixture({resume:async()=>edition(1),confirm:()=>new Promise(resolve=>{finish=resolve})});
 await f.session.resume();const choice={...request,pageId:'page1',expectedRevision:1};
 const p=f.session.confirm(choice);await assert.rejects(f.session.confirm(choice),/no disponible/);
 finish(edition(2));await p;assert.equal(f.loaded.at(-1).revision,2);
 await assert.rejects(f.session.resume(),/desactualizada/);
});
