# Weddly Smart Design · Guests v67 — Handoff

## Live QA
- URL: https://weddlysmartdesign.github.io/guests-v060.html?v=67
- GitHub file: `guests-v060.html`
- Commit containing v67: `0ba75eb86876c69f04f0bab2e035345710065cc1`
- Content SHA after v67: `5d3d36ec3a95444d1b0722a4d4dc673342d506ea`

## Product rule
Guests only deserves to exist if it clearly surpasses the original Excel. A separate Excel/Canva/paper must not be required to know who sits where or to manage operational guest consequences.

## Current v67 behavior
- Home separates guest-state counts from actionable issues: Confirmados / Pendientes are not mixed with an ambiguous “Ahora”.
- “Necesita tu atención” contains unresolved operational issues.
- Latest change has “Marcar como leído”. Reading a change does NOT resolve stale outputs or pending issues.
- State persists across refresh in QA via local storage. Refresh must not implicitly validate or clear changes.
- Domino-effect feedback restored: table occupancy, transport, catering, and stale seating outputs react only when actually dependent on the change.
- Guest editor uses explicit selectors for Menu, Table, Transport and RSVP. Tapping Transport or RSVP must never change the value immediately; change only after explicit selection + Save.
- Seating workspace shows actual guest names by table, capacity, occupied/free, unseated guests, direct move, table creation/edit/delete, and overcapacity state.
- “Mover de mesa” top copy states current table. Destination options show only “X de Y plazas”; never repeat confusing “ahora”.
- Pending RSVP counts toward seating occupancy, matching the original Excel logic.
- Seating/list-output baseline must not treat all initial assignments as fictitious changes.
- A seating move updates old/new table counts, guest display everywhere, and marks the sent seating list stale; it must not affect catering unless a catering-dependent field changes.

## Listados in v67
### Mesas
- Own operational block with prepared/sent versions and exact diffs, e.g. `David Martín: Mesa 2 → Mesa 5`.
- Preparing/sending a new seating version is separate from merely reading a change.

### Catering
Two distinct outputs are required:
1. **Imprimir / PDF**: a clean human-readable supplier document, not raw CSV text.
   - grouped by table
   - person name + menu
   - per-table summary
   - total menu summary
2. **Excel**: structured CSV for data work.
   - encoded for mobile Excel/Sheets compatibility (UTF-8 BOM / compatible separator)

Important rule: catering final output uses confirmed attendees only. Pending RSVP may reserve seating capacity provisionally but must not silently become a final catering headcount/menu.

### Transporte
- Transport has been restored as its own Listados block in v67.
- Shows current people/count and has separate **Imprimir / PDF** and **Excel** outputs.
- Transport is a real guest/resource dependency, not decorative metadata.

## User feedback immediately before v67
- Transport had disappeared from Listados: fixed in v67.
- Catering printable document was still effectively CSV text converted to PDF in WPS: v67 changes architecture to a real printable/PDF document plus separate CSV/Excel output.
- User screenshots showed stale seating alert + latest-change consequence card working.

## Critical QA still pending after v67
1. Open `Listados → Catering → Imprimir / PDF` on mobile and confirm it is a genuinely formatted supplier document rather than CSV text.
2. Open `Listados → Transporte → Imprimir / PDF` and validate usefulness/layout.
3. Test Excel downloads in mobile Excel/WPS/Sheets for Spanish accents and separators.
4. Verify state and unresolved issues survive refresh.
5. Verify `Marcar como leído` clears only latest-change history from Home and does not clear unresolved stale outputs.
6. Verify Transport/RSVP edits require explicit choose + Save.
7. Continue adversarial mobile QA before merging this lightweight QA into the full production Guests architecture.

## Stable product architecture decisions to preserve
- Source-agnostic import, no mass re-entry.
- People + units/households + invitations + needs + relationships + operational consequences.
- Never infer social facts.
- Event-specific attendance and seating.
- Resource participation is separate from attendance.
- Dependency-aware staleness: only the right things react.
- Current ≠ prepared ≠ sent.
- Re-import is merge, never silent replace; absence from import ≠ declined.
- Persistent identity must not rely on normalized name alone.
- Unit membership never forces seating.
- +1 placeholder is a real person record and keeps identity/history when named.
- Missing data becomes an issue only when it blocks an output/resource or deadline makes waiting unsafe.
- One stale output = one Home issue, with strongest exact diff.
- External commercial kill test is still pending; do not claim Guests has passed commercial validation.
