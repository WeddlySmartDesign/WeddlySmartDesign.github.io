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

**v12.3 (2026-10-13)**: revisión de Azulejo en conjunto. Se quita el azulejo de palomas repetido entre secciones (aparecía 4 veces; queda solo aire). El programa es un friso: azulejos lisos color marfil que, al avanzar el día, giran y quedan pintados; la hora va debajo en cursiva (antes, cuadrados azules con la hora que parecían botones). Ventanas de acuarela a 108 px. Se elimina «Toca un azulejo para ver su momento».

**v12.4 (2026-10-13)**: la autora quiere que el interior tenga la serenidad de la portada y el cierre. Tipografía del interior = la de la portada (títulos y nombres en Pinyon, texto en Garamond, etiquetas en versalitas GaramondSC en minúscula espaciada), fuera Chorus y Lora. Papel sin el marco lateral de azulejos (recortado de `fondo-2`; franja superior también sin marco). Lugar solo tipográfico: etiqueta, nombre caligráfico, «hora · dirección» en cursiva y enlaces, sin rombos. Fotos de la pareja con un velo cálido (sepia .16, saturación .82) que las acerca a la acuarela; es un filtro, sirve para cualquier foto. Interior PASS.

**v12.5 (2026-10-13)**: la foto del lugar es opcional en el cuestionario (`heroPhoto` es null si la pareja no la sube; no hay foto por defecto). Para que el lugar no sea solo texto, cada sede lleva una pequeña viñeta en acuarela de la entrega: arco de flores en la ceremonia, velero en la celebración. Comprobado con y sin foto.

## Revisión v13 (2026-10-13)
- **Fotos de demostración**: el motor usa ahora fotos reales aportadas por la autora (pareja en viñedo/jardín y banquete bajo árboles) para ver el resultado realista en los siete diseños.
- **D04 Azulejo**: (1) lugar como carta impresa: en cada fila la hora a la izquierda, un filete cobalto vertical y a la derecha tipo, nombre en cursiva, dirección y enlaces; todo sobre una única aguada de acuarela azul (funciona con o sin foto); (2) fotos de la pareja con borde irregular de acuarela (máscara) y velo cálido, aplicado automáticamente a cualquier foto; (3) programa: los cinco azulejos pintados desde el principio, el momento en curso se eleva con un filete bajo la hora; sin casillas vacías ni giros; (4) caligrafía solo en títulos de sección, a 44 px; nombres de sedes, momentos y detalles en Garamond cursiva.
Interior PASS, matriz 644/0.

**v13.1 (2026-10-13)**: D04 · «Toca para abrir» no se veía sobre los azulejos y los textos de portada/cierre se leían mal sobre la acuarela. Portada: el texto (compacto, nombres en una línea) descansa en un lavado marfil de acuarela con borde irregular, en tinta azul. Cierre: el mismo lavado desde abajo, texto en tinta azul. Aviso: tinta azul sobre una mancha marfil. Pinceladas mínimas: un trazo de acuarela azul bajo cada título de sección, además de la aguada del lugar.

**v13.2 (2026-10-13)**: D04 · fuera el trazo bajo los títulos. La aguada del lugar se repite en dosis mínimas solo detrás del momento en curso del programa y de la información abierta de los detalles. Vuelve «Toca un azulejo para ver su momento» y las horas del friso suben a 17 px. La autora da el diseño por casi listo.

**v13.3 (2026-10-13)**: D04 · los nombres aparecían a los 3,3 s y tapaban las palomas; ahora a los 8,6 s, cuando terminan su vuelo. El cierre usa `cierre-sin-texto.mp4` de la entrega (sin «Os esperamos» en la vela, que se salía de ella).

## Revisión v14 (2026-10-13) · repaso de los demás con los criterios de Azulejo
La autora da Azulejo por terminado y pide repasar el resto con lo aprendido: serenidad, la letra de la portada en el interior, no repetir elementos, el lugar con algo más que texto pero elegante, fotos integradas y legibilidad.
- **Gala, Invernadero, Reflejo**: títulos en Pinyon 44 px, texto Garamond, etiquetas y enlaces en versalitas; fuera abanicos, mariposas y pétalos entre secciones (solo aire) y los filetes laterales del papel; lugar en filas tipo carta (hora · filete · sede) sobre aguada con textura real de acuarela teñida del color del diseño; fotos con borde de acuarela y velo; detalles sin «Nº 0x» ni numerales; toque mínimo de aguada tras el momento en curso. Reflejo: «Toca para abrir» en tinta sobre mancha marfil y sin reflejo en los títulos.
- **Caja de música**: solo fotos con borde de acuarela y velo cálido (su programa de concierto se mantiene).
- **Limoneros y Cuento**: lugar tipo carta sobre aguada en su color y fotos con borde de acuarela; separadores aprobados (filete con punto, sol de papel) se mantienen.
Interior PASS en los siete; matriz 644/0; CI local OK.

