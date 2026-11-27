// SYS-07 candidate adapter. Server-only; resolver/repository contracts pending SYS-05/06.
import {createHash} from 'node:crypto';
import {playerState} from './campaign-state.mjs';
import {NARRATION_VERSION} from './narrative-projection.mjs';
import {readConfirmedNarration} from '../public/libro/confirmed-narration.mjs';
const requireThat=(ok,message)=>{if(!ok)throw Error(message)};
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
export const confirmedEventDigest=event=>createHash('sha256').update(JSON.stringify(canonical(event))).digest('hex');
const checkKeys=['schemaVersion','id','actorId','actorName','skillId','skillName','base','target','difficulty','reason','dice','roll','outcome','visibility','source','role','formula'];
const fragmentKeys=['schemaVersion','status','campaignId','actorId','eventId','revision','eventDigest','locale','title','roman','text'];
// Only trusted server-side repository callback, never a fragment supplied by the player.
// Event digest binds the candidate to the confirmed visible event; SYS-05 still owns branch/context approval.
export async function confirmedModuleNarration(base,state,access,eventId,findApproved){
 const view=playerState(base,state,access);
 const event=view.journal.find(e=>e.id===eventId);
 requireThat(event&&event.action==='module-intent'&&event.revision<=view.revision,'Module event not confirmed');
 requireThat(Object.values(state.receipts).some(r=>r.event.id===event.id&&r.revision===event.revision),'Event lacks confirmed receipt');
 requireThat(typeof findApproved==='function','Error de preparación: repositorio no disponible');
 const scope={campaignId:view.campaignId,actorId:view.actorId,eventId:event.id,revision:event.revision,eventDigest:confirmedEventDigest(event),locale:'es-AR'};
 const f=await findApproved(Object.freeze({...scope}));
 requireThat(f&&typeof f==='object'&&!Array.isArray(f)&&Object.keys(f).every(k=>fragmentKeys.includes(k))&&f.schemaVersion===1&&f.status==='approved'&&Object.entries(scope).every(([k,v])=>f[k]===v),'Error de preparación: fragmento aprobado ausente o desactualizado');
 const checks=event.checks.map(c=>{
  requireThat(c.visibility==='player'&&c.id.startsWith(event.id+'.'),'Invalid visible check');
  return Object.fromEntries(checkKeys.filter(k=>Object.hasOwn(c,k)).map(k=>[k,structuredClone(c[k])]));
 });
 const envelope={schemaVersion:1,kind:'confirmed-narration',campaignId:scope.campaignId,actorId:scope.actorId,revision:event.revision,eventId:event.id,locale:scope.locale,narratorVersion:NARRATION_VERSION,presentationStatus:'approved',presentation:{id:event.id,revision:event.revision,phase:event.action,title:f.title,roman:f.roman,text:structuredClone(f.text),checks}};
 readConfirmedNarration(envelope,view);
 return envelope;
}
