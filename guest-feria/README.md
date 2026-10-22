# GUEST · Feria (expositor sin conexión)

Catálogo táctil para tablets y móviles en ferias de bodas. No toca ningún otro archivo del repositorio.

- `index.html`, `kiosk.css`, `kiosk.js`: escaparate en bucle → diseños (portadas o cierres) → invitación entera desde la portada, o su cierre → la app → precio con QR de WhatsApp. Sin tocar nada 75 s (120 s dentro de una invitación), vuelve solo al escaparate.
- `sw.js` + `precache.json`: al abrirlo una vez con internet, guarda todo (unos 270 MB) en el dispositivo y después funciona sin conexión. Mantener pulsado el logo 2 s abre el panel de estado.
- `videos/`: los dos vídeos en bucle sueltos (horizontal 1920×1080 y vertical 1080×1920), para reproducir con VLC en bucle en cualquier pantalla.
- Si se cambia algún archivo, subir `CACHE` en `sw.js` y en `kiosk.js` (ahora guest-feria-v2; la siguiente, v3) y regenerar `precache.json`.
- Necesita servirse por HTTPS (Vercel, Cloudflare Pages o GitHub Pages) para poder instalarse y guardarse sin conexión.
