# GUEST by WeddlySmartDesign — BITÁCORA DE CONTINUIDAD INDEPENDIENTE DEL CHAT

**Entrada 52 — 11/10/2026.** Índice de recuperación y política de trazabilidad. Rama exclusiva `guest-independent`. Actualizar mediante **nuevos archivos de entrada**, nunca depender exclusivamente de mensajes, archivos temporales ni memoria de una conversación.

> **INSTRUCCIÓN PARA CUALQUIER NUEVO CHAT:** primero leer **este documento**, luego `guest/START_HERE.md`, `guest/GUEST_PROJECT_STATUS_V1.json`, `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json`, las entradas individuales enlazadas abajo y los contratos de `START_HERE`. Verificar HEAD y GitHub Actions más recientes. NO reconstruir decisiones desde conversaciones. NO afirmar resultado o sincronización sin consultar la fuente viva.

## 1. Ubicaciones, integridad y problema de Biblioteca

**Repositorio canónico de trabajo:** `WeddlySmartDesign/WeddlySmartDesign.github.io`, rama **`guest-independent`**, nunca `main`.

**Bitácora histórica de Biblioteca:** `/GUEST by WeddlySmartDesign/Normativa/Continuidad GUEST/GUEST_BITACORA_COMPLETA_ACTUALIZADA_2026-10-10.md`, `library_file_id=libfile_e2445a436f988191b59ef036d67ff0c8`, **versión 24** (última versión confirmada al escribir esta entrada). Conserva hasta la Entrada 50. El título del archivo refleja la fecha de origen, **no** el último día de su contenido.

**INCIDENCIA CONFIRMADA:** operaciones posteriores de `files.manage_library` al sobrescribir la versión 24 para incorporar Entrada 51 produjeron repetidas interrupciones/bloqueos de seguridad de la herramienta y errores visibles del chat. **No hay evidencia de corrupción del fichero, fallo de GUEST ni cambio de Supabase.** La sustitución no quedó confirmada; NO decir que Biblioteca tiene Entrada 51/52. **STOP: NO REINTENTAR OVERWRITE de este `library_file_id` en un bucle**, no eliminar ni reemplazar la versión 24. No presentar como “sincronizado” algo no comprobado.

**Continuación duradera por GitHub:** Entrada 51 y siguientes son archivos individuales del repositorio y este índice los enlaza. Por seguridad, **NO copiar indiscriminadamente el contenido completo de una Biblioteca privada a un repositorio que puede ser público**, especialmente sin revisar si contiene datos personales o credenciales. Conservar la Biblioteca histórica intacta y los resúmenes técnicos sin secretos en GitHub.

**Política a partir de ahora:** por cada avance relevante, registrar en la rama exclusiva un nuevo archivo `guest/GUEST_BOTANICA_ENTRY_NN_....md` con: fecha, objetivo, archivos afectados, commit de código, evidencia positiva/negativa, enlaces a runs, bugs reproducidos, arreglo y prueba posterior, qué NO se ha comprobado, criterios modificados, próximo paso único y restricciones. Actualizar `START_HERE.md`, el JSON de estado/evidencias **cuando corresponda** y mantener ESTE índice como puente entre Biblioteca v24 y entradas nuevas. Si falla la documentación, no dar por terminada la sesión ni forzar la misma operación bloqueada. Nunca guardar valores de tokens, URLs `?p=`/`?rt=`, códigos de propietaria ni datos de clientes.

## 2. Estado vivo comprobado ANTES de Entrada 52 (revalidar en cada sesión)

