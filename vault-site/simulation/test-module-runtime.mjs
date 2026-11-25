import test from 'node:test';
import assert from 'node:assert/strict';
import {initialWorld} from './world-pilot.mjs';
import {snapshot,effective} from './world-context.mjs';
import {galahadSheet} from '../public/laboratorio/character-sheet.mjs';
import {createState,playerState,confirmCommand,previewCommand,prepareWindow,impactForConfirmed} from './campaign-state.mjs';
import {FirestoreCampaignStore} from './firestore-campaign-store.mjs';
import {randomUUID} from 'node:crypto';
const intent=(id,capability,extra={})=>({id,capability,locationId:'stormkeep',status:'active',seconds:15,requires:[],knownEvidence:[],...extra});
const definition=()=>({schemaVersion:1,id:'test.module',version:'test-v1',mode:'mechanical-fixture',evidence:[{id:'manifest',description:'Manifest evidence authorized for this fixture.'},{id:'hidden',description:'PRIVATE-UNOBSERVED'}],intents:[
 intent('accept','module-accept',{status:'offered'}),intent('decline','module-decline',{status:'offered'}),
 intent('dialogue','dialogue',{targetId:'test.npc',evidenceId:'manifest'}),
 intent('inspect','inspect',{evidenceId:'hidden',difficulty:'hard'}),
 intent('negotiate','negotiate',{targetId:'test.npc',difficulty:'standard'}),
 intent('report','report',{targetId:'test.npc',evidenceId:'manifest',knownEvidence:['manifest']}),
 intent('offer','offer-resource',{targetId:'test.npc',itemId:'rations',quantity:1}),
 intent('transfer','transfer-cargo',{targetId:'test.npc',cargoId:'test.cargo',ownerId:'test.npc',fromId:'test.npc',toId:'galahad',quantity:3,authorization:'fixture-explicit-consent',requires:['report']}),
 intent('close','module-close',{requires:['transfer']}),intent('withdraw','module-withdraw')
]});
function fixture(def=definition(),campaignId='test-module',seed='test-module-seed'){
 const w=initialWorld(),base=snapshot({canon:w.canon,nodes:Object.values(w.nodes),routes:Object.values(w.routes),entities:[...Object.values(w.entities),
 {id:'test.npc',kind:'npc',name:'Test actor',locationId:'stormkeep',visibility:'public'},
 {id:'test.cargo',kind:'item',name:'Test cargo',locationId:'stormkeep',visibility:'known',privateState:{cargo:{ownerId:'test.npc',total:5,allocations:{'test.npc':5}}}}
 ]});
 const state=createState(base,{id:campaignId,actorId:'galahad',actorSheets:[galahadSheet()],seed,moduleDefinition:def});
 return {base,state,access:{campaignId,actorId:'galahad',role:'player'}};
}
const command=(s,i,commandId='cmd-'+i)=>({campaignId:s.id,actorId:s.actorId,expectedRevision:s.delta.revision,commandId,action:'module-intent',intentId:i});
const options=(b,s,a)=>playerState(b,s,a).actions.filter(x=>x.action==='module-intent').map(x=>x.intentId);
const apply=(b,s,a,i)=>confirmCommand(b,s,a,command(s,i));
const ledger=(b,s)=>effective(b,s.delta).entities['test.cargo'].privateState.cargo;
test('reject proposals, cycles, missing evidence and unauthorized cargo definitions',()=>{
 const d=definition();assert.throws(()=>fixture({...d,mode:'proposal'}),/Only mechanical fixture/);
 const cycle=definition();cycle.intents.find(i=>i.id==='report').requires=['close'];assert.throws(()=>fixture(cycle),/cycle/);
 const wrong=definition();wrong.intents.find(i=>i.id==='transfer').authorization='guessed';assert.throws(()=>fixture(wrong),/authorization/);
 const report=definition();report.intents.find(i=>i.id==='report').knownEvidence=[];assert.throws(()=>fixture(report),/observed evidence/);
});
test('contract lifecycle, knowledge gates and no speculative publication',()=>{
 const {base,state,access}=fixture();
 assert.deepEqual(options(base,state,access),['accept','decline']);
 assert.throws(()=>apply(base,state,access,'close'),/Action not allowed/);
 const decline=apply(base,state,access,'decline').state;assert.equal(playerState(base,decline,access).module.status,'declined');assert.deepEqual(options(base,decline,access),[]);
 let s=apply(base,state,access,'accept').state;
 assert.ok(!options(base,s,access).includes('report'));
 const p=previewCommand(base,s,{...access,role:'worker'},command(s,'dialogue'));
 assert.throws(()=>playerState(base,p.state,access),/Invalid state/);
 assert.equal(playerState(base,s,access).module.evidence.length,0);
 s=apply(base,s,access,'dialogue').state;
 assert.deepEqual(playerState(base,s,access).module.evidence.map(e=>e.id),['manifest']);
 assert.ok(options(base,s,access).includes('report'));assert.ok(!options(base,s,access).includes('transfer'));
 const j=JSON.stringify(playerState(base,s,access));assert.ok(!j.includes('PRIVATE-UNOBSERVED'));assert.ok(!j.includes('allocations'));
 const w=apply(base,s,access,'withdraw').state;assert.equal(playerState(base,w,access).module.status,'withdrawn');assert.deepEqual(options(base,w,access),[]);
});
test('reported evidence, conservation of cargo, explicit authorization, and closure exactly once',()=>{
 const {base,state,access}=fixture();let s=apply(base,state,access,'accept').state;s=apply(base,s,access,'dialogue').state;
 const report=apply(base,s,access,'report');s=report.state;
 const packet=impactForConfirmed(base,s,{...access,role:'analyst'},report.receipt.event.id);
 assert.equal(packet.candidates.find(x=>x.entityId==='test.npc').knowledge[0].source,'delivered');
 const c=command(s,'transfer'),r=confirmCommand(base,s,access,c);
 assert.deepEqual(ledger(base,s).allocations,{'test.npc':5});
 assert.deepEqual(ledger(base,r.state).allocations,{'test.npc':2,galahad:3});assert.equal(ledger(base,r.state).ownerId,'test.npc');
 assert.equal(confirmCommand(base,r.state,access,c).duplicate,true);
 assert.throws(()=>apply(base,r.state,access,'transfer'),/Command ID reused/);
 const close=apply(base,r.state,access,'close');assert.equal(playerState(base,close.state,access).module.status,'closed');
 assert.deepEqual(options(base,close.state,access),[]);assert.ok(playerState(base,close.state,access).actions.some(x=>x.action==='consume-ration'));
});
test('negotiation is a real check, not consent; offering does not debit resources',()=>{
 const {base,state,access}=fixture(),s=apply(base,state,access,'accept').state;
 const n=apply(base,s,access,'negotiate');
 assert.equal(n.receipt.event.checks.length,1);assert.equal(n.receipt.event.checks[0].skillId,'influence');
 assert.ok(!options(base,n.state,access).includes('transfer'));
 const o=apply(base,n.state,access,'offer');
 assert.equal(playerState(base,o.state,access).sheet.inventory.find(i=>i.id==='rations').quantity,3);
 assert.equal(o.receipt.event.facts[0].kind,'resource-offered');
 assert.deepEqual(ledger(base,o.state),ledger(base,s));
});
test('inspection success reveals evidence; failure does not; no repeat farming',()=>{
 let failed=false,passed=false;
 for(let k=0;k<30&&!(failed&&passed);k++){
  const {base,state,access}=fixture(definition(),'test-module','seed-'+k),s=apply(base,state,access,'accept').state,r=apply(base,s,access,'inspect');
  const success=['success','critical'].includes(r.receipt.event.checks[0].outcome);
  assert.equal(playerState(base,r.state,access).module.evidence.some(e=>e.id==='hidden'),success);
  assert.ok(!options(base,r.state,access).includes('inspect'));
  if(success)passed=true;else failed=true;
 }assert.ok(failed&&passed);
});
test('module windows preserve version and do not publish other branches',()=>{
 const {base,state,access}=fixture(),w=prepareWindow(base,state,{...access,role:'worker'},{maxDepth:2,maxEdges:40});
 const edge=w.nodes[0].choices.find(x=>x.command.intentId==='accept');
 const job=w.jobs.find(j=>j.eventId===edge.eventId);
 assert.equal(job.moduleVersion,'test-v1');assert.equal(job.input.event.intentId,'accept');
 assert.ok(!JSON.stringify(job).includes('PRIVATE-UNOBSERVED'));
 const r=confirmCommand(base,state,access,edge.command,{expectedPreviewHash:edge.previewHash});
 assert.equal(r.receipt.event.id,job.eventId);assert.equal(playerState(base,r.state,access).module.status,'active');
});
test('module state and cargo recover from Firestore', {skip:!process.env.FIRESTORE_EMULATOR_HOST},async()=>{
 const {base,state,access}=fixture(definition(),'qa07-'+randomUUID()),principal={...access,uid:'fixture-owner'},store=new FirestoreCampaignStore();
 await store.create(base,state,{ownerUid:principal.uid});let v=await store.view(principal);
 for(const i of ['accept','dialogue','report','transfer','close']){
  const r=await store.confirm(principal,{campaignId:v.campaignId,actorId:v.actorId,commandId:'test-'+i,expectedRevision:v.revision,action:'module-intent',intentId:i});v=r.view;
 }
 const reopened=new FirestoreCampaignStore();assert.deepEqual(await reopened.view(principal),v);assert.equal(v.module.status,'closed');
 const row=await reopened.read(state.id);assert.deepEqual(ledger(row.base,row.state).allocations,{'test.npc':2,galahad:3});
});

