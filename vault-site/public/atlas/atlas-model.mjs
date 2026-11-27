// Public atlas composition contract; no campaign authority or private state.
export const LAYERS=['ground','water','roads','nature','buildings','props','markers','routes'];
const ok=(v,m)=>{if(!v)throw Error(m)},id=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9_.-]{0,99}$/i.test(x),num=(x,a,b)=>Number.isFinite(x)&&x>=a&&x<=b,str=(x,m=200)=>typeof x==='string'&&x.length>0&&x.length<=m,unique=(a)=>new Set(a.map(x=>x.id)).size===a.length;
export function validateProject(p){
 ok(p?.schemaVersion===1&&id(p.id)&&Array.isArray(p.assets)&&p.assets.length<=1000&&unique(p.assets)&&Array.isArray(p.maps)&&p.maps.length>0&&p.maps.length<=100&&unique(p.maps),'Proyecto inválido');
 for(const a of p.assets)ok(id(a.id)&&str(a.name)&&str(a.category)&&LAYERS.slice(0,6).includes(a.layer)&&num(a.width,1,20000)&&typeof a.src==='string'&&a.src.length<=12000000&&(/^(assets\/[a-zA-Z0-9_./-]+\.(png|webp|jpg|jpeg))$/i.test(a.src)&&!a.src.includes('..')||/^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/.test(a.src)),'Asset inválido '+a.id);
 ok(p.world&&['nodes','entities','routes'].every(k=>Array.isArray(p.world[k])&&unique(p.world[k])),'Mundo inválido');
 const nodes=new Set(p.world.nodes.map(n=>n.id)),entities=new Set([...nodes,...p.world.entities.map(n=>n.id)]),routes=new Set(p.world.routes.map(r=>r.id)),maps=new Set(p.maps.map(m=>m.id)),assets=new Set(p.assets.map(a=>a.id));
 for(const m of p.maps){
  ok(id(m.id)&&str(m.title)&&str(m.level)&&num(m.width,100,30000)&&num(m.height,100,30000)&&(m.parentId===null||maps.has(m.parentId))&&(m.nodeId===null||nodes.has(m.nodeId)),'Mapa inválido '+m.id);
  ok(Array.isArray(m.sprites)&&m.sprites.length<=5000&&unique(m.sprites)&&Array.isArray(m.markers)&&m.markers.length<=1000&&unique(m.markers)&&Array.isArray(m.routes),'Colecciones inválidas');
  for(const s of m.sprites)ok(id(s.id)&&assets.has(s.assetId)&&num(s.x,-30000,60000)&&num(s.y,-30000,60000)&&num(s.scale,.05,20)&&num(s.rotation,-36000,36000)&&LAYERS.slice(0,6).includes(s.layer)&&(s.entityId===null||entities.has(s.entityId)),'Pieza inválida '+s.id);
  for(const n of m.markers)ok(id(n.id)&&str(n.label)&&num(n.x,0,m.width)&&num(n.y,0,m.height)&&(n.nodeId===null||nodes.has(n.nodeId))&&(n.targetMapId===null||maps.has(n.targetMapId)),'Marcador inválido '+n.id);
  for(const r of m.routes)ok(routes.has(r.routeId)&&Array.isArray(r.points)&&r.points.length>=2&&r.points.length<=100&&r.points.every(a=>Array.isArray(a)&&a.length===2&&num(a[0],0,m.width)&&num(a[1],0,m.height)),'Ruta visual inválida');
  const seen=new Set([m.id]);let parent=m.parentId;while(parent!==null){ok(!seen.has(parent),'Ciclo de mapas');seen.add(parent);parent=p.maps.find(x=>x.id===parent).parentId}
 }
 ok(maps.has(p.activeMapId),'Mapa inicial inválido');
 return p;
}
export function inspectProject(p,m){
 const warnings=[],nodeIds=new Set(p.world.nodes.map(n=>n.id)),linked=new Set([...m.markers.map(n=>n.nodeId),...m.sprites.map(n=>n.entityId)].filter(Boolean));
 for(const n of p.world.nodes)if(n.parentId&&!nodeIds.has(n.parentId))warnings.push('Padre inexistente: '+n.name);
 for(const e of p.world.entities)if(e.locationId&&!nodeIds.has(e.locationId))warnings.push('Localización inexistente: '+e.name);
 for(const r of p.world.routes)if(!nodeIds.has(r.a)||!nodeIds.has(r.b))warnings.push('Extremo inexistente: '+r.id);
 for(const s of m.sprites)if(s.layer!=='ground'&&(s.x<0||s.y<0||s.x>m.width||s.y>m.height))warnings.push('Pieza fuera del mapa: '+s.id);
 const unplaced=p.world.nodes.filter(n=>n.parentId===m.nodeId&&!linked.has(n.id));
 return {warnings,unplaced,linked:linked.size,unmappedMarkers:m.markers.filter(n=>!n.nodeId).length};
}
export function sortedSprites(m){return m.sprites.map((s,i)=>({s,i})).sort((a,b)=>LAYERS.indexOf(a.s.layer)-LAYERS.indexOf(b.s.layer)||a.i-b.i).map(x=>x.s)}
export function zoomAt(camera,x,y,factor){const z=Math.max(.05,Math.min(8,camera.z*factor)),ratio=z/camera.z;return {x:x-(x-camera.x)*ratio,y:y-(y-camera.y)*ratio,z}}