- HEAD de referencia previo a este índice: `443cd76eb814d7a91ce4bb0a6708900a044554d7`. El HEAD después de guardarlo cambiará; consultar la rama.
- GitHub Actions en ese HEAD: **GUEST Catalog and Continuity QA** [38141567306](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38141567306) **SUCCESS** y **GUEST Independent QA** [38141567326](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38141567326) **SUCCESS**.
- **Botánica V14.7:** visual master congelado de **11.635.635 bytes**, SHA256 `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`, confirmado previamente en live QA. Sin cambios visuales autorizados.
- **Cloudflare Pages Free:** `https://guest-weddlysmartdesign.pages.dev`; staging `PREPRODUCTION_DO_NOT_SELL`, `noindex`, checkout de Botánica inhabilitado. La propietaria completó Secrets de Supabase previamente: **NO volver a pedirle configurar Supabase**.
- **Supabase compartido GUEST:** `dnjsxequwgtyyauuofxj`; Edge `guest-invitation-flow` **V17 ACTIVE** con la fuente exacta corregida (`public_load` firmado devuelve el campo `order.mode`) y digest de bundle `accea6d258ff2bdd9b1366f174ea48f4852798105da4d103f5ec4835151d5aa2`. `guest-rsvp` **v5** inspeccionado; `guest-stripe-checkout` **v24** no modificado. NO desplegar otra vez V17 ni tocar Edge Functions ajenas sin regresión probada.
- **Pedidos reales de prueba:** cuatro Botánica `mode=test/status=delivered` creados por acceso legítimo de la propietaria en dos tandas; dos variantes únicas repetidas: una sede/historia cambiada y dos sedes/Story sin texto con PNG sintético. Revisión, aprobación y URL final Cloudflare registradas. **No crear más pedidos**. La propietaria recuperó los dos enlaces mediante la página de gestión temporal **read-only** `https://guest-weddlysmartdesign.pages.dev/guest/qa/owner-botanica-acceptance.html`; no almacenar capacidades.
- **Android:** dos vídeos físicos recibidos, variante una sede y dos sedes; la propietaria confirmó expresamente que las invitaciones estaban bien y el error se debía al chat. Alcance visual aprobado (no RSVP).
- **Cuestionario común:** Playwright Chromium móvil contra el HTML real y API simulada validó dos escenarios, siete pasos, guardado, validación, upload sintético y submit ficticio; [38141227802](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38141227802) **SUCCESS**. En Cloud hay pedidos autorizados por API; **NO se ha hecho una misma ejecución UI→Cloud real completa**.
- **RSVP Cloud:** consultas agregadas evidenciaron **7 pedidos TEST en total, 0 con licencia asociada**; 9 formularios RSVP activos y 33 submissions ajenos al recorrido Botánica. Ninguno enlaza directamente Botánica TEST con la gestión. El enlace final TEST `?p=` sin `rt/g/u` provoca `rsvp.route='#'`; un botón visible no demuestra RSVP persistente. **No declarar superado el gate RSVP**.

## 3. Los 11 criterios: verdad actual y límites

Fuente estructurada obligatoria: `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json` + `guest/GUEST_PROJECT_STATUS_V1.json`. Estado al cerrar Entrada 51: **7/11 PASS, 4 PENDING, `certification-pending`, NO-GO comercial**.

| Criterio | Estado | Evidencia/limitación |
|---|---|---|
| `common-questionnaire` | PASS (acotado) | Chromium móvil sobre cuestionario común con API simulada y compatibilidad Cloud probada de forma independiente; NO mismo UI→Cloud |
| `backend-test-only` | PASS | V17 Edge real + 4 órdenes TEST entregadas |
| `renderer` | PENDING | Viewer genérico y visual en final Android existen; **no certificado** en workspace gestor productivo |
| `config-matrix` | PASS | Variantes admitidas probadas en QA aislado |
| `two-real-test-orders` | PASS | Cuatro entregas reales, dos variantes |
| `review-final-parity` | PENDING | No contraste integral certificado revisión vs final por los mismos pedidos |
| `recipient-rsvp` | PENDING | Sin boda/RSVP por destinatario con licencia y lectura gestión Cloud para Botánica |
| `owner-android` | PASS (visual) | Dos vídeos y conformidad explícita de propietaria, no cubre RSVP |
| `owner-touch` | PENDING | Sin medición fiable de tiempo **activo** de propietaria preparando un pedido |
| `media-integrity` | PASS (acotado) | Recursos reutilizables inmutables verificados; foto TEST de 1×1 px no certifica calidad de foto real |
| `approved-visual` | PASS | Master protegido y conformidad Android de las variantes |

**NO activar venta o cambiar `certification-pending` hasta que estén los 11 PASS con pruebas diferenciadas y aprobación comercial expresa.** No iniciar diseño 03.

## 4. Índice cronológico de hechos y resoluciones; no reabrir trabajos terminados

**Historia anterior:** Biblioteca v24, `guest/START_HERE.md`, relevo anterior `guest/GUEST_HANDOFF_NEW_CHAT_2026-10-11.md` (contiene información **histórica y obsoleta sobre 3/11**, no usar ese número como actual) y documentación referenciada desde esos ficheros.

