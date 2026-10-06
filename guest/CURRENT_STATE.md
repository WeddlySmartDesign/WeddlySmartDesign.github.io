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


## Design 01 — VEIL LIGHT — V8 TECHNICAL REVIEW
Owner Android recording reviewed 2026-10-04 before aesthetic/detail review.

Technical failures found in V8:
- wrong poster image before opening: couple photo was shown before Canva entry video started;
- very tall sticky-scroll agenda/practical sections caused Android blank/beige frames and unreliable compositing during scroll;
- sticky progression made the middle feel broken because content temporarily disappeared while scrolling;
- body unlocked too early relative to the full Canva entry/cover transition.

Corrective candidate created: `GUEST_VEIL_LIGHT_DESIGN_01_V8_1_TECH_FIXED.html`.

V8.1 technical corrections:
- poster replaced with actual first frame of Canva entry video;
- original Canva playback speed preserved;
- cover copy appears at ~5s; body unlock delayed slightly to let transition settle;
- agenda rebuilt in normal document flow (no sticky / no 330svh spacer);
- practical section rebuilt in normal document flow (no sticky / no 410svh spacer);
- sticky scroll controller JS removed;
- JavaScript syntax PASS;
- next review should focus first on whether technical failures are gone, then on visual/detail refinements.


## Design 01 — VEIL LIGHT — V8.2 AGENDA/GALLERY ITERATION
Prepared 2026-10-04 after V8.1 technical pass.

Conversation artifact: `GUEST_VEIL_LIGHT_DESIGN_01_V8_2_AGENDA_GALLERY.html`.

Changes:
- agenda keeps ONE fixed VEIL LIGHT background image;
- only the four moments move horizontally over that background;
- no repeated background screen per moment;
- no agenda icons by default in VEIL LIGHT; Canva/SVG icon assets remain optional if a later design gate proves they add value;
- agenda has explicit swipe affordance + progress dots.

Gallery:
- now reads unmistakably as a carousel;
- each slide occupies ~90% width and ~82svh height;
- next-slide edge remains visible;
- swipe label + progress dots added;
- each image has configurable focal-point variables for scalable per-couple cropping;
- last sample image uses contain-over-blurred-background to preserve both partners rather than crop one person out.

Scalability rule reaffirmed:
- optional modules (bus/hotel/dress code/gift/playlist) must be removable independently without creating layout holes;
- gallery image focus/crop must be configurable per uploaded photo rather than hard-coded to one sample couple;
- invitation must remain visually complete even when optional modules are absent.

Next: Android owner review of V8.2, focusing specifically on agenda behavior and gallery clarity/cropping before further aesthetic refinement.


## Design 01 — VEIL LIGHT — V8.3 REFINED
Prepared 2026-10-04 after V8.1 technical pass and V8.2 visual review.

Conversation artifact: `GUEST_VEIL_LIGHT_DESIGN_01_V8_3_REFINED.html`.

Changes:
- agenda simplified to one atmospheric background and one-screen composition;
- agenda copy reduced to hour + moment only;
- agenda rows enter progressively but remain all visible together;
- practical information now uses the newly approved subtle Recraft VEIL LIGHT background;
- practical modules no longer use cards; they sit directly on the soft background with short copy + understated links;
- practical module layout auto-reflows according to visible item count (1–5), so removing hotel/bus/dress code/gift/playlist does not leave dead gaps;
- practical title contrast/legibility increased;
- gallery remains an explicit horizontal carousel with visible next-card peek + progress dots;
- all four gallery images now use individual focal points so both members of the couple stay visible where possible;
- gallery captions removed so photography dominates.

Next: owner Android review of V8.3 focusing on agenda density, practical-section calmness/scalability and gallery crops.


## Design 01 — VEIL LIGHT — V8.4 REFINED
Prepared 2026-10-04 from the technically stable V8.3.1.

Localized corrections only:
- agenda remains one visual screen and now integrates its heading inside the same scene;
- agenda content is reduced to hour + moment only;
- bus/hotel are informational in the invitation: reservation/selection belongs to GUEST RSVP when enabled;
- practical section uses the subtle approved VEIL LIGHT background and reflows automatically for 1–5 enabled modules;
- no bus/hotel CTA duplication;
- practical copy is shorter and more structured for scalable personalization;
- gallery is shorter/larger-width to preserve more of landscape photos while remaining clearly swipeable;
- each gallery image has an independent focal point, intended to become a configurable per-photo property in personalization.

Pending owner Android review:
1. agenda visual balance;
2. practical density with 5 modules;
3. gallery crop of all four demo photos;
4. verify transition quality before further cosmetic refinement.


## Design 01 — VEIL LIGHT — V8.6 SCALABLE CANDIDATE
Prepared 2026-10-04 from the latest owner-reviewed baseline.

Artifact: `GUEST_VEIL_LIGHT_DESIGN_01_V8_6_SCALABLE.html`.

Changes limited to Practical + Gallery:
- Practical uses the approved subtle VEIL LIGHT background with lighter wash so the art remains visible.
- Practical layout is configuration-driven and reflows automatically for 1–5 enabled modules:
  - 1 centered;
  - 2 balanced pair;
  - 3 = 2 + centered 1;
  - 4 = 2x2;
  - 5 = 2–1–2.
- Bus remains information-only when RSVP collects transport choice.
- Hotel remains information-only but includes a configurable “Ver hotel” website link.
- Gift / playlist actions remain optional only when the couple uses them.
- No empty reserved spaces for disabled modules.

Gallery:
- mixed-aspect template;
- per-photo mode can be FULL (no crop) or CROP (focus point configurable);
- photo orientation is detected automatically (landscape / portrait / square);
- demo photos use FULL mode to guarantee no person or landscape is lost;
- blurred derived background makes landscape photos immersive without forcing a vertical crop;
- only one swipe cue is shown.

Template rule reaffirmed:
The visual design must remain complete and premium with any valid combination of optional modules and with mixed photo orientations. Personalization must be data/configuration driven, not manual redesign per wedding.

QA:
- JavaScript syntax PASS;
- practical 1–5 reflow logic present;
- hotel link field present;
- gallery per-photo fit/orientation system present;
- one swipe cue only.


## VEIL LIGHT V8.11 FAIL — scalability attempt rejected
Owner review 2026-10-04.
V8.11 worsened two areas while trying to make them more generic:
- “Nuestra historia” used full-image adaptation and lost the immersive premium impact of the previous version.
- the ceremony + celebration solution became an oversized information card that covered too much of the venue image and read like app/web UI.

Rollback rule:
- V8.10 remains the visual baseline for these areas.
- Story scalability must be handled by configuration (crop/full + focal point), not by forcing every image into a weak full-width presentation.
- Location scalability must support 1 or 2 places with compact rows over the venue image, not a large white card.


## TEMPLATE-FIRST RESET — 2026-10-04
Owner correction: GUEST catalog work must be template-first, not demo-first.

Non-negotiable:
- Every invitation design is a reusable configuration system.
- Do not approve or present a visual solution that only works for the current demo data/photos.
- Personalization target: minutes, not redesign.
- Build and validate the configuration matrix BEFORE further visual polishing.

Minimum variant matrix for every catalog design:
- Cover: names + date + place always.
- Story: optional; arbitrary portrait/landscape/square photo; safe focal/fit handling.
- Locations: 1 shared location OR 2 locations (ceremony + celebration).
- Agenda: 1–5 moments.
- Practical: 0–4 modules, with accommodation/transport sub-modes already defined.
- RSVP: one CTA to GUEST; no duplicated transport/accommodation decision UI.
- Gallery: 1–4 photos, mixed orientations, per-photo fit/focus.
- Closing: remains coherent regardless of omitted optional sections.

Exact next step:
1. STOP visual iteration on VEIL LIGHT.
2. Build the master GUEST invitation configuration matrix and questionnaire/data schema.
3. Define layout behavior and QA cases for every variant.
4. Only then return to VEIL LIGHT and implement the template once against that system.
5. Owner should review finished template variants, not experimental one-off demos.


## TEMPLATE-FIRST SYSTEM V1 — LOCKED 2026-10-04

Created and canonical on guest-independent:
- guest/GUEST_INVITATION_MASTER_CONFIGURATION_MATRIX_V1.md
- guest/GUEST_COUPLE_QUESTIONNAIRE_V1.md
- guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json
- guest/GUEST_TEMPLATE_QA_MATRIX_V1.md
- guest/GUEST_VEIL_LIGHT_TEMPLATE_CONTRACT_V1.md

