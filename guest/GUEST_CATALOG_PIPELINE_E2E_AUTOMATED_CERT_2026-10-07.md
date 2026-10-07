# GUEST — CATALOG PIPELINE V1 AUTOMATED E2E CERTIFICATION

Date: 2026-10-07
Branch: guest-independent
Status: AUTOMATED / BACKEND / CONTRACT GATES PASS

This certification covers everything that can be verified without owner interaction on a real mobile device.

## 1. Repository regression state

GUEST Independent QA:
- run 37592504990 — SUCCESS
- head e7d24089b0b33833d5bb3fc17e86dfedfa5a881e

Catalog Bridge focused QA:
- run 37592294415 — SUCCESS
- earlier expanded runtime run 37592276837 — SUCCESS

The prior release-hold failures were not product defects. They were caused by exact B8/B9 checkpoint markers having been displaced from CURRENT_STATE. The canonical B8/B9 seals already existed and the markers were restored from their sealed reports.

## 2. Template-agnostic catalog backend

Supabase:
- guest-invitation-flow v9

Verified:
- template registry exists;
- order carries template_id;
- template_version is pinned per order;
- buildConfig resolves template-specific certified presets through the registry;
- final production delivery requires a stable delivery_url;
- delivered invitation is discoverable through the same license used by the existing management app;
- active_for_member returns template id/version, renderer id and stable final URL;
- no second guest list or RSVP system is created.

## 3. Live same-license bridge test

A temporary isolated QA wedding/license/member/order was created only for this certification.

Live call to:
guest-invitation-flow -> active_for_member

Result:
- HTTP 200
- ok=true
- active=true
- templateId=veil-light
- templateVersion=5.3.3
- renderer=veil-light-v5-3-3
- stable catalog delivery URL returned from guest_invitation_orders.delivery_url

This proves the delivered catalog invitation can be resolved from the EXISTING guest-management member/license identity.

The temporary QA data was deleted after the test.

## 4. Existing GUEST RSVP engine live test

On the same temporary isolated QA wedding:

Created:
- existing guest_app_state structure;
- two guests sharing one invitation unit;
- existing guest_rsvp_forms form.

Live guest-rsvp GET using invitation unit:
- HTTP 200
- unit returned correctly;
- both unit members returned.

Live guest-rsvp GET using single guest:
- HTTP 200
- correct guest returned.

Live guest-rsvp POST response:
- HTTP 201
- submission accepted.

Result back in the EXISTING guest_app_state:
- RSVP = confirmed;
- meal = Estándar;
- transport = true;
- state version advanced.

This proves the downstream response still writes into the existing management engine after the catalog bridge architecture.

All temporary QA rows, including submission/form/app state/license/wedding/order, were deleted after certification. Cleanup verification returned zero remaining rows.

## 5. Final invitation recipient contract

Implemented:
- guest/guest-catalog-delivery-runtime-v1.js
- guest/guest-catalog-template-veil-light-adapter-v1.js
- guest/guest-catalog-recipient-context-v1.js

The generic final-delivery runtime:
1. public-loads the approved invitation configuration;
2. reads recipient context from the invitation URL;
3. decorates config.rsvp.route with the EXISTING RSVP route;
4. passes the decorated config to the selected template renderer.

Recipient context is common across all designs:
- rt = RSVP public token;
- g = single guest id OR
- u = invitation unit id;
- lang = language.

Focused QA verifies:
- no VEIL LIGHT knowledge inside the generic runtime/bridge;
- base final invitation URL is preserved;
- existing query parameters are preserved;
- single-recipient identity is preserved;
- invitation-unit identity is preserved;
- RSVP token is appended correctly;
- VEIL LIGHT connects through its adapter to the frozen VEIL_APPLY_CONFIG renderer.

## 6. Existing send flow preserved

The existing GUEST send flow now loads:
- guests-catalog-invitation-bridge-v1.js
- guests-rsvp-share-composer-v3.js

It preserves the already-built:
- guest selection;
- invitation units;
- personalized message composer;
- stored contacts/contact picker;
- WhatsApp/native-share/copy;
- send status;
- RSVP downstream engine.