- **Entrada 41** (Biblioteca): propietaria finalizó configuración Supabase; pendiente prueba de efecto; continuidad Cloudflare.
- [Entrada 42](GUEST_BOTANICA_RUNTIME_AUDIT_2026-10-11.md): anomalía metadata V16/fuente leída V15; tests HTTPS Cloudflare + accesos anónimos 403; 0 Botánica en ese momento.
- [Entrada 43](GUEST_BOTANICA_ENTRY_43_URL_QA_2026-10-11.md): dos bodas aisladas en Supabase temporal, rutas comunes revisión/final y pruebas de gestión/RSVP simuladas o locales; corrección de expectativas antiguas; QA SUCCESS, **no producción**.
- [Entrada 44](GUEST_BOTANICA_ENTRY_44_V17_RELEASE_2026-10-11.md): se aisló **exactamente una línea** de cambio y se desplegó solamente `guest-invitation-flow` V17; **readback ahora coincide con fuente correcta**. Copia rollback V15 preservada en Biblioteca; checkout y ONE intactos.
- [Entrada 45](GUEST_BOTANICA_ENTRY_45_OWNER_ACCEPTANCE_2026-10-11.md): página de autorización de propietaria para pruebas TEST, validación externa Cloudflare, sin ventas.
- [Entrada 46](GUEST_BOTANICA_ENTRY_46_CLOUD_TESTS_RECOVERED_2026-10-11.md): se detectaron 4 pedidos TEST reales completados mientras el navegador no mostraba resultado; se sustituyó herramienta por **visor solo lectura** para no generar duplicados; QA arreglada tras actualizar baseline de evidencias.
- [Entrada 47](GUEST_BOTANICA_ENTRY_47_OWNER_RECOVERY_ANDROID_PENDING_2026-10-11.md): la propietaria confirmó recuperación de 2 pedidos; comprobación de gates y continuidad.
- [Entrada 48](GUEST_BOTANICA_ENTRY_48_ANDROID_TEST1_2026-10-11.md): primera captura y vídeo Android, variante una sede con historia revisada; constatación de límite RSVP.
- [Entrada 49](GUEST_BOTANICA_ENTRY_49_ANDROID_TEST2_2026-10-11.md): segunda variante dos sedes, tiempos 12:30 y 15:00, historia sin texto; vídeo Android. No repetir revisión visual.
- [Entrada 50](GUEST_BOTANICA_ENTRY_50_OWNER_ANDROID_VISUAL_OK_2026-10-11.md): confirmación directa de la propietaria: «Es del chat. Las invitaciones estaban bien»; gate Android visual acreditado, error no era del producto.
- [Entrada 51](GUEST_BOTANICA_ENTRY_51_QUESTIONNAIRE_AND_RSVP_BOUNDARY_2026-10-11.md): navegador móvil del formulario común, dos variantes, corregido click de opciones visuales en QA; dos workflows SUCCESS; gate cuestionario acotado. Identificado **bloqueo real de RSVP de Botánica:** ninguno de los TEST tiene licencia. **Esta entrada está en GitHub, pero NO confirmada en Biblioteca v24**.
- **Entrada 52 (este documento):** documenta incidencia persistente de actualización de Biblioteca, decide fuente de continuidad append-only GitHub y conserva explícitamente el estado exacto, índices de evidencias, gates y próximo paso. **No realiza cambios de código de producto**.

## 5. PUNTO EXACTO DE REANUDACIÓN — ejecutar sin pedir repetir nada

