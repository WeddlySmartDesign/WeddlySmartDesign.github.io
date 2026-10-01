# GUEST B9.9 — Safe promotion strategy
Date: 2026-10-01

## Decision
DO NOT merge `guest-independent` wholesale into `main`.

At audit time the branches are diverged: `guest-independent` is hundreds of commits ahead while `main` also contains newer unrelated commits. A whole-branch merge would unnecessarily couple GUEST release history to concurrent repository work.

## Allowed production surface
Promotion to production must be an allowlist operation from the validated GUEST commit, limited to:
- root customer/commercial GUEST pages: `guest.html`, `guest-checkout.html`, `guest-checkout-return.html`, `guest-order.html`, `guest-legal.html`;
- private operator page: `guest-orders-admin.html`;
- the isolated `guest/**` product tree required at runtime;
- no ONE, ONE Partner or STUDIO files;
- no legacy root `guests-*` files outside `guest/**`;
- the QA workflow is development infrastructure and is not required for the public runtime.

## Release method
1. Start from the then-current `main`, never from a stale snapshot.
2. Copy only the allowlisted GUEST runtime files from the exact sealed release commit.
3. Re-run the release smoke/gates against the resulting production candidate.
4. Verify the diff contains no non-GUEST application files before promotion.
5. Publish only after explicit release authorization; preparation gates do not themselves publish.

## Hard stop
If the candidate diff contains an existing non-GUEST application file, a root legacy `guests-*` file, ONE, Partner or STUDIO surface, abort the promotion and rebuild the candidate.
