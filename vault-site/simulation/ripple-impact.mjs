// Narrative Ripple handoff v1. Server-only, no NPC choice or LLM execution.
// Relation traversal retrieves evidence; it does not imply communication or a reaction.
const copy=structuredClone,own=(o,k)=>Object.hasOwn(o,k),ok=(x,m)=>{if(!x)throw Error(m)};
const validId=x=>typeof x==='string'&&/^[a-z][a-z0-9_.-]{0,100}$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
const text=(x,max=1000)=>typeof x==='string'&&x.length>0&&x.length<=max;
const int=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const types=['superior-of','member-of','family-of','ally-of','rival-of','friend-of','owes-to','owns','controls','works-at','located-at','related-to'];
const actorKinds=['player','npc','creature','faction'];
function graph(w,relations){
 const records=new Map(),links=[],ids=new Set();
 for(const kind of ['nodes','entities','routes'])for(const r of Object.values(w[kind]??{})){ok(validId(r.id)&&!records.has(r.id),'Ambiguous graph ID');records.set(r.id,{...copy(r),recordType:kind})}
 function link(e){ok(validId(e.id)&&!ids.has(e.id)&&types.includes(e.kind)&&records.has(e.from)&&records.has(e.to)&&e.from!==e.to,'Invalid graph relation');ids.add(e.id);links.push({id:e.id,kind:e.kind,from:e.from,to:e.to})}
 ok(Array.isArray(relations)&&relations.length<=10000,'Invalid relation catalog');
 for(const r of relations)link(r);
 for(const e of Object.values(w.entities)){
  if(e.locationId)link({id:'loc-'+e.id,kind:'located-at',from:e.id,to:e.locationId});
  for(const [i,to] of (e.relatedIds??[]).entries())link({id:'rel-'+e.id+'-'+i,kind:'related-to',from:e.id,to});
 }
 const adjacency=new Map();
 for(const e of links)for(const [from,to] of [[e.from,e.to],[e.to,e.from]]){if(!adjacency.has(from))adjacency.set(from,[]);adjacency.get(from).push({edge:e,to})}
 for(const list of adjacency.values())list.sort((a,b)=>a.to.localeCompare(b.to)||a.edge.id.localeCompare(b.edge.id));
 return {records,adjacency};
}
export function buildImpactContext(w,relations,event,{maxDepth=3,maxRecords=80,maxPaths=3}={}){
 ok(int(maxDepth,1,6)&&int(maxRecords,1,200)&&int(maxPaths,1,5),'Invalid graph budget');
 const {records,adjacency}=graph(w,relations);
 ok(event&&validId(event.id)&&int(event.revision,0,Number.MAX_SAFE_INTEGER)&&records.get(event.locationId)?.recordType==='nodes'&&Array.isArray(event.participantIds)&&event.participantIds.length>0&&event.participantIds.length<=20&&event.participantIds.every(i=>actorKinds.includes(records.get(i)?.kind)),'Invalid event');
 ok(Array.isArray(event.facts)&&event.facts.length>0&&event.facts.length<=50,'Invalid facts');
 const facts=new Map();for(const f of event.facts){ok(validId(f.id)&&!facts.has(f.id)&&validId(f.kind)&&text(f.description,2000),'Invalid fact');facts.set(f.id,copy(f))}
 // Knowledge receipts are already confirmed by simulation/communication, not supplied by the LLM.
 ok(Array.isArray(event.knowledge)&&event.knowledge.length<=200,'Invalid knowledge');
 const awareness=new Map();
 for(const k of event.knowledge){
  ok(actorKinds.includes(records.get(k.entityId)?.kind)&&['participant','witness','delivered'].includes(k.source)&&Array.isArray(k.factIds)&&k.factIds.length>0&&k.factIds.every(f=>facts.has(f)),'Invalid knowledge receipt');
  if(k.source==='participant')ok(event.participantIds.includes(k.entityId),'Not a participant');
  // A historical witness need not still occupy the event location. Authority validates receipt at observation.
  if(k.source==='delivered')ok(actorKinds.includes(records.get(k.fromId)?.kind)&&k.fromId!==k.entityId,'Invalid delivery source');
  if(!awareness.has(k.entityId))awareness.set(k.entityId,[]);
  awareness.get(k.entityId).push({source:k.source,...(k.source==='delivered'?{fromId:k.fromId}:{}),factIds:[...new Set(k.factIds)]});
 }
 const roots=[...new Set([event.locationId,...event.participantIds,...awareness.keys()])].sort();
 ok(roots.length<=maxRecords,'Root budget exceeded');
 const found=new Map(),queue=[];
 for(const r of roots){found.set(r,{depth:0,paths:[{root:r,steps:[]}]});queue.push(r)}
 let incomplete=false;
 for(let cursor=0;cursor<queue.length;cursor++){
  const here=queue[cursor],h=found.get(here);
  for(const {edge,to} of adjacency.get(here)??[]){
   // Only expand location occupancy from the actual event location. Do not flood other settlements.
   if(edge.kind==='located-at'&&records.get(here).recordType==='nodes'&&here!==event.locationId)continue;
   const old=found.get(to),depth=h.depth+1;
   if(depth>maxDepth){if(!old)incomplete=true;continue}
   const paths=h.paths.map(p=>({root:p.root,steps:[...p.steps,{edgeId:edge.id,kind:edge.kind,from:here,to,relationFrom:edge.from,relationTo:edge.to}]}));
   if(!old){if(found.size>=maxRecords){incomplete=true;continue}found.set(to,{depth,paths:paths.slice(0,maxPaths)});queue.push(to)}
   else if(old.depth===depth){for(const p of paths){if(old.paths.length>=maxPaths)break;if(!old.paths.some(x=>JSON.stringify(x)===JSON.stringify(p)))old.paths.push(p)}}
  }
 }
 const candidates=[...found].map(([entityId,v])=>({entityId,record:copy(records.get(entityId)),depth:v.depth,paths:v.paths.map((p,i)=>({id:entityId+'.path.'+i,...p})),knowledge:copy(awareness.get(entityId)??[])}));
 return {schemaVersion:1,kind:'impact-analysis-input',event:{id:event.id,revision:event.revision,locationId:event.locationId,participantIds:copy(event.participantIds),facts:[...facts.values()]},candidates,coverage:{records:candidates.length,maxDepth,maxRecords,maxPaths,incomplete,paths:'bounded-shortest'},readOnly:true};
}
// The analyst selects plausible affected nodes, including unaware ones, with explicit path evidence.
// This is a schema validator, not a substitute for semantic review of its analysis.
export function validateImpactAnalysis(packet,result){
 ok(result?.schemaVersion===1&&result.eventId===packet.event.id&&result.revision===packet.event.revision&&Array.isArray(result.affected)&&result.affected.length<=packet.candidates.length,'Invalid impact analysis');
 const candidates=new Map(packet.candidates.map(c=>[c.entityId,c])),seen=new Set();
 return result.affected.map(a=>{
  const c=candidates.get(a.entityId);
  ok(c&&!seen.has(a.entityId)&&['direct','potential'].includes(a.impact)&&text(a.reason,2000)&&Array.isArray(a.pathIds)&&a.pathIds.length>0&&a.pathIds.every(p=>c.paths.some(x=>x.id===p)),'Invalid affected node or path');
  seen.add(a.entityId);
  // Never allow analyst output to manufacture knowledge, actions, or changes.
  ok(Object.keys(a).every(k=>['entityId','impact','reason','pathIds'].includes(k)),'Unsupported analysis field');
  return {entityId:a.entityId,impact:a.impact,reason:a.reason,pathIds:copy(a.pathIds),knowledgeStatus:c.knowledge.length?'informed':'unconfirmed',canRoleplay:c.knowledge.length>0&&['npc','creature','faction'].includes(c.record.kind)};
 });
}
export function createRoleplayJobs(packet,result){
 const affected=validateImpactAnalysis(packet,result),facts=new Map(packet.event.facts.map(f=>[f.id,f]));
 return affected.filter(a=>a.canRoleplay).map(a=>{
  const c=packet.candidates.find(x=>x.entityId===a.entityId),knownIds=[...new Set(c.knowledge.flatMap(k=>k.factIds))];
  return {schemaVersion:1,kind:'narrative-roleplay-request',eventId:packet.event.id,worldRevision:packet.event.revision,actorId:a.entityId,actor:copy(c.record),knownFacts:knownIds.map(f=>copy(facts.get(f))),knowledgeReceipts:copy(c.knowledge),instruction:'Interpret this entity using its identity, motivations, relationships and confirmed knowledge. Propose an intention, not a resolved outcome. Request missing context when needed.',status:'awaiting-narrator'};
 });
}
