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


## PILOT HOTFIX — GIFT DETAIL REGRESSION 2026-10-06

Production Manager V4 failed while loading the real Pilar & Jorge order with:
- "giftDetail is not defined"

Cause:
- while patching Agenda/reveal behavior into V4, the pre-existing giftDetail(g) helper from V3 was accidentally removed;
- because this real order uses Gift mode = Bizum, rendering Practical invoked giftDetail(g) and aborted the invitation render.

Correction:
- restored the exact giftDetail(g) helper from V3;
- applied the same restoration to the paired Review/Final pilot artifacts so the defect cannot reappear later in the same test;
- JavaScript syntax check PASS on all corrected artifacts.

Use now:
- GUEST_PRODUCTION_MANAGER_V4_1.html
- GUEST_REVIEW_TEST_MOBILE_V2_1.html / PC_V2_1
- GUEST_FINAL_TEST_MOBILE_V2_1.html / PC_V2_1

Persistent Library:
- /GUEST/END_TO_END_PILOT_2026-10-06/

Do NOT use V4 without _1, Review V2 without _1, or Final V2 without _1.
The existing Pilar & Jorge order remains in designing; do not restart the questionnaire.


## REAL MOBILE PILOT — FULL VIDEO REVIEW 1000094355 + V4.2 2026-10-06

Owner requested a full end-to-end visual review, explicitly including the Cover, rather than only the previously reported defects.

Full-video findings:

### Cover regression — real defect
- V4/V4.1 eliminated the I&H flash by hiding the entry video at the exact point where VEIL LIGHT should remain on the moving veil.
- Result: after opening, the approved moving veil disappeared and the Cover became a nearly flat beige panel.
- This broke one of VEIL LIGHT's strongest approved elements.

V4.2 correction:
- the entry video is never hidden after opening;
- the custom initials overlay stays over the baked master initials until the baked I&H has left the door area;
- the custom overlay disappears only after ~4.76 s;
- the approved Cover copy appears at ~5 s;
- the video continues into the clean full-veil segment and loops from 5 s exactly as the approved master did;
- no blank beige Cover;
- browser title now follows the real couple instead of retaining Isabel & Hugo.

### Previously reported items rechecked in the full video
- countdown: now reflects the real 2027-10-23 wedding date; duplicate-master-timer bug remains fixed;
- Story image: auto-safe framing now keeps both people visible;
- Agenda: all 5 submitted moments render and remain visible, including 00:00 continuation-of-night ordering;
- Gallery: both submitted photos keep the couple visible; auto-safe framing works;
- Location: real split location data render correctly;
- Practical: Bus, Gift and Playlist combinations render without the earlier giftDetail crash;
- Closing: Pilar & Jorge fit correctly and the final-act transition remains intact.

### Additional workflow defect found proactively
The current order selected Playlist but contains no playlist URL.
The original questionnaire allowed this invalid combination, so the invitation shows the Playlist module without an action.

Fix for future pilot orders:
- GUEST_QUESTIONNAIRE_TEST_MOBILE_V2.html / PC_V2.html validate enabled practical modules before advancing;
- Playlist enabled => URL required;
- Bus enabled => pickup + outbound time required;
- Gift enabled => mode-specific data required;
- custom Story => non-empty text required;
- enabled Cover place/time => corresponding value required;
- guest-invitation-flow redeployed to v6 with matching server-side validation;
- mark_review_ready now blocks incomplete orders server-side.

Current Pilar & Jorge order:
- NOT restarted;
- remains designing;
- can still be visually reviewed;
- it cannot be sent to couple review until the missing Playlist link is resolved. This is intentional: incomplete data must never reach the couple.

Current artifacts to use:
- GUEST_PRODUCTION_MANAGER_V4_2.html
- GUEST_REVIEW_TEST_MOBILE_V2_2.html / PC_V2_2
- GUEST_FINAL_TEST_MOBILE_V2_2.html / PC_V2_2
- GUEST_QUESTIONNAIRE_TEST_MOBILE_V2.html / PC_V2.html

Persistent Library:
- /GUEST/END_TO_END_PILOT_2026-10-06/

Do not reuse V4/V4.1 or the previous Review/Final pilot artifacts after this checkpoint.


## REAL MOBILE PILOT — V4.3 AGENDA SCALE + INITIALS HARD FIX 2026-10-06

