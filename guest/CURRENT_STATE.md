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
B7.4 active.
The first B7.4 CI run exposed a real visual-layer performance defect: the new Mesas/Listados patch rewrote identical text on every pass. Because its MutationObserver watched child-list changes, the layer could trigger itself repeatedly and delay unrelated async rendering (Hoy, event lists, table/list QA and even mobile visual settling).

Product fix:
- B7.4 patch is now idempotent;
- text is only rewritten when it actually changes;
- observer callbacks are RAF-coalesced to one pending patch.

Fix commit:
`bcbbad4d5c6f501fee708b55e99a862e64a54ca2`

Current status: CI validation pending.

## NEXT ACTION
Read CI for `bcbbad4d5c6f501fee708b55e99a862e64a54ca2`. If inherited B6/B7 jobs return green and B7.4 alone fails, use only the exact B7.4 failure. If any inherited job still fails, first determine whether it is a real regression or a proven test timing issue. Do not seal B7.4 until the full matrix is green.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
