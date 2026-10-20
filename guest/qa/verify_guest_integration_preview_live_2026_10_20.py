#!/usr/bin/env python3
"""Read-only Cloudflare Pages verification for isolated GUEST management preview.

Requires no cookies, authentication, secrets, purchase/session tokens or writes.
This verifies static publishing and enforced CSP only, NEVER authenticates a user,
certifies backend/checkout/email/RSVP, or authorizes commercial activation.
"""
import hashlib
import json
import re
import urllib.error
import urllib.parse
import urllib.request

ORIGIN = "https://f1b97db0.guest-weddlysmartdesign.pages.dev"
PREVIEW_PREFIX = re.compile(r"https://[a-z0-9-]+\.guest-weddlysmartdesign\.pages\.dev\Z")

class Rejected(Exception):
    pass

class OnlySamePreview(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if code not in (301, 302, 307, 308):
            raise Rejected("Unexpected HTTP redirect code")
        before = urllib.parse.urlsplit(req.full_url)
        after = urllib.parse.urlsplit(newurl)
        if (after.scheme != "https" or after.netloc != before.netloc
                or after.query or after.fragment or after.username or after.password):
            raise Rejected("Cross-domain redirect refused")
        a, b = before.path, after.path
        if not ((a.endswith(".html") and b == a[:-5]) or
                (a.endswith("/index.html") and b == a[:-10])):
            raise Rejected("Non-canonical redirect refused")
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def fetch(path, limit=256_000, method="GET"):
    assert PREVIEW_PREFIX.fullmatch(ORIGIN), "Must never point to production"
    url = ORIGIN + "/" + path.lstrip("/")
    req = urllib.request.Request(
        url, method=method,
        headers={"User-Agent": "GUEST-Integration-Preview-ReadOnly/1.0", "Accept-Encoding": "identity"}
    )
    try:
        with urllib.request.build_opener(OnlySamePreview()).open(req, timeout=30) as r:
            body = b"" if method == "HEAD" else r.read(limit + 1)
            if len(body) > limit:
                raise Rejected("Oversized response: " + path)
            return r.status, r.headers, body
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return 404, exc.headers, b""
        raise

def enforce_headers(headers, path):
    robot = {x.strip().lower() for x in headers.get("X-Robots-Tag", "").split(",")}
    if "noindex" not in robot:
        raise Rejected("Missing effective robots protection: " + path)
    csp = headers.get("Content-Security-Policy", "")
    for rule in ("connect-src 'none'", "form-action 'none'", "frame-src 'none'",
                 "worker-src 'none'", "object-src 'none'"):
        if rule not in csp:
            raise Rejected("Missing CSP security policy " + rule + " on " + path)
    return True

def check():
    checks = []
    for page in ("", "guest.html", "guest-checkout.html", "guest-checkout-return.html",
                 "guest-order.html", "guest/access.html", "guest/guests-rsvp-operations-live.html"):
        status, headers, body = fetch(page, method="HEAD")
        if status != 200:
            raise Rejected("Missing static page: " + page)
        enforce_headers(headers, page)
        checks.append(page or "/")
    status, headers, root = fetch("")
    enforce_headers(headers, "/")
    if b"GUEST" not in root or b"sin datos ni cobros" not in root:
        raise Rejected("Preview landing page differs from safe GUEST integration build")
    status, headers, store = fetch("guest.html")
    enforce_headers(headers, "guest.html")
    if (store.count(b'class="design-card individual"') != 15
            or "Próxima apertura".encode() not in store
            or b'GUEST Signature' in store):
        raise Rejected("Incorrect commercial catalogue or accidental sale")
    status, headers, manifest_bytes = fetch("GUEST_INTEGRATION_STAGE_MANIFEST.json", 1_200_000)
    enforce_headers(headers, "manifest")
    manifest = json.loads(manifest_bytes)
    if (manifest.get("status") != "PREVIEW_NO_REMOTE_DATA_NO_SALE"
            or manifest.get("commercialApproved") is not False
            or manifest.get("physicalDesignsExcluded") is not True
            or manifest.get("externalAPIsBlockedViaCSP") is not True):
        raise Rejected("Deployment's own no-sale safeguards not present")
    files = manifest.get("files", [])
    if not isinstance(files, list) or len(files) < 120:
        raise Rejected("Guest runtime asset inventory incomplete")
    names = {e.get("file") for e in files}
    if len(names) != len(files):
        raise Rejected("Duplicate file paths")
    for forbidden in (
            "guest/GUEST_PROJECT_STATUS_V1.json",
            "guest/GUEST_CATALOG_CERT_SCENARIO_STRESS_V1.json",
            "guest/SOURCE_LOCK.json",
            "guest/GUEST_MOBILE_CENTER_CURRENT.json",
            "guest/catalog-assets/botanica/14.7/index.html"):
        if forbidden in names:
            raise Rejected("Internal confidential/staging document included: " + forbidden)
        code, h, b = fetch(forbidden, 150_000)
        if code == 200 and h.get("Content-Type", "").lower().startswith("application/json"):
            raise Rejected("Internal file exposed over HTTP: " + forbidden)
    # Check representative file checksums, not E2E.
    for name in ("guest.html", "guest-checkout.html",
                 "guest/access.html", "guest/guests-catalog-invitation-bridge-v1.js",
                 "guest/guests-rsvp-share-composer-v3.js"):
        item = next((x for x in files if x.get("file") == name), None)
        if not item:
            raise Rejected("Missing GUEST UI resource in manifest: " + name)
        code, h, body = fetch(name, max(2_000_000, item["bytes"] + 1))
        enforce_headers(h, name)
        if code != 200 or len(body) != item["bytes"] or hashlib.sha256(body).hexdigest() != item["sha256"]:
            raise Rejected("GUEST UI resource SHA mismatch: " + name)
    print(json.dumps({
        "status": "PASS", "origin": ORIGIN,
        "publicPagesWithNoindexAndCSP": len(checks),
        "manifestAssets": len(files),
        "sampleResourceSHA256Passed": 5,
        "internalProjectStatusNotPublished": True,
        "paymentAndBackendNetwork": "BLOCKED_BY_CSP",
        "production": "UNMODIFIED",
        "sales": "NO_GO",
        "limits": "Static HTTPS/security only; no real account, payment, email, mobile phone or RSVP certification"
    }, ensure_ascii=False))

if __name__ == "__main__":
    try:
        check()
    except (Rejected, AssertionError, ValueError, KeyError, OSError) as exc:
        print("GUEST_INTEGRATION_PREVIEW_FAIL:", type(exc).__name__, str(exc)[:240])
        raise SystemExit(1)