Key decisions:
- catalog designs are configuration systems, never demo-first one-offs;
- target personalization time is minutes;
- Cover: names + date + short place always;
- Story: off/text/text+photo; crop/full + focal configuration;
- Locations: 1 shared or 2 separate;
- Agenda: 0–5 moments;
- Practical: 0–4 modules (Bus, Accommodation, Gift, Playlist);
- Dress code is a location/event micro-detail, not a fifth Practical module;
- Accommodation includes ON_SITE / ROOM_BLOCK / COUPLE_MANAGED / RECOMMENDED / EXTERNAL_BOOKING;
- RSVP decisions are derived from the same config and are not duplicated inside the invitation;
- Gallery: 0–4 photos with per-photo CROP/FULL + focus;
- typography is limited to template-approved variants;
- every template must pass the canonical QA matrix before owner visual approval.

VEIL LIGHT:
- V8.x artifacts remain visual references only;
- do not keep patching demos;
- next implementation is config renderer + explicit state layouts per GUEST_VEIL_LIGHT_TEMPLATE_CONTRACT_V1.md;
- opening personalization must not require Canva/Recraft editing per couple; reusable art/motion and dynamic initials/names must be separated.

Schema parse check: PASS

Exact next:
1. implement a reusable config renderer/test harness for VEIL LIGHT;
2. implement every template state from the contract;
3. run automated configuration QA cases;
4. only after PASS, send owner a finished VEIL LIGHT template review.


## QUESTIONNAIRE V1 REFINEMENT — 2026-10-04

Owner refinement implemented:
- Cover fixed content: “Nos casamos” + names + date.
- Cover location and time are independent optional fields.
- Story title is fixed by template.
- Story offers five approved preset texts plus custom free text.
- Location block no longer includes Save date; calendar action belongs to GUEST RSVP.
- Section titles are fixed by the catalog template and are not editable by the couple.
- Typography choice is simplified to one global display-style selection from template-approved visual options; no font names or per-section font choices.
- Couple questionnaire principle: the couple supplies content, not design. Conditional questions only appear when relevant; design/crop/layout terminology is hidden.
- Canonical questionnaire, master matrix, schema and VEIL LIGHT contract were updated to reflect these decisions.
- Conversation artifact created for owner review: GUEST_COUPLE_QUESTIONNAIRE_UI_V1.html.

Exact next:
1. Owner reviews questionnaire UX/wording.
2. Apply owner feedback to canonical questionnaire before building VEIL LIGHT renderer.
3. Then implement the VEIL LIGHT template against the locked config/schema.


## QUESTIONNAIRE UX V2 — PREVIEW-FIRST

Owner review of V1 found a UX problem: couples know which catalog design they bought, but they should not have to understand internal sections such as Story, Practical or Agenda.

Locked direction:
- each questionnaire step shows a live preview of the corresponding section in the selected template;
- remove visible numeric step count such as 1/6;
- show only progress + human-facing section label;
- questionnaire asks for wedding information, not design/layout decisions;
- RSVP step configures the existing GUEST RSVP, not a new/second RSVP;
- transport/accommodation RSVP questions are derived automatically from prior answers;
- final review shows exact resolved data/text, section by section, with Edit actions and an explicit confirmation checkbox.

Conversation prototype:
- GUEST_COUPLE_QUESTIONNAIRE_UI_V2_PREVIEW_FIRST.html

Next:
- owner reviews V2 questionnaire UX;
- after questionnaire/config is sealed, implement the real VEIL LIGHT renderer against the canonical schema and QA matrix.


## COUPLE QUESTIONNAIRE V3 DIRECTION — LOCKED 2026-10-04
Owner review of questionnaire V2 identified the correct UX boundary:
- show enough of the selected invitation to explain what is being requested;
- do NOT show a polished live finished version with the couple's data, because WeddlySmartDesign remains the designer;
- questionnaire is contextual data collection, not a self-service invitation builder.

Locked corrections:
- header brand always “GUEST by WeddlySmartDesign”; by WeddlySmartDesign in Caveat;
- no visible step fraction such as 1/6;
- restore global approved typography-style choice on Cover;
- real Story / venue / Gallery upload controls;
- optional celebration-venue photo, with template default if absent;
- Agenda auto-sorts chronologically after every edit/add/remove, treating 00:00–05:59 as next-day wedding-night times;
- Bus questionnaire is informational only; transport RSVP behavior is derived automatically;
- Gift modes collect actual bank/Bizum/link/message destination details;
- confirmation section configures the existing attendance flow and includes menu, allergies/dietary, +1, children, derived transport/accommodation and custom questions;
- couple-facing UI does not assume the customer knows the term GUEST/RSVP;
- do not mention Add to calendar in questionnaire;
- final review shows exact supplied content and uploaded filenames, not only selected module names.


## COUPLE QUESTIONNAIRE V4 POLISH — 2026-10-04
Owner review of V3:
- remove all internal catalog/template names (e.g. VEIL LIGHT) from couple-facing questionnaire; customer already chose an invitation and does not need internal design names;
- keep contextual section references, but they are explanatory references only, never a finished live preview;
- Moments reference had insufficient contrast/legibility;
- audit all mobile text sizes: no important explanatory/input/option text may be tiny;
- desktop must have a deliberate wider two-column composition where appropriate, not merely a stretched mobile card;
- mobile and desktop are both first-class QA targets.


## RSVP CHILDREN / +1 PARITY + ONE BUGFIX — 2026-10-04

Verified existing RSVP behavior:
- +1 already owns independent menu, allergies/intolerances, high-chair, transport/accommodation when enabled and custom answers.
- Children already support count + per-child name/age/menu/allergies, but child high-chair was missing.

Production defects found:
- Essential and Signature personalization save code rebuilt `config.questions` from only meal/allergy/transport/plusone.
- More importantly, the ONE production Edge Function `weddly-rsvp` sanitized config with the same reduced key set, so even a direct RSVP save with Children ON returned without `questions.children`.
- That server-side sanitizer explains the reproduced symptom: check Children -> save -> reopen -> Children is unchecked again.
- Public child rendering explicitly requires `config.questions.children === true`.
- Child payload sanitization also omitted per-child high-chair.

Surgical fixes applied:
- ONE/root Essential + Signature now merge/preserve the full questions object.
- ONE production `weddly-rsvp` v19 now preserves `questions.children`, gates child payloads on that setting and preserves per-child `highchair`.
- GUEST `guest-rsvp` v4 preserves per-child `highchair`; its children config key was already correct.
- GUEST guest-independent Essential + Signature receive the same frontend regression protection.
- Child high-chair is collected in public RSVP, shown in operations and editable in manual-response parity.
- wrapper asset versions were bumped to avoid stale cached child/operations scripts.

Mandatory next verification:
- owner repeats ONE test: enable Children -> save -> send/reopen invitation -> child block appears;
- child block: count + name + age + menu + allergies/intolerances + high-chair;
- +1: independent menu + allergies/intolerances + high-chair and applicable service/custom answers.


## VALIDATION — 2026-10-04
- ONE RSVP Children persistence fix: OWNER-VALIDATED on real device. Sequence Children ON -> Save -> reopen now retains Children.
- GUEST couple questionnaire V5 contextual/template-first approach: OWNER APPROVED as current baseline.
- Questionnaire direction remains: contextual references without finished live preview; simple couple-facing language; exact final review; full RSVP parity.
- Do not regress to step-count UI, internal template names, self-service design controls, or reduced RSVP behavior.


## VEIL LIGHT REAL TEMPLATE V1 — 2026-10-05
A first configuration-driven VEIL LIGHT renderer has been built from the master matrix/questionnaire.

No more V8.x patching.

Implemented:
- dynamic scalable opening/cover;
- cover optional place/time;
- typography variants;
- countdown;
- story OFF/text/photo CROP/FULL;
- 1/2 locations;
- agenda 1–5 with automatic chronological sort;
- Practical 0–4;
- RSVP CTA only;
- gallery 1–4 with per-photo fit/focus;
- independent closing.

27 configuration-rule tests PASS.

Checkpoint:
guest/GUEST_VEIL_LIGHT_TEMPLATE_V1_IMPLEMENTATION_CHECKPOINT_2026-10-05.md

