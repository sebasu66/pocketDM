import {createServer} from 'node:http';import {readFile,mkdtemp,rm,writeFile} from 'node:fs/promises';import {spawn} from 'node:child_process';import {tmpdir} from 'node:os';import {join,extname,resolve} from 'node:path';import assert from 'node:assert/strict';
const base=resolve('public');const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.webmanifest':'application/manifest+json','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json'};
const server=createServer(async(req,res)=>{try{let path=join(base,new URL(req.url,'http://localhost').pathname.replace(/^\//,'')||'index.html');if(!extname(path))path=join(path,'index.html');res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path))}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const dir=await mkdtemp(join(tmpdir(),'pocketdm-browser-'));const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});let ws;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{let port;for(let i=0;i<80;i++){try{port=(await readFile(join(dir,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0];break}catch{await sleep(150)}}assert.ok(port,'Edge devtools port');let targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await call('Runtime.enable');await call('Page.enable');



await call('Emulation.setDeviceMetricsOverride',{width:1400,height:900,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/dm/libro/stormkeep_laboratorio_editorial_v11.html'});
 for(let i=0;i<100;i++){if(await ev("!!document.querySelector('[data-property=ratio]')"))break;await sleep(100)}
 await ev("(()=>{const n=document.querySelector('#component');n.value='dialogue';n.dispatchEvent(new Event('change'))})()");
 for(let i=0;i<100;i++){if(await ev("!!document.querySelector('[data-property=personLeft]')"))break;await sleep(100)}
 await ev("(()=>{const n=document.querySelector('#scope');n.value='base';n.dispatchEvent(new Event('change'));const v=document.querySelector('[data-property=personLeft]');v.value='13';v.dispatchEvent(new Event('input'))})()");
 for(let i=0;i<100;i++){if(await ev("JSON.parse(localStorage.getItem('editorial:active-dialogue-v1')||'null')?.settings?.base?.personLeft===13"))break;await sleep(100)}
 assert.equal(await ev("JSON.parse(localStorage.getItem('editorial:active-dialogue-v1')).settings.base.personLeft"),13);
 await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/laboratorio/dialogo/'});
 for(let i=0;i<80;i++){if(await ev("document.querySelector('#npc')?.disabled===false"))break;await sleep(100)}
 assert.equal(await ev("document.querySelector('book-editorial-dialogue').effective.personLeft"),13);
 console.log('Actual editor save -> dialogue demo: PASS');
 for(const [width,height,view] of [[1280,720,'desktop'],[844,390,'desktop'],[390,844,'mobile']]){
 await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});
 await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/laboratorio/dialogo/'});
 for(let i=0;i<80;i++){if(await ev("document.querySelector('#npc')?.disabled===false"))break;await sleep(100)}
 assert.equal(await ev("document.querySelector('#npc').disabled"),false);
 const before=await ev("(()=>{const p=document.querySelector('book-editorial-dialogue');return {name:p.content.dialogue.people[0].name,choices:p.content.dialogue.choices.length,view:p.view}})()");
 assert.equal(before.name,'Hald Eirik');assert.equal(before.choices,2);assert.equal(before.view,view);
 if(width===844){
  assert.equal(await ev("!document.querySelector('.mobile-rail').hidden"),true);
  await ev("document.querySelector('[data-mobile=next]').click()");
  assert.equal(await ev("document.querySelector('book-editorial-dialogue').pendingChoice"),0);
  await ev("document.querySelector('[data-mobile=next]').click()");
  assert.equal(await ev("document.querySelector('book-editorial-dialogue').pendingChoice"),1);
  assert.equal(await ev("document.querySelector('book-editorial-dialogue').shadowRoot.querySelectorAll('.message.check').length"),0);
  await ev("document.querySelector('.mobile-rail [aria-label=\"Enviar respuesta elegida\"]').click()");
  await sleep(120);
  assert.equal(await ev("document.querySelector('book-editorial-dialogue').shadowRoot.querySelectorAll('.message.check').length"),1);
  await ev("document.querySelector('#reset').click()");
  console.log('Rail: choose, confirm, reveal and reset OK');
 }

 await ev("(()=>{const p=document.querySelector('book-editorial-dialogue'),s=p.getSettings();s.base.personLeft=11;s.base.dialogLeft=52;s.responsive.mobile={...s.responsive.mobile,personLeft:7,dialogLeft:3};localStorage.setItem('editorial:active-dialogue-v1',JSON.stringify({id:'forja',name:'Test editor',settings:s,time:Date.now()}));window.dispatchEvent(new StorageEvent('storage',{key:'editorial:active-dialogue-v1'}))})()");
 await sleep(200);
 assert.equal(await ev("document.querySelector('book-editorial-dialogue').effective.personLeft"),view==='mobile'?7:11);
 assert.equal(await ev("document.querySelector('book-editorial-dialogue').effective.dialogLeft"),view==='mobile'?3:52);
 await ev("(()=>{const p=document.querySelector('book-editorial-dialogue');if(p.shadowRoot.querySelector('.choices').hidden)p.shadowRoot.querySelector('.choice-toggle').click();p.shadowRoot.querySelectorAll('[data-index]')[1].click();p.shadowRoot.querySelector('.choice-send').click()})()");
 await sleep(120);
 assert.ok(await ev("document.querySelector('book-editorial-dialogue').shadowRoot.querySelector('.message.check').textContent.includes('D100')"));
 assert.equal(await ev("document.querySelector('book-editorial-dialogue').content.dialogue.choices.length"),0);
 await ev("(()=>{const p=document.querySelector('book-editorial-dialogue'),s=p.getSettings();s.base.personLeft=12;s.responsive.mobile.personLeft=8;localStorage.setItem('editorial:active-dialogue-v1',JSON.stringify({id:'forja',name:'Test editor',settings:s,time:Date.now()}));window.dispatchEvent(new StorageEvent('storage',{key:'editorial:active-dialogue-v1'}))})()");
 await sleep(200);
 assert.equal(await ev("document.querySelector('book-editorial-dialogue').effective.personLeft"),view==='mobile'?8:12);
 assert.ok(await ev("!!document.querySelector('book-editorial-dialogue').shadowRoot.querySelector('.message.check')"));
 await ev("document.querySelector('#reset').click()");await sleep(100);
 assert.equal(await ev("document.querySelector('book-editorial-dialogue').content.dialogue.choices.length"),2);
 console.log(width+'x'+height+' shared settings, response, check and history persistence OK');
}
assert.deepEqual(errors,[]);
}finally{ws?.close();edge.kill();server.close();await sleep(200);await rm(dir,{recursive:true,force:true,maxRetries:3,retryDelay:200}).catch(()=>{})}