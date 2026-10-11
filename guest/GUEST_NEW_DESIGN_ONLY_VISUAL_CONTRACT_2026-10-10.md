# GUEST — contrato operativo para diseños 03–1000

**Estado:** contrato técnico **verificado en CI aislada** el 10/10/2026. **NO** supone que Botánica esté habilitada para venta ni autoriza abrir Diseño 03. Mantener ONE, Partner, STUDIO, VEIL LIGHT, Botánica V14/V14.7 y `main` intactos.

## Regla de producto

Después del cierre comercial real de Botánica, la única novedad en el trabajo creativo del siguiente diseño es el **HTML visual terminado**, con la API común `window.GUEST_APPLY_CONFIG(config)` y una ficha `visual-plugin.json` (id, nombre, versión, HTML, tipografía). No volver a crear cuestionarios, pagos, licencias, pedidos, backend por diseño, RSVP, gestión, publicaciones de invitados o clientes ni un centro de revisión por plantilla. El operador técnico ejecuta el registro existente, sin involucrar a la propietaria en programación.

La reutilización **no significa omitir comprobaciones de calidad**: cada diseño requiere comprobación visual, dos pedidos y enlaces reales, RSVP, medio firmado y aceptación Android; todas deben reutilizar las suites y herramientas comunes ya hechas. Nunca certificar solo porque un diseño se vea bien.

## Único recorrido técnico de incorporación

1. Diseño nuevo y su ficha en carpeta de entrada; el master visual exporta `GUEST_APPLY_CONFIG`. Ejemplo existente: `guest/templates/_example/{master.html,visual-plugin.json}`. No usar el ejemplo para crear ahora un Diseño 03 comercial.
2. Ejecutar en modo lectura `node guest/tools/register_visual_template.cjs --manifest <ruta-a-visual-plugin.json>`. Se verifica el HTML, ruta, hash y contrato visual; no cambia producto.
3. Cuando el master esté acabado, `node guest/tools/register_visual_template.cjs --manifest <ruta-a-visual-plugin.json> --apply` registra **automáticamente** plantilla y versión en el catálogo, evidencias pendientes, owner registry y estado `GUEST_PROJECT_STATUS_V1.json`, añade el HTML a `guest/catalog-assets/<id>/<version>/index.html` y genera su adaptador. El estatus sigue `certification-pending`. No añade lógica condicional al backend, al checkout, al cuestionario o a la app de invitados.
4. Tanto `visualMasterSha256` como `candidateSha256` se fijan al mismo archivo; la vista previa de la propietaria **no anuncia una URL pública antes de la publicación** (`src: null`). El centro común de preproducción sustituye ese `src` exclusivamente por una copia local con hash comprobado.
5. El empaquetador único `guest/tools/build_catalog_delivery.js` toma `applyApi` del manifiesto del renderizador, no de la identificación del diseño. En `--test-only` exige hash inmutable y flujo HTTPS aislado distinto de ONE y STUDIO; muestra advertencia NO PUBLICAR, `noindex` y prohíbe ventas. En modo comercial solo admite `commercially-frozen`.
6. La versión del catálogo backend procede de `guest/tools/generate_backend_catalog_registry.cjs`, con `production` / `test-only`. La evidencia de `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json` impide promocionar una candidata por simple cambio de bandera.

**Prueba antirretrabajo:** `guest/tests/visual_plugin_onboarding.test.cjs` crea un Diseño 03 exclusivamente **ficticio** en directorio efímero, lo registra, ejecuta **el empaquetador REAL**, verifica `GUEST_APPLY_CONFIG`, URL QA aislada, `noindex`, estado pendiente y denegación si se altera el master; las suites generales y `guest/qa/catalog_delivery_builder_test.js` verifican paridad con VEIL LIGHT y Botánica. Repetir esta prueba en cada cambio del sistema común, NO crear un nuevo módulo por diseño. CI de referencia tras reparación: GitHub Actions en HEAD `990ce5650e0e7e8a08998a03e2efcaa047928705`, Catalog/Continuity run **38070865079** PASS, Catalog Bridge run **38070865042** PASS. Esta es certificación técnica del **registro y empaquetado**, no de la venta.