test('pre-contract dialogue and successful check dependencies do not imply consent',()=>{
 const d=definition();d.intents.push(intent('terms','dialogue',{status:'offered',targetId:'test.npc',evidenceId:'manifest'}));
 d.intents.find(i=>i.id==='transfer').requiresSuccess=['negotiate'];
 let passed=false,failed=false;
 for(let k=0;k<40&&!(passed&&failed);k++){
  const {base,state,access}=fixture(d,'test-module','check-'+k);
  assert.ok(options(base,state,access).includes('terms'));
  let s=apply(base,state,access,'terms').state;
  s=apply(base,s,access,'accept').state;s=apply(base,s,access,'report').state;
  assert.ok(!options(base,s,access).includes('transfer'));
  const r=apply(base,s,access,'negotiate');
  const success=['success','critical'].includes(r.receipt.event.checks[0].outcome);
  assert.equal(options(base,r.state,access).includes('transfer'),success);
  assert.deepEqual(ledger(base,r.state),ledger(base,s));
  if(success)passed=true;else failed=true;
 }assert.ok(passed&&failed);
});
test('same authoring intent may bind to different sites; distinct terminal receipts enforce cargo conditions',()=>{
 const w=initialWorld(),base=snapshot({canon:w.canon,nodes:[...Object.values(w.nodes),{id:'test.site',kind:'site',name:'Second site',parentId:'stormkeep',generation:'visitable',visibility:'public'}],routes:[...Object.values(w.routes),{id:'test.route',a:'stormkeep',b:'test.site',status:'open',minutes:2,visibility:'public'}],entities:[...Object.values(w.entities),
 {id:'test.npc',kind:'npc',name:'Test actor',locationId:'stormkeep',visibility:'public'},
 {id:'test.cargo',kind:'item',name:'Test cargo',locationId:'stormkeep',visibility:'known',privateState:{cargo:{ownerId:'test.npc',total:5,allocations:{'test.npc':5}}}}
 ]});
 const d=definition();d.intents.find(i=>i.id==='withdraw').authoringIntentId='withdraw-anywhere';
 d.intents.push(intent('withdraw-site','module-withdraw',{locationId:'test.site',authoringIntentId:'withdraw-anywhere'}));
 const close=d.intents.find(i=>i.id==='close');close.locationId='test.site';close.endingId='transfer-completed';close.cargoRequirements=[{cargoId:'test.cargo',custodianId:'galahad',quantity:3}];
 d.intents.push(intent('close-impossible','module-close',{locationId:'test.site',requires:['transfer'],endingId:'all-delivered',cargoRequirements:[{cargoId:'test.cargo',custodianId:'galahad',quantity:5}]}));
 const s=createState(base,{id:'multi-site',actorId:'galahad',actorSheets:[galahadSheet()],seed:'multi-site-seed',moduleDefinition:d});
 const access={campaignId:s.id,actorId:s.actorId,role:'player'};
 let current=apply(base,s,access,'accept').state;current=apply(base,current,access,'dialogue').state;current=apply(base,current,access,'report').state;current=apply(base,current,access,'transfer').state;
 assert.ok(!options(base,current,access).includes('close'));
 const travel={campaignId:s.id,actorId:s.actorId,expectedRevision:current.delta.revision,commandId:'travel-test-site',action:'travel',targetId:'test.site'};
 current=confirmCommand(base,current,access,travel).state;
 assert.ok(options(base,current,access).includes('withdraw-site'));assert.ok(!options(base,current,access).includes('withdraw'));assert.ok(!options(base,current,access).includes('close-impossible'));
 const r=apply(base,current,access,'close');assert.equal(playerState(base,r.state,access).module.endingId,'transfer-completed');assert.equal(r.receipt.event.facts[0].endingId,'transfer-completed');
});

