// Reel + story «¡Última hora!» (material gratis). Uso: node campana/build-reel-ultima-hora.js
// Requiere: playwright (chromium) y ffmpeg. Sirve el repo en :8124, pinta cada fotograma 1080x1920 y los une.
const { chromium } = require('playwright'); const { spawnSync, spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const root = path.resolve(__dirname, '..'), out = path.join(__dirname, 'gratis'), tmp = fs.mkdtempSync('/tmp/uhreel-');
const FPS = 30;
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', '8124'], { cwd: root, stdio: 'ignore' }); await new Promise(r => setTimeout(r, 1200));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('http://localhost:8124/campana/gratis/ultima-hora-reel.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const dur = await p.evaluate(() => window.DUR), n = Math.round(dur * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => { render(t); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }, i / FPS);
    await p.evaluate(() => Promise.all([...document.images].map(im => im.decode ? im.decode().catch(() => 0) : 0)));
    await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(4, '0')}.png`) });
  }
  // story estática: fotograma con titular, portada y sello
  await p.evaluate(() => render(1.7)); await p.waitForTimeout(100);
  await p.screenshot({ path: path.join(out, 'story-ultima-hora.jpg'), type: 'jpeg', quality: 92 });
  await b.close(); srv.kill();
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', path.join(out, 'reel-gratis-3-ultima-hora.mp4')]);
  console.log(r.status === 0 ? 'ok' : r.stderr.toString()); fs.rmSync(tmp, { recursive: true });
})();
