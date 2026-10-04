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


## Design 01 — VEIL LIGHT — OPENING MOTION PASS
Reviewed 2026-10-03 from the 5s Recraft image-to-video opening test.

PASS:
- ivory monogram panel slides laterally in a restrained, premium way;
- reveal visually belongs to the approved VEIL LIGHT world;
- opening does not compete with hero;
- monogram remains attached to the panel and exits naturally;
- motion is calm and readable.

Integration note:
- final video frame still contains the architectural opening frame / a small residual panel edge, so do NOT treat the video end as the hero itself.
- In V4, crossfade/cut during the last ~0.3–0.5s into the approved hero motion so the frame disappears and the opening feels like one continuous reveal.
- Do not spend credits regenerating this opening unless Android integration exposes a problem.

NEXT: build VEIL LIGHT V4 from V2 baseline using this opening motion and the previously sealed V4 correction priorities.


## Design 01 — VEIL LIGHT — V4 CANDIDATE
Prepared 2026-10-03 from V2 baseline. V3 remains rejected.

Conversation artifact: `GUEST_VEIL_LIGHT_DESIGN_01_V4_CANDIDATE.html`.

V4 changes:
- integrates the approved Recraft monogram-panel opening video;
- opening crossfades during the final ~0.5s into the approved VEIL LIGHT hero rather than using the opening end frame as hero;
- hero visual language retained; date/location/kicker enlarged and contrast increased for mobile;
- removes the immediate post-hero ceremony-photo block that failed in V3;
- story rebuilt from V2 with readable Playfair Display headings, larger body copy and a centered real couple photo;
- countdown retained as a compact bridge, not an editorial chapter;
- location rebuilt as a full-bleed real ceremony/venue image with explicit Maps + calendar buttons;
- current sample uses one shared venue; hidden structural template preserves support for separate ceremony/celebration locations;
- agenda rebuilt as a compact four-moment progressive timeline with short, familiar copy;
- bus/hotel/dress code/gift/playlist rebuilt as expandable single-column rows, not repeated carousel cards;
- RSVP copy made warmer and larger;
- closing composition retained with larger, higher-contrast secondary text.

Internal mobile QA before owner review:
- viewport 390x844;
- document scrollWidth == clientWidth (no horizontal overflow);
- opening completes and unlocks body;
- hero video is playing after opening transition;
- 5 optional modules render as functional expandable rows;
- first accordion opens without layout overflow;
- JavaScript page errors: none.

NEXT: owner Android review of V4. Judge coherence of new opening → hero transition, mobile legibility, story crop, location realism, agenda compactness/dynamism, optional-module presentation and overall premium/familiar feel.


## Design 01 — VEIL LIGHT — V4 REJECTED
Owner review 2026-10-03. V4 improves coherence and legibility but still fails the premium catalog gate.

Core failure:
The invitation starts strongly, loses visual energy through the middle, then ends well. Interior sections feel too flat/text-led compared with the hero and closing.

Owner feedback / V5 rules:
- opening concept improves but must become a fully closed door/panel first; when it opens, the already-moving VEIL LIGHT hero should be visible immediately behind it;
- no accordion/+ interactions for practical information: guests should not have to tap repeatedly just to read basic wedding information;
- practical modules must be visible, concise and designed, using iconography, hierarchy and purposeful movement rather than blocks of text;
- interior sections need 2–3 clear dynamic/design moments so the invitation does not deflate after the hero;
- celebration copy currently lacks sufficient contrast/readability and must be fixed;
- text-heavy sections still require art direction: typography, icons, spatial composition, rhythm and motion must carry design even when information density is high;
- V5 should preserve the strong hero/gallery/RSVP/closing language while rebuilding the weak middle.

V5 narrative objective:
Strong opening -> premium hero -> emotional/photo-led story -> immersive venue/celebration -> compact animated agenda -> designed practical information -> gallery -> RSVP -> strong close.
The quality curve must stay high throughout; no flat “utility” valley.

Do not start Design 02 until VEIL LIGHT V5 passes Android.


## V4 VIDEO REVIEW — PRE-V5
Reviewed from full Android recordings on 2026-10-03 before any V5 work.