Owner reported after V4.2:
- master/test initials still appeared briefly around the opening/closing transition;
- Agenda typography with 5 moments no longer matched the approved Agenda scale.

Root causes:
1. Agenda:
- scalable master contained a count-5 override:
  - time = 20px
  - label = 23px
- approved base Agenda uses:
  - time = 35px
  - label = 28px
- the special 5-item font shrink changed the approved visual language unnecessarily.

V4.3 correction:
- 5-item Agenda now retains exact approved base font scale 35px / 28px;
- only row vertical padding remains compacted so 5 moments still fit one screen;
- no changes to Agenda image, heading, grid, lines, animation or positioning model.

2. Test initials:
- timing-only suppression was not robust enough;
- V4.3 now cuts the opening source to the clean veil segment at ~4.58 s, before any contaminated master-initial frames can show;
- custom initials masking remains until the clean segment;
- cover receives opening-complete and the initials overlay is physically display:none after opening;
- final-act intersection also forces opening-complete, so the overlay cannot reappear later in the flow.

Applied consistently to:
- GUEST_PRODUCTION_MANAGER_V4_3.html
- GUEST_REVIEW_TEST_MOBILE_V2_3.html / PC_V2_3
- GUEST_FINAL_TEST_MOBILE_V2_3.html / PC_V2_3

Persistent Library:
- /GUEST/END_TO_END_PILOT_2026-10-06/

QA:
- JavaScript syntax PASS for all V4.3/V2.3 files.

Continue the existing Pilar & Jorge order; do not restart questionnaire.


## REAL MOBILE PILOT — V4.4 ENTRY INITIALS ROOT-CAUSE FIX 2026-10-06

Owner rejected V4.3 entry initials as visually unacceptable.

A frame-level comparison against the approved master established the exact cause:
- the entry MP4 itself is clean through ~4.0 s;
- between ~4.2 and ~4.6 s, a residual baked portion of the master H appears at the extreme left edge as the door exits;
- V4.3 tried to hide that with an opaque/radial patch around the dynamic initials;
- that patch created the visibly artificial “label/card” effect that the owner correctly rejected.

V4.4 does NOT mask the initials with a patch.

New approach:
- dynamic couple initials are again rendered directly on the door in the same understated typographic language as the approved master;
- no rectangle, glow card, radial label or visible masking treatment;
- the source video is allowed to play normally only while its frames are clean;
- at ~4.08 s, before the residual baked H begins to enter the viewport, the video seeks directly to the clean full-veil segment at ~4.82 s;
- the dynamic initials are removed at that same handoff;
- cover motion then continues on the clean veil segment;
- approved Agenda 5-item scale remains locked at 35px time / 28px label.

Applied consistently to:
- GUEST_PRODUCTION_MANAGER_V4_4.html
- GUEST_REVIEW_TEST_MOBILE_V2_4.html / PC_V2_4
- GUEST_FINAL_TEST_MOBILE_V2_4.html / PC_V2_4

Persistent Library:
- /GUEST/END_TO_END_PILOT_2026-10-06/

QA:
- JavaScript syntax PASS for all V4.4/V2.4 artifacts.

Existing Pilar & Jorge order remains valid and should be continued, not restarted.


## SCALABILITY ARCHITECTURE FINDING — OPENING MOTION 2026-10-06

The real-order pilot exposed a structural issue, not a normal per-order adjustment:

- the opening depended on tracking personalized initials over a motion asset / source sequence;
- successive timing/masking fixes produced order-specific-looking behavior;
- this violates the business requirement that GUEST templates must generate from questionnaire/config without manual design repair.

Decision:
- V4.x opening architecture is NOT acceptable as the commercial scalable solution;
- no more per-order timing patches;
- stop treating initials motion as an order-level problem.

New scalability rule:
1. Motion assets must be generic and contain no personalized names/initials/dates.
2. Every personalized element must be DOM/config-driven.
3. Personalized motion must be produced by the template structure itself, not by manually tracking text over a video.
4. No CSS/JS may branch on a specific couple/order.
5. If a supported questionnaire state breaks the design, that is a template defect and must be fixed once in the master before accepting more orders.
6. Production handling of an order should be data -> deterministic render -> review; no bespoke CSS/timing work.

Structural replacement candidate created:
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V5_SCALABLE_MOTION.html

