# GUEST — DESIGN 02 · D02-M01 VISUAL + ASSET SYSTEM

Date: 2026-10-07
Branch: `guest-independent`
Status: SEALED
Design working name: NOCTURNE
Scope: strategic visual mechanics + reusable asset system only. No full-template code in this microblock.

## 0. Admission rules inherited

This microblock is governed by:
- GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md
- GUEST_CATALOG_PIPELINE_CONTRACT_V1.md
- GUEST_CATALOG_TEMPLATE_PLUGIN_CONTRACT_V1.md
- GUEST_DESIGN_02_STRATEGIC_VISUAL_DIRECTION_2026-10-07.md

Absolute Design 02 rules:
1. Every visual solution must be 100% scalable.
2. Premium personalization must be perceived without per-order design production.
3. Recraft may be used as many times as necessary during template development.
4. Recraft/template assets are built once and reused; normal orders must not require new generation.
5. Flat/static wallpaper-like backgrounds are rejected.
6. Any major component plausibly reproducible by a normal Canva Premium user is rejected.
7. Copy must sound like a real couple speaking to people close to them.
8. Work progresses in concise sealed microblocks.

---

# 1. D02-M01 DECISION

NOCTURNE will NOT be built as:
- one dark background + serif text;
- a collection of decorative section backgrounds;
- a black-and-gold template;
- a set of static full-screen Canva-like slides.

It will be built as a **cinematic light system**.

The reusable template has three simultaneous layers:

### LAYER A — ART DIRECTION PLATE
Reusable Recraft-generated visual material built once for the template.

Purpose:
- visual richness;
- depth;
- texture;
- coherent world;
- scene-specific atmosphere.

Never contains:
- couple names;
- wedding date;
- venue name;
- real guest data;
- baked CTA;
- couple-specific monogram;
- one-off personalised text.

### LAYER B — LIVE LIGHT / DEPTH ENGINE
Native reusable CSS/SVG/mask/transform system.

Purpose:
- moving beams;
- exposure reveals;
- changing darkness/light;
- depth separation;
- transitions;
- scroll-linked scene evolution;
- subtle reflections;
- premium motion continuity.

This layer is what prevents the Recraft plate from reading as a static wallpaper.

No timing is editable per couple.

### LAYER C — LIVE COUPLE CONTENT
Native HTML/content from the canonical config.

Includes:
- names;
- date;
- place;
- time;
- story;
- venue data;
- agenda;
- practical data;
- real couple photography;
- RSVP CTA;
- closing line.

This content remains searchable/readable/responsive and never needs to be baked into an image.

## Result

Customer perception:
> a bespoke cinematic invitation built around their wedding.

Operational reality:
> reusable art plates + deterministic motion + structured couple data.

---

# 2. CORE NON-CANVA MECHANIC

The premium differentiator is **continuous light choreography**.

A single virtual light source changes behavior through the invitation:
- enters in Opening;
- resolves the Cover;
- softens in Welcome/Story;
- becomes architectural in Location;
- tracks time rhythm in Agenda;
- breaks into smaller pools in Practical;
- becomes photographic exposure in Gallery;
- gathers around RSVP;
- recedes in Closing.

The source is not literally one DOM object that must remain visible throughout.
It is one coherent behavior system.

This creates:
- continuity;
- scene-to-scene authorship;
- movement responsive to scroll/state;
- depth that a sequence of Canva slides cannot reproduce convincingly.

Any future visual prototype that looks acceptable as a screenshot but loses its premium character when motion is removed must still have a strong static composition.
Motion elevates the design; it does not rescue weak design.

---

# 3. ASSET INVENTORY — BUILD ONCE

## A01 — OPENING / COVER MASTER PLATE
Format target:
- portrait master, mobile-first;
- high-resolution;
- no text;
- no people required;
- strong negative-space zones;
- asymmetric light geometry;
- foreground/midground/background depth.

Visual:
- deep warm ink;
- restrained oxblood reflection;
- one champagne light source;
- abstract architectural/reflected environment;
- luxury fragrance-campaign quality;
- no identifiable venue.

Must support:
- no couple cover photo;
- optional couple photo blended independently;
- short/long names;
- place/time on/off.

Cannot contain:
- arch;
- doorway-as-wedding-cliché;
- curtains;
- florals;
- glitter;
- foil;
- stars;
- particle field;
- generic spotlight circle.

## A02 — WELCOME / COUNTDOWN ATMOSPHERE
Purpose:
- calm after the opening;
- rich enough that countdown OFF still looks intentional.

Visual:
- close-up reflected light / dark glass / soft shadow;
- shallower visual depth than Cover;
- no obvious object that competes with text.

Motion:
- live reflected glow moves independently over the plate.

## A03 — STORY ATMOSPHERE
Purpose:
- support text-only and photo states.

Visual:
- intimate dark material/light scene;
- one strong lateral shadow plane;
- enough neutral space for up to schema max story copy.

