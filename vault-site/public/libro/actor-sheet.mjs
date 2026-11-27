import {galahadSheet,validateSheet} from '../laboratorio/character-sheet.mjs';
import {sheetView} from '../laboratorio/character-sheet-view.mjs';
export function actorPresentation(id,snapshot=null){
 if(snapshot){if(snapshot.actorId!==id||snapshot.status!=='confirmed'||!Number.isInteger(snapshot.revision)||snapshot.sheet?.id!==id)throw Error('Snapshot de actor no confirmado');return {sheet:validateSheet(structuredClone(snapshot.sheet)),label:'Estado confirmado · revisión '+snapshot.revision}}
 if(id==='galahad')return {sheet:galahadSheet(),label:'Ficha v1 · datos de prueba, no estado de campaña'};
 return null;
}
export function renderActorSheet(target,id,portrait,snapshot=null){
 const data=actorPresentation(id,snapshot);if(!data)return false;
 const section=document.createElement('section');section.className='actor-folio folio-module';
 const label=document.createElement('p');label.className='actor-source';label.textContent=data.label;
 const view=document.createElement('div');view.className='actor-sheet-content';view.innerHTML=sheetView(data.sheet,{portrait});
 const back=document.createElement('book-link');back.setAttribute('view','story');back.textContent='Volver a la crónica';
 section.append(label,view,back);target.replaceChildren(section);return true;
}
