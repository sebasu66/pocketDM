// Pure calculation. The caller provides the already determined D100.
import {GRADES,effectiveSkill,gradeOf} from '../public/laboratorio/percentile.mjs';
export function skillTarget({skill,difficulty='standard',modifiers=[]}){
 if(!Array.isArray(modifiers)||!modifiers.every(Number.isSafeInteger))throw Error('Invalid modifiers');
 const gradedTarget=effectiveSkill(skill,difficulty);
 const delta=modifiers.reduce((a,b)=>a+b,0);
 const target=Math.max(0,gradedTarget+delta);
 if(!Number.isSafeInteger(target))throw Error('Invalid effective target');
 return {base:skill,difficulty,gradedTarget,delta,target};
}
export function skillCheck({skill,difficulty='standard',modifiers=[],roll}){
 const profile=skillTarget({skill,difficulty,modifiers});
 return {...profile,roll,outcome:gradeOf(roll,profile.target)};
}
