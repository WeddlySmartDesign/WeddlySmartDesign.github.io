# GUEST — DESIGN 02 · D02-M03 RECRAFT PRODUCTION PACK 01

Date: 2026-10-07
Branch: `guest-independent`
Status: READY TO EXECUTE
Design: NOCTURNE
Scope: Opening + Cover motion proof only.

## Purpose

Produce the minimum Recraft material needed to prove the NOCTURNE premium motion language before any full invitation build.

This pack is intentionally narrow:
- one hero visual family;
- one selected still master;
- one motion plate derived from that master;
- no Story / Location / Agenda / Practical / RSVP / Closing production yet.

Owner role:
- copy prompt;
- generate requested batch;
- return the candidates/results;
- no manual design decisions.

ChatGPT role:
- direct;
- select;
- reject;
- refine;
- integrate after approval.

---

# 1. CURRENT RECRAFT WORKFLOW BASIS

Recraft Studio currently supports:
- Recraft V4/V4.1 image generation;
- image-to-video in the same canvas;
- multiple video models including Kling, Veo, Sora, Seedance and others.

For this microblock:
- IMAGE MASTER: Recraft V4 / highest-quality available image mode.
- MOTION MASTER: Kling 3 Pro preferred for precise controlled motion.
- FALLBACK MOTION: Veo 3.1 Standard if Kling distorts architecture/material continuity.

Do not use Fast variants for the final candidate unless a Standard/Pro generation is demonstrably no better.

---

# 2. CREDIT-EFFICIENCY RULE

Do not explore broadly.

Round 1:
- generate exactly **4 image candidates** from Prompt A.
- return all 4 together in one screenshot/export set.
- ChatGPT selects one or rejects the batch.

Only after one still is selected:
- generate exactly **2 image-to-video candidates** using Prompt B on the SAME selected image.
- return both.
- ChatGPT selects one or issues one focused correction.

No additional generations without a specific defect and specific correction instruction.

---

# 3. PROMPT A — COVER MASTER IMAGE

Use portrait / vertical mobile composition.
Use Recraft V4 or best available Recraft image model.
No text.

### Prompt

Cinematic luxury wedding visual world after dark, created as a premium moving invitation master frame rather than a finished poster. Deep warm ink-black environment, restrained oxblood reflections, warm ivory and champagne directional light, sophisticated chiaroscuro, realistic optical reflections, layered foreground / midground / background depth, dark smoked glass, polished stone and subtle architectural surfaces, elegant negative space for very large couple names, asymmetrical composition, high-fashion fragrance campaign restraint, premium European black-tie atmosphere, intimate and sensual without being theatrical.

The composition must visibly contain THREE DEPTH PLANES that can later feel independent in motion:
1. distant dark atmospheric architecture with soft depth;
2. a reflective midground surface catching a narrow warm beam;
3. a close foreground shadow or glass edge that partially crosses the scene.

One narrow diagonal warm light source enters from outside frame and catches different surfaces at different depths. The light must feel physically present in the space, not painted as a flat gradient. The scene should feel moments before an elegant evening celebration begins, but must not depict a specific venue.

Leave sophisticated negative space in the central-to-lower visual field for dynamic native typography. Keep the most visually complex detail away from the name zone.

Photorealistic, cinematic, optical depth, luxury campaign art direction, highly controlled composition, realistic materials, refined darkness, premium mobile 9:16 framing.

### Negative constraints

No text. No letters. No monogram. No couple. No people. No wedding arch. No envelope. No curtain. No florals as main motif. No bouquet. No glitter. No gold foil effect. No star field. No fairy-light wallpaper. No generic bokeh. No candles as dominant subject. No red carpet. No nightclub. No casino. No gothic decor. No ornate frame. No circle or arch-shaped empty photo area. No obvious hotel lobby. No obvious house interior. No blank flat gradient. No generic website background. No central spotlight circle. No symmetrical stage. No Canva-style composition.

---

# 4. IMAGE ACCEPTANCE GATE

Reject any image immediately if:
- it reads as hotel/interior photography;
- it is beautiful but flat;
- it has fewer than 3 believable depth planes;
- the light looks like a gradient overlay;
- there is no clean zone for long names;
- it only feels premium because it is dark;
- it contains an obvious decorative wedding trope;
- it could be used unchanged as a finished Canva background.

