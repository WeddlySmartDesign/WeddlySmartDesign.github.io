# GUEST by WeddlySmartDesign — EMPEZAR AQUÍ

**Documento operativo prioritario de continuidad — 09/10/2026.**  
**Repositorio:** `WeddlySmartDesign/WeddlySmartDesign.github.io` · **rama exclusiva:** `guest-independent` · **fase:** sistema visual común V2 desarrollado y probado localmente, **no integrado aún en producción**.  
**Objetivo:** retomar GUEST en otro chat, otra sesión o cualquier diseño 03–1000 **sin búsqueda histórica ni repetición de instrucciones**.

> **LEER ESTE ARCHIVO EN PRIMER LUGAR.** No interpretar nombres como `FINAL`, `FROZEN`, `SEALED` o `PASS` sin comprobar **a qué capa pertenecen**. Un diseño visual aprobado, un paquete técnico QA, un pipeline de producción y una plantilla certificada para venta son estados distintos. Las afirmaciones de este documento son un *snapshot* a fecha indicada: contrastar cualquier estado dinámico con GitHub, el registro de evidencias y el servicio desplegado antes de escribir o publicar.



## Actualización contrastada — sistema genérico y Biblioteca (09/10/2026)

- **Regla de entrada:** consultar primero la bitácora acumulativa en Biblioteca `/GUEST by WeddlySmartDesign/Normativa/Continuidad GUEST/GUEST_AUDITORIA_DOCUMENTAL_Y_BITACORA_UNICA_2026-10-09.md` y esta fuente viva de GitHub. La auditoría de Biblioteca inventaría 123 archivos; las copias anteriores de START_HERE/STATUS allí son históricos. Registrar y verificar en la MISMA bitácora cada bloque de trabajo: cambios, commits, pruebas, bloqueos y siguiente paso.
- **Protección común para cualquier diseño (commits cbf142a67 y bd2f6c892):** se ha reforzado el generador de catálogo existente para rechazar gates vacíos, evidencia desconocida, shared blockers ausentes, versiones/estados divergentes y falsa admisión comercial. La regresión incluye un design-03 FICTICIO, sin crear D03 real. GitHub Actions de catálogo offline PASS en [37990223784](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/37990223784). Hubo fallo transitorio en run 37990171524 antes de actualizar su fixture, subsanado en bd2f6c892.
- **Preparador backend V13 ahora realmente multi-diseño (commits fb177e07 + 6a3c5b036):** se eliminó la comprobación especial de Botánica en la generación test-only. `assertGeneratedCatalog` valida ID, versión y aislamiento de pruebas para **cada** entrada del catálogo; la misma prueba simula 03 y 1000 (sin registrar nuevos diseños). GitHub Actions [37990684936](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/37990684936) **PASS offline** sobre 6a3c5b036. Registro completo en la bitácora permanente de Biblioteca; comprobar QA independiente para el HEAD de código actual antes de afirmar su conclusión. **Ningún despliegue**.
- **Sin cambios de despliegue:** Supabase guest-invitation-flow v12 confirmado otra vez por lectura; backend V13 y Centro común V2 no publicados, Botánica V14 congelada/V14.7 candidata 3/11 gates PASS, VEIL LIGHT congelado. Los tests offline no acreditan E2E ni ventas.
- **QA independiente VERIFICADO:** [37990684974](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/37990684974) **PASS** en el commit de código `6a3c5b036` (incluidos RSVP y sincronización de dos dispositivos), además de QA catálogo offline [37990684936](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/37990684936) **PASS** en el mismo commit. Los antiguos fallos B6 que constan en la bitácora son históricos. Una ejecución intermedia de un commit solo documental registró un B7.7 visual intermitente y quedó anotada para diagnóstico si reaparece; no tocar diseño congelado ni ignorar errores reproducibles. **Estas pruebas no equivalen a E2E comercial**.

## Estado comprobable automáticamente (sin reinterpretar bitácoras)

