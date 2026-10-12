# Entrada 99 — Limoneros D03: carrusel fundido en la pintura y golondrinas libres

**Fecha 12/10/2026. Rama única `guest-independent`. TEST ONLY / NO SALE.**
**Fuente de verdad:** `guest/START_HERE.md`, `guest/GUEST_PROJECT_STATUS_V1.json`, `guest/GUEST_UNIVERSAL_DESIGN_ACCEPTANCE_CONTRACT_V1.md` y Entrada 98. No modificar ONE, ONE Partner, STUDIO ni los diseños congelados.

## Hallazgos de revisión Android real de la autora

La autora vio el carrusel funcional en Chrome Android y observó dos defectos visuales que habían quedado inadvertidos:
1. Las fotos de Galería eran rectángulos de borde duro sobre el fondo pintado, incoherentes con el fundido ya aprobado en Historia y Lugar.
2. «Un poco de nosotros» y «Recuerdos» aparecían superpuestos a las **dos golondrinas originales del fondo**. Ese arte se debe respetar, no esconder ni mover arbitrariamente.

La solución es **integrar Galería en el diseño completo**, no añadir un nuevo estilo desconectado o pedir a la autora que vuelva a recordar el lenguaje visual.

## Corrección aplicada al código REAL

- `guest/catalog-patches/design-03/1.0.0/patch.css`, commit `3fa3c77386639e26ceaace45ff95690f2204c23a`, bloque `D03 gallery V2`:
  - `#gallery` pasa a disposición superior deliberada, `padding-top:max(230px,27svh)`, para reservar una **zona libre a las golondrinas**; títulos ya no coinciden con las aves a 320–430 px.
  - El carrusel sigue mostrando una sola foto por diapositiva, con deslizamiento táctil `scroll-snap` y puntos discretos, sin flechas ni collage.
  - **Fotografías fundidas** mediante dos máscaras graduales independientes (bordes verticales/horizontales, `mask-composite:intersect`, alternativa `-webkit-mask-composite:source-in` para Chrome Android). Sin marco, arco, tarjeta, sombra o fondo superpuesto; conservar rostros/centro del encuadre y `fit/focus` del cuestionario.
  - La cabecera se coloca debajo del espacio reservado y la tipografía original del diseño se mantiene. Las aves/fondos/video NO se alteran. Se mantiene soporte 0–4 fotos y modos `full`/`crop`.
- `guest/tests/limoneros_visual_browser_acceptance.cjs`, commit `dbf71fd9a3cbb00ec3243970c8129b3d52c808c0`, añade aserciones calculadas en Chrome: cabecera al menos **218 px desde el inicio de la escena** y máscara de fundido en dos direcciones, con sombra nula. No solo fotografía de QA.

## Pruebas

- Preview PRIVADA real generado **desde el stage SHA-pinned de GitHub** run [`38281558045`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38281558045) SUCCESS, sin alterar los medios originales. Se insertaron en la revisión únicamente las cinco fotografías ya aportadas por la propietaria; estas fotos **NO se subieron al repositorio ni a Cloudflare**. HTML `/mnt/data/LIMONEROS_D03_GALERIA_FUNDIDA_GOLONDRINAS_LIBRES_2026-10-12.html`, SHA256 `299b7e0f6a0e9d86cf8604eb42085509b2220a5fbdc16c1851a2db1232d6bb61` (3.449.536 bytes).
- Pruebas Playwright Chromium con los medios originales incorporados solo en sesión para visualización offline, a 320, 390, 430 px y con **0/1/2/3/4 fotografías del cuestionario**: **15/15 PASS**. Aserciones: escena ausente cuando no hay galería; una foto sin indicador falso; 2–4 imágenes como carrusel de una foto por pantalla, selección real del tercer punto y scroll de la tercera imagen; máscara doble, sombra nula, kicker en zona libre (offset >=218 px), sin scroll lateral y sin excepciones JS. Evidencia `LIMONEROS_D03_GALERIA_FUNDIDA_QA.json` y captura Chrome `LIMONEROS_D03_GALERIA_FUNDIDA_390_QA.png`.
- GitHub Actions para commit CSS: `GUEST D03 Synthetic Media Mobile Layout QA` [run `38281559147`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38281559147) SUCCESS, `Catalog and Continuity` `38281558123` SUCCESS, `GUEST Independent QA` `38281558098` SUCCESS, comprobación de publicación real HTTPS `38281558042` SUCCESS. En el commit de regresión de máscaras/cabecera: Browser run `38281848277` SUCCESS y Catálogo `38281848285` SUCCESS. Una prueba Chrome local y CI no equivalen a aprobación visual física de la propietaria.
- Los tres artefactos (HTML privado, screenshot 390, JSON QA) están guardados en Biblioteca `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/`.

## Punto exacto al retomar

**Galería corregida técnicamente, aceptación artística pendiente del nuevo HTML**. Esperar aprobación visual de cabecera/golondrinas/fundido de la autora antes de ir al Cierre. Práctico recibió aprobación operativa de la autora, pero no entusiasma; no reabrirlo sin que ella lo pida. Agenda fue calificada de demasiado básica y queda pendiente de aceptación estética, aunque su animación de entrada secuencial funciona. GUEST D03 sigue `certification-pending`, `commercialReady=false`, `ownerVisualApproved=false`, E2E de compra y Android físico comercial pendiente.

**Regla general de trabajo (todos los diseños):** comprobar antes de enseñar cada pantalla que su tipografía, integración de fotografías, ubicación de elementos decorativos y continuidad entre escenas responden al lenguaje visual aprobado de ESA colección; no evaluar cada módulo aisladamente ni pedir al usuario recordar un contrato ya escrito. Galerías siguen siendo carruseles conforme norma universal salvo autorización expresa.