## Revisión v15 (2026-10-13) · identidad propia de cada interior
Vistas juntas, solo Caja de música tenía un interior inconfundible (una sola metáfora: el concierto). Antes de cambiar nada se entregó a la autora un ZIP por diseño con el estado anterior (equivale al commit db22cf3). Regla de la autora: nunca encajar las fotos en una forma (debe valer cualquier foto).
- **Gala**: la invitación vive la noche: la última sección visible pasa del marfil al azul noche del cierre, con letras doradas, y enlaza con los fuegos del balcón. Lugar = tarjeta de entrada marfil con canto dorado y esquinas déco; etiquetas en mayúsculas Adventor doradas. Fotos con fundido suave (sin acuarela).
- **Invernadero**: las fotos aparecen tras un cristal empañado que se aclara (como la portada). Lugar = etiquetas de herbario con hoja prensada, ligeramente giradas.
- **Reflejo**: cada foto tiene orilla recta y su reflejo ondulando debajo; en el lugar, cada nombre se refleja bajo una línea de agua.
- **Limoneros**: bordes de pincelada de óleo en las fotos y lugar sobre una pincelada ancha con los colores del atardecer de la portada.
- **Cuento de papel**: fotos como recortes de papel rasgado con sombra; lugar con colinas de papel por capas al pie y banderita en cada sede.
Azulejo y Caja sin cambios. Interior PASS; matriz 644/0; CI OK.

**v15.3 (2026-10-13)**: D05 · en la portada el vals avanzaba, se paraba 1 s, retrocedía y daba tirones (fotogramas duplicados). Se usa solo el tramo hacia delante (hasta 5 s), los últimos 30 fotogramas se ralentizan ×2,6 con fundido para frenar suave y la pareja queda abrazada hasta el final. El original se conserva como `portada-original.mp4`.

## v16 · D11 «Bola de cristal» (nuevo, TEST · certification-pending · NO VENTA)
- Portada: vídeo generado por la autora (bola de cristal real) + pétalos añadidos dentro de la bola siguiendo la cámara + final alargado. Sin nombres en el vídeo: todos los textos los pone el motor.
- Cierre: noche en el jardín del banquete; la estela dorada sale de la bola hasta el cielo. Textos arriba sobre las estrellas.
- Interior propio (prefijo `bc`): motas de purpurina entre secciones, fotos sin marco con borde empañado y destello, lugar grabado sobre travertino, programa sobre una estela dorada con destellos pulsables, detalles como cantos de travertino con un pétalo.
- Música original (piano, celesta, arpa y cuerdas), se apaga con el cierre.
- Medios fuente: `/home/claude/bola/ent` (copia local; no incluida en el repo salvo dentro del master).

## v17 · D12 «Abanico» (nuevo, TEST · certification-pending · NO VENTA)
- Sin vídeos generados: portada y cierre animados por código (`/home/claude/abanico/tools/frames.py`, 1080×1920, 30 fps). Hoja del abanico = retrato al óleo «retrato-cerca» de la autora (Recraft, reutilizado); varillas, borla, cinta, pétalos y seda verde salvia hechos por código. Sin nombres en los vídeos.
- Portada (8,2 s): el abanico cerrado gira, se abre con un golpe, destello dorado y pétalos; textos del motor a 4,4 s, arriba.
- Cierre (11 s): se pliega despacio, se tumba, la cinta se ata por partes y caen pétalos; «Os esperamos» propio a 5,6 s y resto a 6,6 s.
- Interior propio (prefijo `ab`): seda marfil con reflejos; abanico diminuto que se abre entre secciones; lugar en hoja de seda con doble filo dorado; programa como abanico que se despliega al bajar (cada varilla = un momento, pulsable) + lista completa; detalles como abanicos entreabiertos que laten y se abren al tocarlos; fotos sin forma con bordes fundidos y destello dorado.
- Música original (guitarra española en arpegios, flauta y cuerdas, 3/4 en re mayor), se apaga con el cierre.
- Medios fuente: `/home/claude/abanico/ent` (copia local; dentro del master).
- **v17.1**: interior con un solo abanico (el del programa); detalles como muestras de seda marfil con reflejo que avisa hasta el primer toque; sin separadores entre secciones.
- **v17.2**: abanico y terciopelo reales (Recraft de la autora; fuentes en `/home/claude/abanico/real`). El abanico se recorta del fondo y se corta en 56 gajos que giran sobre el remache (`fanreal.py`, `frames2.py`); la tela lleva el retrato con la luz y los pliegues del satén. Terciopelo virado a verde salvia, más oscuro arriba, con brillo lento. Cierre sin lazo (11 s): dos golpes de aire con pétalos, se pliega y deja su silueta en luz dorada que se deshace en chispas; «Os esperamos» a 5,6 s. Programa del interior con el mismo abanico (tela solo con pinceladas, sin la pareja) en 24 gajos SVG. Bandas de transición hechas con el propio terciopelo.
- **v17.3**: retrato en la tela con menos zoom (se ve la pareja entera de cara a manos), colores más vivos y bordes del cuadro difuminados en claro en lugar de reflejados.
- **2026-10-15**: la autora aprueba el diseño visual de D12 «Abanico». Sigue TEST · certification-pending · NO VENTA.
- **v17.4**: música cambiada a guitarra española sola (composición propia: la menor con cadencia andaluza que se abre a la mayor; `/home/claude/gala/musica/abanico_guitarra.py`).
- **v17.5**: vuelve la música original (guitarra en arpegios, flauta y cuerdas). Las pruebas de guitarra sola (GM, modelado físico, muestras FluidR3) no convencieron. Pendiente: música definitiva.

