# ACTUALIZACIÓN PRIORITARIA D02 — V14.7 (2026-10-09)

Se conserva la política canónica. El checkpoint más reciente de Botánica es `guest/GUEST_D02_BOTANICA_READ_FIRST.md` y su manifiesto `guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V3_2026-10-09.json`. V14 permanece congelada; **V14.7 solo candidata técnica** (20 pruebas visuales locales de Historia, paridad estándar y medios verificados). El backend v12 actual no admite Botánica y transforma `story.textMode='none'` en `preset`, por lo que faltan pedidos reales, integración RSVP/entrega y Android. No publicar ni certificar hasta resolver estos gates en entorno autorizado. Las referencias V14.5/V14.6 que aparezcan en la cronología son históricas, no estado vigente.

---

# GUEST — CANONICAL MASTER / DO NOT DRIFT

Date: 2026-10-07
Repository: WeddlySmartDesign/WeddlySmartDesign.github.io
Branch: guest-independent
Status: CANONICAL MASTER — READ FIRST BEFORE ANY GUEST WORK

This file is the highest-priority product-direction checkpoint for GUEST.
If any later note, chat recollection or implementation idea conflicts with this file, STOP and resolve the conflict before changing the product.

---

## 1. PRODUCT HIERARCHY

### Primary commercial product / purchase entry

PREMIUM DIGITAL WEDDING INVITATIONS.

The customer enters because:
- they like a design;
- the design fits their taste;
- the price fits;
- the buying/personalization process feels premium and extremely simple.

They are NOT expected to know WeddlySmartDesign, GUEST, the management engine, RSVP architecture or any internal product terminology before buying.

Current first approved catalog design:
- VEIL LIGHT V5.3.3 — commercially frozen.

Launch target:
- minimum 5 premium invitation designs;
- target 6 designs;
- every design must be 100% scalable before sale.

### Secondary included differentiator

THE EXISTING GUEST-MANAGEMENT APPLICATION.

It is already built.
It is NOT a new system to build.
It is NOT a second product the couple must consciously choose.
It is included as the powerful downstream value of the invitation.

The couple buys because of the invitation.
They later discover that the same product also gives them a powerful guest-management system.

---

## 2. CANONICAL CUSTOMER JOURNEY

The canonical commercial/customer flow is:

see designs
-> understand what the invitation includes
-> choose design
-> buy
-> provide wedding/details
-> WeddlySmartDesign prepares the chosen design
-> owner reviews quickly on mobile
-> couple reviews
-> couple requests changes if needed
-> couple approves
-> final invitation is delivered
-> that same final invitation is already connected to the EXISTING guest-management app
-> couple adds/imports guests
-> groups/subgroups/invitation units
-> personalize send message
-> select recipients / contacts
-> send the invitation
-> guests respond through the existing RSVP engine
-> responses feed the existing management app
-> logistics / +1 / children / menu / allergies / transport / accommodation
-> tables / visual room plan / multi-select seating
-> controlled lists / print / PDF / catering
-> extra events and their invitations/RSVP.

The direction change from the old concept is COMMERCIAL FLOW DIRECTION ONLY.

Old mental model:
management app -> invitation.

Canonical model:
premium invitation -> included existing management app.

---

## 3. ABSOLUTE OPERATING MODEL

Customer perception:
PREMIUM, HIGHLY PERSONALIZED DESIGN.

Owner reality:
INDUSTRIALIZED, CERTIFIED TEMPLATE SYSTEM.

Target:
- normal order = review only;
- exceptional supported order = bounded safe adjustment only;
- owner intervention target <= 5 minutes;
- owner works from mobile;
- no HTML/CSS/layout editing per couple;
- no arbitrary position/timing changes per couple;
- no one-off fixes tied to a couple.

If a template regularly needs manual design intervention, that template has FAILED scalability and must be repaired globally or removed from sale.

The hard work is done ONCE per design during design + scalability certification, not repeated per sale.

