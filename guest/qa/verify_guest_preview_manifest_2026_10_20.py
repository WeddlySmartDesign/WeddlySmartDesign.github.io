#!/usr/bin/env python3
"""Read-only verification of the sealed 16-renderer GUEST Cloudflare preview.

Uses no account credentials, cookies, payment APIs, order tokens, or writes.
Only a preview subdomain of the named GUEST Pages project is permitted.
"""
import argparse
import concurrent.futures
import hashlib
import json
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

PREVIEW_HOST = re.compile(r"[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.guest-weddlysmartdesign\.pages\.dev\Z")
EXPECTED_COUNT = 121
MAX_FILE_BYTES = 25 * 1024 * 1024

class VerificationError(Exception):
    pass

def canonical_html_redirect(original, destination, origin):
    """Allow ONLY the canonical HTML redirects documented for Cloudflare Pages."""
    src, dst = urllib.parse.urlsplit(original), urllib.parse.urlsplit(destination)
    base = urllib.parse.urlsplit(origin)
    if (src.scheme != "https" or dst.scheme != "https"
            or src.netloc != base.netloc or dst.netloc != base.netloc
            or src.username or dst.username or src.password or dst.password
            or src.query or dst.query or src.fragment or dst.fragment):
        return False
    if src.path.endswith("/index.html"):
        return dst.path == src.path[:-10]
    if src.path.endswith(".html"):
        return dst.path == src.path[:-5]
    return False

class SafeCanonicalRedirect(urllib.request.HTTPRedirectHandler):
    def __init__(self, origin):
        self.origin = origin
        self.count = 0

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if (code not in (301, 302, 307, 308) or self.count != 0
                or not canonical_html_redirect(req.full_url, newurl, self.origin)):
            raise VerificationError("Unexpected or unsafe redirect: HTTP " + str(code))
        self.count += 1
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def validate_origin(value):
    u = urllib.parse.urlsplit(value)
    if (u.scheme != "https" or not u.hostname or not PREVIEW_HOST.fullmatch(u.hostname)
            or u.username or u.password or u.port not in (None, 443)
            or u.path not in ("", "/") or u.query or u.fragment):
        raise VerificationError("An HTTPS preview origin of guest-weddlysmartdesign is required; production is forbidden.")
    return u.scheme + "://" + u.netloc.lower()

def validate_manifest(m):
    if (m.get("status") != "PREPRODUCTION_DO_NOT_SELL"
            or m.get("commercialApproved") is not False
            or m.get("productionPromotionForbidden") is not True):
        raise VerificationError("Stage commercial guard mismatch")
    files = m.get("files")
    designs = m.get("designs")
    if not isinstance(files, list) or len(files) != EXPECTED_COUNT:
        raise VerificationError("Expected exactly 121 resources")
    if not isinstance(designs, list) or len(designs) != 16 or len({d.get("templateId") for d in designs}) != 16:
        raise VerificationError("Expected exactly 16 distinct technical renderer records")
    expected_ids = {"veil-light", "botanica"} | {f"design-{n:02d}" for n in range(3, 17)}
    if {d["templateId"] for d in designs} != expected_ids:
        raise VerificationError("Stage design inventory mismatch")
    if any(d.get("commercialApproved") is True for d in designs):
        raise VerificationError("Preview cannot contain a commercially approved design record")
    if any(d["templateId"] == "design-03" and d.get("status") == "commercially-frozen" for d in designs):
        raise VerificationError("Archived incorrect Limoneros cannot be admitted")
    names = set()
    for f in files:
        name, size, sha = f.get("name"), f.get("size"), f.get("sha256")
        if not isinstance(name, str) or not name or name in names:
            raise VerificationError("Missing or duplicate resource path")
        p = pathlib.PurePosixPath(name)
        if (p.is_absolute() or ".." in p.parts or str(p) != name or "\\" in name
                or any(ord(c) < 32 for c in name) or "?" in name or "#" in name or "%" in name):
            raise VerificationError("Unsafe resource path")
        if type(size) is not int or size < 0 or size > MAX_FILE_BYTES:
            raise VerificationError("Resource exceeds expected hosting limit")
        if not isinstance(sha, str) or not re.fullmatch(r"[0-9a-f]{64}", sha):
            raise VerificationError("Invalid SHA256")
        names.add(name)
    configuration = next((f for f in files if f["name"] == "_headers"), None)
    if (configuration is None or configuration["size"] != 176
            or configuration["sha256"] != "448bfd64d0358ce68ec27f4d7fdc2b4678b72a9de6d0b723d5ecc7affb0c23b3"):
        raise VerificationError("Immutable stage _headers source pin mismatch")
    return files

def public_http_assets(files):
    # Cloudflare Pages parses _headers; it does not serve it over HTTPS.
    return [f for f in files if f["name"] != "_headers"]