- **Única fotografía estructurada actual**: [`GUEST_PROJECT_STATUS_V1.json`](GUEST_PROJECT_STATUS_V1.json). El archivo conserva versiones, estados, rutas y checksums; **no es un permiso de despliegue** y debe contrastarse con el código/Edge Function realmente vigentes.
- **Control de continuidad unificado (QA 09/10/2026):** la misma puerta se ejecuta en GitHub Actions para todos los cambios de `guest/**`, junto con **11 pruebas de mutaciones** y el preflight V2. `guest/qa/continuity_entry_guard.cjs` es ahora únicamente un alias de compatibilidad hacia `handoff_gate.cjs`, sin una segunda lógica de estado. Evidencia y alcance: [`GUEST_HANDOFF_QA_SEAL_2026-10-09.md`](GUEST_HANDOFF_QA_SEAL_2026-10-09.md); respaldo portátil en Biblioteca `/GUEST by WeddlySmartDesign/Normativa/GUEST_CIERRE_CONTINUIDAD_UNICA_QA_2026-10-09.zip` (SHA256 `8cf4d08a07ab67dfbf0cc564a5fa51af8e99700020275eac7daaf4735139a442`). **PASS offline no significa E2E comercial.**
- **Auditoría y reconciliación común de datos (09/10/2026; preparación NO desplegada):** [GUEST_BACKEND_CONFIG_RECONCILIATION_2026-10-09.md](GUEST_BACKEND_CONFIG_RECONCILIATION_2026-10-09.md). Leídos directamente la Edge Function real v12 y `guest-stripe-checkout` v20; esquema, normalizador y validador común afinados en la rama. Las tres pruebas específicas pasan en un **arnés JS con dependencias Node simuladas**; dos cuestionarios ficticios ejecutados sobre la función `buildConfig` real de v12 + adaptación propuesta pasan la validación, **no son E2E**. El preparador V13 genera una copia desde el código real, pero sigue sin desplegar. **CI global sigue pendiente**: la regresión B6.3 de menores ya pasó en el run real `37971333514`, pero B6.6 de sincronización falló; el PASS nativo del catálogo sobre el último HEAD no está confirmado. Antes de despliegue se deben blindar `set_config`, medios firmados y la validación en todas las rutas. Los **3/11 PASS y 8/11 PENDING se mantienen**. No activar ventas, correos, Stripe, ni comenzar D03.
- **Corrección de carrera RSVP (09/10/2026, solo rama, NO publicada):** a raíz del log de GitHub Actions `b6-invitation-rsvp`, el formulario compartido `guest/guests-rsvp-form-flex.html` bloquea sus controles hasta terminar la carga asíncrona. Test estático nuevo `guest/tests/rsvp_form_async_load_guard.test.cjs` PASS en arnés aislado, conectado a CI; **Playwright B6.3 PASS verificado** en GitHub Actions `37971333514`, no E2E backend; **B6.6 sincronización pendiente** por otro motivo. Detalles y el fallo intermedio del test en [checkpoint de reconciliación](GUEST_BACKEND_CONFIG_RECONCILIATION_2026-10-09.md). No tocar otros productos.
- **Preparador backend v13 de pruebas (09/10/2026; NO desplegado):** `guest/tools/prepare_test_only_backend_v13.cjs` genera una **copia** del backend v12, con `botanica` test-only, `schemaVersion`, Historia `none`, validación de foto solo Historia, normalizador común `guest/tools/backend_config_contract_v1.cjs` y supresión de correos en pedidos test. La auditoría de incompatibilidades anteriores dio lugar a cambios compartidos en `GUEST_INVITATION_CONFIG_SCHEMA_V1.json` y `guest/qa/validate_invitation_config_v1.cjs`, con regresiones en CI; véase [checkpoint de reconciliación](GUEST_BACKEND_CONFIG_RECONCILIATION_2026-10-09.md). **Los ensayos fueron sintéticos/offline, no E2E; no consta PASS nativo de CI actualizado ni autorización para desplegar.** Siguen pendientes validación de `set_config`, media firmada, guardas completas, integración Mobile Center y los 8 gates comerciales. No declarar listo para venta.

