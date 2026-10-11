# GUEST / Botánica — Entrada 49 · segundo recorrido Android real de dos sedes

**Fecha:** 11/10/2026. Fuente primaria: vídeo de Android `1000095247.mp4` (14,35 s, 1220×2712, 24,2 fps aprox.) enviado por la propietaria en la conversación. Los fotogramas se revisaron en secuencia completa y en detalle; **no subir vídeo ni imágenes personales a GitHub ni incluir tokens en documentación**. Continuidad: Entrada 48 (primera invitación, una sede). No reutilizar la conversación como única memoria: guardar en la bitácora acumulativa.

## Observaciones visuales verificadas

- La **invitación final TEST** de Botánica carga efectivamente en Android a través del enlace privado de Cloudflare, con aviso visible `VISTA DE PRUEBA · NO ENVIAR A INVITADOS`; sin error de carga observado.
- Portada del segundo escenario: **«QA Botánica y Dos sedes»**, fecha **12/06/2027**. Tipografía editorial Botánica y fondos florales de versión congelada; textos de portada observados sin recorte.
- Bloque de cuenta atrás: encabezado **«YA QUEDA MENOS»** y contador; visibles y legibles en los fotogramas observados.
- Ubicaciones en modo **split**: **CEREMONIA · Ceremonia ficticia · 12:30** y **CELEBRACIÓN · Celebración ficticia · 15:00**, separadas y en orden correcto, sin títulos cortados. Contrasta con el Test 1, que presentaba **un solo lugar compartido** y un cambio de historia aprobado.
- En el recorrido revisado **no se ve el texto de historia personalizada** que estaba desactivado en este pedido. Esto es compatible con `story.textMode=none`, pero la duración y los saltos rápidos de la grabación impiden certificar cada bloque intermedio o la fotografía de historia.
- Bloque de cierre **«SOLO FALTA UNA COSA / ¡Nos acompañáis?»**, botón visible **«Confirmar asistencia»**, fecha y nombres. Navegación vertical funcional entre portada, contador, sedes y cierre. El vídeo no muestra la pulsación del botón.
- La franja clara bajo el cierre se reproduce en las dos pruebas. **No afirmar que sea bug de diseño sin comparar con el master**: puede ser espaciado/scroll residual del documento embebido; clasificar como revisión de acabado, no como bloqueo ya confirmado.
- No se observa una fotografía real en el vídeo. El archivo de imagen usado en este test es un **PNG sintético de 1×1 píxel**, deliberadamente insuficiente para validar recorte, definición o composición con una foto de boda. El backend sí registra archivo subido: SQL agrupada `split/none` = 2 encargos cloud, 2 uploads; `shared/custom` = 2 encargos, 0 uploads.

## Evidencia de base de datos (solo agregados, sin capacidades)

Consulta Supabase de `guest_invitation_orders`: **4 `botanica/test/delivered`**, 4 con revisión/aprobación/URL de Cloudflare. Escenario `locations.mode=shared` + `story.textMode=custom`: 2/2 entregados, 0 fotos subidas; `locations.mode=split` + `story.textMode=none`: 2/2 entregados, 2 fotografías sintéticas subidas. Ningún pedido de producción ni cobro real.

Último HEAD de partida de auditoría: `12950fb92f0cc9f27ab3b046b58696b4971f6dc6`, **Catalog/Continuity QA y Independent QA: SUCCESS** en ese commit.

## Criterios y decisiones

**No se modifica el master visual congelado.** Se ha comprobado en Android físico la legibilidad inicial, portada, ubicaciones de **ambas variantes**, cuenta atrás, cierre y recorrido vertical. Esto reduce el pendiente visual, pero **NO es suficiente para marcar automáticamente `owner-android` o `review-final-parity` como totalmente PASS**: no se ha hecho cotejo directo revisión frente a entrega, prueba de botón/RSVP, foto de tamaño real, ni validación de todos los elementos con datos de pareja reales.

Además, `guest/guest-catalog-delivery-runtime-v1.js` pone `rsvp.route='#'` si falta `rt`. Los 4 pedidos TEST se crearon sin `license_id` y sus enlaces finales de propietario contienen `?p=` pero no un contexto de destinatario `rt/g/u`. **No pedir a la propietaria probar RSVP desde esos enlaces**, ni afirmarlo como validado. Hay que resolverlo a través del flujo real autenticado de invitado/unidad + gestión, no insertando datos artificiales por SQL ni compartiendo tokens.

**Estado de admisión conservador:** Botánica **5/11 PASS, 6 PENDING, NO-GO comercial**. Quedan: `common-questionnaire`, `renderer`, `review-final-parity`, `recipient-rsvp`, `owner-android` (validación completa), `owner-touch`. No activar venta/Stripe ni comenzar diseño 03. ONE, ONE Partner, STUDIO, VEIL LIGHT, `main`, master aprobado sin cambios; coste adicional 0 €.

**Siguiente trabajo del asistente:** cerrar el mínimo verificable de paridad y la ruta auténtica de RSVP/gestión sin rehacer la plataforma. Revisión Android de ambos escenarios parciales registrada; no pedir repetir grabaciones ya recibidas.
