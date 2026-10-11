# GUEST/Botánica — Entrada 46 · cuatro pedidos TEST reales entregados y recuperación de enlaces Android

Fecha: 11/10/2026. Rama exclusiva `guest-independent`. Continuación de Entradas 41–45 de la misma bitácora de Biblioteca, sin reconstruir ni repetir la configuración de Supabase.

## Hallazgo decisivo al informar la propietaria «ya lo había pegado pero no avanza»

La propietaria introdujo previamente su código de recuperación legítimo del Centro GUEST. **FUNCIONÓ**: una consulta SQL limitada a estado/metadatos de `guest_invitation_orders` encontró **CUATRO pedidos reales `template_id=botanica`, `mode=test`, `status=delivered`** en el Supabase Cloud EXISTENTE, todos con `review_sent_at`, `approved_at`, `delivered_at` y URL final `https://guest-weddlysmartdesign.pages.dev/guest/catalog-final.html?p=...` verificados en base de datos. No leer ni divulgar los tokens reales en la bitácora.

Dos ejecuciones completas el 11/10/2026:
- 12:25:21–12:25:41 (hora España): primera boda TEST con dos sedes, historia SIN texto, archivo PNG sintético, revisión/aprobación/entrega; segunda boda con una sede, texto personalizado, cambio solicitado (`revision_count=1`), revisión/aprobación/entrega.
- 12:28:21–12:28:41 (hora España): segundo recorrido completo de los mismos dos escenarios; ambos también entregados.
- Los cuatro registros cumplen `mode=test`, `public_token_hash` y `review_token_hash` presentes, `status=delivered`; **dos con un fichero de prueba cada una** y dos con la variante de cambio revisado. No son simples simulaciones ni pedidos creados por SQL: fueron generados mediante el formulario autentificado de GUEST.
- El formulario anterior permitía volver a crear pedidos y no comunicó suficientemente el éxito a la propietaria (causa exacta de la falta de visibilidad en su navegador sin confirmar). **NO pedir nuevas ejecuciones ni nuevos códigos, ni volver a crear pedidos**.

## Corrección aplicada SOLO a la pantalla auxiliar de certificación

- Archivo `guest/qa/owner-botanica-acceptance.html`, misma URL ya publicada `https://guest-weddlysmartdesign.pages.dev/guest/qa/owner-botanica-acceptance.html`.
- Sustituido botón «Ejecutar las dos pruebas» por **«Recuperar mis pruebas finalizadas»**. Tras entrar con el código legítimo en su propio navegador, efectúa **solo lecturas** `status`, `list`, `detail` y `public_load`, filtrando **solo** `botanica` / `test` / `delivered` / correo ficticio `qa-botanica@example.invalid`; muestra las dos entregas más recientes y un enlace para abrir cada invitación final en Android. Se comprueba que el token recuperado corresponda a `delivery_url` auténtica en Cloudflare y que `public_load` responda `mode=test`. Los tokens NO se guardan en almacenamiento, no se colocan en Github ni en esta bitácora; el código se borra del formulario después de login. La página desplaza la pantalla a los enlaces tras recuperarlos.
- No se conserva ruta de creación de pedidos ni `FormData` en este visor de lectura. No hay nuevas peticiones pagadas, emails a clientes, servicios, licencias, infraestructura o modificación de diseños.
- Código de recuperación y sus tests `guest/tests/owner_botanica_acceptance_contract.test.cjs`, fixture multi-diseño y smoke externo actualizado.
- CI [Cloudflare Smoke 38132355680](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38132355680) **SUCCESS** acreditó la primera versión read-only de esta pantalla, master Botánica intacto, manifest sin venta y accesos inválidos 403. Posterior commit de autodesplazamiento del visor requiere smoke posterior para acreditar sus bytes finales.

## Interpretación prudente del gate comercial

Este hallazgo permite acreditar **backend-test-only** (V17 real, Botánica TEST con cumplimiento de aislamiento) y **two-real-test-orders** (dos pedidos distintos cloud + un segundo par repetido, revisiones, una subida por par, entrega). Se conservan como pendientes otros gates que **no están demostrados**: cuestionario completo desde el cliente en Android, renderer propietario, paridad visual revisión/final, RSVP por destinatario + persistencia real con licencia, uso Android físico y tiempo activo. El producto sigue **NO-GO y sin autorización comercial** hasta todos los criterios y permiso de la propietaria.

Siguiente acción única de usuaria: abrir la misma página ya desplegada, introducir allí su código (NO en chat), pulsar «Recuperar mis pruebas finalizadas», y pulsar **«Abrir invitación final en Android»**. No pulsar ninguna opción de crear nuevos pedidos. Si se ve error, enviar captura **sin código ni enlaces con `?p=`**.

La versión ONE, Partner, STUDIO, VEIL LIGHT, `main`, la versión visual de Botánica y los checkout reales **no fueron modificados**; coste nuevo 0 €.
