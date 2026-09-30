# GUEST by WeddlySmartDesign — CURRENT STATE
Updated: 2026-09-30

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

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B7.4 — Mesas + Listados

Current branch:
`guest-independent`

B7.3 sealed report:
`guest/B7_3_INVITATION_RSVP_VISUAL_QA_2026-09-30.md`

Validated commit for B7.3:
`bef69a9318c9f4af2a5a85880f4e7a5d1603bab2`

## Exact current failure
B7.4 preflight active.
Two residual red checks from the B7.3 closing commit were inspected before touching Mesas/Listados.

Real issues found and corrected:
1. Premium brand race: `guests-production-ui.js` repainted the brand every 500 ms, while `guest-visual-premium-v1.js` only enforced the B + SPAN premium hierarchy once. The legacy repaint could therefore win later and make B7.1 intermittently fail. Premium branding now self-heals on every visual apply without unnecessary DOM churn.
2. Extra-event controlled-copy readiness: event cards could appear before the copy-control document hook/status was guaranteed to be attached, leaving a short window where CSV click could do nothing. The controlled-copy layer now exposes `patch()`, installs earlier, and event-list rendering immediately asks it to bind the new cards.

Fix commits:
`b2f316327f1580492cabf8ed0ad57e517c0488ed`
`ff6008ab40c432aeb30102595e873fc9717ba1e2`
`8bd9276de0597fcda20e9ffcc8030e98853ccc2d`

Current status: CI validation pending.

## NEXT ACTION
Read CI on the current B7.4-preflight HEAD. If all inherited B6/B7.1–B7.3 jobs are green, begin B7.4 Mesas + Listados visual work. If one of the two residual jobs is still red, use only its exact logged failure; do not reopen closed blocks conceptually.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
