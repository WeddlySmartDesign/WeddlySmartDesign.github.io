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


## Hotel website link rule
If an accommodation/hotel module is shown and the hotel has a public website, the invitation should expose a direct “Ver hotel” / hotel website link even when booking/room-choice is handled through RSVP or by phone.

Rationale:
- the invitation informs guests which hotel it is and lets them inspect it;
- RSVP remains the place to collect accommodation choice when the couple needs that response;
- the website link is informational/navigation, not a duplicate “reserve” action.

The questionnaire must therefore capture:
- hotel/venue website URL (optional but requested whenever accommodation is enabled);
- booking phone/contact method where relevant;
- code/couple name/discount details;
- whether booking is external, by phone, on-site, or couple-managed.

Rendering rule:
- show hotel website link when URL exists;
- show external booking CTA only when booking truly happens externally;
- otherwise keep reservation/occupancy decisions inside RSVP.


## Story photo scalability
The “Nuestra historia” photo must be safe-by-default for arbitrary couple photography.

Rules:
- Default rendering mode is FULL, not destructive cover-crop.
- Horizontal, square and vertical source images must be supported without redesign.
- The template detects source orientation and adapts the media container.
- Portrait images may be height-capped and centered; landscape/square images may use their natural aspect ratio.
- Optional crop mode is allowed only as a reviewed override with explicit focus X/Y values.
- The default must never sacrifice one member of the couple merely to fill a fixed decorative viewport.
- Story-photo configuration therefore includes: source, fit mode (full/crop), focusX, focusY and alt text.

## Ceremony / celebration location scalability
Location rendering must support one shared venue or two separate locations from the same component.

Rules:
- One location: render one large location entry; no empty second slot.
- Two locations: render Ceremony and Celebration as two ordered entries, each with its own time, name, address and map URL.
- Each location map link is independent.
- Dress code remains an optional micro-detail and disappears cleanly if unused.
- Calendar/save-date is global, not duplicated per location.
- The visual treatment must not require a second venue photograph; one main venue image is sufficient.
- Questionnaire/config fields must support location count, type, time, venue name, address and map URL for each entry.


## TEMPLATE-FIRST PRINCIPLE — NON-NEGOTIABLE
GUEST catalog designs are templates/products, not one-off demos.

The order of work is mandatory:
1. Define the complete configuration model and allowed variants.
2. Define layout behavior for every supported combination.
3. Define validation limits for copy, links, image ratios and optional data.
4. Only then design the visual template.
5. A catalog design is not approvable until every supported configuration keeps the same visual quality without manual redesign.

Primary commercial objective:
- after the couple completes the questionnaire, personalization should take only a few minutes;
- personalization means mapping structured data/photos into a validated template, not redesigning the invitation;
- no template may rely on a specific number of modules, one specific photo ratio, one venue topology, or one amount of text.

### Core configuration matrix that every catalog template must support

#### Cover
Always:
- couple names;
- wedding date;
- location / city or agreed short place label.
Optional:
- cover/sub-cover couple photo where the collection supports it.
Rules:
- text remains legible across supported name lengths;
- cover art cannot depend on a particular couple photo.

#### Story
Config:
- enabled yes/no;
- heading / short story copy within validated limits;
- 0 or 1 main story photo;
- photo orientation: portrait / landscape / square;
- fit policy: crop with explicit focal point OR full;
- optional secondary photo only where the template explicitly supports it.
Rules:
- no person may be unintentionally cut;
- composition must remain premium with or without the photo.

#### Locations
Config:
- 1 shared location OR 2 separate locations (ceremony + celebration);
- for each location: type, time, venue name, address, map URL;
- optional website where relevant;
- optional dress code as a micro-detail;
- global save-date action.
Rules:
- no empty second slot;
- one-location and two-location variants are both first-class layouts, not fallbacks;
- design cannot require two venue photographs.

#### Agenda / moments
Config:
- 1 to 5 moments;
- each moment: time + label; optional short detail only if the catalog template explicitly supports it.
Rules:
- layout reflows for 1/2/3/4/5;
- no fixed empty positions;
- no manual repositioning per couple.

#### Practical information
Config:
- 0 to 4 visible practical modules in the invitation;
- modules may include bus/transport, accommodation, gift, playlist and other approved practical modules;
- accommodation has the previously defined sub-modes;
- transport has the previously defined sub-modes;
- actions only appear where the action is genuinely external/informational (e.g. hotel website, gift details, playlist link), not when the decision belongs in RSVP.
Rules:
- 0 modules: section disappears completely and adjacent sections join naturally;
- 1/2/3/4 modules: each has a deliberate premium composition;
- structured short fields preferred over unrestricted paragraphs;
- no redesign per couple.

#### RSVP
Config:
- one CTA into the existing GUEST RSVP;
- questionnaire/RSVP fields are derived from the same invitation configuration;
- no duplicate bus/hotel decision flow inside the invitation.

#### Gallery
Config:
- 1 to 4 photos;
- each photo can be portrait / landscape / square;
- per-photo crop/focal configuration where needed;
- full-image mode where crop would destroy composition.
Rules:
- 1/2/3/4 photos all look intentional;
- carousel affordance remains clear when >1 photo;
- no guest-visible broken crop, missing partner, or loss of essential background;
- personalization should require only choosing fit/focus, not redesigning slides.

#### Closing
Always:
- couple names or approved closing signature;
- wedding date / short closing line as defined by collection.
Optional:
- collection-specific closing motion/art.
Rules:
- must remain coherent regardless of which optional interior sections were omitted.

### Approval gate
Before any visual version is shown to the owner, the template must be internally checked against a configuration test matrix that includes at minimum:
- locations: 1 and 2;
- agenda: 1, 3 and 5 moments;
- practical: 0, 1, 2, 3 and 4 modules;
- gallery: 1 and 4 photos, including mixed orientations;
- story photo: portrait and landscape;
- long/short names and representative copy lengths.

If any supported combination requires bespoke design work, the template is not finished.
