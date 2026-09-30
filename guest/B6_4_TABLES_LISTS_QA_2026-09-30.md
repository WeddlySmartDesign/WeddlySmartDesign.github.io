# GUEST by WeddlySmartDesign — B6.4 · MESAS + LISTADOS
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Alcance validado

### Mesas
- Resumen de invitados con mesa / sin mesa.
- Capacidad y estado de mesa llena.
- Invitados que no asisten excluidos del seating.
- Plano visual de mesas.
- Multiselección de invitados.
- Movimiento conjunto de varios invitados.
- Bloqueo de destinos sin capacidad.
- Persistencia de cambios del plano en el estado canónico.
- Regreso desde el plano sin sobrescribir cambios.
- Renombrado de mesa propagado a todos los invitados asignados.
- Actualización de capacidad.
- Recuento actualizado tras movimientos.

### Listados
- Mesas · Boda principal.
- Catering · Boda principal.
- Transporte · Boda principal.
- Preguntas personalizadas RSVP.
- CSV controlados.
- Impresión / PDF.
- Control de revisión y copia.
- Exclusión de invitados que no asisten.
- Filtrado correcto de menús.
- Resumen por mesa y total de catering.
- Datos actuales después de cambios de mesa.
- Branding GUEST by WeddlySmartDesign.
- Ausencia de llamadas activas a endpoints ONE en el recorrido validado.

## Incidencias reales detectadas y corregidas

### 1. El CSV controlado de catering perdía los resúmenes
La capa base de catering ya generaba:
- detalle por invitado;
- resumen por mesa;
- fila TOTAL.

Pero la capa de copias controladas reconstruía el informe y conservaba solo el detalle.

Corrección:
- la copia controlada de catering conserva ahora los resúmenes por mesa y la fila TOTAL.

Archivo:
`guest/guests-copy-control-v1.js`

### 2. Las listas RSVP personalizadas podían desaparecer tras reconstruir Listados
Si otra capa reconstruía el contenido de la vista Listados, las tarjetas de preguntas personalizadas podían desaparecer mientras la firma cacheada indicaba erróneamente que ya estaban renderizadas.

Corrección:
- la firma solo evita rerender cuando las tarjetas realmente siguen presentes;
- si fueron eliminadas por una reconstrucción de la vista, se regeneran.

Archivo:
`guest/guests-custom-lists-v1.js`

### 3. Listados de eventos extra seguían consultando endpoints ONE
Durante el QA de Mesas/Listados se detectó polling activo hacia:
- `weddly-event-state`
- `weddly-event-invite`

Corrección:
- migrado a `guest-event-state`;
- migrado a `guest-event-invite`;
- incorporado al gate de regresión.

Archivo:
`guest/guests-extra-event-lists-v1.js`

### 4. Ajustes de QA, no de producto
Se corrigieron dos falsos negativos del test:
- lectura demasiado temprana del popup de impresión;
- comparación sensible a mayúsculas de la marca, aunque CSS la mostraba correctamente en uppercase;
- reacquisición del frame activo después de recargas de sincronización.

No se modificó el comportamiento funcional para satisfacer esos falsos negativos.

## QA automatizado

Workflow:
`.github/workflows/guest-independent-qa.yml`

Job:
`b6-tables-lists`

Test:
`guest/qa/b6_4_tables_lists_test.js`

Commit funcional validado:
`4ac9267362b5a1389b78fd6e80cb724e9c822c26`

Resultados:
- regression: SUCCESS
- b6-shell-mobile: SUCCESS
- b6-today-guests: SUCCESS
- b6-invitation-rsvp: SUCCESS
- b6-tables-lists: SUCCESS

## Criterio de cierre

B6.4 = PASS.

No reabrir salvo regresión objetiva.

## SIGUIENTE

B6.5 · Eventos extra.