Core principle:
"Percepción de diseño premium personalizado = realidad de aproximadamente 5 minutos de trabajo de la propietaria."

---

## 4. TEMPLATE CATALOG ARCHITECTURE

Every catalog design is a visual plugin of ONE common product pipeline.

Designs may be visually completely different.

They MUST share:
- the same commercial flow;
- the same order model;
- the same common questionnaire architecture;
- the same canonical invitation config schema;
- the same owner workflow;
- the same customer review/approval workflow;
- the same final-delivery contract;
- the same recipient-context contract;
- the same existing guest-management engine;
- the same existing send/RSVP engine.

A template may NOT create:
- a second questionnaire product;
- another guest list;
- another send engine;
- another RSVP engine;
- another management app;
- another table/list system.

Canonical launch:
- minimum 5 designs;
- target 6;
- all 100% scalable before sale.

---

## 5. TEMPLATE VERSIONING

Every order stores:
- template_id;
- template_version.

The version is PINNED when the order is created.

A future update to a template must never silently alter a wedding order already in progress.

Template-specific typography or safe visual presets belong to that template's registry entry.

They must not be hard-coded as VEIL-LIGHT assumptions for the whole catalog.

---

## 6. COMMON DATA / QUESTIONNAIRE

Canonical config schema:
- guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json

All designs use the same common product data model.

The selected template changes the visual rendering, not the customer workflow.

The common questionnaire:
- remains one product flow;
- may show different visual reference images according to the selected design;
- must use normal representative examples, not extreme scalability-test examples;
- must use simple customer-facing language;
- must not assume product/internal knowledge.

If a future design genuinely needs a new customer datum, that datum is reviewed and added once to the common schema/questionnaire.
It is NOT implemented as a private per-template workaround.

---

## 7. CUSTOMER LANGUAGE RULE

Never assume the customer knows:
- GUEST;
- WeddlySmartDesign;
- what the management app includes;
- what RSVP means technically;
- how invitation sending works;
- how responses reach their list;
- that tables/PDFs/extra events exist.

Function first, brand second.

Preferred customer-facing labels:
- "vuestra invitación"
- "Invitación VEIL LIGHT" when identifying the selected design
- "gestión de invitados"
- "vuestra lista de invitados"
- "enviar invitaciones"
- "respuestas"
- "mesas"
- "listados"

VEIL LIGHT = invitation design selected by the couple.

GUEST = existing guest-management app.

If the word GUEST appears in customer-facing copy, identify it immediately, for example:
"GUEST · gestión de invitados incluida con vuestra invitación".

Never use bare unexplained module/product names.

---

## 8. EXISTING GUEST ENGINE — DO NOT REBUILD

The management engine already exists and is the one to use.

Existing validated functionality includes:
- guest list;
- groups;
- subgroups;
- import / multi-person creation;
- invitation units;
- personalized send message;
- contact picker / stored contacts;
- WhatsApp / native share / copy flow;
- send status;
- RSVP;
- +1;
- children;
- menu / allergies;
- transport;
- accommodation;
- custom RSVP questions;
- tables;
- visual room/table plan;
- multi-select seating / moving guests;
- controlled lists;
- print / PDF;
- catering summaries;
- extra events;
- per-extra-event selected guests;
- extra-event invitations and RSVP;
- owner Today/status/change views;
- existing sync architecture.

Relevant existing production line includes:
- guest/guests-v116-production.html
- guest/guests-rsvp-share-composer-v2.js (legacy)
- guest/guests-rsvp-share-composer-v3.js (catalog-aware bridge)
- guest/guests-rsvp-contact-picker-v1.js
- guest/guests-rsvp-operations-live.html
- guest/guests-seating-multiselect-v1.js
- guest/guests-events-share-composer-v1.js

DO NOT rebuild any of those capabilities as a new system.

---

## 9. INVITATION ↔ EXISTING MANAGEMENT BRIDGE

