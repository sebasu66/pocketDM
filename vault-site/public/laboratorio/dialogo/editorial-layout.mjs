import {readLocal} from '/dm/libro/editorial/library.mjs?v=15';
export const activeKey='editorial:active-dialogue-v1';
export function localDesigns(){
 let catalog=[];try{catalog=JSON.parse(localStorage.getItem('editorial:design-library-v1')||'[]')}catch{}
 const items=[{id:'forja',name:'Forja del Ancla'},{id:'plaza',name:'Plaza del Cuervo Gris'},...catalog.filter(x=>x.kind==='dialogue')];
 let active;try{active=JSON.parse(localStorage.getItem(activeKey)||'null')}catch{}
 if(active?.id&&!items.some(x=>x.id===active.id))items.push(active);
 return {items,active:active?.id||'forja'};
}
export async function applyLayout(page,id,isCurrent=()=>true){
 let active;try{active=JSON.parse(localStorage.getItem(activeKey)||'null')}catch{}
 if(active?.id===id&&active.settings){if(isCurrent())page.applySettings(active.settings);return 'Diseño activo del editor'}
 const cached=await readLocal('dialogue-'+id);
 if(cached?.settings){if(isCurrent())page.applySettings(cached.settings);return 'Guardado en el editor'}
 if(['forja','plaza'].includes(id)){const response=await fetch('/dm/libro/editorial/designs/dialogue-'+id+'.json');if(!response.ok)throw Error('No se pudo cargar el diseño base');const settings=await response.json();if(isCurrent())page.applySettings(settings);return 'Diseño base de la bóveda'}
 throw Error('Este diseño todavía no está guardado en este navegador. Abrilo en el editor.');
}
