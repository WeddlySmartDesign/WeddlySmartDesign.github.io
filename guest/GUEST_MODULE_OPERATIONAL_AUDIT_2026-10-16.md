# GUEST — Auditoría operativa del MÓDULO (sin diseños) — 16/10/2026

**Alcance:** pedido de la propietaria: invitación como producto -> selección -> compra -> cuestionario único -> configuración del pedido -> revisión interna -> revisión/posibles cambios de la pareja -> aprobación -> entrega -> gestión de invitados dentro del MISMO GUEST (grupos/subgrupos/unidades, envío contextualizado, RSVP, mesas, avisos, listados, eventos adicionales y dos dispositivos). No revisar ni editar visuales, masters ni conectar los ocho diseños declarados por la propietaria.

**Trabajo ejecutado:** solo lectura GitHub y Supabase, más esta documentación. No se han emitido pagos, creado pedidos, modificado licencias, enviado correos, activado ventas ni modificado ONE, ONE Partner, STUDIO, ramas congeladas o masters.

## Fuentes verificadas

- GitHub rama `guest-independent`, HEAD `047d423ad34bbf86b12ec0e6ae14c5d619097c75` (último commit 12/10).
- `guest/GUEST_PRODUCT_DIRECTION_CANONICAL_2026-10-07.md`, `guest/GUEST_END_TO_END_ORDER_WORKFLOW_V1_2026-10-06.md`, `guest/GUEST_CATALOG_BRIDGE_CHECKPOINT_2026-10-07.md`, `guest/GUEST_END_TO_END_CUSTOMER_EXPERIENCE_STANDARD_2026-10-07.md`, `guest/PRODUCT_BASELINE.md`.
- QA GitHub Actions sobre HEAD: GUEST Independent QA run 38293376972 SUCCESS (incluye B6 Invitados, RSVP, Mesas, Eventos, dos dispositivos y B8 comercial); Catalog and Continuity run 38293377178 SUCCESS. **QA automatizado no equivale a una compra comercial real.**
- Supabase proyecto GUEST compartido `dnjsxequwgtyyauuofxj` ACTIVE_HEALTHY al consultar. Funciones ACTIVAS: `guest-stripe-checkout` V24, `guest-invitation-flow` V20, `guest-orders-admin` V4 (flujo legado), `guest-rsvp` V5, `guest-state` V2, `guest-license-access` V4. STUDIO proyecto separado ACTIVE_HEALTHY: no tocado.
- SQL de solo lectura, agregados de `public.guest_invitation_orders`: 8 pedidos **todos test**, 0 production, 0 con checkout. 4 Botánica entregados (1 con license_id); 1 Botánica review_sent (sin licencia); 2 VEIL LIGHT entregados sin delivery_url/license_id; 1 VEIL LIGHT designing. **0 pedidos design-03 en esta comprobación.** No se extrajeron datos personales.
- RLS habilitada en `guest_invitation_orders`, `guest_app_state`, `guest_rsvp_*`; esto no sustituye pruebas de autorización y seguridad efectivas.
- Fuentes reales de `guest-stripe-checkout` V24 y `guest-invitation-flow` V20 inspeccionadas directamente mediante conector Supabase.
- Fuentes en rama: `guest.html`, `guest-checkout.html`, `guest-checkout-return.html`, `guest-review-v1.html`, `guest/catalog-final.html`, `guest/access.html`, `guest/guests-catalog-invitation-bridge-v1.js`, `guest/guests-rsvp-share-composer-v3.js`, `guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json` y `guest/GUEST_MOBILE_CENTER_CURRENT.json`.

## DIAGNÓSTICO: motor existente frente a huecos de salida al mercado

### A. Ya construido: NO reconstruir

- Gestión de personas, listas, grupos/subgrupos, importación y unidades de invitación.
- Envío contextualizado de la invitación, mensaje personalizado, portapapeles, WhatsApp/compartir, contactos, marcado de enviado; el puente consulta `active_for_member`.
- RSVP +1, niños, menús, intolerancias, transporte, alojamiento, preguntas, cambios en Hoy.
- Mesas/plano, multiselección, listas/exportes/PDF/catering, eventos adicionales.
- Convergencia de dos dispositivos con conflictos/offline y refresco; última prueba `b6-two-device-sync` PASS en HEAD. Repetir solo ensayo real de aceptación en recorrido de comprador cuando se permita, no reconstruir.
- Backend `guest-invitation-flow` implementa `create_paid`, cuestionario, fotos, etapa designing, `send_review`, respuesta de pareja, `deliver`, `public_load`, `active_for_member`. `guest-stripe-checkout` V24 implementa pasarela de compra catalogada + idempotencia y envío enlace único de cuestionario. Técnicamente existe, **no hay transacción comercial integral verificada**.
- Entrega en `guest-invitation-flow` exige aprobación previa y licencia y acceso en producción. Incluye CTAs de invitación y acceso a gestión. Un pedido final tiene URL estable y misma licencia.
- GUEST no es parte de ONE ni STUDIO.

