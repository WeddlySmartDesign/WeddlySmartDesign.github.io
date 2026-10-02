# GUEST — GOLD STANDARD PILOT SPEC — 2026-10-02

Status: SEALED specification for PILOT 01.
Temporary pilot name: GUEST PILOT 01 — EDITORIAL MOTION.
This is a quality gate, not a commercial collection name.

## 1. Purpose
Build one complete invitation that proves GUEST can compete in premium digital wedding invitations under these constraints:
- no design work required from the owner;
- no new paid tools before a concrete limitation is proven;
- reusable template system, not a one-off artwork;
- mobile-first;
- clearly beyond what a couple can reproduce in Canva;
- strong enough visually that GUEST can be sold because of the invitation itself, independently of the management engine.

## 2. Reference synthesis
The pilot must combine:
- the memorable opening/reveal quality seen in high-end animated invitations;
- the editorial restraint and typography of premium wedding design platforms;
- the theme-specific integration of motion and RSVP used by the best cinematic products;
- the guided, done-for-you personalization model used by service-led competitors;
- a designed closing moment rather than ending abruptly after information or a form.

It must NOT copy any competitor's specific layout, artwork, animation sequence or naming.

## 3. First-impression rule
Within the first interaction, the guest must understand:
- whose wedding it is;
- that this is a premium invitation experience;
- that the motion is intentional, not decorative noise.

The opener may last roughly 1.5–3 seconds, but must never trap the guest behind a long animation.

## 4. Opening system — mandatory
Do NOT use the generic wax-sealed envelope as the pilot opener.

Pilot opener direction:
- tactile folded-paper / editorial reveal;
- full-screen textured cover;
- personalized monogram or initials as a subtle embossed/foil focal point;
- on tap, the cover unfolds or separates in layered perspective to reveal the hero;
- transition must use depth, shadow and controlled motion rather than multiple decorative particles.

Motion principles:
- transforms and opacity preferred;
- no bouncy easing;
- no excessive floating elements;
- reduced-motion fallback;
- content remains accessible even if animation fails.

## 5. Hero — mandatory
Hero must feel like a designed cover, not a website header.
Required:
- names;
- date;
- general location or venue;
- one strong visual asset: photograph OR bespoke art direction, not both competing;
- typographic hierarchy readable on 360–430 px mobile widths;
- visible path to continue scrolling;
- sound control visible but discreet.

Photo treatment:
- no generic circle, arch or decorative frame merely to contain a photo;
- preserve photo proportions;
- integrate the photograph through crop, layering, negative space or full bleed;
- configurable focal point/object-position.

## 6. Motion system
Maximum four SIGNATURE motion moments in the complete invitation:
1. opening reveal;
2. hero reveal / typographic entrance;
3. one mid-page editorial interaction;
4. closing scene.

All other motion is micro-motion only:
- gentle section entrances;
- small icon or divider transitions;
- button feedback.

The page must not feel like every element is trying to animate.

## 7. Interior art direction
The interior must preserve the premium level of the opening.

Pilot aesthetic:
- quiet editorial luxury;
- controlled palette;
- generous negative space;
- typographic contrast;
- visual rhythm built from scale and spacing, not decoration;
- one coherent illustration/photo language.

Forbidden:
- mixed illustration styles;
- clip-art appearance;
- repeated ornamental flourishes without function;
- decorative arches/circles used as default photo containers;
- unreadably small captions;
- generic card-grid appearance throughout the invitation.

## 8. Modular information system
The visual system must survive optional/reordered content.

Supported modules for pilot:
- story / short introduction;
- schedule;
- ceremony / celebration venue;
- map / directions;
- transport;
- accommodation;
- dress code;
- gifts / bank details;
- gallery;
- extra event or pre/post wedding event;
- RSVP.

Rules:
- modules can be hidden;
- a controlled subset can be reordered;
- no module may visually look like it comes from another product;
- the invitation must still look intentional with fewer modules.

## 9. RSVP — hard differentiator
RSVP must look like part of the chosen invitation.

