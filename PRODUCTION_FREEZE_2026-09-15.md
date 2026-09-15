# PRODUCTION FREEZE — 2026-09-15

Canonical validated runtime/frontend commit: `9ac232c7ab45a13a0d6b7a9f10bcd497237c9236`.

This freeze captures the current production state after the validated Mesas repairs and table-shape editing. Treat this state as the recovery baseline for Weddly Smart Design.

## Frozen scope
- Payments
- Guests core and current production enhancement layers
- Mesas, including multi-select, moving guests to existing or new tables, deleting tables/elements, editing tables, and changing table shape after creation
- Preboda / extra events
- Invitations / RSVP
- Planning / Agenda
- Calendar
- Access / production routing

## Rules from this point
- Do not rebuild or redesign frozen modules unless the user explicitly requests a change or a confirmed production bug requires a minimal fix.
- Preserve `guests-v114-integrated.html` as frozen core.
- Prefer isolated, additive fixes around stable modules.
- Before any future production change, create a backup branch from the then-current production state.
- Do not alter demo/install/access architecture as part of unrelated feature work.
- Signature remains a future independent extension.

The runtime restore point is the commit above. This document is operational documentation only.
