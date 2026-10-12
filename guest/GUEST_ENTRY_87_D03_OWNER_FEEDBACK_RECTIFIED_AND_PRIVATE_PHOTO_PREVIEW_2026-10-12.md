# Entrada 87 — Corrección tras revisión de la autora (12/10/2026)

Rama **`guest-independent`**, diseño `design-03` Limoneros V1.0.0, **TEST ONLY / certification-pending / NO SALE**. Continuación tras Entradas 85–86. **Esta entrada corrige el criterio visual de la 86; no asumir aprobación artística.**

## Error propio, corregido en el ejecutable real

La autora aportó capturas reales de Android que demostraron cinco fallos: (1) las fotos y la galería no estaban disponibles en la DEMO de la URL genérica, aunque las pruebas aisladas los ejercitaban; (2) los CTA incluían flechas expresamente prohibidas; (3) Práctico tenía recuadros; (4) Agenda tenía línea y rombos descentrados; (5) la composición invadía las golondrinas. Declarar PASS sintético antes no sustituyó en ningún caso su revisión.

**Correcciones técnicas sin tocar original, vídeos, fondos ni otros productos:**
- CSS `guest/catalog-patches/design-03/1.0.0/patch.css`: eliminar con override todas las flechas `::after`, los fondos/cajas de prácticos, línea y rombos en agenda. Agenda ahora es una composición editorial centrada por momentos con hora y nombre, manteniendo entrada progresiva y respeto a reducción de movimiento.
- Práctico comienza bajo la zona de golondrinas con margen superior **>=180 CSS px en las resoluciones QA**; fondo autor intacto. En secuencia de cuatro escenas SIN galería y cuatro prácticos, el texto y enlace final de Música pasan a color claro para recuperar contraste ante el degradado azul marino, **sin añadir cajas**. Las mismas escenas con galería emplean los cinco fondos del master, con las aves en la escena galería.
- Sigue el cuestionario real `guest-invitation-config-v1`: una o dos sedes (cada web y mapa propios), agenda 1–5, 0–4 prácticos con enlaces a hotel, mapas y música según URLs, historia opcional/foto opcional y galería 0–4. Se respetan datos ausentes; sin valores inventados en las invitaciones instanciadas.
- JS `guest/catalog-patches/design-03/1.0.0/patch.js`: clase condicional `d03-four-practical-gradient` solo si NO hay galería y hay cuatro prácticos; no afecta al resto. Soporte opt-in `?qa=full|reduced|without-gallery` solo para QA sin pedidos y sin ventas: **este mecanismo público emplea imágenes vectoriales SINTÉTICAS** como sondas de carga y layout, **NO son las fotos de la autora** ni deben usarse para aprobación de arte.

## La diferencia crítica: previsualización REAL con las cinco fotos que ya entregó

Se creó fuera de la web pública un HTML para revisión artística usando exactamente la versión ejecutable publicada de Limoneros más **las cinco fotos recibidas previamente** (pareja y celebración) embebidas como blobs locales, sin subirlas a GitHub o Cloudflare. Activa:
- `story.photo` (pareja), `locations.heroPhoto` (finca), `gallery.enabled=true` con cuatro fotos reales.
- Dos sedes, cada una con mapa y web (en el QA, URLs **de ejemplo claramente ficticias**, nunca representar datos reales de una pareja); cinco momentos y los cuatro prácticos.
- El mismo `window.GUEST_APPLY_CONFIG(config)` del master y el parche D03, sin añadir campos de plantilla propios. Vídeos/fondos no incrustados: se cargan desde media original publicada por Cloudflare; el archivo requiere acceso a Internet para esos fondos/vídeos. **No se han subido las fotos personales a la web**.
- Archivo privado en Biblioteca: `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/LIMONEROS_D03_REVISION_CON_FOTOS_Y_GALERIA_2026-10-12.html`.
- SHA256 final `7947fcc5b29118d0949b3a910ffdc8b1598e48d974968d9d16cbca4e29203732`; 3.414.453 bytes. Esta copia reemplaza la revisión privada anterior e incorpora también la corrección de contraste del cuarto práctico.
- **No afirmar aún que la propietaria aprobó esa previsualización**, ni que se ejecutó una sesión Android física sobre el archivo: el QA de navegador anterior se ejecuta por GitHub en un entorno separado con medios sintéticos.

## QA técnico automatizado nuevo (no confundir con certificación comercial)

Workflow `.github/workflows/guest-d03-mobile-visual-review.yml` «GUEST D03 Synthetic Media Mobile Layout QA (TEST ONLY)»: [run 38251232592](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38251232592) **SUCCESS**; Chromium real en GitHub Actions, 320/390/430 CSS px × 3 casos `full`, `reduced` y `without-gallery` = **9/9 PASS**, ninguna excepción JS ni scroll lateral. Valida 2/5/4, galería 4, ausencia limpia, imágenes cargadas, enlaces independientes de sedes, ausencia de flechas/cajas/línea/rombos, golondrinas despejadas y último CTA legible sobre azul oscuro. 6 capturas sintéticas y JSON como artifact (retención 7 días), no son las cinco fotos reales.

Cloudflare producción de previsualización NO-SALE: [run 38251076672](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38251076672) **SUCCESS**; último informe persistente `guest/qa-reports/limoneros_cloudflare_live_check.json` a 2026-10-12T12:46:18Z, HTML nuevo exacto + 15/15 medios originales exactos y robots `noindex`, sin permitir compra. QA catálogo [run 38251203192](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38251203192) **SUCCESS**.

## Punto exacto de continuidad y prohibiciones

1. **No pedir fotografías otra vez ni volver a declarar que una muestra sin fotos cubre su aceptación visual.** Entregar a la autora para revisión el HTML PRIVADO con sus fotos embebidas, no las imágenes QA sintéticas ni la URL pública normal sin foto.
2. Si la autora rechaza un detalle, cambiar exclusivamente el arte de la sección afectada en `patch.css`/`patch.js` y repetir visual QA; preservar vídeos/fondos y galería con sus 5 escenas. **NO introducir flechas, rectángulos, líneas con rombos**, ni tapar golondrinas.
3. **Aún pendientes:** aceptación artística de las pantallas por la autora, dos pedidos TEST auténticos por el cuestionario/gestor, paridad revisión/final/RSVP y Android físico. Status `certification-pending`, `ownerVisualApproved=false`, `commercialReady=false`; no habilitar checkout ni pagos.
4. ONE, ONE Partner, STUDIO, Botánica, VEIL LIGHT y `main` congelados. Cero nuevas herramientas de pago.

**Motivo:** el 12/10/2026 la autora expresó enfado justificado porque se repitieron incumplimientos de requisitos **ya canónicos y obligatorios para TODOS los diseños**. En el siguiente diseño, leer el contrato universal y revisar la configuración completa con fotos ANTES de que la autora vea una pantalla.
