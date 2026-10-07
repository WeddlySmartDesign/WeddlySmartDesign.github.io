# GUEST — DESIGN 02 STRATEGIC VISUAL DIRECTION

Date: 2026-10-07  
Branch: `guest-independent`  
Status: REJECTED — DO NOT REVIVE  
Scope: Design 02 only. No code implementation in this checkpoint.

## Canonical constraints read and accepted

Design 02 is a visual plugin of the frozen Catalog Pipeline V1.

Do not change:
- purchase/order architecture;
- common questionnaire;
- common config schema;
- owner workflow;
- review/approval/delivery flow;
- recipient context;
- existing GUEST guest-management app;
- existing send/RSVP engine;
- tables/lists/PDF/catering;
- extra events;
- ONE / ONE Partner / STUDIO;
- commercial publication / Stripe hold.

Operational target:
- normal order = review only;
- exceptional supported order = bounded safe adjustment only;
- owner intervention target <=5 minutes;
- no per-couple HTML/CSS/layout/motion edits.

VEIL LIGHT V5.3.3 remains commercially frozen.

---

## 1. What VEIL LIGHT already owns

VEIL LIGHT already occupies:
- quiet luxury;
- ivory / warm beige;
- translucent veil/fabric as dominant material language;
- restrained romantic atmosphere;
- soft continuous material-led motion;
- editorial calm;
- integrated photography without generic frames;
- light-to-dark progression including a dark immersive gallery;
- veil-led opening and closing continuity.

Therefore Design 02 must NOT be:
- another pale romantic invitation;
- another translucent/material fabric concept;
- the same vertical editorial rhythm with darker colours;
- VEIL LIGHT with a different serif;
- another soft reveal/fade system.

---

## 2. Strategic territory selected

### Working name
**NOCTURNE**

Name remains provisional until the design itself is approved.

### Core idea
**A wedding after dark, told through light rather than decoration.**

NOCTURNE is a cinematic black-tie invitation whose dominant material is not paper, veil, flowers, an envelope or a theatre curtain.

Its material is **light**:
- narrow beams;
- reflected glow;
- hard photographic flash;
- soft falloff into darkness;
- controlled luminous type;
- brief exposure-like transitions.

The atmosphere is fashion-led and nocturnal, but still warm and unmistakably wedding.

The design should feel closer to a luxury fragrance film / evening fashion campaign / beautifully lit reception than to a wedding website template.

---

## 3. Why this is Design 02

This direction creates real catalog distance from VEIL LIGHT on every important axis:

| Axis | VEIL LIGHT | DESIGN 02 / NOCTURNE |
|---|---|---|
| Dominant material | translucent veil/fabric | light/shadow/reflection |
| Time of day | soft daylight / romantic neutral | evening / after dark |
| Palette | ivory / warm beige | ink / oxblood / warm ivory |
| Movement | soft continuous fabric | light sweeps / exposure / scene cuts |
| Composition | calm editorial flow | cinematic scene composition |
| Photography | soft integrated imagery | contrast-led editorial imagery |
| Mood | quiet romantic luxury | black-tie confidence / intimacy |
| Opening | veil/door language | darkness -> light reveal |
| Rhythm | continuous | deliberate acts/scenes |
| Premium cue | material softness | light direction + dramatic restraint |

This is a new customer taste, not a colourway.

---

## 4. Market reading

Current premium digital invitation brands increasingly differentiate templates through:
- template-specific opening experiences;
- cinematic animation;
- strong material/scene identities;
- photography-led or illustrated art direction;
- built-in RSVP and guest-management layers;
- day/night, theatre, tactile-paper and editorial-fashion concepts.

Observed competitive signals:
- The Digital Yes currently includes distinct concepts such as Day & Night, Teatro, Stained Glass, Maison Dorée and venue-led designs.
- The Sealed Invite foregrounds hero video, music, personalised opening scenes and depth/texture.
- Zinggly positions itself explicitly around cinematic animated wedding websites.
- Pressed Love separates its catalog into material/narrative worlds including theatrical, tactile letterpress and black-tie editorial directions.

Important boundary:
NOCTURNE must not copy the existing black-tie/fashion-editorial templates already on the market.
In particular, avoid making contact sheets, faux film rolls, curtain reveals, envelope reveals or generic black-and-gold luxury the defining device.

