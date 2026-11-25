// Stateless interpretation of the supplied actor snapshot; no branch or retry policy.
import {SKILLS,validateSheet} from '../public/laboratorio/character-sheet.mjs';
import {conditionProfile} from '../public/laboratorio/conditions.mjs';
import {GRADES,gradeOf} from '../public/laboratorio/percentile.mjs';
import {skillCheck,skillTarget} from './skill-check-core.mjs';
export {skillCheck} from './skill-check-core.mjs';
import {validateCheck} from '../public/libro/check-contract.mjs';
const order=['very-easy','easy','standard','hard','formidable','herculean'];
// Known skill families from Mythras pp.39–50. Additional values must exist on the sheet.
export const SKILL_METADATA=Object.freeze({
 combat:['Estilo de combate',true],athletics:['Atletismo',true],brawn:['Fuerza aplicada',true],
 endurance:['Resistencia',false],evade:['Esquiva',true],perception:['Percepción',false],
 stealth:['Sigilo',true],willpower:['Voluntad',false],influence:['Influencia',false],
 track:['Rastreo',false],firstAid:['Primeros auxilios',true],
 ride:['Equitación',true],drive:['Conducir',true],deceit:['Engaño',false],insight:['Perspicacia',false],
 survival:['Supervivencia',false],commerce:['Comercio',false],conceal:['Ocultar',true],boating:['Navegación',true],
 customs:['Costumbres',false],dance:['Danza',true],locale:['Conocimiento local',false],
 nativeTongue:['Lengua materna',false],sleight:['Juego de manos',true],oratory:['Oratoria',false]
});
export const DIFFICULTIES=Object.freeze(['automatic',...order,'hopeless']);
const labels={'very-easy':'Muy fácil',easy:'Fácil',standard:'Estándar',hard:'Difícil',formidable:'Formidable',herculean:'Hercúlea'};
const ok=(v,m)=>{if(!v)throw Error(m)};
const own=Object.hasOwn;
export function validateSkillSpec(spec){
 ok(spec&&own(SKILL_METADATA,spec.skillId)&&DIFFICULTIES.includes(spec.difficulty),'Unsupported skill or explicit difficulty required');
 ok(typeof spec.reason==='string'&&spec.reason.trim().length>0&&spec.reason.length<=300,'Missing check reason');
 ok(spec.modifiers===undefined||Array.isArray(spec.modifiers)&&spec.modifiers.length<=12&&spec.modifiers.every(m=>m&&Number.isInteger(m.targetDelta)&&Math.abs(m.targetDelta)<=100&&typeof m.reason==='string'&&m.reason.trim().length>0&&m.reason.length<=160),'Invalid skill modifiers');
 if(spec.augmentation!==undefined){const a=spec.augmentation;ok(a&&a.character&&own(SKILL_METADATA,a.skill)&&typeof a.reason==='string'&&a.reason.trim()&&a.reason.length<=300&&own(GRADES,a.difficulty),'Invalid authorized augmentation');}
 const r=spec.requirements??{};ok(r&&typeof r==='object'&&!Array.isArray(r)&&Object.keys(r).every(k=>['functionalHands','mobility','confrontFear'].includes(k)),'Invalid task requirements');
 ok(r.functionalHands===undefined||Number.isInteger(r.functionalHands)&&r.functionalHands>=0&&r.functionalHands<=2,'Invalid hands requirement');
 for(const k of ['mobility','confrontFear'])ok(r[k]===undefined||typeof r[k]==='boolean','Invalid task requirement');
 return spec;
}
export function skillProfile(sheet,spec){
 validateSheet(sheet);validateSkillSpec(spec);
 const base=sheet.skills[spec.skillId];
 ok(own(sheet.skills,spec.skillId)&&Number.isInteger(base)&&base>=0&&base<=300,'Skill missing or invalid in actor sheet: '+spec.skillId);
 // Reuse fatigue, ENC, movement and existing laboratory conditions, but do not
 // use its fixed physical-load grade or combat AP to gate a narrative check.
 const p=conditionProfile(sheet,SKILLS.includes(spec.skillId)?spec.skillId:'willpower','skill');
 const mods=p.mods.filter(m=>m.source!=='encumbrance'),blocked=p.blocked.filter(s=>s!=='Sin puntos de acción'),warnings=[];
 const requirements=spec.requirements??{};
 if(requirements.functionalHands){
  const disabled=sheet.locations.filter(l=>l.disabled&&l.id.includes('arm')).length;
  if(2-disabled<requirements.functionalHands)blocked.push('Manos funcionales insuficientes');
  else if(sheet.locations.some(l=>l.id.includes('arm')&&l.hp<=0&&!l.disabled))warnings.push('Herida de brazo parcialmente funcional: dificultad de esta tarea a criterio del máster');
 }
 if(requirements.mobility&&p.move<=0)blocked.push('Movilidad insuficiente para esta tarea');
 if(requirements.confrontFear&&sheet.state.fear==='flee')blocked.push('Estado de huida incompatible con confrontar la fuente del terror');
 else if(sheet.state.fear!=='none')warnings.push('Miedo presente: aplicar la restricción contextual indicada por el máster');
 if(sheet.state.stunTurns>0)warnings.push('Aturdimiento activo: comprobar la acción y localización afectadas');
 if(sheet.state.bleeding)warnings.push('Hemorragia activa; la fatiga acumulada ya se aplica, no duplicar penalización');
 if(sheet.state.fatigue>=6)warnings.push('Perfil conservador: incapacidad bloquea acciones ordinarias; excepciones desesperadas pendientes');
 const baseIndex=order.indexOf(spec.difficulty);
 let grade=spec.difficulty;
 if(baseIndex>=0){
  // ENC is relative to the master's task difficulty (Mythras p.78).
  const steps=SKILL_METADATA[spec.skillId][1]?(p.load==='burdened'?1:p.load==='overloaded'||p.load==='excess'?2:0):0;
  if(steps)mods.push({source:'encumbrance',grade:order[Math.min(order.length-1,baseIndex+steps)],reason:'Carga '+p.derived.enc+' ENC; '+steps+' grado(s) más difícil'});
  const indices=mods.map(m=>m.grade==='blocked'?order.length:order.indexOf(m.grade)).filter((n,i)=>n>=0&&mods[i].grade!=='standard');
  grade=order[Math.min(order.length-1,Math.max(baseIndex,...indices))];
 }
 const modifiers=spec.modifiers??[];
 let augmentation=0,augmentationDetail=null;
 if(spec.augmentation){const a=spec.augmentation;ok(a.character.id!==sheet.id||a.skill!==spec.skillId,'Cannot augment skill with itself');const support=skillProfile(a.character,{skillId:a.skill,difficulty:a.difficulty,reason:a.reason});ok(support.legal,'Augmenting skill blocked');augmentation=Math.round(support.target*.2);augmentationDetail={source:'augmentation',actorId:a.character.id,skill:a.skill,value:support.target,targetDelta:augmentation,reason:a.reason};}
 const result=order.includes(grade)?skillTarget({skill:base,difficulty:grade,modifiers:modifiers.map(m=>m.targetDelta)}):{base,target:null,gradedTarget:null,delta:0};
 if(spec.difficulty==='hopeless')blocked.push('Acción imposible según el máster');
 return {...p,...result,target:result.target===null?null:result.target+augmentation,unaugmentedTarget:result.target,augmentation,augmentationDetail,skill:spec.skillId,base,baseDifficulty:spec.difficulty,grade,mods,blocked,warnings,legal:blocked.length===0,modifiers};
}
export function checkFromProfile(sheet,spec,p,{id,roll,target=p.target}){
 ok(p.legal&&order.includes(p.grade),'Skill check unavailable: '+p.blocked.join('; '));
 ok(typeof id==='string'&&id,'Missing check ID');
 const unaugmented=Math.max(0,p.unaugmentedTarget-Math.max(0,p.target-target));
 const original=gradeOf(roll,unaugmented),enhanced=gradeOf(roll,target);
 const outcome=original==='fumble'||original==='critical'?original:enhanced==='critical'?'success':enhanced==='fumble'?'failure':enhanced;
 const reason=[spec.reason,...(p.augmentationDetail?[p.augmentationDetail.reason+' (+'+p.augmentation+' pp)']:[]),...p.mods.filter(m=>m.grade!=='standard').map(m=>m.reason),...p.modifiers.map(m=>m.reason+' ('+(m.targetDelta>=0?'+':'')+m.targetDelta+' pp)')].join('; ');
 return validateCheck({schemaVersion:1,id,actorId:sheet.id,actorName:sheet.name,skillId:spec.skillId,skillName:SKILL_METADATA[spec.skillId][0],base:p.base,target,difficulty:labels[p.grade],reason,dice:'D100',roll,outcome,visibility:'player',source:'prepared-skill-v2',formula:p.base+' × '+GRADES[p.grade]+' = '+p.gradedTarget+(p.delta?' ; '+p.gradedTarget+(p.delta>=0?' + ':' - ')+Math.abs(p.delta)+' = '+p.target:'')+(p.augmentation?' + '+p.augmentation+' (augment) = '+p.target:'')+(target!==p.target?' → '+target+' (oposición)':''),baseDifficulty:spec.difficulty,modifiers:[...p.mods.filter(m=>m.grade!=='standard'),...p.modifiers,...(p.augmentationDetail?[p.augmentationDetail]:[])],augmentation:p.augmentation,unaugmentedTarget:unaugmented,warnings:p.warnings});
}
// Existing module adapter; RNG is supplied by preparation, never by the book.
export function resolveSkillCheck(sheet,spec,{eventId,slot='check',roll}){
 const p=skillProfile(sheet,spec);ok(p.legal&&order.includes(p.grade),'Skill check blocked: '+p.blocked.join('; '));
 ok(typeof eventId==='string'&&eventId&&typeof roll==='function','Missing preparation context');
 return checkFromProfile(sheet,spec,p,{id:eventId+'.'+slot,roll:roll(100,slot+'.'+spec.skillId,0)});
}
