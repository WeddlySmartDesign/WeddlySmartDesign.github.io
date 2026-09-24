const CACHE='wsd-analytics-shell-v1';
const SHELL=['./','./manifest.webmanifest','./icon.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  const url=new URL(req.url);
  if(req.method!=='GET')return;
  if(url.origin!==self.location.origin)return;

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put('./',copy)).catch(()=>{});
        return res;
      }).catch(()=>caches.match('./'))
    );
    return;
  }

  if(url.pathname.startsWith('/analytics/')){
    event.respondWith(
      caches.match(req).then(cached=>cached||fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{});
        return res;
      }))
    );
  }
});