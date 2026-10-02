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

## Motion gate — GATE 01 FAIL / GATE 02 FAIL / GATE 03 FAIL
`GUEST_MOTION_GATE_01.html` failed Android review because the cover behaved mainly like a moving raster/block and the gallery felt like web UI.
`GUEST_MOTION_GATE_02_LAYERED.html` also failed Android review on 2026-10-02. Root cause: it attempted to simulate depth by clipping and independently moving regions copied from one flattened raster. Real-device motion exposed hard seams, duplicated image regions, rectangular fragments and broken continuity.

Technical conclusion: premium object-led motion CANNOT be built reliably by slicing a flattened JPG/PNG after generation. The visual assets must be authored/exported as true independent layers from the beginning.
Required source planes for the next test: clean background plate; transparent veil/silk; transparent pearls/ornament; transparent foreground floral/object layer; optional particles/light overlay; typography kept native in HTML/CSS.

## Motion Gate 03 — FAIL
`GUEST_MOTION_GATE_03_TRUE_LAYERS.html` was reviewed on Android on 2026-10-02 and failed the premium-motion gate.
Unlike Gate 02, the failure was not artifact seams. The DOM/SVG reconstruction was visually simplified and the resulting depth motion was too weak/basic to represent the premium generated artwork. It proved that rebuilding rich generative art as hand-authored web layers is the wrong production method.

Technical conclusion after Gates 01–03:
- do not animate the flattened still as one block;
- do not fake depth by clipping copies of the still;
- do not manually reconstruct rich AI art as simplified DOM/SVG layers.
The next viable motion route is image-to-video on the actual premium still using a dedicated generative video model, then integrating the resulting video/loop with native HTML text and interaction.

## Image-to-video motion — PASS
Owner created and approved a 6-second premium image-to-video clip from the `gold` still on 2026-10-02. Independent review confirms the clip preserves composition while adding coherent fabric/ornament/light motion without the artifact failures seen in Gates 01–03.
This validates the production architecture: premium generated still → dedicated image-to-video motion → native HTML/CSS typography/interactions/CTA layered on top.
Do not return to handcrafted layered-motion experiments.

## Launch master plan
See `guest/GUEST_30_DAY_LAUNCH_MASTER_PLAN_2026-10-02.md`.
Launch deadline: 30 days.
Launch catalog minimum: 5 premium designs; target: 6.
From this checkpoint ChatGPT takes project direction/execution control; owner interaction is limited to finished mobile review and necessary external UI actions.

## Exact NEXT ACTION
1. Start REAL catalog Design 01 — VEIL LIGHT.
2. Keep one dominant language only: translucent veil + warm light; remove pearls as a primary cue and keep florals minimal/absent.
3. Approve the static direction first, then create one image-to-video motion clip using the validated motion method.
4. Build the complete modular invitation shell only after static + motion pass.
5. Then scale the validated production system across the remaining launch catalog lines.


## Design 01 — VEIL LIGHT — STATIC HERO PASS
Reviewed 2026-10-02.
Approved static hero: translucent couture bridal veil in warm ivory/champagne light, with subtle architectural depth and generous negative space.
Why it passes:
- one dominant material language;
- unmistakably bridal once paired with native names/date;
- premium depth without decorative overload;
- no pearls/floral dependency;
- strong motion potential;
- visually distinct from rejected `gold`.

Next gate: ONE 5–8 second image-to-video clip from this exact hero. Preserve composition; animate veil planes + ambient light only; restrained push-in; no new objects or morphing.
Do not build the rest of VEIL LIGHT until motion passes.


## Design 01 — VEIL LIGHT — MOTION PASS
Reviewed 2026-10-02 from 480p image-to-video test.
Motion gate PASS.
Observed:
- veil planes move with convincing independent depth;
- material remains coherent;
- ambient light motion feels premium;
- no obvious clipping/seam failures or destructive morphing;
- motion quality is sufficient to validate the production method.

The preview camera push is stronger than desired for final typography-safe use. Do NOT spend credits on a 720p final yet. Final motion render should be generated only after native typography placement/crop is locked, with a more restrained or locked camera so the text safe area remains stable.

VEIL LIGHT is now approved in static + motion direction.
NEXT: build the real modular invitation implementation for Design 01 before generating final 720p motion.


## Design 01 — VEIL LIGHT — FULL DESIGN CANDIDATE
Conversation artifact prepared 2026-10-02: `GUEST_VEIL_LIGHT_DESIGN_01_CANDIDATE.html`.

Scope:
- full mobile-first invitation composition;
- premium opening;
- approved VEIL LIGHT motion used as hero/closing art layer;
- dramatic typography + high-contrast date moment;
- countdown;
- story module;
- venue/location module;
- agenda;
- swipe gallery treatment;
- CTA-only RSVP;
- designed closing;
- no visible GUEST/WeddlySmartDesign branding.

Important review note:
- the current 480p motion is intentionally retained as the validated preview asset; do not spend final 720p credits until typography/crop is approved;
- couple-photo/gallery content is represented with VEIL LIGHT art crops for this design gate because no real couple photo set is attached. Review composition, rhythm, hierarchy and motion; real photos will replace those art crops through the configured photo system.