Our differentiation is **responsive light choreography as the visual system**.

---

## 5. Atmosphere

Keywords:
- after dark;
- black tie;
- intimate;
- luminous;
- confident;
- sensual but not theatrical;
- editorial but not magazine-like;
- warm, not cold;
- dramatic but restrained.

Not allowed:
- Vegas glamour;
- gold glitter;
- red-carpet clichés;
- obvious cinema clapboards/film reels;
- literal theatre props;
- gothic styling;
- nightclub UI;
- generic black website sections.

---

## 6. Colour system

Default palette:
- **Ink** — near-black with a warm undertone;
- **Oxblood** — deep wine used sparingly;
- **Warm Ivory** — primary light text;
- **Champagne Light** — small luminous accent, never glitter/foil imitation.

The invitation remains dark-led, but not flat black.

Safe future palette presets may be certified only if they preserve the light system, for example:
1. Ink / Oxblood / Ivory;
2. Midnight / Stone / Ivory;
3. Espresso / Aubergine / Ivory.

No arbitrary colour picker per order.

---

## 7. Typography

Primary direction:
- one high-contrast display serif with fashion confidence;
- one clean humanist/grotesk sans for functional information;
- no script as the structural typeface.

Names:
- large, architectural, high-contrast serif;
- asymmetric or staggered composition;
- deterministic line-break rules for long names;
- must remain legible without shrinking into insignificance.

Functional content:
- clean sans;
- generous line height;
- no tiny all-caps for important information.

Potential safe typography presets:
- **Fashion** — highest contrast / most dramatic;
- **Modern** — slightly cleaner serif;
- **Classic** — quieter formal serif.

Every preset must pass the same long-name and content matrix before exposure.

---

## 8. Opening

### No envelope
The opening should not use the now-common digital envelope metaphor.

### Sequence
1. screen begins almost black;
2. a thin warm light appears at one edge;
3. light travels across the scene, revealing only fragments;
4. date / short wedding microcopy appears with restrained timing;
5. the couple names resolve as the light reaches full composition;
6. a clear entry gesture brings the guest into the invitation.

The effect should resemble a room slowly receiving light, not a generic fade-in.

Implementation principle for later build:
- reusable native/CSS/SVG light masks and gradients;
- no personalised video generation;
- no couple-specific animation timing;
- couple names/date remain native text;
- optional photograph may sit behind the light system but the opening must remain complete without it.

Music, if supported by the common product, remains user-initiated/muted until interaction.

---

## 9. Cover / first hero

The cover is a full-screen cinematic scene.

Composition:
- large names occupying one controlled vertical zone;
- date and short place treated as precise supporting information;
- one strong light source;
- no decorative border;
- no arch;
- no card floating over a photo;
- no floral overlay.

Photo behavior:
- optional, never required for the composition to work;
- if present, integrated edge-to-edge or through a masked light reveal;
- common CROP/FULL and focal-point rules remain the only image-fit controls.

If no cover photo:
- the moving light and type composition still produce a finished premium hero.

---

## 10. Interior composition

NOCTURNE should not feel like stacked website sections.
It should feel like a sequence of **acts** with controlled changes in light.

### Welcome / countdown
- calmer black field after the opening;
- countdown rendered as typographic rhythm, not boxed counters;
- a subtle moving reflected glow creates depth.

### Story
- intimate, low-light composition;
- text and image do not sit in a card;
- image may enter from darkness with a controlled exposure transition;
- text-only mode remains intentional through light/shadow geometry.

### Location
- venue information treated like arrival into a place;
- one venue = one wide cinematic moment;
- two venues = two ordered light states inside the same visual language;
- one venue photo maximum remains sufficient;
- map/site/dress-code actions remain functional and clear.

### Agenda
- vertical sequence paced by moving light rather than a generic timeline;
- time values act as visual anchors;
- 1–5 moments reflow deterministically;
- no manual repositioning.

### Practical information
- 0–4 modules;
- each module appears as a concise luminous information moment, not repeated app cards;
- 1/2/3/4 states receive deliberate compositions;
- actions remain unmistakably tappable.

