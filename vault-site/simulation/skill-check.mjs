// Shared D100 skill check for authored adventure choices, not a live dice UI.
import {SKILLS,validateSheet} from '../public/laboratorio/character-sheet.mjs';
import {conditionProfile} from '../public/laboratorio/conditions.mjs';
import {GRADES} from '../public/laboratorio/percentile.mjs';
import {skillCheck,skillTarget} from './skill-check-core.mjs';
export {skillCheck} from './skill-check-core.mjs';
import {validateCheck} from '../public/libro/check-contract.mjs';
const order=['very-easy','easy','standard','hard','formidable','herculean'];
const names={combat:'Combate',athletics:'Atletismo',brawn:'Fuerza aplicada',endurance:'Resistencia',evade:'Esquiva',perception:'Percepción',stealth:'Sigilo',willpower:'Voluntad',influence:'Influencia',track:'Rastreo',firstAid:'Primeros auxilios'};
const labels={'very-easy':'Muy fácil',easy:'Fácil',standard:'Estándar',hard:'Difícil',formidable:'Formidable',herculean:'Hercúlea'};
const ok=(v,m)=>{if(!v)throw Error(m)};
export function validateSkillSpec(spec){
 ok(spec&&SKILLS.includes(spec.skillId)&&Object.hasOwn(GRADES,spec.difficulty),'Unsupported skill or difficulty');
 ok(typeof spec.reason==='string'&&spec.reason.trim().length>0&&spec.reason.length<=300,'Missing check reason');
 ok(spec.modifiers===undefined||Array.isArray(spec.modifiers)&&spec.modifiers.length<=12&&spec.modifiers.every(m=>m&&Number.isInteger(m.targetDelta)&&Math.abs(m.targetDelta)<=100&&typeof m.reason==='string'&&m.reason.trim().length>0&&m.reason.length<=160),'Invalid skill modifiers');
 return spec;
}
export function skillProfile(sheet,spec){
 validateSheet(sheet);validateSkillSpec(spec);
 const p=conditionProfile(sheet,spec.skillId,'skill');
 // Existing condition rules report a baseline standard even when there is no penalty.
 // Do not erase an authored easy grade unless an actual adverse condition is present.
 const condition=p.grade==='standard'?'very-easy':p.grade;
 const grade=order[Math.max(order.indexOf(spec.difficulty),order.indexOf(condition))];
 const modifiers=spec.modifiers??[],result=skillTarget({skill:p.base,difficulty:grade,modifiers:modifiers.map(m=>m.targetDelta)});
 return {...p,...result,grade,modifiers};
}
export function resolveSkillCheck(sheet,spec,{eventId,slot='check',roll}){
 const p=skillProfile(sheet,spec);ok(p.legal,'Skill check blocked: '+p.blocked.join('; '));
 ok(typeof eventId==='string'&&eventId&&typeof roll==='function','Missing preparation context');
 const value=roll(100,slot+'.'+spec.skillId,0);
 const {outcome}=skillCheck({skill:p.base,difficulty:p.grade,modifiers:p.modifiers.map(m=>m.targetDelta),roll:value});
 const reason=[spec.reason,...p.mods.filter(m=>m.grade!=='standard').map(m=>m.reason),...p.modifiers.map(m=>m.reason+' ('+(m.targetDelta>=0?'+':'')+m.targetDelta+' pp)')].join('; ');
 return validateCheck({schemaVersion:1,id:eventId+'.'+slot,actorId:sheet.id,actorName:sheet.name,skillId:spec.skillId,skillName:names[spec.skillId],base:p.base,target:p.target,difficulty:labels[p.grade],reason,dice:'D100',roll:value,outcome,visibility:'player',source:'prepared-skill-v1',formula:p.base+' × '+GRADES[p.grade]+' = '+p.gradedTarget+(p.delta?' ; '+p.gradedTarget+(p.delta>=0?' + ':' - ')+Math.abs(p.delta)+' = '+p.target:'')});
}
