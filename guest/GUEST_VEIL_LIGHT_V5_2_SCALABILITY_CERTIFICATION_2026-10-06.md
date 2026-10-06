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
