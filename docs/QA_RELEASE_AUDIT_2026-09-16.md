# Weddly Smart Design — Release QA audit — 2026-09-16

Audit target: production commit `d3e2365e79392d9d4eb0978437ba38b255a9e98e` plus the live Supabase runtime used by that commit.

This document is a release gate, not a claim that browser/device QA has been completed. Production remains frozen until all P0/P1 items are resolved and the real-device matrix passes.

## Release decision

**HOLD — not ready for paid release.**

The corrected seating defect exposed a broader Guests state-management problem: several independent layers can write the same full Guests document while the frozen Guests core retains an older in-memory snapshot and writes that snapshot again during ordinary renders. In addition, Guests cloud conflict/startup handling can discard local or concurrent edits. These are data-integrity risks in a product advertised for two-device/shared use.

## P0 — release blockers

### QA-001 — Guests has multiple writers plus a stale in-memory full-state writer

Evidence:
- `guests-v114-integrated.html` loads `S` once from `weddly_guests_qa_v67` and `render()` calls `save()`.
- `guests-plusone-placeholder-link-v1.js`, RSVP operations, people manager, import tooling and the visual seating layer can write the same canonical Guests key outside that core.
- The seating incident was one concrete manifestation: the visual plan wrote the correct table assignment, then the core saved its stale snapshot on return.

Required fix:
- Establish one authoritative Guests state store/write path, or make the core rebase/reload before every write and use explicit mutation operations rather than saving an old full snapshot.
- External writers must notify/update the active core before it can save again.

Acceptance:
- Changes made from every secondary surface (seating, RSVP operations, people manager, import, +1 resolution) survive returning to Guests, changing tabs, re-rendering, closing/reopening and a second device.

### QA-002 — Guests startup can overwrite newer local offline work with older server state

Evidence:
- `guests-production-sync.js` GETs server state on startup and, when a server state exists, writes it to local storage without a dirty/local freshness merge.

Failure scenario:
1. edit Guests while temporarily offline;
2. close before the edit is pushed;
3. reopen online;
4. older server state replaces the newer local edit.

Required fix:
- Add durable dirty/base/version metadata and merge/recovery semantics. Planning already uses per-item timestamps/dirty state and is a useful reference pattern.

Acceptance:
- Offline edit → close → reopen online never silently loses the edit.

### QA-003 — Guests 409 conflict handling can silently discard one partner's edit

Evidence:
- `guests-production-sync.js` stores the losing local state in `weddly_guests_conflict_backup`, replaces local state with the server state and reloads.
- There is no user-visible conflict/recovery flow and no field/item merge.

Required fix:
- Merge non-conflicting edits deterministically and surface true conflicts rather than silently replacing one side.

Acceptance:
- Two devices editing different guests/tables concurrently retain both changes.
- Same-record conflict has an explicit deterministic rule or user-visible recovery.

### QA-004 — Restoring a backup can be re-overwritten by stale Guests state

Evidence:
- `weddly-settings.html` restores Guests to the remote API, but does not immediately replace the canonical local Guests document and active Guests core with the restored state.
- The already-loaded Guests iframe can therefore still hold pre-restore `S` and later save it.

Required fix:
- Restore server + canonical local + active core atomically from the user's perspective, then verify remote version.

Acceptance:
- Restore backup → open Guests immediately → data equals backup → refresh → second device → still equals backup.

### QA-005 — No mandatory GitHub release gate

Evidence at audit time:
- `main` is unprotected.
- required status checks are off.
- the only existing workflow is artwork generation, not product QA.
- the seating-fix commit had no CI status checks.

Required fix:
- Protect `main`: PR-only changes, required QA status, no direct pushes except explicit emergency procedure.
- Keep a known-good freeze branch/tag for every release candidate.

Acceptance:
- A deliberately broken QA fixture cannot be merged to `main` without failing a required check.

### QA-012 — Production RSVP +1 operations script does not parse

The automated Node syntax check fails on `guests-rsvp-plusone-ops-v1.js` with `SyntaxError: Unexpected token ')'`. This is not an archived-only file: `guests-rsvp-operations-live.html` injects that script into the active RSVP management flow.

Required fix:
- Correct the script on an isolated defect branch and add its syntax check permanently to the release gate.
- Validate RSVP management with an existing +1, a newly created +1, rename/remove, manual response and return to Guests.

Acceptance:
- Production-reachable JS graph parses cleanly.
- +1 operations render and persist correctly in RSVP management, Guests and a second device.

## P1 — high-priority release risks

### QA-006 — Full product is not reproducible from GitHub alone

`payments.html` downloads the actual Payments application from the live Supabase Edge Function `weddly-app`. The edge function assembles the runtime from database `app_assets`. A GitHub SHA therefore does not uniquely identify the complete product a buyer sees.

