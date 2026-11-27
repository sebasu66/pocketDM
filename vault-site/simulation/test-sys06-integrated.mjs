import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createEmulatedPreparedStore} from './prepared-campaign-store.mjs';
import {createPreparedPlayer} from './prepared-campaign-player.mjs';
import {createCampaignHttp} from './campaign-http.mjs';
import {createSys06BookTransport} from '../public/libro/sys06-book-transport.mjs';
import {initialWorld} from './world-pilot.mjs';
import {createState,confirmCommand,playerState} from './campaign-state.mjs';
import {snapshot} from './world-context.mjs';
import {galahadSheet} from '../public/laboratorio/character-sheet.mjs';
import {existsSync} from 'node:fs';
const required=['bound-adventure-compiler.mjs','narrative-repository.mjs','approved-module-narration.mjs','../public/libro/book-campaign-session.mjs'];
const missing=required.filter(p=>!existsSync(new URL(p,import.meta.url)));
const reason=missing.length?'Requires SYS-04/05/07 reviewed files: '+missing.join(', '):!process.env.FIRESTORE_EMULATOR_HOST?'Requires isolated Firestore emulator':false;
test('SYS-04/05/07 integrated prepared choice, approved persistence, book retry and CAS',{skip:reason},async()=>{
 const {compileBoundEdition,startBoundEdition,confirmBoundChoice,boundChoiceView}=await import('./bound-adventure-compiler.mjs');
 const {prepareNarrativeJob,NarrativeRepository,validateApprovedArtifact}=await import('./narrative-repository.mjs');
 const {confirmedModuleNarration}=await import('./approved-module-narration.mjs');
 const {createBookCampaignSession}=await import('../public/libro/book-campaign-session.mjs');
 const w=initialWorld(),base=snapshot({canon:w.canon,nodes:Object.values(w.nodes),entities:Object.values(w.entities),routes:Object.values(w.routes)});
 const campaignId='sys06-'+randomUUID(),actorId='galahad',uid='fixture-owner',scope={campaignId,actorId,uid,role:'player'},worker={campaignId,uid:'fixture-worker',role:'worker'};
 const access={campaignId,actorId,role:'player'};
 const def={schemaVersion:1,id:'test.sys06',version:'v1',mode:'mechanical-fixture',evidence:[{id:'clue',description:'Pista sintética.'}],intents:[
  {id:'accept',capability:'module-accept',locationId:'stormkeep',status:'offered',seconds:15,requires:[],knownEvidence:[]},
  {id:'decline',capability:'module-decline',locationId:'stormkeep',status:'offered',seconds:15,requires:[],knownEvidence:[]},
  {id:'inspect',capability:'inspect',locationId:'stormkeep',status:'active',seconds:15,requires:['accept'],knownEvidence:[],evidenceId:'clue',difficulty:'standard'},
  {id:'close',capability:'module-close',locationId:'stormkeep',status:'active',seconds:15,requires:['inspect'],knownEvidence:[]}
 ]};
 const initial=createState(base,{id:campaignId,actorId,actorSheets:[galahadSheet()],seed:'PRIVATE-FIXTURE-SEED',moduleDefinition:def});
 let prepared=0;
 const edition=compileBoundEdition({module:{id:'test.sys06',version:'v1',mode:'mechanical-fixture',intentIds:['accept','decline','inspect','close'],endingIds:['accept-end','decline-end']},initial,bindings:{
  enumerate:s=>playerState(base,s,access).actions.filter(a=>a.action==='module-intent'),
  prepare:(s,a,{branchId})=>{prepared++;const r=confirmCommand(base,s,access,{...a,campaignId,actorId,expectedRevision:s.delta.revision,commandId:'prep-'+branchId});const event=playerState(base,r.state,access).journal.at(-1);return {state:r.state,event,context:{fixture:true},slotId:'slot-'+a.intentId}},
  ending:s=>({declined:'decline-end',closed:'accept-end'})[playerState(base,s,access).module.status]??null
 }});
 const repository=new NarrativeRepository(),artifacts=[];
 for(const edge of Object.values(edition.nodes).flatMap(n=>n.edges)){
  const checkMap=Object.fromEntries(edge.event.checks.map((c,i)=>['check-'+i,c.id]));
  const job=prepareNarrativeJob({campaignId,editionId:edition.editionId,branchId:edge.branchId,slotId:edge.slotId,audience:'player',locale:'es-AR',versions:{module:'v1',rules:'v1',canon:'v1',narrator:'v1',context:'v1'},context:{actorVisible:'Actor sintético',npcVisible:'Ninguno',place:'Lugar de prueba',time:'Día',known:[],intent:edge.action.intentId},facts:edge.event.facts.map(f=>({id:f.id,text:f.description})),options:[],checks:edge.event.checks.map((c,i)=>({slotId:'check-'+i,outcome:c.outcome})),required:true});
  const p={...worker,editionId:edition.editionId};
  repository.enqueue(p,job);
  const generated=await repository.generate(p,job,async()=>({title:'Escena '+edge.action.intentId,text:['Narración sintética.',...job.checks.map(c=>({checkSlot:c.slotId}))],factIds:job.facts.map(f=>f.id),optionIds:[]}));
  await repository.review({...p,role:'reviewer'},job,generated.revision,async()=>({fidelity:true,privacy:true,checks:true,reviewId:'fixture-review'}));
  artifacts.push({job,artifact:repository.approvedArtifact(p,job),checkMap});
 }
 const newPlayer=()=>createPreparedPlayer({environment:'fixture',store:createEmulatedPreparedStore(),startBoundEdition,confirmBoundChoice,boundChoiceView,validateApprovedArtifact,confirmedModuleNarration});
 const service=newPlayer(),installation={base,edition,artifacts,title:'Fixture SYS-06',labels:{accept:'Aceptar',decline:'Rechazar',inspect:'Inspeccionar',close:'Cerrar'},ownerUid:uid,actorId};
 await assert.rejects(service.install(worker,{...installation,artifacts:artifacts.slice(0,1)}),/coverage/);
 await service.install(worker,installation);
 const makeHttp=s=>createCampaignHttp({verifyIdToken:async token=>{if(token!=='valid')throw Error('bad');return {uid}},lookupGrant:async(u,c)=>u===uid&&c===campaignId?scope:null,player:s});
 let handler=makeHttp(newPlayer());
 const fetchImpl=(url,init)=>handler(new Request('https://fixture.invalid'+url,init));
 const transport=createSys06BookTransport({getIdToken:async()=> 'valid',fetchImpl});
 let loaded;
 const book=createBookCampaignSession({reader:{load:e=>{loaded=e},bindTransport(){}},readEdition:e=>e,transport,scope:{campaignId,actorId},makeCommandId:()=> '5'+randomUUID()});
 const first=await book.resume();assert.equal(first.pages[0].choices.length,2);
 const a=first.pages[0].choices.find(c=>c.label==='Aceptar'),b=first.pages[0].choices.find(c=>c.label==='Rechazar');
 const command={campaignId,actorId,commandId:'cmd-'+randomUUID(),expectedRevision:first.revision,pageId:first.pages[0].id,choiceId:a.id};
 const [x,y]=await Promise.all([transport.confirm(command),transport.confirm(command)]);
 assert.deepEqual(x,y);assert.equal(x.revision,first.revision+1);
 await assert.rejects(transport.confirm({...command,commandId:'other-'+randomUUID(),choiceId:b.id}),/REVISION_CONFLICT/);
 await assert.rejects(transport.confirm({...command,choiceId:b.id}),/COMMAND_ID_REUSED/);
 handler=makeHttp(newPlayer());
 const resumed=await transport.resume({campaignId,actorId});assert.deepEqual(resumed,x);assert.equal(resumed.pages.length,2);
 assert.equal(resumed.pages[1].events[0].presentationStatus,'approved');
 await book.resume();
 const checked=await book.confirm({campaignId,actorId,expectedRevision:resumed.revision,pageId:resumed.pages.at(-1).id,choiceId:resumed.pages.at(-1).choices[0].id});
 const check=checked.pages.at(-1).events[0].presentation.checks[0];assert.ok(check);assert.equal(checked.pages.at(-1).events[0].presentation.text.filter(t=>t?.check===check.id).length,1);
 const original=edition.nodes[edition.nodes[edition.rootId].edges.find(e=>e.action.intentId==='accept').nextId].edges[0].event.checks[0];assert.deepEqual(check,original);
 const c={campaignId,actorId,commandId:'close-'+randomUUID(),expectedRevision:checked.revision,action:'module-intent',intentId:'close'};
 const result=await newPlayer().confirmPrepared(scope,c);assert.equal(result.view.revision,first.revision+3);assert.equal(result.view.module.status,'closed');
 assert.equal((await newPlayer().confirmPrepared(scope,c)).duplicate,true);
 const final=await transport.resume({campaignId,actorId});assert.equal(final.revision,first.revision+3);assert.equal(final.pages.at(-1).choices.length,0);
 assert.equal(prepared,4);
 assert.equal(JSON.stringify(final).includes('PRIVATE-FIXTURE-SEED'),false);
 assert.equal(JSON.stringify(final).includes('branch-'),false);
 assert.equal((await handler(new Request('https://fixture.invalid/api/campaigns/'+campaignId+'/book',{headers:{Authorization:'Bearer invalid'}}))).status,401);
 await assert.rejects(newPlayer().book({...scope,uid:'other'}),/NOT_FOUND/);
 const latest=await book.resume();assert.deepEqual(latest,loaded);
});
