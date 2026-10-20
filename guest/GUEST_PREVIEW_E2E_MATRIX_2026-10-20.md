# GUEST — matriz operativa de certificación PREVIEW y E2E
Fecha: 20/10/2026. Exclusivamente GUEST. Venta NO_GO.

## Precondiciones y estado comprobado
- Paquete recuperado: 16 entradas técnicas / 15 diseños potenciales + D03 histórico incorrecto; 121/121 hashes, 122 entradas físicas y CRC PASS.
- ZIP SHA256: `0fd69d40d5ee85862a71ba7eb34bba188563d79f9b2d0a0022524dbb6009a1bb`.
- Publicación: pendiente, sesión Cloudflare sin completar. No existe URL PREVIEW verificada de este paquete.
- Stripe: cuenta conectada solo `livemode=true`. Código GUEST usa una única clave configurada; entorno TEST aislado no acreditado. No inferir modo de backend a partir del conector ni modificar secretos globales que puedan afectar ONE.
- Correo: ningún correo nuevo ni destinatario TEST utilizado en esta fase. La recepción real no se presume por estados históricos.
- Másters, producción, pagos reales, ONE/Partner/STUDIO y clientes: sin cambios.

## Matriz que debe ejecutarse después de publicación
| Paso | Evidencia necesaria para PASS | Estado |
| --- | --- | --- |
| Destino | Panel identifica guest-weddlysmartdesign y entorno Preview | PENDING |
| Publicación | Cloudflare confirma éxito y URL real; producción conservada | PENDING |
| Integridad HTTPS | Manifiesto remoto idéntico + **120 recursos HTTP** SHA256/bytes/noindex. El archivo **_headers** (n.º 121) es configuración Cloudflare NO servida por HTTP: comprobar su pin de origen y la aplicación observable de noindex | PENDING |
| Renderizadores | 16 rutas y applyApi; revisión visual de las invitaciones sin cambios al máster | PENDING |
| Acceso anónimo | Visor final sin token válido deniega datos; no muestra pedido de otra pareja | PENDING |
| Stripe TEST | Contexto/clave TEST aislados y sesiones de pago con livemode=false, sin claves compartidas cambiadas | PENDING |
| Pedido A mínimo | Compra TEST real; cuestionario sin foto opcional; nombre/fecha y configuración propios persistidos | PENDING |
| Pedido B completo | Compra TEST real; datos distintos, fotos sintéticas, 2 ubicaciones, 5 momentos y 4 prácticos | PENDING |
| Revisión propietaria | Propietaria autorizada puede revisar ambas salidas; no requiere edición manual por pedido | PENDING |
| Revisión pareja | Datos y fotos correctos; revisión/aprobación con persistencia y paridad con cuestionario | PENDING |
| Correo | Identidad de envío y recepción real de los nuevos mensajes acreditadas con destinatario autorizado | PENDING |
| Entrega | Ambos pedidos delivered, token público válido, contenido correcto y sin confundir A/B | PENDING |
| GUEST | Acceso concedido después de entrega final; cuestionario gobierna RSVP y pareja no edita invitación/preguntas | PENDING |
| RSVP sí/no | Dos respuestas sintéticas persistidas, leídas en gestión correcta y sin mezcla entre pedidos | PENDING |
| Segundo dispositivo | Misma información del pedido y respuestas visibles tras sincronizar; diferenciar emulación de teléfono físico | PENDING |
| Android físico | Reproducción de vídeos, texto, botones, fotos y RSVP comprobados en dispositivo real | PENDING |
| Excepciones | Token inválido, acceso previo a entrega y reintento de pago no producen acceso ni duplicados incorrectos | PENDING |
| Autorización comercial | Identidad de diseño, precio, derechos y contratación confirmados por titular | PENDING |
| Apertura | Solo tras pruebas y decisión explícita; diseño D03 incorrecto excluido | NO_GO |

Los pedidos y medios serán sintéticos. No usar clientes ni dirigir correos a terceros no autorizados.
Dos pedidos acreditan ese recorrido concreto y los diseños utilizados: no certifican automáticamente todos los candidatos.

## Comprobador preparado
`guest/qa/verify_guest_preview_manifest_2026_10_20.py` toma `--origin`, `--manifest` y `--output`.
Usar el manifiesto canónico recuperado de `guest/qa-reports/preview16_recovered_manifest_2026-10-20.json`.
El origen debe ser la URL PREVIEW realmente devuelta por Cloudflare. El script rechaza producción y parámetros. No adivinar la URL.
Solo acredita integridad y noindex; las pruebas visuales, autenticación, compra, correo, entrega, GUEST y RSVP requieren evidencias separadas.

