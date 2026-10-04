# GUEST — MASTER INVITATION CONFIGURATION MATRIX V1

Status: CANONICAL TEMPLATE-FIRST CONTRACT
Date: 2026-10-04

## 1. Product rule

A GUEST catalog invitation is a reusable template system, never a one-off demo.

Personalization target:
- map questionnaire data + uploaded photos into a chosen catalog template;
- make only configuration choices such as enabled modules, fit mode and focal point;
- finish personalization in a few minutes;
- never redesign the composition for an individual couple.

A template is NOT ready for the catalog if any supported configuration requires bespoke layout work.

## 2. Global invariants

Every catalog template must preserve:
- premium mobile-first appearance;
- the collection's own art direction;
- no visible GUEST / WeddlySmartDesign branding in the customer-facing invitation;
- warm couple-to-guests voice;
- readable body copy and obvious interactive controls;
- RSVP as one CTA into the existing GUEST RSVP flow;
- no duplicated RSVP decisions inside the invitation.

Every optional module must disappear cleanly:
- no blank placeholders;
- no empty gaps;
- no labels referring to absent content;
- adjacent sections reconnect naturally.

## 3. Master module matrix

| Module | Required? | Supported states | Structured data | Template obligations |
| --- | --- | --- | --- | --- |
| Opening | Yes | collection-defined motion | derived initials/names | Works without manual animation editing per couple |
| Cover | Yes | fixed art + optional photo where collection supports it | names, date, short place | Must survive short/long names and place labels |
| Countdown | Optional | off / on | wedding datetime | Disappears without leaving a gap |
| Story | Optional | off / text only / text + 1 photo | heading, body, photo config | Photo can be portrait, square or landscape |
| Locations | Yes | 1 shared place / 2 places | type, time, name, address, maps URL, optional website | Both 1 and 2 are first-class layouts |
| Dress code | Optional | off / on | short text | Micro-detail; does not become a major section |
| Agenda | Optional | off / 1–5 moments | time + label | Deliberate layout for every count 1–5 |
| Practical | Optional | 0–4 modules | bus, accommodation, gift, playlist | Deliberate layout for every count 0–4 |
| RSVP CTA | Yes | fixed | generated GUEST RSVP route + CTA label | No inline RSVP form |
| Gallery | Optional | off / 1–4 photos | per-photo fit/focus | Mixed orientations without broken crops |
| Closing | Yes | collection-defined | names/date/short line | Still coherent when interior modules are omitted |
| Typography | Configurable | template-approved variants only | typographyVariant | No arbitrary fonts that break layout |

## 4. Cover contract

Always shown:
- person 1 display name;
- person 2 display name;
- wedding date;
- short location label (normally city / area, not a long venue address).

Optional:
- couple photo only if the chosen collection explicitly supports a cover or sub-cover photo.

Validation:
- display name recommended <= 22 characters each; hard limit 30;
- short place recommended <= 24 characters; hard limit 36;
- typography scales within template-defined min/max sizes;
- line breaks are deterministic, not manually placed per wedding.

Required visual states:
- short + short names;
- long + long names;
- short place;
- long supported place;
- with photo where supported;
- without photo.

## 5. Countdown contract

States:
- OFF;
- ON.

Data:
- wedding date;
- start time when relevant;
- timezone.

Rules:
- no manual editing;
- when OFF, the next section moves up naturally;
- layout must support 1–3 digit day counts.

## 6. Story contract

States:
- OFF;
- text only;
- text + one photo.

Text:
- heading: template default or short custom heading;
- body recommended <= 320 characters; hard limit 450.

Photo model:
- source;
- derived width/height/orientation;
- fit = crop OR full;
- focusX 0–100;
- focusY 0–100;
- alt text.

Rules:
- all templates implement BOTH crop and full modes;
- crop is never a blind centre crop;
- full mode must still feel native to the collection;
- landscape / square / portrait are all supported;
- no approved output may cut one member of the couple or essential content;
- changing fit/focus is configuration, not redesign.

Required visual states:
- story OFF;
- text only;
- landscape photo crop;
- landscape photo full;
- portrait photo crop;
- portrait photo full;
- square photo;
- subject left / subject right focal stress.

## 7. Location contract

Modes:
- SHARED: one place for ceremony + celebration;
- SPLIT: ceremony and celebration are separate places.

Per location:
- type: shared / ceremony / celebration;
- time;
- venue name;
- address;
- maps URL;
- optional public website URL.

Global location-related fields:
- optional hero/venue image (0 or 1; never require two);
- optional dress code;
- optional save-to-calendar.

Validation:
- venue name recommended <= 40 characters; hard limit 55;
- address recommended <= 70; hard limit 100;
- time <= 10;
- map URL optional only when address is sufficient and the template does not expose a CTA; otherwise requested.

Rules:
- one-location mode has no empty second slot;
- two-location mode gives each place independent map action;
- save-date is global, not duplicated;
- dress code is optional and disappears cleanly;
- a second venue photograph is never required.

## 8. Agenda contract

States:
- OFF;
- 1, 2, 3, 4 or 5 moments.

Per moment:
- time;
- label.

V1 visual-content rule:
- time + moment is the guaranteed common denominator;
- descriptions are not part of the master requirement and may only exist in a collection that explicitly supports them.

Validation:
- label recommended <= 20 characters; hard limit 28;
- time recommended HH:MM or short text such as 'Después'.

Rules:
- order comes from the questionnaire;
- layout is deterministic for each count 1–5;
- no empty fixed positions;
- no manual repositioning.

