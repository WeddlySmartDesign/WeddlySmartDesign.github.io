(() => {
  'use strict';

  const config = window.GUEST_CONFIG || {};
  const catalog = window.GUEST_CATALOG || [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const whatsappUrl = (text) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
  // En Stripe, la «Referencia del cliente» de cada pago dice qué diseño eligieron (p. ej. design-11-cristal).
  const purchaseRef = (design) => `${design.id}-${design.name}`.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  const buyUrl = (design) => config.checkoutUrl
    ? `${config.checkoutUrl}?client_reference_id=${purchaseRef(design)}`
    : whatsappUrl(`Hola, queremos la invitación ${design.name}. ¿Cómo seguimos?`);
  const number = (index) => `Nº ${String(index + 1).padStart(2, '0')}`;

  /* ---------- Datos comerciales en la página ---------- */
  function applyConfig() {
    $$('[data-config]').forEach((el) => {
      const value = config[el.dataset.config];
      if (value) el.textContent = value;
    });
    $$('[data-whatsapp]').forEach((el) => {
      el.href = whatsappUrl(el.dataset.whatsapp);
      el.target = '_blank';
      el.rel = 'noopener';
    });
    $$('[data-mail]').forEach((el) => { el.href = `mailto:${config.email}`; });
  }

  /* ---------- Compra: el pago se abre en la misma pestaña ---------- */
  // Así, al terminar en Stripe, la pareja vuelve a gracias.html, que lee el diseño guardado aquí.
  function initCheckout() {
    if (!config.checkoutUrl) return;
    document.addEventListener('click', (event) => {
      const link = event.target.closest(`a[href^="${config.checkoutUrl}"]`);
      if (!link) return;
      link.removeAttribute('target');
      const ref = new URL(link.href).searchParams.get('client_reference_id') || '';
      const design = catalog.find((item) => ref === purchaseRef(item));
      try {
        if (design) localStorage.setItem('guest:purchase', JSON.stringify({ id: design.id, at: Date.now() }));
      } catch (error) { /* sin almacenamiento: gracias.html funciona sin el diseño */ }
    });
  }

  /* ---------- Cabecera: fondo sólido al desplazarse ---------- */
  function initHeader() {
    const header = $('#header');
    const update = () => header.classList.toggle('is-solid', window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Vídeo de portada ---------- */
  function initHeroVideo() {
    const video = $('#heroVideo');
    const toggle = $('#heroToggle');
    const render = () => {
      toggle.innerHTML = `<svg aria-hidden="true"><use href="#i-${video.paused ? 'play' : 'pause'}"/></svg><span class="hero-toggle-label">${video.paused ? 'Reproducir' : 'Pausar'}</span>`;
      toggle.setAttribute('aria-pressed', String(video.paused));
    };
    toggle.addEventListener('click', () => {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    });
    video.addEventListener('play', render);
    video.addEventListener('pause', render);
    if (reduceMotion) video.pause();
    render();
  }

  /* ---------- Vídeos que solo se reproducen cuando se ven ---------- */
  const clipObserver = 'IntersectionObserver' in window && !reduceMotion
    ? new IntersectionObserver((entries) => {
      entries.forEach(({ target, intersectionRatio }) => {
        target.seen = intersectionRatio;
        decideClip(target);
      });
    }, { threshold: [0, 0.4, 0.85] })
    : null;
  const phone = window.matchMedia('(max-width: 759.98px)');
  // En el carrusel solo se mueve el sello que se ve entero; en móvil, solo el protagonista.
  function decideClip(video) {
    const card = video.closest('.rail .design');
    const need = card ? 0.85 : 0.4;
    const focused = !card || !phone.matches || card.classList.contains('is-active');
    if ((video.seen || 0) >= need && focused) video.play().catch(() => {});
    else video.pause();
  }
  const watchClip = (video) => { if (clipObserver) clipObserver.observe(video); };

  /* ---------- Diseños como sellos en movimiento ---------- */
  function designHTML(design, index) {
    const name = escapeHTML(design.name);
    return `
      <article class="design">
        <button class="stamp" type="button" data-open="${escapeHTML(design.id)}" aria-label="Abrir la invitación ${name}">
          <span class="stamp-art">
            <video muted loop playsinline preload="none" poster="${escapeHTML(design.image)}" aria-hidden="true">
              <source src="${escapeHTML(design.clip)}.webm" type="video/webm">
              <source src="${escapeHTML(design.clip)}.mp4" type="video/mp4">
            </video>
          </span>
          <span class="stamp-no mono">${number(index)}</span>
          <span class="stamp-open">Ver invitación</span>
        </button>
        <div class="design-meta">
          <h3>${name}</h3>
          <a class="design-buy" href="${escapeHTML(buyUrl(design))}" target="_blank" rel="noopener">La quiero</a>
        </div>
        <p class="design-note">${escapeHTML(design.note)}</p>
      </article>`;
  }

  const endCardHTML = () => `
    <article class="design design-end">
      <div class="end-card">
        <p class="mono">Nuevos diseños en camino</p>
        <h3>¿No encontráis ninguna que os encante?</h3>
        <p>La creamos desde cero para vosotros, con la misma app incluida.</p>
        <hr>
        <a class="btn btn-line btn-sm" href="#a-medida">Ver diseño a medida</a>
      </div>
    </article>`;

  function initCatalog() {
    const rail = $('#catalogRail');
    const progress = $('#railProgress');
    const prev = $('#railPrev');
    const next = $('#railNext');

    rail.innerHTML = catalog.map(designHTML).join('') + endCardHTML();
    $$('video', rail).forEach(watchClip);

    const stride = () => {
      const card = $('.design', rail);
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 22;
      return card ? card.getBoundingClientRect().width + gap : 320;
    };
    // El sello más cercano al centro del carrusel es el protagonista.
    const markActive = () => {
      const box = rail.getBoundingClientRect();
      const middle = box.left + box.width / 2;
      let best = null;
      let bestDistance = Infinity;
      $$('.design', rail).forEach((card) => {
        const r = card.getBoundingClientRect();
        const distance = Math.abs(r.left + r.width / 2 - middle);
        if (distance < bestDistance) { bestDistance = distance; best = card; }
      });
      $$('.design', rail).forEach((card) => card.classList.toggle('is-active', card === best));
      rail.classList.add('has-focus');
      if (clipObserver) $$('video', rail).forEach(decideClip);
    };
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = rail.scrollWidth - rail.clientWidth;
        const fraction = max > 0 ? rail.scrollLeft / max : 0;
        progress.style.width = `${Math.max(7, fraction * 100)}%`;
        prev.disabled = rail.scrollLeft <= 4;
        next.disabled = rail.scrollLeft >= max - 4;
        markActive();
      });
    };
    const move = (direction) => rail.scrollBy({ left: direction * stride(), behavior: reduceMotion ? 'auto' : 'smooth' });
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    rail.addEventListener('keydown', (event) => {
      if (event.target !== rail) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    });
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Visor: cada invitación se abre aquí, siempre por su portada ---------- */
  function initViewer() {
    const viewer = $('#viewer');
    const device = $('.viewer-device', viewer);
    let frameEl = $('#viewerFrame');
    const poster = $('#viewerPoster');
    let current = -1;
    let returnFocus = null;
    let pushed = false;
    let closeTimer = 0;

    const stage = $('#viewerStage');
    // La invitación ve siempre un móvil de 390 px de ancho y al menos 780 px de alto,
    // así su portada entra entera; se escala para caber en la pantalla.
    const fit = () => {
      const styles = getComputedStyle(stage);
      const navs = window.innerWidth >= 1100 ? 2 * (52 + 40) : 0;
      const availW = stage.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight) - navs;
      const availH = stage.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
      const width = 390;
      const height = Math.round(Math.min(900, Math.max(780, availH * width / Math.max(1, availW))));
      const scale = Math.min(1, availW / width, availH / height);
      device.style.width = `${Math.floor(width * scale)}px`;
      device.style.height = `${Math.floor(height * scale)}px`;
      frameEl.style.height = `${height}px`;
      frameEl.style.transform = `scale(${scale})`;
    };

    const load = (index) => {
      current = (index + catalog.length) % catalog.length;
      const design = catalog[current];
      $('#viewerNo').textContent = number(current);
      $('#viewerName').textContent = design.name;
      $('#viewerHeading').textContent = design.name;
      $('#viewerNote').textContent = design.note;
      $('#viewerBuy').href = buyUrl(design);
      $('#viewerBuyM').href = buyUrl(design);
      document.dispatchEvent(new CustomEvent('guest:design', { detail: design.id }));
      device.classList.remove('is-loaded');
      poster.src = design.image;
      // Un iframe nuevo empieza siempre en la portada y no deja rastro en el historial
      const fresh = frameEl.cloneNode(false);
      fresh.removeAttribute('src');
      fresh.addEventListener('load', () => device.classList.add('is-loaded'), { once: true });
      fresh.src = design.full;
      frameEl.replaceWith(fresh);
      frameEl = fresh;
      fit();
    };

    const open = (index) => {
      clearTimeout(closeTimer);
      const wasOpen = !viewer.hidden;
      if (!wasOpen) {
        returnFocus = document.activeElement;
        viewer.hidden = false;
        document.body.classList.add('viewer-open');
        fit();
        requestAnimationFrame(() => requestAnimationFrame(() => viewer.classList.add('is-open')));
        history.pushState({ viewer: true }, '');
        pushed = true;
      }
      load(index);
      if (!wasOpen) $('#viewerClose').focus({ preventScroll: true });
    };

    const finishClose = () => {
      viewer.classList.remove('is-open');
      document.body.classList.remove('viewer-open');
      closeTimer = setTimeout(() => {
        viewer.hidden = true;
        const blank = frameEl.cloneNode(false);
        blank.removeAttribute('src');
        frameEl.replaceWith(blank);
        frameEl = blank;
      }, reduceMotion ? 0 : 240);
      if (returnFocus) returnFocus.focus({ preventScroll: true });
    };

    const close = () => {
      if (viewer.hidden) return;
      if (pushed) { pushed = false; history.back(); return; }
      finishClose();
    };

    window.addEventListener('popstate', () => {
      if (viewer.hidden) return;
      pushed = false;
      finishClose();
    });

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-open]');
      if (!trigger) return;
      const index = catalog.findIndex((design) => design.id === trigger.dataset.open);
      if (index >= 0) open(index);
    });

    $('#viewerClose').addEventListener('click', close);
    ['#viewerPrev', '#viewerPrevM'].forEach((id) => $(id).addEventListener('click', () => load(current - 1)));
    ['#viewerNext', '#viewerNextM'].forEach((id) => $(id).addEventListener('click', () => load(current + 1)));
    viewer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') load(current - 1);
      if (event.key === 'ArrowRight') load(current + 1);
      if (event.key === 'Tab') {
        const focusable = $$('button, a[href], iframe', viewer).filter((el) => el.offsetParent !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', () => { if (!viewer.hidden) fit(); });
  }

  /* ---------- La app, función a función ---------- */
  // Capturas reales de GUEST con datos de ejemplo, recortadas sin barras del sistema ni del navegador.
  const APP_SHOTS = 'assets/app/';
  const features = [
    {
      scene: 'mesas', tab: 'Plano del salón',
      title: 'Vuestro salón, tal como es',
      text: 'Dibujáis el plano con mesas redondas, rectangulares o presidencial, y también la pista, el escenario o la cabina del DJ. Todo se mueve, se gira y se ajusta con el dedo.',
      points: ['Mesas de cada tipo y tamaño', 'Pista, escenario y otros elementos', 'Las plazas libres de cada mesa, a la vista'],
      video: { src: 'mesas', poster: 'mesas-poster.jpg', label: 'Plano del salón en GUEST: las mesas se arrastran y se giran.' }
    },
    {
      scene: 'varios', tab: 'Varios a la vez',
      title: 'Varios a la vez, incluso a una mesa nueva',
      text: 'Seleccionáis a los que van juntos y los sentáis en una mesa con sitio. ¿No queda ninguna? Creáis una mesa nueva para ellos en el mismo paso.',
      points: ['Toda una familia de una vez', 'Solo os ofrece las mesas donde caben', 'Una mesa nueva con los que habéis elegido'],
      video: { src: 'varios', poster: 'varios-poster.jpg', label: 'En GUEST se seleccionan tres invitados y se asignan juntos a una mesa con sitio.' }
    },
    {
      scene: 'dos', tab: 'Dos móviles',
      title: 'Para los dos, desde el móvil',
      text: 'Cada uno entra desde su propio móvil y los dos veis la misma boda: lo que cambia uno, le aparece al otro. Y cada uno la ve con el tema que más le gusta.',
      points: ['Un acceso para cada uno', 'Cinco temas: Nordic, Blush, Arena, Slate y Editorial', 'Sin descargar nada, en español o en inglés'],
      pair: {
        phones: [{ src: 'hoy-nordic.jpg', name: 'Clara', theme: 'Nordic' }, { src: 'hoy-blush.jpg', name: 'Mateo', theme: 'Blush' }],
        alt: 'La misma boda en dos móviles: Clara la ve con el tema Nordic y Mateo con el tema Blush.'
      }
    },
    {
      scene: 'preguntas', tab: 'RSVP a medida',
      title: 'Una confirmación a vuestra medida',
      text: 'Elegís qué os contesta cada invitado al confirmar y añadís vuestras propias preguntas: el brunch, una actividad o la canción que no puede faltar.',
      points: ['Menús, alergias e intolerancias', 'Niños, acompañante, transporte y alojamiento', 'Cada respuesta llega ordenada a la app'],
      shot: { src: 'preguntas.jpg', alt: 'Preguntas de la boda en GUEST: alergias, niños y acompañante activados, y el botón para añadir preguntas personalizadas.' }
    },
    {
      scene: 'respuestas', tab: 'Avisos',
      title: 'Cada cambio, avisado',
      text: 'Un panel os cuenta todo lo que pasa: quién confirma, quién cambia de menú y qué falta por hacer, sin revisar la lista entera.',
      points: ['Los cambios recientes, con fecha y hora', 'Lo que necesita vuestra atención, primero', 'Menús pendientes y mesas que se pasan de plazas'],
      shot: { src: 'respuestas.jpg', alt: 'Cambios recientes en GUEST: tres invitados han confirmado y han elegido su canción.' }
    },
    {
      scene: 'lista', tab: 'Grupos y subgrupos',
      title: 'Grupos y subgrupos, como los pensáis',
      text: 'Ordenáis la lista a vuestra manera: el grupo «Familia de Clara» y, dentro, «Tíos de Murcia». La importáis de Excel o añadís a cada invitado desde la agenda del móvil.',
      points: ['Por persona, pareja o familia', 'Desde Excel o CSV', 'Desde la agenda de cada uno de los dos'],
      shot: { src: 'lista.jpg', alt: 'Pantalla Invitados de GUEST con los botones Importar lista y Crear mi lista.' }
    },
    {
      scene: 'envio', tab: 'WhatsApp',
      title: 'Por WhatsApp, con recordatorio',
      text: 'La mandáis por WhatsApp a cada familia y veis quién la tiene y quién no ha contestado. A los que faltan, les enviáis un recordatorio en un momento.',
      points: ['Una invitación para toda la familia', 'Enviados y pendientes, a la vista', 'Recordatorios a quien no ha respondido'],
      shot: { src: 'envio.jpg', alt: 'Ficha de la familia en GUEST con el botón Enviar o compartir invitación.' }
    },
    {
      scene: 'eventos', tab: 'Preboda',
      title: 'La preboda, con su propia invitación',
      text: 'Preboda, brunch o cena de bienvenida: cada evento tiene su invitación, su lista y sus respuestas. Elegís a los invitados de vuestra lista, sin volver a crearlos.',
      points: ['Personas sueltas o grupos enteros', 'Sin mezclarse con la boda', 'Recordatorios y enlace al calendario'],
      shot: { src: 'eventos.jpg', alt: 'Eventos extra en GUEST junto al paso Ajusta las mesas.' }
    },
    {
      scene: 'listados', tab: 'Listados con versión',
      title: 'Listados con su versión',
      text: 'Mesas, menús, transporte o alojamiento, en PDF o en Excel. Cada listado lleva su número de revisión y su fecha, para saber si vuestro proveedor tiene el que está en vigor.',
      points: ['En PDF o en Excel', 'Revisión y fecha en cada copia', 'Aviso si un listado se ha quedado antiguo'],
      shot: { src: 'listados.jpg', alt: 'Pantalla Listados de GUEST con los botones Imprimir o PDF y Excel o CSV.' },
      sheet: { src: 'pdf.jpg', alt: 'Listado de mesas en PDF con el nombre y la respuesta de cada invitado.' }
    }
  ];

  const shotImg = (src, alt) => `<img src="${APP_SHOTS}${src}" alt="${alt}" width="720" height="1008" loading="lazy" decoding="async">`;

  // Toda la pantalla es el botón de ampliar; el chip de la esquina solo lo anuncia.
  const zoomButton = (index, kind, label) => `<button class="phone-zoom" type="button" data-zoom="${index}" data-kind="${kind}" aria-label="Ampliar: ${label}"><span class="zoom-chip" aria-hidden="true"><svg><use href="#i-zoom"/></svg></span></button>`;

  function featureMedia(feature, index) {
    if (feature.video) {
      const { src, poster, label } = feature.video;
      return `<div class="feature-phone"><div class="phone-screen is-video"><video data-autoplay muted loop playsinline preload="none" poster="${APP_SHOTS}${poster}" aria-label="${label}"><source src="${APP_SHOTS}${src}.webm" type="video/webm"><source src="${APP_SHOTS}${src}.mp4" type="video/mp4"></video>${zoomButton(index, 'video', feature.title)}</div></div>`;
    }
    // Dos móviles con la misma boda: uno para cada novio, cada uno con su tema.
    if (feature.pair) {
      const { phones, alt } = feature.pair;
      return `<div class="feature-pair"><div class="feature-phone pair-spacer" aria-hidden="true"><div class="phone-screen"></div></div>${phones.map(({ src, name, theme }, n) => `
        <figure class="pair-phone"><div class="feature-phone"><div class="phone-screen">${shotImg(src, n ? '' : alt)}${n ? zoomButton(index, 'shot', feature.title) : ''}</div></div><figcaption><b>${name}</b><span>tema ${theme}</span></figcaption></figure>`).join('')}
        <span class="pair-sync" aria-hidden="true"><svg><use href="#i-sync"/></svg></span></div>`;
    }
    // El listado en PDF asoma por fuera del móvil, como el papel que se entrega al catering.
    const sheet = feature.sheet
      ? `<button class="feature-sheet" type="button" data-zoom="${index}" data-kind="sheet" aria-label="Ampliar: listado en PDF"><img src="${APP_SHOTS}${feature.sheet.src}" alt="${feature.sheet.alt}" width="640" height="578" loading="lazy" decoding="async"></button>`
      : '';
    return `<div class="feature-phone"><div class="phone-screen">${shotImg(feature.shot.src, feature.shot.alt)}${zoomButton(index, 'shot', feature.title)}</div>${sheet}</div>`;
  }

  // Captura ampliada: la pantalla a tamaño de móvil real para poder leerla.
  function initZoom(list) {
    const dialog = $('#shotDialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const stage = $('.shot-stage', dialog);
    const caption = $('.shot-caption', dialog);
    const media = (feature, kind) => {
      if (kind === 'video') {
        const { src, poster, label } = feature.video;
        return `<video ${reduceMotion ? 'controls' : 'autoplay'} muted loop playsinline poster="${APP_SHOTS}${poster}" aria-label="${label}"><source src="${APP_SHOTS}${src}.webm" type="video/webm"><source src="${APP_SHOTS}${src}.mp4" type="video/mp4"></video>`;
      }
      if (kind === 'sheet') return `<img class="is-sheet" src="${APP_SHOTS}${feature.sheet.src}" alt="${feature.sheet.alt}" width="640" height="578">`;
      const shot = feature.shot || { src: feature.pair.phones[1].src, alt: feature.pair.alt };
      return `<img src="${APP_SHOTS}${shot.src}" alt="${shot.alt}" width="720" height="1008">`;
    };
    list.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-zoom]');
      if (!trigger) return;
      const feature = features[Number(trigger.dataset.zoom)];
      stage.innerHTML = media(feature, trigger.dataset.kind);
      caption.textContent = feature.title;
      document.documentElement.classList.add('has-dialog');
      dialog.showModal();
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog || event.target.closest('.shot-close')) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('has-dialog');
      stage.innerHTML = '';
    });
  }

  function initDemo() {
    const list = $('#appFeatures');
    if (!list) return;
    const count = $('#appCount');
    const prev = $('#appPrev');
    const next = $('#appNext');
    const pad = (n) => String(n).padStart(2, '0');

    list.innerHTML = features.map((feature, index) => `
      <li class="feature" id="app-${feature.scene}" data-scene="${feature.scene}">
        ${featureMedia(feature, index)}
        <div class="feature-text">
          <h3>${feature.title}</h3>
          <p>${feature.text}</p>
          <ul class="feature-points">${feature.points.map((point) => `<li><svg aria-hidden="true"><use href="#i-check"/></svg>${point}</li>`).join('')}</ul>
        </div>
      </li>`).join('');

    initZoom(list);

    // Índice de lo que hace distinta a la app: cada botón lleva a su ficha y se marca la que se ve.
    const nav = $('#appIndex');
    nav.innerHTML = features.map((feature, n) => `<a class="features-chip" href="#app-${feature.scene}" data-go="${n}">${feature.tab}</a>`).join('');
    const chips = $$('.features-chip', nav);
    let chosen = -1;
    let chosenAt = 0;
    nav.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-go]');
      if (!chip) return;
      event.preventDefault();
      chosen = Number(chip.dataset.go);
      chosenAt = performance.now();
      const card = list.children[chosen];
      list.scrollTo({ left: card.offsetLeft - list.firstElementChild.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
      // Si la ficha queda fuera de la vista, la página baja (o sube) hasta el índice, que queda bajo la cabecera.
      if (nav.getBoundingClientRect().top < 60 || list.getBoundingClientRect().top > innerHeight * 0.55) {
        nav.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      update();
    });

    // El vídeo del plano solo se reproduce mientras se ve; con movimiento reducido queda el fotograma.
    const videos = $$('video[data-autoplay]', list);
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) target.play().catch(() => {});
        else target.pause();
      }), { threshold: 0.4 });
      videos.forEach((video) => io.observe(video));
    }

    const stride = () => {
      const card = $('.feature', list);
      const gap = parseFloat(getComputedStyle(list).columnGap) || 16;
      return card ? card.getBoundingClientRect().width + gap : 320;
    };
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = list.scrollWidth - list.clientWidth;
        const index = max > 4 ? Math.round(list.scrollLeft / stride()) : 0;
        // Al final del carril se ven varias fichas: se respeta la que se eligió en el índice si sigue a la vista.
        const box = list.getBoundingClientRect();
        const visible = (n) => { const card = list.children[n].getBoundingClientRect(); return card.left >= box.left - 8 && card.right <= box.right + 8; };
        if (chosen >= 0 && performance.now() - chosenAt > 900 && !visible(chosen)) chosen = -1;
        const current = chosen >= 0 ? chosen : Math.min(features.length - 1, index);
        count.textContent = `${pad(current + 1)} / ${pad(features.length)}`;
        chips.forEach((chip, n) => chip.toggleAttribute('aria-current', n === current));
        // En el móvil el índice también se desliza para que la función marcada quede a la vista.
        const on = chips[current];
        const inset = parseFloat(getComputedStyle(nav).paddingLeft);
        if (nav.scrollWidth > nav.clientWidth && (on.offsetLeft < nav.scrollLeft + inset || on.offsetLeft + on.offsetWidth > nav.scrollLeft + nav.clientWidth - inset)) {
          nav.scrollTo({ left: on.offsetLeft - inset, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        prev.disabled = list.scrollLeft <= 4;
        next.disabled = list.scrollLeft >= max - 4;
      });
    };
    const move = (direction) => list.scrollBy({ left: direction * stride(), behavior: reduceMotion ? 'auto' : 'smooth' });
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    list.addEventListener('keydown', (event) => {
      if (event.target !== list) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    });
    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }


  /* ---------- Pasos: el matasellos se marca al entrar en pantalla ---------- */
  function initRoute() {
    const steps = $$('#route li');
    if (!('IntersectionObserver' in window)) { steps.forEach((step) => step.classList.add('is-in')); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -18% 0px' });
    steps.forEach((step) => observer.observe(step));
  }

  /* ---------- Cierre: tira de sellos ---------- */
  function initMarquee() {
    const track = $('#marquee');
    const stamp = (design) => `<span class="stamp stamp-strip"><span class="stamp-art"><img src="${escapeHTML(design.image)}" alt="" loading="lazy" decoding="async"></span></span>`;
    const strip = catalog.map(stamp).join('');
    track.innerHTML = strip + strip;
  }

  /* ---------- Barra de compra en móvil ---------- */
  function initBuybar() {
    const bar = $('#buybar');
    const hero = $('.hero');
    const pricing = $('#precio');
    // El precio solo aparece cuando ya se ha visto el producto y el proceso:
    // la barra sale después de la sección de precio, nunca antes.
    const visible = { hero: true, pricing: false };
    let reachedPricing = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible[entry.target === hero ? 'hero' : 'pricing'] = entry.isIntersecting;
        if (entry.target === pricing && (entry.isIntersecting || entry.boundingClientRect.top < 0)) reachedPricing = true;
      });
      bar.classList.toggle('is-visible', reachedPricing && !visible.hero && !visible.pricing);
      document.body.classList.toggle('past-hero', !visible.hero);
    }, { threshold: 0.05 });
    observer.observe(hero);
    observer.observe(pricing);
  }

  /* ---------- Apertura y cierre de cada diseño ---------- */
  function initMoments() {
    const picker = $('#momentsPicker');
    const pair = $('#momentsPair');
    if (!picker || !pair) return;
    const openVideo = $('#momentOpenVideo');
    const closeVideo = $('#momentCloseVideo');
    const button = $('#momentsOpen');
    const label = $('#momentsName');
    picker.innerHTML = catalog.map((design) => (
      `<button type="button" class="moments-chip" data-design="${escapeHTML(design.id)}" aria-pressed="${design.id === button.dataset.open}">${escapeHTML(design.name)}</button>`
    )).join('');
    const setVideo = (video, base, poster, text) => {
      video.poster = poster;
      video.setAttribute('aria-label', text);
      const [webm, mp4] = video.querySelectorAll('source');
      webm.src = `${base}.webm?v=41`;
      mp4.src = `${base}.mp4?v=41`;
      video.load();
      if (clipObserver) decideClip(video);
    };
    // En móvil los nombres se quedan fijos bajo la cabecera mientras se ven los dos sellos.
    const header = $('#header');
    const pin = () => { picker.style.top = `${header ? header.offsetHeight : 0}px`; };
    pin();
    window.addEventListener('resize', pin);
    let timer = 0;
    picker.addEventListener('click', (event) => {
      const chip = event.target.closest('.moments-chip');
      if (!chip || chip.getAttribute('aria-pressed') === 'true') return;
      const design = catalog.find((item) => item.id === chip.dataset.design);
      if (!design) return;
      $$('.moments-chip', picker).forEach((item) => item.setAttribute('aria-pressed', String(item === chip)));
      // Solo se desplaza la fila de nombres, nunca la página.
      const left = chip.offsetLeft - (picker.clientWidth - chip.offsetWidth) / 2;
      picker.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? 'auto' : 'smooth' });
      button.dataset.open = design.id;
      label.textContent = design.name;
      document.dispatchEvent(new CustomEvent('guest:design', { detail: design.id }));
      pair.classList.add('is-swapping');
      clearTimeout(timer);
      timer = setTimeout(() => {
        const close = design.clip.replace('clip-', 'close-');
        setVideo(openVideo, design.clip, design.image, `Apertura de la invitación ${design.name}`);
        setVideo(closeVideo, close, `${close}.jpg?v=41`, `Cierre de la invitación ${design.name}`);
        pair.classList.remove('is-swapping');
      }, reduceMotion ? 0 : 180);
    });
  }

  /* ---------- Precio: el diseño que han mirado va con la compra ---------- */
  function initPick() {
    const row = $('#pickRow');
    if (!row) return;
    const cover = $('#pickCover');
    const name = $('#pickName');
    const buy = $('#pickBuy');
    const barName = $('#buybarName');
    const barBuy = $('#buybarBuy');
    row.innerHTML = catalog.map((design) => (
      `<button type="button" class="pick-chip" data-design="${escapeHTML(design.id)}" aria-pressed="false">${escapeHTML(design.name)}</button>`
    )).join('');
    let timer = 0;
    const select = (id, scroll = true) => {
      const design = catalog.find((item) => item.id === id);
      if (!design) return;
      let active = null;
      $$('.pick-chip', row).forEach((chip) => {
        const on = chip.dataset.design === id;
        chip.setAttribute('aria-pressed', String(on));
        if (on) active = chip;
      });
      name.textContent = design.name;
      buy.href = buyUrl(design);
      if (barName) barName.textContent = design.name;
      if (barBuy) barBuy.href = buyUrl(design);
      if (cover.getAttribute('src') !== design.image) {
        cover.classList.add('is-swapping');
        clearTimeout(timer);
        timer = setTimeout(() => { cover.src = design.image; cover.classList.remove('is-swapping'); }, reduceMotion ? 0 : 160);
      }
      // Solo se desplaza la fila de nombres, nunca la página.
      if (scroll && active && row.scrollWidth > row.clientWidth) {
        const left = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
        row.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    };
    row.addEventListener('click', (event) => {
      const chip = event.target.closest('.pick-chip');
      if (chip) select(chip.dataset.design);
    });
    document.addEventListener('guest:design', (event) => select(event.detail));
    select('design-11', false);
  }

  applyConfig();
  initCheckout();
  initHeader();
  initHeroVideo();
  initCatalog();
  $$('video[data-autoplay]').forEach(watchClip);
  initMoments();
  initViewer();
  initDemo();
  initRoute();
  initMarquee();
  initBuybar();
  initPick();
})();
