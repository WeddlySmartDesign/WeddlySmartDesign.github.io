'use strict';
/* GUEST mobile PWA: private data remains ONLY in the authorized app state.
 * Cache public static source files, never tokens, API responses or personally
 * addressed invitations. Keep ONE/STUDIO service workers untouched.
 */
const CACHE='guest-shell-v6-20261022';
const ROOT=new URL('./',self.location.href);
const CORE=[
  "index.html",
  "access.html",
  "guest-settings.html",
  "guest-icon.svg",
  "guest.webmanifest",
  "guests-v114-integrated.html",
  "guests-v081-visual-seating.html",
  "guests-events-v3.html",
  "guests-rsvp-operations-live.html",
  "guests-rsvp-operations-v3.html",
  "guests-rsvp-v116-single-live.html",
  "guests-rsvp-v114-single-flex.html",
  "guests-rsvp-public-clean.html",
  "guests-events-standalone-compat-v1.js",
  "guests-events-v3.js",
  "guests-events-invite-addon-v1.js",
  "guest-events-product-v1.js",
  "guest-visual-extra-events-v1.js",
  "guests-access-layer.js",
  "guests-production-sync.js",
  "guests-state-integrity-v1.js",
  "guests-plusone-placeholder-link-v1.js",
  "guests-production-ui.js",
  "guests-catalog-invitation-bridge-v1.js",
  "guests-production-ops.js",
  "guests-rsvp-route-v1.js",
  "guests-home-rsvp-status-v1.js",
  "guests-smart-actions-v1.js",
  "guests-mobile-compat-hotfix-v1.js",
  "guests-import-audit-v1.js",
  "guests-service-visibility-v1.js",
  "guests-custom-lists-v1.js",
  "guests-extra-event-lists-v1.js",
  "guests-copy-control-v1.js",
  "guests-people-manager-v1.js",
  "guests-people-polish-v1.js",
  "guests-rsvp-clarity-v1.js",
  "guests-rsvp-plusone-core-label-v1.js",
  "guests-seating-v2.js",
  "guests-seating-sync-hotfix-v1.js",
  "guest-one-parity-v1.js",
  "guest-visual-premium-v1.js",
  "guest-visual-hoy-invitados-v1.js",
  "guest-visual-tables-lists-v1.js"
];
const publicPath=name=>new URL(name,ROOT).pathname;
const corePaths=new Set(CORE.map(publicPath));
const staticFile=/^\/(?:guest)\/[^/]+\.(?:html?|js|css|svg|webmanifest)$/i;
const safe=(url)=>url.origin===ROOT.origin&&staticFile.test(url.pathname);
const cacheKey=(url)=>new Request(ROOT.origin+url.pathname,{method:'GET'});
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    // Atomic install: no silent success if any required app shell file is gone.
    await c.addAll(CORE.map(p=>new Request(new URL(p,ROOT),{cache:'reload'})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(n=>n.startsWith('guest-shell-')&&n!==CACHE).map(n=>caches.delete(n)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(!safe(u))return; // Never cache cross-origin Supabase, RSVP tokens or master media.
  event.respondWith((async()=>{
    const key=cacheKey(u);
    try{
      const rsp=await fetch(req);
      if(rsp.ok&&rsp.type==='basic'){
        const clone=rsp.clone();
        event.waitUntil(caches.open(CACHE).then(c=>c.put(key,clone)).catch(()=>{}));
      }
      return rsp;
    }catch(error){
      const cached=await caches.match(key);
      if(cached)return cached;
      // Never pretend missing routes are the protected home page.
      throw error;
    }
  })());
});
