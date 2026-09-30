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
- B7.5 Eventos extra — PASS / CLOSED

B6.3 sealed report:
guest/B6_3_INVITATION_RSVP_QA_2026-09-30.md
Validated commit:
099ddf75524c9e2eed3e8e9298262f8ed4fcd3e7

## Current block
B7.6 — Coherencia global + escritorio + accesibilidad visual

Current branch:
`guest-independent`

B7.5 sealed report:
`guest/B7_5_EXTRA_EVENTS_VISUAL_QA_2026-09-30.md`

Validated functional commit for B7.5:
`3c9da498fb9b6409859a755970ea747b1a3fe74d`

## Exact current failure
B7.6 active.
The focus-visible CSS is present. The repeated RSVP Operations failure was isolated to the QA choosing the first focusable control in the document; trusted Shift+Tab leaves the document and headless Chromium does not deterministically return to that first control.

No product UI change was made. The accessibility test now checks the stable second top action (`← Invitados`), preserving the same keyboard-driven `:focus-visible` requirement.

QA fix commit:
`e1d7bf7b391c997c501571641204d6cf46f9bb51`

## NEXT ACTION
Read CI on the current HEAD after `e1d7bf7b391c997c501571641204d6cf46f9bb51`. If B7.6 fails again, use only the exact logged failure. Continue until the full matrix is green, then seal B7.6 and advance to B7.7 final visual QA.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
