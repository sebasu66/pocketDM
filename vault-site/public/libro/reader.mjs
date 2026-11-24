import './components.mjs';
import './navigation.mjs';
let pages=[
 `<book-title kicker="Capítulo III · Invierno" heading="Los colmillos del invierno" subtitle="En los confines de Rassilon" image="./assets/bosque.png" alt="Sendero entre árboles cubiertos de nieve"></book-title><p class="dropcap">La nieve había borrado el sendero. Bajo la luz mortecina del cielo, dos viajeros avanzaban hacia el norte, atentos al murmullo de las ramas. El silencio del bosque no era una promesa de paz.</p><book-inset heading="Cuaderno de viaje" vertical><div class="statline"><span>Terreno</span><span>Bosque</span></div><div class="statline"><span>Clima</span><span>Nieve</span></div><div class="statline"><span>Luz</span><span>Escasa</span></div></book-inset><p>Galahad se ajustó el abrigo. Zhalan, acostumbrado a la oscuridad, se adelantó unos pasos. El frío se había instalado en las costuras del abrigo y el camino apenas se distinguía bajo la nieve. Por momentos, las copas se abrían sobre un cielo de plomo; después, la espesura volvía a tragarse toda claridad. Entonces se oyó un crujido.</p>`,
 `<h2>El ojo de la noche</h2><book-portrait src="./assets/zhalan.png" name="Zhalan Driz’thar" caption="Explorador · Elfo oscuro" alt="Zhalan con dos cimitarras, capa verde y cabello plateado"></book-portrait><p class="dropcap">Entre los árboles, el explorador distinguió una sombra que no pertenecía al paisaje. El viento traía un olor a pelaje húmedo.</p><p>Su compañero no había oído nada. Bastó un gesto para que ambos se detuvieran. Zhalan dejó que sus ojos recorrieran el espacio entre los troncos. La nieve, agitada por el viento, ocultaba el contorno de las criaturas. No podía distinguir todavía si se acercaban por hambre o para defender su territorio.</p><combat-phase event="contact"></combat-phase><combat-phase class="phase-wide" event="shot"></combat-phase>`,
 `<h2>La espada del guardia</h2><book-portrait src="./assets/galahad.png" name="Galahad" caption="Guerrero errante" alt="Galahad con espada larga, armadura y capa roja"></book-portrait><p class="dropcap">Galahad llevaba demasiado tiempo viajando para confiar en una retirada fácil. Se colocó entre el lobo y su compañero, con la espada en alto. El peso de la armadura y las horas de marcha comenzaban a sentirse en los hombros. Aun así, aguardó el instante en que la criatura entrara al alcance de su hoja, sin apartarse del sendero.</p><book-inset heading="Estado de Galahad" dark><div class="statline"><span>Arma</span><span>Espada larga</span></div><div class="statline"><span>Fatiga inicial</span><span>20</span></div></book-inset><combat-phase class="phase-wide" event="parry"></combat-phase>`,
 `<h2>Cuando el bosque calla</h2><combat-phase event="shift"></combat-phase><div class="rule" aria-hidden="true">❖</div><book-inset heading="Balance provisional" vertical><div class="statline"><span>Flechas</span><span>11</span></div><div class="statline"><span>Fatiga de Galahad</span><span>28</span></div><div class="statline"><span>Heridas propias</span><span>0</span></div></book-inset><p>El animal herido retrocedió entre las ramas. Su compañero todavía acechaba. Los viajeros tenían un instante para reconsiderar su estrategia.</p><p><strong>¿Qué prioridad darías al próximo intercambio?</strong></p><book-actions scene=\"winter_next\"></book-actions><p id="choice-result" class="sample" aria-live="polite">Elegí una prioridad. Este ejemplo registra la elección, pero aún no simula el siguiente intercambio.</p><div class="rule" aria-hidden="true">❧</div><p class="sample">Prototipo editorial. Los eventos y valores de esta crónica son datos de demostración. La integración con el motor de combate será una etapa posterior.</p>`
];
const storyPages=pages;
const viewPages={story:storyPages,...{"character":["<book-sheet character=\"galahad\"></book-sheet>","<book-sheet character=\"zhalan\"></book-sheet>"],"journal":["<book-journal></book-journal>","<h2>Memoria de la aventura</h2><p>El diario permite recordar qué sucedió, qué decisiones se tomaron y qué asuntos siguen abiertos.</p><book-inset heading=\"Próxima integración\" dark><p>Las entradas del diario se leerán del historial real de la campaña y del motor de consecuencias. Las decisiones de demostración no se confunden con el estado persistido.</p></book-inset><p>La historia y las tiradas pueden aparecer en el libro como elementos diferentes, pero conectados a cada carta.</p><book-link view=\"story\">Volver a la historia</book-link>"],"map":["<book-map></book-map>","<h2>Atlas y conocimiento</h2><p>El mapa será otra página del libro, no una pantalla con estética ajena. Los lugares del grafo aportarán nombre, ubicación, vínculos y lo que el grupo conoce.</p><book-inset heading=\"Capas previstas\" vertical><div class=\"statline\"><span>Terreno</span><span>Futuro</span></div><div class=\"statline\"><span>Grupo</span><span>Futuro</span></div><div class=\"statline\"><span>Conflictos</span><span>Futuro</span></div></book-inset><p>El esquema de la página anterior solo representa esta escena. No establece posiciones canónicas del mundo.</p><book-link view=\"story\">Regresar a la escena</book-link>"],"home":["<book-home></book-home>","<h2>Desde aquí comienza</h2><p>Seleccioná una campaña, retomá una crónica o consultá tu perfil. El mismo diseño de libro puede presentar narración, elecciones, retratos, objetos, fichas y mapas.</p><book-inset heading=\"Accesos\"><div class=\"statline\"><span>Libro de campaña</span><book-link view=\"story\">Abrir</book-link></div><div class=\"statline\"><span>Personajes</span><book-link view=\"character\">Ver</book-link></div><div class=\"statline\"><span>Tu usuario</span><book-link view=\"profile\">Consultar</book-link></div></book-inset><p class=\"sample\">La administración del proyecto y su documentación siguen en la bóveda, por separado de la experiencia de juego.</p>"],"profile":["<book-profile></book-profile>","<h2>Biblioteca personal</h2><p>En esta sección aparecerán tus campañas, personajes, invitaciones y preferencias cuando la autenticación esté conectada al backend.</p><book-inset heading=\"Estado del prototipo\" dark><p>Esta vista es una estructura de interfaz, no un perfil real. No se leen ni almacenan datos privados en este MVP.</p></book-inset><book-link view=\"home\">Volver al inicio</book-link>"]}};
let currentView="story",lastStoryPage=0;
const viewTitles={story:"Crónica del invierno",character:"Hojas de personaje",journal:"Diario de campaña",map:"Mapa narrativo",home:"Inicio de Pocket DM",profile:"Usuario de Pocket DM"};
function viewFromURL(){
  const query=new URLSearchParams(location.search);
  const v=query.get("view");
  if(v && Object.hasOwn(viewPages,v))return v;
  return location.pathname.startsWith("/app")?"home":"story";
}
function routeURL(v){
  if(v==="home")return "/app/";
  if(v==="profile")return "/app/?view=profile";
  if(v==="story")return "/libro/";
  return "/libro/?view="+encodeURIComponent(v);
}
function activateView(v,push=false){
  if(!Object.hasOwn(viewPages,v))v="story";
  if(currentView==="story")lastStoryPage=page;
  currentView=v;pages=viewPages[v];
  const query=new URLSearchParams(location.search);
  const p=query.get("page");
  const requested=v==="story"&&p?Math.max(0,Number(p)-1):lastStoryPage;
  page=v==="story"?Math.min(Math.max(0,Math.floor(requested/step())*step()),pages.length-step()):0;
  zoom=1;
  render(0);
  document.querySelectorAll("[data-route-view]").forEach(a=>{
    if(a.dataset.routeView===v && !a.classList.contains("exit"))a.setAttribute("aria-current","page");
    else a.removeAttribute("aria-current");
  });
  document.title="Pocket DM · "+viewTitles[v];
  document.getElementById("prev").title=v==="story"?"Página anterior":"Página anterior de "+viewTitles[v];
  if(push)history.pushState({view:v},"",routeURL(v));
}
document.addEventListener("click",event=>{
 const a=event.target.closest("a[data-route-view]");
 if(!a||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const v=a.dataset.routeView;if(!Object.hasOwn(viewPages,v))return;
 event.preventDefault();activateView(v,true);
});
window.addEventListener("popstate",()=>activateView(viewFromURL(),false));

const $=id=>document.getElementById(id),book=$('book'),viewport=$('viewport'),canvas=$('canvas'),mq=matchMedia('(max-width:800px)');
let page=0,zoom=1,single=mq.matches,manual=false,choice='',drag=null,touch=null;try{choice=sessionStorage.getItem('pocketdm-demo-choice')||''}catch{}
const step=()=>single?1:2;
let effectiveScale=1;
function scale(){const st=getComputedStyle(viewport);const availableW=viewport.clientWidth-parseFloat(st.paddingLeft)-parseFloat(st.paddingRight)-8;const availableH=viewport.clientHeight-parseFloat(st.paddingTop)-parseFloat(st.paddingBottom)-8;const base=single?1:Math.min(1,availableW/book.offsetWidth,availableH/book.offsetHeight);effectiveScale=base*zoom;book.style.transform='scale('+effectiveScale+')';canvas.style.width=Math.ceil(book.offsetWidth*effectiveScale)+'px';canvas.style.height=Math.ceil(book.offsetHeight*effectiveScale)+'px';$('fit').textContent=Math.round(zoom*100)+'%';$('minus').disabled=zoom<=1;$('plus').disabled=zoom>=2.5;viewport.classList.toggle('zoomed',zoom>1)}
function render(direction){book.className=single?'single':'';book.replaceChildren(...pages.slice(page,page+step()).map((html,i)=>{const el=document.createElement('book-page');el.setAttribute('number',String(page+i+1));el.innerHTML=html;return el}));$('folio').textContent=(page+1)+(single?'':'–'+Math.min(page+2,pages.length))+' / '+pages.length;$('prev').disabled=page===0;$('next').disabled=page+step()>=pages.length;$('mode').textContent=single?'1 pág.':'2 págs.';if(direction){void book.offsetWidth;book.classList.add(direction>0?'turn-forward':'turn-back')}viewport.scrollTop=0;viewport.scrollLeft=0;scale();restoreChoice();if(single){const pager=document.createElement('div');pager.className='mobile-pager';pager.innerHTML='<button type="button" data-dir="-1">↑ Anterior</button><button type="button" data-dir="1">Siguiente ↓</button>';book.querySelector('.leafbody').append(pager);pager.querySelectorAll('button').forEach(b=>{const dir=Number(b.dataset.dir);b.disabled=dir<0?page===0:page+1>=pages.length;b.onclick=()=>turn(dir)});scale()}}
function restoreChoice(){const result=$('choice-result');if(!result)return;book.querySelectorAll('[data-choice]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.choice===choice));b.onclick=()=>{choice=b.dataset.choice;try{sessionStorage.setItem('pocketdm-demo-choice',choice)}catch{};restoreChoice()}});if(choice){const label=book.querySelector('[data-choice="'+choice+'"]').textContent;result.textContent='Prioridad registrada: '+label+'. Aún no modifica los eventos de esta demostración.'}}
function turn(delta){const next=Math.max(0,Math.min(pages.length-step(),page+step()*delta));if(next!==page){page=next;render(delta)}}
function setZoom(next){const old=effectiveScale;const cx=viewport.scrollLeft+viewport.clientWidth/2,cy=viewport.scrollTop+viewport.clientHeight/2;zoom=Math.max(1,Math.min(2.5,next));scale();if(zoom===1){viewport.scrollLeft=0;viewport.scrollTop=0}else{viewport.scrollLeft=cx*effectiveScale/old-viewport.clientWidth/2;viewport.scrollTop=cy*effectiveScale/old-viewport.clientHeight/2}}
$('prev').onclick=()=>turn(-1);$('next').onclick=()=>turn(1);$('plus').onclick=()=>setZoom(zoom+.25);$('minus').onclick=()=>setZoom(zoom-.25);$('fit').onclick=()=>setZoom(1);
$('mode').onclick=()=>{manual=true;single=!single;if(!single)page-=page%2;zoom=1;render(0)};
mq.addEventListener('change',()=>{if(!manual){single=mq.matches;if(!single)page-=page%2;render(0)}});
document.addEventListener('keydown',e=>{if(document.getElementById('mechanics').open||e.target.closest('button,summary,a,input'))return;if(e.key==='ArrowRight')turn(1);if(e.key==='ArrowLeft')turn(-1);if(single&&e.key==='PageDown'){e.preventDefault();turn(1)}if(single&&e.key==='PageUp'){e.preventDefault();turn(-1)}});
viewport.addEventListener('pointerdown',e=>{if(e.target.closest('button,summary,a')||e.button!==0)return;if(e.pointerType==='touch')return;if(!viewport.classList.contains('zoomed'))return;drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging')});
viewport.addEventListener('pointermove',e=>{if(!drag)return;viewport.scrollLeft=drag.left+drag.x-e.clientX;viewport.scrollTop=drag.top+drag.y-e.clientY});
viewport.addEventListener('pointerup',()=>{drag=null;viewport.classList.remove('dragging')});
viewport.addEventListener('pointercancel',()=>{drag=null;viewport.classList.remove('dragging')});
viewport.addEventListener('touchstart',e=>{if(e.touches.length!==1||zoom!==1||!single||e.target.closest('button,a'))return;const t=e.touches[0];touch={x:t.clientX,y:t.clientY,top:viewport.scrollTop<=3,bottom:viewport.scrollTop+viewport.clientHeight>=viewport.scrollHeight-5}},{passive:true});
viewport.addEventListener('touchend',e=>{if(!touch)return;const t=e.changedTouches[0],dy=t.clientY-touch.y,dx=t.clientX-touch.x;if(Math.abs(dy)>65&&Math.abs(dy)>Math.abs(dx)*1.4){if(dy<0&&touch.bottom)turn(1);else if(dy>0&&touch.top)turn(-1)}touch=null},{passive:true});
viewport.addEventListener('touchcancel',()=>{touch=null},{passive:true});
new ResizeObserver(scale).observe(book);window.addEventListener('resize',scale);activateView(viewFromURL(),false);