1. Comprobar HEAD y las dos últimas GitHub Actions **sobre el mismo HEAD**; leer el estado formal y este índice. Las capturas Android y las cuatro entregas TEST YA ESTÁN HECHAS. No volver a configurar Cloudflare/Supabase ni crear pedidos.
2. Prioridad real: **`recipient-rsvp`** por flujo legítimo de **licencia GUEST TEST propia** (no de ONE ni licencias de compradores), activa, boda/miembro autorizado, un invitado individual y una unidad. Generar un link con `rt/g` o `rt/u` desde la gestión auténtica, confirmar asistencia en navegador y comprobar **read-after-write** en gestión y Supabase usando solo metadatos y datos ficticios. No forjar tokens, no INSERT SQL, no reutilizar `?p=` solo para simular RSVP. Si falta autorización del gestor, pedir **una única acción concreta de usuario** mediante UI segura, no secretos por chat.
3. **`renderer`:** verificar renderización del diseño aprobado dentro del **centro real del gestor**, no solo el final público o las pruebas Playwright con mock.
4. **`review-final-parity`:** comparar para **los mismos pedidos existentes** la configuración y los recursos de revisión con el final entregado. Si las capacidades no se pueden recuperar de forma autorizada, documentar como pendiente en vez de simular.
5. **`owner-touch`:** medir minutos activos de preparación/aprobación que realiza propietaria en un pedido real (no tiempo de ejecución de CI ni espera del chat); máximo objetivo definido en estado JSON. No inventar un tiempo.
6. Tras cada comprobación, agregar entrada GitHub append-only, actualizar gates/estado estrictamente con evidencia, QA en verde. **Solo** con 11/11 y autorización comercial expresa se podrá desbloquear Botánica. El contrato de futuros diseños ya es `HTML visual + visual-plugin.json + registro + QA`, sin rehacer motor/checkout/infraestructura.

## 5 bis. Entrada 53 — revisión/final, bloqueo RSVP TEST (11/10/2026)

[**Entrada 53: hechos, QA y siguiente acción**](GUEST_BOTANICA_ENTRY_53_PARITY_RSVP_EVIDENCE_2026-10-11.md). **7/11 PASS; 4 PENDING, NO-GO.** Estado real: 4 Botánica TEST `delivered` con config correcta, 0 licencias. Backend `create_test` **siempre** crea pedidos sin `license_id`, mientras el envío personalizado `active_for_member` exige coincidencia con licencia y miembro activo. La invitación con solo `?p=` no tiene token `rt` y el botón RSVP no constituye persistencia. No enlazar mediante SQL ni modificar licencias ajenas. Paridad: mismas configuraciones persistidas para revisión/final y visor genérico, pero el **resultado Cloud autorizado todavía no se ha comprobado**.

Se añadió diagnóstico **read-only** revisión vs final a la recuperación privada de la propietaria, sin nuevas creaciones, y un QA estático de paridad. [QA catálogo previo 38143153914](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38143153914) SUCCESS, más ejecución de QA independiente a verificar en HEAD. **Siguiente paso:** validar camino legítimo de licencia GUEST TEST y receptor RSVP persona/unidad, sin afectar ONE, licencia comercial, `main` ni master visual. Después renderer gestor y tiempo activo. **La Entrada 53 NO ha sido sincronizada en Biblioteca v24**, no reintentar la sobrescritura fallida.

## 5 ter. Entrada 54 — puente verdadero de licencia TEST GUEST y RSVP (11/10/2026)

Leer [**Entrada 54**](GUEST_BOTANICA_ENTRY_54_V18_RSVP_TEST_LICENSE_2026-10-11.md). **Backend GUEST v18 ACTIVE** (bundle SHA `5a4d2e87415dabe7beecda03776e7745d12a7a2a44fe7cefd214852734bcaad2`): una sola nueva acción del gestor autorizada `link_test_license` que permite vincular **únicamente un pedido TEST de destinatario ficticio y estado delivered** a **licencia GUEST tester 7d, activada y con boda/miembro**, sin tocar ONE ni checkout. [Supabase TEMPORAL 38143844078](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38143844078) **PASS**: vínculo por gestor, 403 sin autorización, idempotencia, dos bodas, RSVP persona/unidad, persistencia y gestión. **Supabase Cloud:** código V18 real confirmado, pero **0 licencias GUEST tester y 0 pedidos Botánica vinculados tras deploy**; no dar por validado su E2E sin prueba legítima.

Página privada para UNA acción autorizada, sin repetir pedidos: `https://guest-weddlysmartdesign.pages.dev/guest/qa/owner-botanica-rsvp-e2e.html`, verificada por [Cloudflare HTTPS 38144681000](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38144681000). Tras login propietaria, prepara licencia de **7 días** GUEST QA reutilizable, activa boda ficticia, enlaza uno de los pedidos existentes y comprueba dos respuestas ficticias y read-after-write, sin pagos. **Todavía no ejecutada por la propietaria.** El QA estático adicional de esta página existe, pero su registro explícito en el workflow quedó bloqueado por la herramienta: no afirmar suite incorporada. Biblioteca v24 sin modificación.

