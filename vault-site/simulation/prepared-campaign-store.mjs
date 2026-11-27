// SYS-06: bounded private records, CAS and immutable artifacts. Server-only.
import {createHash} from 'node:crypto';
import {FirestoreCampaignStore} from './firestore-campaign-store.mjs';
const need=(v,m)=>{if(!v)throw Error(m)};
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,120}$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
const digest=s=>createHash('sha256').update(s).digest('hex');
const serialize=x=>{const data=JSON.stringify(x);need(typeof data==='string'&&Buffer.byteLength(data,'utf8')<=500000,'Private record capacity exceeded');return data};
const conflict=e=>[409,412].includes(e?.httpStatus)||['ALREADY_EXISTS','FAILED_PRECONDITION','ABORTED'].includes(e?.message);
const worker=(s,c)=>need(s?.role==='worker'&&s.campaignId===c&&typeof s.uid==='string'&&s.uid,'Worker access required');
function artifactPath(scope,{kind,key,version}){worker(scope,scope?.campaignId);need(id(scope.campaignId)&&['edition','branch','fragment'].includes(kind)&&id(key)&&id(version),'Invalid artifact address');return '/sys06_prepared/'+scope.campaignId+'/artifacts/'+kind+'-'+key+'/versions/'+version}
function sessionPath(c){need(id(c),'Invalid campaign ID');return '/sys06_prepared_sessions/'+c}
function ports({read,write}){
 return Object.freeze({
  async read(c){return read(sessionPath(c))},
  async create(c,row){return write(sessionPath(c),serialize(row),null)},
  async cas(c,row,version){need(version!==null&&version!==undefined,'Missing CAS version');return write(sessionPath(c),serialize(row),version)},
  async put(scope,item){
   const path=artifactPath(scope,item),data=serialize(item.payload),hash=digest(data);
   if(await write(path,serialize({digest:hash,data}),null))return {digest:hash,duplicate:false};
   const old=await read(path);need(old?.value.digest===hash&&old.value.data===data,'Immutable version conflict');return {digest:hash,duplicate:true};
  },
  async get(scope,item){
   const row=await read(artifactPath(scope,item));if(!row)return null;
   need(typeof row.value.data==='string'&&digest(row.value.data)===row.value.digest,'Artifact integrity failure');
   return {kind:item.kind,key:item.key,version:item.version,digest:row.value.digest,payload:JSON.parse(row.value.data)};
  }
 });
}
// Reuse existing emulator-only transport and its isolated demo restriction.
export function createEmulatedPreparedStore(options={}){
 const fs=new FirestoreCampaignStore(options);
 return ports({
  async read(path){try{const d=await fs.request(path);return {value:JSON.parse(d.fields.payload.stringValue),version:d.updateTime}}catch(e){if(e.httpStatus===404)return null;throw e}},
  async write(path,data,version){try{await fs.request(':commit',{method:'POST',body:{writes:[{update:{name:fs.prefix+path,fields:{payload:{stringValue:data}}},currentDocument:version===null?{exists:false}:{updateTime:version}}]}});return true}catch(e){if(conflict(e))return false;throw e}}
 });
}
// Explicitly isolated staging only, injected initialized Admin app. No credentials here.
export function createAdminPreparedStore({app,getFirestore,authorizedProjectId,environment}={}){
 need(environment==='staging'&&typeof authorizedProjectId==='string'&&authorizedProjectId.startsWith('pocketdm-staging-')&&app?.options?.projectId===authorizedProjectId&&typeof getFirestore==='function','Explicit isolated staging required');
 const db=getFirestore(app);need(typeof db?.doc==='function'&&typeof db?.runTransaction==='function','Admin Firestore required');
 const doc=p=>db.doc(p.slice(1));
 return ports({
  async read(path){const s=await doc(path).get();if(!s.exists)return null;const d=s.data();return {value:JSON.parse(d.payload),version:d.version}},
  async write(path,payload,expected){const ref=doc(path);return db.runTransaction(async tx=>{const s=await tx.get(ref);if(expected===null?s.exists:!s.exists||s.data().version!==expected)return false;const version=expected===null?1:expected+1;need(Number.isSafeInteger(version),'Invalid store version');if(expected===null)tx.create(ref,{payload,version});else tx.set(ref,{payload,version});return true})}
 });
}
