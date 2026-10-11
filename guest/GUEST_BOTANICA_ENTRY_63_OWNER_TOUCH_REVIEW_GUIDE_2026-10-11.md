# GUEST/Botánica — Entrada 63 · instrucciones operativas visibles para la medición activa de la propietaria

**Fecha:** 11/10/2026. Rama única: `guest-independent`. Continuación de [Entrada 62](GUEST_BOTANICA_ENTRY_62_OWNER_REAL_PARITY_ANDROID_2026-10-11.md). **Estado comercial permanece 9/11 PASS, 2 PENDING, NO-GO; no liberar venta ni empezar D03.**

## Necesidad real detectada

La propietaria pregunta «Pero para medir el tiempo necesitaré saber qué tengo que ver». Tiene razón: **no se puede certificar un objetivo de minutos si el trabajo a ejecutar no está definido ni se ofrecen criterios de aceptación**. La herramienta anterior medía segundos de una pantalla, pero no presentaba todos los valores esperados ni aseguraba que la revisión se había efectuado antes de enviar; una duración corta sin controles no acredita eficiencia.

## Solución implantada, sin tocar el diseño congelado ni otros productos

Se actualizó exclusivamente la página de preproducción [`guest/qa/owner-botanica-touch-benchmark.html`](qa/owner-botanica-touch-benchmark.html) para mostrar **antes de iniciar el cronómetro** un apartado «Antes de iniciar el cronómetro», que explica la tarea, el contenido exacto esperado, cómo actuar ante defectos y el alcance del contador.

**Datos ficticios exactos**: pareja `QA Tiempo` y `Botánica`; fecha `12/06/2027`; Story personalizada `Historia ficticia para una medición de propietario.`; **una única sede** `Lugar ficticio para medición`, `17:00`; agenda, galería y prácticos **desactivados deliberadamente**. Se comprueba también composición/legibilidad en móvil y navegación hasta cierre y CTA `Confirmar asistencia`.

Durante la revisión aparecen **cinco casillas de comprobación** (portada/fecha, historia, sede/hora, legibilidad sin cortes, navegación/cierre). El botón «He revisado · enviar revisión TEST y cerrar tiempo» está **desactivado hasta marcar las cinco**, y la función de envío vuelve a verificar las cinco; evita registrar una revisión vacía. Si se observa un fallo, la pantalla explica que **NO** debe enviarse, sino compartir captura del problema. No se cambia el master, la configuración sintética del pedido, el temporizador original ni se manda correo a nadie.

El contador sigue iniciándose **solo después** de preparar el pedido y mostrar correctamente el diseño, y suma tiempo cuando la página está visible y ha habido interacción reciente. Incluye la revisión y las casillas, no el tiempo de espera de ChatGPT, CI ni la preparación automática. **Este test mide tiempo activo humano de revisión hasta `send_review`**, no todos los procesos posteriores de entrega o la duración de un encargo personalizado desde cero. Si supera 5 minutos se registra honestamente; no se fuerza PASS por hacer clic deprisa.

## Pruebas, incidentes de QA y alcance

- Contrato `guest/tests/owner_botanica_touch_benchmark_contract.test.cjs` reforzado con cinco checks, fecha, Story, sede, CTA, bloqueo antes de completar y mensaje de no enviar si hay fallo.
- Prueba móvil Chromium `guest/qa/owner_botanica_closeout_browser_test.cjs` reforzada para exigir botón inicial desactivado, marcar cinco casillas y habilitarlo antes del `send_review` ficticio, sin APIs reales.
- Smoke externo `guest/qa/public_cloudflare_pages_live_smoke.cjs` reforzado para cotejar que Cloudflare publica las mismas instrucciones y cinco casillas, no solo la versión local. **No considerar despliegue verificado hasta obtener run SUCCESS**.
- Primer QA de contrato [38156214001](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38156214001) detectó un fallo **en la propia prueba**: contaba también el literal `name="reviewCheck"` de un selector JS, dando 6 frente a cinco controles reales. Se corrigió la expresión para contar solo etiquetas `<input type="checkbox" name="reviewCheck">` en el test estático y smoke; no había un sexto control en el producto. Volver a verificar CI antes de cerrar.
- No se ha ejecutado una prueba de tiempo humana todavía; el gate `owner-touch` **continúa PENDING**.

## Siguiente paso preciso

1. Verificar **en el mismo HEAD** QA catálogo y QA navegador, y **Cloudflare HTTPS exact-byte live smoke** en verde; no solicitar que se abra la pantalla si el servidor sigue sirviendo una versión antigua.
2. Propietaria abre solo `https://guest-weddlysmartdesign.pages.dev/guest/qa/owner-botanica-touch-benchmark.html` y lee las instrucciones visibles **antes** de pulsar preparar. Usa el código privado exclusivamente en la página.
3. Pulsa preparar una sola vez; tras abrirse la invitación recorre toda la página, contrasta los cinco puntos con los valores esperados, marca casillas, y solo si está bien pulsa `He revisado · enviar revisión TEST y cerrar tiempo`. Captura del resultado sin códigos ni URL privada.
4. Si hay un defecto no enviar revisión; comunicar captura y conservar el pedido ficticio para investigar, **sin crear otro**. Después comprobar estado `review_sent` en Supabase por consulta de metadatos, cronometría acreditada por captura y actualizar `owner-touch` solo si cumple objetivo real.
5. Integración en **Centro GUEST operativo** es otro gate separado; la vista QA compartida en Android ya funciona pero no sustituye su certificación de producción. No modificar ONE, Partner, STUDIO, VEIL LIGHT, `main`, master Botánica V14.7 ni checkout.

**Continuidad:** Biblioteca histórica v24 intacta por fallos de overwrite. GitHub es la fuente de registro append-only; actualizar `START_HERE.md`, índice de continuidad y JSON estructurado con la fuente de esta entrada sin promover gates por defecto.