## v18 · D13 «Viñetas» (nuevo, TEST · certification-pending · NO VENTA)
- Ilustraciones de Recraft de la autora (pareja en el mar, calle, copas; fotomatón con Recraft 4.1), retocadas por código: colores a juego, farolillos apagados/encendidos, sin puntitos de nieve, sombras grises quitadas de las caras. Fuentes en `/home/claude/comic` (src, src2, prep, vid).
- Portada (9 s): boceto a lápiz → tinta → color viñeta a viñeta; farolillos que se encienden; «¡CHIN CHIN!»; luna que respira. Los datos de la pareja los pone el motor dentro de un bocadillo CSS sobre la última viñeta (a 7,3 s).
- Cierre (11 s): tira de fotomatón con tres fotos que se revelan con «¡FLASH!» y «¡SMACK!» → último flash → noche con fuegos artificiales de cómic y «¡BOOM!». «¡Os esperamos!» propio en bocadillo (5,9 s) y datos en una cartela (6,6 s).
- Interior propio (prefijo `vn`): viñetas con cartela amarilla y título rotulado, horas en estrellas de cómic, programa en tira de viñetas que aparecen al bajar, detalles como bocadillos con aviso «!», galería enmarcada.
- Motor: se añaden las fuentes OFL Bangers y Kalam (con sus licencias) al registro de fuentes del constructor.
- Música original «swing suave» (contrabajo, piano, clarinete, vibráfono y glockenspiel).
- **v18.1**: en el cierre los fuegos estallan más abajo (mitad inferior) para que la cartela con los datos no tape los «¡BOOM!».
- **2026-10-17**: la autora aprueba el diseño visual de D13 «Viñetas». Sigue TEST · certification-pending · NO VENTA.

## v19 · D14 «Viñetas · Ellas» y D15 «Viñetas · Ellos» (nuevos, TEST · certification-pending · NO VENTA)
- Versiones inclusivas de «Viñetas» pedidas por la autora: dos novias (D14) y dos novios (D15). Mismo guion de portada y cierre e interior `vn`, pero cada versión con su propia identidad. No son clones.
- Ilustraciones nuevas de Recraft de la autora: la pareja en el mar (vectorial) y las tres fotos del fotomatón (Recraft 4.1). La calle y las copas se reutilizan de D13 y se recolorean, así que no gastan créditos.
- Retoque por código (`/home/claude/comic/inc/skin.py`, `cfg.py`, `prep2.py`):
  - piel plana con tono propio para cada persona (clara / morena cálida / morena profunda), sin las sombras grises de Recraft 4.1;
  - fondos de las fotos en azul pizarra, arena y terracota;
  - traje verde botella;
  - flores fuera de la espalda;
  - tallo de la copa devuelto a su color.
- Sin clichés de género (indicación de la autora):
  - las dos novias llevan vestido y velo, y los dos novios traje;
  - nada de rosa o azul por género.
- Ellas (D14):
  - atardecer y «¡SALUD!»;
  - copas: mano clara con manga de encaje y mano morena con manga de raso marfil;
  - fuegos en mostaza, terracota y oliva sobre noche verde mar;
  - interior en terracota #B9572F, mostaza #ECBD55 y oliva #4D5A32.
