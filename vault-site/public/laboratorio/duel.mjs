import {validateSheet,equipped,armorAt} from './character-sheet.mjs';
import {conditionProfile} from './conditions.mjs';
import {woundAfterHit,advanceTrauma,isDead} from './trauma.mjs';
import {GRADES,effectiveSkill,gradeOf,opposed,differential,contestTargets,parryDamage,successful} from './percentile.mjs';
import {engagement,rangeProfile,preferredPosition,changeRange,canChangeRange,chooseExposedLocation,gripValid,struggle} from './engagement.mjs';
const clone=structuredClone;
const labels={'very-easy':'Muy facil',easy:'Facil',standard:'Estándar',hard:'Difícil',formidable:'Formidable',herculean:'Hercúlea'};
export function labRoller(seed){let h=2166136261;for(const c of String(seed))h=Math.imul(h^c.charCodeAt(0),16777619);return sides=>{h=(h+0x6D2B79F5)|0;let t=Math.imul(h^(h>>>15),1|h);t^=t+Math.imul(t^(t>>>7),61|t);return 1+Math.floor(((t^(t>>>14))>>>0)/4294967296*sides)}}
const rollDice=(d,roll,purpose)=>Array.from({length:d.count},(_,i)=>roll(d.sides,purpose,i));
const sum=xs=>xs.reduce((n,x)=>n+x,0);
const isOut=s=>isDead(s)||s.state.incapacitated||s.state.unconscious||s.state.fatigue>=6;
function check(s,p,target,roll,role,id){const value=roll(100,id+'.'+role+'.'+s.id,0);return {schemaVersion:1,id:id+'.'+role+'.'+s.id,actorId:s.id,actorName:s.name,skillId:p.skill==='combat'?s.style.id:p.skill,skillName:p.skill==='combat'?s.style.name:p.skill,base:p.base,target,difficulty:labels[p.grade]??'Bloqueada',reason:p.mods.map(m=>m.reason).join('; ')||'Sin modificadores',dice:'D100',roll:value,outcome:gradeOf(value,target),visibility:'player',source:'pocketdm-lab-v1',role,formula:p.base+' × '+(p.grade==='hard'?'2/3':p.grade==='formidable'?'1/2':p.grade==='herculean'?'1/10':String(p.factor))+' → '+p.target+(target!==p.target?' → '+target+' (oposición)':''),modifiers:p.mods};}
export {check as combatCheck};
const grades=['very-easy','easy','standard','hard','formidable','herculean'];
function contextualProfile(s,p,base){
 if(!Object.hasOwn(GRADES,base))throw Error('Invalid combat difficulty');
 const i=grades.indexOf(base),mods=p.mods.filter(m=>m.source!=='encumbrance'),steps=p.load==='burdened'?1:['overloaded','excess'].includes(p.load)?2:0;
 if(steps&&['combat','evade'].includes(p.skill))mods.push({source:'encumbrance',grade:grades[Math.min(5,i+steps)],reason:'Load +'+steps+' difficulty grades'});
 const g=p.grade==='blocked'?'blocked':grades[Math.max(i,...mods.filter(m=>m.grade!=='standard').map(m=>grades.indexOf(m.grade)))];
 if(base!=='standard')mods.push({source:'master',grade:base,reason:'Master scene difficulty: '+base});
 return {...p,mods,grade:g,factor:GRADES[g]??0,target:g==='blocked'?0:effectiveSkill(p.base,g)};
}
function damageResolution(a,b,{aw,bw,mode,dc,ac,roll,id,locationId=null,checks,limbLifeThreat=false,roundSeconds=5}){
 const dieLocation=locationId?null:roll(20,id+'.hit-location',0),l=locationId?b.locations.find(x=>x.id===locationId):b.locations.find(x=>dieLocation>=x.from&&dieLocation<=x.to);
 const weaponDice=rollDice(aw.damage,roll,id+'.weapon-damage'),modDice=rollDice(a.damageModifier,roll,id+'.damage-modifier'),modifier=sum(modDice)*a.damageModifier.sign,raw=Math.max(0,sum(weaponDice)+aw.damage.bonus+modifier),afterParry=mode==='parry'?parryDamage(raw,aw.size,bw.size,dc.outcome):raw,armor=armorAt(b,l.id),net=Math.max(0,afterParry-armor),before=l.hp;
 l.hp-=net;
 const damage={location:l.name,locationId:l.id,dieLocation,weaponDice,weaponBonus:aw.damage.bonus,modifier,modDice,raw,afterParry,parryFormula:mode==='parry'?aw.size+' vs '+bw.size+' · '+raw+' → '+afterParry:mode==='evade'?'Esquiva no evita el impacto':'Sin parada',armor,net,before,after:l.hp,formula:'max(0, '+afterParry+' − '+armor+') = '+net,weaponFormula:weaponDice.join(' + ')+' + '+aw.damage.bonus+' + ('+modifier+') = '+raw};
 let wound=null;
 if(net>0){
  const severity=l.hp<=-l.maxHp?'major':l.hp<=0?'serious':'minor';
  let resisted=null,stunTurns=0;
  if(severity!=='minor'){
   const ep=conditionProfile(b,'endurance','resist'),ec=check(b,ep,ep.target,roll,'wound-endurance',id);checks.push(ec);
   resisted=opposed(ac,ec)==='defender';if(severity==='serious')stunTurns=roll(3,id+'.stun-turns',0);
  }
  wound=woundAfterHit(b,{id:id+'.wound',locationId:l.id,net,resisted,stunTurns,limbLifeThreat,roundSeconds});
  if(severity!=='minor'){wound.opposedAgainst=ac.id;wound.referenceRoll=ac.roll;}
 }
 return {damage,wound};
}
export function exchange(attacker,defender,{roll,id='exchange',defense='auto',defenseAvailable=true,context=null,surpriseBonus=false,limbLifeThreat=false,roundSeconds=5,attackDifficulty='standard',defenseDifficulty='standard',allowGrip=true}={}){
 const a=clone(validateSheet(attacker)),b=clone(validateSheet(defender)),p=contextualProfile(a,conditionProfile(a),attackDifficulty),ar=context?rangeProfile(a,b,context.position):null,br=context?rangeProfile(b,a,context.position):null,aw=ar?.weapon??equipped(a),bw=equipped(b);
 if(!p.legal||ar?.tooFar)return {attacker:a,defender:b,blocked:ar?.tooFar?[...p.blocked,'Fuera del alcance directo']:p.blocked,checks:[],damage:null,entitlement:null,defense:'none',cost:{attack:0,defense:0},effects:[]};
 let mode=defense==='auto'?(bw.natural||br?.cramped?'evade':'parry'):defense;
 if(mode==='parry'&&br?.cramped)mode='none';
 // A held victim cannot evade by moving away. It can still defend with a legal weapon.
 if(context?.grip?.targetId===b.id&&mode==='evade')mode='none';
 let q=contextualProfile(b,conditionProfile(b,mode==='evade'?'evade':'combat',mode),defenseDifficulty);
 if(!q.legal||!defenseAvailable||mode==='none')mode='none';
 const ts=mode==='none'?{attacker:p.target,defender:null,penalty:0}:contestTargets(p.target,q.target);
 const ac=check(a,p,ts.attacker,roll,'attack',id),dc=mode==='none'?null:check(b,q,ts.defender,roll,mode,id),checks=[ac,...(dc?[dc]:[])];
 let hit=successful(ac.outcome),evaded=false;
 const entitlement=differential(ac.outcome,dc?.outcome??'failure'),effects=[];
 const surpriseEffect=surpriseBonus&&successful(ac.outcome)?1:0;
 if(surpriseEffect&&entitlement.side!=='defender'){entitlement.side='attacker';entitlement.count+=1;}
 let effect=null,rangeChange=null,newGrip=null,locationId=null;
 if(mode==='evade'){evaded=opposed(ac,dc)==='defender';hit=hit&&!evaded;b.state.prone=true;if(entitlement.side==='defender'&&entitlement.count>0){b.state.prone=false;effect='Arise (recupera postura)';effects.push({id:'arise',actorId:b.id})}}
 // Effect selection precedes damage; unused entitlement remains visible.
 let wantGrip=false;
 if(context&&entitlement.count){
  const winner=entitlement.side==='attacker'?a:b,loser=winner===a?b:a,wp=rangeProfile(winner,loser,context.position);
  let budget=entitlement.count-effects.length;
  if(budget>0&&!context.grip&&wp.relevant&&preferredPosition(winner,loser,context.position)!==context.position&&canChangeRange(winner,context)){
   rangeChange=preferredPosition(winner,loser,context.position);effects.push({id:rangeChange==='short'?'close-range':'open-range',actorId:winner.id});budget--;
  }
  if(allowGrip&&hit&&winner===a&&a.speciesId==='wolf'&&budget>0&&!context.grip&&!ar.tooFar){
   wantGrip=true;budget--; // In this lab, a bite must penetrate armour to establish a hold.
  }
  if(hit&&winner===a&&a.speciesId==='wolf'&&budget>0){
   const l=chooseExposedLocation(b,a);if(l){locationId=l.id;effects.push({id:'choose-location',actorId:a.id,locationId});budget--}
  }
 }
 const resolved=hit?damageResolution(a,b,{aw,bw,mode,dc,ac,roll,id,locationId,checks,limbLifeThreat,roundSeconds}):{damage:null,wound:null};
 if(wantGrip&&resolved.damage?.net>0&&!isOut(b)){
  newGrip={ownerId:a.id,targetId:b.id,weaponId:aw.id,locationId:resolved.damage.locationId,attack:clone(ac)};
  effects.push({id:'grip',actorId:a.id,locationId:newGrip.locationId});rangeChange='short';
 }
 return {attacker:a,defender:b,checks,attack:ac,defenseCheck:dc,defense:mode,evaded,...resolved,entitlement,surpriseEffect,effect,effects,rangeChange,newGrip,range:context?{position:context.position,cramped:ar.cramped,weaponSize:aw.size,weaponDice:aw.damage}:null,cost:{attack:1,defense:dc?1:0},blocked:[]};
}
// The bite remains in the same location. One proactive AP per continuation; no fresh hit roll.
// The initial opposed attack is retained for wound resistance. Armour still applies in this profile.
export function continueGrip(owner,victim,grip,{roll,id='grip',limbLifeThreat=false,roundSeconds=5}){const a=clone(owner),b=clone(victim),checks=[];
 const result=damageResolution(a,b,{aw:equipped(a),bw:equipped(b),mode:'none',dc:null,ac:grip.attack,roll,id,locationId:grip.locationId,checks,limbLifeThreat,roundSeconds});
 return {attacker:a,defender:b,checks,...result,referenceAttackId:grip.attack.id,referenceAttackRoll:grip.attack.roll};
}
export function simulateDuel(a0,b0,{seed='demo-001',maxRounds=12,roll=labRoller(seed),trace=true,tactical=false,initialRange='long',surprisedIds=[],limbLifeThreat=false,roundSeconds=5,eventPrefix='',combatDifficulties=null}={}){
 if(!Array.isArray(surprisedIds)||surprisedIds.some(id=>![a0.id,b0.id].includes(id))||!Number.isInteger(roundSeconds)||roundSeconds<=0)throw Error('Invalid encounter context');
 if(a0.id===b0.id||!Number.isInteger(maxRounds)||maxRounds<1||maxRounds>100)throw Error('Configuración de duelo inválida');
 let actors=[clone(validateSheet(a0)),clone(validateSheet(b0))],events=[],round=0,counts={attacks:0,success:0,damage:[0,0],wounds:[0,0],rangeChanges:0,grips:0,escapes:0,gripTicks:0},elapsed=0;
 const context=tactical?engagement(a0,b0,initialRange):null;
 const initiativeDice=[roll(10,'initiative.'+actors[0].id,0),roll(10,'initiative.'+actors[1].id,0)],initiative=actors.map((s,i)=>conditionProfile(s).initiative+initiativeDice[i]-(surprisedIds.includes(s.id)?10:0)),order=initiative[0]>=initiative[1]?[0,1]:[1,0];
 let winner=null,outcome='unresolved',effort=[0,0];const flatFooted=new Set(surprisedIds),firstAttack=new Set(surprisedIds);
 const record=(e)=>{if(trace)events.push(e)};
 const recordDamage=(i,r)=>{counts.damage[i]+=r.damage?.net??0;counts.wounds[i]+=Number(r.wound?.severity==='serious'||r.wound?.severity==='major')};
 for(round=1;round<=maxRounds;round++){
  if(actors.some(s=>s.state.fear==='flee'||isOut(s)))break;
  let ap=actors.map(s=>conditionProfile(s).ap);
  for(let cycle=0;cycle<12&&ap.some(x=>x>0);cycle++){
   let progress=false;
   for(const i of order){const j=1-i;if(actors.some(isOut))break;if(ap[i]<=0)continue;
    let s=actors[i],other=actors[j];const id=eventPrefix+'r'+round+'c'+cycle+'a'+i;
    flatFooted.delete(s.id);
    if(round===1&&surprisedIds.includes(s.id)){ap[i]--;progress=true;record({round,actor:s.name,kind:'wait',message:'Sorpresa: sin accion ofensiva',ap:[...ap]});continue;}
    if(context?.grip&&!gripValid(context,actors))context.grip=null;
    const localCheck=(actor,p,target,role)=>check(actor,p,target,roll,role,id);
    if(context?.grip?.targetId===s.id){
     const r=struggle(s,other,context,localCheck);ap[i]--;progress=true;if(r.released){context.grip=null;counts.escapes++}
     if(s.state.stunTurns>0)s.state.stunTurns--;
     record({round,actor:s.name,target:other.name,kind:'struggle',message:r.message,checks:r.checks,ap:[...ap]});continue;
    }
    if(s.state.prone&&!s.state.stunTurns&&conditionProfile(s,'athletics','stand').move>0){s.state.prone=false;ap[i]--;progress=true;record({round,actor:s.name,kind:'stand',message:'Recupera la postura',ap:[...ap]});continue}
    const p=conditionProfile(s);
    if(!p.legal){if(s.state.stunTurns>0)s.state.stunTurns--;ap[i]--;progress=true;record({round,actor:s.name,kind:'wait',message:p.blocked.join('; '),ap:[...ap]});continue}
    if(context?.grip?.ownerId===s.id){
     const r=continueGrip(s,other,context.grip,{roll,id,limbLifeThreat,roundSeconds});actors[i]=r.attacker;actors[j]=r.defender;ap[i]--;progress=true;counts.gripTicks++;recordDamage(i,r);
     const {attacker,defender,...details}=r;record({round,actor:s.name,target:other.name,kind:'grip-damage',message:'Mantiene la mordida',...details,ap:[...ap]});continue;
    }
    if(context){
     const desired=preferredPosition(s,other,context.position),rp=rangeProfile(s,other,context.position);
     if(desired!==context.position&&canChangeRange(s,context)){
      const r=changeRange(s,other,context,{resist:ap[j]>0&&!flatFooted.has(other.id),check:localCheck,desired});
      ap[i]-=r.cost[0];ap[j]-=r.cost[1];progress=true;if(r.changed){context.position=r.position;counts.rangeChanges++}
      record({round,actor:s.name,target:other.name,kind:'range',message:r.message,checks:r.checks,ap:[...ap],position:context.position});continue;
     }
     if(rp.tooFar){ap[i]--;progress=true;record({round,actor:s.name,kind:'wait',message:'No puede alcanzar al rival',ap:[...ap]});continue}
    }
    if(ap[i]===1&&ap[j]>1&&cycle===0)continue;
    const r=exchange(s,actors[j],{roll,id,defenseAvailable:ap[j]>0&&!flatFooted.has(other.id),context,surpriseBonus:firstAttack.has(other.id),limbLifeThreat,roundSeconds,attackDifficulty:combatDifficulties?.[s.id]?.attack??'standard',defenseDifficulty:combatDifficulties?.[other.id]?.defense??'standard'});if(r.attack)firstAttack.delete(other.id);actors[i]=r.attacker;actors[j]=r.defender;ap[i]-=r.cost.attack;ap[j]-=r.cost.defense;progress=true;counts.attacks+=Number(!!r.attack);counts.success+=Number(successful(r.attack?.outcome));recordDamage(i,r);
    if(context&&r.rangeChange&&context.position!==r.rangeChange){context.position=r.rangeChange;counts.rangeChanges++}
    if(context&&r.newGrip){context.grip=r.newGrip;counts.grips++}
    if(trace){const {attacker,defender,...details}=r;events.push({round,actor:s.name,target:actors[j].name,kind:'exchange',ap:[...ap],...details})}
    if(actors.some(isOut))break;
   }
   if(!progress||actors.some(isOut))break;
  }
  elapsed+=roundSeconds;
  for(const s of actors)advanceTrauma(s,roundSeconds);
  flatFooted.clear();firstAttack.clear();
  if(actors.some(isOut))break;
  for(let i=0;i<2;i++){
   const s=actors[i];if(s.state.fear==='shaken')s.state.fear='none';
   if(s.state.bleeding)s.state.fatigue=Math.min(9,s.state.fatigue+1);
   effort[i]+=5;
   if(effort[i]>=Math.ceil(s.attributes.CON/5)*5){effort[i]=0;const p=conditionProfile(s,'endurance','resist'),c=check(s,p,p.target,roll,'fatigue',eventPrefix+'r'+round);if(!successful(c.outcome))s.state.fatigue=Math.min(9,s.state.fatigue+1);record({round,actor:s.name,kind:'fatigue',checks:[c],message:'Fatiga: '+conditionProfile(s).fatigueLabel})}
  }
  if(actors.some(isOut))break;
 }
 const losers=actors.map(s=>isOut(s)||s.state.fear==='flee');
 if(losers[0]&&losers[1])outcome='draw';else if(losers[0]||losers[1]){winner=actors[losers[0]?1:0].id;outcome=actors[losers[0]?0:1].state.fear==='flee'?'withdrawal':isDead(actors[losers[0]?0:1])?'death':'incapacitation'}
 return {mode:tactical?'tactical-lab-v2':'restricted-lab',seed,rounds:Math.ceil(elapsed/roundSeconds),elapsed,initiativeDice,initiative,winner,outcome,withdrawalRequested:actors.filter(s=>s.state.fear==='flee').map(s=>s.id),actors,events,counts,engagement:context?{position:context.position,grip:gripValid(context,actors)?{ownerId:context.grip.ownerId,targetId:context.grip.targetId,locationId:context.grip.locationId}:null}:null};
}
export function runBatch(a,b,{count=1000,seed='batch-001',maxRounds=12,tactical=false,initialRange='long'}={}){
 if(!Number.isInteger(count)||count<1||count>10000)throw Error('Muestra inválida');
 const totals={a:0,b:0,draw:0,unresolved:0,rounds:0,attacks:0,success:0,damage:[0,0],rangeChanges:0,grips:0,escapes:0,gripTicks:0};
 for(let i=0;i<count;i++){const r=simulateDuel(a,b,{seed:seed+':'+i,maxRounds,trace:false,tactical,initialRange});totals[r.winner===a.id?'a':r.winner===b.id?'b':r.outcome==='draw'?'draw':'unresolved']++;totals.rounds+=r.rounds;totals.attacks+=r.counts.attacks;totals.success+=r.counts.success;totals.damage[0]+=r.counts.damage[0];totals.damage[1]+=r.counts.damage[1];for(const k of ['rangeChanges','grips','escapes','gripTicks'])totals[k]+=r.counts[k]}
 return {count,totals,meanRounds:totals.rounds/count,attackSuccess:totals.attacks?totals.success/totals.attacks:0,tactical,initialRange};
}
