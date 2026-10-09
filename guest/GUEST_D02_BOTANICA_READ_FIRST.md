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