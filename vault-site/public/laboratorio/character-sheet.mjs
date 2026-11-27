// Versioned shared actor contract, development fixtures only.
const assert=(ok,m)=>{if(!ok)throw Error(m)};
const int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
export const SKILLS=['combat','athletics','brawn','endurance','evade','perception','stealth','willpower','influence','track','firstAid'];
export const ATTRS=['STR','CON','SIZ','DEX','INT','POW','CHA'];
const loc=(id,name,from,to,maxHp,naturalAP=0,vital=false,limb=false)=>({id,name,from,to,maxHp,hp:maxHp,naturalAP,vital,limb,disabled:false});
const humanLocations=()=>[loc('right-leg','Pierna derecha',1,3,5,0,false,true),loc('left-leg','Pierna izquierda',4,6,5,0,false,true),loc('abdomen','Abdomen',7,9,6,0,true),loc('chest','Pecho',10,12,7,0,true),loc('right-arm','Brazo derecho',13,15,4,0,false,true),loc('left-arm','Brazo izquierdo',16,18,4,0,false,true),loc('head','Cabeza',19,20,5,0,true)];
const weapon=(id,name,damage,bonus,size,reach,hands,enc,ap,hp,natural=false)=>({id,kind:'weapon',name,damage:{count:1,sides:damage,bonus},size,reach,hands,enc,ap,maxHp:hp,hp,natural,quantity:1,carried:true});
const gear=(id,name,enc,quantity=1)=>({id,kind:'gear',name,enc,quantity,carried:true});
export function galahadSheet(){
 return validateSheet({schemaVersion:1,id:'galahad',name:'Galahad',kind:'character',speciesId:'human',profession:'Guerrero errante',rank:'fixture',source:'IADM blade_warden + PocketDM pilot; equipment ENC and unlisted skills provisional',attributes:{STR:13,CON:12,SIZ:13,DEX:12,INT:11,POW:11,CHA:10},skills:{combat:57,athletics:48,brawn:26,endurance:24,evade:45,perception:56,stealth:23,willpower:22,influence:34,track:23,firstAid:23},style:{id:'errant-blade',name:'Espada errante',weaponIds:['travel-sword','knife']},baseMove:6,magicPoints:11,damageModifier:{count:1,sides:2,sign:1},locations:humanLocations(),inventory:[weapon('travel-sword','Espada larga de viaje',8,0,'medium','medium',1,2,6,12),weapon('knife','Cuchillo',4,0,'small','short',1,1,4,8),{id:'coat',kind:'armor',name:'Abrigo pesado',enc:2,quantity:1,carried:true,coverage:['chest'],ap:1,maxHp:6,hp:6,worn:true},gear('pack','Mochila',1),gear('rations','Raciones',1,3),gear('water','Agua',1)],equippedWeaponId:'travel-sword',abilities:[],state:{fatigue:0,bleeding:false,prone:false,stunTurns:0,incapacitated:false,unconscious:false,fear:'none',cold:'none',extraLoad:0,light:'normal'}});
}
export function wolfSheet(){
 // Mechanical sample derived from average wolf, Mythras full p.273; no encounter-generator rank export.
 return validateSheet({schemaVersion:1,id:'wolf-1',name:'Lobo',kind:'creature',speciesId:'wolf',profession:'Depredador',rank:'reference-average',source:'Mythras full p.273 average numerical reference; no MEG rank export',attributes:{STR:8,CON:11,SIZ:8,DEX:11,INT:6,INS:13,POW:7,CHA:null},skills:{combat:59,athletics:59,brawn:36,endurance:62,evade:52,perception:60,stealth:24,willpower:44,influence:0,track:64,firstAid:0},style:{id:'bite-style',name:'Mordida',weaponIds:['bite']},baseMove:8,magicPoints:7,damageModifier:{count:1,sides:2,sign:-1},locations:[loc('right-hind','Pata trasera derecha',1,2,4,1,false,true),loc('left-hind','Pata trasera izquierda',3,4,4,1,false,true),loc('hindquarters','Cuartos traseros',5,7,5,1,true),loc('forequarters','Cuartos delanteros',8,10,6,1,true),loc('right-fore','Pata delantera derecha',11,13,4,1,false,true),loc('left-fore','Pata delantera izquierda',14,16,4,1,false,true),loc('head','Cabeza',17,20,4,1,true)],inventory:[weapon('bite','Mordida',4,0,'small','touch',0,0,1,4,true)],equippedWeaponId:'bite',abilities:['night-sight'],state:{fatigue:0,bleeding:false,prone:false,stunTurns:0,incapacitated:false,unconscious:false,fear:'none',cold:'none',extraLoad:0,light:'normal'}});
}
export function validateSheet(s){
 assert(s?.schemaVersion===1&&typeof s.id==='string'&&s.id&&typeof s.name==='string'&&['character','creature'].includes(s.kind),'Ficha inválida');
 for(const k of ATTRS)assert((k==='CHA'&&s.kind==='creature'&&s.attributes[k]===null)||int(s.attributes[k],1,200),'Atributo inválido '+k);
 if(s.attributes.INS!==undefined)assert(int(s.attributes.INS,1,200),'INS inválido');
 for(const k of SKILLS)assert(int(s.skills[k],0,300),'Habilidad inválida '+k);
 assert(int(s.baseMove,0,100)&&int(s.magicPoints,0,300),'Recursos inválidos');
 const dm=s.damageModifier;assert(int(dm.count,0,10)&&int(dm.sides,2,100)&&[-1,0,1].includes(dm.sign),'Modificador inválido');
 const ids=new Set(),rolls=new Set();
 for(const l of s.locations){assert(!ids.has(l.id)&&int(l.from,1,20)&&int(l.to,l.from,20)&&int(l.maxHp,1,200)&&int(l.hp,-1000,l.maxHp)&&int(l.naturalAP,0,100)&&typeof l.disabled==='boolean','Localización inválida');ids.add(l.id);for(let i=l.from;i<=l.to;i++){assert(!rolls.has(i),'Anatomía solapada');rolls.add(i)}}
 assert(rolls.size===20,'Anatomía incompleta'); const items=new Set();
 for(const i of s.inventory){assert(typeof i.id==='string'&&!items.has(i.id)&&typeof i.name==='string'&&int(i.quantity,1,1000)&&int(i.enc,0,1000)&&typeof i.carried==='boolean','Inventario inválido');items.add(i.id);
 if(i.kind==='weapon'){assert(['small','medium','large','huge','enormous'].includes(i.size)&&['touch','short','medium','long','very-long'].includes(i.reach)&&int(i.hands,0,2)&&int(i.damage.count,1,10)&&int(i.damage.sides,2,100)&&int(i.damage.bonus,-20,50)&&int(i.ap,0,100)&&int(i.maxHp,1,1000)&&int(i.hp,0,i.maxHp)&&i.quantity===1,'Arma inválida')}
 else if(i.kind==='armor'){assert(i.coverage.length>0&&i.coverage.every(x=>ids.has(x))&&int(i.ap,0,100)&&int(i.maxHp,1,1000)&&int(i.hp,0,i.maxHp)&&typeof i.worn==='boolean'&&i.quantity===1,'Armadura inválida')}
 else assert(i.kind==='gear','Tipo de objeto inválido')}
 assert(s.style.weaponIds.includes(s.equippedWeaponId)&&s.style.weaponIds.every(id=>s.inventory.some(i=>i.id===id&&i.kind==='weapon')),'Arma fuera de estilo');
 const t=s.state;assert(int(t.fatigue,0,9)&&int(t.stunTurns,0,100)&&int(t.extraLoad,0,1000)&&['none','shaken','flee'].includes(t.fear)&&['none','exposed'].includes(t.cold)&&['normal','dim','dark'].includes(t.light),'Estado inválido');
 for(const k of ['bleeding','prone','incapacitated','unconscious'])assert(typeof t[k]==='boolean','Estado inválido '+k);
 return s;
}
export const equipped=s=>s.inventory.find(x=>x.id===s.equippedWeaponId);
export const armorAt=(s,id)=>s.locations.find(l=>l.id===id).naturalAP+s.inventory.filter(i=>i.kind==='armor'&&i.carried&&i.worn&&i.hp>0&&i.coverage.includes(id)).reduce((v,i)=>v+i.ap,0);
export function derived(s){const a=s.attributes,mental=a.INS??a.INT,armorEnc=s.inventory.filter(i=>i.kind==='armor'&&i.worn&&i.carried).reduce((n,i)=>n+i.enc,0),enc=s.inventory.filter(i=>i.carried&&!i.natural).reduce((n,i)=>n+i.enc*i.quantity*(i.kind==='armor'&&i.worn ? .5 : 1),s.state.extraLoad);
 return {baseAP:Math.ceil((mental+a.DEX)/12),baseInitiative:Math.ceil((mental+a.DEX)/2),armorEnc,armorPenalty:Math.ceil(armorEnc/5),enc,normalCapacity:a.STR*2,overloadCapacity:a.STR*3,maxCapacity:a.STR*4};}

