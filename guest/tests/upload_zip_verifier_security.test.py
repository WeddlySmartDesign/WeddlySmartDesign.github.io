#!/usr/bin/env python3
"""Offline regression for the owner Library preproduction package gate."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[2]
path=ROOT/"guest/qa/verify_guest_upload_zip.py"
spec=importlib.util.spec_from_file_location("guest_upload_package",path)
v=importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)
source=json.loads((ROOT/"guest/qa-reports/preview16_recovered_manifest_2026-10-20.json").read_text())

class TestUploadPackage(unittest.TestCase):
    def test_canonical_fixture_pass(self):
        f=v.verify_manifest(source)
        self.assertEqual(len(f),121)
        self.assertIn("guest/catalog-assets/veil-light/5.3.3/index.html",f)

    def test_no_go_cannot_be_bypassed(self):
        for patch in ({"status":"GO"},{"commercialApproved":True},{"productionPromotionForbidden":False}):
            tampered=copy.deepcopy(source)
            tampered.update(patch)
            with self.assertRaises(v.Rejected):v.verify_manifest(tampered)

    def test_retired_wrong_limoneros_rejected(self):
        tampered=copy.deepcopy(source)
        next(d for d in tampered["designs"] if d["templateId"]=="design-03")["status"]="commercially-frozen"
        with self.assertRaises(v.Rejected):v.verify_manifest(tampered)

    def test_extra_design_rejected(self):
        tampered=copy.deepcopy(source)
        tampered["designs"][0]["templateId"]="guest-unknown"
        with self.assertRaises(v.Rejected):v.verify_manifest(tampered)

    def test_header_pin_rejected_on_change(self):
        tampered=copy.deepcopy(source)
        next(f for f in tampered["files"] if f["name"]=="_headers")["sha256"]="0"*64
        with self.assertRaises(v.Rejected):v.verify_manifest(tampered)

    def test_zip_slip_rejected(self):
        for name in ("../escape","guest/../../secret","/absolute","guest\\secret","test%2fsecret","test?token=1"):
            tampered=copy.deepcopy(source)
            tampered["files"][0]["name"]=name
            with self.assertRaises(v.Rejected):v.verify_manifest(tampered)

if __name__=="__main__":
    unittest.main(verbosity=2)
