# GUEST by WeddlySmartDesign — Auditoría en profundidad: Hoy, notificaciones, Ajustes y paridad ONE
**Fecha:** 22/10/2026 · **Auditoría de código, backend y pruebas en Chromium** · **Estado comercial:** NO_GO sin E2E de compra/entrega

## 1. Alcance, repositorios y regla de seguridad
- Origen del producto: `WeddlySmartDesign/WeddlySmartDesign.github.io` rama `guest-independent`.
- ONE congelado, rama raíz `main`: comparación de código **solo lectura**. STUDIO, ONE Partner, diseños maestros y otros proyectos no intervenidos.
- Rama de correcciones y pruebas, **no fusionada**: `guest-hoy-sharing-audit-2026-10-22`.
- Rama independiente de demostración: `guest-demo-capturas-2026-10-21`, con datos falsos y red deliberadamente bloqueada.
- La pareja compra un diseño de invitación individual; se entrega aprobado y **solo después** obtiene acceso a GUEST. La pareja **no edita** la invitación ni las preguntas RSVP. Lo demás debe conservar la funcionalidad de Invitados de ONE.

## 2. Hoy — componentes de referencia
- `guest/guests-v114-integrated.html`: núcleo conservado de ONE, con resúmenes, alertas «Necesita tu atención», menús pendientes y mesas sobreaforadas.
- `guest/guests-production-ops.js`: tarjeta «Envíos y respuestas» y «Ver nuestra invitación» en solo lectura.
- `guest/guests-home-rsvp-status-v1.js`: compara los envíos y respuestas, muestra cambios de asistencia, menú, acompañante, alergias, transporte, alojamiento y respuestas personalizadas; consulta marca temporal de «leído».
- `guest/guests-seating-v2.js`: registra movimientos y reasignaciones a mesa en `meta.todaySeatChanges`.
- `guest/guest-visual-hoy-invitados-v1.js`: estilo móvil de avisos, resumen y «Marcar como leído».
- Fuentes remotas activas: `guest-rsvp` v6, `guest-state` v2, `guest-event-state` v2 y `guest-event-invite` v2. Se verificaron con el conector de Supabase **sin acceder a información personal de parejas**.

### Hallazgos y ajustes
**H1 | Notificaciones ausentes o incompletas según montaje de panel.** El render original de cambios dependía de que existiera la tarjeta `#wsdRsvpHome`; si el núcleo recreaba la vista, podía no renderizar notificaciones hasta que otra capa reinsertase la tarjeta. **Candidato corregido:** generación de notificaciones independiente del montaje de la tarjeta.

**H2 | Varias respuestas de la misma persona se reducían a la última.** La lógica histórica guardaba una sola notificación por `guest_key`; si una persona confirmaba, rectificaba y volvía a confirmar, desaparecían avisos intermedios aunque no se hubiesen leído. **Candidato corregido:** inspeccionar el historial reciente de cada destinatario, ordenar cronológicamente, mostrar inicialmente cinco y permitir «Ver todas», con contador total (máximo de representación 60).

**H3 | Eventos extra/preboda no figuraban en el buzón de Hoy.** El backend `guest-event-invite` devuelve respuestas individuales por unidad y `responded_at`, pero el cliente de Hoy solo inspeccionaba `guest-rsvp` y movimiento de mesas. **Candidato corregido:** integrar los últimos estados de invitaciones específicas de eventos activos, sin duplicar listas ni formularios. Consulta solo lectura, máximo 15 eventos, cada 60 segundos/dispositivo; no genera envíos ni cambia respuestas.

**H4 | Notificaciones no son push.** El sistema es un **buzón interno en Hoy**, con actualización al abrir, enfocar y consultar periódicamente; no existen promesas certificadas de notificaciones del sistema operativo, email automático o WhatsApp automático.

**H5 | Acciones pendientes parcialmente visibles.** El núcleo muestra como máximo **3** tarjetas de «menú pendiente» y **2** de «mesa sobreaforada» aunque el contador puede informar de más. No se deben confundir las tarjetas visibles con el total. **Pendiente P1:** visualización de todas las incidencias o enlace para expandir la lista; realizar modificación de la capa GUEST sin alterar el núcleo de ONE.

