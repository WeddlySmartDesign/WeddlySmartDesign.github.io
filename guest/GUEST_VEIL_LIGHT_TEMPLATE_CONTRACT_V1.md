# GUEST — VEIL LIGHT TEMPLATE CONTRACT V1

Status: PRE-VISUAL IMPLEMENTATION CONTRACT
Date: 2026-10-04

Purpose: define how VEIL LIGHT behaves for every supported configuration BEFORE further visual iteration.

V8.10 remains a visual reference for quality in already successful areas, but no V8.x artifact is the template implementation.

## 1. Collection identity

VEIL LIGHT:
- quiet luxury, ivory / warm beige;
- translucent veil/fabric as the dominant material language;
- restrained, elegant, romantic;
- calm does not mean empty or flat;
- photography is integrated, never generic framed-photo UI;
- motion is soft, continuous and material-led.

## 2. Opening — scalability requirement

The opening must be reusable without editing video in Canva/Recraft for each couple.

Therefore:
- personalized initials/names may NOT be permanently baked into the motion asset;
- the reusable door/veil motion is neutral;
- initials/names are rendered as native editable overlay content;
- opening derives initials automatically from name1 + name2;
- no manual animation timing change per couple.

Supported:
- 1-character + 1-character initials;
- accented Latin characters;
- long display names do not affect opening because only initials are used.

If the current Canva opening contains fixed I&H artwork, it is reference-only and must be replaced once by a neutral reusable master, not edited per sale.

## 3. Cover

Always:
- name1;
- name2;
- date;
- short place.

VEIL LIGHT behavior:
- veil hero remains the main visual;
- cover copy is HTML/CSS/native content, never baked into art;
- typography automatically scales between collection-defined min/max;
- deterministic name line-break rules.

States to build:
- short names;
- long names;
- long supported place;
- optional cover photo OFF by default for this collection.

## 4. Countdown

VEIL LIGHT supports:
- OFF;
- ON.

ON:
- compact, quiet typographic treatment;
- no boxed countdown widget.

OFF:
- Story/next section closes the space naturally.

## 5. Story

States:
- OFF;
- text only;
- text + photo.

VEIL LIGHT photo presentations:

### Story CROP
Use when a premium immersive crop can preserve the couple/subject.
- collection-defined immersive viewport;
- focusX/focusY mandatory;
- no blind centre crop.

### Story FULL
Use when crop would remove a person or important environment.
- image shown at a ratio appropriate to its source;
- surrounding space uses VEIL LIGHT material/fabric language, not a generic card, black bars or blurred-photo background;
- landscape, square and portrait each have a defined layout state.

Internal personalization:
- upload photo;
- choose CROP or FULL;
- if CROP, adjust focal point;
- no CSS/layout editing.

Story body:
- fixed max length from master matrix;
- template supports text-only state with a material-led visual rhythm so photo is not required.

## 6. Locations

Supported:
- one shared venue;
- ceremony + celebration separate.

Shared venue state:
- one location treatment with greater visual breathing room;
- type label may be omitted or say 'Ceremonia y celebración';
- one time/name/address;
- map link;
- optional website;
- optional Dress code micro-detail;
- global Save date.

Split venue state:
- same visual component, two compact ordered entries;
- Ceremony entry: time/name/address/map;
- Celebration entry: time/name/address/map;
- each map link independent;
- optional website link per place when useful;
- optional Dress code remains a micro-detail, not a third card/section;
- global Save date appears once.

Photography:
- 0 or 1 location hero photo.
- Two locations never require two photos.
- No photo state uses VEIL LIGHT art background and remains premium.

Design rule:
- location information must not cover most of the hero image;
- no giant white app-style card;
- one- and two-location states are separately designed and tested.

## 7. Agenda

Supported count:
- OFF;
- 1–5 moments.

VEIL LIGHT visual rule:
- one atmospheric veil image/background;
- all enabled moments visible within one scene where mobile height permits;
- guaranteed content = time + label only;
- no icons by default;
- no repeated background per moment.

Count behavior:
- 1: centered hero moment, larger type.
- 2: balanced vertical pair.
- 3: evenly distributed three-line rhythm.
- 4: current approved four-line rhythm.
- 5: five-line rhythm with reduced but still legible spacing/type, no overflow.