The actual integration task was a BRIDGE, not a new GUEST build.

The approved catalog invitation becomes the active main invitation used by the EXISTING send flow.

Current implementation:
- Supabase guest-invitation-flow v9;
- DB field guest_invitation_orders.delivery_url;
- guest/guests-catalog-invitation-bridge-v1.js;
- guest/guests-rsvp-share-composer-v3.js;
- guest/guest-catalog-recipient-context-v1.js;
- bridge wired into guest/guests-rsvp-operations-live.html.

Backend behavior:
- order resolved by template_id;
- template_version pinned per order;
- final delivered invitation stores stable delivery_url;
- authenticated active_for_member resolves the delivered invitation through the same existing license used by the management app.

Existing send behavior remains:
- same guest/person;
- same invitation unit;
- same personalized message;
- same contacts;
- same WhatsApp/native-share/copy behavior;
- same sent status;
- same RSVP engine.

The only change is:
the existing send flow uses the stable final catalog invitation URL when one exists.

Legacy fallback remains available when no catalog delivery URL exists.

No second guest list / sender / RSVP engine is created.

---

## 10. SHARED RECIPIENT CONTEXT

Every catalog invitation receives the same recipient context:
- rt = existing RSVP public token;
- g = single guest id OR
- u = invitation unit id;
- lang = language.

The shared recipient helper turns this into the existing RSVP route.

A template renders the CTA visually.
It does NOT implement its own RSVP backend.

This contract must be identical for Design 01–06.

---

## 11. TEMPLATE ADMISSION / SCALABILITY GATE

A design cannot enter sale until ALL are true:

1. premium visual quality approved on a real phone;
2. full supported configuration matrix PASS;
3. supported mobile widths PASS;
4. no JS/layout failures;
5. names/locations/texts/optional modules have deterministic handling;
6. no template edit between test cases;
7. common questionnaire can express supported states;
8. review/final renderer parity PASS;
9. recipient-context / existing RSVP bridge PASS;
10. second completely different real-order render PASS;
11. no per-couple design intervention;
12. owner mobile workflow PASS;
13. normal order is review-only;
14. maximum owner touch target <= 5 minutes.

Only then:
template registry status = commercially-frozen.

VEIL LIGHT V5.3.3 is template #1 and remains commercially frozen.

---

## 12. VEIL LIGHT STATUS

VEIL LIGHT:
- V5.3.3;
- commercially frozen;
- 100% scalable certification completed;
- visual robustness pilot completed;
- no routine per-couple CSS/layout edits;
- owner safe edits only;
- do not redesign from zero;
- do not alter except for a reproducible real defect.

Its visual language is NOT the catalog architecture.
Future designs may be completely different visually while respecting the same technical/product contract.

---

## 13. OWNER MOBILE MODEL

Owner must be able to operate from mobile.

Current owner workspace:
- GUEST Mobile Center Android app;
- updateable local center content;
- one working place instead of scattered chat/files;
- order review;
- safe edits;
- preview;
- customer review simulation;
- final-delivery checking.

The owner workflow must remain:
open order
-> inspect
-> bounded edit only if genuinely needed
-> send review
-> deliver after approval.

No routine template coding.

---

## 14. EMAIL / COMMUNICATION EXPERIENCE

The entire experience is part of the product.

A beautiful invitation does not compensate for confusing:
- buying;
- questionnaire;
- communication;
- review;
- delivery;
- sending;
- guest management.

Product goal:
the couple chooses because of design and recommends because both the invitation AND the process/management experience were excellent.

Emails/messages must:
- explain what happens next;
- never assume knowledge of the brand/system;
- be visually premium;
- avoid flat transactional copy;
- avoid internal/process language such as "this is not a template";
- avoid asking the customer to understand our internal architecture.

Current direction:
- order received email: explain next steps;
- review email: explain exactly what to check and how to approve/request changes;
- final delivery: explain clearly that the final invitation is ready AND introduce the included guest-management capability by function, not unexplained brand language.

