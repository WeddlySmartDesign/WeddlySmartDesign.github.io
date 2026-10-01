# GUEST by WeddlySmartDesign — B8.1 · QA ENTRADA COMERCIAL
Fecha de cierre: 2026-10-01
Rama: `guest-independent`
Estado: PASS / SEALED

## Alcance
Landing comercial → elección Essential/Signature → checkout GUEST.

## Validación
- Essential conserva `edition=essential`.
- Signature conserva `edition=signature`.
- El checkout refleja la edición seleccionada.
- El consentimiento es opt-in y el pago no se abre antes de marcarlo.
- Los enlaces legales y de vuelta son válidos.
- No hay dependencia visible de ONE, ONE Partner o STUDIO.
- No hay overflow horizontal objetivo en móvil ni escritorio.
- El endpoint comercial es `guest-stripe-checkout`.

## QA automático
Test:
`guest/qa/b8_1_commercial_entry_flow_test.js`

Workflow:
`.github/workflows/guest-independent-qa.yml`

Ejecución:
`36824604459`

Resultado:
15/15 jobs PASS, incluyendo `b8-commercial-entry`.

## Conclusión
B8.1 = PASS / SEALED.

## Siguiente bloque
B8.2 — checkout → pago → retorno y preservación del pedido.