Current gate:
owner visual/mobile review of the real renderer. It is not published and not catalog-approved yet.


## VEIL LIGHT TEMPLATE V1 REJECTED / VISUAL MASTER LOCK — 2026-10-05

Owner review of GUEST_VEIL_LIGHT_TEMPLATE_V1_REAL.html: REJECTED.

Failure:
- scalability was achieved by simplifying the approved visual language;
- premium opening/cover transition was lost;
- premium cover motion was reduced;
- approved agenda character was flattened;
- premium closing motion/video was removed;
- result behaved like a generic configurable invitation rather than VEIL LIGHT.

Non-negotiable correction:
- V8.10 is now the VISUAL MASTER for VEIL LIGHT.
- Scalability must be implemented underneath the approved visual/motion system, never by simplifying it.
- Opening video, cover reveal/motion, agenda art direction, practical art direction, gallery language and animated closing are visual assets/behaviors to preserve unless a replacement is demonstrably better.
- Template engineering may change data binding, optional-state rendering, reflow and configuration, but not the approved art direction.

New implementation direction:
- rebuild from the literal V8.10 HTML/CSS/motion baseline;
- inject canonical config into that baseline;
- support Story on/off/text/photo crop/full, Locations 1/2, Agenda 1-5, Practical 0-4, Gallery 1-4, optional cover place/time and approved typography variants;
- default visual state should remain materially indistinguishable from V8.10;
- internal QA variants must not leak generic visual fallbacks into the customer-facing default.

Artifact created for owner review:
- GUEST_VEIL_LIGHT_TEMPLATE_V2_PREMIUM_MASTER.html
- preserves the original V8.10 entry video, cover reveal timing, agenda styling and closing video while adding configuration states.

## VEIL LIGHT — CANONICAL VISUAL MASTER CLARIFIED
Owner clarification after reviewing the real mobile recording:
- The invitation shown in owner-supplied recording 1000094067.mp4 is the visual master that must be scaled.
- This corresponds to the premium V8.10-era composition/direction: door opening with initials, veil-led moving cover, editorial story, premium venue treatment, photographic agenda with overlaid moments, dark immersive gallery, RSVP section and animated veil closing.
- Any scalable implementation that materially changes, simplifies or removes those visual/motion decisions is INVALID even if its configuration logic is correct.
- V1 template rewrite is rejected.
- V2 is not automatically accepted merely because it reused V8.10 code; visual parity must be proven against this mobile recording, section by section.
- Scaling rule: parametrize content/state beneath the canonical visual master. Do not redesign the master to make state handling easier.
- Before owner review, every state implementation must be compared against the canonical mobile master for premium feel, motion, typography, spacing, imagery and transitions.


## VEIL LIGHT TEMPLATE — CANONICAL SCALING PASS 2026-10-05

Current review artifact:
- GUEST_VEIL_LIGHT_TEMPLATE_V7_MASTER_SCALABLE_QA.html
- local/sandbox review artifact only; NOT published.

Method:
- visual master remains the exact approved V8.10 / owner-recorded invitation.
- default visual state is preserved; scalability is implemented beneath it.
- no replacement of opening, hero motion, Agenda art direction, Practical art direction, Gallery treatment or animated closing.

Implemented state handling:
- Cover: mandatory “Nos casamos” + names + date; optional place/time; long-name class; approved name-style variants.
- Opening: approved door/video sequence preserved; initials can be replaced for non-I&H couples without rebuilding the invitation.
- Story: off / text only / crop / full-image states.
- Locations: 1 shared place / 2 separate places; optional celebration photo; default master photo if absent; independent map/site actions; optional dress code.
- Agenda: 1–5 moments, automatic chronological ordering including post-midnight wedding-night times.
- Practical: 0–4 modules, count-driven layout, structured Bus/Hotel/Gift/Playlist rendering.
- Gallery: 1–4 photos, crop/full per photo; single-photo state removes carousel affordance.
- RSVP CTA: one link into existing confirmation system.
- Closing: approved animated master preserved with dynamic names/date/closing copy.

Internal visual/functional checks completed before owner review:
- canonical default at 390x844 retains the master composition.
- Agenda 1 and Agenda 5 states visually checked and pass.
- Practical 3 state visually checked and pass.
- Gallery 1 landscape/full state visually checked and pass without fake carousel affordance.
- Long names visually checked and remain inside the cover composition.
- Story full-image state visually checked.
- Split ceremony + celebration state visually checked; readability was reinforced without touching the canonical one-location design.
- desktop default checked at 1366x900 with no horizontal overflow.
- JavaScript syntax check PASS.

Exact next:
- owner reviews only the canonical default invitation on Android.
- if canonical parity passes, continue systematic configuration stress QA; do not redesign the default master.


## VEIL LIGHT — OWNER VIDEO REVIEW AFTER V7
Owner supplied real-device recording 1000094083.mp4 of V7.

Internal review against canonical master 1000094067.mp4:
- opening/cover motion: visually aligned;
- welcome/countdown: aligned;
- one-location treatment: aligned;
- agenda: aligned and remains one of the strongest sections;
- Practical 4-state default: aligned;
- gallery/carousel: aligned; final landscape photo preserves couple + environment;
- RSVP section: aligned;
- animated closing: aligned and readable.

Regression found by internal review:
- default Story asset no longer matched the canonical master. V7 used the vineyard seated photo, while the approved master uses the standing garden couple photo.
- This also made the groom more vulnerable to edge cropping in the default Story.

Correction:
- V8_MASTER_LOCKED restores the exact approved Story master photo while keeping the scalable crop/full/focus system underneath.
- No other visual grammar was changed.

Rule:
- Default catalog preview must visually reproduce the canonical master exactly.
- Stress-test assets belong only in internal QA cases, never in the owner-facing default preview.


## VEIL LIGHT V9 — COHESION / PREMIUM CONTINUITY PASS
Owner requested a full-invitation correction after mobile review.

Applied against the locked V8.10 visual master:
- "Qué ilusión" elevated from plain informational block to an emotional VEIL LIGHT transition using the same veil material language, integrated countdown and restrained ambient movement.
- Removed the white seam after "Nuestra historia"; Story now hands off directly into Locations.
- Story pre-photo area compacted so the photograph arrives sooner without changing the approved Story grammar.
- Locations continuity tightened without redesigning the approved venue treatment.
- Practical keeps the approved no-card composition but gains stronger veil depth, larger/clearer typography and earlier-readable reveal behavior.
- Gallery heading is readable immediately; it no longer depends on a late reveal to become visible.
- RSVP elevated into the VEIL LIGHT material language while remaining quieter than cover/closing.
- Reveal system changed from near-invisible until 16% intersection to readable-by-default + early 4% trigger; fast scrolling must not make key text disappear.
- Opening, cover, approved photographic Agenda, Gallery structure and animated closing remain protected.

Current artifact: GUEST_VEIL_LIGHT_TEMPLATE_V9_COHESION_PREMIUM.html
Status: internal static/JS QA PASS; pending owner mobile visual gate.

## VEIL LIGHT V10 — GLOBAL RHYTHM PASS 2026-10-05
Owner requested full-invitation correction after V9 holistic review.
Applied without redesigning protected premium master blocks:
- Qué ilusión reduced to a short emotional interlude (~half viewport) instead of a full editorial page.
- Story now hands directly into venue imagery; no beige/text-only pause between Story photo and location scene.
- Location heading/intro is overlaid on the venue photograph; copy shortened so imagery stays dominant.
- Functional mobile copy floor increased for location/practical/gallery metadata and actions.
- Gallery renderer now removes a repeated Story photo when other gallery photos are available; QA exposes a duplicateStoryPhoto warning.
- RSVP now acts as a transition from the dark gallery into the animated closing, using the VEIL LIGHT material language and matching warm bottom tone.
- Protected blocks remain protected: opening, cover motion, photographic agenda, gallery structure, animated closing.
Candidate artifact: GUEST_VEIL_LIGHT_TEMPLATE_V10_RHYTHM_MASTER.html
Status: awaiting owner full-mobile review; not published.


## VEIL LIGHT V10.1 — RHYTHM FINISH 2026-10-05
Full mobile experience reviewed from owner recording 1000094090.mp4 against canonical visual master 1000094067.mp4 before further code changes.

