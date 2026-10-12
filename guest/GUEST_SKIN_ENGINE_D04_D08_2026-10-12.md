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
