# GUEST by WeddlySmartDesign — CURRENT STATE
Updated: 2026-10-01

## Continuity rule
This file is the FIRST file to read before doing any further GUEST work.
Never resume from chat text alone.
Never restart a closed block.
Never infer the current block from the user's last visible message.
Resume from the exact "NEXT ACTION" below.

## Closed blocks
- B0 extraction independent — CLOSED
- B1 standalone GUEST shell/product — CLOSED
- B2 technical isolation — CLOSED
- B3 commercial base flow — CLOSED
- B4 automatic QA base — CLOSED
- B5 latest-ONE parity audit — PASS / SEALED
- B6.1 shell / install / navigation / settings — PASS / CLOSED
- B6.2 Today + Guests — PASS / CLOSED
- B6.3 Invitation + RSVP + Essential/Signature — PASS / CLOSED
- B6.4 Tables + lists — PASS / CLOSED
- B6.5 Extra events — PASS / CLOSED
- B6.6 Two-device synchronization + error states — PASS / CLOSED
- B6 functional/mobile QA — PASS / SEALED
- B7.1 Mobile hierarchy — PASS / CLOSED
- B7.2 Hoy + Invitados — PASS / CLOSED
- B7.3 Invitación + RSVP — PASS / CLOSED
- B7.4 Mesas + Listados — PASS / CLOSED
- B7.5 Eventos extra — PASS / CLOSED
- B7.6 Coherencia global + escritorio + accesibilidad visual — PASS / CLOSED
- B7.7 QA visual final — PASS / CLOSED
- B7 UX/visual premium — PASS / SEALED
- B8.1 landing → selección → checkout — PASS / CLOSED
- B8.2 checkout → pago → retorno + webhook resiliente — PASS / CLOSED
- B8.3 datos/personalización tras compra — PASS / CLOSED

B7 final sealed report:
`guest/B7_7_FINAL_VISUAL_SEAL_QA_2026-10-01.md`

Validated B7 HEAD:
`4728b6ff8cf78d904c94cfb11927cea4624ffbba`

Validated GitHub Actions run:
`36733355182` — 14/14 jobs `success`

## Current block
B8.4 fulfillment QA syntax fixed after CI run 36827484796 isolated the only failure; B8.5/B8.6/B9.1 green in that run; B9.1–B9.9 release preparation implemented, awaiting a canonical post-fix CI

Current branch:
`guest-independent`

## B8 scope
B8 = QA del flujo comercial completo, sin rediseñar el producto funcional ya sellado.

Microbloques:
- B8.1 landing comercial → selección Essential/Signature → entrada a checkout
- B8.2 checkout → pago → retorno y preservación de pedido
- B8.3 recogida de datos/personalización tras compra
- B8.4 activación/entrega y acceso real al producto
- B8.5 estados de error, cancelación, reintento y duplicidad
- B8.6 regresión comercial móvil/escritorio + sellado final de B8

## Exact current failure
B8.3 is PASS / CLOSED. CI run 36826525955 completed successfully after correcting QA-only defects.

B8.4–B8.6:
- canonical delivery path is now ONLY the manager-authenticated `guest-orders-admin.html` → `guest-orders-admin` backend;
- duplicate `guest-deliver.html` surface was removed;
- Stripe checkout backend no longer exposes a duplicate manual delivery action;
- final delivery requires status `ready`, records `delivered`, and uses email idempotency;
- B8.5 adds explicit checkout/verification retry plus Stripe checkout-attempt idempotency;
- LIVE probes: config 200; nonexistent Stripe session 404 `session_not_found`; unauthenticated orders admin 403 `manager_required`;
- B8.6 final seal exists, but B8 is NOT declared sealed until the canonical CI run is green.

B9.1:
- GUEST PWA remains scoped to `/guest/`;
- cache bumped to `guest-shell-v3`;
- offline navigation fallback is restricted to canonical app routes, so broken invitation/access HTML cannot silently open the app shell.

B9.2:
- public release route gate checks purchase → return → order → activation → app routes;
- customer surfaces cannot expose the private orders manager or discarded delivery route;
- required internal release targets are checked for existence.

B9.3:
- pre-release hold explicitly prevents declaring/releasing GUEST before B8+B9 are sealed;
- GUEST customer release artifacts remain absent from `main`.

B9.4:
- public/private surface security gate forbids Stripe/webhook/service-role secrets and admin capabilities on customer pages;
- private order manager remains authenticated and separate.

B9.5:
- independent commercial identity is now `product=guest` in Stripe session, PaymentIntent validation and license metadata;
- LIVE `guest-stripe-checkout` deployed with this identity;
- existing Stripe licenses checked: no prior GUEST purchase required migration.

B9.6:
- Supabase GUEST security audit PASS at design/permission level;
- GUEST tables inspected have RLS enabled;
- `guest_webhook_secret`, `provision_weddly_license` and `activate_weddly_license` are service-role-only;
- shared-project advisories belonging to ONE/Partner/other products are documented but deliberately untouched.

B9.7:
- canonical app, Guests engine, settings, access, RSVP and event invitation surfaces are protected with `noindex,nofollow,noarchive`;
- sensitive root checkout/return/order/admin surfaces are also non-indexable;
- invitation links remain usable; noindex only prevents search-engine discovery.

## CI historical-failure triage (2026-10-01)
- Runs 323–326 are historical and must not be treated as current regressions.
- Repeated `b8-fulfillment-admin` failure = SyntaxError in the QA test itself; fixed at `1960a9bf9adf491ce56c326a345abd478adadd21`.
- Historical `b8-error-retry-duplicate` failure expected deleted `guest-deliver.html`; later QA was aligned to canonical manager delivery.
- Historical `b9-public-release-routes` failure used an earlier rigid checkout-return route assertion; later B9.2 gate was corrected.
- Historical `b7-mobile-hierarchy` “active nav hierarchy weak” is superseded by validated B7 run `36733355182`, where all 14 B6/B7 jobs, including `b7-mobile-hierarchy`, passed.
- Therefore do NOT reopen B6/B7 from these queued historical runs. Only a failure reproduced at/after the post-fix canonical commit is actionable.

## NEXT ACTION
1. Wait for/inspect the first completed CI run at or after commit `1960a9bf9adf491ce56c326a345abd478adadd21` (B8.4 QA syntax fix).
2. Require B8.4 fulfillment admin, B8.5, B8.6 and B9.1–B9.8 to be green in a post-fix canonical run.
3. If any job fails, fix ONLY that exact failure; do not reopen B6/B7.
4. When B8.4–B8.6 are green, write the B8 final seal and mark B8 PASS / SEALED.
5. When B9.1–B9.7 + aggregate gate are green, write the B9 final release-preparation seal.
6. Only after both seals exist may GUEST be considered ready for an explicit publication step. Do not merge/publish to `main` automatically.
7. Production promotion MUST follow `B9_9_SAFE_PROMOTION_STRATEGY_2026-10-01.md`: start from current `main` and allowlist GUEST files; never wholesale-merge the diverged branch.
8. For the first release, preserve the validated isolated `/guest/**` tree rather than pruning historical copied files; dynamic RSVP/event dependencies make late pruning riskier than inert isolated files. Cleanup can be a post-release task.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
