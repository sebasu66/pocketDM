import {derived,equipped} from './character-sheet.mjs';
import {GRADES,effectiveSkill} from './percentile.mjs';
export const FATIGUE=[
 ['Fresco','standard',0,0,0],['Sin aliento','hard',0,0,0],['Cansado','hard',-1,0,0],['Fatigado','formidable',-2,-2,0],['Agotado','formidable','half',-4,-1],['Debilitado','herculean','half',-6,-2],['Incapacitado','herculean','none',-8,-3],['Semiconsciente','blocked','none',-8,-3],['Coma','blocked','none',-8,-3],['Muerto','blocked','none',-8,-3]];
const order=['standard','hard','formidable','herculean','blocked'];
export function conditionProfile(s,skill='combat',action='attack'){
 const d=derived(s),t=s.state,w=equipped(s),f=FATIGUE[t.fatigue],mods=[],blocked=[];
 const add=(source,grade,reason)=>mods.push({source,grade,reason});
 add('fatigue',f[1],f[0]);
 let move=f[2]==='none'?0:f[2]==='half'?Math.floor(s.baseMove/2):Math.max(0,s.baseMove+f[2]),gait='sprint',load='normal';
 if(d.enc>d.maxCapacity){load='excess';move=0;blocked.push('Carga superior a capacidad máxima')}
 else if(d.enc>d.overloadCapacity){load='overloaded';move=Math.min(move,Math.floor(s.baseMove/2));gait='walk'}
 else if(d.enc>d.normalCapacity){load='burdened';move=Math.max(0,move-2);gait='run'}
 if(['combat','athletics','brawn','evade','stealth','firstAid'].includes(skill)&&load!=='normal')add('encumbrance',load==='burdened'?'hard':'formidable','Carga '+d.enc+' ENC frente a STR '+s.attributes.STR);
 const usesWeapon=action==='attack'||action==='parry';
 const disabledArms=s.locations.filter(l=>l.disabled&&l.id.includes('arm')).length;
 if(usesWeapon&&(!w.carried||w.hp===0))blocked.push('Arma no disponible o rota');
 if(usesWeapon&&w.hands>2-disabledArms)blocked.push('Manos funcionales insuficientes');
 if(usesWeapon&&w.natural&&s.locations.find(l=>l.id==='head')?.disabled)blocked.push('Ataque natural incapacitado');
 if(usesWeapon&&s.locations.some(l=>l.hp<=0&&l.id.includes('arm')&&!l.disabled))add('wound','hard','Herida de brazo aún funcional (regla opcional activada)');
 if(t.prone&&['attack','parry','evade'].includes(action))add('prone','hard','En el suelo (perfil de laboratorio)');
 if(t.cold==='exposed'&&['combat','athletics','brawn','evade','firstAid'].includes(skill))add('cold','hard','Frío manual: hipótesis experimental, no regla oficial');
 const light=t.light==='dark'&&s.abilities.includes('night-sight')?'dim':t.light==='dim'&&s.abilities.includes('night-sight')?'normal':t.light;
 if(['combat','perception','evade'].includes(skill)&&light!=='normal')add('light',light==='dark'?'herculean':'hard','Visibilidad '+light+' (perfil de laboratorio)');
 if(s.locations.some(l=>l.disabled&&(l.id.includes('leg')||l.id.includes('hind')||l.id.includes('fore')))){move=0;gait='none'}
 if(t.incapacitated||t.unconscious||t.fatigue>=6)blocked.push('Incapacitado para combatir');
 if(t.stunTurns>0&&action==='attack')blocked.push('Aturdimiento: no puede atacar');
 if(t.fear==='shaken'&&action==='attack')blocked.push('Temor: acción ofensiva bloqueada');
 if(t.fear==='flee'&&action==='attack')blocked.push('Terror: intención de huir');
 if(action==='parry'&&w.natural&&!s.abilities.includes('natural-parry'))blocked.push('Arma natural sin parada activa');
 const grade=mods.reduce((a,m)=>order.indexOf(m.grade)>order.indexOf(a)?m.grade:a,'standard');
 const base=s.skills[skill],target=grade==='blocked'?0:effectiveSkill(base,grade);
 const ap=Math.max(0,d.baseAP+f[4]);if(!ap)blocked.push('Sin puntos de acción');
 return {skill,base,target,grade,factor:GRADES[grade]??0,mods,blocked,legal:blocked.length===0,ap,initiative:d.baseInitiative-d.armorPenalty+f[3],move,load,gait,derived:d,fatigueLabel:f[0]};
}
