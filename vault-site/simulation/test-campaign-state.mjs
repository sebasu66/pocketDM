import test from 'node:test';
import assert from 'node:assert/strict';
import {snapshot,effective} from './world-context.mjs';
import {initialWorld} from './world-pilot.mjs';
import {galahadSheet,wolfSheet} from '../public/laboratorio/character-sheet.mjs';
import {sheetView} from '../public/laboratorio/character-sheet-view.mjs';
import {createState,legalActions,previewCommand,confirmCommand,playerState,impactForConfirmed,addressedRoll} from './campaign-state.mjs';
const setup=(id='qa01-a')=>{
 const source=initialWorld(),base=snapshot({canon:source.canon,nodes:Object.values(source.nodes),entities:[...Object.values(source.entities),{id:'wolf-1',kind:'creature',name:'Lobo',locationId:'stormkeep',visibility:'public',privateState:{secret:'HIDDEN-WOLF'}}],routes:[...Object.values(source.routes),{id:'qa01.hub-route',a:'stormkeep',b:'hex.0.0',status:'open',minutes:15,visibility:'public'}]});
 const g=galahadSheet();g.state.secret='HIDDEN-SHEET';
 const state=createState(base,{id,actorId:'galahad',actorSheets:[g,wolfSheet()],knownIds:['stormkeep','hex.0.0','wolf-1'],encounters:[{id:'qa01.duel',opponentId:'wolf-1',locationId:'stormkeep',maxRounds:12}],seed:'HIDDEN-TEST-SEED'});
 const access={campaignId:id,actorId:'galahad',role:'player'};
 return {base,state,access};
};
const command=(s,action,extra={},id='cmd-1')=>({campaignId:s.id,actorId:s.actorId,expectedRevision:s.delta.revision,commandId:id,action,...extra});
const ration=v=>v.sheet.inventory.find(i=>i.id==='rations')?.quantity??0;
test('single sheet is effective authority; reader consumes exact projected sheet',()=>{
 const {base,state,access}=setup(),w=effective(base,state.delta),v=playerState(base,state,access);
 assert.equal(w.entities.galahad.privateState.sheet.id,v.actorId);assert.equal(w.entities.galahad.publicState.fatigue,undefined);
 assert.equal(v.revision,state.delta.revision);assert.equal(ration(v),3);assert.ok(sheetView(v.sheet).includes('Galahad'));
 assert.equal(v.effectiveAP,2);
});
test('preview never mutates and confirmation replay is idempotent; stale commands rejected',()=>{
 const {base,state,access}=setup(),c=command(state,'consume-ration'),before=structuredClone(state);
 const a=previewCommand(base,state,{...access,role:'worker'},c),b=previewCommand(base,state,{...access,role:'worker'},c);
 assert.deepEqual(a,b);assert.deepEqual(state,before);assert.equal(ration(playerState(base,state,access)),3);
 assert.throws(()=>confirmCommand(base,state,access,c,{expectedPreviewHash:'wrong'}),/Preview mismatch/);
 const done=confirmCommand(base,state,access,c,{expectedPreviewHash:a.previewHash}),v=playerState(base,done.state,access);
 assert.equal(ration(v),2);assert.equal(v.elapsedSeconds,60);assert.equal(v.revision,state.delta.revision+1);assert.equal(v.journal.length,1);
 const retry=confirmCommand(base,done.state,access,c);assert.equal(retry.duplicate,true);assert.deepEqual(retry.state,done.state);assert.deepEqual(retry.receipt,done.receipt);
 assert.throws(()=>confirmCommand(base,done.state,access,{...c,commandId:'cmd-2'}),/Revision conflict/);
 assert.throws(()=>confirmCommand(base,done.state,access,{...c,action:'travel',targetId:'hex.0.0'}),/Command ID reused/);
});
test('zero rations removes gear and prevents negative resources',()=>{
 let {base,state,access}=setup();
 for(let i=0;i<3;i++)state=confirmCommand(base,state,access,command(state,'consume-ration',{},'ration-'+i)).state;
 assert.equal(ration(playerState(base,state,access)),0);assert.equal(legalActions(base,state,access).some(a=>a.action==='consume-ration'),false);
 assert.throws(()=>confirmCommand(base,state,access,command(state,'consume-ration')),/Action not allowed/);
});
test('explicit open routes only; travel updates same location, clock and journal',()=>{
 const {base,state,access}=setup();
 assert.throws(()=>confirmCommand(base,state,access,command(state,'travel',{targetId:'hex.1.0'})),/Action not allowed/);
 const c=command(state,'travel',{targetId:'hex.0.0'}),done=confirmCommand(base,state,access,c),v=playerState(base,done.state,access);
 assert.equal(v.locationId,'hex.0.0');assert.equal(v.elapsedSeconds,900);assert.equal(v.journal[0].facts[0].toId,v.locationId);assert.equal(v.actions.some(a=>a.action==='duel'),false);
});
test('real tactical duel writes localized HP and conditions into the same sheet; unique check IDs',()=>{
 const {base,state,access}=setup(),c=command(state,'duel',{encounterId:'qa01.duel'}),before=playerState(base,state,access);
 const p=previewCommand(base,state,{...access,role:'worker'},c);assert.deepEqual(before,playerState(base,state,access));
 const done=confirmCommand(base,state,access,c,{expectedPreviewHash:p.previewHash}),v=playerState(base,done.state,access),w=effective(base,done.state.delta);
 assert.ok(done.receipt.event.checks.length>0);assert.equal(new Set(done.receipt.event.checks.map(x=>x.id)).size,done.receipt.event.checks.length);
 assert.notDeepEqual([w.entities.galahad.privateState.sheet,w.entities['wolf-1'].privateState.sheet],[effective(base,state.delta).entities.galahad.privateState.sheet,effective(base,state.delta).entities['wolf-1'].privateState.sheet]);
 assert.deepEqual(v.sheet.locations,w.entities.galahad.privateState.sheet.locations);assert.equal(v.effectiveAP>=0,true);
 assert.equal(v.journal[0].id,done.receipt.event.id);assert.equal(v.actions.some(a=>a.action==='duel'),false);
 assert.ok(sheetView(v.sheet).includes('Anatomía y heridas'));
 assert.throws(()=>playerState(base,p.state,access),/Invalid state/);assert.throws(()=>impactForConfirmed(base,p.state,{...access,role:'analyst'},p.event.id),/Invalid state/);assert.throws(()=>impactForConfirmed(base,done.state,access,done.receipt.event.id),/Analyst access required/);
 const packet=impactForConfirmed(base,done.state,{...access,role:'analyst'},done.receipt.event.id);
 assert.equal(packet.event.id,done.receipt.event.id);assert.ok(packet.candidates.some(x=>x.entityId==='wolf-1'));
 assert.equal(packet.candidates.find(x=>x.entityId==='wolf-1').knowledge.length,0);
});
test('access boundary and player projection omit secrets and speculative futures',()=>{
 const {base,state,access}=setup(),other=setup('qa01-b');
 assert.throws(()=>playerState(base,state,other.access),/Access denied/);
 assert.throws(()=>confirmCommand(base,state,access,{...command(state,'consume-ration'),actorId:'wolf-1'}),/mismatch/);
 assert.throws(()=>confirmCommand(base,state,access,{...command(state,'consume-ration'),seed:'injected'}),/Invalid command fields/);
 const changed=confirmCommand(base,state,access,command(state,'consume-ration')).state;
 assert.equal(ration(playerState(other.base,other.state,other.access)),3);
 const v=playerState(base,changed,access),json=JSON.stringify(v);
 for(const secret of ['HIDDEN-','privateState','seed','receipts','completedEncounters','lost-relic','future'])assert.equal(json.includes(secret),false,secret);
});
test('addressed service replay and unrelated draw isolation',()=>{
 const seed='development-only',a=['campaign','encounter','actor','attack',0],b=['campaign','encounter','actor','defense',0];
 const expected=[addressedRoll(seed,a,100),addressedRoll(seed,b,100)];
 addressedRoll(seed,['unrelated',100],20);
 assert.deepEqual([addressedRoll(seed,a,100),addressedRoll(seed,b,100)],expected);
 assert.throws(()=>addressedRoll(seed,[],100),/address/);
});

