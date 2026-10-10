# GUEST — reconciliación del contrato de configuración con backend real (09/10/2026)

**Checkpoint técnico, no certificado comercial.** Fuente de continuidad única: [START_HERE.md](START_HERE.md) y estado estructurado [GUEST_PROJECT_STATUS_V1.json](GUEST_PROJECT_STATUS_V1.json). Exclusivamente `guest-independent`. No sustituye el máster ni habilita D03, despliegues, correos o pagos.

## 1. Evidencia externa examinada

- HEAD al comenzar: `934bad928943f348683f8faa73c772a9e49730ec`; `compare_commits(base, guest-independent)` confirmó igualdad.
- Proyecto real Supabase `dnjsxequwgtyyauuofxj`; `guest-invitation-flow` activo **v12**, digest real `69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac`, 512 líneas de `index.ts` y únicamente `veil-light` en `CATALOG_TEMPLATES`. Se leyó el contenido real de la Edge Function, no una reconstrucción de conversación.
- La función `guest-stripe-checkout` sigue en **v20**, separada de `guest_invitation_orders`: opera licencias/cobros y un flujo antiguo de detalles. **No se ha modificado ni probado con pagos**. La centralización del `insert` de `guest_invitation_orders` se revisó en la v12 y exige reconfirmación antes de desplegar.
- **No se ha ejecutado SQL de escritura, despliegue, creación de órdenes, envío real de correo, Stripe ni modificación de masters congelados.**

## 2. Desajustes observados y decisión común

| Contrato real V12 / discrepancia | Corrección preparada en rama, NO desplegada |
|---|---|
| `buildConfig` omite `schemaVersion` y `cover.photo` | Preparador V13 añade `schemaVersion` y normalizador compartido representa `cover.photo:null` cuando falta. |
| `story.textMode='none'` se fuerza a `preset` | Preparador V13 conserva `none`; exige fichero de Historia al usar solo foto y mantiene `preset/custom`. |
| Fotografías `autoFrame:true` no declaradas | Esquema admite `autoFrame:boolean` sin modificar medios. |
| `wedding.coverPlace:''` con portada oculta y `location.address:''` real | Esquema admite vacíos; validador exige lugar de portada **si** `cover.showPlace:true`. |
| `mapsUrl/websiteUrl` y otras URLs opcionales emitidas como `''` | Normalizador convierte solo URL opcional vacía en `null`; una URL inválida no vacía sigue fallando. |
| Flags `rsvp.plusOneEnabled/childrenEnabled/customQuestions/menu/dietary` y recogida RSVP de transporte/alojamiento definidos como obligatorios aunque `buildConfig` no los emite | Dejaron de ser **obligatorios** en configuración de invitación. **No se inventan ni desactivan opciones del motor de gestión GUEST**; el motor existente conserva su propia configuración/almacenamiento y sigue pendiente verificar RSVP E2E. |
| Longitudes del esquema inferiores a las que `txt()` realmente permite para bus, hotel, regalo y playlist | Alineadas con límites reales del generador; las limitaciones semánticas continúan comprobándose globalmente. |
| Esquema estructural insuficiente para estado `none` o módulos opcionales | Validador compartido incluye invariantes foto-only, texto personalizado, portada visible, 1/2 sedes, agenda, galería, bus, playlist. |

Código y pruebas, **sin editar plantillas ni VEIL**:
- `guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json`
- `guest/tools/backend_config_contract_v1.cjs` (función pura normalizadora; idempotente)
- `guest/qa/validate_invitation_config_v1.cjs` (estructura + invariantes semánticas)
- `guest/tools/prepare_test_only_backend_v13.cjs` (genera copia de la v12, inyecta normalizador común y barreras de pruebas, **no despliega**)
- `guest/tests/invitation_config_schema_contract.test.cjs`
- `guest/tests/backend_config_contract_v1.test.cjs`
- `guest/tests/prepare_backend_test_only_v13.test.cjs`
- `.github/workflows/guest-botanica-contract-qa.yml` incorpora las regresiones.

## 3. Pruebas ejecutadas y nivel de evidencia

