# GUEST / Botánica — Entrada 47 · recuperación confirmada por propietaria, QA CI reparado

**Fecha:** 11/10/2026. **Continuidad:** bitácora de Biblioteca Entradas 1–47 y `guest/START_HERE.md`. Rama exclusiva `guest-independent`.

## Hechos observados

1. La propietaria confirma directamente: **«hecho. aparecen los 2 pedidos test»**. Queda **acreditada en el móvil la recuperación de los dos pedidos TEST por el visor autorizado de Cloudflare**, que ya es de **solo lectura**. **No** es todavía una confirmación de que haya abierto las invitaciones finales o comprobado legibilidad, animación, RSVP o navegación Android.
2. Supabase real confirma **4 órdenes distintas `botanica/test/delivered`**, y **4/4** tienen `review_sent_at`, `approved_at`, `delivered_at` y URL final del tipo `https://guest-weddlysmartdesign.pages.dev/guest/catalog-final.html?p=…`. No se han leído valores de `p` ni de otros tokens sensibles.
3. Tras elevar con evidencia a **5/11 PASS, 6 PENDING**, el workflow `GUEST Catalog and Continuity QA` falló por una prueba de mutación heredada. La premisa era válida antes de confirmar pedidos Cloud pero no después: la prueba esperaba rechazar automáticamente `system.deploymentCertified=true` aunque no comprobaba que el renderer propietario y los soportes runtime también estuviesen desplegados. Se reforzó `guest/qa/handoff_gate.cjs` con el control explícito de esas dos condiciones. [Run 38132781601](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38132781601) **SUCCESS** en commit `5696171c9d9b553a3773b5b91c6faf6065112c10`. La última QA independiente estaba ejecutándose a la hora de redactar esta entrada; no darla por PASS hasta que concluya. No se alteró el código productivo para pasar el test.
4. Botánica sigue **`certification-pending` y NO-GO venta**. No se han habilitado checkout, ni iniciado diseño 03 ni modificado ONE, Partner, STUDIO, VEIL LIGHT, `main`, el master Botánica o proyectos de pago.

## Siguiente paso para terminar sin más retrabajos

La propietaria **ya ve los dos pedidos**. No repetir código ni creación. En el **Android físico**, abrir **«Abrir invitación final en Android»** de cada pedido recuperado y revisar animación, lectura, secciones, dos sedes en escenario 1 / una sede y texto modificado en escenario 2, fotografía y botones. Si algo no funciona, enviar una grabación corta de pantalla **sin URL ni token visibles**. Solo después evaluar `owner-android` y `review-final-parity`. RSVP real vinculado a licencia/gestión y tiempo de trabajo propietario siguen pendientes y deben acreditarse por separado. No marcar 11/11 ni activar venta anticipadamente.

**Regla de producto futuro:** GUEST común está montado: una vez cerrado Botánica, el siguiente diseño usa únicamente nuevo HTML visual, `visual-plugin.json`, registro y QA genérico, sin infraestructura por diseño.
