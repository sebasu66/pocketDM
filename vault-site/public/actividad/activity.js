const root=document.getElementById("activity-entries");
const count=document.getElementById("activity-count");
const areaSelect=document.getElementById("activity-area");
const statusSelect=document.getElementById("activity-status");
const escapeHtml=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const docLink=id=>"/boveda/?doc="+encodeURIComponent(id);
const safeUrl=url=>typeof url==="string"&&(/^https:\/\//.test(url)||/^\/(?!\/)/.test(url))?url:null;
const statusLabels={"implementado-en-preview":"Implementado en preview","decidido":"Decidido","en-revision":"En revisión","en-progreso":"En progreso","bloqueado":"Bloqueado","desplegado-live":"En producción"};
let entries=[];
function render(){
 const area=areaSelect.value,status=statusSelect.value;
 const list=entries.filter(x=>(area==="Todas"||x.area===area)&&(status==="Todos"||x.status===status));
 count.textContent=list.length+" actualización"+(list.length===1?"":"es")+" · ordenadas de más reciente a más antigua";
 if(!list.length){root.innerHTML='<p class="activity-empty">No hay avances registrados con estos filtros. No se infiere el estado de un equipo que aún no informó.</p>';return;}
 root.innerHTML=list.map(e=>{
 const source=safeUrl(e.source);
 const paths=(e.changed||[]).map(p=>"<code>"+escapeHtml(p)+"</code>").join(" · ");
 const links=(e.nodeIds||[]).map(id=>'<a href="'+docLink(id)+'">'+escapeHtml(id)+" ↗</a>").join("");
 return '<article class="activity-entry">'+
 '<div class="activity-meta"><time datetime="'+escapeHtml(e.date)+'">'+escapeHtml(e.date)+'</time><span class="activity-owner">'+escapeHtml(e.owner)+'</span></div>'+
 '<div><div class="activity-tags"><span class="pill">'+escapeHtml(e.area)+'</span><span class="pill">'+escapeHtml(statusLabels[e.status]||e.status)+'</span></div>'+
 '<h3>'+escapeHtml(e.title)+'</h3><p>'+escapeHtml(e.summary)+'</p>'+
 '<div class="activity-paths"><strong>Archivos/rutas:</strong> '+paths+'</div>'+
 '<div class="activity-next"><strong>Siguiente paso:</strong> '+escapeHtml(e.next)+'</div>'+
 '<div class="activity-links">'+(source?'<a href="'+escapeHtml(source)+'" target="_blank" rel="noopener noreferrer">Ver respaldo en GitHub ↗</a>':"")+links+'</div></div></article>';
 }).join("");
}
async function start(){
 try{
 const res=await fetch("/data/activity.json",{cache:"no-store"});
 if(!res.ok)throw Error("HTTP "+res.status);
 const data=await res.json();
 if(!Array.isArray(data.entries)||!Array.isArray(data.areas))throw Error("Archivo de actividad inválido");
 entries=data.entries;
 entries.sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
 for(const area of data.areas){const opt=document.createElement("option");opt.value=area;opt.textContent=area;areaSelect.append(opt);}
 const allStatuses=[...new Set(entries.map(e=>e.status))].sort();
 for(const status of allStatuses){const opt=document.createElement("option");opt.value=status;opt.textContent=statusLabels[status]||status;statusSelect.append(opt);}
 areaSelect.addEventListener("change",render);
 statusSelect.addEventListener("change",render);
 document.getElementById("activity-meta").textContent="Registro estático · fuente GitHub · "+entries.length+" anotaciones";
 render();
 }catch(err){root.innerHTML='<div class="error-state"><h2>No se pudo cargar el registro</h2><p>'+escapeHtml(err.message)+'</p></div>';}
}
start();
