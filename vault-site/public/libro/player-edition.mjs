import {readCampaignProjection} from './campaign-projection.mjs';
import {createBookCampaignSession} from './book-campaign-session.mjs';
import {readConfirmedNarration} from './confirmed-narration.mjs';
import {makeModuleLayout,loadModuleLayout} from './edition/module-layout.mjs';
const fail=(ok,msg)=>{if(!ok)throw Error(msg)};
const record=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>keys.includes(k));
const str=(x,max=12000)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
const id=x=>str(x,160)&&/^[a-zA-Z0-9_.:-]+$/.test(x);
const assets=x=>typeof x==='string'&&/^\/(?:libro\/assets|libro\/edition\/assets|docs\/art-references)\/[a-zA-Z0-9_./-]+\.(?:png|webp|jpg|jpeg|svg)$/i.test(x)&&!x.includes('..');
export function readEdition(value){
 fail(record(value,['schemaVersion','kind','campaignId','actorId','revision','title','pages','projection'])&&value.schemaVersion===1&&value.kind==='pocketdm-player-edition','Formato de edición no admitido');
 const {campaignId,actorId,revision,title,pages}=value;
 fail(id(campaignId)&&id(actorId)&&Number.isSafeInteger(revision)&&revision>=0&&str(title,240)&&Array.isArray(pages)&&pages.length>0&&pages.length<=200,'Contexto de edición inválido');
 const scope={campaignId,actorId,revision},ids=new Set(),events=new Set(),checks=new Set();
 for(const p of pages){
  fail(record(p,['id','type','title','text','image','speaker','portrait','events','choices','layoutRef','details','line','speakerRole'])&&id(p.id)&&!ids.has(p.id)&&['cover','location','dialogue','exploration','combat','climax','resolution'].includes(p.type)&&str(p.title,240)&&Array.isArray(p.text)&&p.text.length<=100&&p.text.every(t=>str(t)), 'Página inválida');
  ids.add(p.id);
  for(const k of ['image','portrait'])if(Object.hasOwn(p,k))fail(assets(p[k]),'Imagen fuera de la biblioteca pública');
  if(Object.hasOwn(p,'speaker'))fail(str(p.speaker,160),'Interlocutor inválido');
  for(const k of ['line','speakerRole'])if(Object.hasOwn(p,k))fail(str(p[k]),'Texto de diálogo inválido');
  if(p.details!==undefined)fail(Array.isArray(p.details)&&p.details.length<=40&&p.details.every(r=>record(r,['label','value'])&&str(r.label,160)&&str(r.value,2000)),'Contexto inválido');
  if(p.layoutRef!==undefined)fail(record(p.layoutRef,['id','revision'])&&str(p.layoutRef.id,160)&&(p.layoutRef.revision===undefined||Number.isSafeInteger(p.layoutRef.revision)&&p.layoutRef.revision>=0),'Referencia editorial inválida');
  fail(Array.isArray(p.events)&&p.events.length<=100,'Eventos inválidos');
  for(const e of p.events){const confirmed=readConfirmedNarration(e,scope);fail(!events.has(confirmed.id),'Evento duplicado');events.add(confirmed.id);for(const c of confirmed.checks){fail(!checks.has(c.id),'Chequeo duplicado en edición');checks.add(c.id)}}
  fail(Array.isArray(p.choices)&&p.choices.length<=30,'Opciones inválidas');
  const choices=new Set();
  for(const c of p.choices){fail(record(c,['id','label'])&&id(c.id)&&str(c.label,500)&&!choices.has(c.id),'Opción inválida');choices.add(c.id)}
  if(p!==pages.at(-1))fail(p.choices.length===0,'No se admiten opciones de ramas pasadas o futuras');
 }
 if(value.projection!==undefined)readCampaignProjection(value.projection,scope);
 return structuredClone(value);
}
let edition=null,submit=null;
export function setPlayerEdition(data){const next=readEdition(data);if(edition&&next.campaignId===edition.campaignId&&next.actorId===edition.actorId&&next.revision<edition.revision)throw Error('Revisión anterior a la edición abierta');edition=next;return edition}
export function getPlayerEdition(){return edition}
// Call from authenticated app integration when SYS-06 transport is available.
export function connectPlayerCampaign(transport,scope,reader=window.PocketDMEdition){return createBookCampaignSession({reader,readEdition,transport,scope})}
export function bindEditionTransport(fn){if(fn!==null&&typeof fn!=='function')throw Error('Transporte inválido');submit=fn}
const el=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node};
class PlayerPage extends HTMLElement{
 connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const p=edition?.pages[Number(this.getAttribute('index'))];if(!p)return;
  const section=el('section');section.className='folio-module';
  const layout=makeModuleLayout(p,{title:edition.title});
  section.append(layout);
  const layoutStatus=el('p','');layoutStatus.className='sample';layoutStatus.setAttribute('aria-live','polite');section.append(layoutStatus);
  loadModuleLayout(layout,p.layoutRef).catch(error=>{layoutStatus.textContent='Diseño no disponible: '+error.message+' · Se muestran ajustes base.'});
  const scope={campaignId:edition.campaignId,actorId:edition.actorId,revision:edition.revision};
  for(const event of p.events){const node=el(p.type==='combat'?'combat-phase':'book-narrative-event');node.setConfirmedNarration(event,scope);section.append(node)}
  if(p.choices.length){const group=el('div');group.className='decision';const status=el('p',submit?'Elegí una acción.':'Opciones preparadas. Hace falta conectar el servicio de campaña para confirmarlas.');status.className='sample';status.setAttribute('aria-live','polite');
   for(const choice of p.choices){const b=el('button',choice.label);b.type='button';b.disabled=!submit;b.onclick=async()=>{if(!submit)return;for(const c of group.querySelectorAll('button'))c.disabled=true;try{await submit({campaignId:scope.campaignId,actorId:scope.actorId,expectedRevision:scope.revision,pageId:p.id,choiceId:choice.id});status.textContent='Solicitud enviada; esperando la edición autorizada.'}catch(e){status.textContent=e?.message==='Error de preparación: falta narración aprobada'?'Error de preparación: falta narración aprobada.':'No se confirmó la acción. Reintentá la misma opción o reanudá la campaña.';for(const c of group.querySelectorAll('button'))c.disabled=false}};group.append(b)}section.append(group,status)}
  this.replaceChildren(section);
 }
}
class PlayerEditionImport extends HTMLElement{
 connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const label=el('label','Abrir edición JSON del máster (vista local)');const input=el('input');input.type='file';input.accept='.json,application/json';const status=el('p','Solo contenido autorizado para este jugador. No se sube el archivo ni se confirma estado de campaña.');status.className='sample';status.setAttribute('aria-live','polite');label.append(input);const probe=el('button','Comprobar conexión al simulador');probe.type='button';const connection=el('p','');connection.className='sample';connection.setAttribute('aria-live','polite');probe.onclick=async()=>{probe.disabled=true;connection.textContent='Comprobando…';try{const r=await fetch('/api/simulation-status',{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('No disponible');const data=await r.json();if(data.ok!==true)throw Error('Sin conexión');connection.textContent='Motor conectado: '+data.campaignContract+'. Transporte de campaña pendiente.';}catch{connection.textContent='Servicio de simulación no disponible en este alojamiento.'}finally{probe.disabled=false}};this.append(label,status,probe,connection);input.onchange=async()=>{try{const file=input.files[0];if(!file)return;if(file.size>2*1024*1024)throw Error('Archivo superior a 2 MB');window.PocketDMEdition.load(JSON.parse(await file.text()));}catch(e){status.textContent='No se abrió la edición: '+e.message}}}
}
if(!customElements.get('book-player-page'))customElements.define('book-player-page',PlayerPage);
if(!customElements.get('book-edition-import'))customElements.define('book-edition-import',PlayerEditionImport);
