// Original development fixtures. NOT imported Mythras equipment/creature statistics.
const idOK=x=>typeof x==='string'&&/^[a-z][a-z0-9.-]+$/.test(x)&&!['constructor','prototype'].includes(x);
const integer=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
const require=(ok,msg)=>{if(!ok)throw Error(msg)};
export const SIZE=['small','medium','large','huge','enormous'];
export const REACH=['touch','short','medium','long','very-long'];
export function validateCatalog(c){
 require(c.schemaVersion===1&&idOK(c.id)&&integer(c.version,1,1e6),'Invalid catalog version');
 const all=new Set();
 for(const type of ['weapons','styles','anatomies','templates','traits','effects']){
  require(Array.isArray(c[type]),'Missing collection '+type);
  for(const x of c[type]){
   require(idOK(x.id)&&!all.has(x.id)&&typeof x.name==='string'&&x.name.trim()&&integer(x.version,1,1e6),'Invalid record '+x.id);
   require(x.provenance?.kind==='original-fixture'||x.provenance?.kind==='approved-source','Missing provenance '+x.id);
   require(x.provenance.kind!=='approved-source'||(x.provenance.sourceRef&&x.provenance.locator&&x.provenance.permission==='approved'),'Source not cleared '+x.id);
   all.add(x.id);
  }
 }
 const ids=t=>new Set(c[t].map(x=>x.id));
 const references=(xs,t)=>Array.isArray(xs)&&new Set(xs).size===xs.length&&xs.every(x=>ids(t).has(x));
 for(const w of c.weapons){
  require(SIZE.includes(w.size)&&REACH.includes(w.reach)&&integer(w.hands,0,2)&&integer(w.damage.count,1,20)&&integer(w.damage.sides,2,100)&&integer(w.damage.bonus,-20,50),'Invalid weapon '+w.id);
  require(integer(w.structure,1,1000)&&integer(w.armor,0,100)&&references(w.effectIds,'effects'),'Invalid weapon fields '+w.id);
 }
 for(const s of c.styles)require(s.weaponIds.length>0&&references(s.weaponIds,'weapons')&&references(s.traitIds,'traits')&&references(s.effectIds,'effects'),'Invalid style '+s.id);
 for(const a of c.anatomies){
  const seen=new Set(),locations=new Set();
  for(const l of a.locations){
   require(idOK(l.id)&&!locations.has(l.id)&&integer(l.from,1,20)&&integer(l.to,l.from,20)&&integer(l.hp,1,100)&&integer(l.armor,0,100),'Invalid anatomy '+a.id);
   locations.add(l.id);for(let i=l.from;i<=l.to;i++){require(!seen.has(i),'Overlapping hit location');seen.add(i)}
  }
  require(seen.size===20,'Incomplete anatomy '+a.id);
 }
 for(const t of c.templates){
  require(ids('anatomies').has(t.anatomyId)&&ids('styles').has(t.styleId)&&ids('weapons').has(t.weaponId),'Unknown template reference '+t.id);
  require(c.styles.find(s=>s.id===t.styleId).weaponIds.includes(t.weaponId),'Weapon outside style '+t.id);
  require(integer(t.skill,0,300)&&integer(t.actionPoints,1,5)&&integer(t.initiative,0,100),'Invalid template stats '+t.id);
 }
 return c;
}
const rec=(id,name,extra)=>({id,name,version:1,provenance:{kind:'original-fixture',sourceRef:'pocketdm-development',locator:'combat-catalog.mjs'},...extra});
const weapon=(id,name,size,reach,hands,sides,bonus=0)=>rec(id,name,{size,reach,hands,damage:{count:1,sides,bonus},armor:3,structure:10,effectIds:[]});
export function fixtureCatalog(){
 return validateCatalog({schemaVersion:1,id:'pocketdm-fixtures',version:1,
  weapons:[weapon('blade','Espada de frontera','medium','medium',1,8),weapon('pole','Lanza de prueba','large','long',2,8),weapon('bite','Mordida de prueba','small','short',0,6)],
  traits:[],effects:[],
  styles:[rec('guard-style','Guardia de frontera',{weaponIds:['blade','pole'],traitIds:[],effectIds:[]}),rec('pack-style','Cazador de manada',{weaponIds:['bite'],traitIds:[],effectIds:[]})],
  anatomies:[rec('human-shape','Humanoide de prueba',{locations:[{id:'legs',from:1,to:6,hp:5,armor:1},{id:'torso',from:7,to:12,hp:7,armor:2},{id:'arms',from:13,to:18,hp:4,armor:1},{id:'head',from:19,to:20,hp:4,armor:0}]}),rec('wolf-shape','Cuadrúpedo de prueba',{locations:[{id:'legs',from:1,to:8,hp:4,armor:0},{id:'body',from:9,to:16,hp:6,armor:1},{id:'head',from:17,to:20,hp:4,armor:0}]})],
  templates:[rec('guard','Guardia de prueba',{anatomyId:'human-shape',styleId:'guard-style',weaponId:'blade',skill:57,actionPoints:2,initiative:12}),rec('spearman','Lancero de prueba',{anatomyId:'human-shape',styleId:'guard-style',weaponId:'pole',skill:57,actionPoints:2,initiative:12}),rec('wolf','Lobo de prueba',{anatomyId:'wolf-shape',styleId:'pack-style',weaponId:'bite',skill:52,actionPoints:2,initiative:13})]
 });
}
export function instantiate(c,templateId,actorId){
 validateCatalog(c);const t=c.templates.find(x=>x.id===templateId);require(t&&idOK(actorId),'Invalid actor');
 const a=c.anatomies.find(x=>x.id===t.anatomyId);
 return {id:actorId,templateId:t.id,templateVersion:t.version,catalogId:c.id,catalogVersion:c.version,name:t.name,styleId:t.styleId,weaponId:t.weaponId,skill:t.skill,actionPoints:t.actionPoints,initiative:t.initiative,locations:a.locations.map(l=>({...l,maxHp:l.hp})),conditions:[]};
}
