// SYS-05 candidate, server-only. Inputs and principals must be built by trusted backend.
import {createHash} from 'node:crypto';
const ok=(v,m)=>{if(!v)throw Error(m)};
const copy=structuredClone;
const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_.:-]{1,128}$/.test(v);
const str=v=>typeof v==='string'&&v.length>0&&v.length<=4000;
const shape=(v,keys)=>{ok(v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k)),'Invalid schema')};
const unique=a=>new Set(a).size===a.length;
const canon=v=>Array.isArray(v)?v.map(canon):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
const hash=v=>createHash('sha256').update(JSON.stringify(canon(v))).digest('hex');
const list=(a,fn)=>ok(Array.isArray(a)&&a.length<=128&&a.every(fn),'Invalid list');
const same=(a,b)=>a.length===b.length&&unique(a)&&a.every(x=>b.includes(x));
export const NARRATIVE_JOB_VERSION=1;
// Only player-authorized context summaries: never pass raw NPC profile, seed or branch tree.
// Text provenance/visibility is the upstream authority's responsibility, not inferred by this schema.
export function prepareNarrativeJob(input){
 shape(input,['campaignId','editionId','branchId','slotId','audience','locale','versions','context','facts','options','checks','required']);
 for(const k of ['campaignId','editionId','branchId','slotId','locale'])ok(id(input[k]),'Invalid job identity');
 ok(input.audience==='player'&&typeof input.required==='boolean','Invalid audience or requirement');
 shape(input.versions,['module','rules','canon','narrator','context']);
 for(const v of Object.values(input.versions))ok(id(v),'Invalid version');
 shape(input.context,['actorVisible','npcVisible','place','time','known','intent']);
 for(const k of ['actorVisible','npcVisible','place','time','intent'])ok(str(input.context[k]),'Invalid context');
 list(input.context.known,str);
 for(const k of ['facts','options','checks']){
  list(input[k],item=>{shape(item,k==='checks'?['slotId','outcome']:['id','text']);return k==='checks'?id(item.slotId)&&['critical','success','failure','fumble'].includes(item.outcome):id(item.id)&&str(item.text)});
  ok(unique(input[k].map(x=>x.id??x.slotId)),'Duplicate slot or reference');
 }
 const job=copy(input);
 const contextHash=hash({audience:job.audience,locale:job.locale,versions:job.versions,context:job.context,facts:job.facts,options:job.options,checks:job.checks});
 return {...job,schemaVersion:NARRATIVE_JOB_VERSION,contextHash};
}
function normalizedJob(job){
 const {schemaVersion,contextHash,...input}=job;
 const rebuilt=prepareNarrativeJob(input);
 ok(schemaVersion===rebuilt.schemaVersion&&contextHash===rebuilt.contextHash,'Job integrity mismatch');
 return rebuilt;
}
const key=j=>JSON.stringify([j.campaignId,j.editionId,j.branchId,j.slotId,j.audience,j.locale,j.contextHash]);
function auth(p,j,role){ok(p?.role===role&&p.campaignId===j.campaignId&&p.editionId===j.editionId,'Access denied')}
// Worker receives only one branch's allowed context, no identity of other branches or numeric dice.
export function authoringInput(job){
 const j=normalizedJob(job);
 const {locale,versions,context,facts,options,checks}=j;
 return copy({locale,versions,context,facts,options,checks});
}
function validateDraft(j,d){
 shape(d,['title','text','factIds','optionIds']);
 ok(str(d.title)&&!/</.test(d.title),'Invalid title');
 list(d.factIds,id);list(d.optionIds,id);
 ok(same(d.factIds,j.facts.map(f=>f.id)),'Fact bindings mismatch');
 ok(same(d.optionIds,j.options.map(o=>o.id)),'Option bindings mismatch');
 list(d.text,t=>{if(typeof t==='string')return str(t)&&!/[<>]/.test(t);shape(t,['checkSlot']);return id(t.checkSlot)});
 ok(d.text.length>0&&same(d.text.filter(t=>typeof t!=='string').map(t=>t.checkSlot),j.checks.map(c=>c.slotId)),'Check slots mismatch');
 return copy(d);
}
// In-memory reference adapter. Do not expose as HTTP handler. Persistent adapter belongs to SYS-06.
// No automatic cross-branch cache reuse: exact identity + semantic hash only.
export class NarrativeRepository {
 #rows=new Map();
 enqueue(principal,job){
  const j=normalizedJob(job);auth(principal,j,'worker');
  const k=key(j);if(!this.#rows.has(k))this.#rows.set(k,{job:j,versions:[{revision:1,status:'pending'}]});
  return copy(this.#rows.get(k).versions.at(-1));
 }
 async generate(principal,job,author){
  const j=normalizedJob(job);auth(principal,j,'worker');
  const row=this.#rows.get(key(j));ok(row,'Job missing');
  const previous=row.versions.at(-1);ok(previous.status==='pending'||previous.status==='rejected','Invalid generation state');
  ok(typeof author==='function','Author unavailable');
  const draft=validateDraft(j,await author(authoringInput(j)));
  ok(row.versions.at(-1)===previous,'Concurrent edit');
  const version={revision:previous.revision+1,status:'generated',draft};
  row.versions.push(version);return copy(version);
 }
 async review(principal,job,revision,reviewer){
  const j=normalizedJob(job);auth(principal,j,'reviewer');
  const row=this.#rows.get(key(j)),v=row?.versions.at(-1);
  ok(v?.status==='generated'&&v.revision===revision,'Stale review');
  ok(typeof reviewer==='function','Independent semantic review required');
  // Structural checks alone cannot prove fidelity/privacy of natural language.
  const decision=await reviewer(authoringInput(j),copy(v.draft));
  shape(decision,['fidelity','privacy','checks','reviewId']);
  ok(id(decision.reviewId)&&['fidelity','privacy','checks'].every(k=>typeof decision[k]==='boolean'),'Invalid review');
  ok(row.versions.at(-1)===v,'Concurrent review');
  const next={revision:v.revision+1,status:decision.fidelity&&decision.privacy&&decision.checks?'validated':'rejected',draft:v.draft,review:copy(decision)};
  row.versions.push(next);return copy(next);
 }
 // A trusted backend must resolve and confirm the branch BEFORE invoking this method.
 // The role below is a server capability, NOT a player role or a browser-supplied assertion.
 approved(principal,job){
  const j=normalizedJob(job);auth(principal,j,'confirmed-reader');
  ok(principal.branchId===j.branchId,'Branch not confirmed');
  const v=this.#rows.get(key(j))?.versions.at(-1);
  if(v?.status!=='validated')throw Error('Narration missing or unapproved');
  // Do not return the job, private key, review details, other branches or options as authority.
  return copy({revision:v.revision,locale:j.locale,title:v.draft.title,text:v.draft.text});
 }
 // Internal worker export for the SYS-06 immutable fragment store, never a player response.
 approvedArtifact(principal,job){
  const j=normalizedJob(job);auth(principal,j,'worker');
  const v=this.#rows.get(key(j))?.versions.at(-1);
  ok(v?.status==='validated','Narration missing or unapproved');
  return copy({schemaVersion:1,job:j,...v});
 }
 coverage(principal,manifest){
  ok(Array.isArray(manifest)&&manifest.length>0,'Authoritative manifest required');
  const jobs=manifest.map(normalizedJob);for(const j of jobs)auth(principal,j,'worker');
  const keys=jobs.map(key);ok(unique(keys),'Duplicate manifest job');
  const missing=jobs.filter(j=>j.required&&this.#rows.get(key(j))?.versions.at(-1)?.status!=='validated').map(j=>({branchId:j.branchId,slotId:j.slotId}));
  // Narrative gate only; compiler completeness and assets must also pass independently.
  return {narrativeReady:missing.length===0,missing};
 }
}

// Validate persisted private artifacts again; callers must independently authenticate the store and pin the exact version.
export function validateApprovedArtifact(job,artifact){
 const j=normalizedJob(job);
 shape(artifact,['schemaVersion','job','revision','status','draft','review']);
 ok(artifact.schemaVersion===1&&artifact.status==='validated'&&Number.isSafeInteger(artifact.revision)&&artifact.revision>=3,'Invalid approved artifact');
 const saved=normalizedJob(artifact.job);
 ok(key(j)===key(saved)&&hash(j)===hash(saved),'Artifact job mismatch');
 const draft=validateDraft(j,artifact.draft);
 shape(artifact.review,['fidelity','privacy','checks','reviewId']);
 ok(id(artifact.review.reviewId)&&['fidelity','privacy','checks'].every(k=>artifact.review[k]===true),'Artifact not approved');
 return copy({...artifact,job:saved,draft});
}
