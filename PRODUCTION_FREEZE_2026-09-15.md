# PRODUCTION FREEZE — 2026-09-16

Canonical validated runtime/frontend commit: `7622529b76f8222fe74c98b7323aa4aed5bbed2d`.

This freeze captures the current production state after the validated Mesas repairs and the mobile demo navigation repair confirmed on Android on 2026-09-16. Treat this state as the recovery baseline for Weddly Smart Design.

## Frozen scope
- Payments
- Guests core and current production enhancement layers
- Mesas, including multi-select, moving guests to existing or new tables, deleting tables/elements, editing tables, and changing table shape after creation
- Preboda / extra events
- Invitations / RSVP
- Planning / Agenda
- Calendar
- Access / production routing
- Demo shells and their validated mobile navigation behaviour

## Rules from this point
- Do not rebuild or redesign frozen modules unless the user explicitly requests a change or a confirmed production bug requires a minimal fix.
- Preserve `guests-v114-integrated.html` as frozen core.
- Prefer isolated, additive fixes around stable modules.
- Before any future production change, create a backup branch from the then-current production state.
- Do not alter demo/install/access architecture as part of unrelated feature work.
- Signature remains a future independent extension.

## SALES-CRITICAL DEMO REGRESSION GUARDRAILS
The demos are production-facing commercial surfaces. A demo that visually breaks, hides navigation or makes a module appear incomplete is a release-blocking defect because it can directly affect sales and influencer/partner evaluations.

The first regression seen on 2026-09-16 was caused by a global Android viewport/navigation patch forcing horizontal positioning (`left:0` / `right:0`) onto internal module navigation. Planning already had its own centering transform, so the two rules conflicted and moved half of the internal navigation off-screen. Payments was affected in the same class of issue.

A second regression on the same day exposed a related Android keyboard/viewport failure in Payments. The generic viewport patch treated the reduced `visualViewport.height` produced by the on-screen keyboard as if it were Android system-bar space. This moved the internal navigation upward into the form, reduced the effective shell height while editing and made part of the provider form disappear. The same patch also forced an extremely high navigation `z-index`, allowing the navigation to cover modal/form actions, including the black save/action button near the bottom.

Permanent rules:
- Never globally override the horizontal geometry of internal module navigation from the suite shell unless the target module has been explicitly checked for its own `left`, `right`, `width`, `max-width` and `transform` rules.
- Do not assume that Payments, Guests and Planning share the same internal navigation CSS.
- A fix for one mobile device must not be deployed by applying generic geometry to every child iframe without checking the other modules.
- Never derive Android system-bar spacing directly from `layout viewport - visualViewport` without explicitly distinguishing an open software keyboard.
- Never force the suite shell/document height to `visualViewport.height` while an input, textarea or select is being edited. The Android keyboard can reduce that value dramatically and collapse the usable form area.
- Internal bottom navigation must not jump above the software keyboard. During text/number editing it may be temporarily hidden if necessary, then restored after editing.
- Never give ordinary module navigation a maximal/global `z-index` that can place it above sheets, dialogs, provider forms or action buttons. Module modals must retain their intended stacking order.
- Do not use body padding derived from keyboard height. Navigation clearance must remain bounded and independent from keyboard size.
- Any change touching `app.html`, `suite-main-nav-emphasis-v1.js`, `suite-planning-bottomnav-v1.js`, demo shells, viewport sizing, iframe sizing, safe-area handling or internal navigation requires a mobile smoke test before considering production validated.

Required smoke test after those changes:
1. Open the full ES demo on Android at normal portrait width.
2. Confirm Payments internal navigation is fully visible and every tab can be tapped.
3. Open `+ Proveedor` in Payments and focus a normal text field. Confirm the keyboard opens without moving the internal navigation into the middle of the form or collapsing the visible form.
4. Focus a numeric field such as quantity or unit price and repeat the check with the numeric keyboard.
5. Scroll to the end of the provider form with the keyboard closed and confirm the bottom action/save button is completely visible and tappable, not covered by the internal navigation.
6. Confirm the Payments navigation returns to its correct position after closing the keyboard.
7. Confirm Guests navigation is fully visible and every main area can be reached.
8. Confirm Planning shows all four internal tabs — Ahora, Agenda, Timeline and Progreso — fully visible and tappable.
9. Confirm the global suite navigation — Pagos, Invitados, Planning, Ajustes — remains visible and usable.
10. Scroll each module to verify fixed/sticky navigation does not cover content or the Android system bar.
11. If the change concerns install/PWA/viewport behaviour, repeat the relevant check on iPhone as well.

Do not mark this class of change as complete merely because the page loads or data is present. The actual visible, scrollable and tappable mobile UI — including the keyboard-open state and bottom action buttons — must be checked.

The runtime restore point is the commit above. This document is operational documentation and a mandatory regression checklist for future changes.
