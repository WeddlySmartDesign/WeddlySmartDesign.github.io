# GUEST by WeddlySmartDesign — Independent Product Baseline
Date: 2026-09-30
Branch: guest-independent

## Product mandate
GUEST by WeddlySmartDesign is a completely independent commercial product.

It is NOT a module, edition, funnel, upsell or dependency of ONE.
It is NOT part of ONE Partner.
It is NOT part of STUDIO.

ONE, ONE Partner and STUDIO must not be modified to build, sell, deploy or maintain GUEST.

## Commercial proposition
GUEST is sold from the invitation outward:
- digital wedding invitation
- personalization handled by WeddlySmartDesign
- RSVP
- guest management powered by the existing Guests engine
- optional/event-specific flows already supported by the engine

The commercial experience must feel simple even though the engine is powerful.

## Current functional source of truth
Extraction source on 2026-09-30:
- production wrapper: guests-v116-production.html
- integrated core: guests-v114-integrated.html (loaded by guests-production-sync.js)
- current production patches/hotfixes loaded by guests-v116-production.html

The historical Guests v67 handoff is NOT the source of truth for the independent product.

## Isolation rule
All GUEST code must live under /guest on this branch or in a future dedicated GUEST repository.
No GUEST file may require edits to an existing ONE / Partner / STUDIO file.
Before release, every runtime dependency that still points outside /guest must be copied or replaced.

## Phase 0 baseline
This commit copies the existing Guests-prefixed runtime files byte-for-byte into /guest.
This is an extraction baseline, not a release.
Do not change original root files.

## Release gates
Before GUEST can be sold independently:
1. Remove ONE identity/dependencies from the copied runtime.
2. Create GUEST-specific access/storage namespaces.
3. Create GUEST-specific PWA/install shell.
4. Confirm two-device sync works without ONE settings.
5. Rebrand UI to GUEST by WeddlySmartDesign.
6. Preserve RSVP, +1, custom questions, children toggle, transport, accommodation, extra events, seating, lists, recent changes and current validated behaviors.
7. Complete mobile-first adversarial QA.
8. Build independent commercial landing, checkout and fulfillment flow.
