# Guests product log — v97

- Visual guest organization replaces the v96 bulk-first forms as the primary UX.
- The main organization surface is now a `Mapa de invitados`: Group -> Unit -> People, with unstructured people visible in `Sin organizar`.
- Group means classification/origin (e.g. Familia novia, Amigos). Unit means a practical invitation/management household or cluster (e.g. Familia Rodríguez).
- Units do not imply seating together. Seating remains independent and the validated seating-plan work stays untouched.
- Avoid isolated relationship labels such as `Pareja` or `Acompañante / +1` because they are ambiguous without a linked person. v97 stops asking for those roles in the main unit workflow.
- Existing old `relation_role` values are not surfaced in the v97 map and new v97 saves clear them rather than perpetuating ambiguous metadata.
- Visual map is both overview and editor: tap a group, unit, or person to reorganize it. Creation of a group/unit flows immediately into multi-select membership and returns directly to the map after save.
- Navigation language: use `Volver` / `Hecho` for exiting completed flows. Reserve `Cancelar` for abandoning unsaved changes.
- `Sin organizar` is a deliberate visible workspace, analogous to `Sin mesa` in seating.
- Current QA target: `guests-v097-integrated.html?v=97`.
