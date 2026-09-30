# GUEST by WeddlySmartDesign — BUILD STATUS
Date: 2026-09-30
Branch: guest-product-isolated
Production status: NOT DEPLOYED

## Non-negotiable
- ONE, ONE Partner and STUDIO are untouched.
- Do not merge GUEST work by editing existing ONE/Partner/STUDIO files.
- GUEST public identity never presents itself as a module of ONE.
- Customer invitation design is performed by WeddlySmartDesign; the couple does not get a design editor.

## Implemented
### Product app
- Independent shell under /guest/
- Independent state/local-storage keys
- Independent access key and activation page
- Independent PWA manifest/service worker
- Guests management
- groups/units/people
- RSVP operations
- +1 lifecycle
- menus/allergies
- transport/accommodation/children
- custom RSVP answers
- seating/visual tables
- custom/export lists
- extra events and event invitations
- Essential 01–06 copied into GUEST
- Signature 01–04 copied into GUEST

### Backend
New Edge Functions, no replacement of ONE functions:
- guest-state
- guest-rsvp
- guest-rsvp-ensure
- guest-personalization
- guest-event-state
- guest-event-invite
- guest-access-check
- guest-license-access
- guest-stripe-checkout

The first GUEST release reuses the proven guest-domain tables already present in the Weddly Supabase project, isolated by wedding/license. GUEST code must not alter that shared schema to evolve the product; new GUEST-only persistence must use new GUEST-owned tables if future features require schema changes.

### Commercial flow
- /guest.html — independent landing
- Stripe checkout creates product=guests licenses
- GUEST Essential launch price: 39.90 EUR
- GUEST Signature launch price: 49.90 EUR
- /guest-checkout-return.html — paid return
- /guest-order.html — personalization intake
- order email to customer + internal WeddlySmartDesign notification
- final GUEST activation remains withheld until WeddlySmartDesign delivers the personalized invitation
- /guest/access.html supports GUEST activation codes and stores only the GUEST member token

## QA already performed
- branch-only extraction; main untouched
- known ONE localStorage dependencies removed from app/customer flow
- known ONE Guest/RVSP/event API endpoints replaced by GUEST aliases
- broken legacy customer design routes removed/neutralized
- copied 10 invitation designs into GUEST namespace
- extra-event public invitations routed to GUEST endpoints

## Still blocking production
1. Full functional browser QA on an actual hosted preview:
   - Android + iPhone viewport
   - activation
   - first sync
   - import/create guests
   - RSVP send/public response/update
   - +1
   - menus/allergies/transport/accommodation/children/custom question
   - seating
   - lists
   - extra event invitation/response/list
   - PWA install
2. Stripe LIVE end-to-end payment using the new guest-stripe-checkout and return/order flow.
3. Confirm email delivery from Resend for:
   - payment/order-start email
   - order-received customer email
   - internal order notification
4. Add/validate GUEST-specific legal copy before public sale.
5. Final landing QA and analytics instrumentation.
6. Create final delivery workflow for WeddlySmartDesign:
   paid -> details_received -> preparing -> ready -> delivered.
7. Only after all blockers pass: merge/publish GUEST routes. Do not alter ONE files during release.

## Deliberately deferred
- separate Supabase project
- duplicate database schema
- large admin CRM
- new invitation editor for couples
- extra template collection
- subscriptions
- automatic photo uploads

Reason: none are required to validate first sales.