- **Cierre adicional previo a despliegue, NO publicación (09/10/2026):** el preparador V13 integra el validador JSON completo en los estados de pedido, bloquea cambios de plantilla y URLs RSVP persistidas, rechaza medios firmados ausentes, y **no copia los medios de pedidos test al bucket público permanente**. Se detectaron mediante SQL **solo lectura** tres pedidos de VEIL LIGHT de prueba legados sin `schemaVersion` y dos discrepancias de versión; tienen compatibilidad **exclusivamente de lectura** para `delivered` test, mientras la migración de un `designing` antiguo sigue pendiente. Pruebas de contrato/mutaciones añadidas a Actions y simulación del código V12→V13 PASS; **CI integral del HEAD y E2E aún no acreditados**. B6.6 ahora tiene una prueba diagnóstica que fuerza el conflicto 409 sin tocar el motor. Fuente única de evidencia: [GUEST_BACKEND_CONFIG_RECONCILIATION_2026-10-09.md](GUEST_BACKEND_CONFIG_RECONCILIATION_2026-10-09.md). No cambiar los tres PASS comerciales.
- **Puerta previa obligatoria**: `node guest/qa/handoff_gate.cjs` y su prueba de mutaciones `node guest/tests/handoff_gate_test.cjs`. Esta comprobación detecta inmediatamente versiones contradictorias entre catálogo, visor, manifiesto y evidencias, archivos desaparecidos y falsos certificados comerciales.
- La lectura histórica permanece en `CURRENT_STATE.md` y checkpoints, sin disputar el estado actual. **Solo se actualiza este índice y el JSON de estado**, no se añade otra nota «VIGENTE» al comienzo de cada archivo. El procedimiento para D03–D1000 sigue siendo **un único runbook existente**: [`DESIGN_NEW_RUNBOOK.md`](DESIGN_NEW_RUNBOOK.md).

**Respaldo del control de continuidad (no sustituye el código del repositorio):** Biblioteca `/GUEST by WeddlySmartDesign/Normativa/Punto de entrada definitivo/GUEST_CONTROL_CONTINUIDAD_D03_D1000_2026-10-09.zip`, SHA-256 `f498635eb3a88c79bc727c61bf1f33967bf587de235bd3d6c42b6ad602e33abd`. Contiene el estado legible por máquinas y el QA offline. **El índice, los contratos y el procedimiento solo se mantienen canónicamente aquí, en GitHub.**

## 1. Reglas irrenunciables

1. Trabajar **solo** con GUEST en `guest-independent`. **NO tocar ONE, ONE Partner, STUDIO**, ni modificar VEIL LIGHT V5.3.3 o Botánica V14 congeladas. No publicar en `main`, activar ventas/Stripe, desplegar backend ni enviar comunicaciones a clientes sin autorización y controles completos.
2. Marca completa: **GUEST by WeddlySmartDesign**. El producto comercial es **la invitación digital premium**; la app de gestión GUEST viene incluida como valor posterior. Una pareja decide comprar por **diseño, experiencia y facilidad**; el motor no justifica una invitación visualmente mediocre.
3. **Un solo sistema transversal**: catálogo -> pedido/versionado -> **cuestionario compartido** -> validación/schema -> configuración canónica -> arte visual -> Centro GUEST -> revisión/aceptación -> URL final estable -> motor existente de invitados/envíos/RSVP. Prohibidos formularios por diseño, nuevos motores de RSVP, reimplementación de mesas y excepciones por pareja.
4. Los diseños nuevos aportan **solo `master.html` + `visual-plugin.json`** y deben exponer `window.GUEST_APPLY_CONFIG(config)`; el resto lo genera el sistema común. Los diseños 01/02 tienen **adaptadores legacy**, NO se rediseñan para adaptarse.
5. No modificar medios ni textos de un `FROZEN`, ni meter nombres, fechas o lugares variables dentro de vídeos/imágenes maestras. No utilizar ajuste CSS/HTML a mano por pedido; una corrección necesaria debe ser genérica, aislada, regresionada y versionada.
6. Mi intervención de propietaria: **revisar el diseño artístico terminado en Android**, no localizar bugs, programar, retocar ni probar botones básicos. Trabajo activo objetivo por pedido **≤5 minutos** (excluye espera del cliente). La QA previa corre por cuenta técnica.
7. **Seguridad de afirmaciones:** `PASS local` ≠ `PASS E2E real`; `visualmente aprobado` ≠ `certificado comercial`; `generado` ≠ `desplegado`; un cambio bloqueado **NO** se sortea usando una vía alternativa. Si faltan privilegios o ejecución real, dejar el gate en **PENDING** y registrar causa.