### Gallery
- immersive full-screen photography;
- no faux contact sheet or film-roll motif;
- swipe behaves natively;
- transition between photos uses a short exposure/flash pulse derived from the same light language;
- 1-photo state remains intentionally static;
- CROP/FULL + focal point remain the only image-fit mechanics.

---

## 11. Photography system

Photography is important but must not become the design dependency.

Default treatment:
- editorial contrast;
- warm monochrome or very restrained colour treatment;
- shadow-friendly presentation;
- black background absorbs different source ratios.

Rules:
- no generic framed photographs;
- no circles/arcs;
- no mandatory custom retouching;
- portrait, landscape and square must pass;
- story/gallery still support both CROP and FULL modes from the common system;
- owner may adjust only certified focal point / fit and, if later proven necessary, one bounded exposure preset.

The invitation must still read as a wedding invitation if only one photo is supplied.

---

## 12. Motion language

One motion language only: **light entering, crossing, exposing and receding**.

Core motions:
- opening edge-light reveal;
- section-to-section exposure transitions;
- one progressive agenda light movement;
- restrained photo exposure/swipe transition;
- final light fade in closing.

Avoid:
- generic fade-up on every element;
- floating particles;
- continuous parallax;
- curtain animation;
- fabric simulation;
- multiple unrelated motion styles;
- animation timings editable per couple.

Reduced-motion state must remain fully premium.

---

## 13. RSVP

The RSVP remains the existing shared GUEST route.

NOCTURNE only changes the CTA presentation.

Proposed final act:
- the invitation becomes visually quieter after the final gallery/information;
- warm ivory light grows from darkness;
- clear attendance copy appears;
- one unmistakable CTA opens the existing RSVP;
- no inline replacement RSVP form is created.

The CTA should feel like the natural final action of the invitation, not a system button pasted on top.

---

## 14. Closing

Closing should feel like lights going down after an intimate evening.

Composition:
- names/signature;
- date or approved short closing copy;
- nearly black field;
- residual warm light around the typography;
- one slow receding-light movement;
- no branding.

It must work identically whether optional middle sections were on or off.

---

## 15. Scalability thesis

NOCTURNE is selected partly because the premium effect can be generated from reusable rules rather than bespoke assets.

The expensive-looking elements are:
- light masks;
- type hierarchy;
- CSS/SVG gradients;
- compositional breakpoints;
- reusable motion curves;
- deterministic photo treatment.

Those are built once.

Per order, the intended owner actions remain:
- inspect;
- optionally choose certified typography preset;
- optionally choose certified palette preset;
- photo CROP/FULL + focal point only when required;
- send review.

No Recraft/Canva/video generation should be necessary for normal orders.

---

## 16. Safe-control philosophy

Candidate controls to certify later:
- one of 3 typography presets;
- one of 3 tightly defined palette presets;
- CROP/FULL + focal point for supported photos;
- only if needed after stress testing: bounded photo exposure preset.

Never expose:
- arbitrary colours;
- arbitrary coordinates;
- free font selection;
- free animation timing;
- custom section order;
- free CSS;
- per-couple light positions.

Normal order should require none of these controls.

---

## 17. Alternatives rejected at strategy stage

### Tactile paper / letterpress
Strong premium territory, but closer to quiet-luxury restraint already occupied by VEIL LIGHT and risks reading as a static digital imitation of stationery.

### Custom illustrated venue / botanical world
Highly saleable and current, but bespoke illustration creates owner/designer workload and conflicts with the <=5-minute operating model unless heavily constrained.

### Theatre / curtain
Already strongly represented by current competitors and too close to an obvious cinematic trope.

### Generic dark black-and-gold
Easy to reproduce in Canva and insufficiently ownable.

NOCTURNE wins because its differentiation comes from an interaction/material system, not decoration.

---

## 18. Visual approval gate before implementation

Do not build the complete template yet.

Next gate after owner acceptance of this strategic territory:
1. create one visual/motion proof covering opening + cover + one interior transition + gallery swipe + closing;
2. review on real Android;
3. reject the territory if the light language looks gimmicky, generic or low-end;
4. only after that build the full config-driven template.

No Catalog Pipeline architecture changes are permitted during this gate.

---

## 19. Decision

**Recommended Design 02 territory: NOCTURNE — cinematic black-tie, light as material.**

