# PRODUCTION FROZEN — FULL RUNTIME LOCK — 2026-09-16

Weddly Smart Design is frozen end-to-end. "Frozen" no longer means only the functional cores: it means the complete commercial runtime visible or usable by a customer, tester, influencer or owner demo.

## Current status
- Current production runtime candidate after the Payments mobile keyboard/navigation repair: `90e38b5d7e42837b5d89e48691f8128ff0f28f4a`.
- This candidate must not be described as fully validated until the exact Android provider-flow regression is rechecked by the user.
- Archive branch preserving the current full-runtime state: `freeze-full-runtime-2026-09-16`.
- Earlier stable core recovery point remains available in repository history; do not confuse a stable core with a validated complete mobile runtime.
- Full regression history and checks: `PRODUCTION_FREEZE_2026-09-15.md`.

## What is frozen
Everything that can change what a customer sees, taps, edits, saves, installs or receives is production and is frozen, including:
- Payments, Guests, Mesas, Planning / Agenda, Calendar, Preboda / extra events, Invitations / RSVP and Access.
- Module HTML/CSS/JS and all enhancement/hotfix layers.
- `app.html` and every shared suite shell/integration layer.
- Global and internal navigation.
- Iframes, routing, viewport sizing, scrolling, keyboard behaviour and safe-area handling.
- Demo shells, owner demos, tester demos and commercial demo behaviour.
- Install/PWA logic, manifests, service workers, cache/version behaviour and launch routing.
- Shared settings and any code capable of changing visible/tappable mobile UI.

A change outside a module core can break the product just as seriously as a core change. There is no longer a "safe integration layer" that may be changed directly in production.

## Mandatory production-change process
Production is immutable by default.

1. A change starts only for a confirmed production defect or an explicitly requested new feature/change.
2. Before coding, preserve the current production state with a backup/freeze branch.
3. Implement the change on an isolated working branch or test copy, not directly on `main`.
4. Keep the patch minimal and limited to the reported issue. Do not combine unrelated cleanup, visual improvements or architecture work.
5. Test the affected flow plus neighbouring high-risk flows. Any viewport/navigation/PWA/shared-shell change requires cross-module testing of Payments, Guests and Planning.
6. For mobile UI changes, test the real interaction states, not only page load: scrolling, text keyboard, numeric keyboard, modals/sheets, fixed navigation, bottom buttons and system bars.
7. The change does not become the new frozen production baseline until the user explicitly confirms the relevant real-device flow works.
8. Only after that confirmation may the validated change be treated as production and the freeze marker/archive be advanced.
9. If validation fails, revert or repair on the isolated branch; do not stack speculative fixes directly on production.
10. Never use a live commercial demo as an experimentation environment.

## Release-blocking rule
If a customer, tester or influencer can see a broken layout, hidden action, clipped content, displaced navigation, missing control, failed save or inaccessible flow, production is considered broken even if the data engine/core still works.

## Permanent restrictions
- No generic CSS/JS geometry patch across child modules without verifying each module's own layout rules.
- No generic viewport fix that treats keyboard shrinkage as system-bar space.
- No direct production hotfix merely because a change looks small.
- No unrelated changes while fixing a production defect.
- No declaration of "fixed" based only on code inspection or successful loading when the bug is visual/interactive.
- Preserve `guests-v114-integrated.html` as frozen Guests core unless the user explicitly requests a core change.
- Signature remains a future independent extension.

This file is the primary operational rule for future work on Weddly Smart Design. If another instruction conflicts with this lock, prefer this full-runtime freeze unless the user explicitly overrides it for a specific change.
