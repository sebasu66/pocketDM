// Manual authoring sample. No AI or simulation runs in the renderer.
import './book-page.mjs';
import '../../components.mjs';
import {samples} from './demo-content.mjs';
import {combatSample} from '../../book-examples-combat.mjs';
import {make,route} from './demo-design.mjs';
const page=document.querySelector('book-universal-page'),selector=document.getElementById('scene'),view=document.getElementById('view'),data=document.getElementById('json');
let active=samples[0],response='';
function show(id,{keepResponse=false}={}){
 const p=samples.find(x=>x.id===id);if(!p)throw Error('Destino desconocido');if(!keepResponse)response='';active=p;selector.value=p.id;
 const doc=make(p,response);
 page.replaceChildren();
 page.confirmPage(doc);data.textContent=JSON.stringify(doc,null,2);document.getElementById('current').textContent=p.label;
}
for(const p of samples){const o=document.createElement('option');o.value=p.id;o.textContent=p.label;selector.append(o)}
selector.onchange=()=>show(selector.value);view.onchange=()=>{if(view.value==='auto')page.removeAttribute('preview-view');else page.setAttribute('preview-view',view.value);page.style.maxWidth=view.value==='mobile'?'390px':'none'};
page.setChoiceHandler(({pageId,choiceId})=>{
 if(pageId!==active.id)throw Error('Situación anterior');
 if(active.id==='dialogue'&&active.responses[choiceId]){response=active.responses[choiceId];show(active.id,{keepResponse:true});return}
 if(active.id==='dialogue'&&choiceId==='leave')show('exploration');
 else if(choiceId==='restart'&&active.type==='resolution')show('cover');
 else if(choiceId==='travel'&&route[active.id])show(route[active.id][0]);
 else if(active.targets?.[choiceId])show(active.targets[choiceId]);
 else throw Error('Opción no autorizada');
});
show('cover');
