/* Invitación a medida: formulario de solicitud y, con ?p=, presupuesto y pago de la pareja. */
(() => {
  const cfg = window.GUEST_CONFIG || {};
  const API = cfg.customApi;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const euros = (c) => (c / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: c % 100 ? 2 : 0 });
  const WISHES = ['Colores', 'Tipografía', 'Ilustración de portada', 'Apertura animada', 'Fotos', 'Secciones nuevas', 'Bilingüe', 'Otra cosa'];
  const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  const params = new URLSearchParams(location.search);

  async function call(body) {
    const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) throw Object.assign(new Error(j.error || 'error'), { code: j.error });
    return j;
  }

  /* ---------- Presupuesto y pago ---------- */
  if (params.get('p')) {
    const t = params.get('p'), s = params.get('s'), wantsExtra = params.get('extra') === '1';
    $('form').hidden = true;
    const box = $('quote');
    box.hidden = false;
    $('introKicker').textContent = 'Vuestro presupuesto';
    $('introTitle').textContent = 'Vuestra invitación a medida.';
    $('introText').textContent = 'Precio cerrado, IVA incluido. Pagáis la mitad para empezar y el resto al aprobarla.';

    const steps = (q) => {
      const st = q.status, paidDeposit = !['new', 'quoted'].includes(st), paidAll = ['paid', 'delivered'].includes(st);
      return `<ol class="qsteps">
        <li class="${paidDeposit ? 'done' : ''}"><b>Señal: ${euros(q.depositCents)}</b><span>La mitad, para empezar.</span></li>
        <li class="${paidDeposit && st !== 'accepted' ? 'done' : ''}"><b>Diseñamos y lo revisáis</b><span>${q.rounds} rondas de cambios incluidas. Cada ronda extra: ${euros(q.extraCents)}.</span></li>
        <li class="${paidAll ? 'done' : ''}"><b>Resto: ${euros(q.restCents)}</b><span>Al aprobarla. Y os la entregamos con la app de invitados.</span></li>
      </ol>`;
    };
    const payBtn = (part, cents, label) => `<button class="btn btn-ink" type="button" data-pay="${part}"><span>${esc(label)} ${euros(cents)}</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>
      <p class="lock"><svg aria-hidden="true"><use href="#i-lock"/></svg>Pago seguro con Stripe</p>`;

    const render = (q, paidNow) => {
      box.classList.remove('enter'); void box.offsetWidth; box.classList.add('enter');
      let html = '';
      if (paidNow) {
        html = `<span class="pm" aria-hidden="true">Pagado</span>
          <h2>${paidNow === 'extra' ? 'Ronda extra pagada.' : paidNow === 'final' ? 'Todo pagado. Gracias.' : 'Señal recibida. Empezamos.'}</h2>
          <p>${paidNow === 'extra' ? 'Mandadnos todos los cambios juntos por email o WhatsApp y nos ponemos.' : paidNow === 'final' ? 'En breve os llega la invitación definitiva con el acceso a la app de invitados.' : 'Os escribimos con la primera propuesta' + (q.quoteDays ? ` en unos ${q.quoteDays} días.` : '.')} La factura os llega por email.</p>`
          + steps(q);
      } else if (q.status === 'new') {
        html = `<h2>Estamos preparando vuestro presupuesto.</h2><p>Os lo mandamos por email en menos de 48 h.</p>`;
      } else if (q.status === 'declined') {
        html = `<h2>Este presupuesto ya no está activo.</h2><p>Si queréis retomarlo, escribidnos y lo vemos.</p>`;
      } else {
        const extra = wantsExtra && q.canBuyExtra;
        html = `<p class="kicker">${esc(q.tierName)}</p>
          <p class="big">${euros(q.quoteCents)}<small>Precio cerrado, IVA incluido, con la app de invitados.</small></p>
          ${q.what ? `<p>${esc(q.what)}</p>` : ''}
          ${q.quoteNote ? `<div class="qnote">${esc(q.quoteNote)}</div>` : ''}
          ${steps(q)}`;
        if (extra) html += `<p>Ya hemos hecho las ${q.rounds} rondas incluidas. Una ronda más cuesta ${euros(q.extraCents)}; os aconsejamos juntar en ella todos los cambios.</p>` + payBtn('extra', q.extraCents, 'Pagar ronda extra:');
        else if (q.due) html += payBtn(q.due.part, q.due.cents, q.due.part === 'deposit' ? 'Aceptar y pagar' : 'Pagar el resto:')
          + (q.due.part === 'deposit' ? `<p style="font-size:.875rem">Al ser un diseño exclusivo, la señal cubre el trabajo desde el primer día y no se devuelve una vez empezado. <a href="guest-legal.html#medida" target="_blank" rel="noopener">Condiciones</a>.</p>` : '');
        else if (['paid', 'delivered'].includes(q.status)) html += `<p>Todo pagado. ¡Gracias!</p>`;
        else html += `<p>Estamos con vuestro diseño. Os escribimos con cada propuesta.</p>`;
      }
      box.innerHTML = html + `<div class="form-err" id="payErr" role="alert"></div>`;
      box.querySelectorAll('[data-pay]').forEach((b) => b.onclick = async () => {
        b.setAttribute('aria-busy', 'true');
        try { const j = await call({ action: 'pay', t, part: b.dataset.pay }); location.href = j.url; }
        catch (e) {
          b.removeAttribute('aria-busy');
          const err = $('payErr'); err.classList.add('on');
          err.textContent = e.code === 'nothing_to_pay' ? 'Este pago ya está hecho. Recargad la página.' : 'No hemos podido abrir el pago. Probad otra vez o escribidnos por WhatsApp al 620 843 264.';
        }
      });
    };

    (async () => {
      try {
        const j = await call(s ? { action: 'pay_status', t, s } : { action: 'quote_load', t });
        const q = j.request;
        let paidNow = null;
        if (s) {
          // Volvemos de Stripe: el estado ya refleja el pago si se ha completado.
          paidNow = wantsExtra ? 'extra' : ['accepted', 'designing'].includes(q.status) ? 'deposit' : ['paid', 'delivered'].includes(q.status) ? 'final' : null;
          history.replaceState(null, '', location.pathname + '?p=' + encodeURIComponent(t));
        }
        render(q, paidNow);
      } catch (e) {
        box.innerHTML = e.code === 'invalid_token'
          ? `<h2>Este enlace no funciona.</h2><p>Abrid el enlace directamente desde el email del presupuesto o escribidnos por WhatsApp al 620 843 264.</p>`
          : `<h2>No hemos podido cargarlo.</h2><p>Revisad la conexión y volved a intentarlo.</p><button class="btn btn-line" type="button" onclick="location.reload()">Volver a intentarlo</button>`;
      }
    })();
    return;
  }

  /* ---------- Formulario ---------- */
  const form = $('form');
  const catalog = window.GUEST_CATALOG || [];

  $('bases').innerHTML = [{ id: '', name: 'Ninguno' }, ...catalog].map((d) => `<label class="base"><input type="radio" name="base_design" value="${esc(d.id)}"${d.id ? '' : ' checked'}>
    <span class="stamp-wrap"><span class="stamp"><span class="stamp-art${d.image ? '' : ' none'}">${d.image ? `<img src="${esc(d.image)}" alt="" loading="lazy" decoding="async" width="390" height="844">` : 'Empezar de cero'}</span></span></span>
    <span>${esc(d.name)}</span></label>`).join('');
  $('wishes').innerHTML = WISHES.map((w) => `<label class="chip"><input type="checkbox" value="${esc(w)}"><span>${esc(w)}</span></label>`).join('');

  // Nivel desde la web (?nivel=adapt) o el diseño de partida (?diseno=design-07).
  const pre = params.get('nivel'); if (pre) { const r = form.querySelector(`input[name=tier][value="${CSS.escape(pre)}"]`); if (r) r.checked = true; }
  const preD = params.get('diseno'); if (preD) { const r = form.querySelector(`input[name=base_design][value="${CSS.escape(preD)}"]`); if (r) { r.checked = true; r.closest('.base').scrollIntoView({ inline: 'center', block: 'nearest' }); } }
  // Si quieren un diseño nuevo, el diseño de partida sobra.
  const syncBase = () => { $('baseSet').hidden = form.tier.value === 'new'; };
  form.querySelectorAll('input[name=tier]').forEach((r) => r.addEventListener('change', () => { syncBase(); bad('tier', false); }));
  syncBase();

  // Fotos
  let files = [];
  const drop = $('drop');
  const drawFiles = () => {
    drop.querySelectorAll('img[data-url]').forEach((i) => URL.revokeObjectURL(i.dataset.url));
    drop.innerHTML = files.map((f, i) => { const u = URL.createObjectURL(f); return `<div class="thumb"><img src="${u}" data-url="${u}" alt="${esc(f.name)}"><button type="button" data-rm="${i}" aria-label="Quitar ${esc(f.name)}"><svg aria-hidden="true"><use href="#i-x"/></svg></button></div>`; }).join('')
      + (files.length < 3 ? `<label class="add"><svg aria-hidden="true"><use href="#i-plus"/></svg>${files.length ? 'Otra foto' : 'Añadir foto'}<input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" ${files.length < 2 ? 'multiple' : ''} aria-label="Añadir fotos de inspiración"></label>` : '');
  };
  drop.addEventListener('change', (e) => {
    if (e.target.type !== 'file') return;
    let wrong = false;
    for (const f of e.target.files) { if (files.length >= 3) break; if (f.size > 10485760 || !TYPES.includes(f.type)) { wrong = true; continue; } files.push(f); }
    $('fileErr').closest('.field').classList.toggle('is-bad', wrong);
    drawFiles();
  });
  drop.addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (b) { files.splice(+b.dataset.rm, 1); drawFiles(); } });
  drawFiles();

  const bad = (f, on) => { const el = form.querySelector(`[data-f="${f}"]`); if (el) el.classList.toggle('is-bad', on); };
  form.addEventListener('input', (e) => { const f = e.target.closest('[data-f]'); if (f) f.classList.remove('is-bad'); });
  $('consent').addEventListener('change', () => bad('consent', false));

  function check() {
    const out = [];
    if (!form.tier.value) out.push('tier');
    if ($('idea').value.trim().length < 10) out.push('idea');
    if (!$('name').value.trim()) out.push('name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('email').value.trim())) out.push('email');
    if (!$('consent').checked) out.push('consent');
    return out;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('formErr'); err.classList.remove('on');
    form.querySelectorAll('.is-bad').forEach((x) => x.classList.remove('is-bad'));
    const wrong = check();
    if (wrong.length) {
      wrong.forEach((f) => bad(f, true));
      const first = form.querySelector(`[data-f="${wrong[0]}"]`);
      first?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      if (wrong[0] === 'consent') { err.textContent = 'Falta marcar la casilla de privacidad para poder contestaros.'; err.classList.add('on'); }
      return;
    }
    const fd = new FormData();
    fd.set('action', 'submit');
    fd.set('tier', form.tier.value);
    fd.set('base_design', form.tier.value === 'new' ? '' : form.base_design.value);
    fd.set('wishes', [...$('wishes').querySelectorAll('input:checked')].map((x) => x.value).join('|'));
    ['idea', 'links', 'name', 'email', 'phone'].forEach((k) => fd.set(k, $(k).value.trim()));
    fd.set('wedding_date', $('date').value);
    fd.set('urgency', form.urgency.value);
    fd.set('contact_pref', form.contact_pref.value);
    fd.set('consent', 'true');
    fd.set('website', form.website.value);
    files.forEach((f) => fd.append('files', f, f.name));
    const btn = $('submit'); btn.setAttribute('aria-busy', 'true'); btn.firstElementChild.textContent = 'Enviando…';
    try {
      const r = await fetch(API, { method: 'POST', body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) {
        if (j.fields) j.fields.forEach((f) => bad(f, true));
        throw new Error(j.error || 'error');
      }
      form.hidden = true;
      $('done').hidden = false;
      $('sheet').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e2) {
      err.textContent = e2.message === 'validation_failed' ? 'Revisad los campos marcados en rojo.' : 'No se ha podido enviar. Revisad la conexión y probad otra vez, o escribidnos por WhatsApp al 620 843 264.';
      err.classList.add('on');
    } finally {
      btn.removeAttribute('aria-busy'); btn.firstElementChild.textContent = 'Pedir presupuesto';
    }
  });
})();