### B. Bloqueos de salida (P0)

1. **Ruta comercial orientada a diseños individuales:** fuente `guest.html` en rama todavía publicita colecciones Essential/Signature y su galería histórica. El checkout contempla `catalog_template` / `catalogTemplateId`, pero no se ha verificado publicación de una oferta por diseño individual ni acoplamiento end-to-end de selección y compra. La propietaria dispone de 8 diseños visuales; se audita el módulo SIN integrarlos. Más adelante el identificador/versión seleccionado debe quedar fijado desde catálogo a Stripe, licencia y pedido. No mezclar con un diseño de invitación.
2. **Identidad comercial incoherente:** Edge `guest-stripe-checkout` V24 sigue construyendo etiquetas y email de confirmación `GUEST Essential` / `GUEST Signature` (`labelFor`, `startCatalogEmail`); usa solo los precios internos asociados a dos editions. La compra visual debe mostrar nombre real del diseño y precio elegido, no categorías antiguas. Si se desea precio individual distinto, separar precio por ID de plantilla con control server-side; no inventar precios.
3. **Sin E2E de pago real a pedido operativo:** SQL real registra **0 production** y **0 checkout_session_id** en `guest_invitation_orders`. No se puede certificar todavía: compra Stripe -> provisión de licencia -> creación automática del pedido de plantilla fijada -> correo cuestionario -> relleno/fotos -> cola de propietaria. Probar primero entorno de pago seguro/test y después autorizar producción explícitamente, sin cargos ni emails no consentidos.
4. **Aprobación y entrega reales a cliente, sin intervención técnica:** confirmar de punta a punta revisión interna con datos inyectados, envío del enlace privado de revisión, petición de cambios, guardado de nueva configuración, aprobación explícita, entrega estable por HTTPS y email recibido. El backend tiene acciones/guardas; los E2E realizados son TEST y no sustituyen un pedido de producción. Confirmar además durabilidad de medios, caducidad de enlaces, reenvío/idempotencia y no mostrar datos de un pedido a otro.
5. **Activación de GUEST y envío de la invitación realmente comprada:** `active_for_member` selecciona pedido entregado por la misma `license_id` y el compositor utiliza su `delivery_url`; la conexión está implementada y hubo evidencia TEST con licencia. Pero falta un E2E nuevo **pagado/licenciado** hasta envío a destinatarios reales de prueba y respuesta persistida, incluyendo aceptación de la 2.ª persona autorizada. Riesgo de UX real: el puente vuelve al enlace RSVP legado si el catálogo no está activo/no se puede resolver; para compradores de invitación concreta, bloquear envío de un diseño erróneo y mostrar «invitación pendiente» o «reintentar» en lugar de enviar una invitación distinta sin explicación.
6. **Activación/publicación controlada:** la rama `guest-independent` y Cloudflare stage/pruebas no equivalen automáticamente a catálogo comercial publicado, revisión y final navegables para compradores. Verificar públicamente bajo el mismo origen configurado `GUEST_CATALOG_PUBLIC_ORIGIN`: `/guest/catalog-questionnaire.html`, `/guest-review-v1.html`, `/guest/catalog-final.html`, acceso `/guest/access.html`, endpoints seguros y herramientas operativas privadas; conectar ruta comercial solo tras autorización. No asumir valor de secreto sin observar su comportamiento.

### C. Pendientes de consolidación (P1, sin reconstrucción)