Do NOT say "Add to GUEST".
The invitation is already connected to the included management experience.

---

## 15. COMMERCIAL HOLD

Do NOT:
- publish the new GUEST catalog commercial flow yet;
- connect the new catalog order flow to live Stripe yet;
- expose unfinished public production routes.

The bridge is installed but remains dormant until a real delivered catalog order has a stable delivery_url.

This is intentional.

---

## 16. FUTURE DESIGN 02–06 RULE

Every new design:
- may have a unique visual identity;
- must use the common schema;
- must use the common questionnaire architecture;
- must expose a common renderer adapter;
- may expose only certified safe owner controls;
- must use the same delivery bridge;
- must use the same recipient context;
- must use the same existing management app;
- must pass the full scalability gate;
- must meet <=5 minute owner-touch target.

Do not start selling a design because it looks good.
Sell only after it is operationally scalable.

---

## 17. ABSOLUTE PROJECT BOUNDARIES

- Work only on branch guest-independent for GUEST.
- Do not touch ONE.
- Do not touch ONE Partner.
- Do not touch STUDIO.
- Do not rebuild GUEST.
- Do not create parallel guest-management features.
- Do not create another RSVP engine.
- Do not create another sending system.
- Do not create manual per-order design workflows.
- Do not publish/connect Stripe until explicitly authorized.

---

## 18. CANONICAL SUPPORTING FILES

Read in this order:

1. guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md
2. guest/CURRENT_STATE.md
3. guest/GUEST_PRODUCT_DIRECTION_CANONICAL_2026-10-07.md
4. guest/GUEST_CATALOG_PIPELINE_CONTRACT_V1.md
5. guest/GUEST_CATALOG_TEMPLATE_PLUGIN_CONTRACT_V1.md
6. guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json
7. guest/GUEST_CATALOG_BRIDGE_CHECKPOINT_2026-10-07.md
8. guest/GUEST_MOBILE_OWNER_WORKSPACE_2026-10-07.md
9. guest/GUEST_VEIL_LIGHT_V5_2_SCALABILITY_CERTIFICATION_2026-10-06.md

---

## 19. ONE-SENTENCE NORTH STAR

Customers buy a premium invitation because they love the design; behind it sits the already-built guest-management system, connected invisibly and explained only when useful, while the owner delivers what feels highly personalized with approximately five minutes of operational work per order.



## 20. Latest executable checkpoint — 2026-10-07

Automated/backend catalog certification has passed. Final-delivery packaging of the real frozen VEIL LIGHT master has been proven wrapper-only and byte-identical at renderer level.

Canonical remaining gate before Design 02:
`/GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_V4_3_ONE_TAP_CERTIFICATION.html`

The V4.3 owner workspace creates a normal certification order automatically and measures real active owner work against the <=5 minute target. This single Android owner gate is the only remaining non-automatable item before freezing Catalog Pipeline V1.


## CATALOG PIPELINE V1 FINAL FREEZE — 2026-10-07

The common catalog pipeline has passed its final real-Android gate and is now frozen.

Evidence:
`guest/GUEST_CATALOG_PIPELINE_V1_FINAL_CERTIFICATION_2026-10-07.md`.

Real normal-order owner active time: **1:32**, below the <=5 minute target.
The complete review -> approval -> final-delivery chain passed on Android and the backend ended in `delivered`.

Future Design 02–06 must plug into this frozen pipeline and may not reopen architecture, sender, RSVP, management or owner workflow unless a reproducible cross-template defect requires a global correction.


---

## 21. GLOBAL INVITATION DESIGN RULES — ADDED 2026-10-07

These rules apply to every current/future GUEST invitation design.

### 21.1 RSVP + closing = one final act
RSVP and closing must be designed as **one continuous final visual act**, as in VEIL LIGHT.

