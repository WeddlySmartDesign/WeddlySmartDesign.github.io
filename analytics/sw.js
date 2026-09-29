const CACHE='wsd-analytics-shell-v8';
const SHELL=['./manifest.webmanifest','./icon.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('wsd-analytics-shell-')&&k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  const url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin)return;

  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}));
    return;
  }

  if(url.pathname==='/analytics/manifest.webmanifest'||url.pathname==='/analytics/icon.svg'){
    event.respondWith(
      fetch(req,{cache:'no-store'}).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{});
        return res;
      }).catch(()=>caches.match(req))
    );
  }
});