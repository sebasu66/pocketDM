// Server-only narrative projection candidate for QA-02/QA-08.
import {playerState} from './campaign-state.mjs';
import {validateCheck,validateEvent} from '../public/libro/check-contract.mjs';
export const NARRATION_VERSION='narrative-confirmed-v1';
const ensure=(ok,msg)=>{if(!ok)throw Error(msg)};
const copy=structuredClone;
const checkKeys=['schemaVersion','id','actorId','actorName','skillId','skillName','base','target','difficulty','reason','dice','roll','outcome','visibility','source','role','formula'];
const actions={ 'consume-ration':'Una pausa en el camino',travel:'El camino recorrido',duel:'El encuentro','module-intent':'Prueba de habilidad' };
function projectedCheck(c,e){
 ensure(c.id.startsWith(e.id+'.'),'Check outside event');
 ensure(c.visibility==='player','Private check');
 return validateCheck(Object.fromEntries(checkKeys.filter(k=>Object.hasOwn(c,k)).map(k=>[k,copy(c[k])])));
}
function fallback(e,nodes){
 const label=id=>nodes.find(n=>n.id===id)?.name;
 const text=[];
 for(const f of e.facts){
  if(f.kind==='ration-consumed'&&e.action==='consume-ration')text.push('Se consumió una ración.');
  else if(f.kind==='travel'&&e.action==='travel'){
   const from=label(f.fromId),to=label(f.toId);
   ensure(to&&f.toId===e.locationId,'Unknown travel destination');
   text.push(from?'El viaje desde '+from+' hasta '+to+' ha concluido.':'El viaje hasta '+to+' ha concluido.');
  }else if(f.kind==='duel-resolved'&&e.action==='duel'){
   text.push('El encuentro concluyó. Los chequeos registrados permiten consultar su resolución.');
  }else if(f.kind==='skill-check-resolved'&&e.action==='module-intent'){
   const check=e.checks.find(c=>c.id===f.checkId);
   ensure(check&&check.outcome===f.outcome,'Skill result mismatch');
   text.push(['success','critical'].includes(check.outcome)?'La maniobra tuvo éxito.':'La maniobra no tuvo éxito.');
  }else throw Error('Unsupported visible fact: '+f.kind);
 }
 ensure(text.length>0,'No supported facts');
 // Facts only: do not turn a roll into invented injuries, feelings or actions.
 return text.join(' ');
}
// Trusted server entrypoint. Never call with access or state built from browser JSON.
// Returns a single confirmed event already in the player's journal, no worker input.
export function confirmedNarration(base,state,access,eventId,{locale='es-AR'}={}){
 ensure(locale==='es-AR','Unsupported locale');
 const view=playerState(base,state,access);
 const e=view.journal.find(x=>x.id===eventId);
 ensure(e&&e.revision<=view.revision,'Event not confirmed in player journal');
 ensure(Object.values(state.receipts).some(r=>r.event.id===e.id&&r.revision===e.revision),'Event lacks confirmed receipt');
 ensure(Object.hasOwn(actions,e.action),'Unsupported action');
 const checks=e.checks.map(c=>projectedCheck(c,e));
 const text=[fallback(e,view.nodes)];
 for(const c of checks)text.push(' ',{check:c.id});
 const presentation=validateEvent({id:e.id,revision:e.revision,phase:e.action,title:actions[e.action],roman:'',text,checks});
 return {schemaVersion:1,kind:'confirmed-narration',campaignId:view.campaignId,actorId:view.actorId,revision:e.revision,eventId:e.id,locale,narratorVersion:NARRATION_VERSION,presentationStatus:'fallback',presentation};
}