This direction is strategically strong enough to justify a second catalog slot because it serves a clearly different couple/taste from VEIL LIGHT while preserving the same industrialized product pipeline and <=5-minute operating target.


---

## 20. OWNER DESIGN RULES — ABSOLUTE / ADDED 2026-10-07

These rules override any weaker interpretation of the visual direction and apply before any Design 02 asset, prototype, layout or motion is accepted.

### 20.1 Scalability before beauty
Everything designed for Design 02 must be 100% scalable from the start.

Required:
- premium-personalized customer perception;
- deterministic template behavior;
- no per-couple layout repair;
- no per-couple CSS/HTML edits;
- no bespoke animation timing;
- no asset that requires manual recreation for every order;
- no visual solution that only works for the demo couple.

If a visual idea cannot survive the full supported configuration matrix without manual design intervention, reject the idea before polishing it.

The aim is not to reduce personalization.
The aim is to create the **appearance of deep personalization from a certified reusable system**.

### 20.2 No cheap/static background language
Do not accept flat static backgrounds that make the invitation feel basic, templated or low-cost.

Design 02 may and should use Recraft as many times as necessary during development to create the reusable visual universe, including:
- opening/cover art;
- closing art;
- interior scene backgrounds;
- transitional visual material;
- section-specific atmospheric assets where the concept benefits.

The constraint is not “avoid generated assets”.
The constraint is:
- generate/build them once as reusable template assets;
- keep them coherent as one art direction;
- never require fresh asset production for a normal couple order.

A static asset is acceptable only if its composition, layering, motion treatment and integration make it feel intentional and premium. A flat wallpaper-like background is rejected.

### 20.3 Canva rejection test
For every major visual component ask:

**“Could a normal Canva Premium user plausibly reproduce the perceived result without specialist design/animation/system work?”**

If the answer is yes, reject or materially elevate the component.

This applies especially to:
- cover;
- transitions;
- story;
- locations;
- agenda;
- practical information;
- gallery;
- RSVP final act;
- closing.

Changing font, colour, adding a photo, gradient or decorative PNG is not sufficient differentiation.

### 20.4 Microblock operating method
Design 02 must be developed in concise, sealed microblocks.

Default sequence:
1. define microblock objective;
2. execute as much as possible without owner intervention;
3. internally reject weak options;
4. show only a review-worthy finished result;
5. owner gives visual approval/rejection/light feedback;
6. seal the microblock before advancing.

Do not leave the owner wondering whether work is progressing.
Do not fragment one visual decision across repeated small questions.
Do not ask the owner to make technical or design-production choices that can be resolved internally.

### 20.5 Couple-voice copy
Customer-facing copy inside the invitation is written **as if it comes from the couple to their own guests**.

Required voice:
- warm;
- familiar;
- natural;
- affectionate where appropriate;
- elegant without sounding formal for the sake of it;
- specific enough to feel human.

Reject:
- brand voice;
- marketing copy;
- product-language;
- corporate/event copy;
- generic AI sentiment;
- empty phrases that could belong to any wedding;
- over-written romantic language;
- internal terms such as modules, RSVP engine, management system, template, configuration.

Functional copy must still be clear, but should sound like the couple helping their guests.

### 20.6 Admission rule
A microblock is not approved merely because it looks attractive.

It must pass all five tests:
1. premium visual quality;
2. 100% scalability;
3. not plausibly Canva-reproducible;
4. reusable asset/system logic with no normal-order manual production;
5. believable couple-to-guest copy.

Failure of any one test = microblock remains open or is discarded.


---

# FINAL REJECTION — 2026-10-07

NOCTURNE is permanently rejected as Design 02 direction after full real-mobile visual runway review.

Do not revive, reskin, lighten, or incrementally improve this direction.

Reasons:
- perceived design quality materially below VEIL LIGHT;
- too flat despite motion/compositing effort;
- major sections reproducible with ordinary Canva-style layout/animation;
- insufficient defensible premium personalisation value;
- photography had to be darkened/controlled to fit the template instead of increasing its value;
- motion language did not justify Recraft/premium positioning;
- invitation read too much like luxury branding/web design and not enough like a unique wedding experience;
- effort-to-result ratio is commercially unacceptable.

Assets/experiments may be retained only as negative QA evidence.

Design 02 must restart from a materially, chromatically, compositionally and motion-wise different territory.
