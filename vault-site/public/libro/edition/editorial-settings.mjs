// Serializable presentation contract. No campaign content or executable CSS in settings.
const field=(group,label,type,value,extra={})=>Object.freeze({group,label,type,default:value,...extra});
const num=(g,l,d,min,max,step=1)=>field(g,l,'number',d,{min,max,step});
const choice=(g,l,d,options)=>field(g,l,'select',d,{options});
const color=(g,l,d)=>field(g,l,'color',d);
export const baseFields=Object.freeze({
 ratio:choice('Composición','Proporción','21/9',['21/9','19.5/9','16/10','16/9','4/3','3/4','9/16','9/19.5']),
 orientation:choice('Composición','Distribución','horizontal',['horizontal','vertical']),
 side:choice('Composición','Posición de imagen','left',['left','right','top','bottom']),
 width:num('Ilustración','Tamaño de imagen',40,26,80),
 pos:num('Ilustración','Encuadre horizontal',50,0,100),
 mask:choice('Contorno','Máscara','rasgado',['rasgado','arco','rombo','none']),
 burnSide:choice('Contorno','Aplicar sobre','paper',['paper','image']),
 blend:choice('Contorno','Mezcla','multiply',['multiply','overlay','soft-light','normal']),
 burn:num('Contorno','Intensidad',90,0,100),thick:num('Contorno','Grosor',4,1,10,.5),
 paper:color('Papel','Color de papel','#132e51'),texture:num('Papel','Textura',98,0,100),
 titleFont:choice('Título','Tipografía',"'Germania One',Georgia,serif",['Georgia,serif','Palatino Linotype,Palatino,Book Antiqua,serif','Times New Roman,serif','Impact,Haettenschweiler,sans-serif','Arial,sans-serif',"'Almendra SC',Georgia,serif","'Germania One',Georgia,serif","'MedievalSharp',Georgia,serif"]),
 titleSize:num('Título','Tamaño',61,22,64),titleInk:color('Título','Color','#da3107'),
 titlePlacement:choice('Título','Posición','paper',['paper','art','full']),
 titleAlign:choice('Título','Alineación','left',['left','center','right']),
 shadowColor:color('Título','Sombra','#000000'),shadowBlur:num('Título','Difuminado',10,0,30),shadowOpacity:num('Título','Opacidad de sombra',85,0,100),shadowOffset:num('Título','Desplazamiento vertical',3,-8,12),
 strokeColor:color('Título','Contorno','#181821'),strokeWidth:num('Título','Grosor de contorno',1,0,5,.25),
 ruleColor:color('Separador','Color','#fff3df'),ruleWidth:num('Separador','Ancho',260,120,520,10),ruleGap:num('Separador','Separación',10,0,28),ruleOpacity:num('Separador','Opacidad',95,0,100),
 bodyFont:choice('Texto','Tipografía','Palatino Linotype,Palatino,Book Antiqua,serif',['Georgia,serif','Palatino Linotype,Palatino,Book Antiqua,serif','Times New Roman,serif','Arial,sans-serif','system-ui,sans-serif',"'Almendra SC',Georgia,serif","'Germania One',Georgia,serif","'MedievalSharp',Georgia,serif"]),
 ink:color('Texto','Color','#fff8ed'),fs:num('Texto','Tamaño',16,15,26),columns:choice('Texto','Columnas','auto',['auto','one','two']),columnGap:num('Texto','Separación de columnas',24,12,48),bodyAlign:choice('Texto','Alineación','justify',['justify','left','center','right']),
 indent:num('Texto','Sangría',2.4,0,3,.1),tabs:num('Texto','Tabulación',4,2,8),capital:field('Texto','Capitular','boolean',true),capitalSize:num('Texto','Altura de capitular',2,2,4),lineHeight:num('Texto','Interlineado',1.6,1.2,1.9,.05),paragraphGap:num('Texto','Separación de párrafos',.9,0,1.5,.1),edgeGap:num('Texto','Margen al borde',27,4,30),printBlend:choice('Tinta','Mezcla','auto',['auto','normal','multiply','screen','soft-light']),printOpacity:num('Tinta','Opacidad',96,65,100),
 cameraEnabled:field('Cámara','Animación','boolean',false),cameraStartX:num('Cámara','Centro inicial X',50,0,100),cameraStartY:num('Cámara','Centro inicial Y',50,0,100),cameraEndX:num('Cámara','Centro final X',50,0,100),cameraEndY:num('Cámara','Centro final Y',50,0,100),cameraStartZoom:num('Cámara','Zoom inicial',1,1,3,.05),cameraEndZoom:num('Cámara','Zoom final',1.25,1,3,.05),cameraDuration:num('Cámara','Duración (s)',4,.2,15,.1)
});
export const defaultResponsive=Object.freeze({mobile:Object.freeze({ratio:'9/19.5',orientation:'vertical',side:'top',width:40,columns:'one',titleSize:32,fs:17})});
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const copy=x=>structuredClone(x);
export function normalizeValues(values,fields=baseFields){
 if(!record(values))throw new TypeError('Los ajustes deben ser un objeto');
 const out={};
 for(const [key,value] of Object.entries(values)){
  if(!Object.hasOwn(fields,key))throw new TypeError('Propiedad desconocida: '+key);
  const f=fields[key];let v=value;
  if(f.type==='number'){if(typeof v!=='number'&&!(typeof v==='string'&&v.trim()))throw new TypeError(key);v=Number(v);if(!Number.isFinite(v)||v<f.min||v>f.max)throw new RangeError(key);}
  else if(f.type==='boolean'){if(typeof v!=='boolean')throw new TypeError(key);}
  else if(f.type==='color'){if(typeof v!=='string'||!/^#[0-9a-f]{6}$/i.test(v))throw new TypeError(key);}
  else if(f.type==='select'){if(!f.options.includes(v))throw new TypeError(key);}
  else throw new TypeError('Tipo no admitido: '+f.type);
  out[key]=v;
 }
 return out;
}
export function normalizeSettings(input,{component='book-editorial-base',fields=baseFields}={}){
 if(typeof input==='string')input=JSON.parse(input);
 if(!record(input)||input.schemaVersion!==1||input.component!==component||!record(input.base)||!record(input.responsive??{}))throw new TypeError('Configuración incompatible');
 const responsive={};
 for(const [key,value] of Object.entries(input.responsive??{})){if(!['mobile','desktop'].includes(key))throw new TypeError('Vista desconocida');responsive[key]=normalizeValues(value,fields);}
 return {schemaVersion:1,component,base:{...Object.fromEntries(Object.entries(fields).map(([k,f])=>[k,f.default])),...normalizeValues(input.base,fields)},responsive};
}
export function resolveSettings(settings,view='desktop'){return {...settings.base,...settings.responsive[view]};}
export function migrateV11(values){const base={};for(const [k,v] of Object.entries(values))if(Object.hasOwn(baseFields,k))base[k]=v;return normalizeSettings({schemaVersion:1,component:'book-editorial-base',base,responsive:defaultResponsive});}
export class EditorialSettingsElement extends HTMLElement{
 static componentType='book-editorial-base';
 static editableProperties=baseFields;
 static responsiveDefaults=defaultResponsive;
 constructor(){super();this._settings=normalizeSettings({schemaVersion:1,component:this.constructor.componentType,base:{},responsive:this.constructor.responsiveDefaults},{component:this.constructor.componentType,fields:this.constructor.editableProperties});}
 get settings(){return copy(this._settings);}
 set settings(value){this.applySettings(value);}
 applySettings(value){const next=normalizeSettings(value,{component:this.constructor.componentType,fields:this.constructor.editableProperties});this._settings=next;this.settingsChanged();return this.settings;}
 async loadSettings(source){if(typeof source==='string'&&!source.trim().startsWith('{')){const r=await fetch(source);if(!r.ok)throw Error('No se pudo cargar configuración: '+r.status);source=await r.json();}return this.applySettings(source);}
 getSettings(){return this.settings;}
 getResolvedSettings(view){return resolveSettings(this._settings,view);}
 settingsChanged(){if(this.isConnected)this.render?.();}
}
