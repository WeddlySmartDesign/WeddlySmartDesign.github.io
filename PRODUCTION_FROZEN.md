# PRODUCTION FROZEN — 2026-09-15

Weddly Smart Design is frozen again after the validated Mesas fixes.

## Canonical restore point
- Runtime/frontend commit: `9ac232c7ab45a13a0d6b7a9f10bcd497237c9236`
- Archive branch: `freeze-production-2026-09-15`
- Full freeze manifest: `PRODUCTION_FREEZE_2026-09-15.md`

## Frozen scope
- Payments
- Guests core and current production enhancement layers
- Mesas, including multi-select, moving guests to existing or new tables, deleting tables/elements, editing tables, and changing table shape after creation
- Preboda / extra events
- Invitations / RSVP
- Planning / Agenda
- Calendar
- Access / production routing

## Rules
- Do not rebuild or redesign frozen modules unless the user explicitly requests a change or a confirmed production bug requires a minimal fix.
- Preserve `guests-v114-integrated.html` as frozen core.
- New functionality must be layered around stable modules.
- Before any production change, preserve the current frozen behaviour with a backup branch and compare against this restore point.
- Do not modify demo/install/access architecture as part of unrelated work.
- Signature remains a future independent extension.

This marker is documentation only and does not alter runtime behaviour.
