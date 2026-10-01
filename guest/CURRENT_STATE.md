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

B8.4:
- activation / second-device / invalid-code job is green;
- controlled customer delivery was added after audit found the activation code was generated but never delivered;
- delivery now uses a per-order operator token stored only as SHA-256 hash;
- customer receives activation link + manual code only when WeddlySmartDesign deliberately releases the prepared invitation;
- hardened GUEST Stripe backend is LIVE (v15 at last probe);
- LIVE config remains HTTP 200 with launch prices intact.

B8.5 in progress:
- order submission and delivery are idempotent;
- duplicate clicks are guarded;
- recoverable commercial errors are being classified;
- Stripe retrieval failures are being normalized so missing/temporary failures are not exposed as generic server errors.

## NEXT ACTION
1. Do not wait idly for queued B8 CI. Continue B9 work only where independent from B8 seal.
2. B9.1 ACTIVE: deployment/PWA isolation QA added; service-worker cache bumped to `guest-shell-v2` and critical access/sync/runtime files added to offline core.
3. B9.2 ACTIVE: public release route QA added for landing → edition checkout → return → order → activation → canonical app; public customer surfaces must not expose the internal order manager.
4. When the canonical B8.4/B8.5/B8.6 run completes, inspect exact jobs and seal B8 only if green.
5. Continue B9 with release-surface/deployment audit without modifying sealed B6/B7 functionality or ONE/Partner/STUDIO.
6. Do not declare release-ready until both B8 final seal and B9 release gates pass.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
