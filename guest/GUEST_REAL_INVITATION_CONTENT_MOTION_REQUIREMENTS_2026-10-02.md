# GUEST — REAL INVITATION CONTENT + MOTION REQUIREMENTS — 2026-10-02

## Principle
The real catalog invitation is a premium modular system, not a fixed sequence.
Capabilities can exist in the template while individual blocks are enabled/disabled per couple.
No visible GUEST / WeddlySmartDesign branding inside the customer-facing invitation.
RSVP is a CTA into the existing GUEST RSVP flow, never a duplicated inline RSVP form.

## Core capabilities — must exist in the system
- Couple names + wedding date.
- Premium opening.
- Cover / hero.
- Support for a couple photo on cover and/or sub-cover without decorative Canva-like frames.
- Wedding location / venue block, with map CTA where needed.
- RSVP CTA connected to the existing GUEST RSVP route.
- Designed ending / closing.
- Mobile-first behavior.

## Configurable / optional blocks
These capabilities must be available but can be disabled per couple:
- Countdown.
- Agenda / wedding-day timeline.
- Couple story text.
- Secondary couple photo / sub-cover photo.
- Final couple photo gallery with swipe/carousel behavior.
- Additional location details if ceremony and celebration differ.
- Optional practical-information blocks may be added later without changing the visual system.

## Photography rules
- Photos must be integrated into the art direction, not placed inside generic arches, circles, cards or collage shortcuts.
- A design may be photo-led or art-led, but photography cannot be the only reason it reads as a wedding invitation.
- Gallery should feel like part of the invitation, not a generic web carousel.

## Motion — NOT YET VALIDATED
Motion is a separate product gate and must be proven before the real invitation is approved.

Required motion language:
1. One dominant movement language per invitation, matching the art direction.
2. Premium opening gesture.
3. Purposeful transitions between major moments.
4. Subtle ambient movement / depth where it adds atmosphere.
5. Native-feeling photo-gallery swipe.
6. Restrained micro-interactions for CTA, countdown and interactive elements.
7. Designed closing motion.

Avoid:
- animation on every element;
- generic fade-up on every section;
- parallax everywhere;
- motion added only to make a static Canva-like layout feel premium;
- multiple unrelated animation styles.

## Motion test before full build
Before building the complete real invitation:
- select the restrained visual direction;
- prototype opening + one hero transition + one gallery swipe + closing;
- review on Android;
- only if motion materially elevates the experience should the full invitation be assembled.

## Current next action
Define the first restrained REAL catalog direction with these capabilities in mind, then run the motion gate before expanding to the full invitation.


## Signature parity — mandatory options
GUEST must never expose fewer invitation-content options than current Signature.

The invitation system must support, as configurable/optional modules:
- bus / transport information and CTA;
- hotel / accommodation information and CTA;
- dress code;
- gift / contribution information;
- playlist / song-request CTA;
- one shared venue for ceremony + celebration OR two separate ceremony/celebration locations;
- configurable agenda / moments of the day;
- configurable typography family / font style;
- countdown;
- story;
- couple photos;
- final gallery;
- RSVP CTA into the existing GUEST RSVP.

These modules may be visually reinterpreted per catalog design; they must not become generic repeated cards by default. Each catalog direction should preserve its own art direction while retaining feature parity.

## Motion beyond cover
Premium motion is not limited to opening/hero/closing.
Interior sections should use purposeful interaction/motion where appropriate:
- agenda/moments: progressive timeline, staged reveals, or other coherent movement;
- celebration/story photography: restrained parallax/depth or reveal;
- locations: clear interactive state when there are two venues;
- optional information: scroll-snap / staged modular presentation when useful;
- gallery: native-feeling swipe.

Avoid motion everywhere; use a coherent rhythm with 2–3 interior dynamic moments.


## Voice and mobile legibility
The invitation is written by the couple to people close to them.
Required voice:
- warm, familiar, natural, affectionate;
- elegant without sounding corporate, editorial or institutional;
- avoid brand/landing-page language;
- practical information should sound like the couple helping their guests, not product documentation.

Mobile legibility is non-negotiable:
- informational body copy must remain comfortably readable on mobile;
- do not use ultra-small uppercase labels for important information;
- decorative typefaces are for headlines/moments, not functional copy;
- contrast must win over aesthetic subtlety;
- buttons and interactive controls must look unambiguously tappable.

Interior dynamism must feel designed, not like generic scroll-reveal:
- use image-led transitions, progressive stages, scale/line changes, and scene rhythm;
- maintain calmness, but never confuse restraint with visual flatness.


## Transport / hotel scalability model
GUEST invitation and RSVP must be configuration-driven, not manually redesigned per couple.

### Bus / transport
Invitation purpose: INFORMATION ONLY.
Display when enabled:
- pickup location(s);
- outbound departure time(s);
- return time(s);
- short note if needed;
- optional map/directions action only when location clarity requires it.

Do NOT use a “reserve bus” button inside the invitation when the couple has enabled transport questions in the GUEST RSVP. Attendance/transport selections belong to RSVP.

Couple questionnaire must capture:
- transport enabled yes/no;
- pickup point(s);
- outbound time(s);
- return time(s);
- whether guests must confirm bus use;
- whether route/return-time choice is required;
- optional notes;
- optional map/location.

RSVP must conditionally expose the corresponding bus question(s).

### Hotel / accommodation
Invitation purpose: INFORMATION ONLY unless an external booking action is genuinely required.
Accommodation must support multiple modes because couples organize lodging differently:
1. On-site accommodation / finca rooms — couple needs to know whether guests will stay.
2. Pre-reserved room block at named hotel — guests book with hotel using couple name/code/discount.
3. Couple-managed allocation — couple assigns/reserves rooms after guests request accommodation in RSVP.
4. Recommended accommodation only — informational, no RSVP lodging question unless the couple explicitly wants one.
5. External booking link — show direct booking CTA only when the hotel requires guests to book externally.

Couple questionnaire must capture:
- accommodation enabled yes/no;
- accommodation mode;
- venue/hotel name;
- address;
- booking/contact method;
- reservation code / couple name / discount code if applicable;
- deadline if applicable;
- price/discount text if the couple wants it shown;
- whether guest accommodation choice must be collected in RSVP;
- optional occupancy/nights questions where applicable;
- optional external booking URL.

Invitation copy renders from structured fields, not from arbitrary free text by default. RSVP questions are enabled from the same configuration.

### Product rule
Practical modules must be optional and reflow automatically. The invitation must remain visually complete with none, some or all practical modules enabled. No empty gaps, no fixed positions reserved for missing modules, and no redesign required per couple.
