# GUEST — CANONICAL PRODUCT DIRECTION

Date: 2026-10-07
Branch: guest-independent
Status: CANONICAL / DO NOT DRIFT

## 1. Commercial product hierarchy

### Primary product / purchase entry
PREMIUM DIGITAL WEDDING INVITATIONS.

The customer enters because they like a design, choose it, and accept the price.
The invitation is the commercial product they consciously choose.

Current approved catalog design:
- VEIL LIGHT V5.3.3 — commercially frozen.

Expected customer experience:
design discovery -> choose -> buy -> provide details -> WeddlySmartDesign prepares -> customer reviews -> changes if needed -> approval -> final invitation -> send to guests.

The experience from discovery through communication with WeddlySmartDesign must feel premium and exceptionally simple.

### Secondary included differentiator
THE EXISTING GUEST-MANAGEMENT APPLICATION.

This is already built. It is NOT a new product to design from zero and NOT a new system to build after the invitation.

It is included as the powerful downstream value of the invitation:
- guest list;
- groups and subgroups;
- multiple-person creation/import;
- invitation units;
- personalized send message;
- contact picker / saved recipient data;
- WhatsApp/native share/copy flow;
- send status;
- RSVP and responses;
- +1;
- children;
- menu/allergies;
- transport;
- accommodation;
- custom RSVP questions;
- tables;
- visual room/table plan;
- multi-select seating/moving guests;
- controlled lists and print/PDF;
- catering summaries;
- extra events with their own selected guests, invitation and RSVP;
- owner Today/status/change views;
- two-device/sync architecture already validated elsewhere in the product track.

This engine remains the existing independent GUEST engine based on the validated production line around guests-v116-production.html and its final layers.

DO NOT rebuild these capabilities.

## 2. Direction change vs old product framing

The change is COMMERCIAL FLOW DIRECTION, not engine reconstruction.

Old/app-led mental model:
management app -> invitation.

Canonical invitation-led model:
premium invitation -> final approved invitation -> existing guest-management app already connected to that invitation -> send -> responses -> guest operations -> tables -> PDFs / catering / extra events.

The existing management system becomes a discovered included advantage after purchase, not the reason the customer initially has to understand before choosing the invitation.

## 3. Customer knowledge rule

Never assume the customer knows:
- the name GUEST;
- WeddlySmartDesign;
- what the management app contains;
- what RSVP means technically;
- what happens after approving the invitation;
- how to send the invitation;
- how responses reach their guest list;
- that tables, PDFs, extra events, etc. are included.

Customer-facing copy must identify things by function first.

Preferred plain-language labels:
- "Invitación VEIL LIGHT" / "vuestra invitación"
- "gestión de invitados"
- "vuestra lista de invitados"
- "enviar invitaciones"
- "respuestas"
- "mesas"
- "listados"

If the brand name GUEST is shown, it must be immediately identified, e.g.:
"GUEST · gestión de invitados incluida con vuestra invitación".
Never use bare "GUEST" as if the customer already knows what it means.

VEIL LIGHT is the invitation design chosen.
GUEST is the existing guest-management app.
Do not blur those meanings.

## 4. What is already implemented and sealed

Validated independent GUEST QA confirms:
- Hoy + invitados, groups/subgroups, people manager/import;
- invitation/RSVP configuration and public RSVP;
- tables + visual seating + multiselect moves;
- controlled lists + print/PDF + catering summaries;
- extra events + group/subgroup selection + event invitations + event RSVP;
- independent /guest routes and backend isolation from ONE.

Existing send layers include:
- guests-rsvp-share-composer-v2.js
- guests-rsvp-contact-picker-v1.js
- guests-events-share-composer-v1.js
- invitation-unit handling and delivery status.

Do not propose rebuilding any of the above.

## 5. The actual integration work still required

The new invitation production line (VEIL LIGHT / later catalog designs) and the existing management app must be connected.

This is a BRIDGE task, not a new GUEST build.

Current verified gap:
- the frozen VEIL LIGHT order/delivery flow produces the approved invitation/public delivery;
- the existing main-invitation share composer still constructs its invitation link using the legacy guests-rsvp-v105.html route;
- therefore the existing send flow must be pointed at the customer's final approved catalog invitation while preserving its existing recipient/invitation-unit/RSVP behavior.

Required outcome:
once a catalog invitation is approved, that exact invitation is the active main invitation inside the customer's existing guest-management experience.
The couple uses the already-built guest list/groups/subgroups/send-message/contact/share workflow.
Guest responses continue to feed the already-built management engine.
No second guest list, second sender, second RSVP engine or second tables system is created.

## 6. Delivery / communication principle

Final delivery must not say or imply:
- "now add this to GUEST";
- "now build your guest list in another product";
- "download the invitation and manually manage links";
- any unexplained brand/module name.

It should make the connected experience obvious:
1. View the final invitation.
2. Open the included guest management.
3. Add/import existing guests using the current system.
4. Use the existing send flow to personalize the message and send to selected recipients.
5. Responses arrive back into the existing guest-management system.
6. Continue with groups, tables, logistics, PDFs/catering and extra events.

These are onboarding/explanation steps for EXISTING functionality, not new functionality.

## 7. Absolute exclusions

- Do not rebuild GUEST.
- Do not create a parallel guest-management system.
- Do not create a second invitation-sending system.
- Do not create a second RSVP engine.
- Do not redesign sealed management modules unless a reproducible defect requires it.
- Do not touch ONE, ONE Partner or STUDIO.
- Do not publish or wire Stripe until explicitly authorized.
- Do not start Design 02 until the invitation <-> existing GUEST bridge and customer journey are correctly understood and specified.

## 8. Current next step

Before any additional feature work:
audit and specify the exact bridge between the frozen catalog invitation order/delivery data and the existing GUEST invitation/send/RSVP runtime.

Then update customer-facing delivery/onboarding copy around that existing functionality.

No feature ideation beyond that boundary.
