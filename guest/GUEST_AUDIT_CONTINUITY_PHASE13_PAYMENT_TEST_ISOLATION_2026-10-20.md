# GUEST — Fase 13 · siguiente barrera: pagos Stripe TEST verdaderamente aislados

Fecha 20/10/2026. Continuación de [fase 12](GUEST_AUDIT_CONTINUITY_PHASE12_INTEGRATION_PREVIEW_2026-10-20.md). **NO_GO comercial.** Confirmación de titular en Chrome: **la portada de la PREVIEW de integración `https://f1b97db0.guest-weddlysmartdesign.pages.dev` aparece correctamente**. El verificador HTTPS independiente [run 39465936172](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39465936172) ya había comprobado rutas, noindex y CSP. **No confundir esto con aprobación de la gestión con sesión real**: el CSP impide llamadas a cualquier backend, Stripe o envío.

## Dependencias comprobadas HOY desde conectores en modo lectura
1. Cuenta Stripe conectada a ChatGPT: **solo `livemode=true`** para WeddlySmartDesign. **No hay conexión Stripe TEST disponible mediante el conector**. No inferir que activar «modo de prueba» del Dashboard cambia automáticamente credenciales de un backend existente.
2. Backend GUEST conectado a **Supabase compartido con WeddlySmartDesign** `dnjsxequwgtyyauuofxj`; `guest-stripe-checkout` activo V26 lee `STRIPE_SECRET_KEY` del entorno, `GUEST_CATALOG_SALE_OPTIONS` y origen de catálogo. **No cambiar ni sobreescribir la clave Stripe del proyecto compartido**, ni otras variables compartidas, ni intentar compras sintéticas contra la función de producción con `sk_live_`.
3. Las funciones de GUEST de flujo de entrega V21 y checkout V26 están activas. El modo de pedido `test` de `guest-invitation-flow` **omite correos reales de Resend**; un PASS interno de datos no acredita entrega al buzón. Para E2E real se requiere circuito completo con Stripe TEST, compra sintética, cuestionario, revisiones, entrega, correo real al destinatario controlado, acceso GUEST posterior y RSVP.
4. Se han descubierto por lectura tres proyectos Supabase visibles: principal WeddlySmartDesign activo; **`GUEST-Botanica-Certificacion-Temporal` `pwhcivzdmmkyuodzzqfq` INACTIVE**, creado 10/10/2026; STUDIO activo. **NO reactivar** aún el temporal: necesita comprobación de titularidad, esquema, elegibilidad/coste de reanudación y confirmación de la titular. **Nunca utilizar STUDIO como entorno de GUEST.**
5. Stripe documenta separación de `pk_test_`/`sk_test_` y `pk_live_`/`sk_live_`: `docs.stripe.com/keys`. Todos los tests se deben ejecutar exclusivamente con recursos de prueba y tarjetas de test; no pedir secretos por chat ni subirlos a GitHub.

## Próxima intervención mínima y segura (SIN clave ni edición)
- La titular está en PC; abrir `https://dashboard.stripe.com` en Chrome y localizar en el selector de cuenta el entorno **Sandbox / Modo de prueba** de WeddlySmartDesign. Compartir únicamente una **captura de la interfaz, sin revelar valores de claves o datos de clientes**.
- Con eso elegir la vía técnica segura: separar Stripe TEST en infraestructura no compartida, revisar si se puede reutilizar el proyecto Supabase temporal INACTIVE, y obtener autorización explícita antes de reactivarlo si procede (no asumir que es gratuito). No activar ventas, no editar secretos de proyecto Weddly principal.
- La titular no debe instalar más herramientas, crear productos/precios ni introducir tarjetas reales todavía.

## Siguientes fases
1. Construir entorno TEST con credenciales TEST suministradas únicamente mediante UI segura/autorizada; probar sesión Stripe `livemode=false` y verificar segregación frente a ONE.
2. Ejecutar dos compras E2E con datos sintéticos (mínimo y completo), recibos de correo auténticos Resend a buzón TEST autorizado, revisión/entrega, acceso y RSVP persistido; certificar en móvil real. El código de pruebas offline/Chrome emulado no sustituye este paso.
3. Tras E2E, resolver [PR #144 gestión](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/144) y [PR #145 compra individual](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/145) en GitHub Pages `main` **solo con autorización explícita** y sin fusión ciega que afecte a ONE.
4. Corregir defecto visual de BOTÁNICA V14.7 «Lo esencial» PC después de conectar flujos, antes de aprobar BOTÁNICA para ventas. El antiguo D03 incorrecto jamás sale a catálogo.
5. Recabar aprobación final de diseño, precio individual, derechos de uso de medios, condiciones legales y apertura. Venta sigue **NO_GO**.

## Evidencia de seguridad
No se ha restaurado proyecto temporal, no se ha escrito en Supabase, Stripe, Resend, Cloudflare o `main`; solo lecturas y este registro en `guest-independent`. Ambas PREVIEW anteriores e infraestructura de ONE permanecen sin cambios.
