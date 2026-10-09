# ACTUALIZACIÓN VIGENTE — BOTÁNICA V14.7 / 9 OCTUBRE 2026

**Respaldo autónomo vigente:** `/GUEST by WeddlySmartDesign/BOTANICA/Checkpoints/GUEST_BOTANICA_D02_RECUPERACION_V3_2026-10-09.zip` (35 281 287 bytes, SHA-256 `62fc41815ac288f1ba6f86a0607ffeacab42e4ad68591f7e747eaec216bdd3c5`). Incluye V14 congelada, históricas V14.5/V14.6, V14.7 candidata, matriz, scripts visuales portables, capturas y hashes. Leer `LEER_PRIMERO.txt` al descomprimir.

**PUNTO DE ENTRADA OBLIGATORIO Y ÚNICO:** este documento y `guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V3_2026-10-09.json`. Todo lo que figura más abajo sobre V14.6 es **historial**, no la candidata actual.

- **V14**: APROBADA visualmente por la propietaria y congelada. SHA-256 `27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39`. **NO MODIFICAR.**
- **V14.7**: candidata técnica vigente, SHA-256 `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`, copia en `/GUEST by WeddlySmartDesign/BOTANICA/Candidatas/GUEST_D02_BOTANICA_ATELIER_V14_7_PHOTO_ONLY_VISUAL_QA_CANDIDATE_2026-10-09.html`. **NO certificada comercialmente ni validada aún en Android de la propietaria.** V14.5 y V14.6 son solo historial técnico.
- **Pruebas localmente verificadas:** 20/20 estados móviles Historia (320/360/390/430); 6/6 escenas estándar idénticas en comparativa píxel a píxel V14.6↔V14.7 con animaciones y vídeo deshabilitados; HTML completo V14.7 con foto visible y bloque Story vacío oculto; 5/5 controles de integridad de cuatro HTML y 17 recursos inalterados; siete pruebas aisladas de catálogo/RSVP (simulaciones). Evidencias: `guest/GUEST_D02_BOTANICA_CHECKPOINT_V14_7_2026-10-09.md`.
- **Nuevo defecto de contrato descubierto:** Edge Function v12 convierte `story.textMode='none'` a `preset`, aunque el esquema común admite `none`. El renderer V14.7 ya maneja foto-only, pero el estado **no está verificado desde un pedido del cuestionario real**; debe armonizarse en un despliegue test-only autorizado.
- **BLOQUEO SIN CAMBIOS:** Supabase `guest-invitation-flow` v12 solo admite VEIL LIGHT; el despliegue de pruebas Botánica fue bloqueado por el entorno. **No intentar eludirlo.** Dos pedidos E2E, revisión/final, entrega/RSVP, y prueba Android con intervención ≤5 min siguen PENDIENTES. Registro de Botánica: `certification-pending`, sin compras, sin publicación, sin Stripe.
- **Próximo paso correcto:** seguir el checkpoint V14.7; si un entorno permite despliegue autorizado, habilitar la plantilla exclusivamente para pruebas con barrera de producción y verificar también normalización `none`. Nunca elevar a `commercially-frozen` sin todos los gates.

---

# ACTUALIZACIÓN D02 V14.6 — ESTADO VIGENTE (09/10/2026)

**Esta actualización prevalece sobre las referencias históricas a V14.5 en secciones inferiores.** El archivo V14 original sigue aprobado y congelado. La V14.5 continúa conservada como evidencia histórica. **La candidata técnica vigente es V14.6**, que corrige únicamente el caso `Historia habilitada + foto + texto desactivado`; el fallo existía realmente en V14.5. La nueva condición supera **11/11 pruebas de mapeo** y conserva los 17 medios originales; *no* ha pasado prueba visual Android ni los dos pedidos E2E reales, por lo que continúa **NO CERTIFICADA y NO PUBLICABLE**.