## 2. Fuentes de autoridad y orden de lectura

- **Política, estrategia, límites:** [`GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md`](GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md). Máster canónico vigente para decisiones de producto.
- **Modelo de datos obligatorio:** [`GUEST_INVITATION_CONFIG_SCHEMA_V1.json`](GUEST_INVITATION_CONFIG_SCHEMA_V1.json), junto con **salida real de `buildConfig`** de la Edge Function desplegada. **No suponer** que el backend emite ya todo lo definido por el esquema.
- **Arquitectura y contrato:** [`GUEST_CATALOG_PIPELINE_CONTRACT_V1.md`](GUEST_CATALOG_PIPELINE_CONTRACT_V1.md), [`GUEST_CATALOG_TEMPLATE_PLUGIN_CONTRACT_V1.md`](GUEST_CATALOG_TEMPLATE_PLUGIN_CONTRACT_V1.md).
- **Sistema visual reutilizable (V2):** [`GUEST_PLATFORM_VISUAL_V2_READ_FIRST_2026-10-09.md`](GUEST_PLATFORM_VISUAL_V2_READ_FIRST_2026-10-09.md) y [`GUEST_CATALOGO_VISUAL_SISTEMA_COMUN_V2_2026-10-09.md`](GUEST_CATALOGO_VISUAL_SISTEMA_COMUN_V2_2026-10-09.md).
- **Estado comercial verificable:** [`GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json`](GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json) + [`GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json`](GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json); verificación en `guest/qa/catalog_admission_gate.cjs`.
- **Botánica D02:** [`GUEST_D02_BOTANICA_READ_FIRST.md`](GUEST_D02_BOTANICA_READ_FIRST.md), [`GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V3_2026-10-09.json`](GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V3_2026-10-09.json), [`GUEST_D02_BOTANICA_CIERRE_TECNICO_GATES_PENDIENTES_2026-10-09.md`](GUEST_D02_BOTANICA_CIERRE_TECNICO_GATES_PENDIENTES_2026-10-09.md).
- **Calidad de diseño y errores anteriores:** [`GUEST_DESIGN_PRODUCTION_QA_MASTER_D03_D06_2026-10-09.md`](GUEST_DESIGN_PRODUCTION_QA_MASTER_D03_D06_2026-10-09.md). Manual exhaustivo de dirección, microbloques, tipografía, dinámica, medios, QA y congelación.
- **Nuevo diseño D03–D1000:** [`DESIGN_NEW_RUNBOOK.md`](DESIGN_NEW_RUNBOOK.md) (secuencia exacta de trabajo y comandos).
- **Historial / no fuente vigente:** [`CURRENT_STATE.md`](CURRENT_STATE.md) (bitácora extensa). Los capítulos con «última versión V14.5/V14.6» describen decisiones antiguas y quedan supersedidos por este índice + manifiestos actuales. **No borrar el historial ni usarlo como estado actual.**

**Precedencia si hay conflicto:** petición explícita posterior de la propietaria documentada con alcance y fecha > restricciones de seguridad y estado real ejecutado > esquema/contratos/código efectivo de la rama > máster canónico de producto > registros de estado y evidencias con versiones > procedimiento actual > bitácoras históricas/conversaciones. En conflictos entre esquema teórico y backend real, **detener y reconciliar**, no elegir silenciosamente uno. No alterar congelados ni producir cambios silenciosos en producto.

## 3. Estado vigente — no confundir capas

