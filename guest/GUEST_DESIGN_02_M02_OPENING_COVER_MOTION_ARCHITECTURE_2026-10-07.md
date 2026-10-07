# GUEST — DESIGN 02 · D02-M02 OPENING + COVER MOTION ARCHITECTURE

Date: 2026-10-07
Branch: `guest-independent`
Status: SEALED CONCEPT / READY FOR PROTOTYPE
Design working name: NOCTURNE

## 0. Goal

Define an Opening + Cover experience whose premium value comes from motion architecture, not from a static AI image.

The proof must be:
- 100% scalable;
- generated from reusable template assets;
- visually personalized by live couple data;
- impossible to reduce convincingly to a Canva background + canned animation;
- compatible with no photo / one cover photo;
- compatible with short and long names;
- mobile-first;
- compatible with the frozen common catalog pipeline.

---

# 1. Core motion idea

NOCTURNE opens as a **scene revealed by moving light through depth**.

It is NOT:
- a video playing behind text;
- a static image with a light overlay;
- a Ken Burns pan;
- a fade-in sequence;
- text entering over a dark background.

It IS a three-dimensional-feeling composition made from independent reusable layers whose visibility and movement are coordinated by one virtual light source.

Customer perception:
the invitation seems to awaken around their names.

Template reality:
separable visual assets + live masks + deterministic motion timeline + structured content.

---

# 2. Layer stack

## L0 — VOID
Near-black initial field.
No visible background at first.

Purpose:
- creates anticipation;
- allows light to be the first visual event;
- works even on slow asset decode.

## L1 — BACK ATMOSPHERE
Reusable Recraft plate:
- deep nocturnal environment;
- soft architectural depth;
- no identifiable venue;
- no people;
- no text.

Movement:
- extremely slow 1–2% positional drift;
- independent from foreground;
- not a canned pan; tied to scene progress.

## L2 — MIDGROUND MATERIAL
Reusable Recraft-generated or cut-out material:
- reflective surface / glass / stone / lacquered dark plane;
- enough transparency/shape separation to receive moving light.

Movement:
- slight opposite drift from L1;
- subtle scale/translation creates real depth separation.

## L3 — LIGHT MASK
Native live SVG/CSS mask.

Behavior:
- starts as a narrow off-axis slit;
- widens irregularly;
- travels diagonally across the composition;
- has soft + hard edge zones;
- reveals different layers at different rates;
- affects image, surface reflections and typography separately.

This is the signature mechanic.

## L4 — FOREGROUND OCCLUSION
Reusable transparent/dark asset:
- shadow edge;
- glass reflection;
- architectural silhouette;
- no obvious decorative motif.

Behavior:
- moves slower/faster than light;
- briefly occludes parts of names;
- creates the feeling that text lives inside the scene.

## L5 — COUPLE PHOTO OPTIONAL
Live user photo.

No photo:
- scene remains complete.

With photo:
- photo is not simply placed full-screen.
- it enters through the same live light mask.
- the photo can appear behind one layer and in front of another, creating integration.
- CROP/FULL + focus remain the only regular owner controls.

## L6 — TYPOGRAPHY
Native text.

Elements:
- small opening line;
- name1;
- name2;
- date;
- optional place/time.

Behavior:
- no generic entrance.
- glyphs are revealed according to the same moving light field.
- light can expose only part of a word before the full name resolves.
- foreground occlusion may pass over part of the type.
- typography does not move independently in arbitrary directions.

---

# 3. Opening timeline

Total target:
approximately 5–7 seconds before the invitation settles into the interactive Cover.

Timing is template-fixed, not order-editable.

## PHASE 1 — DARK / ANTICIPATION
0.0–0.8 s

- near black;
- only a tiny reflected edge is visible;
- no names yet.

## PHASE 2 — FIRST LIGHT
0.8–2.0 s

- a narrow warm light enters off-axis;
- it reveals a fragment of material depth;
- date or a short human opening line becomes partially visible.

## PHASE 3 — DEPTH ARRIVES
2.0–3.4 s

- background and midground separate subtly;
- foreground occlusion shifts;
- light widens;
- first name starts appearing through the mask.

## PHASE 4 — COUPLE REVEAL
3.4–4.8 s

- name1 and name2 resolve in sequence but not as independent fade-ups;
- the same light reveals both;
- optional photo, if present, becomes visible within the lit zone;
- no photo state uses material depth instead.

## PHASE 5 — COVER SETTLES
4.8–6.0 s

- light reaches its resting geometry;
- date/place/time resolve;
- scene becomes interactive;
- subtle ambient depth remains active.

## PHASE 6 — SCROLL HANDOFF
on first meaningful scroll

- the main light source starts moving downward/sideways;
- it does not disappear;
- it becomes the transition material into the next section.

This cross-section handoff is mandatory because it makes the experience one continuous invitation, not a sequence of animated slides.

---

# 4. Cover idle behavior

After the opening completes, the scene remains alive but quiet.

Allowed ambient motion:
- very slow light breathing;
- independent foreground reflection drift;
- tiny depth movement;
- subtle photo luminance change.