- Ellos (D15):
  - calle en noche de verbena (cielo berenjena, luna saliendo del mar, farolillos);
  - «¡CHIN CHIN!» y copas con manga verde botella;
  - fuegos en dorado, granate y salvia sobre noche berenjena;
  - interior en granate #8E2F3C, dorado #E8C77A y verde botella #2F4B3C.
- Vídeos: `/home/claude/comic/vid/portada.py` y `cierre.py` con `V=ellas|ellos` (sin variable = D13 intacto). Medios en `/home/claude/comic/ent_ellas` y `ent_ellos`.
- Resultados: Interior PASS ×2, matriz 1104/0, tests de másters PASS y CI OK.
- **v19.1**: D14 brindis con el brazo de la novia morena al aire (vestido de tirantes): se quita la manga con puño y gemelo, que parecía de traje de hombre.
- **v19.2**: D14 antebrazo del brindis más fino y curvado (el recto parecía un tronco), con una pulsera dorada fina en la muñeca.
- **v19.3**: D14 muñeca del brindis suavizada: la mano baja al brazo en una sola curva.
- **v19.4**: D14 vuelve el brazo de v19.2; el suavizado de v19.3 quedaba peor en la muñeca.
- **v19.5**: D15 brindis con manga de lino arena y puño de camisa en el novio de la izquierda (antes salía el antebrazo al aire); en el mar se quitan las dos flores de la espalda/hombro y se rehace el borde del hombro.
- **2026-10-17**: la autora da por buena D15 «Viñetas · Ellos» («perfecto»). Sigue TEST · certification-pending · NO VENTA.
- **v19.6**: D14/D15 con fotos de ejemplo propias de la autora (dos novias / dos novios) en historia y galería; el lugar sigue con la foto común. El constructor admite `demoPhotos` opcional en skin.json; sin él usa las comunes (D13 reconstruido idéntico byte a byte).
- **v19.7**: D14/D15 una foto de ejemplo más de la autora en cada galería (Ellas: de la mano riendo, en lugar del primer plano; Ellos: leyendo un libro, en lugar de repetir la de la historia).

## v20 · D16 «El mapa» (nuevo, TEST · certification-pending · NO VENTA)
- Diseño sin pareja dibujada para que cualquier pareja se sienta representada. Tres piezas de Recraft de la autora: mapa en acuarela (ampliado; se borran por código unas pseudo-letras del ampliado), brújula en acuarela y sello de lacre realista con rama de olivo. Fuentes en `/home/claude/mapa` (src, prep.py, vid).
- Portada (9 s): mapa plegado sobre lino con la brújula en la tapa, que se despliega en perspectiva 3D (6 cuarterones: columna y luego filas), marcas de los pliegues en el papel, camino terracota discontinuo del faro a la finca, alfileres con rebote en la iglesia y la finca, y brújula que gira y cuya aguja oscila hasta apuntar a la finca. Datos del motor sobre el mar (7 s).
- Cierre (9 s): el mapa con el camino se vuelve a plegar como una carta y cae el sello de lacre sobre el borde. «Os esperamos» propio en cursiva (4,7 s) y datos del motor (5,2 s) sobre el lino.
- Interior propio (prefijo `mp`, Lora + GaramondSC): páginas de guía con doble filete y la rosa de los vientos que gira; lugar en postales con sello perforado (hora) y matasellos; programa como recorrido de alfileres con el camino que se dibuja al bajar; detalles como billetes con matriz que se pican al tocarlos (el billete abierto lleva el sello de lacre); fotos en copia de papel.
- Sin música (decisión de la autora).
- Interior PASS, matriz 1196/0, tests de másters PASS, CI OK.
- **v20.1**: tras la revisión de la autora («a la altura del resto»):
  - portada de 11,5 s con viaje de cámara siguiendo la pluma por el camino y alejamiento final;
  - mar con ondulación y brillos, luz giratoria del faro y gaviotas en tinta;
  - camino más grueso con halo y contorno, y alfileres más grandes;
  - brújula y luz dorada al final; datos a 9,4 s;
  - cierre con dorsos impresos (cuadrícula y filete) y carta mayor y centrada;
  - más pseudo-letras del ampliado borradas.
- **v20.2**: D16 datos de portada con lavado crema detrás y tinta más oscura; haz del faro más fino y tenue, que se apaga antes de los datos.
- **v20.3**: D16 nombres de portada en una línea con «&» terracota; posición de los datos ajustada para pantallas bajas (sin chocar con «Descubrir»).
- **v20.4**: D16 vuelve el haz del faro de v20.1 (gustaba a la autora); sigue apagándose antes de los datos.
- **v20.5**: D16 billetes de detalles en una columna (sin texto que se salga); cierre con la carta más baja y menor, y textos compactos para no pisarla.
