# GUEST by WeddlySmartDesign — B7.2 · HOY + INVITADOS
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Objetivo
Mejorar claridad, jerarquía y sensación premium de Hoy + Invitados sin añadir funciones ni alterar flujos B6.

## Hoy
- Se añade una entrada clara “Hoy / Resumen”.
- La explicación queda reducida a una frase útil.
- Confirmados y pendientes mantienen lectura inmediata.
- Invitaciones y respuestas gana prioridad visual sin convertirse en un bloque pesado.
- Cambios recientes queda mejor separado del resto.
- “Marcar como leído” conserva objetivo táctil y no se sale en 320 px.
- Alertas ganan jerarquía más limpia.
- La capa visual se reaplica automáticamente cuando el módulo RSVP reconstruye dinámicamente Cambios recientes.

## Invitados
- Introducción breve que explica el flujo sin añadir contenido comercial.
- Pasos más compactos y legibles.
- Botones y chips con mejor jerarquía.
- Eventos extra se diferencia visualmente como bloque opcional sin perder acceso.
- Mesas conserva su prioridad y CTA validada.
- Buscar / editar persona permanece accesible y usable.
- Buscador y controles de People Manager siguen seguros en móvil.

## Archivos
- `guest/guest-visual-hoy-invitados-v1.js`
- `guest/qa/b7_2_hoy_invitados_test.js`

## QA
Viewports:
- 320×700
- 390×844
- 430×900

Commit validado:
`6e551b901b4deb7820018268dbccea872efd9ba4`

Resultados:
- regression: SUCCESS
- b6-shell-mobile: SUCCESS
- b6-today-guests: SUCCESS
- b6-invitation-rsvp: SUCCESS
- b6-tables-lists: SUCCESS
- b6-extra-events: SUCCESS
- b6-two-device-sync: SUCCESS
- b7-mobile-hierarchy: SUCCESS
- b7-hoy-invitados: SUCCESS

## Criterio de cierre
B7.2 = PASS.

No reabrir salvo regresión objetiva.

## SIGUIENTE
B7.3 · Invitación + RSVP.
