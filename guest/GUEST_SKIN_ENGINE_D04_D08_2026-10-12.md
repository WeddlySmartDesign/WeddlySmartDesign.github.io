# GUEST — Motor común de secciones («skin engine») y diseños D04–D08

**Fecha:** 12/10/2026. **Rama de trabajo:** `claude/guest-skins-d04-d08`, unida a `guest-independent`. **Estado de todos:** `certification-pending`, TEST-only, **NO SALE**.

## Por qué existe

Cada diseño se estaba integrando como un HTML propio y luego se corregía sección por sección con parches (D03: más de 60 KB de CSS/JS). Así, cada ajuste costaba horas y había que repetirlo en el diseño siguiente. Las secciones son **iguales en todos los diseños**. Lo único que cambia es la «piel»: vídeo de portada, vídeo de cierre, fondos de 4 y 5 pantallas, colores y posición de los textos sobre los vídeos.

## Cómo funciona

| Pieza | Ruta | Qué contiene |
| --- | --- | --- |
| Motor común | `guest/templates/_skin-engine/engine.html` | Portada (espera el toque y revela nombres/fecha/lugar/cuenta atrás), Historia, Lugares, Agenda, Práctico, Galería y Cierre con RSVP. Implementa `window.GUEST_APPLY_CONFIG(config)` con el esquema `guest-invitation-config-v1` y todas las normas universales ya decididas en D03: carrusel de galería (nunca collage), «Pedir canción» solo en `guest_request` con URL, «Ver playlist» en `external_link`, web y mapa de **cada** sede, «Información adicional» y «Ver datos» desplegables, horarios Ida/Vuelta, textos predefinidos de historia idénticos al backend, fotos fundidas en el fondo sin marcos, `fit/focus`, ocultación sin huecos, agenda escalonada y `prefers-reduced-motion`. |
| Tipografías | `guest/templates/_skin-engine/fonts/` | Pinyon Script, EB Garamond y EB Garamond SC (OFL), las mismas de D03. |
| Piel de cada diseño | `guest/templates/<id>/skin.json` | Colores, posición de textos y velo sobre los vídeos, segundo en que aparecen los textos y lista de medios. |
| Generador | `guest/tools/build_skin_master.cjs` | Une motor + piel + medios originales en un `master.html` autocontenido y escribe su `visual-plugin.json`. |

**Asignación de fondos:** con 5 escenas visibles se usan los fondos de 5 pantallas en orden. Con 4 o menos, los de 4 pantallas: la primera escena siempre continúa la portada y la última enlaza con el cierre. La última escena reserva espacio inferior para no poner texto sobre la franja de transición.

## Movimiento premium (revisión v2, tras vídeos Android de la autora)

La autora vio la parte central sosa, sin fotos ni galería, y sin los botones de los campos. Corregido en el **motor**, válido para los cinco:
- **Vista de revisión completa por defecto:** sin `?qa`, la página muestra el escenario máximo con **fotos de ejemplo** (historia, foto del lugar y galería de 4), dos sedes con «Cómo llegar» y «Web», cinco momentos y los cuatro prácticos con «Ver hotel», «Reservar», «Ver datos» y «Pedir canción». En un pedido real se ignora (`__GUEST_SUPPRESS_DEMO__`) y solo se pinta lo que llega del cuestionario.
- **Titulares:** el antetítulo se abre en espaciado, el título caligráfico se «escribe» de izquierda a derecha y se dibuja un filete ornamental.
- **Contenido:** párrafos, sedes, fotos y galería entran escalonados; las fotos aparecen desde un leve desenfoque y zoom; la agenda conserva su entrada momento a momento.
- **Sello de la piel:** el adorno de cada diseño (azulejo de palomas, sol de Gala, mariposa, pétalo, arco de la caja) abre la primera escena con su propio movimiento.
- **Ambiente de la piel**, solo sobre las escenas interiores: palomas que cruzan aleteando (Azulejo), polvo dorado (Gala), mariposas (Invernadero), pétalos cayendo (Reflejo) y motas de luz ascendiendo (Caja de música). Se desactiva con `prefers-reduced-motion` y sobre los vídeos.
- El vídeo de cierre se precarga al acercarse para que no aparezca en negro.

Configurable en `skin.json`: `motif`, `motifIdle` (`rotate|float|flap|glow`) y `fx` (`doves|dust|butterflies|petals|rise`).
Si un diseño ya registrado sigue `certification-pending`, se regenera con `--sync-catalog`, que actualiza su copia de catálogo y su SHA.

## Identidad propia por diseño (revisión v3)

