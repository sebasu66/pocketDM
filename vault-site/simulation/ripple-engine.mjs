// Ripple v1. Trusted, versioned authoring data; never execute narrator-supplied code.
// Every application is pure and bounded; commit through the campaign revision service.
const copy=structuredClone,own=(o,k)=>Object.hasOwn(o,k);
const ok=(v,m)=>{if(!v)throw Error(m)};
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.-]{0,100}$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const keys=(x,allowed)=>{ok(x&&typeof x==='object'&&!Array.isArray(x),'Invalid object');ok(Object.keys(x).every(k=>allowed.includes(k)),'Unsupported field')};
const entity=(w,x)=>id(x)&&own(w.entities,x);
const faction=(w,x)=>entity(w,x)&&w.entities[x].kind==='faction';
const location=(w,x)=>id(x)&&own(w.nodes,x);
const actor=(w,x)=>entity(w,x)&&['player','npc','creature'].includes(w.entities[x].kind);
const types=['relation','reputation','stock','control','agenda'];
function record(w,r){
 ok(id(r.id)&&types.includes(r.kind),'Invalid ripple record');
 if(r.kind==='relation'){keys(r,['id','kind','from','to','value']);ok(actor(w,r.from)&&actor(w,r.to)&&r.from!==r.to&&integer(r.value,-100,100),'Invalid relationship')}
 if(r.kind==='reputation'){keys(r,['id','kind','actorId','factionId','value']);ok(actor(w,r.actorId)&&faction(w,r.factionId)&&integer(r.value,-100,100),'Invalid reputation')}
 if(r.kind==='stock'){keys(r,['id','kind','locationId','resourceId','value']);ok(location(w,r.locationId)&&entity(w,r.resourceId)&&w.entities[r.resourceId].kind==='resource'&&integer(r.value,0,1000000),'Invalid resource stock')}
 if(r.kind==='control'){keys(r,['id','kind','locationId','factionId']);ok(location(w,r.locationId)&&(r.factionId===null||faction(w,r.factionId)),'Invalid control')}
 if(r.kind==='agenda'){keys(r,['id','kind','actorId','locationId','dueMinute','status']);ok(actor(w,r.actorId)&&location(w,r.locationId)&&(r.dueMinute===null||integer(r.dueMinute,0,Number.MAX_SAFE_INTEGER))&&['idle','scheduled','resolved'].includes(r.status)&&(r.status==='idle')===(r.dueMinute===null),'Invalid agenda')}
 return r;
}
function validateEffect(w,records,e){
 ok(e&&id(e.recordId)&&own(records,e.recordId),'Unknown effect target');
 const r=records[e.recordId];
 if(e.op==='adjust'){keys(e,['op','recordId','amount']);ok(['relation','reputation','stock'].includes(r.kind)&&integer(e.amount,-1000000,1000000)&&e.amount!==0,'Invalid adjustment')}
 else if(e.op==='control'){keys(e,['op','recordId','factionId']);ok(r.kind==='control'&&(e.factionId===null||faction(w,e.factionId)),'Invalid controller')}
 else if(e.op==='schedule'){keys(e,['op','recordId','afterMinutes']);ok(r.kind==='agenda'&&integer(e.afterMinutes,0,10080),'Invalid schedule')}
 else throw Error('Unsupported effect '+e.op);
}
export function validateRipplePlan(w,plan){
 keys(plan,['id','version','initial','rules']);ok(id(plan.id)&&integer(plan.version,1,1000)&&Array.isArray(plan.initial)&&plan.initial.length<=100&&Array.isArray(plan.rules)&&plan.rules.length<=32,'Invalid plan');
 const records=Object.create(null),identities=new Set();
 for(const r of plan.initial){record(w,r);ok(!own(records,r.id),'Duplicate record');const identity=JSON.stringify(r.kind==='relation'?[r.kind,r.from,r.to]:r.kind==='reputation'?[r.kind,r.actorId,r.factionId]:r.kind==='stock'?[r.kind,r.locationId,r.resourceId]:r.kind==='control'?[r.kind,r.locationId]:[r.kind,r.id]);ok(!identities.has(identity),'Duplicate domain record');identities.add(identity);records[r.id]=copy(r)}
 const ruleIds=new Set();
 for(const r of plan.rules){
  keys(r,['id','when','effects']);ok(id(r.id)&&!ruleIds.has(r.id)&&Array.isArray(r.effects)&&r.effects.length>0&&r.effects.length<=8,'Invalid rule');ruleIds.add(r.id);
  const t=r.when;ok(t&&typeof t.kind==='string','Invalid trigger');
  if(t.kind==='fact'||t.kind==='ending'){keys(t,['kind','value']);ok(id(t.value),'Invalid completion trigger')}
  else if(t.kind==='change'){keys(t,['kind','recordId','atLeast']);ok(id(t.recordId)&&own(records,t.recordId)&&integer(t.atLeast,-1000000,1000000)&&typeof records[t.recordId].value==='number','Invalid change trigger');
  }else throw Error('Unsupported trigger '+t.kind);
  r.effects.forEach(e=>validateEffect(w,records,e));
 }
 return records;
}
export function newRipple(){return {schemaVersion:1,plans:{},records:{},applied:{},history:[]}}
function validateState(w,state){ok(state?.schemaVersion===1&&state.plans&&state.records&&state.applied&&Array.isArray(state.history),'Invalid ripple state');for(const [k,r] of Object.entries(state.records)){ok(k===r.id,'Record key mismatch');record(w,r)}}
export function applyRipple(w,state,plan,signal,{minute,maxEffects=64}={}){
 validateState(w,state);const initial=validateRipplePlan(w,plan);
 ok(integer(minute,0,Number.MAX_SAFE_INTEGER)&&integer(maxEffects,1,256),'Invalid ripple budget/time');
 keys(signal,['id','moduleId','ending','facts']);ok(id(signal.id)&&id(signal.moduleId)&&id(signal.ending)&&Array.isArray(signal.facts)&&signal.facts.every(id)&&signal.facts.length<=64,'Invalid completion signal');
 const fingerprint=JSON.stringify([plan.id,plan.version,signal.moduleId,signal.ending,[...new Set(signal.facts)].sort(),minute]);
 if(own(state.applied,signal.id)){ok(state.applied[signal.id].fingerprint===fingerprint,'Ripple signal reused');return {state:copy(state),changes:copy(state.applied[signal.id].changes),duplicate:true}}
 const next=copy(state),planKey=plan.id,signature=JSON.stringify(plan);
 if(own(next.plans,planKey))ok(next.plans[planKey]===signature,'Plan version/content changed; migration required');
 else{
  for(const [k,r] of Object.entries(initial)){ok(!own(next.records,k),'Record belongs to another plan');next.records[k]=copy(r)}
  next.plans[planKey]=signature;
 }
 const queue=[{kind:'ending',value:signal.ending},...[...new Set(signal.facts)].sort().map(value=>({kind:'fact',value}))],fired=new Set(),changes=[];
 const matches=(t,e)=>t.kind===e.kind&&(t.kind==='change'?t.recordId===e.recordId&&e.before<t.atLeast&&e.after>=t.atLeast:t.value===e.value);
 for(let i=0;i<queue.length;i++){
  const event=queue[i];
  for(const rule of plan.rules){
   if(fired.has(rule.id)||!matches(rule.when,event))continue;
   fired.add(rule.id);
   for(const e of rule.effects){
    ok(changes.length<maxEffects,'Ripple effect budget exceeded');
    const r=next.records[e.recordId],before=copy(r);
    if(e.op==='adjust'){const value=r.value+e.amount;ok(integer(value,r.kind==='stock'?0:-100,r.kind==='stock'?1000000:100),'Ripple value out of range');r.value=value}
    else if(e.op==='control')r.factionId=e.factionId;
    else if(e.op==='schedule'){ok(r.status==='idle','Agenda already scheduled or resolved');ok(integer(minute+e.afterMinutes,0,Number.MAX_SAFE_INTEGER),'Invalid due minute');r.dueMinute=minute+e.afterMinutes;r.status='scheduled'}
    record(w,r);
    const change={ruleId:rule.id,trigger:copy(event),recordId:r.id,before,after:copy(r)};
    changes.push(change);
    if(typeof r.value==='number'&&before.value!==r.value)queue.push({kind:'change',recordId:r.id,before:before.value,after:r.value});
   }
  }
 }
 next.applied[signal.id]={fingerprint,changes:copy(changes)};
 next.history.push({signalId:signal.id,moduleId:signal.moduleId,minute,changes:copy(changes)});
 return {state:next,changes,duplicate:false};
}
export function dueAgendas(state,minute){ok(integer(minute,0,Number.MAX_SAFE_INTEGER),'Invalid minute');return Object.values(state.records).filter(r=>r.kind==='agenda'&&r.status==='scheduled'&&r.dueMinute<=minute).sort((a,b)=>a.dueMinute-b.dueMinute||a.id.localeCompare(b.id)).map(r=>copy(r))}
export function rippleCondition(state,expr,minute){
 const r=own(state.records,expr.recordId)?state.records[expr.recordId]:null;
 switch(expr.op){
  case 'ripple-at-least':ok(integer(expr.value,-1000000,1000000),'Invalid threshold');return !!r&&typeof r.value==='number'&&r.value>=expr.value;
  case 'ripple-control':return r?.kind==='control'&&r.factionId===expr.factionId;
  case 'ripple-agenda-due':return r?.kind==='agenda'&&r.status==='scheduled'&&r.dueMinute<=minute;
  default:throw Error('Unsupported ripple condition');
 }
}
