#!/usr/bin/env python3
"""Offline security and Cloudflare routing regression tests. No network or credentials."""
import copy
import importlib.util
import json
import pathlib
import unittest
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
VERIFIER = ROOT / "guest/qa/verify_guest_preview_manifest_2026_10_20.py"
SPEC = importlib.util.spec_from_file_location("guest_preview_validator", VERIFIER)
v = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(v)
ORIGIN = "https://ab12cd34.guest-weddlysmartdesign.pages.dev"

class PreviewGuardTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads((ROOT / "guest/qa-reports/preview16_recovered_manifest_2026-10-20.json").read_text())

    def test_real_sealed_manifest(self):
        self.assertEqual(len(v.validate_manifest(self.manifest)), 121)

    def test_sealed_manifest_variants_and_reject_mutations(self):
        self.assertTrue(v.verify_stage_manifest_variant(
            self.manifest, copy.deepcopy(self.manifest),
            "ba0e5928a601b42df93c62e0315ceb3b6b23bd4b9bf49b44527e89da7349b05c"
        ))
        self.assertTrue(v.verify_stage_manifest_variant(
            self.manifest, copy.deepcopy(self.manifest),
            "4b8c39645af44a63577f5dfa0cafc4583c2036b8a12db8af14b5871684fccaad"
        ))
        with self.assertRaises(v.VerificationError):
            v.verify_stage_manifest_variant(self.manifest, copy.deepcopy(self.manifest), "0" * 64)
        tampered = copy.deepcopy(self.manifest)
        tampered["files"][0]["sha256"] = "0" * 64
        with self.assertRaises(v.VerificationError):
            v.verify_stage_manifest_variant(
                self.manifest, tampered,
                "ba0e5928a601b42df93c62e0315ceb3b6b23bd4b9bf49b44527e89da7349b05c"
            )
        tampered = copy.deepcopy(self.manifest)
        tampered["designs"][0]["version"] = "unexpected"
        with self.assertRaises(v.VerificationError):
            v.verify_stage_manifest_variant(
                self.manifest, tampered,
                "4b8c39645af44a63577f5dfa0cafc4583c2036b8a12db8af14b5871684fccaad"
            )

    def test_headers_is_configuration_not_public_http_asset(self):
        files = v.validate_manifest(self.manifest)
        public_files = v.public_http_assets(files)
        self.assertEqual(len(files), 121)
        self.assertEqual(len(public_files), 120)
        self.assertNotIn("_headers", {x["name"] for x in public_files})
        self.assertIn("index.html", {x["name"] for x in public_files})

    def test_headers_file_requires_exact_source_pin(self):
        data = copy.deepcopy(self.manifest)
        config = next(x for x in data["files"] if x["name"] == "_headers")
        config["sha256"] = "0" * 64
        with self.assertRaises(v.VerificationError):
            v.validate_manifest(data)

    def test_safe_same_preview_html_redirects(self):
        for old, new in (
            ("/guest/catalog-final.html", "/guest/catalog-final"),
            ("/guest/catalog-assets/veil-light/5.3.3/index.html", "/guest/catalog-assets/veil-light/5.3.3/"),
            ("/guest/catalog-assets/design-09/1.0.0/index.html", "/guest/catalog-assets/design-09/1.0.0/"),
        ):
            self.assertTrue(v.canonical_html_redirect(ORIGIN+old, ORIGIN+new, ORIGIN), old)

    def test_unsafe_redirects_refused(self):
        original = ORIGIN + "/guest/catalog-final.html"
        for dest in (
            "https://guest-weddlysmartdesign.pages.dev/guest/catalog-final",
            "https://another.guest-weddlysmartdesign.pages.dev/guest/catalog-final",
            "http://ab12cd34.guest-weddlysmartdesign.pages.dev/guest/catalog-final",
            ORIGIN + "/admin",
            ORIGIN + "/guest/catalog-final?token=secret",
            ORIGIN + "/guest/catalog-final#fragment",
            "https://user@ab12cd34.guest-weddlysmartdesign.pages.dev/guest/catalog-final",
            "https://ab12cd34.guest-weddlysmartdesign.pages.dev:8443/guest/catalog-final",
        ):
            self.assertFalse(v.canonical_html_redirect(original, dest, ORIGIN), dest)

    def test_never_follow_a_second_redirect(self):
        guard = v.SafeCanonicalRedirect(ORIGIN)
        guard.count = 1
        req = urllib.request.Request(ORIGIN + "/guest/catalog-final.html")
        with self.assertRaises(v.VerificationError):
            guard.redirect_request(req, None, 301, "Moved", {}, ORIGIN + "/guest/catalog-final")

    def test_only_exact_guest_preview_origin(self):
        self.assertEqual(v.validate_origin(ORIGIN), ORIGIN)
        for value in (
            "https://guest-weddlysmartdesign.pages.dev",
            "https://evil.pages.dev",
            "http://ab12cd34.guest-weddlysmartdesign.pages.dev",
            "https://other.guest-weddlysmartdesign.pages.dev.evil.com",
            ORIGIN + "/anywhere",
            ORIGIN + "?p=secret",
            ORIGIN + "#key",
        ):
            with self.assertRaises(v.VerificationError):
                v.validate_origin(value)

    def test_non_approved_manifest(self):
        for patch in (
            {"status": "PRODUCTION"},
            {"commercialApproved": True},
            {"productionPromotionForbidden": False},
        ):
            data = copy.deepcopy(self.manifest)
            data.update(patch)
            with self.assertRaises(v.VerificationError):
                v.validate_manifest(data)

    def test_old_limoneros_never_commercial(self):
        data = copy.deepcopy(self.manifest)
        old = next(x for x in data["designs"] if x["templateId"] == "design-03")
        old["status"] = "commercially-frozen"
        with self.assertRaises(v.VerificationError):
            v.validate_manifest(data)

    def test_cannot_add_or_remove_a_design(self):
        data = copy.deepcopy(self.manifest)
        data["designs"][2]["templateId"] = "design-99"
        with self.assertRaises(v.VerificationError):
            v.validate_manifest(data)

    def test_no_path_escape_or_unpinned_resources(self):
        for name in ("../secrets", "/absolute", "guest/../../other", "guest\\evil", "guest/file?token=abc"):
            data = copy.deepcopy(self.manifest)
            data["files"][0]["name"] = name
            with self.assertRaises(v.VerificationError):
                v.validate_manifest(data)

if __name__ == "__main__":
    unittest.main(verbosity=2)