Mismos módulos y mismos datos del cuestionario, pero cada piel tiene su **sistema editorial** (`templates/_skin-engine/skins.css`, activado con `layout` en `skin.json`, tipografías libres incrustadas con `fonts`):

| Diseño | Tipografías | Tarjetas (sedes y detalles) | Agenda que avanza con el desplazamiento |
| --- | --- | --- | --- |
| Azulejo | TeX Gyre Chorus + Lora | azulejo con doble filete cobalto, esquinas de rombo e icono en medallón | línea punteada cobalto que se llena; rombos que se pintan |
| Gala | Pinyon dorado + TeX Gyre Adventor + GFS Baskerville | laca negra con marco déco dorado de esquinas cortadas | eje central dorado, hora y momento a cada lado, rombos que brillan |
| Invernadero | TeX Gyre Pagella cursiva + Poppins Light | paneles de cristal esmerilado; sedes con forma de ventana en arco | tallo verde que crece y hojas que brotan en cada momento |
| Reflejo | Lora cursiva con reflejo animado en el agua | láminas con veladura y onda alrededor del icono | puntos que emiten ondas al encenderse |
| Caja de música | Pinyon latón + TeX Gyre Bonum | placas de latón con tornillos y botones de latón | pentagrama con notas que se iluminan y laten |

Las escenas interiores ya no ocupan una pantalla completa cada una (solo la primera y la última), así que desaparecen los huecos entre Lugar, Agenda y Detalles. Las palomas de Azulejo pasan de vez en cuando y aletean más despacio.

## Diseños registrados

| ID | Nombre | Portada | Cierre |
| --- | --- | --- | --- |
| design-04 | AZULEJO | pared de azulejos que se abre a la terraza | velero + «Os esperamos» integrado en el vídeo |
| design-05 | GALA | puertas lacadas que se abren al salón y al vals | jardín nocturno con fuegos y «Os esperamos» |
| design-06 | INVERNADERO | cristal empañado que se aclara | invernadero al atardecer con «Os esperamos» |
| design-07 | REFLEJO | reflejo en el agua que se da la vuelta | villa de noche con farolillos y «Os esperamos» |
| design-08 | CAJA DE MÚSICA | caja que se abre y eleva el escenario | la caja se cierra con «Os esperamos» |

Medios: entregas originales de cada diseño (`videos/portada.mp4`, `videos/cierre.mp4`, `fondos-4-pantallas`, `fondos-5-pantallas`), sin recomprimir. SHA de cada máster en `GUEST_PROJECT_STATUS_V1.json` y en `qa-reports/skin_engine_matrix_2026-10-12.json`.

## Añadir el diseño siguiente (D09…D1000)

1. Recibir **solo** los medios del diseño: vídeo de portada, vídeo de cierre y fondos de 4 y 5 pantallas. Sin nombres ni fechas impresos en ellos.
2. Copiar un `skin.json` existente a `guest/templates/design-NN/skin.json` y cambiar `id`, `displayName`, colores, posición de textos y tiempos.
3. `node guest/tools/build_skin_master.cjs --skin guest/templates/design-NN/skin.json --media <carpeta-de-medios>`
4. `node guest/tools/register_visual_template.cjs --manifest guest/templates/design-NN/visual-plugin.json --apply`
5. `node guest/qa/catalog_preflight_v2.cjs && node guest/qa/catalog_admission_gate.cjs && node guest/tests/skin_engine_masters.test.cjs`
6. Matriz visual: `guest/qa/skin_engine_matrix_playwright.py` (320/360/390/430, MAX+FOTOS, normal y estrés canónicos, galería 0–4 y ausencias).
7. La propietaria solo mira el diseño en el móvil y dice sí o no. **Una corrección de secciones se hace una vez en el motor y vale para todos los diseños.**

## Pendiente (no se ha hecho ni se declara)

- **Backend:** la Edge Function viva (V19) solo acepta VEIL, Botánica y D03. Para crear pedidos TEST de D04–D08 hay que generar la candidata con `guest/tools/prepare_live_catalog_registry.cjs --require-template <id>` y desplegarla en TEST con autorización expresa.
- Aprobación visual de la propietaria en Android, dos pedidos TEST reales por diseño, RSVP y gates de certificación. Hasta entonces: `certification-pending`, NO SALE.
- Música (solo Caja de música tiene versión con música): no incluida. Se añadiría como opción de la piel si se decide.


## Interiores propios por diseño (revisión v5)