Photo behavior:
- real story photo reveals through a native exposure mask;
- CROP/FULL remains common system behavior;
- no image frame.

Text-only:
- uses the same light geometry so absence of photo never looks like missing content.

## A04 — LOCATION ATMOSPHERE
Purpose:
- remain premium with or without location hero photo;
- support shared and split location.

Visual:
- abstract night-arrival feeling through reflections/light;
- never fake a venue;
- no architecture that could be mistaken for the couple's actual location.

Real venue photo:
- if supplied, enters as the dominant scene;
- A04 becomes edge/depth/light material rather than competing image.

## A05 — AGENDA LIGHT FIELD
Purpose:
- make 1–5 moments feel designed without icons/cards.

Visual:
- vertical dark field with directional light topology;
- no baked lines or numbers.

Native layer:
- light path advances according to scroll;
- agenda times/moments are live text;
- spacing derives from count and viewport.

## A06 — PRACTICAL INFORMATION FIELD
Purpose:
- 0–4 practical modules without app-card appearance.

Visual:
- darker reflective material with multiple natural light pockets;
- enough flexibility for 1 / 2 / 3 / 4 compositions.

Native layer:
- modules occupy certified spatial zones;
- light pockets activate/rebalance by module count;
- no empty zone remains when a module is OFF.

## A07 — RSVP FINAL-ACT FIELD
Purpose:
- transition from content into action.

Visual:
- almost-black scene;
- warm ivory light gathers inward rather than spreads outward;
- maximum contrast for CTA and copy.

Native layer:
- RSVP CTA remains common route;
- light behavior frames the action without becoming a button background cliché.

## A08 — CLOSING MASTER PLATE
Purpose:
- designed ending, not reused Cover.

Visual:
- same world, later moment;
- residual champagne reflection;
- deeper black;
- smaller oxblood presence;
- deliberately quieter than Cover.

Motion:
- light recedes rather than enters.

Must support:
- names;
- date;
- closing line null / short / max-length;
- no couple-specific raster edits.

---

# 4. WHAT DOES NOT NEED RECRAFT

The following must remain native/dynamic:
- all names and wedding data;
- count-down numbers;
- agenda times/labels;
- location text;
- practical information;
- CTA labels;
- RSVP route;
- closing line;
- layout geometry;
- focus/crop behavior;
- accessibility/reduced motion;
- actual couple photos;
- safe palette/typography tokens;
- light masks;
- section transitions;
- scroll progress.

Reason:
baking those into art would destroy scalability.

---

# 5. PHOTO INTEGRATION MODEL

A couple's photography must alter the perceived invitation without altering the template.

Supported mechanisms:
1. **photo as scene** — edge-to-edge with live light mask;
2. **photo as exposure** — appears only in selected lit region, then expands;
3. **photo full** — source ratio respected inside a dark/light composition, never in a generic card.

Never:
- circle;
- arch;
- decorative frame;
- Polaroid;
- contact sheet;
- fixed collage;
- blurred duplicated background;
- one-off Photoshop/Recraft composition per couple.

Owner controls remain only:
- CROP/FULL;
- focusX/focusY;
- potentially one bounded exposure preset ONLY if later stress tests prove it necessary.

---

# 6. RECRAFT GENERATION LANGUAGE

All Design 02 generated assets must share one prompt backbone.

## Canonical style backbone

"Cinematic luxury wedding visual world after dark, high-fashion fragrance campaign restraint, deep warm ink-black, restrained oxblood reflection, warm ivory and champagne volumetric light, sophisticated chiaroscuro, realistic optical reflections, layered foreground midground background depth, tactile dark glass and subtle architectural surfaces, elegant negative space, editorial photography lighting, premium European black-tie atmosphere, understated sensuality, photorealistic, no text, no logo, vertical mobile composition"

## Permanent negative constraints

"no wedding arch, no envelope, no curtain, no flowers as main motif, no glitter, no gold foil effect, no star field, no fairy lights everywhere, no bokeh wallpaper, no red carpet, no nightclub, no casino, no candles as dominant motif, no ornate frame, no circular photo space, no blank flat gradient, no generic website background, no text, no monogram, no people unless explicitly requested"

## A01 prompt direction
Add:
"abstract nocturnal arrival scene defined by one narrow warm light source crossing a dark reflective environment, asymmetric composition, striking negative space for large typography, cinematic depth, one restrained oxblood reflection, visual tension before an event begins"

## A02 prompt direction
Add:
"close reflected glow across dark smoked glass and satin-matte architectural surfaces, intimate and quiet, broad negative space for countdown typography, no central object"

## A03 prompt direction
Add:
"intimate lateral light carving a dark layered surface, one shadow plane and one warm reflected edge, editorial portrait-lighting atmosphere without a person, space for long body text"

## A04 prompt direction
Add:
"abstract sense of arriving somewhere at night through reflection and controlled architectural light, non-identifiable location, no fake venue, cinematic orientation cues, premium destination atmosphere"

