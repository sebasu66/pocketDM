import {validAssetId,contentTypes} from '../../../dm/arte/asset-catalog.mjs';
import {validateCheck} from '../../check-contract.mjs';
// Presentation-only contract. Author instructions are inert data, never evaluated.
const record=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const own=(o,k)=>Object.hasOwn(o,k);
const fail=(ok,msg)=>{if(!ok)throw new TypeError(msg)};
const identifier=v=>typeof v==='string'&&/^[A-Za-z][A-Za-z0-9_.-]{0,95}$/.test(v)&&!v.split('.').some(x=>['__proto__','prototype','constructor'].includes(x));
const assetId=v=>identifier(v)||validAssetId(v);
const text=(v,n=16000)=>typeof v==='string'&&v.length<=n;
const num=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const keys=(o,allowed)=>record(o)&&Object.keys(o).every(k=>allowed.includes(k));
const clone=v=>structuredClone(v);
const types=['group','image','text','interaction','slot'];
const positions=['flow','overlay'];
const fields=['position','x','y','width','height','ratio','z','opacity','rotation','scale','align','fit','objectX','objectY','gap','padding','fontSize','color','background','borderColor','radius','duration','transition','hidden','overflow','direction','cameraEnabled','cameraStartX','cameraStartY','cameraStartZoom','cameraEndX','cameraEndY','cameraEndZoom','cameraDuration','cameraEasing','panelSkin','optionNormal','optionHover','optionSelected','optionTextColor','optionHoverTextColor','optionMinHeight'];
const colors=v=>typeof v==='string'&&(/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(v)||v==='transparent');
export function validateVisual(v={}){
 fail(keys(v,fields),'Propiedad visual no admitida');
 for(const [k,x] of Object.entries(v)){
  const limits={x:[-100,200],y:[-100,200],width:[1,100],height:[1,200],z:[-100,100],opacity:[0,1],rotation:[-180,180],scale:[.05,5],ratio:[.1,10],objectX:[0,100],objectY:[0,100],gap:[0,80],padding:[0,80],fontSize:[10,96],radius:[0,60],duration:[0,3000],cameraStartX:[0,100],cameraStartY:[0,100],cameraEndX:[0,100],cameraEndY:[0,100],cameraStartZoom:[1,5],cameraEndZoom:[1,5],cameraDuration:[.1,30],optionMinHeight:[44,160]};
  const options={position:positions,align:['left','center','right'],fit:['contain','cover','fill'],transition:['none','fade'],overflow:['visible','clip'],direction:['column','row'],cameraEasing:['linear','ease-in','ease-out','ease-in-out']};
  fail(limits[k]?num(x,...limits[k]):options[k]?options[k].includes(x):['panelSkin','optionNormal','optionHover','optionSelected'].includes(k)?x===''||assetId(x):['hidden','cameraEnabled'].includes(k)?typeof x==='boolean':colors(x),'Valor visual inválido: '+k);
 }
 return clone(v);
}
const layout=v=>{fail(keys(v,['base','desktop','mobile','fold']),'Layout inválido');return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,validateVisual(x)]))};
function assetPath(v){return typeof v==='string'&&/^\/(?:libro|docs\/art-references|dm\/libro\/editorial\/assets|atlas\/assets)\/[A-Za-z0-9_./-]+\.(?:png|webp|jpe?g|svg|avif|gif)$/i.test(v)&&!v.split('/').some(x=>x==='..'||x==='.')&&!v.includes('//')}
export function validateAssets(assets){
 fail(record(assets)&&Object.keys(assets).length<=2000,'Catálogo inválido');
 for(const [id,a] of Object.entries(assets)){fail(assetId(id)&&keys(a,['src','alt','cell','slice'])&&assetPath(a.src)&&text(a.alt,300),'Recurso inválido: '+id);if(a.cell){const c=a.cell;fail(!a.slice&&keys(c,['columns','rows','column','row'])&&[c.columns,c.rows,c.column,c.row].every(Number.isInteger)&&c.columns>=1&&c.columns<=32&&c.rows>=1&&c.rows<=32&&c.column>=0&&c.column<c.columns&&c.row>=0&&c.row<c.rows,'Celda de símbolo inválida: '+id)}if(a.slice){const c=a.slice;fail(keys(c,['top','right','bottom','left','width'])&&['top','right','bottom','left'].every(k=>num(c[k],1,49))&&num(c.width,1,48),'Cortes 9-slice inválidos: '+id)}}
 return clone(assets);
}
export function validateTemplate(t){
 fail(keys(t,['schemaVersion','id','revision','name','instructions','viewInstructions','layout','elements'])&&t.schemaVersion===1&&identifier(t.id)&&Number.isInteger(t.revision)&&t.revision>0&&text(t.name,200)&&text(t.instructions)&&Array.isArray(t.elements)&&t.elements.length>0,'Plantilla inválida');
 if(t.viewInstructions!==undefined)fail(keys(t.viewInstructions,['desktop','mobile','fold'])&&Object.values(t.viewInstructions).every(x=>text(x)),'Instrucciones de vista inválidas');
 if(t.layout)layout(t.layout);
 const ids=new Set();let panels=0,total=0;
 function visit(list,depth=0,parent=null){
  fail(depth<=8&&Array.isArray(list),'Jerarquía inválida');
  for(const e of list){
   fail(++total<=150&&keys(e,['id','type','name','instructions','viewInstructions','binding','value','fallback','when','layout','children','role','slotName','skillSymbols','contentType','tags','placeholder'])&&identifier(e.id)&&!ids.has(e.id)&&types.includes(e.type)&&text(e.name,200)&&text(e.instructions??''),'Elemento inválido o repetido');
   ids.add(e.id);
   if(e.viewInstructions!==undefined)fail(keys(e.viewInstructions,['desktop','mobile','fold'])&&Object.values(e.viewInstructions).every(x=>text(x)),'Instrucciones de vista inválidas');
   if(e.placeholder!==undefined)fail(e.type==='image'&&['auto','landscape','square','portrait','figure','logo','ornament'].includes(e.placeholder),'Placeholder inválido');
   if(e.contentType!==undefined)fail(Object.hasOwn(contentTypes,e.contentType),'Tipo semántico inválido');
   if(e.tags!==undefined)fail(Array.isArray(e.tags)&&e.tags.length<=32&&e.tags.every(x=>identifier(x)),'Etiquetas inválidas');
   if(e.binding!==undefined)fail(identifier(e.binding),'Binding inválido');
   if(e.when!==undefined)fail(keys(e.when,['binding','present'])&&identifier(e.when.binding)&&typeof e.when.present==='boolean','Condición inválida');
   if(e.layout)layout(e.layout);
   if(e.skillSymbols!==undefined)fail(e.type==='interaction'&&record(e.skillSymbols)&&Object.entries(e.skillSymbols).length<=150&&Object.entries(e.skillSymbols).every(([k,v])=>identifier(k)&&assetId(v)),'Mapa de símbolos inválido');
   if(e.type==='interaction'){panels++;fail(parent===null,'El panel obligatorio debe pertenecer al flujo raíz');fail(!e.binding&&!own(e,'value')&&!own(e,'fallback')&&!e.when,'El panel recibe solo interacción autorizada');}
   if(e.type==='slot')fail(identifier(e.slotName),'Slot inválido');
   if(e.type==='text'){fail(['heading','paragraph','label'].includes(e.role??'paragraph'),'Rol de texto inválido');for(const v of [e.value,e.fallback])if(v!==undefined)fail(text(v)||Array.isArray(v)&&v.length<=100&&v.every(x=>text(x)),'Texto inválido')}
   if(e.type==='image')for(const v of [e.value,e.fallback])if(v!==undefined)fail(assetId(v),'Imagen inválida');
   if(e.children!==undefined){fail(['group','interaction'].includes(e.type),'Solo los contenedores admiten hijos');visit(e.children,depth+1,e)}
   if(parent===null)fail(Object.values(e.layout??{}).every(v=>v.position!=='overlay'),'Una capa libre requiere contenedor');
  }
 }
 visit(t.elements);
 fail(panels===1,'La plantilla debe tener exactamente un panel de interacción');
 return clone(t);
}
export function validateComposition(c,t){
 fail(keys(c,['schemaVersion','id','templateId','templateRevision','overrides','assets','optionSkins'])&&c.schemaVersion===1&&identifier(c.id)&&c.templateId===t.id&&c.templateRevision===t.revision&&record(c.overrides??{})&&record(c.assets??{}),'Composición inválida o revisión incompatible');
 const elements=new Map();function walk(xs){for(const x of xs){elements.set(x.id,x);if(x.children)walk(x.children)}}walk(t.elements);
 for(const [id,v] of Object.entries(c.overrides??{})){fail(elements.has(id),'Elemento de composición desconocido: '+id);layout(v)}
 for(const [id,v] of Object.entries(c.assets??{}))fail(elements.get(id)?.type==='image'&&assetId(v),'Override de recurso inválido');
 if(c.optionSkins!==undefined){fail(record(c.optionSkins)&&Object.keys(c.optionSkins).length<=200,'Apariencia de opciones inválida');for(const [id,skin] of Object.entries(c.optionSkins))fail(identifier(id)&&keys(skin,['normal','hover','selected'])&&Object.values(skin).every(assetId),'Apariencia de opción inválida')}
 return clone(c);
}
export function validateContent(c){
 fail(keys(c,['pageId','bindings','interaction'])&&identifier(c.pageId)&&record(c.bindings)&&Object.keys(c.bindings).length<=200,'Contenido de página inválido');
 for(const [k,v] of Object.entries(c.bindings))fail(identifier(k)&&(v===null||typeof v==='boolean'||num(v,-1e9,1e9)||text(v)||Array.isArray(v)&&v.length<=100&&v.every(x=>text(x))),'Binding inválido: '+k);
 const a=c.interaction;
 fail(keys(a,['title','subtitle','text','options','terminal','status','history'])&&text(a.title??'',300)&&text(a.subtitle??'',300)&&text(a.text??'')&&text(a.status??'',1000)&&typeof a.terminal==='boolean'&&Array.isArray(a.options)&&a.options.length<=40,'Interacción inválida');
 fail(a.options.length>0||a.terminal,'Una página activa requiere opciones');
 const ids=new Set();for(const o of a.options){fail(keys(o,['id','label','disabled','symbol','skill'])&&identifier(o.id)&&text(o.label,500)&&o.label.trim().length>0&&!ids.has(o.id)&&(o.disabled===undefined||typeof o.disabled==='boolean')&&(o.symbol===undefined||assetId(o.symbol)),'Opción inválida');ids.add(o.id);if(o.skill!==undefined)fail(keys(o.skill,['id','label'])&&identifier(o.skill.id)&&text(o.skill.label,200)&&o.skill.label.trim().length>0,'Habilidad de opción inválida')}
 if(a.history!==undefined){
  fail(Array.isArray(a.history)&&a.history.length<=200,'Historial inválido');const entries=new Set(),checks=new Set();
  for(const h of a.history){fail(keys(h,['id','kind','text','speaker','choiceId','check','title'])&&identifier(h.id)&&!entries.has(h.id)&&['speech','choice','narration','check','attack'].includes(h.kind)&&text(h.text??'')&&text(h.speaker??'',300)&&text(h.title??'',300),'Entrada de historial inválida');entries.add(h.id);
   if(h.kind==='choice')fail(identifier(h.choiceId)&&text(h.text,500),'Elección histórica inválida');else fail(h.choiceId===undefined,'ID de elección fuera del historial de elecciones');
   if(h.kind==='check'){fail(keys(h.check,['schemaVersion','id','actorId','actorName','skillId','skillName','base','target','difficulty','reason','dice','roll','outcome','visibility','source','role','formula','action','consequence']),'Campos de chequeo no admitidos');validateCheck(h.check);fail(!checks.has(h.check.id)&&Object.values(h.check).every(x=>typeof x==='number'||typeof x==='string'),'Chequeo repetido o no escalar');checks.add(h.check.id)}else fail(h.check===undefined,'Chequeo fuera de su tipo');
   if(h.kind==='attack')fail(text(h.title,300)&&h.title.trim().length>0,'Ataque sin resultado confirmado');
  }
 }
 return clone(c);
}
const present=v=>v!==undefined&&v!==null&&v!==''&&v!==false&&(!Array.isArray(v)||v.length>0);
export function resolvePage({template,composition,content,assets},view){
 fail(['mobile','desktop','fold'].includes(view),'Vista inválida');
 const t=validateTemplate(template),c=validateComposition(composition,t),p=validateContent(content),a=validateAssets(assets);
 const binding=k=>own(p.bindings,k)?p.bindings[k]:undefined;
 const visual=(l={},o={})=>({...l.base,...(view==='fold'?l.desktop:{}),...l[view],...o.base,...(view==='fold'?o.desktop:{}),...o[view]});
 function resolve(e,depth=0){
  const style=visual(e.layout,c.overrides?.[e.id]);
  const skinKeys=['panelSkin','optionNormal','optionHover','optionSelected'];for(const k of skinKeys)if(style[k])fail(e.type==='interaction'&&own(a,style[k])&&a[style[k]].slice,'Recurso 9-slice no catalogado: '+style[k]);
  const skin=e.type==='interaction'?Object.fromEntries(skinKeys.filter(k=>style[k]).map(k=>[k,a[style[k]]])):null;
  if(e.skillSymbols)for(const id of Object.values(e.skillSymbols))fail(own(a,id),'Símbolo de habilidad no catalogado: '+id);
  if(t.elements.includes(e))fail(style.position!=='overlay','Una capa libre requiere contenedor');
  if(e.type==='interaction'){fail(!style.hidden&&style.position!=='overlay'&&style.opacity!==0,'El panel de interacción debe ser visible y estar en flujo')}
  if(style.hidden||e.when&&present(binding(e.when.binding))!==e.when.present)return null;
  const bound=e.binding?binding(e.binding):e.value;
  let value=present(bound)?bound:e.fallback;
  if(e.type==='image'){
   const id=c.assets?.[e.id]??value;
   if(!present(id))return null;
   fail(typeof id==='string'&&own(a,id),'Recurso no catalogado: '+id);
   value={id,...a[id]};
  }
  if(e.type==='text'){if(!present(value))return null;fail(typeof value==='string'||typeof value==='number'||Array.isArray(value)&&value.every(x=>typeof x==='string'),'Tipo de texto inválido');}
  const children=(e.children??[]).map(x=>resolve(x,depth+1)).filter(Boolean);
  if(e.type==='group'&&!children.length)return null;
  if(e.type==='slot'&&e.binding&&!present(bound))return null;
  return {id:e.id,type:e.type,role:e.role,slotName:e.slotName,style,value,children,...(skin?{skin,skillSymbols:e.skillSymbols??{}}:{})};
 }
 const rootStyle=visual(t.layout);fail(rootStyle.position!=='overlay'&&!rootStyle.hidden&&rootStyle.opacity!==0,'La página raíz debe estar visible y en flujo');
 const nodes=t.elements.map(resolve).filter(Boolean);
 const count=xs=>xs.reduce((n,x)=>n+(x.type==='interaction'?1:0)+count(x.children),0);
 fail(count(nodes)===1,'La composición oculta el panel obligatorio');
 for(const o of p.interaction.options)if(o.symbol)fail(own(a,o.symbol),'Símbolo no catalogado');
 const panel=nodes.find(n=>n.type==='interaction');
 const optionSkins=c.optionSkins??{};
 const allowedIds=new Set([...p.interaction.options.map(o=>o.id),...(p.interaction.history??[]).filter(h=>h.kind==='choice').map(h=>h.choiceId)]);
 for(const [id,skin] of Object.entries(optionSkins)){fail(allowedIds.has(id),'Apariencia de opción no autorizada: '+id);for(const aid of Object.values(skin))fail(own(a,aid)&&a[aid].slice,'Recurso de opción no catalogado')}
 const resolveSkin=id=>Object.fromEntries(Object.entries(optionSkins[id]??{}).map(([k,v])=>[k,a[v]]));
 const interaction={...p.interaction,history:(p.interaction.history??[]).map(h=>({...h,...(h.kind==='choice'?{skin:resolveSkin(h.choiceId)}:{})})),options:p.interaction.options.map(o=>{const aid=o.symbol??(o.skill?panel.skillSymbols[o.skill.id]:undefined);return {...o,skin:resolveSkin(o.id),...(aid?{image:a[aid]}:{})}})};
 return {pageId:p.pageId,style:rootStyle,nodes,interaction};
}
