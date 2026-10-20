# GUEST — Fase 7: cerrar trabajo autónomo sin acceso Cloudflare (20/10/2026)

**Estado comercial: `NO_GO`, cobros desactivados.** Rama única `guest-independent`. La propietaria decidió aplazar Cloudflare porque el teclado de Work en Android falla. **No pedir acceso ni intervención durante esta fase.**

## Continuidad leída, sin rehacer trabajo
- Prevalece la [fase 6](GUEST_AUDIT_CONTINUITY_PHASE6_RECOVERED_PREVIEW_LOGIN_2026-10-20.md) para identidad y ubicación de insumos, [fase 5](GUEST_AUDIT_CONTINUITY_PHASE5_STAGE_PACKAGE_2026-10-20.md) para puente VEIL y [matriz E2E](GUEST_PREVIEW_E2E_MATRIX_2026-10-20.md) para criterios de aprobación.
- ZIP recuperado en fase 6: **`GUEST_PREPRODUCTION_16_VERIFICADO.zip`**, **SHA256 `0fd69d40d5ee85862a71ba7eb34bba188563d79f9b2d0a0022524dbb6009a1bb`**, 223405228 bytes, 122 entradas ZIP (manifiesto + 121 archivos), 16 identidades técnicas (15 diseños candidatos y D03 Limoneros incorrecto, nunca vendible). **Este es el ZIP vigente reconstituido**, no el ZIP distinto de fase 5 cuyo SHA era `e09ad...`. No prometer que el ZIP temporal de fase 6 esté accesible en nuevos entornos: la reconstrucción reproducible se encuentra en esa bitácora.
- **No se ha publicado el ZIP a Cloudflare.** No existe URL PREVIEW confirmada para esta entrega. El entorno de trabajo actual carece de navegador Cloudflare autorizado; no se intentó acceder ni reautenticar al usuario.

## Dos fallos técnicos reales detectados y corregidos en el verificador, sin cambiar diseños
Cloudflare Pages aplica dos comportamientos de plataforma que hacían que `guest/qa/verify_guest_preview_manifest_2026_10_20.py` informara falsos FAIL:
1. HTML servido en ruta canónica: `/contact.html` pasa a `/contact`, `/about/index.html` pasa a `/about/`. Se añadió `SafeCanonicalRedirect`, que **solo acepta un salto de redirección canónica HTML dentro del MISMO origen PREVIEW HTTPS**, sin cambiar hostname, puerto, path fuera de la variante exacta, query ni fragmento. Sigue prohibiendo redirección a producción, terceros, credenciales o URL con tokens.
2. `_headers` es un **archivo de configuración que Cloudflare no sirve por HTTP**. El comprobador original intentaba descargarlo como si fuese un recurso y fallaría en un despliegue correcto. Ahora exige el SHA256 y tamaño exactos de `_headers` en el manifiesto local firmado y verifica su efecto observable (`X-Robots-Tag: noindex`) en **los 120 recursos estáticos que SÍ se sirven por HTTP**. Su informe separa: `declaredManifestFileCount=121`, `resourceCount=120`, `configurationNotHttpServed=["_headers"]`. No afirma haber descargado ese archivo ni haber verificado por HTTPS su contenido.
3. Endurecimiento adicional: inventario de 16 IDs exactos, D03 histórico siempre `certification-pending`; campo `commercialApproved` nunca TRUE; rutas iframe y versiones exactamente asociadas a la identidad de cada diseño, evitando un intercambio silencioso de renderizadores. El control comercial `NO_GO` continúa independiente.

Fuentes oficiales verificadas:
- https://developers.cloudflare.com/pages/configuration/serving-pages/
- https://developers.cloudflare.com/pages/configuration/headers/
- https://developers.cloudflare.com/pages/get-started/direct-upload/

## Evidencia CI realmente comprobada
- Nuevo `guest/tests/preview_verifier_offline_security_2026_10_20.py`: tests sin red de validación de origen, redirecciones correctas y maliciosas, una sola redirección, inventario sellado, D03 incorrecto y rutas peligrosas; agrega prueba específica `_headers` NO HTTP y SHA256 fijado.
- Prueba conectada a `.github/workflows/guest-independent-qa.yml` en job `regression`; el script pasó satisfactoriamente.
- **[GUEST Independent QA run 39427483317](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39427483317) — SUCCESS, 30/30 jobs**. Regresión de PREVIEW explícita **SUCCESS**.
- Esta CI valida código y fixture documental; **no hay prueba E2E real ni publicación Cloudflare**, de modo que no se marca ninguna puerta E2E como PASS.

## Auditoría del modo de prueba, sin toquetear secretos
- `guest/backend/guest-invitation-flow/index.ts` (ACTIVE V21 según fase 3): `send_review` y `deliver` con `order.mode==='test'` **NO llaman a Resend** y registran envío lógico de prueba; esos pedidos no sirven como evidencia de entrega efectiva de email.
- `guest/backend/guest-stripe-checkout/index.ts` (ACTIVE V26 según fase 3): usa la única `STRIPE_SECRET_KEY` configurada en su Edge Function; el `STRIPE_PUBLISHABLE_KEY` tiene respaldo de clave pública Live. La conexión Stripe disponible solo demuestra cuenta **livemode=true**, no el valor secreto del backend. **No cambiar claves compartidas, no crear compras reales, no adivinar un sandbox.** Para probar checkout debe existir una configuración TEST aislada demostrable (`cs_test_...`, `livemode=false`), usando cuentas/destinatarios sintéticos autorizados. Hasta entonces E2E pagado = PENDING.
- No hubo cambios en Edge Functions, Supabase, Stripe, Resend, clientes ni producción. No se tocó ONE, ONE Partner, STUDIO, diseño maestro ni D03 incorrecto.

## Siguiente actuación, pospuesta por decisión de la propietaria
Cuando vuelva a estar disponible una sesión Cloudflare autorizada: entrar **solo** en `guest-weddlysmartdesign`, verificar ZIP según SHA de fase 6, desplegar **PREVIEW, nunca Production**, anotar URL devuelta por la plataforma; ejecutar verificador read-only contra esa URL con manifiesto `guest/qa-reports/preview16_recovered_manifest_2026-10-20.json` (120 recursos HTTP + manifiesto + efecto de `_headers`, con salida reproducible). Revisar 16 visuales y D09 sin sustituir al D03 histórico. Luego preparar Stripe TEST realmente aislado, dos pedidos completos auténticos, revisión/entrega y correos recibidos, RSVP sí/no, Android y dos móviles. Aprobar precio/derechos por diseño elegido antes de permitir venta.

**Trabajo ejecutable offline y verificación de código de esta fase: CERRADO. Despliegue/E2E/autorización comercial: PENDIENTES.**
