# GUEST — fase 4: visor VEIL LIGHT unificado en preproducción, sin venta
Fecha: 20/10/2026. Rama exclusiva `guest-independent`.

## Continuidad comprobada — NO volver a empezar por diseños Claude
Prevalece sobre fase 3 únicamente para el avance técnico descrito aquí. Conserva los hechos de `GUEST_AUDIT_CONTINUITY_PHASE3_VERIFIED_2026-10-20.md`.
- GUEST tiene **15 diseños distintos potenciales**: VEIL LIGHT, BOTÁNICA y 13 Claude D04–D16. Conserva además `design-03`, Limoneros histórico *incorrecto*, exclusivamente para pruebas y archivado; D09 es el Limoneros candidato distinto y no se confunden.
- GitHub CI de Claude 13/13 móvil y 32/32 trabajos completos ya superado en fase 3; no rehacer. 6 funciones GUEST ACTIVE en Supabase, V21/V26 checkout según lectura phase 3, sin nuevos despliegues.
- Paquete CI **real** de 15 entradas iframe (BOTÁNICA + D03 histórico + D04–D16), obtenido desde GitHub Actions run `39404436794`, artifact `12256198854`, SHA256 GitHub artifact `ae91e6f567902c1c254a312c4106d897a7182daa31806826ff985f04421fa37b`; no implica Cloudflare publicada.
- Paquete de VEIL recuperado de Biblioteca `/GUEST by WeddlySmartDesign/GUEST_VEIL_LIGHT_DELIVERY_PACKAGE_STAGING_2026-10-20.zip`, originalmente 10 medios. Piloto fuente congelado SHA256 `977d275d22c609aeb87c88115f6deca6ab2cfd32bd7487c6f4b425e2ae3e0440`; HTML piloto derivado SHA256 `8f09e6bb3c0d975108b8c985266eadf339c11bedc50abd189445af040714ad30`. Los diez medios cotejados con el manifiesto.
- Se ha construido **copia DERIVADA y SOLO TEST** con `GUEST_APPLY_CONFIG` en un iframe del mismo origen, delegando en `VEIL_APPLY_CONFIG`, sin tocar máster ni activos artísticos, manteniendo oculta demo hasta hidratar los datos. SHA256 del HTML derivado `2d5041e3722000a0d307b3392c82ad1cad42df8ef8e329b4989662b33578f899`. Los 5 scripts de la copia pasaron `node --check`; integridad original de media y ZIP PASS. **La prueba visual real del nuevo adaptador NO está certificada**: el navegador de este entorno bloqueó las rutas de prueba.
- Nuevo `guest/tools/merge_veil_stage.cjs` integra el piloto extraído en el paquete estático de preproducción ya creado por `guest/tools/build_catalog_static_preview.cjs`; valida SHA256 originales, el manifiesto y los 10 medios, exige `PREPRODUCTION_DO_NOT_SELL`, actualiza solo los registros de la COPIA de staging, no la rama canónica, ni el máster.
- Nueva suite `guest/tests/veil_stage_fail_closed_2026_10_20.test.cjs` prueba ejecución sin fuente, fuente manipulada, stage sin modificar y prohibición de pisar originales; añadida a `.github/workflows/guest-independent-qa.yml`.
- Integración **real de archivos estáticos** en entorno local de la muestra CI: **16 entradas técnicas**, 120 archivos registrados y **120/120 SHA256 y tamaños PASS**, `commercialApproved=false`, `PREPRODUCTION_DO_NOT_SELL`, 15 candidatos + D03 archivado. GUEST final ya tiene loader verificado con token `p`, host iframe común y guardas TEST en frontend/backend; integración offline **no es despliegue Cloudflare ni prueba de compra**.
- El ZIP local completo de 269 MiB no pudo subirse como artefacto estable a ChatGPT; usar el artifact GitHub anterior + ZIP VEIL de Biblioteca + herramienta del repositorio. No anunciar descarga del paquete completo ni fingir instalación remota.

## Estado a fecha de esta fase
**PREPRODUCCIÓN ESTÁTICA UNIFICADA EN LOCAL: PASS / BLOQUEO DE COBRO: ACTIVO / VENTA: NO_GO.**

La prueba de GitHub Actions independiente para el nuevo test se puede comprobar en la página de ejecuciones de la rama: https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/workflows/guest-independent-qa.yml . No elevar estado de CI hasta ver éxito real de la nueva ejecución.

## Bloqueos técnicos y comerciales reales, sin retrabajar lo aprobado
1. **Cloudflare**: publicación TEST-only de los assets D04–D16 + nuevo VEIL, comprobación HTTPS exacta SHA256 de 120 archivos / sin indexar / no pagos. No hay API de gestión Cloudflare disponible desde este chat; la instalación actual comprobada solo incluye Botánica y Limoneros D03 TEST.
2. **E2E auténtico** de 2 pedidos de prueba aislados: checkout Stripe TEST sin cobros reales, cuestionario, revisión propietaria y de pareja, aprobación, correo enviado y recibido, entrega token `p`, acceso del centro GUEST *solo después de entregado*, datos RSVP procedentes del cuestionario, RSVP sí/no persistidos y dos teléfonos físicos sincronizados. No certificar simulaciones como producción.
3. **Identidad visual**: cotejar D09 Claude con la versión correcta de Limoneros antes de admitirlo, conservar D03 incorrecto bloqueado; aprobación de cada candidato por propietario.
4. **Derechos y contrato**: acreditar licencias comerciales originales de vídeos Recraft (según plan en fecha de creación), fuentes/música, uso de cada recurso; concretar precios por diseño y legales. No inventar licencia al ver archivos ni levantar precios o checkout sin decisiones.
5. **Tienda individual / distribución**: el escaparate actual está en `noindex` y textos históricos Essential/Signature; no abrir indexación ni campañas ni cobros antes del E2E y revisión comercial.
6. Verificar en Android real el adaptador VEIL, no solamente `node --check` y empaquetado estático.

## Procedimiento seguro de siguiente ejecución, sin inventar herramientas
- Descarga autorizada del artifact GitHub `12256198854` y extracción del ZIP de VEIL de Biblioteca; aplicar `node guest/tools/merge_veil_stage.cjs --source /ruta/extraida --stage /ruta/preproduccion` sobre un directorio preproducción descomprimido y todavía **sin VEIL**. Nunca aplicar sobre Git canonical ni sobre original de VEIL.
- Revisar el manifiesto y confirmar 16 entradas técnicas, 120/120 checksums y `PREPRODUCTION_DO_NOT_SELL`.
- Solo en hosting GUEST de prueba con acceso autorizado, publicar e inspeccionar recursos y conexión a `catalog-final.html`; sin activar ventas. Entonces E2E contra TEST con identidades ficticias y derechos/precios antes del GO.
- ONE/Partner/STUDIO intactos. La app de pareja **no** edita invitación ni formulario RSVP; se fijan en cuestionario y la gestión solo aparece después de entrega.

## Nota de honestidad
Esta fase constituye un avance real técnico y documentado de integración, **no** termina por sí sola el funcionamiento comercial de GUEST. Ningún pago/producción ha sido habilitado ni se ha utilizado cliente real.
