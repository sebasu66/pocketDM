// Import an explicitly isolated public cartographic draft, never narrative canon.
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {validateProject} from '../public/atlas/atlas-model.mjs';
const dir=resolve(process.argv[2]??'C:/DEV/PocketDM_Azgaar/pocketdm-trial/exports');
const out=resolve('public/atlas');
const geo=JSON.parse(readFileSync(join(dir,'pocketdm-geography.json'),'utf8'));
const {width,height,seed}=geo.info;
const city=geo.pack.burgs.find(b=>b.i===389&&b.name==='Stormkeep'&&!b.removed);
if(!city||!city.port||!city.walls)throw Error('Missing coastal walled city');
const png=readFileSync(join(dir,'pocketdm-physical.png'));
const pw=png.readUInt32BE(16),ph=png.readUInt32BE(20);
if(Math.abs(pw/ph-width/height)>1e-6)throw Error('Map/image mismatch');
mkdirSync(join(out,'assets','terrain'),{recursive:true});
copyFileSync(join(dir,'pocketdm-physical.png'),join(out,'assets','terrain','azgaar-world.png'));
const p={schemaVersion:1,id:'azgaar-stormkeep-draft',status:'draft',source:'Azgaar 1.154.1 / '+seed+' / preliminary non-canon geography',activeMapId:'azgaar-world',assets:[{id:'azgaar-world-image',name:'Mapa físico · Azgaar',category:'terrain',layer:'ground',src:'assets/terrain/azgaar-world.png',width}],world:{nodes:[{id:'world',name:'Mundo de prueba',kind:'world'},{id:'stormkeep',name:'Stormkeep',kind:'settlement',parentId:'world',azgaarBurgId:city.i,azgaarCellId:city.cell,port:true,walls:true,populationDraft:Math.round(city.population*1000)}],entities:[],routes:[]},maps:[{id:'azgaar-world',title:'Azgaar · Mundo de prueba',level:'Mundo',parentId:null,nodeId:'world',width,height,sprites:[{id:'world-image',assetId:'azgaar-world-image',x:width/2,y:height/2,scale:1,rotation:0,layer:'ground',entityId:null}],markers:[{id:'stormkeep-marker',label:'Stormkeep',x:city.x,y:city.y,nodeId:'stormkeep',targetMapId:'azgaar-region'}],routes:[]}]};
// Crop the same world texture with the renderer's map mask; coordinates are exact.
const rw=480,rh=300,x0=Math.max(0,Math.min(width-rw,city.x-rw/2)),y0=Math.max(0,Math.min(height-rh,city.y-rh/2));
p.maps.push({id:'azgaar-region',title:'Costa de Stormkeep · Azgaar',level:'Región',parentId:'azgaar-world',nodeId:null,width:rw,height:rh,sprites:[{id:'region-image',assetId:'azgaar-world-image',x:width/2-x0,y:height/2-y0,scale:1,rotation:0,layer:'ground',entityId:null}],markers:[{id:'stormkeep-local-marker',label:'Stormkeep',x:city.x-x0,y:city.y-y0,nodeId:'stormkeep',targetMapId:null}],routes:[]});
validateProject(p);writeFileSync(join(out,'maps','azgaar.json'),JSON.stringify(p,null,2)+'\n');console.log('Imported draft:',seed,city.i,city.cell,city.x,city.y,'world and region maps');
