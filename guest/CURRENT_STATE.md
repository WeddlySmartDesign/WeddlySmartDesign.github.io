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

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B7.5 — Eventos extra · revisión visual premium y simplificación

Current branch:
`guest-independent`

B7.4 sealed report:
`guest/B7_4_TABLES_LISTS_VISUAL_QA_2026-09-30.md`

Validated functional commit for B7.4:
`36a0d84cc8bcbd3b2ea7bada953bbd540c029b81`

## Exact current failure
B7.5 active.
Second visual QA failure was also a proven settling-time issue: after switching to an inactive event, the product updated the button text to `Activar` first and the visual layer added `guest-event-activate` on the next animation frame. The UI itself settled correctly; the test asserted too early.

No product behavior change was made. QA now waits for the complete settled visual state.

QA fix commit:
`34ba134c2371db68e60e4154bf42c03b66b9876c`

## NEXT ACTION
Read CI for `34ba134c2371db68e60e4154bf42c03b66b9876c`. If B7.5 fails again, use only the exact logged failure. Continue until the full matrix is green, then seal B7.5 and advance to B7.6 global/desktop/accessibility.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
