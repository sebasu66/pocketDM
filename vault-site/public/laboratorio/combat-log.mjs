// Minimal observable state for an illustrated replay. Not a copy of the private character sheet.
import {equipped} from './character-sheet.mjs';
import {isDead} from './trauma.mjs';
export function weaponView(w){return {id:w.id,name:w.name,natural:!!w.natural,size:w.size,reach:w.reach}}
export function combatActorView(s){return {id:s.id,name:s.name,speciesId:s.speciesId,weapon:weaponView(equipped(s)),locations:s.locations.map(l=>({id:l.id,name:l.name,hp:l.hp,maxHp:l.maxHp,disabled:l.disabled})),state:{prone:s.state.prone,stunTurns:s.state.stunTurns,unconscious:s.state.unconscious,incapacitated:s.state.incapacitated,dead:isDead(s),fear:s.state.fear,fatigue:s.state.fatigue,bleeding:s.state.bleeding}}}
export function actorChanges(before,actors){
 const prior=new Map(before.map(s=>[s.id,s])),changes=[];
 for(const actor of actors){
  const after=combatActorView(actor),old=prior.get(after.id);
  if(!old)throw Error('Missing initial combat actor');
  const state={};for(const k of Object.keys(after.state))if(after.state[k]!==old.state[k])state[k]={before:old.state[k],after:after.state[k]};
  const locations=after.locations.filter((l,i)=>l.hp!==old.locations[i].hp||l.disabled!==old.locations[i].disabled).map(l=>{const p=old.locations.find(x=>x.id===l.id);return {id:l.id,hpBefore:p.hp,hpAfter:l.hp,disabledBefore:p.disabled,disabledAfter:l.disabled}});
  if(Object.keys(state).length||locations.length)changes.push({actorId:after.id,state,locations});
 }
 return changes;
}
export function replayRecorder(actors){
 let previous=actors.map(combatActorView);
 const initial=structuredClone(previous);
 return {initial,record(event,current){
  const changes=actorChanges(previous,current);previous=current.map(combatActorView);return {...event,changes};
 },final(current){return current.map(combatActorView)}};
}
