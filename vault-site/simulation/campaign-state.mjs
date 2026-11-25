// QA-01 foundation. Trusted server-side pure transitions, no database or HTTP auth.
import {createHash} from 'node:crypto';
import {campaign,effective,applyChanges} from './world-context.mjs';
import {findRoute} from './world-journey.mjs';
import {newSeed,die} from './engine.mjs';
import {validateSheet,derived} from '../public/laboratorio/character-sheet.mjs';
import {conditionProfile} from '../public/laboratorio/conditions.mjs';
import {simulateDuel} from '../public/laboratorio/duel.mjs';
import {validateCheck} from '../public/libro/check-contract.mjs';
import {buildImpactContext} from './ripple-impact.mjs';
import {createModule,moduleActions,resolveModule,moduleView} from './module-runtime.mjs';
const copy=structuredClone, own=Object.hasOwn;
const requireThat=(v,m)=>{if(!v)throw Error(m)};
const validId=s=>typeof s==='string'&&/^[a-z][a-z0-9_.-]{0,100}$/.test(s)&&!['constructor','prototype','__proto__'].includes(s);
const ordered=x=>Array.isArray(x)?x.map(ordered):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,ordered(x[k])])):x;
const hash=x=>createHash('sha256').update(JSON.stringify(ordered(x))).digest('hex');
export const VERSION='campaign-state-v1';
export const RNG_VERSION='addressed-d100-v1';
// Explicit, stateless address: a new unrelated draw cannot alter an existing address.
export function addressedRoll(seed,address,sides){requireThat(Array.isArray(address)&&address.length>0&&address.every(x=>typeof x==='string'||Number.isSafeInteger(x)),'Invalid roll address');return die(seed,[RNG_VERSION,...address],sides)}
export function combatRoller(seed,scope){requireThat(Array.isArray(scope)&&scope.length>0,'Invalid combat scope');return (sides,purpose,ordinal=0)=>{requireThat(typeof purpose==='string'&&purpose.length>0&&Number.isSafeInteger(ordinal)&&ordinal>=0,'Missing combat draw purpose');return addressedRoll(seed,[...scope,purpose,ordinal],sides)}}
const isOut=s=>s.state.incapacitated||s.state.unconscious||s.state.fatigue>=6;
const isVisible=(r,known)=>r&&(r.visibility==='public'||r.visibility==='known'&&known.has(r.id));
const select=(obj,keys)=>Object.fromEntries(keys.filter(k=>own(obj,k)).map(k=>[k,copy(obj[k])]));
// Public actor sheet is a projection of the authoritative record, never another stored copy.
function sheetView(s){
 const v=select(s,['schemaVersion','id','name','kind','speciesId','profession','rank','source','baseMove','magicPoints','equippedWeaponId','abilities','pendingAbilities']);
 v.attributes=select(s.attributes,['STR','CON','SIZ','DEX','INT','INS','POW','CHA']);
 v.skills=select(s.skills,['combat','athletics','brawn','endurance','evade','perception','stealth','willpower','influence','track','firstAid']);
 v.style=select(s.style,['id','name','weaponIds']);v.damageModifier=select(s.damageModifier,['count','sides','sign']);
 v.locations=s.locations.map(l=>select(l,['id','name','from','to','maxHp','hp','naturalAP','vital','limb','disabled']));
 v.inventory=s.inventory.map(i=>({...select(i,['id','kind','name','enc','quantity','carried','size','reach','hands','ap','maxHp','hp','natural','coverage','worn']),...(i.damage?{damage:select(i.damage,['count','sides','bonus'])}:{})}));
 v.state=select(s.state,['fatigue','bleeding','prone','stunTurns','incapacitated','unconscious','fear','cold','extraLoad','light']);
 return validateSheet(v);
}
function sheetOf(w,id){const e=w.entities[id];requireThat(e&&e.privateState?.sheet&&e.privateState.sheet.id===id,'Actor sheet missing');return validateSheet(e.privateState.sheet)}
function replaceSheet(entity,s){const {fatigue,hp,ap,rations,inventory,conditions,...rest}=entity.publicState??{};return {...entity,publicState:rest,privateState:{...entity.privateState,sheet:copy(validateSheet(s))}}}
function authorize(state,access){requireThat(access?.campaignId===state.id&&access.actorId===state.actorId,'Access denied')}
function readState(base,state){requireThat(state?.phase==='confirmed'&&state.schemaVersion===1&&state.rulesVersion===VERSION&&state.id===state.delta.id&&Number.isSafeInteger(state.elapsedSeconds)&&state.elapsedSeconds>=0,'Invalid state');const w=effective(base,state.delta);sheetOf(w,state.actorId);return w}
export function createState(base,{id,actorId,actorSheets,delta=campaign(base,id),knownIds=[],encounters=[],moduleDefinition=null,seed=newSeed()}){
 requireThat(validId(id)&&validId(actorId)&&delta.id===id&&typeof seed==='string'&&seed.length>0,'Invalid campaign');
 const w=effective(base,delta),entities=Object.create(null),ids=new Set();
 for(const s of actorSheets){validateSheet(s);requireThat(validId(s.id)&&w.entities[s.id]&&!ids.has(s.id),'Unknown or duplicate sheet actor');ids.add(s.id);entities[s.id]=replaceSheet(w.entities[s.id],s)}
 requireThat(ids.has(actorId)&&w.entities[actorId].kind==='player'&&w.entities[actorId].locationId,'Invalid player actor');
 const enc={};
 for(const e of encounters){requireThat(validId(e.id)&&!own(enc,e.id)&&ids.has(e.opponentId)&&e.opponentId!==actorId&&w.entities[e.opponentId].locationId===e.locationId&&w.nodes[e.locationId]&&Number.isInteger(e.maxRounds)&&e.maxRounds>=1&&e.maxRounds<=12,'Invalid encounter');enc[e.id]=select(e,['id','opponentId','locationId','maxRounds'])}
 requireThat(knownIds.every(k=>w.nodes[k]||w.entities[k]||w.routes[k]),'Unknown known ID');
 const next=applyChanges(base,delta,delta.revision,{entities});
 const module=moduleDefinition?createModule(moduleDefinition,effective(base,next),actorId):null;
 return {schemaVersion:1,phase:'confirmed',rulesVersion:VERSION,id,actorId,seed,delta:next,elapsedSeconds:0,knownIds:[...new Set([...knownIds,actorId,w.entities[actorId].locationId])],encounters:enc,completedEncounters:{},receipts:{},journal:[],...(module?{module}:{})};
}
export function legalActions(base,state,access){
 authorize(state,access);const w=readState(base,state),s=sheetOf(w,state.actorId),at=w.entities[state.actorId].locationId,known=new Set(state.knownIds),out=[];
 if(isOut(s))return out;
 if(s.inventory.some(i=>i.id==='rations'&&i.kind==='gear'&&i.carried&&i.quantity>0))out.push({action:'consume-ration'});
 if(conditionProfile(s,'evade','move').legal&&conditionProfile(s,'evade','move').move>0){
 for(const n of Object.values(w.nodes))if(n.id!==at&&isVisible(n,known)&&findRoute(w,at,n.id,{knownIds:state.knownIds}))out.push({action:'travel',targetId:n.id});
 }
 for(const e of Object.values(state.encounters))if(!own(state.completedEncounters,e.id)&&e.locationId===at&&w.entities[e.opponentId].locationId===at&&isVisible(w.entities[e.opponentId],known)&&!isOut(sheetOf(w,e.opponentId)))out.push({action:'duel',encounterId:e.id});
 out.push(...moduleActions(w,state,s));return out;
}
function commandShape(c){
 requireThat(c&&Object.getPrototypeOf(c)===Object.prototype&&validId(c.commandId)&&validId(c.actorId)&&validId(c.campaignId)&&Number.isSafeInteger(c.expectedRevision)&&c.expectedRevision>=0,'Invalid command');
 const args={travel:['targetId'],'consume-ration':[],duel:['encounterId'],'module-intent':['intentId']};requireThat(own(args,c.action),'Invalid action');
 const allowed=['commandId','actorId','campaignId','expectedRevision','action',...args[c.action]];
 requireThat(Object.keys(c).length===allowed.length&&allowed.every(k=>own(c,k))&&args[c.action].every(k=>validId(c[k])),'Invalid command fields');return hash(c);
}
const actionPart=c=>select(c,['action','targetId','encounterId','intentId']);
function sheetChanges(before,after){const changes=[];const add=(path,a,b)=>{if(hash(a)!==hash(b))changes.push({path,before:a,after:b})};for(const l of before.locations){const n=after.locations.find(x=>x.id===l.id);add('locations.'+l.id+'.hp',l.hp,n.hp);add('locations.'+l.id+'.disabled',l.disabled,n.disabled)}for(const i of before.inventory){const n=after.inventory.find(x=>x.id===i.id);add('inventory.'+i.id+'.quantity',i.quantity,n?.quantity??0);if(i.hp!==undefined)add('inventory.'+i.id+'.hp',i.hp,n?.hp??0)}for(const k of ['fatigue','bleeding','prone','stunTurns','incapacitated','unconscious','fear','cold','extraLoad','light'])add('state.'+k,before.state[k],after.state[k]);add('effectiveAP',conditionProfile(before).ap,conditionProfile(after).ap);return changes}
function checkProjection(c,id){const p=select(c,['schemaVersion','id','actorId','actorName','skillId','skillName','base','target','difficulty','reason','dice','roll','outcome','visibility','source','role','formula']);p.id=id+'.'+p.id;return validateCheck(p)}
function resolve(base,state,access,c){
 const fingerprint=commandShape(c);authorize(state,access);requireThat(c.campaignId===state.id&&c.actorId===state.actorId,'Command actor/campaign mismatch');
 const w=readState(base,state);requireThat(c.expectedRevision===state.delta.revision,'Revision conflict');
 requireThat(legalActions(base,state,access).some(a=>hash(a)===hash(actionPart(c))),'Action not allowed');
 const next=copy(state),actor=w.entities[state.actorId],sheet=copy(sheetOf(w,state.actorId)),entities=Object.create(null),checks=[],facts=[],participants=[actor.id],observations=[];let seconds=0,locationId=actor.locationId,combat=null;
 const id='evt-'+hash([state.id,state.delta.revision,c.commandId]).slice(0,32);
 const fact=(kind,description,data={})=>{const f={id:id+'.f'+facts.length,kind,description,...data};facts.push(f);return f.id};
 if(c.action==='consume-ration'){
 const i=sheet.inventory.findIndex(x=>x.id==='rations');if(sheet.inventory[i].quantity===1)sheet.inventory.splice(i,1);else sheet.inventory[i].quantity--;
 entities[actor.id]=replaceSheet(actor,sheet);fact('ration-consumed','Se consume una ración.');seconds=60;
 }else if(c.action==='travel'){
 const route=findRoute(w,actor.locationId,c.targetId,{knownIds:state.knownIds});
 locationId=c.targetId;seconds=route.minutes*60;requireThat(Number.isSafeInteger(seconds),'Invalid travel duration');
 entities[actor.id]={...actor,locationId};next.knownIds=[...new Set([...state.knownIds,...route.nodes,...route.routes])];fact('travel','Desplazamiento completado.',{fromId:actor.locationId,toId:locationId,routeIds:route.routes});
 }else if(c.action==='module-intent'){
 const roll=combatRoller(state.seed,[state.id,state.delta.revision,state.module.id,state.module.version]);
 seconds=resolveModule(w,state,next,sheet,c.intentId,{eventId:id,roll,fact,checks,entities,participants,observations});checks.forEach(validateCheck);
 }else{
 const enc=state.encounters[c.encounterId],opponent=w.entities[enc.opponentId];participants.push(opponent.id);
 const scope=[state.id,state.delta.revision,enc.id];
 const roll=combatRoller(state.seed,scope);
 const duel=simulateDuel(sheet,sheetOf(w,opponent.id),{seed:'private-provider',roll,tactical:true,maxRounds:enc.maxRounds});
 for(const s of duel.actors)entities[s.id]=replaceSheet(w.entities[s.id],s);
 for(const e of duel.events)for(const ch of e.checks??[])checks.push(checkProjection(ch,id));
 combat={profile:duel.mode,encounterId:enc.id,rounds:duel.rounds,actorIds:duel.actors.map(a=>a.id),apTrace:duel.events.filter(e=>Array.isArray(e.ap)).map(e=>({round:e.round,kind:e.kind,remaining:[...e.ap]}))};
 seconds=duel.elapsed;next.completedEncounters[enc.id]={eventId:id,outcome:duel.outcome,winner:duel.winner};
 fact('duel-resolved','Encuentro resuelto.',{encounterId:enc.id,outcome:duel.outcome,winnerId:duel.winner,rounds:duel.rounds});
 }
 next.delta=applyChanges(base,state.delta,c.expectedRevision,{entities});next.elapsedSeconds+=seconds;
 const changes=sheetChanges(sheetOf(w,actor.id),sheetOf(effective(base,next.delta),actor.id));
 const event={schemaVersion:1,id,revision:next.delta.revision,actorId:actor.id,action:c.action,...(state.module?{moduleId:state.module.id,moduleVersion:state.module.version}:{}),...(c.intentId?{intentId:c.intentId}:{}),locationId,participantIds:participants,checks,facts,changes,...(combat?{combat}:{}),knowledge:[{entityId:actor.id,source:'participant',factIds:facts.map(f=>f.id)},...observations],elapsedSeconds:seconds,source:'simulation-runtime-prototype'};
 const unique=new Set(checks.map(x=>x.id));requireThat(unique.size===checks.length,'Duplicate check ID');
 next.journal.push(copy(event));
 const previewHash=hash([state.id,base.id,state.delta.revision,fingerprint,next.delta,...(next.module?[next.module]:[]),event]);
 return {next,event,previewHash,fingerprint};
}
// For a trusted preparation worker only; the speculative result must never be served to a player.
export function previewCommand(base,state,access,c){requireThat(access?.role==='worker','Worker access required');const r=resolve(base,state,access,c);return {kind:'speculative',event:copy(r.event),previewHash:r.previewHash,state:{...copy(r.next),phase:'speculative'}}}
// Prepared transitions are private server records, not browser-supplied results.
const preparationStateHash=s=>{const {receipts,...rest}=s;return hash(rest)};
function isSkillIntent(state,c){return c.action==='module-intent'&&state.module?.intents[c.intentId]?.capability==='skill-check'}
export function confirmCommand(base,state,access,c,{expectedPreviewHash,preparedTransition}={}){
 requireThat(access?.role==='player','Player access required');const fingerprint=commandShape(c);authorize(state,access);requireThat(c.campaignId===state.id&&c.actorId===state.actorId,'Command actor/campaign mismatch');readState(base,state);
 if(own(state.receipts,c.commandId)){const r=state.receipts[c.commandId];requireThat(r.fingerprint===fingerprint,'Command ID reused');return {state:copy(state),receipt:copy(r),duplicate:true}}
 let r;
 if(preparedTransition!==undefined){
  requireThat(preparedTransition.kind==='private-prepared-transition'&&preparedTransition.baseSnapshotId===base.id&&preparedTransition.beforeHash===preparationStateHash(state)&&preparedTransition.fingerprint===fingerprint,'Prepared transition stale or mismatched');
  requireThat(preparedTransition.integrity===hash([preparedTransition.beforeHash,preparedTransition.fingerprint,preparedTransition.result]),'Prepared transition corrupted');
  requireThat(legalActions(base,state,access).some(a=>hash(a)===hash(actionPart(c))),'Action not allowed');
  r=copy(preparedTransition.result);r.next.receipts=copy(state.receipts);
 }else{requireThat(!isSkillIntent(state,c),'Skill check must be prepared before confirmation');r=resolve(base,state,access,c)}
 if(expectedPreviewHash!==undefined)requireThat(expectedPreviewHash===r.previewHash,'Preview mismatch');
 const receipt={commandId:c.commandId,fingerprint,revision:r.event.revision,event:copy(r.event)};
 r.next.receipts[c.commandId]=receipt;return {state:r.next,receipt:copy(receipt),duplicate:false};
}
export function playerState(base,state,access){
 requireThat(access?.role==='player','Player access required');authorize(state,access);const w=readState(base,state),actor=w.entities[state.actorId],s=sheetView(sheetOf(w,state.actorId)),known=new Set(state.knownIds);
 const nodes=Object.values(w.nodes).filter(n=>isVisible(n,known)).map(n=>({...select(n,['id','name','kind','generation','q','r','terrain']),...(isVisible(w.nodes[n.parentId],known)?{parentId:n.parentId}:{})}));
 const visibleIds=new Set(nodes.map(n=>n.id));
 return {schemaVersion:1,campaignId:state.id,revision:state.delta.revision,actorId:actor.id,locationId:actor.locationId,elapsedSeconds:state.elapsedSeconds,sheet:s,derived:derived(s),effectiveAP:conditionProfile(s).ap,...(state.module?{module:moduleView(state.module)}:{}),nodes,routes:Object.values(w.routes).filter(r=>isVisible(r,known)&&visibleIds.has(r.a)&&visibleIds.has(r.b)).map(r=>select(r,['id','a','b','status','minutes'])),actions:legalActions(base,state,access),journal:state.journal.map(e=>select(e,['schemaVersion','id','revision','actorId','action','moduleId','moduleVersion','intentId','locationId','checks','facts','changes','combat','elapsedSeconds','source']))};
}
// Confirmed events only; private graph packet for analyst. No automatic NPC reaction.
export function impactForConfirmed(base,state,access,eventId,relations=[]){
 requireThat(access?.role==='analyst','Analyst access required');authorize(state,access);const w=readState(base,state),e=state.journal.find(x=>x.id===eventId);
 requireThat(e&&Object.values(state.receipts).some(r=>r.event.id===eventId),'Event not confirmed');
 return buildImpactContext(w,relations,e);
}

