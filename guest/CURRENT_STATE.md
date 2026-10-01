# GUEST by WeddlySmartDesign — CURRENT STATE
Updated: 2026-10-01

## Continuity rule
This file is the FIRST file to read before doing any further GUEST work.
Never resume from chat text alone.
Never restart a closed block.
Never infer the current block from the user's last visible message.
Resume from the exact "NEXT ACTION" below.

## Closed blocks
- B0 extraction independent — CLOSED
- B1 standalone GUEST shell/product — CLOSED
- B2 technical isolation — CLOSED
- B3 commercial base flow — CLOSED
- B4 automatic QA base — CLOSED
- B5 latest-ONE parity audit — PASS / SEALED
- B6.1 shell / install / navigation / settings — PASS / CLOSED
- B6.2 Today + Guests — PASS / CLOSED
- B6.3 Invitation + RSVP + Essential/Signature — PASS / CLOSED
- B6.4 Tables + lists — PASS / CLOSED
- B6.5 Extra events — PASS / CLOSED
- B6.6 Two-device synchronization + error states — PASS / CLOSED
- B6 functional/mobile QA — PASS / SEALED
- B7.1 Mobile hierarchy — PASS / CLOSED
- B7.2 Hoy + Invitados — PASS / CLOSED
- B7.3 Invitación + RSVP — PASS / CLOSED
- B7.4 Mesas + Listados — PASS / CLOSED
- B7.5 Eventos extra — PASS / CLOSED
- B7.6 Coherencia global + escritorio + accesibilidad visual — PASS / CLOSED
- B7.7 QA visual final — PASS / CLOSED
- B7 UX/visual premium — PASS / SEALED
- B8.1 landing → selección → checkout — PASS / CLOSED
- B8.2 checkout → pago → retorno + webhook resiliente — PASS / CLOSED
- B8.3 datos/personalización tras compra — PASS / CLOSED

B7 final sealed report:
`guest/B7_7_FINAL_VISUAL_SEAL_QA_2026-10-01.md`

Validated B7 HEAD:
`4728b6ff8cf78d904c94cfb11927cea4624ffbba`

Validated GitHub Actions run:
`36733355182` — 14/14 jobs `success`

## Current block
B8.4–B8.6 awaiting canonical CI seal; B9.1–B9.2 deployment preparation ACTIVE in parallel

Current branch:
`guest-independent`

## B8 scope
B8 = QA del flujo comercial completo, sin rediseñar el producto funcional ya sellado.

Microbloques:
- B8.1 landing comercial → selección Essential/Signature → entrada a checkout
- B8.2 checkout → pago → retorno y preservación de pedido
- B8.3 recogida de datos/personalización tras compra
- B8.4 activación/entrega y acceso real al producto
- B8.5 estados de error, cancelación, reintento y duplicidad
- B8.6 regresión comercial móvil/escritorio + sellado final de B8

## Exact current failure
B8.3 is PASS / CLOSED. CI run 36826525955 completed successfully after correcting QA-only defects.

B8.4–B8.6:
- canonical delivery path is now ONLY the manager-authenticated `guest-orders-admin.html` → `guest-orders-admin` backend;
- duplicate `guest-deliver.html` surface was removed;
- Stripe checkout backend no longer exposes a duplicate manual delivery action;
- final delivery requires status `ready`, records `delivered`, and uses email idempotency;
- B8.5 adds explicit checkout/verification retry plus Stripe checkout-attempt idempotency;
- LIVE probes: config 200; nonexistent Stripe session 404 `session_not_found`; unauthenticated orders admin 403 `manager_required`;
- B8.6 final seal exists, but B8 is NOT declared sealed until the canonical CI run is green.

B9.1:
- GUEST PWA remains scoped to `/guest/`;
- cache bumped to `guest-shell-v3`;
- offline navigation fallback is restricted to canonical app routes, so broken invitation/access HTML cannot silently open the app shell.

B9.2:
- public release route gate exists and checks purchase → return → order → activation → app routes;
- customer surfaces are forbidden from exposing `guest-orders-admin.html` or discarded `guest-deliver.html`;
- required internal release targets are checked for existence.

## NEXT ACTION
1. Inspect the first completed canonical CI run containing B8.4/B8.5/B8.6 + B9.1/B9.2.
2. If any job fails, fix ONLY that exact failure; do not reopen B6/B7.
3. If B8.4/B8.5/B8.6 are all green, write B8 final seal and mark B8 PASS / SEALED.
4. If B9.1/B9.2 are green, continue B9 release gates from the next untested release risk (live public deployment/release surface), without touching ONE/Partner/STUDIO.
5. Do not declare GUEST release-ready until B8 is sealed and the full B9 release gate is green.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
