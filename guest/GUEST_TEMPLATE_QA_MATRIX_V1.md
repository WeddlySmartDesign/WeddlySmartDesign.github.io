# GUEST — TEMPLATE QA MATRIX V1

Status: MANDATORY PRE-CATALOG GATE
Date: 2026-10-04

Purpose: prove that a catalog design is a template, not a demo.

## 1. Pass criteria

A template passes only if:
- no test requires HTML/CSS redesign;
- no test requires manual element repositioning;
- only data, enable/disable state, photo fit and focal point may change;
- mobile legibility remains acceptable;
- art direction remains premium in all states;
- no empty or orphaned layout states appear.

## 2. Section-level test matrix

### Cover
C1: short names + short city.
C2: two long supported names + long supported place.
C3: minimum visual text.
C4: cover photo ON when template supports it.
C5: cover photo OFF.

### Countdown
D0: OFF.
D1: ON with >99 days.
D2: ON with <10 days.

### Story
S0: OFF.
S1: text only.
S2: landscape photo + crop.
S3: landscape photo + full.
S4: portrait photo + crop.
S5: portrait photo + full.
S6: square photo.
S7: subjects concentrated left.
S8: subjects concentrated right.
S9: max supported story text.
Required: no partner/essential subject is unintentionally cut.

### Locations
L1: one shared location.
L2: ceremony + celebration.
L3: one long venue name.
L4: two long venue names.
L5: maps links ON.
L6: dress code OFF.
L7: dress code ON.
L8: venue image absent.
L9: venue image present.
Required: no blank second slot and no need for two venue photos.

### Agenda
A0: OFF.
A1: 1 moment.
A2: 2 moments.
A3: 3 moments.
A4: 4 moments.
A5: 5 moments.
A6: max supported label lengths.
Required: no manual spacing/repositioning.

### Practical
P0: 0 modules.
P1: 1 module.
P2: 2 modules.
P3: 3 modules.
P4: 4 modules.
P5: Bus with 1 pickup / 1 return.
P6: Bus with max supported stops/times.
P7: Accommodation ON_SITE.
P8: Accommodation ROOM_BLOCK.
P9: Accommodation COUPLE_MANAGED.
P10: Accommodation RECOMMENDED.
P11: Accommodation EXTERNAL_BOOKING.
P12: Hotel website present.
P13: Hotel website absent.
P14: gift with details action.
P15: playlist action.
Required: invitation never duplicates RSVP decisions.

### RSVP CTA
R1: standard CTA.
R2: transport RSVP enabled.
R3: accommodation RSVP enabled.
R4: both enabled.
Required: still exactly one invitation RSVP CTA.

### Gallery
G0: OFF.
G1: 1 portrait.
G2: 1 landscape.
G3: 2 mixed.
G4: 3 mixed.
G5: 4 mixed.
G6: panoramic landscape.
G7: subject at left edge.
G8: subject at right edge.
Required: >1 clearly reads as carousel; 1 does not look like broken carousel; no partner is cut.

### Closing
E1: all optional sections ON before close.
E2: practical OFF.
E3: story OFF.
E4: gallery OFF.
E5: agenda OFF.
E6: several optional sections OFF.
Required: closing transition remains intentional.

### Typography
T1..Tn: run core stress cases using every approved typography variant.

## 3. Mandatory end-to-end scenarios

### E2E-01 Minimal
- countdown OFF;
- story OFF;
- one shared location;
- dress code OFF;
- agenda 1;
- practical 0;
- gallery 1 landscape;
- default closing.

### E2E-02 Maximum common
- countdown ON;
- story + landscape photo;
- two locations;
- dress code ON;
- agenda 5;
- practical 4;
- room-block accommodation;
- bus with multiple return times;
- gallery 4 mixed;
- +1 and children RSVP enabled.

### E2E-03 Photo stress
- story portrait;
- gallery: portrait + square + landscape + panorama;
- subjects positioned at different edges.

### E2E-04 Text stress
- long supported names;
- long supported place;
- long venue names;
- max story copy;
- max agenda labels;
- max practical structured display values.

### E2E-05 Sparse middle
- story text only;
- one location;
- agenda OFF;
- practical 1;
- gallery OFF.
Required: invitation must not look empty or unfinished.

### E2E-06 RSVP transport/accommodation
- bus enabled + usage/return choice in RSVP;
- accommodation couple-managed + accommodation choice in RSVP.
Required: invitation shows information, not duplicate choice buttons.

### E2E-07 External accommodation
- room-block/external booking;
- hotel website + booking URL + code + deadline.
Required: 'Ver hotel' / external booking action appears correctly without creating RSVP duplication.

## 4. Device gate

At minimum:
- Android mobile owner review;
- narrow viewport ~360px;
- medium mobile ~390–430px;
- no horizontal page overflow;
- touch targets usable;
- text readable without zoom;
- opening/motion does not block scroll incorrectly;
- reduced-motion fallback remains usable.

## 5. Output of QA

Each catalog design gets:
- template version;
- test matrix result;
- known supported limits;
- any intentional collection-specific exclusions;
- PASS / FAIL.

No visual approval can override a FAIL in the configuration matrix.
