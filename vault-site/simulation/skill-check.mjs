// Shared D100 skill check for authored adventure choices, not a live dice UI.
import {SKILLS,validateSheet} from '../public/laboratorio/character-sheet.mjs';
import {conditionProfile} from '../public/laboratorio/conditions.mjs';
import {GRADES,effectiveSkill,gradeOf} from '../public/laboratorio/percentile.mjs';
import {validateCheck} from '../public/libro/check-contract.mjs';
const order=['very-easy','easy','standard','hard','formidable','herculean'];
const names={combat:'Combate',athletics:'Atletismo',brawn:'Fuerza aplicada',endurance:'Resistencia',evade:'Esquiva',perception:'Percepción',stealth:'Sigilo',willpower:'Voluntad',influence:'Influencia',track:'Rastreo',firstAid:'Primeros auxilios'};
const labels={'very-easy':'Muy fácil',easy:'Fácil',standard:'Estándar',hard:'Difícil',formidable:'Formidable',herculean:'Hercúlea'};
const ok=(v,m)=>{if(!v)throw Error(m)};
export function validateSkillSpec(spec){
 ok(spec&&SKILLS.includes(spec.skillId)&&Object.hasOwn(GRADES,spec.difficulty),'Unsupported skill or difficulty');
 ok(typeof spec.reason==='string'&&spec.reason.trim().length>0&&spec.reason.length<=300,'Missing check reason');
 return spec;
}
export function skillProfile(sheet,spec){
 validateSheet(sheet);validateSkillSpec(spec);
 const p=conditionProfile(sheet,spec.skillId,'skill');
 // Existing condition rules report a baseline standard even when there is no penalty.
 // Do not erase an authored easy grade unless an actual adverse condition is present.
 const condition=p.grade==='standard'?'very-easy':p.grade;
 const grade=order[Math.max(order.indexOf(spec.difficulty),order.indexOf(condition))];
 return {...p,grade,target:effectiveSkill(p.base,grade)};
}
export function resolveSkillCheck(sheet,spec,{eventId,slot='check',roll}){
 const p=skillProfile(sheet,spec);ok(p.legal,'Skill check blocked: '+p.blocked.join('; '));
 ok(typeof eventId==='string'&&eventId&&typeof roll==='function','Missing preparation context');
 const value=roll(100,slot+'.'+spec.skillId,0),outcome=gradeOf(value,p.target);
 const reason=[spec.reason,...p.mods.filter(m=>m.grade!=='standard').map(m=>m.reason)].join('; ');
 return validateCheck({schemaVersion:1,id:eventId+'.'+slot,actorId:sheet.id,actorName:sheet.name,skillId:spec.skillId,skillName:names[spec.skillId],base:p.base,target:p.target,difficulty:labels[p.grade],reason,dice:'D100',roll:value,outcome,visibility:'player',source:'prepared-skill-v1',formula:p.base+' × '+GRADES[p.grade]+' = '+p.target});
}