**Estado 7/11, cuatro pendientes:** renderer gestor, paridad review/final cloud con propietario, RSVP Cloud auténtico persona/unidad, tiempo activo. NO desbloquear venta ni D03. Próximo paso exacto: ejecución con código de propietaria SOLO dentro de la nueva pantalla y captura de texto resultado sin tokens. Después verificar contadores Cloud y gate. No rehacer licencias ni usar Stripe.

## 5 quater. Entrada 55 — PRIMER RSVP TEST CLOUD PERSISTIDO EN GESTIÓN (11/10/2026)

[**Leer Entrada 55 de evidencia y continuidad**](GUEST_BOTANICA_ENTRY_55_CLOUD_RSVP_OWNER_ANDROID_2026-10-11.md). La propietaria ejecutó la certificación GUEST TEST v18 en Android. Su captura corresponde a un momento **intermedio**, pero los datos POSTERIORES verificables de Supabase Cloud acreditan **1 Botánica TEST entregada vinculada a licencia GUEST de prueba** (antes 0), **2 submissions de origen `guest`, `applied_at` verdadero**, asistencia **sí/no**, y `guest_app_state` confirmada/rechazada para las **dos personas ficticias de la misma unidad**. Los dos vídeos abren la **misma** invitación Botánica «Una sede»; son enlaces para **persona** y **unidad**, no dos diseños nuevos. **No hacer otra ejecución ni crear pedidos**. No se observa pulsación física del CTA ni pantalla RSVP en los vídeos; ese límite se conserva expresamente.

Gate `recipient-rsvp`: **PASS funcional en Cloud GUEST TEST**, alcance descrito en Entrada 55. **Estado ahora 8/11 PASS, 3 PENDING (`renderer` centro gestor, `review-final-parity`, `owner-touch`), NO-GO venta y NO D03.** A partir de esta entrada, párrafos históricos anteriores de este índice que mencionan 7/11 o “0 Botánica vinculada” son fotografías fechadas y quedan **superados por Entrada 55 y los dos JSON estructurados**. La Biblioteca histórica sigue intacta en v24; no intentar sobrescribirla.

## 5 quinquies. Entrada 56 — bloqueo de formato documental CI tras RSVP real (11/10/2026)

**LEER ANTES DE TRABAJAR:** [`GUEST_BOTANICA_ENTRY_56_QA_EXACT_STATUS_BLOCKER_2026-10-11.md`](GUEST_BOTANICA_ENTRY_56_QA_EXACT_STATUS_BLOCKER_2026-10-11.md). Cloud GUEST TEST RSVP confirmado real y gate de evidencia PASS (8/11). **El QA de continuidad está rojo únicamente porque `guest/GUEST_PROJECT_STATUS_V1.json` contiene `commercialGate.recipientRsvpPersistence='PASS real ...'` y el QA exige literalmente `'PASS'`.** Intento de corregir el JSON largo desde herramienta GitHub del chat: bloqueado. **CORRECCIÓN MÁS URGENTE: modificar SOLO ese valor a `PASS` (conservar detalle en Scope/Entrada 55), comprobar QA del mismo HEAD, nunca relajar la prueba o afirmar verde sin resultado.** Independiente QA en HEAD anterior SUCCESS. No más licencias, invitados, pedidos ni pruebas; no repetir la interacción de propietaria. Después seguir con los tres gates: renderer gestor, revisión/final y tiempo activo. Biblioteca v24 sin overwrite.

## 6. Restricciones permanentes

- NO tocar **ONE, ONE Partner, STUDIO, VEIL LIGHT congelado, `main`, master V14.7 Botánica** ni credenciales/servicios ajenos.
- Sin nuevas contrataciones ni pagos hasta aceptación comercial; 0 € nuevo coste.
- Gestión de pruebas y tokens: solo acceso legítimo; no publicar emails, códigos, capacidades ni URLs privadas completas en logs GitHub, chats o documentación.
- Distinguir evidencia **simulada en navegador**, **aislada local**, **Cloud real**, **Android físico**, **aprobación comercial**, sin confundirlas.
- No llamar “terminado” ni “listo para venta” si alguno de los cuatro gates comerciales sigue pendiente.

**Punto de continuidad inequívoco:** 7/11 PASS, 4 PENDING (renderer, review-final-parity, recipient-rsvp, owner-touch), Botánica NO-GO, próximo trabajo RSVPs auténticos vinculados a GUEST TEST. Bitácora Biblioteca **v24 intacta** + archivos GitHub individualizados y este índice, sin depender de este chat.
