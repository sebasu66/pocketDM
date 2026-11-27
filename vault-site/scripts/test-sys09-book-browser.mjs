import {makeCampaignProjection} from '../public/libro/campaign-projection.mjs';
import {confirmedDuel} from '../simulation/narrative-test-fixture.mjs';
import {createServer} from 'node:http';import {readFile,mkdtemp,rm,writeFile} from 'node:fs/promises';import {spawn} from 'node:child_process';import {tmpdir} from 'node:os';import {join,extname,resolve} from 'node:path';import assert from 'node:assert/strict';
const base=resolve('public');const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.webmanifest':'application/manifest+json','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let path=join(base,new URL(req.url,'http://localhost').pathname.replace(/^\//,'')||'index.html');if(!extname(path))path=join(path,'index.html');res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path))}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const dir=await mkdtemp(join(tmpdir(),'pocketdm-browser-'));const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});let ws;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{let port;for(let i=0;i<80;i++){try{port=(await readFile(join(dir,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0];break}catch{await sleep(150)}}assert.ok(port,'Edge devtools port');let targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await call('Runtime.enable');await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/libro/?view=demo'});for(let i=0;i<50;i++){if(await ev("document.querySelectorAll('book-skill-check .skill-pill').length>0"))break;await sleep(100)}
const {envelope,view}=confirmedDuel();
const scope={campaignId:view.campaignId,actorId:view.actorId,revision:view.revision};
const data={schemaVersion:1,kind:'pocketdm-player-edition',...scope,title:'Synthetic book',projection:makeCampaignProjection(view),pages:[{id:'start',type:'location',title:'Start',text:[],events:[],choices:[]},{id:'latest',type:'combat',title:'Latest',text:[],events:[envelope],choices:[]}]};
await ev('window.PocketDMEdition.load('+JSON.stringify(data)+',{focusLatest:true})');
assert.ok(await ev("document.querySelector('book-player-page[index=\\'1\\']')!==null"));
for(const [v,tag] of [['character','book-sheet'],['journal','book-journal'],['map','book-map']]){
 await ev("document.querySelector('a[data-route-view="+v+"]').click()");
 assert.ok(await ev("document.querySelector('"+tag+"[confirmed]')!==null"),v);
 assert.ok(await ev("document.querySelector('"+tag+"[confirmed]').textContent.includes('"+view.revision+"')"),v+' revision');
 if(v==='map')assert.ok(await ev("document.querySelector('book-map[confirmed]').textContent.includes("+JSON.stringify(view.nodes.find(n=>n.id===view.locationId).name)+")"));
 await ev("document.querySelector('a[data-route-view=story]').click()");
}
assert.deepEqual(errors,[]);
console.log('PASS: confirmed book latest folio, sheet, journal and visible map on the same revision.');
}finally{ws?.close();edge.kill();server.close();await sleep(400);await rm(dir,{recursive:true,force:true}).catch(()=>{})}