## A05 prompt direction
Add:
"vertical field of directional light with five potential rhythm zones but no visible boxes, numbers, icons or lines, deep shadow, sequential visual flow, high-end event-film still"

## A06 prompt direction
Add:
"dark reflective material world with four subtle natural pools of light capable of supporting changing information density, luxurious but functional, no cards, no panels, no icons"

## A07 prompt direction
Add:
"near-black final-act scene where warm ivory light converges into a calm central interaction zone, solemn but inviting, no button drawn into image, high contrast"

## A08 prompt direction
Add:
"after-event quietness, residual warm reflected light fading into deep ink black, restrained oxblood trace, emotional visual resolution, large negative space for names and final line, no text"

---

# 7. STATIC-BACKGROUND REJECTION RULE

A generated asset fails if:
- it looks like wallpaper;
- one could place text on top and call the section finished;
- it depends on a single gradient;
- visual interest is only decorative texture;
- motion would simply be a zoom or fade;
- it looks premium only because of black + serif + gold/champagne;
- it resembles a Canva wedding story template.

Every accepted scene must have:
- depth;
- intentional light direction;
- a live-motion role;
- a content role;
- a mobile composition role;
- compatibility with optional data states.

---

# 8. CANVA REJECTION TEST — OPERATIONAL

Before approving each major block, ask:

Could a competent Canva Premium user reproduce the perceived result by:
- choosing a dark stock background;
- adding a serif;
- adding a gradient;
- applying fade/pan;
- placing a photo and CTA?

If YES -> reject.

A block passes only if its perceived quality depends on at least two of:
- responsive light-mask behavior;
- scroll-linked choreography;
- dynamic scene re-composition by content state;
- integrated arbitrary-ratio photography;
- transition continuity with adjacent scenes;
- count-aware animated geometry;
- live typographic behavior impossible to bake into a fixed slide.

---

# 9. COPY SYSTEM — COUPLE TO GUEST

NOCTURNE will avoid decorative romantic copy for its own sake.

## Principle
If a phrase could be printed unchanged on 1,000 unrelated invitations and still sound "emotional", it is suspect.

## Structural copy style
Short, spoken, useful.

Examples of acceptable direction (not yet final fixed copy):
- countdown: "Ya queda menos."
- locations intro: "Nos vemos aquí."
- agenda intro: "Para que sepáis cómo irá el día."
- transport: "Para volver tranquilos."
- accommodation: "Por si os quedáis a dormir."
- playlist: "¿Qué tiene que sonar sí o sí?"
- RSVP lead-in: "Decidnos si venís."
- closing fallback: "Qué ganas de veros."

These are only voice anchors.
Final fixed microcopy will be separately audited for naturalness before implementation.

## Avoid
- "Celebremos juntos nuestro amor";
- "Una noche para recordar";
- "Nuestro para siempre comienza aquí";
- "Acompáñanos en este día tan especial";
- generic luxury/brand language;
- editorial captions that sound written by a creative agency.

Where customer-provided copy exists (Story / Closing), it takes priority within validated limits.

---

# 10. SCALABILITY MAPPING TO CURRENT SCHEMA

No new common-schema field is required by M01.

Existing canonical fields already support:
- names up to 30 chars each;
- place up to 36;
- cover photo optional;
- countdown on/off;
- story on/off + up to 450 chars + optional photo;
- 1/2 locations + optional location photo;
- agenda 0–5;
- 0–4 practical modules;
- gallery 0–4;
- RSVP CTA;
- closing line up to 80.

Design 02 visual complexity therefore remains a renderer/asset problem, not a new questionnaire problem.

---

# 11. SAFE PRESET PLAN

Candidate presets only; not exposed until certified.

## Typography
- Fashion
- Modern
- Formal

## Palette
- Ink / Oxblood / Ivory
- Midnight / Stone / Ivory
- Espresso / Aubergine / Ivory

## Photography
- CROP/FULL + focus only by default.

No free:
- colour picker;
- font picker;
- animation timing;
- light direction;
- scene positions;
- section order;
- CSS.

---

# 12. MICROBLOCK M01 VERDICT

PASS / SEALED.

Why:
- differentiates structurally from VEIL LIGHT;
- maintains common config and frozen pipeline;
- gives Recraft a high-value role without introducing per-order generation;
- directly addresses the static-background failure mode;
- creates a premium mechanism that is not reducible to Canva slide design;
- preserves <=5 minute owner target;
- requires no owner decision before the visual proof.

## Next microblock

**D02-M02 — OPENING + COVER VISUAL PROOF**

Scope:
- generate/select the reusable A01 visual universe;
- build/test the first opening/cover interaction concept;
- verify that it remains premium with no couple photo and with a couple photo;
- verify short and long name compositions;
- do not build the rest of the invitation yet.

M02 visual gate:
if opening/cover does not look unmistakably premium and non-Canva on real mobile, reject or rebuild before proceeding.