## Bloqueos de producto compartidos que se resuelven UNA SOLA VEZ con Botánica

- **Salida de V13 al Cloud autorizado** tras validar regreso a VEIL LIGHT, rollback, aislamiento y datos. La candidata V13 ya existe y está probada con Supabase efímero; no montar un backend por diseño.
- **Una sola pasarela comercial que registre la plantilla y versión** en compras nuevas habilitadas, enlace a licencia/pedido, sin modificar compras históricas Essential/Signature ni vender diseños pendientes.
- **Una sola entrega HTTPS personalizada** con revisión/final consistentes, fotos/vídeos firmados con integridad, tokens del destinatario `g/u`, RSVP persistido y acceso del comprador a gestión.
- **Una sola experiencia de propietaria** desde el móvil, con trabajo activo objetivo de 5 minutos por pedido, y prueba real en Android. Publicación visual en Vercel `READY` ≠ entrega de un pedido.
- Cerrar íntegramente los once requisitos del gate `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json`; hasta entonces **Botánica NO-GO**. Solo después de cerrar el sistema común se permite diseñar/registrar D03.

## Reglas de no regresión

- No editar archivos de VEIL LIGHT congelado, Botánica visual, ONE, Partner, STUDIO ni `main`; registrar nuevos códigos únicamente en `guest-independent`.
- Si un diseño obliga a editar checkout, questionario, RSVP, administración o backend por su nombre, **es un fallo del sistema común**, no un paso ordinario del diseño. Corregirlo una vez, con una prueba sintética del próximo diseño, antes de aprobar otra plantilla.
- Nunca activar pagos, enviar correos a clientes ni dar publicidad a candidatas `certification-pending` como vendibles. Registrar evidencias externas, SHA y QA en `guest/START_HERE.md`, `guest/GUEST_PROJECT_STATUS_V1.json` y la bitácora viva de Biblioteca. Precio incremental de herramientas autorizado: **0 €**.


## Ratificación expresa de la propietaria — 11/10/2026: NUNCA repetir el trabajo de Botánica por plantilla

**Petición literal de producto:** «cuando hablas de conectar Botánica te refieres a que cualquier diseño que hagamos ya no necesitaremos hacer nada más que el diseño, verdad? después de tanto trabajo no quiero volver a repetir los errores». Esta es una **obligación del sistema GUEST**, no una aspiración decorativa. Aplica a diseños 03, 04, 05… y 1000.

### Contrato de creación, entrega y responsabilidad

