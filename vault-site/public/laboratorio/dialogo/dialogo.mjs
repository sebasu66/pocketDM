import '/dm/libro/editorial/dialogue-page.mjs?v=16';
import {activeKey,localDesigns,applyLayout} from './editorial-layout.mjs';
import { demoCheck, outcomes } from '../../libro/check-contract.mjs';
import { encounterSites, preferredViews, scenes, skills } from './escenas.mjs';
import {createMobileReader, readerMode} from '/libro/mobile-reader.mjs?v=20261125full';
const artPath='/docs/art-references/stormkeep-work-20261125/';
const selection=document.querySelector('#npc'),layout=document.querySelector('#layout'),reset=document.querySelector('#reset'),scene=document.querySelector('.scene'),loading=document.querySelector('#loading');
const page=scene.querySelector('book-editorial-dialogue');
let cast,pendingRoll,history=[],generation=0;
// Reuse the reader's rail, but route its controls to the active conversation.
const reader = createMobileReader({viewport: document.createElement('div'), turn:()=>{}, home:()=>{}, route:()=>{}, zoomBy:()=>{}, resetZoom:()=>{}, getZoom:()=>1});
const rail = document.querySelector('.mobile-rail');
rail.setAttribute('aria-label','Controles de diálogo');
const menu=rail.querySelector('[data-mobile=menu]'), prev=rail.querySelector('[data-mobile=prev]'), next=rail.querySelector('[data-mobile=next]');
menu.setAttribute('aria-label','Abrir o cerrar respuestas'); menu.title='Abrir o cerrar respuestas';
prev.setAttribute('aria-label','Respuesta anterior'); prev.title='Respuesta anterior';
next.setAttribute('aria-label','Respuesta siguiente'); next.title='Respuesta siguiente';
const confirm=document.createElement('button'); confirm.type='button'; confirm.setAttribute('aria-label','Enviar respuesta elegida'); confirm.title='Enviar respuesta elegida'; confirm.textContent='➤'; rail.append(confirm);
function syncRail(){
 const active=readerMode(); document.body.classList.toggle('pdm-mobile-full',active); reader.update({active,index:0,total:1});
 const count=page.content.dialogue?.choices.length||0, chosen=page.pendingChoice;
 menu.disabled=!count; prev.disabled=!count || chosen===0; next.disabled=!count || chosen===count-1; confirm.disabled=chosen===null || !count;
 rail.querySelector('.mobile-progress').textContent=count?(chosen===null?'–':String(chosen+1))+'/'+count:'✓';
}
menu.onclick=()=>{page.shadowRoot.querySelector('.choice-toggle').click();syncRail()};
function selectRelative(delta){const count=page.content.dialogue?.choices.length||0;if(!count)return;const chosen=page.pendingChoice;const index=chosen===null?(delta>0?0:count-1):Math.max(0,Math.min(count-1,chosen+delta));if(page.shadowRoot.querySelector('.choices').hidden)page.shadowRoot.querySelector('.choice-toggle').click();page.shadowRoot.querySelector('[data-index="'+index+'"]')?.click();syncRail()}
prev.onclick=()=>selectRelative(-1);next.onclick=()=>selectRelative(1);confirm.onclick=()=>{page.shadowRoot.querySelector('.choice-send').click();syncRail()};
page.addEventListener('click',()=>queueMicrotask(syncRail));
window.addEventListener('resize',syncRail);
async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error('No se pudo cargar ' + path);
  return response.json();
}

function artwork(entry) {
  if (!entry?.image) return null;
  return entry.image.startsWith('/') ? entry.image : artPath + entry.image;
}