No manual repositioning.

## 8. Practical information

VEIL LIGHT Practical V1 modules:
- Bus;
- Accommodation;
- Gift;
- Playlist.

Count:
- 0–4.

Background:
- approved subtle VEIL LIGHT Recraft fabric asset or equivalent reusable material background;
- background remains visible;
- section must not fall below Agenda in perceived design quality.

Layout states:
- P0: section absent.
- P1: one centered composed item.
- P2: balanced pair.
- P3: 2 + 1 composition with no item made artificially more important.
- P4: balanced 2 x 2 / collection-specific spatial composition with equal hierarchy.

No module becomes central merely because of count.

Every module is rendered from structured fields and a short normalized display model.

### Bus display normalization
Preferred display:
- pickup/place line;
- outbound time line;
- return time line;
- optional map action.

Long notes remain capped.

### Accommodation display normalization
VEIL LIGHT supports all master accommodation modes.

ON_SITE:
- property/venue name;
- concise accommodation note;
- optional website;
- room decision stays in RSVP if configured.

ROOM_BLOCK:
- hotel name;
- reservation name/code;
- optional short rate/deadline;
- 'Ver hotel' when website exists;
- 'Reservar' only when truly external.

COUPLE_MANAGED:
- accommodation name where applicable;
- concise note that allocation is managed by the couple;
- request/choice lives in RSVP.

RECOMMENDED:
- property name;
- optional address/short note;
- 'Ver hotel' when website exists;
- normally no accommodation RSVP question.

EXTERNAL_BOOKING:
- property name;
- code/deadline if applicable;
- 'Ver hotel' optional;
- 'Reservar' external CTA.

### Gift
- concise label/copy;
- 'Ver datos' or external link when applicable;
- no long bank data dumped into layout.

### Playlist
- concise prompt;
- one action only when target exists.

## 9. RSVP

Always:
- one VEIL LIGHT CTA to existing GUEST RSVP.

Never:
- inline RSVP form;
- separate bus reservation button when GUEST RSVP collects bus choice;
- separate accommodation choice button when GUEST RSVP collects accommodation choice.

## 10. Gallery

Supported:
- OFF;
- 1–4 photos.

VEIL LIGHT requires two per-photo presentation modes:

### GALLERY CROP
- immersive 4:5-ish collection viewport;
- per-photo focusX/focusY;
- used only when both people/essential content remain visible.

### GALLERY FULL
- used for landscape/panorama images that should preserve environment;
- photo is presented at a source-appropriate ratio;
- surrounding slide uses VEIL LIGHT veil/material composition;
- NO black bars;
- NO blurred-photo filler;
- NO automatic pan that can remove the couple from view.

Count behavior:
- 1: no carousel affordance; single intentional photo scene.
- 2: swipe carousel + 2-state progress.
- 3: swipe carousel + 3-state progress.
- 4: swipe carousel + 4-state progress.

Mixed modes are allowed inside the same gallery:
- e.g. crop, crop, full, crop.

The slide language must remain coherent even when ratios differ.

Internal personalization per photo:
- choose CROP/FULL;
- adjust focus if CROP;
- reorder only according to questionnaire;
- no manual slide redesign.

## 11. Closing

Always:
- names/signature;
- date / collection-approved short metadata;
- VEIL LIGHT closing motion/art.

Closing is independent from optional middle sections.

## 12. Typography

VEIL LIGHT will expose only pre-approved typography variants.

Each variant must pass:
- cover long names;
- locations 1/2;
- agenda 1/5;
- Practical 1/4;
- RSVP/closing.

Typography choice may never trigger manual layout repair.

## 13. VEIL LIGHT implementation order

DO NOT continue by visually patching V8.x.

Build in this order:
1. data/config renderer;
2. opening neutral-personalization layer;
3. Cover states;
4. Story states;
5. Location 1/2 states;
6. Agenda 1–5 states;
7. Practical 0–4 + accommodation mode rendering;
8. Gallery 1–4 + CROP/FULL states;
9. Closing;
10. full QA matrix;
11. only then owner review of VEIL LIGHT as a template.

## 14. Approval gate

VEIL LIGHT is not catalog-ready until every state above passes the master QA matrix with no custom CSS or redesign.
