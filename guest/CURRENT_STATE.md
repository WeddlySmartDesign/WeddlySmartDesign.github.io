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

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B6.4 — Tables + lists

Current branch:
guest-independent

Current HEAD when this checkpoint was written:
dd1795eb290601b92e10826ce29226f0da7b6921

Current CI status at that HEAD:
- regression: PASS
- b6-shell-mobile: PASS
- b6-today-guests: PASS
- b6-invitation-rsvp: PASS
- b6-tables-lists: FAIL

## Exact current failure
Catering TOTAL issue fixed in product code.

Current remaining issue observed in CI: print/PDF tables assertion fired before the controlled-copy popup had finished rendering.

QA fix commit:
`fa61595e96d79f47da7e243829e4d751e7fd6235`

Current status: CI validation pending.

## NEXT ACTION
1. Read CI for commit `fa61595e96d79f47da7e243829e4d751e7fd6235`.
2. If b6-tables-lists fails, use its exact logged failure only; do not restart B6.4.
3. If regression + B6.1 + B6.2 + B6.3 + B6.4 all PASS, create `guest/B6_4_TABLES_LISTS_QA_2026-09-30.md`, seal B6.4 and update this file to B6.5 Events extra.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