## Aclaraciones técnicas de FASE 7 — no inventar E2E
- **URLs canónicas HTML:** Cloudflare Pages redirige `*.html` a su ruta sin extensión y `*/index.html` a `*/`. El verificador permite estrictamente **un** salto equivalente dentro del mismo PREVIEW HTTPS; cualquier otra redirección se rechaza. Fuente: https://developers.cloudflare.com/pages/configuration/serving-pages/
- **_headers no es un recurso HTTP:** se valida su tamaño/SHA fijados y se comprueba `X-Robots-Tag: noindex` sobre todos los recursos servidos. No declarar “121 hashes remotos” porque son **120 remotos + 1 fichero de configuración protegido en manifiesto**. Fuente: https://developers.cloudflare.com/pages/configuration/headers/
- **Correos de pedidos internos TEST:** en Edge Function `guest-invitation-flow`, los estados de revisión/entrega de modo `test` no envían correo real. Su `PASS` de API nunca sustituye la recepción efectiva. La prueba completa con correo real solo es legítima en una operación de **Stripe TEST independiente**, con destinatario propio autorizado, sin modificar la clave Live compartida ni afectar ONE.
- **Handoff:** [fase 7](GUEST_AUDIT_CONTINUITY_PHASE7_PREVIEW_VERIFIER_2026-10-20.md), regresión de integridad CI `39427483317` SUCCESS 30/30; quedan PENDING toda la matriz remota y autorizaciones.


## Estado actualizado por evidencia real 20/10/2026 (fase 10 y vídeo PC)

La tabla original representa el plan ANTERIOR a la publicación. No usar su «PENDING» antiguo como estado actual. Evidencia más reciente: [fase 10](GUEST_AUDIT_CONTINUITY_PHASE10_CLOUDFLARE_PREVIEW_2026-10-20.md).

