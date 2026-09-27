# ONE Partner — Production Frozen — 2026-09-27

## Status

ONE Partner application development is frozen at this release.

This freeze applies to the professional application, its isolated backend/API layer, its demo, and the couple authorization surface described below.

**ONE remains untouched and independently frozen.** No ONE production core, navigation, PWA, CSS/JS, commercial web, access flow, or validated client workflow is part of this release.

## Canonical source

Git source branch used by Railway production:

`one-partner-mvp-2026-09-23`

Production frontend root:

`partner-app/frontend/`

Main production frontend:

`partner-app/frontend/index.html`

Full fictitious demo:

`partner-app/frontend/demo.html`

Couple authorization surface:

`partner-access.html` on the repository main branch.

Railway service:

`ONE Partner / one-partner / production`

Current working production origin:

`https://one-partner-production.up.railway.app/`

Planned canonical custom origin:

`https://partner.weddlysmartdesign.com/`

At freeze time, the custom domain is attached in Railway but its TLS certificate is not yet valid for the hostname. This is an infrastructure cutover item only and must not trigger application changes.

## Brand rule

Public signature must always be exactly:

**by WeddlySmartDesign**

The signature uses **Caveat**.

Never use `WEDDLYSMARTDESIGN` as the public signature.

## Product model

ONE Partner is not a CRM.

It is the professional coordination layer connected to ONE:

- couples continue working in ONE;
- professional access is explicit and permission-based;
- ONE Partner converts current ONE data into professional summaries, readiness, closures, deliveries, decisions, responsibilities and alerts;
- no couple member token is exposed to the professional app;
- Partner never writes into canonical ONE operational state.

## Frozen product scope

### Professional Hub
- multi-wedding Hub
- cross-wedding Today priorities
- wedding time visible on cards
- venue visible on cards
- assigned lead/support professional visible
- filters for changes/pending work
- initial professional review / takeover

### Wedding workspace
- professional coordination profile
- couple contacts
- ceremony/reception details
- Google Maps links
- professional private documents
- conformity / coherence engine
- professional closures
- late-change revalidation
- linked operational lists
- supplier deliveries and staleness
- recent changes
- decisions
- operational contacts
- shared responsibilities
- meeting brief
- permission visibility
- freshness indicators
- team activity attribution

### Documents
Private professional documents:
- contracts
- payment receipts
- other relevant files

Storage is private and authorized by:
- studio
- wedding
- assignment
- role

Assistants have read-only document access. Admins/planners assigned to the wedding may write.

### Wedding lifecycle
- active wedding
- end professional relationship
- finalized weddings archive
- permanent deletion of Partner professional data after documents are removed
- ending/deleting in Partner never deletes or modifies the couple's ONE

### Studio / team model
Roles:
- Admin
- Wedding planner
- Assistant

Rules:
- each person has an individual login
- no shared professional credentials
- admin sees all studio weddings
- planner sees assigned weddings
- assistant sees assigned weddings in read-only mode
- assistant cannot view Payments
- one lead plus optional support assignments
- reassignment does not require couple reauthorization
- removing a professional immediately removes her assigned access
- legacy technical ownership is transferred to the studio owner when needed for continuity
- relevant professional actions are attributed to the actor

### Couple visibility and control
The couple authorization layer shows:
- studio identity
- currently assigned professionals
- exact ONE scopes shared

The couple can continue to update/revoke scope permissions. Internal reassignment inside the authorized studio does not require a new consent grant.

### Notifications
- explicit opt-in email alerts
- selected event types only
- deduplicated
- user-specific Today filtering means assigned planners receive only their relevant wedding alerts
- notifications remain separate from ONE

### PWA / installability
ONE Partner is independently installable.

It has:
- its own manifest
- its own icon
- its own service worker
- its own origin
- standalone display mode

The service worker caches only the application shell. It does not cache Supabase API responses or wedding data.

## Security boundary

- professional origin is separate from ONE
- no ONE couple capability/token in professional browser
- direct Partner tables are closed
- RPCs validate authenticated user, studio, wedding assignment and role
- private document storage validates studio + wedding + assignment + role
- Payments are hidden from assistants
- sensitive actions require admin/planner write permission
- ending/deleting a professional relationship requires admin
- team invitation function requires a valid JWT
- production frontend sends CSP, HSTS, X-Frame-Options DENY, nosniff and restrictive Permissions-Policy

## QA completed before freeze

Passed:
- admin / planner / assistant / outsider permission matrix
- planner reassignment visibility
- assistant write denial
- assistant professional-close denial
- assistant Payments hidden
- outsider wedding denial
- outsider documents denial
- couple sees studio + assigned professionals
- document storage read/write matrix
- professional activity attribution
- Partner relationship offboarding lifecycle
- document retention / deletion lifecycle
- Partner E2E late-change revalidation
- production HTTP smoke test
- demo HTTP smoke test
- PWA manifest/service-worker smoke test
- couple authorization page smoke test
- unauthenticated team-invite denial
- JavaScript/module static QA
- duplicate-id QA
- ONE-token isolation QA
- brand signature QA
- Railway mandatory `npm test` release gate
- GitHub ONE Partner QA workflow

All synthetic database test data was rolled back/removed after tests.

## Release rules

1. Do not modify ONE for ONE Partner.
2. Do not use this frozen release as a scratchpad.
3. Any future product change starts from a new branch/copy.
4. Do not weaken studio/assignment/role checks for convenience.
5. Do not cache wedding data offline.
6. Do not turn ONE Partner into a generic CRM.
7. Preserve the exact public signature **by WeddlySmartDesign** in Caveat.
8. The custom-domain TLS cutover may update external configuration/redirect URLs only; it must not alter application behavior.

## Remaining external infrastructure cutover

Only when `https://partner.weddlysmartdesign.com/` serves a valid certificate:

1. add the custom URL to Supabase Auth redirect allowlist;
2. switch notification/app links from Railway provisional origin to the custom origin;
3. smoke-test sign-up, password recovery and one team invitation on the custom origin;
4. keep the frozen application code unchanged unless that smoke test exposes an actual defect.
