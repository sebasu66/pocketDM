import {validateSheet,equipped,armorAt} from './character-sheet.mjs';
import {conditionProfile} from './conditions.mjs';
import {gradeOf,opposed,differential,contestTargets,parryDamage,successful} from './percentile.mjs';
const clone=structuredClone;
const labels={standard:'Estándar',hard:'Difícil',formidable:'Formidable',herculean:'Hercúlea'};
export function labRoller(seed){let h=2166136261;for(const c of String(seed))h=Math.imul(h^c.charCodeAt(0),16777619);return sides=>{h=(h+0x6D2B79F5)|0;let t=Math.imul(h^(h>>>15),1|h);t^=t+Math.imul(t^(t>>>7),61|t);return 1+Math.floor(((t^(t>>>14))>>>0)/4294967296*sides)}}
const rollDice=(d,roll)=>Array.from({length:d.count},()=>roll(d.sides));
const sum=xs=>xs.reduce((n,x)=>n+x,0);
const isOut=s=>s.state.incapacitated||s.state.unconscious||s.state.fatigue>=6;
function check(s,p,target,roll,role,id){const value=roll(100);return {schemaVersion:1,id:id+'.'+role+'.'+s.id,actorId:s.id,actorName:s.name,skillId:p.skill==='combat'?s.style.id:p.skill,skillName:p.skill==='combat'?s.style.name:p.skill,base:p.base,target,difficulty:labels[p.grade]??'Bloqueada',reason:p.mods.map(m=>m.reason).join('; ')||'Sin modificadores',dice:'D100',roll:value,outcome:gradeOf(value,target),visibility:'player',source:'pocketdm-lab-v1',role,formula:p.base+' × '+(p.grade==='hard'?'2/3':p.grade==='formidable'?'1/2':p.grade==='herculean'?'1/10':String(p.factor))+' → '+p.target+(target!==p.target?' → '+target+' (oposición)':''),modifiers:p.mods};}
export function exchange(attacker,defender,{roll,id='exchange',defense='auto',defenseAvailable=true}={}){
 const a=clone(validateSheet(attacker)),b=clone(validateSheet(defender)),p=conditionProfile(a),aw=equipped(a),bw=equipped(b);
 if(!p.legal)return {attacker:a,defender:b,blocked:p.blocked,checks:[],damage:null,entitlement:null,defense:'none',cost:{attack:0,defense:0}};
 let mode=defense==='auto'?(bw.natural?'evade':'parry'):defense;
 let q=conditionProfile(b,mode==='evade'?'evade':'combat',mode);
 if(!q.legal||!defenseAvailable||mode==='none')mode='none';
 const ts=mode==='none'?{attacker:p.target,defender:null,penalty:0}:contestTargets(p.target,q.target);
 const ac=check(a,p,ts.attacker,roll,'attack',id),dc=mode==='none'?null:check(b,q,ts.defender,roll,mode,id),checks=[ac,...(dc?[dc]:[])];
 let hit=successful(ac.outcome),evaded=false;
 const entitlement=differential(ac.outcome,dc?.outcome??'failure');
 let effect=null;
 if(mode==='evade'){evaded=opposed(ac,dc)==='defender';hit=hit&&!evaded;b.state.prone=true;if(entitlement.side==='defender'&&entitlement.count>0){b.state.prone=false;effect='Arise (recupera postura)'}}
 // Other entitlements are intentionally not applied: the full effect catalogue is not ready.
 let damage=null,wound=null;
 if(hit){
  const dieLocation=roll(20),l=b.locations.find(x=>dieLocation>=x.from&&dieLocation<=x.to),weaponDice=rollDice(aw.damage,roll),modDice=rollDice(a.damageModifier,roll),modifier=sum(modDice)*a.damageModifier.sign,raw=Math.max(0,sum(weaponDice)+aw.damage.bonus+modifier),afterParry=mode==='parry'?parryDamage(raw,aw.size,bw.size,dc.outcome):raw,armor=armorAt(b,l.id),net=Math.max(0,afterParry-armor),before=l.hp;
  l.hp-=net;
  damage={location:l.name,locationId:l.id,dieLocation,weaponDice,weaponBonus:aw.damage.bonus,modifier,modDice,raw,afterParry,parryFormula:mode==='parry'?aw.size+' vs '+bw.size+' · '+raw+' → '+afterParry:mode==='evade'?'Esquiva no evita el impacto':'Sin parada',armor,net,before,after:l.hp,formula:'max(0, '+afterParry+' − '+armor+') = '+net,weaponFormula:weaponDice.join(' + ')+' + '+aw.damage.bonus+' + ('+modifier+') = '+raw};
  if(net>0){
   const severity=l.hp<=-l.maxHp?'major':l.hp<=0?'serious':'minor';wound={severity,location:l.name};
   if(severity!=='minor'){
    const ep=conditionProfile(b,'endurance','resist'),ec=check(b,ep,ep.target,roll,'wound-endurance',id);checks.push(ec);
    const resisted=opposed(ac,ec)==='defender';wound.resisted=resisted;
    if(severity==='major'){l.disabled=true;b.state.incapacitated=true;b.state.prone=true;if(l.vital||!resisted)b.state.unconscious=true;wound.effect='Incapacitación; seguimiento de muerte/curación pendiente'}
    else{b.state.stunTurns=Math.max(b.state.stunTurns,roll(3));wound.stunTurns=b.state.stunTurns;
     if(!resisted){if(l.limb){l.disabled=true;if(!l.id.includes('arm'))b.state.prone=true;wound.effect='Extremidad inutilizada'}else if(l.vital){b.state.unconscious=true;b.state.incapacitated=true;wound.effect='Inconsciencia'}}}
   }
  }
 }
 return {attacker:a,defender:b,checks,attack:ac,defenseCheck:dc,defense:mode,evaded,damage,wound,entitlement,effect,cost:{attack:1,defense:dc?1:0},blocked:[]};
}
// Restricted encounter: already engaged, no distance changes, one active weapon, no full effects catalog.
// Each round refreshes AP, then each side takes one proactive turn in initiative order per cycle.
export function simulateDuel(a0,b0,{seed='demo-001',maxRounds=12,roll=labRoller(seed),trace=true}={}){
 if(a0.id===b0.id||!Number.isInteger(maxRounds)||maxRounds<1||maxRounds>100)throw Error('Configuración de duelo inválida');
 let actors=[clone(validateSheet(a0)),clone(validateSheet(b0))],events=[],round=0,counts={attacks:0,success:0,damage:[0,0],wounds:[0,0]},elapsed=0;
 const initiativeDice=[roll(10),roll(10)],initiative=actors.map((s,i)=>conditionProfile(s).initiative+initiativeDice[i]),order=initiative[0]>=initiative[1]?[0,1]:[1,0];
 let winner=null,outcome='unresolved',effort=[0,0];
 for(round=1;round<=maxRounds;round++){
  if(actors.some(s=>s.state.fear==='flee'||isOut(s)))break;
  let ap=actors.map(s=>conditionProfile(s).ap);
  for(let cycle=0;cycle<12&&ap.some(x=>x>0);cycle++){
   let progress=false;
   for(const i of order){const j=1-i;if(actors.some(isOut))break;if(ap[i]<=0)continue;
    let s=actors[i];const id='r'+round+'c'+cycle+'a'+i;
    if(s.state.prone&&!s.state.stunTurns&&conditionProfile(s,'athletics','stand').move>0){s.state.prone=false;ap[i]--;progress=true;if(trace)events.push({round,actor:s.name,kind:'stand',message:'Recupera la postura',ap:[...ap]});continue}
    const p=conditionProfile(s);
    if(!p.legal){if(s.state.stunTurns>0)s.state.stunTurns--;ap[i]--;progress=true;if(trace)events.push({round,actor:s.name,kind:'wait',message:p.blocked.join('; '),ap:[...ap]});continue}
    // Reserve final AP while opponent can attack, unless both are waiting. Reactive budget remains real.
    if(ap[i]===1&&ap[j]>1&&cycle===0)continue;
    const r=exchange(s,actors[j],{roll,id,defenseAvailable:ap[j]>0});actors[i]=r.attacker;actors[j]=r.defender;ap[i]-=r.cost.attack;ap[j]-=r.cost.defense;progress=true;counts.attacks++;counts.success+=Number(successful(r.attack.outcome));counts.damage[i]+=r.damage?.net??0;counts.wounds[i]+=Number(r.wound?.severity==='serious'||r.wound?.severity==='major');
    if(trace){const {attacker,defender,...details}=r;events.push({round,actor:s.name,target:actors[j].name,kind:'exchange',ap:[...ap],...details})}
    if(actors.some(isOut))break;
   }
   if(!progress||actors.some(isOut))break;
  }
  elapsed+=5;
  if(actors.some(isOut))break;
  for(let i=0;i<2;i++){
   const s=actors[i];if(s.state.fear==='shaken')s.state.fear='none'; // initial fear outcome lasts one round in this lab
   if(s.state.bleeding)s.state.fatigue=Math.min(9,s.state.fatigue+1);
   effort[i]+=5;
   if(effort[i]>=Math.ceil(s.attributes.CON/5)*5){effort[i]=0;const p=conditionProfile(s,'endurance','resist'),c=check(s,p,p.target,roll,'fatigue','r'+round);if(!successful(c.outcome))s.state.fatigue=Math.min(9,s.state.fatigue+1);if(trace)events.push({round,actor:s.name,kind:'fatigue',checks:[c],message:'Fatiga: '+conditionProfile(s).fatigueLabel})}
  }
  if(actors.some(isOut))break;
 }
 const losers=actors.map(s=>isOut(s)||s.state.fear==='flee');
 if(losers[0]&&losers[1])outcome='draw';else if(losers[0]||losers[1]){winner=actors[losers[0]?1:0].id;outcome=actors[losers[0]?0:1].state.fear==='flee'?'withdrawal':'incapacitation'}
 return {mode:'restricted-lab',seed,rounds:Math.ceil(elapsed/5),elapsed,initiativeDice,initiative,winner,outcome,actors,events,counts};
}
export function runBatch(a,b,{count=1000,seed='batch-001',maxRounds=12}={}){
 if(!Number.isInteger(count)||count<1||count>10000)throw Error('Muestra inválida');
 const totals={a:0,b:0,draw:0,unresolved:0,rounds:0,attacks:0,success:0,damage:[0,0]};
 for(let i=0;i<count;i++){const r=simulateDuel(a,b,{seed:seed+':'+i,maxRounds,trace:false});totals[r.winner===a.id?'a':r.winner===b.id?'b':r.outcome==='draw'?'draw':'unresolved']++;totals.rounds+=r.rounds;totals.attacks+=r.counts.attacks;totals.success+=r.counts.success;totals.damage[0]+=r.counts.damage[0];totals.damage[1]+=r.counts.damage[1]}
 return {count,totals,meanRounds:totals.rounds/count,attackSuccess:totals.attacks?totals.success/totals.attacks:0};
}
