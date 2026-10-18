const VERSION='bdsp-shell-20261018-r3-two-status',SPRITES='bdsp-retro-sprites-r3';
const CORE=['./','./index.html','./styles.css','./app.js','./data.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/fallback-pokemon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION&&k!==SPRITES).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);
 if(url.hostname==='raw.githubusercontent.com'&&url.pathname.startsWith('/PokeAPI/sprites/')){
  e.respondWith(caches.open(SPRITES).then(async c=>{const hit=await c.match(req);if(hit)return hit;try{const res=await fetch(req);if(res.ok){try{await c.put(req,res.clone());const keys=await c.keys();if(keys.length>1200)await c.delete(keys[0])}catch(_){}}return res}catch(_){return Response.error()}}));return;
 }
 if(url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
   e.respondWith(fetch(req).then(async res=>{if(res.ok){const c=await caches.open(VERSION);await c.put('./index.html',res.clone())}return res}).catch(()=>caches.match('./index.html')));return;
 }
 e.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});