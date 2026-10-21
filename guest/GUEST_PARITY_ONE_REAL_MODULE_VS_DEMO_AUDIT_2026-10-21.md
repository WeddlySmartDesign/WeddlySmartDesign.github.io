# GUEST · Auditoría de paridad REAL con Invitados de ONE y rectificación de DEMO — 21/10/2026

## Motivo y decisión definitiva

La propietaria aporta dos grabaciones: `1000097653.mp4` (DEMOSTRACIÓN PROVISIONAL GUEST) y `1000097654.mp4` (módulo Invitados real de ONE). La DEMO independiente para capturas creada el 21/10 y publicada en la rama `guest-demo-capturas-2026-10-21` **NO representa el producto GUEST, NO es su versión final y NO se debe usar en material comercial**. Su dibujo de mesas, gestión simplificada y ausencia de opciones no son evidencia de carencias del motor GUEST real.

**Regla de la propietaria (expresa y vinculante):** GUEST conserva la funcionalidad del **módulo Invitados de ONE**, incluidos grupos/subgrupos/unidades, alta/importación, plano visual interactivo con elementos del salón, altas y asignación directa, invitaciones/envíos/RSVP, listados, eventos extra con invitación y envío independiente, etc. EXCEPCIONES deliberadas: los compradores GUEST reciben la invitación principal final personalizada y solo pueden VER y ENVIARLA; no editan la invitación ni configuran/alteran el formulario RSVP. Acceso de la pareja solo tras aprobación y ENTREGA final. ONE debe permanecer congelado; mantener GUEST aislado.

## Auditoría documental y estática realizada

- Se inspeccionaron ambas grabaciones de aproximadamente 25 y 26 segundos mediante extracción temporal de fotogramas.
- Fuente leída: GitHub `WeddlySmartDesign/WeddlySmartDesign.github.io`, rama `guest-independent`, y correspondencias raíz ONE. La DEMO rechazable vive en rama separada y NO ha reemplazado `guest/index.html`.
- Se inspeccionaron `guest/index.html`, `guest/guests-production-sync.js`, `guest/guests-v114-integrated.html`, `guest/guests-v081-visual-seating.html`, `guest/guests-seating-v2.js`, `guest/guests-people-manager-v1.js`, `guest/guests-events-v3.html`, `guest/guests-events-v3.js`, `guest/guests-events-invite-addon-v1.js` y `-v2.js`, `guest/guests-events-share-composer-v1.js`, `guest/event-invite-v2.html`, `guest/guests-rsvp-operations-live.html`, `guest/guests-rsvp-share-composer-v3.js`, `guest/guest-events-product-v1.js`, `guest/GUEST_MODULE_CLOSEOUT_2026-10-17.md`, `guest/GUEST_MODULE_OPERATIONAL_AUDIT_2026-10-16.md` y QA B6/B7.
- `guests-seating-v2.js` (ONE raíz y GUEST) comparte EXACTAMENTE SHA Git `9235db5d5a43b759fd84e140d479e3dc0ee0a4a8`; `guests-v114-integrated.html` y `guests-v081-visual-seating.html` de ONE y GUEST comparten estructura general con cambios de denominación/branding. `guests-events-v3.js` reutiliza el motor, con endpoint backend GUEST separado del endpoint ONE.
- Existen QA de pantalla/función bajo `guest/qa/b6_4_tables_lists_test.js`, `guest/qa/b6_5_extra_events_test.js`, `guest/qa/b6_6_two_device_sync_test.js`, `guest/qa/b7_4_tables_lists_visual_test.js`, `guest/qa/b7_5_extra_events_visual_test.js`, entre otros. Estos tests usan API simulada y no certifican actividad remota ni dos teléfonos físicos. El cierre 17/10 documenta GUEST Independent QA run 39014686799 SUCCESS (31 jobs), pero no es certificado de producto final publicado.

## Matriz de paridad: existencia de implementación vs certificación real

