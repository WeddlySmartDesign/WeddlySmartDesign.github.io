# ONE checkout — implementation status

Branch: `checkout-one-2026-09-19`

## Frozen public site
The approved pre-checkout site is frozen separately as V45 and must not be modified by checkout work.

## Chosen payment architecture
Use Gumroad as merchant-of-record/checkout because the existing WeddlySmartDesign access service already verifies Gumroad license keys and provisions exactly one wedding with up to two authorised members.

Customer flow:
1. Customer clicks **Comprar ONE** on the WeddlySmartDesign site.
2. Gumroad checkout completes the one-time purchase and issues a license key.
3. Gumroad Ping posts the sale to the Weddly purchase webhook.
4. The webhook verifies the license with Gumroad's license API.
5. Supabase provisions the Weddly license idempotently.
6. Resend sends the branded **Tu ONE está listo** email.
7. **Activar ONE** opens `/access.html#code=<license>`; the code is in the URL fragment, not the query string.
8. The customer confirms **Activar ONE**. ONE creates one private wedding and stores the member token locally.
9. The primary user invites the second authorised person from **Ajustes → Boda compartida**.

## Implemented on this branch
- `access.html`: accepts `#code=` purchase links and pre-fills the activation code.
- `access.html`: purchase copy and brand updated to WeddlySmartDesign.
- `checkout/edge/weddly-gumroad-purchase/index.ts`: verifies Gumroad sales, provisions a Weddly license, and sends the activation email.
- Resend template alias: `one-purchase-activation`.
- Template ID: `7a755bcf-69b5-4934-8ef7-bcb3ed74e6d9`.

## External values still required before live deployment
These are deliberately not guessed or committed:
- Gumroad product ID for ONE.
- Final ONE price.
- Optional ONE + Signature variant/price.
- Verified sending domain in Resend.
- Supabase secret `RESEND_API_KEY`.
- Supabase secret `WEDDLY_RESEND_FROM` (for example, `WeddlySmartDesign <hola@your-domain>`).

After the Gumroad product exists, insert its product ID into `marketplace_products` with source `gumroad`, active=true, and metadata identifying ONE. Configure Gumroad Ping to point to the deployed `weddly-gumroad-purchase` Edge Function.

## Safety
Do not merge/deploy checkout work until a real test purchase validates:
- payment succeeds;
- duplicate Ping is idempotent;
- license is issued once;
- activation email arrives;
- activation creates one wedding;
- second-person invite joins the same wedding;
- refund/chargeback policy is tested before production.
