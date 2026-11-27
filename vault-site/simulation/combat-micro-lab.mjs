import {createHash} from 'node:crypto';
import {fixtureCatalog,instantiate} from './combat-catalog.mjs';
import {prepareExchange,parryDamage,PROFILE} from './combat-rules.mjs';
import {die} from './engine.mjs';
// Single isolated exchange: not a battle simulator. Effects are deliberately NOT applied.
export function runMicroLab({count=1000,masterSeed='pocketdm-lab-v1',attacker='spearman',defender='guard',defend=true,attackGrade='standard',defenseGrade='standard'}={}){
 if(!Number.isInteger(count)||count<1||count>100000)throw Error('Invalid sample count');
 const c=fixtureCatalog(),a=instantiate(c,attacker,'actor-a'),b=instantiate(c,defender,'actor-b');
 const aw=c.weapons.find(w=>w.id===a.weaponId),bw=c.weapons.find(w=>w.id===b.weaponId);
 const totals={attackSuccess:0,parrySuccess:0,attackerEffects:0,defenderEffects:0,hitAfterParry:0,damageAfterParry:0};
 for(let i=0;i<count;i++){
  const seed=createHash('sha256').update(JSON.stringify([masterSeed,i])).digest('hex');
  const e=prepareExchange({seed,address:'exchange-0',attacker:a,defender:b,defend,attackGrade,defenseGrade});
  totals.attackSuccess+=Number(e.attackSucceeded);totals.parrySuccess+=Number(e.defenseSucceeded);
  if(e.entitlement.side==='attacker')totals.attackerEffects+=e.entitlement.count;
  if(e.entitlement.side==='defender')totals.defenderEffects+=e.entitlement.count;
  if(e.attackSucceeded){
   const damage=aw.damage.bonus+Array.from({length:aw.damage.count},(_,j)=>die(seed,[PROFILE,'exchange-0','damage',j],aw.damage.sides)).reduce((x,y)=>x+y,0);
   const left=parryDamage(Math.max(0,damage),aw.size,bw.size,e.checks[1]?.outcome??'failure');
   totals.hitAfterParry+=Number(left>0);totals.damageAfterParry+=left;
  }
 }
 return {kind:'isolated-exchange-no-effects-no-armor',profile:PROFILE,catalog:c.id,catalogVersion:c.version,count,masterSeed,attacker,defender,defend,attackGrade,defenseGrade,totals,meanDamageAfterParry:totals.damageAfterParry/count};
}
if(process.argv[1]&&import.meta.url===new URL('file:///'+process.argv[1].replaceAll('\\','/')).href)console.log(JSON.stringify([runMicroLab(),runMicroLab({defend:false})],null,2));