## 9. Practical-information contract

Maximum visible invitation modules: FOUR.

V1 modules:
1. Bus / transport.
2. Accommodation.
3. Gift.
4. Playlist.

Dress code is NOT counted as Practical in V1; it is a location/event micro-detail.

States:
- 0 modules: Practical section disappears completely.
- 1 module: one deliberate composition.
- 2 modules: balanced composition.
- 3 modules: deliberate 3-item composition.
- 4 modules: deliberate 4-item composition.

No generic fallback grid is acceptable unless that grid is an intentional part of the collection art direction.

### 9.1 Bus / transport

Invitation role: information only.

Fields:
- enabled;
- pickupPoints: 1–3;
- outboundTimes: 1–3;
- returnTimes: 0–4;
- optional short note;
- optional map URL;
- collectUsageInRSVP yes/no;
- collectRouteChoiceInRSVP yes/no;
- collectReturnChoiceInRSVP yes/no.

Invitation action:
- optional 'Cómo llegar' only when useful;
- NEVER 'Reservar bus' when the choice is collected in RSVP.

### 9.2 Accommodation

Modes:
- ON_SITE: rooms at the venue/finca.
- ROOM_BLOCK: rooms pre-reserved at a hotel under a couple name/code.
- COUPLE_MANAGED: couple assigns or books rooms after guests respond.
- RECOMMENDED: informational recommendation only.
- EXTERNAL_BOOKING: guest books externally through a URL/third party.

Common fields:
- property name;
- address;
- public website URL;
- phone/contact method;
- optional map URL;
- optional short display note.

Conditional fields:
- booking code / couple name;
- discount text;
- deadline;
- price text;
- external booking URL;
- collectAccommodationInRSVP yes/no;
- collectNightsInRSVP yes/no;
- collectOccupancyInRSVP yes/no.

Invitation actions:
- 'Ver hotel' when a public website exists;
- 'Reservar' only in EXTERNAL_BOOKING mode;
- no duplicate room-choice action when the decision belongs in GUEST RSVP.

### 9.3 Gift

Modes:
- BANK;
- BIZUM;
- EXTERNAL_LINK;
- SHORT_TEXT.

Fields:
- optional short display line;
- data/details to reveal;
- optional external URL.

Rules:
- practical card/slot shows only concise copy;
- sensitive/long details are exposed through a deliberate action such as 'Ver datos', not dumped into the layout.

### 9.4 Playlist

Modes:
- EXTERNAL_LINK;
- GUEST_REQUEST where/when implemented.

Fields:
- optional short prompt;
- URL / target.

Rule:
- action appears only when a valid target exists.

## 10. RSVP contract

Invitation always shows one RSVP CTA.

RSVP configuration is derived from the same questionnaire/configuration:
- attendance: always;
- +1: optional;
- children: optional;
- transport: conditional on bus settings;
- accommodation: conditional on accommodation mode/settings;
- custom questions: existing GUEST capability.

The invitation does not duplicate those choices.

## 11. Gallery contract

States:
- OFF;
- 1, 2, 3 or 4 photos.

Per photo:
- source;
- derived width/height/orientation;
- fit = crop OR full;
- focusX;
- focusY;
- alt text;
- order.

Rules:
- one photo must not look like a broken carousel;
- >1 photo must have a clear swipe affordance;
- portrait / square / landscape / panoramic sources are supported;
- fit/focus is configurable per photo;
- no approved result may cut one partner or destroy essential environmental context;
- gallery should require only a quick fit/focus decision, never slide redesign.

## 12. Closing contract

Always:
- couple signature/names;
- wedding date or collection-defined short metadata;
- collection-defined closing visual/motion.

Optional:
- short closing line, recommended <= 80 characters.

Rules:
- closing must still feel intentional when Story, Agenda, Practical or Gallery are disabled.

## 13. Typography contract

Each catalog template defines a small approved set of typography variants.

Rules:
- couple chooses among approved variants only;
- each variant must already pass every count/text-length state;
- no arbitrary font upload;
- functional information always uses a legible font even when display typography changes.

## 14. Personalization workflow target

Normal order:
1. Couple chooses catalog design.
2. Couple completes structured questionnaire and uploads photos.
3. System produces config.
4. Renderer builds invitation automatically.
5. Internal review adjusts only:
   - photo fit if needed;
   - focal X/Y if needed;
   - approved typography variant if chosen;
   - obvious data typo/validation issue.
6. Preview is sent to couple.

Target:
- no section redesign;
- no manual element repositioning;
- no custom CSS per couple;
- minute-level production pass.

## 15. Template approval rule

A template may enter the catalog only after:
- schema validation PASS;
- per-section variant matrix PASS;
- end-to-end configuration QA PASS;
- Android mobile QA PASS;
- copy/legibility PASS;
- no supported scenario requires bespoke redesign.


## 16. Fixed-title policy

Section titles are owned by the catalog template and are not editable by the couple.

Reason:
- they are part of the art direction;
- their length affects composition;
- fixed titles keep the questionnaire simple;
- fixed titles make personalization deterministic and fast.

Example VEIL LIGHT title set:
- Cover phrase: “Nos casamos”.
- Story: “Nuestra historia”.
- Locations: “Dónde nos vemos”.
- Agenda: “Así será el día”.
- Practical: “Para que lo tengáis fácil”.
- Gallery: collection-approved fixed label.
- RSVP context/title: collection-approved fixed wording.
- Closing: collection-defined.

Couple-written text remains limited to approved fields such as custom Story, short notes and optional closing line.
