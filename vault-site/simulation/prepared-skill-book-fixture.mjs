// Noncanonical integration example; uses the actual starting roster and same engine as campaign.
import {snapshot} from './world-context.mjs';
import {initialWorld} from './world-pilot.mjs';
import {stormkeepSheet,presetIds} from '../public/laboratorio/stormkeep-presets.mjs';
import {createState,confirmCommand,prepareWindow,playerState} from './campaign-state.mjs';
import {confirmedNarration} from './narrative-projection.mjs';
const intents=[
 {id:'accept',capability:'module-accept',status:'offered'},
 {id:'catch',capability:'skill-check',status:'active',challengeId:'horse',check:{skillId:'brawn',difficulty:'hard',reason:'Sujetar un caballo desbocado.'}},
 {id:'dodge',capability:'skill-check',status:'active',challengeId:'horse',check:{skillId:'evade',difficulty:'standard',reason:'Apartarse de un caballo desbocado.'}},
 {id:'finish',capability:'module-close',status:'active',requires:['catch']}
].map(i=>({locationId:'stormkeep',seconds:1,requires:[],knownEvidence:[],...i}));
export function preparedHorse(presetId='paladin',choiceId='catch'){
 const sheet=stormkeepSheet(presetId),source=initialWorld();
 // Replace the example player identity with the selected actor, not a second character sheet.
 const entities=Object.values(source.entities).map(e=>e.id==='galahad'?{...e,id:sheet.id,name:sheet.name}:e);
 const base=snapshot({canon:source.canon,nodes:Object.values(source.nodes),entities,routes:Object.values(source.routes)});
 const id='horse-demo-'+presetId,access={campaignId:id,actorId:sheet.id,role:'player'};
 const state=createState(base,{id,actorId:sheet.id,actorSheets:[sheet],seed:'PUBLIC-HORSE-INTEGRATION-V2',moduleDefinition:{schemaVersion:1,id:'test.horse',version:'1',mode:'mechanical-fixture',evidence:[],intents}});
 const accepted=confirmCommand(base,state,access,{campaignId:id,actorId:sheet.id,commandId:'accept',expectedRevision:state.delta.revision,action:'module-intent',intentId:'accept'}).state;
 const window=prepareWindow(base,accepted,{...access,role:'worker'},{maxDepth:1,maxEdges:100});
 const edge=window.nodes[0].choices.find(e=>e.command.intentId===choiceId);
 const done=confirmCommand(base,accepted,access,edge.command,{preparedTransition:window.preparedTransitions[edge.command.commandId],expectedPreviewHash:edge.previewHash});
 const view=playerState(base,done.state,access),envelope=confirmedNarration(base,done.state,access,done.receipt.event.id);
 return {envelope,view,prepared:window.jobs.find(j=>j.eventId===edge.eventId).input.event.checks[0]};
}
export {presetIds};
