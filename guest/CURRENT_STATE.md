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
Current failure: source device A local edit was not observed at backend within the initial QA window. The test has been corrected to foreground the source device (matching real active editing) and now records local state, sync metadata, notice, remote state, version and PUT history if propagation still fails.

Latest QA commit:
`35b08b2782f99b4f8563c74311b838a29e6aef0e`

## NEXT ACTION
Read CI for `35b08b2782f99b4f8563c74311b838a29e6aef0e`. If B6.6 still fails, use the new exact sync diagnostic to determine whether the defect is product or QA. Continue until regression + B6.1–B6.6 all PASS, then seal B6.6 and close B6.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
