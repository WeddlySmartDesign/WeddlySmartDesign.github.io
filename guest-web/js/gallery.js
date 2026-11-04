/* Galería horizontal del material gratis: flechas en escritorio, teclado nativo (foco en la lista) */
(() => {
  const g = document.getElementById('gallery'); if (!g) return;
  const btns = document.querySelectorAll('.gnav');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = () => { const c = g.querySelector('.gcard'); return c ? c.getBoundingClientRect().width + 16 : 320; };
  const sync = () => { const max = g.scrollWidth - g.clientWidth - 2; btns.forEach((b) => { b.disabled = b.dataset.dir === '-1' ? g.scrollLeft <= 2 : g.scrollLeft >= max; }); };
  btns.forEach((b) => b.addEventListener('click', () => g.scrollBy({ left: step() * Number(b.dataset.dir), behavior: reduce ? 'auto' : 'smooth' })));
  g.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  g.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); g.scrollBy({ left: step() * (e.key === 'ArrowRight' ? 1 : -1), behavior: reduce ? 'auto' : 'smooth' }); } });
  addEventListener('resize', sync); sync();
})();
