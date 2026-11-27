import {createServer} from 'node:http';import {readFile,mkdtemp,rm,writeFile} from 'node:fs/promises';import {spawn} from 'node:child_process';import {tmpdir} from 'node:os';import {join,extname,resolve} from 'node:path';import assert from 'node:assert/strict';
const base=resolve('public');const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.webmanifest':'application/manifest+json','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg'};
const server=createServer(async(req,res)=>{try{let path=join(base,new URL(req.url,'http://localhost').pathname.replace(/^\//,'')||'index.html');if(!extname(path))path=join(path,'index.html');res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path))}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const dir=await mkdtemp(join(tmpdir(),'pocketdm-browser-'));const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});let ws;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{let port;for(let i=0;i<80;i++){try{port=(await readFile(join(dir,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0];break}catch{await sleep(150)}}assert.ok(port,'Edge devtools port');let targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await call('Runtime.enable');await call('Page.enable');
for(const [width,height] of [[1280,900],[390,844],[360,640]]){
 await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});
 await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/dm/libro/universal/'});
 for(let i=0;i<80;i++){if(await ev("!!document.querySelector('book-universal-page')?.shadowRoot?.querySelector('.interaction button')"))break;await sleep(100)}
 const go=async id=>ev("(()=>{const s=document.getElementById('scene');s.value="+JSON.stringify(id)+";s.dispatchEvent(new Event('change'))})()");
 const at=async id=>assert.equal(await ev("document.querySelector('book-universal-page').pageId"),id);
 const choose=async id=>ev("document.querySelector('book-universal-page').shadowRoot.querySelector('button[data-choice-id="+id+"]').click()");
 const ids=['cover','location','dialogue','exploration','perception','athletics','decision','combat','victory','detour','return'];
 for(const id of ids){await go(id);await at(id);await sleep(60);const q=await ev("(()=>{const p=document.querySelector('book-universal-page'),r=p.shadowRoot;return {view:p.dataset.view,panel:r.querySelectorAll('.interaction').length,buttons:r.querySelectorAll('.interaction button').length,body:document.documentElement.scrollWidth,images:[...r.querySelectorAll('img:not(.prior)')].every(x=>!x.complete||x.naturalWidth>0),checks:p.querySelectorAll('.skill-pill').length}})()");
  assert.equal(q.view,width<1000?'mobile':'desktop');assert.equal(q.panel,1);assert.ok(q.buttons>0);assert.ok(q.body<=width+1);assert.ok(q.images);assert.equal(q.checks,id==='combat'?3:['perception','athletics'].includes(id)?1:0);
  if(['perception','athletics','combat'].includes(id)){await ev("document.querySelector('book-universal-page .skill-pill').click()");assert.equal(await ev("document.getElementById('mechanics').open"),true);assert.equal(await ev("Number(document.querySelector('.check-die b').textContent)"),id==='perception'?28:id==='athletics'?63:39);await ev("document.querySelector('.mechanics-close').click()")}
 }
 await go('cover');await choose('travel');await at('location');await choose('travel');await at('dialogue');await choose('accept');await at('dialogue');assert.match(await ev("document.querySelector('book-universal-page').shadowRoot.querySelector('.interaction-text').textContent"),/lámpara/);await choose('leave');await at('exploration');
 for(const [choice,destination] of [['fight','combat'],['detour','detour'],['return','return']]){await go('decision');await choose(choice);await at(destination);if(choice==='fight'){await choose('travel');await at('victory')}await choose('restart');await at('cover')}
 await go('exploration');
 const before=await ev("document.querySelector('book-universal-page').offsetHeight");
 await ev("(()=>{const p=document.querySelector('book-universal-page'),d=p.document;d.content.bindings['scene.description']=Array.from({length:30},(_,i)=>('Párrafo '+i+' texto narrativo ').repeat(14));p.confirmPage(d)})()");
 await sleep(150);
 const long=await ev("(()=>{const p=document.querySelector('book-universal-page'),r=p.shadowRoot,button=r.querySelector('.interaction button');button.scrollIntoView({block:'end'});return {h:p.offsetHeight,count:r.querySelectorAll('[data-element-id=narrative] p').length,bottom:button.getBoundingClientRect().bottom,scroll:document.scrollingElement.scrollTop}})()");
 assert.ok(long.h>before+500);assert.equal(long.count,30);assert.ok(long.scroll>0);assert.ok(long.bottom<=height+2);
 await go('location');
 const graph=await ev("(()=>{const p=document.querySelector('book-universal-page'),d=p.document;d.content.bindings['scene.titleImage']='cover';d.content.bindings['panel.decoration']='mountains';d.content.interaction.options[0].symbol='cover';d.composition.assets.background='forest';p.confirmPage(d);const r=p.shadowRoot;return {title:!!r.querySelector('[data-element-id=hero-title]'),image:!!r.querySelector('[data-element-id=title-art] img'),ornament:!!r.querySelector('.interaction [data-element-id=panel-decoration]'),symbol:!!r.querySelector('button .symbol'),prior:!!r.querySelector('[data-element-id=background] .prior')}})()");
 assert.deepEqual(graph,{title:false,image:true,ornament:true,symbol:true,prior:true});
 await sleep(450);assert.equal(await ev("!!document.querySelector('book-universal-page').shadowRoot.querySelector('.prior')"),false);
 await ev("(()=>{const p=document.querySelector('book-universal-page'),d=p.document;d.content.interaction.options=[];try{p.setPage(d)}catch(e){return true}return false})()");await at('location');
 console.log('PASS '+width+'x'+height+': all 11 scenes, exact dice, dialogue, 3 endings, long scroll, image title, ornament, symbol and crossfade');
}
assert.deepEqual(errors,[]);
}finally{ws?.close();edge.kill();server.close();await sleep(400);await rm(dir,{recursive:true,force:true}).catch(()=>{})}
