# GUEST · Hoy — comportamiento con avalanchas de respuestas y acciones de la pareja
**Fecha:** 22/10/2026
**Estado:** especificación recomendada, derivada de la revisión de la usuaria, **pendiente de implementar y validar**. No equivale a una función ya publicada en el producto.

## Consulta que origina la especificación
La pareja envía la invitación definitiva, llegan veinte respuestas el mismo día, y los novios cambian un invitado de mesa. ¿Cómo debe gestionarse el buzón de Hoy para informar sin provocar ruido?

## Qué hace realmente el candidato de GUEST (rama `guest-hoy-sharing-audit-2026-10-22`)
- El envío de la invitación **no** genera, por sí solo, veinte avisos; ese proceso tiene sus registros y contadores propios de envíos/pendientes.
- Las nuevas respuestas individuales de RSVP generan entradas en `guests-home-rsvp-status-v1.js`, ordenadas por marca temporal; se muestran hasta 5 de entrada y hay opción de desplegar hasta 60; tras la auditoría también pueden figurar respuestas de preboda/eventos.
- Los movimientos de mesa realizados desde el plano mediante `guests-seating-v2.js` se incluyen en ese **mismo** buzón, sin distinguir autor ni relevancia.
- `Marcar como leído` registra `meta.todayRecentChangesReadAt` con la fecha máxima de los avisos visibles en la cola; no existe leído individual por ID. Con sincronización real, ese valor forma parte del estado de la boda.
- La ventana de la cola es de 7 días, máximo 60 entradas visibles; `guest-rsvp` devuelve las últimas 500 respuestas por consulta de gestión. No es una bitácora perenne, ni sistema de notificaciones push del teléfono.
- Las incidencias persistentes de Hoy (menú pendiente y mesas sobreaforadas) son calculadas a partir del estado actual. El núcleo muestra solo las primeras 3 personas sin menú y las primeras 2 mesas sobreaforadas, aunque el contador puede ser mayor.
- Problemas de producto: mezcla de «novedad», «acción realizada» y «problema sin resolver»; demasiadas entradas con volumen alto; una lectura global temporal puede ocultar avisos no examinados; no se registra identidad de quién movió la mesa para distinguir la propia actividad de la de la pareja; límite 60 y 7 días insuficiente para historial integral.

## Diseño recomendado de Hoy: tres áreas independientes
### A. Necesita atención — tareas vigentes, NO notificaciones de lectura
Se calculan a partir de la situación real actual: mesas con aforo excedido, asistentes sin mesa cuando proceda, confirmados con elección de menú todavía pendiente, incidencias de catering o transporte cuando requieran acción, y cambios de asistencia que afecten a una mesa. Las incidencias permanecen abiertas hasta corregir la causa, aunque se marque la novedad como leída. Se muestra contador real, tarjetas prioritarias y «Ver todas», sin ocultar el resto.

### B. Novedades — recepción de hechos externos
- Si llegan 20 respuestas nuevas en una jornada o periodo breve, una tarjeta de resumen: «20 respuestas nuevas»; bajo ella, los indicadores de confirmaciones y rechazos **calculados realmente**; «Ver las 20 respuestas» abre los detalles individuales.
- Un segundo cambio de la misma persona se identifica como rectificación, no como segunda persona distinta; se permite consultar ambas respuestas en el historial, con sello y vínculo a la ficha.
- Separar «Boda principal», «Preboda» y otros eventos. Las unidades de invitación familiar pueden tener varias personas, por lo que distinguir `respuestas recibidas`, `personas afectadas` y `unidades enviadas`: no intercambiar métricas.
- Agrupar únicamente la **presentación**, no eliminar ni colapsar los registros de origen.
- Conteo de **novedades no leídas**, identificadas por ID estable del evento (p. ej. submission id y versión/fecha de evento), no solo por un timestamp global. Permitir leer el grupo o entradas individuales; la acción de marcar leído no equivale a resolver una tarea.
- Al abrir el detalle de una respuesta, acceder a la ficha/estado de asistentes y sus menús sin crear un duplicado.
- Si los 20 llegan mientras Hoy está abierto, refrescar el resumen conservando posición de desplazamiento e interacción; no insertar veinte tarjetas de golpe ni marcar automáticamente como leído por estar viendo la pantalla.
- Las entradas vistas y su estado deben ser coherentes en los dos accesos autorizados.

### C. Actividad — cambios realizados por la pareja
- «Ana: Mesa 3 → Mesa 7», «Se ha añadido un invitado», etc. Deben quedar en el historial de operaciones con actor y fecha, pero **no contarse como nuevas respuestas RSVP** ni como alerta urgente a quien acaba de hacer el cambio.
- Si un cambio manual crea un problema real, se abre una incidencia en «Necesita atención» (p. ej. Mesa 7 por encima de aforo); si no, no interrumpir.
- Actividad de la segunda persona: identificable por autor, visible como actividad compartida. No convertir cada clic en una notificación insistente.
- Conservar trazabilidad sin filtrar nombres privados a otras bodas.

## Flujo concreto
1. «Invitaciones enviadas» se registra en su módulo; Hoy muestra seguimiento agregado de entregas/respuestas, no una alerta por cada envío manual.
2. Llegan 20 RSVP: Hoy muestra «20 respuestas nuevas», subtotales genuinos y botón para abrir el listado. El resumen global de confirmados/pending se actualiza.
3. Si tres confirmados necesitan menú y dos quedan sin mesa, quedan bajo «Necesita atención». NO desaparecen por pulsar «Marcar como leído».
4. Una de las dos personas mueve a Ana de Mesa 3 a Mesa 7: aparece en Actividad; sin alerta para esa persona. En el otro dispositivo aparece el cambio tras sincronización.
5. Si por ese movimiento Mesa 7 supera su aforo, Hoy muestra incidencia persistente hasta resolverla.
6. Si una persona rectifica una respuesta el mismo día, se registra una nueva novedad de rectificación, no se pierde la anterior.
7. La cola de avisos y la actividad del día no borran ni modifican las respuestas, los listados o los datos de los invitados.

## Requisitos de QA para implementación
- 20 respuestas recibidas en ráfaga, con 16 confirmaciones y 4 rechazos sintéticos, solo en prueba: un resumen 20, 20 detalles disponibles, contadores correctos sin duplicar unidades.
- Rectificaciones de la misma persona: resumen de personas afectadas sin duplicación y cambios individuales auditables.
- Mezclar 20 respuestas, un movimiento propio y uno del otro miembro: categorizar correctamente y mostrar actor.
- «Marcar grupo leído» no borra incidencias; incidencias se resuelven cambiando el estado real.
- Validar carrera cuando una respuesta se recibe mientras se marca la cola como leída; notificaciones de nuevo ID deben permanecer nuevas.
- Dos móviles/cuentas reales y reconexión con merge; sin doble notificación al recuperar Internet.
- Más de 60 cambios diarios: sin pérdida del acceso a historial aunque la pantalla inicial agrupe.
- Sin push, WhatsApp o email automáticos no aprobados. La pantalla Hoy es un buzón **dentro de la aplicación**.
- Compatibilidad móvil 320–430 px y ausencia de scroll saltando por re-render.

## Control del cambio
Esta nota documenta una **propuesta funcional, no una implementación**. El candidato actual conserva su comportamiento individual probado; no activar ventas ni fusionar módulos sin pruebas de paridad y seguridad. Mantener ONE congelado, no tocar STUDIO.
