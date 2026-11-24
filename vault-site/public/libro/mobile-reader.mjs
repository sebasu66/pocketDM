// Shell móvil del libro. Reutiliza las fichas, el mapa y el diario del lector.
// Foldables and embedded Android browsers may report a desktop-sized width.
// A short reading surface should never be squeezed into a two-page spread.
export const mobileQuery='(max-width: 800px), (max-height: 660px), (any-pointer: coarse) and (max-width: 1600px)';
export function readerMode(){
 const forced=new URLSearchParams(location.search).get('layout');
 if(forced==='mobile'||forced==='desktop')return forced==='mobile';
 return matchMedia(mobileQuery).matches || (navigator.maxTouchPoints>0 && /Android|iPhone|iPod|Mobile/i.test(navigator.userAgent));
}
export function splitStoryPages(pages){
 const result=[];
 pages.forEach((html,index)=>{
  const t=document.createElement('template');t.innerHTML=html;
  const elements=[...t.content.children];
  // Fragmentos editoriales derivados de las mismas páginas, no otra historia.
  const cut=index===0?2:index===1?elements.findIndex(x=>x.matches('combat-phase')):index===2?elements.findIndex(x=>x.matches('book-inset')):index===3?2:-1;
  const groups=cut>0&&cut<elements.length?[elements.slice(0,cut),elements.slice(cut)]:[elements];
  for(const g of groups)result.push({desktopPage:index,html:g.map(x=>x.outerHTML).join('')});
 });
 return result;
}
export function createMobileReader({viewport,turn,home,zoomBy,resetZoom,getZoom}){
 const rail=document.createElement('nav');rail.className='mobile-rail';rail.setAttribute('aria-label','Controles de lectura móvil');
 const paths={menu:'M5 6h14M5 12h14M5 18h14',prev:'M6 15l6-6 6 6',next:'M6 9l6 6 6-6'};
 const button=(id,label,icon)=>'<button type="button" data-mobile="'+id+'" aria-label="'+label+'" title="'+label+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+paths[icon]+'"/></svg></button>';
 rail.innerHTML=button('menu','Abrir menú','menu')+button('prev','Sección anterior','prev')+'<span class="mobile-progress" aria-live="polite"></span>'+button('next','Siguiente sección','next');
 document.body.append(rail);
 const panel=document.createElement('dialog');panel.className='mobile-drawer';panel.setAttribute('aria-labelledby','drawer-title');panel.innerHTML='<header class="drawer-head"><div><div class="eyebrow">Pocket DM</div><h2 id="drawer-title"></h2></div><button type="button" class="drawer-close" aria-label="Cerrar panel">×</button></header><div class="drawer-body"></div>';
 document.body.append(panel);
 const content=panel.querySelector('.drawer-body');let gesture=null;
 function close(){if(panel.open)panel.close()}
 function open(which){
  panel.classList.toggle('from-left',which==='character');
  panel.querySelector('h2').textContent=({character:'Personaje',notes:'Mapa y diario',menu:'El libro'})[which];
  if(which==='character'){content.innerHTML='<book-sheet character="galahad"></book-sheet><book-sheet character="zhalan"></book-sheet>'}
  else if(which==='notes'){
   content.innerHTML='<nav class="drawer-tabs" aria-label="Cuaderno de campaña"><button type="button" data-tab="map">Mapa</button><button type="button" data-tab="journal">Diario</button><button type="button" data-tab="quests">Misiones</button></nav><div class="drawer-tab-body"></div>';
   const tabBody=content.querySelector('.drawer-tab-body');
   const select=(key)=>{content.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===key)));tabBody.innerHTML=key==='map'?'<book-map></book-map>':key==='journal'?'<book-journal></book-journal>':'<h3>Misiones activas</h3><p class="sample">Todavía no hay misiones sincronizadas con el motor de campaña.</p>'};
   content.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>select(b.dataset.tab));select('map');
  }else{
   content.innerHTML='<div class="drawer-menu"><button type="button" data-open="character">Ficha de personaje <span>←</span></button><button type="button" data-open="notes">Mapa y diario <span>→</span></button><div class="drawer-zoom"><button type="button" data-z="-">−</button><button type="button" data-z="reset">Ajustar lectura</button><button type="button" data-z="+">+</button></div><button type="button" data-exit>Salir al inicio <span>⌂</span></button></div>';
   content.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(b.dataset.open));content.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{const v=b.dataset.z;close();if(v==='reset')resetZoom();else zoomBy(v==='+'?.25:-.25)});content.querySelector('[data-exit]').onclick=()=>{close();home()};
  }
  if(!panel.open)panel.showModal();panel.scrollTop=0;content.scrollTop=0;
 }
 rail.querySelector('[data-mobile=menu]').onclick=()=>open('menu');
 rail.querySelector('[data-mobile=prev]').onclick=()=>turn(-1);
 rail.querySelector('[data-mobile=next]').onclick=()=>turn(1);
 panel.querySelector('.drawer-close').onclick=close;
 panel.addEventListener('click',e=>{if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)close()}const a=e.target.closest('a[data-route-view=story]');if(a){e.preventDefault();e.stopPropagation();close()}});
 viewport.addEventListener('touchstart',e=>{gesture=null;if(!document.body.classList.contains('mobile-story')||getZoom()!==1||e.touches.length!==1||e.target.closest('button,a,input,summary'))return;const t=e.touches[0];gesture={x:t.clientX,y:t.clientY}},{passive:true});
 viewport.addEventListener('touchend',e=>{if(!gesture)return;const t=e.changedTouches[0],dx=t.clientX-gesture.x,dy=t.clientY-gesture.y;gesture=null;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)open(dx>0?'character':'notes')},{passive:true});
 viewport.addEventListener('touchcancel',()=>{gesture=null},{passive:true});
 return {update({active,index,total}){document.body.classList.toggle('mobile-story',active);rail.hidden=!active;if(!active){close();return}rail.querySelector('[data-mobile=prev]').disabled=index===0;rail.querySelector('[data-mobile=next]').disabled=index>=total-1;rail.querySelector('.mobile-progress').textContent=(index+1)+'/'+total},close};
}
