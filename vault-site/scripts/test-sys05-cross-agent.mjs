// Run explicitly in an isolated composite checkout containing SYS-04, SYS-05 and SYS-06.
// No SDK, cloud or source adventure required. Uses actual candidate compiler/store with synthetic bindings.
import test from 'node:test';
import assert from 'node:assert/strict';
import {compileBoundEdition,startBoundEdition,confirmBoundChoice} from '../simulation/bound-adventure-compiler.mjs';
import {createPrivatePreparationStore} from '../simulation/private-preparation-store.mjs';
import {NarrativeRepository} from '../simulation/narrative-repository.mjs';
import {narrativeManifest,persistApprovedNarration,confirmedNarrativeFragment} from '../simulation/narrative-integration.mjs';
test('SYS-04/05/06 composite: two prepared routes, one approved fragment per branch, exact immutable read',async()=>{
 let preparations=0;
 const edition=compileBoundEdition({
  module:{mode:'mechanical-fixture',id:'synthetic-guard',version:'1',intentIds:['talk','leave'],endingIds:['allowed','withdrawn']},
  initial:{revision:0,status:'offered',private:'private-marker'},
  bindings:{
   enumerate:s=>s.status==='offered'?[{intentId:'talk'},{intentId:'leave'}]:[],
   ending:s=>s.status==='offered'?null:s.status,
   prepare:(s,a,{branchId})=>{
    preparations++;
    const status=a.intentId==='talk'?'allowed':'withdrawn';
    const checks=a.intentId==='talk'?[{schemaVersion:1,id:branchId+'.social',actorId:'actor-a',actorName:'Viajero',skillId:'influence',skillName:'Influencia',base:60,target:60,difficulty:'Estándar',reason:'Identificación',dice:'D100',roll:42,outcome:'success',visibility:'player'}]:[];
    return {state:{...s,status,revision:1},event:{id:branchId,revision:1,action:'module-intent',facts:[{kind:status}],checks},context:{intent:a.intentId,private:'private-marker'},slotId:'dialogue-'+a.intentId};
   }
  }
 });
 const worker={role:'worker',uid:'qa-worker',campaignId:'campaign-a',editionId:edition.editionId};
 const items=narrativeManifest({edition,campaignId:worker.campaignId,actorId:'actor-a',versions:{module:'1',rules:'r1',canon:'synthetic',context:'c1',narrator:'n1'},projectVisible:edge=>{
  const talk=edge.action.intentId==='talk';
  return {context:{actorVisible:'Viajero',npcVisible:'Guardia alerta',place:'Puerta',time:'Mañana',known:[],intent:edge.action.intentId},facts:[{id:'reaction',text:talk?'El guardia permite pasar':'El viajero se retira'}],options:[],event:edge.event};
 }});
 const rows=new Map();
 const ref=path=>({path,collection:k=>ref(path+'/'+k),doc:k=>ref(path+'/'+k),get:async()=>({exists:rows.has(path),data:()=>rows.get(path)})});
 const db={collection:k=>ref(k),runTransaction:async fn=>fn({get:r=>r.get(),create:(r,v)=>{assert.ok(!rows.has(r.path));rows.set(r.path,v)}})};
 const config={app:{options:{projectId:'pocketdm-staging-test'}},getFirestore:()=>db,authorizedProjectId:'pocketdm-staging-test',environment:'staging'};
 const store=createPrivatePreparationStore(config),repository=new NarrativeRepository(),pins=new Map();
 assert.equal(items.length,2);assert.equal(preparations,2);
 for(const {job} of items){
  repository.enqueue(worker,job);
  const version=await repository.generate(worker,job,async x=>{assert.ok(!JSON.stringify(x).includes('private-marker'));return {title:'Puerta',text:[x.facts[0].text,...x.checks.map(c=>({checkSlot:c.slotId}))],factIds:x.facts.map(f=>f.id),optionIds:[]}});
  await repository.review({...worker,role:'reviewer'},job,version.revision,async()=>({fidelity:true,privacy:true,checks:true,reviewId:'qa-review'}));
  pins.set(job.branchId,await persistApprovedNarration({repository,store,scope:worker,job}));
 }
 assert.equal(repository.coverage(worker,items.map(x=>x.job)).narrativeReady,true);
 const reopened=createPrivatePreparationStore(config);
 for(const {job,binding} of items){
  const result=confirmBoundChoice(edition,startBoundEdition(edition),{commandId:'cmd-'+job.branchId,expectedRevision:0,branchId:job.branchId});
  const confirmed={branchId:job.branchId,campaignId:worker.campaignId,editionId:edition.editionId,actorId:'actor-a',event:result.event};
  const f=await confirmedNarrativeFragment({store:reopened,scope:worker,job,binding,reference:pins.get(job.branchId),confirmed});
  assert.equal(f.status,'approved');assert.equal(f.text.filter(x=>typeof x!=='string').length,result.event.checks.length);
  assert.ok(!JSON.stringify(f).includes('private-marker'));
 }
 assert.equal(preparations,2);assert.equal(rows.size,2);assert.equal(edition.publicationReady,false);
});