// QA-02/07: private bounded anticipation over the same authoritative transition.
// No secondary hero state, no authored module/canon, no writes, no LLM.
export function prepareWindow(base,state,access,{maxDepth=3,maxEdges=40}={}){
 requireThat(access?.role==='worker','Worker access required');authorize(state,access);readState(base,state);
 requireThat(Number.isInteger(maxDepth)&&maxDepth>=1&&maxDepth<=6&&Number.isInteger(maxEdges)&&maxEdges>=1&&maxEdges<=1200,'Invalid anticipation budget');
 const rootId='window-'+hash([state.id,base.id,state.delta.revision,VERSION]).slice(0,32);
 const nodes=[],jobs=[],preparedTransitions={},queue=[{id:rootId,state:copy(state),depth:0}];let edges=0,omitted=0;
 const publicAccess={...access,role:'player'};
 for(let i=0;i<queue.length;i++){
  const n=queue[i],actions=legalActions(base,n.state,access);
  const row={id:n.id,revision:n.state.delta.revision,depth:n.depth,choices:[],deferred:[],terminal:actions.length===0};nodes.push(row);
  if(n.depth>=maxDepth){row.deferred=copy(actions);omitted+=actions.length;continue}
  for(const action of actions){
   // Every legal immediate option is retained even when preparation budget is exhausted.
   const command={campaignId:state.id,actorId:state.actorId,expectedRevision:n.state.delta.revision,commandId:'prepared-'+hash([n.id,action]).slice(0,32),...action};
   if(edges>=maxEdges){row.deferred.push(copy(action));omitted++;continue}
   const r=resolve(base,n.state,access,command);edges++;
   if(isSkillIntent(n.state,command)){
    const beforeHash=preparationStateHash(n.state),result=copy(r);
    preparedTransitions[command.commandId]={kind:'private-prepared-transition',baseSnapshotId:base.id,beforeHash,fingerprint:r.fingerprint,result,integrity:hash([beforeHash,r.fingerprint,result])};
   }
   const childId='window-'+hash([n.id,command.commandId,r.previewHash]).slice(0,32);
   const before=playerState(base,n.state,publicAccess),after=playerState(base,r.next,publicAccess);
   const event=after.journal.at(-1);
   row.choices.push({command,previewHash:r.previewHash,eventId:event.id,nextId:childId});
   // Inputs to trusted narration worker contain only branch-local player-visible facts.
   // Do not include seed, private sheets, other branches or authoritative mutable state.
   jobs.push({schemaVersion:1,kind:'narration-job',status:'queued',resolution:'speculative',campaignId:state.id,baseRevision:state.delta.revision,branchId:childId,eventId:event.id,actorId:state.actorId,locationId:event.locationId,rulesVersion:VERSION,...(event.moduleId?{moduleId:event.moduleId,moduleVersion:event.moduleVersion}:{}),audience:'player:'+state.actorId,input:{event,before:{locationId:before.locationId,elapsedSeconds:before.elapsedSeconds},after:{locationId:after.locationId,elapsedSeconds:after.elapsedSeconds,actions:after.actions}},checkIds:event.checks.map(c=>c.id)});
   queue.push({id:childId,state:r.next,depth:n.depth+1});
  }
 }
 return {schemaVersion:1,kind:'private-anticipation-window',campaignId:state.id,baseSnapshotId:base.id,baseRevision:state.delta.revision,rootId,nodes,jobs,preparedTransitions,coverage:{edges,nodes:nodes.length,omitted,immediateComplete:nodes[0].deferred.length===0,maxDepth,maxEdges}};
}