Preferred candidate:
- strongest depth;
- strongest controlled light direction;
- least literal setting;
- greatest capacity for masking/occlusion;
- most visually distinctive still frame.

The still itself is NOT the product.
It is the motion source.

---

# 5. PROMPT B — IMAGE-TO-VIDEO MOTION MASTER

Apply only to the selected Prompt-A image.

Preferred model:
**Kling 3 Pro**.

Camera:
fixed or almost fixed.
No obvious dolly-in.
No sweeping camera travel.

Duration target:
5–7 seconds if available.

### Motion prompt

Preserve the exact architecture, composition, framing, materials, geometry and negative space of the source image. Do not redesign the scene.

Create sophisticated physical light movement through depth.

The scene begins almost unlit. A narrow warm champagne beam enters gradually from the same direction already implied in the source image. The beam travels across the environment and reveals the three depth planes at different moments: first a faint distant atmospheric reflection, then the midground reflective material, then a controlled edge of the foreground glass/shadow.

The foreground and midground should show extremely subtle independent optical response: tiny reflection shifts, slight parallax-like depth separation and realistic changing specular highlights caused by the moving light. The architecture itself must remain stable.

The light should widen and soften during the final third, creating a calm resting composition suitable for readable wedding typography. The ending should feel settled and premium, not like a loop restarting.

Movement must be slow, precise, restrained and physically believable. Luxury fragrance-film lighting. No dramatic camera move. No object morphing. No new objects. No people appearing. No decorative particles.

The premium effect must come from light moving through depth, not from camera movement.

### Motion negative constraints

Do not move walls, columns or architectural geometry.
Do not warp surfaces.
Do not add people.
Do not add flowers.
Do not add text.
Do not add sparkles or floating particles.
Do not add rain, smoke or fog effects.
Do not introduce a new light source.
Do not zoom continuously.
Do not pan across the scene.
Do not create a generic fade-in.
Do not make the whole image brighten uniformly.
Do not create a looping pulse.
Do not alter the colour palette.
Do not invent a wedding venue.

---

# 6. VIDEO ACCEPTANCE GATE

A motion candidate fails if:
- the whole image merely gets brighter;
- the camera movement creates the interest;
- architecture warps;
- light feels digital rather than physical;
- motion is equivalent to Canva pan/fade/zoom;
- the scene loses the negative-space typography zone;
- motion is busy enough to hurt reading;
- it looks like an AI-video demo rather than a luxury invitation.

A motion candidate passes only if:
- light travels through depth;
- different planes react differently;
- the composition remains stable;
- there is a calm final resting state;
- the video gives us material that can be combined with live masks/type/scroll to create a non-Canva result.

---

# 7. WHY THIS DOES NOT BECOME A VIDEO-BACKGROUND TEMPLATE

The Recraft video will not be the complete Cover.

Integration after approval will add:
- live native names/date/place/time;
- light-aware text reveal;
- live SVG/CSS mask synchronized with the visual light direction;
- optional real couple photo revealed through that mask;
- foreground occlusion over native type/photo;
- scroll-linked transition into the next scene;
- deterministic long-name behavior.

Therefore the finished Cover cannot be reproduced by simply uploading this video to Canva and placing text over it.

---

# 8. OWNER ACTION — ROUND 1 ONLY

Do exactly this:
1. Open Recraft Studio.
2. Select Image.
3. Select Recraft V4 / highest-quality Recraft image mode available.
4. Set vertical 9:16.
5. Paste Prompt A + Negative constraints.
6. Generate **4 candidates only**.
7. Send the 4 candidates together for selection.

Do NOT animate any candidate yet.

This keeps the first review to one decision and avoids wasting video credits on a weak base image.

---

# 9. M03 STATUS

READY FOR OWNER RECRAFT ROUND 1.

No code integration begins until Prompt-A master image passes.
No other Design 02 sections begin until Opening/Cover motion proof passes.


---

# 10. EXECUTION CORRECTION — SINGLE CLOSED RECRAFT ORDER

Owner must never receive fragmented video instructions.

For every Recraft generation ChatGPT must provide, in one block:
- exact source asset;
- exact model;
- exact aspect ratio;
- exact resolution;
- exact duration;
- exact number of generations;
- ONE complete prompt containing all positive and negative constraints.

