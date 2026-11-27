import {createServer} from 'node:http';import {readFile,mkdtemp,rm} from 'node:fs/promises';import {spawn} from 'node:child_process';import {tmpdir} from 'node:os';import {join,extname,resolve} from 'node:path';import assert from 'node:assert/strict';
const base=resolve('public'),mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.webp':'image/webp'};
const server=createServer(async(req,res)=>{try{let p=join(base,new URL(req.url,'http://localhost').pathname.replace(/^\//,''));if(!extname(p))p=join(p,'index.html');res.setHeader('Content-Type',mime[extname(p)]||'application/octet-stream');res.end(await readFile(p))}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const dir=await mkdtemp(join(tmpdir(),'pocketdm-atlas-'));const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--enable-unsafe-swiftshader','--use-angle=swiftshader','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});let ws;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{let port;for(let i=0;i<80;i++){try{port=(await readFile(join(dir,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0];break}catch{await sleep(150)}}assert.ok(port,'Edge devtools port');let targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await call('Runtime.enable');await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await call('Page.navigate',{url:process.env.POCKETDM_TEST_URL||'http://127.0.0.1:'+server.address().port+'/atlas/?project=azgaar'});
for(let i=0;i<120;i++){if(await ev("document.body?.dataset.ready==='true'"))break;await sleep(150)}
assert.equal(await ev("document.body?.dataset.ready"),'true');
assert.match(await ev("document.querySelector('#mapTitle').textContent"),/Azgaar/);
assert.equal(await ev("document.querySelectorAll('.asset').length"),1);
assert.equal(await ev("document.querySelectorAll('#viewport canvas').length"),1);
await ev("document.querySelector('#places button').click();document.querySelector('#enter').click()");assert.equal(await ev("document.querySelector('#maps').value"),'azgaar-region');
assert.match(await ev("document.querySelector('#mapTitle').textContent"),/Costa de Stormkeep/);
await ev("document.querySelector('#save').click()");for(let i=0;i<30;i++){if(/guardado/.test(await ev("document.querySelector('#status').textContent")))break;await sleep(100)}
assert.match(await ev("document.querySelector('#status').textContent"),/guardado/);
await call('Page.reload');for(let i=0;i<100;i++){if(await ev("document.body?.dataset.ready==='true'"))break;await sleep(100)}assert.equal(await ev("document.querySelector('#maps').value"),'azgaar-region');
assert.deepEqual(errors,[]);console.log('Azgaar browser: exported bitmap, world-to-region navigation, isolated save verified');
}finally{ws?.close();edge.kill();server.close();await sleep(400);await rm(dir,{recursive:true,force:true,maxRetries:5,retryDelay:300}).catch(()=>{})}
