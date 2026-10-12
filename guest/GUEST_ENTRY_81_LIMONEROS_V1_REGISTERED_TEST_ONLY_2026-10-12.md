# GUEST · Entrada 81 — Limoneros D03 V1 integrado en GitHub; TEST, no venta (12/10/2026)

## Resultado verificado
- **Rama**: `guest-independent`.
- **Commit de incorporación real**: [75b60376ea4473a69e73e8acc0cde5b76591c774](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/commit/75b60376ea4473a69e73e8acc0cde5b76591c774).
- **Fuente inalterada**: ZIP V1 recuperado de Biblioteca. El ejecutor descargó los **39/39 Git blobs**, comparó su tamaño y SHA-1, reconstruyó el HTML y comprobó **28.673.474 bytes** y SHA256 `a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482`. Los dos bloques ausentes 037 y 038 se recuperaron en Entrada 80.
- **Asset real GitHub readback** `guest/catalog-assets/design-03/1.0.0/index.html`: blob Git `020c46846403a77574b71a92cd22c3d00408b235`, calculado antes desde los bytes originales del HTML; **coincidencia exacta confirmada** con `fetch_file` después del commit.
- **Registrador existente aplicado** a máster original y plugin: `guest/templates/design-03/master.html` y `visual-plugin.json` versión `1.0.0`, adaptador común `guest/guest-catalog-template-design-03-adapter-v1.js`, registries de catálogo/owner/evidencia y `GUEST_PROJECT_STATUS_V1.json`. Todos leídos de GitHub tras el commit.
- **Guarda comercial**: `design-03` `certification-pending`, 0/11 gates individuales de venta, `commerciallyCertified=false`, visor `iframe` con `src=null`, `cloudflareVerified=false`, `backendTestDeployed=false`, `androidPhysicalVerified=false`, `commercialReady=false`. Checkout y venta NO activados. No afirmar E2E ni Android.

## QA local dentro de la instalación
- El script `guest/tools/install_limoneros_from_existing_blobs.py` solo ejecuta su `git commit` y push después de verificar todos los hashes, pasar el dry-run/aplicación de `register_visual_template`, ejecutar `node guest/qa/catalog_preflight_v2.cjs`, `node guest/qa/catalog_admission_gate.cjs`, compilar staging con `node guest/tools/build_catalog_static_preview.cjs --output ... --template botanica` y comprobar la comparación de bytes original/destino.
- El primer run [38226948381](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38226948381) **falló de manera segura sin commit**, porque el antiguo `handoff_gate` bloqueaba registrar TODA plantilla D03+ aunque fuese solo TEST; el log demuestra que los 39 bloques y SHA V1 pasaban. La regla entraba en contradicción con el handoff Entrada 77 que exige incorporar nuevos diseños en TEST antes de poder verificar Android remoto.
- Solución genérica y cerrada: `guest/qa/handoff_gate.cjs` ahora permite **únicamente D03+ con estado certification-pending, sin SRC público aprobado, sin escalabilidad/comercial PASS** hasta la certificación común, conservando bloqueo de ventas. Commits `4940ea88`, `a17aee04`. El segundo run dio lugar al commit `75b60376...`, lo que acredita haber superado las comprobaciones previas al push.
- También se corrigió el test `guest/tests/multi_design_dropin_pipeline.test.cjs`, que asumía equivocadamente que D03 nunca tendría ID registrado: ahora aísla la fixture ficticia en `tmp` desde VEIL/Botánica. Commits `0c3e61d1`, `215212b6`. No se editó ningún máster congelado.

## Pendientes reales, sin rehacer pasos
1. **QA de rama y Cloudflare live:** verificar GitHub Actions actuales y que el autodeploy HTTPS contenga D03 por ruta `/guest/catalog-assets/design-03/1.0.0/index.html`, con bytes exactos y NO-SALE. No inferirlo solo porque el commit exista. No publicar venta.
2. **Supabase TEST V18:** extender catálogo a D03 con el generador genérico `guest/tools/prepare_live_catalog_registry.cjs` y despliegue controlado, preservando VEIL/Botánica y los guards; backend D03 aún NO desplegado.
3. **Android real:** nueva plantilla remota en Centro GUEST V5.0 candidata (o versión certificable posterior), verificar abrir/volver y el render con config; única revisión visual final de propietaria. No repetir pruebas Botánica.
4. **Gates funcionales específicos D03** en TEST (cuestionario, 1/2 sedes, RSVP, galería/revisión/final y media firmada); conservar 0/11 mientras no se registren resultados respaldados.

## Regla para siguientes diseños (D04–D1000)
La fuente que aporta la propietaria es el diseño y sus medios, nunca manifests/infraestructura. El motor de registro está activo: adaptar `GUEST_APPLY_CONFIG` si procede, verificar SHA, registrar `certification-pending` y reutilizar pipeline de CI/Cloudflare/backend/Android. Para HTML grandes, transferir blobs por el mismo método verificado en vez de recrear app. **El error de falso «not-started» en tests y el bloqueo de recepción TEST del handoff se corrigieron genéricamente para que no reaparezcan.**

**Estado:** D03 integrado en repositorio y catalogado en TEST con hash original idéntico; no certificado comercialmente.