| Verificación | Estado y evidencia actual |
| --- | --- |
| Despliegue PREVIEW aislado | **PASS:** URL inmutable `https://eebba5b2.guest-weddlysmartdesign.pages.dev`; Wrangler confirmó éxito en proyecto correcto, sin reemplazar producción |
| Integridad HTTPS / 16 rutas | **PASS:** [GitHub run 39457669846](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39457669846): manifiesto firmado, 120/120 recursos HTTP, noindex y 16 renderizadores |
| Alias de rama `guest-preproduction-16-2026-10-20` | **FAIL:** Cloudflare «Nothing is here yet» observado en Chrome; utilizar URL individual validada |
| BOTÁNICA V14.7, portada PC | **PASS visual preliminar:** captura de portada con datos ficticios, fondo y tipos visibles |
| BOTÁNICA V14.7, recorrido PC | **INCIDENCIA ABIERTA:** la titular observó un cuadro no deseado en «Lo esencial» y aportó vídeo `20261020-1638-31.6856796.mp4`; no aprobado visual final |
| Integración de gestión / venta individual | **PENDIENTE:** [PR #144](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/144) y [PR #145](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/145) están en borrador; no fusionar sin prueba/autorización |
| Compra Stripe TEST, correo real, entrega, acceso GUEST, RSVP, dos móviles | **PENDIENTE:** sin evidencia E2E externa |
| Comercialización | **NO_GO:** cobros no autorizados, D03 histórico no vendible; resolver defecto BOTÁNICA antes de venta |

**Orden aprobado por la titular:** continuar conectando los componentes y corrigiendo los bloqueos de integración, después eliminar el cuadro visual de «Lo esencial» antes de GO. No marcar test visual completo como PASS porque la navegación preliminar pareciese correcta.


## Actualización FASE 12 — integración UI aislada (20/10/2026)

Se mantiene la matriz E2E real pendiente; **no interpretar pruebas de interfaz sin servidor como prueba comercial de la integración**.

| Control | Estado actualizado y evidencia |
| --- | --- |
| PREVIEW integración GUEST, sin datos ni venta | **PASS:** Cloudflare URL inmutable `https://f1b97db0.guest-weddlysmartdesign.pages.dev`, commit PREVIEW `77347f4...` |
| HTTPS y medidas de seguridad efectivas | **PASS:** [GitHub Actions 39465936172](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39465936172), siete rutas con noindex+CSP, manifest no-sale y hashes de cinco recursos clave |
| Proyecto/QA status no expuestos | **PASS:** fichero de estado, QA interna y SOURCE_LOCK excluidos del bundle y no descargables como JSON |
| Código GUEST + checkout individual combinación en navegador | **PASS solo OFFLINE simulado:** [run 39462831943](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39462831943), external APIs deliberadamente bloqueadas |
| Stripe TEST / entrega / emails / acceso GUEST y RSVP reales | **PENDING**: no se han probado; requieren entorno aislado seguro |
| PR #144/#145 en main | **DRAFT, sin publicar**: necesitan validación real y aprobación explícita |
| Reparación BOTÁNICA «Lo esencial» | **BUG ABIERTO**, pendiente después de conexión, antes de GO |
| Venta | **NO_GO** |


## Fase 15 — Supabase local real y Stripe sandbox simulated (sin servidor público)

| Verificación | Resultado |
| --- | --- |
| Backend Supabase efímero (Docker, 2 pedidos, aprobación/entrega, RSVP local) | **PASS** en [CI 39468741478](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39468741478), **sin** pago/correos reales |
| Checkout GUEST (código TS real transpilado, Stripe totalmente falso en VM) | **PASS** en [CI 39469442766](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39469442766); LIVE, precios o estados erróneos rechazados; no API externa |
| Seguridad: sin clave TEST cifrada no puede llamar a Stripe | **PASS** en [CI 39470359265](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39470359265) |
| Un pago Stripe TEST real con tarjeta ficticia | **PENDING**. Preparado test *sesión TEST impagada*, bloqueado `if:false` hasta entorno secreto protegido GitHub |
| Dos compras Stripe TEST completas, correo Resend auténtico, entrega, GUEST y RSVP remoto | **PENDING**. Requieren backend TEST remoto separado de Weddly Supabase LIVE y sin exceder 2/2 proyectos FREE |
| Diseño BOTÁNICA «Lo esencial» | **BUG ABIERTO**, corregir antes de GO |
| Ventas | **NO_GO** |

No cambiar estados históricos de la tabla de planificación original; el avance real está indicado arriba por evidencia.


## Fase 16 — una sesión auténtica Stripe TEST impagada

- **REAL TEST API PASS:** [Run 39473359246](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39473359246). Sandbox GUEST independiente del sandbox histórico ONE. Una sesión `cs_test` real creada y consultada por API con `livemode=false`, `status=open`, `payment_status=unpaid`; metadatos/importe sintético VEIL 5.3.3 comprobados. **No se pagó ni se envió correo ni se creó licencia**.
- **RE-BLOQUEADO:** [Run 39473530446](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39473530446) **SKIPPED**, workflow por defecto `if:false` otra vez, environment GUEST secret `sk_test` cifrado sin exponer.
- **PENDIENTES SIN CAMBIO:** dos compras Stripe TEST completadas en backend remoto aislado, correos de recepción real, revisión/entrega, licencia/gestión/RSVP dos móviles físicos, PR #144/#145, fallo BOTÁNICA y decisión de venta. **NO_GO**.


## Incidencia BOTÁNICA «Lo esencial» — ACEPTACIÓN VISUAL (20/10/2026)

- **PC VISUAL PASS, defect CLOSED:** la propietaria desplegó en Cloudflare PREVIEW exclusiva `guest-botanica-lo-esencial-fix-2026-10-20`, URL `https://55620fad.guest-weddlysmartdesign.pages.dev/guest/catalog-assets/botanica/14.7/` y confirmó **«ya se ve bien»**. El rectángulo visible queda **resuelto en PREVIEW**. No reiterar como bug abierto en próximos informes; sí exigir que el futuro pipeline comercial traslade el parche CSS versionado.
- **Verificación técnica PASS:** [4 tamaños Chrome](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39475897384), [staging SHA](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39476440097), [paquete aislado](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39478510394). Máster V14.7 congelado intacto.
- **NO cubre:** validación funcional de invitados y RSVP, compra/entrega y correos TEST reales o certificación de dos móviles físicos. Los otros criterios comerciales permanecen **NO_GO**.

**Si en secciones históricas de esta matriz aparece «fallo BOTÁNICA abierto», este cierre posterior tiene prioridad y lo reemplaza para la incidencia visual de escritorio concreta.**
