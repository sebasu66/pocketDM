// Manual authoring sample. No AI or simulation runs in the renderer.
import './book-page.mjs';
import '../../components.mjs';
import {samples} from './demo-content.mjs';
import {combatSample} from '../../book-examples-combat.mjs';
const visual=(base,mobile={},desktop={})=>({base,mobile,desktop});
const image=(id,name,binding,layout,instructions='',extra={})=>({id,name,type:'image',binding,layout,instructions,...extra});
const copy=(id,name,binding,role,layout,instructions='',extra={})=>({id,name,type:'text',binding,role,layout,instructions,...extra});
const assets={
 plaza:{src:'/docs/art-references/plaza-cuervo-gris.png',alt:'Plaza del Cuervo Gris'},
 forest:{src:'/libro/assets/bosque.png',alt:'Bosque nevado'},
 forge:{src:'/docs/art-references/herreria.png',alt:'Forja iluminada'},
 cover:{src:'/libro/edition/assets/cover.webp',alt:'Portada ilustrada de Stormkeep'},
 smith:{src:'/docs/art-references/herrero-retrato.png',alt:'Retrato del herrero'},
 paper:{src:'/libro/edition/assets/paper.webp',alt:''},
 galahad:{src:'/libro/editorial/galahad-cutout.webp',alt:'Galahad'},
 mountains:{src:'/atlas/assets/nature/mountains.png',alt:''}
};
const template={schemaVersion:1,id:'pocketdm.editorial.universal',revision:1,name:'Escena narrativa universal',
 instructions:'Componer con las referencias existentes. Priorizar el motivo visual y no cubrir rostros o elementos importantes. Utilizar únicamente recursos catalogados. No modificar el relato ni las opciones. La elección de imágenes, escalas y encuadres ocurre durante la preparación editorial.',
 viewInstructions:{desktop:'Usar una composición amplia y jerarquía visual clara.',mobile:'Composición vertical y desplazamiento natural. No recortar texto ni opciones.'},
 layout:visual({background:'#182632',color:'#f0e4d0',gap:14,padding:14},{padding:8},{padding:20}),
 elements:[
  {id:'hero',name:'Escenario por capas',type:'group',instructions:'Ajustar cielo, horizonte y personaje según la escena. La composición es relativa a este lienzo.',layout:visual({ratio:1.7,overflow:'clip',radius:4,background:'#131d28'},{ratio:.8}),children:[
   image('background','Fondo de localización','scene.background',visual({position:'overlay',x:0,y:0,width:100,height:100,z:0,fit:'cover',objectX:50,objectY:50,transition:'fade',duration:350}),'Usar el fondo preparado para esta situación. Ajustar el recorte sin tapar el motivo importante.'),
   image('character','Retrato o figura','npc.portrait',visual({position:'overlay',x:3,y:18,width:37,height:80,z:3,fit:'contain',transition:'fade',duration:300},{x:4,y:35,width:75,height:65}),'Si existe una figura transparente, superponerla. Un retrato opaco es una imagen editorial, no un recorte.'),
   image('title-art','Título ilustrado','scene.titleImage',visual({position:'overlay',x:5,y:3,width:90,height:55,z:4,fit:'contain'},{height:40}),'Si hay título gráfico aprobado, sustituye el título de texto.'),
   copy('hero-title','Título','scene.title','heading',visual({position:'overlay',x:5,y:5,width:90,z:5,background:'#131d28cc',padding:12,radius:4,color:'#f1d0a0',fontSize:36},{fontSize:26}),'Usar solo si no hay título ilustrado.',{when:{binding:'scene.titleImage',present:false}})
  ]},
  copy('narrative','Narración','scene.description','paragraph',visual({padding:12,fontSize:19},{fontSize:17}),'Texto íntegro, nunca cortar ni sintetizar.'),
  {id:'mechanics',name:'Resoluciones confirmadas',type:'slot',slotName:'mechanics',binding:'scene.mechanics',instructions:'Reutilizar los componentes existentes de chequeos y combate. No reconstruir resultados en la plantilla.',layout:visual({padding:10,background:'#efe3ca',color:'#261f1c',radius:5})},
  {id:'interaction',name:'Panel universal de interacción',type:'interaction',instructions:'Mostrar el diálogo o contexto y exclusivamente las opciones autorizadas. Permitir que el contenido extienda el panel. Las imágenes decorativas pueden sobresalir sin tapar el texto.',layout:visual({position:'flow',padding:18,background:'#251e1a',borderColor:'#b5996c',radius:6,overflow:'visible',z:2},{padding:14}),children:[
    image('panel-decoration','Adorno superior','panel.decoration',visual({position:'overlay',x:88,y:-5,width:10,height:15,z:2,fit:'contain'}),'No cubrir botones ni texto. Ocultar si no hay adorno aprobado.')
  ]}
 ]};
