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

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B6.6 — Two-device synchronization + error states

Current branch:
`guest-independent`

B6.5 sealed report:
`guest/B6_5_EXTRA_EVENTS_QA_2026-09-30.md`

Validated commit for B6.5:
`ef1e1f5d714386535cf9e53ae4f4f472107fff2b`

## Exact current failure
B6.6 active.
The scheduler starvation defect is fixed. The previous QA attempted to call `editGuest` as a global, but that function is not exported on `window`. The test now uses the actual People Manager UI (`Ver personas` → Ficha → Guardar`) to make production-faithful guest edits.

Latest QA commit:
`171f93ba3425b35c8372b699cfdd0819de6cc97e`

## NEXT ACTION
Read CI for `171f93ba3425b35c8372b699cfdd0819de6cc97e`. If B6.6 fails, use only the exact logged diagnostics. Continue until regression + B6.1–B6.6 all PASS, then seal B6.6 and close B6.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