- **Candidata actual:** `/GUEST by WeddlySmartDesign/BOTANICA/Candidatas/GUEST_D02_BOTANICA_ATELIER_V14_6_PHOTO_ONLY_QA_CANDIDATE_2026-10-09.html`
- **SHA-256:** `35d0caf0a2ef716a51b7d5cdfd451ebc5ad5ae60bb9ad56aee4ed9c692820c85`
- **Manifiesto vigente:** `guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V2_2026-10-09.json` (el anterior V1 queda como histórico).
- **Nuevo test reproducible:** `node guest/tests/botanica_schema_mapping_offline.test.cjs /ruta/V14.6.html`. El test detecta el fallo en V14.5 y pasa en V14.6.
- **Registro y adaptador GitHub:** apuntan a versión `14.6`, pero `certification-pending`. Backend Supabase v12 sigue solo con VEIL LIGHT, sin despliegue ni ventas de Botánica.
- **Paquete de recuperación V2:** `/GUEST by WeddlySmartDesign/BOTANICA/Checkpoints/GUEST_BOTANICA_D02_RECUPERACION_COMPLETA_V2_2026-10-09.zip` (3 HTML completos, dos tests, manifiesto, evidencia y huellas). El primer ZIP sigue guardado, pero ya no es el respaldo más reciente.
- **Huella SHA-256 del ZIP V2 final:** `9a752624861cf7a8b91ad5fbdeab68033970f77c12c31bea274bbc53253b3374`. (La copia del README dentro del ZIP es una instantánea anterior a añadir esta línea.)
- **Siguiente trabajo permitido:** verificar visualmente la variante foto sin texto en un navegador autorizado; integrar Botánica *solo como test* cuando se permita desplegar; ejecutar dos pedidos E2E y pruebas RSVP. **No modificar V14. No evadir bloqueos administrativos.**

---

# BOTÁNICA D02 — LEER PRIMERO / FUENTE ÚNICA DE CONTINUIDAD

**GUEST by WeddlySmartDesign · 09/10/2026 · rama `guest-independent`**

> ESTE DOCUMENTO ES EL PUNTO DE ENTRADA PARA CUALQUIER CHAT, AGENTE O SESIÓN NUEVA. Si solo se dispone de GitHub y la Biblioteca personal, no hace falta leer el chat agotado. No avanzar desde memoria ni inventar aprobaciones. Se complementa con `guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md`, que prevalece en caso de conflicto, y los contratos/esquema del catálogo.

## 1. Qué es y qué NO es lo terminado

Botánica es el segundo diseño del catálogo de invitaciones digitales premium de GUEST. El diseño **V14** fue aprobado visualmente por la propietaria y está **FROZEN**. Su copia no se edita nunca. Para convertir la plantilla en comercialmente escalable se realizó una **candidata técnica V14.5**, visualmente idéntica a la muestra aprobada bajo su configuración habitual, con correcciones genéricas para los datos de otras parejas. **V14.5 NO está comercialmente certificada** y no debe publicarse ni venderse. `guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json` la marca `certification-pending`. VEIL LIGHT 5.3.3 es la única entrada `commercially-frozen`.

Se ha cerrado la fase local/aislada; quedan pruebas de pedidos reales, puente de entrega y RSVP en backend autorizado y revisión operativa en Android. No afirmar que estos pasos se han realizado.

## 2. Artefactos recuperables sin este chat

**ÚNICOS binarios maestros de referencia (Biblioteca personal, no repositorio):**

| Papel | Biblioteca personal (ruta literal) | SHA-256 |
|---|---|---|
| V14 — referencia visual inmutable | `/GUEST by WeddlySmartDesign/BOTANICA/Checkpoints/GUEST_D02_BOTANICA_ATELIER_V14_FROZEN_2026-10-09.html` | `27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39` |
| V14.5 — candidata técnica en prueba | `/GUEST by WeddlySmartDesign/BOTANICA/Candidatas/GUEST_D02_BOTANICA_ATELIER_V14_5_TECHNICAL_CANDIDATE_2026-10-09.html` | `ba8b6515e5bb2ba81c3ea3dbd88199b4a3abc66919caefa1e3d37ced8ce61e84` |

