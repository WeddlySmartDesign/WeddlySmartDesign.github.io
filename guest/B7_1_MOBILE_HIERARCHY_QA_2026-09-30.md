# GUEST by WeddlySmartDesign — B7.1 · JERARQUÍA MÓVIL
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Objetivo
Mejorar la jerarquía visual móvil de GUEST sin alterar funciones, datos, arquitectura ni flujos validados en B6.

## Cambios aplicados

### Identidad
- Marca GUEST separada visualmente de “by WeddlySmartDesign”.
- “by WeddlySmartDesign” en Caveat.
- Cabecera más limpia y ligera.
- Pantalla de arranque alineada con la identidad GUEST.

### Jerarquía tipográfica
- Título de la pareja más editorial y compacto.
- Subtítulos y etiquetas con jerarquía más clara.
- Tamaños ajustados para 320, 390 y 430 px.
- Mejor ritmo vertical entre marca, nombres, fecha y contenido.

### Navegación inferior
- Barra inferior flotante.
- Bordes redondeados, sombra suave y blur.
- Objetivos táctiles de al menos 48 px.
- Estado activo visualmente inequívoco.
- Se respeta el color del tema GUEST seleccionado; no se fija un color único.
- Margen lateral seguro incluso en pantallas estrechas.

### Componentes globales
- Botones con altura táctil consistente.
- Tarjetas y estadísticas con borde/sombra más limpios.
- Hojas/modales inferiores con radio y espaciado premium.
- Inputs y opciones con altura mínima cómoda.
- Estados focus visibles.
- Safe areas conservadas.
- Sin overflow horizontal.

## Archivo visual
`guest/guest-visual-premium-v1.js`

## QA automatizado
Test:
`guest/qa/b7_1_mobile_hierarchy_test.js`

Viewports validados:
- 320×700
- 390×844
- 430×900

Commit validado:
`392d7b8683f18ed2317de830357921020a75b0ea`

Resultados:
- regression: SUCCESS
- b6-shell-mobile: SUCCESS
- b6-today-guests: SUCCESS
- b6-invitation-rsvp: SUCCESS
- b6-tables-lists: SUCCESS
- b6-extra-events: SUCCESS
- b6-two-device-sync: SUCCESS
- b7-mobile-hierarchy: SUCCESS

## Criterio de cierre
B7.1 = PASS.

No reabrir salvo regresión objetiva.

## SIGUIENTE
B7.2 · Hoy + Invitados.
