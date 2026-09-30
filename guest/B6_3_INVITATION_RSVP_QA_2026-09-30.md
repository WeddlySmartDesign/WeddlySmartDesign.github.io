# GUEST by WeddlySmartDesign — B6.3 · INVITACIÓN + RSVP
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Alcance validado
- Configuración RSVP: menú, alergias, transporte, alojamiento, niños opt-in, +1 y preguntas personalizadas.
- Flujo Formulario RSVP → Envíos y respuestas.
- Essential 01–06.
- Signature 01–04.
- Guardado de personalización con resiliencia ante fallo posterior de refresco RSVP.
- RSVP público individual.
- RSVP público por unidad/invitación.
- +1 con datos independientes y sin menú inventado.
- Niños con datos independientes.
- Calendario Google + fallback .ics.
- Navegación y rutas confinadas a /guest.
- Ausencia de llamadas activas a endpoints ONE en los recorridos probados.

## Incidencias reales detectadas y corregidas
1. El runtime Blob de Envíos y respuestas resolvía scripts fuera de /guest.
   - Corregido con base absoluta calculada desde la URL GUEST.
2. Cinco helpers activos de Envíos/RSVP seguían llamando a endpoints ONE.
   - Migrados a guest-rsvp / guest-state.
3. El refresco asíncrono de Alojamiento podía sobrescribir una elección recién hecha por el usuario.
   - Corregido con protección de interacción.
4. El wrapper Signature tenía una integración inestable:
   - podía exponer botones antes de tener disponible el runtime de guardado;
   - intentaba escribir un campo playlistLink inexistente;
   - el sistema de borrador heredado era Essential-specific y llamaba a buildLocationFields sobre Signature.
   - Corregido: integración espera runtime real, campo opcional seguro y capa de borrador compatible con Essential/Signature.
5. Se endureció el gate de regresión para registrar únicamente estas divergencias intencionadas.

## QA automatizado
Workflow: `.github/workflows/guest-independent-qa.yml`
Job: `b6-invitation-rsvp`
Test: `guest/qa/b6_3_invitation_rsvp_test.js`

Último resultado verificado en commit `099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7`:
- regression: SUCCESS
- b6-shell-mobile: SUCCESS
- b6-today-guests: SUCCESS
- b6-invitation-rsvp: SUCCESS

## Criterio de cierre
B6.3 = PASS.
No reabrir salvo regresión objetiva.

## SIGUIENTE
B6.4 · Mesas + listados.
