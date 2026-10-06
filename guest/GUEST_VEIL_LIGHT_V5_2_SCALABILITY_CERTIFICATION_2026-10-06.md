# GUEST — VEIL LIGHT V5.2 SCALABILITY CERTIFICATION

Date: 2026-10-06
Status: TECHNICAL MATRIX PASS / REAL-ORDER GATE 2 PENDING

## Decision boundary
VEIL LIGHT V5.2 remains the visually approved master for the current pilot. Certification is architectural: no supported order may require per-couple CSS, timing, manual positioning or layout repair.

The template is NOT yet declared 100% frozen. Final certification still requires a second, materially different questionnaire order to render through the normal order flow without design intervention.

## Couple-specific dependency audit
A non-scalable inherited branch was found: `I&H` received a special initials behavior path.

Corrected candidate:
- one generic initials path for every couple;
- initials derived only from `name1 + name2`;
- `I&H` runtime comparisons: 0;
- Isabel/Hugo conditional behavior hits: 0;
- Pilar/Jorge conditional behavior hits: 0.

Historical sample names remain only in internal fixture/sample data; no runtime behavior depends on them.

## Opening motion asset
The embedded V5.2 entry MP4 was extracted and inspected across representative frames from 0.0 s through 10.0 s, including the door-to-clean-veil boundary.

PASS:
- no baked initials;
- no baked names/date;
- reusable independently of couple data;
- personalized initials remain native/config-driven.

The current V5.2 opening remains visually approved provisionally by the owner. A future Recraft improvement is optional, not required for this gate.

## Supported-state matrix
77 cases were run without editing the template between configurations at:
- 360 x 800;
- 390 x 844;
- 430 x 932.

Total: **231/231 PASS**
Page JavaScript errors: **0**

Coverage includes Cover, Countdown, Story crop/full and orientation states, shared/split Locations, Agenda 0–5, Practical 0–4 and all accommodation modes, RSVP variants, Gallery 0–4/mixed orientations, Closing omissions, typography variants and mandatory E2E-01 through E2E-07.

Agenda count-5 remains locked at the approved 35 px time / 28 px label scale.

## Generic defects found and fixed once
1. Long cover names: inherited `long-names` state could collapse to 16 px after repeated fitting. Fixed with deterministic collection clamp.
2. Long split-location content: fitter reset adaptive geometry on every pass and could oscillate/overlap. Reset now occurs only when new config is rendered; fitting converges automatically.
3. Long unbroken Practical values: booking codes could exceed grid min-content width. Generic safe wrapping added.

All 231 runs pass after these master-level corrections.

## Real-order gates
### Gate 1 — Pilar & Jorge mobile
Visual render: PASS.
Review readiness remains correctly blocked because the legacy questionnaire order has Playlist enabled with no URL. Do not invent a URL and do not restart the questionnaire.

### Gate 2 — second PC questionnaire
PENDING.
Order `829f4998-f328-4c6a-be49-d73fd3aaa2f7` remains draft/empty.

A test harness has been prepared from the real PC questionnaire. It auto-enters a deliberately different supported configuration through the actual form controls and normal step validations/saves, then stops on the real Review step for explicit final submit:
- accented/different initials;
- long supported names/place;
- custom Story text-only;
- two long supported Locations;
- Agenda 5 with after-midnight continuation;
- all 4 Practical modules including long booking code;
- +1 + children;
- Gallery OFF.

Artifact:
`/GUEST/END_TO_END_PILOT_2026-10-06/GUEST_QUESTIONNAIRE_PC_SCALE_GATE_AUTOFILL_V1.html`

Offline harness QA: reaches Review with all intended values, no client validation error and no JS page error.

## Current status
- Technical template matrix: **PASS 231/231**
- Neutral opening asset: **PASS**
- Couple-specific runtime exception audit: **PASS**
- First real-order visual render: **PASS**
- Second questionnaire order: **PENDING**

Overall: **NOT YET 100% FROZEN**.

Certification candidate:
`/GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V5_2_CERT_CANDIDATE.html`

V5.2 can be marked 100% scalable/frozen only after Gate 2 generates correctly without per-order design/code intervention.


## FINAL GATE 2 RESULT — PASS

The second questionnaire order was submitted successfully:
- order id: 829f4998-f328-4c6a-be49-d73fd3aaa2f7
- status after submit: submitted
- resolved_config generated automatically by guest-invitation-flow
- no per-order design/CSS/timing/position change was made.

Exact second-order characteristics:
- names: Álvaro Alejandro / Íñigo Maximiliano;
- initials: Á&Í;
- long supported cover place;
- custom Story text with no photo;
- two long split Locations;
- Dress code ON;
- Agenda 5 including 02:30 continuation-of-night ordering;
- all 4 Practical modules;
- external-booking accommodation with long booking code;
- bank gift;
- Playlist;
- +1 + children in RSVP questionnaire;
- Gallery OFF.

The exact backend-resolved config was rendered through the same certified V5.2 renderer at:
- 360 x 800;
- 390 x 844;
- 430 x 932.

Second-order renderer result: **PASS at all 3 widths**.
Checks:
- 0 horizontal document overflow;
- 0 Cover overflow;
- 0 split-Location event overlap;
- 0 Agenda row overlap;
- 0 Practical item overlap;
- Story text-only state correct;
- Gallery OFF state correct;
- Agenda count = 5;
- Practical count = 4;
- derived initials = Á&Í;
- 0 page JavaScript errors.

Visual review of the stress order also passed:
- long names remain intentional and readable;
- both long Locations remain separated and legible;
- 5-item Agenda retains approved 35px / 28px scale;
- 4-item Practical composition remains coherent;
- closing supports the long names/place without overflow.

The scalability fixes introduced during certification are generic master fixes only:
1. deterministic long-name clamp;
2. convergent split-location fitting;
3. safe wrapping of long Practical tokens;
4. removal of the inherited I&H-specific initials branch.

They do not create per-order behavior and do not alter normal supported states unnecessarily.

## CERTIFICATION DECISION

**VEIL LIGHT V5.2 = 100% SCALABLE / FROZEN for the supported configuration contract.**

This means:
- supported questionnaire data -> deterministic render;
- no bespoke CSS;
- no per-couple animation/timing adjustment;
- no manual element repositioning;
- no required Recraft regeneration per order;
- only normal data/config mapping and review remain operational tasks.

Frozen canonical artifacts:
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_VEIL_LIGHT_V5_2_SCALABLE_FROZEN.html
  - SHA-256: 6706afb02baea28ac18809336474c7333a4cd31706ecc538de730096599aa956
- /GUEST/END_TO_END_PILOT_2026-10-06/GUEST_PRODUCTION_MANAGER_V5_2_SCALABLE_FROZEN.html
  - SHA-256: 64a218c42632ed89d5d33176ff5e9fce910574527b7b9730b581a243fa130365

The optional future Recraft cover improvement does NOT reopen scalability certification unless the motion architecture changes.

Next project step:
- propagate this exact certified V5.2 renderer into Review and Final pilot surfaces;
- resume the end-to-end review/change/delivery workflow;
- do not redesign VEIL LIGHT and do not reopen template scalability QA without a reproducible supported-state defect.
