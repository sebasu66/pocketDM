import {createServer} from 'node:http';import {readFile,mkdtemp,rm,writeFile} from 'node:fs/promises';import {spawn} from 'node:child_process';import {tmpdir} from 'node:os';import {join,extname,resolve} from 'node:path';import assert from 'node:assert/strict';
const base=resolve('public');const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.webmanifest':'application/manifest+json','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg'};
const server=createServer(async(req,res)=>{try{let path=join(base,new URL(req.url,'http://localhost').pathname.replace(/^\//,'')||'index.html');if(!extname(path))path=join(path,'index.html');res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path))}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const dir=await mkdtemp(join(tmpdir(),'pocketdm-browser-'));const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+dir,'about:blank'],{stdio:'ignore'});let ws;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{let port;for(let i=0;i<80;i++){try{port=(await readFile(join(dir,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0];break}catch{await sleep(150)}}assert.ok(port,'Edge devtools port');let targets=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let id=0;const pending=new Map(),errors=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await call('Runtime.enable');await call('Page.enable');
await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/dm/libro/#ui'});
const iframe=await ev("document.querySelector('iframe.editorial-frame').getAttribute('src')");
assert.match(iframe,/stormkeep_laboratorio_editorial_v11/);
await call('Page.navigate',{url:'http://127.0.0.1:'+server.address().port+'/dm/libro/stormkeep_laboratorio_editorial_v11.html'});
for(let i=0;i<100;i++){if(await ev("document.querySelectorAll('#layers .layer').length>5"))break;await sleep(100)}
const click=async selector=>ev("document.querySelector("+JSON.stringify(selector)+").click()");
const change=async (selector,v)=>ev("(()=>{const n=document.querySelector("+JSON.stringify(selector)+");"+(typeof v==='boolean'?"n.checked="+v:"n.value="+JSON.stringify(String(v)))+";n.dispatchEvent(new Event('change',{bubbles:true}))})()");
const layer=async key=>click('[data-layer='+key+'] .name');
const field=async (key,v)=>change('[data-field='+key+']',v);
const get=async expression=>ev("(()=>{const p=document.querySelector('.desktop book-universal-page'),m=document.querySelector('.mobile book-universal-page');"+expression+"})()");
assert.equal(await ev("document.querySelectorAll('book-universal-page').length"),3);
assert.equal(await ev("document.querySelector('[data-tab=camera]').hidden"),true);
await change('#viewportProfile','foldOpen');assert.equal(await ev("document.querySelector('.fold .board-inner').style.width"),'800px');await change('#viewportWidth',820);assert.equal(await ev("document.querySelector('.fold .board-inner').style.width"),'820px');await change('#viewportProfile','foldClosed');assert.equal(await ev("document.querySelector('.mobile .board-inner').style.width"),'344px');await change('#viewportProfile','iphone');await click('[data-view=both]');await change('#scope','base');
await change('#placeholders',true);assert.ok(await get("return p.shadowRoot.querySelector('[data-element-id=background] img').src.includes('placeholders/landscape.svg')"));await change('#placeholders',false);await layer('background');assert.equal(await ev("document.querySelector('[data-tab=camera]').hidden"),false);
await click('[data-tab=camera]');await field('cameraEnabled',true);await field('cameraStartX',25);await field('cameraStartZoom',1);await field('cameraEndX',75);await field('cameraEndZoom',1.7);await field('cameraDuration',.3);
await ev("Array.from(document.querySelectorAll('#properties button')).find(b=>b.textContent==='Inicio').click()");await sleep(300);
let start=await get("const im=p.shadowRoot.querySelector('[data-element-id=background] img');return {w:im.style.width,x:im.style.left,loaded:im.naturalWidth}");
assert.ok(start.loaded>0);assert.ok(parseFloat(start.w)>0);
await ev("Array.from(document.querySelectorAll('#properties button')).find(b=>b.textContent==='Final').click()");await sleep(60);
let end=await get("const im=p.shadowRoot.querySelector('[data-element-id=background] img');return {w:im.style.width,x:im.style.left}");
assert.ok(parseFloat(end.w)>parseFloat(start.w));assert.notEqual(end.x,start.x);
await ev("Array.from(document.querySelectorAll('#properties button')).find(b=>b.textContent.includes('Reproducir')).click()");await sleep(450);
assert.equal(await get("return p.shadowRoot.querySelector('[data-element-id=background] img').style.width"),end.w);
await ev("Array.from(document.querySelectorAll('#properties button')).find(b=>b.textContent==='Final').click()");
const frame=await get("const n=p.shadowRoot.querySelector('[data-element-id=background]'),r=n.getBoundingClientRect();return {x:r.left+r.width*.65,y:r.top+r.height*.65,left:n.style.left}");
await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:frame.x,y:frame.y});await call('Input.dispatchMouseEvent',{type:'mousePressed',x:frame.x,y:frame.y,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:frame.x+45,y:frame.y,button:'left',buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:frame.x+45,y:frame.y,button:'left',clickCount:1});
assert.ok(await get("return p.document.template.elements[0].children[0].layout.desktop.cameraEndX<75"));assert.equal(await get("return p.shadowRoot.querySelector('[data-element-id=background]').style.left"),frame.left);
await click('[data-tab=design]');await click('[data-view=desktop]');await layer('character');await change('#scene','dialogue');await sleep(100);const handle=await get("const n=p.shadowRoot.querySelector('[data-element-id=character] [data-resize]');if(!n)return null;const r=n.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}");assert.ok(handle);await call('Input.dispatchMouseEvent',{type:'mousePressed',x:handle.x,y:handle.y,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:handle.x+24,y:handle.y+20,button:'left',buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:handle.x+24,y:handle.y+20,button:'left',clickCount:1});assert.ok(await get("return p.document.template.elements[0].children.find(x=>x.id==='character').layout.desktop.width>37"));await click('[data-view=both]');await layer('background');await change('#scope','mobile');await field('x',12);
assert.equal(await get("return m.document.template.elements[0].children[0].layout.mobile.x"),12);
assert.equal(await get("return p.document.template.elements[0].children[0].layout.base.x"),0);
await click('#undo');assert.equal(await get("return m.document.template.elements[0].children[0].layout.mobile.x??null"),null);await click('#redo');assert.equal(await get("return m.document.template.elements[0].children[0].layout.mobile.x"),12);
await layer('hero');await click('[data-add=image]');const newId=await ev("document.querySelector('.layer.active').dataset.layer");assert.match(newId,/layer-/);await click('[data-tab=content]');await field('name','Logo de prueba');await field('asset','cover');await click('[data-tab=instructions]');await field('instructions','Mantener visible el sol.');
assert.equal(await get("return p.document.template.elements[0].children.at(-1).instructions"),'Mantener visible el sol.');
await click('#duplicateLayer');assert.equal(await get("return p.document.template.elements[0].children.length"),6);
await click('#deleteLayer');assert.equal(await get("return p.document.template.elements[0].children.length"),5);
await click('#save');for(let i=0;i<50;i++){if(await ev("document.getElementById('saveStatus').textContent.includes('Guardada v1')"))break;await sleep(100)}
assert.match(await ev("document.getElementById('saveStatus').textContent"),/Guardada v1/);const design=await ev("document.getElementById('design').value");
await layer('background');await click('[data-tab=camera]');await change('#scope','base');await field('cameraEndZoom',2);await click('#save');for(let i=0;i<50;i++){if(await ev("document.getElementById('saveStatus').textContent.includes('Guardada v2')"))break;await sleep(100)}
assert.match(await ev("document.getElementById('saveStatus').textContent"),/Guardada v2/);
await change('#revision',1);assert.equal(await get("return p.document.template.elements[0].children[0].layout.base.cameraEndZoom"),1.7);
await change('#revision',2);assert.equal(await get("return p.document.template.elements[0].children[0].layout.base.cameraEndZoom"),2);
await call('Page.reload');for(let i=0;i<50;i++){if(await ev("document.querySelectorAll('#design option').length>1"))break;await sleep(100)}
await change('#design',design);assert.equal(await get("return p.document.template.elements[0].children[0].layout.base.cameraEndZoom"),2);
await layer('interaction');await click('[data-tab=design]');await change('#scope','base');await field('optionMinHeight',64);assert.equal(await get("return p.document.template.elements.find(e=>e.id==='interaction').layout.base.optionMinHeight"),64);await field('optionNormal','choice-selected');assert.ok(await get("return p.shadowRoot.querySelector('.choice-row').style.getPropertyValue('--normal-image').includes('choice-selected.svg')"));await change('#scene','perception');assert.equal(await get("return p.shadowRoot.querySelectorAll('.result-head[data-check-id]').length"),1);await change('#scene','dialogue');await change('#samples',true);assert.equal(await get("return p.shadowRoot.querySelectorAll('.history-entry.chosen').length"),1);
const shot=await call('Page.captureScreenshot',{format:'png'});await writeFile(join(tmpdir(),'pocketdm-universal-editor-1440.png'),Buffer.from(shot.data,'base64'));
await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await sleep(200);assert.ok(await ev("document.documentElement.scrollWidth<=392"));
assert.deepEqual(errors,[]);
console.log('PASS editor official route, dual boards, layer context, camera start/end/play, device override, undo/redo, add/rename/duplicate/delete, prompts, saved versions after reload.');
}finally{ws?.close();edge.kill();server.close();await sleep(400);await rm(dir,{recursive:true,force:true}).catch(()=>{})}