Required:
- one coherent scene/background system;
- RSVP CTA first;
- closing names/date/emotional sign-off resolve within the same final act;
- no separate generic RSVP section followed by a visually disconnected closing section.

This rule applies to Designs 02–06 and any future catalog design.

### 21.2 Judge the invitation as a whole before micro-polishing
After a new visual territory passes its opening gate, build a complete visual runway before prolonged scene-by-scene refinement.

Reason:
- premium quality is perceived across the full invitation;
- a strong Cover cannot compensate for a weak middle/end;
- section intensity must rise/fall intentionally without visual collapse;
- owner review burden must be minimized.

Preferred workflow:
1. concept sketch gate;
2. hero-motion gate;
3. minimum reusable support assets;
4. one complete visual runway;
5. global owner review;
6. only then polish/certify individual sections.

### 21.3 No progressive visual collapse
A design fails if visual authority steadily decreases after the Cover.

Reading-heavy sections may be quieter, but they must still have:
- intentional composition;
- coherent material/motion language;
- enough depth/presence to feel designed;
- clear hierarchy.

"Subtle" must never become "flat/basic".


---

## 22. GLOBAL SCALABILITY INVARIANT — ABSOLUTE / ALL DESIGNS

This rule applies to **every current and future GUEST invitation design**, not only Design 02.

### 22.1 One engine, many visual templates
All catalog invitations are different visual templates of the same frozen product engine.

They may vary in:
- visual art direction;
- typography;
- motion;
- palette;
- composition;
- reusable media assets;
- certified safe presets.

They may NOT create a template-specific operational workflow, questionnaire, RSVP, sending system, guest-management path, or per-order design process.

### 22.2 100% scalable by design
A template is invalid if a normal supported order requires the owner to:
- manually edit HTML/CSS;
- manually reposition text;
- manually retime animation;
- regenerate decorative AI/Recraft assets for that couple;
- manually rebuild a section because names/text/location differ;
- manually repair a layout because an optional module is on/off;
- decide ad hoc where content should fit.

Normal order target:
**review only**.

Total owner active intervention target:
**< 5 minutes**.

### 22.3 Generated-media rule
Recraft / AI-generated imagery and motion are **template master assets**, created once during template development.

They must never contain baked-in variable wedding data such as:
- couple names;
- dates;
- venue/location;
- agenda times/moments;
- RSVP copy;
- transport/accommodation details;
- gift information;
- any couple-specific wording.

Variable data is always rendered natively by the common template renderer from the shared config schema.

Couple-supplied photography/media may vary per order, but its placement/crop/focal handling must use certified deterministic rules and safe controls.

### 22.4 Optional-state rule
Every supported optional state must have deterministic behavior before sale.

Examples:
- 1–5 agenda moments;
- photo on/off;
- venue photo on/off;
- transport on/off;
- accommodation on/off;
- music on/off;
- gift/info on/off;
- gallery count variations;
- long/short names and locations.

If an optional state requires per-order design intervention, the template fails admission.

### 22.5 Preflight before any new visual asset
Before generating or coding any new design asset, verify:

1. Is this asset fixed/reusable for every order using this template?
2. Does it contain zero variable wedding data?
3. Can all supported content states render without editing the asset?
4. Can the owner process a normal order without design work?
5. Does the solution preserve the common engine and schema?

If any answer is NO:
**STOP. Do not generate/build the asset. Redesign the concept first.**

This scalability invariant has priority over visual convenience.


---

## 23. SCALABILITY IS AN INTERNAL GATE — OWNER MUST NOT POLICE IT

The owner must never need to ask whether a design change is scalable.

For **every** visual, structural, copy, motion, interaction or layout change in any GUEST invitation template, scalability is a mandatory internal gate performed before the change is proposed for approval.

Before showing a change to the owner, verify:
- no per-couple asset regeneration is required;
- no per-couple HTML/CSS/layout/timing edits are required;
- all variable wedding data remains renderer-driven;
- supported optional states remain deterministic;
- supported text-length ranges remain safe;
- mobile behavior remains certified;
- the common engine/schema is preserved;
- normal owner intervention remains review-only and under 5 minutes.

