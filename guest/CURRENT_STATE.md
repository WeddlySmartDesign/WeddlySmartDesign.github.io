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

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B6.5 — Extra events

Current branch:
`guest-independent`

B6.4 sealed report:
`guest/B6_4_TABLES_LISTS_QA_2026-09-30.md`

Validated functional commit for B6.4:
`4ac9267362b5a1389b78fd6e80cb724e9c822c26`

## Exact current failure
B6.5 active.
Current product fixes already applied:
- group selection uses `guest-event-state`;
- one-photo invitation interception watches `guest-event-invite`.

The 'Other event inactive by default' failure was a QA timing bug: the assertion ran before the second event had finished persisting. Diagnostic proved only the original Preboda existed at assertion time. Test now waits for two event tabs before checking the new event state.

Latest QA commit:
`7b0e1a134935b45a6528ad67fdb2a434bcf628b7`

## NEXT ACTION
Read CI for `7b0e1a134935b45a6528ad67fdb2a434bcf628b7`. If B6.5 fails, use only the exact logged failure. Continue until regression + B6.1–B6.5 all PASS, then create the sealed B6.5 report and advance CURRENT_STATE to B6.6.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