Archivo estructurado de estos datos: `guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_2026-10-09.json` (también en Biblioteca). Los archivos HTML de ~11,6 MB contienen 3 MP4 + 14 WebP incrustados. **No están versionados como binarios en GitHub**: para reutilizarlos, recuperar su archivo exacto de la Biblioteca y comprobar SHA-256. Un nombre de archivo no es prueba de identidad. No reconstruirlos desde capturas.

### Otros documentos canónicos

- `guest/GUEST_D02_BOTANICA_V14_5_CHECKPOINT_CERTIFICACION_2026-10-09.md`: correcciones técnicas, 116 pruebas, 8 fixtures y límites.
- `guest/GUEST_D02_BOTANICA_CERTIFICATION_CHECKPOINT_V2_2026-10-09.md`: QA de integración offline y estado Supabase.
- `guest/GUEST_D02_BOTANICA_TEST_ONLY_BACKEND_CHANGESET_NOT_DEPLOYED_2026-10-09.md`: propuesta de habilitar **solo pedidos test**, expresamente **NO DESPLEGADA**.
- `guest/GUEST_DESIGN_PRODUCTION_QA_MASTER_D03_D06_2026-10-09.md`: manual obligatorio de QA para los próximos cuatro diseños.
- `guest/GUEST_CATALOG_PIPELINE_CONTRACT_V1.md`, `guest/GUEST_CATALOG_TEMPLATE_PLUGIN_CONTRACT_V1.md`, `guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json`: normas de entrada, versión fija por pedido y contrato común.

## 3. Qué se ha probado y qué NO

| Gate | Estado documentado |
|---|---|
| Diseño V14 revisado en Android | **APROBADO Y CONGELADO** (solo versión normal de muestra) |
| Variantes sintéticas V14.5 | **116/116 PASS local** en 320, 360, 390, 430px (checkpoint anterior) |
| Fixtures con forma de salida real de backend | **8/8 PASS local** (no son órdenes reales) |
| Paridad visual configuración normal | **5 escenas coinciden** con V14 en QA capturas aisladas |
| Medios | **3 MP4 + 14 WebP idénticos** bit a bit |
| Adaptador, contexto y prohibición de empaquetado comercial | **7 pruebas aisladas Node PASS**, sin backend |
| Pedidos de prueba a través del cuestionario real | **PENDIENTE** |
| Revisión/final, URL estable, RSVP real y escritura de respuesta | **PENDIENTE** |
| Android de variaciones nuevas + tiempo propietaria ≤5 min | **PENDIENTE** |
| Publicación/ventas | **NO AUTORIZADAS** |

**Repetir los tests del repositorio** desde la raíz de `guest-independent`:

```bash
node guest/tests/botanica_catalog_bridge_offline.test.cjs
# Tras recuperar los dos HTML de la Biblioteca en disco:
node guest/tests/botanica_artifact_integrity_offline.test.cjs \
  '/ruta/V14-FROZEN.html' '/ruta/V14.5-CANDIDATE.html'
```

La verificación de contratos se activa además en GitHub Actions mediante `.github/workflows/guest-botanica-contract-qa.yml`, sin secretos, sin llamadas externas ni despliegues. Si se modifica contrato, adaptador o registro de catálogo, la prueba debe volver a pasar. **Un test offline PASS no equivale a ensayo real ni a certificación comercial.**

## 4. Problemas reales encontrados y reparados SOLO en V14.5

