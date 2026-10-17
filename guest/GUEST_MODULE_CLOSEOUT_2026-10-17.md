# GUEST · Cierre del módulo sin archivos de diseño · 17/10/2026

**Fuente de verdad:** rama exclusiva `guest-independent`; punto de partida `05aa01f6f5e0256f8212ad6e4cd707063261fd5e`. NO tocar ONE, ONE Partner, STUDIO ni los masters visuales. Este informe complementa `guest/GUEST_MODULE_OPERATIONAL_AUDIT_2026-10-16.md` y la sección 9 de `guest/GUEST_PRODUCT_DIRECTION_CANONICAL_2026-10-07.md`.

## Decisión comercial INALTERADA
Se compran **diseños individuales**, no colecciones Essential/Signature ni un editor. Compra → cuestionario → producción propietaria → revisión propietaria → revisión/aprobación pareja → entrega final en 48–72 horas → **solo con esa entrega**, acceso a GUEST. Dentro de la aplicación cliente puede ver y ENVIAR la invitación aprobada y gestionar RSVP, invitados, grupos/subgrupos/unidades, mesas, listados, avisos, extraeventos y dos móviles sincronizados. **No puede modificar invitación ni configurar preguntas del formulario RSVP.**

## Fallos encontrados y reparados SIN recibir un solo diseño
1. **Botones de envío realmente activos:** `guest/guests-rsvp-operations-v3.html` aún ofrecía WhatsApp y «Copiar enlace» a una plantilla RSVP antigua. Esos dos caminos (incluyendo funciones `publicLink`, `copyInvite`, `sendWA`) se eliminaron. Cada destinatario usa un único botón `wsdrf-share` que abre `guests-rsvp-share-composer-v3.js` y crea un enlace al **diseño comprado y aprobado** mediante `active_for_member`. Se conservan familias, mensaje de WhatsApp personalizable, compartir/copy y registro manual de enviado.
2. **Fallo cerrado de enlaces finales:** `guests-catalog-invitation-bridge-v1.js` consulta backend en cada intento de envío (no confía en caché de una entrega previa); exige token RSVP y destinatario/unidad; rechaza URL sin HTTPS, con credenciales incorporadas, relativa o de esquema inseguro. Si no hay entrega activa, caducó la autorización o hay un corte, no genera una plantilla genérica.
3. **Sin falsos «Enviada» entre móviles:** el botón de marcar enviada primero espera confirmación real de `guest-rsvp` y solo después actualiza estado local/chip. Si falla el servidor, conserva el estado previo y pide reintentar. El lanzamiento de WhatsApp NO cuenta por sí solo como envío confirmado.
4. **Cierre de entradas antiguas de edición:** además de los dos routes retirados el 16/10, las páginas `guests-rsvp-form.html`, `guests-rsvp-form-flex.html`, `guests-personalizacion-essential.html` y `guests-personalizacion-signature-integrated.html` redirigen inmediatamente al módulo GUEST. Se mantienen cuerpos técnicos en Git para auditoría/compatibilidad, pero no son rutas operativas de edición para la pareja. **Una redirección frontend no es una barrera de seguridad backend**; por ello también se protegieron las API.
5. **Autorización en servidor para pedidos del catálogo:** el endpoint aislado `guest-rsvp`, desplegado **ACTIVE v6**, rechaza `action:config` si el miembro autenticado tiene un pedido en `guest_invitation_orders` vinculado a su licencia. Protege preguntas RSVP sin bloquear confirmaciones públicas, registro manual, contactos ni estado de envío. El endpoint aislado `guest-personalization`, desplegado **ACTIVE v3**, rechaza POST de edición cuando la misma licencia está vinculada a un pedido de catálogo, conservando las lecturas GET. Ambos contrastados byte por byte con los archivos de GitHub tras desplegar. El comportamiento legado sin pedido de catálogo permanece por compatibilidad. La app no entrega credenciales antes de la invitación final.
6. **Copias exactas de retorno/rollback:** `guest/backend/guest-rsvp/ROLLBACK_LIVE_V5_2026-10-17.ts` y `guest/backend/guest-personalization/ROLLBACK_LIVE_V2_2026-10-17.ts` son los originales recuperados de los servicios v5/v2 ANTES de desplegar. Los archivos `index.ts` en esas carpetas son los sources activos v6/v3, comprobados con `get_edge_function`.
7. **Actualización de caché:** se cambian las versiones de scripts del bridge, compositor, ruta de operaciones y service worker `guest-shell-v5` para que no reaparezcan los envíos antiguos desde el móvil.
8. **Pago por diseño:** en `guest-checkout.html`, cuando existe parámetro `catalog_template`, se ocultan las selecciones Essential/Signature y se identifica el diseño individual elegido; no se cambia el precio, lógica Stripe, consentimiento ni mecanismos de cobro. Las rutas heredadas sin catálogo no se han reconvertido (seguirán fuera de la venta de los ocho diseños hasta decidir su retirada).