Diagnosis:
- protected premium grammar remains intact; no redesign is required;
- the remaining rhythm issue before Story is excess travel from countdown into the first photograph;
- the final act still reads too much as separate Gallery -> RSVP -> Closing blocks instead of one continuous material transition.

Bounded correction:
- countdown -> Story/photo travel compacted while preserving V8.10 Story typography and composition;
- Gallery -> RSVP -> Closing rebuilt as one continuous final act using the approved closing veil video itself behind both RSVP and Closing;
- the large post-CTA dead space was removed and the RSVP-to-closing horizontal seam was eliminated with one continuous tonal overlay across the whole final act;
- protected opening, cover motion, venue, photographic Agenda, Practical language, dark Gallery and closing typography remain unchanged;
- Agenda OFF and Gallery OFF renderer cleanup fixed so dynamic template state changes do not retain stale DOM from a prior configuration.

QA before owner review:
- JavaScript syntax PASS;
- canonical 390x844 plus 26 configuration/state checks PASS with zero horizontal overflow after fixes;
- edge mobile checks at 360x800 and 430x932 PASS for canonical/critical variants, including long names;
- Agenda 0-5, Practical 0-4, Story off/text/photo/full, split/shared locations, cover optional metadata and Gallery off/1/2/3/4 behavior exercised;
- Gallery 1 removes carousel affordance; Gallery 2+ retains swipe cue/progress;
- opening interaction verified: door layer hides, entry video plays, hero reveal completes and scroll unlocks;
- final-act CTA-to-closing spacing is compact and responsive; closing veil is already present behind RSVP.

Candidate artifact:
- GUEST_VEIL_LIGHT_TEMPLATE_V10_1_RHYTHM_FINISH.html

Status:
- pending owner Android visual approval;
- NOT published.


## VEIL LIGHT V10.2 — HOLISTIC UNITY 2026-10-05
Owner supplied full Android recording 1000094095.mp4 and requested that the invitation be judged as one design rather than section by section.

Holistic diagnosis:
- opening/cover, countdown/Story, photographic Agenda, Practical, dark Gallery and the new shared RSVP/closing veil all belong to one coherent VEIL LIGHT language;
- the dark Gallery remains an intentional dramatic contrast and should not be flattened into the beige material system;
- Locations was the remaining visual outlier: the venue photograph plus rounded floating information card read as a separate visual system even though the section worked in isolation;
- the closing concept itself is now stronger, but a CSS regression changed close-copy positioning from absolute to relative, causing the final names/copy to intrude into the RSVP transition.

Bounded correction:
- preserve the venue photograph and photo-led location treatment;
- reuse the existing VEIL LIGHT veil material subtly over the venue photo;
- convert the floating rounded location card into an edge-to-edge editorial lower-third using the invitation's warm neutral material language;
- keep the approved heading/venue copy/buttons/dress-code content and one/two-location renderer behavior;
- restore closing copy to absolute bottom anchoring inside the closing section; do not redesign the new shared moving-veil final act.

QA:
- JavaScript syntax PASS;
- canonical 360x800, 390x844 and 430x932: zero horizontal overflow;
- closing copy computed position is absolute at all three target sizes and no longer overlaps RSVP content;
- shared one-location, split two-location and no-custom-photo fallback states render with zero horizontal overflow;
- venue veil material remains present in all tested location states;
- no page errors in the tested canonical/configuration states.

Candidate artifact:
- GUEST_VEIL_LIGHT_TEMPLATE_V10_2_HOLISTIC_UNITY.html

Status:
- pending owner Android visual review;
- NOT published.


## VEIL LIGHT V10.3 — SCALABLE FLOW FINISH 2026-10-05
Owner Android review of V10.2 (recording 1000094097.mp4 + screenshot 1000094098.jpg) identified three remaining coherence/scalability issues:
- hard visual cut between Story photography and Locations;
- two-location behavior needed explicit visual proof, not only renderer support;
- RSVP CTA and farewell still behaved like stacked screens, forcing unnecessary scroll after the action point.

Bounded correction:
- Story -> Locations now uses a real photographic overlap/fade when Story ends in a photo: Locations overlaps the final 64-72px of Story and fades from transparent to opaque, with the existing VEIL LIGHT veil material crossing the handoff. The venue background becomes transparent only in this state so the previous photograph genuinely shows through during the blend. If Story has no photo/off, this transition is not applied.
- one-location and two-location states share the exact same edge-to-edge editorial lower-third grammar. Two locations expand as two typographic rows (ceremony / celebration) inside the same lower-third, never as duplicated cards.
- RSVP + farewell are now one structural final screen over the approved moving veil. CSS grid allocates the RSVP zone and farewell zone inside one viewport, so the guest sees the button and the closing without a second mandatory scroll. Wrapped/long couple names receive a bounded smaller close-name treatment.
- no redesign of opening, cover, Story grammar, photographic Agenda, Practical, Gallery or the approved moving closing veil.

QA:
- JavaScript syntax PASS for canonical V10.3 and explicit two-location QA artifact.
- static structural QA at 360x800, 390x844 and 430x932: zero horizontal overflow in one-location and two-location states.
- two-location lower-third renders 2 rows without overflow at all three target sizes.
- at 390x844 the single-screen final act places CTA at approximately y=442-494 and farewell at y=672-818 within the same 844px viewport, with no overlap.
- Story/venue overlap tested with transparent venue root so the mask reveals the preceding Story photograph rather than a dark section background.

Candidate artifacts:
- GUEST_VEIL_LIGHT_TEMPLATE_V10_3_SCALABLE_FLOW_FINISH.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_3_TWO_LOCATIONS_QA.html

Status:
- pending owner Android visual review;
- NOT published.


## VEIL LIGHT V10.4 REJECTED / V10.5 CINEMATIC VENUE 2026-10-05
Owner Android review of V10.4 from recording 1000094105.mp4: REJECTED.

Why V10.4 fails:
- it still behaves like web UI: beige heading block -> rounded venue image -> information block;
- the location becomes a card/ficha inside the invitation rather than part of VEIL LIGHT;
- visual energy drops immediately after Story despite improved spacing;
- the architecture is wrong, so further patching V10.4 is prohibited.

V10.5 direction:
- discard the web-card grammar completely;
- use a deliberate short VEIL LIGHT material pause after Story, then a full-bleed cinematic venue photograph;
- no large pre-heading, no rounded image container, no beige lower card;
- integrate location name, time, address, actions and optional dress code directly over the photograph with a dark tonal fade + veil material;
- one-location state: venue name is the single visual focal point;
- two-location state: the same full-bleed scene contains two typographic entries (Ceremony / Celebration), not duplicated cards or duplicated mini-sections;
- max one venue photo remains respected; two locations do not require two images;
- opening, cover, Story grammar, photographic Agenda, Practical, Gallery and final RSVP/closing screen remain untouched.

Artifacts:
- GUEST_VEIL_LIGHT_TEMPLATE_V10_5_CINEMATIC_VENUE.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_5_TWO_LOCATIONS_QA.html

QA before owner review:
- JavaScript syntax PASS on both artifacts;
- HTML structural checks PASS;
- one/two-location renderer keeps a single location section and toggles split-mode only for layout sizing;
- no redesign outside Locations.

Status:
- pending owner Android visual review;
- NOT published.


## VEIL LIGHT V10.6 — PHOTO-AGNOSTIC VENUE TONAL SYSTEM 2026-10-05
Owner identified a visible tonal band in the two-location venue state and correctly required that the template work with arbitrary couple-supplied venue photography, not only the current warm master image.

Root cause:
- V10.5 used two independent tonal systems over the venue photograph: the photograph pseudo-element darkening plus a second gradient background on the text/copy layer;
- on the warm default image their boundary was subtle, but on bright/green or differently toned photographs it became visible as a horizontal colour band.

Correction:
- venue now uses one continuous neutral tonal field across the whole photograph;
- the text/copy layer is fully transparent and adds no independent background;
- split/two-location mode uses a continuous gradient that begins slightly earlier for readability but has no hard tonal boundary;
- two-location date is rendered once for the whole scene instead of being repeated under each location;
- one-location and two-location layouts keep the same cinematic architecture;
- no redesign outside Locations.

Photo robustness QA:
- tested against four tonal families derived from the owner-supplied bright green venue photo: bright/green, very light/desaturated, warm, and dark/cool;
- both one-location and two-location lower text zones preserve readable white-text contrast under the continuous field;
- the original horizontal band mechanism is eliminated because there is no longer a separate copy-background layer;
- owner-supplied green photo also embedded into an explicit two-location QA artifact for real-device review.

