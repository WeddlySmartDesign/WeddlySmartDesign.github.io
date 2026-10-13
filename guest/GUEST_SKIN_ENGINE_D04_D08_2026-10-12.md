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

## Revisión v8 (2026-10-13) · Limoneros con limones pintados y design-10 Cuento de papel

**design-09**: la autora prefiere la versión anterior (programa con el sol y detalles que se abren al tocar) pero sin rombos y sin golondrinas («aparecer de golpe queda barato»). Los detalles son ahora limones recortados de las ilustraciones al óleo que la autora creó con Recraft para esta invitación; al tocar uno se eleva levemente y se abre su información. Entre secciones, un limón pequeño entre dos filetes dorados, quieto.

**design-10 · Cuento de papel** (ZIP de la autora): cada sección es un capítulo del libro de la portada («capítulo i, ii…», numerado según las secciones visibles), historia con letra capital; agenda como paisaje de colinas de papel con banderitas por momento y un globo de papel (el del cierre) que viaja hasta la del momento en curso; detalles como nubes de papel que se elevan y abren su página; colinas de papel recortado entre capítulos; fondo que pasa del crema al azul de la noche como los fondos entregados. `skin_interior_checks.py design-10:.cu-flag:.cu-cl:.cu-now` PASS. Registrado TEST.

Matriz con siete diseños (D04–D10): 644 comprobaciones, 0 fallos. Todo certification-pending, TEST, NO SALE.

**v8.1 (2026-10-13)**: los limones aislados parecían manchas. design-09 usa ahora las dos ramas completas de la autora: la grande encabeza los detalles (títulos con numeral caligráfico que se abren al tocarlos) y la pequeña separa las secciones. Interior PASS.

**v8.2 (2026-10-13)**: la rama grande era demasiado y se perdía el gesto de tocar algo. Cada detalle es ahora una ramita pintada pequeña (giradas como cortadas sueltas); al tocarla se mece y se abre su información. Entre secciones, solo un filete dorado con un punto. Interior PASS.

**v8.3 (2026-10-13)**: tras comparar opciones, la autora elige para design-09 sobres cerrados con lacre marfil y una flor de buganvilla prensada (de sus ilustraciones al óleo, enlaza con la buganvilla de la cancela de la portada). Al tocarlo, el sobre se eleva, el lacre gira y se abre la información. Regla anotada por la autora: ningún adorno debe marcar el inicio de una sección, porque los fondos están pensados para fundirse sin cortes. Interior PASS.

## Revisión v9 (2026-10-13) · motor común

- **Volver a ver**: portada y cierre muestran, una vez vistos, un botón redondo discreto (↻, arriba a la derecha) que reproduce el vídeo desde el principio sin ocultar los nombres, la fecha ni «Confirmar asistencia».
- El cierre empieza cuando está visible al 70 % (antes 40 %), para que no se reproduzca mientras el invitado aún mira la galería.
- **Franjas de continuidad**: ya no ocupan un bloque propio. La primera sección se superpone al 75 % inferior de la franja superior y la última sección al 80 % superior de la franja inferior, así no aparecen trozos de fondo vacío al deslizar desde la portada ni antes del cierre (`seatBands()` en el motor; márgenes en % del ancho, responsive).
Afecta a D04–D10. Interior PASS en los siete; matriz 644/0; catálogo sincronizado.

## Revisión v10 (2026-10-13)

- **Carga**: los diseños del motor (D04+) pesaban 15–20 MB en un solo HTML y el móvil no respondía al toque de la portada hasta descargarlo entero. `build_catalog_static_preview.cjs` ahora externaliza sus medios siempre (marcador `window.__GUEST_SKIN__=`), igual que ya hacía con los >24 MiB; la fuente registrada sigue byte a byte y la restauración se verifica. Botánica y D03 no cambian. D10 pasa de 19,5 MB a 1,5 MB de HTML.
- **Volver a ver**: durante la repetición los textos y el botón de confirmar se apartan para ver la escena completa (p. ej., los novios del cierre de Cuento) y vuelven al terminar el vídeo.
- **Franjas**: sus bordes se funden (máscara), sin línea visible donde terminan.
- **D10 Cuento de papel**: separador = sol de papel recortado de la portada; detalles = nubes de papel reales de la portada (sin numerales); más aire entre la historia y su foto.
Interior PASS ×7; matriz 644/0; CI local OK.

