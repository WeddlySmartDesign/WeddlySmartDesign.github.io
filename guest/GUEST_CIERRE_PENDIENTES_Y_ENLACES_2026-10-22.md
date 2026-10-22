# GUEST by WeddlySmartDesign — PENDIENTES DEFINITIVOS Y ENLACES (22/10/2026)

**ESTADO ÚNICO:** `NO_GO_COMERCIAL`. El código de gestión GUEST ha superado automatización 30/30; **no está publicada ni certificada su versión final comercial**. No confundir `HTTP 200`, demo con datos ficticios o 15 másteres estáticos con un producto terminado. **No tocar ONE, ONE Partner ni STUDIO.**

**Punto de continuidad prioritario:** este archivo. Revisión factual realizada el 22/10/2026 frente a GitHub, controles Cloudflare, Supabase, registros agregados de pedidos TEST y Resend. Cada cambio debe actualizar estado y evidencia aquí **antes de afirmar GO**.

## ENLACES EXACTOS — hallazgo crítico

| Enlace | Qué se comprobó | Estado |
|---|---|---|
| `https://guest-weddlysmartdesign.pages.dev/guest/index.html` | HTTP 200 pero **877 bytes de portada «GUEST · preproducción»**, NO sirve la aplicación | **NO ES LINK FINAL FUNCIONAL** |
| `https://guest-finalization-candidate.guest-weddlysmartdesign.pages.dev/guest/index.html` | HTTP 200 y **la misma portada de 877 bytes**, NO app | **NO USAR COMO PRODUCTO** |
| `https://b9fa74ec.guest-weddlysmartdesign.pages.dev/guest/index.html` | HTTP 200 y **la misma portada de 877 bytes**, NO app | **NO USAR COMO PRODUCTO** |
| `https://dc3b7ffd.guest-weddlysmartdesign.pages.dev/guest/index.html` | HTTP 200, **HTML genuino de GUEST 4.238 bytes** y capas de acceso; versión anterior de rama demo | **PREVIEW DE CÓDIGO, NO FINAL, REQUIERE ACCESO** |
| `https://dc3b7ffd.guest-weddlysmartdesign.pages.dev/guest/guest-demo-one-parity-full.html` | HTTP 200, **DEMO de motor invitados** 9.297 bytes con datos ficticios | **DEMO FUNCIONAL PARA CAPTURAS, NO PRODUCTO FINAL** |
| `https://guest-weddlysmartdesign.pages.dev/guest/catalog-assets/botanica/14.7/index.html` | HTTP 200, máster Botánica de 11.635.635 bytes | **MÁSTER VISUAL, NO ENTREGA COMERCIAL / NO CONFUNDIR CON LINK FINAL** |

**Evidencia:** [Routes Diagnostic 39748331464](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39748331464), consulta pública sin token ni datos de clientes, contra estable, rama candidata y demo. [Smoke estricto 39748170194](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39748170194) **FAIL CORRECTO** porque detectó que Cloudflare sirve una portada de preproducción en lugar del núcleo real. El primer smoke superficial daba falso PASS por mirar solo HTTP 200 y marca; **no reutilizar** ese criterio.

**Enlace estable previsto para la futura entrega:** `https://guest-weddlysmartdesign.pages.dev/guest/index.html`. Hoy no funciona como app; NO PRESENTARLO como terminado. El futuro dominio final de marca solo se publica tras verificar HTTP, JS, acceso con licencia, eventos, invitación entregada y móvil real.

## LO QUE SÍ ESTÁ HECHO Y VERIFICADO

