import {execFileSync} from "node:child_process";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname,join} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const pub=join(root,"public");
const data=JSON.parse(readFileSync(join(pub,"data/activity.json"),"utf8"));
const catalog=JSON.parse(readFileSync(join(pub,"data/catalog.json"),"utf8"));
const nodes=new Set(catalog.nodes.map(x=>x.id));
const errors=[];
const ids=new Set();
if(!data||!Array.isArray(data.entries)||!Array.isArray(data.areas)||!Array.isArray(data.requiredFields))errors.push("Estructura de actividad inválida.");
for(const item of data.entries||[]){
 for(const f of data.requiredFields||[]){
  if(!Object.hasOwn(item,f)||!item[f]||(Array.isArray(item[f])&&!item[f].length))errors.push(item.id+" no tiene campo requerido "+f);
 }
 if(ids.has(item.id))errors.push("ID de actividad duplicado: "+item.id);
 ids.add(item.id);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(item.date||""))errors.push("Fecha incorrecta: "+item.id);
 if(!data.areas.includes(item.area))errors.push("Área desconocida: "+item.area);
 if(!Array.isArray(item.changed))errors.push("Cambios sin rutas: "+item.id);
 if(!Array.isArray(item.nodeIds))errors.push("Falta array de nodos: "+item.id);
 if(!/^https:\/\/[^ ]+$/i.test(item.source||""))errors.push("Fuente HTTPS no válida: "+item.id);
 for(const node of item.nodeIds||[])if(!nodes.has(node))errors.push("Actividad refiere un nodo inexistente: "+item.id+" -> "+node);
}
for(const p of ["actividad/index.html","actividad/activity.css","actividad/activity.js","data/activity.json","../COORDINACION.md","../scripts/preflight.mjs"]){
 if(!existsSync(join(pub,p)))errors.push("Falta archivo: "+p);
}
if(errors.length){
 for(const e of errors)console.error("ERROR (coordinación): "+e);
 process.exitCode=1;
}else console.log("OK: actividad compartida, "+data.entries.length+" registros, "+data.areas.length+" áreas y referencias válidas.");

try{execFileSync(process.execPath,[join(root,"scripts/build-activity.mjs"),"--check"],{stdio:"inherit"});}catch{console.error("ERROR: el índice generado no coincide con updates/");process.exitCode=1;}
