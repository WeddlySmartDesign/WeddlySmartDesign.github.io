# WeddlySmartDesign unified app · v1

Date: 2026-09-10

## Frozen source modules

- Guests is considered closed until Signature is added.
- Historical Guests v131 did not replace the Guests core: it used `guests-v114-integrated.html` (core v129) plus RSVP desktop bridge work.
- Current Guests production route remains `guests.html` -> `guests-v116-production.html`, with the accepted RSVP operations and printable-list patches layered over the same core.
- Payments remains the existing stable Suppliers & Payments product served by Supabase Edge Function `weddly-app` (version 64 at creation of this document). Its core is not merged into Guests.
- `payments.html` is a standalone GitHub Pages entry using the same Payments bootstrap that `index.html` used at the time the unified shell was created.

## Unified shell

Canonical test entry: `app.html`

The unified app does not merge or duplicate the two engines. It hosts them as independent modules sharing the existing wedding access token and shared settings:

- Pagos -> `payments.html`
- Invitados -> `guests.html`
- Ajustes -> `weddly-settings.html`

Inside the unified shell there is one global Ajustes entry. Module-specific settings entries are hidden only in suite mode; standalone module behaviour remains unchanged.

## Shared rules

- Shared member token: `weddly_shared_wedding_token`.
- Shared visual theme keys: `weddly_personal_theme_v51` and `weddly_personal_theme_v20`.
- Common settings page: `weddly-settings.html`.
- Guests data/state and Payments data/state remain separate stores and separate engines.
- Do not rewrite one module to make the other work.
- If only one module is sold, its standalone entry can still be used.
- If both modules are available, use `app.html` and show one global Ajustes entry.

## RSVP / invitations

- Guests RSVP remains connected to the real RSVP engine.
- Essential 01–06 remain source-of-truth visual designs and are not to be redesigned during integration.
- Signature must be added later only as another invitation/personalization visual layer. Adding Signature must not alter the closed Guests core, its tables, seating, lists, transport, guest management, RSVP answers, or Payments.

## Safety snapshots

Pre-suite Guests snapshot: `freeze-guests-final-pre-suite-2026-09-10`.
