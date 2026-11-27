// Mythras full pp.41,110: localized wound consequences; no story or wall-clock.
const ok=(v,m)=>{if(!v)throw Error(m)};
export const healingRate=s=>Math.ceil(s.attributes.CON/6);
export const isDead=s=>s.state.dead===true||s.state.fatigue===9;
export function markDead(s){s.state.dead=true;s.state.incapacitated=true;s.state.unconscious=true;s.state.prone=true;}
export function woundAfterHit(s,{id,locationId,net,resisted,stunTurns=0,limbLifeThreat,roundSeconds,bleeding=false}){
 const l=s.locations.find(x=>x.id===locationId);ok(l&&Number.isInteger(net)&&net>0,'Invalid wound');
 const severity=l.hp<=-l.maxHp?'major':l.hp<=0?'serious':'minor';
 const wound={id,locationId,location:l.name,severity,netDamage:net,resisted,bleeding,treated:false,stabilized:false,remainingSeconds:null};
 s.state.wounds??=[];ok(!s.state.wounds.some(w=>w.id===id),'Duplicate wound id');
 if(severity==='major'){
  ok(typeof resisted==='boolean'&&typeof limbLifeThreat==='boolean'&&Number.isInteger(roundSeconds)&&roundSeconds>0,'Missing major wound context');
  l.disabled=true;s.state.incapacitated=true;s.state.prone=true;
  if(l.vital||!resisted)s.state.unconscious=true;
  if(l.vital&&!resisted){markDead(s);wound.effect='death';}
  else if(l.vital||limbLifeThreat){wound.remainingSeconds=l.vital?2*healingRate(s)*roundSeconds:5*healingRate(s)*60;wound.effect='life-threatening';}
  else wound.effect='incapacitation';
 }else if(severity==='serious'){
  ok(typeof resisted==='boolean'&&Number.isInteger(stunTurns)&&stunTurns>=1&&stunTurns<=3,'Missing serious wound rolls');
  s.state.stunTurns=Math.max(s.state.stunTurns,stunTurns);wound.stunTurns=stunTurns;
  if(!resisted&&l.limb){l.disabled=true;if(!l.id.includes('arm'))s.state.prone=true;wound.effect='disabled-location'}
  if(!resisted&&l.vital){s.state.unconscious=true;s.state.incapacitated=true;wound.unconsciousSeconds=net*60;wound.effect='unconscious'}
 }
 if(bleeding)s.state.bleeding=true;s.state.wounds.push(wound);return wound;
}
// Explicit simulated elapsed time, not a realtime timer. Caller decides when time advances.
export function advanceTrauma(s,seconds,{pausedWoundId=null}={}){
 ok(Number.isSafeInteger(seconds)&&seconds>=0,'Invalid elapsed time');
 if(isDead(s)){markDead(s);return s}
 for(const w of s.state.wounds??[]){
  if(w.id===pausedWoundId||w.stabilized||w.remainingSeconds===null)continue;
  w.remainingSeconds=Math.max(0,w.remainingSeconds-seconds);
  if(w.remainingSeconds===0)markDead(s);
 }
 return s;
}
