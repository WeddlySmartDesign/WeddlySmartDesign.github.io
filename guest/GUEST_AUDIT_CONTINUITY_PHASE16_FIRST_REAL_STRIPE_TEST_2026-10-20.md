# GUEST · Fase 16 · Primera sesión Stripe SANDBOX REAL, impagada, certificada

Fecha 20/10/2026. Continuidad de [fase 15](GUEST_AUDIT_CONTINUITY_PHASE15_EPHEMERAL_E2E_STRIPE_SANDBOX_2026-10-20.md).

## Autorización operativa y separación
- La propietaria creó en el Dashboard de Stripe un **sandbox nuevo y separado para GUEST**, sin clonar ajustes de WeddlySmartDesign/ONE; eligió explícitamente no reutilizar una clave de Stripe TEST que existía desde septiembre para ONE.
- Creó en GitHub **Settings > Environments > `guest-stripe-sandbox`**, restringido a **solo la rama `guest-independent`** (captura validada). Añadió como Environment secret cifrado `GUEST_STRIPE_TEST_SECRET_KEY` procedente del **nuevo Sandbox de GUEST** (solo nombre mostrado en captura). **No se compartió la clave secreta por chat ni se incorporó a Git, artefactos o informes**.
- No se utilizó la conexión Stripe LIVE del asistente.

## Prueba auténtica, una sola vez, sin dinero
- Script: `guest/qa/stripe_real_sandbox_unpaid_session_2026_10_20.cjs` (secreto leído del entorno `guest-stripe-sandbox`).
- Workflow protegido: `.github/workflows/guest-stripe-real-sandbox-unpaid-qa.yml`.
- Se habilitó la ejecución una sola vez mediante commit `44be5f52284e66516eeff5066cc20005a375aa8d` y push `guest-independent`. **[Run 39473359246](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39473359246): COMPLETED / SUCCESS** en el paso **«Make exactly one UNPAID synthetic Checkout TEST session and verify mode/amount»**.
- El test verificó con **Stripe API auténtica**: `cs_test_` y `client_secret` de embedded checkout; `livemode=false`, `status=open`, `payment_status=unpaid`, `currency=eur`, `amount_subtotal=1299` **solo de prueba, NO precio comercial**, `metadata.product=guest`, `template=veil-light`, `version=5.3.3`, `test_only=1`.
- Se recuperó la sesión por API GET y se revalidaron los campos; no se imprimieron la clave, el ID de sesión ni `client_secret`, datos personales ni pagos. **No se completó pago ni se creó cargo**, cliente, licencia, email, pedido, acceso o RSVP.
- No hay en el job secretos Stripe LIVE, Supabase, Resend ni Cloudflare. Las URLs de retorno son la PREVIEW aislada `f1b97db0` (bloqueo CSP); no se usa `main`, ni la URL comercial.
- Inmediatamente después de la ejecución exitosa se restauró **`if: false`** en commit `3996f5c17cc486cf93ca3fa604d56d77fa0f668b`. Su ejecución de control **[Run 39473530446](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39473530446): COMPLETED / SKIPPED**, confirmando que las llamadas adicionales a Stripe quedan bloqueadas por defecto.

## Estado y próximos trabajos — sin prometer venta
- **PASS REAL Stripe TEST (limitado):** solo conectividad de sandbox y una sesión impagada ficticia con todos los pins correctos.
- **PASS LOCAL:** dos pedidos GUEST/RSVP local en Supabase efímero [Run 39468741478](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39468741478), sin Stripe ni correos.
- **PASS PREVIEW:** 16 diseños SHA verificados [Run 39457669846](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39457669846); páginas UI de integración con CSP [Run 39465936172](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39465936172).
- **PENDIENTE:** crear backend GUEST remoto TEST completamente aislado, probar dos compras TEST efectivamente completadas y la integración Stripe→licencia→cuestionario→revisión→aprobación→entrega→correos Resend reales (a buzón autorizado)→gestión GUEST y RSVP persistido en dos teléfonos. Actualmente Supabase GUEST remoto de certificación sigue pausado; organización FREE con 2 proyectos activos (WeddlySmartDesign y STUDIO) no permite reactivarlo sin reestructuración/coste autorizado.
- **PENDIENTE:** PR #144/#145 en borrador; decidir/publicar con autorización explícita y regresión de ONE; solucionar cuadro BOTÁNICA «Lo esencial» PC; derechos de música, vídeo, fuentes y términos, precios individuales y GO por diseño.
- **NO_GO:** venta bloqueada. Ningún dato de clientes, servicio producción, Supabase principal, ONE ni STUDIO fue modificado.

## Regla de futuras claves
`GUEST_STRIPE_TEST_SECRET_KEY` se mantiene en **GitHub Actions Environment** exclusivo `guest-stripe-sandbox`, no en repositorio ni en secret global. Toda nueva prueba que quiera usar el secreto requiere modificar explícitamente la puerta `if:false` tras consentimiento y volver a bloquearla al terminar. Nunca publicar secretos en chat, capturas, logs o documentos.
