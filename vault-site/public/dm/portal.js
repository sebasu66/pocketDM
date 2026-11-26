const groups=[...document.querySelectorAll('.nav-group')];
const links=[...document.querySelectorAll('.sub-icon')];
const home=document.querySelector('.nav-icon[href="/dm/"]');
function route(){const path=location.pathname.replace(/\/?$/,'/');const active=path.includes('/sistema/')?'system':path.includes('/arte/')?'art':null;const candidates=links.filter(a=>new URL(a.href).pathname===path);const selected=candidates.find(a=>new URL(a.href).hash===location.hash)||candidates[0];return {active,selected};}
function update(){const {active,selected}=route();for(const g of groups){const current=g.dataset.group===active;g.dataset.active=String(current);if(current)g.open=true;}for(const a of links){if(a===selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}if(!active)home?.setAttribute('aria-current','page');else home?.removeAttribute('aria-current');const sections=[...document.querySelectorAll('main .section')];for(const s of sections)s.hidden=Boolean(selected&&'#'+s.id!==new URL(selected.href).hash);}
update();window.addEventListener('hashchange',update);window.addEventListener('pageshow',update);
for(const g of groups){g.addEventListener('toggle',()=>{if(!g.open&&g.dataset.active==='true')g.open=true;});}

/* Sidebar width is independent of route and group expansion. */
const rail=document.querySelector('.rail');
const sidebarNav=rail.querySelector('nav');
for(const item of sidebarNav.querySelectorAll('.nav-icon,.mark')){
 const label=document.createElement('span');label.className='nav-label';label.textContent=item.classList.contains('mark')?'Dungeon Master':item.getAttribute('aria-label');label.setAttribute('aria-hidden','true');item.append(label);
}
const toggle=document.createElement('button');
toggle.type='button';toggle.className='rail-toggle nav-icon';toggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m4-11 3 3-3 3"/></svg><span class="nav-label" aria-hidden="true"></span><span class="tip" aria-hidden="true"></span>';
sidebarNav.append(toggle);
const sidebarKey='pocketdm.dm.sidebar.expanded';
function setSidebar(expanded,persist=false){
 document.documentElement.classList.toggle('rail-expanded',expanded);
 toggle.setAttribute('aria-expanded',String(expanded));
 const text=expanded?'Colapsar barra lateral':'Expandir barra lateral';
 toggle.setAttribute('aria-label',text);
 toggle.querySelector('.nav-label').textContent=text;
 toggle.querySelector('.tip').textContent=text;
 if(persist)try{localStorage.setItem(sidebarKey,expanded?'1':'0');}catch{}
}
let initial=false;try{initial=localStorage.getItem(sidebarKey)==='1';}catch{}
setSidebar(initial);toggle.addEventListener('click',()=>setSidebar(toggle.getAttribute('aria-expanded')!=='true',true));
