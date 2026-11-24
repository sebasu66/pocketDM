import {validateCheck,outcomes} from './check-contract.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let active=null;
function openCheck(c,trigger){
 const dialog=document.getElementById('mechanics');
 if(!dialog)return;
 if(active)active.setAttribute('aria-expanded','false');
 active=trigger;trigger.setAttribute('aria-expanded','true');
 document.getElementById('mechanics-title').textContent=c.skillName+' · '+outcomes[c.outcome];
 document.getElementById('mechanics-body').innerHTML='<div class="check-receipt"><div class="check-die '+esc(c.outcome)+'"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4L94 29 94 70 50 96 6 70 6 29Z M50 4L25 36 6 70M50 4L75 36 94 70M25 36H75L50 96Z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg><b>'+c.roll+'</b><small>'+c.dice+'</small></div><div><p class="check-actor">'+esc(c.actorName)+'</p><p>'+esc(c.action||c.skillName)+'</p><div class="check-result '+esc(c.outcome)+'">'+esc(outcomes[c.outcome])+'</div></div></div><dl class="check-values"><dt>Habilidad base</dt><dd>'+c.base+'%</dd><dt>Dificultad</dt><dd>'+esc(c.difficulty)+'</dd><dt>Valor efectivo</dt><dd>'+c.target+'%</dd><dt>Tirada registrada</dt><dd>'+c.roll+' / 100</dd></dl><p>'+esc(c.reason)+'</p>'+(c.consequence?'<p><strong>Consecuencia:</strong> '+esc(c.consequence)+'</p>':'')+(c.source==='demo'?'<p class="sample">Datos ilustrativos; no corresponden a una tirada del motor en vivo.</p>':'');
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
}
document.addEventListener('close',e=>{if(e.target.id==='mechanics'&&active){active.setAttribute('aria-expanded','false');active.focus({preventScroll:true});active=null}},true);
class BookSkillCheck extends HTMLElement{
 set check(value){this._check=validateCheck(value);if(this.isConnected)this.render()}
 get check(){return this._check}
 connectedCallback(){this.render()}
 render(){if(!this._check)return;const c=this._check;const btn=document.createElement('button');btn.type='button';btn.className='skill-pill '+c.outcome;btn.setAttribute('aria-haspopup','dialog');btn.setAttribute('aria-expanded','false');btn.dataset.checkId=c.id;btn.innerHTML='<span aria-hidden="true">'+(['success','critical'].includes(c.outcome)?'✓':'×')+'</span><strong>'+esc(c.skillName)+'</strong><span class="skill-separator">·</span><span>'+esc(outcomes[c.outcome])+'</span>';btn.onclick=()=>openCheck(c,btn);this.replaceChildren(btn)}
}
if(!customElements.get('book-skill-check'))customElements.define('book-skill-check',BookSkillCheck);
