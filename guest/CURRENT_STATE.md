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
- B8.4 activación/entrega y acceso real — PASS / CLOSED
- B8.5 error/cancelación/reintento/duplicidad — PASS / CLOSED
- B8.6 regresión comercial + sellado final — PASS / CLOSED
- B8 commercial QA — PASS / SEALED
- B9.1–B9.9 release preparation — PASS / CLOSED
- B9 release preparation — PASS / SEALED

B7 final sealed report:
`guest/B7_7_FINAL_VISUAL_SEAL_QA_2026-10-01.md`

Validated B7 HEAD:
`4728b6ff8cf78d904c94cfb11927cea4624ffbba`

Validated GitHub Actions run:
`36733355182` — 14/14 jobs `success`

## Current block
B8 and B9 are PASS / SEALED. Canonical pre-seal validated commit: `dac667cffa863fadb65411f6abef7e72ddf04f59`. Canonical CI run: `36836190260` (run 371), all jobs success. Publication remains a separate explicit step and MUST NOT happen automatically.

B8 final sealed report:
`guest/B8_FINAL_COMMERCIAL_SEAL_QA_2026-10-01.md`

B9 final sealed report:
`guest/B9_FINAL_RELEASE_PREPARATION_SEAL_2026-10-01.md`

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
1. GUEST is technically ready for an explicit publication step; do not publish automatically.
2. On explicit publication authorization, query the latest `main` HEAD immediately before promotion.
3. Build the production candidate from that current `main` using only the B9.9 GUEST allowlist; never wholesale-merge `guest-independent`.
4. Preserve the validated isolated `/guest/**` runtime tree for first release.
5. Verify the candidate diff contains no ONE, ONE Partner, STUDIO or root legacy `guests-*` changes.
6. Run release smoke/gates on the candidate before production promotion.
7. After deployment, perform live non-paying smoke checks for landing → Stripe session creation, return/status, access and PWA behavior.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.


## Post-release product architecture revision — 2026-10-01
The user identified a product-model correction after live testing:
- GUEST must NOT inherit ONE's product flow.
- The customer journey starts with the invitation, not with a generic management dashboard.
- The couple chooses a closed invitation model and supplies content; WeddlySmartDesign prepares/publishes it.
- After delivery, GUEST becomes the couple's management surface for invitation sharing, RSVP responses, guests, tables and lists.
- Reuse the validated GUEST/ONE-derived engines underneath, but redesign the GUEST customer journey and navigation around this invitation-first flow.
- Do NOT reopen or modify ONE, ONE Partner or STUDIO.
- Essential and Signature MUST have separate, closed capability contracts. Standardization means a predictable process, not identical feature sets.
- Essential remains intentionally simpler; Signature may include richer blocks such as countdown, dress code and other premium modules.
- No full personalized preview before delivery: show a model demo plus a complete content summary, preserving the "prepared by WeddlySmartDesign" reveal.
- Target operator effort: normal invitation fulfillment should require only review → publish → deliver, with no manual layout work.

### Current live incident / unblocker
Essential photo selection became unreliable on mobile because the integration hid native file inputs and triggered them through JavaScript buttons inside nested iframes.
Minimal GUEST-only hotfix on main:
- commit `057a8b095c095be7214ef6e25094090bdfc615a8`
- file: `guest/guests-personalizacion-essential.html`
- changed photo triggers to native label/file-input activation for better mobile reliability.
- no invitation designs, RSVP logic, guest engine, ONE, Partner or STUDIO modified.

## NEXT ACTION — revised
1. Let the Essential photo-picker hotfix deploy.
2. User tests photo upload on mobile.
3. Once upload works, inspect the user's screenshots/video showing Essential layout failures with real photos.
4. Before rebuilding GUEST navigation or invitation workflow, define and freeze two separate content/capability contracts: Essential and Signature.
5. Then redesign only the GUEST customer journey around invitation-first flow while preserving validated underlying engines.


## ESSENTIAL DESIGN REOPEN — 2026-10-01
Status: ACTIVE. GUEST functional redesign is PAUSED until Essential invitation quality is corrected.

User mobile evidence exposed a serious visual-quality issue before further sales:
- cover hierarchy/text can feel clipped or visually lost in the in-app preview;
- Essential 02–05 use essentially the same fixed 150x150 circular cover-photo treatment, which is not premium enough;
- agenda typography is too small for real mobile use (places 9.5px; titles ~12.5px; some fitting logic can reduce further);
- several cover texts are ~10.5–11px;
- five agenda moments are forced into one row, producing poor legibility and awkward word breaks;
- story/section transitions need proper mobile breathing room;
- the ONE sticky-header overlap visible in supplied screenshots is a preview-shell issue and must not be mistaken for the standalone public invitation layout. ONE remains frozen and MUST NOT be modified.

Essential redesign rules:
1. Work ONLY on isolated GUEST Essential copies. Never modify ONE/ONE Partner/STUDIO.
2. Essential stays intentionally simpler than Signature; do not add Signature-only modules (countdown, dress code, etc.).
3. Simpler does NOT mean lower visual quality. Essential must still feel editorial, deliberate and premium.
4. No essential informational text below a comfortable real-mobile reading size. Do not solve overflow by shrinking text.
5. Agenda must reflow responsively instead of forcing five items into one row.
6. Essential 02–06 circular cover photo treatment must be replaced by a more editorial treatment appropriate to each model; do not homogenize all six.
7. Preserve all validated RSVP/data behavior while redesigning presentation.
8. Validate with realistic long names/venues and 3–5 agenda moments at narrow mobile width before resealing.

NEXT ACTION:
- Audit Essential 01–06 model-by-model and implement a first premium visual pass on GUEST copies only.
- Then run visual/functional regression before resuming GUEST product-flow work.


### Essential premium pass A — IMPLEMENTED, pending real-device visual validation
Files:
- `guest/guests-essential-premium-v2.css`
- `guest/guests-rsvp-essential-01.html` … `06.html`

Changes:
- all six Essential templates opt into isolated premium/readability CSS;
- Essential 02–06 no longer use the same 150x150 circular cover-photo presentation: each receives a distinct editorial photo geometry;
- Essential 01 keeps its differentiated heart treatment;
- cover/subtitle/date text minimum visual sizes increased;
- story copy increased for real-mobile reading;
- agenda no longer forces five moments into one row: 2-column mobile grid, 3-column wider layout;
- agenda place/title/time sizes raised; CSS !important prevents old JS fit logic from shrinking them below the new visual contract;
- section spacing and facts readability improved;
- no RSVP/data logic changed.

Static integration check: PASS 6/6 templates linked and model-scoped.
Status remains ACTIVE until visual inspection on the user's real mobile proves each model individually.
NEXT ACTION:
1. Wait for Pages deployment of current main.
2. Real-device inspect Essential 01–06 with photos and realistic content.
3. Correct model-specific composition defects found in that visual pass; do not reseal from static checks alone.
4. Only after all six pass, freeze Essential visual contract and resume GUEST.


### Essential visual QA gate — PASS
- Added `guest/qa/essential_visual_contract_test.js`.
- Added isolated workflow `.github/workflows/guest-essential-visual-qa.yml`; it watches only Essential/GUEST visual files.
- First run: 36874972761 — SUCCESS.
- The gate protects minimum mobile typography, responsive agenda reflow, per-model photo geometry, shared preview/delivery CSS and the Essential 05 whitespace correction.
- No ONE/ONE Partner/STUDIO runtime files are part of this gate.
Current status: Essential redesign ACTIVE; automated structural gate PASS; real-device visual approval still required.
