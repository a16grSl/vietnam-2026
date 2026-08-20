const C="vtaw2026-v1";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{
 e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
 e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
 const r=e.request;
 if(r.method!=="GET")return;
 const u=new URL(r.url);
 if(u.origin!==location.origin)return;              // never touch outbound links
 e.respondWith(
  fetch(r).then(res=>{
   const cl=res.clone();
   caches.open(C).then(c=>c.put(r,cl)).catch(()=>{});
   return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html")))
 );
});
