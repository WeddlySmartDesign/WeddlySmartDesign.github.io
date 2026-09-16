# PRODUCTION FREEZE — FULL COMMERCIAL RUNTIME — 2026-09-16

Authoritative operational lock: `PRODUCTION_FROZEN.md`.
Archive branch preserving the current full-runtime state: `freeze-full-runtime-2026-09-16`.
Current runtime candidate after the Payments Android keyboard/navigation repair: `90e38b5d7e42837b5d89e48691f8128ff0f28f4a`.

IMPORTANT: this runtime candidate is not to be called fully validated until the user rechecks the exact real-device Payments provider flow. The earlier notion that a stable module core could be considered "frozen" while shared shell/demo/viewport layers kept changing is retired.

## Frozen scope
The freeze is end-to-end and includes every layer capable of affecting what a buyer, tester, influencer or owner sees or can do:
- Payments
- Guests core and enhancement layers
- Mesas
- Preboda / extra events
- Invitations / RSVP
- Planning / Agenda
- Calendar
- Access and routing
- `app.html` and shared suite/integration scripts
- module and global navigation
- iframe sizing and routing
- viewport, scrolling, keyboard and safe-area behaviour
- demo and owner-demo shells
- install/PWA behaviour, manifests, service workers and cache/version routing
- all CSS/JS hotfix or visual-coherence layers that can affect production UI

## Non-negotiable release process
- Production is immutable by default.
- Start work only for a confirmed defect or a change explicitly requested by the user.
- Create a backup/freeze branch before implementation.
- Implement on an isolated working branch/test copy, never as live experimentation on `main`.
- One defect/change per patch. No opportunistic cleanup or unrelated design changes.
- Validate the affected flow and neighbouring modules before advancing production.
- Shared shell, viewport, navigation, PWA or iframe changes require Payments + Guests + Planning smoke testing.
- Mobile UI fixes require testing real interaction states: text keyboard, numeric keyboard, scroll, modals/sheets, fixed menus, bottom actions and Android/iPhone system bars when relevant.
- A visual/interactive bug is not fixed merely because the code loads or data remains intact.
- The user must explicitly confirm the relevant real-device flow before the changed runtime becomes the new frozen baseline.
- If the check fails, continue on the isolated branch or revert. Do not stack speculative live hotfixes.

## Sales-critical regression history
On 2026-09-16 two regressions demonstrated why the entire commercial runtime must be frozen, not only module cores.

First, a global Android viewport/navigation patch forced horizontal positioning (`left:0` / `right:0`) onto internal module navigation. Planning already had its own centering transform, so the rules conflicted and moved part of the navigation off-screen. Payments showed the same class of problem.

Second, the same family of generic viewport logic treated the reduced `visualViewport.height` produced by the Android software keyboard as system-bar space. It moved Payments navigation into the middle of the provider form, reduced usable form height during editing, clipped content and allowed navigation to cover the final black action button through an excessive `z-index`.

## Permanent technical guardrails
- Never globally override the horizontal geometry of internal module navigation unless every affected module's own `left`, `right`, `width`, `max-width` and `transform` rules have been checked.
- Do not assume Payments, Guests and Planning share navigation CSS or stacking behaviour.
- Never derive Android system-bar spacing directly from `layout viewport - visualViewport` without distinguishing an open software keyboard.
- Never force suite/document height to `visualViewport.height` while an input, textarea or select is being edited.
- Internal bottom navigation must not jump above the software keyboard. It may be hidden temporarily while editing if that is safer, then restored afterward.
- Never assign ordinary navigation a global/maximal `z-index` that can cover sheets, dialogs, forms or action buttons.
- Do not derive body padding from keyboard height.
- Never alter demo/install/access/PWA architecture as part of unrelated feature work.
- Never deploy a generic mobile geometry fix across every child iframe without checking all affected modules.

## Mandatory mobile smoke test for shared-shell/viewport/navigation/PWA changes
1. Open the full ES demo on Android in portrait.
2. Payments: confirm Resumen / Proveedores / Gastos are fully visible and tappable.
3. Payments: open `+ Proveedor`, focus a text field and verify the keyboard does not move navigation into the form or collapse the form area.
4. Payments: repeat with a numeric field such as quantity or unit price.
5. Payments: close keyboard, scroll to the bottom and verify the final black action/save button is completely visible and tappable.
6. Payments: confirm internal navigation returns to the correct bottom position after keyboard dismissal.
7. Guests: confirm all main navigation is visible and usable.
8. Planning: confirm Ahora / Agenda / Timeline / Progreso are all visible and tappable.
9. Confirm global Pagos / Invitados / Planning / Ajustes navigation remains visible and usable.
10. Scroll all modules and verify internal navigation does not cover content or the Android system bar.
11. If install/PWA/viewport behaviour is involved, repeat the relevant flow on iPhone.

## Definition of broken production
If a customer, tester or influencer can see clipped content, hidden controls, displaced navigation, an inaccessible button, failed save, broken install or a flow that cannot be completed, production is broken even if the underlying data/core is intact.

This document and `PRODUCTION_FROZEN.md` are mandatory operating constraints for future work on Weddly Smart Design unless the user explicitly overrides them for a specific change.
