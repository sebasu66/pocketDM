// SYS-06: private immutable version records via injected Firebase Admin SDK.
import {createHash} from 'node:crypto';
const kinds=new Set(['edition','branch','fragment']);
const id=s=>typeof s==='string'&&/^[a-z][a-z0-9_.-]{0,100}$/.test(s)&&!['constructor','prototype','__proto__'].includes(s);
const hash=s=>createHash('sha256').update(s).digest('hex');
// No SDK installation, credentials, cloud default, or production route in this candidate.
// Caller must initialize an explicitly authorized isolated staging Admin app.
export function createPrivatePreparationStore({app,getFirestore,authorizedProjectId,environment}={}){
 if(environment!=='staging'||typeof authorizedProjectId!=='string'||!authorizedProjectId.startsWith('pocketdm-staging-')||app?.options?.projectId!==authorizedProjectId||typeof getFirestore!=='function')throw Error('Explicit isolated staging project required');
 const db=getFirestore(app);
 if(!db||typeof db.collection!=='function'||typeof db.runTransaction!=='function')throw Error('Admin Firestore required');
 function ref(scope,kind,key,version){
  if(scope?.role!=='worker'||!id(scope.campaignId)||typeof scope.uid!=='string'||!scope.uid||!kinds.has(kind)||!id(key)||!id(version))throw Error('Private worker scope required');
  return db.collection('sys06_private_campaigns').doc(scope.campaignId).collection(kind).doc(key).collection('versions').doc(version);
 }
 return Object.freeze({
  async put(scope,{kind,key,version,payload}){
   const doc=ref(scope,kind,key,version),data=JSON.stringify(payload);
   if(typeof data!=='string'||Buffer.byteLength(data,'utf8')>500000)throw Error('Invalid or oversized preparation artifact');
   const digest=hash(data);
   return db.runTransaction(async tx=>{
    const existing=await tx.get(doc);
    if(existing.exists){if(existing.data().digest!==digest||existing.data().payload!==data)throw Error('Immutable version conflict');return {digest,duplicate:true};}
    tx.create(doc,{kind,key,version,payload:data,digest});return {digest,duplicate:false};
   });
  },
  async get(scope,{kind,key,version}){
   const doc=await ref(scope,kind,key,version).get();
   if(!doc.exists)return null;
   const row=doc.data();
   if(row.kind!==kind||row.key!==key||row.version!==version||typeof row.payload!=='string'||hash(row.payload)!==row.digest)throw Error('Artifact integrity failure');
   return {kind,key,version,digest:row.digest,payload:JSON.parse(row.payload)};
  }
 });
}
