# GUEST — Runbook de incorporación de diseños 03–1000

## ATAJO D04+ — MOTOR COMÚN DE SECCIONES

Si el diseño nuevo aporta vídeo de portada, vídeo de cierre y fondos de 4/5 pantallas, **no se integra un HTML propio**: se crea su `skin.json` y se genera con el motor común. Ver [GUEST_SKIN_ENGINE_D04_D08_2026-10-12.md](GUEST_SKIN_ENGINE_D04_D08_2026-10-12.md).

## PUERTA DE ENTRADA UNIVERSAL — LECTURA OBLIGATORIA ANTES DE CUALQUIER DISEÑO

[**Contrato vinculante para TODOS los diseños GUEST (D01–D1000)**](GUEST_UNIVERSAL_DESIGN_ACCEPTANCE_CONTRACT_V1.md). **Antes de diseñar, integrar, retocar, solicitar fotografías o pedir una revisión**, leer contrato universal + `GUEST_INVITATION_MASTER_CONFIGURATION_MATRIX_V1.md` + esquema `GUEST_INVITATION_CONFIG_SCHEMA_V1.json` + fixtures normales/estrés. Es una obligación del producto, **NO una regla del diseño de turno**.

**Bloqueo de salida visual (sin excepciones):** comprobar correspondencia de los campos REALES del cuestionario, incluidos todos los URLs y opciones condicionales, contra `resolved_config`; escenario MAX+FOTOS (foto pareja y celebración/galería, 2 sedes, 5 momentos, 4 prácticos simultáneos); normal/estrés históricos; variantes con campos, fotos, sedes y módulos ausentes; 320/360/390/430, cero invenciones y cero retoques manuales por pareja. El stress histórico tiene galería OFF y **no** sustituye MAX+FOTOS. Documentar evidencia PASS/FAIL/PENDING por diseño **antes** de presentar la web corregida a la propietaria. Test offline ≠ pedido real/RSVP/Android.

**Responsabilidad del operador:** reutilizar fotos ya aportadas, aplicar ajustes a la web REAL y conservar la estética del arte recibido; la propietaria no repite instrucciones, no crea fixtures ni hace QA técnico. Si un nuevo diseño exige lógica especial de cuestionario, backend o RSVP, corregir una vez el motor compartido, no introducir excepciones locales.


**Regla de continuidad Entrada 77:** la propietaria solo proporciona HTML/ZIP con medios y revisa el diseño acabado. Ningún paso técnico siguiente se delega a ella. Cuando haya registro de nuevo `template_id`, el asistente genera la actualización TEST de backend usando `guest/tools/prepare_live_catalog_registry.cjs --input <fuente-live-vigente> --output <candidata-nueva> --require-template <id>` y verifica versión y guardas ANTES de despliegue TEST. La herramienta no despliega ni autoriza cobros; no hay forma de probar la ruta remota real de un nuevo ID en Android antes de recibirlo. [Expediente](GUEST_ENTRY_77_PLATFORM_HANDOFF_FOR_NEXT_VISUAL_2026-10-11.md).

**Entrada obligatoria:** [START_HERE.md](START_HERE.md). El máster canónico, el esquema común, el manual de QA y los registros vivos siguen siendo fuentes obligatorias. Aplicar este proceso a **cada** nueva plantilla visual. No reemplaza las pruebas reales ni la aprobación artística.

**Entrega de un diseño ya existente:** basta con recibir el HTML autocontenido o un ZIP con el HTML y todos los recursos; el responsable técnico crea internamente `visual-plugin.json`, el identificador/versionado y el adaptador común. No pedir a la propietaria crear manifiestos, ejecutar comandos ni configurar Cloudflare/Supabase.

**PROCEDIMIENTO OPERATIVO VERIFICADO EN D03 (Entrada 83, 12/10/2026):** cuando la autora ya entrega un diseño completo, NO hacer nuevas fases creativas, NO reconstruir vídeos/fondos, NO repetir las pruebas locales ya verificadas y NO pedir archivos existentes en Biblioteca. El origen se conserva por SHA256. Registrar una sola vez `master.html` + plugin en `guest-independent`; el comando Cloudflare existente `node guest/tools/build_catalog_static_preview.cjs --output "$PWD/dist" --template botanica` incluye todos los diseños. **Si el máster supera 24 MiB, el builder ahora extrae automáticamente datos `data:image/*;base64` / `data:video/mp4;base64` a `media/`, comprueba el SHA256 de reconstrucción exacta del original y emite sólo archivos menores al límite de Cloudflare.** La autora no extrae ni sube nada. D03: 28.673.474 bytes origen → 1.025.775 bytes HTML + 15 medios originales, HTTP 200, SHA exactos (informe `guest/qa-reports/limoneros_cloudflare_live_check.json`). **Una página que responda 200 con fallback NO basta**: exigir coincidencia de HTML y recursos remotos y `noindex`. El backend actual es **Supabase V19 ACTIVO**, VEIL LIGHT intacto y Botánica y D03 `testOnly:true`; para D04+ generar/validar incremento seguro del catálogo en TEST sin tocar el flujo de ventas. [Evidencia real](GUEST_ENTRY_83_D03_LIMONEROS_LIVE_VERIFIED_BACKEND_TEST_V19_2026-10-12.md).