test('horse check: prepare the chosen path, store D100, then commit without rolling again',()=>{
 const d=definition();
 const skill=(id,skillId,difficulty)=>intent(id,'skill-check',{challengeId:'test.horse',check:{skillId,difficulty,reason:'Caballo desbocado; prueba de integracion.'}});
 d.intents.push(skill('catch','brawn','hard'),skill('dodge','evade','standard'));
 d.intents.push(intent('close-catch','module-close',{requires:['catch'],requiresSuccess:['catch'],endingId:'caught'}));
 d.intents.push(intent('close-miss','module-close',{requires:['catch'],requiresFailure:['catch'],endingId:'missed'}));
 let passed=false,failed=false;
 for(let k=0;k<30&&!(passed&&failed);k++){
  const {base,state,access}=fixture(d,'horse-demo','horse-'+k),active=apply(base,state,access,'accept').state;
  const w=prepareWindow(base,active,{...access,role:'worker'},{maxDepth:1,maxEdges:100});
  const edge=w.nodes[0].choices.find(e=>e.command.intentId==='catch');
  const job=w.jobs.find(j=>j.eventId===edge.eventId),check=job.input.event.checks[0];
  assert.equal(check.base,26);assert.equal(check.target,17);assert.equal(check.skillId,'brawn');
  assert.throws(()=>confirmCommand(base,active,access,edge.command),/must be prepared/);
  const saved=JSON.parse(JSON.stringify(w.preparedTransitions[edge.command.commandId]));
  const bad=structuredClone(saved);bad.result.event.checks[0].roll=100;
  assert.throws(()=>confirmCommand(base,active,access,edge.command,{preparedTransition:bad}),/corrupted/);
  const r=confirmCommand(base,active,access,edge.command,{preparedTransition:saved,expectedPreviewHash:edge.previewHash});
  assert.deepEqual(r.receipt.event.checks,[check]);assert.equal(r.state.journal.at(-1).checks[0].roll,check.roll);
  assert.ok(!options(base,r.state,access).includes('dodge'));assert.ok(!options(base,r.state,access).includes('catch'));
  assert.equal(confirmCommand(base,r.state,access,edge.command).duplicate,true);
  const success=['success','critical'].includes(check.outcome);
  assert.equal(options(base,r.state,access).includes('close-catch'),success);
  assert.equal(options(base,r.state,access).includes('close-miss'),!success);
  assert.equal(apply(base,r.state,access,success?'close-catch':'close-miss').state.module.endingId,success?'caught':'missed');
  assert.ok(!JSON.stringify(playerState(base,r.state,access)).includes('preparedTransitions'));
  if(success)passed=true;else failed=true;
 }assert.ok(passed&&failed);
});

