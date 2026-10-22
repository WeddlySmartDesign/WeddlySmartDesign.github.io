/* GUEST · Feria
   Expositor táctil sin conexión: escaparate en bucle → catálogo → invitación entera.
   Si nadie toca durante un rato, vuelve solo al escaparate. */
(() => {
  'use strict';

  const IDLE_MS = 75000;          // sin tocar nada, vuelta al escaparate
  const IDLE_VIEWER_MS = 120000;  // dentro de una invitación se lee más despacio
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPhone = () => innerWidth < 600;

  const catalog = [
    { name: 'Azahar', note: 'Óleo de limoneros y una cancela que se abre al huerto.', n: '15' },
    { name: 'Cristal', note: 'Una bola de nieve con vosotros dentro.', n: '04' },
    { name: 'Espejo', note: 'La finca reflejada en el agua, del revés y al derecho.', n: '08' },
    { name: 'Seda', note: 'Velos de seda que se apartan para dejaros pasar.', n: '02' },
    { name: 'Abanico', note: 'Terciopelo verde y un abanico que se despliega.', n: '03' },
    { name: 'Gala', note: 'Puertas art déco que se abren a una noche de fuegos artificiales.', n: '06' },
    { name: 'Invernadero', note: 'Hierro, cristal y palmeras de un jardín de invierno.', n: '05' },
    { name: 'Melodía', note: 'Una caja de música que se abre a un jardín de papel.', n: '09' },
    { name: 'Cuento', note: 'Un libro de tela que se abre en un cuento de papel.', n: '10' },
    { name: 'Botánica', note: 'Pétalos a contraluz y una historia que se descubre al deslizar.', n: '07' },
    { name: 'Rumbo', note: 'Un mapa ilustrado con la ruta hasta la boda, cerrado con lacre.', n: '14' },
    { name: 'Brisa', note: 'Cerámica pintada a mano y mar de fondo.', n: '01' },
    { name: 'Viñeta', note: 'Vuestra historia en viñetas de cómic, con fotomatón final.', n: '11' },
    { name: 'Ellas', note: 'El cómic, protagonizado por dos novias.', n: '12' },
    { name: 'Ellos', note: 'El cómic, protagonizado por dos novios.', n: '13' }
  ].map((d) => ({ ...d, cover: `assets/cover-${d.n}.jpg`, clip: `assets/clip-${d.n}.mp4`, end: `assets/close-${d.n}.jpg`, endClip: `assets/close-${d.n}.mp4`, endHD: `assets/cierre-${d.n}.mp4`, endPoster: `assets/cierre-${d.n}.jpg`, full: `invitaciones/${d.n}/index.html` }));

  const features = [
    { title: 'Sentadlos en el plano', text: 'Dibujáis vuestro salón con sus mesas, la pista y la cabina, y lo movéis todo con el dedo.', points: ['Arrastrad, girad y cambiad el tamaño', 'Mesas redondas y rectangulares', 'Las plazas ocupadas de cada mesa, a la vista'], video: 'mesas' },
    { title: 'Varios de una vez', text: 'Tocáis a los que van juntos y elegís mesa. La app solo os ofrece las mesas donde caben.', points: ['Toda una familia, sin ir uno a uno', 'Sin pasarse de plazas', 'Cambios rápidos de una mesa a otra'], video: 'varios' },
    { title: 'Para los dos, desde el móvil', text: 'Cada uno entra desde su propio móvil y los dos veis la misma boda: lo que añade uno, le aparece al otro.', points: ['Un acceso para cada uno', 'Sin descargar nada', 'En español y en inglés'], shot: 'hoy' },
    { title: 'Sabed quién viene', text: 'Cada invitado confirma desde la propia invitación y su respuesta os llega al momento.', points: ['Acompañantes y niños', 'Menús, alergias e intolerancias', 'Vuestras preguntas, como la canción que no puede faltar'], shot: 'respuestas' },
    { title: 'Enviadla a cada invitado', text: 'Elegís el contacto y la mandáis por WhatsApp, por mensaje o con un enlace. Cada familia recibe la suya.', points: ['Una invitación para toda la familia', 'Veis a quién falta por enviar', 'Sin guardar teléfonos en la app'], shot: 'envio' },
    { title: 'Vuestra lista, por familias', text: 'Importáis la lista que ya tenéis o la creáis en la app, ordenada por grupos y subgrupos.', points: ['Desde Excel o CSV', 'Por persona, pareja o familia', 'O desde la agenda del móvil'], shot: 'lista' },
    { title: 'Listados para el catering', text: 'Generáis solo lo que os piden: mesas, menús, transporte o alojamiento, listo para entregar.', points: ['En PDF o en Excel', 'Menús y alergias para el catering', 'Cada copia con su fecha'], shot: 'listados' },
    { title: 'Preboda y otros eventos', text: 'Cada evento tiene su propia invitación sencilla, su lista y sus respuestas, sin mezclarse con la boda.', points: ['Preboda, brunch o cena de bienvenida', 'Solo con quien vosotros elijáis', 'Enlace al calendario'], shot: 'eventos' }
  ];

  /* ---------- Avisos ---------- */
  let toastTimer = 0;
  const toast = (text) => {
    const el = $('#toast');
    el.textContent = text;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
  };

  /* ---------- Escaparate ---------- */
  const attract = $('#attract');
  const loop = $('#loop');
  const shell = $('#shell');
  const loopSrc = () => (innerWidth >= innerHeight ? 'assets/loop-h.mp4' : 'assets/loop-v.mp4');
  const playLoop = () => {
    const src = loopSrc();
    if (!loop.src.endsWith(src)) { loop.poster = src.replace('.mp4', '.jpg'); loop.src = src; }
    loop.play().catch(() => {});
  };
  const showAttract = () => {
    viewer.close(true);
    shell.hidden = true;
    attract.hidden = false;
    tabs.go('disenos', false);
    $$('.view').forEach((v) => { v.scrollTop = 0; });
    $('#rail').scrollLeft = 0;
    playLoop();
    pauseAll();
  };
  const leaveAttract = () => {
    attract.hidden = true;
    loop.pause();
    shell.hidden = false;
    tabs.go('disenos');
    wakeUp();
  };
  attract.addEventListener('click', leaveAttract);
  addEventListener('resize', () => { if (!attract.hidden) playLoop(); });

  /* ---------- Pestañas ---------- */
  const tabs = {
    current: 'disenos',
    go(id, animate = true) {
      this.current = id;
      $$('.tabs button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tab === id)));
      $$('.view').forEach((v) => {
        const on = v.id === id;
        v.hidden = !on;
        if (on && animate && !reduceMotion) { v.classList.remove('is-entering'); void v.offsetWidth; v.classList.add('is-entering'); }
      });
      syncVideos();
    }
  };
  $$('.tabs button').forEach((b) => b.addEventListener('click', () => tabs.go(b.dataset.tab)));

  /* ---------- Vídeos: solo se mueven los que se ven ---------- */
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    syncVideos();
  }, { threshold: 0.35 });
  const syncVideos = () => {
    $$('video[data-auto]').forEach((v) => {
      const on = !shell.hidden && viewer.isClosed() && !v.closest('[hidden]') && visible.has(v);
      if (on && v.paused) v.play().catch(() => {});
      if (!on && !v.paused) v.pause();
    });
  };
  const pauseAll = () => $$('video[data-auto]').forEach((v) => v.pause());

  /* ---------- Catálogo: portadas o cierres ---------- */
  const MODES = {
    portadas: { title: 'Abridlas como lo harán vuestros invitados.', lead: 'Tocad un sello y recorred la invitación entera, de la portada al cierre.' },
    cierres: { title: 'Y un final que se recuerda.', lead: 'Así se despide cada invitación. Tocad un sello para ver el cierre y, después, la invitación entera.' }
  };
  let mode = 'portadas';
  $('#grid').innerHTML = catalog.map((d, i) => `
    <li><button class="stamp-btn" type="button" data-open="${i}" aria-label="Abrir la invitación ${d.name}">
      <span class="stamp-wrap"><span class="stamp"><span class="stamp-art">
        <img src="${d.cover}" alt="" width="390" height="844">
        <video data-auto muted loop playsinline preload="none" poster="${d.cover}" src="${d.clip}"></video>
      </span></span></span>
      <span class="stamp-name">${d.name}</span>
    </button></li>`).join('');
  $$('#grid video').forEach((v) => io.observe(v));
  const setMode = (next) => {
    if (next === mode) return;
    mode = next;
    $$('.mode button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    $('#designs-title').textContent = MODES[mode].title;
    $('#designsLead').textContent = MODES[mode].lead;
    $$('#grid li').forEach((li, i) => {
      const d = catalog[i];
      const img = $('img', li), video = $('video', li);
      img.src = mode === 'cierres' ? d.end : d.cover;
      video.pause();
      video.poster = img.src;
      video.src = mode === 'cierres' ? d.endClip : d.clip;
      $('.stamp-btn', li).setAttribute('aria-label', `${mode === 'cierres' ? 'Ver el cierre de' : 'Abrir la invitación'} ${d.name}`);
    });
    syncVideos();
  };
  $$('.mode button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('#grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) viewer.open(+b.dataset.open, mode === 'cierres');
  });

  /* ---------- La app ---------- */
  const check = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
  $('#rail').innerHTML = features.map((f, i) => `
    <article class="feature">
      <div class="screen">${f.video
        ? `<video data-auto muted loop playsinline preload="none" poster="assets/app/${f.video}-poster.jpg" src="assets/app/${f.video}.mp4"></video>`
        : `<img src="assets/app/${f.shot}.jpg" alt="" width="720" height="1008" loading="lazy">`}</div>
      <div class="feature-copy">
        <p class="no">${String(i + 1).padStart(2, '0')} / ${String(features.length).padStart(2, '0')}</p>
        <h2>${f.title}</h2>
        <p>${f.text}</p>
        <ul>${f.points.map((p) => `<li>${check}${p}</li>`).join('')}</ul>
      </div>
    </article>`).join('');
  $$('#rail video').forEach((v) => io.observe(v));

  /* ---------- Visor ---------- */
  const viewer = (() => {
    const root = $('#viewer');
    const device = $('#device');
    const stage = $('#viewerStage');
    let frame = $('#viewerFrame');
    let current = 0;
    const ending = $('#viewerEnd');
    const endBtns = $$('[data-end]');

    // El cierre es la grabación de la invitación real; «Verla entera» vuelve a la portada viva
    const showEnd = (on) => {
      const d = catalog[current];
      device.classList.toggle('show-end', on);
      endBtns.forEach((b) => {
        b.setAttribute('aria-pressed', String(on));
        b.querySelector('span').textContent = on ? b.dataset.labelOff : b.dataset.labelOn;
      });
      if (on) {
        ending.poster = d.endPoster;
        if (!ending.src.endsWith(d.endHD)) ending.src = d.endHD;
        ending.currentTime = 0;
        ending.play().catch(() => {});
      } else {
        ending.pause();
      }
    };

    // La invitación ve siempre un móvil de 390 × 844 y se escala para caber en el hueco
    const fit = () => {
      if (isPhone()) { device.style.width = device.style.height = ''; return; }
      const w = 390, h = 844;
      const scale = Math.min(1.45, stage.clientWidth / w, stage.clientHeight / h);
      device.style.width = `${Math.floor(w * scale)}px`;
      device.style.height = `${Math.floor(h * scale)}px`;
      frame.style.height = `${h}px`;
      frame.style.transform = `scale(${scale})`;
    };

    // Dentro de la invitación: los enlaces externos (mapas, calendario, WhatsApp) no tienen conexión aquí
    const guard = (win) => {
      try {
        const doc = win.document;
        ['pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown'].forEach((t) => doc.addEventListener(t, wakeUp, { passive: true, capture: true }));
        doc.addEventListener('click', (e) => {
          const a = e.target.closest && e.target.closest('a[href]');
          if (!a) return;
          const url = new URL(a.getAttribute('href'), win.location.href);
          if (url.origin !== location.origin || a.target === '_blank') {
            e.preventDefault();
            e.stopPropagation();
            toast('En la invitación real, este botón abre el mapa, el calendario o el enlace.');
          }
        }, true);
        win.open = () => { toast('En la invitación real, esto se abre en otra pantalla.'); return null; };
        doc.addEventListener('submit', (e) => {
          e.preventDefault();
          toast('Aquí es una muestra: en vuestra invitación, la respuesta os llega a la app.');
        }, true);
      } catch (err) { /* distinto origen: no debería pasar */ }
    };

    const load = (index, end = false) => {
      current = (index + catalog.length) % catalog.length;
      const d = catalog[current];
      $('#viewerNo').textContent = `${String(current + 1).padStart(2, '0')} · Diseño`;
      $('#viewerName').textContent = d.name;
      $('#dockName').textContent = d.name;
      $('#viewerNote').textContent = d.note;
      $('#viewerPoster').src = d.cover;
      device.classList.remove('is-loaded');
      // Un iframe nuevo empieza siempre en la portada
      const fresh = frame.cloneNode(false);
      fresh.removeAttribute('src');
      fresh.addEventListener('load', () => { device.classList.add('is-loaded'); guard(fresh.contentWindow); });
      fresh.src = d.full;
      frame.replaceWith(fresh);
      frame = fresh;
      fit();
      if (end) showEnd(true); else if (device.classList.contains('show-end')) { device.classList.remove('show-end'); ending.pause(); endBtns.forEach((b) => { b.setAttribute('aria-pressed', 'false'); b.querySelector('span').textContent = b.dataset.labelOn; }); }
    };

    const open = (index, end = false) => {
      root.hidden = false;
      pauseAll();
      fit();
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-open')));
      load(index, end);
      wakeUp();
    };

    const close = (instant = false) => {
      if (root.hidden) return;
      root.classList.remove('is-open');
      ending.pause();
      const done = () => {
        root.hidden = true;
        const blank = frame.cloneNode(false);
        blank.removeAttribute('src');
        frame.replaceWith(blank);
        frame = blank;
        syncVideos();
        wakeUp();
      };
      if (instant || reduceMotion) done(); else setTimeout(done, 240);
    };

    $('#viewerBack').addEventListener('click', () => close());
    $('#dockBack').addEventListener('click', () => close());
    const keepMode = () => device.classList.contains('show-end');
    $('#viewerPrev').addEventListener('click', () => load(current - 1, keepMode()));
    $('#viewerNext').addEventListener('click', () => load(current + 1, keepMode()));
    $('#dockNext').addEventListener('click', () => load(current + 1, keepMode()));
    endBtns.forEach((b) => b.addEventListener('click', () => showEnd(!keepMode())));
    $('#viewerPrice').addEventListener('click', () => { close(); tabs.go('precio'); });
    addEventListener('resize', () => { if (!root.hidden) fit(); });
    return { open, close, isClosed: () => root.hidden };
  })();

  /* ---------- Vuelta sola al escaparate ---------- */
  let idleTimer = 0;
  function wakeUp() {
    clearTimeout(idleTimer);
    if (!attract.hidden) return;
    idleTimer = setTimeout(showAttract, viewer.isClosed() ? IDLE_MS : IDLE_VIEWER_MS);
  }
  ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach((t) => addEventListener(t, wakeUp, { passive: true, capture: true }));
  $$('.view, #rail').forEach((el) => el.addEventListener('scroll', wakeUp, { passive: true }));

  /* ---------- Pantalla encendida y completa ---------- */
  let wakeLock = null;
  const keepAwake = async () => {
    try { if ('wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch (e) { /* sin permiso */ }
  };
  const goFull = () => {
    const el = document.documentElement;
    if (document.fullscreenElement || !el.requestFullscreen) return;
    el.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
  };
  addEventListener('pointerdown', () => { keepAwake(); if (!matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches) goFull(); }, { capture: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { keepAwake(); if (!attract.hidden) playLoop(); }
  });
  addEventListener('contextmenu', (e) => e.preventDefault());

  /* ---------- Sin conexión ---------- */
  const CACHE = 'guest-feria-v2';
  const prep = $('#prep');
  const offline = { total: 0, done: 0, missing: [], running: false };
  const setStatus = (text) => { $('#staffStatus').textContent = text; };
  const meter = () => { $('#staffMeter').style.width = `${offline.total ? Math.round(offline.done / offline.total * 100) : 0}%`; };

  const prepare = async () => {
    if (!('caches' in window) || offline.running) return;
    offline.running = true;
    try {
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
      const list = await (await fetch('precache.json', { cache: 'no-store' })).json();
      const cache = await caches.open(CACHE);
      offline.total = list.length; offline.done = 0; offline.missing = [];
      const todo = [];
      for (const url of list) { if (await cache.match(url, { ignoreSearch: true })) offline.done++; else todo.push(url); }
      meter();
      if (!todo.length) { setStatus('Todo guardado. Funciona sin conexión.'); prep.hidden = true; return; }
      prep.hidden = false;
      const worker = async () => {
        while (todo.length) {
          const url = todo.shift();
          try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error(res.status);
            await cache.put(url, res);
            offline.done++;
          } catch (e) { offline.missing.push(url); }
          const pct = Math.round(offline.done / offline.total * 100);
          prep.textContent = `Guardando para usar sin conexión · ${pct} %`;
          setStatus(`Guardando: ${offline.done} de ${offline.total} archivos.`);
          meter();
        }
      };
      await Promise.all([worker(), worker(), worker()]);
      if (offline.missing.length) {
        prep.textContent = 'Faltan archivos: conectad a internet y volved a abrir';
        setStatus(`Faltan ${offline.missing.length} archivos. Conectad la tablet a internet y pulsad «Comprobar».`);
      } else {
        prep.textContent = 'Listo para usar sin conexión';
        setStatus('Todo guardado. Funciona sin conexión.');
        setTimeout(() => { prep.hidden = true; }, 5000);
      }
    } catch (e) {
      setStatus(navigator.onLine ? 'No se pudo comprobar. Volved a intentarlo.' : 'Sin conexión ahora mismo. Si ya estaba todo guardado, funciona igual.');
    } finally { offline.running = false; }
  };

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then(prepare).catch(() => {});
  }

  // Panel para la expositora: mantener pulsado el logo un par de segundos
  let pressTimer = 0;
  const logo = $('#logo');
  logo.addEventListener('pointerdown', () => { pressTimer = setTimeout(() => { $('#staff').hidden = false; prepare(); }, 1800); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => logo.addEventListener(t, () => clearTimeout(pressTimer)));
  logo.addEventListener('click', () => tabs.go('disenos'));
  $('#staffClose').addEventListener('click', () => { $('#staff').hidden = true; });
  $('#staffRetry').addEventListener('click', prepare);
  $('#staffFull').addEventListener('click', goFull);

  showAttract();
})();
