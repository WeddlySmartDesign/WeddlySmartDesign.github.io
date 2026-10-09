# GUEST — Puerta de admisión comercial obligatoria para diseños 02–06

**9 octubre 2026 — rama `guest-independent`.** Este documento ejecuta el manual maestro, no sustituye el contrato canónico. Aplica **desde el comienzo** de cada nuevo diseño. No modifica ONE, Partner, STUDIO, VEIL LIGHT congelado, ni el backend de producción.

## 1. Una sola arquitectura, sin excepciones por diseño

Cada invitación es **un plugin visual** con `template.id`, `template.version` y `applyConfig(config)`. El resto es compartido:

`catalogo -> pedido con template_id fijado -> cuestionario compartido -> validador -> config canónica -> renderizador seleccionado -> Mobile Center -> revisión/aceptación -> URL estable -> app GUEST -> RSVP y datos por unidad/invitado`.

Queda prohibido admitir otro formulario privado, otro RSVP, otro motor de envíos o tocar CSS/HTML individualmente por pareja. No se altera un archivo congelado para soportar un diseño nuevo: versiones nuevas independientes y pruebas de no regresión.

## 2. Nuevo control automático: imposible certificar con huecos de evidencia

Documentos vivos en GitHub:

- `guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json` (estado y versión de cada plantilla).
- `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json` (evidencia PASS/PENDING por plantilla; nada se convierte en PASS sin una prueba identificable).
- `guest/qa/catalog_admission_gate.cjs` (control ejecutable y sin acceso a backend/Stripe).
- `guest/tests/catalog_admission_gate_test.cjs` (demuestra que no acepta falsa certificación ni un nuevo diseño sin adaptador y evidencias).

Ejecutar desde la raíz:

```bash
node guest/qa/catalog_admission_gate.cjs
node guest/tests/catalog_admission_gate_test.cjs
node guest/qa/catalog_admission_gate.cjs --admit botanica
```

Los dos primeros deben pasar si el registro es **veraz**. El tercero **DEBE FALLAR mientras Botánica no esté lista**; eso es correcto, no un error del sistema de CI. Los futuros diseños se evalúan con `--admit <template-id>`. La admisión estricta queda fuera del workflow en cada push mientras el diseño se prepara, para no inundar de falsos fallos.

Gates obligatorios por nuevo diseño: cuestionario común, backend habilitado exclusivamente para test previo, renderizador integrado, matriz de variantes, **dos pedidos de verdad (sin clientes reales)**, paridad review/final, RSVP con persistencia, Android, tiempo activo ≤5 minutos, integridad multimedia y visual aprobado. Si alguno está en `false` o no tiene soporte verificable, **no venta**.

La certificación previa de VEIL LIGHT V5.3.3 se preserva como sello histórico: no se vuelven a probar artificialmente los estados nuevos ni se altera su código. Las nuevas funciones comunes deben comprobar que no rompen sus estados existentes.

## 3. Problemas reales que ningún diseño 03–06 puede repetir

| Problema detectado en Botánica | Control previo ahora obligatorio |
|---|---|
| El esquema exige `schemaVersion`, pero el backend v12 no lo emite | Fixture extraído de `buildConfig` del **backend desplegado** y validación contra el esquema antes de diseñar. No confiar en el esquema teórico. |
| El backend v12 convierte Historia `none` a preset | Paridad exacta de estados `preset/custom/none`, incluso foto sin texto; validación de foto requerida en el cuestionario y backend, sin romper VEIL. |
| El formulario declara «texto, foto o ambas», pero no ofrece foto sola | Cada opción admitida se puede seleccionar, guardar, recargar y entregar con un único formulario común, probado en Android. |
| El formulario reconstruye campos mientras se escribe / pierde regalo | Prueba de `input/blur`, cambio de modalidad ida/vuelta y recuperación del contenido. |
| El Mobile Center v4.6 reconoce solo VEIL LIGHT | Registro de renderizadores por `template_id` con revisión y final del **mismo** plugin. Multimedia pesada fuera del Centro, no embebida dos veces. |
| Las demos pasan pero falla el pedido real | Dos pedidos independientes desde el formulario real hasta entrega e invitado, sin tocar HTML entre ellos. |
| CTA RSVP pasa con mocks pero no se escribe en GUEST | Prueba end-to-end en modo test: `rt`, `g/u`, `lang`, respuesta persistida sin duplicar, usar motor GUEST existente. |
| El cambio de una sección altera otra | Comparativa íntegra de escenas, animaciones, imágenes, menús, CTA, fotos, enlaces; regresión V14 congelada. |
| Se declara terminado cuando faltan tareas | El registro y la puerta de admisión rechazan `commercially-frozen` hasta que **todos** los gates estén confirmados. |

