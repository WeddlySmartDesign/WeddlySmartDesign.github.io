# Weddly Smart Design — Guests v67 acceptance checkpoint

Status: ACCEPTED by mobile QA on 2026-09-04.

Do not delete or overwrite the v67 checkpoint without an explicit migration decision. Future Guests work must preserve v67 behaviour unless a later tested version intentionally supersedes it.

## Accepted build
- Live QA path: `guests-v060.html`
- Accepted public QA URL pattern: `https://weddlysmartdesign.github.io/guests-v060.html?v=67`
- v67 app commit before acceptance: `0ba75eb86876c69f04f0bab2e035345710065cc1`

## Explicitly tested and accepted in mobile QA
- Transport printable/PDF output.
- Catering printable/PDF output.
- Catering grouped by table with guest name + menu, per-table summary and total summary.
- Transport list shows people using transport and RSVP status.
- Listados includes Mesas, Catering and Transporte.
- Home separates guest counts from attention items.
- Last change shows downstream consequences.
- 'Mark as read' hides the recent-change block without resolving pending operational issues.
- RSVP and Transport edits use an explicit choice/save flow instead of changing on tap.
- Table moves show exact before/after impact and stale seating output.
- Seating workspace keeps names inside each table, capacity, occupied/free state, direct moves and unseated guests.
- Table capacity can be configured.
- State survives refresh in the QA persistence layer.
- CSV/Excel export remains separate from the human-readable printable/PDF output.

## Product rules preserved from v67
- Reading a change is not the same as resolving its consequences.
- Automatically recalculated effects can be marked updated, while stale sent outputs remain actionable until regenerated/sent.
- Only dependencies actually affected by a change should react.
- Confirmed + pending guests can count for seating occupancy, while catering final output should not silently treat pending RSVP as confirmed attendance.
- Mesas must replace the need for a parallel Excel/Canva seating record.
- Do not remove Transport from operational consequences or Listados.
- Do not regress printable/PDF documents back into raw CSV-as-print output.

## Resume point
When development resumes, start from v67 as the accepted checkpoint. Do not reconstruct from memory or from an earlier Guests prototype. First preserve this behaviour, then layer future changes on top and re-run mobile QA.
