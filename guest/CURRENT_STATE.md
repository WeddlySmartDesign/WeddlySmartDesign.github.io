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

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B7.1 — Mobile hierarchy

Current branch:
`guest-independent`

B6 checkpoint:
`guest/CHECKPOINT_03_B6_SEALED_2026-09-30.md`

B7.1 visual layer:
`guest/guest-visual-premium-v1.js`

## Exact current failure
B7.1 ACTIVE.
First visual QA failure was a false assumption: the active navigation color is intentionally supplied by the currently selected GUEST theme, so it must not be hard-coded to one olive value. The premium layer controls hierarchy/shape/tap targets while preserving theme color.

Latest QA commit:
`0ce5cab63a036a11dab41edc6269e467b98d9c68`

## NEXT ACTION
Read CI for `0ce5cab63a036a11dab41edc6269e467b98d9c68`. Fix only exact B7.1 failures. Preserve all B6 behavior and theme selection. When regression + B6.1–B6.6 + B7.1 are PASS, seal B7.1 and advance to B7.2 Hoy/Invitados.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
