> **ATENCIÓN: RELEVO HISTÓRICO (ENTRADA 41, YA SUPERADA).** Al 11/10/2026, la fuente actual es [`guest/GUEST_CONTINUITY_LEDGER_FROM_LIBRARY_V24_2026-10-11.md`](GUEST_CONTINUITY_LEDGER_FROM_LIBRARY_V24_2026-10-11.md), Entrada 52. **7/11 PASS, 4 pendientes, NO-GO comercial**; Supabase Edge V17 corregida y dos escenarios Botánica TEST entregados (cuatro órdenes), dos Android revisados y aprobados visualmente; gestión RSVP vinculada a licencia, renderer gestor, paridad y tiempo activo aún pendientes. La Biblioteca histórica está en **v24**, y la Entrada 51 solo está confirmada en GitHub. NO sobreescribir Biblioteca en bucle ni rehacer la configuración del usuario, pedidos, QA visual o infraestructura. El resto de ESTE documento conserva el contexto histórico, pero los números antiguos no son el estado actual.

# GUEST by WeddlySmartDesign — relevo exacto para nuevo chat (11/10/2026, Entrada 41)

**Fuente de verdad:** `guest/START_HERE.md`, `guest/GUEST_PROJECT_STATUS_V1.json`, `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json`, este archivo y bitácora completa en Biblioteca `/GUEST by WeddlySmartDesign/Normativa/Continuidad GUEST/GUEST_BITACORA_COMPLETA_ACTUALIZADA_2026-10-10.md`. Este documento **no sustituye** la historia ni convierte hipótesis en pruebas superadas.

## Nuevo dato confirmado por la propietaria en el chat

> «Ya he completado la configuración de supabase. Nos tenemos que ir a otro chat. Deja todo descrito y Dime cómo empezar».

Se registra **declaración de finalización de la configuración por la propietaria**, en el proyecto compartido de Supabase GUEST `dnjsxequwgtyyauuofxj`. Conforme al runbook, el ajuste esperado es **Edge Function Secrets `GUEST_CATALOG_PUBLIC_ORIGIN=https://guest-weddlysmartdesign.pages.dev`**.

**Aún NO verificado técnicamente:** el conector actual puede leer código, versiones y metadatos de Edge Functions, pero **no** leer los valores de secrets. Por seguridad, nunca pedir a la propietaria que copie tokens, API keys ni contraseñas al chat. En el nuevo chat se debe **comprobar el efecto real** de la variable con una prueba inocua autorizada, antes de afirmar que Supabase ya genera enlaces válidos para toda la cadena. No cambiar `WEDDLY_SITE_ORIGIN`.

## Repositorio y aislamiento inviolable

- Repositorio: `WeddlySmartDesign/WeddlySmartDesign.github.io`.
- Rama exclusiva: **`guest-independent`**. Verificar HEAD al empezar, porque los commits siguientes pueden modificarlo.
- No tocar `main`, ONE, ONE Partner, STUDIO, VEIL LIGHT congelado ni el master visual de Botánica. No crear ni contratar nuevos servicios, herramientas o suscripciones.
- Botánica master 14.7 intacto, **11.635.635 bytes**, SHA-256 `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`. El master está reconstruido con fragmentos inmutables comprobados.
- Protección comercial: **Botánica NO-GO**, catálogo `certification-pending`, evidencia formal **3/11 PASS, 8 pendientes**, `PREPRODUCTION_DO_NOT_SELL`, sin habilitar Stripe para Botánica.

## Qué está comprobado, sin rehacerlo

1. **Cloudflare Pages Free público y comprobado:** `https://guest-weddlysmartdesign.pages.dev`. Git conectado al repo y rama `guest-independent`, salida `dist`, compilación `node guest/tools/build_catalog_static_preview.cjs --output "$PWD/dist" --template botanica`. Prueba externa HTTPS `38124631014` PASS: portada, páginas comunes, master de Botánica byte a byte exacto, `noindex`, 9 activos y manifiesto no comercial. La captura de la propietaria confirma la portada abierta en navegador.
2. **Un solo sistema reutilizable:** contrato `guest/GUEST_NEW_DESIGN_ONLY_VISUAL_CONTRACT_2026-10-10.md`. Para futuras plantillas, solo **HTML visual + `visual-plugin.json`**, revisión visual en móvil y QA de la plantilla. No rehacer checkout, licencias, backend, preguntas, revisión, entrega, RSVP, gestión, Cloudflare, ni panel.
3. **Multidiseño sin modificar el comando de Cloudflare:** builder `guest/tools/build_catalog_static_preview.cjs` incorpora todas las plantillas iframe registradas, sin filtrar compilación por `--template botanica` (solo selecciona la portada). El registrador `guest/tools/register_visual_template.cjs` admite D03 y D1000 puramente sintéticos a partir de HTML+ficha. Test `guest/tests/multi_design_dropin_pipeline.test.cjs` y `guest/tests/catalog_static_preview_future_design.test.cjs`; catálogo QA `38125483851` SUCCESS, Independent QA `38125466515` SUCCESS, Static Stage `38125292800` SUCCESS. **No se ha creado diseño 03 real.**
4. **Circuito común:** GUEST `guest-invitation-flow`, Stripe `guest-stripe-checkout`, cuestionario común V3 `guest/catalog-questionnaire.html`, revisión `guest-review-v1.html`, final `guest/catalog-final.html`, renderer genérico, enlaces `rt/g/u/lang`, motor de invitados y RSVP. Los pagos de diseño pendiente siguen bloqueados. Dos bodas sintéticas se probaron en Supabase aislado; no equivalen a prueba final real en el dominio.
5. **Vista final TEST de diseño pendiente:** entrada 40: generador `guest/tools/enable_test_final_v16.cjs` y CI aislado `38126284797` PASS, catálogo `38126327944` PASS. Esta vía habilita vista TEST con capacidad real y aviso de prueba, **nunca habilita una invitación pagada de Botánica ni justifica 11/11**.

