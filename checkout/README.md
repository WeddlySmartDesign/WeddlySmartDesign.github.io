# ONE checkout — Stripe staging

Branch: `checkout-one-2026-09-19`

## Freeze
The approved commercial site remains frozen outside this branch as **FINAL PRE-CHECKOUT V45**. Checkout work must not modify production/main until the full test purchase passes.

## Commercial editions
### ONE Essential
- Full ONE: Guests + Payments + Planning
- 6 Essential invitation designs
- Normal: **49,90 €**
- Launch: **39,90 €**

### ONE Signature
- Same full ONE functionality
- 6 Essential designs
- 4 Signature designs
- Signature premium personalization
- Normal: **59,90 €**
- Launch: **49,90 €**

The license stores `product: full` plus `edition: essential|signature`. Signature is an invitation/design entitlement, not a reduced/full app distinction.

## Customer flow
1. Customer arrives at the WeddlySmartDesign ONE site.
2. **Comprar** opens the purchase sheet on the same page.
3. Customer chooses Essential or Signature.
4. Customer explicitly requests immediate digital access / accepts the contracting terms.
5. Stripe Embedded Checkout is mounted inside the WeddlySmartDesign purchase sheet.
6. Stripe confirms payment server-side.
7. The Stripe session provisions one WeddlySmartDesign license idempotently.
8. The same page returns to `checkout-return.html` and shows **Activar ONE**.
9. The activation link opens `access.html#code=<activation code>`.
10. Activation creates one private wedding.
11. The primary user invites the second authorised person from **Ajustes → Boda compartida**.
12. A Resend transactional email provides the same activation link and recovery code as backup.

No customer Stripe account is required. No HTML/ZIP/source files are delivered.

## Staged files
- `access.html` — accepts purchase activation links in URL fragments.
- `checkout/one-checkout.css` — purchase-sheet UI.
- `checkout/one-checkout.js` — Essential/Signature selection and Stripe Embedded Checkout.
- `checkout-return.html` — verifies paid session and exposes activation only after payment confirmation.
- `checkout/edge/weddly-stripe-checkout/index.ts` — creates Stripe Sessions, verifies signed webhooks, provisions licenses, sends activation email, deactivates on full refund/dispute.
- `checkout/edge/weddly-test-access/index.ts` — staged entitlement now returns `edition`.
- `checkout/edge/weddly-personalization/index.ts` — staged Signature entitlement enforcement + rich Signature payload.
- `guests-personalizacion-signature-integrated.html` — Signature editor connected to existing RSVP/personalization APIs.
- `guests-rsvp-design-manage.html` — staged editor routing by license edition.
- `guests-rsvp-signature-live.html` — live Signature renderer reusing the existing Guests RSVP engine.
- `guests-rsvp-public-clean.html` — staged public routing by saved invitation tier.

## Signature source assets already present
- `guests-signature-01.html`
- `guests-signature-02.html`
- `guests-signature-03.html`
- `guests-signature-04.html`
- `weddly-personalizacion-signature.html`

The Signature invitation continues to use the same Guests RSVP engine and preserves the recipient/unit query parameters.

## Stripe configuration still required
Do not guess or commit secrets. After the Stripe account is ready, configure **test mode first**:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `WEDDLY_LAUNCH_MODE=true`
- optional `WEDDLY_STRIPE_AUTOMATIC_TAX`
- optional `WEDDLY_SITE_ORIGIN` (defaults to GitHub Pages origin)

The checkout server owns the prices; the browser cannot choose arbitrary amounts.

## Resend configuration still required
The template is already published:
- alias: `one-purchase-activation`
- template ID: `7a755bcf-69b5-4934-8ef7-bcb3ed74e6d9`

Still required:
- verified sending domain
- `RESEND_API_KEY`
- `WEDDLY_RESEND_FROM`

## Launch gate
Nothing in this branch should reach production until test mode passes:
- Essential test payment = 39,90 € launch
- Signature test payment = 49,90 € launch
- duplicate webhook remains idempotent
- wrong/failed payment cannot create a license
- activation creates exactly one wedding
- Essential cannot save Signature personalization
- Signature can save and reopen all four designs
- public Signature invitation opens and reaches the existing RSVP engine
- second person joins the same wedding
- activation email arrives and recovery code works
- full refund/dispute deactivates the license as intended
- Android and iPhone/PWA path retested

## Legal
The purchase sheet includes an explicit immediate-access acknowledgement and stores its version in Stripe/license metadata. This is implementation support, not a claim of legal compliance. Final checkout wording and the health/allergy flow should receive professional legal review before launch.