**PASS en arnés aislado JS de esta sesión:** 3 scripts de pruebas CJS descargados del HEAD de la rama, con sustituciones en memoria de dependencias Node (fs/path/child_process) y salida generada del registro simulada. Prueban fixture mínimo del esquema, variantes de Historia, normalización idempotente, 2 sedes, preservación VEIL y 5 mutaciones del preparador. El código preparador se aplicó exitosamente al **texto exacto** de la Edge Function v12 observado, produciendo una candidata **no desplegada**. Esta prueba **NO** es ejecución nativa de Node sobre repo clonado ni valida el generador real de registros.

**PASS con productor real, entradas sintéticas en memoria:** se extrajo y ejecutó la función `buildConfig` efectiva de v12 en un arnés JS aislado con **dos cuestionarios ficticios** (VEIL normal y Botánica con Historia solo foto/dos lugares/bus/galería). Su salida original produjo errores de esquema (respectivamente **8** y **9**), y las respectivas salidas con correcciones V13 previstas y normalizador pasaron el validador estricto (0 errores en ambos). **No son pedidos guardados, no hay sesión ni upload real, URL firmada, entrega ni RSVP persistido.**

**GitHub Actions observado:** el correo verificado y el log de la ejecución `37967724099` del workflow `GUEST Catalog and Continuity QA (offline)` para el commit intermedio `48429d9` muestran fallo `SyntaxError: Invalid or unexpected token` en el paso de preparación/contrato. Hubo una regresión introducida en la edición del validador, corregida después en el commit `87a5a1521453597aaef26aa68854191a19151b1b`; se verificó su sintaxis en el arnés. **NO se ha acreditado aún un PASS nativo posterior de ese workflow**. En `GUEST Independent QA`, ejecución `37968228481` del commit `87a5a15`, falló únicamente el job `b6-invitation-rsvp` (los demás jobs de esa página, salvo paginación, completados), log: `children opt-in was not persisted in config payload`. Es un fallo adicional del motor/invitación, **no se ha corregido ni atribuido sin prueba causal a Botánica**. Se debe diagnosticar separadamente sin alterar código congelado, antes de declarar CI verde.

### Corrección del control B6 (09/10/2026; exclusiva rama GUEST)

El test real `guest/qa/b6_3_invitation_rsvp_test.js` espera persistir `questions.children:true` cuando se marca «Niños». En el código efectivo de `guest/guests-rsvp-form-flex.html`, `save()` ya recogía correctamente `$('childrenQ').checked`. La causa reproducible por inspección es una **carrera de carga**: el formulario exponía los checkboxes y guardado antes de que la `load()` asíncrona finalizase, por lo que la asignación tardía de `cfg.questions?.children` podía deshacer una selección del usuario. Esto concuerda exactamente con la secuencia del test, que espera el nodo DOM, no su hidratación. No hay evidencia de fallo de persistencia real de Supabase en ese log: la API del test es simulada.

**Reparación genérica de frontend en la rama, no publicada:** `guest/guests-rsvp-form-flex.html` inicia 6 flags, botón añadir pregunta y botón guardar en `disabled`; después de cargar la configuración remota, personalización y dibujar resumen habilita todos una sola vez. Si `load()` falla, sigue bloqueado y muestra error; no se guarda una configuración inventada. No se toca ONE, RSVP server, ni los masters congelados.

Nueva regresión `guest/tests/rsvp_form_async_load_guard.test.cjs` (PASS en arnés JS de esta sesión, estática) comprueba ocho bloqueos, secuencia remota anterior al desbloqueo, y que menores/alojamiento se serializan desde controles. Incluida en el workflow `guest-botanica-contract-qa.yml`. **La prueba Playwright `b6_3_invitation_rsvp_test.js` en GitHub Actions debe volver a ejecutarse y pasar: no declarar reparado en CI real antes de verlo.** La ejecución `4b14e0d` del catálogo también avisó de fallo durante una versión intermedia del test de bloqueo, cuya aserción excesiva sobre el `finally` del botón de guardado se corrigió en `ce6ea90dbc915dad3f3d5a2911d8dff90d1f1619`; falta verificar CI de este último commit.

## 4. Bloqueos que no se han cerrado

