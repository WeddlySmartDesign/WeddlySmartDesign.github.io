# GUEST by WeddlySmartDesign — Sistema común de diseños / contrato V2

**Estado a 09/10/2026: IMPLEMENTACIÓN DE INFRAESTRUCTURA EN `guest-independent`; NO PUBLICADO NI CERTIFICADO E2E EN PRODUCCIÓN.**

## 1. Objetivo vinculante

A partir del diseño 03, la parte creativa debe reducirse a un **HTML visual reutilizable** y un pequeño fichero `visual-plugin.json`. La misma infraestructura común ha de procesar los pedidos de cualquier plantilla: cuestionario, modelo de datos, revisión, aprobación, entrega, enlaces de invitado, RSVP y gestión de GUEST. **No debe existir una versión distinta del cuestionario, backend ni Mobile Center por diseño.**

«Solo diseñar» significa **sin añadir código de gestión, pagos, cuestionarios ni RSVP para cada plantilla**. No significa omitir QA por diseño: cada nuevo arte visual debe superar pruebas de adaptabilidad móvil, legibilidad, medias, accesibilidad y pedidos de prueba reales. Tampoco elimina el despliegue controlado de nuevas versiones de catálogo.

### Protección de productos sellados

- VEIL LIGHT V5.3.3: mantener congelado y certificado. No modificar su HTML para añadir nuevos diseños.
- Botánica V14: aprobado visual e inmutable. V14.7 es candidato técnico **PENDIENTE DE E2E**.
- ONE, ONE Partner y STUDIO no entran en este trabajo.
- No publicar ni cobrar sin acto posterior de autorización y pruebas verificadas.

## 2. Interfaz obligatoria de un diseño nuevo

El archivo `master.html` solo proporciona estética, animaciones y contenido visual; **expone**:

```js
window.GUEST_APPLY_CONFIG = function (config) { /* actualizar DOM sin reconstruir motor */ };
```

`config` es el modelo GUEST `guest-invitation-config-v1` existente, con nombres, fecha, lugares (hasta dos), Story (`preset`, `custom`, `none`), agenda, bus, alojamiento, regalos, galería, cierre y RSVP decorado. El diseño no pide datos propios ni ajusta DOM/CSS manualmente por pareja. Las imágenes/vídeos de plantilla no contienen datos variables.

Un `visual-plugin.json` declara **solo** `id`, `displayName`, `version`, `rendererApi: GUEST_APPLY_CONFIG`, `masterHtml` y variantes tipográficas. Ejemplo en `guest/templates/_example/`.

**Compatibilidad:** VEIL LIGHT conserva su función histórica `VEIL_APPLY_CONFIG` y Botánica el adaptador ya preparado `BOTANICA_APPLY_CONFIG`. No se reescriben para introducir el estándar nuevo.

## 3. Alta automática de un diseño

Herramienta reutilizable `guest/tools/register_visual_template.cjs`:

```bash
node guest/tools/register_visual_template.cjs --manifest guest/templates/design-03/visual-plugin.json
node guest/tools/register_visual_template.cjs --manifest guest/templates/design-03/visual-plugin.json --apply
```

El primer comando **solo calcula el plan**. El segundo añade, sin tocar los diseños previos:

1. Una copia versionada del visual en `guest/catalog-assets/<id>/<version>/index.html`.
2. Su adaptador estándar `guest-catalog-template-<id>-adapter-v1.js`.
3. La entrada en el registro comercial `GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json`, **siempre** `certification-pending`.
4. La entrada en el manifiesto genérico de visualización `GUEST_CATALOG_OWNER_RENDERERS_V2.json`.
5. El expediente de pruebas **todas inicialmente pendientes** en `GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json`.

El generador prohíbe IDs duplicados, rutas inadecuadas, interfaces privativas y la sustitución de archivos visuales existentes. No llama a Supabase, a Stripe ni a GitHub Pages. No declara una plantilla certificada.

## 4. Visor único de Mobile Center

Archivo `guest/catalog/guest-catalog-owner-viewer-v2.js`: recibe `order + config + host + registry` y resuelve el diseño por ID y versión. **No contiene condiciones especiales para D03/D04/etc.**

- VEIL LIGHT usa su renderizador nativo original.
- Los demás diseños se abren en iframe de **mismo origen**; el centro NO incorpora sus vídeos ni fotos, ahorrando memoria en Android.
- El visor exige que el identificador y versión de pedido, `config` y manifiesto coincidan. Una plantilla pendiente solo puede visualizarse en `mode:test`.
- Falla de forma cerrada si la URL no existe, pertenece a otro origen, el adaptador no carga o la versión no coincide.
- La aplicación GUEST conserva la responsabilidad exclusiva de enviar y registrar RSVP.

