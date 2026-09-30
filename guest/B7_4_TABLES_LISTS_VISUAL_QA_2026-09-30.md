# GUEST by WeddlySmartDesign — B7.4 · MESAS + LISTADOS
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Objetivo
Mejorar claridad, jerarquía y sensación premium de Mesas + Listados sin añadir funciones ni alterar el comportamiento validado en B6.4.

## Mesas
- Introducción breve orientada a la tarea: organizar el salón y detectar quién sigue sin mesa.
- CTA de plano visual más compacto y directo.
- Copy del plano simplificado sin perder capacidad funcional.
- KPIs de mesas agrupados visualmente: con mesa / sin mesa / plazas libres.
- Tarjetas de mesa más limpias, con título editorial y acciones secundarias menos pesadas.
- Estado de mesa llena visible sin ruido.
- Estado de exceso de capacidad preparado con énfasis específico.
- Bloque “Sin mesa” diferenciado con borde discontinuo y recuento “N por colocar”.
- Acciones Editar / Mover / Asignar mantienen objetivos táctiles seguros.
- “Añadir mesa” queda como acción secundaria y no compite con el plano visual.

## Listados
- Introducción centrada en el uso real: generar entregables y mantener control de revisión/copia.
- Tarjetas clasificadas visualmente sin cambiar su contenido funcional:
  - BODA PRINCIPAL
  - RESPUESTAS RSVP
  - EVENTO EXTRA
  - CONTROL DE COPIAS
- Mesas, catering, transporte y alojamiento mantienen prioridad como entregables principales.
- Listas personalizadas RSVP y eventos extra se distinguen sin parecer módulos diferentes.
- Historial de copias queda más ligero y reconocible.
- Estado de control de copia se mantiene visible pero con menor peso visual.
- Botones de salida conservan altura táctil.
- CSV/PDF controlados siguen funcionando.

## Incidencias reales detectadas durante B7.4

### 1. Carrera visual de marca premium
La capa histórica de UI repintaba la marca cada 500 ms como dos SPAN.
La capa premium solo imponía una vez la jerarquía B + SPAN.
Resultado: en determinadas ventanas temporales podía reaparecer la estructura antigua.

Corrección:
- la capa premium verifica la estructura en cada aplicación;
- solo reescribe el DOM cuando realmente no coincide.

Commit:
`b2f316327f1580492cabf8ed0ad57e517c0488ed`

### 2. Ventana de click sin control de copia en listados de eventos
Una tarjeta de evento podía aparecer antes de que el hook de copia controlada hubiera terminado de instalarse.

Corrección:
- el control de copia expone su patch;
- se instala antes y en varios puntos de carga;
- al renderizar una tarjeta de evento se solicita inmediatamente el binding del control de copia.

Commits:
`ff6008ab40c432aeb30102595e873fc9717ba1e2`
`8bd9276de0597fcda20e9ffcc8030e98853ccc2d`

### 3. Bucle de realimentación en la primera versión visual B7.4
El patch visual reescribía textos idénticos en cada ejecución.
Su MutationObserver detectaba esas escrituras y volvía a ejecutar el patch, pudiendo retrasar renderizados asíncronos de otros módulos.

Corrección:
- escrituras idempotentes;
- solo se cambia texto si es distinto;
- observador coalescido mediante requestAnimationFrame.

Commit:
`bcbbad4d5c6f501fee708b55e99a862e64a54ca2`

## Archivos
- `guest/guest-visual-tables-lists-v1.js`
- `guest/qa/b7_4_tables_lists_visual_test.js`

## QA
Viewports:
- 320×700
- 390×844
- 430×900

El test valida:
- intro y jerarquía de Mesas;
- CTA del plano;
- KPIs;
- mesa llena;
- bloque sin mesa y recuento;
- clasificación visual de Listados;
- respuestas RSVP;
- eventos extra;
- historial de copia;
- targets táctiles;
- ausencia de overflow;
- descarga CSV controlada después de aplicar la capa visual.

Commit funcional validado:
`36a0d84cc8bcbd3b2ea7bada953bbd540c029b81`

Matriz final:
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

## Criterio de cierre
B7.4 = PASS.

No reabrir salvo regresión objetiva.

## SIGUIENTE
B7.5 · Eventos extra — revisión visual premium y simplificación.