1. El **backend desplegado permanece v12** y carece de los cambios: sin permiso de despliegue autorizado, no ejecutar v13 por otra vía.
2. La candidata **no es desplegable/certificable sin auditoría previa de todas las rutas**: `set_config` en v12 guarda configuraciones arbitrarias sin validar esquema; `mark_review_ready` acepta `resolved_config` preexistente; `hydrateConfig` sustituye cargas firmadas no disponibles por `''`, lo que puede invalidar `src`; también deben revalidarse correo de pruebas, autorización, guard de creación/Stripe y rollback.
3. El nuevo Mobile Center con visor V2/cuest. corregido **no está conectado ni desplegado** en el Centro real. Conservar V4.6, VEIL y Botánica V14 congelados.
4. **Ocho de once gates comerciales permanecen PENDING**: cuestionario común real, backend test-only real, visor propietario real, dos pedidos reales de prueba, paridad review/final, RSVP con escritura, Android y tiempo de atención ≤5 min. Los únicos PASS siguen siendo matriz local, integridad de medios, visual V14 ya aprobada.
5. No se ha probado un despliegue ni ejecución de E2E real. Venta, Stripe, envíos, publicación y D03 siguen prohibidos.

## 5. Siguiente operación técnica sin intervención de la propietaria

1. Obtener una ejecución nativa **verde** de `guest-botanica-contract-qa.yml` para el HEAD actual (y diagnosticar por separado `b6-invitation-rsvp`), preservando cualquier protección ajena a GUEST.
2. Antes de autorizar siquiera un despliegue test-only, completar barrera de validación al guardar `set_config`, rechazo en `mark_review_ready`/entrega si configuración real incoherente, tratamiento de `upload:` sin firma y auditoría rigurosa de cinco rutas de correo + creación/checkout; verificar regresión VEIL. Documentar prueba antes/después.
3. Solo en entorno autorizado y con rollback, instalar backend **únicamente test-only**, sin correos reales y sin Stripe; después integrar **nuevo** Centro V2, sin sustituir V4.6.
4. Completar dos E2E reales con datos ficticios, persistencia RSVP del motor existente (usuario y unidad), preview/review/final/URL; capturar evidencias redactadas. Finalmente solicitar solo revisión artística final Android y medir ≤5 min.
5. Actualizar el expediente `GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json` solo cuando exista evidencia **real**. Mantener `--admit botanica` fallando hasta completar 11/11. Autorización comercial/publicación independiente.

**Regla de cierre:** ninguna evidencia de este documento promueve `botanica` a `commercially-frozen`. Cada futuro diseño reutiliza el esquema y el pipeline; no se crea un motor o formulario particular.

## 6. Segunda fase: protección integral del candidato V13 (09/10/2026, NO DESPLEGADO)

**Regla:** código en `guest-independent`, preparador fuente `guest/tools/prepare_test_only_backend_v13.cjs`; Supabase continúa V12. Nada de SQL de escritura, despliegue, correos, Stripe o cambio de plantilla congelada.

- **Contrato real en el ciclo de vida:** `guest/tools/invitation_runtime_gate_v1.cjs` verifica versión de plantilla fijada, JSON Schema completo (validador común), enlaces de medios y ruta RSVP neutral `'#'`. Se inyecta en creación de config tras `submit`, `start_design`, `set_config`, `mark_review_ready`, aprobación, `send_review`, y pre/post `deliver`. `review_load` y `public_load` pasan por una función de lectura: para nuevos pedidos exige igualmente contrato estricto.
- **Fotografías firmadas:** `hydrateConfig` pasa de reemplazar `upload:` no resuelto por `''` a fallar con `missing_signed_asset`. La respuesta de API distingue error de contrato (400) y medio no disponible (409), sin imprimir datos privados en la respuesta.
- **Prueba ≠ publicación:** la candidata V13 no llama a `copyPublicFiles` en `order.mode==='test'`; entrega un token de acceso al servicio existente y firma las fotos privadas a cada lectura. Conserva `resolved_config` con `upload:<slot>`, sin guardar enlaces temporales caducables. El camino de producción permanece separado y requiere su propio QA; no se habilita Botánica en producción.
- **Seguridad de RSVP:** no se aceptan URLs de redirección ni enlaces de invitado persistidos en la configuración del pedido; los parámetros `rt`, `g/u` y `lang` se aplican posteriormente mediante el helper común existente, sin duplicar motor.
- **Fecha de boda:** el validador compartido verifica el día real, incluidos años bisiestos; 30 de febrero se rechaza antes de que llegue a una plantilla.

