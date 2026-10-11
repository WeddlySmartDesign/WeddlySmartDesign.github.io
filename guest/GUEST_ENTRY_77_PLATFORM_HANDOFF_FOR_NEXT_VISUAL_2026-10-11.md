# GUEST — Entrada 77 · plataforma preparada para iniciar el diseño siguiente en chat propio

**Fecha:** 11/10/2026. **Rama única:** `guest-independent`. **Fuente de verdad:** `guest/START_HERE.md` + `guest/GUEST_PROJECT_STATUS_V1.json` + esta entrada + runbook. No extraer decisiones de chats antiguos.

## Compromiso operativo del nuevo chat
La intervención de la propietaria se limita a facilitar el diseño que ya posee (HTML/ZIP y medios) y aprobar visualmente la versión completa en móvil. **El asistente debe encargarse de TODO lo técnico**, incluido crear manifiesto y adaptador, registrar ID/versión, alojar el máster en el pipeline genérico, actualizar catálogo TEST de Supabase cuando corresponda, comprobar Cloudflare y ejecutar CI antes de solicitar aceptación móvil. No solicitar a la propietaria que programe, instale herramientas, compre software, vuelva a editar Cloudflare/Supabase, repita pedidos anteriores ni vuelva a empezar la plataforma.

## Plataforma común comprobada
1. **Botánica 11/11 gates de diseño PASS**, incluida visualización Android y vuelta al Centro en V4.8/V4.9. No se reabre ni modifica su master; VEIL LIGHT, ONE, ONE Partner, STUDIO y `main` congelados.
2. **Cloudflare** ya conectado a GitHub rama `guest-independent`, build `node guest/tools/build_catalog_static_preview.cjs --output "$PWD/dist" --template botanica`; **el builder incluye TODOS los diseños registrados** aunque la portada de staging seleccione Botánica. No subir ZIP manual, no crear Workers nuevos. El live smoke 38174810966 verificó origen HTTPS, bytes, visor genérico y bloqueo NO-SALE; activar nuevo diseño mediante commit en rama y despliegue automático, no nueva infraestructura.
3. **Registro de diseño** ya genérico: `guest/tools/register_visual_template.cjs`, `guest/templates/_example/visual-plugin.json` y `guest/DESIGN_NEW_RUNBOOK.md`. El usuario no prepara manifest: lo genera el asistente a partir del HTML. Contrato visual `window.GUEST_APPLY_CONFIG(config)`, `guest-invitation-config-v1`; ID y versión anclados a cada pedido. `guest/tools/build_catalog_static_preview.cjs` requiere SHA y recurso completo; rechazará falta de datos.
4. **Backend V18 ACTIVE real inspeccionado en modo solo lectura**, con catálogo estático de `veil-light` y `botanica`. Se añade herramienta **genérica**, `guest/tools/prepare_live_catalog_registry.cjs`, que recibe el `index.ts` vigente, consulta registro canónico y crea una **candidata** cuyo ÚNICO cambio es la declaración del catálogo, añadiendo exclusivamente IDs `testOnly`. Verifica que VEIL, Botánica, versiones, opciones tipográficas, guards `assertCatalogOrderMode` y `templateSpec` permanecen intactos; rechaza anclajes duplicados, cambios de versiones o un design nuevo no TEST. **No despliega** por sí sola. Se integra en CI `guest/tests/prepare_live_catalog_registry.test.cjs`; [QA catálogo commit 9a004893 / run 38175844570](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38175844570) **SUCCESS**. Se hizo además una **simulación en memoria sobre la fuente real V18**, validando que el bloque JSON se puede reemplazar conservando el resto del archivo byte a byte; **no se escribieron cambios en Supabase**. Así la incorporación de cada siguiente diseño NO requiere modificar manualmente la lógica de pedidos; sí exige crear un registro versionado en TEST y un despliegue controlado cuando exista su ID exacto.
5. **Centro GUEST V4.9** acepta pedidos existentes en Android real, abre Botánica y permite regresar; la salida remota genérica espera primera prueba con tercer diseño. **V5.0 CANDIDATA** con corrección de cronómetro después de `review_sent/approved/delivered` y margen del menú Android: [archivo persistente en Drive](https://drive.google.com/file/d/1wxxHCy8XhI5YiFPsMZGAQi6agrh3Lf9T/view?usp=drivesdk), `guest/tools/build_mobile_center_v50_from_v49.cjs`, 45.562.515 bytes, SHA256 `beb090309452251e207fc2ac37e82c6d8e5e96390a8ee6c62633ce5ab0cf4a1f`; máster Botánica intacto. **Todavía no se ha probado V5.0 Android**: agrupar su validación con la del nuevo diseño, no exigir otra iteración de Botánica.
6. **Guarda comercial**: todos los diseños nuevos `certification-pending`, `testOnly`; Cloudflare `PREPRODUCTION_DO_NOT_SELL`, Checkout/Stripe comercial separado sin autorización. No cambiar a `commercially-frozen`, aceptar pagos ni activar correos a compradores sin permiso expreso.

## Único límite que no se puede certificar sin el archivo nuevo
Ni V5.0 ni el *fallback* remoto genérico del Centro se han probado físicamente con un tercer diseño. **No afirmar plug-and-play de D03 a D1000 certificado en Android** por tests sintéticos. La prueba debe integrarse en la aceptación de este primer diseño nuevo: pedido TEST del ID realmente registrado → master genérico por Cloudflare → Centro Android → retorno → revisión/final. Solo así se cierra de forma legítima el contrato común, sin convertir el nuevo diseño en otro macroproyecto.

## Secuencia sin trabajo técnico para la propietaria
1. La propietaria adjunta **solo su diseño**, preferiblemente un HTML autocontenido o ZIP con HTML y medios. Si solo tiene imagen/vídeo de referencia, revisar y confirmar formato disponible; no reconstruir ni fingir un HTML.
2. El asistente analiza el diseño, define ID/version (sin tocar originales), adapta config, genera manifest, crea asset/renderer TEST, ejecuta registro y pruebas locales. No introducir cambios visuales fuera del feedback de diseño.
3. Ejecutar compilación y QA de la rama, comprobar URL pública TEST/HTTPS tras autodeploy, preparar candidatura del backend con script genérico, validar seguridad y desplegar versión TEST con conectores autorizados. **No operar sobre datos de clientes ni cambiar producción comercial**.
4. Validar el nuevo render remoto desde Android (y correcciones V5.0) **una sola vez** cuando esté preparado, no repetir pruebas D02. Ejecutar flujo TEST real/paridad/RSVP según gate, sin confundirlo con una venta.
5. Congelar exclusivamente el master visual aprobado, registrar SHA, informe/QA, y mantener venta bloqueada hasta decisión comercial explícita. Seguir al siguiente diseño sin tocar motor.

## Estado para handoff
- **Preparación de infraestructura:** SI, el código común, guías, QA, Cloudflare y herramienta backend están listos para recibir el recurso.
- **Nuevo diseño recibido:** NO.
- **Nuevo diseño registrado o desplegado:** NO.
- **Backend genérico añadido LIVE:** NO; la herramienta está preparada para actualizar TEST con ID concreto.
- **Prueba Android de nueva plantilla remota:** NO, debe ocurrir con el diseño nuevo.
- **Venta autorizada:** NO.

**El próximo chat comienza con el archivo del diseño y estas instrucciones**, nunca con una nueva auditoría de días sobre Botánica.
