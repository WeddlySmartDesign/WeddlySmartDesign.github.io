# GUEST — Runbook de incorporación de diseños 03–1000

**Entrada obligatoria:** [START_HERE.md](START_HERE.md). El máster canónico, el esquema común, el manual de QA y los registros vivos siguen siendo fuentes obligatorias. Aplicar este proceso a **cada** nueva plantilla visual. No reemplaza las pruebas reales ni la aprobación artística.

## Fase 0 — prerrequisito que NO se puede omitir

- [ ] Infraestructura V2 integrada **en el Mobile Center distribuido y backend de pruebas legítimamente autorizado**, no solo simulada.
- [ ] Cuestionario único reconoce todos los estados permitidos (`preset/custom/none`, foto-only, regalos, datos opcionales) y la Edge Function emite un contrato que pasa su esquema.
- [ ] Prueba regresión VEIL y Botánica real, dos pedidos independientes, URL final y RSVP persistente; evidencia E2E, prueba en Android y tiempo activo medido.
- [ ] Registrar el `PASS` del sistema común y la versión que se ha desplegado. Si alguno está pendiente, **NO empezar a implementar lógica de producto alrededor del diseño nuevo**. Trabajar solo en arte conceptual si ello no oculta el bloqueo.

## Fase 1 — nueva identidad visual (solo diseño)

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
- [ ] Probar flujo de contexto de invitado `rt`, `g` **o** `u`, `lang`; conservar RSVP existente y su almacenamiento. No crear envío paralelo.

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