**Pruebas incorporadas al workflow `.github/workflows/guest-botanica-contract-qa.yml`:** `guest/tests/invitation_runtime_gate.test.cjs` y ampliación de `guest/tests/prepare_backend_test_only_v13.test.cjs` con casos/mutaciones de fijación de plantilla, medios privados, contraseñas no necesarias, rutas de estado y comprobación de sintaxis TypeScript por `node:module.stripTypeScriptTypes` de Node 22. También continúan los tests del esquema, normalizador y guard de RSVP. El arnés aislado de esta sesión ejecutó las **cuatro suites principales** con módulos simulados; el preparador generó correctamente V13 a partir del archivo real de Edge Function v12 (sin desplegar). La comprobación **nativa** de TypeScript/CI corre exclusivamente en GitHub Actions; no se ha confundido el mock de esa API con su ejecución real.

## 7. Riesgo de compatibilidad detectado por consulta SQL **solo lectura**

La tabla `public.guest_invitation_orders` tenía **3 registros históricos de prueba** y **0 pedidos de Botánica**, todos bajo `veil-light`: dos `delivered` y uno `designing`. Los tres carecen de `schemaVersion`. En dos pedidos, `template_version` de orden era `2026-10-06` mientras `resolved_config.template.version` era `3.1.0`; en el tercero ambos campos correspondían a `5.3.3`. No se han leído nombres, email, tokens, imágenes ni datos personales; se consultaron únicamente estados, versiones y recuentos agregados.

**Consecuencia:** forzar sin distinción los controles nuevos a todos los pedidos antiguos rompería la lectura y alteraría evidencia histórica. La candidata incorpora ahora **compatibilidad genérica de lectura**, no de escritura: `assertLegacyDeliveredTestRead` permite leer únicamente pedidos `mode='test'`, `status='delivered'`, sin `schemaVersion`, con ID de plantilla coincidente, RSVP neutral y fotos ya firmadas HTTPS. No modifica ningún registro, no acepta producción, no sirve para `set_config`, aprobación, ni nuevos pedidos. Sigue siendo necesario probar en entorno autorizado los dos pedidos históricos entregados y estudiar por separado el tercero `designing` antes de una migración; **la regresión VEIL no se ha certificado**.

**CI independiente observado en GitHub Actions:** ejecución `37971333514` del commit `d316f3f`: el job `b6-invitation-rsvp` **PASÓ**, por lo que el guard de hidratación introducido anteriormente superó esa prueba real de navegador. El workflow general **FALLÓ** por `b6-two-device-sync`: `same-field conflict did not preserve the second device local choice: Celíaco`. No se ha atribuido ese error al cambio RSVP ni a Botánica sin prueba causal. Faltan repetición determinista e inspección del algoritmo de merge para ese job, y confirmación de CI catálogo verde sobre el HEAD más reciente. Los fallos antiguos de commits intermedios no justifican saltarse controles.

## 8. Punto exacto de reanudación

1. Confirmar rama `guest-independent`, HEAD y CI completo. Verificar que las últimas suites del candidato V13, incluido strip TypeScript nativo, pasan en GitHub Actions y que la antigua prueba B6.3 se mantiene verde. Si hay fallo, leer logs del job, corregir causa concreta y no difundir el estado PASS anterior como actual.
2. Comprobar en una prueba de código aislada que `review_load` y `public_load` aceptan los dos `delivered` históricos sin mutar registro, y rechazan registros nuevos malformados y URLs firmadas ausentes. La ruta `designing` antigua requiere evaluación específica antes de autorizar despliegue.
3. Investigar B6.6 de sincronización sin tocar ONE/Partner/STUDIO ni masters; no reducir la aserción para ocultar pérdida real de datos.
4. Revisar preparación de rollback, llamadas a correos, `set_config`, guard test-only y checkout; **cualquier operación antes bloqueada sigue sin autorización**. No desplegar por vía alternativa.
5. Solo después, ejecutar E2E real test-only con dos pedidos independientes, revisión/final, paridad, RSVP persistente, Android y tiempo ≤5 minutos. Seguir **3/11 PASS y 8 PENDING** hasta evidencias reales. D03 no se inicia.

