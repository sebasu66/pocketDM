// SYS-05 adapter for candidate SYS-04 bound edition and SYS-06 immutable store.
// Server-only. No branch tree, worker identity, or approval reference belongs in a player response.
import {createHash} from 'node:crypto';
import {prepareNarrativeJob,validateApprovedArtifact} from './narrative-repository.mjs';
import {validateCheck,validateEvent} from '../public/libro/check-contract.mjs';
const ok=(v,m)=>{if(!v)throw Error(m)};
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const hash=v=>createHash('sha256').update(JSON.stringify(canonical(v))).digest('hex');
const rawHash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const equal=(a,b)=>hash(a)===hash(b);
const copy=structuredClone;
const unique=a=>new Set(a).size===a.length;
const worker=(scope,job)=>ok(scope?.role==='worker'&&scope.campaignId===job.campaignId&&scope.editionId===job.editionId&&typeof scope.uid==='string'&&scope.uid.length>0,'Private worker required');
const jobInput=job=>{const {schemaVersion,contextHash,...input}=job;const j=prepareNarrativeJob(input);ok(equal(j,job),'Job integrity mismatch');return j};
const checkBindings=checks=>checks.map((c,i)=>({slotId:'check-'+(i+1),id:c.id,outcome:c.outcome}));
const refKey=j=>'narrative-'+hash([j.campaignId,j.editionId,j.branchId,j.slotId,j.audience,j.locale,j.contextHash]);
export const visibleEventDigest=hash;
// The projector is a TRUSTED server binding, not an LLM or client callback.
// It must explicitly produce only authorized context/facts/options and the exact player event.
// This adapter does not infer visibility from raw facts, private state, or NPC agenda.
export function narrativeManifest({edition,campaignId,actorId,locale='es-AR',versions,projectVisible}){
 ok(edition?.kind==='private-bound-edition'&&edition.schemaVersion===1&&edition.coverage?.complete===true&&typeof projectVisible==='function','Complete private edition and authorized projector required');
 ok(versions?.module===edition.module?.version&&typeof actorId==='string'&&actorId.length>0,'Module version or actor mismatch');
 const edges=Object.values(edition.nodes).flatMap(n=>n.edges);
 ok(Array.isArray(edition.jobs)&&edition.jobs.length>0&&edition.jobs.length===edges.length&&edges.length===edition.coverage.edges&&unique(edges.map(e=>e.branchId))&&unique(edition.jobs.map(j=>j.branchId)),'Incomplete or duplicate narrative manifest');
 const byBranch=new Map(edges.map(e=>[e.branchId,e]));
 return edition.jobs.map(j=>{
  const edge=byBranch.get(j.branchId);
  ok(edge&&edge.slotId===j.slotId&&edge.event.id===j.eventId&&equal(edge.context,j.context)&&equal(edge.event.checks.map(c=>c.id),j.checkIds),'Compiler job binding mismatch');
  const {digest,...payload}=edge;
  ok(digest===hash(payload),'Prepared edge integrity mismatch');
  const visible=projectVisible(copy(edge),copy(edition.nodes[edge.nextId]));
  ok(visible&&Object.keys(visible).length===4&&['context','facts','options','event'].every(k=>Object.hasOwn(visible,k)),'Invalid authorized projection');
  const e=visible.event;
  ok(e?.id===j.eventId&&e.revision===edge.event.revision&&Array.isArray(e.checks)&&equal(e.checks,edge.event.checks),'Visible event/check binding mismatch');
  e.checks.forEach(validateCheck);
  const bindings=checkBindings(e.checks);
  const job=prepareNarrativeJob({campaignId,editionId:edition.editionId,branchId:j.branchId,slotId:j.slotId,audience:'player',locale,versions,context:visible.context,facts:visible.facts,options:visible.options,checks:bindings.map(({slotId,outcome})=>({slotId,outcome})),required:true});
  return {job,binding:{actorId,eventId:e.id,eventRevision:e.revision,eventDigest:visibleEventDigest(e),checks:bindings}};
 });
}
// The immutable reference is private and must be pinned by SYS-06 to the authorized edition.
// No implicit latest lookup or mutable publication pointer.
export async function persistApprovedNarration({repository,store,scope,job}){
 const j=jobInput(job);worker(scope,j);
 const payload=validateApprovedArtifact(j,repository.approvedArtifact(scope,j));
 const key=refKey(j),version='r'+payload.revision;
 const result=await store.put(scope,{kind:'fragment',key,version,payload});
 ok(result?.digest===rawHash(payload),'Store digest mismatch');
 return {kind:'fragment',key,version,digest:result.digest};
}
export async function loadApprovedNarration({store,scope,job,reference}){
 const j=jobInput(job);worker(scope,j);
 ok(reference?.kind==='fragment'&&reference.key===refKey(j)&&/^r[1-9][0-9]*$/.test(reference.version)&&/^[a-f0-9]{64}$/.test(reference.digest),'Invalid pinned fragment reference');
 const row=await store.get(scope,{kind:'fragment',key:reference.key,version:reference.version});
 ok(row&&row.kind===reference.kind&&row.key===reference.key&&row.version===reference.version&&row.digest===reference.digest&&rawHash(row.payload)===reference.digest,'Missing or altered approved fragment');
 const artifact=validateApprovedArtifact(j,row.payload);
 ok(reference.version==='r'+artifact.revision,'Editorial revision mismatch');
 return artifact;
}
// Called only AFTER backend authenticates and verifies the confirmed receipt and pinned edition.
// Matches SYS-07 findApproved output; no new check or generation here.
export async function confirmedNarrativeFragment({store,scope,job,binding,reference,confirmed}){
 const j=jobInput(job);worker(scope,j);
 const e=confirmed?.event;
 ok(confirmed?.branchId===j.branchId&&confirmed.campaignId===j.campaignId&&confirmed.editionId===j.editionId&&confirmed.actorId===binding.actorId&&e?.id===binding.eventId&&e.revision===binding.eventRevision&&visibleEventDigest(e)===binding.eventDigest,'Confirmed branch/event mismatch');
 ok(Array.isArray(e.checks)&&equal(checkBindings(e.checks),binding.checks),'Confirmed check mismatch');
 const artifact=await loadApprovedNarration({store,scope,job:j,reference});
 const text=artifact.draft.text.map(t=>{
  if(typeof t==='string')return t;
  const c=binding.checks.find(c=>c.slotId===t.checkSlot);ok(c,'Unbound check slot');return {check:c.id};
 });
 validateEvent({title:artifact.draft.title,text,checks:e.checks});
 return {schemaVersion:1,status:'approved',campaignId:j.campaignId,actorId:binding.actorId,eventId:e.id,revision:e.revision,eventDigest:binding.eventDigest,locale:j.locale,title:artifact.draft.title,roman:'',text:copy(text)};
}
