# GUEST/Botánica — Entrada 55 · primer RSVP real de invitación TEST, dos destinatarios, leído en gestión

**Fecha:** 11/10/2026. **Evidencia primaria:** captura Android 16:06 (código secreto NO visible) y dos vídeos Android de la propietaria, 16:07 (9,47 s) y 16:08 (13,78 s). **Evidencia secundaria independiente:** consultas SQL SOLO LECTURA contra Supabase Cloud compartido de GUEST; no divulgar tokens, direcciones privadas, códigos ni grabaciones. Viene de Entrada 54, Edge V18. Rama `guest-independent`.

## Qué vio la propietaria; interpretación correcta

- Captura de la nueva página `/guest/qa/owner-botanica-rsvp-e2e.html` durante la ejecución. Estado **intermedio** «Validando autorización…» y registro ya avanzado: «Autorización de propietaria: OK», «Creando una sola licencia GUEST TEST válida 7 días», «Boda GUEST TEST activada (sin costes)», «Pedido Botánica TEST asociado a la licencia de gestión correcta», «Dos invitados ficticios y su unidad preparados». **La captura aislada NO muestra el texto final de PASS**; no inventar que lo muestra.
- Vídeo `1000095261.mp4`, ~9,47 s, y vídeo `1000095262.mp4`, ~13,78 s: **ambos visualizan la misma invitación Botánica de «QA Botánica y Una sede»** desde Cloudflare, con banda «VISTA DE PRUEBA · NO ENVIAR A INVITADOS», portada, contador, historia revisada, ubicación compartida (17:00), cierre y CTA «Confirmar asistencia». El segundo enlace es para **una unidad de dos invitados** y el primero para **una persona**: son **dos contextos RSVP distintos de un mismo pedido ya entregado**, no dos diseños diferentes. Eso es correcto y no significa que se hayan generado dos pedidos nuevos. Se observa navegación vertical; **NO se observa pulsación física del botón RSVP ni pantallas del formulario en esos vídeos**. No repetir los vídeos para comprobar la parte visual.

## Evidencia CLOUD real del RSVP y de la gestión (sin secretos)

- SQL agregada en Supabase real: **7 órdenes invitation TEST totales, 4 Botánica/test/delivered**, **1 de las 4 Botánica asociada a licencia**. Antes del ejercicio era 0/4; por tanto la acción V18 produjo el enlace autorizado con GUEST TEST y mantuvo las otras 3 sin vincular. Ningún pedido nuevo.
- Tabla `guest_rsvp_submissions` filtrada por claves **ficticias explícitas de QA**: exactamente **2 submissions**, origen `guest`, ambos `applied_at IS NOT NULL`. `qa-botanica-person-1` -> `attend=true`; `qa-botanica-person-2` -> `attend=false`. No se usaron invitados/clientes auténticos.
- `guest_app_state` consulta de agregados sobre bodas que contienen la clave de QA: **1 boda**, primera persona con `rsvp='confirmed'`, segunda con `rsvp='declined'`, **ambas pertenecen a `invitationUnitId='qa-botanica-unit-1'`**. Prueba read-after-write REAL en GUEST Cloud; los datos no son solo un mensaje visual o mock.
- `guest_rsvp_forms` asociados a licencia activa GUEST tester: **1 formulario activo**. No recuperar su publicToken ni ID en logs. Hubo un intento de obtener metadatos de licencias que la herramienta bloqueó por controles de seguridad; no eludir el bloqueo. Esos metadatos no son necesarios para acreditar las respuestas ya persistidas.
- Como comprobación adicional los dos vídeos abren el master con el mismo nombre de una sede: el enlace de persona y el de unidad conservan la invitación elegida al compartir, sin cambiar de diseño.
- Las pruebas preparadas antes del despliegue [Supabase LOCAL 38143844078](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38143844078) ya verificaban GET de persona/unidad, 403 anónimo, V18 enlace idempotente, POST RSVP real sobre Supabase aislado y readback por gestor en dos bodas distintas. El estado Cloud de esta entrada **no depende únicamente** de ese test aislado.

## Decisión formal de gate

`recipient-rsvp`: **PASS funcional CLOUD, limitado a respuestas GUEST TEST ficticias**: asociación real de pedido entregado Botánica a gestión autorizada, contexto de destinatarios individual/unidad, dos respuestas de origen `guest`, escritura y aplicación real de asistencia a `guest_app_state`, readback en gestión. Evidencia mayor que pruebas aisladas. **Limitación que no debe confundirse con gate pendiente de otro componente:** en los vídeos Android no se observa hacer clic en el CTA ni completar el formulario desde la UI del teléfono; contrato de rutas y navegador simulado ya tenían QA previa, pero la pulsación física en Android sigue sin mostrarse. No afirmar certificación de la experiencia exacta de clic físico ni soporte visual responsive del formulario por este vídeo.

Estado comercial tras cambiar formalmente el gate: **8 de 11 PASS, 3 PENDING: `renderer` centro real, `review-final-parity` directa y `owner-touch` tiempo activo**. Botánica permanece `certification-pending`, venta **NO-GO**, D03 bloqueado. ONE, Partner, STUDIO, VEIL LIGHT, `main`, master Botánica 14.7 y Stripe intactos; coste adicional 0 €.

## Siguiente trabajo (sin pedir volver a ejecutar esta prueba)

1. **Paridad revisión/final**: la página read-only `guest/qa/owner-botanica-acceptance.html` ya integra consulta `review_load` y `public_load` con ambas capacidades de un mismo pedido. Obtener conformidad/resultado si fuera necesario con la autorización de propietaria **sin generar nuevos pedidos**; revisar los casos de medias con URLs firmadas cuyo TTL difiere. No declarar paridad visual absoluta solo por JSON.
2. **Renderer Centro gestor**: confirmar versión real del Mobile Center en Android y trabajar en staged aislado; no modificar Mobile Center congelado ni la plantilla visual. El manifiesto de GitHub con `botanica.src=null` es bloqueo de producción deliberado, distinto de la copia estática preparada que ya se ve en final.
3. **Tiempo activo propietaria**: medición estricta tiempo de intervención, excluyendo chat/esperas. No inventar minutos; verificar herramienta de medición registrada en Centro V4.3/V4.6.
4. Por cada paso, escribir entrada append-only GitHub, actualizar `START_HERE.md`, `GUEST_PROJECT_STATUS_V1.json`, evidencias y QA, sin reintentar sobrescribir Biblioteca histórica v24.

**Continuidad exacta:** el RSVP de GUEST TEST en Cloud **sí ha persistido**; no reabrir ni repetir la prueba. La captura es de estado intermedio pero la DB posterior es evidencia independiente de éxito del guardado. Pendientes quedan tres gates y aprobación comercial expresa. No empezar Diseño 03.