**No se ha generado un nuevo diseño, no se ha modificado la V14 aprobada ni la candidata V14.7, y la única versión real de Supabase sigue siendo v12.**

## 9. 10/10/2026 — Puerta de despliegue: entorno aislado inexistente y compatibilidad histórica verificada SIN PII

**Esta sección añade evidencia de explotación real, no modifica la candidata V13 ni habilita el despliegue.** Consultados mediante el conector Supabase, exclusivamente de lectura, el proyecto `dnjsxequwgtyyauuofxj`, las ramas disponibles, las versiones activas de funciones, el esquema de `guest_invitation_orders` y agregados anónimos de tres pedidos históricos. Se contrastó también el HEAD y ambas QA de GitHub antes de trabajar.

### Topología observada (fecha de consulta 10/10/2026)

- **Supabase GUEST:** `guest-invitation-flow` ACTIVE v12, SHA `69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac`; `guest-stripe-checkout` ACTIVE v20, SHA `c81575ca422e05c943f029ce5a10f3b382676b718529b4b68231abc7a0ba88ce`. Ambas tienen `verify_jwt:false` en metadatos; deben seguir sujetas a sus barreras de autorización internas. Ningún cambio de función.
- **Ramas de Supabase:** `list_branches` devolvió **`[]`**. No existe un entorno aislado de prueba conectado que permita cambiar el backend sin afectar directamente a la Edge Function activa.
- **Proyectos visibles:** el proyecto activo compartido de WeddlySmartDesign y otro proyecto **STUDIO** inactivo. **STUDIO no es un entorno de pruebas de GUEST, no debe utilizarse ni tocarse.** No se ha creado proyecto nuevo, desplegado, ni solicitado ningún cambio de plan.
- El backend V13 generado en GitHub es una **candidata**, no una versión que se pueda probar hoy sustituyendo de forma segura la v12 activa. No se intentó sortear el bloqueo administrativo registrado el 09/10.

### Comprobación real agregada de compatibilidad (SQL SELECT, sin PII)

Se evaluaron exactamente los invariantes pertinentes del `assertLegacyDeliveredTestRead` previsto: `mode=test`, `status=delivered`, ausencia de `schemaVersion`, correspondencia de `template.id` con la orden, RSVP neutro y medios con fuentes HTTPS; se revisó separadamente la igualdad de versiones. Solo se mostraron **recuentos por estado** y resultados booleanos agrupados:

| Grupo histórico | Registros | Cumplen condiciones de lectura heredada (inspección SQL, **no prueba del backend**) | Versión fijada igual a la versión interna | Filas con medios no HTTPS / estructura irregular |
|---|---:|---:|---:|---:|
| VEIL `test/delivered` | 2 | 2 | 1 | 0 |
| VEIL `test/designing` | 1 | No es aplicable la excepción de entregados | 0 | 1 |

La única fila `designing` tiene versión antigua no coincidente y al menos una referencia de medio que no cumple la condición para contenido **ya hidratado**; esto NO prueba pérdida de fotos ni corrupción: podría ser un `upload:` válido mientras el trabajo está en curso. **No convertirla, editarla, borrarla ni reinterpretarla automáticamente.** La excepción heredada existe únicamente para lectura de `delivered`, nunca mutación ni `designing`.

La comprobación SQL es una **aproximación estática conservadora** de la lógica, no demuestra que `review_load` o `public_load` reales pasen, ni que el tercer pedido se pueda continuar en V13. No se consultaron identificadores de filas, nombres, correos, archivos, enlaces privados, tokens ni contenidos textuales.

### Decisión GO/NO-GO obligatoria

**NO-GO** para actualizar en este momento `guest-invitation-flow` de v12 a V13 en el proyecto activo. Razones independientes: (1) `list_branches=[]`, sin ambiente de pruebas autorizado; (2) orden histórica `designing` no cubierta por compatibilidad V13 y susceptible de ruptura; (3) faltan QA navegador/Android, dos E2E y rollback probado. Una actualización directa sería una prueba sobre producción, no una certificación responsable. Nada de usar el proyecto STUDIO ni desplegar por una vía alternativa para sortear la restricción.

