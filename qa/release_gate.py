#!/usr/bin/env python3
"""Static release gate for Weddly Smart Design.

This gate intentionally fails on known release blockers. It distinguishes the
commercial runtime from archived/preview files so legacy repository debris is
reported without obscuring release-critical failures.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
FAILURES: list[str] = []
WARNINGS: list[str] = []


def fail(code: str, msg: str) -> None:
    FAILURES.append(f"{code}: {msg}")


def warn(code: str, msg: str) -> None:
    WARNINGS.append(f"{code}: {msg}")


def text(path: str) -> str:
    p = ROOT / path
    if not p.exists():
        fail("PKG-001", f"required file missing: {path}")
        return ""
    return p.read_text(encoding="utf-8")


REQUIRED = [
    "app.html", "payments.html", "guests.html", "guests-v116-production.html",
    "guests-v114-integrated.html", "guests-production-sync.js",
    "guests-plusone-placeholder-link-v1.js", "guests-seating-sync-hotfix-v1.js",
    "planning.html", "planning-v2.js", "weddly-settings.html", "sw.js",
    "manifest-suite.webmanifest", "access.html", "guests-rsvp-v105.html",
    "guests-rsvp-public-clean.html", "guests-rsvp-operations-live.html",
    "guests-rsvp-operations-v3.html", "guests-rsvp-plusone-public-v1.js",
    "guests-rsvp-plusone-ops-v1.js",
]
for item in REQUIRED:
    if not (ROOT / item).exists():
        fail("PKG-001", f"required production file missing: {item}")


# JSON / webmanifest syntax across the repository.
for p in ROOT.rglob("*"):
    if any(part == ".git" for part in p.parts) or not p.is_file():
        continue
    if p.suffix not in {".json", ".webmanifest"}:
        continue
    try:
        json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        fail("PKG-JSON", f"invalid JSON {p.relative_to(ROOT)}: {exc}")


PRODUCTION_JS = {
    "guests-access-layer.js", "guests-production-sync.js",
    "guests-plusone-placeholder-link-v1.js", "guests-production-ui.js",
    "guests-production-ops.js", "guests-home-rsvp-status-v1.js",
    "guests-smart-actions-v1.js", "guests-mobile-compat-hotfix-v1.js",
    "guests-import-audit-v1.js", "guests-service-visibility-v1.js",
    "guests-people-manager-v1.js", "guests-people-polish-v1.js",
    "guests-rsvp-clarity-v1.js", "guests-rsvp-plusone-core-label-v1.js",
    "guests-seating-v2.js", "guests-seating-sync-hotfix-v1.js",
    "planning-v2.js", "planning-calendar-bridge.js", "planning-wedding-events-v1.js",
    "planning-ui-hotfix-v1.js", "owner-demo-install-host-v1.js", "demo-sw.js", "sw.js",
    "guests-rsvp-operations-polish-v1.js", "guests-rsvp-segments-v1.js",
    "guests-rsvp-operations-feedback-v1.js", "guests-rsvp-share-primary-v1.js",
    "guests-rsvp-share-composer-v1.js", "guests-rsvp-operations-clarity-v1.js",
    "guests-rsvp-operations-flow-v1.js", "guests-rsvp-custom-answers-v1.js",
    "guests-rsvp-children-answers-v1.js", "guests-rsvp-plusone-ops-v1.js",
    "guests-rsvp-manual-parity-v1.js", "guests-rsvp-children-public-v1.js",
    "guests-rsvp-plusone-public-v1.js", "guests-rsvp-main-meal-pending-hotfix-v1.js",
    "guests-rsvp-essential-readability-v1.js",
}
PRODUCTION_HTML = {
    "app.html", "payments.html", "guests.html", "guests-v116-production.html",
    "guests-v114-integrated.html", "planning.html", "weddly-settings.html", "access.html",
    "guests-rsvp-v105.html", "guests-rsvp-design-live.html", "guests-rsvp-public-clean.html",
    "guests-rsvp-essential-live.html", "guests-rsvp-essential-01.html",
    "guests-rsvp-essential-02.html", "guests-rsvp-essential-03.html",
    "guests-rsvp-essential-04.html", "guests-rsvp-essential-05.html",
    "guests-rsvp-essential-06.html", "guests-rsvp-v115-wedding-flex-live.html",
    "guests-rsvp-v112-wedding-flex.html", "guests-rsvp-v116-single-live.html",
    "guests-rsvp-v114-single-flex.html", "guests-rsvp-operations-v2.html",
    "guests-rsvp-operations-live.html", "guests-rsvp-operations-v3.html",
    "owner-demo-shell.html", "demo/es/full/index.html", "demo/en/full/index.html",
}


def node_check(code: str, label: str, critical: bool) -> None:
    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as f:
        f.write(code)
        name = f.name
    try:
        r = subprocess.run(["node", "--check", name], capture_output=True, text=True)
    except FileNotFoundError:
        warn("JS-000", "node is unavailable; JS syntax checks skipped")
        return
    finally:
        try:
            Path(name).unlink(missing_ok=True)
        except Exception:
            pass
    if r.returncode:
        message = f"{label}: {r.stderr.strip()}"
        if critical:
            fail("JS-SYNTAX-PROD", message)
        else:
            warn("JS-SYNTAX-LEGACY", message)


# Every JS file is parsed; only production-reachable JS blocks a release.
for p in ROOT.rglob("*.js"):
    if ".git" in p.parts:
        continue
    rel = str(p.relative_to(ROOT))
    node_check(p.read_text(encoding="utf-8"), rel, rel in PRODUCTION_JS)

# Inline scripts are checked in the known production HTML graph. Other HTML is
# still scanned and reported as a repository-hygiene warning.
SCRIPT_RE = re.compile(r"<script(?P<attrs>[^>]*)>(?P<body>.*?)</script\s*>", re.I | re.S)
for p in ROOT.rglob("*.html"):
    if ".git" in p.parts:
        continue
    rel = str(p.relative_to(ROOT))
    src = p.read_text(encoding="utf-8")
    for i, m in enumerate(SCRIPT_RE.finditer(src), 1):
        attrs = m.group("attrs")
        if re.search(r"\bsrc\s*=", attrs, re.I):
            continue
        tm = re.search(r"\btype\s*=\s*['\"]([^'\"]+)", attrs, re.I)
        if tm and tm.group(1).lower() not in {"text/javascript", "application/javascript", "module"}:
            continue
        body = m.group("body").strip()
        if body:
            node_check(body, f"{rel} inline script #{i}", rel in PRODUCTION_HTML)


# Local src/href integrity for release entrypoints.
ENTRYPOINTS = [
    "app.html", "payments.html", "guests-v116-production.html", "planning.html",
    "guests-rsvp-v105.html", "guests-rsvp-public-clean.html", "owner-demo-shell.html",
]
REF_RE = re.compile(r"\b(?:src|href)\s*=\s*['\"]([^'\"]+)['\"]", re.I)
for rel in ENTRYPOINTS:
    p = ROOT / rel
    if not p.exists():
        continue
    for raw in REF_RE.findall(p.read_text(encoding="utf-8")):
        if raw.startswith(("http://", "https://", "data:", "blob:", "#", "mailto:", "tel:")):
            continue
        path = urlsplit(raw).path
        if not path or path == "/":
            continue
        target = (ROOT / path.lstrip("/")) if path.startswith("/") else (p.parent / path)
        if not target.resolve().is_relative_to(ROOT.resolve()):
            continue
        if not target.exists():
            fail("PKG-REF", f"{rel} references missing local asset: {raw}")


for p in ROOT.glob("zz-test*"):
    fail("HYGIENE-001", f"test residue present in production tree: {p.name}")


# Current Guests architectural blockers.
core = text("guests-v114-integrated.html")
render_match = re.search(r"function\s+render\s*\([^)]*\)\s*\{(?P<body>.{0,1200}?)\}", core, re.S)
if render_match and re.search(r"\bsave\s*\(", render_match.group("body")):
    fail("GUESTS-STATE-001", "Guests core render() still writes the whole in-memory state; stale snapshots can overwrite external mutations.")

plus_link = text("guests-plusone-placeholder-link-v1.js")
if "localStorage.setItem(KEY,JSON.stringify" in plus_link:
    fail("GUESTS-STATE-002", "plus-one placeholder layer independently writes the canonical Guests document while the core can remain loaded.")

sync = text("guests-production-sync.js")
if "CONFLICT_BACKUP" in sync and "localStorage.setItem(CONFLICT_BACKUP" in sync:
    fail("GUESTS-SYNC-001", "Guests conflict path still falls back to a hidden local backup instead of deterministic merge/recovery.")
if re.search(r"if\s*\(remote\?\.state\).*?writeRaw\(remote\.state\)", sync, re.S):
    fail("GUESTS-SYNC-002", "Guests startup can replace local state with server state without a durable dirty/freshness merge.")

settings = text("weddly-settings.html")
restore = re.search(r"async function restoreBackup\([^)]*\)\{(?P<body>.*?)\n?\}\n?\$\('back'\)", settings, re.S)
if restore:
    body = restore.group("body")
    if "localStorage.setItem(GKEY" not in body and "location.reload" not in body:
        fail("BACKUP-001", "backup restore updates remote Guests but does not synchronously replace/reload canonical local Guests state.")

# Confirm production RSVP operations really inject the +1 operations layer; if
# that layer has a syntax error the feature is silently absent at runtime.
rsvp_live = text("guests-rsvp-operations-live.html")
if "guests-rsvp-plusone-ops-v1.js" not in rsvp_live:
    fail("RSVP-OPS-001", "RSVP operations live wrapper no longer includes the +1 operations layer")

app = text("app.html")
if "setInterval(()=>{applyTheme();translate();watchIdentity();patchPayments();patchAux()},250)" in app:
    warn("SHELL-001", "suite shell still DOM-patches child modules every 250 ms; integration is brittle")

payments = text("payments.html")
if "functions/v1/weddly-app" in payments:
    warn("PAYMENTS-001", "Payments runtime is fetched dynamically from Supabase; GitHub SHA alone is not a reproducible release artifact.")
if "weddly_app_shell_v60" in payments:
    warn("PAYMENTS-002", "Payments has local cached-shell fallback; version/migration QA is mandatory")

sw = text("sw.js")
cache_match = re.search(r"const\s+C\s*=\s*['\"]([^'\"]+)", sw)
registrations: list[tuple[str, str]] = []
for rel in ["app.html", "owner-demo-shell.html"]:
    p = ROOT / rel
    if p.exists():
        for v in re.findall(r"serviceWorker\.register\(['\"]([^'\"]+)", p.read_text(encoding="utf-8")):
            registrations.append((rel, v))
if cache_match and registrations:
    warn("PWA-001", f"SW cache={cache_match.group(1)!r}; registrations={registrations!r}; verify release-version coherence")

plus_bridge = text("guests-rsvp-plusone-public-v1.js")
if "meal_required:mealOn?(meal?meal!=='Sin menú':null):null" not in plus_bridge:
    fail("RSVP-PLUS-001", "public +1 bridge no longer preserves unanswered meal as null")

print("\nWeddly Smart Design release gate")
print("=" * 38)
for item in WARNINGS:
    print("WARN", item)
for item in FAILURES:
    print("FAIL", item)
print(f"\nSummary: {len(FAILURES)} failure(s), {len(WARNINGS)} warning(s)")
if FAILURES:
    sys.exit(1)
