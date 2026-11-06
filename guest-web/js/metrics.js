/* Estadísticas propias de la web: solo contadores por día (sin cookies, sin guardar nada del
 * visitante y sin identificar a nadie). Solo cuentan en la web publicada. */
(() => {
  // Los scripts de cada página cuentan acciones con window.guestHit('free', 'clave'); sin efecto si no se mide.
  window.guestHit = window.guestHit || (() => {});
  // Recuerda el enlace del colaborador (?c=slug) 60 días para atribuirle la compra, también si paga otro día.
  try {
    const c = (new URLSearchParams(location.search).get('c') || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
    if (c) localStorage.setItem('guest-colab', JSON.stringify({ c, t: Date.now() }));
  } catch {}
  if (location.hostname !== 'guest.weddlysmartdesign.com') return;
  // La propietaria no cuenta: su móvil queda marcado al abrir su panel de pedidos (o con ?yo=1).
  try {
    if (new URLSearchParams(location.search).get('yo') === '1') localStorage.setItem('guest-owner-device', '1');
    if (localStorage.getItem('guest-owner-device') === '1') return;
  } catch {}
  const API = 'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-automation';
  const hit = (event, k = '') => {
    const body = JSON.stringify({ action: 'hit', event, k });
    // text/plain evita la petición previa de CORS; sendBeacon sigue aunque se cierre la página.
    try { if (navigator.sendBeacon && navigator.sendBeacon(API, new Blob([body], { type: 'text/plain' }))) return; } catch {}
    fetch(API, { method: 'POST', body, keepalive: true, headers: { 'content-type': 'text/plain' } }).catch(() => {});
  };

  const page = (location.pathname.replace(/^\/|\.html$/g, '') || 'inicio').toLowerCase();
  const params = new URLSearchParams(location.search);
  // Enlace propio de cada colaborador (?c=nombre): cuenta sus visitas como origen propio.
  const colab = (params.get('c') || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);

  // Una visita = llegar desde fuera (otra web, una app o escribiendo la dirección).
  let from = '';
  try { from = document.referrer ? new URL(document.referrer).hostname : ''; } catch {}
  if (from !== location.hostname) {
    const utm = (params.get('utm_source') || '').toLowerCase();
    const src = utm || from;
    const source =
      colab ? `colab-${colab}`
      : /qr|feria/.test(utm) ? 'qr'
      : /instagram/.test(src) ? 'instagram'
      : /tiktok/.test(src) ? 'tiktok'
      : /facebook|fb\./.test(src) ? 'facebook'
      : /whatsapp|wa\.me/.test(src) ? 'whatsapp'
      : /pinterest/.test(src) ? 'pinterest'
      : /google|bing|duckduckgo|ecosia|yahoo/.test(src) ? 'buscador'
      : !src ? 'directo'
      : 'otras';
    hit('visit', source);
  }
  // Origen concreto del enlace (bio, reel, qr...): ?ref=bio-instagram o utm_campaign/utm_medium.
  const ref = (params.get('ref') || params.get('utm_campaign') || params.get('utm_medium') || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30);
  if (ref && from !== location.hostname) hit('free', 'ref-' + ref);
  window.guestHit = hit;
  hit('page', page);
  if (page === 'pagar') hit('checkout', params.get('d') || '');
  if (page === 'a-medida') hit('quote_open');

  document.addEventListener('click', (event) => {
    const open = event.target.closest('[data-open]');
    if (open) return hit('design', open.dataset.open);
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.startsWith('pagar.html')) return hit('want', new URLSearchParams(href.split('?')[1] || '').get('d') || '');
    if (/wa\.me|api\.whatsapp/.test(href)) return hit('whatsapp', page);
  }, { capture: true });
})();