const route={cover:['location','Entrar en la plaza'],location:['dialogue','Acercarse al herrero'],exploration:['perception','Examinar las huellas'],perception:['athletics','Cruzar la zanja'],athletics:['decision','Buscar otro paso'],combat:['victory','Llevar el farol al refugio']};
const imageIds={'/libro/assets/bosque.png':'forest','/docs/art-references/plaza-cuervo-gris.png':'plaza','/docs/art-references/herreria.png':'forge','/libro/edition/assets/cover.webp':'cover'};
const make=(p,response='')=>{
 const isDialogue=p.id==='dialogue',terminal=p.type==='resolution';
 let options=p.choices.map(o=>({id:o.id,label:o.label}));
 if(isDialogue&&response)options=[{id:'leave',label:'Salir hacia el bosque'}];
 if(route[p.id])options.push({id:'travel',label:route[p.id][1]});
 if(terminal)options=[{id:'restart',label:'Volver a jugar'}];
 const bindings={'scene.title':p.title,'scene.description':p.text,'scene.background':imageIds[p.image]??(isDialogue?'forge':'forest'),'scene.mechanics':!!p.check||p.events.length>0};
 if(isDialogue)bindings['npc.portrait']='smith';
 // These are deliberately hand-selected per-scene overrides, not runtime inference.
 const overrides=p.id==='cover'?{hero:{base:{ratio:1},mobile:{ratio:.66}},background:{base:{fit:'contain'}},'hero-title':{base:{y:78,fontSize:30}}}:isDialogue?{hero:{desktop:{ratio:2}},character:{desktop:{x:4,y:12,width:32,height:88},mobile:{x:10,y:24,width:80,height:76}}}:p.id==='combat'?{hero:{mobile:{ratio:1.2}},background:{base:{objectY:65}}}:{};
 const composition={schemaVersion:1,id:'farol.'+p.id,templateId:template.id,templateRevision:template.revision,overrides,assets:{}};
 return {template,composition,assets,content:{pageId:p.id,bindings,interaction:{title:isDialogue?p.speaker:terminal?'Desenlace':'¿Qué hacés?',text:response||p.line||'',options,terminal}}};
};
export {template,assets,make};
const page=document.querySelector('book-universal-page'),selector=document.getElementById('scene'),view=document.getElementById('view'),data=document.getElementById('json');
let active=samples[0],response='';
function show(id,{keepResponse=false}={}){
 const p=samples.find(x=>x.id===id);if(!p)throw Error('Destino desconocido');if(!keepResponse)response='';active=p;selector.value=p.id;
 const doc=make(p,response);
 page.replaceChildren();
 if(p.check){const check=document.createElement('book-skill-check');check.slot='mechanics';check.check=p.check;page.append(check)}
 for(const event of p.events){const n=document.createElement('combat-phase');n.slot='mechanics';n.setConfirmedNarration(event,combatSample.scope);page.append(n)}
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