## 4. Botánica: situación real y ruta de resolución

- **Diseño aprobado:** V14, inmutable. **Candidata de código:** V14.7, no certificada comercialmente.
- Cuestionario corregido y Mobile Center con renderizador Botánica existen en **copias separadas de preproducción**. Dos pedidos completos simulados funcionan, pero no son E2E de Supabase.
- El backend `guest-invitation-flow` v12 (Supabase `dnjsxequwgtyyauuofxj`) solo reconoce VEIL LIGHT. La operación para desplegar un `botanica` test-only fue bloqueada. **No intentar eludir los controles** ni suponer que existe un despliegue.
- Los cambios backend mínimos necesarios en un **entorno legítimamente autorizado** son: (1) registro `botanica` con `testOnly` y barrera `mode==='test'` en toda ruta de creación, también compra; (2) alineación segura de `story.textMode=none`, foto validada y `schemaVersion` con el esquema común; (3) comprobación de regresión en VEIL; (4) no publicar ni activar Stripe.
- En paralelo, habilitar en un **nuevo Mobile Center no congelado** la resolución de Botánica por su identificador, la misma configuración revisada y entregada, y una URL separada para el artefacto multimedia. La copia aislada existente no se considera integrada comercialmente solo porque pase sintaxis.
- Ejecutar dos pedidos `mode=test` desde el cuestionario único, con carga real de recursos de prueba, review → approved → delivered, URL estable, RSVP existente y comprobación Android/tiempo. La salida de ese ensayo constituye la evidencia para cambiar el estado de Botánica de `certification-pending` a `commercially-frozen`.
- **Publicación y cobro son un paso posterior distinto**, con autorización explícita. No confundir la certificación con salir a venta hoy.

Referencias: `guest/GUEST_D02_BOTANICA_READ_FIRST.md`, `guest/GUEST_D02_BOTANICA_CIERRE_TECNICO_GATES_PENDIENTES_2026-10-09.md`, `guest/GUEST_D02_BOTANICA_ESTADO_BLOQUEO_REAL_2026-10-09.md`.

## 5. Orden de trabajo de cada diseño futuro (sin delegar QA en la propietaria)

1. **Preflight ANTES DE DISEÑAR**: registrar id y versión, añadir adaptador y registro `certification-pending`, abrir entrada en el documento de evidencias con todos los `pass:false`. Revisar diferencias entre formulario, esquema y backend real.
2. Probar combinaciones extremas: nombres, dos sedes, horarios, cero/cinco momentos, galerías 0/4, historia texto/foto, módulos encendidos y apagados, enlaces y foto con archivo real.
3. Programar renderizador puro y medios reutilizables; no encapsular datos variables dentro de vídeo ni meter 12 MB de animación en el centro.
4. Construir escenario normal y uno totalmente diferente desde formulario **sin HTML manual**, verificar cada escena y el motor GUEST.
5. Completar la evidencia de **todos los gates** con resultados reproducibles, móviles y de E2E; ejecutar `--admit ID` antes de elevar el registro.
6. Solicitar solamente aprobación artística final en Android; la propietaria no corrige bugs ni ejecuta controles técnicos.
7. Congelar un hash identificable y decidir de forma separada la venta/publicación.

**Regla de paro:** ante bloqueo de despliegue o tests E2E incompletos, escribir `PENDING` y no publicar. Ante incompatibilidad de contrato compartido, repararla **antes de abrir otro diseño**: el nuevo diseño no puede inventar una excepción local.