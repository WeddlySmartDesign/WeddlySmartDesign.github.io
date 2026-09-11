# Weddly Smart Design — Production Freeze

**Freeze date:** 2026-09-11  
**Status:** VALIDATED / FROZEN  
**Reason:** Full app confirmed working by external tester after final tester-access recovery fix. Do not rebuild validated cores.

## Canonical frontend snapshot

- Repository: `WeddlySmartDesign/WeddlySmartDesign.github.io`
- Exact validated production commit: `57cd03206c60f2cadedf36ddbaa145f8da0dddb5`
- Archive branch: `freeze-production-2026-09-11`
- Root: `https://weddlysmartdesign.github.io/`

This commit is the canonical restore point for the complete frontend state at freeze time.

## Product state at freeze

### Full app
Tabs/modules:
- Payments
- Guests
- Planning / Agenda
- Settings

### Guests — FROZEN CORE
- Production wrapper: `guests-v116-production.html`
- Frozen core: `guests-v114-integrated.html`
- **Never rebuild or modify the core unless explicitly requested.**
- Guests includes the validated external Events layer without changing the core.

Validated Guests capabilities include:
- guest/group/person management
- table capacities and seating
- touch movement / seat changes
- transport and change effects
- RSVP and invitation recipient flow
- PDF/list outputs for catering, tables and transport
- editable virtual venue/seating plan
- segmented communications
- extra events / Preboda

### Extra Events / Preboda
Validated production files:
- `guests-smart-actions-v1.js`
- `guests-events-v3.html`
- `guests-events-v3.js`
- `guests-events-standalone-compat-v1.js`
- `guests-events-invite-addon-v1.js`
- `guests-events-invite-addon-v2.js`
- `guests-events-invite-cleanup-v1.js`
- `event-invite.html`
- `event-invite-v2.html`

Product flow:
`Create event → budget/payments → guests → event invitation → confirmations → calendar`

Rules frozen at this point:
- wedding invitation/RSVP remains independent and untouched
- extra-event invitation has its own private link and response state
- public extra-event invitation uses **one cover photo**
- **no Weddly Smart Design branding in public guest-facing invitations**
- WhatsApp uses a normal message + private link so the communication remains in the recipient chat
- event RSVP is independent from wedding RSVP
- Guests standalone includes Events/Preboda; Full includes the same Guests plus Payments + Planning

### Planning / Agenda
Validated files:
- `planning.html`
- `planning-v2.js?v=2`
- `planning-v2.css?v=3`
- `planning-mobile-readable.css?v=1`
- `planning-calendar-bridge.js?v=5`
- `planning-wedding-events-v1.js?v=1`

Google Calendar bridge on Android was explicitly validated. Do not rewrite Calendar/Agenda unless required by a confirmed bug.

### Payments
Payments is considered stable and complete at freeze. Key commercial capabilities retained:
- contracts and payment receipts
- variable cost breakdowns
- received-money tracking
- payer/gift source tracking
- committed / paid / available budget
- due-date and missing-document alerts
- grouped payment history by supplier

### Invitations / RSVP
Wedding invitation and wedding RSVP are separate from Events/Preboda.
Public-facing invitation routes are clean of Weddly Smart Design branding.
Signature remains a future optional premium extension and is **not** required for this frozen release.

## Access / tester system — FINAL VALIDATED BEHAVIOUR

Owner admin:
- `https://weddlysmartdesign.github.io/tester-admin.html`

Tester activation:
- `https://weddlysmartdesign.github.io/tester-access.html`

Final behaviour:
- tester can be Payments, Guests or Full
- 7-day / 14-day / permanent tester grants supported
- Full tester = Payments + Guests + Planning
- a browser with an existing **tester** can switch to another tester after explicit confirmation
- a real paid/owner access is protected from replacement
- if tester activation happened in incognito or another browser, reopening the same tester link **recovers the primary tester access to the same wedding** instead of creating a new wedding
- primary recovery rotates the primary member token; it does **not** consume the partner slot
- second authorised person still joins through the normal in-app partner invite flow
- tester expiry remains enforced

## Supabase production snapshot

Project: `dnjsxequwgtyyauuofxj`

Critical active Edge Functions at freeze:

