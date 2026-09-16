#!/usr/bin/env python3
"""Zero-warning release gate for Weddly Smart Design.

A release candidate passes only when the repository is syntactically clean,
production packaging is internally consistent, Guests data-integrity guards are
present, Payments is pinned to a recorded Supabase runtime, and the root PWA
release is coherent. Real-device QA remains a separate mandatory gate.
"""
from __future__ import annotations
import json,re,subprocess,sys,tempfile
from pathlib import Path
from urllib.parse import urlsplit,urlparse,parse_qs
ROOT=Path(__file__).resolve().parents[1]
FAILURES=[]

def fail(code,msg): FAILURES.append(f"{code}: {msg}")
def text(path):
    p=ROOT/path
    if not p.exists(): fail('PKG-001',f'required file missing: {path}'); return ''
    return p.read_text(encoding='utf-8')

REQUIRED=['app.html','payments.html','payments-owner-demo-v1.js','guests.html','guests-v116-production.html','guests-v114-integrated.html','guests-production-sync.js','guests-state-integrity-v1.js','guests-plusone-placeholder-link-v1.js','guests-seating-sync-hotfix-v1.js','planning.html','planning-v2.js','weddly-settings.html','suite-install-hotfix-v1.js','sw.js','manifest-suite.webmanifest','access.html','guests-rsvp-v105.html','guests-rsvp-public-clean.html','guests-rsvp-operations-live.html','guests-rsvp-operations-v3.html','guests-rsvp-plusone-public-v1.js','guests-rsvp-plusone-ops-v1.js','release/runtime-manifest.json']
for item in REQUIRED:
    if not (ROOT/item).exists(): fail('PKG-001',f'required production file missing: {item}')

for p in ROOT.rglob('*'):
    if '.git' in p.parts or not p.is_file() or p.suffix not in {'.json','.webmanifest'}: continue
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as exc: fail('PKG-JSON',f'invalid JSON {p.relative_to(ROOT)}: {exc}')

def node_check(code,label):
    with tempfile.NamedTemporaryFile('w',suffix='.js',encoding='utf-8',delete=False) as f: f.write(code); name=f.name
    try:
        try: r=subprocess.run(['node','--check',name],capture_output=True,text=True)
        except FileNotFoundError: fail('JS-000','node is unavailable; syntax gate cannot run'); return
    finally:
        try: Path(name).unlink(missing_ok=True)
        except Exception: pass
    if r.returncode: fail('JS-SYNTAX',f'{label}: {r.stderr.strip()}')

# Every JS file and every executable inline HTML script must parse. No legacy exceptions.
for p in ROOT.rglob('*.js'):
    if '.git' not in p.parts: node_check(p.read_text(encoding='utf-8'),str(p.relative_to(ROOT)))
SCRIPT_RE=re.compile(r'<script(?P<attrs>[^>]*)>(?P<body>.*?)</script\s*>',re.I|re.S)
for p in ROOT.rglob('*.html'):
    if '.git' in p.parts: continue
    src=p.read_text(encoding='utf-8')
    for i,m in enumerate(SCRIPT_RE.finditer(src),1):
        attrs=m.group('attrs')
        if re.search(r'\bsrc\s*=',attrs,re.I): continue
        tm=re.search(r'\btype\s*=\s*[\'\"]([^\'\"]+)',attrs,re.I)
        if tm and tm.group(1).lower() not in {'text/javascript','application/javascript','module'}: continue
        body=m.group('body').strip()
        if body: node_check(body,f'{p.relative_to(ROOT)} inline script #{i}')

ENTRYPOINTS=['app.html','payments.html','guests-v116-production.html','planning.html','guests-rsvp-v105.html','guests-rsvp-public-clean.html','owner-demo-shell.html']
REF_RE=re.compile(r'\b(?:src|href)\s*=\s*[\'\"]([^\'\"]+)[\'\"]',re.I)
for rel in ENTRYPOINTS:
    p=ROOT/rel
    if not p.exists(): continue
    for raw in REF_RE.findall(p.read_text(encoding='utf-8')):
        if raw.startswith(('http://','https://','data:','blob:','#','mailto:','tel:')): continue
        path=urlsplit(raw).path
        if not path or path=='/': continue
        target=(ROOT/path.lstrip('/')) if path.startswith('/') else (p.parent/path)
        if target.resolve().is_relative_to(ROOT.resolve()) and not target.exists(): fail('PKG-REF',f'{rel} references missing local asset: {raw}')
for p in ROOT.glob('zz-test*'): fail('HYGIENE-001',f'test residue present in release tree: {p.name}')

# Guests state integrity.
core=text('guests-v114-integrated.html'); wrapper=text('guests-v116-production.html'); integrity=text('guests-state-integrity-v1.js')
rm=re.search(r'function\s+render\s*\([^)]*\)\s*\{(?P<body>.{0,1200}?)\}',core,re.S)
if rm and re.search(r'\bsave\s*\(',rm.group('body')):
    checks=['guests-state-integrity-v1.js' in wrapper,'function merge3(' in integrity,'P.setItem=function' in integrity,'coreBase=structuredClone(candidate)' in integrity,'latest=parse(nativeGet.call(ls,KEY))' in integrity]
    if not all(checks): fail('GUESTS-STATE-001','frozen Guests core can write stale whole-state snapshots without the three-way rebase guard')
