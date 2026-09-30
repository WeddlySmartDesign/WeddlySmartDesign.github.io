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
- one-photo save interception watches `guest-event-invite`.

Current failing assertion: `Other event must be inactive by default`.
Source code appears to pass `enabled=false` for generic events, so the test has been instrumented to print the actual persisted event state before changing product behavior.

Diagnostic commit:
`7c9543bff6d39d28d2aa897635948423ae703ea2`

## NEXT ACTION
Read CI for `7c9543bff6d39d28d2aa897635948423ae703ea2`. Use the persisted-state diagnostic from the exact B6.5 failure to decide whether this is a product defect or a test-selection error. Change only the responsible code/test, then continue until regression + B6.1–B6.5 all PASS. Seal B6.5 and advance CURRENT_STATE to B6.6.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
