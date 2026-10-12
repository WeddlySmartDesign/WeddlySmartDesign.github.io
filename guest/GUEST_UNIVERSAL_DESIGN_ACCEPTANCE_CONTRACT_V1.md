# GUEST — Norma universal obligatoria de diseño y certificación

**Vigencia:** 12/10/2026. **Ámbito:** TODAS las plantillas presentes y futuras (D01, D02, D03, D04... D1000). **No es una instrucción particular de Limoneros.**

**Esta norma no sustituye el esquema ni los contratos originales.** Concentra en una sola puerta de entrada las reglas ya vigentes:
- `guest/GUEST_INVITATION_MASTER_CONFIGURATION_MATRIX_V1.md` (configuraciones y degradación elegante).
- `guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json` (rutas y tipos del contrato real).
- `guest/GUEST_CATALOG_CERTIFICATION_SCENARIOS_V1.md` y las fixtures `GUEST_CATALOG_CERT_SCENARIO_NORMAL_V1.json` / `GUEST_CATALOG_CERT_SCENARIO_STRESS_V1.json`.
- `guest/GUEST_CATALOG_PIPELINE_CONTRACT_V1.md`, `guest/GUEST_NEW_DESIGN_ONLY_VISUAL_CONTRACT_2026-10-10.md` y `guest/DESIGN_NEW_RUNBOOK.md` (integración y responsabilidades).

## Antes de empezar CUALQUIER diseño (bloqueo de proceso)

1. Leer `START_HERE.md`, `GUEST_PROJECT_STATUS_V1.json`, este documento, `DESIGN_NEW_RUNBOOK.md`, **el esquema vigente** y la matriz canónica. Comprobar las decisiones y pruebas ya registradas. **No empezar a diseñar o editar desde la memoria del chat.**
2. Inspeccionar el cuestionario REAL y el backend que produce `resolved_config`; comprobar que sus nombres y modos coinciden con el esquema. Si discrepan, detener la certificación y corregir el contrato compartido **una sola vez**, nunca inventar campos ni soluciones por diseño.
3. Verificar si los materiales/fotos ya existen en el proyecto o Biblioteca. **No pedir otra vez material entregado ni trasladar tareas técnicas a la propietaria.**
4. Trabajar siempre con el diseño original de la autora y `window.GUEST_APPLY_CONFIG(config)`. Cualquier ajuste estético pedido (p. ej. tamaño de dos rótulos) debe aplicarse **al diseño ejecutable**, no confundirse con una imagen ilustrativa. No tocar ni reescribir fuentes congeladas.

## Norma de contenido: plantilla derivada del cuestionario, no invitación hecha a mano

**Todos los campos soportados por el esquema y efectivamente ofrecidos por el cuestionario deben tener una salida determinista, visible o funcional.** Para cada campo de contenido: si está habilitado y existe, renderizarlo con el texto/URL del `resolved_config`; si está ausente/desactivado, ocultarlo sin rellenos ni huecos. Para cada campo de configuración (p. ej. recogida de respuestas del bus/alojamiento en RSVP), aplicar el comportamiento del motor común en vez de inventar un formulario local.

Ejemplo obligatorio **para TODAS** las plantillas: `practical.accommodation.websiteUrl` informado → enlace «Ver hotel» funcional. Otros campos del alojamiento: nombre, dirección, mapa, teléfono, código/nombre de reserva, descuento, plazo, precio, notas, enlace externo de reserva según `mode`. Transportes: paradas, salidas, regresos, nota y mapa. Regalos: texto/datos/enlace y revelado intencional de datos sensibles. Música: texto/enlace. Lugares: mapa y web **de cada sede**, no uno compartido por error. El CTA de RSVP debe dirigir al motor existente.

**Prohibido inventar** web, código, fecha, lugar, historia, frase personalizada, enlace, hora, nombre o dato para rellenar espacios; no mostrar botones para URL inexistentes. Las frases fijas propias del arte aprobadas y explícitamente definidas por la plantilla no equivalen a datos variables inventados. Verificar cada ruta del esquema como `campo → activación/modo → salida o efecto → presente → ausente`. No basta con que el nombre de la propiedad figure en JavaScript.