If no delivered catalog invitation exists, legacy invitation routing remains as fallback.

No duplicate sender or duplicate RSVP engine was created.

## 7. Owner workspace prepared for multi-template catalog

Prepared and persisted:
- /GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_V4_1_CATALOG_GENERIC_TOUCH_METRIC.html

SHA-256:
55bfee9aac131420f652358390ddd327fc4cdc2992ee95a759f0ae01aab1a1c3

Validated:
- JavaScript syntax PASS;
- owner operations no longer call VEIL LIGHT directly;
- renderer is selected by order template id;
- VEIL LIGHT is currently catalog template #1;
- new test orders explicitly use templateId;
- selected design is visible in order summary;
- active owner work time is measured automatically per order;
- idle time over 60 seconds and hidden-app time do not count;
- target shown in the workspace: <= 5:00.

This upgrade does not require reinstalling the Android shell. It can be loaded later through “Actualizar centro”.

## 8. Existing VEIL LIGHT public-load regression

The already delivered VEIL LIGHT pilot public token was loaded against the live guest-invitation-flow endpoint:
- HTTP 200
- correct delivered couple/config returned.

Its stored base rsvp.route remains '#', by design.
Recipient-specific RSVP routing is added only at final-view runtime, so one final invitation can safely serve different recipients/invitation units without duplicating the template.

## 9. What remains impossible to certify without owner interaction

Only the following human/mobile gate remains:

1. load Mobile Center V4.1 in the already-installed Android app;
2. run one normal catalog order from the owner workspace;
3. visually inspect the selected invitation on the real device;
4. confirm owner active-work metric <=5:00 for the normal order;
5. optionally open one actual shared recipient link on a real phone to confirm the visual transition from invitation to RSVP feels correct.

This is NOT new architecture or feature building.
It is the final real-device usability/perception gate.

No Design 02 should require any change to the business/management flow. Design 02 only plugs a second certified renderer/preset manifest into this catalog contract.

## 10. Certification conclusion

AUTOMATED CATALOG PIPELINE V1: PASS.

LIVE SAME-LICENSE INVITATION -> EXISTING GUEST BRIDGE: PASS.

LIVE EXISTING RSVP -> EXISTING GUEST STATE WRITEBACK: PASS.

GENERAL GUEST REGRESSION QA: PASS.

CATALOG BRIDGE QA: PASS.

Remaining gate:
REAL ANDROID OWNER TOUCH-TIME / EXPERIENCE VALIDATION.

Commercial publication and Stripe connection remain explicitly on hold.


## 11. Post-certification hardening completed

After the initial automated E2E certification:

- `guest-invitation-flow` advanced to **v11**;
- final delivery now requires explicit couple status `approved` (no delivery from merely `review_ready`);
- production final delivery is blocked unless both the final invitation URL and the existing management-app license/access are available;
- customer email subjects no longer expose unexplained `GUEST` naming;
- order-received, review and final-delivery emails now use premium visual HTML and explain the next action;
- final delivery explicitly introduces the included **gestión de invitados** by function, with separate CTAs for viewing the invitation and organizing/sending to guests;
- `guest/access.html` now explains the included management app before using product branding;
- `guest/tools/build_catalog_delivery.js` packages any commercially frozen catalog template through the common delivery runtime;
- the real frozen VEIL LIGHT V5.3.3 master was packaged successfully and the renderer payload was proven byte-identical after wrapper stripping;
- focused Catalog Bridge QA including customer-journey and delivery-builder gates passed in run **37593716818**.

Real artifact evidence:
`guest/GUEST_CATALOG_DELIVERY_ARTIFACT_QA_2026-10-07.md`.

Persistent catalog pilot artifact:
`/GUEST/CATALOG_PIPELINE/GUEST_VEIL_LIGHT_CATALOG_DELIVERY_V1_PILOT.html`.

The only remaining certification item that cannot be automated is the real-Android owner usability/touch-time gate using Mobile Center V4.1.
