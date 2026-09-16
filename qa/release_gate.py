#!/usr/bin/env python3
"""Static release gate for Weddly Smart Design.

The gate blocks production-reachable syntax/packaging defects and known data
integrity regressions. Legacy/preview debris is reported as warning unless it is
reachable from the commercial runtime.
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
    "guests-state-integrity-v1.js", "guests-plusone-placeholder-link-v1.js",
    "guests-seating-sync-hotfix-v1.js", "planning.html", "planning-v2.js",
    "weddly-settings.html", "sw.js", "manifest-suite.webmanifest", "access.html",
    "guests-rsvp-v105.html", "guests-rsvp-public-clean.html",
    "guests-rsvp-operations-live.html", "guests-rsvp-operations-v3.html",
    "guests-rsvp-plusone-public-v1.js", "guests-rsvp-plusone-ops-v1.js",
]
for item in REQUIRED:
    if not (ROOT / item).exists():
        fail("PKG-001", f"required production file missing: {item}")


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
    "guests-access-layer.js", "guests-production-sync.js", "guests-state-integrity-v1.js",
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
        (fail if critical else warn)("JS-SYNTAX-PROD" if critical else "JS-SYNTAX-LEGACY", message)


for p in ROOT.rglob("*.js"):
    if ".git" in p.parts:
        continue
    rel = str(p.relative_to(ROOT))
    node_check(p.read_text(encoding="utf-8"), rel, rel in PRODUCTION_JS)

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
        if target.resolve().is_relative_to(ROOT.resolve()) and not target.exists():
            fail("PKG-REF", f"{rel} references missing local asset: {raw}")


for p in ROOT.glob("zz-test*"):
    fail("HYGIENE-001", f"test residue present in production tree: {p.name}")


# Guests state integrity. The frozen core still emits whole-state writes, but the
# production wrapper must intercept them with a three-way rebase against the
# latest canonical state before they can reach localStorage.
core = text("guests-v114-integrated.html")
wrapper = text("guests-v116-production.html")
integrity = text("guests-state-integrity-v1.js")
render_match = re.search(r"function\s+render\s*\([^)]*\)\s*\{(?P<body>.{0,1200}?)\}", core, re.S)
core_writes_on_render = bool(render_match and re.search(r"\bsave\s*\(", render_match.group("body")))
if core_writes_on_render:
    required_integrity = [
        "guests-state-integrity-v1.js" in wrapper,
        "function merge3(" in integrity,
        "P.setItem=function" in integrity,
        "coreBase=structuredClone(candidate)" in integrity,
        "latest=parse(nativeGet.call(ls,KEY))" in integrity,
    ]
    if not all(required_integrity):
        fail("GUESTS-STATE-001", "frozen Guests core writes whole snapshots without an active three-way rebase guard")

plus_link = text("guests-plusone-placeholder-link-v1.js")
if "wsd-safe-patch-write-v1" not in plus_link or "persistLatest(" not in plus_link:
    fail("GUESTS-STATE-002", "plus-one placeholder linking is not constrained to patching the latest canonical Guests state")

sync = text("guests-production-sync.js")
for needle, code, msg in [
    ("weddly_guests_sync_meta_v2", "GUESTS-SYNC-001", "durable dirty/base sync metadata is missing"),
    ("function merge3(", "GUESTS-SYNC-002", "three-way merge is missing from Guests synchronization"),
    ("function markDirty(", "GUESTS-SYNC-003", "local Guests edits are not durably marked dirty"),
    ("async function reconcileDirty(", "GUESTS-SYNC-004", "startup dirty-state reconciliation is missing"),
    ("a.r.status===409", "GUESTS-SYNC-005", "409 conflict handling is missing"),
]:
    if needle not in sync:
        fail(code, msg)
if "weddly_guests_conflict_backup" in sync:
    fail("GUESTS-SYNC-006", "legacy conflict path can still replace one device with a hidden backup instead of merging")

# Backup restore may write Guests remotely while an old Guests iframe is still
# open. This is safe only if the sync layer has durable base state and 409 merge
# semantics, so stale pre-restore data cannot overwrite the restored snapshot.
settings = text("weddly-settings.html")
restore = re.search(r"async function restoreBackup\([^)]*\)\{(?P<body>.*?)\n?\}\n?\$\('back'\)", settings, re.S)
if restore:
    body = restore.group("body")
    direct_local_refresh = "localStorage.setItem(GKEY" in body or "location.reload" in body
    merge_barrier = all(x in sync for x in ["weddly_guests_sync_meta_v2", "function merge3(", "a.r.status===409", "function reconcileDirty("])
    if not direct_local_refresh and not merge_barrier:
        fail("BACKUP-001", "backup restore can be overwritten by stale Guests state")

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