7. **Un solo Centro de producción mantenible:** el Centro GUEST Android fue validado con Botánica embebida y retorno a menú. El contrato de registro genérico `guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json` aún tiene `src:null` para Botánica y design-03; NO confundir el Centro Android embebido con visor genérico remoto desplegado. Resolver una vez la entrada de diseños futuros sin cambios por pedido, cuando llegue la fase de conexión visual. En `guest/GUEST_MOBILE_CENTER_CURRENT.json` aparece V4.3 (07/10), mientras los checkpoints acreditan Android V4.9: **puntero documental desactualizado**, hay que actualizar con versión/copia SHA verificadas para evitar reinstalar la antigua.
8. **Activación exclusivamente con entrega final (aclaración de la propietaria, 16/10):** la pareja paga la invitación y cumplimenta el cuestionario; WeddlySmartDesign la prepara y revisa; la pareja aprueba; dentro del plazo comercial máximo establecido de 48–72 horas se realiza la entrega final, y **solo entonces** se entrega el acceso a GUEST con la invitación terminada y asociada. **No hay acceso anticipado ni fase «invitación en preparación» dentro de GUEST; no implementar ese estado.** En la primera entrada tras la entrega, mostrar «Vuestra invitación», «Añadir invitados» y «Enviar» con el diseño ya fijado. Reutilizar el motor existente. Verificar en un E2E que el correo de pago/cuestionario no incluye ni revela acceso operativo y que la entrega final sí facilita el acceso a ambos miembros según el flujo previsto.
9. **Prueba final comercial y recuperación:** ejecutar dos pedidos íntegros diferentes con licencia y medios, reintentos, segunda corrección, rechazo/aceptación, respuesta sí/no, gestión desde dos dispositivos y retorno a mesas/listas/eventos. Aislar fixtures TEST de compradores y comprobar seguridad/RLS/autorización. Medir revisión humana objetivo <=5 minutos, sin que esto bloquee crear módulos nuevos.
10. **Documentación de verdad única:** cronología extensa `START_HERE.md` y `GUEST_PROJECT_STATUS_V1.json` contiene checkpoints históricos ya superados y bandera de cierre de diseños contradictorias; separar tablero del motor/comercial de puertas artísticas de cada plantilla. Ocho diseños visuales declarados por propietaria; registro técnico actualmente muestra 3 IDs, porque no se han conectado todos. No convertir «5/6 diseños» de la política histórica en trabajo de desarrollo del módulo.

## Orden de ejecución propuesto (sin tocar los diseños)

- **Bloque 1, UX y contrato comercial:** ruta diseño individual -> checkout -> nombre correcto -> plantilla/version/precio inmutables -> un cuestionario. Mantener ventas bloqueadas.
- **Bloque 2, continuidad de pedido:** 2 ejecuciones autorizadas de pedido sin cargo real, con mail de cuestionario, producción autónoma, revisión, cambios, aprobación y entrega.
- **Bloque 3, gestión conectada:** licencia de la pareja, acceso principal/secundario, invitación final en GUEST, envío a persona/unidad, RSVP escrito a `guest_app_state`, mesas/listas/eventos/avisos.
- **Bloque 4, endurecimiento y lanzamiento:** resolver fallback erróneo, estados de error, textos/customer onboarding, consolidar Centro actual y ensayar caso real completo; únicamente después conectar los diseños validados y autorizar publicación/Stripe.

## Criterio de listo del MÓDULO (no de diseño)

Un comprador ficticio autorizado selecciona un diseño permitido; pago TEST verificado origina un pedido vinculado a esa licencia, correo y cuestionario; datos se cargan automáticamente; propietaria revisa sin editar código; pareja pide cambio o aprueba; se entrega URL final estable; ambos miembros abren la misma gestión; al enviar desde GUEST se comparte **esa** invitación con contexto de destinatario; RSVP sí/no aparece en gestión y sincroniza ambos dispositivos; menús/mesas/listados/extra-eventos siguen igual. Ningún paso ordinario debe necesitar intervención técnica. El sistema rechaza venta de diseños no certificados. Sin prueba completa no declarar GO.

**Fuera de alcance en esta auditoría:** aspecto de invitaciones, sus masters, 8 diseños todavía no conectados, publicación o activación de venta, costes nuevos, STUDIO, ONE o Partner. No afirmamos valor actual de secretos ni comportamiento de pagos/compras no probados.


## Rectificación expresa de alcance — 16/10/2026

La propietaria corrigió una sugerencia de la auditoría: **la pareja no puede usar GUEST antes de recibir la invitación terminada**; GUEST se habilita con la entrega final, posterior a revisión y aprobación, dentro del compromiso de entrega de 48–72 h. Se retira como trabajo pendiente el estado «invitación en preparación» y cualquier acceso de pareja anterior a la entrega. El backend puede provisionar internamente la licencia durante la compra, pero su existencia técnica NO debe equivaler a dar acceso a la pareja: el correo inicial entrega exclusivamente el cuestionario y la comunicación de acceso se produce exclusivamente con la entrega final. Esta rectificación prevalece sobre cualquier recomendación anterior contradictoria de esta auditoría.


