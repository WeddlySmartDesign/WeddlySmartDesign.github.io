# GUEST by WeddlySmartDesign — B7.5 · EVENTOS EXTRA
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Objetivo
Mejorar la jerarquía visual, claridad y sensación premium de Eventos extra sin añadir funciones ni alterar el comportamiento validado en B6.5.

## Cambios aplicados

### Cabecera e identidad
- Marca GUEST separada visualmente de “by WeddlySmartDesign”.
- Jerarquía de título más editorial y compacta.
- Estado “Sincronizado” convertido en un indicador discreto.
- Lead superior más corto y legible.

### Navegación entre eventos
- Tabs redondeadas y táctiles.
- Estado activo más claro.
- Scroll horizontal limpio en móvil.

### Ficha del evento
- Tarjeta principal más limpia.
- Campos y acciones con menor peso visual.
- “Desactivar” se mantiene como acción secundaria/de precaución.
- En un evento inactivo, “Activar” se presenta como acción positiva y no destructiva.
- Resumen reducido visualmente al dato que importa en GUEST: invitados del evento.

### Invitados
- Título y explicación más claros.
- Selector compacto de invitados más consistente.
- Herramienta de grupos/subgrupos con mejor jerarquía.
- Targets táctiles seguros.
- Lista plegable conservada: no se expande por defecto ni se cambia el flujo validado.

### Invitación del evento
- Bloque “Invitación del evento” más claro como siguiente paso.
- CTA Crear/Editar invitación con prioridad adecuada.
- Estadísticas Sí / No / Pendientes más limpias.
- Destinatarios y acciones de WhatsApp / Recordar / Copiar enlace más ordenadas.
- Hoja de edición de invitación con radio, espaciado y targets táctiles premium.

### Alcance de producto
- Se mantiene oculta la herencia de pagos, presupuesto y tareas de ONE.
- Eventos extra de GUEST sigue centrado en:
  - invitados;
  - invitación;
  - confirmaciones.

## Archivos
- `guest/guest-visual-extra-events-v1.js`
- `guest/guests-events-v3.html`
- `guest/qa/b7_5_extra_events_visual_test.js`

## QA
Viewports:
- 320×700
- 390×844
- 430×900

Se valida:
- identidad;
- tabs;
- ficha del evento;
- estado activo/inactivo;
- invitados;
- grupos/subgrupos;
- entrada a la invitación del evento;
- sheet de invitación;
- targets táctiles;
- ausencia de overflow;
- ausencia visual de pagos/tareas.

## Ajustes de QA sin cambio de producto
1. La primera prueba intentó marcar una casilla de invitado mientras la lista estaba plegada por diseño.
   - Se corrigió el test para usar el flujo visible “Mostrar invitados”.
2. El test de evento inactivo comprobaba la clase visual en el mismo instante en que cambiaba el texto del botón.
   - Se corrigió para esperar al siguiente estado visual asentado.

No se alteró producto para satisfacer esos dos falsos negativos.

## Commit funcional validado
`3c9da498fb9b6409859a755970ea747b1a3fe74d`

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

## Criterio de cierre
B7.5 = PASS.

No reabrir salvo regresión objetiva.

## SIGUIENTE
B7.6 · Coherencia global + escritorio + accesibilidad visual.
