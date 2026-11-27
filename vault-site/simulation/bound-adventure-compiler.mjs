// SYS-04: finite private compilation contract. Only trusted worker bindings.
// Does not define rules, NPC behavior, canon, or transport.
import {createHash} from 'node:crypto';
import {validateCheck} from '../public/libro/check-contract.mjs';
const copy=structuredClone;
const need=(v,m)=>{if(!v)throw Error(m)};
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
const validId=x=>typeof x==='string'&&/^[a-zA-Z0-9_.-]{1,100}$/.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const revision=s=>s?.delta?.revision??s?.revision;
function validateState(s){need(object(s)&&Number.isSafeInteger(revision(s))&&revision(s)>=0,'Invalid effective state');return s}
function validatedAction(a){need(object(a)&&validId(a.intentId),'Unbound legal decision');return a}
function unique(values,message){need(new Set(values).size===values.length,message)}
// Interface proposal for SYS-01/02/03/05/06/08. Binding functions are server-owned,
// not author-provided code or player input. No automatic authorization of real modules.
// enumerate(state): all legal authored decisions, as {intentId,...}.
// prepare(state,decision,{branchId}): {state,event,context,slotId}; rules run here only.
// ending(state): null for live state, or an explicitly approved ending identifier.
// Context supplied by the trusted binding must be audience-scoped for editorial use.
export function compileBoundEdition({module,initial,bindings,maxDepth=12,maxEdges=1200}){
 need(module?.mode==='mechanical-fixture'&&validId(module.id)&&validId(module.version),'Only explicitly synthetic bindings supported until integration approval');
 need(Array.isArray(module.intentIds)&&module.intentIds.length>0&&module.intentIds.every(validId),'Missing intent references');
 need(Array.isArray(module.endingIds)&&module.endingIds.length>=2&&module.endingIds.every(validId),'Missing ending references');
 unique(module.intentIds,'Duplicate intent reference');unique(module.endingIds,'Duplicate ending reference');
 need(['enumerate','prepare','ending'].every(k=>typeof bindings?.[k]==='function'),'Missing trusted binding');
 need(Number.isInteger(maxDepth)&&maxDepth>0&&maxDepth<=64&&Number.isInteger(maxEdges)&&maxEdges>0&&maxEdges<=10000,'Invalid compilation budget');
 validateState(initial);
 const identity=hash([module,initial]),editionId='edition-'+identity.slice(0,32);
 const nodes=Object.create(null),jobs=[],observed=new Set(),endings=new Set();let edges=0;
 function walk(state,path,depth){
  const id='node-'+hash([identity,path]).slice(0,32);
  need(!Object.hasOwn(nodes,id),'Duplicate node');
  const node=nodes[id]={id,stateDigest:hash(state),revision:revision(state),edges:[]};
  const ending=bindings.ending(copy(state));
  const actions=bindings.enumerate(copy(state));
  need(Array.isArray(actions),'Missing legal decision coverage');
  actions.forEach(validatedAction);
  unique(actions.map(hash),'Duplicate decision');
  if(ending!==null){
   need(module.endingIds.includes(ending)&&actions.length===0,'Invalid ending or live decisions at ending');
   node.ending=ending;endings.add(ending);return id;
  }
  need(actions.length>0,'Uncovered dead end');
  need(depth<maxDepth,'Depth limit: incomplete edition');
  for(const action of actions.sort((a,b)=>hash(a).localeCompare(hash(b)))){
   need(module.intentIds.includes(action.intentId),'Broken intent reference');
   need(++edges<=maxEdges,'Edge limit: incomplete edition');
   observed.add(action.intentId);
   const branchId='branch-'+hash([identity,path,action]).slice(0,32);
   const r=bindings.prepare(copy(state),copy(action),{branchId});
   need(object(r)&&object(r.event)&&validId(r.event.id)&&Array.isArray(r.event.checks)&&Array.isArray(r.event.facts)&&object(r.context)&&validId(r.slotId),'Incomplete prepared transition');
   r.event.checks.forEach(validateCheck);
   unique(r.event.checks.map(c=>c.id),'Duplicate check');
   validateState(r.state);
   need(revision(r.state)===revision(state)+1&&r.event.revision===revision(r.state),'Revision mismatch');
   const nextId=walk(copy(r.state),[...path,branchId],depth+1);
   const payload={branchId,action:copy(action),event:copy(r.event),state:copy(r.state),nextId,slotId:r.slotId,context:copy(r.context)};
   node.edges.push({...payload,digest:hash(payload)});
   jobs.push({branchId,eventId:r.event.id,slotId:r.slotId,context:copy(r.context),checkIds:r.event.checks.map(c=>c.id),status:'missing'});
  }
  return id;
 }
 const rootId=walk(copy(initial),[],0);
 need(module.intentIds.every(i=>observed.has(i)),'Uncovered authored intent');
 need(module.endingIds.every(i=>endings.has(i)),'Uncovered required ending');
 // Intentionally no cross-path dedup: exact state and history equivalence has not been certified.
 return {schemaVersion:1,kind:'private-bound-edition',mode:'mechanical-fixture',editionId,module:copy(module),rootId,initial:copy(initial),nodes,jobs,coverage:{complete:true,edges,nodes:Object.keys(nodes).length,endings:[...endings].sort()},publicationReady:false};
}
export function startBoundEdition(edition){
 need(edition?.kind==='private-bound-edition','Invalid edition');
 return {editionId:edition.editionId,nodeId:edition.rootId,state:copy(edition.initial),receipts:{}};
}
// Pure selection only. Atomic compare-and-set, access, live world revisions and
// confirmed-event receipts are SYS-06 responsibilities; not a production API.
export function confirmBoundChoice(edition,session,{commandId,expectedRevision,branchId}){
 need(edition.editionId===session.editionId&&validId(commandId)&&validId(branchId),'Invalid choice');
 const fingerprint=hash([expectedRevision,branchId]);
 if(Object.hasOwn(session.receipts,commandId)){
  const receipt=session.receipts[commandId];need(receipt.fingerprint===fingerprint,'Command ID reused');
  return {session:copy(session),event:copy(receipt.event),duplicate:true};
 }
 need(expectedRevision===revision(session.state),'Revision conflict');
 const node=edition.nodes[session.nodeId];
 need(node?.stateDigest===hash(session.state),'Node/state mismatch');
 const edge=node.edges.find(e=>e.branchId===branchId);need(edge,'Illegal branch');
 const {digest,...payload}=edge;
 need(digest===hash(payload)&&edition.nodes[edge.nextId]?.stateDigest===hash(edge.state),'Prepared transition mismatch');
 const next=copy(session);next.nodeId=edge.nextId;next.state=copy(edge.state);
 next.receipts[commandId]={fingerprint,event:copy(edge.event)};
 return {session:next,event:copy(edge.event),duplicate:false};
}
// Minimal metadata only; not a full player projection (owned by SYS-06/07).
// The private edition and jobs are never a client response.
export function boundChoiceView(edition,session){
 need(edition.editionId===session.editionId,'Wrong edition');
 const node=edition.nodes[session.nodeId];need(node?.stateDigest===hash(session.state),'Node/state mismatch');
 return {revision:node.revision,choices:node.edges.map(e=>({branchId:e.branchId,intentId:e.action.intentId})),ending:node.ending??null};
}
