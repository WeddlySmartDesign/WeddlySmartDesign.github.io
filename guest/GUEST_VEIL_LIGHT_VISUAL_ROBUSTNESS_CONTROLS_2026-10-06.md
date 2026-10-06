# GUEST — VEIL LIGHT VISUAL ROBUSTNESS CONTROLS

Date: 2026-10-06
Status: IMPLEMENTED / OWNER MOBILE REVIEW PENDING

## Why this gate reopened

The second real-order pilot proved technical scalability and the complete operational workflow, but the delivered invitation exposed three commercial-quality failures on a real Android device:

1. Cover microcopy (kicker/place) can lose contrast against the moving veil.
2. Long names rendered with the contemporary Bodoni variant can remain technically inside the layout while becoming visually hard to read.
3. A long text-only Story can be technically valid but visually excessive because the fixed 26 px editorial body scale is too large for long copy.

This does NOT invalidate the 231/231 technical matrix or the E2E operational flow. It invalidates the earlier conclusion that technical fit alone was enough to freeze VEIL LIGHT commercially.

## Product decision

VEIL LIGHT V5.2 remains:
- technically scalable;
- architecturally deterministic;
- operationally validated.

It is NOT commercially frozen until visual robustness is accepted.

Design 02 remains blocked until this visual-robustness gate passes owner Android review.

## V5.3 safe visual-tuning layer

Candidate:
- GUEST_PRODUCTION_MANAGER_V5_3_VISUAL_ROBUSTNESS.html
- GUEST_REVIEW_TEST_MOBILE_V5_3_VISUAL_ROBUSTNESS.html
- GUEST_REVIEW_TEST_PC_V5_3_VISUAL_ROBUSTNESS.html
- GUEST_FINAL_TEST_MOBILE_V5_3_VISUAL_ROBUSTNESS.html
- GUEST_FINAL_TEST_PC_V5_3_VISUAL_ROBUSTNESS.html

Rules:
- no free CSS;
- no manual positioning;
- no per-order animation timing;
- no arbitrary pixel input;
- only approved presets stored in resolved_config.visualTuning;
- the same resolved visual choices render in Production, Review and Final.

Owner-editable safe controls:
- Cover names font: Auto safe / Playfair / Cormorant / Bodoni.
- Cover names size: Auto / Compact / Medium / Large.
- Cover personalized metadata size (place/date/time, with matched kicker treatment): Normal / Large.
- Story body font: Auto / Playfair / Cormorant / Manrope.
- Story body size: Auto / 18 / 20 / 22 / 24 / 26 px.

Not owner-editable:
- layout coordinates;
- section geometry;
- motion;
- CSS;
- opening timing;
- static template copy;
- arbitrary font or pixel values.

## Automatic robustness defaults

Even when an older order has no visualTuning object:

Cover:
- high-contrast microcopy is enabled by default;
- long names automatically fall back to Playfair for readability;
- long-name size is selected from bounded clamps based on actual name length;
- existing fitCoverNames still provides a final overflow guard.

Story:
- text-only Story body scale adapts to actual character count;
- >380 chars -> 19 px;
- >280 chars -> 20 px;
- >190 chars -> 22 px;
- otherwise -> 24 px;
- long text gets a wider safe reading measure and tighter vertical padding;
- static Story heading size adapts automatically to copy density but is not owner-editable;
- Story with photography keeps its existing 16 px automatic body scale unless the owner selects an explicit safe preset.

## QA

- renderer layer propagated consistently to Production / Review / Final;
- JavaScript syntax PASS on all five V5.3 artifacts;
- backend schema change not required: owner set_config already stores the complete resolved_config object;
- older configs remain compatible because visualTuning is optional and defaults are deterministic.

## Exact next action

Owner Android review of the same problematic long-name / long-Story case using V5.3.

Acceptance requires:
- cover place/kicker readable over the real motion;
- long names legible and still premium;
- long Story no longer visually excessive;
- owner can deliberately choose a different approved font/size and see the same result in Review/Final;
- no layout/design manual repair.

Only after this gate passes may VEIL LIGHT be commercially frozen and Design 02 begin.


