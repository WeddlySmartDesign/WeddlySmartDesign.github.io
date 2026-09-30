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
- B7.4 Mesas + Listados — PASS / CLOSED
- B7.5 Eventos extra — PASS / CLOSED
- B7.6 Coherencia global + escritorio + accesibilidad visual — PASS / CLOSED

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B7.7 — QA visual final + sellado de B7

Current branch:
`guest-independent`

B7.6 sealed report:
`guest/B7_6_GLOBAL_DESKTOP_ACCESSIBILITY_QA_2026-09-30.md`

Validated functional commit for B7.6:
`9f6afb06c5f36295fddae1f3a3792f47d5e64737`

## Exact current failure
B7.7 active.
Final cross-surface visual seal test has been added. It checks the validated visual layers are present and performs a final browser sweep across mobile and desktop representative viewports for the main app, Extra Events and public RSVP, including navigation activation, brand consistency, no overflow and absence of ONE/Partner/STUDIO scope.

Test:
`guest/qa/b7_7_final_visual_seal_test.js`

Workflow commit:
`26f3743a57e97be668abc516a7a03e9b772b45b9`

## NEXT ACTION
Read CI on the current HEAD after `26f3743a57e97be668abc516a7a03e9b772b45b9`. If B7.7 fails, use only the exact logged failure and fix only objective regressions or proven test assumptions. Require the full B6/B7 matrix green, then create the B7.7 final report and seal B7 completely.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
