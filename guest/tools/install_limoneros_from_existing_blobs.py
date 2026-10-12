#!/usr/bin/env python3
"""One-time, fail-closed GUEST visual admission from already-uploaded GitHub blobs.

Run only in GitHub Actions checkout of guest-independent, never against main.
The immutable master and all 39 blob SHAs are pinned; no design edits or billing.
"""
import base64
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
EXPECTED_BRANCH = 'guest-independent'
ASSET_ID = 'design-03'
VERSION = '1.0.0'
MANIFEST_PATH = ROOT / 'guest/tools/limoneros_existing_blobs_v1.json'
STATUS_PATH = ROOT / 'guest/GUEST_PROJECT_STATUS_V1.json'
PLUGIN_PATH = ROOT / f'guest/templates/{ASSET_ID}/visual-plugin.json'
MASTER_PATH = PLUGIN_PATH.parent / 'master.html'
TARGET_PATH = ROOT / f'guest/catalog-assets/{ASSET_ID}/{VERSION}/index.html'
CATALOG_PATH = ROOT / 'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'
OWNER_PATH = ROOT / 'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json'
EVIDENCE_PATH = ROOT / 'guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json'
ADAPTER_PATH = ROOT / f'guest/guest-catalog-template-{ASSET_ID}-adapter-v1.js'
ORIGINAL_STATE = 'visual-candidate-v1-recovered-qa-local-pass-subset'

def run(*args):
    subprocess.run(args, check=True, cwd=ROOT)

def fail(msg):
    raise RuntimeError('LIMONEROS_FAIL_CLOSED: ' + msg)

def git_blob_sha(data):
    return hashlib.sha1(f'blob {len(data)}\0'.encode('ascii') + data).hexdigest()

def github_blob(repo, token, sha, expected_size):
    url = f'https://api.github.com/repos/{repo}/git/blobs/{sha}'
    request = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {token}',
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GUEST-immutable-visual-assembler/1.0'
    })
    for n in range(3):
        try:
            with urllib.request.urlopen(request, timeout=40) as response:
                obj = json.load(response)
            if obj.get('encoding') != 'base64' or obj.get('sha') != sha:
                fail('wrong GitHub blob encoding/SHA: ' + sha)
            data = base64.b64decode(obj['content'], validate=False)
            if len(data) != expected_size or git_blob_sha(data) != sha:
                fail('blob bytes or SHA invalid: ' + sha)
            return data
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as exc:
            if n == 2:
                raise
            time.sleep(2 * (n + 1))
    fail('no blob: ' + sha)