| Función | Evidencia de código GUEST | Estado verificado en esta auditoría |
|---|---|---|
| Inicio y navegación real ONE → GUEST | `guest/index.html`, `guests-production-ui.js`, `guests-v114-integrated.html` | Existe código real; no fue reproducido en DEMO. |
| Alta manual, importación CSV/TXT/TSV/pegado, búsqueda/edición | `guests-v114-integrated.html`, `guests-people-manager-v1.js` | Existe código; pruebas anteriores con datos sintéticos. |
| Grupos y subgrupos, unidades de invitación, destinatarios | `guests-v114-integrated.html`, `guests-people-manager-v1.js`, `guests-invitation-units-v2.js` | Existe código; DEMO carece de profundidad y flujo correcto. |
| Mesas, plano interactivo de salón, formas/elementos, arrastrar, dimensionar, girar | `guests-v081-visual-seating.html`, `guests-seating-v2.js` | Motor real localizado. La DEMO lo sustituyó por tarjetas circulares: INVALIDA. |
| Seleccionar varios invitados, asignar/mover/desasignar, crear y sentar | `guests-v081-visual-seating.html`, `guests-seating-v2.js` | El código contiene acciones de selección múltiple, `seatSelected`, `bulkAssign` y reparaciones de alta/asiento. |
| Invitación principal ya aprobada y su envío por contacto/unidad | `guests-catalog-invitation-bridge-v1.js`, `guests-rsvp-share-composer-v3.js` | Implementado en fuente; E2E auténtico de invitación entregada → envío → RSVP pendiente. Debe fallar cerrado sin entrega válida. |
| Estados RSVP, registro manual y datos del invitado (+1, menú, alergias, transporte) | `guests-rsvp-operations-live.html`, `guests-rsvp-operations-v3.html`, scripts `rsvp` | Código y pruebas sintéticas; no equivalen a entrega real. |
| Preboda y eventos extra con invitados distintos | `guests-events-v3.js`, `guests-events-v3.html` | Código real, no presentado de forma válida en DEMO. |
| Invitación propia de cada evento, destinatarios y enlace/RSVP propio | `guests-events-invite-addon-v1.js` carga `-v2.js` + `guests-events-share-composer-v1.js`; `event-invite.html` redirige a `event-invite-v2.html` | Implementación específica existe; pruebas B6.5/B7.5 con backend simulado. No afirmar envío/RSVP E2E real publicado. |
| Tareas, presupuesto y pagos asociados a eventos dentro de ONE | `guests-events-v3.js` conserva motor, PERO `guest-events-product-v1.js` oculta/retira estas secciones del DOM | **DESVIACIÓN REAL DE PARIDAD DETECTADA**. La simplificación preexistente choca con la instrucción actual «resto exactamente como ONE». No confundir ausencia visual con inexistencia del motor; revisar y corregir en rama GUEST con QA antes de publicar. |
| Exportación/impresión, PDF, CSV, catering, eventos extra | `guests-production-ops.js`, `guests-extra-event-lists-v1.js`, `guests-service-visibility-v1.js` | Código y pruebas B6.4/B7.4; demo no reproduce toda la experiencia. |
| Tema visual, ajustes y segunda persona | `guest-settings.html`, `guests-production-sync.js` | Código presente; test B6.6 en navegadores simulados, falta validación real de 2 dispositivos bajo pedido GUEST. |
| No editor de invitación ni config RSVP de comprador | `guests-production-ops.js`, `guests-rsvp-operations-live.html`, backend `guest-rsvp` v6/`guest-personalization` v3 documentados en cierre | Restricción intencionada y correcta. No recuperar el editor ONE por error. |
| Alta y acceso solo tras entrega final | Flujo catálogo/licencia `active_for_member`, fuente de cierre 17/10 | Regla escrita; E2E comercial y licencia reales siguen pendientes. |

## Rectificación de la DEMO y prohibiciones

- La versión `https://354213a1.guest-weddlysmartdesign.pages.dev/guest/guest-demo-capturas.html` es una **maqueta alternativa simplificada**, no se usará como aceptación, capturas de venta, ni prueba de funcionalidad GUEST; el branch `guest-demo-capturas-2026-10-21` no es source of truth.
- La URL antigua `https://f1b97db0.guest-weddlysmartdesign.pages.dev` es una PREVIEW de integración con backend deliberadamente bloqueado; no demuestra manejo real.
- La fuente autorizada del motor continúa `guest-independent/guest/index.html`, no una UI reconstruida. Publicar una PREVIEW para capturas con el **motor real** exigirá datos de boda ficticios en aislamiento y prueba de navegación a todas las rutas, sin conectar secretos ni datos de terceros, y sin simular funcionamiento de backend como real.
- NO tocar ONE, ONE Partner, STUDIO, diseños maestros, cuentas/recursos de otras apps, ni activar venta.

## Puntos antes de decir «GUEST terminado» o permitir capturas comerciales

1. Rectificar en rama de GUEST el ocultamiento no autorizado de funciones ONE en eventos, tras validar su alcance; las rutas de edición de invitación y config de RSVP sí deben seguir bloqueadas.
2. Ejecutar **matriz paridad interactiva** con motor real: alta/importación → grupos/subgrupos/unidades → elegir varios → añadir mesa/salón y sentar → mover/desasignar → sincronizar → eventos/preboda → configurar invitación autónoma/seleccionar unidades → envío RSVP propio → listas PDF/CSV. Pruebas a 320/390 px y móvil físico.
3. Establecer PREVIEW de capturas REAL, con fixturas ficticias, sin pagos, mails o escritura en producción. No enviar otro enlace de maqueta.
4. Posteriormente certificar con dos entregas GUEST end-to-end TEST autorizadas el puente de invitación principal, licencias, RSVP, event invite/RSVP independiente, persistencia y segundo móvil. No confundir pruebas mock con E2E.
5. Mantener bandera comercial NO_GO hasta permisos y evidencia completa.

**Conclusión:** lo visto en el primer vídeo refleja una DEMO equivocada; **no prueba ausencia de los módulos en el código real**. Sí se detectó una desviación documentada del motor original en el ocultamiento de tareas/presupuesto/pagos del módulo de eventos. El módulo fuente está ampliamente construido, pero no se dispone de evidencia suficiente para certificar su publicación operativa final y paridad completa en un dispositivo real.