**H6 | Ventana y límites.** Solo se presentan cambios de los últimos **7 días** y como máximo 60 entradas en cliente. `guest-rsvp` devuelve como máximo las 500 últimas respuestas. Los pendientes de RSVP permanecen contabilizados en el resumen, pero el historial no es un archivo perpetuo. **Pendiente P1:** definir política comercial de retención y consulta histórica, especialmente para bodas con grandes listas.

**H7 | Marcar como leído.** Se almacena `meta.todayRecentChangesReadAt` dentro del estado de la boda. Un segundo móvil con licencia real debe recibir esta fecha mediante `guest-state`; el código está implementado, la regresión de navegador es satisfactoria, pero sigue **pendiente prueba de dos móviles físicos reales**.

## 3. Ajustes y compartir con la pareja
- Fuente real `guest/guest-settings.html`. El modo de compartir no se relaciona con «Enviar invitaciones» a los asistentes.
- Backend real **`guest-license-access` v5 ACTIVE**; el estado `role`, `partnerJoined` se consulta mediante token del miembro, y el enlace `action:'invite'` solo lo puede emitir el titular **primary**. Caduca a los **7 días**. El backend exige una licencia válida y una invitación final entregada para activar acceso; el segundo miembro se une con su token propio.
- **A1, defecto UX confirmado:** los botones «Invitar a mi pareja» y «Copiar invitación segura» estaban ocultos por defecto (`hidden`) y se mostraban solo después de validar titular sin pareja. Desde la vista de una pareja vinculada o con red fallida parecía que la funcionalidad no existía.
- **Candidato corregido:** apartado explícito «Compartir GUEST con tu pareja», botones **siempre visibles** (habilitados solo con estado/rol correctos), explicaciones diferentes para titular sin pareja, pareja conectada, acceso de segundo miembro, sin licencia o fallo de conexión. Se bloquea cualquier creación de enlace sin autorización verificada.
- Se preserva el uso de `access.html?invite=...` para la unión de la segunda persona. No se crea enlace para invitados de boda desde este apartado ni se facilita la URL mediante una licencia ficticia.
- En la DEMO aislada, controles de compartir **visibles pero deshabilitados** porque no existe licencia real; se explica para evitar confusión en capturas.

## 4. Diseño, navegación y temas
- Cinco temas documentados: Nordic, Blush, Arena, Slate, Editorial. `guest/guests-production-ui.js` aplica `weddly_personal_theme_v51`, pero la capa posterior `guest/guest-visual-premium-v1.js` contiene valores de marca predeterminados y puede imponerse en pantalla.
- **D1, defecto real de CSS comprobado por Chromium:** el almacenamiento mostraba `blush` y la variable raíz el color Blush, pero el botón activo de la barra inferior recibía el fondo `soft` por una regla genérica cargada después. Una corrección superficial del tema no es suficiente.
- **Candidato corregido:** la capa premium lee la paleta seleccionada y usa precedencia explícita `#nav button.on` para el fondo activo. La prueba de ida y vuelta Ajustes → otro tema → GUEST se añade a Chromium; registrar el resultado final, no dar PASS antes de verlo.
- **D2, ruta antigua desviada:** `guest/guests.html` redirigía a `guests-v116-production.html`, que no incluye las tres capas visuales añadidas al `guest/index.html` canónico. También mantenía un título heredado. **Candidato corregido:** redirección al `guest/index.html` canónico, preservando parámetros y hash.
- La PREVIEW de capturas ya utiliza una sola navegación de GUEST y no el menú superior duplicado; las capturas son muestra, no clientes reales.