## Matriz universal: máxima densidad y degradación elegante

Cada diseño, sin excepción, debe pasar **ANTES** de la aprobación visual:
- **Escenario completo MAX+FOTOS:** historia con foto; dos lugares (ceremonia y celebración) con enlaces independientes; cinco momentos; **los cuatro módulos prácticos simultáneos** (bus, alojamiento, regalos y música) con todos sus campos opcionales aplicables; fotos de pareja y celebración / galería 1–4 según contrato; nombres y textos largos, enlaces válidos y CTA RSVP. Usar fotografías reales autorizadas o fixtures ya disponibles; no confundir fondos artísticos con fotos personalizadas.
- **Normal canónico:** `GUEST_CATALOG_CERT_SCENARIO_NORMAL_V1.json`, sin cambiar la plantilla para que encaje.
- **Estrés canónico:** `GUEST_CATALOG_CERT_SCENARIO_STRESS_V1.json`, sin cambiarlo. **Su `gallery.enabled=false` NO cubre la prueba de fotografías**; por ello MAX+FOTOS es una prueba adicional obligatoria y no una sustitución de las fixtures existentes.
- **Ausencias:** 1 sede; historia OFF / solo texto / solo foto donde se soporte; sin fotos, fotos de distintas orientaciones y encuadres; agenda OFF y 1–4 momentos; práctico 0, 1, 2, 3 módulos y cada bloque individualmente; galería 0–3 fotos; countdown OFF; campos opcionales (web, mapa, teléfono, reserva, etc.) vacíos. Cuando falte algo, composición deliberadamente cerrada, sin huecos, rótulos huérfanos, enlaces muertos ni desplazamiento lateral.
- **Móvil:** 320, 360, 390, 430 px; textos largos y tipografía pequeña legible; contraste real sobre vídeos, bordes/safe-area Android, controles pulsables, un solo CTA RSVP, apertura/cierre y fotos en modos full/crop sin recortes indeseados.
- **Flujo real:** dos pedidos TEST distintos por el cuestionario común autenticado; preview/review/final con la misma `resolved_config` y versión; RSVP con contexto `rt/g/u/lang`; guardas de venta y aprobación real Android. El test sintético/offline **NO** prueba este último tramo.

Cada configuración debe funcionar **sin editar HTML/CSS, ritmos, fotografías o textos manualmente por pareja**. Si alguna exige edición, la plantilla falla y se corrige el motor/contrato reutilizable o el arte de plantilla, nunca se impone esa carga a la propietaria.

## Responsabilidades y evidencias

**La propietaria** aporta los materiales creativos solo cuando no existan, revisa desde su móvil y aprueba su diseño. No tiene que recordar pruebas, producir fixtures, hacer backend, configurar Cloudflare/Supabase, repetir decisiones ni comprobar la integración.

**El asistente** consulta los documentos, verifica cobertura del cuestionario campo por campo, ensaya MAX+FOTOS y ausencias, integra, ejecuta CI/Cloudflare, guarda resultados auditables y presenta **la página ejecutable corregida** para la revisión por pantallas. Documentar cada prueba con su condición PASS/FAIL/PENDING, enlace y SHA; no declarar PASS por haber escrito instrucciones ni inferir E2E desde tests simulados.

**Condición de salida:** ninguna nueva plantilla se considera visualmente terminada, comercialmente certificada ni `commercially-frozen` sin matriz completa y evidencias; toda candidata no aprobada permanece `certification-pending`, TEST-only y NO-SALE. No activar Stripe ni modificar ONE/Partner/STUDIO/VEIL/Botánica congelados.

**Error de procedimiento registrado el 12/10/2026:** se solicitó repetidamente a la propietaria que recordara las variantes 2 sedes/5 momentos/4 prácticos/fotos y se trató la correspondencia con el cuestionario como una regla particular del D03. Ambas actuaciones contradicen el contrato canónico previo. En adelante se debe leer este documento ANTES de cualquier nuevo diseño; no pedir esas instrucciones ni fotografías ya entregadas otra vez.
