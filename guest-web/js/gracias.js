/* Página de después del pago.
   Con ?session_id= (pago integrado), confirma el pago con GUEST y ofrece el cuestionario.
   Sin él, muestra la confirmación general con el diseño guardado al pulsar «La quiero». */
(() => {
  'use strict';

  const config = window.GUEST_CONFIG || {};
  const catalog = window.GUEST_CATALOG || [];
  const $ = (selector) => document.querySelector(selector);
  const sessionId = new URLSearchParams(location.search).get('session_id') || '';

  document.querySelectorAll('[data-config]').forEach((el) => {
    if (config[el.dataset.config]) el.textContent = config[el.dataset.config];
  });
  document.querySelectorAll('[data-mail]').forEach((el) => { if (config.email) el.href = `mailto:${config.email}`; });

  const now = new Date();
  $('#postDate').textContent = `${String(now.getDate()).padStart(2, '0')}·${String(now.getMonth() + 1).padStart(2, '0')}`;

  function showDesign(design) {
    const message = design
      ? `Hola, acabamos de comprar la invitación ${design.name}.`
      : 'Hola, acabamos de comprar nuestra invitación GUEST.';
    if (config.whatsapp) $('#waBtn').href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
    if (!design) return;
    const img = new Image();
    img.alt = '';
    img.src = design.image;
    img.decoding = 'async';
    $('#stampArt').replaceChildren(img);
    $('#toDesign').textContent = design.name;
    const lead = $('#lead');
    lead.textContent = '';
    const strong = document.createElement('strong');
    strong.textContent = design.name;
    lead.append('Hemos recibido el pago de vuestra invitación ', strong, '. La factura os llega por email.');
  }

  function savedDesign() {
    try {
      const saved = JSON.parse(localStorage.getItem('guest:purchase') || 'null');
      if (saved && Date.now() - saved.at < 6 * 60 * 60 * 1000) return catalog.find((d) => d.id === saved.id) || null;
    } catch (error) { /* sin almacenamiento */ }
    return null;
  }

  if (!sessionId || !config.checkoutApi) {
    showDesign(savedDesign());
    return;
  }

  /* ---------- Pago integrado: confirmar con GUEST ---------- */
  const title = $('h1');
  const check = $('#payCheck');
  const setCheck = (text, error = false) => {
    check.hidden = false;
    check.textContent = text;
    check.classList.toggle('is-error', error);
  };

  title.textContent = 'Confirmando vuestro pago…';
  $('#lead').textContent = 'Estamos comprobándolo con Stripe. No cerréis esta página, son unos segundos.';
  setCheck('Comprobando…');
  showDesign(null);

  async function status() {
    const response = await fetch(config.checkoutApi, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'status', sessionId }),
      cache: 'no-store'
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.error || 'status_failed');
    return data;
  }

  function fail(text) {
    title.textContent = 'No hemos podido confirmar el pago todavía.';
    $('#lead').textContent = text;
    setCheck('Si os ha llegado el cargo, no volváis a pagar: escribidnos y lo comprobamos.', true);
  }

  async function run(attempt = 0) {
    try {
      const data = await status();
      if (data.paid && data.provisioned) {
        title.textContent = 'Hecho. Ya estamos con vuestra invitación.';
        showDesign(catalog.find((d) => d.id === data.catalogTemplateId) || null);
        check.hidden = true;
        const url = data.catalogQuestionnaireUrl;
        if (url && /^https:\/\//.test(url)) {
          $('#qBtn').href = url;
          $('#qBox').hidden = false;
          const step = $('#step1');
          step.querySelector('.next-when').textContent = 'Ahora';
          step.querySelector('strong').textContent = 'Rellenáis el cuestionario';
          step.querySelector('p').textContent = 'Con el botón de arriba o el enlace del email. Nombres, fecha, lugares, vuestra historia, las fotos y las preguntas para los invitados.';
        }
        return;
      }
      if (attempt < 5) { setCheck('Stripe está terminando de confirmar el pago…'); setTimeout(() => run(attempt + 1), 1200); return; }
      fail('El pago todavía no aparece como completado.');
    } catch (error) {
      if (attempt < 3) { setTimeout(() => run(attempt + 1), 1200); return; }
      fail('Ahora mismo no podemos comprobarlo.');
    }
  }

  run();
})();
