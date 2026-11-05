/* GUEST · Quiz «¿Qué tipo de invitado eres?» — todo local, no se guarda nada. */
(() => {
  const root = document.getElementById('quiz');
  if (!root) return;

  const TYPES = {
    javi:   { name: 'El puntual', img: 'javi', line: 'Llega el primero, con la invitación guardada y el sitio ya localizado.', quote: '«¿Empezamos ya? Son y diez…»' },
    dani:   { name: 'El alma de la fiesta', img: 'dani', line: 'Brinda con quien pase y convierte cualquier corrillo en una fiesta.', quote: '«¡Una ronda para toda la mesa!»' },
    nuria:  { name: 'La reina de la pista', img: 'nuria', line: 'Cuando suena la primera canción, ya está bailando. Y no para.', quote: '«Una más y me voy. Mentira.»' },
    lola:   { name: 'La que llora con todo', img: 'lola', line: 'Llora en la ceremonia, en los discursos y con el vals. Y abraza a todo el mundo después.', quote: '«¡Qué bonito todo, de verdad!»' },
    hugo:   { name: 'El del discurso', img: 'hugo', line: 'Nadie se lo ha pedido, pero lleva unas palabras preparadas desde hace semanas.', quote: '«Si me permitís unas palabras…»' },
    oscar:  { name: 'El cazacanapés', img: 'oscar', line: 'Conoce la ruta de las bandejas mejor que el camarero. Nunca llega al banquete con hambre.', quote: '«Esto lo cojo, que luego no vuelven.»' },
    marta:  { name: 'La fotógrafa improvisada', img: 'marta', line: 'Tiene 300 fotos del brindis y ninguna de ella. Siempre sabe dónde está la mejor luz.', quote: '«¡Un segundo, que no he salido!»' },
    carmen: { name: 'La última en irse', img: 'carmen', line: 'Apaga las luces de la pista y todavía pide una canción más.', quote: '«Si nadie se va, yo tampoco.»' }
  };

  const QUESTIONS = [
    { q: 'Te llega la invitación al móvil. ¿Qué haces?', a: [
      ['La abro enseguida y confirmo antes de que se me pase', 'javi'],
      ['Se la enseño al grupo ahora mismo, con mil emojis', 'lola'],
      ['Miro qué van a servir de comer', 'oscar'],
      ['Ya estoy pensando en qué me pongo para bailar', 'nuria'] ] },
    { q: 'Llegas al banquete. ¿Dónde te encuentran?', a: [
      ['En mi sitio, con la servilleta ya puesta', 'javi'],
      ['Con una copa, saludando mesa por mesa', 'dani'],
      ['Siguiendo la bandeja de canapés a una distancia prudente', 'oscar'],
      ['Buscando el mejor ángulo para la foto de grupo', 'marta'] ] },
    { q: 'Suena la canción que no falla. ¿Y tú?', a: [
      ['Soy la primera en pisar la pista', 'nuria'],
      ['Arrastro a toda la mesa conmigo', 'dani'],
      ['La bailo emocionada mirando a los novios', 'lola'],
      ['La grabo entera para que no se pierda', 'marta'] ] },
    { q: 'Se abre el micrófono. ¿Qué pasa?', a: [
      ['Me levanto: tenía algo preparado', 'hugo'],
      ['Grito «¡que vivan los novios!» desde mi mesa', 'dani'],
      ['Se me saltan las lágrimas antes de que hablen', 'lola'],
      ['Aprovecho para ir a por otro canapé', 'oscar'] ] },
    { q: 'Ya es de madrugada. ¿Cómo te despides?', a: [
      ['Soy de las últimas: la pista no se cierra sola', 'carmen'],
      ['Me voy a la hora prevista, con el taxi ya pedido', 'javi'],
      ['Ensayo un último brindis improvisado', 'hugo'],
      ['Me hago una última foto con todos antes de irme', 'marta'] ] }
  ];

  const standalone = root.dataset.standalone === '1';
  const qs = new URLSearchParams(location.search);
  const couple = { n: (qs.get('n') || '').slice(0, 44).trim(), f: (qs.get('f') || '').slice(0, 32).trim() };
  const $ = (s) => root.querySelector(s);
  const stage = $('.quiz-stage'), intro = $('.quiz-intro'), play = $('.quiz-play'), out = $('.quiz-result');
  const qEl = $('.quiz-q'), opts = $('.quiz-opts'), prog = $('.quiz-prog'), bar = $('.quiz-bar i'), back = $('.quiz-back');
  const AV = ['javi', 'lola', 'oscar', 'dani', 'carmen'];
  const av = document.createElement('img'); av.className = 'quiz-av'; av.alt = ''; av.width = 56; av.height = 56;
  let i = 0, picks = [], current = null;
  const cv = $('.quiz-canvas');
  const C = { ink: '#1b2650', soft: '#4a5480', env: '#f0c4bc', envSoft: '#f6dcd6', red: '#b3263a' };
  const imgs = {};
  const loadImg = (k) => imgs[k] || (imgs[k] = new Promise((ok, ko) => { const m = new Image(); m.onload = () => ok(m); m.onerror = ko; m.src = `assets/quiz/${k}.webp`; }));
  const wrap = (g, text, x, y, max, lh) => {
    const words = text.split(' '); let line = '';
    words.forEach((w) => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > max && line) { g.fillText(line, x, y); y += lh; line = w; } else line = t; });
    g.fillText(line, x, y); return y + lh;
  };
  async function drawCard(r) {
    const [m] = await Promise.all([loadImg(r.img), document.fonts ? Promise.all(['96px "Abril Fatface"', '600 36px "Hanken Grotesk"', '34px "Courier Prime"'].map((f) => document.fonts.load(f))) : 0]);
    const W = 1080, H = 1350, g = cv.getContext('2d');
    cv.width = W; cv.height = H;
    g.fillStyle = C.env; g.fillRect(0, 0, W, H);
    const x0 = 60, y0 = 60, w = W - 120, h = H - 120;
    g.fillStyle = '#fbf7f4'; g.fillRect(x0, y0, w, h);
    g.fillStyle = C.env; // perforación de sello
    for (let x = x0; x <= x0 + w + 1; x += 40) { [y0, y0 + h].forEach((y) => { g.beginPath(); g.arc(x, y, 13, 0, 7); g.fill(); }); }
    for (let y = y0; y <= y0 + h + 1; y += 40) { [x0, x0 + w].forEach((x) => { g.beginPath(); g.arc(x, y, 13, 0, 7); g.fill(); }); }
    g.strokeStyle = C.ink; g.lineWidth = 2; g.strokeRect(x0 + 34, y0 + 34, w - 68, h - 68);
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.fillStyle = C.red; g.font = '400 30px "Courier Prime"'; g.letterSpacing = '8px';
    g.fillText('EN UNA BODA ERES', W / 2, 200); g.letterSpacing = '0px';
    g.fillStyle = C.envSoft; g.beginPath(); g.arc(W / 2, 470, 262, 0, 7); g.fill();
    const hh = 520, ww = m.width * hh / m.height; g.shadowColor = 'rgba(27,38,80,.25)'; g.shadowBlur = 30; g.shadowOffsetY = 16;
    g.drawImage(m, W / 2 - ww / 2, 215, ww, hh); g.shadowColor = 'transparent';
    g.fillStyle = C.ink; g.font = '400 100px "Abril Fatface"';
    let y = 845; const nm = r.name; if (g.measureText(nm).width > 820) g.font = '400 80px "Abril Fatface"'; g.fillText(nm, W / 2, y);
    g.fillStyle = C.soft; g.font = '500 33px "Hanken Grotesk"'; y = wrap(g, r.line, W / 2, y + 62, 780, 44);
    g.fillStyle = C.ink; g.font = '400 30px "Courier Prime"'; wrap(g, r.quote, W / 2, y + 14, 780, 40);
    if (couple.n) { g.fillStyle = C.ink; g.font = '400 50px "Abril Fatface"'; g.fillText(couple.n, W / 2, couple.f ? 1200 : 1225, 800); }
    if (couple.f) { g.fillStyle = C.soft; g.font = '400 28px "Courier Prime"'; g.fillText(couple.f.toUpperCase(), W / 2, 1238); }
    g.save(); g.translate(850, 250); g.rotate(-0.26); g.strokeStyle = C.red; g.fillStyle = C.red; g.globalAlpha = .85;
    g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 78, 0, 7); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 66, 0, 7); g.stroke();
    g.font = '400 22px "Courier Prime"'; g.letterSpacing = '3px'; g.fillText('INVITADO', 0, 8); g.restore();
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.querySelector('.quiz-top').after(av);
  const show = (el) => { [intro, play, out].forEach((x) => { x.hidden = x !== el; }); };
  const swap = (fn) => {
    if (reduce) return fn();
    stage.classList.add('is-out');
    setTimeout(() => { fn(); stage.classList.remove('is-out'); }, 160);
  };

  function renderQ() {
    const { q, a } = QUESTIONS[i];
    prog.textContent = `${i + 1} de ${QUESTIONS.length}`;
    bar.style.width = `${(i / QUESTIONS.length) * 100}%`;
    back.hidden = i === 0;
    qEl.textContent = q;
    av.src = `assets/quiz/${AV[i % AV.length]}.webp`;
    opts.replaceChildren(...a.map(([label, t]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'quiz-opt'; b.textContent = label; b.dataset.t = t;
      if (picks[i] === t) b.setAttribute('aria-pressed', 'true');
      b.addEventListener('click', () => answer(t));
      return b;
    }));
  }

  function answer(t) {
    picks[i] = t;
    swap(() => {
      if (i < QUESTIONS.length - 1) { i++; renderQ(); qEl.focus({ preventScroll: true }); }
      else result();
    });
  }

  function result() {
    const score = {}; picks.forEach((t) => { score[t] = (score[t] || 0) + 1; });
    // desempate: gana el que se eligió primero
    const best = Math.max(...Object.values(score));
    const key = picks.find((t) => score[t] === best);
    const r = TYPES[key];
    bar.style.width = '100%';
    current = r;
    drawCard(r);
    $('.quiz-rname').textContent = r.name;
    $('.quiz-rline').textContent = r.line;
    $('.quiz-rquote').textContent = r.quote;
    out.dataset.type = key;
    track('quiz-fin-' + key);
    show(out);
    $('.quiz-rtitle').focus({ preventScroll: true });
    if (!standalone) root.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }

  const track = (k) => { try { window.guestHit && window.guestHit('free', k); } catch (e) {} };
  function start() { track('quiz-inicio'); i = 0; picks = []; renderQ(); show(play); qEl.focus({ preventScroll: true }); }

  if ($('.quiz-start')) $('.quiz-start').addEventListener('click', () => swap(start));
  $('.quiz-again').addEventListener('click', () => swap(standalone ? start : () => { show(intro); $('.quiz-start').focus({ preventScroll: true }); }));
  root.addEventListener('quiz:start', start);
  back.addEventListener('click', () => { if (i > 0) swap(() => { i--; renderQ(); qEl.focus({ preventScroll: true }); }); });

  $('.quiz-dl').addEventListener('click', () => {
    track('quiz-bajar');
    cv.toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'invitado-guest.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png');
  });
  const share = $('.quiz-share'), hint = $('.quiz-hint');
  share.addEventListener('click', async () => {
    track('quiz-compartir');
    const r = TYPES[out.dataset.type];
    const text = `Soy «${r.name}» en una boda. ¿Y tú? ${r.quote}`;
    const blob = await new Promise((ok) => cv.toBlob(ok, 'image/png'));
    const file = blob && new File([blob], 'invitado-guest.png', { type: 'image/png' });
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text }); } catch (e) {} return; }
    const url = standalone ? location.href : '';
    try {
      if (navigator.share) { await navigator.share(url ? { title: '¿Qué tipo de invitado eres?', text, url } : { title: '¿Qué tipo de invitado eres?', text }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`.trim());
      hint.textContent = 'Copiado. Pégalo donde quieras.';
    } catch (e) { if (e && e.name !== 'AbortError') hint.textContent = 'No se ha podido compartir desde aquí.'; }
  });
})();