plus_link=text('guests-plusone-placeholder-link-v1.js')
if 'wsd-safe-patch-write-v1' not in plus_link or 'persistLatest(' not in plus_link: fail('GUESTS-STATE-002','+1 placeholder linking is not constrained to patching the latest canonical Guests state')
sync=text('guests-production-sync.js')
for needle,code,msg in [('weddly_guests_sync_meta_v2','GUESTS-SYNC-001','durable dirty/base metadata missing'),('function merge3(','GUESTS-SYNC-002','three-way merge missing'),('function markDirty(','GUESTS-SYNC-003','local edits are not durably marked dirty'),('async function reconcileDirty(','GUESTS-SYNC-004','startup dirty-state reconciliation missing'),('a.r.status===409','GUESTS-SYNC-005','409 conflict handling missing')]:
    if needle not in sync: fail(code,msg)
if 'weddly_guests_conflict_backup' in sync: fail('GUESTS-SYNC-006','legacy conflict-backup overwrite path is still present')

settings=text('weddly-settings.html'); restore=re.search(r'async function restoreBackup\([^)]*\)\{(?P<body>.*?)\n?\}\n?\$\(\'back\'\)',settings,re.S)
if restore:
    body=restore.group('body'); direct='localStorage.setItem(GKEY' in body or 'location.reload' in body; barrier=all(x in sync for x in ['weddly_guests_sync_meta_v2','function merge3(','a.r.status===409','function reconcileDirty('])
    if not direct and not barrier: fail('BACKUP-001','backup restore can be overwritten by stale Guests state')

rsvp_live=text('guests-rsvp-operations-live.html')
if 'guests-rsvp-plusone-ops-v1.js' not in rsvp_live: fail('RSVP-OPS-001','live RSVP operations no longer includes the +1 operations layer')
plus_bridge=text('guests-rsvp-plusone-public-v1.js')
if "meal_required:mealOn?(meal?meal!=='Sin menú':null):null" not in plus_bridge: fail('RSVP-PLUS-001','public +1 bridge no longer preserves unanswered meal as null')

# Suite integration must be event-driven, not permanent DOM polling.
app=text('app.html'); install=text('suite-install-hotfix-v1.js')
if re.search(r'setInterval\s*\([^)]*(?:patchPayments|patchAux)',app,re.S) or re.search(r'setInterval\s*\([^)]*(?:hidePaymentsInstall|patchSettings|patchEssentialSave)',install,re.S): fail('SHELL-001','suite integration still uses permanent DOM polling')
if 'MutationObserver' not in app or 'observeFrame(' not in app: fail('SHELL-002','suite shell lacks event-driven iframe mutation coordination')

# Payments must be pinned to the immutable release manifest and cache only that release.
payments=text('payments.html')
try: manifest=json.loads(text('release/runtime-manifest.json'))
except Exception: manifest={}
release=str(manifest.get('release',''))
if not release or release not in payments: fail('PAYMENTS-001','Payments loader is not pinned to release/runtime-manifest.json')
if 'CACHE_PREFIX' not in payments or 'RUNTIME_RELEASE' not in payments: fail('PAYMENTS-002','Payments offline cache is not release-scoped')
if 'weddly_app_shell_v60' in payments: fail('PAYMENTS-003','legacy unversioned Payments shell fallback is still reachable')
if 'payments-owner-demo-v1.js' not in payments: fail('PAYMENTS-004','Payments runtime no longer injects the maintained owner-demo integration')
p=manifest.get('payments',{}) if isinstance(manifest,dict) else {}
for k in ['edge_function_version','edge_function_sha256','asset_sha256','asset_count','part_count','manifest_endpoint']:
    if not p.get(k): fail('PAYMENTS-MANIFEST',f'missing Payments runtime identity field: {k}')

# Root PWA coherence. Query strings are cache-busters; pathname/scope and cache release are authoritative.
sw=text('sw.js'); cm=re.search(r"const\s+C\s*=\s*['\"]weddly-v(\d+)-suite['\"]",sw)
if not cm: fail('PWA-001','root service-worker cache is not release-versioned')
else:
    sw_release=cm.group(1)
    app_regs=re.findall(r"serviceWorker\.register\(['\"]([^'\"]+)",app)
    if not app_regs: fail('PWA-002','app.html does not register the root service worker')
    else:
        reg=app_regs[-1]; u=urlparse(reg)
        if u.path!='/sw.js': fail('PWA-003',f'app registers unexpected service worker path: {reg}')
        v=parse_qs(u.query).get('v',[''])[0]
        if v!=sw_release: fail('PWA-004',f'app SW cache release {sw_release} and registration cache-buster {v or "missing"} differ')
    owner=ROOT/'owner-demo-shell.html'
    if owner.exists():
        for reg in re.findall(r"serviceWorker\.register\(['\"]([^'\"]+)",owner.read_text(encoding='utf-8')):
            if urlparse(reg).path!='/sw.js': fail('PWA-005',f'owner demo registers a conflicting root service worker: {reg}')

print('\nWeddly Smart Design release gate')
print('='*38)
for item in FAILURES: print('FAIL',item)
print(f'\nSummary: {len(FAILURES)} failure(s), 0 warning(s)')
if FAILURES: sys.exit(1)
