# GUEST D02 — BOTÁNICA / CERTIFICACIÓN V14.7 (CHECKPOINT)

**Fecha:** 2026-10-09. **Rama:** `guest-independent` de `WeddlySmartDesign/WeddlySmartDesign.github.io`.

## Fuentes y estados, sin confundir

- **V14 APROBADA VISUALMENTE Y CONGELADA**. No modificar: `GUEST_D02_BOTANICA_ATELIER_V14_FROZEN_2026-10-09.html` — SHA-256 `27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39`.
- **V14.5 candidata histórica**, no congelación comercial — SHA-256 `ba8b6515e5bb2ba81c3ea3dbd88199b4a3abc66919caefa1e3d37ced8ce61e84`.
- **V14.6 candidata histórica**, foto-only mapeado pero con bloque de texto vacío visible — SHA-256 `35d0caf0a2ef716a51b7d5cdfd451ebc5ad5ae60bb9ad56aee4ed9c692820c85`.
- **V14.7 CANDIDATA TÉCNICA VIGENTE**, pendiente E2E y Android — archivo `GUEST_D02_BOTANICA_ATELIER_V14_7_PHOTO_ONLY_VISUAL_QA_CANDIDATE_2026-10-09.html` — SHA-256 `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a` — 11.6 MB aproximadamente.

**V14.7 no está comercialmente certificada, no está a la venta y no desplaza la V14 como versión aprobada por la propietaria.**

## Defecto demostrado y corrección exacta

La prueba visual en Chromium de V14.6 con `story.enabled=true`, `story.textMode='none'` y fotografía mostró la fotografía en `#introPhoto` **pero también una sección Story de 194 px con título «Y de repente, este plan.» y sin contenido**. La prueba puramente de mapeo anterior no podía detectar ese residuo visual.

V14.7 se deriva EXCLUSIVAMENTE de V14.6, cambiando dos líneas en `render()`:

1. `storyOn` exige texto real no vacío para mostrar el capítulo tipográfico; la fotografía del interludio continúa mostrándose por `CONF.storyPhoto` sin exigir texto.
2. Cuando Story no tiene texto, se vacían `#storyTitle` y `#storyCopy` en el DOM para no conservar datos previos al reutilizar la plantilla entre configuraciones.

Ninguna otra línea, recurso o estilo cambia.

## Pruebas ejecutadas (locales / NO backend real)

- **20/20** combinaciones visuales: cinco variantes Story (`normal`, `photoonly`, `nothing`, `textonly`, `presetphoto`) en cada anchura **320, 360, 390 y 430 px**.
- **0** desbordamientos horizontales y **0** errores JavaScript en esa matriz.
- **6/6** escenas con comparación de imágenes idénticas píxel por píxel entre V14.6 y V14.7 **para la configuración normal**: portada, Agenda, Práctico, Galería, Cierre e Historia. Capturas hechas con vídeos/animaciones deshabilitados y fuentes externas bloqueadas para reproducibilidad.
- **Smoke de HTML COMPLETO**, sin eliminar recursos: 390 px, foto-only; fotografía visible, bloque de texto vacío oculto, texto del DOM vacío, 5 elementos `<video>` preservados, sin JS errors ni overflow.
- **5/5** barreras de integridad: SHA-256 de V14 / V14.5 / V14.6 / V14.7; 3 MP4 y 14 WebP idénticos; interfaz común presente; V14.5→V14.6 una línea; V14.6→V14.7 exactamente dos líneas.
- Matrices anteriores de V14.5 (116 casos más 8 fixtures), puente RSVP aislado (7 casos) siguen siendo evidencias históricas; deben repetirse contra V14.7 cuando sea posible y **no** sustituyen pruebas reales.

## Brechas reales descubiertas antes de la certificación

- Edge Function desplegada `guest-invitation-flow` **v12**, SHA `69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac`, admite solamente `veil-light`. El intento anterior de habilitación test-only fue bloqueado por controles del entorno. **No reintentar eludirlos**.
- El `buildConfig` actual del backend normaliza `story.textMode` a `custom` o `preset` y **no conserva `none`**, aunque el esquema común admite `none`. Por tanto, el estado foto-only ahora funciona en el renderer, pero debe verificarse y armonizarse el contrato del cuestionario/backend **antes de afirmar que puede producirse mediante un pedido real**. Este ajuste necesita un despliegue autorizado, no se ha aplicado.
- Falta pedido E2E normal y pedido de estrés realmente emitidos desde el cuestionario, con versión pinneada, mismos medios firmados en revisión/final, enlace estable, RSVP personal `rt` + `g` / `u` + `lang`, respuesta en el motor existente y tiempo operativo Android ≤5 minutos.

## Reproducción independiente

```bash
node guest/tests/botanica_artifact_integrity_offline.test.cjs V14.html V14_5.html V14_6.html V14_7.html
node guest/tests/botanica_schema_mapping_offline.test.cjs V14_7.html
node guest/tests/botanica_catalog_bridge_offline.test.cjs
```

Para las capturas, usar el script de prueba `botanica_v14_7_visual_safety.py` junto al HTML de QA multimedia ligero y los datos de la matriz `botanica_matrix.py` almacenados en el paquete de recuperación, sin sustituir la versión oficial por la vista ligera.

## Lo siguiente

1. Mantener la V14 aprobada intacta y registrar V14.7 como `certification-pending` en el catálogo, **no** `commercially-frozen`.
2. Ejecutar los tres controles offline con V14.7 y conservar la evidencia; el CI de contrato queda separado de los escenarios dependientes de los HTML de Biblioteca.
3. Solo en un entorno autorizado: habilitación **test-only** en Edge Function con guard de producción; armonizar el `textMode='none'` cuando corresponda; verificar cobertura del guard también para checkout y rollback.
4. Solo entonces: dos pedidos de prueba reales y E2E RSVP/revisión/entrega. Solo al pasar todo, revisión final Android y certificación comercial; publicar/cobrar requiere autorización independiente.

**Prohibido:** editar V14, mover cambios a `main`, tocar ONE / Partner / STUDIO / VEIL LIGHT, crear un segundo RSVP o sistema de envío, afirmar certificación comercial sin E2E.