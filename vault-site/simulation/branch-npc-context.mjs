// SYS-03: private preparation only; never send context to the player.
export const VERSION="branch-context-v1";
function need(ok,msg){if(!ok)throw Error(msg)}
function obj(x){return x!==null&&typeof x==="object"&&!Array.isArray(x)}
function id(x){return typeof x==="string"&&/^[a-z][a-z0-9_.-]{0,100}$/.test(x)&&!["constructor","prototype","__proto__"].includes(x)}
function scalar(x){return x===null||typeof x==="boolean"||typeof x==="string"&&x.length<=300||Number.isSafeInteger(x)}
function ids(x){need(Array.isArray(x)&&x.every(id)&&new Set(x).size===x.length,"Invalid IDs");return [...x].sort()}
function str(x){need(typeof x==="string"&&x.trim().length>0&&x.length<=300,"Invalid text");return x}
function canonical(x){if(Array.isArray(x))return x.map(canonical);if(obj(x))return Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])]));return x}
function keyed(x){need(obj(x)&&Object.entries(x).every(([k,v])=>id(k)&&scalar(v)),"Invalid keyed values");return canonical(x)}
function perceive(c){return canonical({actor:c.perception.actor,npc:c.npc,knownFacts:c.perception.knownFacts,knownFlags:c.perception.knownFlags,locationId:c.locationId,elapsedSeconds:c.elapsedSeconds,intent:c.intent})}
export function buildBranchContext(x){
 need(obj(x)&&obj(x.world)&&obj(x.world.entities)&&obj(x.world.nodes),"Effective world required");
 for(const k of ["moduleId","branchId","actorId","npcId","locationId","intentId"])need(id(x[k]),"Invalid "+k);
 need(x.previousBranchId===null||id(x.previousBranchId),"Invalid predecessor");
 need(id(x.snapshotId)&&Number.isSafeInteger(x.worldRevision)&&x.worldRevision>=0&&Number.isSafeInteger(x.contextRevision)&&x.contextRevision>=1&&Number.isSafeInteger(x.elapsedSeconds)&&x.elapsedSeconds>=0,"Invalid revisions/time");
 const actor=x.world.entities[x.actorId],npc=x.world.entities[x.npcId];
 need(actor?.kind==="player"&&npc?.kind==="npc"&&actor.locationId===x.locationId&&npc.locationId===x.locationId&&Object.hasOwn(x.world.nodes,x.locationId),"Participants not co-located");
 const appearance=x.observedActor;need(obj(appearance)&&Object.keys(appearance).every(k=>["race","gender","class","hygiene","attitude","equipment","weapons"].includes(k)),"Invalid observation");
 const visible={};for(const k of ["race","gender","class","hygiene","attitude"]){const v=appearance[k]??null;need(v===null||id(v),"Invalid observation "+k);visible[k]=v}
 for(const k of ["equipment","weapons"]){visible[k]=appearance[k]==null?null:ids(appearance[k]);}
 const profile=x.npcProfile;need(obj(profile)&&profile.npcId===x.npcId,"NPC profile mismatch");
 const personality=ids(profile.personality),agenda=ids(profile.agenda),mood=profile.mood;need(mood===null||id(mood),"Invalid mood");
 const relationship=profile.relationship;need(relationship===null||id(relationship),"Invalid relationship");
 const facts=x.worldFacts;need(Array.isArray(facts),"World facts required");
 const truth={};for(const f of facts){need(obj(f)&&id(f.id)&&scalar(f.value)&&!Object.hasOwn(truth,f.id),"Invalid world fact");truth[f.id]=f.value}
 const known={};need(Array.isArray(x.npcKnowledge),"NPC knowledge required");for(const f of x.npcKnowledge){
  need(obj(f)&&id(f.factId)&&Object.hasOwn(truth,f.factId)&&scalar(f.belief)&&["witnessed","reported","inferred"].includes(f.source)&&id(f.evidenceId)&&!Object.hasOwn(known,f.factId),"Invalid knowledge evidence");
  need(f.source!=="witnessed"||Object.is(truth[f.factId],f.belief),"Witnessed belief contradicts truth");
  known[f.factId]={belief:f.belief,source:f.source,evidenceId:f.evidenceId};
 }
 const flags=keyed(x.flags),npcKnownFlags=ids(x.npcKnownFlags);need(npcKnownFlags.every(k=>Object.hasOwn(flags,k)),"Unknown flag");
 need(["routine","deceit","persuasion","other"].includes(x.intentKind),"Invalid intent");
 return canonical({schemaVersion:1,version:VERSION,moduleId:x.moduleId,branchId:x.branchId,previousBranchId:x.previousBranchId,contextRevision:x.contextRevision,locationId:x.locationId,elapsedSeconds:x.elapsedSeconds,actorId:x.actorId,npcId:x.npcId,intent:{id:x.intentId,kind:x.intentKind},effectiveState:{snapshotId:x.snapshotId,worldRevision:x.worldRevision,actorState:keyed(x.relevantActorState),npcState:keyed(x.relevantNpcState)},worldTruth:truth,flags,perception:{actor:visible,knownFacts:known,knownFlags:Object.fromEntries(npcKnownFlags.map(k=>[k,flags[k]]))},npc:{personality,agenda,mood,prejudices:ids(profile.prejudices),relationship},legalOptionIds:ids(x.legalOptionIds)});
}
export function contextKey(c){need(c?.version===VERSION,"Invalid context version");return JSON.stringify(canonical(c))}
export function evaluateReaction(c,policy,{production=false}={}){
 need(c?.version===VERSION&&obj(policy)&&id(policy.id)&&Number.isSafeInteger(policy.revision)&&policy.revision>=1&&["synthetic","approved"].includes(policy.status),"Invalid policy");
 need(!production||policy.status==="approved","Unapproved policy");
 const allowed=new Set(c.legalOptionIds),fallback=ids(policy.fallbackOptionIds);need(fallback.every(k=>allowed.has(k)),"Illegal fallback");
 need(Array.isArray(policy.rules)&&policy.rules.length<=100,"Invalid rules");
 const seen=new Set(),view=perceive(c),trace=[];
 const fields=new Set(["actor.race","actor.gender","actor.class","actor.hygiene","actor.attitude","npc.mood","npc.relationship","intent.kind","intent.id","locationId","elapsedSeconds","actor.equipment","actor.weapons","npc.personality","npc.agenda","npc.prejudices"]);
 const read=k=>{if(fields.has(k))return k.split(".").reduce((o,p)=>o?.[p],view);if(k.startsWith("fact.")&&id(k.slice(5)))return view.knownFacts[k.slice(5)]?.belief;if(k.startsWith("flag.")&&id(k.slice(5)))return view.knownFlags[k.slice(5)];throw Error("Invalid perception predicate "+k)};
 let selected=null;
 for(const rule of policy.rules){
  need(obj(rule)&&id(rule.id)&&!seen.has(rule.id)&&id(rule.posture)&&Array.isArray(rule.when)&&rule.when.length>0,"Invalid reaction rule");seen.add(rule.id);
  const options=ids(rule.optionIds);need(options.every(k=>allowed.has(k)),"Illegal reaction option");
  const clauses=rule.when.map(t=>{need(obj(t)&&typeof t.field==="string"&&Object.hasOwn(t,"equals")!==Object.hasOwn(t,"contains"),"Invalid predicate");const membership=Object.hasOwn(t,"contains");need(membership?id(t.contains):scalar(t.equals)&&t.equals!==null,"Invalid predicate value");const actual=read(t.field);need(actual==null||membership===Array.isArray(actual),"Predicate type mismatch");return {field:t.field,result:actual==null?"unknown":(membership?actual.includes(t.contains):Object.is(actual,t.equals))?"match":"different"}});
  const matches=clauses.every(t=>t.result==="match");trace.push({ruleId:rule.id,clauses,matches});
  if(matches&&!selected)selected={ruleId:rule.id,posture:rule.posture,optionIds:options};
 }
 return {version:VERSION,policyId:policy.id,policyRevision:policy.revision,branchId:c.branchId,contextRevision:c.contextRevision,...(selected??{ruleId:null,posture:"uncertain",optionIds:fallback}),trace,grantsConsent:false,changesWorld:false};
}
export function prepareSocialCheck(c,{authorization=null,world,callMasterRules,rollD100}={}){
 need(c?.version===VERSION,"Invalid context version");
 if(c.intent.kind==="routine") {need(authorization===null,"Routine conversation needs no check");return {status:"not-required",checks:[],grantsConsent:false};}
 if(!["deceit","persuasion"].includes(c.intent.kind)){need(authorization===null,"Unsupported social intent");return {status:"not-required",checks:[],grantsConsent:false};}
 if(authorization===null)return {status:"not-authorized",checks:[],grantsConsent:false};
 need(obj(authorization)&&authorization.branchId===c.branchId&&authorization.contextRevision===c.contextRevision&&authorization.intentId===c.intent.id&&c.legalOptionIds.includes(c.intent.id)&&id(authorization.eventId),"Unbound check authorization");
 need(typeof callMasterRules==="function"&&typeof rollD100==="function","Rules/RNG adapter unavailable");
 const pair=c.intent.kind==="deceit"?["deceit","insight"]:["influence","willpower"];
 const grades=["very-easy","easy","standard","hard","formidable","herculean"];
 need(grades.includes(authorization.actorDifficulty)&&grades.includes(authorization.npcDifficulty),"Explicit opposed difficulty required");
 const reason=str(authorization.reason);
 const sheets=[world?.entities?.[c.actorId]?.privateState?.sheet,world?.entities?.[c.npcId]?.privateState?.sheet];
 need(sheets.every((s,i)=>s?.id===[c.actorId,c.npcId][i]&&world.entities[s.id].locationId===c.locationId&&Number.isInteger(s.skills?.[pair[i]])&&s.skills[pair[i]]>=0&&s.skills[pair[i]]<=300),"Effective skill missing");
 const participants=sheets.map((character,i)=>({character,skill:pair[i],difficulty:i===0?authorization.actorDifficulty:authorization.npcDifficulty,reason}));
 const profiles=participants.map(participant=>callMasterRules("checkProfile",participant));
 need(profiles.every(p=>p?.apiVersion==="master-rules-v1"&&p.operation==="checkProfile"&&typeof p.result?.legal==="boolean"),"Invalid rules profile");
 if(profiles.some(p=>!p.result.legal))return {status:"blocked",checks:[],grantsConsent:false};
 for(let i=0;i<2;i++){const roll=rollD100({moduleId:c.moduleId,branchId:c.branchId,eventId:authorization.eventId,purpose:i===0?"social-actor":"social-npc",ordinal:0,sides:100});need(Number.isInteger(roll)&&roll>=1&&roll<=100,"Invalid prepared roll");participants[i].roll=roll;}
 const result=callMasterRules("checkOpposed",{id:authorization.eventId,actor:participants[0],opponent:participants[1]});
 need(result?.apiVersion==="master-rules-v1"&&result.operation==="checkOpposed"&&["blocked","resolved"].includes(result.result?.status)&&Array.isArray(result.result.checks),"Invalid rules response");
 return {status:result.result.status,rulesResult:result,checks:result.result.checks,grantsConsent:false,changesWorld:false};
}