function buildCast(population, manifest) {
  const art = new Map(manifest.entries.map(entry => [entry.key, entry]));
  const sites = new Map(population.sites.map(site => [site.id, site.name]));
  return population.actors.map(actor => {
    const key = actor.id.split('.').at(-1);
    const site = encounterSites[key] ?? actor.workplaceId ?? actor.homeAreaId;
    const backdrop = art.get(preferredViews[site]);
    if (!scenes[key] || !backdrop?.image) throw new Error('Escena incompleta: ' + actor.name);
    return {
      key,
      name: actor.name,
      role: actor.role,
      location: sites.get(site),
      backdrop: artwork(backdrop),
      portrait: artwork(art.get(key)),
      dialogue: scenes[key],
    };
  }).sort((a, b) => a.name.localeCompare(b.name, 'es'));
}


function content(line,choices){const npc=cast.get(selection.value);return {title:npc.name,kicker:npc.location,paragraphs:[],image:npc.backdrop,alt:npc.location,folio:'',camera:{},dialogue:{line,history,people:[{name:npc.name,role:npc.role,image:npc.portrait||'',emotion:'neutral',emotions:{}}],choices}}}
function start(){pendingRoll=1+Math.floor(Math.random()*100);history=[];page.selected=null;page.pendingChoice=null;page.choicesOpen=null;const d=cast.get(selection.value).dialogue;page.content=content(d.opening,[{id:'ask',label:d.ask},{id:'skill',label:d.attempt+' · '+skills[d.skill].name}]);syncRail()}
page.addEventListener('dialogue-choice',e=>{const npc=cast.get(selection.value),d=npc.dialogue,choice=e.detail;history=[{speaker:'npc',text:d.opening},{speaker:'player',text:choice.label}];let answer=d.answer;if(choice.id==='skill'){const skill=skills[d.skill],r=demoCheck({id:'demo-dialogue-'+selection.value,actorId:'demo-visitor',actorName:'Viajero de prueba',skillId:d.skill,skillName:skill.name,base:skill.base,difficulty:skill.difficulty,roll:pendingRoll,reason:d.attempt});history.push({speaker:'check',text:r.skillName+' · '+outcomes[r.outcome]+' · '+r.difficulty+' · D100: '+r.roll+' · Objetivo: '+r.target+'% (base '+r.base+'%)'});answer=d[r.outcome]}page.selected=null;page.pendingChoice=null;page.choicesOpen=false;page.content=content(answer,[]);syncRail()});
async function loadDesign(follow=true){const token=++generation,{items,active}=localDesigns(),id=follow?active:layout.value;layout.replaceChildren(...items.map(x=>new Option(x.name,x.id)));layout.value=id;try{const source=await applyLayout(page,id,()=>token===generation);if(token!==generation)return;layout.title=source;fit()}catch(e){if(token!==generation)return;layout.title=e.message;loading.hidden=false;loading.textContent=e.message;return}loading.hidden=true}
function fit(){if(scene.hidden)return;const mobile=matchMedia('(orientation:portrait)').matches;page.setAttribute('preview-view',mobile?'mobile':'desktop');const s=page.getResolvedSettings(mobile?'mobile':'desktop'),[w,h]=String(s.ratio).split('/').map(Number),ratio=w/h||16/9;page.style.width=Math.floor(Math.min(scene.clientWidth,scene.clientHeight*ratio))+'px';page.schedule()}
new ResizeObserver(fit).observe(scene);
window.addEventListener('storage',e=>{if(e.key===activeKey&&cast)loadDesign()});window.addEventListener('focus',()=>{if(cast)loadDesign(false)});
async function init(){const [population,manifest]=await Promise.all([loadJSON('/data/stormkeep-population-v02.json'),loadJSON(artPath+'manifest.json')]);const residents=buildCast(population,manifest);cast=new Map(residents.map(n=>[n.key,n]));selection.replaceChildren(...residents.map(n=>new Option(n.name,n.key)));selection.value='hald';await loadDesign();start();scene.hidden=false;selection.disabled=layout.disabled=reset.disabled=false;selection.onchange=start;reset.onclick=start;layout.onchange=()=>loadDesign(false);fit()}
init().catch(e=>{console.error(e);loading.hidden=false;loading.textContent='No se pudo cargar la conversación: '+e.message});
