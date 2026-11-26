const groups=[...document.querySelectorAll('.nav-group')];
const links=[...document.querySelectorAll('.sub-icon')];
const home=document.querySelector('.nav-icon[href="/dm/"]');
function route(){const path=location.pathname.replace(/\/?$/,'/');const active=path.includes('/sistema/')?'system':path.includes('/arte/')?'art':null;const candidates=links.filter(a=>new URL(a.href).pathname===path);const selected=candidates.find(a=>new URL(a.href).hash===location.hash)||candidates[0];return {active,selected};}
function update(){const {active,selected}=route();for(const g of groups){const current=g.dataset.group===active;g.dataset.active=String(current);if(current)g.open=true;}for(const a of links){if(a===selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}if(!active)home?.setAttribute('aria-current','page');else home?.removeAttribute('aria-current');const sections=[...document.querySelectorAll('main .section')];for(const s of sections)s.hidden=Boolean(selected&&'#'+s.id!==new URL(selected.href).hash);}
update();window.addEventListener('hashchange',update);window.addEventListener('pageshow',update);
for(const g of groups){g.addEventListener('toggle',()=>{if(!g.open&&g.dataset.active==='true')g.open=true;});}
