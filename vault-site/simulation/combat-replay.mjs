// Mechanical trace for narrator/book. Only explicit combat-visible fields.
const pick=(o,keys)=>Object.fromEntries(keys.filter(k=>Object.hasOwn(o,k)).map(k=>[k,structuredClone(o[k])]));
export function projectCombatReplay(result,eventId){
 const ids=new Set(result.actors.map(a=>a.id)),checkIds=new Set(result.events.flatMap(e=>(e.checks??[]).map(c=>c.id)));
 const ref=id=>{if(!checkIds.has(id))throw Error('Unregistered combat check: '+id);return eventId+'.'+id};
 const turns=result.events.map((e,i)=>{
  if(!ids.has(e.actorId)||e.targetId&&!ids.has(e.targetId))throw Error('Unknown replay participant');
  const t={id:eventId+'.turn.'+i,sequence:i,...pick(e,['round','cycle','kind','actorId','targetId','weapon','defenseWeapon','defense','hit','evaded','damage','entitlement','surpriseEffect','effects','range','rangeChange','position','beforePosition','changed','released','cost','message','changes','ap'])};
  t.checkIds=(e.checks??[]).map(c=>ref(c.id));
  if(e.attack)t.attackCheckId=ref(e.attack.id);
  if(e.defenseCheck)t.defenseCheckId=ref(e.defenseCheck.id);
  if(e.referenceAttackId)t.referenceAttackId=ref(e.referenceAttackId);
  if(e.wound){t.wound=pick(e.wound,['id','locationId','location','severity','netDamage','resisted','bleeding','effect','stunTurns','unconsciousSeconds','remainingSeconds']);if(e.wound.opposedAgainst)t.wound.opposedAgainst=ref(e.wound.opposedAgainst)}
  if(e.newGrip)t.grip=pick(e.newGrip,['ownerId','targetId','weaponId','locationId']);
  return t;
 });
 return {schemaVersion:1,initialActors:structuredClone(result.initialActors),finalActors:structuredClone(result.finalActors),initiative:result.actors.map((a,i)=>({actorId:a.id,d10:result.initiativeDice[i],total:result.initiative[i]})),order:result.order,turns};
}
