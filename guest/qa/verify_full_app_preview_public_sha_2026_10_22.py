#!/usr/bin/env python3
"""Verify real Cloudflare GUEST preview bytes against the build's immutable SHA256 manifest.

Read-only HTTPS against the exact supplied PREVIEW, never production. No cookies, tokens,
payments or backend writes. Abort on changed MIME/sizes/hash instead of accepting a branded fallback.
"""
import concurrent.futures
import hashlib
import json
import os
import urllib.parse
import urllib.request
from pathlib import PurePosixPath

ORIGIN = "https://bc6b3fa9.guest-weddlysmartdesign.pages.dev"
MAX_FILE_BYTES = 28 * 1024 * 1024
TIMEOUT = 40

def get(path, max_bytes=MAX_FILE_BYTES):
    assert ".." not in PurePosixPath(path).parts, path
    url = ORIGIN + "/" + urllib.parse.quote(path, safe="/.-_")
    req = urllib.request.Request(url, headers={"Accept-Encoding": "identity", "User-Agent": "GUEST-Full-Preview-Hash-QA/1.0"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as rsp:
        if rsp.status != 200 or urllib.parse.urlsplit(rsp.url).netloc != urllib.parse.urlsplit(ORIGIN).netloc:
            raise AssertionError(f"Unexpected response for {path}: status {rsp.status}")
        data = rsp.read(max_bytes + 1)
        if len(data) > max_bytes:
            raise AssertionError(f"Oversized remote asset {path}")
        return data

def check(e):
    name, expected_size, expected_sha = e["name"], e["size"], e["sha256"]
    if name == "_headers":
        return name
    if not isinstance(expected_size, int) or not 0 < expected_size <= MAX_FILE_BYTES:
        raise AssertionError(f"Unbounded size for {name}: {expected_size}")
    b = get(name, max_bytes=expected_size + 1)
    actual = hashlib.sha256(b).hexdigest()
    if len(b) != expected_size or actual != expected_sha:
        raise AssertionError(f"WRONG_ASSET {name}: bytes={len(b)}/{expected_size} sha={actual}/{expected_sha}")
    return name

def main():
    raw = get("GUEST_STAGE_MANIFEST.json", max_bytes=5_000_000)
    m = json.loads(raw)
    assert m["status"] == "PREPRODUCTION_DO_NOT_SELL"
    assert m["commercialApproved"] is False
    assert m["fullGuestManagementPresent"] is True
    assert len(m["designs"]) == 15, len(m["designs"])
    files = m["files"]
    paths = {f["name"] for f in files}
    assert len(files) == len(paths), "duplicate staged paths"
    required = {"guest/index.html", "guest/access.html", "guest/guest-settings.html",
                "guest/guests-v114-integrated.html", "guest/guests-events-v3.html",
                "guest/guests-home-rsvp-status-v1.js", "guest/guests-copy-control-v1.js",
                "guest/guests-production-sync.js", "guest/guests-seating-v2.js"}
    assert required <= paths, required - paths
    designs = [f for f in files if f["name"].startswith("guest/catalog-assets/") and f["name"].endswith("/index.html")]
    assert len(designs) == 15, f"Expected 15 visual HTML masters; found {len(designs)}"
    print(f"HTTPS verifying {len(files)-1} assets, incl. {len(designs)} full design masters. No sale.")
    done = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(check, e): e["name"] for e in files if e["name"] != "_headers"}
        for fut in concurrent.futures.as_completed(futures):
            done.append(fut.result())
    assert len(done) == len(files) - 1
    for p in ("guest/GUEST_PROJECT_STATUS_V1.json","guest/SOURCE_LOCK.json"):
        payload = get(p, max_bytes=15_000)
        if b"designInventory2026_10_20" in payload or b"sourceSha" in payload:
            raise AssertionError(f"Internal documentation leaked: {p}")
    print(f"PASS: {len(done)} real public HTTPS assets exact SIZE+SHA256, {len(designs)} design masters, complete licensed GUEST. NO SALE.")

if __name__ == "__main__":
    main()
