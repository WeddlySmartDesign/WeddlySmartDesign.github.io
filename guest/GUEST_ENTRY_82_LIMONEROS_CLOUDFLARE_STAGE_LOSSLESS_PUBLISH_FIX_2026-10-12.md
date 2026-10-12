# GUEST — Entrada 82 · Limoneros HTTPS publication diagnosis and lossless stage fix (2026-10-12)

## Real work completed, not a plan

- D03 V1 **already committed** in GitHub `guest-independent` as original HTML at commit [75b60376](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/commit/75b60376ea4473a69e73e8acc0cde5b76591c774), 28,673,474 bytes, frozen SHA256 `a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482`. DO NOT resend files, redo design, re-upload blobs or re-integrate.
- The actual Cloudflare site is `https://guest-weddlysmartdesign.pages.dev/` with intended D03 review URL `https://guest-weddlysmartdesign.pages.dev/guest/catalog-assets/design-03/1.0.0/index.html`.
- Created and executed real HTTPS diagnostic via GitHub Actions, persisted at `guest/qa-reports/limoneros_cloudflare_live_check.json`. First check 2026-10-12 09:20:09 UTC: Cloudflare HTTP 200, `noindex`, but **877-byte fallback** instead of D03. The 200 status alone is NOT proof the HTML is online. Do not hand user link as working until bytes/hash verified.
- Root technical issue to address: D03 self-contained HTML **28.7 MB** contains 2 base64 MP4 videos and 13 base64 JPGs. Cloudflare Pages deploy has per-asset limit (25 MiB); standalone HTML exceeds it.
- Local lossless extraction verified on original media, **15 files** (2 MP4 + 13 JPG), total 20,735,903 raw bytes, maximum individual item 8,587,255 bytes, published HTML `1,025,775` bytes. Offline reconstruction of source from split files recovered EXACT original SHA256 byte-for-byte.
- Generic fix committed to **`guest/tools/build_catalog_static_preview.cjs`** commit [26e4dfa](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/commit/26e4dfa6a4e4b6cda0888c186a11dc3f66359dc7): build automatically converts embedded media of any large visual to relative media files; verifies base64 canonical, detects collisions, enforces Cloudflare size cap and performs **exact cryptographic round-trip back to frozen original** before emitting. No visual source, media, catalogue sales status or other frozen product changed. Small visual designs unchanged.
- GitHub Actions reproducible post-build+remote-media QA workflow `.github/workflows/guest-limoneros-live-probe.yml` commit [4061eed](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/commit/4061eed803552f179358650e9d62fe8472ca6f36) now builds ACTUAL Cloudflare output, checks source SHA, 15+ media, HTTPS HTML SHA/bytes, all image and video exact remote SHA, noindex and no sale. Polls publication to allow autodeploy time, then persists evidence at same JSON path. Read JSON before asserting online/pass.
- Independently diagnosed failing general QA from [workflow 38228615447](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38228615447): old `guest/tests/prepare_live_catalog_registry.test.cjs` expected D03 to be absent from generated registry forever. Fixed with all-existing catalogue snapshot as synthetic baseline, commit [39fe9db](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/commit/39fe9db825e28ef74c3efcd3cb352db39a2951a2), so D03/D04+ additions don't break tests.

## Outstanding checks: do not overclaim

- **Cloudflare staged bytes live**: waiting for latest `guest/qa-reports/limoneros_cloudflare_live_check.json` schema `guest-d03-cloudflare-stage-evidence-v2` with `stageBuildPassed=true`, `online=true`, `liveMediaExact=true`. Until then the only positively observed online artifact is a fallback 877 bytes; latest fixer commit is not proof deployment succeeded.
- **GitHub QA all green**: verify new Catalog QA after fixture update.
- **Backend V18 TEST**: D03 not deployed; use generic `guest/tools/prepare_live_catalog_registry.cjs` and controlled TEST deployment only; no customer flows/sales/checkout.
- **Android V5.0 real**: not validated for D03. After full HTTPS proof and backend TEST, verify one real physical Android review and return; do not repeat historic Botánica.
- **Certification/SALE**: D03 remains `certification-pending`, 0/11 sale gates, no Stripe and no sales.

## Subsequent D04+ standardized procedure

The **original self-contained premium HTML is immutable**, stored by SHA and registered once. The generic shared Cloudflare build automatically externalizes any oversize base64 images or videos losslessly. New designs no longer require binary blob re-upload troubleshooting after successful admission. Every run verifies original SHA, emitted file size/media hashes, HTTPS media and pending-sale guards. Record byte-by-byte evidence; ask owner only for a final visual check once public preview is actually available.
