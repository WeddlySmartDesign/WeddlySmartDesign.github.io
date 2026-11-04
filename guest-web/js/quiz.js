/* GUEST · Quiz «¿Qué tipo de invitado eres?» — todo local, no se guarda nada. */
(() => {
  const root = document.getElementById('quiz');
  if (!root) return;

  const TYPES = {
    javi:    { name: 'El puntual', img: 'javi',    line: 'Llega el primero, con la invitación guardada y el sitio ya localizado.', quote: '«¿Empezamos ya? Son y diez…»' },
    encarna: { name: 'La organizada', img: 'encarna', line: 'Sabe qué mesa le toca, quién se sienta al lado y dónde hay pañuelos de sobra.', quote: '«Yo ya lo tengo todo apuntado.»' },
    dani:    { name: 'El alma de la fiesta', img: 'dani', line: 'Brinda con quien pase y convierte cualquier corrillo en una fiesta.', quote: '«¡Una ronda para toda la mesa!»' },
    nuria:   { name: 'La reina de la pista', img: 'nuria', line: 'Cuando suena la primera canción, ya está bailando. Y no para.', quote: '«Una más y me voy. Mentira.»' },
    paco:    { name: 'El del discurso', img: 'paco', line: 'Nadie se lo ha pedido, pero tiene unas palabras preparadas desde hace semanas.', quote: '«Si me permitís unas palabras…»' },
    lola:    { name: 'La romántica', img: 'lola', line: 'Llora en la ceremonia, abraza a todo el mundo y manda besos desde el otro lado del salón.', quote: '«¡Qué bonito todo, de verdad!»' }
  };

  const QUESTIONS = [
    { q: 'Te llega la invitación al móvil. ¿Qué haces?', a: [
      ['La abro enseguida y confirmo antes de que se me pase', 'javi'],
      ['Se la enseño al grupo ahora mismo', 'lola'],
      ['Miro quién más va y en qué mesa me pondrán', 'encarna'],
      ['Ya estoy pensando en qué me pongo para bailar', 'nuria'] ] },
    { q: 'Llegas al banquete. ¿Dónde te encuentran?', a: [
      ['En mi sitio, con la servilleta ya puesta', 'javi'],
      ['Con una copa, saludando mesa por mesa', 'dani'],
      ['Revisando que a todos les llegue lo que pidieron', 'encarna'],
      ['Ensayando mentalmente unas palabras para los novios', 'paco'] ] },
    { q: 'Suena la canción que no falla. ¿Y tú?', a: [
      ['Soy la primera en pisar la pista', 'nuria'],
      ['Arrastro a toda la mesa conmigo', 'dani'],
      ['La bailo emocionada mirando a los novios', 'lola'],
      ['Aplaudo desde mi silla, que alguien tiene que grabarlo', 'encarna'] ] },
    { q: 'Se abre el micrófono. ¿Qué pasa?', a: [
      ['Me levanto: tenía algo preparado', 'paco'],
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
  let i = 0, picks = [];
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
    const img = $('.quiz-card img');
    img.src = `assets/quiz/${r.img}.webp`; img.alt = `Ilustración de ${r.name.toLowerCase()}`;
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

  const share = $('.quiz-share'), hint = $('.quiz-hint');
  share.addEventListener('click', async () => {
    const r = TYPES[out.dataset.type];
    const text = `Soy «${r.name}» en una boda. ¿Y tú? ${r.quote}`;
    const url = location.origin + location.pathname + '#invitado';
    try {
      if (navigator.share) { await navigator.share({ title: '¿Qué tipo de invitado eres?', text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      hint.textContent = 'Copiado. Pégalo donde quieras.';
    } catch (e) { if (e && e.name !== 'AbortError') hint.textContent = 'No se ha podido compartir desde aquí.'; }
  });
})();