**v10.1 (2026-10-13)**: D10 · la autora ve brusca la apertura del libro y la aparición de la escena. Se retemporiza la portada (sin tocar el original de la entrega): 1,35–2,0 s ×4 con fundido entre fotogramas, 2,0–3,6 s ×2,5 con interpolación de movimiento; duración 9 → 14,4 s, textos a los 9 s. El sol separador estaba cortado por abajo (en el vídeo lo tapa la colina): se completa el disco por simetría. Interior PASS.

**v10.2 (2026-10-13)**: D10 · al terminar la portada, las golondrinas del vídeo tapaban la fecha, el lugar y la cuenta atrás. Sin tocar el vídeo, el bloque de texto sube y se compacta (nombres en una línea, tamaños en función del alto de pantalla); comprobado sobre el último fotograma a 412×732, 390×700 y 360×640.

**v10.3 (2026-10-13)**: la interpolación de movimiento deformaba la iglesia al aparecer y la tapa del libro. Se rehace con fundido entre fotogramas (libro ×2,5, escena ×1,6; 12,2 s; textos a 6,6 s). El texto de portada baja un poco (6,5 svh) sin tocar las golondrinas en 412×732, 390×700 y 360×640.

**v10.4 (2026-10-13)**: en el vídeo original la tapa gira hasta quedar de canto y desaparece, y al ralentizarlo se notaba. Se elimina el giro: el libro cerrado se funde despacio (1,2 s) en la escena que va apareciendo; el resto, con fundido ×1,6. Duración 10,7 s; textos a 5,6 s.

**v10.5 (2026-10-13)**: el fundido libro→escena se ve peor; se vuelve a la apertura de v10.3. La tapa del vídeo original desaparece al quedar de canto; la solución limpia es generar un clip nuevo de la apertura.

**v11 (2026-10-13)**: D08 · cuando empieza el vídeo de cierre (la caja se cierra), la melodía baja poco a poco hasta apagarse al mismo tiempo que la tapa; el botón ♪ queda en silencio y permite volver a activarla.

**v12 (2026-10-13) · D04 Azulejo tras la revisión de la autora**: (1) los azulejos del programa giran en 1,9 s (antes 1,1) para que se vea el giro; (2) los detalles ya no son contraventanas planas: son el arco de flores en acuarela de la entrega (`piezas/arco.png`) con la vista al mar (`piezas/escena.jpg`) dentro; al tocar uno, los arcos se recogen y en ese mismo sitio se abre una ventana grande en arco con el cielo en acuarela y la información (botón «Cerrar la ventana»), así no queda abajo fuera de la vista; (3) lugares: cada sitio en su placa de azulejo pintada (doble filete cobalto y rombos laterales), con hora, dirección y enlaces debajo. Interior PASS.

**v12.1 (2026-10-13)**: «too much». Se retiran los arcos de flores y las placas: vuelven las contraventanas simples (pendiente de una versión en acuarela que la autora generará en Recraft), y al abrir una la pantalla se desplaza para que la información quede a la vista. Lugar compacto: etiqueta entre rombos, nombre caligráfico y «hora · dirección» en una línea. Regla de la autora: mantener el estilo no es repetir los mismos elementos en todas partes. Azulejos del programa a 1,9 s.

**v12.2 (2026-10-13)**: D04 · las contraventanas son ahora las acuarelas que la autora generó en Recraft (cerrada y abierta, alineadas por el marco, fondo blanco eliminado). Al tocar, la cerrada se funde en la abierta (cielo y mar dentro) y se abre la información debajo con desplazamiento a la vista. Interior PASS.
