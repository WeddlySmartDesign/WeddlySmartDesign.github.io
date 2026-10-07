# GUEST — CATALOG INVITATION ↔ EXISTING MANAGEMENT BRIDGE

Date: 2026-10-07
Status: IMPLEMENTED / PRODUCTION ACTIVATION HELD

## Product target

Catalog launch:
- minimum 5 premium scalable invitation designs;
- target 6;
- one identical operational flow regardless of selected design;
- customer perceives premium personalization;
- owner reality: normal order is review-only, bounded edit only when genuinely needed;
- owner touch target <= 5 minutes per order.

## What was changed

### Backend

Supabase `guest-invitation-flow` upgraded to v9.

It is no longer structurally VEIL-LIGHT-only:\n- Template versions are pinned per order, so a later template update cannot alter an order already in progress;\n- typography/safe preset choices are resolved by the selected template registry entry;
- catalog template registry introduced;
- order creation/build config resolves template by `template_id`;
- `create_test` accepts `templateId`;
- template version comes from registry;
- unsupported template ids are rejected.

Delivered invitations now have a template-independent stable URL field:
- DB column: `guest_invitation_orders.delivery_url`.

Production delivery refuses to complete without a stable final invitation URL.
Test-mode local delivery remains supported.

New authenticated action:
- `active_for_member`

It:
1. receives the EXISTING GUEST member token;
2. resolves the existing license/wedding;
3. finds the delivered invitation order on the same license;
4. returns its stable final invitation URL and template metadata.

No second account, guest list, RSVP or wedding state is created.

### Existing GUEST send flow

New:
- `guests-catalog-invitation-bridge-v1.js`
- `guests-rsvp-share-composer-v3.js`

Wired into:
- `guests-rsvp-operations-live.html`

Behaviour:
- if the same license has a delivered catalog invitation with a stable URL, the existing send composer uses it;
- it preserves the existing recipient or invitation unit;
- preserves the existing personalized message/contact/WhatsApp/share/status flow;
- appends RSVP recipient context to the catalog invitation URL;
- if no catalog invitation is available, legacy invitation/RSVP sending remains unchanged.

The management engine remains untouched otherwise.

### Shared recipient contract

New:
- `guest-catalog-recipient-context-v1.js`

All catalog designs receive identical parameters:
- `rt`: existing RSVP public token;
- `g`: single guest id OR
- `u`: invitation unit id;
- `lang`: language.

The shared helper converts them into the existing RSVP route and decorates `config.rsvp.route`.

Therefore Design 02–06 do not invent their own RSVP/send behavior.

## Catalog rules

New canonical files:
- `GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json`
- `GUEST_CATALOG_PIPELINE_CONTRACT_V1.md`

VEIL LIGHT V5.3.3 is registry entry #1.
Future designs are added only after 100% scalability certification.

A design is rejected from catalog if routine orders require HTML/CSS/layout work.

## QA

New test:
- `guest/qa/catalog_invitation_bridge_test.js`

CI job:
- `catalog-invitation-bridge`

It checks:
- launch minimum=5 / target=6;
- owner touch target=5 minutes;
- bridge loaded before share composer;
- bridge has no template knowledge;
- invitation units preserved;
- personalized message composer preserved;
- recipient-context contract is template-neutral;
- existing people/seating/extra-events engine remains present;
- mock active catalog URL keeps its own query and receives the correct RSVP/person/unit parameters.

## Deliberately NOT activated

- Stripe has not been connected to this new order pipeline.
- GUEST has not been published.
- No live customer delivery has been switched.
- No production catalog order exists yet.

Therefore the bridge is installed but dormant for existing users until a real catalog order has a stored `delivery_url`.

This is intentional and honors the publication/Stripe hold.

## Remaining later activation step

When commercial publication is authorized:
1. selected design id travels from catalog purchase into the new invitation order;
2. automated publisher produces the stable final invitation URL;
3. approval/delivery stores that URL;
4. existing GUEST send flow discovers it automatically through the license bridge.

No owner action is required to connect the invitation to guest management.

## Design 02 rule

Design 02 may use a completely different visual language, but it MUST implement the same config/recipient/owner-workflow contracts.
It may not introduce a new questionnaire, sender, RSVP engine, management engine or manual per-order layout work.
