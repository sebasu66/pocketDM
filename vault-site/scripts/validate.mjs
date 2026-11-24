import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root,"public");
const data = JSON.parse(readFileSync(join(pub,"data/catalog.json"),"utf8"));
const errors = [], ids = new Set(), types = new Set(["document","reference","decision","architecture","prototype","concept","task"]);
if (!Array.isArray(data.nodes) || data.nodes.length === 0) errors.push("No hay nodos en el catálogo.");
for (const node of data.nodes || []) {
 if (!/^doc_[0-9]{4}$/.test(node.id||"")) errors.push("ID no estable: "+node.id);
 if (ids.has(node.id)) errors.push("ID duplicado: "+node.id);
 ids.add(node.id);
 if (!types.has(node.type)) errors.push("Tipo desconocido: "+node.id);
 for (const required of ["name","summary","category","description_md","status"]) {
  if (typeof node[required] !== "string" || !node[required].trim()) errors.push("Falta "+required+" en "+node.id);
 }
 if (!Array.isArray(node.links) || !Array.isArray(node.tags)) errors.push("Formato inválido en "+node.id);
 const href=node.source?.href;
 if (href && !(/^https:\/\//.test(href) || /^\/(?!\/)/.test(href))) errors.push("URL no permitida en "+node.id);
}
let edges=0;
for (const node of data.nodes||[]) {
 for (const link of node.links||[]) {
  edges++;
  if (!ids.has(link.target)) errors.push("Relación rota: "+node.id+" => "+link.target);
  if (link.target===node.id) errors.push("Auto-relación no intencional: "+node.id);
  if (typeof link.type!=="string"||!link.type) errors.push("Relación sin tipo: "+node.id);
 }
}
for (const name of ["index.html","site.css","site.js","combate/index.html","combate/assets/bg-hellfrost.jpg","combate/assets/sfx/card-deal.ogg"]) {
 if (!existsSync(join(pub,name))) errors.push("Archivo faltante: "+name);
}
const combat=join(pub,"combate/index.html");
if (existsSync(combat)) {
 const hash=createHash("sha256").update(readFileSync(combat)).digest("hex").toUpperCase();
 const expected="697635B637EEAF6EDC8C6B21B4743730E574CBE56C10A8FD5228231E8550FA68";
 if(hash!==expected)errors.push("Combate distinto del HTML público auditado: "+hash);
}
const txt=JSON.stringify(data);
for (const bad of [/-----BEGIN (?:RSA |EC )?PRIVATE KEY/,/AIza[0-9A-Za-z_-]{20,}/,/sk-[0-9A-Za-z_-]{20,}/,/password\s*[:=]\s*["'][^"']+/i]) {
 if(bad.test(txt))errors.push("Posible secreto en contenido publicado.");
}
const cfg=JSON.parse(readFileSync(join(root,"firebase.json"),"utf8"));
if(cfg.hosting.target!=="prototipos")errors.push("Destino Hosting distinto de prototipos.");
console.log("VALIDACIÓN Pocket DM");
console.log("- Fichas: "+(data.nodes||[]).length+" · relaciones: "+edges+" · áreas: "+new Set((data.nodes||[]).map(n=>n.category)).size);
console.log("- Integridad de IDs/enlaces, archivos y SHA-256 del combate.");
if(errors.length){for(const err of errors)console.error("ERROR: "+err);process.exitCode=1;}
else console.log("OK: catálogo y recursos verificados.");
