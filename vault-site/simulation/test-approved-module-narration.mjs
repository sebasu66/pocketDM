import test from 'node:test';
import assert from 'node:assert/strict';
import {initialWorld} from './world-pilot.mjs';
import {snapshot} from './world-context.mjs';
import {galahadSheet} from '../public/laboratorio/character-sheet.mjs';
import {createState,playerState,confirmCommand} from './campaign-state.mjs';
import {confirmedModuleNarration,confirmedEventDigest} from './approved-module-narration.mjs';
const intent=(id,capability,extra={})=>({id,capability,locationId:'stormkeep',status:'active',seconds:15,requires:[],knownEvidence:[],...extra});
function fixture(){
 const w=initialWorld(),base=snapshot({canon:w.canon,nodes:Object.values(w.nodes),routes:Object.values(w.routes),entities:Object.values(w.entities)});
 const moduleDefinition={schemaVersion:1,id:'fixture.sys07',version:'fixture-v1',mode:'mechanical-fixture',evidence:[{id:'trace',description:'Synthetic visible trace.'}],intents:[intent('accept','module-accept',{status:'offered'}),intent('inspect','inspect',{evidenceId:'trace',difficulty:'standard'}),intent('close','module-close',{requires:['inspect']})]};
 const state=createState(base,{id:'fixture-sys07',actorId:'galahad',actorSheets:[galahadSheet()],seed:'synthetic-sys07',moduleDefinition});
 const access={campaignId:state.id,actorId:state.actorId,role:'player'};
 const apply=(s,intentId)=>confirmCommand(base,s,access,{campaignId:s.id,actorId:s.actorId,expectedRevision:s.delta.revision,commandId:'fixture-'+intentId,action:'module-intent',intentId});
 const accepted=apply(state,'accept').state,result=apply(accepted,'inspect');
 const event=playerState(base,result.state,access).journal.at(-1);
 return {base,state:result.state,access,event};
}
test('approved synthetic fragment binds confirmed module event and uses real check only',async()=>{
 const {base,state,access,event}=fixture();
 const find=async scope=>({schemaVersion:1,status:'approved',...scope,title:'Inspección de prueba',roman:'',text:['Inspección confirmada. ',{check:event.checks[0].id}]});
 const output=await confirmedModuleNarration(base,state,access,event.id,find);
 assert.equal(output.presentationStatus,'approved');assert.deepEqual(output.presentation.checks,event.checks);
 assert.equal(output.presentation.text.filter(t=>typeof t!=='string').length,1);
 assert.deepEqual(output,await confirmedModuleNarration(base,state,access,event.id,find));
 assert.ok(!JSON.stringify(output).includes('eventDigest'));
 assert.notEqual(confirmedEventDigest(event),confirmedEventDigest({...event,elapsedSeconds:event.elapsedSeconds+1}));
 await assert.rejects(confirmedModuleNarration(base,state,access,event.id,async()=>null),/preparación/);
 await assert.rejects(confirmedModuleNarration(base,state,access,event.id,async s=>({...await find(s),eventDigest:'obsolete'})),/desactualizado/);
 await assert.rejects(confirmedModuleNarration(base,state,access,'unconfirmed',find),/not confirmed/);
 await assert.rejects(confirmedModuleNarration(base,state,access,event.id,async s=>({...await find(s),seed:'private'})),/preparación/);
});