Artifacts:
- GUEST_VEIL_LIGHT_TEMPLATE_V10_6_ADAPTIVE_TONAL_VENUE.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_6_TWO_LOCATIONS_QA.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_6_TWO_LOCATIONS_GREEN_PHOTO_QA.html

Status:
- pending owner Android visual review;
- NOT published.


## VEIL LIGHT V10.7 — PHOTO ROBUST VENUE 2026-10-05
Owner supplied three Android recordings of V10.6:
- 1000094123.mp4 — one-location/default;
- 1000094125.mp4 — two-location/default;
- 1000094128.mp4 — two-location with bright green venue photo.

Independent full-video review:
- V10.6 reduced the original hard tonal band but did NOT fully solve the venue system;
- a large blank beige pause remains between Story and Locations because the hidden venue heading still reserves roughly 100px of vertical space;
- on the bright/green photo the lower venue area still reads as a separate dark block because two tonal pseudo-elements overlap and the split layout retains visual row separation;
- the bright test also proves small venue metadata loses contrast earlier than the main headings;
- Location -> Agenda remains coherent and should not be redesigned.

V10.7 bounded correction:
- Story -> Locations blank spacer reduced to a short 30–34px material pause;
- venue uses exactly one continuous tonal gradient per state (one-location or split), and the second pseudo-element overlay is disabled;
- split-location row divider lines removed so the image is not visually segmented into bands;
- venue text receives controlled shadow support for photo-agnostic readability;
- no changes to opening, cover, Story content, photographic Agenda, Practical, Gallery or final RSVP/Closing.

Artifacts:
- GUEST_VEIL_LIGHT_TEMPLATE_V10_7_PHOTO_ROBUST_VENUE.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_7_TWO_LOCATIONS_QA.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_7_TWO_LOCATIONS_GREEN_PHOTO_QA.html

QA:
- JavaScript syntax PASS on all three artifacts;
- no new layout widths or card backgrounds introduced;
- explicit green-photo QA state retained for real-device validation.

Status:
- pending owner Android visual review;
- NOT published.


## VEIL LIGHT V10.8 — STORY/LOCATION CONTINUITY + TRUE SPLIT TONAL PARITY 2026-10-05
Owner Android review of V10.7 from recordings 1000094130.mp4, 1000094132.mp4 and 1000094134.mp4:
- the tonal band between Ceremony and Celebration remained perceptible, especially on the bright/green photo;
- Story photography is optional, so the template must not depend on a photo to avoid a visually empty section;
- owner proposed reusing the Practical material image more subtly in Story-without-photo to preserve VEIL LIGHT continuity.

Important technical finding:
- Story text-only was already using the exact same embedded material asset as Practical, but as a full-strength background rather than as an intentionally subdued material layer.

V10.8 correction:
- one-location and two-location venue states now use the exact same continuous tonal gradient; split mode no longer changes the tonal field;
- secondary venue overlay remains disabled;
- split rows explicitly carry no background, border or shadow, so Ceremony/Celebration separation is typographic/spatial only;
- Story-without-photo keeps the Practical material asset but is muted beneath an ivory veil overlay and reduced to a more compact 55–58svh composition;
- Story OFF still removes the whole section and reserves no space;
- no changes to opening, cover, Story-with-photo composition, photographic Agenda, Practical, Gallery or final RSVP/Closing.

Artifacts:
- GUEST_VEIL_LIGHT_TEMPLATE_V10_8_CONTINUITY_STORY_VENUE.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_8_TWO_LOCATIONS_QA.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_8_TWO_LOCATIONS_GREEN_PHOTO_QA.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_8_STORY_NO_PHOTO_QA.html

QA:
- JavaScript syntax PASS on all four artifacts;
- explicit no-photo Story artifact forces the canonical story-text state for real-device review;
- explicit green-photo two-location artifact retained for band/contrast validation.

Status:
- pending owner Android visual review;
- NOT published.


## VEIL LIGHT V10.9 — UNIFORM PHOTO FIELD + STRONGER TEXT-ONLY STORY 2026-10-05
Owner supplied four mobile recordings after V10.8 and requested a careful full review.

Video findings:
- Story without a couple photo is too visually weak: the reused Practical veil asset is technically present, but the ivory overlay suppresses it until the section reads almost like a plain beige page.
- In the bright/green two-location state, a horizontal rectangular tonal change is still visible exactly where Celebration begins. This is unacceptable for a scalable template.
- The venue band must not be solved by another vertical gradient because any vertical tonal transition can align with a location row and read as a strip on arbitrary photography.

V10.9 architecture:
- Locations no longer use a vertical tonal gradient at all.
- The entire venue photograph receives one uniform neutral dark field; a very soft radial warm lift is allowed because it does not create a horizontal boundary.
- For supplied venue photos, JS samples image luminance and selects a bounded overlay strength automatically (dark photos stay lighter; bright photos receive more protection). Fallback remains safe if sampling fails.
- Venue copy, both split rows and their wrappers are explicitly transparent with no border, shadow or backdrop-filter, so Ceremony/Celebration separation is purely typographic/spatial.
- Story-without-photo keeps the same Practical material asset but exposes it much more strongly toward the right/bottom while preserving an ivory reading field under the text.
- Story with photo and Story OFF behavior remain unchanged.

Photo-adaptation QA:
- sample luminance logic tested on the owner-supplied green image plus bright/pale, warm and dark variants;
- resulting overlay strengths stay bounded from 0.28 to 0.40 in those tests;
- JavaScript syntax PASS on all V10.9 artifacts.

Artifacts:
- GUEST_VEIL_LIGHT_TEMPLATE_V10_9_ADAPTIVE_UNIFORM_VENUE.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_9_TWO_LOCATIONS_QA.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_9_TWO_LOCATIONS_GREEN_PHOTO_QA.html
- GUEST_VEIL_LIGHT_TEMPLATE_V10_9_STORY_NO_PHOTO_QA.html

Status:
- pending owner Android visual review;
- NOT published.


## VEIL LIGHT — CONTROLLED ROLLBACK / APPROVED AGENDA LOCK 2026-10-06
Owner stopped the iteration after V10.11/V10.12 because attempts to soften transitions modified the already-approved Agenda composition and still failed to remove the visible venue bands.

Mandatory rollback decision:
- V10.11 and V10.12 are REJECTED as working bases.
- Recovery baseline is V10.10, the last artifact before Agenda CSS/layout was altered.
- Agenda is now HARD-LOCKED: do not modify its markup, image, heading/list positions, row geometry, typography, animation or CSS while solving Locations/transitions.
- No further version-number churn for this correction; work from a recovery artifact until the venue issue is actually solved.

Root cause of the regression:
- V10.11/V10.12 introduced Agenda-position overrides while trying to blend Venue -> Agenda, changing approved absolute heading/list positioning into relative flow.
- V10.10 also contained row-level pseudo-elements in Locations that visually reinforced horizontal bands instead of hiding them.

Recovery correction is Venue-only:
- remove every Ceremony/Celebration row pseudo-layer, border and independent background;
- use one continuous photo-wide tonal field with a monotonic darkening toward the bottom for legibility across arbitrary venue photography;
- recover white-copy contrast using text shadow, not cards/bands;
- remove the hard Dress-code rule;
- fade the bottom of the Venue photograph into the same dark tonal family used by the approved Agenda, using only Venue masking/background so Agenda itself stays untouched;
- retain the stronger Story-without-photo material fallback from V10.10.

Recovery artifacts:
- GUEST_VEIL_LIGHT_RECOVERY_APPROVED_AGENDA.html
- GUEST_VEIL_LIGHT_RECOVERY_TWO_LOCATIONS_QA.html
- GUEST_VEIL_LIGHT_RECOVERY_TWO_LOCATIONS_GREEN_PHOTO_QA.html
- GUEST_VEIL_LIGHT_RECOVERY_STORY_NO_PHOTO_QA.html

Validation:
- recovery artifacts are generated from V10.10, not V10.11/V10.12;
- recovery override contains no active Agenda selector; all corrections are scoped to #venue;
- JavaScript syntax PASS;
- no publication.

Status:
- pending one owner mobile validation of the recovery build;
- Agenda remains frozen regardless of further Venue feedback.


