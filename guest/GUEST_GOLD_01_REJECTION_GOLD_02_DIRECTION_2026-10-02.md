# GUEST — GOLD 01 rejected / GOLD 02 direction
Date: 2026-10-02
Branch: `guest-independent`
Status: **GOLD 01 FAIL — GOLD 02 ACTIVE**

## Scope boundary
- GUEST only.
- Do not modify ONE, ONE Partner or STUDIO.
- Do not publish GUEST while invitation art direction is unresolved.
- GUEST engine remains in standby except for later visual integration.

## Real-device verdict on GOLD 01
The owner reviewed `guest/gold-01-gate-candidate.html` on Android Chrome.

### What survived
- Opening mechanics: acceptable, not exceptional.
- Closing mechanics: acceptable, not exceptional.
- Technical implementation and automated QA remain useful as engineering reference.

### Why GOLD 01 fails the product gate
1. The invitation reads as luxury/corporate editorial before it reads as a wedding invitation.
2. Large serif headings, beige/black blocks, thin rules and chapter-like composition create brochure/brand language.
3. The venue illustration and modular section rhythm reinforce a corporate/architectural landing-page feel.
4. Without the couple photo, the page does not communicate “wedding” strongly enough.
5. The interior does not exceed Signature; Signature has stronger wedding identity and emotional coding.
6. The RSVP is styled, but the overall journey is still recognisable as a conventional premium landing page.
7. Therefore GOLD 01 fails GOLD STANDARD A (impact/differentiation) and B (coherence at the required wedding-premium level), regardless of its technical PASS.

The owner summarized the failure accurately: it feels like a basic Canva composition with added opening/closing motion. This is treated as a design-direction failure, not a request for cosmetic tweaks.

## Anti-regression rule
Do NOT fix GOLD 01 by changing palette, fonts or spacing. Do NOT reuse its corporate editorial interior as the starting point for another invitation.

Explicitly avoid:
- chapter labels / magazine-like editorial hierarchy;
- alternating beige/black corporate content blocks;
- giant high-fashion serif headlines as the dominant visual language;
- architectural-brochure composition;
- decorative photo arches/frames;
- scrapbook/washi/polaroid shortcuts;
- generic form dropped at the end;
- using motion as the only reason the design feels premium.

## Signature becomes the minimum visual floor
Signature is not the target style, but it is the minimum wedding-identity floor. GUEST must be visibly above it in:
- first-frame emotional impact;
- wedding-specific visual language;
- photo integration;
- movement with purpose;
- RSVP integration;
- closing experience;
- apparent personalization.

## GOLD 02 — WEDDING VELLUM
Internal direction only. Not public naming.

Core idea: **physical wedding stationery comes alive digitally**.

### Visual language
- full-bleed wedding photography, not photo-in-shape;
- translucent vellum as the opening gesture instead of an envelope;
- handwritten/calligraphic accents used as emotional gestures, not as UI decoration;
- animated botanical linework and venue drawing;
- warmer wedding palette with rose/wine/sage/ivory variation;
- continuous photographic journey rather than corporate section cards;
- tactile paper references without scrapbook effects;
- program represented as a celebration route rather than a business timeline;
- RSVP treated as part of the stationery system;
- closing returns to vellum/photography for a deliberate final scene.

### Non-negotiable perception test
If photographs are mentally removed, typography, composition, illustration and language must still communicate “wedding invitation”, not “luxury brand website”.

### Industrialization test
The system must support at least two couples by changing data, palette and imagery without structural redesign.

## Implementation
Isolated candidate files:
- `guest/gold-02-gate-candidate.html`
- `guest/gold-02-wedding-vellum.css`
- `guest/gold-02-wedding-vellum.js`

No production/commercial/runtime integration is part of this iteration.

## Internal QA before owner review
- JS syntax: PASS.
- structural gate: PASS.
- no horizontal-overflow rule present.
- `prefers-reduced-motion`: present.
- two data variants: present.
- RSVP yes/no state and ICS generation: implemented.
- decorative photo arches removed.
- tape/washi/scrapbook effects removed after internal review.
- local Chromium navigation is restricted by the execution environment; an offline in-memory render was used to check composition and DOM interaction. It showed no JS errors and no horizontal overflow at 390x844, but this does NOT replace Android real-device review.

## NEXT ACTION
1. Commit GOLD 02 candidate only to `guest-independent`.
2. Owner opens the finished candidate on Android and reviews the whole experience.
3. Judge only: wedding identity, premium level versus Signature, photo integration, emotional continuity, RSVP integration and motion quality.
4. If GOLD 02 is still not clearly above Signature or still feels Canva-reproducible, do not create a catalog. Perform one final direction decision: either one last materially different pilot or stop GUEST under the agreed stop condition.
