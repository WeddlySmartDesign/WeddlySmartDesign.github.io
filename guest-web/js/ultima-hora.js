/* ¡Última hora! Portada de periódico de boda. Todo en el navegador: no se guarda nada. */
(() => {
  const W = 1080, H = 1350;
  const C = { paper: '#f3eadb', paper2: '#e9dcc6', ink: '#1b2650', soft: '#4a5480', red: '#b3263a', blush: '#f0c4bc', deep: '#131b3b' };
  const CAST = ['javi', 'lola', 'oscar', 'dani', 'carmen', 'marta', 'nuria', 'hugo'];
  const IDEAS = [
    'Los novios dicen «sí» y media sala busca pañuelos',
    'La tía Carmen ya baila y aún no han servido el aperitivo',
    'Hallan la barra libre: los invitados no se hacen responsables',
    'El novio llora antes de que empiece la ceremonia',
    'Piden «una última canción» y no será la última',
    'Se confirma: nadie sabe dónde ha ido a parar el ramo'
  ];
  const SUBS = [
    'Testigos aseguran que el ambiente es inmejorable y que nadie quiere irse a casa.',
    'La organización pide calma, agua y que nadie toque la tarta antes de tiempo.',
    'Fuentes cercanas al convite hablan de lágrimas, risas y un baile sin precedentes.'
  ];
  const BODY = [
    'La jornada transcurre entre abrazos y brindis. Los presentes coinciden: «Nunca habíamos visto algo igual».',
    'Ocurrió poco después del aperitivo. Desde entonces la pista no se ha vaciado y los tacones piden clemencia.',
    'La noticia corrió por las mesas en minutos. Ya se comenta con el tercer plato y se espera el discurso de los padrinos.'
  ];
  const QUOTES = ['«Yo solo he venido por el aperitivo»', '«Me han dicho que no llore y llevo tres»', '«Esto no lo cuento, pero lo cuento»'];
  const CAPS = ['Los más afectados, minutos después de conocerse la noticia.', 'Varios invitados, tras recibir la noticia en directo.', 'Imagen de última hora: el momento exacto.'];

  const f = document.getElementById('uh-form'), cv = document.getElementById('uh-canvas');
  const hint = document.getElementById('uh-hint'), g = cv.getContext('2d');
  const qs = new URLSearchParams(location.search);
  f.n.value = (qs.get('n') || '').slice(0, 44).trim();
  f.f.value = (qs.get('f') || '').slice(0, 32).trim();
  f.h.value = (qs.get('h') || '').slice(0, 110).trim() || IDEAS[Math.floor(Math.random() * IDEAS.length)];
  if (f.n.value) {
    document.title = `${f.n.value} · ¡Última hora!`;
    document.getElementById('uh-eyebrow').textContent = 'Boda de ' + f.n.value + (f.f.value ? ' · ' + f.f.value : '');
    document.getElementById('uh-sub').textContent = 'Escribe el titular de la boda y llévate la portada.';
  }

  let variant = Math.floor(Math.random() * 9);
  const imgs = {};
  const load = (k) => imgs[k] || (imgs[k] = new Promise((ok) => { const m = new Image(); m.onload = () => ok(m); m.onerror = () => ok(null); m.src = `assets/quiz/${k}.webp`; }));
  const fontsReady = () => document.fonts ? Promise.all(['110px "Abril Fatface"', '600 30px "Hanken Grotesk"', '400 26px "Courier Prime"', '400 30px "Caveat"'].map((x) => document.fonts.load(x).catch(() => 0))) : Promise.resolve();

  // Líneas por palabras; las palabras más largas que la caja se parten en seco.
  const lines = (text, max) => {
    const out = []; let line = '';
    text.split(/\s+/).filter(Boolean).forEach((w) => {
      const t = line ? line + ' ' + w : w;
      if (g.measureText(t).width > max && line) { out.push(line); line = w; } else line = t;
    });
    if (line) out.push(line);
    return out;
  };
  const para = (text, x, y, max, lh) => { lines(text, max).forEach((l, i) => g.fillText(l, x, y + i * lh)); return y + lines(text, max).length * lh; };
  const spaced = (t, x, y, ls, align) => { g.letterSpacing = ls + 'px'; g.textAlign = align; g.fillText(t, align === 'center' ? x + ls / 2 : x, y); g.letterSpacing = '0px'; };

  function grain() {
    let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 2600; i++) { g.fillStyle = r() > .5 ? 'rgba(27,38,80,.05)' : 'rgba(179,38,58,.04)'; g.fillRect(r() * W, r() * H, 1 + r() * 2.2, 1 + r() * 2.2); }
  }

  async function draw() {
    const [, a, b, c] = await Promise.all([fontsReady(), ...[0, 1, 2].map((i) => load(CAST[(variant + i * 3) % CAST.length]))]);
    const head = f.h.value.trim() || IDEAS[0];
    const names = f.n.value.trim(), date = f.f.value.trim();
    const sub = f.s.value.trim() || SUBS[variant % SUBS.length];
    cv.width = W; cv.height = H;
    g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
    const v = g.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 900); v.addColorStop(0, 'rgba(255,255,255,0)'); v.addColorStop(1, 'rgba(120,90,50,.16)');
    g.fillStyle = v; g.fillRect(0, 0, W, H); grain();
    g.textBaseline = 'alphabetic';
    const X = 72, R = W - 72, CW = R - X;

    // marco
    g.strokeStyle = C.ink; g.lineWidth = 3; g.strokeRect(36, 36, W - 72, H - 72);
    g.lineWidth = 1; g.strokeRect(46, 46, W - 92, H - 92);

    // cabecera
    g.fillStyle = C.ink; g.font = '400 24px "Courier Prime"';
    spaced('EDICIÓN ESPECIAL', X, 100, 4, 'left');
    spaced((date || 'HOY').toUpperCase(), R, 100, 4, 'right');
    g.fillRect(X, 118, CW, 3); g.fillRect(X, 126, CW, 1);

    // cabecera del diario
    g.font = '400 168px "Abril Fatface"'; g.textAlign = 'center'; g.fillStyle = C.ink;
    const mast = 'Última hora';
    let ms = 168; while (g.measureText(mast).width > CW - 20 && ms > 90) { ms -= 4; g.font = `400 ${ms}px "Abril Fatface"`; }
    g.fillText(mast, W / 2, 278);
    g.fillRect(X, 306, CW, 1); g.fillRect(X, 313, CW, 3);
    g.font = '400 23px "Courier Prime"';
    const strap = names ? 'CRÓNICA DE LA BODA DE ' + names.toUpperCase() : 'EDICIÓN EXTRAORDINARIA · SOLO PARA INVITADOS';
    g.fillStyle = C.soft; let ss = 23; while (g.measureText(strap).width + strap.length * 3 > CW && ss > 15) { ss--; g.font = `400 ${ss}px "Courier Prime"`; }
    spaced(strap, W / 2, 354, 3, 'center');
    g.fillStyle = C.ink; g.fillRect(X, 374, CW, 1);

    // cinta roja
    g.save(); g.translate(X, 420); g.rotate(-.012);
    g.fillStyle = C.red; g.fillRect(0, -30, 470, 52);
    g.fillStyle = '#fff'; g.font = '400 24px "Courier Prime"'; spaced('¡NOTICIA DE ÚLTIMA HORA!', 24, 5, 3, 'left'); g.restore();

    // titular: el cuerpo más grande que quepa dejando sitio a la foto
    const photoMin = 330, footerTop = H - 150, subLH = 40;
    let size = 124, hl = [], y0 = 470;
    for (; size >= 54; size -= 4) {
      g.font = `400 ${size}px "Abril Fatface"`; hl = lines(head, CW);
      const used = hl.length * size * 1.04 + 24 + lines(sub, CW).length * subLH + 26;
      if (hl.length <= 5 && footerTop - (y0 + used) >= photoMin) break;
    }
    g.font = `400 ${size}px "Abril Fatface"`; g.fillStyle = C.ink; g.textAlign = 'left';
    hl = lines(head, CW);
    let y = y0 + size * .86; hl.forEach((l) => { g.fillText(l, X - 2, y); y += size * 1.04; });
    y += -size * .04 + 6;
    g.fillStyle = C.red; g.fillRect(X, y - 14, 84, 4);
    g.fillStyle = C.soft; g.font = '600 29px "Hanken Grotesk"'; y = para(sub, X, y + 26, CW, subLH) + 6;

    // foto + texto
    const py = y + 6, ph = footerTop - py - 30, pw = 500;
    g.save(); g.beginPath(); g.rect(X, py, pw, ph); g.clip();
    g.fillStyle = C.ink; g.fillRect(X, py, pw, ph);
    g.fillStyle = 'rgba(240,196,188,.22)';
    for (let yy = py + 10; yy < py + ph; yy += 18) for (let xx = X + ((yy - py) / 18 % 2 ? 9 : 0); xx < X + pw; xx += 18) { const k = 1 + 3.2 * (yy - py) / ph; g.beginPath(); g.arc(xx, yy, k, 0, 7); g.fill(); }
    const place = (m, cx, hgt) => { if (!m) return; const w = m.width * hgt / m.height; g.save(); g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 24; g.shadowOffsetY = 8; g.drawImage(m, cx - w / 2, py + ph - hgt + 8, w, hgt); g.restore(); };
    place(a, X + pw * .22, Math.min(ph * .8, 330)); place(c, X + pw * .78, Math.min(ph * .8, 340)); place(b, X + pw * .5, Math.min(ph * .96, 400));
    g.restore();
    g.strokeStyle = C.ink; g.lineWidth = 3; g.strokeRect(X, py, pw, ph);
    g.fillStyle = C.soft; g.font = '400 21px "Courier Prime"'; g.textAlign = 'left';
    const capY = py + ph + 26; g.fillText(CAPS[variant % CAPS.length], X, capY, pw);

    // columna de texto
    const tx = X + pw + 36, tw = R - tx;
    g.fillStyle = C.ink;
    const body = (names ? `${names} ya son noticia. ` : '') + BODY[variant % BODY.length];
    const room = ph - 120; let fs = 27, lh = 36, ls;
    for (; fs >= 20; fs--) { g.font = `400 ${fs}px "Courier Prime"`; lh = Math.round(fs * 1.34); ls = lines(body, tw); if (ls.length * lh <= room) break; }
    const maxL = Math.max(1, Math.floor(room / lh)); const ty = py + 28;
    ls.slice(0, maxL).forEach((l, i) => { const cut = i === maxL - 1 && ls.length > maxL; g.fillText(cut ? l.replace(/[ ,;:.]*\S*$/, '') + '…' : l, tx, ty + i * lh); });
    g.fillStyle = C.red; g.fillRect(tx, py + ph - 78, 56, 3);
    g.fillStyle = C.ink; g.font = '400 30px "Abril Fatface"'; para(QUOTES[variant % QUOTES.length], tx, py + ph - 38, tw, 36);

    // pie
    g.fillStyle = C.ink; g.fillRect(X, footerTop + 6, CW, 1); g.fillRect(X, footerTop + 12, CW, 3);
    g.font = '400 22px "Courier Prime"'; g.fillStyle = C.soft;
    spaced('FUENTES: TODOS LOS PRESENTES', X, footerTop + 56, 3, 'left');
    g.fillStyle = C.red; g.font = '400 40px "Caveat"'; g.textAlign = 'right'; g.fillText(names ? 'Sí, quiero.' : 'Hoy hay boda.', R, footerTop + 60);

    // sello EXTRA
    g.save(); g.translate(R - 62, 418); g.rotate(.2); g.globalAlpha = .88; g.strokeStyle = C.red; g.fillStyle = C.red;
    g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 54, 0, 7); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 45, 0, 7); g.stroke();
    g.font = '400 30px "Abril Fatface"'; g.textAlign = 'center'; g.fillText('EXTRA', 0, 10); g.restore();
  }

  let raf = 0; const redraw = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };
  const count = f.querySelector('.uh-count');
  const upd = () => { count.textContent = f.h.value.length + '/110'; redraw(); };
  f.addEventListener('input', upd); f.addEventListener('submit', (e) => e.preventDefault());
  f.querySelector('.uh-chips').append(...IDEAS.map((t) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'uh-chip'; b.textContent = t; b.addEventListener('click', () => { f.h.value = t; upd(); }); return b; }));
  f.querySelector('.uh-photo').addEventListener('click', () => { variant++; redraw(); });
  upd();

  const blob = () => new Promise((ok) => cv.toBlob(ok, 'image/png'));
  f.querySelector('.uh-dl').addEventListener('click', async () => {
    await draw(); const b = await blob(); const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = 'ultima-hora.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  });
  f.querySelector('.uh-share').addEventListener('click', async () => {
    await draw(); const b = await blob(); const file = b && new File([b], 'ultima-hora.png', { type: 'image/png' });
    const text = f.h.value.trim() + ' · ¡Última hora!';
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text }); } catch (e) {} return; }
    try { if (navigator.share) { await navigator.share({ title: '¡Última hora!', text, url: location.href }); return; } await navigator.clipboard.writeText(`${text} ${location.href}`); hint.textContent = 'Copiado. Pégalo donde quieras.'; }
    catch (e) { if (e && e.name !== 'AbortError') hint.textContent = 'Desde aquí no se puede compartir: descarga la portada y envíala.'; }
  });
})();