La autora pidió que cada diseño sea distinto también por dentro y que la elegancia no dependa de los campos rellenados. El motor ofrece ahora un **modelo neutro** (`buildVM`: historia, sedes, foto del lugar, vestimenta, momentos, bloques prácticos canónicos y galería) y un gancho `window.__GUEST_INTERIOR__.render(vm)`. Cada diseño puede aportar `interior.css` + `interior.js` (declarados en `skin.json → interior`), con las mismas reglas: nada inventado, enlaces solo con URL válida, ocultación sin huecos, galería en carrusel.

**design-08 · Caja de música** (aprobado en simulación por la autora): lugares como programa de concierto, agenda como partitura que avanza al bajar y cuyas notas se pueden tocar, detalles como cajoncitos de madera que se abren sobre terciopelo (1–4), fotos fundidas con el papel sin marcos, compás musical entre secciones, polvo dorado, franjas de continuidad con los vídeos y melodía de la caja tras tocar la portada con botón para silenciarla. Comprobación: `guest/qa/skin_interior_checks.py design-08:.cj-note:.cj-drawer:.cj-now` PASS.

## Revisión v6 (2026-10-13) · interiores propios en los cinco diseños

Misma estructura y mismas reglas que Caja de música; cada diseño con su propio lenguaje, sin tarjetas, sin iconos de app y con fotos fundidas sin marcos. Momentos 0–5 y detalles 0–4: la interacción funciona con cualquier número (también con 1 o ninguno, en cuyo caso la sección desaparece sin hueco). El momento elegido al tocar se mantiene hasta desplazarse más de 90 px.

- **design-04 · Azulejo**: agenda como camino de azulejos que se dan la vuelta y muestran la hora en cobalto; detalles como contraventanas azules que se abren; sello del azulejo de palomas entre secciones; sin palomas en vuelo continuo.
- **design-05 · Gala**: agenda como reloj déco cuya aguja avanza (marcas en rombo pulsables en su hora real); detalles como tiques dorados de guardarropa que se vuelven laca negra y abren una bandeja negra y oro; abanico déco que se dibuja entre secciones; polvo dorado reducido.
- **design-06 · Invernadero**: agenda como tallo que crece al bajar y despliega una hoja por momento (pulsables); detalles como sobres de semillas cuya solapa se abre; mariposa que se posa y abre las alas entre secciones (se quitan las mariposas en vuelo continuo).
- **design-07 · Reflejo**: títulos con su reflejo; agenda como velas flotantes que se encienden y se reflejan en el agua; detalles como espejos ovalados que recorre un destello; pétalo que se posa y deja una onda entre secciones; pétalos en caída reducidos.

Comprobación común: `python3 guest/qa/skin_interior_checks.py design-04:.az-tile:.az-win:.az-now design-05:.ga-mk:.ga-tk:.ga-now design-06:.iv-lf:.iv-env:.iv-now design-07:.rf-cd:.rf-mr:.rf-now design-08:.cj-note:.cj-drawer:.cj-now` → PASS en los cinco. Matriz `skin_engine_matrix_playwright.py`: 460 comprobaciones, 0 fallos. Catálogo sincronizado con `--sync-catalog`. Estado: certification-pending, TEST, NO SALE.

## Revisión v7 (2026-10-13) · design-09 Limoneros, versión Claude

A petición de la autora, versión alternativa de «Jardín de limoneros» para compararla con design-03 (la de ChatGPT) y quedarse con una. **design-03 no se toca**: sus vídeos y fondos se han leído de `guest-independent` en solo lectura. Interior propio: el fondo pasa del melocotón del atardecer al lila de la noche al bajar (enlaza la portada con el cierre); agenda como el camino del sol, que avanza y se pone sobre el horizonte (marcas pulsables); detalles como papeles de seda de limón que se desenvuelven; golondrinas del cierre entre secciones; fotos fundidas. `skin_interior_checks.py design-09:.lm-mk:.lm-w:.lm-now` PASS; matriz con seis diseños 552/0. Registrado TEST con `register_visual_template.cjs --apply`. certification-pending, NO SALE.

**v7.1 (2026-10-13)**: la autora ve design-09 «más interactiva que elegante» y no le gustan los rombos. Se quitan los papeles de seda: los detalles se muestran abiertos, compuestos como una carta impresa (numeral, título caligráfico, texto y enlaces, filete dorado entre bloques). El programa se ve entero; el sol recorre su arco al bajar y destaca el momento en curso (los demás quedan atenuados). Se quitan las indicaciones de «toca». La comprobación común acepta ahora bloques abiertos (sin `aria-controls`). Interior PASS, matriz 552/0.
