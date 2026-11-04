/* GUEST · Quiz «¿Qué tipo de invitado eres?» — todo local, no se guarda nada. */
(() => {
  const root = document.getElementById('quiz');
  if (!root) return;

  const TYPES = {
    javi:    { name: 'El puntual', img: 'javi',    line: 'Llega el primero, con la invitación guardada y el sitio ya localizado.', quote: '«¿Empezamos ya? Son y diez…»' },
    marta:   { name: 'La organizada', img: 'marta', line: 'Lo tiene todo apuntado: qué mesa le toca, quién va al lado y dónde está el cargador.', quote: '«Tranquilos, yo ya lo tengo.»' },
    dani:    { name: 'El alma de la fiesta', img: 'dani', line: 'Brinda con quien pase y convierte cualquier corrillo en una fiesta.', quote: '«¡Una ronda para toda la mesa!»' },
    nuria:   { name: 'La reina de la pista', img: 'nuria', line: 'Cuando suena la primera canción, ya está bailando. Y no para.', quote: '«Una más y me voy. Mentira.»' },
    hugo:    { name: 'El del discurso', img: 'hugo', line: 'Nadie se lo ha pedido, pero lleva unas palabras preparadas desde hace semanas.', quote: '«Si me permitís unas palabras…»' },
    lola:    { name: 'La romántica', img: 'lola', line: 'Llora en la ceremonia, abraza a todo el mundo y manda besos desde el otro lado del salón.', quote: '«¡Qué bonito todo, de verdad!»' }
  };

  const QUESTIONS = [
    { q: 'Te llega la invitación al móvil. ¿Qué haces?', a: [
      ['La abro enseguida y confirmo antes de que se me pase', 'javi'],
      ['Se la enseño al grupo ahora mismo', 'lola'],
      ['Miro quién más va y en qué mesa me pondrán', 'marta'],
      ['Ya estoy pensando en qué me pongo para bailar', 'nuria'] ] },
    { q: 'Llegas al banquete. ¿Dónde te encuentran?', a: [
      ['En mi sitio, con la servilleta ya puesta', 'javi'],
      ['Con una copa, saludando mesa por mesa', 'dani'],
      ['Revisando que a todos les llegue lo que pidieron', 'marta'],
      ['Ensayando mentalmente unas palabras para los novios', 'hugo'] ] },
    { q: 'Suena la canción que no falla. ¿Y tú?', a: [
      ['Soy la primera en pisar la pista', 'nuria'],
      ['Arrastro a toda la mesa conmigo', 'dani'],
      ['La bailo emocionada mirando a los novios', 'lola'],
      ['Aplaudo desde mi silla, que alguien tiene que grabarlo', 'marta'] ] },
    { q: 'Se abre el micrófono. ¿Qué pasa?', a: [
      ['Me levanto: tenía algo preparado', 'hugo'],
      ['Grito «¡que vivan los novios!» desde mi mesa', 'dani'],
      ['Se me saltan las lágrimas antes de que hablen', 'lola'],
      ['Compruebo la hora: el postre no puede esperar', 'javi'] ] },
    { q: 'Ya es de madrugada. ¿Cómo te despides?', a: [
      ['Soy de las últimas: la pista no se cierra sola', 'nuria'],
      ['Hasta que no abrazo a los novios, no me voy', 'lola'],
      ['Me despido de todos… y repito la ronda', 'dani'],
      ['Me voy a la hora prevista, con el taxi ya pedido', 'javi'] ] }
  ];

  const $ = (s) => root.querySelector(s);
  const stage = $('.quiz-stage'), intro = $('.quiz-intro'), play = $('.quiz-play'), out = $('.quiz-result');
  const qEl = $('.quiz-q'), opts = $('.quiz-opts'), prog = $('.quiz-prog'), bar = $('.quiz-bar i'), back = $('.quiz-back');
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
    const [m] = await Promise.all([loadImg(r.img), document.fonts ? Promise.all(['96px "Abril Fatface"', '600 36px "Hanken Grotesk"', '34px "Courier Prime"', '700 46px Caveat'].map((f) => document.fonts.load(f))) : 0]);
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
    g.fillStyle = C.envSoft; g.beginPath(); g.arc(W / 2, 500, 280, 0, 7); g.fill();
    const hh = 560, ww = m.width * hh / m.height; g.shadowColor = 'rgba(27,38,80,.25)'; g.shadowBlur = 30; g.shadowOffsetY = 16;
    g.drawImage(m, W / 2 - ww / 2, 230, ww, hh); g.shadowColor = 'transparent';
    g.fillStyle = C.ink; g.font = '400 100px "Abril Fatface"';
    let y = 925; const nm = r.name; if (g.measureText(nm).width > 820) g.font = '400 80px "Abril Fatface"'; g.fillText(nm, W / 2, y);
    g.fillStyle = C.soft; g.font = '500 36px "Hanken Grotesk"'; y = wrap(g, r.line, W / 2, y + 70, 760, 50);
    g.fillStyle = C.ink; g.font = '400 34px "Courier Prime"'; wrap(g, r.quote, W / 2, y + 22, 780, 46);
    g.fillStyle = C.ink; g.font = '400 40px "Abril Fatface"'; g.fillText('GUEST', W / 2 - 120, 1228);
    g.font = '700 46px Caveat'; g.textAlign = 'left'; g.fillText('by WeddlySmartDesign', W / 2 - 52, 1228); g.textAlign = 'center';
    g.save(); g.translate(850, 250); g.rotate(-0.26); g.strokeStyle = C.red; g.fillStyle = C.red; g.globalAlpha = .85;
    g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 78, 0, 7); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 66, 0, 7); g.stroke();
    g.font = '400 22px "Courier Prime"'; g.letterSpacing = '3px'; g.fillText('INVITADO', 0, 8); g.restore();
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    show(out);
    $('.quiz-rtitle').focus({ preventScroll: true });
    root.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }

  function start() { i = 0; picks = []; renderQ(); show(play); qEl.focus({ preventScroll: true }); }

  $('.quiz-start').addEventListener('click', () => swap(start));
  $('.quiz-again').addEventListener('click', () => swap(() => { show(intro); $('.quiz-start').focus({ preventScroll: true }); }));
  back.addEventListener('click', () => { if (i > 0) swap(() => { i--; renderQ(); qEl.focus({ preventScroll: true }); }); });

  $('.quiz-dl').addEventListener('click', () => {
    cv.toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'invitado-guest.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png');
  });
  const share = $('.quiz-share'), hint = $('.quiz-hint');
  share.addEventListener('click', async () => {
    const r = TYPES[out.dataset.type];
    const text = `Soy «${r.name}» en una boda. ¿Y tú? ${r.quote}`;
    const blob = await new Promise((ok) => cv.toBlob(ok, 'image/png'));
    const file = blob && new File([blob], 'invitado-guest.png', { type: 'image/png' });
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text }); } catch (e) {} return; }
    const url = location.origin + location.pathname + '#invitado';
    try {
      if (navigator.share) { await navigator.share({ title: '¿Qué tipo de invitado eres?', text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      hint.textContent = 'Copiado. Pégalo donde quieras.';
    } catch (e) { if (e && e.name !== 'AbortError') hint.textContent = 'No se ha podido compartir desde aquí.'; }
  });
})();
