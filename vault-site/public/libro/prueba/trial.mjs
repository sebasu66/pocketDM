import '../edition/universal/book-page.mjs';
import {samples} from '../edition/universal/demo-content.mjs';
import {make,route} from '../edition/universal/demo-design.mjs';
const page=document.querySelector('book-universal-page'),byId=new Map(samples.map(p=>[p.id,p])),key='pocketdm-universal-trial-v1';
let active=byId.get('cover'),answer='';
function documentFor(p,response){
 const d=make(p,response);
 // This cover is an authored trial composition, not a new canonical campaign.
 if(p.id==='cover'){
  d.content.bindings['scene.background']='BKG/orange_sky';
  d.content.bindings['scene.titleImage']='LOGO/stormkeep';
  d.composition.overrides.hero={base:{ratio:1.8},mobile:{ratio:.95},fold:{ratio:1.5}};
  d.composition.overrides.background={base:{fit:'cover',objectX:50,objectY:50,cameraEnabled:true,cameraStartX:50,cameraStartY:50,cameraStartZoom:1,cameraEndX:50,cameraEndY:48,cameraEndZoom:1.12,cameraDuration:5}};
  d.composition.overrides['title-art']={base:{x:7,y:3,width:86,height:35},mobile:{height:28}};
  d.content.bindings['scene.description']=['El farol del paso','Miniaventura de muestra. Una noche, un encargo y tres desenlaces.'];
 }
 return d
}
function save(){try{sessionStorage.setItem(key,JSON.stringify({pageId:active.id,answer}))}catch{}}
function show(id,nextAnswer='',scroll=true){
 const p=byId.get(id);if(!p)throw Error('Situación desconocida');
 if(nextAnswer&&(!p.responses||!Object.hasOwn(p.responses,nextAnswer)))throw Error('Respuesta desconocida');
 const doc=documentFor(p,nextAnswer?p.responses[nextAnswer]:'');page.confirmPage(doc);active=p;answer=nextAnswer;save();
 if(scroll)window.scrollTo({top:0,behavior:'auto'});
}
page.setChoiceHandler(({pageId,choiceId})=>{
 if(active.id!==pageId)throw Error('Situación anterior');
 if(active.id==='dialogue'&&!answer&&Object.hasOwn(active.responses,choiceId)){show(active.id,choiceId,false);requestAnimationFrame(()=>page.shadowRoot.querySelector('.options')?.scrollIntoView({block:'end'}));return}
 if(active.id==='dialogue'&&answer&&choiceId==='leave'){show('exploration');return}
 if(choiceId==='restart'&&active.type==='resolution'){show('cover');return}
 if(choiceId==='travel'&&route[active.id]){show(route[active.id][0]);return}
 if(Object.hasOwn(active.targets??{},choiceId)){show(active.targets[choiceId]);return}
 throw Error('Opción no autorizada')
});
document.getElementById('restart').onclick=()=>{if(active.id==='cover'||confirm('¿Reiniciar la aventura de prueba?'))show('cover')};
try{let saved=null;try{saved=JSON.parse(sessionStorage.getItem(key)||'null')}catch{};if(saved&&byId.has(saved.pageId)){try{show(saved.pageId,saved.answer||'',false)}catch{show('cover','',false)}}else show('cover','',false)}catch(e){const error=document.getElementById('trial-error');error.hidden=false;error.textContent='No se pudo abrir la prueba: '+e.message}