// QA-04: compare the same semantic draw across policies and prove all actual draw
// addresses in one duel are unique, even if unrelated requests are inserted.
test('addressed duel replay, unique purposes, paired policies and unrelated draws',async()=>{
 const {simulateDuel}=await import('../public/laboratorio/duel.mjs');
 const {combatRoller}=await import('./campaign-state.mjs');
 const seed='qa04-development', scope=['test-campaign',1,'test-encounter'];
 function run(tactical,extra){
  const r= combatRoller(seed,scope),seen=new Map();
  const roll=(sides,purpose,ordinal)=>{if(extra)r(20,'unrelated-diagnostic',seen.size);const key=JSON.stringify([purpose,ordinal]);assert.ok(!seen.has(key),'repeated address '+key);const value=r(sides,purpose,ordinal);seen.set(key,{value,sides});return value};
  return {result:simulateDuel(galahadSheet(),wolfSheet(),{seed:'private-provider',roll,tactical}),seen};
 }
 const a=run(true,false),b=run(true,true),c=run(false,false);assert.deepEqual(a,b);let common=0;
 for(const [key,value] of a.seen){const other=c.seen.get(key);if(other&&other.sides===value.sides){assert.equal(value.value,other.value);common++}}
 assert.ok(common>=2);
});
test('confirmed changes and combat AP trace refer to the same actor and revision',()=>{
 let {base,state,access}=setup();const c=command(state,'consume-ration'),r=confirmCommand(base,state,access,c);
 assert.deepEqual(r.receipt.event.changes,[{path:'inventory.rations.quantity',before:3,after:2}]);
 assert.equal(r.receipt.event.actorId,playerState(base,r.state,access).actorId);
 const d=confirmCommand(base,r.state,access,command(r.state,'duel',{encounterId:'qa01.duel'},'duel-2'));
 const v=playerState(base,d.state,access),e=v.journal.at(-1);
 assert.equal(e.revision,v.revision);assert.equal(e.combat.actorIds[0],v.actorId);
 assert.ok(e.combat.apTrace.length>0);assert.ok(e.combat.apTrace.every(t=>t.remaining.every(n=>n>=0)));
 assert.deepEqual(confirmCommand(base,d.state,access,c).state,d.state);
 assert.throws(()=>previewCommand(base,state,access,c),/Worker access required/);
});
