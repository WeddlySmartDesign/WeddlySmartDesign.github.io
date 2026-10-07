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