## 5. Otras áreas comprobadas y límites de la auditoría
| Componente | Evidencia / resultado |
|---|---|
| Grupos, subgrupos, unidades de invitación, alta/importación | Código genuino extraído de ONE. Regresión B6.2 aprobada en Chromium en rama aislada. |
| Mesas y plano interactivo | Núcleo original, `guests-seating-v2.js`, parches de multiselección. No tocar ONE. |
| RSVP privado y respuestas automáticas | Edge `guest-rsvp` v6 ACTIVE con lectura `manage=1` y consultas limitadas al miembro autorizado. E2E público de producción pendiente. |
| Invitación premium principal | No editable por pareja; `active_for_member` y enlace aprobado requerido. La venta y entrega final requieren prueba TEST completa. |
| Eventos, preboda, invitaciones y respuestas propias | Edge `guest-event-state` v2 y `guest-event-invite` v2 ACTIVE, código y tests existentes. Nuevo candidato notifica confirmaciones en Hoy. |
| Tareas, presupuesto y pagos de eventos | **DESVIACIÓN de paridad ONE**: `guest-events-product-v1.js` los oculta aunque el motor los conserva; existe corrección candidata separada en rama `guest-one-parity-verification-2026-10-21`. No fusionar sin actualizar tests contradictorios de alcance. |
| Listados PDF/CSV y control documental | `guests-copy-control-v1.js`: revisión, nº copia, marca de entrega, historial; existe en GUEST real y quedó excluido incorrectamente de DEMO antigua. |
| Dos móviles y sincronización | `guests-production-sync.js` implementa merge/resolución de conflictos; hay regresiones sintéticas. Falta ensayo de aceptación en dos móviles físicos. |
| Seguridad de acceso, licencia y compartir | Supabase funciones ACTIVE; backend confirma primary/partner e invitación temporal. No se generó un enlace real en este trabajo. |
| Compatibilidad 320/390/430 px | B7.2 Chromium aprobado en rama aislada para Hoy/Invitados. No equivale a QA en Android/iOS físico. |
| Página comercial, selección de diseño, Stripe, correo, entrega | No se activan ventas; no se verificó pago real, correo externo, recepción final ni licencia de un pedido de cliente. Estado NO_GO. |

## 6. Evidencia de pruebas, publicación y aislamiento
- Rama canónica de producto `guest-independent`: `GUEST Independent QA` ejecución [39724544951](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39724544951), **SUCCESS** en commit documental `b2a7476...`; continuidad `39724544968` también SUCCESS. Son controles automatizados, **no** validación comercial real.
- Rama de auditoría aislada: [39736279966](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39736279966) **SUCCESS** para B6.2, B7.2 a 320/390/430, notificaciones múltiples, leído y controles de compartir en estados de autorización. Se añadieron después nuevas pruebas para temas y preboda; se debe consultar el run final y sus logs antes de declararlo verde.
- Archivos funcionales intervenidos **solo en rama aislada**: `guest/guest-settings.html`, `guest/guests-home-rsvp-status-v1.js`, `guest/guest-visual-premium-v1.js`, `guest/guests.html`.
- Pruebas nuevas: `guest/qa/hoy_notification_history_browser_2026_10_22.cjs`, `guest/qa/hoy_sharing_settings_browser_2026_10_22.cjs`, `guest/qa/theme_premium_browser_2026_10_22.cjs`; CI solo auditoría: `.github/workflows/guest-hoy-sharing-audit-2026-10-22.yml`.
- GUEST comercial en `guest-independent` **no ha incorporado estas correcciones**; ONE, STUDIO y backend no se han modificado. Cloudflare puede publicar PREVIEW de la rama, pero no se sustituye producción.

## 7. Priorización y puerta de salida
**P0 antes de usar esta corrección en producción:** obtener PASS conjunto de tests de Hoy, compartir, preboda y temas; verificar sin regresiones el acceso real y el funcionamiento físico; trasladar a `guest-independent` con QA independiente y revisión de cachés.

**P1:** ampliar alertas de menú/sobrecapacidad más allá de 3/2; política de conservación de notificaciones; resolver con decisión de producto la ocultación de tareas/presupuesto/pagos de eventos frente a ONE; rutas heredadas de `guests-v116-production.html`.

**P0 comercial fuera de esta intervención:** completar dos recorridos TEST íntegros compra→cuestionario→aprobación→entrega→dos accesos→envío→RSVP→mesas/listados/eventos, sin intervenciones manuales técnicas; únicamente entonces considerar activación de venta.

**No se ha enviado correo, creado pedido real, tocado licencias ni consultado datos privados de parejas.** 
