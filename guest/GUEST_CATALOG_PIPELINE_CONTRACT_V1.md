# GUEST — CATALOG PIPELINE CONTRACT V1

Date: 2026-10-07
Branch: `guest-independent`
Status: CANONICAL

## Goal

Launch with at least 5, target 6, premium invitation designs that create the perception of a highly personalized product while requiring no design work per order.

Owner target:
- normal order: review only;
- exceptional supported order: bounded content/typography adjustment;
- total owner intervention target: <= 5 minutes;
- no HTML/CSS editing per couple.

## One flow for every catalog design

The selected design changes only the template renderer and its certified safe visual presets.

The rest is identical:

design selected -> order stores template_id -> common questionnaire -> common resolved config -> template renderer -> owner mobile review -> customer review -> approval -> stable final invitation URL -> existing guest-management application -> existing send / RSVP / groups / tables / PDFs / extra events.

No template may introduce a second purchase, questionnaire, guest list, sending engine, RSVP engine or management app.

## Common order contract

Every order carries:
- template_id;
- template_version;
- common `guest-invitation-config-v1` data;
- optional template-safe visual tuning;
- stable final `delivery_url` after approval.

The backend template registry resolves the version from template_id. Template identity is never inferred from names, couple data or HTML filenames.

## Template admission gate

A design is not allowed into the catalog until ALL are true:

1. Visual quality approved on real Android.
2. Every supported configuration passes without editing the template.
3. Long names / locations / text / optional modules have deterministic rules.
4. Production, review and final use the same renderer/config.
5. Owner adjustments are bounded controls, not free CSS or positioning.
6. The common questionnaire can express every supported state.
7. Recipient context can be applied through the shared catalog recipient contract.
8. Final invitation exposes its RSVP CTA through the existing GUEST RSVP engine.
9. One completely different real order passes without design intervention.
10. Owner can process the order from mobile in <=5 minutes excluding customer waiting time.

VEIL LIGHT V5.3.3 is the first template that passes this gate.

## Existing management engine boundary

The existing GUEST management engine is preserved.

Already built / validated:
- invited people;
- groups / subgroups;
- import and multi-person creation;
- invitation units;
- personalized send message;
- device contact picker and stored contacts;
- WhatsApp / native share / copy;
- send status;
- RSVP / +1 / children / menu / allergies / transport / accommodation / custom questions;
- tables and visual room plan;
- multi-select seating;
- controlled lists / print / PDF / catering;
- extra events and their own invitations/RSVP.

The catalog integration may route the existing send flow to the selected final invitation. It must not rebuild these features.

## Stable final URL bridge

After customer approval, the invitation production pipeline must provide one stable public base URL for the final invitation.

The order backend stores it in:
`guest_invitation_orders.delivery_url`.

The existing GUEST send flow asks the backend for the active delivered catalog invitation that belongs to the same license.

If found:
- the existing send composer keeps the selected person / invitation unit;
- keeps the existing personalized message;
- keeps contact/WhatsApp/native-share behavior;
- uses the stored final invitation URL;
- appends only shared recipient context: RSVP public token + person/unit identity + language.

If no delivered catalog URL exists, the current legacy RSVP invitation route remains as fallback. This keeps the existing engine backward-compatible.

## Shared recipient context

Every catalog template must consume the same URL parameters:
- `rt` = existing RSVP public token;
- `g` = single guest key, OR
- `u` = invitation unit id;
- `lang` = language.

The shared helper `guest-catalog-recipient-context-v1.js` converts that context into the existing RSVP route and decorates `config.rsvp.route`.

A template renderer may look completely different, but recipient/RSVP behavior must be identical.

## No-template-specific owner workflow

The Mobile Center may render different safe controls by template manifest, but the sequence is fixed:
1. open order;
2. inspect resolved invitation;
3. change only bounded fields if genuinely necessary;
4. send review;
5. deliver approved invitation.

A template that regularly requires special handling is rejected from the catalog rather than accepted as manual work.

## Current backend implementation

`guest-invitation-flow` v9:
- template registry introduced;
- `create_test` accepts templateId;
- buildConfig uses order.template_id rather than hard-coded VEIL LIGHT;
- production delivery requires a stable invitation URL;
- delivered URL is stored on the order;
- `active_for_member` resolves the delivered invitation by the same license used by the existing management app.

Database:
- `guest_invitation_orders.delivery_url` added as template-agnostic stable final invitation base URL.

Existing management runtime:
- `guests-catalog-invitation-bridge-v1.js`;
- `guests-rsvp-share-composer-v3.js`;
- wired into `guests-rsvp-operations-live.html`.

## Boundaries

- VEIL LIGHT remains frozen.
- Do not rebuild GUEST.
- Do not touch ONE / ONE Partner / STUDIO.
- Do not publish or connect the new commercial flow to Stripe yet.
- Future Design 02–06 must implement this contract rather than inventing their own flow.


## Template version pinning

The template version is fixed when the order is created. A later catalog template update must never silently migrate an order already in progress. Typography/safe visual presets are resolved from that template's registry entry rather than from VEIL-LIGHT-specific assumptions.
