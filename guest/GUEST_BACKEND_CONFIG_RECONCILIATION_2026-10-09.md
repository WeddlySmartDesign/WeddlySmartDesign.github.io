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