export function boarSheet(){
 const s=wolfSheet();return validateSheet({...s,id:'boar-1',name:'Jabalí',speciesId:'boar',rank:'reference-average',source:'Mythras full pp.231–232 average numerical reference; Frenzy/charge not executed in restricted lab',attributes:{STR:16,CON:16,SIZ:17,DEX:11,INT:4,INS:11,POW:7,CHA:null},skills:{combat:67,athletics:57,brawn:63,endurance:62,evade:42,perception:48,stealth:22,willpower:32,influence:0,track:0,firstAid:0},style:{id:'tusk-style',name:'Colmillos',weaponIds:['tusks']},damageModifier:{count:1,sides:4,sign:1},locations:[loc('right-hind','Pata trasera derecha',1,3,7,2,false,true),loc('left-hind','Pata trasera izquierda',4,6,7,2,false,true),loc('hindquarters','Cuartos traseros',7,9,8,2,true),loc('forequarters','Cuartos delanteros',10,12,9,2,true),loc('right-fore','Pata delantera derecha',13,15,7,2,false,true),loc('left-fore','Pata delantera izquierda',16,18,7,2,false,true),loc('head','Cabeza',19,20,7,2,true)],inventory:[weapon('tusks','Colmillos',6,0,'medium','short',0,0,2,7,true)],equippedWeaponId:'tusks',abilities:[],pendingAbilities:['frenzy','burrower','charge']});
}