test('Firestore stores prepared skill branches; a new client selects without providing a roll', {skip:!process.env.FIRESTORE_EMULATOR_HOST},async()=>{
 const d=definition();d.intents.push(intent('catch','skill-check',{challengeId:'horse',check:{skillId:'brawn',difficulty:'hard',reason:'Prueba de aventura.'}}));
 const {base,state,access}=fixture(d,'qa-skill-'+randomUUID()),principal={...access,uid:'fixture-owner'},store=new FirestoreCampaignStore();
 await store.create(base,state,{ownerUid:principal.uid});const v=await store.view(principal);
 await store.confirm(principal,{campaignId:v.campaignId,actorId:v.actorId,commandId:'accept',expectedRevision:v.revision,action:'module-intent',intentId:'accept'});
 const window=await store.prepare({...principal,role:'worker'},{maxDepth:1,maxEdges:100});
 const edge=window.nodes[0].choices.find(x=>x.command.intentId==='catch'),job=window.jobs.find(x=>x.eventId===edge.eventId);
 const fresh=new FirestoreCampaignStore(),r=await fresh.confirm(principal,edge.command);
 assert.deepEqual(r.receipt.event.checks,job.input.event.checks);
 assert.equal((await fresh.confirm(principal,edge.command)).duplicate,true);
 assert.ok(!JSON.stringify(r).includes('private-prepared-transition'));
});