Para convertir esta condición en GO **sin rediseñar la arquitectura**, el siguiente operador deberá acreditar, por orden: (a) destino de pruebas **legítimamente aislado/autorizado**, con coste y permisos conocidos, que no sea el proyecto STUDIO; (b) respaldo exacto de v12, versión/verify_jwt/configuración y camino de reversión; (c) decisión explícita sobre la **continuación del test histórico `designing`** sin alterar sus datos; (d) V13 solo test-only, sin Stripe, correos ni recursos públicos permanentes, con prueba VEIL; (e) Centro V2 nuevo y dos pedidos E2E de Botánica más RSVPs g/u y Android; (f) 11/11 gates antes de considerar venta, bajo autorización comercial independiente.

**Importante:** ninguna alternativa debe exigir comprar un plan o herramienta por defecto; la opción de staging deberá valorarse por coste concreto y seguridad. Un entorno local aislado requiere recursos y una vía de ejecución realmente disponible; no se afirma que exista en la sesión actual. Las suites GitHub offline están en verde pero **no levantan un backend real**. Mantener Botánica 3/11 y no iniciar D03.

## 10. 10/10/2026 — La entrega de pruebas no demuestra el puente con invitados; criterio verificable de E2E

**Pruebas de servicio SOLO LECTURA; no hay despliegue.** Se cotejó el código de la función activa `guest-invitation-flow` v12 y los módulos `guest/guests-catalog-invitation-bridge-v1.js` / `guest/guest-catalog-recipient-context-v1.js` con tres consultas SELECT agregadas, sin recuperar datos personales, tokens, licencias concretas ni fotografías.

### Tres dependencias del circuito comercial real

1. **Entrega con URL final:** v12 permite que un pedido `test` pase a `delivered` sin `invitationUrl`: `delivery_url` termina como `null`. Los **dos** ensayos históricos con estado `test/delivered` tienen efectivamente **0 URLs finales**. Una etiqueta de estado no acredita la invitación lista para compartir. En el generador **NO DESPLEGADO** de V13 se ha cerrado la discrepancia: tanto `test` como `production` deben presentar `invitationUrl` no vacío antes de registrar `delivered` (commit `aebf544e48d4e6b285e36b7417df7bd8867edb1f`). La prueba de contrato que impide volver a admitir test sin URL es `guest/tests/prepare_backend_test_only_v13.test.cjs` (commit `9ad67b7b346778854058e08afc8fdea2db146673`); no retroconvierte los registros históricos ni promueve Botánica.
2. **Misma licencia en app de gestión:** `active_for_member` busca únicamente una invitación `delivered` con `guest_invitation_orders.license_id = wedding_members.license_id` y una `delivery_url` no vacía. `create_test` crea `license_id:null`. En SQL agregado, **0 de los 2 pedidos test entregados** tienen licencia asociada y **0 de 2** cumplen ambas condiciones. Aunque se entregue con URL en V13, **eso no prueba automáticamente el envío desde la app**. No asociar una licencia real a un test ni habilitar rutas de producción por conveniencia. La prueba de integración comercial GUEST↔gestión debe utilizar una licencia *ficticia válida* en entorno aislado (sin afectar usuarios reales) o un procedimiento equivalente revisado y autorizado.
3. **RSVP personalizado y persistencia:** el bridge ya preparado añade `rt` y `g` **o** `u`, más `lang`, sobre la URL final; `guest-catalog-recipient-context-v1.js` reconstruye la ruta de la gestión RSVP existente. Hay que observar en un entorno con **escritura de prueba autorizada** que las respuestas de persona y unidad se guardan en el motor GUEST, no solo que los enlaces llevan parámetros. Los dos pedidos históricos no constituyen dicha evidencia.

### Almacenamiento real verificado por metadatos, SIN leer fotos

- `storage.buckets.guest-invitation-uploads`: **privado**, tamaño máximo 15 MiB, formatos JPEG/PNG/WebP/HEIC/HEIF.
- `storage.buckets.guest-invitation-public`: **público**, mismos límites. Precisamente por esta distinción, **V13 en modo test no debe copiar fotos a public**; debe firmar las fuentes privadas temporalmente, conservar los `upload:` persistidos y renovar los enlaces temporales al recuperar la invitación.
- Las únicas políticas RLS de `storage.objects` observadas en la consulta agregada corresponden a documentos de Partner (4 políticas); no se efectuaron operaciones `INSERT/UPDATE/DELETE`. Esto no equivale a certificar seguridad: hay que revisar la función de servicio y su control de permisos en la rama de pruebas.

