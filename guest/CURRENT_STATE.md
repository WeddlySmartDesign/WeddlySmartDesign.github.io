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

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B7.2 — Hoy + Invitados

Current branch:
`guest-independent`

B7.1 sealed report:
`guest/B7_1_MOBILE_HIERARCHY_QA_2026-09-30.md`

B7.2 visual layer:
`guest/guest-visual-hoy-invitados-v1.js`

## Exact current failure
B7.2 ACTIVE. Hoy + Invitados visual hierarchy and dedicated browser QA are now in place. No failure identified yet.

Latest workflow commit:
`cea56c7364e3bcc13bd3a622189b64d3a2aaf192`

## NEXT ACTION
Read CI for `cea56c7364e3bcc13bd3a622189b64d3a2aaf192`. Fix only exact B7.2 failures. Preserve B6 functionality and B7.1 global hierarchy. When regression + B6.1–B6.6 + B7.1 + B7.2 are PASS, seal B7.2 and advance to B7.3 Invitación/RSVP.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