Al verificar la salida efectiva de Supabase `guest-invitation-flow` v12 se observó que no lleva siempre `schemaVersion`; ciertos campos del esquema conceptual no se materializan literalmente. La V14 sin parches trataba esa salida como datos heredados. La candidata V14.5 reconoce el objeto real sin `schemaVersion`, textos predefinidos de historia con `body=''`, detalles de banco/Bizum como texto combinado, módulos opcionales, fotos, web de lugar, vestimenta, textos largos y campos de foco/recorte. El diseño aprobado permanece inalterado. Estos parches afectan también a los cuatro diseños posteriores como lecciones de compatibilidad (ver §21 del maestro canónico).

## 5. Bloqueo actual — verdad operativa

**Supabase:** proyecto `dnjsxequwgtyyauuofxj` / Edge Function `guest-invitation-flow` v12 / huella `69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac` al corte 2026-10-09. El backend desplegado **solo reconoce `veil-light`**. El despliegue propuesto para `botanica` en modo test fue bloqueado por controles del entorno; **NO ejecutado**. No reintentar eludiendo dichos controles. Si al retomar la función ya ha cambiado, volver a verificar código y huella antes de cualquier plan.

El repositorio contiene solo el **adaptador** `guest/guest-catalog-template-botanica-adapter-v1.js` y el **registro** de versión `14.5` con estado `certification-pending`. El `build_catalog_delivery.js` bloquea expresamente cualquier plantilla no comercialmente congelada. No cambiar ese guard para hacer pruebas.

## 6. Secuencia exacta de reanudación y aceptación (SIN rehacer investigación/diseño)

1. Leer este documento, el maestro y los contratos; recuperar V14 y V14.5 de Biblioteca y comprobar sus SHA-256. No modificar V14 ni repetir experimentos visuales.
2. Ejecutar tests Node y comprobar estado `certification-pending`, adaptador y huella del backend. Si no coincide con este checkpoint, **detenerse y diagnosticar**.
3. En un entorno **autorizado** y con respaldo previo, aplicar solamente cambio test-only documentado: `botanica` activo solo en creación de prueba, con guard `template_test_only` para todos los caminos de producción/checkout. Verificar que VEIL LIGHT se mantiene y producción Botánica se rechaza sin cobro. Ante bloqueo de despliegue, detenerse y registrar causa; no afirmar aprobado ni pedir trabajos manuales a propietaria.
4. Crear **dos pedidos test genuinamente diferentes** a través del **cuestionario común**. Pedido A: dos lugares separados, transporte con varias salidas, alojamiento con URL/código, regalo banco/Bizum, playlist, agenda de 5 momentos, galería completa e historia predefinida. Pedido B: un lugar, nombres/lugar/textos largos dentro de límites, galería/Historia/Agenda/Práctico opcionales ausentes o mínimos, cierres largos y combinaciones de foto. No editar CSS/HTML por pedido.
5. Comprobar `create_test → save/submit → diseño → review → aprobación → entrega` con datos reales de esos pedidos y una versión fijada de plantilla; estados y URLs coherentes. Comprobar que los medios firmados cargan y las variantes encajan visualmente.
6. Verificar `delivery_url`, consumidor `public_load`, parámetros `rt`, `g` o `u`, `lang` y CTA RSVP hacia **el motor GUEST ya existente**, incluida escritura de respuestas **sin duplicar gestión/RSVP**. Probar explícitamente un invitado y una unidad de invitación, sin contactos reales ni envíos a clientes.
7. Ejecutar revisión Android únicamente después de las pruebas automáticas completas, validando variantes críticas nuevas (no solo Lucía/Mateo) y midiendo tiempo activo de propietaria, meta <=5 min/pedido normal.
8. Registrar resultados, artefactos y evidencia por gate. Si **todos** pasan, revisar posible paso a `commercially-frozen` y empaquetado; la **publicación o venta siempre necesita aprobación expresa separada**. Si un gate falla, conservar registro como pendiente, corregir solo copia aislada y reejecutar matriz completa.

## 7. Criterios absolutos y rollback

