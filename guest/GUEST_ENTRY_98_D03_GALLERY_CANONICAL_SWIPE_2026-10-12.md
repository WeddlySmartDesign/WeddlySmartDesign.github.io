# Entrada 98 — Limoneros D03 · GALERÍA CARRUSEL OBLIGATORIA (12/10/2026)

**Rama guest-independent, TEST ONLY, no venta.**

## Origen del error

La propietaria recibió una cuadrícula de cuatro fotos de su pareja y celebración. Indica expresamente que **NO puede ser un collage**: la galería ha de ser tipo carrusel. La regla ya constaba desde antes en la matriz canónica `guest/GUEST_INVITATION_MASTER_CONFIGURATION_MATRIX_V1.md §11`: una foto sin carrusel roto y con varias fotos navegación/swipe claro; 1–4 fotos, orientación/fit/foco, todos los casos. Se reconoce **incumplimiento de lectura previa**; es responsabilidad de implementación, no de la propietaria. No volver a pedirle esta especificación.

## Solución ejecutable en la plantilla real (no otra captura estática)

- `guest/catalog-patches/design-03/1.0.0/patch.js` commit **`ca09fa18ca562c4de55e040d3537a1dc2b61b35f`**: añade `installGalleryCarousel`, llamada tras el render del cuestionario. Reutiliza SOLO las imágenes que ya genera el motor original `#gallery-items`, con sus `src`, `alt`, `data-fit`, `object-position` de cada foto, sin duplicar fotos ni texto. Si no hay fotos no hay controles; con una no hay puntos ni mensaje de deslizar; con dos a cuatro hay indicadores seleccionables y swipe nativo. Clic en punto activa desplazamiento al índice; scroll actualiza `aria-current`, con etiquetas accesibles. Sin botones con flechas.
- `guest/catalog-patches/design-03/1.0.0/patch.css` commit **`acdffccf563009f658c9c59d24399d9e2ec2e0a6`**: sustituye `display:grid` y dos columnas por **`display:flex; flex-wrap:nowrap; overflow-x:auto; scroll-snap-type:x mandatory`**, cada fotografía de ancho completo en la ventana; sin marcos, arcos ni cajas, con indicadores tenues sobre la pintura original. No se altera el fondo, vídeos, texturas ni arte del original. `fit='full'` sigue `contain` y `crop` sigue `cover`.
- El CSS/JS pertenece a **parche real de D03** usado por builder SHA-pinned (no un estilo añadido solo a la descarga). No tocar diseño congelado Botánica, ONE, Partner, STUDIO ni main.

## Pruebas efectivas

- Test Chromium automatizado `guest/tests/limoneros_visual_browser_acceptance.cjs` commits **`5357714d9401397109bf197a94368cbd75c38e69`** y **`8bd080ff9a68832e02547fe157669afbfe0ea19f`** comprueba flex + snap, ancho por foto, puntos, selección y botón de foto tres; elimina una premisa equivocada del collage: las imágenes no visibles en carrusel pueden tener carga `loading=lazy`. CI en el último commit [`38279446926`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38279446926) **SUCCESS**, catálogo `38279446843` SUCCESS, independiente `38279446868` SUCCESS.
- **QA independiente con las 5 fotos originales privadas**, Chrome real, viewports 320, 390, 430; **0, 1, 2, 3 y 4 fotos** = **15/15 escenarios PASS**, sin scroll lateral del documento, JS sin errores, todos los formatos respetados; con 1 foto ningún indicador/hint, con 2–4 existe swipe y puntos, y pulsar foto 3 mueve a tercera y marca `aria-current` correctamente. Reporte privado `/mnt/data/LIMONEROS_D03_GALERIA_CARRUSEL_QA.json` y screenshot Chrome `/mnt/data/LIMONEROS_D03_GALERIA_CARRUSEL_390_QA.png`.
- HTML privado de autora: `/mnt/data/LIMONEROS_D03_GALERIA_CARRUSEL_REAL_2026-10-12.html` (SHA256 **`603bc2fbba6171218bb5f53a6582fcd43f54ac08d65e2af028e9e74f7962ca96`**, 3,447,149 bytes), reconstruido del **stage real** `38279120981`, con las cinco fotos ya aportadas integradas solamente en la descarga privada. Medios genéricos de fondo/vídeo de la autora siguen alojados en Cloudflare. Se guarda HTML, captura y QA también en Biblioteca `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/`. **Las fotos personales no se suben a GitHub ni a Cloudflare.**
- Regla añadida a `guest/GUEST_UNIVERSAL_DESIGN_ACCEPTANCE_CONTRACT_V1.md` commit `d0803b40029a07c0239495e71fb3b26ec5f21236`: **para TODAS las plantillas** carrusel y 0–4 fotos con fit/focus correctos; NO collage salvo aprobación expresa. No abrir otra ronda de recordatorios.

## Estado siguiente

**Galería implementada y QA técnico PASS.** Pendiente criterio visual de la propietaria en Android sobre el carrusel concreto; NO marcar `ownerVisualApproved=true` ni `commercialReady=true` hasta su visto bueno y pruebas E2E auténticas. Práctico fue aprobado verbalmente por agotamiento; anotar aprobación operativa sin inferir entusiasmo estético. Agenda sigue pendiente de mayor diferenciación visual y Cierre pendiente. GUEST D03 sigue `certification-pending`, TEST ONLY.