## VEIL LIGHT — TWO-LOCATION ARCHITECTURE REBUILD 2026-10-06
Owner confirmed the recovery restored the approved Agenda but the horizontal seam inside Locations remained visible in the two-location state. Further gradient/band patching is rejected.

New direction:
- one-location state remains unchanged;
- two-location state no longer uses stacked .venue-split-row blocks inside a shared text panel;
- Ceremony and Celebration are rendered as two independent typographic moments (.venue-event) floating over one continuous venue photograph;
- there is no row background, divider, pseudo-band, shared copy gradient or vertical tonal breakpoint between the two events;
- photo protection is one continuous photo-wide field, biased horizontally for text readability rather than vertically, so it cannot create a horizontal seam;
- Dress code remains a separate bottom typographic line without a divider;
- Agenda is HARD-LOCKED and untouched.

Validation:
- recovery Agenda HTML is byte-identical in the new rebuild;
- renderAgenda() is byte-identical;
- the new venue rebuild CSS contains no #agenda/.agenda selectors;
- JavaScript syntax PASS on principal, two-location, green-photo two-location and Story-no-photo artifacts;
- QA split-count assertion updated to the new .venue-event architecture.

Artifacts:
- GUEST_VEIL_LIGHT_LOCATION_REBUILD.html
- GUEST_VEIL_LIGHT_LOCATION_REBUILD_TWO_LOCATIONS_QA.html
- GUEST_VEIL_LIGHT_LOCATION_REBUILD_TWO_LOCATIONS_GREEN_PHOTO_QA.html
- GUEST_VEIL_LIGHT_LOCATION_REBUILD_STORY_NO_PHOTO_QA.html

Status:
- candidate only, NOT published;
- next owner check should focus only on the two-location state and the bright/green stress case.


## VEIL LIGHT — CORRECT APPROVED LOCK 2026-10-06
Owner reported that the previously "locked" artifact was wrong: it reintroduced the visible horizontal venue lines.

Root cause:
- the wrong source artifact was frozen.
- I locked GUEST_VEIL_LIGHT_LOCATION_REBUILD_CLEAN_VISIBLE.html (principal / one-location variant),
  but the owner-approved artifact was GUEST_VEIL_LIGHT_LOCATION_REBUILD_CLEAN_TWO_LOCATIONS_QA_VISIBLE.html.
- These files are NOT identical.

Correct frozen baseline:
- GUEST_VEIL_LIGHT_APPROVED_LOCKED_2026-10-06.html
- source: GUEST_VEIL_LIGHT_LOCATION_REBUILD_CLEAN_TWO_LOCATIONS_QA_VISIBLE.html
- SHA-256: 953729fac4415aacc1576abae214622c2e0859e6046fe4e9ea043f5c46c0f8b3
- byte-for-byte identity between source and frozen copy confirmed with cmp.

Rules:
- This exact artifact is the approved visual baseline.
- Do not substitute the principal CLEAN_VISIBLE file for this baseline.
- Agenda remains frozen.
- Any future Practical -> Gallery transition experiment must branch from this exact locked artifact and must not modify Venue, Agenda, Story, Cover, Gallery internals, RSVP or Closing.
- NOT published.


## VEIL LIGHT — VISUAL MASTER FROZEN + AUDIT 2026-10-06
Owner approved the current invitation as a coherent whole after reviewing the full mobile flow.

Canonical visual master:
- GUEST_VEIL_LIGHT_VISUAL_MASTER_LOCKED_2026-10-06.html
- exact source: GUEST_VEIL_LIGHT_APPROVED_LOCKED_2026-10-06_WELCOME_VEIL_VISIBLE.html
- SHA-256: 56ed823c3b97a5f85632b2b2052e5625ed044bb35a5d8dceaaade42bbb6c51e2
- byte-for-byte identity confirmed
- JavaScript syntax PASS
- NOT published

Approved state includes:
- cover/opening protected;
- current visible-but-subtle “Qué ilusión” veil intensity approved;
- Story photo optional, with no-photo continuity required;
- rebuilt two-location architecture without horizontal band or geometric patch;
- Agenda HARD-LOCKED;
- Practical editorial CTA language including Regalo = “VER DETALLES”;
- enlarged invisible tap areas for Practical actions;
- current fused Practical -> Gallery transition accepted;
- Gallery and closing/final act protected.

Operational audit:
- guest/GUEST_VEIL_LIGHT_VISUAL_AUDIT_2026-10-06.md
- commit creating audit: 8c146b89911fe0eeba4c255e6172e20a442aabb4

Work mode changes now:
- stop aesthetic iteration;
- remaining work is scalability/functional QA;
- approved blocks may not be reopened unless a reproducible defect is demonstrated;
- every experiment must branch from the canonical visual master into a separate derivative;
- failed experiments are discarded, never patched back into the master;
- no publication without explicit owner approval.


## VEIL LIGHT — SCALABILITY QA CLOSED 2026-10-06
Systematic QA continued from the frozen visual master.

One reproducible defect was found:
- with 2 Locations and very long venue names/addresses, Ceremony and Celebration could overlap at 360–390 px widths.

Fix:
- adaptive split-venue fitting only when overlap is detected;
- normal approved split/shared geometry remains unchanged;
- if needed, Celebration moves down and the venue-photo height expands just enough;
- re-check after fonts resolve and on viewport resize;
- Agenda and all other approved blocks remain untouched.

Validation:
- normal default/shared and normal split geometry are identical before/after fix at 360×800, 390×844, 430×932;
- venue bright/green and dark photo stress states visually reviewed;
- Story no-photo continuity visually reviewed with the Practical material asset;
- extended configuration matrix: 168/168 PASS;
- sequential cleanup states PASS;
- JS syntax PASS;
- no horizontal overflow;
- no agenda row overlap;
- no Practical card overlap;
- no split-location event overlap;
- gallery duplicate-Story-photo filtering PASS;
- approved invisible Practical action hit targets retained.

New canonical scalable artifact:
- GUEST_VEIL_LIGHT_VISUAL_MASTER_SCALABLE_LOCKED_2026-10-06.html
- SHA-256: 94f6a7f80dba43631ad20b5c413f6411e05ba4f526c1b0977f78321f41815d53
- NOT published.

This artifact supersedes GUEST_VEIL_LIGHT_VISUAL_MASTER_LOCKED_2026-10-06.html for subsequent configuration/QA work. The previous master stays preserved as rollback reference.

Audit updated in commit f9739ee3c8f0d6e74705d420157e4e9f299e8d8b.


## GUEST — END-TO-END ORDER WORKFLOW PILOT READY 2026-10-06
Owner explicitly stopped further catalog-design work until the complete real operating flow has been tested on mobile and desktop.

Scope now:
- questionnaire UX;
- receiving/managing orders;
- applying the selected configuration to the approved scalable template;
- couple review / change request;
- final delivery;
- email handoffs.

Do NOT return to VEIL LIGHT scalability QA; it is already closed.

Backend implemented in Weddly Smart Design VENDORS Supabase:
- new service-role-only table: public.guest_invitation_orders;
- status model: draft -> submitted -> designing -> review_ready -> review_sent -> changes_requested/approved -> delivered;
- private upload bucket guest-invitation-uploads;
- public final-delivery bucket guest-invitation-public;
- new Edge Function guest-invitation-flow, deployed v2;
- custom hashed questionnaire/review/public capability tokens;
- existing Weddly owner-manager token reused for private operational actions.

guest-invitation-flow implements:
- questionnaire load/save/upload/remove/submit;
- real Story/venue/Gallery uploads;
- canonical VEIL LIGHT config generation;
- internal + couple submission emails;
- owner list/detail/start-design/config/review-ready/note actions;
- couple review approve/change-request;
- final delivery with private->public image handoff;
- production GUEST access link when a paid license exists;
- test-safe review/delivery emails so the pilot never sends a broken production URL.

Two isolated test orders now exist:
- MOBILE questionnaire UX pilot;
- PC questionnaire UX pilot.

Conversation/sandbox pilot artifacts:
- GUEST_QUESTIONNAIRE_TEST_MOBILE.html
- GUEST_QUESTIONNAIRE_TEST_PC.html
- guest-orders-admin-v2.html
- GUEST_VEIL_LIGHT_PRODUCTION_WORKBENCH.html
- GUEST_REVIEW_TEST_MOBILE.html
- GUEST_REVIEW_TEST_PC.html
- GUEST_FINAL_TEST_MOBILE.html
- GUEST_FINAL_TEST_PC.html

