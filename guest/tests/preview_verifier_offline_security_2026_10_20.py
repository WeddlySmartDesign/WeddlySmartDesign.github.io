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
