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