- No tocar ONE / ONE Partner / STUDIO; ni VEIL LIGHT. No fusionar en `main`, publicar, habilitar Stripe ni vender Botánica por este trabajo.
- No crear flujos nuevos de cuestionario, invitado, RSVP, mesas, gestión, envío o cobro. Solo añadir plugin visual al contrato existente.
- No aceptar una variante que requiera retoques manuales para un pedido individual. No inventar datos que no recoge el cuestionario.
- No afirmar que 116/116 equivale a certificado: son casos locales. Los pendientes reales siguen pendientes.
- Copia de respaldo de función antes de un despliegue autorizado y retorno a versión/hashes originales si falla, sin borrar/modificar pedidos ajenos a prueba.
- Si hay regresión visual en una sola escena: detener, volver a V14 aprobada como referencia y corregir **otra candidata**; no tocar V14 ni intentar compensaciones globales por un detalle local.

## 8. Siguiente acción de una futura sesión

**No preguntar “¿en qué nos quedamos?” ni pedir repetir instrucciones.** Comprobar fuentes y entorno. Si el despliegue test-only sigue bloqueado, continuar únicamente pruebas locales y documentación verificable, informar claramente del bloqueo y del gate pendiente. Si se autoriza el backend, completar los dos pedidos reales descritos en §6 antes de pedir a la propietaria que abra nada en Android.

**Estado que debe reflejar cualquier UI o reporte:** `Botánica V14 = diseño aprobado congelado; Botánica V14.5 = candidata técnica localmente probada; certificación comercial = PENDIENTE; backend Botánica test-only = NO DESPLEGADO; ventas = NO AUTORIZADAS.`

## 9. Paquete autónomo de recuperación (respaldo redundante)

Biblioteca personal: `/GUEST by WeddlySmartDesign/BOTANICA/Checkpoints/GUEST_BOTANICA_D02_RECUPERACION_INDEPENDIENTE_2026-10-09.zip`.

SHA-256 del ZIP: `987c0c4256995023f877af7a0a9250362937c6c4635f5297c3a51f33deb5b2ef`.

Contiene ambos HTML completos (V14 FROZEN y V14.5 candidata), README, manifiesto JSON, checkpoints, pruebas offline y `SHA256SUMS.txt`. Se probó integridad del ZIP y de las dos plantillas extraídas. Es un segundo medio de recuperación, no una versión nueva ni una aprobación comercial. El README dentro del ZIP refleja el estado al momento de empaquetar; esta sección del README persistente en GitHub informa de la existencia del ZIP.

## GATE DE FORMULARIO REAL (09/10/2026)

**Nuevo checkpoint obligatorio**: `guest/GUEST_D02_BOTANICA_GATE_FORM_REAL_MOBILE_CENTER_V4_6_2026-10-09.md`. Se confirmó con extracción binaria que el Mobile Center **V4.6 FROZEN** contiene EXACTAMENTE el cuestionario guiado V3 de Biblioteca (514 154 bytes; SHA256 `4a0a8e46057d24e2cf1775cdf5665025123b73e21feb2585bda2a90afe6c0b51`): no ofrece «Solo fotografía» y serializa solo preset/custom. Este es un **defecto de flujo común**, adicional a la conversión backend v12 `none→preset`. Se ha creado una copia de preproducción del formulario con opción «Solo fotografía», validación de foto requerida y rehidratación, que pasa 3/3 escenarios móviles a 360/390/430 px y 3/3 regresiones de preset/custom/reapertura. La candidata es `/GUEST by WeddlySmartDesign/BOTANICA/Preproduccion/GUEST_QUESTIONNAIRE_COMUN_V3_CANDIDATA_SOLO_FOTO_NO_PUBLICAR_2026-10-09.html`, SHA256 `48ad877566894c5092d81805ae4d20a3293cc23929669b5ab28b921be71d683e`. **NO publicar, NO sustituir el formulario compartido sin QA VEIL LIGHT**.