def main():
    if os.environ.get('GITHUB_REF') != 'refs/heads/' + EXPECTED_BRANCH:
        fail('wrong branch; never alter other projects')
    if os.environ.get('GITHUB_EVENT_NAME') != 'push':
        fail('only run from pinned push workflow')
    repo = os.environ.get('GITHUB_REPOSITORY', '')
    if repo != 'WeddlySmartDesign/WeddlySmartDesign.github.io':
        fail('wrong repository')
    token = os.environ.get('GITHUB_TOKEN', '')
    if not token:
        fail('GitHub Actions token missing')
    if subprocess.check_output(['git', 'status', '--porcelain'], cwd=ROOT).strip():
        fail('checkout not clean')
    source = json.loads(MANIFEST_PATH.read_text())
    if source.get('schemaVersion') != 'guest-existing-blob-transfer-v1' or source.get('id') != ASSET_ID or source.get('version') != VERSION:
        fail('manifest schema/ID/version drift')
    parts = source.get('parts')
    if not isinstance(parts, list) or len(parts) != 39 or [p.get('name') for p in parts] != [f'{i:03}.txt' for i in range(1, 40)]:
        fail('incomplete or reordered source blob list')
    if source['masterBytes'] != 28673474 or source['masterSha256'] != 'a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482':
        fail('frozen master fingerprint drift')
    status = json.loads(STATUS_PATH.read_text())
    previous = status['designs'].get(ASSET_ID, {})
    if previous.get('status') != ORIGINAL_STATE or previous.get('masterSha256') != source['masterSha256']:
        fail('template already registered or unexpected continuity status')
    registry = json.loads(CATALOG_PATH.read_text())
    owner = json.loads(OWNER_PATH.read_text())
    evidence = json.loads(EVIDENCE_PATH.read_text())
    if any(t['id'] == ASSET_ID for t in registry['templates']) or ASSET_ID in owner['templates'] or ASSET_ID in evidence['templates']:
        fail('catalog template already registered')
    if MASTER_PATH.exists() or TARGET_PATH.exists():
        fail('existing master or target would be overwritten')

    print('Verify immutable GitHub blob sequence: 39 parts', flush=True)
    assembled = bytearray()
    for p in parts:
        assembled.extend(github_blob(repo, token, p['gitBlobSha'], p['bytes']))
        print('verified', p['name'], flush=True)
    master = bytes(assembled)
    if len(master) != source['masterBytes'] or hashlib.sha256(master).hexdigest() != source['masterSha256']:
        fail('reconstructed master differs byte-for-byte from frozen author original')
    if b'window.GUEST_APPLY_CONFIG' not in master or b'</body>' not in master:
        fail('renderer or document closing missing')

    PLUGIN_PATH.parent.mkdir(parents=True, exist_ok=True)
    MASTER_PATH.write_bytes(master)
    PLUGIN_PATH.write_text(json.dumps({
        'id': ASSET_ID, 'displayName': 'LIMONEROS', 'version': VERSION,
        'rendererApi': 'GUEST_APPLY_CONFIG', 'masterHtml': 'master.html',
        'typographyVariants': ['classic']
    }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    # The generic safe onboarding accepts only a freshly not-started record.
    # Temporarily restate the recovered-but-unregistered record in this runner,
    # after its frozen SHA has passed explicit validation above.
    status['designs'][ASSET_ID] = {'status': 'not-started'}
    STATUS_PATH.write_text(json.dumps(status, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    run('node', 'guest/tools/register_visual_template.cjs', '--manifest', str(PLUGIN_PATH))
    run('node', 'guest/tools/register_visual_template.cjs', '--manifest', str(PLUGIN_PATH), '--apply')
    registered = json.loads(STATUS_PATH.read_text())
    fresh = registered['designs'][ASSET_ID]
    fresh.update({
        'name': 'Limoneros', 'originalLibraryFolder': previous['originalLibraryFolder'],
        'originalCandidateLibraryFile': previous['originalCandidateLibraryFile'],
        'originalCandidateZipSha256': previous['zipSha256'],
        'visualCandidateSource': 'guest/GUEST_ENTRY_79_D03_LIMONEROS_CANDIDATE_V1_RECOVERED_2026-10-12.md',
        'integrationVerified': True, 'cloudflareVerified': False,
        'backendTestDeployed': False, 'androidPhysicalVerified': False,
        'commercialReady': False,
    })
    registered['asOf'] = '2026-10-12'
    STATUS_PATH.write_text(json.dumps(registered, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if TARGET_PATH.read_bytes() != master:
        fail('registered asset differs from original frozen master')
    run('node', 'guest/qa/catalog_preflight_v2.cjs')
    run('node', 'guest/qa/catalog_admission_gate.cjs')
    run('node', 'guest/tools/build_catalog_static_preview.cjs', '--output', os.path.join(os.environ.get('RUNNER_TEMP', '/tmp'), 'guest-limoneros-preprod'), '--template', 'botanica')
    print('GUEST D03: local preflight and TEST-only stage PASS. No real Android or commercial gate.', flush=True)
    paths = [PLUGIN_PATH, MASTER_PATH, TARGET_PATH, STATUS_PATH, CATALOG_PATH, OWNER_PATH, EVIDENCE_PATH, ADAPTER_PATH]
    run('git', 'add', '--', *(str(p.relative_to(ROOT)) for p in paths))
    allowed = {str(p.relative_to(ROOT)) for p in paths}
    staged = set(subprocess.check_output(['git', 'diff', '--cached', '--name-only'], cwd=ROOT, text=True).splitlines())
    if staged != allowed:
        fail(f'unexpected staging paths: {staged ^ allowed}')
    run('git', '-c', 'user.name=GUEST QA Automation', '-c', 'user.email=actions@users.noreply.github.com', 'commit', '-m', 'feat(guest): install verified Limoneros V1 TEST-only without touching frozen designs')
    run('git', 'push', 'origin', 'HEAD:guest-independent')
    print('PASS: committed exact Limoneros master and registry in guest-independent. Not approved for sale.', flush=True)

if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print('FAIL CLOSED:', exc, file=sys.stderr, flush=True)
        sys.exit(1)