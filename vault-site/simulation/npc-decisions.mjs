// DEPRECATED narrative experiment: retained for regression comparison only.
// Never use this to select narrative decisions. Intelligent entities are roleplayed by the narrative LLM.
// All inputs come from trusted server state; no arbitrary code from a narrator.
const own=(o,k)=>Object.hasOwn(o,k),ok=(v,m)=>{if(!v)throw Error(m)},copy=structuredClone;
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.-]{0,100}$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
export const TRAITS=['prudence','compassion','loyalty','ambition','aggression'];
export const GOALS=['safety','protect-community','duty','gain-influence','personal-benefit'];
export const EVENT_KINDS=['aid','threat','rumor'];
export const ACTIONS=Object.freeze({
 'wait':{cost:0,requirements:[],utility:[]},
 'offer-help':{cost:1,requirements:['present','supplies','aid'],utility:[['goal','protect-community',2],['trait','compassion',1],['attitude','actor',1],['trait','prudence',-1]]},
 'report-event':{cost:1,requirements:['contact'],utility:[['goal','duty',2],['trait','loyalty',1],['trait','prudence',1],['event','threat',100],['attitude','actor',-1]]},
 'seek-information':{cost:1,requirements:['contact'],utility:[['goal','safety',1],['trait','prudence',2],['trait','ambition',1],['event','rumor',100]]}
});
export function validateProfile(w,p){
 ok(p&&id(p.actorId)&&own(w.entities,p.actorId)&&w.entities[p.actorId].kind==='npc','Unknown NPC');
 for(const [values,names] of [[p.traits,TRAITS],[p.goals,GOALS]])ok(values&&Object.keys(values).length===names.length&&names.every(k=>integer(values[k],0,100)),'Invalid motivation or trait');
 ok(Array.isArray(p.capabilities)&&p.capabilities.length<=Object.keys(ACTIONS).length&&p.capabilities.every(k=>own(ACTIONS,k))&&p.capabilities.includes('wait')&&new Set(p.capabilities).size===p.capabilities.length,'Invalid capabilities');
 ok(p.attitudes&&Object.entries(p.attitudes).every(([k,v])=>id(k)&&own(w.entities,k)&&integer(v,-100,100)),'Invalid posture');
 ok(integer(p.resources?.supplies,0,1000000)&&integer(p.resources?.actionBudget,0,100)&&typeof p.resources?.contact==='boolean','Invalid resources');
 return p;
}
// Only an actual witnessed or explicitly delivered event can reach the decision model.
export function informedActors(w,signal,profiles){
 ok(signal&&id(signal.id)&&id(signal.actorId)&&own(w.entities,signal.actorId)&&id(signal.locationId)&&own(w.nodes,signal.locationId)&&EVENT_KINDS.includes(signal.kind)&&Array.isArray(signal.witnesses)&&signal.witnesses.every(x=>id(x)&&own(w.entities,x)&&w.entities[x].locationId===signal.locationId)&&Array.isArray(signal.deliveredTo)&&signal.deliveredTo.every(x=>id(x)&&own(w.entities,x)),'Invalid signal');
 const delivered=new Set([...signal.witnesses,...signal.deliveredTo]);
 return profiles.filter(p=>{validateProfile(w,p);return delivered.has(p.actorId)});
}
export function decide(w,signal,profile){
 const p=validateProfile(w,profile),present=w.entities[p.actorId].locationId===signal.locationId;
 if(!informedActors(w,signal,[p]).length)return null;
 const feasible={present,aid:signal.kind==='aid',supplies:p.resources.supplies>0,contact:p.resources.contact};
 const candidates=p.capabilities.map(action=>{
  const a=ACTIONS[action],blocked=a.requirements.filter(k=>!feasible[k]);if(a.cost>p.resources.actionBudget)blocked.push('budget');
  const terms=a.utility.map(([type,k,weight])=>({type,key:k,weight,value:type==='goal'?p.goals[k]:type==='trait'?p.traits[k]:type==='event'?Number(signal.kind===k):p.attitudes[signal.actorId]??0}));
  const score=terms.reduce((v,t)=>v+t.value*t.weight,0);
  return {action,score,blocked,terms,cost:a.cost};
 }).sort((a,b)=>b.score-a.score||a.action.localeCompare(b.action));
 const selected=candidates.find(x=>!x.blocked.length);
 return {actorId:p.actorId,signalId:signal.id,action:selected.action,score:selected.score,cost:selected.cost,candidates,executed:false};
}
export function decideReactions(w,signal,profiles,{maxActors=16}={}){
 ok(integer(maxActors,1,100)&&Array.isArray(profiles)&&new Set(profiles.map(x=>x.actorId)).size===profiles.length,'Invalid actor budget/profiles');
 const informed=informedActors(w,signal,profiles).sort((a,b)=>a.actorId.localeCompare(b.actorId));
 ok(informed.length<=maxActors,'Reaction budget exceeded');
 return informed.map(p=>decide(w,signal,p));
}