If any item is unproven, the change must be labelled **NOT YET SCALABILITY-CERTIFIED** and must not be presented as a finished direction.

If any item fails, redesign internally before asking the owner to review the visual result.

The owner reviews the product; the owner does not police scalability.


---

## 24. LOCATION / VENUE STATE IS 0–2 PLACES — GLOBAL TEMPLATE RULE

Every current and future GUEST invitation template must support the same location contract without per-order design work.

Supported states:
- 0 places: hide the location section cleanly.
- 1 place: render one complete venue scene.
- 2 places: render two complete venue scenes deterministically (for example ceremony + celebration), preserving the same visual language and transition system.

Each place independently supports:
- photo present;
- photo absent (template-owned fallback visual);
- variable place name;
- variable time;
- variable city/date metadata;
- variable address;
- directions action.

No template may assume that there is always exactly one place.

A two-place order must NOT require:
- a new Recraft/AI asset;
- manual HTML/CSS;
- manual repositioning;
- bespoke transitions;
- manual repair of the surrounding sections.

This is part of the mandatory <5 minute owner workflow and the internal scalability gate.


---

## 25. CONTINUOUS-EXPERIENCE RULE — NO “SLIDES STUCK TOGETHER”

Every GUEST invitation must feel like one continuous designed experience from opening to closing.

Sections may have distinct functional jobs, but they must not read as independent slides or screens simply stacked vertically.

Before a template or revision can pass visual review, verify:
- adjacent sections share or deliberately hand off visual language, motion, light, texture, typography and rhythm;
- transitions are designed as part of the composition, not added as generic fades between unrelated blocks;
- functional sections (agenda, practical information, RSVP, locations, gallery) remain inside the invitation’s art direction instead of falling back to generic app/web UI;
- no section creates a hard “new page” feeling unless the art direction intentionally requires it;
- the final act resolves the same visual narrative established by the opening.

This rule applies to every current and future GUEST catalog design and is checked together with scalability before owner review.


---

## 26. DESIGN 02 TRANSITION CHECKPOINT — V15F REJECTED

After mobile review on 2026-10-08:

- **V15F is REJECTED — DO NOT REVIVE.**
- Reason: the long overlap / organic-mask experiment introduced more visible transition problems and incorrect background-motion behavior.
- **V15E is the last stable visual checkpoint** and remains the rollback baseline.
- The next iteration must NOT add new fixed/sticky layers, duplicate background videos, long masked overlaps, or extra transition wrappers.

Direction retained:
- one coherent BOTÁNICA invitation;
- approved opening remains untouched;
- real photos stay natural;
- transitions must not reveal screen boundaries;
- motion must remain physically plausible and consistent;
- no image generation is required for this repair.

Next work should be a **structural cleanup from V15E**, reducing section-boundary machinery rather than adding more transition effects.


---

## 27. DESIGN 02 — STRUCTURAL CONTINUITY RESOLUTION (2026-10-08)

Owner requested a definitive architectural solution after 20+ unsuccessful visual iterations.

The technical conclusion:
- Repeating the same A02 video inside independently sized 100svh sections will **always** reintroduce spatial jumps: adjacent footage bottom/top edges cannot match even when playback is synchronized.
- Additional masks, overlapping videos, sticky/fixed backgrounds and local gradient bands did not solve the underlying geometry. V15F remains permanently rejected; V15E is the untouched rollback checkpoint.

