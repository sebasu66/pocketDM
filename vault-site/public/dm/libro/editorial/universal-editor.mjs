import {contentTypes,renderAssets,canonicalId} from '../../arte/asset-catalog.mjs';
import '/libro/edition/universal/book-page.mjs';
import {resolvePage} from '/libro/edition/universal/contract.mjs';
import {template,assets,make} from '/libro/edition/universal/demo-design.mjs';
import {samples} from '/libro/edition/universal/demo-content.mjs';
import {readLocal,writeLocal} from './library.mjs?v=15';
import {cropRect} from './camera.mjs';

const $=id=>document.getElementById(id),copy=structuredClone;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const opt=(v,t=v)=>{const n=el('option','',t);n.value=v;return n};
const id=()=> 'layer-'+crypto.randomUUID().slice(0,8);
const boards=[...document.querySelectorAll('.artboard')],pages=boards.map(b=>b.querySelector('book-universal-page'));
const initial=()=>({template:copy(template),assets:copy(assets),previewBindings:{}});
const storageKey='universal-library-v1';
let state=initial(),selected=null,tab='design',scope='base',scene=samples[0].id,past=[],future=[],dirty=false,saving=false,library={designs:[]},current='builtin',revision=1,drag=null,cameraMode='start';
const names={image:'Imagen',text:'Texto',group:'Grupo',slot:'Contenido',interaction:'Interacción'};
const symbols={image:'▧',text:'T',group:'▱',slot:'▤',interaction:'☷'};
const defaults={position:'flow',x:0,y:0,width:100,height:100,ratio:1.5,z:0,opacity:1,rotation:0,scale:1,align:'left',fit:'contain',objectX:50,objectY:50,gap:8,padding:0,fontSize:17,color:'#f0e4d0',background:'transparent',borderColor:'#b5996c',radius:0,duration:300,transition:'none',hidden:false,overflow:'visible',direction:'column',cameraEnabled:false,cameraStartX:50,cameraStartY:50,cameraStartZoom:1,cameraEndX:50,cameraEndY:50,cameraEndZoom:1.25,cameraDuration:4,cameraEasing:'ease-in-out',panelSkin:'',optionNormal:'',optionHover:'',optionSelected:'',optionTextColor:'#22251f',optionHoverTextColor:'#102c28',optionMinHeight:44};
function locate(key,list=state.template.elements,parent=null){for(let i=0;i<list.length;i++){const item=list[i];if(item.id===key)return {item,list,i,parent};const child=item.children&&locate(key,item.children,item);if(child)return child}return null}
function all(list=state.template.elements){return list.flatMap(x=>[x,...all(x.children??[])])}
const active=()=>selected?locate(selected)?.item:state.template;
function visual(item=active(),view=scope){return {...defaults,...item?.layout?.base,...(view==='base'?{}:item?.layout?.[view])}}
function status(text,error=false){$('saveStatus').textContent=text;$('saveStatus').classList.toggle('danger',error)}
function mark(){dirty=true;status('Cambios sin guardar · biblioteca local')}
function docFor(){
 const p=samples.find(x=>x.id===scene),d=make(p,$('samples').checked&&p.id==='dialogue'?p.responses.accept:'');
 d.template=copy(state.template);d.assets={...renderAssets,...copy(state.assets)};d.composition={schemaVersion:1,id:'preview.'+scene,templateId:d.template.id,templateRevision:d.template.revision,overrides:{},assets:{}};
 d.content.bindings={...d.content.bindings,...state.previewBindings};
 if($('samples').checked)for(const x of all()){
  if(!x.binding||Object.hasOwn(d.content.bindings,x.binding))continue;
  if(x.type==='image')d.content.bindings[x.binding]=x.id==='title-art'?'cover':x.id==='panel-decoration'?'mountains':x.id==='character'?'galahad':'forest';
  if(x.type==='text')d.content.bindings[x.binding]='Texto de muestra';
 }
 return d;
}
function validate(){const d=docFor();resolvePage(d,'desktop');resolvePage(d,'mobile')}
function commit(fn,{refresh=true}={}){
 if(saving){status('Guardado en curso; no se aplicó el cambio.',true);return false}
 const old=copy(state);try{fn();validate()}catch(e){state=old;status(e.message,true);renderInspector();return false}
 past.push(old);if(past.length>80)past.shift();future=[];mark();render(refresh);return true
}
function undo(){if(!past.length)return;future.push(copy(state));state=past.pop();if(selected&&!locate(selected))selected=null;mark();render()}
function redo(){if(!future.length)return;past.push(copy(state));state=future.pop();if(selected&&!locate(selected))selected=null;mark();render()}
function fit(){for(const b of boards){if(b.hidden)continue;const box=b.querySelector('.board'),inner=b.querySelector('.board-inner'),width=b.dataset.board==='mobile'?390:960;inner.style.width=width+'px';const scale=Math.min(1,box.clientWidth/width);inner.style.transform='scale('+scale+')';box.style.height=Math.ceil(inner.offsetHeight*scale)+'px'}}
let raf=0;const ro=new ResizeObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(fit)});boards.forEach(b=>ro.observe(b));pages.forEach(p=>ro.observe(p));
function highlight(){for(const p of pages)for(const n of p.shadowRoot.querySelectorAll('[data-element-id]')){n.style.outline=n.dataset.elementId===selected?'2px solid #8eb5ff':'';n.style.outlineOffset='-2px'}}
function renderPreviews(){
 const p=samples.find(x=>x.id===scene),doc=docFor();
 for(const page of pages){
  page.replaceChildren();
  page.setAttribute('camera-preview',cameraMode);page.confirmPage(doc);
  for(const n of page.shadowRoot.querySelectorAll('[data-element-id]')){n.style.cursor=n.dataset.kind==='image'&&tab==='camera'?'grab':n.dataset.position==='overlay'?'move':'pointer';n.style.pointerEvents='auto'}
 }
 highlight();requestAnimationFrame(fit);
}
function renderLayers(){
 const root=$('layers');root.replaceChildren();
 function visit(items,depth){for(const x of items){
  const row=el('div','layer'+(selected===x.id?' active':'')+(visual(x).hidden?' dim':''));row.style.paddingLeft=(10+depth*15)+'px';row.dataset.layer=x.id;
  const eye=el('button','eye',visual(x).hidden?'○':'◉');eye.type='button';eye.title=(visual(x).hidden?'Mostrar ':'Ocultar ')+x.name;eye.setAttribute('aria-label',eye.title);eye.disabled=x.type==='interaction';eye.onclick=()=>commit(()=>{const a=locate(x.id).item;a.layout??={};a.layout[scope]??={};a.layout[scope].hidden=!visual(a).hidden});
  const name=el('button','name',symbols[x.type]+'  '+x.name);name.style.cssText='text-align:left;background:none;border:0;padding:2px';name.type='button';name.setAttribute('aria-pressed',String(selected===x.id));name.onclick=()=>select(x.id);
  row.append(eye,name,el('span','meta',names[x.type]));root.append(row);if(x.children)visit(x.children,depth+1)
 }}visit(state.template.elements,0);
 const f=locate(selected);$('rootLayer').setAttribute('aria-pressed',String(!selected));$('up').disabled=!f||!f.i;$('down').disabled=!f||f.i===f.list.length-1;$('deleteLayer').disabled=!f||f.item.type==='interaction';$('duplicateLayer').disabled=!f||f.item.type==='interaction';
}
function setTab(t){tab=t;document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===t)));renderInspector()}
function select(key,view){selected=key;if(view){scope=view;$('scope').value=view;boards.forEach(b=>b.classList.toggle('active',b.dataset.board===view))}if(tab==='camera'&&active()?.type!=='image')tab='design';renderLayers();renderInspector();highlight()}
const props=$('properties');
function field(parent,label,value,onChange,cfg={}){
 const l=el('label','field',label);let input;
 if(cfg.options){input=el('select');for(const x of cfg.options)input.append(Array.isArray(x)?opt(x[0],x[1]):opt(x));input.value=String(value??'')}
 else{input=el(cfg.multiline?'textarea':'input');if(!cfg.multiline)input.type=cfg.type??'text';if(input.type==='checkbox'){input.checked=!!value;input.style.width='auto'}else input.value=value??'';for(const k of ['min','max','step'])if(cfg[k]!==undefined)input[k]=cfg[k]}
 input.dataset.field=cfg.key??label;input.addEventListener('change',()=>{const v=input.type==='checkbox'?input.checked:input.type==='number'?Number(input.value):input.value;onChange(v)});l.append(input);parent.append(l);return input
}
const openGroups=new Map();
function group(parent,title,open=false){const d=el('details'),key=tab+'|'+(active()?.type??'root')+'|'+title;d.open=openGroups.get(key)??open;d.addEventListener('toggle',()=>{if(d.isConnected)openGroups.set(key,d.open)});d.append(el('summary','',title));parent.append(d);return d}
function vf(parent,label,key,cfg={}){
 const v=visual()[key];return field(parent,label,v,value=>{if(key.startsWith('cameraStart'))cameraMode='start';else if(key.startsWith('cameraEnd'))cameraMode='end';commit(()=>{const a=active();a.layout??={};a.layout[scope]??={};a.layout[scope][key]=value})},{...cfg,key})
}
const num=(min,max,step=1)=>({type:'number',min,max,step});
function pair(parent,a,b){const n=el('div','pair');parent.append(n);for(const [l,k,c] of [a,b])vf(n,l,k,c)}
function renderPanelSkin(parent,a,v){
 const panel=group(parent,'Marco y opciones · 9-slice',true);
 panel.append(el('p','muted','Las esquinas mantienen su tamaño; el centro y los bordes crecen con cada línea. Los resultados usan texto y SVG, no imágenes.'));
 const options=[['','Sin imagen · CSS'],...Object.entries(state.assets).filter(([,x])=>x.slice).map(([k,x])=>[k,x.alt||k])];
 for(const [key,label] of [['panelSkin','Fondo / marco del panel'],['optionNormal','Opción normal'],['optionHover','Opción hover / foco'],['optionSelected','Elección realizada']])vf(panel,label,key,{options});
 vf(panel,'Altura mínima de opción (px)','optionMinHeight',num(44,160));
 pair(panel,['Color texto','optionTextColor',{}],['Color hover','optionHoverTextColor',{}]);
 const cutting=group(panel,'Ajustar cortes de un recurso');
 const skins=Object.entries(state.assets).filter(([,x])=>x.slice);let assetId=skins.some(([k])=>k===v.panelSkin)?v.panelSkin:skins[0]?.[0];
 if(skins.length){const selector=el('select');for(const [k,x] of skins)selector.append(opt(k,x.alt||k));selector.value=assetId;cutting.append(selector);const box=el('div');cutting.append(box);
 const show=()=>{assetId=selector.value;box.replaceChildren();const im=el('img','asset-preview');im.src=state.assets[assetId].src;im.alt='Previsualización del recurso';box.append(im);for(const [k,label] of [['top','Arriba (%)'],['right','Derecha (%)'],['bottom','Abajo (%)'],['left','Izquierda (%)'],['width','Borde visual (px)']])field(box,label,state.assets[assetId].slice[k],value=>commit(()=>state.assets[assetId].slice[k]=value),{...num(1,k==='width'?48:49),key:'slice-'+k});};selector.onchange=show;show()}
 const symbols=group(parent,'Símbolos de habilidad');symbols.append(el('p','muted','El símbolo se muestra antes de elegir, junto al nombre de la habilidad. Las celdas se asignan por código; si no hay imagen se usa un dado SVG.'));
 const skillIds=[...new Set(['perception','athletics',...Object.keys(a.skillSymbols??{})])];
 const images=[['','Dado SVG'],...Object.entries(state.assets).filter(([,x])=>!x.slice).map(([k,x])=>[k,x.alt||k])];
 for(const k of skillIds)field(symbols,k,a.skillSymbols?.[k]??'',val=>commit(()=>{const item=active();item.skillSymbols??={};if(val)item.skillSymbols[k]=val;else delete item.skillSymbols[k]}),{options:images,key:'skill-symbol-'+k});
}
function renderInspector(){
 props.replaceChildren();const a=active();if(!a)return;
 const cameraTab=document.querySelector('[data-tab=camera]');cameraTab.hidden=a.type!=='image';if(cameraTab.hidden&&tab==='camera')tab='design';document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===tab)));
 props.append(el('h3','',selected?a.name:'Página / '+state.template.name));
 props.append(el('p','muted',scope==='base'?'Comunes · se heredan en ambas vistas':scope==='mobile'?'Excepciones · móvil':'Excepciones · escritorio'));
 if(tab==='instructions'){
  field(props,'Instrucciones generales',a.instructions??'',v=>commit(()=>active().instructions=v),{multiline:true,key:'instructions'});
  const more=group(props,'Indicaciones por dispositivo');for(const v of ['desktop','mobile'])field(more,v==='desktop'?'Escritorio':'Móvil',a.viewInstructions?.[v]??'',t=>commit(()=>{const x=active();x.viewInstructions??={};x.viewInstructions[v]=t}),{multiline:true,key:'prompt-'+v});
  props.append(el('p','muted','Indicaciones de autoría para la IA. Nunca se ejecutan en el juego.'));return
 }
 if(tab==='content'){
  field(props,'Nombre',a.name,v=>commit(()=>active().name=v),{key:'name'});
  if(!selected){props.append(el('p','muted','ID: '+a.id+' · revisión '+a.revision));return}
  props.append(el('p','muted','ID: '+a.id));
    field(props,'Tipo de contenido',a.contentType??'',v=>commit(()=>{if(v)active().contentType=v;else delete active().contentType}),{options:[['','Sin clasificar'],...Object.keys(contentTypes)],key:'contentType'});
    field(props,'Tags (separados por coma)',(a.tags??[]).join(', '),v=>commit(()=>{active().tags=v.split(',').map(x=>x.trim()).filter(Boolean)}),{key:'tags'});
  if(['image','text','slot'].includes(a.type)){
   field(props,'Código de vinculación',a.binding??'',v=>commit(()=>{const x=active();if(v.trim()){x.binding=v.trim();delete x.value}else delete x.binding}),{key:'binding'});
   if(a.type==='image'){
    const key=a.binding?state.previewBindings[a.binding]??docFor().content.bindings[a.binding]??'':a.value??'';
    field(props,a.binding?'Imagen de muestra (no cambia el módulo)':'Imagen fija',key,v=>commit(()=>{const x=active();if(x.binding){if(v)state.previewBindings[x.binding]=canonicalId(v);else delete state.previewBindings[x.binding]}else if(v)x.value=canonicalId(v);else delete x.value}),{options:[['','Automática / vacía'],...Object.keys({...renderAssets,...state.assets}).sort((a,b)=>a.localeCompare(b)).filter(k=>!a.contentType||!contentTypes[a.contentType]||k.startsWith(contentTypes[a.contentType]+'/')||k===key).map(k=>[k,k.includes('/')?k:(state.assets[k].alt||k)])],key:'asset'});
    if(({...renderAssets,...state.assets})[key]){const im=el('img','asset-preview');im.src=({...renderAssets,...state.assets})[key].src;im.alt=({...renderAssets,...state.assets})[key].alt;props.append(im)}
   }
   if(a.type==='text'){const raw=a.binding?state.previewBindings[a.binding]??docFor().content.bindings[a.binding]??'':a.value??'';field(props,a.binding?'Texto de muestra':'Texto fijo',Array.isArray(raw)?raw.join('\n\n'):raw,v=>commit(()=>{const x=active();if(x.binding){if(v)state.previewBindings[x.binding]=v;else delete state.previewBindings[x.binding]}else x.value=v}),{multiline:true,key:'text'});field(props,'Tipo de texto',a.role??'paragraph',v=>commit(()=>active().role=v),{options:[['heading','Título'],['paragraph','Párrafo'],['label','Etiqueta']],key:'role'})}
   if(a.type==='slot')field(props,'Código de ranura',a.slotName,v=>commit(()=>active().slotName=v),{key:'slot'});
   if(a.type!=='slot'){
    const adv=group(props,'Condición de visibilidad');field(adv,'Código',a.when?.binding??'',v=>commit(()=>{if(v.trim())active().when={binding:v.trim(),present:active().when?.present??true};else delete active().when}),{key:'condition'});
    if(a.when)field(adv,'Mostrar cuando el código',a.when.present?'present':'absent',v=>commit(()=>active().when.present=v==='present'),{options:[['present','Existe'],['absent','No existe']],key:'when'});
   }
  }else props.append(el('p','muted',a.type==='interaction'?'El módulo define las opciones. Aquí se diseña su presentación.':'Agrupa capas con un encuadre propio.'));
  return
 }
 if(tab==='camera'){
  props.append(el('p','muted','Movimiento de entrada: encuadre inicial → final. Elegí un encuadre, arrastrá la imagen en el lienzo para centrar el motivo y ajustá el zoom. El marco no se mueve.'));
  vf(props,'Animar cámara','cameraEnabled',{type:'checkbox'});
  if(visual().cameraEnabled){
    const mode=el('div','seg');for(const [m,label] of [['start','Inicio'],['end','Final'],['play','▶ Reproducir']]){const b=el('button','',label);b.setAttribute('aria-pressed',String(cameraMode===m));b.onclick=()=>{cameraMode=m==='play'?'end':m;for(const p of pages)p.previewCamera(m);renderInspector()};mode.append(b)}props.append(mode);
    for(const [name,prefix] of [['Encuadre inicial','cameraStart'],['Encuadre final','cameraEnd']]){
     const g=group(props,name,true);pair(g,['Centro X (%)',prefix+'X',num(0,100)],['Centro Y (%)',prefix+'Y',num(0,100)]);vf(g,'Zoom',prefix+'Zoom',num(1,5,.05))
    }
    vf(props,'Duración (segundos)','cameraDuration',num(.1,30,.1));vf(props,'Curva','cameraEasing',{options:[['linear','Lineal'],['ease-in','Acelerar'],['ease-out','Desacelerar'],['ease-in-out','Suave']]});
    const reset=el('button','','Restablecer paneo / zoom');reset.onclick=()=>commit(()=>{const x=active();x.layout??={};x.layout[scope]??={};for(const k of Object.keys(defaults).filter(k=>k.startsWith('camera')))x.layout[scope][k]=defaults[k];x.layout[scope].cameraEnabled=true});props.append(reset)
  }return
 }
 const type=a.type,v=visual(),root=!selected;
 if(type==='interaction')renderPanelSkin(props,a,v);
 if(!root&&type!=='interaction'&&locate(selected)?.parent)vf(props,'Colocación','position',{options:[['flow','En flujo'],['overlay','Capa libre']]});
 if(!root&&v.position==='overlay'){pair(props,['X (%)','x',num(-100,200)],['Y (%)','y',num(-100,200)]);pair(props,['Ancho (%)','width',num(1,100)],['Alto (%)','height',num(1,200)]);vf(props,'Profundidad','z',num(-100,100))}
 else if(!root)vf(props,'Ancho (%)','width',num(1,100));
 if(type==='group'||type==='image')vf(props,'Proporción ancho / alto','ratio',num(.1,10,.05));
 if(type==='image'){vf(props,'Encuadre','fit',{options:[['contain','Encajar'],['cover','Rellenar'],['fill','Estirar']]});pair(props,['Encuadre X','objectX',num(0,100)],['Encuadre Y','objectY',num(0,100)])}
 if(root||['group','interaction'].includes(type)){pair(props,['Margen interior','padding',num(0,80)],['Separación','gap',num(0,80)]);vf(props,'Fondo (hex o transparent)','background');if(type==='interaction')vf(props,'Borde (hex)','borderColor')}
 if(root||['text','interaction'].includes(type)){pair(props,['Tamaño texto','fontSize',num(10,96)],['Color (hex)','color',{}]);vf(props,'Alineación','align',{options:[['left','Izquierda'],['center','Centro'],['right','Derecha']]})}
 const adv=group(props,'Transformación y apariencia');pair(adv,['Opacidad','opacity',num(0,1,.05)],['Escala','scale',num(.05,5,.05)]);vf(adv,'Rotación','rotation',num(-180,180));vf(adv,'Radio de esquinas','radius',num(0,60));if(['group','interaction'].includes(type)){vf(adv,'Desbordamiento','overflow',{options:['visible','clip']});vf(adv,'Distribución','direction',{options:[['column','Vertical'],['row','Horizontal']]})}
 if(type==='image'){const g=group(props,'Transiciones');vf(g,'Transición entre recursos','transition',{options:[['none','Sin transición'],['fade','Fundido']]});vf(g,'Duración (ms)','duration',num(0,3000,50))}
 if(scope!=='base'){const b=el('button','','Restaurar valores comunes');b.onclick=()=>commit(()=>{if(active().layout)delete active().layout[scope]});props.append(b)}
}
function render(refresh=true){renderPreviews();renderLayers();if(refresh)renderInspector();$('undo').disabled=!past.length;$('redo').disabled=!future.length}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
$('scope').onchange=()=>{scope=$('scope').value;renderLayers();renderInspector()};
$('rootLayer').onclick=()=>select(null);
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const v=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));boards.forEach(x=>x.hidden=v!=='both'&&x.dataset.board!==v);if(v!=='both'){scope=v;$('scope').value=v;renderInspector()}requestAnimationFrame(fit)});
document.querySelectorAll('[data-edit-view]').forEach(b=>b.onclick=()=>select(selected,b.dataset.editView));
for(const p of samples)$('scene').append(opt(p.id,p.label));$('scene').value=scene;
$('scene').onchange=()=>{scene=$('scene').value;try{validate();renderPreviews()}catch(e){status(e.message,true)}};
$('samples').onchange=()=>{try{validate();renderPreviews()}catch(e){$('samples').checked=false;status(e.message,true)}};
document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{
 const type=b.dataset.add,k=id(),parent=locate(selected)?.item;
 if(commit(()=>{const nest=parent&&['group','interaction'].includes(parent.type),list=nest?(parent.children??=[]):state.template.elements;
 const layer={id:k,type,name:names[type]+' nueva',instructions:'',layout:{base:{position:nest&&type==='image'?'overlay':'flow',width:nest&&type==='image'?30:100}}};
 if(type==='image'){layer.value='BKG/snow_forest';if(nest)Object.assign(layer.layout.base,{x:20,y:20,height:40,z:6})}
 if(type==='text'){layer.value='Texto nuevo';layer.role='paragraph'}
 if(type==='group'){layer.children=[];layer.layout.base.ratio=1.5}
 if(type==='slot')layer.slotName='mechanics';list.push(layer)
 }))select(k)
});
function move(d){commit(()=>{const f=locate(selected);if(!f)return;const j=f.i+d;if(j<0||j>=f.list.length)return;const other=f.list[j];[f.list[f.i],f.list[j]]=[other,f.item];if(visual(f.item).position==='overlay'&&visual(other).position==='overlay'){const za=visual(f.item).z,zb=visual(other).z;for(const [a,z] of [[f.item,zb],[other,za]]){a.layout??={};a.layout[scope]??={};a.layout[scope].z=z}}})}
$('up').onclick=()=>move(-1);$('down').onclick=()=>move(1);
$('duplicateLayer').onclick=()=>{let k;if(commit(()=>{const f=locate(selected),d=copy(f.item);function renew(x){x.id=id();for(const c of x.children??[])renew(c)}renew(d);d.name+=' copia';k=d.id;f.list.splice(f.i+1,0,d)}))select(k)};
$('deleteLayer').onclick=()=>{const f=locate(selected);if(!f||f.item.type==='interaction')return;if(commit(()=>f.list.splice(f.i,1)))select(f.parent?.id??null)};
$('undo').onclick=undo;$('redo').onclick=redo;
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select')||e.target.isContentEditable)return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)redo();else undo()}});
for(const page of pages){
 const root=page.shadowRoot;
 root.addEventListener('click',e=>{if(e.target.closest('button[data-choice-id]')){e.preventDefault();e.stopImmediatePropagation()}},true);
 root.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;const n=e.target.closest('[data-element-id]');if(!n)return;const key=n.dataset.elementId,view=page.getAttribute('preview-view');select(key,view);
  const s=visual(active(),view),isCamera=tab==='camera'&&n.dataset.kind==='image'&&s.cameraEnabled;
  if((!isCamera&&n.dataset.position!=='overlay')||e.target.closest('button'))return;e.preventDefault();
  const prefix=cameraMode==='end'?'cameraEnd':'cameraStart',parent=isCamera?n.getBoundingClientRect():n.parentElement.getBoundingClientRect(),im=isCamera?n.querySelector('img'):null;
  if(isCamera&&(!im?.naturalWidth||!parent.width||!parent.height))return;
  if(isCamera)page.previewCamera(cameraMode);
  const pose=isCamera?{x:s[prefix+'X'],y:s[prefix+'Y'],zoom:s[prefix+'Zoom']}:{x:s.x,y:s.y};
  drag={page,n,key,view,startX:e.clientX,startY:e.clientY,parent,x:pose.x,y:pose.y,lastX:pose.x,lastY:pose.y,pointer:e.pointerId,isCamera,prefix,zoom:pose.zoom,im};n.setPointerCapture(e.pointerId)
 });
 root.addEventListener('pointermove',e=>{if(!drag||drag.page!==page||drag.pointer!==e.pointerId)return;const d=drag;
  if(d.isCamera){const ratio=d.im.naturalWidth/d.im.naturalHeight,target=d.n.clientWidth/d.n.clientHeight,old=cropRect(ratio,target,{x:d.x/100,y:d.y/100,zoom:d.zoom});d.lastX=Math.max(0,Math.min(100,Math.round(d.x-100*old.width*(e.clientX-d.startX)/d.parent.width)));d.lastY=Math.max(0,Math.min(100,Math.round(d.y-100*old.height*(e.clientY-d.startY)/d.parent.height)));const c=cropRect(ratio,target,{x:d.lastX/100,y:d.lastY/100,zoom:d.zoom});Object.assign(d.im.style,{width:100/c.width+'%',height:100/c.height+'%',left:-100*c.x/c.width+'%',top:-100*c.y/c.height+'%',objectFit:'fill'})}
  else{d.lastX=Math.max(-100,Math.min(200,Math.round(d.x+100*(e.clientX-d.startX)/d.parent.width)));d.lastY=Math.max(-100,Math.min(200,Math.round(d.y+100*(e.clientY-d.startY)/d.parent.height)));d.n.style.left=d.lastX+'%';d.n.style.top=d.lastY+'%'}});
 root.addEventListener('pointerup',e=>{if(!drag||drag.page!==page||drag.pointer!==e.pointerId)return;const d=drag;drag=null;if(d.lastX===d.x&&d.lastY===d.y)return;commit(()=>{const x=locate(d.key).item;x.layout??={};x.layout[d.view]??={};Object.assign(x.layout[d.view],d.isCamera?{[d.prefix+'X']:d.lastX,[d.prefix+'Y']:d.lastY}:{x:d.lastX,y:d.lastY})})});
 root.addEventListener('pointercancel',()=>{if(drag?.page===page){drag=null;renderPreviews()}});
}
function refreshLibrary(){
 const design=$('design');design.replaceChildren(opt('builtin','Plantilla de referencia'),...library.designs.map(d=>opt(d.id,d.name)));design.value=current;
 const list=current==='builtin'?[{revision:1}]:library.designs.find(d=>d.id===current)?.versions??[];
 $('revision').replaceChildren(...list.slice().reverse().map(v=>opt(v.revision,'v'+v.revision)));$('revision').value=String(revision)
}
function canLeave(){return !saving&&(!dirty||confirm('Hay cambios sin guardar. ¿Descartarlos?'))}
function openDesign(key,rev=null){
 const d=library.designs.find(x=>x.id===key),v=d?.versions.find(x=>x.revision===rev)??d?.versions.at(-1);
 state=v?copy(v.data):initial();state.assets={...renderAssets,...state.assets};current=d?d.id:'builtin';revision=v?.revision??1;selected=null;past=[];future=[];dirty=false;tab='design';refreshLibrary();render();status('Biblioteca local · versión '+revision)
}
$('design').onchange=()=>{const k=$('design').value;if(canLeave())openDesign(k);else refreshLibrary()};
$('revision').onchange=()=>{const v=Number($('revision').value);if(canLeave())openDesign(current,v);else refreshLibrary()};
async function persist(name=null,duplicate=false){
 if(saving)return;saving=true;$('save').disabled=true;
 try{
  validate();const next=copy(library);let d=next.designs.find(x=>x.id===current);
  if(!d||duplicate){const key='design-'+crypto.randomUUID().slice(0,8);d={id:key,name:name||state.template.name,versions:[]};next.designs.push(d)}
  const nextRev=(d.versions.at(-1)?.revision??0)+1,data=copy(state);data.template.id=d.id;data.template.name=name||data.template.name;data.template.revision=nextRev;
  d.name=data.template.name;d.versions.push({revision:nextRev,time:Date.now(),data});
  await writeLocal(storageKey,next);
  library=next;state=copy(data);current=d.id;revision=nextRev;dirty=false;past=[];future=[];refreshLibrary();render();status('Guardada v'+nextRev+' · solo en este navegador')
 }catch(e){status('No se guardó: '+e.message,true)}finally{saving=false;$('save').disabled=false}
}
function nameDialog(action){const dialog=$('nameDialog');$('nameTitle').textContent=action==='new'?'Nuevo diseño':'Duplicar diseño';$('designName').value=action==='new'?'':'Copia de '+state.template.name;dialog.showModal();dialog.onclose=()=>{if(dialog.returnValue!=='ok')return;const name=$('designName').value.trim();if(!name)return;if(action==='new'){if(!canLeave())return;state=initial();state.template.name=name;selected=null}persist(name,true)}}
$('newDesign').onclick=()=>nameDialog('new');$('duplicateDesign').onclick=()=>nameDialog('duplicate');$('save').onclick=()=>persist();
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
try{const saved=await readLocal(storageKey);if(saved&&Array.isArray(saved.designs))library=saved}catch(e){status('No se pudo abrir la biblioteca local',true)}
refreshLibrary();render();
