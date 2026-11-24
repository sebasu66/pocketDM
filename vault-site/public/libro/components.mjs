import {events} from './events.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={
eye:'<path d="M2 12Q12 2 22 12Q12 22 2 12Z"/><circle cx="12" cy="12" r="3"/>',
moon:'<path d="M20 15A9 9 0 0 1 9 4A9 9 0 1 0 20 15Z"/>',
bow:'<path d="M5 3Q23 12 5 21L9 12Z M3 12H22 M18 8L22 12L18 16"/>',
step:'<ellipse cx="8" cy="8" rx="3" ry="5" transform="rotate(-20 8 8)"/><ellipse cx="16" cy="16" rx="3" ry="5" transform="rotate(-20 16 16)"/>',
drop:'<path d="M12 2C10 7 5 11 5 15a7 7 0 0 0 14 0c0-4-5-8-7-13Z"/>',
shield:'<path d="M12 3L20 6V12Q19 18 12 22Q5 18 4 12V6Z M12 6V18"/>',
snow:'<path d="M12 2V22 M3 7L21 17 M3 17L21 7 M9 4L12 7L15 4 M9 20L12 17L15 20"/>',
hourglass:'<path d="M5 3H19 M5 21H19 M7 3Q6 9 12 12Q18 15 17 21 M17 3Q18 9 12 12Q6 15 7 21"/>',
swords:'<path d="M3 3L7 4L19 16L16 19L4 7Z M15 20L20 15 M19 19L22 22 M21 3L17 4L10 11 M8 14L4 18 M2 16L8 22"/>',
compass:'<circle cx="12" cy="12" r="9"/><path d="M16 6L13 13L6 18L10 10Z"/>'};
const sigil=(s,check)=>'<button type="button" class="sigil '+(s==='drop'?'danger':'')+'" data-check="'+esc(check.id)+'" title="'+esc(check.label)+'" aria-label="Consultar '+esc(check.label)+'" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true">'+paths[s]+'</svg></button>';
class BookPage extends HTMLElement{connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const contents=[...this.childNodes];const frag=document.getElementById('page').content.cloneNode(true);frag.querySelector('.leafbody').append(...contents);frag.querySelector('.number').textContent=this.getAttribute('number');this.append(frag)}}
class BookTitle extends HTMLElement{connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const image=this.getAttribute('image');this.innerHTML=(image?'<div class="chapter-art"><img class="hero-image" src="'+esc(image)+'" alt="'+esc(this.getAttribute('alt')||'')+'"></div>':'')+'<div class="chapter-title"'+(image?'':' style="margin-top:0"')+'><div class="eyebrow">'+esc(this.getAttribute('kicker')||'')+'</div><h1>'+esc(this.getAttribute('heading'))+'</h1><p class="subtitle">'+esc(this.getAttribute('subtitle')||'')+'</p><div class="rule" aria-hidden="true">❖</div></div>'}}
class BookPortrait extends HTMLElement{connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';this.innerHTML='<figure class="portrait '+esc(this.getAttribute('align')||'')+'"><img src="'+esc(this.getAttribute('src'))+'" alt="'+esc(this.getAttribute('alt')||this.getAttribute('name'))+'"><figcaption>'+esc(this.getAttribute('name'))+'<br>'+esc(this.getAttribute('caption')||'')+'</figcaption></figure>'}}
class BookInset extends HTMLElement{connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const body=[...this.childNodes];const aside=document.createElement('aside');aside.className='inset '+(this.hasAttribute('vertical')?'vertical ':'')+(this.hasAttribute('dark')?'dark':'');const h=document.createElement('h3');h.textContent=this.getAttribute('heading');aside.append(h,...body);this.append(aside)}}
// One shared modal outside the zoomable page. Opening it never changes leaf geometry.
let activeTrigger=null;
const modal=document.getElementById('mechanics');
function showMechanics(e,id,trigger){
 activeTrigger=trigger;trigger.setAttribute('aria-expanded','true');
 document.getElementById('mechanics-title').textContent=e.title;
 document.getElementById('mechanics-body').innerHTML=e.checks.map(c=>'<div data-detail="'+esc(c.id)+'" class="'+(c.id===id?'selected':'')+'"><p><strong>'+esc(c.label)+'</strong> · '+esc(c.reason)+'</p>'+(c.roll!==undefined?'<div class="statline"><span>Base '+c.base+' '+(c.mod<0?'− '+Math.abs(c.mod):'+ '+c.mod)+' = '+c.target+'%</span><span>D100: '+c.roll+' · '+esc(c.result)+'</span></div>':'')+'</div>').join('')+'<div><p><strong>Consecuencias</strong></p>'+e.effects.map(t=>'<p>'+esc(t)+'</p>').join('')+'</div><p class="sample">Registro ilustrativo; no calculado por el motor.</p>';
 if(!modal.open)modal.showModal();modal.scrollTop=0;
 if(id)modal.querySelector('.selected')?.scrollIntoView({block:'nearest'});
}
modal.addEventListener('close',()=>{if(activeTrigger){activeTrigger.setAttribute('aria-expanded','false');activeTrigger.focus({preventScroll:true});activeTrigger=null}});
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()}});
class CombatPhase extends HTMLElement{connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const e=events[this.getAttribute('event')];if(!e)return;this.innerHTML='<div class="phasehead"><span class="roman">'+esc(e.roman)+'</span><h3>'+esc(e.title)+'</h3></div><p>'+e.text.map(t=>typeof t==='string'?esc(t):sigil(t.symbol,e.checks.find(c=>c.id===t.check))).join('')+'</p><button class="resolution-trigger" type="button" aria-haspopup="dialog" aria-expanded="false">Consultar resolución</button>';this.querySelectorAll('.sigil').forEach(b=>{b.setAttribute('aria-haspopup','dialog');b.onclick=()=>showMechanics(e,b.dataset.check,b)});const button=this.querySelector('.resolution-trigger');button.onclick=()=>showMechanics(e,null,button)}}
for(const [n,c] of [['book-page',BookPage],['book-title',BookTitle],['book-portrait',BookPortrait],['book-inset',BookInset],['combat-phase',CombatPhase]])customElements.define(n,c);
