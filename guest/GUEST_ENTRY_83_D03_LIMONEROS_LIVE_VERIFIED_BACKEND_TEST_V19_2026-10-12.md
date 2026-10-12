# GUEST — Entrada 83 · LIMONEROS D03 V1, HTTPS real verificado y backend TEST V19 (12/10/2026)

## RESULTADO VISIBLE (abrir en móvil)
**Previsualización de la invitación de prueba, NO venta:**
https://guest-weddlysmartdesign.pages.dev/guest/catalog-assets/design-03/1.0.0/index.html

## 1. Cloudflare REAL HTTPS: PASS comprobado
- Prueba GitHub Actions real persistida en `guest/qa-reports/limoneros_cloudflare_live_check.json` (schema `guest-d03-cloudflare-stage-evidence-v2`, UTC 2026-10-12 09:29:16).
- Compilación Cloudflare usa `guest/tools/build_catalog_static_preview.cjs` con **descomposición automática sin pérdidas** para diseños de gran tamaño. No se modificó el máster original: `28,673,474` bytes, SHA256 `a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482`.
- HTML servido realmente HTTPS: `1,025,775` bytes, SHA256 `794929303a5f8c0c11253b80a85bffc3e9a3244b916397fac57ed70ba777d0ea`, **HTTP 200, exact SHA**, `noindex`.
- Medios **15/15 PASS por HTTP 200 + SHA256 y tamaño exacto**: 2 MP4 (portada `8,587,255` bytes, cierre `5,471,729` bytes), 13 JPG de autora. Máximo tamaño por archivo 8.6 MB, seguro bajo límite Pages. Medios servidos con MIME correcto. **`online:true` y `liveMediaExact:true`** registrados en GitHub.
- El HTML de Cloudflare se genera desde el máster intacto con comprobación de reconstitución SHA256 del original. La solución es **genérica para D04–D1000**, no una solución particular de Limoneros. Se resolvió la anterior respuesta fallback 877 bytes de entrada 82.
- Páginas de prueba permanecen `PREPRODUCTION_DO_NOT_SELL`; no activamos Stripe/checkout/venta ni anonimización de pruebas.

## 2. Backend TEST: Supabase V19 ACTIVO — lectura posterior PASS
- Proyecto GUEST existente `dnjsxequwgtyyauuofxj`, Edge Function `guest-invitation-flow`, antes **V18 ACTIVE**, después **V19 ACTIVE**, `verify_jwt=false` mantenido exactamente por compatibilidad con controles propios de acceso.
- Edición limitada **exclusivamente** a la declaración `CATALOG_TEMPLATES` usando la especificación canónica del catálogo, con verificación antes del deploy de mismos datos que V18 para `veil-light@5.3.3` y `botanica@14.7`, mismas funciones guard `assertCatalogOrderMode` y `templateSpec`, mismo código fuera del bloque, y `testOnly:true` explícito para `design-03@1.0.0`.
- READBACK REAL posterior a despliegue Supabase V19: `veil-light` activo inalterado y no `testOnly`; `botanica` activa `testOnly:true`; `design-03` activo `testOnly:true`, `renderer: design-03-v1-0-0`, tipografía `classic`; guarda `if(spec?.testOnly===true&&mode!=='test')` presente.
- **Esto NO prueba pedidos E2E de D03 ni autorización de checkout**. Pedidos TEST con autenticación real, paridad review/final, RSVP y Android todavía no ejecutados. No marcar backend E2E gate sin resultados.

## 3. CI regresión genérica
- Corregida fixture sintética de `prepare_live_catalog_registry.test.cjs` (commit `39fe9db`): antes asumía D03 ausente para siempre, ahora usa todos los IDs actuales como línea de base. Sin cambios a producto congelado.
- Cloudflare split automatizado commit `26e4dfa`; acción diagnóstica HTTP+medios commit `96f9985`.
- Mantener validación completa de CI antes de sellar comercial. La evidencia HTTPS específica D03 ya es PASS y no debe repetirse.

## 4. Continuidad y límites
- La propietaria ya puede abrir y revisar en su móvil la previsualización URL arriba. No necesita descargar ZIP, editar, reconstruir ni configurar infraestructura.
- Pendiente **integración funcional TEST**: al menos 2 pedidos D03 por cuestionario real autorizado, paridad review/final y RSVP; Centro GUEST Android V5.0 por primera vez con template remoto D03; revisión visual de propietaria. Es una única revisión visual, no nuevos días de diseño.
- **Estado D03 sigue `certification-pending`**; NO certificado para venta; NO tocar VEIL LIGHT, Botánica, ONE, Partner, STUDIO ni main.
- Archivo maestro inmutable conserva el SHA; `guest/GUEST_PROJECT_STATUS_V1.json` apunta a vista real y huellas; catálogo comercial pendiente sigue protegido.
