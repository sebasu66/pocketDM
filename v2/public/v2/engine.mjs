// PocketDM experimental simulation model, not a validated Mythras rules implementation.
export const clamp=(x,min=0,max=100)=>Math.max(min,Math.min(max,x));
export const attrs=['strength','constitution','size','dexterity','intelligence','power','charisma'];
export const skills=['scimitar','longsword','bow','athletics','evade','armor','perception','survival','creatureLore','arcana','willpower','insight'];
export const traits=['caution','compassion','aggression','discipline','curiosity','selfPreservation'];
export const items=[
 {id:'sword',name:'Scimitar',weight:1.2,bulk:1,kind:'weapon',skill:'scimitar'},
 {id:'longsword',name:'Longsword',weight:1.5,bulk:2,kind:'weapon',skill:'longsword'},
 {id:'bow',name:'Hunting bow',weight:1,bulk:2,kind:'weapon',skill:'bow'},
 {id:'arrows',name:'Arrows',weight:.04,bulk:.03,kind:'ammo'},
 {id:'leather',name:'Leather armor',weight:5,bulk:3,kind:'armor',protection:2,insulation:12},
 {id:'coat',name:'Travel coat',weight:2,bulk:1,kind:'clothing',insulation:25},
 {id:'pack',name:'Travel pack',weight:1,bulk:2,kind:'container'},
 {id:'rations',name:'Rations',weight:.5,bulk:.2,kind:'food'},
 {id:'water',name:'Water flask',weight:1,bulk:.3,kind:'water'},
 {id:'torch',name:'Torch',weight:.5,bulk:.5,kind:'light'}
];
export function preset(id='zhalan'){
 const g=id==='galahad';
 return {version:2,name:g?'Galahad':'Zhalan Driz’thar',species:g?'Human':'Drow',attributes:Object.fromEntries(attrs.map((k,i)=>[k,(g?[13,12,13,12,11,11,10]:[13,14,12,16,15,13,11])[i]])),skills:Object.fromEntries(skills.map((k,i)=>[k,(g?[20,57,25,48,45,35,56,40,20,15,45,40]:[78,30,72,65,68,45,70,55,40,25,60,55])[i]])),senses:{darkvision:!g,hearing:50},inventory:{sword:g?0:1,longsword:g?1:0,bow:g?0:1,arrows:g?0:12,leather:1,coat:1,pack:1,rations:3,water:1,torch:1},condition:{hunger:15,thirst:10,fatigue:20,cold:15,injury:0,fear:10},environment:{light:25,noise:20,temperature:-5},knowledge:{wolf:0,spell:0},behavior:Object.fromEntries(traits.map(k=>[k,50])),evidence:[],doctrine:'assess'};
}
export function derive(p){
 const a=p.attributes,s=p.skills,c=p.condition,e=p.environment;
 const load=items.reduce((n,i)=>n+i.weight*(p.inventory[i.id]||0),0);
 const bulk=items.reduce((n,i)=>n+i.bulk*(p.inventory[i.id]||0),0);
 const capacity=a.strength*2;
 const burden=load/capacity*100;
 const armor=p.inventory.leather?1:0;
 const cumbersome=Math.max(0,burden-40)*.35+bulk*.8-armor*s.armor*.08;
 const insulation=items.reduce((n,i)=>n+(i.insulation||0)*Math.min(1,p.inventory[i.id]||0),0);
 const exposure=clamp(c.cold+Math.max(0,10-e.temperature)*2-insulation);
 const impairment=c.fatigue*.32+c.hunger*.12+c.thirst*.15+exposure*.16+c.injury*.45;
 const vision=clamp(e.light+(p.senses.darkvision?55:0));
 const hearing=clamp(p.senses.hearing-e.noise*.4);
 const penalty=Math.max(0,cumbersome)+impairment;
 const melee=p.inventory.sword?s.scimitar:p.inventory.longsword?s.longsword:0;
 return {load:+load.toFixed(2),capacity,bulk:+bulk.toFixed(2),burden:Math.round(burden),cumbersome:Math.round(Math.max(0,cumbersome)),exposure:Math.round(exposure),impairment:Math.round(impairment),vision:Math.round(vision),hearing:Math.round(hearing),awareness:Math.round(clamp(s.perception*.7+a.intelligence*1.4-(100-Math.max(vision,hearing))*.35-impairment*.3)),melee:Math.round(clamp(melee-penalty)),parry:Math.round(clamp(melee-penalty)),ranged:p.inventory.bow&&p.inventory.arrows?Math.round(clamp(s.bow-penalty-(100-vision)*.3)):0,evade:Math.round(clamp(s.evade-penalty)),mobility:Math.round(clamp(s.athletics-penalty)),endurance:Math.round(clamp(a.constitution*5-impairment)),resolve:Math.round(clamp(a.power*2+s.willpower*.6-c.fear*.4-c.fatigue*.2)),wolfKnowledge:Math.round(clamp(s.creatureLore*.4+p.knowledge.wolf*.6)),spellRecognition:Math.round(clamp(s.arcana*.8+p.knowledge.spell*.2)),prediction:Math.round(clamp(a.intelligence*2+s.insight*.3+p.knowledge.wolf*.3-impairment*.25)),protection:armor*2};
}
export const scenes=[
 {id:'storm',title:'The storm',text:'A sailor falls as the rigging tears loose. The ship is losing its heading. What do you do?',options:[['Secure the rigging',{discipline:2}],['Help at the helm',{discipline:2,caution:1}],['Rescue the sailor',{compassion:3,selfPreservation:-1}],['Observe and give instructions',{caution:2,curiosity:1}]]},
 {id:'traveler',title:'The wounded traveler',text:'A stranger lies beside the road. Something moves in the trees.',options:[['Help immediately',{compassion:3,caution:-1}],['Observe from concealment',{caution:3,curiosity:1}],['Approach with weapon ready',{caution:1,aggression:1}],['Keep walking',{selfPreservation:3}]]},
 {id:'threat',title:'The narrow pass',text:'An armed stranger blocks your path and demands your supplies.',options:[['Try to negotiate',{discipline:2,caution:1}],['Prepare to fight',{aggression:3}],['Look for another route',{selfPreservation:2,caution:1}],['Ask why they need supplies',{curiosity:2,compassion:1}]]},
 {id:'tracks',title:'Tracks in the snow',text:'Fresh tracks circle your camp. You have enough food for one more day.',options:[['Investigate the tracks',{curiosity:3}],['Fortify the camp',{caution:2,discipline:1}],['Leave before dark',{selfPreservation:2}],['Wait quietly and watch',{discipline:2,caution:1}]]}
];
export function recordChoice(p,sceneId,index){
 const scene=scenes.find(x=>x.id===sceneId); if(!scene||!scene.options[index]) throw Error('Unknown choice');
 p.evidence=p.evidence.filter(x=>x.scene!==sceneId);
 const [choice,signals]=scene.options[index]; p.evidence.push({scene:sceneId,choice,signals});
 for(const k of traits)p.behavior[k]=clamp(50+p.evidence.reduce((n,x)=>n+(x.signals[k]||0),0)*6);
 return p;
}
export function threatSuggestion(p){if(p.doctrine!=='assess')return p.doctrine;const b=p.behavior,d=derive(p);if(d.resolve<30||b.selfPreservation>65)return 'withdraw';if(b.aggression>65)return 'engage';if(b.caution>60)return 'observe';return 'assess';}
