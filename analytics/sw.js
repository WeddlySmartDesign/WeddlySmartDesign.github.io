const CACHE='wsd-analytics-shell-v18';
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

self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch{data={body:event.data?event.data.text():''}}
  const title=data.title||'WeddlySmartDesign Analytics';
  const options={
    body:data.body||'Hay una novedad comercial en Analytics.',
    icon:'./icon.svg',
    tag:data.tag||'wsd-analytics-event',
    data:{url:data.url||'/analytics/'}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||'/analytics/',self.location.origin).href;
  event.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
      for(const client of list){
        if(client.url.startsWith(new URL('/analytics/',self.location.origin).href)){
          client.navigate(target).catch(()=>{});
          return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});