## Intervención técnica sobre el módulo — 16/10/2026

### Contrato definitivo de acceso

1. La pareja compra **un diseño individual** de invitación, no un editor.
2. Recibe cuestionario y WeddlySmartDesign personaliza, revisa y presenta el resultado para aprobación.
3. La entrega final de invitación aprobada se produce en el plazo comercial comprometido de **48–72 h**. **El acceso a GUEST se comunica solamente en esa entrega final.** No existe un cliente que abra GUEST con la invitación pendiente.
4. En GUEST la pareja **no diseña ni edita la invitación** y **no configura ni edita el formulario/preguntas RSVP**. Sí crea/importa grupos, subgrupos, invitados, unidades, envía la invitación final, registra y consulta confirmaciones y cambios manuales, asigna mesas, avisos, listados, eventos extra, tema visual de la aplicación y segundo dispositivo sincronizado.

### Hallazgos reales y correcciones realizadas (rama exclusiva `guest-independent`)

- `guest/guests-production-ops.js`: quitados dos botones heredados «Editar invitación» del panel Hoy y paso de Envíos y respuestas; un único botón lleva al trabajo de envíos/respuestas. No se modificaron motor de invitados, mesas, listados ni gestión manual del RSVP.
- `guest/guests-rsvp-operations-v3.html`: eliminado acceso «Editar invitación» desde cabecera de Envíos y respuestas; el envío y el registro manual conservan sus funciones.
- `guest/guests-rsvp-operations-flow-v1.js`: retirado asistente cliente «Invitación → RSVP → Enviar», inaplicable a una invitación comprada y ya entregada; no se reimplementa el editor.
- `guest/guests-rsvp-design-manage.html` y `guest/guests-rsvp-form-flow.html`: rutas antiguas de edición ahora muestran información y retorno a GUEST, incluso mediante enlace directo. El resto de artefactos fuente/QA heredados siguen versionados sin integrarse en el flujo comercial actual; **su presencia en Git no significa que se vendan ni formen parte de la experiencia de pareja**.
- `guest/guests-catalog-invitation-bridge-v1.js`: si el backend no devuelve invitación final activa, `buildRecipientUrl` falla y **no recurre al diseño RSVP heredado**.
- `guest/guests-rsvp-share-composer-v3.js`: eliminado fallback manual al HTML de antigua invitación; el enlace se exige al bridge del diseño final, se mantienen destinatarios/unidades, mensaje personalizable, WhatsApp/compartir y marcado de enviado; ante error no entrega enlace y solicita reintento.
- `guest/guests-rsvp-operations-live.html`: quitada carga del sender anterior `guests-rsvp-share-primary-v1.js`, que podía competir con el compositor y generar URL de invitación antigua. El archivo legado no se borra de la historia del repositorio.
- Tests: `guest/qa/b6_3_invitation_rsvp_test.js`, `guest/qa/b7_3_invitation_rsvp_visual_test.js`, `guest/qa/b7_2_hoy_invitados_test.js`, `guest/qa/b7_6_global_desktop_accessibility_test.js`, `guest/qa/catalog_invitation_bridge_test.js`, `guest/qa/guest_independent_regression_test.js` adaptados para comprobar **ausencia** de editores cliente, preservar RSVP público, UX móvil, envío y fail-closed. Los contratos históricos de portabilidad de ONE solo se exceptúan para esas dos rutas deliberadamente retiradas, no para el motor RSVP.
- Dirección canónica corregida en `guest/GUEST_PRODUCT_DIRECTION_CANONICAL_2026-10-07.md`, sección 9, como regla que prevalece sobre documentación antigua.

### Alcance, limitaciones y siguiente puerta de salida

Estos cambios son de **código en GitHub**, no constituyen por sí mismos un despliegue Cloudflare/Pages, una compra real, una entrega real al cliente ni una certificación de producción. No se activó Stripe, no se usó email de cliente, no se creó un pedido de pago y no se tocó ONE, ONE Partner ni STUDIO. Las fuentes de editor antiguas siguen existiendo como artefactos de paridad/versión y no deben ser enlazadas ni utilizadas por la interfaz comercial. Una retirada de todos los archivos históricos o un cierre del permiso backend de configuración RSVP requiere revisar dependencias del motor, sin convertir esa migración en requisito de rediseño visual. **Ningún producto se declara a la venta con estos cambios.**

QA posterior a los cambios: consultar los workflows GUEST Independent QA, Catalog Bridge QA y Catalog and Continuity QA del último HEAD; registrar resultado de la ejecución concreta y no asumir PASS a partir de pruebas anteriores.


