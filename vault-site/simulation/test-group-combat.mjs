import test from 'node:test';
import assert from 'node:assert/strict';
import {galahadSheet,wolfSheet} from '../public/laboratorio/character-sheet.mjs';
import {validateCheck} from '../public/libro/check-contract.mjs';
import {resolveCombatEncounter} from './master-rules.mjs';
import {simulateGroup} from '../public/laboratorio/group-combat.mjs';
import {initialWorld} from './world-pilot.mjs';
import {snapshot,effective} from './world-context.mjs';
import {createState,prepareWindow,confirmCommand,playerState} from './campaign-state.mjs';
const participant=(character,side,targetPriority=[])=>({character,side,targetPriority,difficulty:{attack:'standard',defense:'standard'},defense:'auto'});
const wolf2=()=>({...wolfSheet(),id:'wolf-2',name:'Lobo B'});
const params=participants=>({id:'group-test',seed:'TEST',participants,maxRounds:12,initialRange:'short',surprisedIds:[],limbLifeThreat:false});
test('one hero versus two wolves: deterministic initiative cycles, separate AP, shared checks',()=>{
 const participants=[participant(galahadSheet(),'heroes'),participant(wolfSheet(),'wolves'),participant(wolf2(),'wolves')],before=structuredClone(participants),p=params(participants);
 const r=resolveCombatEncounter(p);assert.deepEqual(r,resolveCombatEncounter(p));assert.deepEqual(participants,before);
 assert.equal(r.actors.length,3);assert.equal(r.initiative.length,3);assert.equal(r.order.length,3);
 const checks=r.events.flatMap(e=>e.checks??[]);checks.forEach(validateCheck);assert.equal(new Set(checks.map(c=>c.id)).size,checks.length);
 assert.ok(r.events.some(e=>e.actorId==='wolf-1'));assert.ok(r.events.some(e=>e.actorId==='wolf-2'));
 for(const e of r.events){assert.equal(e.ap.length,3);assert.ok(e.ap.every(n=>n>=0));if(e.targetId)assert.notEqual(r.sides[r.actorIds.indexOf(e.actorId)],r.sides[r.actorIds.indexOf(e.targetId)]);}
 assert.equal(Object.hasOwn(r,'seed'),false);
});
test('two versus two: losing one combatant does not stop the round or allow allied targeting',()=>{
 const a=galahadSheet(),b={...galahadSheet(),id:'ally',name:'Ally'},c={...galahadSheet(),id:'enemy1',name:'Enemy 1'},d={...galahadSheet(),id:'enemy2',name:'Enemy 2'};
 c.locations.find(l=>l.id==='head').hp=1;
 // Highest initiative for hero; head hit and lethal wound on first opponent.
 const roll=(sides,purpose)=>sides===10?(purpose.endsWith('galahad')?10:1):sides===100?(purpose.includes('wound-endurance')?100:10):sides===20?20:sides;
 const participants=[participant(a,'heroes',['enemy1','enemy2']),participant(b,'heroes'),participant(c,'enemies'),participant(d,'enemies')];participants[2].defense='none';participants[3].defense='none';
 const r=simulateGroup(participants,{...params(participants),roll,maxRounds:1});
 const hit=r.events.findIndex(e=>e.targetId==='enemy1'&&e.wound?.severity==='major');assert.ok(hit>=0);
 assert.ok(r.events.slice(hit+1).some(e=>e.targetId==='enemy2'||e.actorId==='enemy2'));assert.equal(r.actors[2].state.dead,true);
 assert.ok(!r.events.slice(hit+1).some(e=>e.actorId==='enemy1'));
 assert.throws(()=>resolveCombatEncounter(params([participant(a,'heroes',['ally']),participant(b,'heroes'),participant(d,'enemies')])),/Invalid target/);
});
test('surprise and withdrawal apply to individual participants; no fabricated escape',()=>{
 const a=galahadSheet(),b=wolfSheet(),c=wolf2(),p=params([participant(a,'heroes'),participant(b,'wolves'),participant(c,'wolves')]);
 const r=resolveCombatEncounter({...p,maxRounds:1,surprisedIds:['wolf-2']});const normal=resolveCombatEncounter({...p,maxRounds:1});assert.equal(r.initiative[2],normal.initiative[2]-10);
 assert.ok(!r.events.some(e=>e.actorId==='wolf-2'&&e.kind==='exchange'));
 c.state.fear='flee';const paused=resolveCombatEncounter(p);assert.equal(paused.outcome,'withdrawal-pending');assert.deepEqual(paused.withdrawalRequested,['wolf-2']);
});
test('group encounter uses common campaign snapshots and confirms prepared checks with all participant changes',()=>{
 const source=initialWorld(),wolves=[wolfSheet(),wolf2()],base=snapshot({canon:source.canon,nodes:Object.values(source.nodes),routes:Object.values(source.routes),entities:[...Object.values(source.entities),...wolves.map(s=>({id:s.id,kind:'creature',name:s.name,locationId:'stormkeep',visibility:'public'}))]});
 const participants=[participant(galahadSheet(),'heroes'),...wolves.map(s=>participant(s,'wolves'))].map(({character,...p})=>({actorId:character.id,...p}));
 const state=createState(base,{id:'group-campaign',actorId:'galahad',actorSheets:[galahadSheet(),...wolves],encounters:[{id:'wolves',locationId:'stormkeep',maxRounds:8,initialRange:'short',surprisedIds:[],limbLifeThreat:false,participants}],seed:'GROUP-TEST'}),access={campaignId:state.id,actorId:state.actorId,role:'player'};
 const window=prepareWindow(base,state,{...access,role:'worker'},{maxDepth:1,maxEdges:40});const edge=window.nodes[0].choices.find(e=>e.command.action==='duel');assert.ok(edge);
 const job=window.jobs.find(j=>j.eventId===edge.eventId),r=confirmCommand(base,state,access,edge.command,{expectedPreviewHash:edge.previewHash,preparedTransition:window.preparedTransitions[edge.command.commandId]});
 assert.deepEqual(r.receipt.event.checks,job.input.event.checks);assert.equal(r.receipt.event.combat.actorIds.length,3);assert.equal(r.receipt.event.combat.turnTrace.length,r.receipt.event.combat.apTrace.length);
 const w=effective(base,r.state.delta);for(const s of wolves)assert.equal(w.entities[s.id].privateState.sheet.id,s.id);
 assert.equal(playerState(base,r.state,access).journal.length,1);
 const replay=r.receipt.event.combat.replay;assert.deepEqual(replay,job.input.event.combat.replay);assert.deepEqual(replay,playerState(base,r.state,access).journal[0].combat.replay);
 const checkIds=new Set(r.receipt.event.checks.map(c=>c.id));for(const t of replay.turns){for(const ref of [...t.checkIds,t.attackCheckId,t.defenseCheckId,t.referenceAttackId,t.wound?.opposedAgainst].filter(Boolean))assert.ok(checkIds.has(ref));}
 assert.ok(replay.turns.some(t=>t.damage&&t.weapon));assert.ok(!JSON.stringify(replay).includes('GROUP-TEST'));
});

