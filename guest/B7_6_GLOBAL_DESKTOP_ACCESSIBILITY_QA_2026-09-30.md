# GUEST by WeddlySmartDesign — B7.6 · COHERENCIA GLOBAL + ESCRITORIO + ACCESIBILIDAD VISUAL
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Objetivo
Comprobar y endurecer la coherencia visual transversal de GUEST fuera del móvil: composición de escritorio, modales/sheets, foco por teclado, contraste y reduced-motion, sin añadir funciones ni alterar flujos cerrados.

## Superficies revisadas
- App principal GUEST.
- Hoy / Invitados / Mesas / Listados.
- Eventos extra.
- Operaciones RSVP.
- RSVP público.
- Editor de invitación Essential/Signature.

## Cambios aplicados

### Escritorio
- Contenedores principales limitados y centrados para evitar el efecto de “móvil estirado”.
- App principal y operaciones profesionales con ancho máximo coherente.
- RSVP público con columna de lectura propia.
- Sheets/modales centrados en escritorio, con ancho máximo, margen alrededor y radio completo.
- Extra Events e invitación del evento usan el mismo criterio de sheet en escritorio.

### Accesibilidad visual
- Estados `:focus-visible` claros en botones, enlaces, inputs, selects y textareas.
- Outline de 3 px con offset para no depender únicamente del cambio de color.
- Se mantienen tamaños táctiles previamente validados.
- Contraste textual principal y muted comprobado contra fondos claros con criterio AA para texto normal.
- Reduced-motion: se eliminan transiciones/animaciones no necesarias cuando el sistema lo solicita.

### Robustez de render
- Capa visual de Operaciones RSVP hecha idempotente.
- MutationObserver coalescido mediante requestAnimationFrame para evitar repintados repetidos.

## QA
Test:
`guest/qa/b7_6_global_desktop_accessibility_test.js`

Job:
`b7-global-desktop-accessibility`

Valida en escritorio 1366×900:
- centrado/ancho máximo;
- ausencia de overflow;
- modales/sheets no estirados;
- foco visible de teclado;
- contraste AA;
- reduced-motion;
- editor, RSVP público y operaciones.

## Ajustes de QA sin cambio de producto
Los primeros intentos de comprobación de foco usaban foco programático, que no garantiza `:focus-visible` en Chromium por ser dependiente de modalidad.
Se cambió a navegación real por teclado y a un control estable no-primer elemento en Operaciones para que el retorno Tab/Shift+Tab sea determinista.

No se relajó el criterio: el test final exige simultáneamente:
- foco real en el elemento;
- coincidencia con `:focus-visible`;
- outline visible >= 2 px.

## Commit validado
`9f6afb06c5f36295fddae1f3a3792f47d5e64737`

## Matriz final
- regression: SUCCESS
- b6-shell-mobile: SUCCESS
- b6-today-guests: SUCCESS
- b6-invitation-rsvp: SUCCESS
- b6-tables-lists: SUCCESS
- b6-extra-events: SUCCESS
- b6-two-device-sync: SUCCESS
- b7-mobile-hierarchy: SUCCESS
- b7-hoy-invitados: SUCCESS
- b7-invitation-rsvp-visual: SUCCESS
- b7-tables-lists-visual: SUCCESS
- b7-extra-events-visual: SUCCESS
- b7-global-desktop-accessibility: SUCCESS

## Criterio de cierre
B7.6 = PASS.

No reabrir salvo regresión objetiva.

## SIGUIENTE
B7.7 · QA visual final y sellado de B7.
