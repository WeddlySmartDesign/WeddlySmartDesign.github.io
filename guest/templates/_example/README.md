# Único contrato de entrada para cualquier diseño nuevo

Aportar **solo** `master.html` y `visual-plugin.json`. El HTML necesita la función pública
`window.GUEST_APPLY_CONFIG(config)` con el contrato común `guest-invitation-config-v1`.
La ilustración, animación y medios son del diseño; no incluyen nombres, fecha ni textos
variables incrustados. El cuestionario, Mobile Center, pedido, RSVP y entrega son comunes.

Ejecutar el alta automáticamente:

```bash
node guest/tools/register_visual_template.cjs --manifest guest/templates/design-03/visual-plugin.json
node guest/tools/register_visual_template.cjs --manifest guest/templates/design-03/visual-plugin.json --apply
node guest/qa/catalog_admission_gate.cjs
```

El alta siempre permanece **certification-pending**, por seguridad. La etapa de venta
requiere pruebas E2E reales y aprobación independiente. El CLI no despliega, no vende
ni modifica las versiones congeladas.