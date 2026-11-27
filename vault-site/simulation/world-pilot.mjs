import {snapshot,campaign,effective,applyChanges} from './world-context.mjs';
// Original, provisional miniature geography; no licensed Hellfrost setting data.
export function initialWorld(){
 return snapshot({canon:{era:'fantasía medieval',theme:'frontera fría',constraints:['sin tecnología moderna'],hubId:'stormkeep',version:1},nodes:[
 {id:'world',kind:'world',name:'Frontera del Norte',generation:'skeleton',visibility:'public'},
 {id:'marches',kind:'region',name:'Las Marcas',parentId:'world',generation:'skeleton',visibility:'public'},
 {id:'plains',kind:'region',name:'Llanuras Heladas',parentId:'world',generation:'skeleton',visibility:'public'},
 {id:'hex.0.0',kind:'hex',name:'Alrededores del bastión',parentId:'marches',q:0,r:0,terrain:'colinas',generation:'visitable',visibility:'public'},
 {id:'stormkeep',kind:'settlement',name:'Stormkeep',parentId:'hex.0.0',generation:'visitable',visibility:'public'},
 {id:'hex.1.0',kind:'hex',name:'Camino oriental',parentId:'marches',q:1,r:0,terrain:'bosque',generation:'skeleton',visibility:'public'},
 {id:'hex.2.0',kind:'hex',name:'Borde de las Llanuras Heladas',parentId:'plains',q:2,r:0,terrain:'tundra',generation:'skeleton',visibility:'public'}
 ],entities:[
 {id:'galahad',kind:'player',name:'Galahad',locationId:'stormkeep',visibility:'public',relatedIds:['lost-relic'],publicState:{fatigue:0}},
 {id:'lost-relic',kind:'item',name:'La lámpara perdida',regionId:'plains',summary:'Una reliquia mencionada en relatos de viajeros.',visibility:'known',privateState:{unique:true}}
 ],routes:[
 {id:'route.0.1',a:'hex.0.0',b:'hex.1.0',status:'potential',minutes:120,visibility:'public'},
 {id:'route.1.2',a:'hex.1.0',b:'hex.2.0',status:'potential',minutes:180,visibility:'public'}
 ]});
}
// Minimal authored dependency plan, not a general procedural region generator.
export function materializePilot(base,delta){
 const w=effective(base,delta);
 if(w.nodes['pilot.village'])return delta;
 const nodes={};
 for(const id of ['hex.1.0','hex.2.0'])nodes[id]={...w.nodes[id],generation:'visitable'};
 nodes['pilot.village']={id:'pilot.village',kind:'settlement',name:'Aldea del Hielo',parentId:'hex.2.0',generation:'visitable',visibility:'known'};
 nodes['pilot.bridge']={id:'pilot.bridge',kind:'site',name:'Puente del Vado',parentId:'hex.2.0',generation:'visitable',visibility:'known'};
 const routes={};
 for(const id of ['route.0.1','route.1.2'])routes[id]={...w.routes[id],status:'open'};
 routes['route.hub']={id:'route.hub',a:'stormkeep',b:'hex.0.0',status:'open',minutes:15,visibility:'public'};
 routes['route.village']={id:'route.village',a:'hex.2.0',b:'pilot.village',status:'open',minutes:15,visibility:'known'};
 routes['route.bridge']={id:'route.bridge',a:'pilot.village',b:'pilot.bridge',status:'open',minutes:10,visibility:'known'};
 const entities={};
 for(const [id,name,kind,locationId] of [['pilot.mara','Mara','npc','pilot.village'],['pilot.ivo','Ivo','npc','pilot.bridge'],['pilot.neris','Neris','npc','pilot.bridge']])entities[id]={id,name,kind,locationId,visibility:'known'};
 return applyChanges(base,delta,delta.revision,{nodes,routes,entities});
}
export function createPilotWorld(id='pilot-a'){const base=initialWorld();return {base,delta:materializePilot(base,campaign(base,id))}}