## Verificaciones añadidas
- `guest/qa/catalog_invitation_bridge_test.js`: ruta de envío real, sin viejos botones, esquema HTTPS, parámetros y unidad, sin enlace al revocarse la entrega o perderse red.
- `guest/qa/b7_3_invitation_rsvp_visual_test.js`: apertura de compositor en vista móvil real con backend simulado; sin editor; error remoto de «marcar enviada» NO cambia estado; éxito remoto sí.
- `guest/qa/b6_3_invitation_rsvp_test.js`: accesos directos heredados redirigen; RSVP público sigue probado.
- `guest/qa/guest_independent_regression_test.js`: paridad con ONE preservada salvo las funciones de autoría/envío antiguo intencionadamente retiradas.
- `guest/qa/b8_2_checkout_return_test.js`: catálogo individual oculta colecciones pero fija exactamente el diseño y exige consentimiento antes de crear sesión.
- `guest/tests/guest_rsvp_config_lock_contract.test.cjs` y `guest/tests/guest_personalization_config_lock_contract.test.cjs`: autorización de edición protegida en los snapshots desplegados; incorporadas a `GUEST Independent QA` y `GUEST Catalog Bridge QA`.
- `guest/qa/b9_1_deployment_pwa_isolation_test.js` valida la rotación de caché.

**Evidencia de CI a consultar para último HEAD:** `GUEST Independent QA` (matriz 31 jobs), `GUEST Catalog and Continuity QA (offline)`, `GUEST Catalog Bridge QA`. Las comprobaciones automatizadas usan simulación cuando corresponde: no certifican por sí solas una compra auténtica, Gmail/Resend efectivo, Stripe Live ni dispositivos externos. La comprobación de despliegue de Edge Functions sí fue REAL, con resultados ACTIVE v6/v3 y coincidencia exacta de source; no se hizo una mutación de datos de cliente. El E2E autenticado de rechazo de escritura de un comprador real debe certificarse posteriormente.

## Fuera del alcance / NO DECLARAR TERMINADO
- Subida, identificación e integración real de los **ocho diseños premium** (el registro actual no contiene ocho masters conectados). Veil Light, Botánica y Limoneros requieren tratarse conforme a estados visuales/certificaciones previas, sin retoques automáticos.
- Automatización definitiva `cuestionario → datos RSVP del pedido → formulario público de GUEST`. No asumir que la pantalla «configurar RSVP» sigue permitida como solución: el dueño del diseño debe aportar los campos ya definidos por cuestionario/pipeline.
- Ensayo **real** de compra y pago, recepción del correo, revisión/aprobación, entrega definitiva con licencia, envío a destinatario de unidad, respuesta automática, gestión en dos móviles físicos y trazabilidad completa. La entrega real 48–72 h requiere control operativo y plazo contractualmente confirmado.
- Verificación en Cloudflare Pages/GitHub Pages de que la versión final de la rama está publicada. Cambios GitHub no equivalen a publicación de cara a clientes. Tampoco se habilitó un catálogo de venta/8 diseños.
- Vía comercial heredada Essential/Signature todavía presente para compras sin `catalog_template`; mantener fuera del catálogo final de diseños individuales. Precio/slug comercial de cada uno de ocho diseños pendiente de la información definitiva.
- Las redirecciones front y permisos v6/v3 cubren licencias vinculadas a pedidos individuales; no constituye retirada completa de código legado ni autorización para hacer público el antiguo motor.