Design workbench/review/final harnesses are built directly from:
- GUEST_VEIL_LIGHT_VISUAL_MASTER_SCALABLE_LOCKED_2026-10-06.html
and apply resolved order config through VEIL_APPLY_CONFIG, so the pilot evaluates the actual approved invitation rather than a simplified preview.

Operational specification:
- guest/GUEST_END_TO_END_ORDER_WORKFLOW_V1_2026-10-06.md
- commit: 82b54a2885bd4a3056031d913c582be4c3cf86e1

Production-boundary rule:
- do NOT switch the live GUEST Stripe/checkout handoff yet;
- first complete this real pilot and correct questionnaire/operations defects once;
- after owner accepts the pilot, host commercial questionnaire/review/final surfaces, wire guest-stripe-checkout to the new order workflow, connect production RSVP/access, retire old guest-order.html, and only then start Design 02.


## GUEST — REAL-TEST PILOT PERSISTENCE LOCK 2026-10-06

The owner cannot run the real pilot immediately and explicitly requested that the exact test point, artifacts and associated documentation be preserved for later resumption.

Persistent Library folder:
- /GUEST/END_TO_END_PILOT_2026-10-06

It contains the exact current pilot artifacts:
- GUEST_QUESTIONNAIRE_TEST_MOBILE.html
- GUEST_QUESTIONNAIRE_TEST_PC.html
- guest-orders-admin-v2.html
- GUEST_VEIL_LIGHT_PRODUCTION_WORKBENCH.html
- GUEST_REVIEW_TEST_MOBILE.html
- GUEST_REVIEW_TEST_PC.html
- GUEST_FINAL_TEST_MOBILE.html
- GUEST_FINAL_TEST_PC.html
- GUEST_END_TO_END_PILOT_RESUME_POINT_2026-10-06.md

Repository resume document:
- guest/GUEST_END_TO_END_PILOT_RESUME_POINT_2026-10-06.md
- commit: 6debbc06d9fcd3f8de91cf5064ec61234c8811fb

Resume rule:
- recover the resume document, this CURRENT_STATE and guest/GUEST_END_TO_END_ORDER_WORKFLOW_V1_2026-10-06.md before doing any work;
- do not ask the owner to remember links, order or prior decisions;
- next action remains Phase 1 of the real pilot: questionnaire as a couple on mobile, then PC;
- do not start Design 02;
- do not repeat VEIL LIGHT scalability QA;
- do not wire production Stripe/checkout until the pilot is completed and accepted.


## GUEST — FIRST REAL MOBILE PILOT DEFECT FIXED 2026-10-06

Real mobile pilot reached owner production and exposed a workflow/navigation defect:
- old guest-orders-admin-v2.html “Preparar diseño” only advanced backend state;
- it did not show/open the invitation;
- owner became blocked and accidentally advanced the order to review_ready while trying to continue.

Action taken:
- mobile test order 68a0b0d0-5bea-40e7-bcfb-84e795a1cb39 reset to designing;
- guest-orders-admin-v2.html retired for the production step;
- new persistent owner production surface:
  /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V3.html
- this file contains the real frozen scalable VEIL LIGHT master and the private production panel together;
- primary action is now “Preparar y ver invitación” and immediately applies the order config to the real master;
- same surface continues review-ready, send-review and final-delivery actions.

Email correction discovered during the same pilot:
- GUEST emails were displaying ONE as sender name.
- guest-invitation-flow redeployed v3 so GUEST emails use display name “GUEST by WeddlySmartDesign”.
- test internal-order email no longer exposes the not-yet-hosted old manager link.

Pilot continuation:
- DO NOT restart questionnaire.
- Continue existing mobile order from GUEST_PRODUCTION_MANAGER_V3.html.
- Once mobile owner/review/delivery flow is completed, run PC questionnaire pilot.


## GUEST — REAL MOBILE PILOT RENDER FIXES V4 2026-10-06

From owner video 1000094342.mp4, real-order defects were confirmed and corrected without restarting the questionnaire:

- opening: canonical entry video contained baked I&H pixels near the tail; production/review/final V2 now crossfade to the configured hero before those frames;
- countdown: duplicate master + real timers caused the old master date to overwrite the real date; previous timer is now cleared before each render;
- Agenda: dynamic rows were created after the original reveal observer and stayed invisible; reveal binding is now recreated after each dynamic render;
- Story/Gallery framing: uploaded couple photos previously forced 50/50 crop; production now uses autoFrame=true and switches to the existing approved full-photo state only when ratio mismatch would severely crop the couple;
- current Pilar & Jorge mobile test order remains in designing and was migrated to autoFrame=true.

Use from now on:
- GUEST_PRODUCTION_MANAGER_V4.html
- GUEST_REVIEW_TEST_MOBILE_V2.html / PC_V2
- GUEST_FINAL_TEST_MOBILE_V2.html / PC_V2

Persistent location:
- /GUEST/END_TO_END_PILOT_2026-10-06/

Backend:
- guest-invitation-flow v4 active.

Do not use V3 or the old Review/Final pilot artifacts.
Do not restart the mobile questionnaire.
Next action is to reopen the existing Pilar & Jorge order in Production Manager V4 and inspect the same full mobile invitation again.


## GUEST — MOBILE PILOT FULL REVIEW V4.2 2026-10-06

Full video 1000094355.mp4 reviewed as one invitation after V4.1.

Critical Cover regression found:
- previous flash workaround hid the entry video and removed the approved moving veil from the Cover.
- V4.2 restores continuous moving-veil Cover behavior while keeping the custom initials over the baked I&H until those source pixels leave the opening animation.
- browser title now uses the actual couple.

Full-video status after recheck:
- Countdown real date: correct.
- Story framing: correct / both people retained.
- Split Location: correct.
- Agenda 5 moments incl. 00:00 ordering: correct.
- Practical render: correct.
- Gallery framing: correct / both people retained.
- Closing: correct.

Additional pilot workflow issue:
- current Pilar & Jorge order has Playlist enabled but no URL because the original questionnaire did not require it.
- new questionnaire pilot files V2 now enforce required practical data.
- guest-invitation-flow active v6 with matching server-side validation.
- mark_review_ready now rejects incomplete orders.

Use:
- GUEST_PRODUCTION_MANAGER_V4_2.html
- GUEST_REVIEW_TEST_MOBILE_V2_2.html / PC_V2_2
- GUEST_FINAL_TEST_MOBILE_V2_2.html / PC_V2_2
- GUEST_QUESTIONNAIRE_TEST_MOBILE_V2.html / PC_V2.html

Persistent Library:
- /GUEST/END_TO_END_PILOT_2026-10-06/

Existing Pilar & Jorge order remains designing and should NOT be restarted.
It may be visually reviewed now; sending to review is intentionally blocked until its missing Playlist URL is resolved.


## GUEST — MOBILE PILOT V4.3 2026-10-06

Real mobile pilot corrections after owner screenshots/video:
- Agenda 5-item state no longer uses reduced 20px/23px typography.
- Agenda count-5 now preserves approved base scale: time 35px, label 28px; only row spacing compacts.
- opening/test-initial suppression upgraded from timing-only to a hard clean-segment handoff at ~4.58s;
- initials overlay is physically removed after opening and cannot reappear at final act.

Use now:
- GUEST_PRODUCTION_MANAGER_V4_3.html
- GUEST_REVIEW_TEST_MOBILE_V2_3.html / PC_V2_3
- GUEST_FINAL_TEST_MOBILE_V2_3.html / PC_V2_3

Persistent Library:
- /GUEST/END_TO_END_PILOT_2026-10-06/

Existing Pilar & Jorge order continues in designing. Do not restart questionnaire.


## GUEST — MOBILE PILOT V4.4 ENTRY INITIALS 2026-10-06

Owner rejected V4.3 entry initials because the masking patch was visually unacceptable.

Frame-level diagnosis:
- clean source through ~4.0 s;
- residual baked master H appears only around ~4.2–4.6 s at the exiting door edge;
- V4.3's visible patch was the wrong solution.

V4.4:
- removes the initials patch/card entirely;
- restores direct understated initials on the door;
- hands off from the clean door segment at ~4.08 s to the clean veil segment at ~4.82 s before any residual master letter appears;
- keeps approved Agenda 5-item scale unchanged.