What the video confirms:
- Opening is coherent in palette but still feels like a partial opening state: the panel is already ajar and the reveal does not deliver a clean closed-door -> moving-veil payoff.
- Hero is one of the strongest moments. Preserve art direction and motion. Metadata is more readable than earlier versions but still visually secondary.
- Story/photo section is acceptable but still typography-led; it does not create a new visual high point after the hero.
- Venue/celebration photo improves realism, but overlay copy competes with a very busy image and loses legibility. Buttons are readable but the whole section still feels layered on top of a photo rather than art-directed with the photo.
- Agenda is compact and aligned, but reads mainly as a dark editorial timeline. Motion/progression is too subtle to become a memorable invitation moment.
- Practical information section (BJS/hotel/dress code/gift/playlist) is the weakest area:
  - accordions/+ hide information and add unnecessary taps;
  - no iconography;
  - too much repeated text hierarchy;
  - long cream page with little visual rhythm;
  - repeated rows make it feel like settings/help UI, not a wedding invitation;
  - expanded states become long text blocks and flatten the experience further.
- Gallery restores energy immediately because photography + large scale + horizontal movement create emotion again.
- Core pattern: premium hero -> increasingly flat utility middle -> photography restores premium feeling.
- V5 must eliminate the utility valley, not merely restyle it.

V5 pre-build rules from video:
1. Opening starts fully CLOSED. One monogram only. On interaction, rigid panel(s) move away and reveal the actual already-playing VEIL LIGHT hero behind them. Do not use a partially open raster as the opening state.
2. Preserve hero and closing visual grammar.
3. Every middle section must have a visual device beyond text: image, iconography, timeline movement, spatial composition, or material transition.
4. Venue/celebration: redesign around the real image, with protected text zone / controlled gradient / separated copy plane so text never sits directly over visual noise.
5. Agenda: max four moments, compact; use clear icons and a progress/reveal system that is visibly dynamic, not a long chapter.
6. Practical modules: NO accordions, NO plus signs. All essential info visible at a glance. Use distinct icon-led modules with short copy and direct buttons where needed.
7. Practical modules should vary composition/rhythm while remaining one coherent system; no repeated identical cards/rows.
8. Maintain mobile legibility: functional copy larger, darker, shorter.
9. Dynamic moments inside invitation: at least venue/celebration, agenda, and practical-info transition must visibly respond to scroll/tap without becoming a generic web animation.
10. Quality curve must remain high from hero through RSVP; photography cannot be the only thing that restores premium feel.

Do not build V5 from V4 blindly. Reuse only V4 strengths and explicitly redesign the weak middle around these rules.


## Design 01 — VEIL LIGHT — V5 CANDIDATE
Prepared 2026-10-03 after full V4 Android video review.

Conversation artifact: `GUEST_VEIL_LIGHT_DESIGN_01_V5_CANDIDATE.html`.

V5 redesign decisions:
- opening is now a fully CLOSED two-panel ivory door over the already-playing approved VEIL LIGHT hero;
- opening uses one centered monogram and opens directly onto the moving hero; no partially-open raster opening state;
- hero visual grammar preserved; date/place metadata kept large and high-contrast;
- story is photo-led with warmer couple voice and centered real couple photography;
- compact countdown retained as a visual bridge;
- venue/celebration uses the real ceremony image with a protected ivory reading plane, so copy never competes directly with visual noise;
- agenda rebuilt as a compact four-moment icon-led progressive timeline with a visibly filling line and staged activation;
- practical section completely rebuilt:
  - NO accordions;
  - NO plus signs;
  - bus, hotel, dress code, gift and playlist are visible at a glance;
  - each module has clear iconography, short warm copy and direct button where an action exists;
  - dress code uses a contrasting full-width treatment to break repetition;
  - playlist has restrained ambient icon motion;
- gallery, RSVP and closing retain the strong visual grammar from prior approved areas;
- all important functional copy uses larger/darker mobile-readable typography.

Product parity retained:
- bus;
- hotel;
- dress code;
- gift;
- playlist;
- one shared location or optional separate ceremony/celebration location template;
- agenda/moments;
- countdown;
- story;
- gallery;
- RSVP CTA;
- configurable typography support remains a product requirement.

Internal static QA before owner review:
- standalone HTML;
- HTML parse PASS;
- JavaScript syntax PASS;
- no /mnt/data runtime paths;
- no external runtime image/video dependencies;
- opening, hero and closing reuse one embedded hero-motion source;
- real couple + ceremony imagery embedded.

Browser screenshot automation was unavailable in the execution environment for this pass, so the decisive QA remains owner Android review. Do not call V5 approved until that review passes.

NEXT: owner Android review. Evaluate specifically:
1. closed-door -> moving-hero reveal;
2. whether the middle now maintains the hero's quality level;
3. venue copy readability;
4. agenda alignment + felt movement;
5. practical-info design and scanability;
6. overall warmth/familiarity;
7. close continuity.


