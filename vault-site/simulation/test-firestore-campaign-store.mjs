import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {FirestoreCampaignStore} from './firestore-campaign-store.mjs';
import {initialWorld} from './world-pilot.mjs';
import {snapshot} from './world-context.mjs';
import {createState} from './campaign-state.mjs';
import {galahadSheet,wolfSheet} from '../public/laboratorio/character-sheet.mjs';
const host=process.env.FIRESTORE_EMULATOR_HOST;
const run=(name,fn)=>test(name,{skip:!host?'Run with isolated Firestore emulator':false,timeout:20000},fn);
const store=()=>new FirestoreCampaignStore({host});
async function fixture(){
 const w=initialWorld(),base=snapshot({canon:w.canon,nodes:Object.values(w.nodes),entities:[...Object.values(w.entities),{id:'wolf-1',kind:'creature',name:'Lobo',locationId:'stormkeep',visibility:'public',privateState:{secret:'PRIVATE-NPC'}}],routes:[...Object.values(w.routes),{id:'qa03.hub-route',a:'stormkeep',b:'hex.0.0',status:'open',minutes:15,visibility:'public'}]});
 const campaignId='qa03-'+randomUUID(),uid='user-'+randomUUID(),actorId='galahad',principal={campaignId,uid,actorId,role:'player'};
 const state=createState(base,{id:campaignId,actorId,actorSheets:[galahadSheet(),wolfSheet()],encounters:[{id:'qa03.duel',opponentId:'wolf-1',locationId:'stormkeep',maxRounds:12}],seed:'PRIVATE-SEED-'+randomUUID(),knownIds:['wolf-1','hex.0.0']});
 await store().create(base,state,{ownerUid:uid});
 return {base,state,principal};
}
const cmd=(v,action,extra={},commandId='cmd-1')=>({campaignId:v.campaignId,actorId:v.actorId,expectedRevision:v.revision,action,commandId,...extra});
const rations=v=>v.sheet.inventory.find(i=>i.id==='rations')?.quantity??0;
function noPrivate(x){const s=JSON.stringify(x);for(const k of ['PRIVATE-','privateState','seed','fingerprint','completedEncounters','ownerUid','receipts'])assert.equal(s.includes(k),false,k)}
test('cannot configure production Firestore or remote hosts',()=>{
 assert.throws(()=>new FirestoreCampaignStore({host:'firestore.googleapis.com:443'}),/Local emulator/);
 assert.throws(()=>new FirestoreCampaignStore({host:'localhost:18083',project:'lore-weaver-rt9pc'}),/isolated QA/);
});
run('restart client in new Node process: recover location, inventory, journal and choices',async()=>{
 const {principal,base,state}=await fixture();const s=store(),v=await s.view(principal);
 await assert.rejects(s.create(base,state,{ownerUid:principal.uid}));
 const r=await s.confirm(principal,cmd(v,'consume-ration'));
 const t=await s.confirm(principal,cmd(r.view,'travel',{targetId:'hex.0.0'},'cmd-2'));
 const child=spawnSync(process.execPath,['--input-type=module','-e',"import {FirestoreCampaignStore} from './simulation/firestore-campaign-store.mjs';const s=new FirestoreCampaignStore();console.log(JSON.stringify(await s.view(JSON.parse(process.argv[1]))))",JSON.stringify(principal)],{encoding:'utf8',env:{...process.env,FIRESTORE_EMULATOR_HOST:host}});
 assert.equal(child.status,0,child.stderr);assert.deepEqual(JSON.parse(child.stdout),t.view);
 assert.equal(rations(t.view),2);assert.equal(t.view.locationId,'hex.0.0');assert.equal(t.view.elapsedSeconds,960);assert.equal(t.view.journal.length,2);noPrivate(t);
});
run('concurrent distinct commands at same revision: one commits; one conflicts',async()=>{
 const {principal}=await fixture(),v=await store().view(principal);
 const a=cmd(v,'consume-ration',{},'cmd-a'),b=cmd(v,'travel',{targetId:'hex.0.0'},'cmd-b');
 const results=await Promise.allSettled([store().confirm(principal,a),store().confirm(principal,b)]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
 assert.match(results.find(r=>r.status==='rejected').reason.message,/Revision conflict/);
 const after=await store().view(principal);assert.equal(after.revision,v.revision+1);assert.equal(after.journal.length,1);
 assert.equal((await store().confirm(principal,results[0].status==='fulfilled'?a:b)).duplicate,true);
});
run('concurrent identical commands are idempotent across independent clients',async()=>{
 const {principal}=await fixture(),v=await store().view(principal),c=cmd(v,'consume-ration');
 const [a,b]=await Promise.all([store().confirm(principal,c),store().confirm(principal,c)]);
 assert.equal(Number(a.duplicate)+Number(b.duplicate),1);assert.deepEqual(a.receipt,b.receipt);
 assert.equal(rations(await store().view(principal)),2);
});
run('lost response after commit: retry recovers receipt; failed write leaves state unchanged',async()=>{
 const {principal}=await fixture(),v=await store().view(principal),c=cmd(v,'consume-ration');
 const broken=new FirestoreCampaignStore({host,fetchImpl:async(url,opts)=>{
  if(url.endsWith(':commit'))throw Error('before commit');return fetch(url,opts);
 }});
 await assert.rejects(broken.confirm(principal,c),/before commit/);assert.deepEqual(await store().view(principal),v);
 const lost=new FirestoreCampaignStore({host,fetchImpl:async(url,opts)=>{
  const r=await fetch(url,opts);if(url.endsWith(':commit')&&r.ok)throw Error('response lost');return r;
 }});
 await assert.rejects(lost.confirm(principal,c),/response lost/);
 const again=await store().confirm(principal,c);assert.equal(again.duplicate,true);assert.equal(rations(again.view),2);assert.equal(again.view.journal.length,1);
 await assert.rejects(store().confirm(principal,{...c,action:'travel',targetId:'hex.0.0'}),/Command ID reused/);
});
run('preview, duel, and campaign isolation; no private data in projected results',async()=>{
 const {principal}=await fixture(),other=await fixture(),s=store(),v=await s.view(principal),c=cmd(v,'duel',{encounterId:'qa03.duel'});
 await assert.rejects(s.preview(principal,c),/Worker access required/);
 const p=await s.preview({...principal,role:'worker'},c);
 assert.deepEqual(await s.view(principal),v);
 const d=await s.confirm(principal,c,{expectedPreviewHash:p.previewHash});
 assert.equal(d.view.revision,v.revision+1);assert.ok(d.receipt.event.checks.length>0);noPrivate(d);
 assert.equal((await s.view(other.principal)).journal.length,0);
 await assert.rejects(s.view({...principal,uid:other.principal.uid}),/Access denied/);
 await assert.rejects(s.confirm({...principal,uid:other.principal.uid},c),/Access denied/);
});
run('Firestore rules deny unauthenticated client reads, listing and writes',async()=>{
 const {principal}=await fixture(),root='http://'+host+'/v1/projects/demo-pocketdm-qa03/databases/(default)/documents/qa_campaigns',url=root+'/'+principal.campaignId;
 for(const r of [await fetch(url),await fetch(root),await fetch(url,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{ownerUid:{stringValue:'attacker'}}})})])assert.equal(r.status,403,await r.text());
});
