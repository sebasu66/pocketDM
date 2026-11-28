import {createServer} from 'node:http';import {readFile,mkdtemp,rm,writeFile} from 'node:fs/promises';import {spawn} from 'node:child_process';import {tmpdir} from 'node:os';import {join,extname,resolve} from 'node:path';import assert from 'node:assert/strict';
const base=resolve('public');const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.webmanifest':'application/manifest+json','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let path=join(base,new URL(req.url,'http://localhost').pathname.replace(/^\//,'')||'index.html');if(!extname(path))path=join(path,'index.html');res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path))}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const dir=await mkdtemp(join(tmpdir(),'pocketdm-browser-'));const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});let ws;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{let port;for(let i=0;i<80;i++){try{port=(await readFile(join(dir,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0];break}catch{await sleep(150)}}assert.ok(port,'Edge devtools port');let targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await call('Runtime.enable');await call('Page.enable');
const origin='http://127.0.0.1:'+server.address().port;
async function viewport(width,height){await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});await sleep(150)}
async function at(id){for(let i=0;i<60;i++){if(await ev("document.querySelector('book-universal-page')?.pageId")==id)return;await sleep(100)}assert.fail('Expected scene '+id)}
const choose=async id=>ev("document.querySelector('book-universal-page').shadowRoot.querySelector('button[data-choice-id="+id+"]').click()");
await viewport(344,882);await call('Page.navigate',{url:origin+'/app/'});
for(let i=0;i<80;i++){if(await ev("!!document.querySelector('.home-campaign a[href=\"/libro/prueba/\"]')"))break;await sleep(100)}
assert.ok(await ev("!!document.querySelector('.home-campaign a[href=\"/libro/prueba/\"]')"));
await ev("document.querySelector('.home-campaign a[href=\"/libro/prueba/\"]').click()");await at('cover');
assert.equal(await ev("location.pathname"),'/libro/prueba/');
assert.equal(await ev("document.querySelector('link[rel=manifest]').getAttribute('href')"),'/app.webmanifest');
assert.ok(await ev("document.querySelector('book-universal-page').shadowRoot.querySelector('[data-element-id=title-art] img').src.endsWith('LOGO/stormkeep.png')"));
assert.equal(await ev("document.querySelector('book-universal-page').dataset.view"),'mobile');
await choose('travel');await at('location');await choose('travel');await at('dialogue');await choose('accept');await at('dialogue');
assert.equal(await ev("document.querySelector('book-universal-page').shadowRoot.querySelectorAll('.history-entry.chosen').length"),1);
await viewport(800,666);assert.equal(await ev("document.querySelector('book-universal-page').dataset.view"),'fold');await at('dialogue');assert.equal(await ev("document.querySelector('book-universal-page').shadowRoot.querySelectorAll('.history-entry.chosen').length"),1);
await viewport(344,882);assert.equal(await ev("document.querySelector('book-universal-page').dataset.view"),'mobile');
await call('Page.reload');await at('dialogue');assert.equal(await ev("document.querySelector('book-universal-page').shadowRoot.querySelectorAll('.history-entry.chosen').length"),1);
await choose('leave');await at('exploration');assert.ok(await ev("document.querySelector('book-universal-page').shadowRoot.querySelector('button .symbol').src.endsWith('ICON/perception.png')"));
assert.ok(await ev("getComputedStyle(document.querySelector('book-universal-page').shadowRoot.querySelector('.choice-row'),'::before').borderImageSource.includes('grunge_choice_normal.png')"));
await choose('travel');await at('perception');assert.equal(await ev("document.querySelector('book-universal-page').shadowRoot.querySelectorAll('[data-check-id]').length"),1);
await choose('travel');await at('athletics');await choose('travel');await at('decision');await choose('fight');await at('combat');assert.equal(await ev("document.querySelector('book-universal-page').shadowRoot.querySelectorAll('[data-check-id]').length"),3);
await choose('travel');await at('victory');await choose('restart');await at('cover');
for(const [choice,ending] of [['detour','detour'],['return','return']]){await choose('travel');await at('location');await choose('travel');await at('dialogue');await choose('ask');await choose('leave');await at('exploration');for(const id of ['perception','athletics','decision']){await choose('travel');await at(id)}await choose(choice);await at(ending);await choose('restart');await at('cover')}
for(const [w,h,v] of [[390,844,'mobile'],[800,666,'fold'],[1920,1080,'desktop'],[3440,1440,'desktop'],[3840,2160,'desktop']]){await viewport(w,h);assert.equal(await ev("document.querySelector('book-universal-page').dataset.view"),v);assert.ok(await ev("document.documentElement.scrollWidth<="+(w+1)));await at('cover')}
assert.deepEqual(errors,[]);console.log('PASS PWA home entry, manifest, actual universal page, new art, dialogue retained across fold/unfold and reload, 3 endings, 6 screen sizes');
}finally{ws?.close();edge.kill();server.close();await sleep(400);await rm(dir,{recursive:true,force:true}).catch(()=>{})}