### Mejora postentrega — visualización de invitación sin edición (16/10, continuación)

Comprobación funcional adicional: en el motor de invitados no existía el acceso principal **«Ver nuestra invitación»**, pese a que la invitación final debe acompañar siempre a GUEST. Se ha incorporado en la tarjeta de Hoy **exclusivamente en modo lectura** junto a «Abrir envíos y respuestas»:

- `guest/index.html` y `guest/guests-v116-production.html`: cargan el resolver existente `guests-catalog-invitation-bridge-v1.js` antes de las operaciones.
- `guest/guests-production-ops.js`: el botón **Ver nuestra invitación** llama a `fetchActive(true)`, que resuelve **solo** el `shareBaseUrl` de la invitación entregada desde `active_for_member`; nunca abre un editor ni acepta diseño/URL configurado manualmente. Si no se recupera, comunica incidencia y no abre ninguna invitación heredada.
- `guest/qa/b7_2_hoy_invitados_test.js` y `guest/qa/catalog_invitation_bridge_test.js`: prueban presencia y tamaños de los 2 controles válidos, eliminación de CTA de edición, enlace resuelto desde backend y fail-closed del envío.
- `guest/index.html`, `guest/guests-v116-production.html` aumentan la versión de `guests-production-ops.js` para evitar caché de botones anteriores. `guest/guest-sw.js` rota caché local `guest-shell-v3` → `guest-shell-v4`.

**Corrección QA de regresiones de aserciones antiguas:** `guest/qa/guest_independent_regression_test.js` exceptúa el asistente deliberadamente retirado de paridad de código con ONE (sin relajar la paridad del resto), y las páginas de retorno de antiguos editores incorporan foco de teclado visible de 3 px. Se comprobó que los trabajos CI anteriores al cambio final identificaron y permitieron aislar estos desajustes, y **no se debe declarar matriz final PASS hasta comprobar el job del último commit**.

**Comprobación del requisito acceso SOLO en entrega:** el correo inicial `startCatalogEmail` del backend de compra remite únicamente al cuestionario (no incluye enlace de activación); el enlace a GUEST figura en el correo de entrega `deliver` de `guest-invitation-flow`. La licencia puede provisionarse internamente durante la compra pero ello no comunica acceso previo. Esta garantía debe reproducirse en el E2E comercial real pendiente; no confundir inspección de fuente con certificado de correo en producción.


### Certificación automatizada del módulo — 16/10/2026

**Ejecución verificada:** `GUEST Independent QA` (GitHub Actions run `38868392864`), rama `guest-independent`, commit de producto y pruebas `3dffdee53f0e42db238ca0b4c15f9120823c94e2`: **SUCCESS, 31/31 jobs concluidos sin fallos**. URL de evidencia: https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38868392864 . El workflow **GUEST Catalog and Continuity QA (offline)** del mismo commit `38868392918` completó SUCCESS. El workflow **GUEST Catalog Bridge QA** del commit `edf527ec458d209cd77c78d83b47bd4e4a168827` (último cambio de contratos del bridge, antes de ajustes de versiones y aserciones) completó SUCCESS, run `38867923392`. Estas pruebas son de repositorio/contrato/navegador con backend simulado cuando corresponde; no son evidencia de un pedido real.

**Corrección final de test:** `guest/qa/b6_2_today_guests_test.js` deja de exigir la etiqueta antigua «Gestiona el RSVP» y acepta el texto «Envía y gestiona las respuestas» que corresponde a la invitación ya aprobada; no altera motor ni envío. Se verificó que la nueva expectativa se encuentra en el commit PASS indicado arriba.

**Estado operativo que puede declararse:** interfaz del módulo GUEST con funcionalidades de gestión preservadas, sin edición de invitación ni de formulario RSVP accesible en las rutas cliente del flujo, botón read-only de invitación final, protección de envío contra fallback, y pruebas automatizadas PASS. 

**Lo que NO se puede declarar aún:** despliegue Cloudflare del último commit, integración efectiva de los ocho diseños individuales, precios/nombres comerciales definitivos, producción y entrega de un pedido pagado auténtico, paridad visual externa en móviles reales ni certificación comercial de extremo a extremo. No se ha efectuado ningún cobro ni activación. Los ficheros legados de editor se conservan en el repositorio para referencia/paridad; las rutas expuestas al cliente se han clausurado, sin eliminación física exhaustiva de todos los artefactos de origen.