test('illustrated replay reconstructs the visible end state and references the actual resolved dice',()=>{
 const p=params([participant(galahadSheet(),'heroes'),participant(wolfSheet(),'wolves'),participant(wolf2(),'wolves')]);
 const r=resolveCombatEncounter(p),visible=structuredClone(r.initialActors);
 let impacts=0;
 for(const [i,e] of r.events.entries()){
  assert.equal(e.sequence,i);assert.ok(e.actorId);
  if(e.kind==='exchange'){assert.ok(e.weapon.id);assert.equal(typeof e.hit,'boolean');assert.ok(e.attack.id)}
  if(e.damage){impacts++;assert.equal(e.damage.before-e.damage.after,e.damage.net);assert.equal(e.damage.net,Math.max(0,e.damage.afterParry-e.damage.armor))}
  for(const change of e.changes){
   const a=visible.find(s=>s.id===change.actorId);
   for(const [k,v] of Object.entries(change.state)){assert.equal(a.state[k],v.before);a.state[k]=v.after}
   for(const d of change.locations){const l=a.locations.find(l=>l.id===d.id);assert.equal(l.hp,d.hpBefore);assert.equal(l.disabled,d.disabledBefore);l.hp=d.hpAfter;l.disabled=d.disabledAfter}
  }
 }
 assert.ok(impacts>0);assert.deepEqual(visible,r.finalActors);
});
