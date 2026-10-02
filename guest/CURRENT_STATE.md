# GUEST by WeddlySmartDesign — CURRENT STATE
Updated: 2026-10-02

## Continuity rule
This is the first file to read before any further GUEST work.
Do not resume from chat text alone.
Do not reopen sealed competitive research.
Do not touch ONE, ONE Partner or STUDIO.
Do not publish GUEST automatically.

## Product/technical track — SEALED
The independent GUEST product, engine and commercial/release-preparation track completed B0–B9 QA on `guest-independent`.
Canonical pre-design release-preparation baseline: `dac667cffa863fadb65411f6abef7e72ddf04f59`.
Canonical CI run: `36836190260`, all jobs success.
B8 final report: `guest/B8_FINAL_COMMERCIAL_SEAL_QA_2026-10-01.md`.
B9 final report: `guest/B9_FINAL_RELEASE_PREPARATION_SEAL_2026-10-01.md`.
Publication remains ON HOLD because the final catalog invitation art direction is not approved.
The GUEST management engine remains in standby until a real invitation direction passes visual approval.

## Invitation design track — SEALED HISTORY
- Microblock 01 market map — SEALED.
- Microblock 02 best-of + market gap — SEALED.
- Microblock 03 technical/operational baseline — SEALED.
- Microblock 04 GOLD STANDARD pilot specification — SEALED.
- GOLD 01 — REJECTED: corporate/editorial, below target.
- GOLD 02 — REJECTED: still below premium target / Canva-reproducible.
- AI visual pipeline pilot `gold` — PIPELINE VALIDATED, CATALOG DIRECTION REJECTED.

Primary checkpoints:
- `guest/GUEST_COMPETITIVE_DIRECTION_CHECKPOINT_2026-10-02.md`
- `guest/GUEST_DIRECTION_CHECKPOINT_2026-10-02.md`
- `guest/GUEST_GOLD_STANDARD_PILOT_01_2026-10-02.md`
- `guest/GUEST_GOLD_01_REJECTION_GOLD_02_DIRECTION_2026-10-02.md`
- `guest/GUEST_AI_VISUAL_PIPELINE_CHECKPOINT_2026-10-02.md`

## AI VISUAL PIPELINE — VALIDATED
Recraft proved capable of generating a coherent premium wedding visual universe from a strong style reference, including opening/hero/closing continuity and a venue reinterpretation.

The `gold` direction itself is NOT a catalog candidate.
Owner Android verdict: too overloaded. It stacks silk + pearls + florals + particles + banquet/venue and becomes visually excessive.

Do not keep polishing `gold`.
Its value is proof that the asset-generation method works.

## Non-negotiable rules for the REAL invitation
1. One dominant art direction/material language per invitation; supporting cues stay subordinate.
2. Restraint and breathing room over accumulation of luxury cues.
3. No return to corporate/editorial web sections.
4. RSVP inside the invitation is only a visually integrated CTA/button that opens the existing GUEST RSVP flow. Do not build a second inline RSVP form.
5. No visible `GUEST`, `WeddlySmartDesign` or `by WeddlySmartDesign` branding in the customer-facing wedding invitation.
6. GUEST engine remains untouched until the real invitation direction is approved.
7. Owner intervention remains limited to opening finished mobile versions and light feedback.

## REAL invitation functional/visual requirements
See `guest/GUEST_REAL_INVITATION_CONTENT_MOTION_REQUIREMENTS_2026-10-02.md`.
The system must support names/date, premium opening, cover/hero, cover/sub-cover couple photography, venue/location, RSVP CTA into existing GUEST RSVP and designed closing. Countdown, agenda, couple-story text, secondary photography and final swipe gallery are configurable/optional blocks.
Motion remains NOT YET VALIDATED and is now a separate gate.

## Motion gate — GATE 01 FAIL / GATE 02 FAIL / GATE 03 REQUIRED
`GUEST_MOTION_GATE_01.html` failed Android review because the cover behaved mainly like a moving raster/block and the gallery felt like web UI.
`GUEST_MOTION_GATE_02_LAYERED.html` also failed Android review on 2026-10-02. Root cause: it attempted to simulate depth by clipping and independently moving regions copied from one flattened raster. Real-device motion exposed hard seams, duplicated image regions, rectangular fragments and broken continuity.

Technical conclusion: premium object-led motion CANNOT be built reliably by slicing a flattened JPG/PNG after generation. The visual assets must be authored/exported as true independent layers from the beginning.
Required source planes for the next test: clean background plate; transparent veil/silk; transparent pearls/ornament; transparent foreground floral/object layer; optional particles/light overlay; typography kept native in HTML/CSS.

## Exact NEXT ACTION
1. Do not patch Motion Gate 02.
2. Build Motion Gate 03 only after creating genuine separate visual assets with transparency/clean plate.
3. Test only opening + short hero depth interaction first. Do not build gallery/closing until real layered opening passes Android.
4. If genuine-layer motion passes, then test gallery swipe and closing with the same motion grammar.
5. Only after motion passes should the first restrained real catalog direction be built.
