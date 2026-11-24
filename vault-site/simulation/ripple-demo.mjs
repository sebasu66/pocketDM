// A small synthetic test world. Not Stormkeep canon or a real campaign.
import {snapshot} from './world-context.mjs';
import {newRipple,applyRipple} from './ripple-engine.mjs';
import {decideReactions} from './npc-decisions.mjs';
export const demoWorld=()=>snapshot({canon:{version:1,fixture:true},nodes:[
 {id:'demo-world',kind:'world',name:'Mundo de prueba',generation:'skeleton',visibility:'public'},
 {id:'demo-village',kind:'settlement',name:'Aldea de prueba',parentId:'demo-world',generation:'visitable',visibility:'public'},
 {id:'demo-post',kind:'site',name:'Puesto de prueba',parentId:'demo-world',generation:'visitable',visibility:'public'}
],entities:[
 {id:'hero',kind:'player',name:'Viajero',locationId:'demo-village',visibility:'public'},
 {id:'keeper',kind:'npc',name:'Encargada',locationId:'demo-village',visibility:'public'},
 {id:'guard',kind:'npc',name:'Guardia',locationId:'demo-post',visibility:'public'},
 {id:'watch',kind:'faction',name:'Vigilancia',visibility:'public'},
 {id:'food',kind:'resource',name:'Alimentos',visibility:'public'}
]});
export const demoPlan=()=>({id:'demo-ripple',version:1,initial:[
 {id:'keeper-hero',kind:'relation',from:'keeper',to:'hero',value:0},
 {id:'guard-keeper',kind:'relation',from:'guard',to:'keeper',value:20},
 {id:'hero-watch',kind:'reputation',actorId:'hero',factionId:'watch',value:0},
 {id:'village-food',kind:'stock',locationId:'demo-village',resourceId:'food',value:2},
 {id:'village-control',kind:'control',locationId:'demo-village',factionId:'watch'},
 {id:'guard-agenda',kind:'agenda',actorId:'guard',locationId:'demo-post',dueMinute:null,status:'idle'}
],rules:[{id:'food-received',when:{kind:'fact',value:'supplies_shared'},effects:[{op:'adjust',recordId:'keeper-hero',amount:15},{op:'adjust',recordId:'village-food',amount:1}]}]});
export function profiles(){
 const goals={safety:50,'protect-community':70,duty:15,'gain-influence':0,'personal-benefit':10},traits={prudence:30,compassion:70,loyalty:40,ambition:10,aggression:0};
 const common={capabilities:['wait','offer-help','report-event','seek-information'],attitudes:{hero:0},resources:{supplies:1,actionBudget:1,contact:true}};
 return [{...structuredClone(common),actorId:'keeper',goals,traits},{...structuredClone(common),actorId:'guard',goals:{...goals,'protect-community':10,duty:95},traits:{...traits,prudence:65,compassion:10,loyalty:90}}];
}
export function runRippleDemo({deliver=false,keeperProfile=null}={}){
 const w=demoWorld(),plan=demoPlan(),signal={id:'demo-ending',moduleId:'demo-module',ending:'resolved',facts:['supplies_shared']},r=applyRipple(w,newRipple(),plan,signal,{minute:120});
 const p=profiles();if(keeperProfile)p[0]=structuredClone(keeperProfile);
 p[0].attitudes.hero=r.state.records['keeper-hero'].value;
 const observation={id:'demo-observation',kind:'aid',actorId:'hero',locationId:'demo-village',witnesses:['keeper'],deliveredTo:deliver?['guard']:[]};
 const intents=decideReactions(w,observation,p);
 return {world:w,ripple:r,profiles:p,observation,intents};
}
