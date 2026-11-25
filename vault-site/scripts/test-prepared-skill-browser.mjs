import {preparedHorse,presetIds} from '../simulation/prepared-skill-book-fixture.mjs';
import {createServer} from 'node:http';import {readFile,mkdtemp,rm,writeFile} from 'node:fs/promises';import {spawn} from 'node:child_process';import {tmpdir} from 'node:os';import {join,extname,resolve} from 'node:path';import assert from 'node:assert/strict';
const base=resolve('public');const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.webmanifest':'application/manifest+json','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let path=join(base,new URL(req.url,'http://localhost').pathname.replace(/^\//,'')||'index.html');if(!extname(path))path=join(path,'index.html');res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path))}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const dir=await mkdtemp(join(tmpdir(),'pocketdm-browser-'));const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});let ws;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{let port;for(let i=0;i<80;i++){try{port=(await readFile(join(dir,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0];break}catch{await sleep(150)}}assert.ok(port,'Edge devtools port');let targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await call('Runtime.enable');await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/libro/?view=skillCheckDemo'});for(let i=0;i<80;i++){if(await ev("document.querySelector('prepared-skill-example select')!==null"))break;await sleep(100)}
assert.equal(await ev("document.querySelector('prepared-skill-example select')!==null"),true);
for(const preset of presetIds)for(const choice of ['catch','dodge']){
 const {envelope,prepared}=preparedHorse(preset,choice);
 const select="document.querySelector('prepared-skill-example select')";
 await ev(select+".value="+JSON.stringify(preset));await ev("document.querySelector('[data-skill-choice="+choice+"]').click()");
 assert.equal(await ev("document.querySelectorAll('prepared-skill-example .skill-pill').length"),1);
 assert.equal(await ev("document.querySelector('prepared-skill-example .skill-pill').dataset.checkId"),prepared.id);
 await ev("document.querySelector('prepared-skill-example .skill-pill').click()");
 assert.equal(await ev("document.getElementById('mechanics').open"),true);
 assert.equal(await ev("document.querySelector('.check-die b').textContent"),String(prepared.roll));
 assert.equal(await ev("document.querySelector('.check-actor').textContent"),prepared.actorName);
 await ev("document.querySelector('.mechanics-close').click()");
 assert.equal(await ev("document.querySelectorAll('[data-skill-choice]:disabled').length"),2);
 await ev("document.querySelector('prepared-skill-example > button').click()");
}
assert.deepEqual(errors,[]);
console.log('PASS: 3 character sheets, 6 prepared branches, existing book, exact roll and actor, no second selection.');
}finally{ws?.close();edge.kill();server.close();await sleep(400);await rm(dir,{recursive:true,force:true}).catch(()=>{})}