- **Trabajo creativo nuevo:** exclusivamente terminar y aprobar el HTML visual premium de cada diseño, con la interfaz `window.GUEST_APPLY_CONFIG(config)`, y suministrar su ficha `visual-plugin.json`. Si el diseño es multimedia grande se emplea el mismo mecanismo genérico de fragmentos inmutables + SHA; NO nuevas herramientas de vídeo por diseño salvo justificación separada.
- **Trabajo técnico automatizado que asumirá GUEST:** validar HTML/contrato, registrar plantilla/id/versión y hash, preparar recursos y actualización del catálogo, emitir previsualización, aplicar cuestionario V3, licencia y compra de catálogo, crear pedido, operar el centro de propietaria, permitir revisiones/cambios y entrega final, personalizar por invitado, enviar mediante el motor existente, recibir RSVP, gestionar mesas y exportaciones. No crear de nuevo ninguno de estos módulos, ni cobrar un coste de instalación por diseño.
- **Intervención de la propietaria:** solo revisar en su móvil el resultado terminado, dar feedback visual y autorizar la comercialización **después** de QA; no programar, integrar APIs, subir ZIP, cambiar comandos de Cloudflare, editar Supabase ni aprender herramientas para sostener cada diseño. El objetivo de operación del encargo sigue siendo como máximo cinco minutos activos (que requiere medición real).
- **Seguridad de catálogo:** cada diseño empieza `certification-pending`. Ninguno se vende porque exista HTML publicado: pasar las once pruebas de admisión que le correspondan, conservar enlaces reales, licencias y RSVP, aprobación Android y una versión inmóvil. El flujo y pruebas deben reutilizar **los mismos contratos**, no construir una nueva plataforma por diseño. No se puede prometer ausencia absoluta de defectos; la garantía operativa es impedir publicación comercial ante una regresión detectada y repararla **una sola vez** en el sistema común.
- **Regla de escalabilidad / no regresión:** si incorporar D03 obliga a editar el checkout, el backend de invitaciones, el cuestionario, RSVP, gestión, centro de propietaria o una URL/comando a mano **por nombre de plantilla**, se considera una **regresión de arquitectura** y se bloquea esa incorporación. Se corrige el mecanismo genérico con prueba de diseño ficticio 03 y 1000 antes de continuar; el fallo no se resuelve haciendo una excepción para un diseño.

### Brecha detectada y cierre obligatorio UNA SOLA VEZ, antes de D03

El alojamiento público **Cloudflare Pages** `https://guest-weddlysmartdesign.pages.dev/` ya muestra a la propietaria la portada de preproducción por captura del navegador (11/10/2026). **Eso NO certifica el dominio con un test externo automatizado ni equivale a venta aprobada.** El *build* de Cloudflare sigue siendo `node guest/tools/build_catalog_static_preview.cjs --output "$PWD/dist" --template botanica`, y el script actual construye **solo un candidato pendiente por invocación**. Para añadir D03 sin repetir configuración manual se debe cerrar, probar y congelar **una única publicación multi-plantilla conducida por el catálogo** que incorpore todas las plantillas admisibles sin editar el comando Cloudflare por id. La incorporación de una plantilla nueva debe desencadenar el pipeline común por commit a `guest-independent`, con bloqueo de candidatas no autorizadas para venta. Este punto **NO está aún terminado** y **no debe ocultarse** cuando se diga «solo diseñar».

Además, antes de declarar el mecanismo común listo para multiplicar diseños, debe completarse Botánica como pedido real de prueba en el dominio público, revisión y final del mismo master, medios/RSVP/gestión persistidos, casos alternativos, Android físico y medición del tiempo; verificar `GUEST_CATALOG_PUBLIC_ORIGIN` real desde el servicio y mantener la venta inhabilitada hasta el gate **11/11**. Captura de Pages operativa != valor de variable Supabase configurado; tampoco != `src` comercial habilitado. No inventar verificaciones.

### Prueba de aceptación del contrato «solo diseño»

El primer ejercicio posterior al cierre de Botánica es registrar un **diseño tercero ficticio** con únicamente dos archivos (HTML + `visual-plugin.json`), sin tocar core ni Cloudflare, y verificar mediante CI: registro automático, mismo cuestionario, previsualización, publicación multi-diseño en un mismo `dist`, versión fijada por pedido, prueba de dos parejas sintéticas, aprobación/cambios, URL final, `rt/g/u/lang`, RSVP y denegación comercial de no certificados. Repetir después para id 1000 y cambios de versión. Solo al pasar esta prueba y los gates comunes puede afirmarse que el proceso de siguientes diseños es **diseñar, revisar y lanzar**, no rehacer el producto.

**Fuente única de continuidad:** bitácora íntegra en Biblioteca, **Entrada 37 del 11/10/2026**, y `guest/START_HERE.md` / `guest/GUEST_PROJECT_STATUS_V1.json`. Protecciones: ONE, ONE Partner, STUDIO, VEIL LIGHT, Botánica V14.7, `main` intocables; coste incremental autorizado **0 €**.