## Incidencia de verificación en Cloud — CRÍTICO

En la lectura de Supabase el **11/10/2026**, antes del cambio de chat, el servicio `guest-invitation-flow` informa `ACTIVE`, **versión 16**, pero `get_edge_function` devuelve **el código de V15** (67.621 caracteres) y su digest **`e343b56befa4328253bf08ff3797fbbae7a111c18c7918fa7549f330769ac5c9`**. El código V16 validado fue guardado en Biblioteca como `GUEST_V16_EDGE_GENERADO_VALIDADO_2026-10-11.ts` (67.780 bytes; SHA256 `35672e22f3c08ac4b8de1934022e4b6dd25d3a19943d319dd33a00baacc0f0ab`), pero **aún no hay una comprobación fiable de que realmente se esté ejecutando en Cloud**. Ya estaba advertido en Entrada 40. **NO reintentar despliegues ni afirmar V16 publicada en el runtime sin resolver primero la discrepancia**, preferiblemente mediante una comprobación conductual read-only y los logs; preservar rollback. La función Stripe figura `guest-stripe-checkout` v24 `ACTIVE` pero digest contenido sigue siendo la release V23 `9b865715fe11b646c0d2a416f9d3b1161b212682db8f932b782951680a172e8c`. También subieron contadores de funciones ajenas sin prueba de cambios de fuente; no tocar funciones de ONE para «corregirlo».
- Ultimo readback de versiones: `guest-invitation-flow v16`, `guest-stripe-checkout v24`, `guest-rsvp v5`, `guest-license-access v4`, `guest-orders-admin v4`, `weddly-app v71`, `wedding-sync v19`. Un contador no acredita cambio de fuente.
- Identidad del backend: proyecto Supabase compartido `dnjsxequwgtyyauuofxj`. STUDIO mantiene otro proyecto protegido.

## Orden exacto de trabajo del próximo chat (sin volver a investigar arquitectura)

1. Leer los cinco documentos de continuidad indicados arriba y verificar último HEAD y GitHub Actions. Leer estado real de los Edge Functions, resolver la inconsistencia de lectura de V16 mediante evidencia runtime, **sin tocar servicios de ONE**.
2. Tomar como dato de usuario el secreto de Cloudflare **configurado por la propietaria**, comprobar su **efecto**, no exigir que repita la configuración y no pedir secretos. El dominio esperado es `https://guest-weddlysmartdesign.pages.dev`. Validar que la página final TEST utiliza correctamente ese dominio en invitaciones con token real y que el acceso sin token fracasa.
3. Completar dos encargos de prueba diferentes en infraestructura GUEST real mediante **rutas autorizadas**, sin cargos reales ni email a compradores; formulario, fotos y variantes, centro, aprobación/cambios, link público final, RSVP con token de destinatario y persistencia, acceso a gestión y exportaciones. No crear pedidos directamente mediante SQL ni falsear pruebas Cloud.
4. Preparar **una sola revisión** visual de Botánica desde Android de la propietaria (vídeo, legibilidad, dos ubicaciones, navegación, botones). Mantener el master aprobado intacto. Medir tiempo activo por pedido cuando haya un recorrido real.
5. Registrar evidencias objetivas de cada uno de los **11 gates**, solo marcar PASS los efectivamente acreditados; no activar Botánica a la venta sin aprobación comercial explícita. Documentar en Biblioteca y repo tras cada punto.
6. Después de la certificación real de Botánica, diseño 03 será exclusivamente visual premium + manifest + QA compartida; NUNCA construir de nuevo sistemas.

**Bloqueos no negociables:** no afirmar producto terminado/venta activa ni confundir staging con producción. Coste incremental = **0 €**. La propietaria quiere mínima intervención y terminar cuanto antes. Las tareas pendientes son comprobaciones reales, no reconstrucciones.
