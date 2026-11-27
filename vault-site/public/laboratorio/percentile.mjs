const SIZE=["small","medium","large","huge","enormous"];
export const GRADES=Object.freeze({'very-easy':2,easy:1.5,standard:1,hard:2/3,formidable:.5,herculean:.1});
const rank={fumble:0,failure:1,success:2,critical:3};
const check=(ok,msg)=>{if(!ok)throw Error(msg)};
export function effectiveSkill(base,grade='standard'){
 check(Number.isFinite(base)&&base>=0&&base<=10000&&Object.hasOwn(GRADES,grade),'Invalid skill/grade');
 return Math.round(base*GRADES[grade]);
}
export function gradeOf(roll,target){
 check(Number.isInteger(roll)&&roll>=1&&roll<=100&&Number.isInteger(target)&&target>=0,'Invalid percentile');
 if(roll===100||(roll===99&&target<=100))return 'fumble';
 if(roll>=96)return 'failure';
 if(roll<=Math.ceil(target/10))return 'critical';
 return roll<=Math.max(5,target)?'success':'failure';
}
export function contestTargets(a,b){
 check(Number.isInteger(a)&&a>=0&&Number.isInteger(b)&&b>=0,'Invalid contest');
 const penalty=Math.max(0,a-100,b-100);
 return {attacker:Math.max(0,a-penalty),defender:Math.max(0,b-penalty),penalty};
}
export function differential(a,b){
 check(Object.hasOwn(rank,a)&&Object.hasOwn(rank,b),'Invalid degrees');
 const delta=rank[a]-rank[b];
 if(Math.max(rank[a],rank[b])<2||delta===0)return {side:null,count:0};
 return {side:delta>0?'attacker':'defender',count:Math.abs(delta)};
}
export function opposed(a,b){
 check(Object.hasOwn(rank,a.outcome)&&Object.hasOwn(rank,b.outcome)&&[a.roll,b.roll].every(x=>Number.isInteger(x)&&x>=1&&x<=100),'Invalid opposed result');
 if(Math.max(rank[a.outcome],rank[b.outcome])<2)return null;
 const diff=rank[a.outcome]-rank[b.outcome]||a.roll-b.roll;
 return diff>0?'attacker':diff<0?'defender':null;
}
export function parryDamage(damage,attackSize,defendSize,outcome){
 check(Number.isInteger(damage)&&damage>=0&&SIZE.includes(attackSize)&&SIZE.includes(defendSize)&&Object.hasOwn(rank,outcome),'Invalid parry');
 if(rank[outcome]<2)return damage;
 const difference=SIZE.indexOf(attackSize)-SIZE.indexOf(defendSize);
 return difference<=0?0:difference===1?Math.ceil(damage/2):damage;
}
export const successful=outcome=>outcome==='success'||outcome==='critical';
