#!/usr/bin/env node
/**
 * Inspección preventiva antes de cada tarea; no bloquea a otros desarrolladores.
 * node vault-site/scripts/preflight.mjs [--offline]
 */
import {execFileSync} from "node:child_process";
import {readFileSync,readdirSync,existsSync} from "node:fs";
import {dirname,join,resolve} from "node:path";
import {fileURLToPath} from "node:url";
const vault=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const repo=resolve(vault,"..");
function git(...args){return execFileSync("git",["-C",repo,...args],{encoding:"utf8",timeout:35000,stdio:["ignore","pipe","pipe"]}).trim();}
let fresh=true;
if(!process.argv.includes("--offline")){
 try{git("fetch","origin");console.log("✓ GitHub consultado: git fetch origin");}
 catch(e){fresh=false;console.warn("⚠ No se pudo actualizar origin:",e.message.split("\n")[0]);}
}else{fresh=false;console.warn("⚠ Modo offline: NO garantiza información reciente.");}
const current=git("branch","--show-current");
console.log("\n=== PREVUELO COMPARTIDO Pocket DM ===");
console.log("Rama:",current||"HEAD aislado");
const changes=git("status","--short");
if(changes)console.log("⚠ Cambios locales presentes, no sobrescribir:\n"+changes.split("\n").slice(0,15).join("\n"));
try{
 const ref="origin/"+current;
 git("rev-parse","--verify",ref);
 const pair=git("rev-list","--left-right","--count","HEAD..."+ref).split(/\s+/).map(Number);
 console.log("Comparación "+ref+": "+(pair[1]||0)+" commits nuevos remotos; "+(pair[0]||0)+" locales sin enviar.");
 if(pair[1]>0)console.warn("⛔ Revisar/reconciliar commits remotos antes de editar archivos o contratos compartidos.");
}catch{console.warn("⚠ Rama sin equivalente remoto; revisar PRs y la rama principal.");}
for(const ref of ["origin/main","origin/feature/boveda-mvp-20261124"]){
 try{console.log("\nÚltimos cambios en "+ref+":\n"+git("log","-4","--format=%h | %as | %s",ref));}
 catch(e){console.warn(ref+" no disponible");}
}
try{
 const ref="origin/main";
 const diff=git("log","--format=%h %s","HEAD.."+ref,"--","v2/");
 if(diff)console.warn("\n⚠ Existen cambios del lector/simulador V2 en main que esta rama todavía no contiene:\n"+diff);
}catch{}
function list(dir){
 if(!existsSync(dir))return [];
 return readdirSync(dir,{withFileTypes:true}).flatMap(x=>{
  const p=join(dir,x.name);
  return x.isDirectory()?list(p):(x.isFile()&&x.name.endsWith(".json")?[p]:[]);
 });
}
const files=list(join(vault,"updates"));
const entries=files.map(p=>JSON.parse(readFileSync(p,"utf8").replace(/^\uFEFF/,"")))
 .sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
if(!entries.length){console.error("⛔ La bóveda no tiene registro de actividad.");process.exitCode=2;}
else{
 console.log("\nÚltimas entregas de todas las áreas:");
 for(const e of entries.slice(0,10))console.log("- "+e.date+" | "+e.area+" | "+e.status+" | "+e.title+"\n  Próximo: "+e.next);
}
try{
 console.log("\nÚltimos commits que alteran el registro compartido:\n"+
  (git("log","-5","--format=%h | %as | %s","origin/feature/boveda-mvp-20261124","--","vault-site/updates/")||"No hay registros publicados todavía en la rama."));
}catch{}
console.log("\nRegla: consultar /actividad/ y los PRs, acordar los archivos compartidos y registrar otra entrada propia al terminar.");
if(!fresh)console.warn("El estado puede estar desactualizado: no iniciar cambios conflictivos sin reconectar a GitHub.");
