const groups=[...document.querySelectorAll('.nav-group')];
const links=[...document.querySelectorAll('.sub-icon')];
const home=document.querySelector('.nav-icon[href="/dm/"]');
function route(){const path=location.pathname.replace(/\/?$/,'/');const active=path.includes('/sistema/')?'system':path.includes('/arte/')?'art':path.includes('/libro/')?'book':null;const candidates=links.filter(a=>new URL(a.href).pathname===path);const selected=candidates.find(a=>new URL(a.href).hash===location.hash)||candidates[0];return {active,selected};}
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

class DMContextPanel extends HTMLElement{
 constructor(){super();this.attachShadow({mode:'open'});this.shadowRoot.innerHTML='<style>:host{display:block;height:100%;background:#1b222b;color:#e5dfd4;font:14px/1.45 system-ui,sans-serif;overflow:hidden}:host([hidden]){display:none} .panel-shell{height:100%;display:flex;flex-direction:column;min-height:0} .panel-head{padding:12px;display:flex;align-items:center;justify-content:space-between;gap:8px;background:#211d2c;color:#e4d6f5;border-bottom:1px solid #6d578e} .panel-head button{cursor:pointer;color:inherit;background:#2e253a;border:1px solid #6d578e;border-radius:5px;padding:5px 8px} .panel-body{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}</style><div class="panel-shell"><div class="panel-head"><strong></strong><button type="button">Ocultar</button></div><div class="panel-body"></div></div>';this.shadowRoot.querySelector('button').onclick=()=>this.setOpen(false);}
 mountTools(node,styles,title){const body=this.shadowRoot.querySelector('.panel-body');const style=document.createElement('style');style.textContent=styles+'\n.panel-body .sidebar{position:static!important;display:flex!important;width:100%!important;height:auto!important;overflow:visible!important;visibility:visible!important;box-shadow:none!important;border:0!important}.panel-body .tools-heading{display:none!important}.panel-body .sidebar .tool-group{flex:none}';body.replaceChildren(style,node);this.shadowRoot.querySelector('strong').textContent=title;this.setOpen(!matchMedia('(max-width:600px)').matches);}
 setOpen(value){this.hidden=!value;document.documentElement.classList.toggle('context-open',value);document.querySelector('.context-reopen')?.setAttribute('aria-expanded',String(value));}
}
customElements.define('dm-context-panel',DMContextPanel);
const contextPanel=document.createElement('dm-context-panel');contextPanel.hidden=true;rail.append(contextPanel);
const contextButton=document.createElement('button');contextButton.type='button';contextButton.className='nav-icon context-reopen';contextButton.hidden=true;contextButton.setAttribute('aria-label','Herramientas de la sección');contextButton.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="#151515"/><circle cx="15" cy="12" r="2" fill="#151515"/><circle cx="10" cy="18" r="2" fill="#151515"/></svg><span class="nav-label" aria-hidden="true">Herramientas</span><span class="tip" aria-hidden="true">Herramientas</span>';sidebarNav.insertBefore(contextButton,toggle);contextButton.onclick=()=>contextPanel.setOpen(contextPanel.hidden);
let contextSection=null;
function syncContext(){const section=document.querySelector('main [data-context-tools]:not([hidden])');contextButton.hidden=!section;if(!section){contextPanel.setOpen(false);contextSection=null;return;}if(contextSection===section)return;contextSection=section;const frame=section.querySelector('iframe');if(!frame)return;const mount=()=>{if(contextSection!==section)return;const api=frame.contentWindow?.pocketDMContextTools;if(api?.mount(contextPanel))return;if(contextPanel.shadowRoot.querySelector('.panel-body .sidebar'))contextPanel.setOpen(!matchMedia('(max-width:600px)').matches);};frame.addEventListener('load',mount,{once:true});mount();}
window.addEventListener('hashchange',syncContext);window.addEventListener('pageshow',syncContext);syncContext();
