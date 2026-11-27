// Presentation-only validation, not authorization. Server owns the confirmed envelope.
import {validateEvent} from './check-contract.mjs';
const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>keys.includes(k));
const requireThat=(ok,m)=>{if(!ok)throw Error(m)};
export function readConfirmedNarration(data,scope){
 requireThat(exact(data,['schemaVersion','kind','campaignId','actorId','revision','eventId','locale','narratorVersion','presentationStatus','presentation']),'Unknown envelope fields');
 requireThat(data.schemaVersion===1&&data.kind==='confirmed-narration'&&['fallback','approved'].includes(data.presentationStatus)&&data.narratorVersion==='narrative-confirmed-v1'&&data.locale==='es-AR','Unsupported narrative envelope');
 requireThat(scope&&data.campaignId===scope.campaignId&&data.actorId===scope.actorId&&Number.isSafeInteger(scope.revision)&&Number.isSafeInteger(data.revision)&&data.revision>=0&&data.revision<=scope.revision,'Narration scope mismatch');
 const e=data.presentation;
 requireThat(exact(e,['id','revision','phase','title','roman','text','checks'])&&e.id===data.eventId&&e.revision===data.revision&&typeof e.title==='string'&&e.title.trim()&&typeof e.phase==='string'&&typeof e.roman==='string'&&Array.isArray(e.text)&&Array.isArray(e.checks),'Invalid presentation');
 requireThat(data.presentationStatus!=='approved'||e.text.some(t=>typeof t==='string'&&t.trim()),'Error de preparación: falta narración aprobada');
 requireThat(e.text.every(t=>typeof t==='string'||exact(t,['check'])&&typeof t.check==='string'),'Invalid text token');
 requireThat(e.checks.every(c=>exact(c,['schemaVersion','id','actorId','actorName','skillId','skillName','base','target','difficulty','reason','dice','roll','outcome','visibility','source','role','formula'])&&typeof c.id==='string'&&c.id.startsWith(e.id+'.')),'Invalid check projection');
 return validateEvent(structuredClone(e));
}
