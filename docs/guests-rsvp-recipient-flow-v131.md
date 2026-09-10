# Guests RSVP recipient flow v131

User-validated product logic to implement:

1. Guest creation remains about organization only: group, subgroup, people, and optional provisional seating. Do not ask how invitations will be divided during creation.
2. Envíos y respuestas mirrors that exact hierarchy: group → subgroup → people.
3. Each person has a clear checkbox to mark whether that person receives an invitation.
4. Only marked recipients expand contact and delivery controls. Contact selection must look like an actionable button.
5. Non-recipient people remain visible once, never duplicated. They can be attached to one selected recipient so named couples/households can share one RSVP link without losing person-level records.
6. Filtering by group must make it easy for each partner to work through their own side from their own phone/address book.
7. Group/subgroup membership and provisional seating remain independent from invitation distribution. The RSVP layer must not rewrite the organizational hierarchy.
8. Person-level RSVP, catering, transport and seating behavior remains unchanged.

Example: Familia de la novia → Primos de Murcia → 6 people. Mark three people as recipients and attach one partner to each recipient. Result: exactly 3 invitations while the six people remain one subgroup and may remain provisionally seated together.