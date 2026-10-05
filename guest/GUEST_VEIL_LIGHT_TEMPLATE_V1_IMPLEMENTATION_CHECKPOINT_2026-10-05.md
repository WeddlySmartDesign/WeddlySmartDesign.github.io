# GUEST — VEIL LIGHT TEMPLATE V1 IMPLEMENTATION CHECKPOINT

Date: 2026-10-05
Status: FIRST REAL TEMPLATE RENDERER BUILT / NOT YET CATALOG-APPROVED

## What changed

VEIL LIGHT is no longer being developed as a one-off V8.x demo.

A first real configuration-driven renderer has been built from the canonical GUEST matrix and couple questionnaire.

Implemented states:
- reusable opening with dynamic initials; no couple initials are baked into the motion layer;
- Cover: fixed “Nos casamos” + names + date; place/time independently optional;
- global approved typography variant;
- Countdown ON/OFF;
- Story OFF / text-only / text+photo;
- Story photo CROP/FULL + per-photo focal point;
- Locations: one shared place OR ceremony + celebration;
- one optional location hero photo; default VEIL visual when absent;
- optional Dress code as a micro-detail;
- Agenda: 1–5 moments, automatically sorted chronologically, with 00:00–05:59 treated as wedding-night continuation;
- Practical: 0–4 modules with deliberate count layouts;
- Bus is informational in invitation;
- Accommodation rendering derives from the canonical accommodation mode;
- Gift can expose details through a deliberate action instead of dumping sensitive/long text in the layout;
- RSVP remains one CTA into the existing confirmation flow;
- Gallery: 1–4 photos, per-photo CROP/FULL + focal point; one photo has no carousel affordance;
- Closing remains independent from omitted optional sections.

## Opening scalability

The Canva opening with fixed I&H is NOT the production mechanism.

Template V1 uses:
- reusable VEIL art;
- native dynamic initials generated from name1/name2;
- a reusable door movement;
- native cover names/date/place/time.

This removes the need to edit Canva/Recraft for every couple.

## Internal configuration checks completed

27 logic/configuration states checked without bespoke layout changes:
- Locations: 1 / 2.
- Agenda: 1 / 2 / 3 / 4 / 5.
- Practical: 0 / 1 / 2 / 3 / 4.
- Gallery: 1 / 2 / 3 / 4.
- Story: OFF, text-only, crop photo, full photo.
- Cover optional place/time: all four combinations.
- Typography: classic / romantic / contemporary.

Agenda stress order confirmed:
17:30 -> 19:00 -> 19:30 -> 21:00 -> 00:00.

All 27 configuration checks passed at the data/renderer-rule level.

## Important limitation before approval

This checkpoint is NOT owner visual approval and NOT publication.

The local headless Chromium environment could not be used for reliable automated screenshots, so final visual/mobile approval still requires opening the finished self-contained renderer on the owner’s real mobile.

## Exact next gate

Owner reviews the renderer as ONE template:
- visual quality;
- opening/cover continuity;
- Story;
- one/two location presentation;
- Agenda;
- Practical;
- mixed Gallery;
- RSVP CTA;
- closing.

If the visual gate passes, next is explicit state-by-state mobile QA (minimal / maximum / one location / 5 agenda / 0–4 practical / mixed gallery) before catalog approval.
