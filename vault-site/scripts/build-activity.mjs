#!/usr/bin/env node
/**
 * Combina un archivo JSON por entrega en el índice de actividad de Firebase.
 * Cada equipo modifica un archivo distinto en updates/ para reducir conflictos.
 */
import {readFileSync,writeFileSync,existsSync,mkdirSync,readdirSync} from "node:fs";
import {join,relative,resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const src=join(root,"updates");
const target=join(root,"public/data/activity.json");
const requiredFields=["id","date","area","owner","status","title","summary","changed","next","source"];
const areas=["Coordinación","World Engine / Grafo","Combate / Simulador V2","Interfaz / Libro","Documentación / Bóveda","Infraestructura / Firebase","Narrativa / Contenido","Arte / Assets","Administración"];
const dirByArea={"Coordinación":"coordinacion","Interfaz / Libro":"interfaz-libro","Documentación / Bóveda":"boveda"};
const isBootstrap=process.argv.includes("--bootstrap");
const isCheck=process.argv.includes("--check");
if(isBootstrap){
 const original=JSON.parse(readFileSync(target,"utf8"));
 for(const entry of original.entries){
  const folder=join(src,dirByArea[entry.area]||"otros");
  mkdirSync(folder,{recursive:true});
  const file=join(folder,entry.id+".json");
  if(existsSync(file))throw Error("No sobrescribir una entrega existente: "+file);
  writeFileSync(file,JSON.stringify(entry,null,2)+"\n");
  console.log("CREADO "+relative(root,file));
 }
}
function listFiles(folder){
 if(!existsSync(folder))return [];
 return readdirSync(folder,{withFileTypes:true}).flatMap(item=>{
  const full=join(folder,item.name);
  return item.isDirectory()?listFiles(full):(item.isFile()&&item.name.endsWith(".json")?[full]:[]);
 });
}
const files=listFiles(src);
if(!files.length)throw Error("No hay entregas individuales en updates/");
const entries=files.map(file=>JSON.parse(readFileSync(file,"utf8").replace(/^\uFEFF/,"")));
const ids=new Set();
for(const entry of entries){
 for(const k of requiredFields){
  if(!(k in entry)||entry[k]==null||entry[k]===""||(Array.isArray(entry[k])&&!entry[k].length))throw Error("Falta "+k+" en "+entry.id);
 }
 if(ids.has(entry.id))throw Error("ID duplicado "+entry.id);
 ids.add(entry.id);
 if(!areas.includes(entry.area))throw Error("Área no declarada: "+entry.area);
 if(!Array.isArray(entry.nodeIds))throw Error("Falta nodeIds en "+entry.id);
 if(!Array.isArray(entry.changed))throw Error("Falta changed en "+entry.id);
}
entries.sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
const payload={schemaVersion:"pocketdm-activity-v1",guidance:"Fuente versionada en updates/*.json. El índice estático se genera antes de desplegar y se muestra en Firebase.",requiredFields,areas,entries};
const rendered=JSON.stringify(payload,null,2)+"\n";
if(isCheck){
 if(!existsSync(target)||readFileSync(target,"utf8").trim()!==rendered.trim())throw Error("Índice de actividad desactualizado: ejecutar node scripts/build-activity.mjs");
 console.log("OK: índice de actividad coincide con "+entries.length+" entregas individuales.");
}else{
 writeFileSync(target,rendered);
 console.log("Generado "+relative(root,target)+" desde "+entries.length+" archivos por entrega.");
}
