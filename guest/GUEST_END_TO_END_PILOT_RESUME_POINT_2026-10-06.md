# GUEST — RESUME POINT FOR REAL END-TO-END TESTS

Date saved: 2026-10-06
Project: GUEST by WeddlySmartDesign
Repository: WeddlySmartDesign/WeddlySmartDesign.github.io
Branch: guest-independent

## DO NOT REPEAT

VEIL LIGHT template scalability QA is CLOSED. Do not return to template-matrix QA or redesign before the real operational pilot.

The next task is NOT Design 02.
The next task is to perform the real end-to-end pilot exactly as a couple and then exactly as WeddlySmartDesign.

## CURRENT PILOT STATE

The complete pilot workflow is implemented and isolated from ONE, ONE Partner and STUDIO:

1. couple questionnaire on mobile or desktop;
2. real image uploads;
3. autosave + exact final review;
4. submit order;
5. internal order receipt;
6. private WeddlySmartDesign order manager;
7. generated canonical invitation config;
8. VEIL LIGHT production workbench using the frozen scalable visual master;
9. couple review;
10. approve or request changes;
11. change loop back to owner;
12. final delivery;
13. final invitation test harness.

## TEST ARTIFACTS — EXACT FILES

Use these saved artifacts. Do not recreate them unless a real defect is found.

- GUEST_QUESTIONNAIRE_TEST_MOBILE.html
- GUEST_QUESTIONNAIRE_TEST_PC.html
- guest-orders-admin-v2.html
- GUEST_VEIL_LIGHT_PRODUCTION_WORKBENCH.html
- GUEST_REVIEW_TEST_MOBILE.html
- GUEST_REVIEW_TEST_PC.html
- GUEST_FINAL_TEST_MOBILE.html
- GUEST_FINAL_TEST_PC.html

Two isolated test orders already exist:
- MOBILE questionnaire UX pilot;
- PC questionnaire UX pilot.

## EXACT TEST ORDER WHEN USER RETURNS

### Phase 1 — Couple experience
Open GUEST_QUESTIONNAIRE_TEST_MOBILE.html on mobile and complete it as a real couple using plausible data. Do not evaluate it as the owner while filling it in.
Then repeat separately with GUEST_QUESTIONNAIRE_TEST_PC.html on desktop.
Use a real user email only if email delivery itself is being tested.

Evaluate through use:
- length/effort;
- clarity of conditional questions;
- file upload experience;
- whether wording feels like “tell us about your wedding”, not a builder;
- final exact review before submission.

### Phase 2 — Owner order reception
Open guest-orders-admin-v2.html.
Use the existing Weddly owner-manager master/recovery code.
Confirm the submitted order is visible with:
- status;
- exact questionnaire data;
- photos;
- notes;
- production controls.

### Phase 3 — Produce the invitation
From the order manager choose Prepare/Start design.
Open GUEST_VEIL_LIGHT_PRODUCTION_WORKBENCH.html.
Load the selected order.
The workbench applies the order config to the exact frozen scalable VEIL LIGHT master through VEIL_APPLY_CONFIG(config).

Core test question:
Does the questionnaire produce the intended invitation without bespoke layout work?

Do not redesign the template during this pilot unless a real supported questionnaire state breaks the design.

### Phase 4 — Couple review
Mark the invitation ready for review from the owner flow.
Open the matching review artifact:
- GUEST_REVIEW_TEST_MOBILE.html
- GUEST_REVIEW_TEST_PC.html

Test both paths across the two pilot orders if useful:
- approve;
- request a concrete change.

Confirm the change request appears back in the owner workflow.

### Phase 5 — Change loop
If a change is requested:
- return to manager/workbench;
- make only the requested/config-level change;
- resend/reopen review;
- confirm the second review is understandable.

### Phase 6 — Final delivery
After approval, deliver from the owner manager.
Then open the matching final artifact:
- GUEST_FINAL_TEST_MOBILE.html
- GUEST_FINAL_TEST_PC.html

Confirm delivered invitation content and images are correct.

## BACKEND STATE

Supabase project:
- Weddly Smart Design VENDORS Project
- project ref: dnjsxequwgtyyauuofxj

Implemented:
- public.guest_invitation_orders
- private bucket guest-invitation-uploads
- public final bucket guest-invitation-public
- Edge Function guest-invitation-flow, version 2 at checkpoint

Order statuses:
- draft
- submitted
- designing
- review_ready
- review_sent
- changes_requested
- approved
- delivered
- cancelled

Access model:
- questionnaire/review/final use hashed capability tokens;
- owner operations reuse existing Weddly owner-manager authentication;
- guest_invitation_orders has RLS and no direct browser policy;
- browser interactions go through the Edge Function.

Test-mode review/delivery emails deliberately avoid nonexistent production URLs. The local exact-master artifacts are used for the pilot.

## REPOSITORY DOCUMENTATION

Canonical workflow document:
- guest/GUEST_END_TO_END_ORDER_WORKFLOW_V1_2026-10-06.md
- commit: 82b54a2885bd4a3056031d913c582be4c3cf86e1

Current state updated with this pilot checkpoint:
- guest/CURRENT_STATE.md
- commit: 8561184d700c01ca6c68d55dd58a9153547f9fad

The workflow doc and CURRENT_STATE explicitly say:
- no more template QA repetition;
- no Design 02 before the real pilot;
- checkout/Stripe production wiring remains intentionally unchanged until this pilot is accepted.

## PRODUCTION BOUNDARY — DO NOT CROSS YET

The live GUEST Stripe/checkout handoff has NOT been switched to the new pilot workflow.
This is intentional.

