import test from 'node:test';
import assert from 'node:assert/strict';
import {createCampaignHttp} from './campaign-http.mjs';
import {createPrivatePreparationStore} from './private-preparation-store.mjs';
const scope={uid:'user-a',campaignId:'campaign-a',actorId:'actor-a',role:'player'};
const event={id:'evt-1',revision:1,action:'consume-ration'};
const view={schemaVersion:1,campaignId:scope.campaignId,actorId:scope.actorId,revision:1,actions:[],journal:[event],seed:'PRIVATE-SEED'};
const verifyIdToken=async(token,revoked)=>{assert.equal(revoked,true);if(token!=='valid')throw Error('private');return {uid:scope.uid,role:'admin'};};
const lookupGrant=async(uid,campaignId)=>uid===scope.uid&&campaignId===scope.campaignId?scope:null;
const make=(player={})=>createCampaignHttp({verifyIdToken,lookupGrant,player});
const request=(path='',{method='GET',token='valid',payload}={})=>new Request('https://fixture.invalid/api/campaigns/campaign-a'+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(payload!==undefined?{'Content-Type':'application/json'}:{})},...(payload!==undefined?{body:JSON.stringify(payload)}:{})});
test('identity and grants; authorized view strips private top-level data',async()=>{
 const handle=make({view:async s=>{assert.deepEqual(s,scope);return view;}});
 assert.equal((await handle(request('',{token:null}))).status,401);
 assert.equal((await handle(request('',{token:'forged'}))).status,401);
 assert.equal((await handle(new Request('https://fixture.invalid/api/campaigns/campaign-b',{headers:{Authorization:'Bearer valid'}}))).status,404);
 const res=await handle(request());assert.equal(res.status,200);assert.equal(res.headers.get('cache-control'),'private, no-store');assert.equal((await res.json()).seed,undefined);
 const opts=await handle(request('/options'));assert.deepEqual(await opts.json(),{campaignId:scope.campaignId,actorId:scope.actorId,revision:1,actions:[]});
});
test('command fields, confirmed receipt and fail-closed prepared authority',async()=>{
 const payload={commandId:'cmd-1',expectedRevision:0,action:'consume-ration'};
 assert.equal((await make()(request('/commands',{method:'POST',payload}))).status,503);
 let calls=0;const handle=make({confirmPrepared:async(s,c)=>{calls++;assert.deepEqual(s,scope);assert.deepEqual(c,{...payload,campaignId:scope.campaignId,actorId:scope.actorId});return {duplicate:false,receipt:{commandId:c.commandId,revision:1,event,fingerprint:'PRIVATE'},view};}});
 for(const bad of [{seed:'bad'},{actorId:'actor-b'},{roll:1},{role:'worker'},{expectedPreviewHash:'private'}])assert.equal((await handle(request('/commands',{method:'POST',payload:{...payload,...bad}}))).status,400);
 assert.equal(calls,0);
 const res=await handle(request('/commands',{method:'POST',payload}));assert.equal(res.status,200);const result=await res.json();assert.equal(result.receipt.fingerprint,undefined);assert.equal(result.view.seed,undefined);assert.equal(calls,1);
 const conflict=make({confirmPrepared:async()=>{throw Object.assign(Error('PRIVATE'),{code:'REVISION_CONFLICT'});}});
 const r=await conflict(request('/commands',{method:'POST',payload}));assert.equal(r.status,409);assert.deepEqual(await r.json(),{error:'REVISION_CONFLICT'});
});
test('start is assigned by server and rejects player-authored body',async()=>{
 const handle=make({start:async s=>{assert.deepEqual(s,scope);return view;}});
 assert.equal((await handle(request('/start',{method:'POST',payload:{edition:'x'}}))).status,400);
 assert.equal((await handle(request('/start',{method:'POST'}))).status,200);
 assert.equal((await handle(request('/start'))).status,405);
});
test('private artifact version isolation and immutability with fake Admin SDK',async()=>{
 const rows=new Map();
 const ref=path=>({collection:k=>ref(path+'/'+k),doc:k=>ref(path+'/'+k),path,get:async()=>({exists:rows.has(path),data:()=>rows.get(path)})});
 const db={collection:k=>ref(k),runTransaction:async fn=>fn({get:r=>r.get(),create:(r,v)=>{assert.ok(!rows.has(r.path));rows.set(r.path,v);}})};
 const config={app:{options:{projectId:'pocketdm-staging-test'}},getFirestore:()=>db,authorizedProjectId:'pocketdm-staging-test',environment:'staging'};
 assert.throws(()=>createPrivatePreparationStore({...config,environment:'production'}));
 const store=createPrivatePreparationStore(config),worker={...scope,role:'worker'},item={kind:'fragment',key:'branch-a',version:'v1',payload:{text:'synthetic'}};
 await assert.rejects(store.put(scope,item));
 assert.equal((await store.put(worker,item)).duplicate,false);
 assert.equal((await store.put(worker,item)).duplicate,true);
 await assert.rejects(store.put(worker,{...item,payload:{text:'other'}}),/Immutable version conflict/);
 assert.deepEqual((await store.get(worker,item)).payload,item.payload);
 assert.equal(await store.get({...worker,campaignId:'campaign-b'},item),null);
});

test('mismatched receipt and unexpected errors fail closed',async()=>{
 const payload={commandId:'cmd-1',expectedRevision:0,action:'consume-ration'};
 const mismatch=make({confirmPrepared:async()=>({duplicate:false,receipt:{commandId:'cmd-2',revision:1,event},view})});
 assert.equal((await mismatch(request('/commands',{method:'POST',payload}))).status,503);
 const unknown=make({view:async()=>{throw Object.assign(Error('PRIVATE'),{code:'constructor'});}});
 const r=await unknown(request());assert.equal(r.status,500);assert.deepEqual(await r.json(),{error:'INTERNAL_ERROR'});
});
