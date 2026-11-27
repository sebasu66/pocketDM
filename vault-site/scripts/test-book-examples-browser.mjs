import {createServer} from 'node:http';import {readFile,mkdtemp,rm,writeFile} from 'node:fs/promises';import {spawn} from 'node:child_process';import {tmpdir} from 'node:os';import {join,extname,resolve} from 'node:path';import assert from 'node:assert/strict';
const base=resolve('public');const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.webmanifest':'application/manifest+json','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let path=join(base,new URL(req.url,'http://localhost').pathname.replace(/^\//,'')||'index.html');if(!extname(path))path=join(path,'index.html');res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path))}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const dir=await mkdtemp(join(tmpdir(),'pocketdm-browser-'));const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});let ws;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{let port;for(let i=0;i<80;i++){try{port=(await readFile(join(dir,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0];break}catch{await sleep(150)}}assert.ok(port,'Edge devtools port');let targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await call('Runtime.enable');await call('Page.enable');
for(const [width,height] of [[1280,900],[844,390]]){
 await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});
 await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/libro/?view=examples'});
 for(let i=0;i<80;i++){if(await ev("!!document.querySelector('book-example-page select')"))break;await sleep(100)}
 assert.equal(await ev("document.querySelector('book-example-page select').options.length"),12);
 const go=async i=>ev("(()=>{const s=document.querySelector('book-example-page select');s.value='"+i+"';s.dispatchEvent(new Event('change'))})()");
 const at=async i=>assert.equal(await ev("document.querySelector('book-example-page').getAttribute('index')"),String(i));
 for(let i=1;i<=11;i++){
  await go(i);await at(i);
  assert.equal(await ev("new URLSearchParams(location.search).get('page')"),String(i+1));
  const tag=['','cover','scene','dialogue','exploration','exploration','exploration','climax','combat','resolution','resolution','resolution'][i];
  assert.ok(await ev("!!document.querySelector('book-editorial-"+tag+"')"));
  await sleep(120);
  assert.equal(await ev("Array.from(document.querySelectorAll('book-example-page .sample')).some(x=>x.textContent.startsWith('Diseño no disponible'))"),false);
  if(i===3){assert.equal(await ev("document.querySelectorAll('book-example-page .decision button').length"),2);await ev("document.querySelector('book-example-page .decision button').click()");assert.equal(await ev("document.querySelector('book-example-page .decision button').getAttribute('aria-pressed')"),'true');assert.match(await ev("document.querySelector('book-example-page .decision + .sample').textContent"),/lámpara/)}
  if([5,6,8].includes(i)){
   const count=await ev("document.querySelectorAll('book-example-page .skill-pill').length");assert.equal(count,i===8?3:1);
   assert.equal(await ev("new Set([...document.querySelectorAll('book-example-page .skill-pill')].map(x=>x.dataset.checkId)).size"),count);
   await ev("document.querySelector('book-example-page .skill-pill').click()");
   assert.equal(await ev("document.getElementById('mechanics').open"),true);
   assert.equal(await ev("Number(document.querySelector('.check-die b').textContent)"),i===5?28:i===6?63:39);
   await ev("document.querySelector('.mechanics-close').click()");
  }
 }
 for(const [choice,destination] of [[0,8],[1,10],[2,11]]){
  await go(7);assert.equal(await ev("document.querySelectorAll('book-example-page .decision button').length"),3);
  assert.equal(await ev("document.getElementById('next').disabled"),true);
  await ev("document.querySelectorAll('book-example-page .decision button')["+choice+"].click()");await at(destination);
  if(destination===8){await ev("document.querySelector('.book-example-continue').click()");await at(9)}
  assert.equal(await ev("document.getElementById('next').disabled"),true);
  assert.ok(await ev("document.querySelector('book-editorial-resolution')!==null"));
 }
 await go(0);assert.equal(await ev("document.querySelectorAll('book-example-page .decision button').length"),11);
 console.log('PASS '+width+'x'+height+': 11 folios, dialogue, 2 skill checks, combat, 3 endings and index');
}
assert.deepEqual(errors,[]);
}finally{ws?.close();edge.kill();server.close();await sleep(400);await rm(dir,{recursive:true,force:true}).catch(()=>{})}
