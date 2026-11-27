// Adaptación de IADM: WorldResolver, world_scale, context_builder/enricher/views.
// Prototipo puro en memoria; no recibe roles ni IDs de autorización desde el cliente.
import {createHash} from 'node:crypto';
export const SCALE=Object.freeze({world:0,continent:1,realm:2,region:3,zone:4,hex:4,settlement:5,district:6,site:7,building:8,dwelling:9});
export const GENERATION=Object.freeze(['reference','skeleton','visitable','detailed']);
const copy=x=>structuredClone(x);
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x)}return x}
const own=(o,k)=>Object.hasOwn(o,k);
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0,24);
const isId=s=>typeof s==='string'&&/^[a-z][a-z0-9_.-]{0,100}$/.test(s)&&!['constructor','prototype','__proto__'].includes(s);
function index(records){const out=Object.create(null);for(const r of records){if(!isId(r.id)||own(out,r.id))throw Error('Invalid or duplicate id: '+r.id);out[r.id]=copy(r)}return out}
export function validateWorld(w){
 for(const n of Object.values(w.nodes)){
  if(!own(SCALE,n.kind)||!GENERATION.includes(n.generation))throw Error('Invalid node '+n.id);
  if(n.parentId){if(!own(w.nodes,n.parentId)||SCALE[w.nodes[n.parentId].kind]>=SCALE[n.kind])throw Error('Invalid parent '+n.id)}
  if(n.kind==='hex'&&(!Number.isInteger(n.q)||!Number.isInteger(n.r)))throw Error('Missing axial coordinates '+n.id);
 }
 const cells=new Set();for(const n of Object.values(w.nodes)){if(n.kind==='hex'){const k=n.q+','+n.r;if(cells.has(k))throw Error('Duplicate hex '+k);cells.add(k)}}
 for(const e of Object.values(w.entities)){
  if(e.locationId&&!own(w.nodes,e.locationId))throw Error('Unknown location '+e.id);
  if(e.regionId&&(!own(w.nodes,e.regionId)||w.nodes[e.regionId].kind!=='region'))throw Error('Unknown region '+e.id);
  for(const id of e.relatedIds||[])if(!own(w.entities,id)&&!own(w.nodes,id))throw Error('Unknown relation '+id);
 }
 for(const e of Object.values(w.routes)){
  if(!own(w.nodes,e.a)||!own(w.nodes,e.b)||e.a===e.b||!['potential','open','blocked'].includes(e.status)||!Number.isFinite(e.minutes)||e.minutes<=0)throw Error('Invalid route '+e.id);
  const a=w.nodes[e.a],b=w.nodes[e.b];
  if(a.kind==='hex'&&b.kind==='hex'&&hexDistance(a,b)!==1)throw Error('Nonadjacent hex route '+e.id);
  if(e.status==='open'&&[a,b].some(n=>GENERATION.indexOf(n.generation)<2))throw Error('Open route to ungenerated node '+e.id);
 }
 return w;
}
export function snapshot({canon,nodes,entities=[],routes=[]}){
 const w=validateWorld({canon:copy(canon),nodes:index(nodes),entities:index(entities),routes:index(routes)});
 return freeze({...w,id:'snapshot-'+digest(w)});
}
export function campaign(base,id){if(!isId(id))throw Error('Invalid campaign id');return {id,baseSnapshotId:base.id,revision:0,changes:{nodes:{},entities:{},routes:{}}}}
export function effective(base,delta){
 if(delta.baseSnapshotId!==base.id)throw Error('Snapshot mismatch');
 const w={canon:copy(base.canon)};
 for(const k of ['nodes','entities','routes']){
  w[k]=Object.assign(Object.create(null),copy(base[k]));
  for(const [id,r] of Object.entries(delta.changes[k])){
   if(!isId(id))throw Error('Invalid id');
   if(r===null)delete w[k][id];else{if(r.id!==id)throw Error('ID mismatch');w[k][id]=copy(r)}
  }
 }
 return validateWorld(w);
}
// Full-record replacement or tombstone, atomic validation, expected revision.
export function applyChanges(base,delta,expectedRevision,changes){
 if(expectedRevision!==delta.revision)throw Error('Revision conflict');
 effective(base,delta);
 const next=copy(delta);
 for(const k of ['nodes','entities','routes'])for(const [id,r] of Object.entries(changes[k]||{})){
  if(!isId(id)||r!==null&&r.id!==id)throw Error('Invalid record');
  next.changes[k][id]=copy(r);
 }
 next.revision++;effective(base,next);return next;
}
export const hexDistance=(a,b)=>(Math.abs(a.q-b.q)+Math.abs(a.r-b.r)+Math.abs(a.q+a.r-b.q-b.r))/2;
function ancestors(w,id){const ids=[];while(id){const n=w.nodes[id];if(!n)break;ids.push(id);id=n.parentId}return ids}
function containingHex(w,id){return ancestors(w,id).map(x=>w.nodes[x]).find(n=>n.kind==='hex')}
function visible(record,access){return access.role==='dm'||record.visibility==='public'||access.knownIds.has(record.id)}
function projectNode(n,detail,dm){const p={id:n.id,name:n.name,kind:n.kind,scale:SCALE[n.kind],generation:n.generation,parentId:n.parentId,detail};if(n.kind==='hex')Object.assign(p,{q:n.q,r:n.r,terrain:n.terrain});if(detail!=='reference')p.summary=n.summary;if(dm&&detail==='full')p.facts=copy(n.facts||{});return p}
function projectEntity(e,detail,dm){const p={id:e.id,name:e.name,kind:e.kind,detail};if(detail!=='reference')p.summary=e.summary;if(detail==='full'){p.locationId=e.locationId;p.publicState=copy(e.publicState||{});if(dm)p.privateState=copy(e.privateState||{})}return p}
export function context(base,delta,{actorId,role='player',knownIds=[],focusIds=[],maxRecords=24,radius=2}={}){
 if(!['dm','player'].includes(role)||!Number.isInteger(maxRecords)||maxRecords<1||maxRecords>100||!Number.isInteger(radius)||radius<0||radius>8)throw Error('Invalid context request');
 const w=effective(base,delta),actor=w.entities[actorId];if(!actor?.locationId)throw Error('Actor not positioned');
 const access={role,knownIds:new Set([...knownIds,actorId,actor.locationId])};
 const lineage=ancestors(w,actor.locationId),origin=containingHex(w,actor.locationId),ranks=new Map(),focus=new Set([...focusIds,...(actor.relatedIds||[])]);
 const put=(record,detail,priority,reason)=>{if(record.id!==actorId&&!visible(record,access))return;const old=ranks.get(record.id);if(!old||priority<old.priority)ranks.set(record.id,{record,detail,priority,reason})};
 put(actor,'full',-2,'actor');
 for(const n of Object.values(w.nodes)){
  if(n.id===actor.locationId){put(n,'full',-1,'current');continue}
  if(lineage.includes(n.id)){put(n,'summary',1,'ancestor');continue}
  if(focus.has(n.id)){put(n,'summary',2,'explicit-or-related');continue}
  if(n.parentId===actor.locationId){put(n,'summary',3,'child');continue}
  const h=containingHex(w,n.id);if(!h||!origin)continue;
  const dist=hexDistance(h,origin);
  // Distant cells only, never every building in nearby cells.
  if(n.kind==='hex'&&dist<=radius)put(n,dist===0?'summary':'reference',4+dist,'geography');
 }
 for(const e of Object.values(w.entities)){
  if(e.id===actorId)continue;
  if(e.locationId===actor.locationId){put(e,'full',0,'present');continue}
  if(focus.has(e.id)){put(e,'summary',2,'explicit-or-related');continue}
  if(e.locationId&&lineage.includes(e.locationId))put(e,'summary',3,'ancestor-location');
 }
 // Explicit accessible connections are not inferred from sibling relationships.
 const exits=Object.values(w.routes).filter(r=>r.status==='open'&&(r.a===actor.locationId||r.b===actor.locationId||r.a===origin?.id||r.b===origin?.id)).filter(r=>visible(r,access)&&visible(w.nodes[r.a],access)&&visible(w.nodes[r.b],access)).map(r=>({id:r.id,a:r.a,b:r.b,minutes:r.minutes})).slice(0,maxRecords);
 const chosen=[...ranks.values()].sort((a,b)=>a.priority-b.priority||a.record.id.localeCompare(b.record.id)).slice(0,maxRecords);
 return {baseSnapshotId:base.id,campaignId:delta.id,revision:delta.revision,actorId,records:chosen.map(x=>({...((own(w.nodes,x.record.id))?projectNode(x.record,x.detail,role==='dm'):projectEntity(x.record,x.detail,role==='dm')),reason:x.reason})),exits,omitted:Math.max(0,ranks.size-chosen.length)};
}