| Área | Versión/estado | Decisión |
|---|---|---|
| Producto invitación D01 **VEIL LIGHT** | **V5.3.3**, `commercially-frozen`; certificado en catálogo | **INMUTABLE**. Su estética no se copia: se reutiliza su pipeline de negocio. |
| D02 **Botánica** — diseño que aprobó la propietaria | **V14**, visual aprobado/`FROZEN`, SHA-256 `27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39` | **INMUTABLE**. Archivo 11.6 MB en Biblioteca. |
| D02 Botánica — candidato para certificación técnica | **V14.7**, SHA-256 `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`; `certification-pending` | QA local de foto-only y medios; **NO** certificación E2E, ventas ni Android final. V14.5 y V14.6 solo historial. |
| Motor/app GUEST invitaciones/RSVP/mesas | Preexistente, separado de diseño | **NO rehacer**: conexión únicamente mediante el flujo compartido. |
| Catálogo e infraestructura genérica **V2** | Código, CLI, visor y CI en rama, 6 suites estructurales PASS en reproducción local | **NO DESPLEGADOS** aún en el Mobile Center realmente distribuido ni en backend. |
| Mobile Center compartido | **V4.6 congelado** (SHA-256 `a95984b658e560a9c3fca4bd92315b41c1b92cc4f6d47fffeed890da6f1f2133`) | El original **solo** reconoce VEIL LIGHT y lleva formulario V3 incrustado. Crear una versión nueva para integración; no sustituir a ciegas. |
| Backend de pedidos | Supabase proyecto `dnjsxequwgtyyauuofxj`, Edge Function `guest-invitation-flow` **v12** (snapshot SHA `69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac`) | Desplegado solo con `veil-light`. Intento de habilitar `botanica` en modo test bloqueado por el entorno. **Comprobar SHA de nuevo**. |
| D03, D04, D05, D06 (o posteriores) | **NO INICIADOS** | No inventar nombres, estilos ni aprobaciones. Para empezar, cerrar gate compartido de Botánica y seguir el runbook. |

**Botánica a fecha del corte:** 3/11 gates respaldados y **8/11 PENDING**, ver `GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json`. Los 3 no certifican el producto entero. Dos bodas diferentes han pasado **simulaciones** locales, no son pedidos reales con entrega/RSVP persistidos.

### Respaldo en Biblioteca (persistente)

- `/GUEST by WeddlySmartDesign/BOTANICA/Checkpoints/GUEST_D02_BOTANICA_ATELIER_V14_FROZEN_2026-10-09.html` — versión visual aprobada.
- `/GUEST by WeddlySmartDesign/BOTANICA/Candidatas/GUEST_D02_BOTANICA_ATELIER_V14_7_PHOTO_ONLY_VISUAL_QA_CANDIDATE_2026-10-09.html` — candidata técnica actual.
- `/GUEST by WeddlySmartDesign/BOTANICA/Checkpoints/GUEST_BOTANICA_D02_RECUPERACION_V3_2026-10-09.zip` — cuatro HTML, fotos/vídeos, hashes, pruebas portables; SHA-256 `62fc41815ac288f1ba6f86a0607ffeacab42e4ad68591f7e747eaec216bdd3c5`.
- `/GUEST by WeddlySmartDesign/BOTANICA/Checkpoints/GUEST_BOTANICA_D02_CIERRE_TECNICO_LOCAL_PREPRODUCCION_2026-10-09.zip` — dos pedidos **simulados**, formulario y Mobile Center candidatos, resultados y snapshots; revisar SHA actual en el último checkpoint.
- `/GUEST by WeddlySmartDesign/BOTANICA/Preproduccion/GUEST_BOTANICA_MOBILE_CENTER_RENDERER_TEST_ONLY_2026-10-09.zip` — visor Botánica en copia no publicada, **NO** equivale a integración real.
- `/GUEST by WeddlySmartDesign/Normativa/Sistema visual V2/GUEST_PLATAFORMA_VISUAL_V2_SISTEMA_UNICO_2026-10-09.zip` — código y tests de infraestructura común V2.

**Los enlaces `sandbox:` de un chat no son la fuente de continuidad.** GitHub y rutas persistentes de Biblioteca lo son. Para un archivo de Biblioteca, usar herramientas de archivos y su ID devuelto, no adivinar `/mnt/data` por el nombre.