Required fix: record the exact `weddly-app` function version/hash and app-asset release ID alongside each GitHub production release, and include that live runtime in the QA gate.

### QA-007 — Payments has a stale-shell offline fallback

`payments.html` caches the fetched app shell in localStorage and will run it when the live fetch fails. A buyer can therefore execute an older Payments shell after production has changed. This is intentional resilience but must be versioned and migration-tested.

### QA-008 — Settings backup export can be incomplete without making that explicit

Guests in the backup are taken from the server. If a local Guests edit has not reached the server, export can omit it. The export path should first ensure Guests sync is clean/current or clearly refuse/flag an incomplete backup.

### QA-009 — RSVP legacy/manual sanitizer can manufacture meal values

The active `weddly-rsvp` Edge Function has legacy sanitizers where `cleanPlus()` can default an absent +1 meal to `Estándar` and `cleanChildren()` can default a child meal to `Infantil`. The newer public single-guest +1 bridge (`weddly-rsvp-single-v2`) correctly preserves `null`/empty meal state, but manual/legacy routes must be audited and brought to the same invariant: never invent a selection the user did not make.

### QA-010 — Root PWA/cache architecture has overlapping release versions/scopes

Observed registrations/cache identifiers include `/sw.js?v=58`, demo registration `/sw.js?v=69`, cache name `weddly-v68-suite`, plus a separate demo worker. This is not automatically a bug, but it makes cache provenance hard to reason about and is a regression risk for installed apps/demos.

Acceptance: upgrade from previous release, installed app cold start, offline start, demo install, real↔demo transitions and cache clear/reload matrix.

### QA-011 — Full-suite shell depends on DOM monkey-patching child modules

`app.html` reaches into child iframes and hides/re-routes controls by DOM IDs/text, with a 250 ms patch loop. This is brittle: a child label/ID/layout change can silently break global integration without a compile/test failure.

Required direction: explicit `postMessage`/module integration contract and smoke tests for every global route.

## P2 — repository/release hygiene

- Test residue such as `zz-test-create.txt` exists in the production tree.
- There is substantial branch/version/hotfix sprawl. Old files cannot be deleted blindly because production intentionally references versioned cores, but reachable vs archived assets should be documented.
- The full-repository syntax scan also found malformed JavaScript in several legacy/preview files. These are not currently classified as production-reachable, so they are warnings rather than release blockers, but they should be archived or repaired once the production graph is documented.
- Numerous temporary/test Edge Functions are active in the same Supabase project. They require an ownership/auth/reachability review before release; `verify_jwt:false` alone is not treated as a vulnerability because several functions implement their own member-token authentication.

## What looked comparatively stronger

Planning uses a more defensible synchronization model than Guests: local `dirty` state, per-item `updatedAt`, state merging and conflict retry. The server also uses optimistic version checks. This does not replace browser/device QA, but it is the direction Guests should converge toward.

The current single-guest public +1 flow also has a newer dedicated server path (`weddly-rsvp-single-v2`) that creates/updates a real Guests entity and keeps meal state nullable rather than forcing a default. Manual/legacy RSVP paths need parity with that behavior.

## Mandatory release matrix after P0 fixes

1. Fresh install/open: ES + EN, Android Chrome + iPhone Safari/PWA.
2. Access: Payments-only, Guests-only, Full, 7-day, 14-day, permanent tester, partner invite, expired access.
3. Payments: provider fixed/per-guest/mixed cost, payment, receipt at creation/edit, gift/contribution, refund boundaries, cancellation, attachments, offline/reopen, second device.
4. Guests: add/edit/delete, groups/subgroups, RSVP states, +1 rename/remove, children, menus/allergies, transport/accommodation, tables/capacities, bulk seating, visual seating, reports, import.
5. RSVP: single, grouped invitation, manual response, duplicate submit/idempotency, optional questions off, required custom questions, +1 independent services, decline after previous confirm.
6. Planning: task/event CRUD, wedding date shift, suggestions from Payments/Guests, calendar export, offline/reopen, concurrent device edits.
7. Cross-module: identity/date/theme/language changes, Guests→Planning counts/suggestions, Payments dates→Planning, Settings backup/restore.
8. PWA/cache: browser vs installed app, version upgrade, cold start, offline start, cache refresh, demo→real and real→demo isolation.
9. Navigation/mobile: keyboard open/close, modal scroll, bottom actions, safe areas, iPhone/Android system bars, all global/internal menus.
10. Data-loss suite: forced 409, offline edits, simultaneous devices, stale tab left open, restore while Guests loaded, RSVP arriving while Guests loaded.

## Release rule

No paid release until all P0 items are closed, the automated gate is green, and the device matrix is signed off against one immutable GitHub SHA plus one immutable Supabase runtime/version set.