### Dos E2E obligatorios (no meros mocks)

**Pedido de prueba 1, Botánica foto-only:** historia `none` con fotografía, dos sedes distintas, RSVP con destinatario `g`, revisión de propietaria, aprobación de pareja, URL final HTTPS **no vacía**, recarga y persistencia real de respuesta. Se comprueba que no se envían correos, no hay Stripe y ningún archivo de prueba se copia a bucket público.

**Pedido de prueba 2, Botánica variante distinta:** historia `custom` o `preset`, una sede, módulos opcionales en otra combinación, destinatario de unidad `u`, todos los pasos anteriores y paridad entre vista de revisión y URL final. No reutilizar configuraciones ni valores del primer pedido.

**Prueba comercial separada de asociación a licencia:** un miembro de gestión **ficticio** en staging aislado debe obtener la invitación `delivered` correspondiente, enviar desde el compositor existente y comprobar tanto `g` como `u`. No utilizar ni alterar licencias reales; comprobar las autorizaciones y el aislamiento antes de crear fixtures. El circuito E2E solo se acredita cuando se ejecuta de verdad, con logs fechados y sin PII persistida en documentos.

### Vía de ejecución y coste (sin decisiones de compra)

En la lectura de las herramientas actuales, `list_branches` devolvió `[]`: no hay rama Supabase disponible. Según la documentación de Supabase consultada el 10/10/2026, las **ramas preview requieren Pro**, crean entornos separados sin copiar datos productivos y facturan su uso; la solución local es gratuita pero necesita CLI y runtime. En el entorno de trabajo se comprobó que **no estaban instalados Docker, Podman, Supabase CLI ni Postgres**, y no se dispone de acceso de red para descargarlos desde el contenedor. La opción de stack nativa sin Docker es **experimental** y tampoco se puede dar por operativa en este entorno. No se ha creado rama, proyecto nuevo, contrato ni gasto. No reutilizar STUDIO para GUEST.

**Único bloqueo para ejecutar los siguientes E2E:** disponer de una instancia GUEST realmente aislada/autorizada y navegador permitido. Antes de pedir cualquier confirmación de gasto, comprobar con el conector el coste **para la organización elegida explícitamente por la propietaria**, ya que los importes varían según plan. No confundir el hecho de que `list_branches=[]` con un fallo de código de Botánica.

**Frontera comercial:** V13 candidata mejorada únicamente en fuente, sin despliegue; Botánica sigue **3/11 PASS**. VEIL LIGHT, Centro V4.6, ONE, Partner, STUDIO, Stripe y datos existentes continúan intactos.

## 11. 10/10/2026 — Decisión económica comprobada: Free activo, rama Pro o proyecto GUEST gratuito separado

### Evidencia ACTUAL y fuentes

Consulta de solo lectura al conector Supabase: la organización real `Weddly Smart Design` declara `plan=free`, `tier=tier_free`. La cuenta presenta exactamente dos proyectos: el compartido WeddlySmartDesign **ACTIVE_HEALTHY** y `STUDIO` **INACTIVE**. `list_branches` confirma **cero** ramas. No se cambió plan, rama, proyecto, datos ni archivos de ninguno.

Las páginas oficiales de Supabase revisadas el 10/10/2026 establecen: **Branching necesita Pro**; tarifa Pro publicada **desde 25 USD/mes** y una rama Preview Micro **desde 0,01344 USD/h de cómputo**; pueden añadirse costes de almacenamiento, datos y otros consumos. Las ramas **no están cubiertas por Spend Cap**. Estas son tarifas públicas orientativas y **NO son un presupuesto individual aprobado**, sin conversión a euros, impuestos ni cálculo exacto de la organización. Enlace de referencia: https://supabase.com/docs/guides/deployment ; https://supabase.com/pricing ; https://supabase.com/docs/guides/platform/manage-your-usage/branching.