También se ha preparado una **copia separada** del Mobile Center con solo la cadena base64 de su cuestionario reemplazada: `/GUEST by WeddlySmartDesign/BOTANICA/Preproduccion/GUEST_MOBILE_CENTER_V4_6_SOLO_FOTO_INTEGRACION_CANDIDATA_NO_PUBLICAR_2026-10-09.html`, SHA256 `90bb178a97cb46b3525406eb0dcc7272b2a002fa080e61f456f857bbb8d3e003`. El V4.6 original no cambia; comparación fuera del formulario embebido = byte-idéntica. Script offline reproducible `stage_mobile_center_form_none.py` guardado en Biblioteca; no desplegado. La versión real actualmente publicada debe verificarse antes de cualquier sustitución. Edge Function sigue bloqueada y solo admite VEIL LIGHT; pedidos reales/RSVP/Android **siguen sin certificar**. **Botánica V14.7 sigue siendo la candidata del diseño**.

## ACTUALIZACIÓN DE CIERRE TÉCNICO LOCAL (09/10/2026)

**Leer también:** `guest/GUEST_D02_BOTANICA_CIERRE_TECNICO_GATES_PENDIENTES_2026-10-09.md`. Se completaron **2/2 recorridos simulados completos del cuestionario común** (uno con solo foto y una sede, otro con texto, dos sedes, agenda, bus, hotel, regalo, playlist y galería) y ambos se renderizaron sin fallo con V14.7. `load/save/upload/submit` fueron simulados localmente, por lo que **NO son pedidos reales, NO certifican URLs finales ni RSVP**. Se detectó un defecto adicional del formulario al reconstruir campos de regalo durante `input` (error JS `innerHTML`); **corregido exclusivamente en candidato de preproducción**, junto con la retención de valores al cambiar banco/texto. El test de 2 pedidos y regresión de 3 modos de Historia pasa. El formulario candidato actual es `/GUEST by WeddlySmartDesign/BOTANICA/Preproduccion/GUEST_QUESTIONNAIRE_COMUN_V3_SOLO_FOTO_REGALO_INTEGRADO_QA_2026-10-09.html` (SHA256 `19b4c0764add067c13977677b9e87ced2e70c1736e7679a5f90bc5d8723229af`). La copia aislada del Mobile Center V4.6 con ese formulario tiene SHA256 `0832f4fac4ae51f5a3e305a0d06284a3ff4bb1a121ece4a4e8b01e5368605c7a`. **Ambas son NO PUBLICAR; los originales congelados siguen intactos.**

**BLOQUEO NUEVO CONFIRMADO:** `CATALOG_RENDERERS` en el Mobile Center V4.6 congelado reconoce **solo `veil-light`**. El formulario incrustado corregido por sí solo NO permite mostrar Botánica: falta integrar su renderer en un nuevo Mobile Center/arquitectura del catálogo y probar paridad con VEIL LIGHT. El backend v12 también sigue sin admitir Botánica y convierte `story.textMode='none'` a `preset`. **NO DESPLEGADO**, no se debe evadir el bloqueo de herramientas; test-only autorizado pendiente. Mantener Botánica `certification-pending`, sin publicaciones, cobros ni respuestas reales registradas.

**Respaldo actualizado de preproducción:** `/GUEST by WeddlySmartDesign/BOTANICA/Checkpoints/GUEST_BOTANICA_D02_CIERRE_TECNICO_LOCAL_PREPRODUCCION_2026-10-09.zip` (SHA256 `88eedfc8c79dc097079d0765f8dd846070dfbd9a3f507eeda822ea6a094fdbee`). Incluye V14 congelada, V14.7 candidata, formulario, Mobile Center aislado, 2 casos simulados, capturas, código de prueba y manifiesto de integridad. El ZIP anterior V3 sigue preservado como historial. Para retomar usar primero este checkpoint sin volver a pedir a la propietaria instrucciones.

## ÚLTIMO ESTADO — INTEGRACIÓN DE RENDERIZADOR (09/10/2026)