V5 opening architecture:
- uses the clean veil segment as the generic moving background;
- creates the opening door as a DOM element;
- initials are a child of the door, so they move naturally with it without frame-by-frame tracking;
- no initials are baked into the motion asset;
- no per-order timing coordinates are required;
- existing approved dynamic config/rendering remains intact.

V5 is a structural candidate and is NOT visually approved yet.
The current real-order pilot should pause before review/delivery until this architecture is visually accepted.


## STRUCTURAL OPENING CANDIDATE V5.1 — FULL-SCREEN DOOR 2026-10-06

Owner rejected V5 immediately because the DOM door looked like a narrow floating rectangle over the veil rather than a believable premium door.

This is a valid visual objection. Scalability alone is not sufficient; the structural solution must preserve the approved premium standard.

V5.1 correction:
- the opening door now covers the full invitation viewport from edge to edge;
- no veil/background is visible around the closed door;
- subtle architectural frame/panel lines are built into the door itself so it reads as an intentional door rather than a floating card;
- the door remains entirely DOM/CSS and generic;
- couple initials remain config-driven children of the door;
- opening motion is still deterministic and requires no per-order tracking/timing coordinates;
- the door slides away as one full surface, revealing the generic moving veil underneath.

Candidate:
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V5_1_FULL_DOOR.html

Important:
- V5 is rejected and must not be reused.
- V5.1 is still a visual candidate, not an approved master.
- Do not propagate to Review/Final until owner approves the opening itself.


## STRUCTURAL OPENING CANDIDATE V5.2 — RECRAFT CONTINUOUS 2026-10-06

Owner compared V5.1 against the original Recraft opening and correctly identified two issues:
- V5.1 was visually less elegant than the Recraft solution;
- there was a perceptible scene break between “door opened” and “cover begins”, so the sequence no longer felt like one continuous motion.

Decision:
- abandon the redrawn CSS door as the visual solution;
- restore the original Recraft motion language as the basis of the scalable opening.

Root architecture of V5.2:
1. The Recraft motion is treated as a generic template asset, not a couple-specific animation.
2. The source asset is cleaned once globally to remove the residual baked master-letter fragment during the late door exit.
3. Couple initials are DOM/config driven and remain stationary on the closed door.
4. On tap, initials fade out BEFORE the door begins moving. They are no longer tracked over a moving video.
5. The same single Recraft motion asset plays continuously from closed door -> opening -> moving veil.
6. Cover copy fades in over the same running asset only after the video itself has naturally become the full veil.
7. No video swap / scene cut occurs between opening and cover.
8. After the cover starts, the clean veil portion loops as before.

This preserves the original premium visual language while meeting scalability:
- no order-specific timing;
- no order-specific CSS;
- no per-frame initials tracking;
- no initials baked into production content;
- one generic cleaned motion asset reused for every couple.

Candidate:
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V5_2_RECRAFT_CONTINUOUS.html

Important:
- V5.1 full CSS door is rejected and must not be reused.
- V5.2 is the visual candidate to validate next.
- Do not propagate to Review/Final until owner confirms the opening/cover continuity.


## VEIL LIGHT V5.2 — SCALABILITY CERTIFICATION GATE 2026-10-06

Owner keeps V5.2 as the currently approved visual version. Optional future Recraft work is deferred; do not spend more credits now.

A strict scalability audit was run before continuing the real pilot.

Results:
- removed the inherited couple-specific `I&H` initials branch; all couples now use one generic initials path;
- extracted/inspected the embedded V5.2 opening asset: no initials/names/date are baked into the reusable MP4;
- stress matrix: 77 configurations x 3 mobile widths (360/390/430) = **231/231 PASS**, 0 page JS errors;
- Agenda count-5 remains at approved 35px / 28px;
- three generic supported-limit defects were found and fixed once in the master: long-name font fitting, long split-location adaptive fitting, and long unbroken Practical values;
- no per-order CSS/timing/manual positioning is used by these fixes.

Persistent certification candidate:
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V5_2_CERT_CANDIDATE.html

Certification report:
- guest/GUEST_VEIL_LIGHT_V5_2_SCALABILITY_CERTIFICATION_2026-10-06.md
- persistent Library copy in the pilot folder.

Final 100% freeze is still withheld pending the second, materially different PC questionnaire order.