New QA-tested prototype: **BOTÁNICA V16E CONTINUITY QA**
- Delivered as an isolated, self-contained HTML review artifact, not yet merged into commercial production.
- One continuous **spatial** botanical material covers the full narrative in normal document flow. It is composited strictly from frames of the existing approved A02 motion, with no new AI-generated art and zero per-order image work.
- Existing approved A01 cover remains intact; foreground couple/venue photos and final RSVP/closing remain native and configurable.
- Each approved A02 video copy now contributes only masked, subtle motion/light inside its chapter, not a new rectangular background scene. No fixed/sticky media surfaces; no physical section wallpaper edges.
- A02 MP4 is embedded **once** and shared through a Blob URL, reducing self-contained prototype file size from about 34MB to about 21MB. Offscreen footage is paused for mobile performance.
- Continuous backdrop uses `background-size: cover` (not distortion/stretch) across 0–2 venues and optional sections.

Automated browser QA on the structural V16D baseline: 7/7 scenarios across mobile viewport widths 360–430, 0–2 venues, 1–5 agenda moments, 0–4 practical modules including stress text. The refined V16E artifact passed three additional extreme configurations; checked no horizontal overflow, resource loads, RSVP CTA presence and code execution.

**OWNER VISUAL APPROVAL PENDING.** Do NOT mark Design 02 frozen or commercially certified before a real Android review confirms motion and visual quality. Preserve both V15E rollback and V16E isolated candidate; do not revive V15F or revert to repeated section-background video architecture.


---

## 28. DESIGN 02 — V22 CUT CONTINUITY CANDIDATE (2026-10-08)

V21 mobile review showed that its CSS mask-based `living` botanical video accents can render as visible rectangular/geometric cuts on the owner's Android. It also accumulated excessive vertical whitespace between Story, Venue, Agenda, Practical and Gallery.

V22 is an isolated review candidate built directly from V21 without changing the canonical order or data contract.

Changes:
- remove CSS `mask-image` / `-webkit-mask-image` from moving botanical accents;
- dissolve video edges using Android-safe ivory linear-gradient overlays instead;
- keep moving botanical material away from physical section boundaries;
- reduce accumulated vertical paddings/gaps across intermediate scenes;
- preserve exact canonical order: Cover → Countdown → Story → Venue(s) → Agenda → Practical → Gallery → RSVP+Closing;
- preserve V21 render/config logic and scalability states.

Automated QA before owner review:
- widths 360 / 390 / 430 px: no root horizontal overflow;
- 2 venues + long names/text at 360 px: PASS;
- 1–5 agenda moments / 0–4 practical modules: renderer unchanged;
- minimal state with Story off, 0 venues, 1 agenda moment, 0 practical, 0 gallery: PASS.

Status: **OWNER VISUAL APPROVAL PENDING.** Do not freeze or commercially certify V22 yet.

## 20. Mandatory design QA for Designs 03–06

For every future catalog design, **before any visual/code changes**, read and apply `guest/GUEST_DESIGN_PRODUCTION_QA_MASTER_D03_D06_2026-10-09.md` together with this canonical master, the live schema and the template contracts. That manual operationalizes full-scroll review, questionnaire parity, mobile/animation checks, immutable backups and escalation/rollback after regressions. **Do not delegate basic QA to the owner.** Only a candidate with documented checks may be sent for Android visual review. Botánica D02 V14 was visually owner-approved on 2026-10-09; do not label it commercially certified without its outstanding scalability/E2E gates. If instructions conflict, **this canonical master and the live schema/contracts take precedence**, and the conflict must be resolved before implementation.

## 21. Backend-to-renderer contract reality (D02 finding)

Mandatory finding dated 2026-10-09, from the **deployed** `guest-invitation-flow` v12. The backend `buildConfig()` produces a canonical-looking config with `template/couple/wedding/cover/story/locations/agenda/practical/rsvp/gallery/closing` **but without the `schemaVersion` marker**. Do not route such an object through a legacy-config branch or assume the published JSON schema is emitted literally. Validate against the real output contract before any Design 03–06 integration.

