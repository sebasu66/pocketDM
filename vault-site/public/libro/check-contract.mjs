// Contrato compartido de presentación v1. No calcula tiradas ni modifica personajes.
export const outcomes=Object.freeze({success:'Éxito',failure:'Fallo',critical:'Éxito crítico',fumble:'Pifia'});
export function validateCheck(c){
 if(!c||!['id','actorId','actorName','skillId','skillName','difficulty','reason'].every(k=>typeof c[k]==='string'&&c[k].trim()))throw Error('Chequeo sin identidad o contexto');
 if(c.schemaVersion!==1||!Object.hasOwn(outcomes,c.outcome)||!Number.isInteger(c.roll)||c.roll<1||c.roll>100||!Number.isFinite(c.base)||!Number.isFinite(c.target)||c.dice!=='D100')throw Error('Chequeo sin resolución válida: '+c.id);
 if(c.visibility!=='player')throw Error('No exponer tiradas privadas al lector');
 return c;
}
export function validateEvent(e){
 const ids=new Set();
 for(const c of e.checks){validateCheck(c);if(ids.has(c.id))throw Error('ID repetido: '+c.id);ids.add(c.id)}
 const seen=new Set();
 for(const part of e.text){if(typeof part==='string')continue;if(!ids.has(part.check)||seen.has(part.check))throw Error('Referencia inválida o repetida: '+part.check);seen.add(part.check)}
 if(seen.size!==ids.size)throw Error('Chequeo sin anotación: '+e.title);
 return e;
}
// Únicamente fixtures de la demo; el motor real entregará el registro ya resuelto.
export function demoCheck({id,actorId,actorName,skillId,skillName,base,difficulty='Estándar',roll,reason,action,consequence}){
 const target=Math.floor(base*(difficulty==='Difícil'?2/3:1));
 return validateCheck({schemaVersion:1,id,actorId,actorName,skillId,skillName,base,difficulty,target,dice:'D100',roll,outcome:roll<=target?'success':'failure',reason,action,consequence,source:'demo',visibility:'player'});
}
