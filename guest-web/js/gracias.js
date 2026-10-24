/* Página de después del pago: muestra el diseño que se eligió antes de ir a Stripe. */
(() => {
  'use strict';

  const config = window.GUEST_CONFIG || {};
  const catalog = window.GUEST_CATALOG || [];
  const $ = (selector) => document.querySelector(selector);

  // main.js guarda el diseño al pulsar «La quiero». Si no hay nada (otro móvil,
  // navegación privada), la página funciona igual sin nombrar el diseño.
  let chosen = null;
  try {
    const saved = JSON.parse(localStorage.getItem('guest:purchase') || 'null');
    if (saved && Date.now() - saved.at < 6 * 60 * 60 * 1000) {
      chosen = catalog.find((design) => design.id === saved.id) || null;
    }
  } catch (error) { /* sin almacenamiento: seguimos sin diseño */ }

  const now = new Date();
  $('#postDate').textContent = `${String(now.getDate()).padStart(2, '0')}·${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (chosen) {
    const img = new Image();
    img.alt = '';
    img.src = chosen.image;
    img.decoding = 'async';
    $('#stampArt').replaceChildren(img);
    $('#toDesign').textContent = chosen.name;
    const lead = $('#lead');
    lead.textContent = '';
    lead.append('Hemos recibido el pago de vuestra invitación ');
    const strong = document.createElement('strong');
    strong.textContent = chosen.name;
    lead.append(strong, '. Stripe os acaba de enviar el recibo por email, y nosotros nos ponemos ya con lo vuestro.');
  }

  const message = chosen
    ? `Hola, acabamos de comprar la invitación ${chosen.name}.`
    : 'Hola, acabamos de comprar nuestra invitación GUEST.';
  if (config.whatsapp) $('#waBtn').href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('[data-config]').forEach((el) => {
    if (config[el.dataset.config]) el.textContent = config[el.dataset.config];
  });
  document.querySelectorAll('[data-mail]').forEach((el) => { if (config.email) el.href = `mailto:${config.email}`; });
})();