Backend differences that MUST be tested: Story preset mode normally has `body:""` and a `presetId` (`story-01`–`story-05`); the exact approved preset text lives in the backend's `STORY` table and must be rendered without inventing text. Bank/Bizum gift details arrive in `practical.gift.details` as an already-composed string, rather than separately populated IBAN/Bizum fields. The backend may omit `cover.photo` even though the conceptual schema defines it. Media uploaded under `upload:<slot>` is hydrated into signed URLs at review/public load. Verify venue website URLs, vestimenta, optional photo states, long custom closing and long cover place; failure to display an admitted questionnaire field is a certification blocker.

For Botánica, the owner-approved **V14 FROZEN** remains unmodified. A separate **V14.5 certification candidate** passes 116 local responsive cases and eight backend-shape fixtures but is not commercially certified. `guest-invitation-flow` v12 currently supports only `veil-light` in `CATALOG_TEMPLATES`; do not claim D02 E2E complete or change the registry status to `commercially-frozen` until backend test order, recipient RSVP, owner mobile and preview/final parity gates pass.

## 22. Botánica D02 durable recovery

**Read first:** `guest/GUEST_D02_BOTANICA_READ_FIRST.md` and `guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_2026-10-09.json`. Those are the permanent artifact location, immutable checksums, local QA history, offline regression gates and remaining E2E tasks for Design 02. The visual approval is **V14** (immutable); **V14.5** is the independent technical candidate and **NOT commercially certified**. The deployed Supabase function has NOT been enabled for Botánica because the environment blocked the test-only deploy. Do not bypass that block, claim real-order validation or enable sales. The canonical product and shared questionnaire contracts continue to prevail over any local design-specific note. Any future agent must start from these files, not a prior chat.

## 23. Design 02 candidate progression to 14.6

2026-10-09: keep **V14 FROZEN** as the immutable owner-approved visual version. V14.5 remains a historical technical QA candidate. V14.6 is the current **certification-pending** candidate; one generic change fixes Story enabled with a photo and `textMode:'none'`. The same code path failed in V14.5; 11 mapping fixtures pass in V14.6, with 17 embedded assets unchanged. Neither V14.5 nor V14.6 is commercially certified. Updated recovery: `guest/GUEST_D02_BOTANICA_READ_FIRST.md` and `guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V2_2026-10-09.json`; versioned reproduction script: `guest/tests/botanica_schema_mapping_offline.test.cjs`. Supabase backend test-only deploy remains BLOCKED / NOT DEPLOYED. Do not claim live orders, RSVP E2E, customer messaging, or Android visual certification. No publication until explicit later consent and full gates.

## 24. Automated commercial admission gate for D02–D06

From 2026-10-09, the permanent implementation (not only a written rule) is:
- `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json` — source-identified PASS/PENDING evidence per common gate, tied to exact template id and version;
- `guest/qa/catalog_admission_gate.cjs` — **consistency check** for push QA and **strict** `--admit <id>` before marking any new template commercially frozen;
- `guest/tests/catalog_admission_gate_test.cjs` — checks that false certification and unregistered new templates fail;
- `guest/GUEST_CATALOG_RELEASE_GATES_D02_D06_2026-10-09.md` — the operating rules and shared contract fixes.

Required before work on D03–D06: use one questionnaire, schema and backend; identify real backend output/config discrepancies **before visual design**; supply an adapter, mobile owner renderer, recipient RSVP, QA variants and evidence record. Any new catalog template without all prerequisites must stay `certification-pending`. The non-strict CI gate must PASS when that pending status is honest; strict `--admit` MUST FAIL until every new-template gate and common compatibility blocker is resolved. Do not retroactively alter VEIL LIGHT V5.3.3's frozen commercial seal or count simulated orders as real E2E.

For D02 Botánica, the record currently lists **3/11 gates with local/historical evidence, 8 still pending**, including actual backend test-only activation, owner renderer, two real test orders, final/review, recipient RSVP, Android and owner touch. A blocked deployment must not be worked around or portrayed as passing. Publishing/payment remains separate and requires explicit later approval.
