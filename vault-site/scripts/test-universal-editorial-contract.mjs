import assert from 'node:assert/strict';
import {resolvePage,validateTemplate,validateComposition,validateContent} from '../public/libro/edition/universal/contract.mjs';
const template={schemaVersion:1,id:'test',revision:1,name:'Test',instructions:'No cubrir la luna',viewInstructions:{mobile:'Flujo'},elements:[
 {id:'stage',type:'group',name:'Stage',instructions:'Capas',layout:{base:{ratio:2},mobile:{ratio:1}},children:[
  {id:'sky',type:'image',name:'Cielo',binding:'sky',layout:{base:{position:'overlay',x:0,y:0,width:100,height:100,transition:'fade',duration:250}}},
  {id:'title',type:'text',name:'Título',binding:'title',role:'heading',when:{binding:'titleArt',present:false}},
  {id:'titleArt',type:'image',name:'Título gráfico',binding:'titleArt',layout:{base:{position:'overlay',x:10,y:0,width:80,z:2}}},
  {id:'optional',type:'image',name:'Optional',binding:'missing'}
 ]},
 {id:'text',type:'text',name:'Text',binding:'prose'},
 {id:'panel',type:'interaction',name:'Panel',instructions:'Solo opciones autorizadas',children:[{id:'ornament',type:'image',name:'Adorno',binding:'ornament',layout:{base:{position:'overlay',x:80,y:-5,width:15,z:3}}}]}
]};
const composition={schemaVersion:1,id:'compose',templateId:'test',templateRevision:1,overrides:{sky:{mobile:{x:5}}},assets:{}};
const content={pageId:'scene',bindings:{sky:'day',title:'Title',prose:['<script>literal</script>'],ornament:'logo'},interaction:{title:'Options',text:'Choose',terminal:false,options:[{id:'enter',label:'Enter',symbol:'logo'}]}};
const assets={day:{src:'/libro/assets/bosque.png',alt:'Day'},night:{src:'/docs/art-references/bosqueNocturno.png',alt:'Night'},logo:{src:'/libro/edition/assets/cover.webp',alt:'Symbol'}};
const doc={template,composition,content,assets};
const mobile=resolvePage(doc,'mobile'),desktop=resolvePage(doc,'desktop');
assert.equal(mobile.nodes[0].style.ratio,1);assert.equal(desktop.nodes[0].style.ratio,2);
assert.equal(mobile.nodes[0].children[0].style.x,5);assert.equal(desktop.nodes[0].children[0].style.x,0);
assert.deepEqual(mobile.nodes[0].children.map(x=>x.id),['sky','title']);assert.equal(mobile.nodes[2].children[0].value.id,'logo');
assert.equal(mobile.interaction.options[0].image.alt,'Symbol');assert.deepEqual(mobile.nodes[1].value,['<script>literal</script>']);
const graphic=structuredClone(doc);graphic.content.bindings.titleArt='logo';graphic.composition.assets.sky='night';assert.deepEqual(resolvePage(graphic,'desktop').nodes[0].children.map(x=>x.id),['sky','titleArt']);assert.equal(resolvePage(graphic,'desktop').nodes[0].children[0].value.id,'night');
const change=(f)=>{const x=structuredClone(doc);f(x);return x};
for(const bad of [
 x=>x.composition.templateRevision=2,x=>x.composition.overrides.unknown={base:{x:1}},x=>x.composition.overrides.sky={base:{css:'url(evil)'}},x=>x.composition.options=[],
 x=>x.assets.day.src='https://example.com/x.png',x=>x.assets.day.src='/libro/../private.png',x=>x.content.bindings.sky='unknown',
 x=>x.content.interaction.options=[],x=>x.content.interaction.options.push({id:'enter',label:'Duplicate'}),x=>x.content.interaction.options[0].target='future',
 x=>x.composition.overrides.panel={mobile:{hidden:true}},x=>x.composition.overrides.panel={mobile:{position:'overlay'}},x=>x.template.elements.pop(),x=>x.template.layout={base:{hidden:true}},x=>x.composition.overrides.stage={mobile:{position:'overlay'}},x=>x.template.elements[0].children.push(x.template.elements.pop()),
 x=>x.template.elements[0].children.push({...x.template.elements[0].children[0]})
])assert.throws(()=>resolvePage(change(bad),'mobile'));
assert.equal(resolvePage(change(x=>{x.content.interaction.terminal=true;x.content.interaction.options=[]}),'mobile').interaction.terminal,true);
assert.equal(resolvePage(doc,'mobile').pageId,'scene');
console.log('PASS universal contract: responsive overrides, missing bindings, title image, overlays, symbols, strict validation, trusted choices, terminal');
