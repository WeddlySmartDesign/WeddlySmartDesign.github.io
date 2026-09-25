# ONE Partner · Professional Assurance

Implemented 25 Sep 2026.

## Purpose

ONE Partner does not replace the planner's CRM or the couple's ONE workspace. It verifies whether the live wedding state is professionally ready to progress and identifies the exact consequence when it is not.

Core loop:

ONE data → coherence check → professional closure → late change detection → revalidation → provider handoff.

## Implemented layers

### 1. Coherence engine
Server-side checks currently include:
- RSVP pending, with higher severity close to the wedding
- confirmed guests without a table
- tables over configured capacity
- confirmed guests with required meal still missing
- declined guests still assigned to seating
- declined guests still marked for transport/accommodation
- RSVP not active while responses remain pending
- overdue Planning tasks
- provider handoffs that no longer match ONE
- incomplete professional ceremony/reception profile

Output is intentionally simple: conform / attention / blocked.

### 2. Professional closures
Append-only evidence stored in `partner_professional_closures`.
A closure stores:
- scope
- ONE source version/update timestamp
- source hash
- aggregate summary
- coherence snapshot
- closed-by / closed-at

Supported scopes:
RSVP, Seating, Catering, Transport, Accommodation, Planning and Extra Event.

A scope can only be closed when its live readiness rules pass.
If relevant ONE data later changes, the latest closure automatically becomes `revalidation_required`.

### 3. Lightweight decisions
Stored in `partner_decisions`.
Decisions are operational agreements only, not notes/chat.
The planner can create a pending decision for couple confirmation, or confirm an internal decision.
The couple can confirm through the isolated couple API.

Confirmed decisions store a fingerprint of the relevant scope. Partner only recommends review if that exact scope fingerprint changes.

### 4. Operational contacts
Stored in `partner_operational_contacts`.
This is deliberately not a vendor CRM.
Fields are restricted to day-of usefulness:
business, contact, phone, email, arrival time, Maps link, short note and critical flag.

### 5. Existing differentiated layer
Professional Assurance works together with:
- linked ONE-derived lists
- provider delivery deadlines
- delivered-version hashes and aggregate summaries
- outdated handoff detection
- downstream impact mapping
- shared responsibilities
- takeover review
- meeting brief
- data freshness

## Isolation

No ONE core table is written by Professional Assurance.
No ONE shell/module/PWA/service worker file is modified.
All new persistent data is Partner-owned and prefixed `partner_`.

Direct table privileges remain revoked. Public planner RPCs require authenticated users and validate `auth.uid()` ownership for the grant. Couple-side decision confirmation remains service-role-only and is exposed solely through the isolated couple Edge API after validating the existing ONE member capability.

## Explicit exclusions

Do not add to this layer:
- leads / sales CRM
- planner contracts or invoicing
- full vendor CRM
- full timeline/run-of-show authoring
- chat
- moodboards
- generic file repository
- business analytics
- team resource management

A feature belongs here only when it uses live ONE context to remove a professional check, duplicate entry, stale-version risk, coordination ambiguity or handoff error.
