# GUEST · Vista previa móvil de web comercial V5 — publicación PREVIEW (21/10/2026)

## Petición de la titular
«Si es mobile first necesito poder ver la web en el móvil».

Una descarga ZIP local no es una URL móvil pública. Se requiere una publicación PREVIEW real independiente, sin reemplazar producción.

## Paquete preparado y verificado
- Artefacto descargable de la conversación: `GUEST_V5_PUBLICAR_PREVIEW_MOVIL_CLOUDFLARE.zip`.
- SHA256: `220932b4014c4e5c66e6cb5b492e3798b8e11e258c47f93d3ad1282650b0ccfa`.
- Tamaño: 214346750 bytes; ZIP CRC íntegro PASS, 129 entradas.
- Incluye `PUBLICAR_VISTA_PREVIA.cmd`, `LEEME_PRIMERO.txt`, y subcarpeta `site/` con la web V5 y 15 invitaciones completas.
- La carpeta pública no incluye documentos internos de QA, ni secret, ni scripts de despliegue.
- Máximo tamaño por fichero del sitio: 24068780 bytes, inferior al máximo oficial Cloudflare Pages de 25 MiB.
- Cabeceras `_headers`: noindex/nofollow/noarchive, no-store y CSP anti-envío de formularios y conexiones backend, sin workers.
- Fuente: `GUEST_WEB_V5_MOBILE_FIRST_REVISION_2026-10-21.zip`, sin alterar masters originales.

## Destino previsto, SOLO PREVIEW
- Cloudflare Pages proyecto exacto: `guest-weddlysmartdesign`.
- Rama específica: `guest-v5-mobile-review-2026-10-21`.
- Comando encapsulado en el .cmd: `npx --yes wrangler@4 pages deploy "site" --project-name guest-weddlysmartdesign --branch guest-v5-mobile-review-2026-10-21`.
- La propietaria debe extraer ZIP en el PC que ya tiene Node/Wrangler y abrir `PUBLICAR_VISTA_PREVIA.cmd`; autenticarse solamente en Cloudflare oficial si se solicita. Nunca compartir credenciales por chat.
- La consola imprimirá una URL **inmutable exacta** `https://<hash>.guest-weddlysmartdesign.pages.dev`. No adivinar el hash, ni usar el alias de rama hasta verificarlo (alias anterior devolvió «Nothing is here yet»).
- Abrir esa URL en Chrome Android; remitir URL real al agente para QA HTTP, contenido y experiencia móvil.

## Estado honesto
- El paquete **está listo pero NO publicado**: no hay sesión Cloudflare conectada a estas herramientas y Vercel no tiene ningún team disponible; Railway conectado pertenece a WeddlySmartDesign pero una publicación nueva podría implicar coste, por lo que NO se ha iniciado.
- La rama especial no coincide con rama de producción `guest-independent`; ningún pago, checkout, correo ni Supabase/Stripe LIVE afectados.
- La URL de PREVIEW será pública para quien la conozca aunque noindex; solo usar datos de muestra.
- Importante: `connect-src none` bloquea operaciones de red y `form-action none` bloquea formularios; si una muestra depende de APIs externas puede no funcionar en su totalidad. El objetivo es revisión visual, NO E2E comercial.
- No se tocaron ONE, ONE Partner, STUDIO, fuente comercial GUEST ni masters.
