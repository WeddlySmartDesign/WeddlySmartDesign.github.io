'use strict';
/* Avisos al móvil de la app de pedidos de la propietaria. Solo muestra notificaciones:
 * no guarda nada en caché. Su ámbito es solo panel-pruebas.html, para no pisar el de la app de las parejas. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch { d = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(d.title || 'GUEST · Pedidos', {
    body: d.body || '',
    tag: d.tag || undefined,
    icon: new URL('../assets/brand/icon-512.png', self.location.href).href,
    data: { url: d.url || '/guest/panel-pruebas.html' }
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/guest/panel-pruebas.html', self.location.origin).href;
  event.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = list.find((c) => c.url.includes('panel-pruebas.html'));
    if (open) { await open.focus(); if (open.url !== url && 'navigate' in open) await open.navigate(url).catch(() => {}); return; }
    await self.clients.openWindow(url);
  })());
});
