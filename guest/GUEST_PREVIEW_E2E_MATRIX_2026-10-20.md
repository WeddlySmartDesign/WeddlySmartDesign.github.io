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
| Integridad HTTPS | Manifiesto remoto idéntico + 121 recursos SHA256/bytes y noindex | PENDING |
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
