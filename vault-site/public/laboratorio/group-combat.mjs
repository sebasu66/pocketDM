// Group scheduler. Reuses the existing attack, defense, wound and reach rules.
// No narrative decisions: sides, target preference, initial reach and circumstances are master inputs.
import {validateSheet} from './character-sheet.mjs';
import {conditionProfile} from './conditions.mjs';
import {isDead,advanceTrauma} from './trauma.mjs';
import {exchange,continueGrip,combatCheck} from './duel.mjs';
import {engagement,rangeProfile,preferredPosition,changeRange,canChangeRange,gripValid,struggle} from './engagement.mjs';
import {successful,GRADES} from './percentile.mjs';
const ok=(v,m)=>{if(!v)throw Error(m)};
const clone=structuredClone;
const out=s=>isDead(s)||s.state.incapacitated||s.state.unconscious||s.state.fatigue>=6;
const pair=(a,b)=>JSON.stringify([a,b].sort());
export function simulateGroup(participants,{roll,id,maxRounds,initialRange,surprisedIds,limbLifeThreat}){
 ok(Array.isArray(participants)&&participants.length>=2&&participants.length<=20,'Expected 2–20 combatants');
 ok(typeof roll==='function'&&typeof id==='string'&&id&&Number.isInteger(maxRounds)&&maxRounds>=1&&maxRounds<=100,'Missing encounter preparation');
 ok(['long','short'].includes(initialRange)&&typeof limbLifeThreat==='boolean'&&Array.isArray(surprisedIds),'Explicit encounter circumstances required');
 const actors=participants.map(p=>clone(validateSheet(p.character))),ids=actors.map(s=>s.id),index=new Map(ids.map((id,i)=>[id,i]));
 ok(index.size===actors.length,'Duplicate combatant');
 const sides=participants.map(p=>p.side);
 ok(sides.every(s=>typeof s==='string'&&s.length>0)&&new Set(sides).size>=2,'At least two distinct sides required');
 for(let i=0;i<actors.length;i++){
  const p=participants[i];
  ok(p.difficulty&&Object.hasOwn(GRADES,p.difficulty.attack)&&Object.hasOwn(GRADES,p.difficulty.defense),'Each combatant requires attack/defense difficulty');
  ok(['auto','parry','evade','none'].includes(p.defense),'Each combatant requires defense preference');
  ok(Array.isArray(p.targetPriority)&&new Set(p.targetPriority).size===p.targetPriority.length&&p.targetPriority.every(id=>index.has(id)&&sides[index.get(id)]!==sides[i]),'Invalid target priority');
 }
 ok(surprisedIds.every(id=>index.has(id)),'Unknown surprised actor');
 const contexts=new Map();
 for(let i=0;i<actors.length;i++)for(let j=i+1;j<actors.length;j++)if(sides[i]!==sides[j])contexts.set(pair(ids[i],ids[j]),engagement(actors[i],actors[j],initialRange));
 const events=[],initiativeDice=ids.map(id=>roll(10,'initiative.'+id,0)),initiative=actors.map((s,i)=>conditionProfile(s).initiative+initiativeDice[i]-(surprisedIds.includes(s.id)?10:0));
 // Explicit stable tie-break for this provisional sequential scheduler (not simultaneous tie resolution).
 const order=ids.map((_,i)=>i).sort((a,b)=>initiative[b]-initiative[a]||ids[a].localeCompare(ids[b]));
 const active=i=>!out(actors[i]);
 const activeSides=()=>new Set(sides.filter((_,i)=>active(i)));
 const flat=new Set(surprisedIds),firstAttack=new Set(surprisedIds);
 let elapsed=0,round=0,pausedForWithdrawal=false,ap=actors.map(()=>0);
 const effort=actors.map(()=>0),counts={attacks:0,success:0,damage:actors.map(()=>0),wounds:actors.map(()=>0),rangeChanges:0,grips:0,escapes:0,gripTicks:0};
 const record=(i,kind,details={})=>events.push({round,actorId:ids[i],actor:actors[i].name,kind,...details,ap:[...ap]});
 const hurt=(i,r)=>{counts.damage[i]+=r.damage?.net??0;counts.wounds[i]+=Number(['serious','major'].includes(r.wound?.severity))};
 const clearGrips=()=>{for(const ctx of contexts.values())if(ctx.grip&&!gripValid(ctx,actors))ctx.grip=null};
 const gripFor=id=>[...contexts.values()].find(c=>c.grip&&(c.grip.ownerId===id||c.grip.targetId===id));
 const choose=i=>{
  const candidates=order.filter(j=>active(j)&&sides[j]!==sides[i]);
  const preferred=participants[i].targetPriority.map(id=>index.get(id)).find(j=>candidates.includes(j));
  return preferred??candidates[0];
 };
 outer:for(round=1;round<=maxRounds&&activeSides().size>1;round++){
  if(actors.some((s,i)=>active(i)&&s.state.fear==='flee')){pausedForWithdrawal=true;break}
  ap=actors.map((s,i)=>active(i)?conditionProfile(s).ap:0);
  // AP bounds this loop; each turn spends one AP or explicitly skips a combatant.
  for(let cycle=0;ap.some(n=>n>0)&&activeSides().size>1;cycle++){
   let progressed=false;
   for(const i of order){
    if(!active(i)){ap[i]=0;continue}
    flat.delete(ids[i]);if(ap[i]<=0)continue;
    if(activeSides().size<=1)break;
    if(actors.some((s,k)=>active(k)&&s.state.fear==='flee')){pausedForWithdrawal=true;break outer}
    clearGrips();let s=actors[i],j=choose(i);const ownGrip=gripFor(s.id);
    if(ownGrip)j=index.get(ownGrip.grip.ownerId===s.id?ownGrip.grip.targetId:ownGrip.grip.ownerId);
    if(j===undefined||!active(j)){ap[i]=0;continue}
    const other=actors[j],ctx=contexts.get(pair(s.id,other.id)),turn=id+'.r'+round+'.c'+cycle+'.'+s.id;
    const target={targetId:other.id,target:other.name},check=(actor,p,t,role)=>combatCheck(actor,p,t,roll,role,turn);
    const spend=()=>{ap[i]--;progressed=true};
    if(round===1&&surprisedIds.includes(s.id)){spend();record(i,'wait',{message:'Sorpresa: sin acción ofensiva'});continue}
    if(ownGrip?.grip.targetId===s.id){
     const r=struggle(s,other,ownGrip,check);spend();if(r.released){ownGrip.grip=null;counts.escapes++}
     if(s.state.stunTurns>0)s.state.stunTurns--;record(i,'struggle',{...target,checks:r.checks,message:r.message});continue;
    }
    if(s.state.prone&&!s.state.stunTurns&&conditionProfile(s,'athletics','stand').move>0){s.state.prone=false;spend();record(i,'stand',{message:'Recupera la postura'});continue}
    const p=conditionProfile(s);
    if(!p.legal){if(s.state.stunTurns>0)s.state.stunTurns--;spend();record(i,'wait',{message:p.blocked.join('; ')});continue}
    if(ownGrip?.grip.ownerId===s.id){
     const r=continueGrip(s,other,ownGrip.grip,{roll,id:turn,limbLifeThreat});actors[i]=r.attacker;actors[j]=r.defender;spend();counts.gripTicks++;hurt(i,r);
     const {attacker,defender,...details}=r;record(i,'grip-damage',{...target,...details});continue;
    }
    const desired=preferredPosition(s,other,ctx.position),rp=rangeProfile(s,other,ctx.position),otherHeld=!!gripFor(other.id);
    if(desired!==ctx.position&&canChangeRange(s,ctx)){
     const r=changeRange(s,other,ctx,{resist:ap[j]>0&&!flat.has(other.id)&&!otherHeld,check,desired});
     if(r.cost[0]){ap[i]-=r.cost[0];ap[j]-=r.cost[1];progressed=true;if(r.changed){ctx.position=r.position;counts.rangeChanges++}record(i,'range',{...target,checks:r.checks,message:r.message,position:ctx.position});continue}
    }
    if(rp.tooFar){spend();record(i,'wait',{...target,message:'Fuera de alcance'});continue}
    // An actor held by a third party cannot evade or gain a second simultaneous grip.
    const defense=otherHeld&&participants[j].defense==='auto'?'parry':otherHeld&&participants[j].defense==='evade'?'none':participants[j].defense;
    const r=exchange(s,other,{roll,id:turn,defense,defenseAvailable:ap[j]>0&&!flat.has(other.id),context:ctx,surpriseBonus:firstAttack.has(other.id),limbLifeThreat,attackDifficulty:participants[i].difficulty.attack,defenseDifficulty:participants[j].difficulty.defense,allowGrip:!otherHeld});
    if(!r.cost.attack){spend();record(i,'wait',{...target,message:r.blocked.join('; ')});continue}
    firstAttack.delete(other.id);actors[i]=r.attacker;actors[j]=r.defender;ap[i]-=r.cost.attack;ap[j]-=r.cost.defense;progressed=true;counts.attacks++;counts.success+=Number(successful(r.attack.outcome));hurt(i,r);
    if(r.rangeChange&&r.rangeChange!==ctx.position){ctx.position=r.rangeChange;counts.rangeChanges++}
    if(r.newGrip){ctx.grip=r.newGrip;counts.grips++}
    if(!active(j))ap[j]=0;
    const {attacker,defender,...details}=r;record(i,'exchange',{...target,...details});
   }
   if(!progressed)break;
  }
  elapsed+=5;flat.clear();firstAttack.clear();
  for(let i=0;i<actors.length;i++){
   const s=actors[i];advanceTrauma(s,5);
   if(!active(i))continue;
   if(s.state.fear==='shaken')s.state.fear='none';
   if(s.state.bleeding)s.state.fatigue=Math.min(9,s.state.fatigue+1);
   effort[i]+=5;
   if(effort[i]>=Math.ceil(s.attributes.CON/5)*5&&active(i)){effort[i]=0;const p=conditionProfile(s,'endurance','resist'),c=combatCheck(s,p,p.target,roll,'fatigue',id+'.r'+round);if(!successful(c.outcome))s.state.fatigue=Math.min(9,s.state.fatigue+1);record(i,'fatigue',{checks:[c]})}
  }
 }
 clearGrips();
 const remaining=[...activeSides()],winningSide=remaining.length===1?remaining[0]:null;
 const withdrawalRequested=actors.filter((s,i)=>active(i)&&s.state.fear==='flee').map(s=>s.id);
 const outcome=winningSide?'victory':remaining.length===0?'draw':pausedForWithdrawal?'withdrawal-pending':'unresolved';
 return {mode:'tactical-group-v1',actorIds:ids,sides,actors,initiativeDice,initiative,order:order.map(i=>ids[i]),rounds:Math.ceil(elapsed/5),elapsed,winningSide,winner:winningSide&&ids.filter((_,i)=>active(i)&&sides[i]===winningSide).length===1?ids.find((_,i)=>active(i)&&sides[i]===winningSide):null,outcome,withdrawalRequested,events,counts,engagements:[...contexts].map(([key,c])=>({actorIds:JSON.parse(key),...clone(c)}))};
}
