# GUEST · Fase 15 · backend desechable y checkout Stripe TEST protegido

Fecha 20/10/2026. **VENTA NO_GO**. Continúa de [fase 14](GUEST_AUDIT_CONTINUITY_PHASE14_FREE_TIER_STAGING_2026-10-20.md). No se ha reactivado Supabase ni pagado ampliación de plan. No se han cambiado Stripe LIVE, Resend, Cloudflare, ONE, STUDIO, `main` ni datos de clientes.

## 1. Ejecución genuina de backend LOCAL (sin pagos)
[GitHub Actions 39468741478](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39468741478) **COMPLETED SUCCESS**. Se reutilizó `.github/workflows/guest-isolated-free-smoke.yml`, con `SUPABASE_ACCESS_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, `CLOUDFLARE_API_TOKEN` y URL cloud expresamente vacíos.

El trabajo monta un Supabase temporal local mediante Docker en GitHub Actions, genera el backend GUEST de prueba sin claves externas, y ejecuta:
- Persistencia local y autenticación de gestión ficticia.
- Dos pedidos sintéticos de BOTÁNICA con cuestionarios diferentes, fotografía sintética, revisión, aprobación, entrega registrada y consulta `public_load` con paridad frente a revisión.
- Contrato de licencia `create_paid` sintetizada (sin Stripe): identidad VEIL LIGHT válida, idempotencia, rechazo de plantilla pendiente BOTÁNICA, UUID desconocido y compras antiguas Essential/Signature.
- Tests de RSVP real **dentro de la función y base de datos locales** y acceso mediante miembro local (ver workflow detallado).
  
**Límite:** ningún checkout real, email enviado ni pago efectuado; `guest-invitation-flow` modo `test` omite correos. No se afirma E2E comercial, móvil físico ni acceso de usuarios reales.

## 2. Checkout Stripe REAL CODE, Sandbox VM fake NETWORK
El código desplegado `guest/backend/guest-stripe-checkout/index.ts` **NO se tocó ni desplegó**.

Se creó `guest/tools/prepare_stripe_sandbox_checkout_2026_10_20.cjs` que deriva a un archivo `/tmp` efímero el TypeScript de checkout. Inserta estrictamente:
- solo `sk_test_` y `pk_test_`, con `GUEST_STRIPE_SANDBOX_TEST_ONLY=1`.
- destinos web ficticios `guest-ci-local.invalid` / `guest-static-qa.pages.dev` para no dirigir al sitio real.
- `RESEND_API_KEY`, tokens Cloudflare/Supabase no permitidos.
- abortar cualquier respuesta de Stripe si `livemode !== false`; nunca confiar solo en el prefijo de credencial.
- fuente original intacta y fail-closed si cambia alguna ancla de código.

El test `guest/qa/stripe_sandbox_checkout_isolated_contract_2026_10_20.cjs` transpila el código REAL a VM aislada que intercepta `fetch`; no existe salida a Stripe ni backend/Resend reales.

[GitHub Actions 39469442766](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39469442766) **COMPLETED SUCCESS**:
- `config` divulga exclusivamente `pk_test` ficticia y lista solo VEIL test.
- 5 rechazos previos al pago (sin consentimiento, BOTÁNICA pendiente, D03 antiguo, falta identificador, reintento inválido).
- 2 operaciones ficticias de checkout VEIL: plantilla/versión, 1.299 céntimos **exclusivamente TEST sintético (no precio aprobado)**, redirección falsa e idempotency key verificados.
- Rechazo de simulación `livemode:true`, siete condiciones de LIVE/entorno/Resend prohibidas y cinco estados pagados/importe/moneda inválidos.
- **No compra ni licencia:** todas las respuestas Stripe generadas por VM, no por Stripe Sandbox real.

[GitHub Actions 39470359265](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39470359265) **COMPLETED SUCCESS**: el smoke que llamaría a la API real **se niega a actuar si falta un secreto Stripe TEST cifrado**.

## 3. Preparada comprobación auténtica de Stripe Sandbox, BLOQUEADA
Archivos:
- `guest/qa/stripe_real_sandbox_unpaid_session_2026_10_20.cjs`: comprueba que el secreto es `sk_test_` y no hay claves de otros proveedores; crea y recupera **exactamente una sesión Stripe TEST impagada, con plantilla VEIL/5.3.3 y 1.299 céntimos sintéticos**; valida `livemode:false`, estado `unpaid`, moneda EUR, cantidad y metadatos. No crea cargo, licencia, correo, cliente ni pedido.
- `.github/workflows/guest-stripe-real-sandbox-unpaid-qa.yml`: **`if: false` POR DEFECTO**, sin ejecución real; funciona por push explícito de ese archivo en `guest-independent`. Clave se lee SOLO desde **GitHub Actions Environment `guest-stripe-sandbox`**, no Repository Secrets general, para limitar alcance.

**Aún NO se ha conectado ni guardado ninguna clave de Stripe Sandbox en GitHub y NO se ha llamado a Stripe TEST real.** La primera ejecución de la workflow ha quedado SKIPPED deliberadamente (no es un fallo, ni evidencia de prueba real). Solo tras preparar un entorno restringido y confirmar al titular que no hay coste/cobro, el agente cambiará el guard a `if: true` para disparar una sola verificación real, revisará resultado y dejará deshabilitada la workflow de nuevo.

## 4. Próxima intervención mínima de la titular, en Chrome de PC
Para el siguiente test real, sin enviar ninguna clave por chat:

1. En GitHub, repositorio **`WeddlySmartDesign/WeddlySmartDesign.github.io`**, abrir `Settings → Environments` y **crear entorno exclusivo `guest-stripe-sandbox`**, preferiblemente con rama de despliegue permitida **`guest-independent`**.
2. En esa página del entorno, crear **Environment secret** con nombre exacto `GUEST_STRIPE_TEST_SECRET_KEY`. Introducir directamente desde Stripe Dashboard > **Entorno de prueba** > **Desarrolladores/API keys** la **clave secreta TEST `sk_test_...`**, sin escribirla en ChatGPT, archivos ni GitHub código. No usar `pk_test` ni `sk_live` en este campo. Guardar. No copiar ni mostrar el valor en capturas.
3. Comunicar únicamente **«entorno y secreto TEST configurados»**. El agente entonces habilitará temporalmente la ejecución en `guest-independent`, comprobará el resultado y volverá a bloquearla.

**No pedir aún crear otra base ni reactivar el Supabase temporal Free.** Esto solo certifica Stripe Sandbox API, no compra E2E con entrega/correo/RSVP.

## 5. Todavía PENDIENTE
- Backend remoto TEST sin efectos sobre producción para dos compras completas reales en Stripe TEST y emails Resend al propio buzón autorizado, revisión/entrega/RSVP y dos móviles.
- Autorización expresa y regresión para fusionar [PR #144](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/144) y [PR #145](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/145) en `main`.
- Corrección del cuadro BOTÁNICA «Lo esencial» en escritorio y comprobación real móvil.
- Precios individuales, derechos multimedia y condiciones legales, decisión **GO por diseño**, no catálogo entero por defecto.
