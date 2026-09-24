const fs=require('fs'),assert=require('assert');
const access=fs.readFileSync('checkout/edge/weddly-access/index.ts','utf8');
const manager=fs.readFileSync('checkout/edge/weddly-owner-manager/index.ts','utf8');
const tester=fs.readFileSync('checkout/edge/weddly-test-access/index.ts','utf8');
const admin=fs.readFileSync('tester-admin.html','utf8');

function weddingExpiry(raw){
  const [y,m,d]=raw.split('-').map(Number);
  return new Date(Date.UTC(y,m-1,d+91,0,0,0,0)).toISOString();
}
assert.strictEqual(
  weddingExpiry('2026-01-01'),
  '2026-04-02T00:00:00.000Z',
  'Wedding date + 90 complete calendar days must expire at start of day 91 UTC'
);

assert(access.includes("wedding_plus_90"),'weddly-access must enforce wedding + 90');
assert(access.includes("String(metadata?.access_kind||'')==='paid'"),'Paid full access must use wedding window');
assert(access.includes("source==='tester'&&metadata?.permanent===true"),'Courtesy full access must use wedding window');
assert(access.includes("w?.settings?.weddingDate"),'Current weddingDate must be the source of truth');
assert(access.includes("status:'inactive'"),'Expired access must deactivate the license so every module rejects it');

assert(manager.includes("action==='set_edition'"),'Manager must upgrade an existing access without creating a new wedding');
assert(manager.includes("'signature'"),'Manager must support Signature');
assert(manager.includes("meta.access_window='wedding_plus_90'"),'New full courtesy grants must record the wedding window');
assert(manager.includes("edition:editionOf(meta)"),'Existing grants must expose their edition');

assert(tester.includes('weddingExpired(db,l)'),'Entitlement endpoint must reject wedding-window expiry');
assert(admin.includes('Cortesía · boda + 90 días'),'Admin must show the real courtesy rule');
assert(admin.includes('Dar Signature'),'Existing full grants must be upgradable to Signature');
assert(admin.includes("edition=product==='full'?$('edition').value:'essential'"),'New full grants must send selected edition');

console.log('License wedding+90 and Signature courtesy QA: PASS');
