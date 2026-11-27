import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {NarrativeRepository,authoringInput} from './narrative-repository.mjs';
import {narrativeManifest,persistApprovedNarration,loadApprovedNarration,confirmedNarrativeFragment,visibleEventDigest} from './narrative-integration.mjs';
const versions={module:'1',rules:'r1',canon:'synthetic',narrator:'n1',context:'c1'};
const scope={role:'worker',uid:'worker-qa',campaignId:'campaign-a',editionId:'edition-a'};
function fixture(){
 const event={id:'event-a',revision:1,action:'module-intent',facts:[{kind:'guard-greets'}],checks:[{schemaVersion:1,id:'event-a.social',actorId:'actor-a',actorName:'Viajero',skillId:'influence',skillName:'Influencia',base:60,target:60,difficulty:'Estándar',reason:'Identificación',dice:'D100',roll:42,outcome:'success',visibility:'player'}]};
 const edge={branchId:'branch-a',slotId:'dialogue',action:{intentId:'talk'},event,state:{revision:1,secret:'private-marker'},context:{intent:'talk',secret:'private-marker'},nextId:'next'};
 edge.digest=visibleEventDigest(edge);
 const edition={kind:'private-bound-edition',schemaVersion:1,editionId:'edition-a',module:{version:'1'},coverage:{complete:true,edges:1},nodes:{root:{edges:[edge]},next:{edges:[]}},jobs:[{branchId:edge.branchId,eventId:event.id,slotId:edge.slotId,context:structuredClone(edge.context),checkIds:[event.checks[0].id]}]};
 const projectVisible=e=>({context:{actorVisible:'Viajero aseado',npcVisible:'Guardia alerta',place:'Puerta',time:'Mañana',known:[],intent:'Hablar'},facts:[{id:'greet',text:'El guardia saluda'}],options:[],event:structuredClone(e.event)});
 return {edition,projectVisible,event};
}
function manifest(f=fixture()){return narrativeManifest({...f,campaignId:scope.campaignId,actorId:'actor-a',versions})}
function memoryPort(){
 const rows=new Map();
 const digest=p=>createHash('sha256').update(JSON.stringify(p)).digest('hex');
 const key=(s,r)=>JSON.stringify([s.campaignId,r.kind,r.key,r.version]);
 return {rows,async put(s,r){const d=digest(r.payload),k=key(s,r),old=rows.get(k);if(old&&old.digest!==d)throw Error('Immutable version conflict');rows.set(k,structuredClone({...r,digest:d}));return {digest:d,duplicate:!!old}},async get(s,r){return structuredClone(rows.get(key(s,r))??null)}};
}
const review=async()=>({fidelity:true,privacy:true,checks:true,reviewId:'review-1'});
async function ready(job){
 const repository=new NarrativeRepository();repository.enqueue(scope,job);
 const v=await repository.generate(scope,job,async x=>({title:'La puerta',text:[x.facts[0].text,{checkSlot:'check-1'}],factIds:['greet'],optionIds:[]}));
 await repository.review({...scope,role:'reviewer'},job,v.revision,review);return repository;
}
test('compiler branch binding and explicit authoring projection hide raw context and dice',()=>{
 const f=fixture(),[{job,binding}]=manifest(f);
 assert.equal(job.branchId,'branch-a');assert.equal(job.slotId,'dialogue');
 assert.deepEqual(job.checks,[{slotId:'check-1',outcome:'success'}]);
 assert.deepEqual(binding.checks,[{slotId:'check-1',id:'event-a.social',outcome:'success'}]);
 assert.ok(!JSON.stringify(authoringInput(job)).includes('private-marker'));
 assert.ok(!JSON.stringify(authoringInput(job)).includes('"roll"'));
 f.edition.jobs[0].checkIds=['wrong'];assert.throws(()=>manifest(f),/binding/);
 const g=fixture();g.edition.jobs=[];assert.throws(()=>manifest(g),/manifest/);
 const h=fixture();h.edition.nodes.root.edges[0].event.facts.push({kind:'tampered'});assert.throws(()=>manifest(h),/integrity/);
 const k=fixture();const original=k.projectVisible;k.projectVisible=e=>({...original(e),event:{...e.event,checks:[]}});assert.throws(()=>manifest(k),/check binding/);
});
test('immutable approved record survives repository recreation, exact pinned read and binding to confirmed event',async()=>{
 const f=fixture(),[{job,binding}]=manifest(f),store=memoryPort(),repository=await ready(job);
 const reference=await persistApprovedNarration({repository,store,scope,job});
 assert.match(reference.key,/^narrative-[a-f0-9]{64}$/);assert.equal(reference.version,'r3');
 assert.deepEqual(await persistApprovedNarration({repository,store,scope,job}),reference);
 const artifact=await loadApprovedNarration({store,scope,job,reference});
 assert.equal(artifact.status,'validated');
 const confirmed={branchId:job.branchId,campaignId:job.campaignId,editionId:job.editionId,actorId:binding.actorId,event:f.event};
 const result=await confirmedNarrativeFragment({store,scope,job,binding,reference,confirmed});
 assert.deepEqual(result.text,['El guardia saluda',{check:'event-a.social'}]);
 assert.equal(result.status,'approved');assert.equal(result.eventDigest,visibleEventDigest(f.event));
 assert.ok(!JSON.stringify(result).includes('contextHash'));assert.ok(!JSON.stringify(result).includes('reviewId'));
 await assert.rejects(confirmedNarrativeFragment({store,scope,job,binding,reference,confirmed:{...confirmed,branchId:'other'}}),/Confirmed branch/);
 await assert.rejects(confirmedNarrativeFragment({store,scope,job,binding,reference,confirmed:{...confirmed,event:{...f.event,facts:[]}}}),/Confirmed branch/);
 await assert.rejects(loadApprovedNarration({store,scope:{...scope,campaignId:'other'},job,reference}),/worker/);
 await assert.rejects(loadApprovedNarration({store,scope,job,reference:{...reference,version:'r4'}}),/Missing/);
 const changed=fixture();changed.projectVisible=e=>({...f.projectVisible(e),facts:[{id:'greet',text:'El guardia no saluda'}]});
 const newJob=manifest(changed)[0].job;
 await assert.rejects(loadApprovedNarration({store,scope,job:newJob,reference}),/pinned/);
 const row=[...store.rows.values()][0];row.payload.draft.text=['tampered'];await assert.rejects(loadApprovedNarration({store,scope,job,reference}),/altered/);
});
test('unreviewed or rejected cannot persist',async()=>{
 const [{job}]=manifest(),repository=new NarrativeRepository(),store=memoryPort();
 repository.enqueue(scope,job);
 await assert.rejects(persistApprovedNarration({repository,store,scope,job}),/unapproved/);
 const v=await repository.generate(scope,job,async()=>({title:'Guardia',text:['Texto',{checkSlot:'check-1'}],factIds:['greet'],optionIds:[]}));
 await repository.review({...scope,role:'reviewer'},job,v.revision,async()=>({...await review(),privacy:false}));
 await assert.rejects(persistApprovedNarration({repository,store,scope,job}),/unapproved/);
 assert.equal(store.rows.size,0);
});