| Function | Version | SHA-256 snapshot |
|---|---:|---|
| `wedding-sync` | 12 | `eece8e5fa040f2322b6397f5294a1824f7f795abb81b383c742aa80c90c3ceef` |
| `wedding-files` | 8 | `ae41d18ebb25f884aaedab8ba86b535d9ed0e21f6d083b7d74f859c0e396cf96` |
| `weddly-app` | 64 | `183b0f879e26a06b1daf1e537149c924bae52ac91739c63ba68c603531771349` |
| `weddly-access` | 9 | `36a81d233699dafd497f5b9626dd764a09338125222d669e4e5e40161cb18d69` |
| `weddly-etsy` | 7 | `99a286ace6af2edb07ac71723b075f08b3c2d7021d254d2732ec5de06c59c855` |
| `weddly-rsvp` | 10 | `9562e74ea06f7d5e3620e6a9321a507d95abdbb771e89f14598c58ddf2c12682` |
| `weddly-personalization` | 6 | `f13ca11ae5f19785a89583e77cddbe72d7f31a53ec5d89c23f72cd9c182457a3` |
| `weddly-guests-state` | 2 | `133ea311abbfbcd29de63933cb609402cc78e326216f28e8d9d9996c5ef0ef6e` |
| `weddly-test-access` | 6 | `55227bf3c61f5d3c70d3386baa06aa75f2faed445acd717785394efa778d2a29` |
| `weddly-planning-state` | 1 | `e12b1ad80b549368d9509ccbfa99a9579f3f4614c936205a499ac04750885ba6` |
| `weddly-events-state` | 1 | `3509a3f60a967c8c80b56baf0136eb5363d1ad239b3bc2eb65f80f7cd953c4c4` |
| `weddly-event-state` | 1 | `33a758e18d98e5c04cfb18806b60966f6026b8a40536782f8a421b0f1797503a` |
| `weddly-event-invite` | 5 | `5d1fe7bb26c73751c049f372cf1f06b60f896c29e02b29427578cdff86e9a21f` |
| `weddly-tester-resume` | 2 | `41d81063f3e218704a8f75a52bc30d201f3e8462089e6d8989bf1add8ec1823f` |

## Database state / schema anchors

All current product tables use RLS. Relevant persisted state includes:
- `weddings`
- `licenses`
- `wedding_members`
- `wedding_invites`
- `license_delivery_codes`
- `guest_rsvp_forms`
- `guest_rsvp_submissions`
- `guest_rsvp_contacts`
- `guest_rsvp_delivery`
- `guest_units`
- `guest_person_meta`
- `guest_rsvp_personalization`
- `guest_app_state`
- `planning_app_state`
- `wedding_event_state`
- `wedding_event_invitations`
- `wedding_event_invite_recipients`

Latest schema migrations relevant to the frozen app:
- `20260905143959 add_guest_rsvp_backend`
- `20260905145736 add_shared_rsvp_contacts_delivery`
- `20260906111335 guests_structure_and_rsvp_apply`
- `20260907113928 guest_rsvp_personalization`
- `20260910064231 create_guest_app_state`
- `20260910215957 create_planning_app_state`
- `20260911064701 create_wedding_event_state`
- `20260911095214 add_event_invitation_tables`
- `20260911095344 add_event_invitation_member_responses`

## Safe owner/demo routes

- Full ES demo: `https://weddlysmartdesign.github.io/app.html?ownerDemo=es`
- Full EN demo: `https://weddlysmartdesign.github.io/app.html?ownerDemo=en`
- Tester admin: `https://weddlysmartdesign.github.io/tester-admin.html`

No recovery codes, member tokens, activation codes or credentials are stored in this freeze manifest.

## Restore policy

If a future change causes a regression:
1. Compare against commit `57cd03206c60f2cadedf36ddbaa145f8da0dddb5`.
2. Restore the affected frontend file(s) from branch `freeze-production-2026-09-11`.
3. Match backend functions to the exact versions/hashes listed above.
4. Do not rebuild Guests core. Restore/add only the affected integration layer.
5. Preserve shared wedding data; never solve a frontend regression by deleting production state.

## Change policy after freeze

This release is considered **functionally complete**.
Future work must be one of:
- confirmed bug fix
- commercial/marketing layer
- optional Signature extension
- explicitly requested new feature

No speculative redesigns, no core rewrites, and no replacement of validated modules.
