# Guests product log — v92

- Keep existing validated seating-plan work unchanged unless QA finds a regression.
- Guests supports two intake paths: create/send RSVP inside the app, or import an existing list.
- Import is merge-not-replace and must ignore report rows such as TOTAL and Mesa X - RESUMEN.
- Import fields supported in v92: name, phone, email, age, table, RSVP, meal.
- Successful import must show a clear non-blocking confirmation with added and recognized counts.
- RSVP send management tracks contact, send state and response state.
- Manual RSVP entry is required for replies received by phone, in person or through another person.
- Child age is operational data. Seat requirement and meal requirement are separate.
- v92 adds age plus explicit meal-required state. A guest can occupy a seat while requiring no meal.
- Catering menu totals exclude guests explicitly marked as not requiring a meal.
- Current integrated QA URL: guests-v081-integrated.html?v=92
- Current RSVP QA URL: guests-rsvp-v92.html?v=92
- Next session: QA v92 first; do not restart seating-plan design.
