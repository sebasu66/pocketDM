const BUILD='2026-11-24-editorial-1';
let displayed=false, checking=false;
function announce(release){
 if(displayed)return;displayed=true;
 const box=document.createElement('aside');box.setAttribute('role','status');box.setAttribute('aria-live','polite');
 Object.assign(box.style,{position:'fixed',zIndex:'2147483000',right:'max(12px,env(safe-area-inset-right))',bottom:'max(12px,env(safe-area-inset-bottom))',width:'min(340px,calc(100vw - 24px))',boxSizing:'border-box',background:'#172430',color:'#f6e2bd',border:'1px solid #b97e50',padding:'12px',font:'14px/1.4 system-ui',boxShadow:'0 5px 24px #0008'});
 const title=document.createElement('strong');title.textContent='PocketDM tiene una actualización';const detail=document.createElement('p');detail.textContent=release.title||'Nueva versión disponible';detail.style.margin='5px 0 10px';
 const update=document.createElement('button');update.textContent='Actualizar ahora';Object.assign(update.style,{minHeight:'44px',background:'#ac4d2e',color:'#fff',border:'0',padding:'8px 14px',font:'inherit',cursor:'pointer'});update.onclick=()=>{try{sessionStorage.setItem('pdm-updated',release.version)}catch{}location.reload()};
 const close=document.createElement('button');close.textContent='Más tarde';Object.assign(close.style,{minHeight:'44px',background:'transparent',color:'#f6e2bd',border:'0',padding:'8px 12px',font:'inherit',cursor:'pointer'});close.onclick=()=>box.remove();
 box.append(title,detail,update,close);document.body.append(box);
}
async function check(){if(checking||document.visibilityState==='hidden')return;checking=true;try{const response=await fetch('/data/pwa-release.json',{cache:'no-store'});if(!response.ok)return;const release=await response.json();if(release.version&&release.version!==BUILD)announce(release)}catch{}finally{checking=false}}
if('serviceWorker' in navigator&&window.isSecureContext){navigator.serviceWorker.register('/sw-pocketdm.js',{scope:'/',updateViaCache:'none'}).then(reg=>{window.addEventListener('focus',()=>reg.update().catch(()=>{}));}).catch(e=>console.warn('Pocket DM PWA:',e.message))}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});window.addEventListener('focus',check);window.addEventListener('online',check);setInterval(check,60000);check();