## 4. Arquitectura que NO debe volver a inventarse

**Dato único:** `guest-invitation-config-v1` contiene `schemaVersion`, `template.id/version`, pareja, fecha, portada, contador, Historia, ubicaciones, agenda, práctico, RSVP, galería y cierre. El esquema actual admite hasta **dos lugares** y galería de **cuatro** fotos; `story.textMode` admite `preset`, `custom`, `none`. Las configuraciones deben sobrevivir al cambio de pareja, número de sedes, foto opcional, nombres largos y módulos desactivados. El RSVP recibe una ruta ya decorada: token `rt`, `g` invitado **o** `u` unidad de invitación, y `lang`; usa el motor existente, nunca un segundo almacén.

**Visual nuevo:** El mapa genérico de renderizadores es [`GUEST_CATALOG_OWNER_RENDERERS_V2.json`](GUEST_CATALOG_OWNER_RENDERERS_V2.json). `guest/templates/<id>/master.html` con `window.GUEST_APPLY_CONFIG(config)` + `visual-plugin.json`; la herramienta de alta produce copia versionada, adaptador, registros de catálogo/owner y expediente PENDING. El visor V2 carga medios pesados separados en iframe del mismo origen y exige correspondencia de `template.id/version`. No duplicar ~11 MB de arte dentro del Mobile Center.

**Pasarela comercial:** El compilador común es [`guest/tools/generate_backend_catalog_registry.cjs`](tools/generate_backend_catalog_registry.cjs). la herramienta de backend genera registros para producción o pruebas. Generar código **NO significa** que esté conectado a Supabase; desplegar debe respetar un guard `testOnly` en **todas** las rutas de creación, incluido checkout, y mantener intactos los pedidos existentes. La venta y Stripe son decisiones distintas de la certificación técnica.

## 5. Defectos comunes reales — obligan a control ANTES de D03

1. **Contrato schema/backend:** Edge Function v12 no emite `schemaVersion` en `buildConfig`, aunque el JSON Schema lo exige. Comprobar fixture real vs esquema; corregir **sin romper VEIL** antes de introducir otro diseño.
2. **Historia sin texto:** backend v12 convierte `textMode='none'` a `preset`. El cuestionario V3 incrustado en Mobile Center V4.6 tampoco ofrece la opción «Solo fotografía». Existen versiones de QA del formulario y del renderizador V14.7 que la admiten, pero no desplegadas; validar foto obligatoria, guardado, recarga, revisión, final y VEIL.
3. **Regalo / input blur:** el formulario V3 reconstruía campos al teclear y podía perder valores al cambiar de modalidad. Arreglado **solo** en candidato de preproducción; exigir persistencia banco ↔ texto ↔ banco, sin errores de foco/DOM.
4. **Datos del backend reales:** preset Story puede venir con `body:''` + `presetId`, y regalos/bizum llegan en `practical.gift.details` ya compuesto. La foto y los medios subidos se hidratan desde `upload:<slot>` hacia URLs firmadas. No asumir estructura de demo ni URL permanente para ficheros temporales.
5. **Owner renderer:** V4.6 tiene registro fijo para `veil-light`; no reconoce `botanica`. Existe visor genérico V2 + candidata aislada, no integrado en el Centro real. Reconocer `template_id` por registro, no por nombre/filename.
6. **Paridad y escalabilidad:** probar previo, revisión, final y RSVP con **los mismos datos y renderer**; nunca manualmente por pareja. Dos pedidos de UI simulados no demuestran almacenamiento real ni enlaces enviados.
7. **Regresiones visuales:** nunca cambiar otras secciones al ajustar una: comparar portada, Historia, dos lugares, Agenda, Práctico, galería, cierre, medios y botones. El historial D02 evidenció fuentes diminutas, contraste pobre, texto cortado y escenas estropeadas por arreglos globales.
8. **Estados:** nadie puede promover a `commercially-frozen` solo por la existencia de adaptador, un mock aprobado o una captura. Exigir **todas** las evidencias y gate estricto.

