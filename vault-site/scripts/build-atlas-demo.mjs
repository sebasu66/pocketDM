// Public synthetic atlas fixture: only approved-for-demo location names and IDs.
// No private state, branch trees, or hidden lore is exported.
import {writeFileSync,readFileSync} from 'node:fs';
import {initialWorld,materializePilot} from '../simulation/world-pilot.mjs';
import {campaign,effective} from '../simulation/world-context.mjs';
const b=initialWorld(),w=effective(b,materializePilot(b,campaign(b,'atlas-demo')));
const assets=JSON.parse(readFileSync(new URL('../public/atlas/assets/manifest.json',import.meta.url),'utf8'));
const nodes=Object.values(w.nodes).map(({id,name,kind,parentId,generation,q,r,terrain})=>({id,name,kind,parentId,generation,q,r,terrain}));
const routes=Object.values(w.routes).map(({id,a,b,status,minutes})=>({id,a,b,status,minutes}));
const entities=Object.values(w.entities).filter(e=>e.id!=='lost-relic').map(({id,name,kind,locationId})=>({id,name,kind,locationId}));
function map(id,title,level,parentId,nodeId,width,height){return {id,title,level,parentId,nodeId,width,height,sprites:[],markers:[],routes:[]}}
let next=0;function put(m,assetId,x,y,scale=1,rotation=0,entityId=null,layer){const a=assets.find(a=>a.id===assetId);m.sprites.push({id:'s-'+(++next),assetId,x,y,scale,rotation,layer:layer??a.layer,entityId})}
function marker(m,id,x,y,label,nodeId,targetMapId=null){m.markers.push({id,x,y,label,nodeId,targetMapId})}
function ground(m){for(let x=600;x<m.width+600;x+=1200)for(let y=600;y<m.height+600;y+=1200)put(m,'cold-meadow',x,y,1)}
let r=28031;const rnd=()=>{r=(Math.imul(1664525,r)+1013904223)>>>0;return r/2**32};
const world=map('world','La frontera del norte','Mundo',null,'world',1800,1100);ground(world);
for(let i=0;i<9;i++)put(world,'mountains',170+i*180,150+Math.sin(i)*45,1.8);
for(let i=0;i<24;i++)put(world,'forest',120+rnd()*1500,390+rnd()*490,.7+rnd()*.7);
put(world,'lake',1300,840,1.9);marker(world,'marches',510,610,'Las Marcas','marches','region');marker(world,'plains',1390,400,'Llanuras Heladas','plains');marker(world,'stormkeep-overview',660,680,'Stormkeep','stormkeep','town');
const region=map('region','La región de Stormkeep','Región','world','marches',1800,1100);ground(region);
for(let i=0;i<8;i++)put(region,'mountains',120+i*230,120+Math.sin(i)*35,1.4);
for(let i=0;i<42;i++){let x=80+rnd()*1650,y=280+rnd()*720;if(y>490&&y<690&&x>280&&x<1510)continue;put(region,'forest',x,y,.35+rnd()*.45)}
put(region,'lake',1510,860,1.25);
for(let i=0;i<5;i++)put(region,'river-straight',1060,140+i*220,.8,90);
for(let i=0;i<5;i++)put(region,'road-straight',390+i*260,585,1);
put(region,'bridge',1060,585,.9);
put(region,'tower',430,550,1.1,0,'stormkeep');put(region,'house-a',485,592,.42);put(region,'house-b',385,612,.4);
put(region,'house-a',1420,560,.45,0,'pilot.village');put(region,'house-b',1470,610,.4);
marker(region,'hub',430,530,'Stormkeep','stormkeep','town');marker(region,'forest-road',830,585,'Camino oriental','hex.1.0');marker(region,'village',1440,540,'Aldea del Hielo','pilot.village');marker(region,'ford',1070,620,'Puente del Vado','pilot.bridge');
region.routes=[{routeId:'route.0.1',points:[[430,585],[830,585]]},{routeId:'route.1.2',points:[[830,585],[1440,585]]}];
const town=map('town','Stormkeep','Asentamiento','region','stormkeep',1600,1100);ground(town);
for(let i=0;i<20;i++){let x=60+rnd()*1450,y=60+rnd()*980;if(x>300&&x<1300&&y>180&&y<930)continue;put(town,i%2?'pine-1':'pine-2',x,y,.9+rnd()*.7)}
for(let x=350;x<=1250;x+=200){put(town,'wall',x,235,1);if(x<750||x>850)put(town,'wall',x,885,1)}
for(let y=340;y<840;y+=200){put(town,'wall',250,y,1,90);put(town,'wall',1350,y,1,90)}
for(const [x,y] of [[250,235],[1350,235],[250,885],[1350,885]])put(town,'tower',x,y,1.15);
put(town,'gate',800,885,1.2);
for(let i=0;i<3;i++)put(town,'road-straight',800,325+i*260,1,90);
for(let i=0;i<4;i++)put(town,'road-straight',410+i*260,550,1);
put(town,'tower',800,330,1.65,0,'stormkeep');
put(town,'warehouse',470,350,1.4);put(town,'barracks',1130,360,1.4);put(town,'tavern',510,710,1.35);put(town,'well',940,670,1.1);
for(const [x,y] of [[400,480],[625,450],[1010,460],[1200,480],[390,765],[650,770],[1100,750],[1240,680]])put(town,rnd()>.5?'house-a':'house-b',x,y,.95,rnd()*30-15);
marker(town,'keep',800,315,'Stormkeep','stormkeep');marker(town,'gate-demo',800,910,'Portón · muestra',null);marker(town,'warehouse-demo',470,310,'Almacén · muestra',null);marker(town,'tavern-demo',510,660,'Taberna · muestra',null);marker(town,'barracks-demo',1130,310,'Cuartel · muestra',null);
const p={schemaVersion:1,id:'stormkeep-atlas-demo',status:'fixture',source:'world-pilot + visual illustrative layout; not canon',assets,maps:[world,region,town],world:{nodes,entities,routes},activeMapId:'region'};
writeFileSync(new URL('../public/atlas/maps/demo.json',import.meta.url),JSON.stringify(p,null,2)+'\n');
console.log('Atlas fixture:',assets.length,'assets',p.maps.map(m=>m.id+': '+m.sprites.length+' sprites').join(', '));