**Alternativa que merece estudiarse ANTES de pagar:** el plan Free permite hasta **dos proyectos activos** y Supabase indica que los proyectos *pausados* no cuentan para ese límite (https://supabase.com/docs/guides/platform/billing-on-supabase). El conector solo informa de `STUDIO.status=INACTIVE`, lo que por sí solo NO acredita que el proveedor la trate como `paused` ni garantiza la plaza disponible. Si el límite realmente permite crear otro, puede autorizarse **un proyecto nuevo GUEST-CERT-ISOLATED dentro de Free**, enteramente separado y creado sin copiar datos personales. Esto **NO implica tocar/reutilizar STUDIO**. No se ha solicitado, creado ni reservado plaza y no debe suponerse que su capacidad o coste están aprobados.

### Obstáculo real de la alternativa Free (no decir que es un clon de un clic)

El proyecto productivo tiene **91 registros de migración** según `list_migrations`, incluidos cambios compartidos de ONE, Analytics y RSVP. El inventario completo de la rama GitHub `guest-independent` (árbol de 883 archivos, `truncated:false`) contiene **0 archivos SQL de migraciones** y no tiene directorio `supabase/`. Una rama Pro copiaría esquema y funciones sin datos de forma automática; un **proyecto Free nuevo empezaría vacío** y necesita preparar y validar un esquema GUEST aislado y sus buckets, funciones, roles y políticas sin trasplantar datos ni alterar los 91 cambios ajenos. Por ello el coste de proveedor puede ser cero, pero **hay trabajo técnico de reconstrucción y verificación**. No utilizar la función de ONE ni una tabla de STUDIO como atajo.

Se inspeccionó la candidata REAL de Centro V4.6 de Biblioteca por SHA-256 `0832f4fac4ae51f5a3e305a0d06284a3ff4bb1a121ece4a4e8b01e5368605c7a` (**30.038.909 bytes**) y se hallaron exactamente **dos** URL literales al proyecto ACTIVO: `FLOW=.../functions/v1/guest-invitation-flow` y `OWNER=.../functions/v1/weddly-owner-manager`. El paquete offline V2 añade `connect-src 'none'`, por lo que no está habilitado para un E2E conectado. **No basta con cambiar una sola URL ni levantar el bloqueo CSP**: antes de permitir conexiones, tanto FLOW como OWNER deben apuntar exclusivamente al servicio aislado autorizado o las acciones OWNER deben quedar inutilizadas en ese entorno. Prohibido habilitar un Centro de pruebas que siga enviando llamadas al proyecto productivo, aunque la invitación se vea correctamente.

### Plan único de salida, sin construcción paralela de GUEST

1. **Decisión de titular y verificación de cuota/coste, sin compra automática.** Priorizar plaza de **nuevo proyecto Free aislado si Supabase confirma su disponibilidad real**, con aprobación explícita para crearlo; si no es viable, mostrar presupuesto particular de Pro/branch y obtener autorización separada. Una continuación genérica «sigue» no autoriza alta de proyecto, cambio de plan ni gasto.
2. **Staging de GUEST separado y sin PII** (no STUDIO). Preparar solo dependencias mínimas del flujo de invitaciones/RSVP con esquema verificado y datos ficticios; confirmar buckets de uploads **privado**, no copiar medios test a público, RLS/autorización interna, `verify_jwt` y secretos distintos o ausentes (correos/pagos inutilizados). Debe existir un rollback explícito.
3. **Reempaquetar el mismo Centro V2 no congelado con referencias técnicas de staging sin residuos de URLs de producción**, usando el único catálogo V2, no rediseñar VEIL/Botánica. Verificación automática **0 URL de backend productivo** antes de conectar la red; navegador autorizado real.
4. **Ejecutar dos E2E de Botánica distintos + VEIL** con revisiones, medios privados firmados, URL final válida, RSVP `g`/`u` persistido y **vínculo de licencia/membresía ficticias de staging**. Después Android y esfuerzo propietaria <=5 min; solo entonces considerar 11/11 y publicar de forma separada.

**Decisión actual:** `NO-GO` en producción. **Opción Free posible pero NO confirmada**, Pro requiere dinero y consentimiento. No se han mutado recursos externos. La evidencia del plan y los endpoints, sin secretos, debe mantenerse en la Entrada 13 de la bitácora única de Biblioteca, no dispersarse en otra arquitectura.