Estos defectos se documentan y prueban en `GUEST_CATALOG_RELEASE_GATES_D02_D06_2026-10-09.md` y en el manual D03–D06. No volver a diagnosticarlos desde cero.

## 6. Verificación obligatoria al retomar (lectura / cero despliegues)

```bash
# Desde la raíz del repositorio y la rama guest-independent:
node guest/qa/catalog_preflight_v2.cjs
node guest/qa/catalog_admission_gate.cjs
node guest/tests/botanica_catalog_bridge_offline.test.cjs
node guest/tests/botanica_catalog_manifest_guard.test.cjs
node guest/qa/catalog_admission_gate.cjs --admit botanica
```

**Resultado esperado hoy:** preflight, consistencia y tests aislados = PASS; **`--admit botanica` = FAIL esperado** mientras haya gates pendientes. El primer fallo no autoriza a saltar el control. Complementar con **consulta real** al backend desplegado, último estado CI y hashes de archivos relevantes. Si algo difiere respecto al snapshot, documentar *drift* y detener modificación hasta entenderlo.

**La prueba automatizada en GitHub**: `.github/workflows/guest-botanica-contract-qa.yml`, con preflight genérico V2 (no confundir su `PASS` con E2E).

## 7. Plan exacto de cierre compartido (orden obligatorio, sin rediseñar D02)

1. **Antes de cualquier cambio**: confirmar rama/commit, backup del backend activo y centro distribuido; leer el plan de despliegue preparado `GUEST_D02_BOTANICA_TEST_ONLY_BACKEND_CHANGESET_NOT_DEPLOYED_2026-10-09.md` y el registro de fallos. Verificar que está permitido operar; un bloqueo de herramientas no se elude.
2. **Contrato de datos común**: formulario corregido (foto-only + regalos) y salida backend canónica (`schemaVersion`, `none`), validar contra el esquema y fixtures del backend real, además de regresión VEIL. Sin formularios por plantilla.
3. **Backend exclusivamente para pruebas**: template `botanica` `testOnly:true`, guard de producción en todas las rutas de pedido y compra, versionado y rollback claro; no activar Stripe, correos reales ni publicación.
4. **Nuevo Mobile Center compartido**: integrar el visor V2 de registro común en una versión nueva, recursos visuales por URL del mismo origen, VEIL sigue operativo, navegación CENTRO GUEST, Android/performance. No sobrescribir V4.6.
5. **E2E real test-only**: dos pedidos distintos sin editar el master; cuestionario, imágenes, almacenamiento, preview/review/approval/final, URL estable, RSVP `rt/g/u/lang` guardado sin duplicados en la app existente y sincronización de cambios. Capturar evidencias, nunca datos personales en repositorio.
6. **Propietaria en Android**: validar experiencia final ya depurada y medir trabajo activo de un pedido normal ≤5 minutos. Incorporar evidencia versionada.
7. **Admisión**: actualizar `GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json` **solo con pruebas reales**, y ejecutar `node guest/qa/catalog_admission_gate.cjs --admit botanica`. Después, y solo después, fijar la versión comercial y registrar el sello. Venta/publicación sigue necesitando aprobación explícita independiente.

**Estado honesto:** los pasos 2–7 **NO** constan como completados sobre producción a la fecha; hay preparaciones locales y gates parcialmente aprobados. No prometer certificación comercial por adelantado.

## 8. Manual breve para iniciar D03, D04… D1000

**Condición previa:** cerrar una sola vez el despliegue/integración común con Botánica y VEIL, y registrar pruebas reales. Después, **el desarrollo artístico** de D03+ sí se limita a un nuevo diseño visual + manifiesto; **su certificación visual y con datos continúa siendo obligatoria**.

Secuencia: investigación premium real de mercado -> dirección artística distinta y justificable -> componentes e invariantes -> imágenes/animaciones maestras sin texto variable -> escenas + adaptabilidad desde cuestionario -> pruebas completas internas (320/360/390/430, 1/2 sedes, módulos on/off, datos largos, versiones, botones) -> revisión artística Android -> `FROZEN` con SHA y copia -> alta por CLI -> dos pedidos de prueba **reales**, review/final/RSVP y tiempo operativo -> `--admit <id>` PASS -> comercialización solo tras autorización.

