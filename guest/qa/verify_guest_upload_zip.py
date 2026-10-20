#!/usr/bin/env python3
"""Fail-closed local GUEST PREVIEW ZIP verification. No network, credentials or writes to hosting.
Run: python3 guest/qa/verify_guest_upload_zip.py --zip /path/GUEST_PREPRODUCTION_16_VERIFICADO.zip --manifest guest/qa-reports/preview16_recovered_manifest_2026-10-20.json --report /tmp/guest-upload-integrity.json
Use --fixture-only when no 214 MiB private ZIP is available (CI). NEVER authorize commercial release.
"""
import argparse
import hashlib
import json
import pathlib
import sys
import zipfile

ARCHIVES = {
    "e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216": "original-phase5",
    "0fd69d40d5ee85862a71ba7eb34bba188563d79f9b2d0a0022524dbb6009a1bb": "normalized-phase6",
}
MANIFEST_PIN = {
    "ba0e5928a601b42df93c62e0315ceb3b6b23bd4b9bf49b44527e89da7349b05c",
    "4b8c39645af44a63577f5dfa0cafc4583c2036b8a12db8af14b5871684fccaad",
}
ALL_IDS = {"veil-light", "botanica"} | {f"design-{n:02d}" for n in range(3, 17)}
MAX_BYTES = 25 * 1024 * 1024
HEADERS_SHA = "448bfd64d0358ce68ec27f4d7fdc2b4678b72a9de6d0b723d5ecc7affb0c23b3"

class Rejected(Exception):
    pass

def digest_bytes(b):
    return hashlib.sha256(b).hexdigest()

def digest_file(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for part in iter(lambda: f.read(1024 * 1024), b""):
            h.update(part)
    return h.hexdigest()

def verify_manifest(m):
    if (m.get("status") != "PREPRODUCTION_DO_NOT_SELL"
            or m.get("commercialApproved") is not False
            or m.get("productionPromotionForbidden") is not True):
        raise Rejected("Stage is not locked NO_SALE")
    entries = m.get("files")
    designs = m.get("designs")
    if not isinstance(entries, list) or len(entries) != 121:
        raise Rejected("Expected exactly 121 file entries")
    if not isinstance(designs, list) or len(designs) != 16:
        raise Rejected("Expected 16 technical renderers")
    ids = {x.get("templateId") for x in designs}
    if ids != ALL_IDS or len(ids) != 16:
        raise Rejected("Unexpected design roster")
    if next(x for x in designs if x["templateId"] == "design-03").get("status") != "certification-pending":
        raise Rejected("Wrong Limoneros has been approved")
    found = set()
    for x in entries:
        name, n, digest = x.get("name"), x.get("size"), x.get("sha256")
        if (not isinstance(name, str) or name in found or name.startswith("/")
                or name != str(pathlib.PurePosixPath(name)) or ".." in name.split("/")
                or "\\" in name or "%" in name or "?" in name or "#" in name
                or not isinstance(n, int) or isinstance(n, bool) or n < 0 or n > MAX_BYTES
                or not isinstance(digest, str) or len(digest) != 64
                or any(c not in "0123456789abcdef" for c in digest)):
            raise Rejected("Invalid file name/size/hash in stage manifest")
        found.add(name)
    headers = next((x for x in entries if x["name"] == "_headers"), None)
    if not headers or headers["size"] != 176 or headers["sha256"] != HEADERS_SHA:
        raise Rejected("Cloudflare noindex configuration not pinned")
    for d in designs:
        name = "guest/catalog-assets/{}/{}/index.html".format(d["templateId"], d["version"])
        if name not in found:
            raise Rejected("Missing preview master: " + d["templateId"])
    return {x["name"]: x for x in entries}

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--zip", type=pathlib.Path)
    p.add_argument("--manifest", required=True, type=pathlib.Path)
    p.add_argument("--report", type=pathlib.Path)
    p.add_argument("--fixture-only", action="store_true")
    args = p.parse_args()
    canonical = json.loads(args.manifest.read_text())
    expected = verify_manifest(canonical)
    if args.fixture_only:
        print("PASS: canonical fixture, 121 resources, 16 renderers and no-sale guards")
        return
    if args.zip is None:
        raise Rejected("--zip required unless --fixture-only")
    archive_digest = digest_file(args.zip)
    if archive_digest not in ARCHIVES:
        raise Rejected("Archive SHA256 not on the verified owner source list")
    with zipfile.ZipFile(args.zip) as z:
        names = z.namelist()
        if len(names) != 122 or len(set(names)) != len(names) or set(names) != set(expected) | {"GUEST_STAGE_MANIFEST.json"}:
            raise Rejected("ZIP has missing, extra or duplicate files")
        embedded_bytes = z.read("GUEST_STAGE_MANIFEST.json")
        if digest_bytes(embedded_bytes) not in MANIFEST_PIN:
            raise Rejected("Embedded manifest SHA256 not in approved source list")
        embedded = verify_manifest(json.loads(embedded_bytes))
        if embedded != expected:
            raise Rejected("Embedded file SHA256/size index differs from GitHub's 121-file reference")
        for name, meta in embedded.items():
            info = z.getinfo(name)
            if info.file_size != meta["size"] or info.is_dir():
                raise Rejected("ZIP length changed: " + name)
            h, size = hashlib.sha256(), 0
            with z.open(info) as stream:
                while True:
                    chunk = stream.read(1024 * 1024)
                    if not chunk:
                        break
                    size += len(chunk)
                    if size > meta["size"]:
                        raise Rejected("Unexpected decompressed file length: " + name)
                    h.update(chunk)
            if size != meta["size"] or h.hexdigest() != meta["sha256"]:
                raise Rejected("ZIP content SHA256/CRC mismatch: " + name)
        registry = json.loads(z.read("guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json"))
        templates = registry.get("templates", {})
        if set(templates) != ALL_IDS:
            raise Rejected("Renderer registry diverges from design roster")
        for d in embedded["guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json"],:
            pass  # Its checksum was verified above; now prove 16 explicit route bindings.
        for id, render in templates.items():
            expected_src = "/guest/catalog-assets/{}/{}/index.html".format(id, render.get("version"))
            if (render.get("id") != id or render.get("mode") != "iframe"
                    or render.get("src") != expected_src
                    or expected_src[1:] not in expected
                    or render.get("applyApi") != ("BOTANICA_APPLY_CONFIG" if id == "botanica" else "GUEST_APPLY_CONFIG")
                    or (id == "design-03" and render.get("status") != "certification-pending")):
                raise Rejected("Renderer path or adaptation invalid: " + id)
        landing = z.read("index.html").lower()
        if b"stripe.com" in landing or b"checkout" in landing or b"noindex" not in landing:
            raise Rejected("Staging landing unexpectedly enables checkout or indexing")
    result = {"status": "PASS", "archiveSha256": archive_digest,
              "archiveVariant": ARCHIVES[archive_digest],
              "resourceHashes": "121/121 PASS", "renderers": "16/16 PASS",
              "physicalEntries": 122, "sale": "NO_GO",
              "meaning": "Local artifact integrity only; NOT Cloudflare, payment or invitation E2E"}
    if args.report:
        args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n")
    print(json.dumps(result))

if __name__ == "__main__":
    try:
        main()
    except (Rejected, zipfile.BadZipFile, OSError, ValueError, KeyError) as exc:
        print("GUEST_ZIP_REFUSED:", str(exc), file=sys.stderr)
        raise SystemExit(1)