- **Código de gestión en candidata:** rama `guest-finalization-candidate-2026-10-22`, [PR #147 en borrador a guest-independent](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/147); todavía sin fusionar. NO representa publicación comercial.
- [Matriz GUEST 39745953137](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39745953137) **30/30 jobs SUCCESS**; pruebas del núcleo ONE, invitaciones y RSVP simuladas, listas/documentación, plano y mesas, eventos extra, dos sesiones simuladas, accesibilidad y visual 320/390/430px; [regresión final específica 39745953236](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39745953236) SUCCESS.
- Hoy: agrupa ráfagas (20 RSVP, 16 sí/4 no), conserva detalles/rectificaciones, distingue actividad de mesas y novedades, lectura por IDs, respuestas tardías, avisos persistentes no desaparecen al leer. Ajustes: compartir GUEST con pareja siempre visible, permisos del titular validados. Cinco temas. Eventos extra con tareas, pagos, presupuestos restaurados conforme ONE.
- **7/7 fuentes desplegadas en Supabase cotejadas por contenido exacto** con la rama documentada: `guest-stripe-checkout` V26, `guest-invitation-flow` V21, `guest-license-access` V5, `guest-rsvp-ensure` V3, `guest-rsvp` V6, `guest-orders-admin` V4 y `guest-personalization` V3. Otras funciones GUEST activas sin cotejo de archivo raíz independiente; ACTIVAS no significa E2E.
- Resend: dominio `weddlysmartdesign.com` verificado; correos de **pruebas anteriores** GUEST realmente entregados el 6 y 7/10/2026. NO equivalen a correo de compra Stripe TEST actual.
- Datos agregados y sin PII: **8 pedidos TEST**: 6 entregados, 1 en diseño y 1 enviado a revisión; ninguno vinculado a `checkout_session_id`; de seis entregados, cuatro tienen URL final y uno licencia. Es coherente con ensayos `create_test`; **falta la prueba de checkout real hasta licencia**. No mutar estos pedidos ni reutilizarlos como pruebas certificadas de compra.

## PENDIENTES BLOQUEANTES EN ORDEN DE EJECUCIÓN

### [ ] P0-01 — PUBLICAR LA APP COMPLETA EN EL HOST FINAL
**Responsable:** asistente con acceso de Cloudflare autorizado, sin intervención técnica de la titular.
- Averiguar por qué la publicación Cloudflare de GUEST estable y candidata expone la portada de **877 bytes** para `/guest/index.html` y demás rutas (posible empaquetado de Pages solo para revisión artística). No basta con cambiar un link ni con un placeholder personalizado.
- Preparar rama de publicación PREVIEW que exponga de verdad las rutas: `/guest/index.html`, `/guest/access.html`, `/guest/guests-v114-integrated.html`, `/guest/guests-events-v3.html`, `/guest/guest-settings.html`, módulos JS, listados/documentos, RSVP público y assets sin abrir licencias ajenas.
- **Criterio de cierre:** GET 200 con HTML real y longitud/estructura coherente, 26 scripts cargando 200 sin respuestas placeholder, consola sin fallos, landing/login sin acceso a datos sin token y licencia válida funcionando. Verificar con navegador real, no solo estado «Deploy successful».
- No reemplazar producción sin QA y decisión de lanzamiento; preview primero.

### [ ] P0-02 — DESPLEGAR EL PAQUETE MULTIMEDIA ÍNTEGRO EN PREVIEW
**Responsable:** asistente.
- Paquete recuperado documentado en Biblioteca: `GUEST_PREPRODUCTION_16_VERIFICADO_2026-10-20.zip`, SHA256 esperado `e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216`; validar bytes, árbol/manifiesto y rutas antes del despliegue. La numeración de 16 incluye **D03 histórico inválido para venta**.
- Subir **exclusivamente** a la PREVIEW de `guest-weddlysmartdesign`, verificar recursos reales desde HTTPS y vínculos con registradores. No publicar paquete incompleto ni editar másteres originales; imágenes/vídeos/fuentes/versiones preservados.
- **Cierre:** manifiesto totalmente verificado (documentación previa menciona 121 recursos), respuestas públicas 200 de assets y reproducción de apertura/cierre en móvil; ausencia de errores; D03 antiguo sigue bloqueado.

### [ ] P0-03 — CERRAR CATÁLOGO, DISEÑOS Y VISOR DE ENTREGA
**Responsable:** asistente y aprobación visual final de la titular solo si es indispensable.
- Registro actual: **16 entradas**, 1 `commercially-frozen` (VEIL LIGHT), 15 `certification-pending` (incluye Botánica y D03 histórico). Objetivo comercial son **15 candidatos verdaderos**: VEIL LIGHT, BOTÁNICA y D04–D16, con **Limoneros válido en D09**, no el D03 histórico erróneo.
- `GUEST_CATALOG_OWNER_RENDERERS_V2.json`: VEIL LIGHT usa `mode:native`, mientras `guest/catalog-final.html` exige `mode:iframe`; el adaptador de VEIL existe para paquete **STAGING**, no está instalado/validado en el host comercial. Los otros diseños tienen `src:null`. **Bloqueo de entrega confirmado por lectura de código.**
- Conectar cada `src` real comprobado, aplicar configuración del cuestionario con datos correctos, no nombres de demo, fotos ni fechas falsas; probar paso continuo portada→cierre, dos ubicaciones, 5 momentos/4 prácticos, RSVP según cada máster y los controles específicos; probar dos pedidos sin edición técnica.
- Congelar cada diseño de forma **individual** tras aceptar calidad, escalabilidad y medios; NO imponer colecciones Essential/Signature/Atelier ni reactivar D03.

### [ ] P0-04 — FINALIZAR Y PUBLICAR WEB COMERCIAL MÓVIL
**Responsable:** asistente; posible aprobación editorial de la titular.
- Dirección visual aprobada para trabajar: V5 mobile-first (21/10), **en revisión y no publicada**; no reutilizar V2/V3/V4 rechazadas.
- Mostrar todos los diseños individuales en el móvil, incluida versión correcta Limoneros, con datos ya personalizados en muestras, movimiento editorial, sin parecer copia de terceros ni doble navegación, y navegación directa a la invitación completa.
- Explicar flujo auténtico: compra → cuestionario en menos de 24 h → invitación prevista 48–72 h → revisión y cambios razonables → aprobación → entrega → acceso a GUEST únicamente tras entrega. Aclarar plazo condicionado a recibir datos y pruebas.
- Revisar precios/precio final, IVA y condiciones comerciales por diseño, CTA y soporte. **Cierre:** móvil físico + landing de producción revisada y vinculada al catálogo, sin link falso ni checkout activo antes del GO.

### [ ] P0-05 — STRIPE EN MODO TEST + COMPRA A PEDIDO AUTOMÁTICO
**Responsable:** asistente; eventual acción muy breve de titular para autorizar/conectar Stripe TEST de forma segura.
- Connector Stripe accesible **solo en `livemode:true`** de WeddlySmartDesign. No lanzar transacciones reales de prueba ni asumir que esto equivale a TEST. La función checkout V26 comprueba estado pagado, provisiona licencia, crea encargo `create_paid` y envía cuestionario; verificación estática no demuestra flujo real.
- Ejecutar al menos **dos compras Stripe TEST reales** con diseños elegibles: precio/IVA, retorno, firma de webhook, idempotencia, duplicados, reintento de correo, licencia y pedido automático con `checkout_session_id` `cs_test_...`; no debe activar GUEST antes de entrega.
- **Cierre:** evidencias del evento Stripe TEST, orden vinculada, enlace de cuestionario correcto, ausencia de cargo LIVE y estado idempotente tras reintentos.

### [ ] P0-06 — RECORRIDO PEDIDO, CORREO Y ENTREGA FINAL
**Responsable:** asistente.
- Completar desde pedidos TEST con cuestionario/fotos, validación de datos, propuesta generada, revisión propietaria, revisión pareja, modificaciones, aprobación, URL de entrega `/guest/catalog-final.html?p=...` y correo final entregado. Verificar mensaje en menos de 24h y objetivos de entrega 48–72h solo bajo condiciones del producto.
- Verificar errores/reintentos de Resend, rebotes/supresiones, soporte y registro de cumplimiento (Resend carece ahora de webhooks; valorar si se necesita webhook o consulta periódica sin crear notificaciones espurias). Correo actual de GUEST usa API directa, NO plantilla ONE.
- **Cierre:** 2/2 casos completos con evidencias reales de recepción y entrega; no usar 6 TEST manuales anteriores como sustituto.

### [ ] P0-07 — GUEST REAL DESPUÉS DE ENTREGA Y DOS DISPOSITIVOS
**Responsable:** asistente; prueba física mínima autorizada si el acceso técnico no permite emular dispositivo real.
- Verificar ausencia de acceso antes de `delivered`; titular accede tras entrega; en Ajustes comparte enlace seguro caducable con la pareja; segundo miembro se une una sola vez, sin duplicar licencias.
- Pruebas sobre dos sesiones/dispositivos autorizados: RSVP invitación real sin edición por pareja, alta/importación, grupos/subgrupos, unidades de envío, multiselección y plano interactivo de mesas, asignación, listados con control documental, preboda con invitación y envío independiente, menús, actividad/avisos de Hoy, lectura sincronizada, conflicto offline→online, recuperación y copia segura.
- **Cierre:** móvil Android/iPhone donde proceda + sincronización PC↔móvil comprobada, datos de otras bodas inaccesibles, no errores o duplicados tras desconexión.

### [ ] P0-08 — SEGURIDAD, DERECHOS Y SOPORTE OPERATIVO
**Responsable:** asistente para auditoría técnica; titular solo en aprobación comercial/condiciones legales.
- Revisar autorización de tokens públicos/privados, expiración y revocación de invitaciones, cabeceras, CSP, noindex de previews, seguridad de RSVP, aislamiento, restauración de respaldo y restauración verificable de datos; jamás exponer `service_role`.
- Supabase advisor: RLS activado en tablas GUEST sin políticas cliente; acceso previsto solo por funciones autorizadas. No desactivar RLS por alerta INFO. Otras alertas `SECURITY DEFINER` conciernen sistemas fuera de GUEST; tratar por separado, no modificar ONE/Partner.
- Comprobar pruebas documentales de **derechos de uso comercial** de imágenes/vídeos (Recraft), música y tipografías, además de condiciones, privacidad, cumplimiento fiscal y precios definitivos de los diseños. Sin prueba, no afirmar licencia comercial.
- **Cierre:** informe jurídico/comercial y técnico sin bloqueos P0, copia/restore ensayada, soporte y tratamiento de incidencias definidos.

### [ ] P0-09 — CERTIFICACIÓN Y PUBLICACIÓN FINAL
**Responsable:** asistente para evidencias y checklist; titular para decisión comercial indelegable de abrir venta.
- Ejecutar `guest/qa/catalog_commercial_go_no_go_2026_10_20.cjs --launch-gate` con pruebas externas documentadas **sin parchear tests para forzar GO**.
- Tener por diseño la validación visual y dos pedidos reales TEST sin intervención técnica; confirmar URL definitiva del módulo, landing y masters, sin pantalla de preproducción o datos ficticios.
- Solo tras cumplir **todos** los P0 anteriores, integrar PR #147 en rama `guest-independent` con QA completo; desplegar producción de GUEST exclusivamente y activar oferta/checkout **sin tocar ONE ni STUDIO**.
- Registrar firma GO, reversión comprobada, seguimiento postpublicación de pagos, cuestionarios, correos y licencias. Una sola fuente de verdad de versión, URLs y SHA.

## INTERVENCIÓN DE LA TITULAR — SOLO CUANDO SEA IMPRESCINDIBLE
1. Eventual autorización/login seguro de Cloudflare y contexto **Stripe TEST**. Nunca contraseñas, tokens ni datos bancarios en el chat.
2. Validación final de calidad editorial y precios/condiciones de venta que solo la titular puede aprobar. Agrupar estas decisiones en una única intervención preparada fuera de jornada.
3. Autorización comercial para activar ventas LIVE **solo después** de evidencia GO completa; no solicitar antes.

## NO HACER
- No llamar «final» a la portada de 877 bytes ni a una demo con invitados ficticios.
- No confundir presencia de `guest/index.html` en GitHub con publicación en Cloudflare, ni que el PR esté en verde con disponibilidad para clientes.
- No registrar compras reales, no enviar correos reales ni alterar datos/cobros de parejas existentes por motivos de QA.
- No tocar código congelado ONE, STUDIO, ONE Partner, masters originales ni rama `main` ajena a GUEST.
- No usar URL del histórico Limoneros D03 ni 15 imágenes como prueba de 15 diseños comerciales. Sin precios, derechos y licencias verificados, no abrir ventas.

## ORDEN DE CONSULTA EN UN FUTURO CHAT
1. Este archivo `guest/GUEST_CIERRE_PENDIENTES_Y_ENLACES_2026-10-22.md`.
2. `guest/START_HERE.md`.
3. `guest/GUEST_FINALIZATION_CONTINUITY_REAL_STATUS_2026-10-22.md`.
4. PR #147 (`guest-finalization-candidate-2026-10-22`) y su QA 30/30.
5. [Diagnóstico de rutas 39748331464](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39748331464) y [bloqueo HTTP real 39748170194](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39748170194).
6. Manifest del ZIP `GUEST_PREPRODUCTION_16_VERIFICADO_2026-10-20.zip` y registro maestro individual, sin recrear diseños con assets aproximados.

**Estado al cierre: NO_GO; no existe aún un enlace FINAL de GUEST que cargue el producto nuevo completo en el dominio estable.**


## ACTUALIZACIÓN CERTIFICADA: MÓDULO DE GESTIÓN PREVIEW Y PWA (22/10/2026)

Esta actualización modifica la lectura de los pendientes P0-01 y P0-07 y se impone al diagnóstico anterior del placeholder 877 bytes **solo para la rama PREVIEW**. El dominio estable de producción NO ha sido promocionado.

| Área | Estado verificable |
|---|---|
| P0-01A — GUEST íntegro en Cloudflare PREVIEW | **HECHO Y COMPROBADO**: frontend real, 26 scripts, acceso, Invitados, Mesas, Hoy, Ajustes, eventos y RSVP. No es versión LIVE de clientes |
| P0-01B — Dirección estable comercial | **PENDIENTE** de certificación y promoción; producción sigue aislada |
| P0-02 — Biblioteca multimedia de 15 candidatos | **223/223 recursos publicados y hashes SHA-256 exactos** en PREVIEW [run 39788551824](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39788551824). No implica que 15 diseños estén aprobados comercialmente ni que el antiguo D03 sea elegible |
| P0-07A — Acceso y gestión con datos sintéticos en HTTPS real | **PASS** [Chrome run 39793573548](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39793573548): abre motor e iframe reales, Hoy, navegación y denegación 403 sin revelar la caché |
| P0-07B — Regresión extensa Cloudflare con usuarios sintéticos | **TODOS LOS PASOS FUNCIONALES DEL JOB PASS** en [run 39794561142](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39794561142): red, permisos, Hoy, invitados, 20 RSVP, temas. Consultar conclusión global del run, no dar por finalizado si aún procesa limpieza |
| P0-07C — Instalación PWA, caché y rutas limpias | **CÓDIGO Y EMPAQUETADO QA PASS** [run 39794977086](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39794977086): 44 recursos actuales, redirecciones Cloudflare sin .html, caché sin URL de token ni API. **Uso físico sin conexión aún no certificado** |
| P0-03 a P0-09 — Flujo comercial completo | **NO_GO**: Stripe TEST 2 pedidos, cuestionario, aprobación, diseño final, correo, entrega, licencia real, dos dispositivos reales, web comercial, derecho de uso y autorización de venta |

### Referencias exactas e invariantes
- [Rama PREVIEW](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/tree/guest-cloudflare-full-app-preview-2026-10-22) y [PR #149](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/149) siguen aislados y en borrador.
- PREVIEW verificada con origen de prueba `https://775213e7.guest-weddlysmartdesign.pages.dev/guest/access.html`; la última compilación Cloudflare del PWA limpio fue `https://0db89765.guest-weddlysmartdesign.pages.dev/guest/access.html` (comprobar prueba de navegador del último commit antes de difundir).
- [PR #147](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/147) contiene el módulo GUEST candidato, no está fusionado.
- Hallazgo técnico: Cloudflare Pages redirige rutas `*.html` a rutas limpias sin la extensión; pruebas Chromium se corrigieron para admitir ambas. El service worker V6 precachea 44 recursos del núcleo ONE-parity y normaliza redirecciones. Una denegación auténtica 401/403 impide mostrar la copia local; una caída de red permite uso offline previamente autorizado.
- No se desplegó ningún cambio de Stripe, Resend o Supabase ni se enviaron correos o cargos. No se creó licencia ni se alteraron datos existentes.
- **Ventas deshabilitadas.** NO confundir QA remoto sintético con cliente real o sincronización física.

**Siguiente paso que sí depende de autorización/capacidad externa:** acceso seguro a Stripe TEST + verificación real de Cloudflare/Resend con pedido E2E y dos dispositivos. Preparar todo autónomamente y pedir a la titular solo la mínima autorización inevitable fuera de jornada.
