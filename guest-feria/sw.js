/* GUEST · Feria: todo se sirve desde la caché del dispositivo para funcionar sin conexión.
   La página descarga los archivos (precache.json) y este worker los entrega, también por trozos para los vídeos. */
const CACHE = 'guest-feria-v3';
const SHELL = ['./', 'index.html', 'kiosk.css', 'kiosk.js', 'fonts/fonts.css', 'manifest.webmanifest', 'precache.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

const ranged = async (response, header) => {
  const buf = await response.arrayBuffer();
  const size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(header) || [];
  let start = m[1] ? Number(m[1]) : 0;
  let end = m[2] ? Number(m[2]) : size - 1;
  if (!m[1] && m[2]) { start = Math.max(0, size - Number(m[2])); end = size - 1; }
  end = Math.min(end, size - 1);
  if (start > end) return new Response('', { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
};

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // La lista de archivos se pide a la red si hay conexión, para detectar novedades
  if (url.pathname.endsWith('/precache.json')) {
    event.respondWith(fetch(req).catch(() => caches.open(CACHE).then((c) => c.match('precache.json'))));
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    let hit = await cache.match(req, { ignoreSearch: true, ignoreVary: true });
    if (!hit && req.mode === 'navigate' && !url.pathname.includes('/invitaciones/')) hit = await cache.match('index.html');
    if (hit) {
      const range = req.headers.get('range');
      return range ? ranged(hit, range) : hit;
    }
    try { return await fetch(req); } catch (e) { return new Response('', { status: 504, statusText: 'Sin conexión' }); }
  })());
});
