# GUEST by WeddlySmartDesign — B6.5 · EVENTOS EXTRA
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Alcance validado

### Creación y activación
- Estado vacío de Eventos extra.
- Activación explícita de Preboda.
- Fecha inicial de Preboda = día anterior a la boda.
- Evento nuevo sin invitados heredados.
- "Otro evento" se crea DESACTIVADO por defecto.
- Activación manual posterior.
- Botón y estado visual coherentes con activo/desactivado.

### Invitados del evento
- Solo aparecen invitados activos de GUEST.
- Invitados que no asisten quedan excluidos.
- Selección individual.
- Selección por grupo/subgrupo.
- Escritura conflict-safe con reintento tras 409.
- Recuento actualizado.
- Persistencia remota del conjunto de invitados.
- Unidades de invitación conservadas: dos personas de una misma unidad reciben una sola invitación de evento con ambos miembros.

### Invitación específica del evento
- Invitación independiente de la invitación principal.
- Editor propio.
- Una sola foto de portada.
- Título, texto y mensaje.
- Fallo temporal de guardado deja el editor recuperable.
- Reintento posterior correcto.
- Segunda foto eliminada del payload final.
- Enlace privado generado.
- Preparación de destinatarios basada únicamente en los invitados seleccionados para ese evento.

### RSVP del evento
- Invitación pública móvil.
- Miembros correctos por destinatario.
- Respuesta Sí/No independiente por persona.
- Validación de respuesta.
- Persistencia de respuesta y fecha.
- Refresco posterior en la interfaz del propietario.
- Recuentos de confirmados/pendientes actualizados.
- RSVP del evento no se mezcla con el RSVP principal.

### Listados
- Evento activo aparece en Listados.
- Resumen confirmado / no asiste / pendiente.
- CSV controlado del evento.
- Solo confirmados incluidos en el listado de asistentes.
- Pendientes y no asistentes excluidos.
- Código de copia controlada EVT / revisión / copia.

### Producto independiente / UX
- Branding GUEST by WeddlySmartDesign.
- Vista móvil sin overflow horizontal.
- La capa GUEST elimina de la experiencia visible de Eventos los bloques de presupuesto, pagos y tareas heredados de ONE.
- El alcance visible queda centrado en invitados, invitación y confirmaciones.
- Cero llamadas a endpoints ONE durante el recorrido automatizado.

## Incidencias reales detectadas y corregidas

### 1. Selector por grupo todavía usaba el endpoint de ONE
Archivo:
`guest/guests-events-group-select-v1.js`

Antes:
`weddly-event-state`

Ahora:
`guest-event-state`

Impacto evitado:
GUEST ya no depende del estado de Eventos de ONE al añadir/quitar invitados por grupo.

### 2. La capa de invitación de una sola foto vigilaba el identificador de API antiguo
Archivo:
`guest/guests-events-ui-compact-photo-v1.js`

La capa interceptaba guardados buscando:
`weddly-event-invite`

Pero el producto independiente ya usa:
`guest-event-invite`

Esto podía impedir que la regla de una sola foto limpiara correctamente `secondPhoto` o que "Quitar foto" modificara el payload esperado.

Corrección:
la intercepción sigue ahora la API real de GUEST.

### 3. Gate de regresión ampliado
Se incorporaron los helpers activos de Eventos al control de divergencias y de endpoints para impedir que vuelvan a conectarse silenciosamente con ONE.

## Ajustes de QA sin cambio funcional
Durante la construcción de la prueba se corrigieron dos supuestos del propio test:
- las filas de destinatarios no aparecen hasta que la invitación del evento ha sido preparada;
- la comprobación de "Otro evento" debía esperar a que el segundo evento terminase de persistirse.

No se modificó producto para satisfacer esos falsos negativos.

## QA automatizado

Workflow:
`.github/workflows/guest-independent-qa.yml`

Job:
`b6-extra-events`

Test:
`guest/qa/b6_5_extra_events_test.js`

Commit validado:
`ef1e1f5d714386535cf9e53ae4f4f472107fff2b`

Resultados:
- regression: SUCCESS
- b6-shell-mobile: SUCCESS
- b6-today-guests: SUCCESS
- b6-invitation-rsvp: SUCCESS
- b6-tables-lists: SUCCESS
- b6-extra-events: SUCCESS

## Criterio de cierre
B6.5 = PASS.

No reabrir salvo regresión objetiva.

## SIGUIENTE
B6.6 · Sincronización entre dos dispositivos + estados de error.