**Único comando de alta:** `node guest/tools/register_visual_template.cjs --manifest guest/templates/<id>/visual-plugin.json` (vista previa), seguido de `--apply` solo en rama aislada y QA; se generan registros automáticamente en `certification-pending`. No añadir excepciones en cuestionario, backend o Mobile Center por diseño. Detalles exactos: `DESIGN_NEW_RUNBOOK.md`.

### Normas artísticas persistentes

- Invitación memorable, editorial-boda premium y refinada; diferenciación auténtica, no apariencia de plantilla básica o Canva/imagen IA artificial. No elegir un diseño por cantidad de adornos.
- No reutilizar la gramática visual de VEIL LIGHT o Botánica: **sistema común ≠ estética común**. Estilo propio, movimiento intencionado y equilibrado en apertura/cierre, escenas limpias en el interior.
- Evitar marcos/arcos/pegotes sobre fotografías; integrar fotos de forma natural. Tipografías y horarios legibles **en Android**, no solo desktop; contraste y legibilidad por encima de decoración.
- Datos del cuestionario determinan el contenido: ninguna sección opcional vacía; máximo dos lugares, agenda de longitud variable y una sola frase libre de introducción; menús/botones/títulos que no corten texto; respeto de las decisiones selladas.
- No desperdiciar herramientas de pago ni pedir a la propietaria que diseñe. Investigación profunda -> extraer lo mejor y sus vacíos -> propuesta claramente superior o descarte. No publicar nada que no resista esa evaluación.

## 9. Protocolo de documentación al terminar CUALQUIER sesión

El siguiente agente debe poder entrar **sin chat**. Antes de terminar:

1. Actualizar este índice **solo si ha cambiado un estado real**, junto con registro comercial, evidencias, documento del diseño activo y máster canónico cuando haya una regla global nueva. No declarar dos estados «vigentes» a la vez.
2. Registrar: commit y rama, versión + SHA de binarios, rutas reales GitHub/Biblioteca, scope exacto del cambio, qué ha pasado localmente y en entorno desplegado, qué falta y **primer siguiente paso técnico**.
3. Congelados: no sobreescribir; generar `Vxx` nueva y mantener backup anterior.
4. QA: salida reproducible + test nuevo para cada regresión, sin pruebas decorativas. Incorporar controles reutilizables a CI; no sustituir E2E ni Android por tests estáticos.
5. Cualquier bloqueo externo: identificar función, operación, mensaje y efecto; **no reiterar intentos de evasión**. No encargar trabajo manual a la propietaria sin necesidad.
6. Crear respaldo persistente en Biblioteca y enlazar ruta desde GitHub. **Jamás** asumir que el enlace temporal `/mnt/data/` o el propio chat estará disponible en la próxima sesión.

## 10. Qué hacer en un chat nuevo — texto de recuperación (no requiere repetir decisiones)

> Continuamos **GUEST by WeddlySmartDesign**. Antes de proponer o tocar código, abre `guest/START_HERE.md` de `WeddlySmartDesign/WeddlySmartDesign.github.io` en rama `guest-independent`; comprueba el estado real contra registros, CI y backend y sigue el runbook del diseño/compromiso pendiente. No reinicies investigación, no preguntes de nuevo por decisiones selladas ni toques ONE, ONE Partner, STUDIO, VEIL LIGHT o Botánica V14 congeladas. Dirige el trabajo, realiza QA antes de entregar, distingue simulaciones de E2E reales y documenta todo al finalizar.

**Siguiente paso técnico prioritario a fecha de este checkpoint:** confirmar CI nativo de V13 y diagnosticar B6.6, certificar compatibilidad histórica sin escritura y ejecutar pruebas reales exclusivamente en entorno de despliegue **autorizado**; después cerrar la integración **autorizada** de la plataforma común V2 y certificar Botánica en su camino real de pedidos/RSVP/Android; **NO comenzar diseño 03 repitiendo la arquitectura**.