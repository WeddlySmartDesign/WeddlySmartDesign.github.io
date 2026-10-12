# Entrada 86 — D03 Limoneros: Historia, Lugares, Agenda, Práctico corregidos y comprobados

Fecha 12/10/2026. Rama `guest-independent`. Continuidad desde Entrada 85 y contrato universal `GUEST_UNIVERSAL_DESIGN_ACCEPTANCE_CONTRACT_V1.md`.

## Implementación en el DISEÑO REAL (no solo capturas)

- **Historia:** CSS `guest/catalog-patches/design-03/1.0.0/patch.css`: fuente **Pinyon + Garamond + GaramondSC embebidas en el original**, cuerpo editorial legible y composición con foto de pareja. El `#story-photo` ya formaba parte del HTML original, pero el demo sin datos del cuestionario no lo activaba. `patch.js` impide tomar la foto de portada como sustituto inventado de una foto ausente del campo `story.photo`. Válido para `story.textMode=preset/custom/none`, con `none` en modo solo foto, sin texto añadido.
- **Lugares:** el esquema `GUEST_INVITATION_CONFIG_SCHEMA_V1.json` confirma que `$defs.location.websiteUrl` y `mapsUrl` existen **por cada sede** (ceremonia/celebración), y `locations.heroPhoto` es opcional. `patch.js` monta la fotografía de lugar **solo si viene en la configuración**, respetando `fit`, `focusX`, `focusY`; se elimina cuando falta. `patch.css` distingue los enlaces con subrayado continuo y flecha discreta, foco de teclado y jerarquía del contenido. Se han verificado cuatro enlaces independientes en 2 lugares (mapa+web por sede).
- **Agenda:** de una lista estática pegada arriba a un recorrido vertical editorial de 1–5 momentos, con línea fina, marcadores discretos, horas tabulares, distribución centrada y aparición gradual al entrar en pantalla mediante IntersectionObserver. Accesible sin animación si el dispositivo declara reducción de movimiento; no inventa momentos ni textos.
- **Práctico:** tipografía Garamond/GaramondSC real del diseño, contraste reforzado, separación de bloques, enlaces visibles y el detalle de reserva/regalos desplegable. Sigue usando campos canónicos del cuestionario, sin URL si está ausente. Corregido el modo de alojamiento: `Reservar` corresponde a `external_booking`, no automáticamente a `room_block`. Transporte (paradas, horas, nota, mapa), hotel (web, mapa, reservar cuando corresponda, datos), regalo y playlist soportados desde esquema.
- Cambios CSS/JS **exclusivos D03**, preservando el SHA del máster `a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482`, 2 vídeos y 13 fondos originales y productos congelados.
- Commits ejecutables principales `507f4f04313d956de488bbc7a1dceec0cbb3313f` (CSS), `d1852f55237498fdce55ee1eea18df41794b08b0` (JS), `2f1dfdce475db72704dde7751ec5bdaa688d3391` (regresión de modos de alojamiento).

## Evidencia de publicación

- Cloudflare TEST URL: https://guest-weddlysmartdesign.pages.dev/guest/catalog-assets/design-03/1.0.0/index.html
- Real HTTPS: [run 38244927198](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38244927198) **SUCCESS**: parche CSS y JS V3 exactos, HTML byte exacto, HTTP 200 y 15/15 archivos originales SHA exactos. Informe `guest/qa-reports/limoneros_cloudflare_live_check.json` timestamp `2026-10-12T11:47:36Z`, 1.041.922 bytes, JS SHA `db5f6fdc76c6bc90bc6f0dd6ca6ceb7b2b1bb2b8c5c69efdb4f9e940a3fa7efc`, CSS SHA `b3d14eb7729bd2c5ed1046c8fd12b28f41e6313466dee1baad972b3e130d4bdc`.
- CI de continuidad y catálogo en [run 38245079719](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38245079719) **SUCCESS**, QA independiente [run 38245079608](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38245079608) **SUCCESS**, después de corregir el test esperado de `room_block` según la matriz canónica.
- Package real extraído de GitHub Actions [run 38244927437](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38244927437): staging precomercial **NO SALE**.

## Prueba visual de navegador CON LAS FOTOS FACILITADAS POR LA AUTORA

Playwright + Chromium sobre el HTML y media **reales** del artefacto de GitHub. Fotografías originales compartidas por la autora insertadas **solo como datos de fixture local** en `story.photo`, `locations.heroPhoto`, `gallery.photos`; no han sido incrustadas en el máster, ni publicadas como fotos de clientes.

- Resoluciones móviles **320, 390 y 430** CSS px.
- **15/15 casos PASS**: MAX+FOTOS (1 foto historia + foto celebración + galería hasta 4 fotos, dos sedes con mapa y web propios, cinco momentos y cuatro prácticos con URLs), REDUCIDO (sin foto, 1 sede, 1 momento, 0 prácticos), SOLO FOTO de historia + 3 momentos + 2 prácticos, PRESET TEXTO + 4 momentos + 3 prácticos y SIN HISTORIA/AGENDA/PRÁCTICO. Sin excepción JavaScript, secciones presentes/ocultas según configuración, sin scroll horizontal y sin cortes de contenido de escena.
- **Evidencias persistentes en Biblioteca** (carpeta `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/`): `LIMONEROS_D03_MATRIX_QA_15_SCENARIOS_2026-10-12.json`, `LIMONEROS_D03_HISTORIA_CON_FOTO_QA_390_2026-10-12.png`, `LIMONEROS_D03_LUGARES_CON_FOTO_QA_390_2026-10-12.png`, `LIMONEROS_D03_AGENDA_5_MOMENTOS_QA_390_2026-10-12.png`, `LIMONEROS_D03_PRACTICO_4_MODULOS_QA_390_2026-10-12.png`.

**Importante:** La página pública genérica sin pedido conserva su demo con fotos OFF; las fotografías del fixture se ven en las capturas reales de QA de Biblioteca. No publicar fotografías privadas automáticamente en una invitación genérica compartida. Al instanciar un pedido auténtico el cuestionario suministra las fotos firmadas.

## Pendientes que NO se deben ocultar

- Aprobación artística de la autora de **cada una de las cuatro escenas** en la variante preferida, y revisión de cualquier nueva captura enviada.
- Certificación **2 pedidos TEST reales autenticados**, paridad revisión/final/RSVP/links y Android físico del Centro GUEST, no sustituibles por las 15 pruebas locales.
- La autorización comercial sigue bloqueada: `certification-pending`, TEST-only, NO SALE; Stripe no modificado.

**Punto de continuidad exacto:** Las cuatro correcciones están **aplicadas y publicadas**, las escenas completas y ausentes fueron ensayadas con las fotos entregadas; NO volver a pedir fotos, NO reconstruir original, NO repetir documentación canónica. Mostrar la versión de revisión y recibir únicamente criterio artístico o avanzar a la pantalla restante. 
