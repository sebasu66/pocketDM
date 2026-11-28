import fs from 'node:fs';import path from 'node:path';
import {publicAssets} from '../public/dm/arte/asset-catalog.mjs';
import {presetIds,presetInfo,stormkeepSheet} from '../public/laboratorio/stormkeep-presets.mjs';
const root=new URL('../public/',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),json=p=>JSON.parse(read(p));
const pop=json('data/stormkeep-population-v02.json'),manifest=json('docs/art-references/stormkeep-work-20261125/manifest.json'),first=json('data/stormkeep-first-session-assets.json'),atlas=json('atlas/maps/demo.json');
const records=new Map(),relations=[],missingArt=[];
const srcMap=new Map(Object.entries(publicAssets).map(([id,a])=>[a.src,id]));
const source=(label,href)=>({label,href});
const popSource=source('Población v0.2','/docs/stormkeep-population-v02.md'),bibleSource=source('Biblia del mundo v0.1','/docs/world-bible-v01.md'),foundation=source('Fundamentos de Stormkeep v0.2','/docs/stormkeep-foundation-v02.md'),atlasSource=source('Atlas de prueba (no canónico)','/atlas/'),rosterSource=source('Personajes iniciales','/docs/stormkeep-starting-roster.md');
function add(r){if(records.has(r.id))throw Error('Duplicado '+r.id);records.set(r.id,{assets:[],fields:{},sources:[],...r});return records.get(r.id)}
function attach(id,src,status,role){const r=records.get(id);if(!r||!src)return;const assetId=srcMap.get(src);if(!assetId){missingArt.push({id,src,status,role});return}if(!r.assets.some(x=>x.id===assetId))r.assets.push({id:assetId,status,role});}
function link(from,to,rel,reason=''){if(from&&to)relations.push({from,to,rel,reason})}
for(const n of atlas.world.nodes){const type=n.kind==='world'||n.kind==='region'?'world':'location';add({id:n.id,name:n.name,type,status:n.id==='stormkeep'?'Nombre confirmado · detalles propuestos':'Atlas de prueba',summary:n.kind,fields:{...n},sources:[atlasSource]});if(n.parentId)link(n.id,n.parentId,'pertenece-a')}
const world=records.get('world');world.sources.push(bibleSource,foundation,source('Progresión del mundo','/docs/world-progression.md'));world.summary='Biblia, geografía, culturas, magia y autoridad; consultar la distinción entre confirmado, propuesta y abierto.';
const sk=records.get('stormkeep');sk.summary='Ciudad costera de referencia; fundamentos y población propuestos.';sk.fields.population=pop.population;sk.sources.push(foundation,popSource);
for(const site of pop.sites){add({id:site.id,name:site.name,type:'location',status:'Propuesta',summary:'Localización de Stormkeep',fields:{...site},sources:[popSource,foundation]});link(site.id,site.parentId,'pertenece-a')}
for(const actor of pop.actors){add({id:actor.id,name:actor.name,type:'npc',status:'Propuesta',summary:actor.role,fields:{...actor},sources:[popSource]});link(actor.id,actor.homeAreaId,'vive-en');link(actor.id,actor.workplaceId,'trabaja-en')}
for(const rel of pop.relationships)link(rel.source,rel.target,rel.rel,rel.reason);
for(const line of read('docs/world-bible-v01.md').split(/\r?\n/)){const cells=line.split('|').slice(1,-1).map(x=>x.trim());if(cells.length!==4)continue;const [id,name,desc,tension]=cells;if(!/^(marches|plains|draft\.region\.|draft\.faction\.)/.test(id))continue;const r=records.get(id)||add({id,name,type:id.startsWith('draft.faction.')?'faction':'world',status:'Propuesta',summary:desc,sources:[bibleSource]});r.fields.description=desc;r.fields.tension=tension;if(!r.sources.some(x=>x.href===bibleSource.href))r.sources.push(bibleSource);if(id.startsWith('draft.region.'))link(id,'world','pertenece-a')}
for(const id of presetIds){const p=presetInfo(id),s=stormkeepSheet(id),rid='preset.'+id;add({id:rid,name:p.name,type:'pc',status:'Personaje inicial · plantilla',summary:p.role,fields:{preset:p,sheet:s},sources:[rosterSource]});attach(rid,p.portrait,'original','Retrato');for(const item of s.inventory){const oid='equipment.'+item.id;let r=records.get(oid);if(!r)r=add({id:oid,name:item.name,type:'object',status:'Equipo de plantilla',summary:item.kind,fields:{variants:[]},sources:[rosterSource]});r.fields.variants.push({presetId:rid,...item});link(rid,oid,'equipo-inicial')}}
for(const entry of [...manifest.entries,...(manifest.historical??[])]){if(!entry.image)continue;const src=entry.image.startsWith('/')?entry.image:'/docs/art-references/stormkeep-work-20261125/'+entry.image;for(const id of entry.id.split(' / '))attach(id,src,entry.status,entry.type);}
for(const [id,a] of Object.entries(first.npc))attach(id,a.portrait,a.status,'Retrato de primera sesión');
for(const [id,a] of Object.entries(first.locations))attach(id,a.art,a.status,'Escenario de primera sesión');
attach('stormkeep',publicAssets['LOGO/stormkeep'].src,'original','Logo');
const unmatchedRelations=relations.filter(r=>!records.has(r.from)||!records.has(r.to));
const edges=relations.filter(r=>records.has(r.from)&&records.has(r.to)).filter((r,i,a)=>a.findIndex(x=>x.from===r.from&&x.to===r.to&&x.rel===r.rel)===i);
const out={schemaVersion:1,scope:'Registros públicos de autoría y prototipos. No canon automático, estado de campaña, secretos ni posiciones reales.',records:[...records.values()],relations:edges,missingArt,unmatchedRelations};
fs.writeFileSync(new URL('data/world-register.json',root),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({records:out.records.length,byType:Object.fromEntries([...new Set(out.records.map(r=>r.type))].map(t=>[t,out.records.filter(r=>r.type===t).length])),relations:edges.length,linked:out.records.filter(r=>r.assets.length).length,missingArt,unmatchedRelations},null,2));
