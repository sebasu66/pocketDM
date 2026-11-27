import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNarrativeJob,authoringInput,NarrativeRepository} from './narrative-repository.mjs';
const input=(branch='clean',actor='Viajero aseado')=>({campaignId:'fixture',editionId:'guard-demo',branchId:branch,slotId:'arrival',audience:'player',locale:'es-AR',versions:{module:'fixture-1',rules:'r1',canon:'synthetic',narrator:'n1',context:'c1'},context:{actorVisible:actor,npcVisible:'Guardia alerta',place:'Puerta de ensayo',time:'Mañana',known:[],intent:'Solicitar entrada'},facts:[{id:'reaction',text:branch==='clean'?'El guardia saluda':'El guardia exige identificación'}],options:[{id:'reply',text:'Responder'}],checks:[{slotId:'social',outcome:'success'}],required:true});
const worker={role:'worker',campaignId:'fixture',editionId:'guard-demo'};
const reviewer={...worker,role:'reviewer'};
const reader=j=>({...worker,role:'confirmed-reader',branchId:j.branchId});
const author=async j=>({title:'La puerta',text:[j.facts[0].text,{checkSlot:'social'}],factIds:j.facts.map(f=>f.id),optionIds:j.options.map(o=>o.id)});
const approve=async()=>({fidelity:true,privacy:true,checks:true,reviewId:'synthetic-review'});
async function publish(r,j){r.enqueue(worker,j);const v=await r.generate(worker,j,author);return r.review(reviewer,j,v.revision,approve)}
test('guard contexts, exact cache, branch isolation and publication gate',async()=>{
 const r=new NarrativeRepository(),a=prepareNarrativeJob(input()),b=prepareNarrativeJob(input('dirty','Viajero cubierto de barro'));
 assert.notEqual(a.contextHash,b.contextHash);assert.equal(r.coverage(worker,[a,b]).narrativeReady,false);
 await publish(r,a);
 assert.equal(r.enqueue(worker,a).status,'validated');
 assert.equal(r.coverage(worker,[a,b]).missing.length,1);
 assert.throws(()=>r.approved(reader(a),b),/confirmed/);
 await publish(r,b);
 assert.equal(r.coverage(worker,[a,b]).narrativeReady,true);
 assert.notDeepEqual(r.approved(reader(a),a).text,r.approved(reader(b),b).text);
 const changed=input();changed.facts[0].text='El guardia pide ayuda';
 const c=prepareNarrativeJob(changed);assert.notEqual(a.contextHash,c.contextHash);
 assert.throws(()=>r.approved(reader(c),c),/missing/);
 assert.equal(r.coverage(worker,[c]).narrativeReady,false);
});
test('draft cannot add or repeat slots, options or factual bindings',async()=>{
 const r=new NarrativeRepository(),j=prepareNarrativeJob(input());r.enqueue(worker,j);
 for(const patch of [{text:[{checkSlot:'social'},{checkSlot:'social'}]},{text:['Sin chequeo']},{factIds:['invented-damage']},{optionIds:['attack']},{text:['<script>',{checkSlot:'social'}]}]){
  await assert.rejects(r.generate(worker,j,async x=>({...await author(x),...patch})));
 }
 assert.equal(r.enqueue(worker,j).status,'pending');
});
test('semantic review rejects invented damage, missing approval stays blocked',async()=>{
 const r=new NarrativeRepository(),j=prepareNarrativeJob(input());r.enqueue(worker,j);
 const v=await r.generate(worker,j,async x=>({...await author(x),text:['Herida inventada',{checkSlot:'social'}]}));
 assert.throws(()=>r.approved(reader(j),j),/unapproved/);
 assert.equal((await r.review(reviewer,j,v.revision,async()=>({...await approve(),fidelity:false}))).status,'rejected');
 assert.equal(r.coverage(worker,[j]).narrativeReady,false);
 assert.throws(()=>r.approved(reader(j),j),/unapproved/);
});
test('private input rejected and worker/player scope isolated',async()=>{
 const r=new NarrativeRepository(),j=prepareNarrativeJob(input());
 assert.throws(()=>prepareNarrativeJob({...input(),seed:'private'}),/schema/);
 const raw=input();raw.context.agenda='private';assert.throws(()=>prepareNarrativeJob(raw),/schema/);
 const roll=input();roll.checks[0].roll=42;assert.throws(()=>prepareNarrativeJob(roll),/schema/);
 assert.throws(()=>r.enqueue({...worker,campaignId:'other'},j),/denied/);
 assert.throws(()=>r.enqueue({...worker,role:'player'},j),/denied/);
 await publish(r,j);
 const visible=r.approved(reader(j),j);
 assert.deepEqual(Object.keys(visible).sort(),['locale','revision','text','title']);
 assert.deepEqual(Object.keys(authoringInput(j)).sort(),['checks','context','facts','locale','options','versions']);
 assert.throws(()=>r.approved({...reader(j),role:'player'},j),/denied/);
 assert.throws(()=>r.approved(reader(j),{...j,contextHash:'tampered'}),/integrity/);
});
test('language and version changes invalidate exact cache; stale review rejected',async()=>{
 const r=new NarrativeRepository(),j=prepareNarrativeJob(input());r.enqueue(worker,j);
 const v=await r.generate(worker,j,author);
 await assert.rejects(r.review(reviewer,j,v.revision-1,approve),/Stale/);
 await r.review(reviewer,j,v.revision,approve);
 const raw=input();raw.locale='en-US';const english=prepareNarrativeJob(raw);
 assert.throws(()=>r.approved(reader(english),english),/missing/);
 const changed=input();changed.versions.rules='r2';const update=prepareNarrativeJob(changed);
 assert.throws(()=>r.approved(reader(update),update),/missing/);
 assert.throws(()=>r.coverage(worker,[]),/manifest/);
});
