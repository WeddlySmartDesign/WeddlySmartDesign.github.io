# ONE commerce v1

This folder is the isolated purchase/fulfilment implementation for ONE by WeddlySmartDesign.

## Flow

1. `checkout.html` loads the active product and final price from the backend.
2. The buyer must accept the Terms and expressly request immediate access to the digital content.
3. `weddly-commerce` creates a hosted one-time Checkout Session.
4. Stripe returns to `checkout-success.html?session_id=...`.
5. The Stripe webhook verifies the raw-body signature and provisions exactly one WeddlySmartDesign licence.
6. The success page shows **Activar ONE** plus a recovery code.
7. If Resend is configured, the same activation link/code is emailed automatically.
8. `access.html#code=...` prefills the code. Activation creates the private wedding; the partner is invited from inside ONE.

## Required secrets before live activation

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `WEDDLY_FROM_EMAIL` (for example `WeddlySmartDesign <hola@your-domain>`)
- `WEDDLY_SITE_ORIGIN=https://weddlysmartdesign.github.io`

Supabase provides `SUPABASE_URL` and the service-role secret to Edge Functions.

## Required business decisions before live activation

- Final ONE price.
- Final ONE + Signature price (or leave that product inactive).
- Tax configuration. The migration leaves automatic tax **off** and both products **inactive** until the seller deliberately configures this.
- Verified sending domain for transactional email.

## Safety

The product rows start with price 0 and `active=false`, so this branch cannot accidentally take real money just by being deployed.
