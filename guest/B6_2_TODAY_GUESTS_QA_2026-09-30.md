# GUEST by WeddlySmartDesign — B6.2 · HOY + INVITADOS
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## QA ejecutado
Navegador real automatizado en viewport móvil 390×844 sobre la rama GUEST.

### Hoy
- resumen Confirmados / Pendientes
- alertas de menú pendiente
- alerta de mesa por encima de capacidad
- cambios recientes RSVP
- cambio de asistencia
- respuestas personalizadas
- cambios de mesa
- acción Marcar como leído
- persistencia de lectura
- rerender tras cambios de invitados
- ausencia de overflow horizontal

### Invitados
- recorrido de preparación de lista
- copy final de Invitaciones y respuestas / RSVP
- grupos
- subgrupos
- creación múltiple de personas
- buscador/editor final de personas
- edición de RSVP
- edición de menú
- edición de transporte
- al marcar No asiste se elimina su mesa activa
- importación pegada auditada
- estados de RSVP importados sin inferir ausencias
- sincronización después de mutaciones
- navegación móvil sin perder estado

## Ajustes realizados en el QA
Durante la prueba se confirmó que varias capas finales sustituyen interfaces históricas del core:
- guests-rsvp-clarity-v1.js / guests-production-ops.js sustituyen el copy RSVP inicial.
- guests-people-manager-v1.js sustituye el editor de personas histórico.
- guests-import-audit-v1.js sustituye el importador histórico.

Los tests se alinearon con las interfaces finales realmente cargadas. No se revirtió ninguna capa vigente.

## Resultado de CI
Commit validado: 2484ae4429495789ccfe51395388ed802549120b

- regression: PASS
- b6-shell-mobile: PASS
- b6-today-guests: PASS

## Punto sellado
B6.2 no se reabre salvo fallo objetivo.

## Siguiente
B6.3 · Invitación + RSVP + Essential/Signature
