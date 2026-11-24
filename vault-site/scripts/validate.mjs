import "./validate-activity.mjs";
import {readFileSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const pub=join(root,'public');
const data=JSON.parse(readFileSync(join(pub,'data/catalog.json'),'utf8'));
const errors=[],ids=new Set(),types=new Set(['document','reference','decision','architecture','prototype','concept','task']);
for(const n of data.nodes){
 if(!/^doc_\d{4}$/.test(n.id)) errors.push('ID mal formado: '+n.id);
 if(ids.has(n.id)) errors.push('ID duplicado: '+n.id);
 ids.add(n.id);
 if(!types.has(n.type)) errors.push('Tipo desconocido: '+n.id);
 for(const k of ['name','summary','category','description_md','status']){
  if(typeof n[k]!=='string'||!n[k].trim())errors.push('Campo inválido '+k+' en '+n.id);
 }
 if(!Array.isArray(n.links)||!Array.isArray(n.tags))errors.push('Formato de links/tags: '+n.id);
 if(n.source?.href&&!(/^https:\/\//.test(n.source.href)||/^\/(?!\/)/.test(n.source.href)))errors.push('URL no permitida: '+n.id);
}
let edges=0;
for(const n of data.nodes){
 for(const link of n.links||[]){
  edges++;
  if(!ids.has(link.target))errors.push('Referencia rota '+n.id+' -> '+link.target);
  if(link.target===n.id)errors.push('Autorrelación '+n.id);
  if(!link.type)errors.push('Relación sin tipo '+n.id);
 }
}
const required=[
 'index.html','site.css','site.js','data/catalog.json',
 'app/index.html','libro/index.html','libro/book.css','libro/app.css',
 'libro/reader.mjs','libro/navigation.mjs','libro/campaign.mjs','libro/components.mjs','libro/events.mjs',
 'libro/assets/galahad.png','libro/assets/zhalan.png','libro/assets/bosque.png',
 'libro/assets/edge-landscape.svg','libro/assets/edge-portrait.svg','combate/index.html'
];
for(const p of required)if(!existsSync(join(pub,p)))errors.push('Falta '+p);
const combat=readFileSync(join(pub,'combate/index.html'),'utf8');
if(!combat.includes('/libro/?view=story')||/Carriles|tres carriles|card-riffle\.ogg/i.test(combat))errors.push('El enlace legado de combate no dirige al libro.');
if(existsSync(join(pub,'combate/assets')))errors.push('La demo de carriles obsoleta aún tiene assets.');
const reader=readFileSync(join(pub,'libro/reader.mjs'),'utf8');
for(const keyword of ['storyPages','activateView','book-sheet','book-journal','book-map','book-home','book-profile']){
 if(!reader.includes(keyword))errors.push('Falta integración de '+keyword);
}
const json=JSON.stringify(data);
for(const pat of [/-----BEGIN (?:RSA |EC )?PRIVATE KEY/,/AIza[0-9A-Za-z_-]{20,}/,/sk-[0-9A-Za-z_-]{20,}/,/password\s*[:=]\s*["'][^"']+/i]){
 if(pat.test(json))errors.push('Posible secreto en catálogo.');
}
const cfg=JSON.parse(readFileSync(join(root,'firebase.json'),'utf8'));
if(cfg.hosting.target!=='prototipos')errors.push('Target Hosting no es prototipos.');
console.log('Pocket DM libro + bóveda: '+data.nodes.length+' nodos, '+edges+' relaciones, '+new Set(data.nodes.map(n=>n.category)).size+' áreas.');
if(errors.length){errors.forEach(e=>console.error('ERROR: '+e));process.exitCode=1;}
else console.log('OK: integridad, componentes del libro y exclusión de carriles verificados.');
