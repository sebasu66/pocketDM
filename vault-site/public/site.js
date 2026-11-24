(() => {
"use strict";
const app=document.getElementById("app"), ns="http://www.w3.org/2000/svg";
let nodes=[], byId=new Map(), category="Todas", searchText="", type="Todos", scope="areas", focus="doc_0012", view={x:0,y:0,w:950,h:600};
const names={document:"Documento",reference:"Referencia",decision:"Decisión",architecture:"Arquitectura",prototype:"Prototipo",concept:"Concepto",task:"Pendiente"};
const colors={document:"#80b7ca",reference:"#9bacc5",decision:"#dfb874",architecture:"#87ad94",prototype:"#b9a0d5",concept:"#d1a17a",task:"#cd8c81"};
const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const categories=()=>[...new Set(nodes.map(x=>x.category))].sort((a,b)=>a.localeCompare(b,"es"));
const totalLinks=()=>nodes.reduce((sum,x)=>sum+x.links.length,0);
const hrefDoc=id=>"/boveda/?doc="+encodeURIComponent(id);
const hrefGraph=id=>"/grafo/?node="+encodeURIComponent(id);
const anchor=(href,label,cls="")=>'<a href="'+esc(href)+'" class="'+esc(cls)+'">'+esc(label)+'</a>';
const pill=n=>'<span class="pill '+esc(n.type)+'">'+esc(names[n.type]||n.type)+'</span>';
function safeSource(s){
 if(!s||typeof s.href!=="string"||!(/^https:\/\//.test(s.href)||/^\/(?!\/)/.test(s.href)))return "";
 return '<a class="btn" href="'+esc(s.href)+'"'+(s.href.startsWith("https:")?' target="_blank" rel="noopener noreferrer"':'')+'>Abrir fuente original ↗</a>';
}
function md(t){
 let out=[],list=false;
 const code=String.fromCharCode(96);
 const inline=s=>esc(s).replace(new RegExp(code+"([^"+code+"]+)"+code,"g"),"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");
 for(const raw of String(t||"").split(/\r?\n/)){
  const s=raw.trim();
  if(!s){if(list){out.push("</ul>");list=false;}continue;}
  const heading=/^(#{1,3})\s+(.*)$/.exec(s);
  if(heading){if(list){out.push("</ul>");list=false;}const n=heading[1].length+1;out.push("<h"+n+">"+inline(heading[2])+"</h"+n+">");continue;}
  if(/^[-*]\s+/.test(s)){if(!list){out.push("<ul>");list=true;}out.push("<li>"+inline(s.replace(/^[-*]\s+/,""))+"</li>");continue;}
  if(list){out.push("</ul>");list=false;}
  out.push("<p>"+inline(s)+"</p>");
 }
 if(list)out.push("</ul>");return out.join("");
}
function markNav(current){
 for(const [id,k] of [["nav-home","/"],["nav-vault","/boveda"],["nav-graph","/grafo"],["nav-book","/libro"],["nav-app","/app"]]){
  const a=document.getElementById(id);a.classList.toggle("active",current===k);
  if(current===k)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
 }
}
function portal(){
 markNav("/");document.title="Pocket DM | Portal";
 const cards=[
  ["◫","Bóveda documental","Fichas, decisiones, documentación técnica y referencias.","/boveda/"],
  ["◎","Grafo interactivo","Relaciones y niveles de detalle: áreas, vecinos y catálogo.","/grafo/"],
  ["⚔","Libro narrativo interactivo","Historia, personaje, diario y mapa en el mismo lector.","/libro/"]
 ];
 app.innerHTML='<section class="hero"><div class="eyebrow">El archivo vivo del proyecto</div><h1>Un mundo de cartas.<br>Una bóveda de <em>conexiones.</em></h1>'+
  '<p class="lede">Pocket DM centraliza documentación, decisiones, prototipos y recursos originales en un catálogo de nodos conectados con identidad estable.</p>'+
  '<div class="actions">'+anchor("/boveda/","Entrar a la bóveda","btn primary")+anchor("/grafo/","Explorar el grafo","btn")+'</div>'+
  '<div class="stats"><div><strong>'+nodes.length+'</strong><span>Fichas indexadas</span></div><div><strong>'+totalLinks()+'</strong><span>Relaciones</span></div><div><strong>'+categories().length+'</strong><span>Áreas de trabajo</span></div></div></section>'+
  '<section class="section"><div class="sectionhead"><div class="eyebrow">Explorar por vista<h2>Las puertas de entrada</h2></div></div><div class="grid">'+
  cards.map(x=>'<a class="tile" href="'+x[3]+'"><span class="arrow">↗</span><span class="tile-icon">'+x[0]+'</span><h3>'+esc(x[1])+'</h3><p>'+esc(x[2])+'</p></a>').join("")+'</div>'+
  '<p class="notice"><strong>Versión de prueba:</strong> se reutilizan resúmenes del GDD, referencias a GitHub y Drive, y el HTML del prototipo de combate. No se publican claves, contratos ni datos personales.</p></section>';
}
function relationHtml(n){
 const outgoing=n.links.filter(l=>byId.has(l.target)).map(l=>'<div class="relation"><span class="rel-type">'+esc(l.type.replace(/_/g," "))+' →</span>'+anchor(hrefDoc(l.target),byId.get(l.target).name)+'</div>').join("");
 const incoming=nodes.flatMap(x=>x.links.filter(l=>l.target===n.id).map(l=>'<div class="relation"><span class="rel-type">← '+esc(l.type.replace(/_/g," "))+'</span>'+anchor(hrefDoc(x.id),x.name)+'</div>')).join("");
 return '<div class="detail-links"><h3>Enlaces salientes</h3>'+(outgoing||"<p>No hay enlaces salientes.</p>")+
 '<h3>Referencias entrantes</h3>'+(incoming||"<p>No hay referencias entrantes.</p>")+"</div>";
}
function documentView(n){
 app.innerHTML='<div class="content-pane"><div class="breadcrumbs">'+anchor("/","Pocket DM")+" / "+anchor("/boveda/","Bóveda")+' / <span>'+esc(n.id)+'</span></div>'+
  '<article class="detail"><div class="detail-head">'+pill(n)+' <span class="pill">'+esc(n.category)+'</span>'+
  '<h1>'+esc(n.name)+'</h1><p class="lede">'+esc(n.summary)+'</p><div class="actions">'+
  anchor(hrefGraph(n.id),"◎ Ver nodo en el grafo","btn primary")+anchor("/boveda/","← Volver al catálogo","btn")+'</div></div>'+
  '<div class="detail-body"><div class="md">'+md(n.description_md)+'</div><div class="detail-links"><h3>Identidad y procedencia</h3>'+
  '<p>ID: <code>'+esc(n.id)+'</code> · Tipo: '+esc(names[n.type]||n.type)+' · Estado: '+esc(n.status)+'</p>'+
  '<p>Etiquetas: '+esc((n.tags||[]).join(" · "))+'</p>'+safeSource(n.source)+'</div>'+
  relationHtml(n)+'</div></article></div>';
}
function fillList(){
 const term=searchText.toLocaleLowerCase("es").trim();
 const filtered=nodes.filter(n=>(category==="Todas"||n.category===category)&&(type==="Todos"||n.type===type)&&
 (!term||[n.name,n.summary,n.description_md,n.category,...(n.tags||[])].join(" ").toLocaleLowerCase("es").includes(term)));
 filtered.sort((a,b)=>a.name.localeCompare(b.name,"es"));
 document.getElementById("result-count").textContent=filtered.length+" fichas · "+(category==="Todas"?"todas las áreas":category);
 document.getElementById("vault-results").innerHTML=filtered.map(n=>
  '<article class="doc-card"><div class="card-foot">'+pill(n)+'<span>'+esc(n.category)+'</span></div>'+
  '<h3>'+anchor(hrefDoc(n.id),n.name)+'</h3><p>'+esc(n.summary)+'</p>'+
  '<div class="card-foot"><span>'+esc(n.id)+'</span>'+anchor(hrefGraph(n.id),"Ver en grafo ↗")+'</div></article>').join("")||
  '<div class="empty-state"><h3>Sin resultados</h3><p>Probá otra búsqueda.</p></div>';
}
function vault(){
 markNav("/boveda");document.title="Pocket DM | Bóveda";
 const id=new URLSearchParams(location.search).get("doc");
 if(id){const d=byId.get(id);if(d){documentView(d);return;}
  app.innerHTML='<div class="empty-state"><h1>Documento inexistente</h1>'+anchor("/boveda/","Volver","btn")+'</div>';return;}
 const cats=["Todas",...categories()];
 app.innerHTML='<div class="workspace"><aside class="sidebar"><h2>Biblioteca</h2><div class="side-label">Áreas</div><div id="category-list">'+
  cats.map(c=>'<button type="button" class="side-link'+(c===category?" selected":"")+'" data-category="'+esc(c)+'"><span>'+esc(c)+
  '</span><span class="count">'+(c==="Todas"?nodes.length:nodes.filter(n=>n.category===c).length)+'</span></button>').join("")+
  '</div><p class="notice">Cada ficha tiene un ID estable y enlaces a sus fuentes y relaciones.</p></aside>'+
  '<section class="content-pane"><div class="breadcrumbs">Pocket DM / <span>Bóveda</span></div><div class="pane-top"><div><div class="eyebrow">Documentos conectados</div>'+
  '<h1>Bóveda de conocimiento</h1><p>Documentos, decisiones y referencias del proyecto.</p></div>'+
  anchor("/grafo/","Cambiar a grafo","btn")+'</div>'+
  '<div class="controlsbar"><input id="vault-search" class="input" type="search" aria-label="Buscar" placeholder="Buscar por título, resumen o etiqueta..." value="'+esc(searchText)+'">'+
  '<select class="select" id="vault-type" aria-label="Filtrar por tipo"><option value="Todos">Todos los tipos</option>'+
  Object.keys(names).map(k=>'<option value="'+k+'"'+(k===type?" selected":"")+'>'+esc(names[k])+'</option>').join("")+'</select></div>'+
  '<p id="result-count" class="graph-count"></p><div id="vault-results" class="results"></div></section></div>';
 document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{
  category=b.dataset.category;document.querySelectorAll("[data-category]").forEach(x=>x.classList.toggle("selected",x===b));fillList();
 }));
 document.getElementById("vault-search").addEventListener("input",e=>{searchText=e.target.value;fillList();});
 document.getElementById("vault-type").addEventListener("change",e=>{type=e.target.value;fillList();});
 fillList();
}
function adjacency(id){
 const ids=new Set([id]);
 const me=byId.get(id);if(me)me.links.forEach(l=>{if(byId.has(l.target))ids.add(l.target);});
 nodes.forEach(n=>{if(n.links.some(l=>l.target===id))ids.add(n.id);});
 return ids;
}
function graphData(){
 if(scope==="areas"){
  const arr=categories().map(c=>({id:"area:"+c,name:c,category:c,count:nodes.filter(x=>x.category===c).length}));
  const edges=new Set();
  nodes.forEach(n=>n.links.forEach(l=>{const t=byId.get(l.target);if(!t||t.category===n.category)return;
   edges.add(["area:"+n.category,"area:"+t.category].sort().join("::"));}));
  return {arr,edges:[...edges].map(x=>{const a=x.split("::");return{from:a[0],to:a[1]};})};
 }
 const allowed=scope==="focus"?adjacency(focus):new Set(nodes.map(x=>x.id));
 const arr=nodes.filter(x=>allowed.has(x.id));
 const edges=arr.flatMap(n=>n.links.filter(l=>allowed.has(l.target)).map(l=>({from:n.id,to:l.target})));
 return {arr,edges};
}
function layout(arr){
 const out={},cx=475,cy=290;
 if(scope==="focus"){
  out[focus]={x:cx,y:cy};
  const others=arr.filter(n=>n.id!==focus);
  others.forEach((n,i)=>{const a=2*Math.PI*i/Math.max(others.length,1)-Math.PI/2;out[n.id]={x:cx+240*Math.cos(a),y:cy+205*Math.sin(a)};});
 }else{
  arr.forEach((n,i)=>{const a=2*Math.PI*i/Math.max(arr.length,1)-Math.PI/2;const r=(scope==="all"?(i%3===0?165:260):250);
   out[n.id]={x:cx+r*Math.cos(a),y:cy+r*.86*Math.sin(a)};});
 }
 return out;
}
function elem(tag,attrs={},parent){
 const el=document.createElementNS(ns,tag);
 Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));
 if(parent)parent.appendChild(el);
 return el;
}
function setView(){const s=document.getElementById("graph-svg");if(s)s.setAttribute("viewBox",[view.x,view.y,view.w,view.h].join(" "));}
function graphPaint(){
 const s=document.getElementById("graph-svg");if(!s)return;
 s.replaceChildren();const data=graphData(),positions=layout(data.arr);
 const eg=elem("g",{},s);
 data.edges.forEach(e=>{if(!positions[e.from]||!positions[e.to])return;
  elem("line",{class:"graph-edge",x1:positions[e.from].x,y1:positions[e.from].y,x2:positions[e.to].x,y2:positions[e.to].y},eg);
 });
 const ng=elem("g",{},s);
 data.arr.forEach(n=>{
  const p=positions[n.id];if(!p)return;const selected=scope!=="areas"&&n.id===focus;
  const g=elem("g",{class:"graph-node"+(selected?" selected":""),role:"button",tabindex:0,"aria-label":"Abrir "+n.name},ng);
  const r=scope==="areas"?Math.min(30,18+n.count):selected?23:17;
  elem("circle",{cx:p.x,cy:p.y,r,fill:scope==="areas"?"#bdad83":colors[n.type]||"#819ba7"},g);
  if(scope==="areas"){const c=elem("text",{x:p.x,y:p.y+4,"text-anchor":"middle",style:"fill:#15212b;font-weight:bold;stroke:none"},g);c.textContent=n.count;}
  const t=elem("text",{x:p.x,y:p.y+r+20,"text-anchor":"middle"},g);
  t.textContent=n.name.length>24?n.name.slice(0,22)+"…":n.name;
  const title=elem("title",{},g);title.textContent=n.name;
  const act=()=>{if(scope==="areas"){const x=nodes.find(x=>x.category===n.category);if(x)selectNode(x.id);}else selectNode(n.id);};
  g.addEventListener("click",e=>{e.stopPropagation();act();});
  g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();act();}});
 });
 setView();
 document.getElementById("graph-count").textContent=data.arr.length+" nodos visibles, "+data.edges.length+" enlaces · "+
 (scope==="areas"?"Seleccioná un área.":scope==="focus"?"Nodo seleccionado y vecinos directos.":"Vista completa.");
}
function graphInfo(){
 const n=byId.get(focus),aside=document.getElementById("graph-detail");
 if(!n||!aside)return;
 const inbound=nodes.flatMap(x=>x.links.filter(l=>l.target===n.id).map(l=>({type:l.type,id:x.id})));
 aside.innerHTML=pill(n)+'<h2>'+esc(n.name)+'</h2><p>'+esc(n.summary)+'</p><div class="graph-actions">'+anchor(hrefDoc(n.id),"Abrir ficha ↗","btn primary tiny")+'</div>'+
 '<div class="section-title">Conexiones salientes</div>'+
 n.links.filter(l=>byId.has(l.target)).map(l=>'<a class="graph-link" href="'+hrefGraph(l.target)+'"><span class="graph-relation">'+esc(l.type.replace(/_/g," "))+' → </span>'+esc(byId.get(l.target).name)+'</a>').join("")+
 '<div class="section-title">Referencias entrantes</div>'+
 inbound.map(l=>'<a class="graph-link" href="'+hrefGraph(l.id)+'"><span class="graph-relation">← '+esc(l.type.replace(/_/g," "))+' </span>'+esc(byId.get(l.id).name)+'</a>').join("")+
 '<p class="graph-count">ID estable: '+esc(n.id)+'</p>';
 aside.querySelectorAll('a[href^="/grafo/"]').forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();selectNode(new URL(a.href).searchParams.get("node"));
 }));
}
function buttons(){document.querySelectorAll("[data-scope]").forEach(b=>b.classList.toggle("active",scope===b.dataset.scope));}
function selectNode(id){
 if(!byId.has(id))return;
 focus=id;scope="focus";view={x:0,y:0,w:950,h:600};
 const u=new URL(location.href);u.pathname="/grafo/";u.searchParams.set("node",id);
 history.pushState(null,"",u.pathname+u.search);buttons();graphPaint();graphInfo();
}
function zoom(multiplier){
 const x=view.x+view.w/2,y=view.y+view.h/2;
 const w=Math.max(240,Math.min(1750,view.w*multiplier)),h=w*600/950;
 view={x:x-w/2,y:y-h/2,w,h};setView();
}
function bindDrag(svg){
 let start=null;
 svg.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY<0?.88:1.12);},{passive:false});
 svg.addEventListener("pointerdown",e=>{if(e.target.closest(".graph-node"))return;start={x:e.clientX,y:e.clientY,v:{...view}};svg.setPointerCapture(e.pointerId);svg.classList.add("dragging");});
 svg.addEventListener("pointermove",e=>{if(!start)return;const r=svg.getBoundingClientRect();view.x=start.v.x-(e.clientX-start.x)*start.v.w/r.width;view.y=start.v.y-(e.clientY-start.y)*start.v.h/r.height;setView();});
 ["pointerup","pointercancel"].forEach(k=>svg.addEventListener(k,()=>{start=null;svg.classList.remove("dragging");}));
}
function graph(){
 markNav("/grafo");document.title="Pocket DM | Grafo";
 const id=new URLSearchParams(location.search).get("node");
 if(id&&byId.has(id)){focus=id;scope="focus";}else scope="areas";
 view={x:0,y:0,w:950,h:600};
 app.innerHTML='<div class="content-pane"><div class="breadcrumbs">'+anchor("/","Pocket DM")+' / <span>Grafo</span></div>'+
 '<div class="pane-top"><div><div class="eyebrow">Red de conocimiento</div><h1>Grafo de relaciones</h1><p>De las áreas a cada nodo y su vecindad.</p></div>'+
 anchor("/boveda/","Cambiar a biblioteca","btn")+'</div>'+
 '<div class="graph-layout"><section class="graph-panel"><div class="graph-toolbar">'+
 '<input id="graph-search" type="search" class="input" aria-label="Buscar nodo" placeholder="Buscar un nodo y pulsar Enter...">'+
 '<button type="button" class="btn tiny" data-scope="areas">Áreas</button>'+
 '<button type="button" class="btn tiny" data-scope="focus">Vecinos</button>'+
 '<button type="button" class="btn tiny" data-scope="all">Todos</button>'+
 '<button type="button" class="btn tiny" id="zoom-in" aria-label="Acercar">+</button>'+
 '<button type="button" class="btn tiny" id="zoom-out" aria-label="Alejar">−</button>'+
 '<button type="button" class="btn tiny" id="zoom-reset" aria-label="Restablecer zoom">⌖</button></div>'+
 '<svg id="graph-svg" class="graph-area" viewBox="0 0 950 600" role="group" aria-label="Mapa de nodos"></svg>'+
 '<div class="graph-legend"><span><i class="legend-dot" style="background:#80b7ca"></i>documentos</span>'+
 '<span><i class="legend-dot" style="background:#dfb874"></i>decisiones</span>'+
 '<span><i class="legend-dot" style="background:#b9a0d5"></i>prototipos</span>'+
 '<span>Arrastrá para desplazarte · rueda para zoom</span></div>'+
 '<p id="graph-count" class="graph-count" style="padding:0 16px 12px"></p></section>'+
 '<aside id="graph-detail" class="graph-detail" aria-label="Ficha del nodo"></aside></div></div>';
 buttons();graphPaint();graphInfo();
 document.querySelectorAll("[data-scope]").forEach(b=>b.addEventListener("click",()=>{scope=b.dataset.scope;view={x:0,y:0,w:950,h:600};buttons();graphPaint();}));
 const search=document.getElementById("graph-search");
 search.addEventListener("input",()=>search.setCustomValidity(""));
 search.addEventListener("keydown",e=>{if(e.key!=="Enter")return;
  e.preventDefault();const q=search.value.toLocaleLowerCase("es").trim();
  const found=nodes.find(n=>n.id.toLocaleLowerCase("es")===q||n.name.toLocaleLowerCase("es")===q)||
   nodes.find(n=>[n.name,n.summary,...(n.tags||[])].join(" ").toLocaleLowerCase("es").includes(q));
  if(found){selectNode(found.id);search.value=found.name;}
  else{search.setCustomValidity("No se encontró el nodo");search.reportValidity();}
 });
 document.getElementById("zoom-in").addEventListener("click",()=>zoom(.8));
 document.getElementById("zoom-out").addEventListener("click",()=>zoom(1.25));
 document.getElementById("zoom-reset").addEventListener("click",()=>{view={x:0,y:0,w:950,h:600};setView();});
 bindDrag(document.getElementById("graph-svg"));
}
function route(){
 const p=location.pathname.replace(/\/+$/,"")||"/";
 if(p==="/boveda")vault();else if(p==="/grafo")graph();else portal();
}
async function boot(){
 try{
  const r=await fetch("/data/catalog.json",{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status+" al leer catalog.json");
  const data=await r.json();if(!Array.isArray(data.nodes))throw Error("Catálogo sin nodos");
  const ids=new Set();
  data.nodes.forEach(n=>{if(ids.has(n.id)||!n.id||!Array.isArray(n.links))throw Error("ID duplicado o enlaces inválidos: "+n.id);ids.add(n.id);});
  nodes=data.nodes;byId=new Map(nodes.map(n=>[n.id,n]));
  document.getElementById("footer-status").textContent=nodes.length+" fichas · "+totalLinks()+" relaciones · "+(data.updatedAt||"");
  window.addEventListener("popstate",route);route();
 }catch(e){app.innerHTML='<div class="error-state"><h1>No se pudo cargar la bóveda</h1><p>'+esc(e.message)+'</p><p>El sitio debe servirse por HTTP y exponer <code>/data/catalog.json</code>.</p></div>';}
}
boot();
})();