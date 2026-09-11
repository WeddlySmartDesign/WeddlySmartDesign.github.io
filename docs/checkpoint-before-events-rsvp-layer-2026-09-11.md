# Checkpoint antes de Event Layer + RSVP post-submit

Fecha: 2026-09-11

Objetivo: añadir capacidades alrededor de Guests/Planning/Payments sin modificar el core congelado de Guests.

## Referencias estables
- Guests production wrapper: `guests-v116-production.html` — blob `64fdadacbfa2db55dbd8ff5c26d35ac5aed28175`
- Guests frozen core: `guests-v114-integrated.html` — no modificar.
- RSVP actual por unidad: `guests-rsvp-v106-mobile.html` — blob `04a570e2e9ec7b157cdd6888f9a945a555ff8e36`
- Invitación Essential loader: `guests-rsvp-essential-live.html` — blob `ad45fcf656dc17d4e7777440da2f28905b2e802a`
- RSVP Edge Function previa: `weddly-rsvp` v9.
- Planning state Edge Function: `weddly-planning-state` v1.

## Regla de implementación
1. No tocar `guests-v114-integrated.html`.
2. El RSVP v106 queda intacto como rollback.
3. Las mejoras públicas se publican en una nueva versión RSVP.
4. Eventos adicionales (Preboda/Postboda) usan estado servidor separado del core Guests/Payments/Planning.
5. Si no hay evento adicional activado, la experiencia debe ser idéntica a la actual.
6. Cualquier campo nuevo en estados existentes debe ser aditivo y opcional; ningún lector antiguo debe depender de él.
