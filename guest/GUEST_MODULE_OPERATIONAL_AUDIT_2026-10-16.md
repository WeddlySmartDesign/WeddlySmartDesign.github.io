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
8. **Onboarding de pareja:** cuando se entrega, mostrar «Vuestra invitación» como enlace/entrada principal, «Añadir invitados» y «Enviar» con el mismo diseño ya fijado; guiar primera lista, grupos, unidades, envíos y respuesta. Reutilizar todo el motor. Verificar la UX real de correo y app, evitando texto técnico.
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
