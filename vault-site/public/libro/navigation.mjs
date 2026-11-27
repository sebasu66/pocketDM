import {campaign} from './campaign.mjs';
import {renderActorSheet} from './actor-sheet.mjs';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hrefFor=v=>v==='home'?'/app/':v==='profile'?'/app/?view=profile':v==='story'?'/libro/':'/libro/?view='+encodeURIComponent(v);

class BookLink extends HTMLElement {
 connectedCallback(){
  if(this.dataset.ready)return;
  this.dataset.ready='1';
  const v=this.getAttribute('view')||'story';
  const a=document.createElement('a');
  a.href=hrefFor(v);a.dataset.routeView=v;a.className='book-link';
  a.textContent=this.textContent.trim()||v;
  this.replaceChildren(a);
 }
}
class BookSheet extends HTMLElement {
 connectedCallback(){
  if(this.dataset.ready)return;this.dataset.ready='1';
  const c=campaign.characters.find(x=>x.id===this.getAttribute('character'));
  if(!c){this.textContent='Personaje no encontrado';return;}
  if(renderActorSheet(this,c.id,c.portrait))return;
  this.innerHTML='<section class="folio-module"><div class="eyebrow">Hoja de personaje · muestra</div>'+
   '<h2>'+esc(c.name)+'</h2><p class="subtitle">'+esc(c.role)+'</p>'+
   '<img class="sheet-portrait" src="'+esc(c.portrait)+'" alt="Retrato ilustrado de '+esc(c.name)+'">'+
   '<div class="sheet-grid">'+c.fields.map(f=>'<div class="sheet-stat"><span>'+esc(f[0])+'</span><strong>'+esc(f[1])+'</strong></div>').join('')+'</div>'+
   '<p class="sample">Datos tomados de la crónica V2; no son una ficha sincronizada con Firestore.</p>'+
   '<book-link view="story">Volver a la crónica</book-link></section>';
 }
}
class BookActions extends HTMLElement {
 connectedCallback(){
  if(this.dataset.ready)return;this.dataset.ready='1';
  const options=campaign.actions[this.getAttribute('scene')]||[];
  this.innerHTML='<div class="decision" role="group" aria-label="Opciones de la escena">'+
   options.map(o=>'<button type="button" data-choice="'+esc(o.id)+'" aria-pressed="false" title="'+esc(o.help)+'">'+esc(o.label)+'</button>').join('')+'</div>';
 }
}
class BookJournal extends HTMLElement {
 connectedCallback(){
  if(this.dataset.ready)return;this.dataset.ready='1';
  let choice='';try{choice=sessionStorage.getItem('pocketdm-demo-choice')||'';}catch{}
  const labels={defend:'Proteger al compañero',observe:'Observar',withdraw:'Retirarse'};
  this.innerHTML='<section class="folio-module"><div class="eyebrow">Registro de la campaña · ejemplo</div>'+
   '<h2>Diario de aventura</h2><p class="subtitle">Los eventos narrativos y las decisiones del grupo.</p>'+
   '<ol class="journal-list">'+campaign.journal.map((e,i)=>'<li><span class="journal-index">'+String(i+1).padStart(2,'0')+'</span><div><small>'+esc(e.type)+'</small><h3>'+esc(e.title)+'</h3><p>'+esc(e.text)+'</p></div></li>').join('')+'</ol>'+
   '<div class="journal-choice"><strong>Prioridad de demostración</strong><p>'+esc(labels[choice]||'Todavía no elegida en esta sesión.')+'</p></div>'+
   '<p class="sample">La elección de ejemplo se conserva sólo en esta pestaña del navegador. No modifica el mundo de campaña.</p></section>';
 }
}
class BookMap extends HTMLElement {
 connectedCallback(){
  if(this.dataset.ready)return;this.dataset.ready='1';
  const m=campaign.map;
  this.innerHTML='<section class="folio-module"><div class="eyebrow">Mapa narrativo · prototipo</div>'+
   '<h2>'+esc(m.title)+'</h2><p class="subtitle">'+esc(m.subtitle)+'</p>'+
   '<div class="story-map" role="group" aria-label="Esquema interactivo del recorrido de la escena">'+
   '<div class="map-path" aria-hidden="true"></div>'+
   m.points.map((p,i)=>'<button class="map-marker" type="button" data-map="'+esc(p.id)+'" style="left:'+p.x+'%;top:'+p.y+'%" aria-label="'+esc(p.name)+'">'+(i+1)+'</button>').join('')+
   '</div><p id="map-detail" class="map-caption" aria-live="polite">Seleccioná un marcador para ver su referencia narrativa.</p>'+
   '<p class="sample">La posición no se deriva de coordenadas del mundo. Conectar con el grafo de lugares es una etapa posterior.</p></section>';
  this.querySelectorAll('[data-map]').forEach(button=>button.addEventListener('click',()=>{
   const p=m.points.find(x=>x.id===button.dataset.map);
   this.querySelector('#map-detail').textContent=p.name+' · '+p.kind;
   this.querySelectorAll('[data-map]').forEach(x=>x.classList.toggle('selected',x===button));
  }));
 }
}
class BookHome extends HTMLElement {
 connectedCallback(){
  if(this.dataset.ready)return;this.dataset.ready='1';
  this.innerHTML='<section class="folio-module"><div class="eyebrow">Pocket DM · inicio de aplicación</div>'+
   '<h2>Tu biblioteca de aventuras</h2>'+
   '<p>Este es el espacio de entrada a las campañas. El lector narrativo conserva su estética y funciona como interfaz de historia, personaje, diario y mapa.</p>'+
   '<div class="home-campaign"><small>Campaña de demostración</small><h3>'+esc(campaign.title)+'</h3>'+
   '<p>'+esc(campaign.chapter)+'</p><book-link view="story">Continuar leyendo →</book-link></div>'+
   '<div class="home-campaign muted"><small>Conexión futura</small><h3>Mis campañas</h3><p>La lista real aparecerá cuando se integre el servicio de usuarios y campañas.</p></div>'+
   '<p class="sample">Pantalla funcional de navegación. Todavía no representa una sesión autenticada.</p></section>';
 }
}
class BookProfile extends HTMLElement {
 connectedCallback(){
  if(this.dataset.ready)return;this.dataset.ready='1';
  this.innerHTML='<section class="folio-module"><div class="eyebrow">Pocket DM · usuario</div><h2>Tu perfil</h2>'+
   '<div class="profile-emblem" aria-hidden="true">✦</div>'+
   '<div class="sheet-grid"><div class="sheet-stat"><span>Sesión</span><strong>Modo demostración</strong></div>'+
   '<div class="sheet-stat"><span>Autenticación</span><strong>No conectada</strong></div></div>'+
   '<p>Esta página reserva el acceso al usuario y sus campañas, sin inventar datos ni cargar información privada.</p>'+
   '<book-link view="home">Volver al inicio</book-link></section>';
 }
}
for(const [name,c] of [
 ['book-actions',BookActions],['book-link',BookLink],['book-sheet',BookSheet],['book-journal',BookJournal],
 ['book-map',BookMap],['book-home',BookHome],['book-profile',BookProfile]
]){if(!customElements.get(name))customElements.define(name,c);}