After the user completes the pilot and approves/fixes the real workflow:
1. host commercial questionnaire/review/final surfaces;
2. wire guest-stripe-checkout into guest_invitation_orders;
3. connect production RSVP/access provisioning;
4. retire old guest-order.html;
5. run one production smoke test;
6. only then start Design 02.

## DECISION RULE ON RETURN

Do not ask the user to remember this state.
Recover this file + CURRENT_STATE + workflow doc first.
Then continue from the exact real-test phase the user is on.
Do not repeat completed QA, redo architecture, or rebuild test artifacts without evidence of a defect.


## FIRST REAL MOBILE PILOT FINDING — 2026-10-06 12:04 CEST

The owner completed the mobile questionnaire and received both emails correctly, then became blocked at the owner step “Preparar diseño”: the old guest-orders-admin-v2.html only changed the backend status/config and did NOT show/open the actual invitation.

This is a real workflow defect, not user error.

Evidence from the real pilot:
- questionnaire submission succeeded;
- couple confirmation email succeeded;
- internal “Nuevo encargo GUEST · Pilar & Jorge” email succeeded;
- order appeared in owner manager with questionnaire, photos and controls;
- pressing “Preparar diseño” did not reveal the invitation, so the next action was not discoverable;
- the test order was accidentally advanced to review_ready while trying to continue.

Correction:
- test order 68a0b0d0-5bea-40e7-bcfb-84e795a1cb39 was reset to status designing so the pilot can continue cleanly;
- guest-orders-admin-v2.html is RETIRED for the pilot production step;
- new persistent artifact: /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V3.html
- GUEST_PRODUCTION_MANAGER_V3.html contains the exact frozen scalable VEIL LIGHT master plus the private owner production panel in the SAME file;
- after owner unlock, it selects the pending order and offers one explicit primary action: “Preparar y ver invitación”;
- that action generates/loads the resolved config, applies it to the real frozen master and closes the panel so the owner immediately sees the invitation;
- the same panel can be reopened with the floating production control and continues with: Lista para revisión -> Enviar revisión -> Entregar final.

Pilot resume rule updated:
- after questionnaire submission, skip guest-orders-admin-v2.html;
- use GUEST_PRODUCTION_MANAGER_V3.html as the single owner-side production surface.

Additional defect noticed in the real emails:
- sender display name was inherited from ONE.
Correction:
- guest-invitation-flow redeployed as v3;
- GUEST workflow emails now display “GUEST by WeddlySmartDesign” while preserving the configured sender address;
- test-mode internal order email no longer points to a not-yet-hosted production manager link; it tells the owner to use GUEST_PRODUCTION_MANAGER_V3.html.

Do NOT restart the questionnaire. Continue the existing mobile test order from designing using GUEST_PRODUCTION_MANAGER_V3.html.


## REAL MOBILE PILOT — VIDEO 1000094342 FIXES CLOSED 2026-10-06

The owner reviewed the real VEIL LIGHT result generated from the first mobile questionnaire and reported four concrete defects plus a blocked return path.

Root causes and corrections:

1. Opening initials flash
- The reusable custom initials overlay was correct, but the underlying canonical entry video still contains the original I&H pixels near the end of the door animation.
- After the custom initials had moved away, those baked master initials could flash for a fraction of a second.
- Fix: cut/crossfade from the entry video to the real configured hero at ~4.55 s and pause the video before the baked I&H frames become visible.
- The door animation remains; only the contaminated tail is removed.

2. Wrong countdown
- Real order date: 2027-10-23.
- The displayed 347 days came from the frozen master date 2027-09-18.
- Root cause: renderCountdown() created a timer for the master, then VEIL_APPLY_CONFIG() created a second timer for the real order without clearing the first; both timers kept writing to the same DOM.
- Fix: clear window.__veilTimer before starting the current config timer.

3. Agenda visually empty
- The real questionnaire correctly contained 5 moments.
- renderAgenda() correctly replaced the DOM rows, but setupMotion() had attached its reveal observer only to the original master rows.
- Newly generated rows stayed at their pre-animation opacity and therefore looked empty.
- Fix: reusable bindAgendaReveal() is called after every dynamic agenda render and after VEIL_APPLY_CONFIG().

4. Couple cropped in Story / Gallery
- Questionnaire uploads had no manual crop/focal editor (by design), while buildConfig forced every uploaded Story/Gallery image to crop at 50/50.
- This can cut one member of the couple on landscape or strongly mismatched photos.
- Fix: photo configs now carry autoFrame=true. The renderer measures the real image ratio and only when the approved crop would be severe it switches that image to VEIL LIGHT's already-approved full-photo state. This preserves both people without introducing manual design work.
- Venue image remains cover/crop because it is environmental, not a couple portrait.

5. Return to the test
- Existing mobile order remains alive; questionnaire must NOT be restarted.
- Order 68a0b0d0-5bea-40e7-bcfb-84e795a1cb39 is in status designing.
- Continue through GUEST_PRODUCTION_MANAGER_V4.html.

Persistent pilot artifacts added:
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V4.html
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_REVIEW_TEST_MOBILE_V2.html
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_REVIEW_TEST_PC_V2.html
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_FINAL_TEST_MOBILE_V2.html
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_FINAL_TEST_PC_V2.html

Backend:
- guest-invitation-flow redeployed v4.
- Future Story/Gallery uploaded photo configs include autoFrame=true.
- Existing Pilar & Jorge mobile order was migrated to autoFrame=true for its Story and both Gallery photos.

QA:
- JavaScript syntax PASS for Production Manager V4 + both Review V2 + both Final V2 artifacts.
- Do not reuse V3 / old Review / old Final artifacts for this pilot.

Next exact action:
- Open GUEST_PRODUCTION_MANAGER_V4.html.
- Load the existing Pilar & Jorge order.
- Review the full invitation again on mobile, especially opening transition, countdown, Story photo, Agenda and Gallery.
