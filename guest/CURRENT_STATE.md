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
Inherited CI is now fully green after correcting two real races before visual work:
- premium brand hierarchy now self-heals against the legacy UI repaint;
- extra-event controlled-copy buttons are bound immediately as cards render.

B7.4 visual layer added and loaded:
`guest/guest-visual-tables-lists-v1.js`

B7.4 browser QA added:
`guest/qa/b7_4_tables_lists_visual_test.js`

Current scope implemented:
- clearer Mesas intro;
- simplified visual-plan copy;
- grouped table KPIs;
- cleaner table cards and full/over-capacity states;
- explicit unseated block with count;
- Listados intro focused on deliverables/copy control;
- visual classification of main-wedding, RSVP custom, extra-event and copy-history cards;
- mobile touch/overflow rules.

Latest workflow commit:
`c856ee1563c55acfc05c22a2a4975f06cebe0887`

## NEXT ACTION
Read CI for `c856ee1563c55acfc05c22a2a4975f06cebe0887`. If B7.4 fails, use only its exact logged failure. Fix product code for real UX defects and the test only for proven false assumptions. Continue until regression + B6 + B7.1–B7.4 all PASS, then seal B7.4 and advance to B7.5 Eventos extra visual review.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
