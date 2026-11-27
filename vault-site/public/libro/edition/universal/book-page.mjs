import {resolvePage} from './contract.mjs';
import {cropRect,EditorialCamera} from '/dm/libro/editorial/camera.mjs';
const el=(tag,cls)=>{const n=document.createElement(tag);if(cls)n.className=cls;return n};
const stylesheet=new URL('./page.css',import.meta.url);
const textNode=(value)=>document.createTextNode(String(value));
const known=(v,def)=>v===undefined?def:v;
function apply(n,s={}){
 const overlay=s.position==='overlay';
 n.dataset.position=overlay?'overlay':'flow';
 if(overlay){n.style.left=known(s.x,0)+'%';n.style.top=known(s.y,0)+'%';if(s.height!==undefined)n.style.height=s.height+'%'}
 if(s.width!==undefined)n.style.width=s.width+'%';
 if(s.ratio)n.style.aspectRatio=String(s.ratio);
 if(s.z!==undefined)n.style.zIndex=s.z;
 if(s.opacity!==undefined)n.style.opacity=s.opacity;
 if(s.rotation||s.scale!==undefined)n.style.transform='rotate('+known(s.rotation,0)+'deg) scale('+known(s.scale,1)+')';
 for(const [key,prop] of [['gap','gap'],['padding','padding'],['fontSize','fontSize'],['radius','borderRadius']])if(s[key]!==undefined)n.style[prop]=s[key]+'px';
 if(s.align)n.style.textAlign=s.align;
 if(s.color)n.style.color=s.color;
 if(s.background)n.style.backgroundColor=s.background;
 if(s.borderColor){n.style.borderColor=s.borderColor;n.style.borderStyle='solid';n.style.borderWidth='1px'}
 if(s.overflow)n.style.overflow=s.overflow;
 if(s.direction)n.style.flexDirection=s.direction;
}
export class BookUniversalPage extends HTMLElement{
 #document=null;#observer;#resolved=null;#view=null;#images=new Map();#busy=false;#handler=null;#generation=0;#cameras=[];
 constructor(){
  super();const root=this.attachShadow({mode:'open'}),link=el('link');link.rel='stylesheet';link.href=stylesheet;this.surface=el('article','surface');this.surface.setAttribute('aria-label','Página de aventura');root.append(link,this.surface);
  this.#observer=new ResizeObserver(()=>{if(this.#document&&this.#view!==this.view)this.#render(this.#document)});
 }
 connectedCallback(){this.#observer.observe(this);if(this.#document)this.#render(this.#document)}
 disconnectedCallback(){this.#observer.disconnect();this.#stopCameras()}
 #stopCameras(){for(const c of this.#cameras)c.camera.stop();this.#cameras=[]}
 previewCamera(mode='play'){if(!['start','end','play'].includes(mode))throw Error('Modo de cámara inválido');this.setAttribute('camera-preview',mode==='play'?'start':mode);for(const c of this.#cameras)c.run(mode)}
 static get observedAttributes(){return ['preview-view']}
 attributeChangedCallback(){if(this.#document&&this.#view!==this.view)this.#render(this.#document)}
 get view(){const v=this.getAttribute('preview-view');return ['mobile','desktop'].includes(v)?v:(this.clientWidth<=680?'mobile':'desktop')}
 get document(){return this.#document?structuredClone(this.#document):null}
 set document(value){this.setPage(value)}
 setPage(value){const next=structuredClone(value);resolvePage(next,'mobile');resolvePage(next,'desktop');this.#render(next);this.#document=next;return this}
 setChoiceHandler(handler){if(handler!==null&&typeof handler!=='function')throw new TypeError('Handler inválido');this.#handler=handler;return this}
 get pageId(){return this.#resolved?.pageId??null}
 #render(doc){
  this.#stopCameras();const view=this.view,r=resolvePage(doc,view),previous=this.#images,images=new Map(),oldPage=this.#resolved?.pageId;
  if(oldPage!==r.pageId){this.#generation++;this.#busy=false}
  const fragment=document.createDocumentFragment();
  const build=(item)=>{
   const {id,type,style,value,children}=item;let n;
   if(type==='image'){
    n=el('figure','image');const im=el('img');im.src=value.src;im.alt=value.alt;im.draggable=false;im.style.objectFit=style.fit??'contain';im.style.objectPosition=known(style.objectX,50)+'% '+known(style.objectY,50)+'%';n.append(im);images.set(id,value);
    if(style.cameraEnabled){const settings={cameraEnabled:true,cameraStartX:50,cameraStartY:50,cameraStartZoom:1,cameraEndX:50,cameraEndY:50,cameraEndZoom:1.25,cameraDuration:4,cameraEasing:'ease-in-out',...style};const paint=()=>{if(!im.naturalWidth||!n.clientWidth||!n.clientHeight)return;const c=cropRect(im.naturalWidth/im.naturalHeight,n.clientWidth/n.clientHeight,camera.pose(settings));Object.assign(im.style,{width:(100/c.width)+'%',height:(100/c.height)+'%',left:(-100*c.x/c.width)+'%',top:(-100*c.y/c.height)+'%',right:'auto',bottom:'auto',objectFit:'fill',objectPosition:'center'})};const camera=new EditorialCamera(paint);const run=mode=>{camera.stop();if(mode==='play')camera.play(settings);else{camera.progress=mode==='end'?1:0;paint()}};const entry={camera,run};this.#cameras.push(entry);im.addEventListener('load',()=>{if(this.#cameras.includes(entry))paint()});requestAnimationFrame(()=>{if(this.#cameras.includes(entry))run(this.getAttribute('camera-preview')||'play')})}
    const old=previous.get(id);if(old&&old.src!==value.src&&style.transition==='fade'&&style.duration>0&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      const prior=el('img','prior');prior.src=old.src;prior.alt='';prior.setAttribute('aria-hidden','true');prior.style.objectFit=im.style.objectFit;prior.style.objectPosition=im.style.objectPosition;n.append(prior);
      const animation=prior.animate([{opacity:1},{opacity:0}],{duration:style.duration,fill:'forwards'});animation.finished.then(()=>prior.remove(),()=>prior.remove());
    }
   }else if(type==='text'){
    n=el(item.role==='heading'?'h2':'div','copy');const values=Array.isArray(value)?value:[value];for(const v of values){if(item.role==='heading')n.append(textNode(v));else{const p=el('p');p.textContent=String(v);n.append(p)}}
   }else if(type==='group'){n=el('div','group');n.append(...children.map(build))}
   else if(type==='slot'){n=el('div','embedded');const s=el('slot');s.name=item.slotName;n.append(s)}
   else if(type==='interaction'){
    n=el('section','interaction');n.setAttribute('aria-label','Opciones de la situación');
    const a=r.interaction;if(a.title){const h=el('h3');h.textContent=a.title;n.append(h)}
    if(a.text){const p=el('p','interaction-text');p.textContent=a.text;n.append(p)}
    const opts=el('div','options');for(const o of a.options){const b=el('button');b.type='button';b.dataset.choiceId=o.id;b.disabled=!!o.disabled||this.#busy;if(o.image){const im=el('img','symbol');im.src=o.image.src;im.alt='';b.append(im)}b.append(textNode(o.label));b.onclick=()=>this.#choose(r,o,b);opts.append(b)}n.append(opts);
    const status=el('p','status');status.setAttribute('role','status');status.textContent=a.status??'';if(a.terminal&&!status.textContent)status.textContent='Fin de la aventura';n.append(status,...children.map(build));
   }
   n.dataset.elementId=id;n.dataset.kind=type;apply(n,style);return n;
  };
  fragment.append(...r.nodes.map(build));this.surface.removeAttribute('style');apply(this.surface,r.style);this.surface.replaceChildren(fragment);this.dataset.view=view;this.#resolved=r;this.#view=view;this.#images=images;
 }
 async #choose(r,o,b){
  if(this.#busy||o.disabled||this.#resolved!==r)return;
  const detail=Object.freeze({pageId:r.pageId,choiceId:o.id});
  if(!this.#handler){this.dispatchEvent(new CustomEvent('book-page-choice',{detail,bubbles:true,composed:true}));return}
  this.#busy=true;const generation=++this.#generation;const lock=()=>this.surface.querySelectorAll('button[data-choice-id]').forEach(x=>x.disabled=true);lock();
  try{await this.#handler(detail);if(this.#generation===generation&&this.#busy){const status=this.surface.querySelector('.status');if(status)status.textContent='Acción enviada; esperando la situación confirmada.'}}
  catch{if(this.#generation===generation){this.#busy=false;this.#render(this.#document);const status=this.surface.querySelector('.status');if(status)status.textContent='No se confirmó la acción. Podés reintentar.'}}
 }
 // A trusted host may acknowledge a new confirmed snapshot, even on the same page.
 confirmPage(value){this.#generation++;this.#busy=false;return this.setPage(value)}
}
if(!customElements.get('book-universal-page'))customElements.define('book-universal-page',BookUniversalPage);