Use now:
- GUEST_PRODUCTION_MANAGER_V4_4.html
- GUEST_REVIEW_TEST_MOBILE_V2_4.html / PC_V2_4
- GUEST_FINAL_TEST_MOBILE_V2_4.html / PC_V2_4

Persistent Library:
- /GUEST/END_TO_END_PILOT_2026-10-06/

Do not use V4.3 after this point.


## GUEST — VEIL LIGHT V5.2 SCALABILITY GATE 2026-10-06

V5.2 is the currently approved visual invitation. Recraft/cover refinement is deferred unless credits remain later.

Technical certification status:
- couple-specific `I&H` runtime exception removed;
- V5.2 embedded opening asset confirmed neutral/no baked initials;
- 77 supported/stress configs at 360, 390 and 430 px = **231/231 PASS**;
- 0 page JS errors;
- Agenda count-5 remains locked at 35px time / 28px label;
- generic fixes only: long-name fitting, split-location convergence, long Practical token wrapping.

Use certification candidate:
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V5_2_CERT_CANDIDATE.html

Report:
- guest/GUEST_VEIL_LIGHT_V5_2_SCALABILITY_CERTIFICATION_2026-10-06.md

Overall status remains NOT YET 100% FROZEN because the required second PC questionnaire order is still pending.

PC order:
- 829f4998-f328-4c6a-be49-d73fd3aaa2f7
- draft / empty
- dedicated real-questionnaire autofill harness prepared and offline-validated:
  GUEST_QUESTIONNAIRE_PC_SCALE_GATE_AUTOFILL_V1.html
- next gate: open it, review the deliberately different generated questionnaire data, explicitly submit, then load that order into the same V5.2 certification candidate with zero design/code edits.

Do not start Design 02 before that gate passes.


## GUEST — VEIL LIGHT V5.2 CERTIFIED AND FROZEN 2026-10-06

VEIL LIGHT V5.2 has passed the final scalability gate.

Evidence:
- supported/stress matrix 231/231 PASS;
- neutral reusable opening asset confirmed;
- I&H-specific runtime exception removed;
- first real order Pilar & Jorge rendered correctly;
- second materially different PC order submitted and auto-resolved by backend;
- second order rendered unchanged at 360/390/430 px with no overflow/overlap/JS errors and correct optional-state behavior.

Result:
**100% scalable for the defined supported configuration contract.**

Frozen:
- GUEST_VEIL_LIGHT_V5_2_SCALABLE_FROZEN.html
- GUEST_PRODUCTION_MANAGER_V5_2_SCALABLE_FROZEN.html

Optional later Recraft cover improvement is cosmetic only and does not reopen this certification unless architecture changes.

Next:
propagate frozen V5.2 into Review/Final and complete the operational pilot before Design 02.


## GUEST — VEIL LIGHT V5.2 REVIEW/FINAL HANDOFF 2026-10-06

Certification remains CLOSED and FROZEN. No template change was made after Gate 2.

Independent recheck:
- second order 829f4998-f328-4c6a-be49-d73fd3aaa2f7 passes at 360/390/430;
- Agenda 5 = 35px / 28px;
- Story text-only, Gallery OFF, split Locations and Practical 4 all remain valid;
- frozen production manager hash matches the certification candidate exactly.

Review/Final pilot surfaces have been rebuilt from the canonical frozen invitation, preserving only their workflow overlays:
- GUEST_REVIEW_TEST_MOBILE_V5_2_FROZEN.html
- GUEST_REVIEW_TEST_PC_V5_2_FROZEN.html
- GUEST_FINAL_TEST_MOBILE_V5_2_FROZEN.html
- GUEST_FINAL_TEST_PC_V5_2_FROZEN.html

All four pass JavaScript syntax QA and are renderer-identical to the frozen base once the workflow overlay is removed.

Checkpoint:
- guest/GUEST_VEIL_LIGHT_V5_2_FREEZE_HANDOFF_2026-10-06.md

Exact next action:
continue the operational pilot with the complete PC order through Production Manager -> Review -> change/approval -> Final delivery.
Do NOT start Design 02 until this workflow is accepted.


## OPERATIONAL PANEL STATE-SYNC FIX — 2026-10-06 21:09 CEST

During the live second-order pilot, after marking order 829f4998-f328-4c6a-be49-d73fd3aaa2f7 as review_ready, the Production Manager showed two contradictory labels for the same order: the live order summary correctly showed “Lista para revisión” while the lower loaded-invitation meta card still showed stale “En diseño”, even after Refresh.

This was an owner-panel UI synchronization defect only. The backend order state was correct and VEIL LIGHT V5.2 remained untouched/frozen.

Correction created:
- GUEST_PRODUCTION_MANAGER_V5_2_1_OPERATIONAL_STATE_FIX.html

Fix scope:
- preserve the currently selected order on Refresh/state transitions;
- refresh the lower production meta card from the latest backend order state;
- make the bottom status message state-aware (review_ready -> “Ya puedes pulsar Enviar revisión”, etc.);
- no changes to VEIL_APPLY_CONFIG, invitation CSS, layout, timing, media, or frozen renderer.

Validation:
- JavaScript syntax PASS;
- all content before the owner workbench script is byte-identical to the frozen V5.2 manager.

Resume with the same order already in review_ready. Do not revert or restart the questionnaire. Open V5.2.1, Refresh once, verify both status displays agree, then continue with Enviar revisión.


## GUEST — END-TO-END OPERATIONAL PILOT CLOSED 2026-10-06

The real second-order operational pilot is complete and PASS.

Order 829f4998-f328-4c6a-be49-d73fd3aaa2f7 completed:
- frozen render;
- review send;
- couple change request;
- revision notification;
- owner data-only edit;
- regenerated invitation;
- second review;
- approval;
- final delivery;
- final mobile invitation load.

Backend final state: delivered, revision_count=1.

Operational fixes remained outside the VEIL LIGHT renderer. Current owner candidate:
- GUEST_PRODUCTION_MANAGER_V5_2_5_TIME_COHERENCE_GUARD.html

V5.2.5 adds a warning/confirmation guard when cover time, ceremony time and first Agenda moment differ. It never auto-synchronizes them.

VEIL LIGHT V5.2 remains 100% scalable/frozen. Do not reopen it without a reproducible supported-state defect.

Final report:
- guest/GUEST_END_TO_END_OPERATIONAL_PILOT_FINAL_2026-10-06.md

The scalability gate and operational-pilot gate are now both closed. Design 02 is no longer blocked by those gates. Publication/Stripe wiring remains intentionally separate and unchanged.


## VEIL LIGHT V5.3 — VISUAL ROBUSTNESS GATE REOPENED 2026-10-06

Owner Android review of the delivered long-name / long-Story order exposed three real commercial-quality defects that the prior technical matrix did not classify as failures:
- Cover kicker/place can lose contrast against the moving veil.
- Long names using the contemporary Bodoni treatment can be technically contained but insufficiently legible.
- Long text-only Story copy at the fixed 26 px editorial scale can become visually excessive.

Correction to prior status:
- V5.2 technical scalability PASS remains valid.
- End-to-end operational pilot PASS remains valid.
- The previous **commercial visual freeze is revoked** until visual robustness is accepted.
- Design 02 is BLOCKED again until this gate closes.

V5.3 candidate introduces bounded visual tuning stored in resolved_config and rendered identically in Production / Review / Final. No free CSS, manual positioning or per-order motion changes are permitted.

Safe owner controls:
- Cover name font and bounded size preset.
- Cover personalized metadata size; contrast is hardened automatically.
- Story body font and bounded size preset.

Automatic defaults also harden older orders: long names prefer a readable Playfair treatment, cover microcopy gets high contrast, and long text-only Story copy scales down deterministically by character count.

Artifacts:
- GUEST_PRODUCTION_MANAGER_V5_3_VISUAL_ROBUSTNESS.html
- GUEST_REVIEW_TEST_MOBILE_V5_3_VISUAL_ROBUSTNESS.html / PC
- GUEST_FINAL_TEST_MOBILE_V5_3_VISUAL_ROBUSTNESS.html / PC

Checkpoint: `guest/GUEST_VEIL_LIGHT_VISUAL_ROBUSTNESS_CONTROLS_2026-10-06.md`.

Next action: owner Android review of the problematic long-name / long-Story case. Do not start Design 02 before PASS.