**Precaución de despliegue backend (actualización Entrada 83):** que el builder de Cloudflare incorpore D04+ no significa que la Edge Function actual acepte dicho `template_id`: live V19 reconoce VEIL/Botánica/D03 en sus modos protegidos. Usar generador común de registro de backend en TEST, verificar y desplegar bajo control autorizado antes de ensayar nuevos pedidos. No habilitar producción ni usar datos de clientes. [Leer Entrada 76](GUEST_ENTRY_76_NEXT_DESIGN_INTAKE_READY_2026-10-11.md).

## Fase 0 — prerrequisito de CERTIFICACIÓN COMERCIAL (no bloquea visual TEST)

**IMPORTANTE:** las verificaciones de Fase 0 bloquean *venta*, no la simple incorporación y previsualización de un nuevo diseño como `certification-pending`. No repetir Botánica ni rediseñar una plantilla aportada para terminar la plataforma; se puede continuar visual TEST antes de E2E Android, siempre sin habilitar venta.

- [ ] Infraestructura V2 integrada **en el Mobile Center distribuido y backend de pruebas legítimamente autorizado**, no solo simulada.
- [ ] Cuestionario único reconoce todos los estados permitidos (`preset/custom/none`, foto-only, regalos, datos opcionales) y la Edge Function emite un contrato que pasa su esquema.
- [ ] Prueba regresión VEIL y Botánica real, dos pedidos independientes, URL final y RSVP persistente; evidencia E2E, prueba en Android y tiempo activo medido.
- [ ] Registrar el `PASS` del sistema común y la versión que se ha desplegado. Si alguno está pendiente, **NO empezar a implementar lógica de producto alrededor del diseño nuevo**. Trabajar solo en arte conceptual si ello no oculta el bloqueo.

## Fase 1 — nueva identidad visual (solo si la autora AÚN no la ha entregado)

**Si el diseño ya está entregado por la autora y aprobado como material de partida, esta fase creativa NO se ejecuta.** Se inspecciona/valida el HTML existente y se integra; la adaptación técnica debe preservar sus medios, gradientes y composición. El resto de puntos sirven únicamente para diseño que todavía no exista.

- [ ] Investigación competitiva premium real; seleccionar referencias y documentar la mejora concreta. Evitar look IA/Canva, arcos, marcos y collage artificial.
- [ ] Definir un universo propio: paleta, tipografía, escala móvil, ritmo/animaciones, integración de fotografía, fondos, apertura y cierre. No clonar D01/D02.
- [ ] Decidir las escenas completas antes de programar: portada, historia/foto, 1/2 lugares, agenda variable, práctico opcional, galería, cierre y CTA RSVP; asignar todos los datos del cuestionario a sus posiciones.
- [ ] Comprobar que los elementos variables no están impresos en vídeos ni imágenes; máster reutilizable y escalable sin generación por pareja.
- [ ] Crear `guest/templates/<id>/master.html` y `visual-plugin.json` a partir de `guest/templates/_example/`, exponiendo **una sola API** `window.GUEST_APPLY_CONFIG(config)`.
- [ ] Validar variantes en local **antes** de pedir revisión artística: móvil 320/360/390/430; nombres largos, 1/2 sedes, Story preset/custom/none, sin Story, agenda corta/larga, práctico on/off, galería 0–4, regalos/horarios, botones, fondo/contraste/cierre, orientación y errores JS.
- [ ] Entregar a propietaria una versión **completa y probada**, no secciones rotas. Incorporar feedback **solo dentro del alcance pedido**, regresionar todo el recorrido y, si aprobado, guardar `FROZEN` con SHA y copia persistente.

## Fase 2 — incorporación automática al catálogo

```bash
# En la rama guest-independent y raíz del repo:
node guest/tools/register_visual_template.cjs --manifest guest/templates/<id>/visual-plugin.json
node guest/tools/register_visual_template.cjs --manifest guest/templates/<id>/visual-plugin.json --apply
node guest/qa/catalog_preflight_v2.cjs
node guest/qa/catalog_admission_gate.cjs
```

