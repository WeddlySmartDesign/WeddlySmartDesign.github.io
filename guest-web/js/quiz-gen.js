/* Generador de enlace y QR del quiz. Todo en el navegador: no se guarda nada. */
(() => {
  const f = document.getElementById('quiz-gen');
  if (!f || typeof qrcode === 'undefined') return;
  const out = f.querySelector('.quiz-gen-out'), cv = f.querySelector('.quiz-qr'), link = f.querySelector('.quiz-link');
  const hint = f.querySelector('.quiz-hint'); let url = '';
  const draw = (c, size) => {
    const qr = qrcode(0, 'M'); qr.addData(url); qr.make();
    const n = qr.getModuleCount(), q = 4, cell = Math.floor(size / (n + q * 2));
    const px = cell * (n + q * 2); c.width = c.height = px;
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, px, px); g.fillStyle = '#131b3b';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (qr.isDark(r, k)) g.fillRect((k + q) * cell, (r + q) * cell, cell, cell);
  };
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const names = f.n.value.trim(); const u = new URL('quiz.html', location.href);
    if (names) u.searchParams.set('n', names);
    if (f.f.value) { const d = new Date(f.f.value + 'T12:00:00'); if (!isNaN(d)) u.searchParams.set('f', d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })); }
    url = u.toString(); link.value = url; f.querySelector('.quiz-try').href = url;
    draw(cv, 600); out.hidden = false; hint.textContent = '';
  });
  f.querySelector('.quiz-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); hint.textContent = 'Enlace copiado.'; } catch (e) { link.select(); hint.textContent = 'Cópialo desde el cuadro.'; }
  });
  f.querySelector('.quiz-qrdl').addEventListener('click', () => {
    const c = document.createElement('canvas'); draw(c, 1200);
    c.toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'qr-quiz-invitados.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); });
  });
})();
