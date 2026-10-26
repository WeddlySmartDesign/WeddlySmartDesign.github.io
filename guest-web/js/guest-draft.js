/* Marca de borrador para invitaciones que todavía no están pagadas o aprobadas.
 * - Página de revisión del catálogo: GUEST_DRAFT.mark() siempre (no es la versión para invitados).
 * - Diseños a medida: <script src="/js/guest-draft.js" data-custom="<id de la solicitud>"></script>
 *   La marca se quita sola cuando la pareja ha pagado el resto (estado paid o delivered). */
(() => {
  'use strict';
  // QA: al pasar a real, cambiar por guest-custom.
  const API = 'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-custom-qa';
  const tile = (() => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220" viewBox="0 0 300 220">'
      + '<g transform="rotate(-28 150 110)" font-family="Courier Prime, Courier New, monospace" text-anchor="middle" fill="#1b2650" stroke="#ffffff" stroke-opacity=".22" stroke-width=".8" paint-order="stroke">'
      + '<text x="150" y="104" font-size="30" font-weight="700" letter-spacing="6" fill-opacity=".13">BORRADOR</text>'
      + '<text x="150" y="128" font-size="11" letter-spacing="2.5" fill-opacity=".16">GUEST · NO VÁLIDO PARA ENVIAR</text></g></svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  })();

  function mark(text) {
    if (document.getElementById('guest-draft')) return;
    const style = document.createElement('style');
    style.textContent = '#guest-draft{position:fixed;inset:0;z-index:2147483000;pointer-events:none;background-image:' + tile + ';background-repeat:repeat;background-size:300px 220px}'
      + '#guest-draft b{position:absolute;top:0;left:0;right:0;padding:calc(6px + env(safe-area-inset-top,0px)) 12px 6px;background:#b3263a;color:#fbf7f4;font:700 11px/1.3 "Courier Prime","Courier New",monospace;letter-spacing:.12em;text-transform:uppercase;text-align:center}'
      + '@media print{body>*:not(#guest-draft){visibility:hidden}#guest-draft{background-size:200px 146px}}';
    const el = document.createElement('div');
    el.id = 'guest-draft'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<b></b>'; el.firstChild.textContent = text || 'Borrador para revisar · No válido para enviar';
    document.head.append(style); document.body.append(el);
    // Si alguien lo quita desde el navegador, vuelve a ponerse.
    new MutationObserver(() => { if (!el.isConnected) document.body.append(el); if (!style.isConnected) document.head.append(style); })
      .observe(document.documentElement, { childList: true, subtree: true });
  }
  window.GUEST_DRAFT = { mark };

  const id = document.currentScript?.dataset.custom || '';
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  // Si el servidor no responde, no se marca: una invitación ya pagada nunca debe salir como borrador ante los invitados.
  const run = async (retry = 1) => {
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'draft_status', id }), cache: 'no-store' });
      const j = await r.json();
      if (j?.ok && !j.final) mark('Propuesta para revisar · No válida para enviar');
    } catch { if (retry) setTimeout(() => run(0), 3000); }
  };
  if (document.body) run(); else addEventListener('DOMContentLoaded', run);
})();