- [ ] El primer comando no escribe; el segundo genera copia versionada, adaptador, registro comercial, registro de owner/visor y gates **PENDING**. Verificar `git diff` y no tocar otros diseños.
- [ ] Testar visor V2 y la paridad de preview/review/final con la **misma** versión anclada. Verificar que la identidad no depende de nombres, textos o HTML filenames.

**Preparación de una vista LOCAL sin publicar (común a cualquier plantilla):**

```bash
# Solo después de tener el nuevo asset HTML candidato y su SHA registrado en GUEST_PROJECT_STATUS_V1.json:
node guest/tools/stage_owner_center_v2.cjs \
  --center /ruta/al/centro-candidato-pinneado.html \
  --asset '<id>=/ruta/al/master-candidato.html' \
  --out-dir /ruta/nueva/salida-staging
# Repetir --asset por cada candidato iframe adicional que se vaya a revisar en ese pack.
# --botanica se conserva SOLO como alias CLI histórico; no es un paso específico obligatorio.
```

El script trabaja **exclusivamente offline**: comprueba el SHA del Centro candidato y cada asset contra la evidencia persistida por plantilla, rechaza rutas o versiones inesperadas, no sobrescribe fuentes, y genera un paquete con CSP que bloquea conexiones a servicios y envíos de formularios. No permite realizar pedidos E2E ni sustituye el Centro desplegado. **No copiar ni publicar** esa salida como web comercial. Los assets aún no certificados permanecen `testOnly`.

- [ ] Probar flujo de contexto de invitado `rt`, `g` **o** `u`, `lang`; conservar RSVP existente y su almacenamiento. No crear envío paralelo.

**Regresión Android obligatoria del visor compartido:** nunca insertar un iframe vacío antes de fijar `srcdoc` o su URL, ni consumir el primer `load` con `{once:true}` sin comprobar que contiene el documento esperado. Rechazar `about:blank` inicial, cargar `config` solo tras detectar el adaptador real, rechazar generaciones obsoletas y probar regreso al Centro. Registrar prueba específica, no confiar únicamente en DOM sintético; véase [Entrada 69](GUEST_BOTANICA_ENTRY_69_ANDROID_ADAPTER_V48_FIX_2026-10-11.md).

## Fase 3 — certificación comercial por diseño (sigue siendo obligatoria)

- [ ] Dos pedidos **reales en modo test** con datos muy diferentes, a través del cuestionario compartido, sin ediciones de diseño entre ellos.
- [ ] Imagen real de prueba/subida firmada, revisión/aprobación/final, URL estable y enlace de invitado; paridad antes/después de la entrega.
- [ ] RSVP individual y por unidad, respuesta guardada una sola vez y accesible en GUEST, sin enviar mensajes a clientes.
- [ ] Android real y tiempo activo ≤5 minutos; no relegar estas pruebas a la propietaria hasta que todo lo demás pase.
- [ ] Adjuntar evidencia fechada a `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json` y verificar `node guest/qa/catalog_admission_gate.cjs --admit <id>` **PASS**.
- [ ] Cambio a `commercially-frozen` solo con expediente completo; **venta/publicación/Stripe siguen siendo decisión posterior y explícita**.

## Fase 4 — cierre documental y paso al siguiente diseño

- [ ] Registrar commit, rama, archivos + SHA, resultados, reversiones, pendientes y siguiente paso técnico en `START_HERE.md` y checkpoint específico.
- [ ] Copia congelada + manifiesto + reporte y recursos en Biblioteca y GitHub, con enlaces verificados; no depender de `/mnt/data` o chat.
- [ ] Comprobar CI sin errores nuevos; si el CI común falla, no avanzar aunque el diseño se vea perfecto.
- [ ] Para diseños 07, 08 o 1000, **repetir este mismo runbook** y aportar solo un nuevo arte visual; nunca crear otra rama de motor/pedidos por cada diseño.

### Qué hacer si falla algo

- **Error visual local:** corregir la plantilla, regresionar todas sus escenas y versionar; no editar FROZEN.
- **Error repetido en varias plantillas:** registrar bug del sistema común, resolver una vez y probar regresión de todas las certificadas, nunca duplicar excepciones.
- **Incompatibilidad schema vs backend:** detener incorporación comercial hasta reconciliación/fixture exacto y despliegue autorizado.
- **No se puede desplegar o probar E2E:** status `certification-pending`, registrar bloqueo y no vender; **no fingir** un PASS ni intentar eludir restricciones.
- **La propietaria revisa:** solo propuesta artística acabada o gate Android final; no enviar tareas de soporte técnico.