## Design 01 — VEIL LIGHT — V5 REJECTED
Owner Android review 2026-10-03. V5 does not pass the catalog gate.

Full-video findings:
- opening transition is structurally wrong: closed-door screen fades to an empty beige intermediate state before hero appears. It must feel as if the door physically reveals the already-moving hero behind it with NO blank intermediate frame;
- 03/04 remain the quality valley;
- numeric section labels (01/02/03/04/05/06) make the invitation feel like a book/editorial chapter system and must be removed everywhere;
- interior must flow as one continuous wedding invitation, not stacked numbered sections;
- current iconography is too generic/basic and reads like UI icon set rather than premium art direction;
- practical information still feels like product/service cards even without accordions;
- too much copy appears in repeated blocks without enough visual rhythm or designed transitions;
- celebration/venue text must never sit at insufficient contrast over photography;
- strong hero/gallery/closing still prove the direction works when scale, photography and motion are present.

V6 structural rules:
1. NO numbered sections anywhere.
2. NO chapter/editorial labels such as 01/02/03/04.
3. NO generic circular UI icons.
4. Build one continuous visual flow; transitions should visually connect adjacent moments.
5. Door opening must reveal the live hero directly underneath; no fade to blank / no separate intermediate opening video.
6. Interior design must use bespoke lightweight iconography/illustration or typographic symbols that belong to VEIL LIGHT, not app-style icons.
7. Agenda and practical info must be concise, visual and in motion, but never card-dashboard UI.
8. Use real photography/material transitions to carry energy through the middle.
9. Keep copy warm and family-like, but shorten it further where design is carrying meaning.
10. V6 should be treated as a compositional redesign of the middle, not another skin over V5.

Do not start Design 02 until VEIL LIGHT passes.


## Design 01 — VEIL LIGHT — V6 FLUID CANDIDATE
Prepared 2026-10-03 after V5 rejection.

Conversation artifact: `GUEST_VEIL_LIGHT_DESIGN_01_V6_FLUID.html`.

Structural redesign:
- all numbered/chapter labels removed;
- no 01/02/03/04/05/06 section system;
- opening rebuilt as a real closed two-panel overlay directly above the already-playing hero video;
- no blank/fade intermediate state between opening and hero;
- story flows directly from hero with short warm copy + real couple photo;
- countdown treated as a material bridge rather than a chapter;
- venue uses full real ceremony image, then a separate protected ivory copy plane with clear action buttons;
- agenda rebuilt as one flowing route with a hand-drawn path that animates and four concise moments; no generic icon circles;
- practical information rebuilt as one continuous composition, not cards/accordions:
  - bus, hotel, dress code, gift and playlist always visible;
  - bespoke thin line-art illustrations integrated as large watermarks;
  - alternating composition for rhythm;
  - direct CTA only where needed;
  - no plus signs / no hidden information;
- gallery uses all four real couple photos;
- RSVP and closing retain the strong visual language.

Structural QA:
- standalone HTML;
- HTML parse PASS;
- JavaScript syntax PASS;
- no duplicate IDs;
- no /mnt/data runtime paths;
- no external image/video runtime paths;
- no numbered chapter labels;
- no accordion behavior.

Decisive QA remains Android owner review, especially:
1. true closed-door -> live hero reveal;
2. whether agenda now feels like invitation motion rather than editorial timeline;
3. whether practical information remains premium despite information density;
4. whether the quality curve stays high through the middle.


## Design 01 — VEIL LIGHT — V6 REJECTED
Owner Android recording reviewed 2026-10-04. V6 improves continuity but still does not pass the premium catalog gate.

What improved:
- fully closed opening now reads as a true threshold;
- direct center-slit reveal into the live hero is materially better than V4/V5 and removes the blank transition;
- removal of numbered chapters improves flow;
- venue photography and gallery keep the invitation grounded and emotional;
- overall layout is cleaner and less app-like than V5.

Why it still fails:
- opening reveal is still slightly mechanical: the narrow slit exposes fragments of hero copy before the door clears; the opening should clear faster and reveal the hero as a full visual payoff;
- story still falls back into a large serif editorial/book composition on a pale page;
- countdown is clean but visually passive;
- venue image is strong, but its information block below remains mostly utility layout rather than an art-directed continuation;
- agenda remains a dark editorial timeline with a decorative path; it is better aligned but still reads like a designed article rather than a cinematic wedding moment;
- practical information remains the main quality valley: despite removing accordions, it is still a sequence of rectangular information rows with basic line illustrations and repeated button patterns;
- bespoke line illustrations are not yet premium enough and feel like interface icons at larger scale;
- interior motion is too subtle to change the perceived flatness;
- gallery and close again recover energy, proving the middle still depends too heavily on static text/information structures.

