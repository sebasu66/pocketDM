import {events} from './events.mjs';
import {readConfirmedNarration} from './confirmed-narration.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
import './book-skill-check.mjs';
class BookPage extends HTMLElement{connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const contents=[...this.childNodes];const frag=document.getElementById('page').content.cloneNode(true);frag.querySelector('.leafbody').append(...contents);frag.querySelector('.number').textContent=this.getAttribute('number');this.append(frag)}}
class BookTitle extends HTMLElement{connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const image=this.getAttribute('image');this.innerHTML=(image?'<div class="chapter-art"><img class="hero-image" src="'+esc(image)+'" alt="'+esc(this.getAttribute('alt')||'')+'"></div>':'')+'<div class="chapter-title"'+(image?'':' style="margin-top:0"')+'><div class="eyebrow">'+esc(this.getAttribute('kicker')||'')+'</div><h1>'+esc(this.getAttribute('heading'))+'</h1><p class="subtitle">'+esc(this.getAttribute('subtitle')||'')+'</p><div class="rule" aria-hidden="true">❖</div></div>'}}
class BookPortrait extends HTMLElement{connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';this.innerHTML='<figure class="portrait '+esc(this.getAttribute('align')||'')+'"><img src="'+esc(this.getAttribute('src'))+'" alt="'+esc(this.getAttribute('alt')||this.getAttribute('name'))+'"><figcaption>'+esc(this.getAttribute('name'))+'<br>'+esc(this.getAttribute('caption')||'')+'</figcaption></figure>'}}
class BookInset extends HTMLElement{connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const body=[...this.childNodes];const aside=document.createElement('aside');aside.className='inset '+(this.hasAttribute('vertical')?'vertical ':'')+(this.hasAttribute('dark')?'dark':'');const h=document.createElement('h3');h.textContent=this.getAttribute('heading');aside.append(h,...body);this.append(aside)}}
// Shared narrative blocks and combat phases render the same resolved check component.
const modal=document.getElementById('mechanics');
modal?.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()}});
class NarrativeEvent extends HTMLElement{
 setConfirmedNarration(envelope,scope){const e=readConfirmedNarration(envelope,scope);this._confirmed=e;this.dataset.eventId=e.id;this.dataset.revision=String(e.revision);if(this.isConnected)this.renderEvent(e)}
 connectedCallback(){if(this.dataset.ready)return;this.dataset.ready='1';const e=this._confirmed||events[this.getAttribute('event')];if(e)this.renderEvent(e)}
 renderEvent(e){
 const head=document.createElement('div');head.className='phasehead';head.innerHTML='<span class="roman">'+esc(e.roman)+'</span><h3>'+esc(e.title)+'</h3>';
 const p=document.createElement('p');const used=new Set();for(const t of e.text){if(typeof t==='string'){p.append(document.createTextNode(t));continue}if(used.has(t.check))continue;const c=e.checks.find(x=>x.id===t.check);if(!c)continue;const el=document.createElement('book-skill-check');el.check=c;p.append(el);used.add(t.check)}
 this.replaceChildren(head,p);
 }
}
class CombatPhase extends NarrativeEvent{}
for(const [n,c] of [['book-page',BookPage],['book-title',BookTitle],['book-portrait',BookPortrait],['book-inset',BookInset],['combat-phase',CombatPhase],['book-narrative-event',NarrativeEvent]])customElements.define(n,c);