No separate add-ons, no "variant" suffixes, no second negative-prompt block unless Recraft explicitly exposes a separate negative-prompt field for the selected model.

## Current test order

Source:
- selected Image B.

Model:
- Seedance 1.5 image-to-video.

Reason:
- Recraft officially documents Seedance 1.5 as supporting image-to-video;
- this is a low-cost concept-validation step;
- expensive Kling/Veo passes are reserved for final refinement only if the direction proves itself.

Settings:
- aspect ratio: preserve source vertical 9:16;
- resolution: lowest/preview quality available sufficient for motion judgment;
- duration: 5 seconds;
- generations: 1.

Only after that single result is reviewed may a second generation be authorized.


---

# 11. M03 TEST 01 RESULT — SEEDANCE 1.5 / IMAGE B

Source:
- Image B selected from first Recraft image pair.

Video:
- 5.04 s
- 496 × 864
- 24 fps
- Seedance 1.5 image-to-video test

## Verdict

**FAIL AS FINAL / USEFUL AS DIRECTIONAL TEST.**

The concept of light moving through a dark layered scene is worth continuing.
The generated clip is not acceptable for integration yet.

## What passed

- camera remains comparatively restrained;
- overall palette stays coherent;
- warm light progression creates more premium interest than a static image;
- foreground diagonal occlusion remains visually useful;
- dark central zone still offers potential for live typography;
- final state is comparatively calm.

## What failed

### 1. Geometry mutation
The source architecture is not preserved strongly enough.

During the animation:
- a rounded/arched opening is invented in the central structure;
- the apparent shape and relationship of columns/opening change through time;
- architectural forms subtly morph rather than remaining stable.

This violates the scalability/premium rule:
motion must come from light and optical response, not AI geometry transformation.

### 2. Light behaves too much like a revealed doorway
The central bright region becomes a large luminous opening.
That reads more like:
- a doorway being revealed;
- a scene redesign;
than:
- one physical light source traveling across existing depth planes.

### 3. Insufficient independent material response
There is some change in highlights, but not enough evidence that background, midground and foreground are reacting independently.
The result still depends too much on the global central reveal.

### 4. Source composition is being reinterpreted
The model uses the still as inspiration rather than holding it as a rigid plate.
For NOCTURNE, that is not good enough.

## Decision

Do NOT move to expensive Kling/Veo yet.

Run exactly one second low-cost corrective test using the same Image B and Seedance 1.5.
The corrective goal is:
- freeze geometry;
- remove the invented doorway/arch behavior;
- restrict animation to moving highlights/reflections/light;
- keep central architecture dark and stable.

If Test 02 still morphs geometry, stop using Seedance for this source and reassess whether:
A) a different source image with simpler geometry is required, or
B) the final premium motion should be built from separately generated Recraft layers rather than single-image video generation.


---

# 12. M03 TEST 02 RESULT — SEEDANCE 1.5 / IMAGE B

Video:
- 5.04 s
- 496 × 864
- 24 fps
- same Image B source
- corrective prompt prioritizing rigid geometry

## Verdict

**FAIL / STOP SEEDANCE ON THIS FLATTENED SOURCE.**

## Improvement over Test 01

- source architecture remains substantially more stable;
- camera is acceptably restrained;
- the dark composition and foreground diagonal remain usable;
- central typography zone remains available.

## Remaining failure

The moving light becomes an explicit bright ribbon / light-painting trail.

Observed behavior:
- a narrow bright line grows into a curved luminous path;
- it reads as an animated effect rather than physically plausible illumination;
- the line becomes the subject of the scene instead of light revealing material;
- this risks a synthetic AI-video aesthetic and does not meet premium admission.

Even though geometry is better preserved, this is not the desired luxury-light behavior.

## Decision

Do NOT spend a third Seedance generation on Image B.
Do NOT escalate to expensive Kling/Veo yet.

The next efficient strategy is **separate light-motion material from static geometry**:
1. keep a rigid source/master scene;
2. generate motion as an abstract light/reflection plate with no architecture to mutate;
3. integrate that moving plate over/through the rigid scene using native masking/blending;
4. add live native typography and scroll interaction in the renderer.

This makes the premium motion depend on compositing + responsive scene behavior, not on an AI model redrawing architecture frame by frame.

Next microblock:
**D02-M04 — RECRAFT LIGHT PLATE + COMPOSITING PROOF.**