Requirements:
- same typography, spacing, surfaces and interaction language;
- no generic white form dropped into an otherwise designed page;
- inputs sized for mobile;
- conditional questions remain visually calm;
- confirmation state is designed;
- decline state is designed;
- errors are clear but not visually harsh;
- the existing GUEST RSVP logic is consumed/reused where possible, not rewritten for visual novelty.

## 10. Closing scene — mandatory
The invitation must have a deliberate final scene.

Pilot direction:
- visual echo of the opening;
- the editorial card/fold motif returns;
- couple names or monogram;
- short final line;
- optional date reminder;
- if RSVP has been completed, the final state may acknowledge the response without exposing private data.

The closing must feel like the final page of a designed object, not a footer.

## 11. Music
Music is optional for the guest but supported by the design.

Rules:
- no forced autoplay with sound;
- first interaction can enable music with explicit user gesture;
- persistent small mute/play control;
- curated instrumental/ambient default track for prototype;
- music must never block navigation or RSVP;
- fade in/out rather than abrupt start/stop.

## 12. Personalization model
Base personalization after purchase should be parameter-driven.

Standard variables:
- couple names;
- initials/monogram;
- date/time;
- venue/location;
- texts;
- photos;
- module visibility;
- allowed module ordering;
- curated color variant(s);
- music choice;
- map links;
- RSVP questions/settings;
- extra-event details.

The couple does NOT control arbitrary layout, font combinations or unrestricted colors in the base product. Art direction stays protected.

Potential later premium variables, not required to prove pilot:
- venue illustration;
- custom opener asset;
- custom closing asset;
- bespoke monogram.

## 13. Production-effort ceiling
After the template is finished, a normal order should target:
- <= 30 minutes to inject and check couple-specific content;
- <= 15 minutes final mobile QA;
- target <= 45 minutes total routine production.

If standard orders routinely require > 60 minutes of manual design, the low/mid price model is not viable.

The owner must not need to operate design software.

## 14. Technical quality
Mobile-first test widths:
- 360 px;
- 390/393 px;
- 430 px.

Desktop must be intentionally composed, not a stretched mobile canvas.

Targets:
- motion should remain smooth on a mid-range Android phone;
- avoid layout shifts caused by late media;
- lazy-load noncritical images/media;
- provide video/image posters where needed;
- use compressed WebP/AVIF or equivalent where supported;
- respect prefers-reduced-motion;
- tap targets approx. 44 px minimum;
- readable contrast;
- semantic real text for names, dates and RSVP content where possible;
- animation failure must never make content inaccessible.

## 15. Canva barrier — PASS/FAIL
The pilot FAILS if a reasonable viewer can summarize it as:
"beautiful Canva wedding website/template with RSVP."

The pilot PASSES only if at least two of these are clearly non-Canva-like:
- opening interaction;
- layered depth / motion system;
- integrated art-directed photo treatment;
- themed RSVP interaction;
- closing sequence.

## 16. Competitive gate
Score internally from 0–10:
- first impression;
- art direction;
- typography;
- photo integration;
- motion quality;
- originality of interaction;
- interior consistency;
- RSVP integration;
- closing quality;
- mobile usability;
- performance perception;
- personalization scalability.

PASS:
- average >= 9.0;
- no critical visual criterion below 8.5;
- Canva barrier = PASS;
- routine personalization model remains within production ceiling;
- no paid tool is required merely to rescue weak art direction.

If the first pilot fails, one substantial revision is allowed.
If the second iteration still fails the gate, stop GUEST under the current business model rather than lowering the standard.

## 17. What is explicitly NOT being built yet
- full catalog;
- pricing tiers;
- commercial web;
- new GUEST engine features;
- custom from-scratch service;
- additional paid-tool workflow.

## 18. Next implementation block
Build PILOT 01 — EDITORIAL MOTION as an isolated GUEST invitation on guest-independent.
Do not modify existing commercial/validated ONE files.
Do not replace existing Essential/Signature files.
Create the pilot as a new isolated file + its own scoped styles/assets so it can be discarded cleanly if it fails.