Not allowed:
- looped sparkle;
- floating particles;
- repeated dramatic sweeps;
- constant zoom;
- obvious looping GIF behavior.

The guest should be able to stop and read comfortably.

---

# 5. Scroll behavior

The first 15–25% of scroll after Cover starts a controlled transformation.

The light:
- contracts from broad reveal into a directional band;
- slides toward the edge;
- carries a reflection into Welcome/Countdown.

The typography:
- does not fly away;
- loses contrast gradually as the scene transitions;
- remains readable until the section exit threshold.

The background:
- separates by depth;
- no full-screen crossfade.

The next section begins before the Cover has visually “ended”.

This creates continuity impossible to reproduce with ordinary Canva page transitions.

---

# 6. Personalization without manual production

## Names

Schema supports up to 30 characters each.

Three deterministic name states:

### N1 — SHORT
Both names fit at full display scale.

### N2 — MEDIUM
Slightly reduced display size; same composition.

### N3 — LONG
- names may wrap using certified break rules;
- light mask widens vertically;
- foreground occlusion shifts within a predetermined range;
- no manual positioning.

The light system adapts to the name block bounding box.

Important:
motion responds to actual rendered type dimensions.
This is a core non-Canva behavior.

## Place/time

Optional fields affect only supporting metadata area.
They never shift the main names into a new custom layout.

## Cover photo

OFF:
- material scene carries emotional weight.

ON:
- photo becomes part of light reveal;
- not a different Cover template;
- same opening timeline.

---

# 7. Recraft asset strategy for M02

Do not ask Recraft for a finished “wedding invitation background”.

Generate assets by layer role.

## R1 — Background atmosphere
Prompt goal:
deep nocturnal space, abstract architecture, warm light, large negative space, no readable venue identity.

## R2 — Midground reflective material
Prompt goal:
dark glass / polished stone / lacquered reflective plane with controlled warm highlights, isolated composition suitable for masking.

## R3 — Foreground occlusion
Prompt goal:
abstract dark edge / glass reflection / architectural shadow shape, simple silhouette, transparent-capable extraction.

## R4 — Optional light/reflection texture
Prompt goal:
warm champagne reflected streaks / optical flare material on dark neutral field, no central object.

Generation rule:
iterate until each layer is useful independently.
Do not accept one beautiful flattened scene that cannot be recomposed.

---

# 8. Technical motion primitives

The prototype may use:
- CSS custom properties;
- SVG masks;
- `clip-path`;
- `mask-image`;
- CSS transforms;
- IntersectionObserver;
- scroll progress mapped to CSS variables;
- requestAnimationFrame only where required;
- prefers-reduced-motion state.

Avoid:
- video as the only mechanism;
- canvas/WebGL unless native methods fail to reach premium quality;
- heavy libraries;
- per-order JSON timing edits.

Why:
the system must remain reliable inside the catalog renderer and owner workflow.

---

# 9. Non-Canva gate

M02 fails if the prototype can be reasonably imitated with:
- one background image;
- one photo;
- a gradient overlay;
- fade / pan / zoom;
- typewriter / rise / dissolve;
- a page transition.

M02 passes only if the result visibly depends on:
1. multi-layer independent depth;
2. one coherent live light mask;
3. typography revealed by scene state;
4. optional photo integrated into the same mask;
5. scroll-controlled handoff to next section;
6. deterministic adaptation to actual name size.

At least 5 of 6 must be clearly perceptible in the prototype.

---

# 10. Static-frame rule

A still screenshot should look premium, but the premium proposition is not judged from the still.

Therefore:
- no future owner gate will ask “do you like this background?”;
- owner gate asks “does the full moving experience feel premium and difficult to reproduce?”

Static images are only ingredients/evidence, never the product proof.

---

# 11. Reduced-motion state

Accessibility may not collapse into a basic static page.

Reduced-motion:
- uses the same layered composition;
- light state changes happen instantly or with minimal opacity change;
- depth remains visually present;
- typography hierarchy remains premium;
- no information loss.

---

# 12. Copy behavior in Opening/Cover

Avoid generic romantic slogan.

Opening microcopy should be short and plausibly spoken by the couple.

Candidate voice directions:
- “Nos hace muchísima ilusión contaros esto.”
- “Ahora sí.”
- “Nos casamos.”
- or no opening sentence at all: date → names.

Final microcopy is not sealed in M02.
The visual architecture must work even with zero decorative sentence.

---

# 13. Scalability gate for prototype

Before owner review, internally test:
- short names;
- long names;
- place ON/OFF;
- time ON/OFF;
- no photo;
- portrait photo;
- landscape photo;
- 360×800;
- 390×844;
- 430×932;
- reduced motion.

No template edit between cases.

---

# 14. M02 decision

PASS / SEALED CONCEPT.

The static-image approach is explicitly rejected.

NOCTURNE Opening/Cover premium value will come from:
**reusable layered art + live light masks + live typography + optional real-photo integration + scroll-linked scene continuity.**

Next microblock:
**D02-M03 — BUILD FIRST MOTION PROTOTYPE**

M03 output must be one finished mobile prototype of Opening + Cover + first transition only.
Do not build Story/Location/Agenda yet.
