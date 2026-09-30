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

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B7.3 — Invitación + RSVP

Current branch:
`guest-independent`

B7.2 sealed report:
`guest/B7_2_HOY_INVITADOS_QA_2026-09-30.md`

Validated commit for B7.2:
`6e551b901b4deb7820018268dbccea872efd9ba4`

## Exact current failure
B7.3 visual QA is PASS. A clean rerun reproduced a REAL two-device race in the closed B6.6 sync layer: immediately after applying a remote update, `G.remote` caused the 300 ms watcher to copy the current localStorage into `G.last` and return. If the user made a local edit in that short window, that edit could be mistaken for the remote baseline and never be pushed.

Minimal product fix in `guest/guests-production-sync.js`: when clearing `G.remote`, suppress only if the current raw state still equals the known remote `G.last`. If localStorage changed meanwhile, mark it dirty and queue it normally.

Fix commit: `fbe380b7055fbed8f4b10c46c5812f9964fb21e2`

The earlier B6.3 children assertion passed on the clean rerun, confirming that result was not a persistent product regression.

## NEXT ACTION
Run the complete QA on the sync-race fix. If all regression, B6.1–B6.6 and B7.1–B7.3 jobs pass, reseal B6.6 with this additional race fix noted, seal B7.3, and advance to B7.4 Mesas/Listados. If any job fails, use only its exact log.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
