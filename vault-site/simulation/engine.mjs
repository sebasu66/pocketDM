import {createHash,createHmac,randomBytes} from 'node:crypto';
export const RULES='pilot-d100-v1';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
export const newSeed=()=>randomBytes(32).toString('hex');
export function die(seed,address,sides=100){
 if(!Number.isSafeInteger(sides)||sides<2||sides>1000000)throw Error('Invalid die');
 const limit=Math.floor(2**32/sides)*sides;
 for(let i=0;;i++){const v=createHmac('sha256',seed).update(JSON.stringify([RULES,address,i])).digest().readUInt32BE(0);if(v<limit)return 1+v%sides}
}
const pick=(seed,key,values)=>values[die(seed,['world',key],values.length)-1];
export function createCampaign(seed=newSeed()){
 const place=pick(seed,'place',['Vado de Ceniza','Puente del Espino','Aldea del Hielo']);
 const cargo=pick(seed,'cargo',['medicina','grano','aceite']);
 return {version:1,rules:RULES,seed,id:'pilot-'+hash(seed).slice(0,12),revision:0,scene:'arrival',place,cargo,hero:{id:'galahad',name:'Galahad',skills:{perception:56,influence:45,combat:57,evade:45},hp:12,fatigue:0,rations:3},npcs:{keeper:{id:'keeper',name:'Mara',goal:'proteger el suministro',trust:0},guard:{id:'guard',name:'Ivo',goal:'proteger el puente',alert:0},rival:{id:'rival',name:'Neris',goal:'recuperar el cargamento',hp:8}},flags:{clue:false,helped:false},status:'active',history:[],path:[]};
}
export function options(s){
 if(s.status!=='active')return [];
 if(s.scene==='arrival')return ['inspect','help','cross'];
 if(s.scene==='cross')return ['negotiate','defend','retreat'];
 if(s.scene==='fight')return ['strike','guard','retreat'];
 return [];
}
const labels={perception:'Percepción',influence:'Influencia',combat:'Estilo de combate: espada errante',evade:'Evitar'};
export function resolve(state,action){
 if(!options(state).includes(action))throw Error('Action not allowed');
 const s=structuredClone(state),checks=[],facts=[];
 s.path.push(action);const id=s.id+'.'+hash(s.path).slice(0,24);
 const roll=(slot,sides)=>die(s.seed,[s.id,s.path,slot],sides);
 const test=(skill,difficulty='Estándar')=>{
  const base=s.hero.skills[skill],target=Math.floor(base*(difficulty==='Difícil'?2/3:1)),r=roll(skill,100);
  const c={schemaVersion:1,id:id+'.'+skill,actorId:s.hero.id,actorName:s.hero.name,skillId:skill,skillName:labels[skill],dice:'D100',base,target,difficulty,roll:r,outcome:r<=target?'success':'failure',reason:'Reglas provisionales del piloto.',visibility:'player',source:'simulation-pilot'};checks.push(c);return c.outcome==='success';
 };
 const fact=(kind,data={})=>facts.push({kind,...data});
 if(action==='inspect'){s.flags.clue=test('perception','Difícil');fact('inspection',{found:s.flags.clue});s.scene='cross'}
 if(action==='help'){s.hero.rations--;s.flags.helped=true;s.npcs.keeper.trust++;fact('supplies_shared');s.scene='cross'}
 if(action==='cross'){s.scene='cross';fact('bridge_reached')}
 if(action==='negotiate'){const ok=test('influence',s.flags.helped||s.flags.clue?'Estándar':'Difícil');fact('negotiation',{accepted:ok});if(ok)s.status='resolved';else s.scene='fight'}
 if(['defend','guard','strike'].includes(action)){
  if(action==='strike'&&test('combat')){const damage=roll('damage',6);s.npcs.rival.hp=Math.max(0,s.npcs.rival.hp-damage);fact('rival_wounded',{damage})}
  if(s.npcs.rival.hp===0){s.status='resolved';fact('rival_defeated')}
  else {if(!test('evade',action==='guard'?'Estándar':'Difícil')){const damage=roll('incoming',4);s.hero.hp=Math.max(0,s.hero.hp-damage);fact('hero_wounded',{damage})}else fact('attack_avoided');s.scene='fight'}
  s.hero.fatigue+=action==='guard'?1:2;if(s.hero.hp===0)s.status='incapacitated';
 }
 if(action==='retreat'){const ok=test('evade');fact('retreat',{escaped:ok});if(ok)s.status='withdrawn';else{s.scene='fight';s.hero.fatigue++}}
 s.revision++;
 if(s.revision===2)s.npcs.guard.alert++; // private agenda, not automatically revealed
 if(s.revision>=6&&s.status==='active'){s.status='unresolved';fact('time_limit')}
 const event={id,revision:s.revision,action,checks,facts,visibleState:{hp:s.hero.hp,fatigue:s.hero.fatigue,rations:s.hero.rations,status:s.status,scene:s.scene}};
 s.history.push(event);return {state:s,event};
}
export function branchTree(state,depth=2){
 if(!Number.isInteger(depth)||depth<0||depth>4)throw Error('Depth 0-4');
 return {revision:state.revision,scene:state.scene,branches:depth?options(state).map(action=>{const {state:next,event}=resolve(state,action);return {action,event,next:branchTree(next,depth-1)}}):[]};
}
export const narrativeInput=event=>structuredClone(event);
export const narrativeKey=(event,context,locale='es',version='narrator-v1')=>hash([RULES,locale,version,context,event]);
