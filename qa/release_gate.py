#!/usr/bin/env python3
"""Static release gate for Weddly Smart Design.

This gate intentionally fails on known release blockers. It is not a substitute
for real-device/browser QA; it prevents known architectural regressions and
basic packaging mistakes from being merged unnoticed.
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
    "app.html",
    "payments.html",
    "guests.html",
    "guests-v116-production.html",
    "guests-v114-integrated.html",
    "guests-production-sync.js",
    "guests-plusone-placeholder-link-v1.js",
    "guests-seating-sync-hotfix-v1.js",
    "planning.html",
    "planning-v2.js",
    "weddly-settings.html",
    "sw.js",
    "manifest-suite.webmanifest",
    "access.html",
    "guests-rsvp-v105.html",
    "guests-rsvp-public-clean.html",
    "guests-rsvp-plusone-public-v1.js",
]
for item in REQUIRED:
    if not (ROOT / item).exists():
        fail("PKG-001", f"required production file missing: {item}")


# JSON / webmanifest syntax.
for p in ROOT.rglob("*"):
    if any(part == ".git" for part in p.parts) or not p.is_file():
        continue
    if p.suffix not in {".json", ".webmanifest"}:
        continue
    try:
        json.loads(p.read_text(encoding="utf-8"))
    except Exception as exc:
        fail("PKG-JSON", f"invalid JSON {p.relative_to(ROOT)}: {exc}")


# JavaScript syntax, including ordinary inline scripts in HTML.
def node_check(code: str, label: str) -> None:
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
        fail("JS-SYNTAX", f"{label}: {r.stderr.strip()}")


for p in ROOT.rglob("*.js"):
    if ".git" in p.parts:
        continue
    node_check(p.read_text(encoding="utf-8"), str(p.relative_to(ROOT)))

SCRIPT_RE = re.compile(r"<script(?P<attrs>[^>]*)>(?P<body>.*?)</script\s*>", re.I | re.S)
for p in ROOT.rglob("*.html"):
    if ".git" in p.parts:
        continue
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
            node_check(body, f"{p.relative_to(ROOT)} inline script #{i}")


# Local src/href integrity for release entrypoints.
ENTRYPOINTS = [
    "app.html",
    "payments.html",
    "guests-v116-production.html",
    "planning.html",
    "guests-rsvp-v105.html",
    "guests-rsvp-public-clean.html",
    "owner-demo-shell.html",
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


# Production residue.
for p in ROOT.glob("zz-test*"):
    fail("HYGIENE-001", f"test residue present in production tree: {p.name}")


# Current Guests architectural blockers.
core = text("guests-v114-integrated.html")
render_match = re.search(r"function\s+render\s*\([^)]*\)\s*\{(?P<body>.{0,1200}?)\}", core, re.S)
if render_match and re.search(r"\bsave\s*\(", render_match.group("body")):
    fail(
        "GUESTS-STATE-001",
        "Guests core render() still writes the whole in-memory state; stale snapshots can overwrite external mutations.",
    )

plus_link = text("guests-plusone-placeholder-link-v1.js")
if "localStorage.setItem(KEY,JSON.stringify" in plus_link:
    fail(
        "GUESTS-STATE-002",
        "plus-one placeholder layer independently writes the canonical Guests document while the core can remain loaded.",
    )

sync = text("guests-production-sync.js")
if "CONFLICT_BACKUP" in sync and "localStorage.setItem(CONFLICT_BACKUP" in sync:
    fail(
        "GUESTS-SYNC-001",
        "Guests conflict path still falls back to a hidden local backup instead of deterministic merge/recovery.",
    )
# Detect the present startup pattern: server state is written directly to canonical local state.
if re.search(r"if\s*\(remote\?\.state\).*?writeRaw\(remote\.state\)", sync, re.S):
    fail(
        "GUESTS-SYNC-002",
        "Guests startup can replace local state with server state without a durable dirty/freshness merge.",
    )

settings = text("weddly-settings.html")
restore = re.search(r"async function restoreBackup\([^)]*\)\{(?P<body>.*?)\n?\}\n?\$\('back'\)", settings, re.S)
if restore:
    body = restore.group("body")
    if "localStorage.setItem(GKEY" not in body and "location.reload" not in body:
        fail(
            "BACKUP-001",
            "backup restore updates remote Guests but does not synchronously replace/reload canonical local Guests state.",
        )

app = text("app.html")
if "setInterval(()=>{applyTheme();translate();watchIdentity();patchPayments();patchAux()},250)" in app:
    warn("SHELL-001", "suite shell still DOM-patches child modules every 250 ms; integration is brittle")

payments = text("payments.html")
if "functions/v1/weddly-app" in payments:
    warn(
        "PAYMENTS-001",
        "Payments runtime is fetched dynamically from Supabase; GitHub SHA alone is not a reproducible release artifact.",
    )
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

# Public +1 bridge invariant: selected meal must remain nullable.
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