Ver `guest/GUEST_D02_BOTANICA_ESTADO_BLOQUEO_REAL_2026-10-09.md`. Se ha creado copia de preproducción del Mobile Center con el renderizador Botánica V14.7 aislado, sin duplicación de multimedia (paquete de dos archivos en Biblioteca `/GUEST by WeddlySmartDesign/BOTANICA/Preproduccion/GUEST_BOTANICA_MOBILE_CENTER_RENDERER_TEST_ONLY_2026-10-09.zip`, SHA256 `67c12d03fa2f1aeb4478a06db84291ba83d8a337a50687433f2ed6c422246238`). Prueba de sintaxis JS, paridad de fuente original y ZIP CRC **PASS**; prueba gráfica de navegador **BLOQUEADA por el entorno** con `net::ERR_BLOCKED_BY_ADMINISTRATOR`. **No se ha integrado ni publicado en producción.** La Edge Function sigue sin admitir Botánica y su despliegue test-only continúa bloqueado. La V14 aprobada sigue congelada; V14.7 continúa `certification-pending`. La certificación final E2E y Android **NO HECHAS**.

## Admisión comercial verificable — control automático (09/10/2026)

Antes de reclamar D02 como lista para vender, ejecutar `node guest/qa/catalog_admission_gate.cjs --admit botanica`. El registro de evidencias `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json` marca **3/11 pruebas PASS** (matriz local, integridad multimedia, visual V14 aprobado) y **8/11 PENDING** (cuestionario común en producción, backend en test-only, renderizador real del centro, dos pedidos E2E reales, paridad revisión/final, RSVP persistente, Android, tiempo real de atención). También bloquea cinco incompatibilidades compartidas, incluida `schemaVersion` y `textMode='none'`. Es una barrera obligatoria y automática para D02–D06, no un sustituto del E2E.

Comandos reproducibles:
```bash
node guest/qa/catalog_admission_gate.cjs
node guest/tests/catalog_admission_gate_test.cjs
node guest/qa/catalog_admission_gate.cjs --admit botanica
```
Los dos primeros deben pasar con estados honestos. El tercero debe rechazar la certificación mientras haya gates pendientes. Guía completa: `guest/GUEST_CATALOG_RELEASE_GATES_D02_D06_2026-10-09.md`. No publicar, desplegar al margen de controles, ni iniciar D03 mientras el contrato compartido de D02 no esté resuelto.

## 25. GUEST visual-plugin common system V2 — reuse gate

Updated 2026-10-09. **Mandatory read-first:** `guest/GUEST_PLATFORM_VISUAL_V2_READ_FIRST_2026-10-09.md`, with implementation details in `guest/GUEST_CATALOGO_VISUAL_SISTEMA_COMUN_V2_2026-10-09.md`.

Future Design 03/04/… templates must provide only visual HTML exposing `window.GUEST_APPLY_CONFIG(config)` and a small `visual-plugin.json`. `guest/tools/register_visual_template.cjs` creates adapter, owner-viewer manifest, catalog registry entry and certification evidence atomically **in a working tree**; commit all generated files together. `guest/catalog/guest-catalog-owner-viewer-v2.js` uses one owner interface (native VEIL legacy / same-origin iframes for future designs), and `guest/tools/generate_backend_catalog_registry.cjs` compiles production-only certified IDs or guarded test-only IDs. CI executes `guest/qa/catalog_preflight_v2.cjs` and the sale-admission gate; new designs cannot inherit VEIL's historical seal, and a pending candidate cannot be used as production.

**Scope truth:** The common system is implemented and locally tested in branch `guest-independent` but has **NOT YET** been deployed into the actual Mobile Center or Supabase v12. The latter remains blocked by platform tooling. Until an authorized backend and common owner UI integration is deployed and verified with real orders, RSVP, Android and <=5 minute owner touch, D02 Botánica remains `certification-pending` and the system must NOT be called fully commercial-certified. Do not bypass tooling controls, change frozen files or start D03 with custom commercial/RSVP code.
