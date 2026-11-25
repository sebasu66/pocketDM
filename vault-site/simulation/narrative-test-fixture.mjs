import {snapshot} from './world-context.mjs';
import {initialWorld} from './world-pilot.mjs';
import {galahadSheet,wolfSheet} from '../public/laboratorio/character-sheet.mjs';
import {createState,playerState,confirmCommand} from './campaign-state.mjs';
import {confirmedNarration} from './narrative-projection.mjs';
export function setup(id='qa02-a'){
 const source=initialWorld();
 const base=snapshot({canon:source.canon,nodes:Object.values(source.nodes),entities:[...Object.values(source.entities),{id:'wolf-1',kind:'creature',name:'Lobo',locationId:'stormkeep',visibility:'public',privateState:{secret:'PRIVATE-WOLF'}}],routes:[...Object.values(source.routes),{id:'qa02.route',a:'stormkeep',b:'hex.0.0',status:'open',minutes:15,visibility:'public'}]});
 const state=createState(base,{id,actorId:'galahad',actorSheets:[galahadSheet(),wolfSheet()],knownIds:['stormkeep','hex.0.0','wolf-1'],encounters:[{id:'qa02.duel',opponentId:'wolf-1',locationId:'stormkeep',maxRounds:12}],seed:'DEVELOPMENT-ONLY-QA02'});
 return {base,state,access:{campaignId:id,actorId:'galahad',role:'player'}};
}
export const cmd=(s,action,extra={},commandId='cmd-1')=>({campaignId:s.id,actorId:s.actorId,expectedRevision:s.delta.revision,commandId,action,...extra});
export function confirmedDuel(){
 const {base,state,access}=setup();const c=cmd(state,'duel',{encounterId:'qa02.duel'});
 const done=confirmCommand(base,state,access,c);
 const view=playerState(base,done.state,access);
 return {base,state:done.state,access,view,envelope:confirmedNarration(base,done.state,access,done.receipt.event.id)};
}