def fetch_file(origin, f):
    url = origin + "/" + urllib.parse.quote(f["name"], safe="/-._~")
    req = urllib.request.Request(url, headers={"User-Agent": "GUEST-Preview-Integrity/1.0", "Accept-Encoding": "identity"})
    try:
        with urllib.request.build_opener(SafeCanonicalRedirect(origin)).open(req, timeout=45) as response:
            if response.status != 200:
                raise VerificationError("HTTP " + str(response.status))
            directives = {v.strip().lower() for v in response.headers.get("X-Robots-Tag", "").split(",")}
            if "noindex" not in directives:
                raise VerificationError("Missing noindex response header")
            digest, count, collected = hashlib.sha256(), 0, []
            collect = f["name"] == "guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json"
            while True:
                b = response.read(1024 * 1024)
                if not b:
                    break
                count += len(b)
                if count > f["size"]:
                    raise VerificationError("Unexpected resource size")
                digest.update(b)
                if collect:
                    collected.append(b)
            if count != f["size"] or digest.hexdigest() != f["sha256"]:
                raise VerificationError("SHA256 or length mismatch")
            row = {"name": f["name"], "status": "PASS", "bytes": count, "sha256": digest.hexdigest()}
            return row, b"".join(collected) if collect else None
    except (OSError, urllib.error.HTTPError, VerificationError) as exc:
        # No response bodies, tokens or redirected URLs are printed.
        error = str(exc) if isinstance(exc, VerificationError) else type(exc).__name__
        return {"name": f["name"], "status": "FAIL", "error": error}, None

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", required=True)
    parser.add_argument("--manifest", required=True, type=pathlib.Path)
    parser.add_argument("--output", required=True, type=pathlib.Path)
    args = parser.parse_args()
    origin = validate_origin(args.origin)
    raw_manifest = args.manifest.read_bytes()
    manifest = json.loads(raw_manifest)
    files = validate_manifest(manifest)
    remote_manifest, _ = fetch_file(origin, {
        "name": "GUEST_STAGE_MANIFEST.json", "size": len(raw_manifest),
        "sha256": hashlib.sha256(raw_manifest).hexdigest()
    })
    if remote_manifest["status"] != "PASS":
        raise VerificationError("Remote stage manifest: " + remote_manifest.get("error", "mismatch"))
    rows, registry_raw = [], None
    http_files = public_http_assets(files)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for row, body in pool.map(lambda f: fetch_file(origin, f), http_files):
            rows.append(row)
            if body is not None:
                registry_raw = body
    renderer_result = "FAIL"
    if registry_raw is not None:
        registry = json.loads(registry_raw)
        templates = registry.get("templates", {})
        names = {f["name"] for f in files}
        designs = {d["templateId"]: d for d in manifest["designs"]}
        if (set(templates) == set(designs)
                and templates.get("design-03", {}).get("status") == "certification-pending"
                and all(v.get("mode") == "iframe"
                and v.get("version") == designs[design_id].get("version")
                and v.get("status") in ("commercially-frozen", "certification-pending")
                and v.get("id") == design_id
                and v.get("src") == "/guest/catalog-assets/" + design_id + "/" + str(v.get("version")) + "/index.html"
                and v["src"][1:] in names
                and v.get("applyApi") == ("BOTANICA_APPLY_CONFIG" if design_id == "botanica" else "GUEST_APPLY_CONFIG")
                for design_id, v in templates.items())):
            renderer_result = "PASS"
    ok = all(r["status"] == "PASS" for r in rows) and renderer_result == "PASS"
    report = {
        "status": "PASS" if ok else "FAIL", "previewOrigin": origin,
        "manifestSha256": hashlib.sha256(raw_manifest).hexdigest(), "stageManifest": remote_manifest,
        "resources": rows, "resourceCount": len(rows),
        "declaredManifestFileCount": len(files),
        "configurationNotHttpServed": ["_headers"],
        "headerPolicyEvidence": "X-Robots-Tag noindex checked on every downloaded static resource",
        "rendererRoutes": renderer_result,
        "commercialApproved": False, "sale": "NO_GO",
        "limits": "Integrity and noindex only. Does not certify visual rendering, anonymous order access, Stripe, emails, delivery, RSVP or physical phones."
    }
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"status": report["status"], "resourcesPassedHTTP": sum(r["status"] == "PASS" for r in rows), "publicResourcesTotal": len(rows), "manifestFiles": len(files), "configurationFiles": 1, "rendererRoutes": renderer_result, "sale": "NO_GO"}))
    return 0 if ok else 1

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (VerificationError, ValueError, KeyError, OSError) as exc:
        print("Preview verification refused: " + str(exc), file=sys.stderr)
        raise SystemExit(2)
