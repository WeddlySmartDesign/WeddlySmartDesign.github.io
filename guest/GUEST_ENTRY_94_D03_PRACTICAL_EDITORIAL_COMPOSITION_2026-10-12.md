# Entrada 94 — Limoneros D03 · Práctico deja de ser una lista

**Fecha:** 12/10/2026. **Rama:** `guest-independent`. **Estado:** Práctico rediseñado y probado técnicamente, **a la espera de la revisión artística de la propietaria**. TEST ONLY / NO SALE, `commercialReady=false`.

## Petición exacta de la autora

Tras ver Agenda, la propietaria indicó «Me parece ultra básico, pero vamos a ir a práctico porque no avanzamos si no. Práctico no puede ser solo texto tipo listado». Agenda **NO está aprobada**; no confundir avanzar a otro bloque con aceptar el anterior.

## Cambio REAL en la plantilla, sin reconstruir master

- `guest/catalog-patches/design-03/1.0.0/patch.css`, commits `f324f430220669988fe8dcceeae98fe9dfe9de47` y `40d2ee940fd1b5e478e35ccf798fbe3abe70026a`: composición **editorial alternada** sobre la pintura original, con módulos en ambos lados del papel, títulos caligráficos Pinyon original, tipografía serif legible, suaves veladuras elípticas de fondo y separadores breves. **Sin tarjetas, marcos, rectángulos, flechas ni rombos**. Mantiene la zona de golondrinas libre: padding superior `max(220px,28svh)`. Cada enlace es accionable con objetivo real del cuestionario y área mínima 44px. `details/summary` para datos de hotel/regalos conserva interacción, teclado y datos privados tras expansión. El modo sin galería conserva protección de contraste al final del degradado oscuro.
- `guest/catalog-patches/design-03/1.0.0/patch.js`, commits `bc2b5b5d44fa328e326ee04962b0d6632ab72143` y `183055be8ac7c8c8d93194a56c8c8a417c85dbeb`: sigue consumiendo **exclusivamente `config.practical.bus/accommodation/gift/playlist`**. Se añaden clases semánticas estables `d03-bus`/`d03-accommodation`/`d03-gift`/`d03-playlist` para composición, **sin campos nuevos del cuestionario**. Los tiempos reales de transporte `Ida` y `Vuelta` aparecen juntos sin perder paradas ni nota; el nombre real del hotel recibe jerarquía visual. No inventar enlaces si falta `mapsUrl`, `websiteUrl`, `externalBookingUrl`, `externalUrl`, `url`. Modo hotel `room_block` NO crea `Reservar`; `external_booking` sí, siempre que URL válida. Observer entra una sola vez al mostrar cada módulo, sin flotación ni bucles; `prefers-reduced-motion` respetado.
- El HTML fuente maestro de D03 (SHA256 `a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482`), fondos 01–04 y ambos vídeos originales no se modifican. Tampoco otros diseños o productos.

## QA y pruebas reales

- **Matriz de opciones del cuestionario:** test `guest/tests/limoneros_questionnaire_runtime_mapping.test.cjs` (commit `27e804aee52de2b24d09380602d92fba8f648eb6`) comprueba 0, 1, 2, 3 y 4 prácticos, datos de transporte y hotel, modo habitación/reserva, datos de regalo bajo desplegable, música, URL inválida/ausente, y ausencia sin hueco ni datos inventados.
- Prueba de navegador reforzada `guest/tests/limoneros_visual_browser_acceptance.cjs` commit `7831e69158fb5e8aa4d6925138eb593f43b9c4b3` (corregida aserción tipográfica en `716bf9bc7535606c00faabba54f191ae422f87fa`), verifica Pinyon original, columnas desfasadas, sin fondos rectangulares ni desbordes, links 44 px en entornos reales.
- **GitHub Actions para versión final**: independiente [`38268790036`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38268790036) **SUCCESS**; catalog [`38268789904`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38268789904) **SUCCESS**; 9 casos sintéticos de diseño móvil [`38268789992`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38268789992) **SUCCESS**; stage NO LIVE [`38268790061`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38268790061) **SUCCESS**; lectura HTTPS pública [`38268790128`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38268790128) **SUCCESS** (HTML y recursos originales sin cambios, TEST ONLY).
- **QA real en Chromium con las cinco fotos suministradas** sobre HTML privado extraído del stage, resoluciones **320/390/430px**, 4/4 módulos, 2 sedes, galería 4 fotos, 5 momentos. **3/3 PASS**, 0 excepciones JS, **scrollWidth == viewportWidth** en los tres casos; layout documentado por captura y JSON. Anchura escena 320/390/430: 320/390/430; alto del bloque práctico ~1503/1482/1501 px, sin recortar contenidos. Render `Pinyon` auténtico, links con destinos. El alto requiere desplazarse, como debe ocurrir con cuatro apartados completos y todos los campos; **no inventar elementos para llenar ni sacrificar información para encajar todo en 1 pantalla**.

## Archivos privados reales persistidos fuera del chat

Biblioteca `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/`:

- `LIMONEROS_D03_PRACTICO_EDITORIAL_2026-10-12.html`: descarga independiente con tus **cinco fotos reales** embebidas como datos del cuestionario (no publicadas en Cloudflare). Fuente: **stage real y nuevo parche**; vídeos y fondos siguen referidos a los medios originales en la web TEST. SHA256 `98d5648b868a3808d0ec0a64fe50d28893e564437516291d7846d010878cd86f`, 3.432.960 bytes. Conversación: `/mnt/data/LIMONEROS_D03_PRACTICO_EDITORIAL_2026-10-12.html`.
- `LIMONEROS_D03_PRACTICO_EDITORIAL_390_QA_2026-10-12.png`: captura Chromium real de Práctico completo (no render inventado).
- `LIMONEROS_D03_PRACTICO_EDITORIAL_MOBILE_QA_2026-10-12.json`: mediciones móviles de la última versión V11.

## Siguiente paso

Solo pedir a la propietaria que vea **Práctico** y señale ajustes visuales concretos; **no** declarar terminada/aceptada la pantalla por el éxito de CI. Agenda sigue pendiente por falta de efecto wow, y Galería/Cierre pendientes según Entrada 88. Flujo de venta y Android físico no certificados. Los textos y enlaces de la revisión están marcados conceptualmente como **datos ficticios TEST**; jamás vender, publicar las fotos reales en la demo abierta ni convertir valores del ejemplo en valores reales del producto. Como siempre, **todos los futuros diseños siguen sujetos al contrato universal**, no crear excepción D03.
