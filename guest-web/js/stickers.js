/* Stickers de boda gratis
   - Las planchas cargan primero una miniatura fija (≈15 KB) y solo animan los stickers que están a la vista.
   - Al tocar uno se abre el visor: Enviar (compartir el archivo, en móviles que lo permiten) o Descargar.
   - «Descargar todos» monta un ZIP en el navegador, sin servidor ni librerías. */
(function () {
  'use strict';

  var LIST = window.STICKERS || [];
  var DIR = 'assets/stickers/';
  var COLS = { A: 'Invitados', B: 'Novios organizando', C: 'Pequeñas victorias', D: 'Objetos con vida' };
  var PILE = ['A09', 'C07', 'D02', 'A07', 'C01'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn = navigator.connection || {};
  var lowData = !!conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  var animate = !reduce && !lowData;

  function still(s) { return DIR + s.id + '-s.webp'; }
  function anim(s) { return DIR + s.id + '.webp'; }
  function fileName(s) { return 'sticker-boda-' + s.f + '.webp'; }
  function alt(s) { return s.a + ': «' + s.t + '»'; }

  /* ---------- Planchas ---------- */
  var cards = [];
  Object.keys(COLS).forEach(function (c) {
    var grid = document.querySelector('[data-grid="' + c + '"]');
    if (!grid) return;
    var frag = document.createDocumentFragment();
    LIST.forEach(function (s, i) {
      if (s.c !== c) return;
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'st';
      b.dataset.i = i;
      b.setAttribute('aria-label', s.t + '. Abrir para enviar o descargar');
      var img = document.createElement('img');
      img.src = still(s);
      img.alt = alt(s);
      img.width = 256; img.height = 256;
      img.loading = 'lazy'; img.decoding = 'async';
      b.appendChild(img);
      li.appendChild(b);
      frag.appendChild(li);
      cards.push({ img: img, s: s });
    });
    grid.appendChild(frag);
    var btn = document.querySelector('[data-zip="' + c + '"] span');
    var n = LIST.filter(function (s) { return s.c === c; }).length;
    if (btn) btn.textContent = 'Descargar los ' + n;
  });

  /* Solo se animan los que se ven; al salir vuelven a la miniatura para no cargar memoria */
  if (animate && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var img = e.target, s = LIST[img.parentNode.dataset.i];
        var want = e.isIntersecting ? anim(s) : still(s);
        if (img.getAttribute('src') !== want) img.src = want;
      });
    }, { threshold: 0.55 });
    cards.forEach(function (c) { io.observe(c.img); });
  }

  /* ---------- Montón de la entrada ---------- */
  var pile = document.getElementById('pile');
  if (pile) {
    var spots = [
      { x: '2%', y: '16%', w: '38%', r: '-7deg' },
      { x: '33%', y: '0%', w: '40%', r: '4deg' },
      { x: '64%', y: '14%', w: '34%', r: '9deg' },
      { x: '14%', y: '52%', w: '36%', r: '5deg' },
      { x: '50%', y: '50%', w: '38%', r: '-5deg' }
    ];
    PILE.forEach(function (id, k) {
      var s = LIST.filter(function (x) { return x.id === id; })[0];
      if (!s) return;
      var img = document.createElement('img');
      img.src = still(s);
      img.alt = '';
      img.width = 256; img.height = 256;
      img.style.cssText = '--x:' + spots[k].x + ';--y:' + spots[k].y + ';--w:' + spots[k].w + ';--r:' + spots[k].r + ';--i:' + k;
      pile.appendChild(img);
      if (animate) {
        var full = new Image();
        full.onload = function () { img.src = full.src; };
        window.addEventListener('load', function () { full.src = anim(s); }, { once: true });
      }
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () { pile.classList.add('is-in'); }); });
  }

  /* ---------- Índice: marca la colección que se está viendo ---------- */
  var chips = document.getElementById('chips');
  if (chips && 'IntersectionObserver' in window) {
    var links = chips.querySelectorAll('a');
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.dataset.c === e.target.dataset.c;
          a.setAttribute('aria-current', on ? 'true' : 'false');
          if (on && chips.scrollWidth > chips.clientWidth) chips.scrollTo({ left: a.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.sheet').forEach(function (s) { seen.observe(s); });
    var sentinel = new IntersectionObserver(function (e) { chips.classList.toggle('is-stuck', !e[0].isIntersecting); }, { threshold: 1, rootMargin: '-1px 0px 0px 0px' });
    sentinel.observe(chips);
  }

  /* ---------- Visor ---------- */
  var dlg = document.getElementById('viewer');
  var vImg = document.getElementById('vImg');
  var vTitle = document.getElementById('viewerTitle');
  var vCol = document.getElementById('vCol');
  var vDown = document.getElementById('vDown');
  var vShare = document.getElementById('vShare');
  var vHint = document.getElementById('vHint');
  var cur = -1;
  function track(k) { try { window.guestHit && window.guestHit('free', 'stk-' + k); } catch (err) { /* sin medición */ } }
  var canShareFiles = !!(navigator.canShare && window.File);

  function show(i) {
    cur = (i + LIST.length) % LIST.length;
    var s = LIST[cur];
    vImg.src = reduce ? still(s) : anim(s);
    vImg.alt = alt(s);
    vTitle.textContent = s.t;
    vCol.textContent = COLS[s.c];
    vDown.href = anim(s);
    track('ver-' + s.id);
    vDown.setAttribute('download', fileName(s));
  }

  function open(i) {
    show(i);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.st');
    if (b) open(+b.dataset.i);
  });
  document.getElementById('vPrev').addEventListener('click', function () { show(cur - 1); });
  document.getElementById('vNext').addEventListener('click', function () { show(cur + 1); });
  document.getElementById('vClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(cur + 1);
    if (e.key === 'ArrowLeft') show(cur - 1);
  });

  /* Deslizar en el móvil para pasar de sticker */
  var x0 = null;
  vImg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  vImg.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
  });

  /* Enviar: solo si el móvil sabe compartir archivos. Si no, el visor ofrece Descargar. */
  if (canShareFiles) {
    try {
      var probe = new File([new Blob(['x'], { type: 'image/webp' })], 'a.webp', { type: 'image/webp' });
      if (navigator.canShare({ files: [probe] })) vShare.hidden = false;
    } catch (err) { /* sin soporte */ }
  }
  if (vShare.hidden) vHint.textContent = 'Descárgalo y arrástralo a tu conversación de WhatsApp.';

  vDown.addEventListener('click', function () { track('bajar-' + LIST[cur].id); });
  vShare.addEventListener('click', function () {
    var s = LIST[cur];
    track('enviar-' + s.id);
    vShare.setAttribute('aria-busy', 'true');
    fetch(anim(s)).then(function (r) { return r.blob(); }).then(function (blob) {
      var file = new File([blob], fileName(s), { type: 'image/webp' });
      return navigator.share({ files: [file] });
    }).catch(function () { /* cancelado por la persona */ }).then(function () { vShare.removeAttribute('aria-busy'); });
  });

  /* ---------- Descargar una colección en ZIP (sin compresión: los WebP ya lo están) ---------- */
  var CRC = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(u8) { var c = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }

  function zip(files) {
    var enc = new TextEncoder(), parts = [], central = [], offset = 0;
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = f.data, crc = crc32(data);
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
      h.setUint16(8, 0, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true);
      h.setUint16(26, name.length, true);
      parts.push(h.buffer, name, data);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
      c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
      c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
      central.push(c.buffer, name);
      offset += 30 + name.length + data.length;
    });
    var size = central.reduce(function (n, p) { return n + (p.byteLength || p.length); }, 0);
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, size, true); end.setUint32(16, offset, true);
    return new Blob(parts.concat(central, [end.buffer]), { type: 'application/zip' });
  }

  document.querySelectorAll('[data-zip]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-busy') === 'true') return;
      track('zip-' + btn.dataset.zip);
      var c = btn.dataset.zip, label = btn.querySelector('span'), text = label.textContent;
      var set = LIST.filter(function (s) { return s.c === c; });
      btn.setAttribute('aria-busy', 'true');
      label.textContent = 'Preparando…';
      Promise.all(set.map(function (s) {
        return fetch(anim(s)).then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
          .then(function (b) { return { name: fileName(s), data: new Uint8Array(b) }; });
      })).then(function (files) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(zip(files));
        a.download = 'stickers-boda-' + COLS[c].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-') + '.zip';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        label.textContent = text;
      }).catch(function () {
        label.textContent = 'No se pudo. Reintentar';
      }).then(function () { btn.removeAttribute('aria-busy'); });
    });
  });

  /* ---------- Añadir a WhatsApp: paquete .wastickers (ZIP con title.txt, author.txt, cover.png y los WebP animados) ---------- */
  var waDlg = document.getElementById('waDlg'), waC = null;
  function packName(c) { return 'Stickers de boda - ' + COLS[c] + '.wastickers'; }
  document.querySelectorAll('[data-wa]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      waC = btn.dataset.wa;
      track('wa-abrir-' + waC);
      document.getElementById('waCol').textContent = 'Colección «' + COLS[waC] + '»';
      if (typeof waDlg.showModal === 'function') waDlg.showModal(); else waDlg.setAttribute('open', '');
    });
  });
  document.getElementById('waClose').addEventListener('click', function () { waDlg.close(); });
  waDlg.addEventListener('click', function (e) { if (e.target === waDlg) waDlg.close(); });
  document.getElementById('waStore').addEventListener('click', function () { track('wa-app'); });
  document.getElementById('waGo').addEventListener('click', function () {
    var go = this, label = go.querySelector('span'), text = label.textContent, c = waC;
    if (!c || go.getAttribute('aria-busy') === 'true') return;
    track('wa-descargar-' + c);
    go.setAttribute('aria-busy', 'true'); label.textContent = 'Preparando…';
    var enc = new TextEncoder();
    var set = LIST.filter(function (s) { return s.c === c; });
    Promise.all([fetch(DIR + 'cover-' + c + '.png').then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })].concat(set.map(function (s) {
      return fetch(anim(s)).then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); });
    }))).then(function (bufs) {
      var files = [
        { name: 'author.txt', data: enc.encode('WeddlySmartDesign') },
        { name: 'title.txt', data: enc.encode('Boda - ' + COLS[c]) },
        { name: 'cover.png', data: new Uint8Array(bufs[0]) }
      ];
      set.forEach(function (s, i) { files.push({ name: s.id + '.webp', data: new Uint8Array(bufs[i + 1]) }); });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([zip(files)], { type: 'application/octet-stream' }));
      a.download = packName(c);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      label.textContent = 'Descargado. Ábrelo con Sticker Maker';
    }).catch(function () { label.textContent = 'No se pudo. Reintentar'; })
      .then(function () { go.removeAttribute('aria-busy'); setTimeout(function () { label.textContent = text; }, 6000); });
  });

})();
