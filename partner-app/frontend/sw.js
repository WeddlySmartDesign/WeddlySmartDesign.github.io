const CACHE="one-partner-shell-v1";
const SHELL=["/","/index.html","/manifest.webmanifest","/one-partner-icon.svg"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  const req=event.request;
  const url=new URL(req.url);
  if(req.method!=="GET") return;
  if(url.origin!==self.location.origin) return;
  if(url.pathname.startsWith("/api/")) return;

  if(req.mode==="navigate"){
    event.respondWith(
      fetch(req,{cache:"no-store"}).catch(()=>caches.match("/index.html"))
    );
    return;
  }

  if(["/manifest.webmanifest","/one-partner-icon.svg"].includes(url.pathname)){
    event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
  }
});