Static QA before owner review:
- standalone HTML;
- JavaScript syntax PASS;
- one embedded WebP art asset + one embedded MP4 motion asset;
- no external runtime image/video paths;
- no visible GUEST/WeddlySmartDesign brand copy;
- RSVP is CTA only, no inline form.

NEXT: owner Android review of the full candidate. Do not start Design 02 until VEIL LIGHT visual system passes or receives bounded corrections.


## Design 01 — VEIL LIGHT — V2 DYNAMIC + SIGNATURE PARITY CANDIDATE
Prepared 2026-10-02.
Conversation artifact: `GUEST_VEIL_LIGHT_DESIGN_01_V2_DYNAMIC_FULL.html`.

Changes from first full candidate:
- opening rebuilt: full-screen moving veil; removed split translucent web-curtain effect;
- hero retained because it passed owner review;
- removed the two overly editorial/book-like intermediate pages;
- added immersive celebration photo section with restrained scroll depth + live countdown;
- story retains real couple photo with designed reveal;
- venue rebuilt as an interactive one-or-two-location system:
  - ceremony and celebration can be separate;
  - if only one venue is used, the second state can be hidden;
  - actions are explicit pill buttons (Maps / calendar), no ambiguous arrows;
- agenda rebuilt and realigned as a progressive moments timeline with scroll activation and line progression;
- optional Signature-parity modules included: bus, hotel, dress code, gift, playlist;
- configurable font-family support implemented via internal font presets;
- gallery remains native horizontal swipe with four real couple photos;
- RSVP CTA retains button affordance but removes arrow;
- closing retained.

Important product rule now sealed in requirements:
GUEST cannot provide fewer invitation options than Signature.

Next: Android owner review of V2. Evaluate opening, interior dynamism, location clarity, agenda alignment, optional-module presentation, and overall premium continuity.


## Design 01 — VEIL LIGHT — V3 HUMAN + DYNAMIC
Prepared 2026-10-02.
Conversation artifact: `GUEST_VEIL_LIGHT_DESIGN_01_V3_HUMAN_DYNAMIC.html`.

Owner feedback incorporated:
- copy must sound like a couple writing to loved ones: warm, familiar, natural; never corporate/editorial;
- mobile legibility increased across labels, functional copy and buttons;
- ceremony/celebration real photo integrated to reduce abstraction;
- opening rebuilt as an intimate photo-led prelude rather than a duplicate cover;
- story rebuilt as image-led rather than book/editorial page;
- locations use real imagery and explicit tappable controls;
- agenda rebuilt into large progressive moment stages instead of a conventional web timeline;
- optional Signature-parity modules are no longer repeated carousel cards; they use varied stacked treatments;
- RSVP wording made warmer and more personal;
- approved hero/gallery/closing language retained where possible.

Static QA:
- standalone HTML;
- HTML parse PASS;
- JavaScript syntax PASS;
- no external runtime media dependencies;
- no visible GUEST/WeddlySmartDesign branding;
- real ceremony photo embedded;
- opening no longer repeats large couple names before hero.

Next: Android owner review of V3. Evaluate readability, warmth/familiarity, interior dynamism and premium continuity.


## Design 01 — VEIL LIGHT — V3 REJECTED
Android review 2026-10-02. V3 is rejected and must NOT be used as the next baseline.

Observed failures:
- opening photo treatment clashes with the approved VEIL LIGHT hero instead of leading into it;
- hero date/location lose legibility because of tiny low-contrast type;
- ceremony image immediately after hero is visually muddy and badly integrated;
- story photo crop is off-center;
- display serif used for multiple headings is too thin/fragile on mobile and reduces readability;
- agenda became longer and more editorial than V2, with weak rhythm;
- after agenda, several optional-information blocks break the grid and wrap copy into narrow unreadable columns;
- closing secondary copy/date/location is too faint/small despite the names remaining attractive.

Rollback rule:
- V2 is the last valid structural baseline.
- Do NOT patch V3.
- Build V4 from V2, carrying over ONLY the useful product requirements learned after V2: warmer couple voice, larger functional text, real ceremony/venue imagery, Signature feature parity and interior dynamism.
- Preserve V2 strengths: coherent opening/hero relationship, shorter agenda, cleaner alignment, gallery, RSVP and closing composition.

V4 correction priorities:
1. opening must share VEIL LIGHT material/light grammar and reveal the hero rather than compete with it;
2. increase hero metadata size/contrast;
3. integrate ceremony/celebration image later and intentionally, not immediately below hero;
4. recrop story photo around the couple;
5. replace fragile display heading face with a more readable elegant serif;
6. keep agenda compact and dynamic — never a long editorial chapter;
7. rebuild optional modules on a robust single-column/mobile grid; no narrow text columns;
8. make all interactive elements unmistakable buttons without arrow decoration;
9. raise closing secondary-copy contrast/size.

Do not start Design 02 until V4 of VEIL LIGHT passes Android.