Second-order gate:
- existing PC order 829f4998-f328-4c6a-be49-d73fd3aaa2f7 is still draft/empty;
- test harness prepared: GUEST_QUESTIONNAIRE_PC_SCALE_GATE_AUTOFILL_V1.html;
- it uses the real questionnaire controls, normal validations and normal save path, fills a deliberately different stress configuration, and stops on the real Review step for explicit final submit;
- offline harness QA reaches Review correctly with no client validation/page errors.

Do not start Design 02 and do not declare VEIL LIGHT 100% frozen until this second order renders through V5.2 without per-order design/code intervention.


## PC SCALE-GATE AUTOFILL V3 — 2026-10-06

V2 opened empty because its separate helper script could not access the questionnaire's lexical `loaded` flag. The wait condition therefore never became true and the autofill never started.

V3 fixes the test harness structurally:
- autofill runs inside the questionnaire's own script scope;
- it is invoked only after the real order load completes and `loaded=true`;
- it then fills the actual controls, advances through the normal validations/saves and stops on Review;
- a final self-check verifies the intended stress configuration before allowing the owner to submit.

The existing PC test order was reset to a clean draft before V3.

Use:
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_QUESTIONNAIRE_PC_SCALE_GATE_AUTOFILL_V3.html

Retire V1 and V2.


## VEIL LIGHT V5.2 — 100% SCALABLE / FROZEN 2026-10-06

Second real-order gate PASSED.

Order:
- 829f4998-f328-4c6a-be49-d73fd3aaa2f7
- submitted successfully from the real PC questionnaire harness;
- backend generated resolved_config automatically;
- materially different from Pilar & Jorge.

The exact resolved config was rendered through the same V5.2 certification renderer with ZERO per-order design edits at 360/390/430 px.

PASS:
- no horizontal overflow;
- no Cover overflow;
- no split-location overlap;
- no Agenda overlap;
- no Practical overlap;
- Story text-only;
- Gallery OFF;
- Agenda 5;
- Practical 4;
- initials Á&Í;
- 0 page JS errors.

Visual stress review PASS.

Certification result:
**VEIL LIGHT V5.2 is now 100% scalable and FROZEN for the supported contract.**

Canonical artifacts:
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_VEIL_LIGHT_V5_2_SCALABLE_FROZEN.html
  SHA-256 6706afb02baea28ac18809336474c7333a4cd31706ecc538de730096599aa956
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V5_2_SCALABLE_FROZEN.html
  SHA-256 64a218c42632ed89d5d33176ff5e9fce910574527b7b9730b581a243fa130365

Do NOT reopen VEIL LIGHT design or scalability QA without a reproducible supported-state defect.

Next exact action:
- propagate this certified renderer into Review + Final pilot surfaces;
- resume end-to-end couple review / change loop / delivery;
- Design 02 remains blocked until the operational pilot is completed and accepted.


## V5.2 FROZEN -> REVIEW/FINAL PROPAGATED 2026-10-06

VEIL LIGHT scalability certification is fully closed. Do not repeat Gate 2.

Frozen renderer was propagated into the Review and Final pilot surfaces with no renderer edits:
- GUEST_REVIEW_TEST_MOBILE_V5_2_FROZEN.html
- GUEST_REVIEW_TEST_PC_V5_2_FROZEN.html
- GUEST_FINAL_TEST_MOBILE_V5_2_FROZEN.html
- GUEST_FINAL_TEST_PC_V5_2_FROZEN.html

Static QA:
- exact frozen renderer preserved;
- Review actions preserved;
- Final public-load action preserved;
- JavaScript syntax PASS.

The current environment could not persist the four generated HTML copies into Library because its container-to-Library bridge returned container_session_unavailable. The files themselves are valid; do not modify product code because of this storage issue.

Resume the operational pilot with order 829f4998-f328-4c6a-be49-d73fd3aaa2f7:
1. GUEST_PRODUCTION_MANAGER_V5_2_SCALABLE_FROZEN.html
2. mark ready and send review
3. GUEST_REVIEW_TEST_PC_V5_2_FROZEN.html
4. approve or request change
5. complete change loop if used
6. deliver
7. GUEST_FINAL_TEST_PC_V5_2_FROZEN.html

Pilar & Jorge remains review-blocked only by the legacy Playlist-without-URL condition. Do not invent data and do not restart it.

Design 02 remains blocked until the operational pilot is accepted.
