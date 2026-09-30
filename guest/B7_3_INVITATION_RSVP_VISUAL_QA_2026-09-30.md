# GUEST by WeddlySmartDesign — B7.3 · INVITACIÓN + RSVP
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Objetivo
Mejorar la jerarquía visual y la claridad de:
- gestión/diseño de la invitación;
- operaciones de envío y respuestas;
- RSVP público individual y por unidad.

Sin cambiar lógica, payloads, plantillas, funciones ni aislamiento validados en B6.3.

## Gestión de invitación
- Barra de integración más limpia y estable.
- Paso Invitación → RSVP → Enviar con objetivos táctiles consistentes.
- CTA inferior “Guardar y continuar” reforzado.
- Formularios con alturas y radios coherentes.
- Plantillas en dos columnas en móvil para evitar tarjetas demasiado pequeñas.
- Preview móvil contenido y sin desbordamientos.
- Se preservan 6 Essential y 4 Signature.
- Se conserva el comportamiento de guardado y la tolerancia al fallo del refresh RSVP.

## Operaciones RSVP
- Cabecera GUEST by WeddlySmartDesign alineada con el producto.
- Copy principal reducido a una instrucción más directa.
- Métricas con mejor jerarquía.
- Filtros, grupos y tarjetas más legibles.
- Caja de envío/contacto más clara.
- Controles de destinatario, compartir y respuesta manual con objetivos táctiles adecuados.
- Se conserva la segmentación y la lógica de destinatarios/unidades.

## RSVP público
- Identidad discreta GUEST by WeddlySmartDesign.
- Títulos y lectura más editorial.
- Tarjetas y personas con separación más clara.
- Sí / No convertidos en decisiones táctiles grandes y evidentes.
- Estado seleccionado inequívoco.
- Campos, toggles y CTA con altura móvil cómoda.
- Éxito final y acciones posteriores más ordenados.
- Se conserva toda la lógica funcional:
  +1 independiente, menú pendiente, niños opcionales, transporte, alojamiento, preguntas personalizadas, envío por persona y calendario.

## Archivos visuales
- `guest/guest-visual-invitation-editor-v1.js`
- `guest/guest-visual-rsvp-operations-v1.js`
- `guest/guest-visual-public-rsvp-v1.js`

## Integraciones
- `guest/guests-rsvp-design-manage.html`
- `guest/guests-rsvp-operations-live.html`
- `guest/guests-rsvp-v116-single-live.html`
- `guest/guests-rsvp-v115-wedding-flex-live.html`

## QA automatizado
Test:
`guest/qa/b7_3_invitation_rsvp_visual_test.js`

Se valida:
- 320×700
- 390×844
- operaciones
- Essential
- Signature
- RSVP individual
- RSVP por unidad
- ausencia de overflow
- ausencia de llamadas ONE
- preservación de colección de plantillas
- objetivos táctiles y jerarquía visual.

## Incidencias encontradas durante el bloque

### 1. Parity gate
Los dos loaders públicos RSVP se modificaron solo para cargar la capa visual B7.3. Se registraron como divergencias controladas sin eliminar ninguna función heredada.

### 2. Carrera real de sincronización
La repetición completa de B6 durante B7.3 permitió detectar una carrera real de edición local inmediata tras recibir un cambio remoto. Se corrigió en `guest/guests-production-sync.js` y quedó añadida al informe B6.6.

### 3. Falsos negativos de QA visual
Las capas visuales se aplican sobre interfaces dinámicas. Se estabilizaron las pruebas para esperar el estado renderizado final —estructura de marca y altura real del stepper— en vez de comprobar marcadores intermedios.

## Commit validado
`bef69a9318c9f4af2a5a85880f4e7a5d1603bab2`

Resultados en el mismo commit:
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

## Criterio de cierre
B7.3 = PASS.

No reabrir salvo regresión objetiva.

## SIGUIENTE
B7.4 · Mesas + Listados.