V7 direction:
- keep the closed-door concept and hero, but shorten the slit phase and clear panels rapidly enough that the hero arrives as a full reveal;
- remove large editorial heading compositions from story/agenda/practical sections;
- stop solving practical content as rows/cards/icons;
- use a continuous spatial composition with fewer words and stronger visual anchors;
- practical modules should read as one designed wedding-information scene, not five independent UI blocks;
- agenda should use scale, motion and rhythm rather than a standard vertical timeline;
- if interior visual depth cannot be achieved with HTML alone, create one or two additional VEIL LIGHT art assets in Recraft specifically for the middle instead of compensating with generic interface illustration.

Do not start Design 02 until VEIL LIGHT passes Android.


## Design 01 — VEIL LIGHT — V7 REJECTED
Owner Android review 2026-10-04. V7 is fully rejected and must not be used as a baseline.

Critical failures:
- assistant accidentally exposed internal design/development notes as guest-facing copy (examples: explaining what the section “can” do, what “the idea is”, what a button “would” do, or how the gallery “can” work);
- this made the invitation read like a product demo/sales page rather than a couple inviting their loved ones;
- the approved Recraft opening-door artwork was abandoned and replaced by a new HTML/CSS-built door, which changed the visual language and violated the agreed direction;
- agenda/practical copy was written as implementation commentary, not invitation copy;
- practical section again became a sequence of product-like information cards;
- V7 therefore failed both product voice and art-direction continuity.

Non-negotiable rollback rules for the next version:
1. Use the ACTUAL approved Recraft opening-door asset/motion. Do not redraw/rebuild the door in HTML/CSS.
2. Guest-facing copy must contain ZERO implementation/product/demo language. Every line must sound like the couple speaking to their guests.
3. Before any next candidate is sent, perform a copy audit searching for meta phrases such as “aquí”, “puede”, “la idea”, “botón”, “sección”, “bloque”, “GUEST”, “RSVP conectado”, “mostrar”, “opción”, “template”, “puede incluirse” when they are being used as implementation commentary.
4. Keep the two new Recraft interior assets approved, but design around them with genuine invitation copy only.
5. Do not use generic card grids to solve practical information.
6. V7 is not a visual or copy baseline. Rebuild from the last approved visual pieces: approved Recraft door + approved hero + real couple/ceremony photos + approved agenda asset + approved practical-info asset + approved closing language.
7. Next candidate must be reviewed internally as a real invitation from start to finish before owner Android review.

Do not start Design 02 until VEIL LIGHT passes.


## Design 01 — VEIL LIGHT — V8 CANDIDATE
Prepared 2026-10-04 after V7 rejection.

Conversation artifact: `GUEST_VEIL_LIGHT_DESIGN_01_V8_CANDIDATE.html`.

New production split:
- owner-created Canva opening/cover video is used intact at its native timing; DO NOT speed it up because shortening it destroys the fluid transition;
- the opening + cover now remain one continuous media piece;
- native editable names/date/location appear over the cover phase;
- the two approved Recraft interior assets are used for agenda and practical information;
- owner demonstrated she can create simple premium agenda icon/motion assets in Canva if a later gate proves they materially improve the result. Do not delegate routine design work to owner.

V8 structure:
- no numbered chapters;
- no product/demo/implementation copy;
- warm couple-to-guests voice throughout;
- story + real couple photography;
- real ceremony/venue photography;
- agenda rebuilt as a cinematic sticky scene: each moment appears individually over the Recraft agenda artwork while scrolling;
- practical information rebuilt as one cinematic sticky scene: bus/hotel/dress code/gift/playlist appear sequentially over the Recraft hospitality artwork, with no accordion and no repeated cards;
- gallery swipe with real couple photos;
- direct RSVP CTA;
- motion closing retained.

QA before owner review:
- standalone/self-contained HTML;
- all media embedded as data URIs;
- HTML parse PASS;
- JavaScript syntax PASS;
- copy audit confirms no implementation/demo language in guest-facing text;
- attempted automated Chromium visual QA was blocked by environment browser policy, so Android owner review remains decisive.

NEXT: owner Android review of V8. Focus on:
1. Canva opening/cover continuity;
2. whether agenda now feels cinematic rather than editorial;
3. whether practical info reads as an invitation rather than product UI;
4. mobile copy legibility;
5. overall quality curve through the middle.
