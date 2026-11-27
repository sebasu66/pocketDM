// Isolated example renderer: no campaign transport or state.
import {makeModuleLayout,loadModuleLayout} from './edition/module-layout.mjs';
const el=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node};
export function renderBookFolio(p,context,{onSubmit=null,demo=false,legacyEvent=null,onDemoChoice=null}={}){
  const section=makeModuleLayout(p,{title:context.title});const layout=section;
  const layoutStatus=el('p','');layoutStatus.className='sample';layoutStatus.setAttribute('aria-live','polite');section.append(layoutStatus);
  loadModuleLayout(layout,p.layoutRef).catch(error=>{layoutStatus.textContent='Diseño no disponible: '+error.message+' · Se muestran ajustes base.'});
  const scope={campaignId:context.campaignId,actorId:context.actorId,revision:context.revision};
  if(legacyEvent&&demo){const node=el('book-narrative-event');node.setAttribute('event',legacyEvent);section.append(node)}
  for(const event of p.events){const node=el(p.type==='combat'?'combat-phase':'book-narrative-event');node.setConfirmedNarration(event,scope);section.append(node)}
  if(p.choices.length){const group=el('div');group.className='decision';const status=el('p',demo?'Elegí una opción de muestra. No modifica la campaña.':onSubmit?'Elegí una acción.':'Opciones preparadas. Hace falta conectar el servicio de campaña para confirmarlas.');status.className='sample';status.setAttribute('aria-live','polite');
   for(const choice of p.choices){const b=el('button',choice.label);b.type='button';b.disabled=demo?!onDemoChoice:!onSubmit;b.onclick=async()=>{if(demo){if(!onDemoChoice)return;for(const c of group.querySelectorAll('button'))c.setAttribute('aria-pressed',String(c===b));status.textContent=onDemoChoice(choice.id);return}if(!onSubmit)return;for(const c of group.querySelectorAll('button'))c.disabled=true;try{await onSubmit({campaignId:scope.campaignId,actorId:scope.actorId,expectedRevision:scope.revision,pageId:p.id,choiceId:choice.id});status.textContent='Solicitud enviada; esperando la edición autorizada.'}catch(e){status.textContent=e?.message==='Error de preparación: falta narración aprobada'?'Error de preparación: falta narración aprobada.':'No se confirmó la acción. Reintentá la misma opción o reanudá la campaña.';for(const c of group.querySelectorAll('button'))c.disabled=false}};group.append(b)}group.slot='navigation';status.slot='navigation';section.append(group,status)}
  return section;
}