## V5.3.1 — NAME TYPOGRAPHY COHERENCE 2026-10-06

Owner Android review of V5.3 found a coherence defect: the safer long-name font was applied to Cover while Closing could still inherit the old template typography variant. This made the same couple names use different typefaces at the beginning and end of the invitation.

Rule now sealed:
- couple-name typography is ONE invitation-level visual token;
- Cover and Closing always use the exact same font family/variant;
- Closing may use its own bounded size fitting for available space, but never a different typeface;
- the owner control is now labelled “Nombres · tipografía (portada y cierre)” and cannot tune the two independently.

Artifacts:
- GUEST_PRODUCTION_MANAGER_V5_3_1_NAME_COHERENCE.html
- GUEST_REVIEW_TEST_MOBILE_V5_3_1_NAME_COHERENCE.html / PC
- GUEST_FINAL_TEST_MOBILE_V5_3_1_NAME_COHERENCE.html / PC

Static QA: JavaScript syntax PASS on all five artifacts. Visual robustness gate remains open pending owner Android review.


## V5.3.2 — AMPERSAND + MICROCOPY COHERENCE 2026-10-06

Owner Android review of V5.3.1 found two remaining coherence/readability defects:
- the ampersand was too small on Cover and visually awkward in Closing;
- Closing kicker “NOS VEMOS ALLÍ” was weaker than Cover kicker “NOS CASAMOS”.

Rules now sealed:
1. Ampersand uses one neutral, readable sans treatment in Cover and Closing. It is no longer an ornamental italic glyph. Couple names keep the selected invitation-level serif.
2. Closing kicker uses the same microcopy system as Cover kicker: uppercase, same size token, tracking, weight and contrast/shadow logic.
3. The owner microcopy-size control now explicitly governs Cover + Closing together; the two cannot diverge.

Artifacts:
- GUEST_PRODUCTION_MANAGER_V5_3_2_AMP_KICKER_COHERENCE.html
- GUEST_REVIEW_TEST_MOBILE_V5_3_2_AMP_KICKER_COHERENCE.html / PC
- GUEST_FINAL_TEST_MOBILE_V5_3_2_AMP_KICKER_COHERENCE.html / PC

Static QA: JavaScript syntax PASS on all five artifacts. Visual robustness gate remains open pending owner Android review of Cover + Closing.


## V5.3.3 — FINAL AMPERSAND SCALE 2026-10-06

Owner Android review of V5.3.2 confirmed the ampersand treatment was coherent but still slightly too small in both Cover and Closing.

Final rule:
- ampersand remains neutral/readable and secondary to the names;
- one shared structural size token now controls Cover + Closing: `clamp(30px, 8vw, 36px)`;
- no owner control is added for ampersand size;
- no other V5.3.2 visual rule changes.

Artifacts:
- GUEST_PRODUCTION_MANAGER_V5_3_3_AMP_SCALE_FINAL.html
- GUEST_REVIEW_TEST_MOBILE_V5_3_3_AMP_SCALE_FINAL.html / PC
- GUEST_FINAL_TEST_MOBILE_V5_3_3_AMP_SCALE_FINAL.html / PC

Visual robustness gate remains open only for owner Android confirmation of this final micro-adjustment.


## VEIL LIGHT V5.3.3 — COMMERCIAL FREEZE 2026-10-06

Owner Android review ACCEPTED the final V5.3.3 visual-robustness result.

Final status:
- technical scalability: PASS;
- operational E2E: PASS;
- visual robustness: PASS;
- commercial visual gate: CLOSED;
- VEIL LIGHT V5.3.3: FROZEN.

Canonical checkpoint: `guest/GUEST_VEIL_LIGHT_V5_3_3_COMMERCIAL_FREEZE_2026-10-06.md`.

Do not reopen VEIL LIGHT unless a reproducible supported-state defect is found in a real order. Do not use VEIL LIGHT work as a pretext to modify ONE, ONE Partner or STUDIO.

Design 02 is now UNBLOCKED. Publication and Stripe wiring remain intentionally separate and unchanged.