## Continuación desde aquí
1. Revisar el último estado CI (31 jobs), diagnosticar cualquier fallo real hasta PASS, y registrar commit/prueba. No dar PASS si los trabajos siguen pending/cancelled.
2. Completar offline/test automáticos que NO precisen diseños: entrega y acceso finales; sincronización de envío/RSVP; protección de configuración; y trazabilidad del pedido.
3. Al recibir cada master definitivo, **solo** crear/adaptar el renderer en registro/motor común sin cambiar módulos ya certificados. Para un diseño nuevo se requieren sus archivos efectivamente utilizados (HTML/JS/CSS/assets/vídeos/fuentes autorizadas) y su slug/nombre; el cuestionario común ya es contrato. Es tarea de ChatGPT integrar/validar, no de la propietaria reprogramar.
4. No publicar cobros ni declarar GO hasta dos recorridos completos sin intervención técnica y comprobación externa real.

**Aislamiento verificado:** comparación desde `05aa01f6` al código de 17/10 muestra solo `guest/**`, `guest-checkout.html` y workflows exclusivos de GUEST; ONE, ONE Partner y STUDIO no se modificaron.


## Cierre adicional: correo comercial de catálogo desplegado de verdad — 17/10/2026

Al verificar producción, la función `guest-stripe-checkout` ACTIVE v24 seguía enviando `startCatalogEmail` con la etiqueta heredada de Essential/Signature, aunque el archivo GitHub ya estaba corregido. Se contrastó contra la fuente de GitHub y se demostró que **la única diferencia de código era la redacción en ese correo del catálogo**, sin cambios a sesión Stripe, importe, validación del diseño, autorización de venta, devolución, ni checkout de legados. Se conservó copia literal de v24 en `guest/backend/guest-stripe-checkout/ROLLBACK_LIVE_V24_2026-10-17.ts`. Se desplegó **`guest-stripe-checkout` ACTIVE v25** y se releyó en Supabase: fuente **idéntica** a `guest/backend/guest-stripe-checkout/index.ts` y texto aprobado; el correo inicial comunica solo pago/cuestionario/revisión y que el acceso de gestión llega con la invitación final.

**Estado backend real confirmado:** `guest-rsvp` v6 ACTIVE (bloqueo configuración de RSVP para licencia con pedido del catálogo), `guest-personalization` v3 ACTIVE (bloqueo de edición visual para licencia de catálogo), `guest-stripe-checkout` v25 ACTIVE (correo individual sin colecciones). Se preservan los orígenes V5/V2/V24 para reversión. No se activó venta de los ocho diseños ni se envió correo de compra real en esta intervención.

**Seguridad de datos:** consulta de solo lectura a Supabase confirma RLS habilitado en las nueve tablas `guest_*` expuestas en `public`. RLS habilitado no sustituye la revisión de políticas; no se han hecho cambios de esquema ni políticas.


## Resultado de QA verificado al cierre

- **GUEST Independent QA**: run [39014686799](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39014686799), commit `16fc47cc348b347bfc2dafea157cc084e2392796`, **SUCCESS, 31/31 jobs**. Incluye B6.3 rutas heredadas y RSVP público, B7.3 nuevo compositor y error de sincronización, B8.2 checkout individual, B6.6 segundo móvil, contratos de los dos backend guards y demás componentes de gestión. Se completó antes de este apunte de documentación; el código funcional no cambia por esta anotación.
- **GUEST Catalog Bridge QA**: run [39014188387](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39014188387), **SUCCESS**, incluye contratos de autorización de edición y el recorrido de invitación del catálogo.
- **GUEST Catalog and Continuity QA (offline)**: run [39014686876](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39014686876), **SUCCESS** en el commit de código/documento anterior.
- Las funciones Supabase `guest-rsvp` v6, `guest-personalization` v3 y `guest-stripe-checkout` v25 fueron recuperadas nuevamente tras despliegue, comparadas con los fuentes correspondientes en GitHub y confirmadas ACTIVE. Estas son verificaciones reales de versión/fuente, no pruebas autenticadas de todo el ciclo de venta.

**Juicio preciso:** cierre técnico automático del módulo GUEST por ahora = **PASS**; lanzamiento y certificación comercial de los ocho diseños = **PENDIENTE**. Próximo trabajo no visual: asegurar mapeo automático del cuestionario al RSVP y flujo real de entrega/activación, sin pedir a la propietaria tareas de desarrollo.
