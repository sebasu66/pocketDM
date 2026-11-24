// Tactical engagement, deterministic and independent of presentation.
// Full Mythras pp.97,105–107,273 as mechanical reference; policy choices are PocketDM.
import {equipped,armorAt} from './character-sheet.mjs';
import {conditionProfile} from './conditions.mjs';
import {opposed,contestTargets} from './percentile.mjs';
export const REACH=['touch','short','medium','long','very-long'];
export const SIZE=['small','medium','large','huge','enormous'];
export const reachRank=s=>REACH.indexOf(equipped(s).reach);
export function engagement(a,b,position='long'){
 if(!['long','short'].includes(position))throw Error('Posición inválida');
 return {position,difference:Math.abs(reachRank(a)-reachRank(b)),grip:null};
}
export function rangeProfile(a,b,position){
 const gap=reachRank(a)-reachRank(b),relevant=Math.abs(gap)>=2,w=equipped(a);
 const tooFar=relevant&&position==='long'&&gap<0,cramped=relevant&&position==='short'&&gap>0;
 return {gap,relevant,tooFar,cramped,canAttack:!tooFar,canParry:!cramped,weapon:cramped?{...w,size:SIZE[Math.max(0,SIZE.indexOf(w.size)-gap)],damage:{count:1,sides:3,bonus:1}}:w};
}
export function preferredPosition(a,b,current){
 const p=rangeProfile(a,b,current);return !p.relevant?current:p.gap>0?'long':'short';
}
export function canChangeRange(actor,context){
 return !context.grip&&conditionProfile(actor,'evade','move').legal&&conditionProfile(actor,'evade','move').move>0&&!actor.state.prone;
}
export function changeRange(a,b,context,{resist,check,desired}){
 if(!canChangeRange(a,context))return {changed:false,cost:[0,0],checks:[],message:'Cambio de alcance bloqueado'};
 const q=conditionProfile(b,'evade','move'),p=conditionProfile(a,'evade','move');
 const defend=!!resist&&q.legal&&q.move>0&&!b.state.prone;
 let checks=[],changed=true;
 if(defend){const t=contestTargets(p.target,q.target),ac=check(a,p,t.attacker,'change-range'),dc=check(b,q,t.defender,'resist-range');checks=[ac,dc];changed=opposed(ac,dc)==='attacker'}
 return {changed,cost:[1,defend?1:0],checks,position:changed?desired:context.position,message:changed?'Cambia alcance a '+(desired==='short'?'corto':'largo'):'No consigue cambiar el alcance'};
}
export function chooseExposedLocation(target,attacker){
 // The wolf is a ground-level animal. Restrict selection to lower body, not a human head.
 const eligible=target.locations.filter(l=>!l.disabled&&(attacker.speciesId!=='wolf'||target.kind!=='character'||l.id.includes('leg')||l.id==='abdomen'));
 return eligible.sort((a,b)=>armorAt(target,a.id)-armorAt(target,b.id)||a.hp-b.hp||a.from-b.from)[0]??null;
}
export function gripValid(context,actors){
 if(!context.grip)return false;const owner=actors.find(s=>s.id===context.grip.ownerId),victim=actors.find(s=>s.id===context.grip.targetId);
 return !!owner&&!!victim&&!owner.state.incapacitated&&!owner.state.unconscious&&owner.state.fatigue<6&&!owner.locations.find(l=>l.id==='head')?.disabled&&equipped(owner).hp>0&&equipped(owner).id===context.grip.weaponId&&!victim.state.incapacitated&&!victim.state.unconscious&&victim.state.fatigue<6;
}
export function struggle(victim,owner,context,check){
 const p=conditionProfile(victim,'brawn','struggle'),q=conditionProfile(owner,'brawn','resist');
 if(!p.legal)return {released:false,checks:[],message:'No puede intentar liberarse: '+p.blocked.join('; ')};
 // A grip contest costs the victim's proactive AP, not a reactive AP from the holder.
 if(!q.legal)return {released:true,checks:[],message:'El agarre se afloja'};
 const t=contestTargets(p.target,q.target),ac=check(victim,p,t.attacker,'struggle'),dc=check(owner,q,t.defender,'hold-grip'),released=opposed(ac,dc)==='attacker';
 return {released,checks:[ac,dc],message:released?'Se libera de la mordida':'No logra liberarse'};
}