**Importante:** Esta API y registro ya están probados en un entorno aislado. El Mobile Center V4.6 congelado todavía no usa la nueva API; necesita **una sustitución única, controlada y validada**. No afirmar que la integración real esté hecha porque el módulo exista.

## 5. Backend: una sola definición de registro, no lógica por diseño

`guest/tools/generate_backend_catalog_registry.cjs` genera de forma determinista el registro de plantillas que una Edge Function autorizada debe consumir.

```bash
node guest/tools/generate_backend_catalog_registry.cjs --mode production --output /tmp/catalog.production.ts
node guest/tools/generate_backend_catalog_registry.cjs --mode test-only --output /tmp/catalog.test-only.ts
```

- **Producción:** solo incluye plantillas comercialmente certificadas; actualmente VEIL LIGHT.
- **Pruebas:** puede incluir candidatas, pero con `testOnly:true` y el guard de modo `template_test_only` exigible **en todas** las rutas que creen pedidos, incluido el checkout.
- Este fichero NO despliega ni modifica por sí mismo la función Supabase.

La Edge Function actualmente desplegada `guest-invitation-flow` v12 **no ha sido actualizada** y solo conoce VEIL LIGHT. Antes de sustituir esa definición hay que verificar el código vigente, sus rutas de creación, y pasar E2E de VEIL. No utilizar otro canal de despliegue para eludir un bloqueo del entorno.

## 6. Contrato de cuestionario (un único formulario)

El cuestionario guiado V3 original y el Mobile Center V4.6 congelado contienen la misma versión binaria, que aún no ofrece Historia «Solo fotografía» y reconstruye ciertos campos de regalo. Las correcciones existen **solo en copias de preproducción** en la Biblioteca, con pruebas locales de dos pedidos simulados. Antes de una actualización común autorizada:

1. Incluir `story.textMode: none` con foto obligatoria cuando esa opción esté activa.
2. Preservar `preset` y `custom` exactamente igual en VEIL.
3. No re-renderizar formularios de regalos en cada pulsación; retener valores al cambiar de tipo.
4. Armonizar la Edge Function para que **no convierta** `none` a `preset` y para que emita `schemaVersion` según el esquema común, con pruebas de regresión.
5. Probar el formulario desde el **Mobile Center realmente distribuido**, no solo un HTML aislado.

## 7. CI, pruebas y prueba de venta

Las pruebas integradas ejecutan: admisión comercial + casos mutantes, constructor de plugins y su rechazo de duplicados, visor común y su seguridad, generación de registro para backend y sus barreras de producción. Comandos:

```bash
node guest/qa/catalog_admission_gate.cjs
node guest/tests/catalog_admission_gate_test.cjs
node guest/tests/visual_plugin_onboarding.test.cjs
node guest/tests/owner_viewer_generic.test.cjs
node guest/tests/backend_catalog_generation.test.cjs
node guest/qa/catalog_admission_gate.cjs --admit botanica
```

El **último** debe FALLAR por los controles reales aún sin completar. Nunca usar la simple existencia de un adaptador como prueba de que un pedido se puede vender.

Requisitos comerciales por diseño: matriz visual y técnica, dos pedidos **reales** distintos desde el cuestionario único, revisión/final idénticos con el mismo renderer, URL estable, rutas personalizadas `rt/g/u/lang`, RSVP persistente en el motor existente, comprobación Android y tiempo activo máximo de 5 minutos. Toda evidencia queda versionada y es revisable.

## 8. Sello único y pendiente real

**Infraestructura local reutilizable:** módulos y tests desarrollados, pendientes de ser integrados en el centro y función autorizados.

**No cerrado aún:** backend test-only (bloqueo del entorno), correcciones del cuestionario compartido, adopción del visor en un Mobile Center nuevo, pedidos E2E reales, RSVP y validación Android de Botánica. Ni VEIL LIGHT ni ventas deben verse afectadas.

El próximo operador debe continuar desde este documento y `guest/GUEST_D02_BOTANICA_READ_FIRST.md` **sin pedir a la propietaria que repita decisiones**. En cuanto el entorno permita autorización y prueba real, la prioridad es cerrar la **infraestructura común UNA VEZ** y certificar Botánica antes de arrancar D03.