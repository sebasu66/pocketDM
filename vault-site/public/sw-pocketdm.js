// Network-first shell. Do not cache campaign state, credentials, or documentation.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==self.location.origin||e.request.mode!=='navigate'||!/^\/(libro|app)(\/|$)/.test(u.pathname))return;
 e.respondWith(fetch(e.request).catch(()=>new Response('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pocket DM</title><body style="background:#211a17;color:#efe1c9;font:18px Georgia;padding:2rem"><h1>Pocket DM</h1><p>La aventura necesita conexión. Volvé a intentar cuando estés en línea.</p><button onclick="location.reload()">Reintentar</button></body></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}})));
});
// Release 2026-11-25-roster-1
