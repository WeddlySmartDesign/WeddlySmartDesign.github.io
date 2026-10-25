/* Pago de un diseño con Stripe integrado en la página (Embedded Checkout).
   La función de GUEST fija diseño y precio en el servidor: aquí solo se elige y se consiente. */
(() => {
  'use strict';

  const config = window.GUEST_CONFIG || {};
  const catalog = window.GUEST_CATALOG || [];
  const $ = (selector) => document.querySelector(selector);
  const params = new URLSearchParams(location.search);
  const design = catalog.find((item) => item.id === params.get('d')) || null;
  const newAttempt = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const consent = $('#consent');
  const state = $('#state');
  const mountEl = $('#mount');
  let stripe = null;
  let embedded = null;
  let busy = false;
  let publishableKey = '';
  let attemptId = newAttempt();

  function show(title, text, { error = false, retry = false, whatsapp = false, loading = false } = {}) {
    state.hidden = false;
    state.classList.toggle('is-error', error);
    $('#stateTitle').textContent = title;
    $('#stateText').textContent = text;
    $('#skeleton').hidden = !loading;
    $('#retry').hidden = !retry;
    $('#waBtn').hidden = !whatsapp;
  }

  async function api(body) {
    const response = await fetch(config.checkoutApi, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.error || 'checkout_unavailable');
    return data;
  }

  function loadStripe() {
    if (window.Stripe) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/clover/stripe.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function unmount() {
    try { embedded?.destroy?.(); } catch (error) { /* ya estaba desmontado */ }
    embedded = null;
    mountEl.replaceChildren();
  }

  async function mount() {
    if (busy || embedded || !consent.checked) return;
    busy = true;
    show('Preparando el pago…', 'Se abrirá aquí mismo en unos segundos.', { loading: true });
    try {
      await loadStripe();
      if (!stripe) stripe = window.Stripe(publishableKey);
      embedded = await stripe.initEmbeddedCheckout({
        fetchClientSecret: async () => {
          const session = await api({
            action: 'create',
            edition: 'signature',
            startPersonalizationConsent: true,
            checkoutAttemptId: attemptId,
            catalogTemplateId: design.id
          });
          return session.clientSecret;
        }
      });
      state.hidden = true;
      embedded.mount('#mount');
    } catch (error) {
      unmount();
      show('No hemos podido abrir el pago.', 'No se ha hecho ningún cobro. Probad de nuevo en un momento.', { error: true, retry: true });
    } finally {
      busy = false;
    }
  }

  function waLink(text) {
    $('#waBtn').href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  async function init() {
    document.querySelectorAll('[data-config]').forEach((el) => {
      if (config[el.dataset.config]) el.textContent = config[el.dataset.config];
    });

    if (!design) {
      $('#designName').textContent = 'GUEST';
      waLink('Hola, quiero comprar una invitación GUEST.');
      show('Primero, elegid un diseño.', 'No sabemos qué invitación queréis. Volved a los diseños y pulsad «La quiero» en la que más os guste.', { error: true, whatsapp: true });
      return;
    }

    document.title = `Pago de ${design.name} · GUEST by WeddlySmartDesign`;
    $('#designName').textContent = design.name;
    const img = new Image();
    img.alt = '';
    img.src = design.image;
    $('#designStamp').replaceChildren(img);
    waLink(`Hola, queremos la invitación ${design.name}. ¿Cómo seguimos?`);

    if (!config.checkoutApi) {
      show('El pago todavía no está abierto.', 'Escribidnos y os ayudamos a reservar vuestra invitación.', { whatsapp: true });
      return;
    }

    try {
      const cfg = await api({ action: 'config' });
      const item = cfg.catalog?.[design.id];
      if (!item || item.status !== 'available') {
        show(`${design.name} todavía no se puede pagar aquí.`, 'Escribidnos y os la reservamos a mano, con el mismo precio y las mismas condiciones.', { whatsapp: true });
        return;
      }
      publishableKey = cfg.publishableKey;
      consent.disabled = false;
      show('Marcad la casilla para abrir el pago.', 'Así sabemos que podemos empezar con vuestra invitación en cuanto paguéis.');
    } catch (error) {
      show('No hemos podido comprobar el diseño.', 'Por seguridad no hemos abierto el pago. Probad de nuevo o escribidnos.', { error: true, retry: true, whatsapp: true });
      $('#retry').onclick = () => location.reload();
      return;
    }

    consent.addEventListener('change', () => {
      if (consent.checked) mount();
      else {
        unmount();
        attemptId = newAttempt();
        show('Marcad la casilla para abrir el pago.', 'Así sabemos que podemos empezar con vuestra invitación en cuanto paguéis.');
      }
    });
    $('#retry').onclick = () => { unmount(); attemptId = newAttempt(); mount(); };
  }

  init();
})();
