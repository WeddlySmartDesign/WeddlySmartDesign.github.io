# GUEST — MOBILE OWNER WORKSPACE

Date: 2026-10-07
Branch: guest-independent
Status: OWNER MOBILE WORKSPACE READY FOR DEVICE VALIDATION

## Why this exists

The end-to-end pilot proved the workflow, but operating it through separate questionnaire / production / review / final HTML files and chat links was not acceptable for day-to-day owner use.

The owner must be able to work from the phone because GUEST invitations are mobile products.

## Questionnaire correction

The first guided questionnaire used screenshots from the extreme scalability stress order and one cover reference could fail to render offline. That version is retired.

Canonical guided questionnaire:
- GUEST_QUESTIONNAIRE_VEIL_LIGHT_GUIDED_V2_NORMAL_REFERENCE.html

Rules:
- guide imagery uses a normal representative VEIL LIGHT sample (Isabel & Hugo), NOT the stress-order long-name case;
- every guide image is embedded inside the questionnaire, so it works offline and cannot lose its cover image;
- copy has been simplified into normal couple-facing language;
- guide captions explain the invitation section, not implementation details.

## Mobile Center content package

Canonical owner center:
- GUEST_MOBILE_CENTER_V2.html
- SHA-256 19883e6ff86ceee7a0b48004c9f50c3419963996fb4754acad03862dd86b8aef

It embeds the corrected V2 questionnaire exactly.

The center remains owner-only and continues to use:
- frozen VEIL LIGHT V5.3.3 renderer;
- existing Supabase owner/backend authentication;
- order list, editing, visual tuning, preview, review simulation and final-delivery checking from one workspace.

## Android app

Native Android shell:
- package: com.weddlysmartdesign.guestmobile
- app label: GUEST Mobile Center
- APK: GUEST_MOBILE_CENTER_ANDROID_V1.apk
- SHA-256 f63b83f26aa456431061baa363303d144e4065ca8e793d7795d2089b921e8854

Build:
- GitHub Actions workflow: .github/workflows/guest-mobile-app.yml
- successful run: 37574512849
- artifact: GUEST-Mobile-Center-APK

Architecture:
- the APK is a native WebView owner shell;
- on first launch only, owner selects GUEST_MOBILE_CENTER_V2.html from Downloads;
- app copies the center into private internal app storage;
- from then on the owner launches GUEST directly from the Android app icon;
- native menu supports Reload / Update center / Close;
- HTML file inputs are bridged through Android file chooser so questionnaire photo uploads work;
- local center is allowed to call HTTPS Supabase backend;
- no public GUEST publication and no Stripe wiring.

Reason the center HTML is imported once instead of bundled:
- the self-contained frozen center is ~29 MB because it includes the exact invitation media/renderer;
- keeping it as an independently replaceable content package allows future center updates without rebuilding/reinstalling the APK;
- after initial import, normal use is app-icon direct access.

## Persistent Library

Saved under:
- /GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_ANDROID_V1.apk
- /GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_V2.html
- /GUEST/MOBILE_CENTER/GUEST_QUESTIONNAIRE_VEIL_LIGHT_GUIDED_V2_NORMAL_REFERENCE.html

## Boundaries

- VEIL LIGHT V5.3.3 remains commercially frozen.
- ONE, ONE Partner and STUDIO untouched.
- Stripe and public GUEST publication remain untouched.
- Design 02 should not begin until owner validates this mobile workspace on the real phone.


## MOBILE OWNER WORKSPACE V3 — READABILITY + QUESTIONNAIRE COVER FIX 2026-10-07

Real Android validation exposed two defects:
- the questionnaire Cover guide image could render as a broken image on Android even though the embedded WebP decoded correctly off-device;
- owner operational text in Mobile Center used several 10–12 px labels/meta/explanatory sizes, too small for reliable QA on a phone.

Resolved without changing the Android APK shell:
- canonical center content: GUEST_MOBILE_CENTER_V3_MOBILE_CLEAR.html;
- canonical questionnaire: GUEST_QUESTIONNAIRE_VEIL_LIGHT_GUIDED_V3_MOBILE_CLEAR.html;
- all 7 questionnaire guide images re-encoded as standard JPEG data URIs; 7/7 decode PASS at 390×488;
- Cover reference now has a literal embedded src before JS boot, so it does not depend on API load/step initialization to appear;
- normal Isabel & Hugo reference remains; no stress-order imagery reintroduced;
- couple questionnaire mobile helper/form text enlarged;
- owner Mobile Center typography enlarged substantially (inputs/selects 18 px, buttons 16 px, meta/status ~15.5 px, explanatory text 16 px, editor labels 17 px);
- owner readability CSS is scoped to #wsdProd and does NOT alter the frozen invitation renderer;
- APK reinstall is NOT required: use native menu → Actualizar centro and import V3 once.

VEIL LIGHT V5.3.3 remains frozen. No Stripe/publication changes.
