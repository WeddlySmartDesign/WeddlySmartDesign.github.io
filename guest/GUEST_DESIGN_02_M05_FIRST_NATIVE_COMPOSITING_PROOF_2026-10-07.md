# GUEST — DESIGN 02 · D02-M05 FIRST NATIVE COMPOSITING PROOF

Date: 2026-10-07
Branch: `guest-independent`
Status: PROTOTYPE BUILT / OWNER MOBILE VISUAL GATE PENDING
Design: NOCTURNE

## Purpose

Build the first real Opening + Cover + first scroll-transition proof without spending additional Recraft credits.

## Inputs

Approved/useful source material:
- Image B from first Recraft image round — rigid scene base;
- M04B Test 02 — approved hard optical/refraction compositing material.

Rejected motion material is NOT used:
- Seedance flattened-source Test 01;
- Seedance flattened-source Test 02;
- Seedance pure-light text-to-video plate.

## Prototype architecture

The prototype does NOT use AI video as the motion engine.

It combines:
1. rigid base scene;
2. approved optical material as screen-blended/masked layers;
3. live CSS light field;
4. native names/date/place/time;
5. typography reveal driven by the same directional-light logic;
6. foreground occlusion cut from the rigid scene so type visually sits inside depth;
7. sticky Cover with scroll-linked handoff;
8. optical material carried into the next scene;
9. reduced-motion fallback;
10. deterministic long-name stress mode.

## Motion principles implemented

- geometry never morphs;
- no pan/zoom video background;
- light is created through native compositing;
- optical material is fragmented and masked, never shown as a wallpaper;
- typography does not enter with generic fade-up;
- foreground scene elements can occlude native text;
- first section transition begins before Cover fully disappears;
- scroll controls scene handoff.

## Test content

Normal:
- Lucía
- Mateo
- 18 · 09 · 2027
- Cartagena
- 19:00

Long-name deterministic stress mode:
- Alejandra Victoria
- Maximiliano José

Stress state uses the same template and only a deterministic typography state; no layout/CSS manual repair.

## Prototype file

Conversation artifact:
`GUEST_D02_M05_NOCTURNE_MOTION_PROOF_V1.html`

SHA-256:
`b5feaf42707518ea19ba610dd0b29ecd1126011e22f51c4f1d8c2f8c17cd126b`

The prototype is self-contained and embeds optimized versions of the two approved Recraft source assets.

## Important limitation

This is a motion/art-direction proof, NOT:
- final typography;
- final copy;
- final template version;
- catalog registry entry;
- publication;
- Stripe wiring.

No additional invitation sections should be built until the owner mobile visual gate is passed.

## Owner gate

Review on a real mobile for:
- premium impression;
- whether movement feels structurally richer than Canva animation;
- whether light/material integration reads as intentional rather than tech/automotive;
- name reveal quality;
- depth/foreground occlusion;
- first scroll transition;
- whether the scene still reads as a wedding invitation rather than luxury branding.

If FAIL:
repair globally or reject the art direction.

If PASS:
seal M05 and proceed to D02-M06 interior visual system.


---

# REAL MOBILE GATE — V1 RESULT

Evidence:
- owner real-Android recording received 2026-10-07.

## Verdict
**V1 FAIL — GLOBAL CORRECTION REQUIRED.**

## Defects observed
1. Opening remains too dark for too long before readable content appears.
2. Foreground occlusion crosses the central name area too aggressively and makes the names look partially erased rather than spatially integrated.
3. Date/place/details are too small/subtle in the real mobile browser viewport.
4. Wedding signal is too weak during the first seconds; the scene can read as luxury architecture/brand campaign.
5. Motion is controlled but not yet strong enough to justify the premium proposition by itself.

## What remains valid
- rigid geometry approach;
- Recraft hard-optical material;
- live native masks/compositing;
- no AI-video dependency;
- overall dark cinematic territory;
- scroll-linked architecture.

## V2 correction
Prepared:
`GUEST_D02_M05_NOCTURNE_MOTION_PROOF_V2.html`

Changes:
- faster transition from darkness to readable state;
- "Nos casamos" promoted as an early human/wedding cue;
- names reach full legibility earlier;
- foreground occlusion moved away from the name core;
- metadata/details contrast and mobile size increased;
- optical/light movement made more perceptible while preserving restraint;
- same rigid source and approved Recraft material;
- no extra Recraft credits used;
- same deterministic long-name stress mechanism.

V2 requires real-mobile review before M05 can be sealed.


---

# REAL MOBILE GATE — V2 RESULT

Evidence:
- owner real-Android recording received 2026-10-07.

## Verdict
**V2 FAIL — PACING DEFECT ONLY.**

The art direction/system remains valid enough to continue iterating.
The failure is specifically timing/readability:

1. names resolve too quickly;
2. there is almost no resting/readable hold after both names become fully visible;
3. the first scroll gesture removes the names too aggressively.

## V3 correction

Prepared:
`GUEST_D02_M05_NOCTURNE_MOTION_PROOF_V3.html`

Changes:
- slower reveal choreography;
- Lucía begins later and resolves over ~2.15 s;
- Mateo begins later and resolves over ~2.2 s;
- supporting details resolve after names;
- scroll cue delayed to ~6.6 s;
- names remain fully present through the first meaningful swipe;
- text exit uses a separate delayed scroll variable rather than the general scene-progress variable;
- Cover sticky runway increased to create a deliberate reading/rest moment before handoff;
- no additional Recraft credits used;
- no art-direction redesign;
- same deterministic long-name behavior.

SHA-256:
`87a065afd308068d89019a4a34f7b6ae79b83136dad922ba6aaa829b9a90e8f1`

V3 requires real-mobile review before M05 can be sealed.


---

# REAL MOBILE GATE — V3 ROOT CAUSE FOUND

Owner Android evidence showed that the names still disappeared automatically within roughly one second after reveal, even without meaningful scroll.

## Root cause

This was NOT a pacing problem.

The persistent `-webkit-mask-image` / mask-position reveal used on the native name text behaves incorrectly on the real Android browser:
- names become visible while the mask travels;
- the final persisted mask state hides the text again.

Therefore increasing animation duration could never solve the defect.

## V4 correction

Prepared:
`GUEST_D02_M05_NOCTURNE_MOTION_PROOF_V4.html`

Changes:
- removed the persistent WebKit mask from name reveal;
- replaced it with deterministic JS-triggered clip-path reveal;
- names remain fully visible indefinitely after reveal;
- only real scroll handoff may fade the Cover copy;
- first name begins at ~2.2 s;
- second name begins at ~3.05 s;
- scroll cue delayed to ~7.2 s;
- browser scroll restoration forced to manual/top so reopening cannot inherit a previous scroll position;
- Cover exit threshold pushed later;
- JavaScript syntax PASS;
- no extra Recraft credits;
- no visual-system redesign.

SHA-256:
`9e3a640c37f87f11b96fd1374182b78a22398b523775a44f803f217d770fb662`

V4 requires one real Android confirmation that both names remain present after the reveal.
