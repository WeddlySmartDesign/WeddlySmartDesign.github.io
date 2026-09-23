# ONE Partner — isolated MVP

Status: working MVP, 2026-09-23.

## Non-negotiable isolation

ONE is frozen. ONE Partner must remain additive and removable.

Never modify for Partner:
- ONE module cores (Guests, RSVP, Seating, Payments, Planning, Events, Invitations)
- app.html or the ONE shell/navigation
- existing ONE CSS/JS
- service workers, PWA, access flows or demos
- the frozen commercial ONE website

ONE Partner reads canonical ONE data but never writes to ONE canonical state.

## Runtime surfaces

Professional app:
https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/one-partner-app

Couple consent/revocation page:
https://weddlysmartdesign.github.io/partner-access.html

Couple-side API:
one-partner-couple-api (Supabase Edge Function)

The consent page never calls privileged database functions directly. It sends the existing high-entropy ONE member capability to the isolated couple API, which validates it server-side against the existing hashed wedding member record.

The professional app is deliberately on a different origin from ONE, so it cannot access ONE localStorage/cookies.

## Data model

Partner-owned tables only:
- public.partner_profiles
- public.partner_wedding_grants
- public.partner_connection_requests
- public.partner_responsibilities
- public.partner_review_state

All have RLS enabled and direct anon/authenticated table privileges revoked.

Private helpers live under partner_private.

## Permission scopes

- guests_rsvp
- seating
- catering
- transport
- extra_events
- planning
- invitation
- payments

Payments is false by default.

Permissions and revocation are checked server-side. The professional never receives the couple member token.

## Product boundary

This is not a planner CRM. It is a professional coordination layer over couple-owned ONE data.

MVP includes:
- professional account
- multi-wedding Hub
- permission-filtered professional summary
- recent changes via version snapshots
- simple shared responsibilities
- couple approval / permission editing / revocation

Do not add CRM, leads, planner invoicing, supplier CRM, chat, white-label or duplicate ONE planning tools without an explicit product decision.


## Financial summary

When the couple explicitly enables the payments scope, ONE Partner reproduces the current ONE Payments calculation server-side:
- cost breakdowns replace simple provider price when present
- quantity/person/hour/person-hour modes are respected
- paid refunds reduce paid net
- external/gifted costs do not reduce the couple's operating budget
- cancelled losses and non-external DIY are included
- budget, committed, paid, pending, next 30 days, unscheduled and available are returned

No receipts, attachments, payer details or raw provider records are exposed by the summary.

## Deployment boundary

The only file added to the existing GitHub Pages production surface is `partner-access.html`. No existing ONE file was edited for the Partner feature. The professional app and couple API are new Supabase Edge Functions. Partner database objects are additive and prefixed `partner_` or live in `partner_private`.
