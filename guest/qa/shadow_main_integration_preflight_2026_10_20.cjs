#!/usr/bin/env node
'use strict';
/* Read-only GUEST main integration preflight.
 * Creates NO commits, releases, remote data, payments or deployed assets.
 * Works on a disposable GitHub Actions runner with pinned draft branch sources.
 */
const cp=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const BASE='origin/main';
const MANAGEMENT='origin/guest-management-main-bridge-draft-2026-10-20';
const STORE='origin/guest-individual-storefront-draft-2026-10-20';
const PIN_MAIN='1e7c81515b71f16105b68a928bb908cba702bebf';
const PIN_MANAGEMENT='62cd8c85a12ac1d20fb798209f4b30e49a7d08ee';
const PIN_STORE='aa95138f8000689ce39c3e57e9cbf62628cd7067';
const ROOT_STORE=['guest.html','guest-checkout.html','guest-checkout-return.html','guest-order.html'].sort();
function git(...args){return cp.execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024}).trimEnd()}
function fail(s){throw Error('SHADOW_MAIN_GATE: '+s)}
function changed(source){return git('diff','--name-only',BASE,source).split('\n').filter(Boolean).sort()}
function blob(ref,p){return cp.execFileSync('git',['show',ref+':'+p],{maxBuffer:35*1024*1024});}
function tree(ref){return new Set(git('ls-tree','-r','--name-only',ref).split('\n').filter(Boolean))}
function safeFrom(base,change,expected){
  const ref=git('rev-parse',change),original=git('rev-parse',base);
  if(ref!==expected||original!==PIN_MAIN)fail('Git branch SHA drift; refresh approvals before combining');
  if(git('merge-base',base,change)!==original)fail('PR no longer forked from exact public main base');
}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-shadow-main-readonly-'));
try {
  safeFrom(BASE,MANAGEMENT,PIN_MANAGEMENT);
  safeFrom(BASE,STORE,PIN_STORE);
  const mgmt=changed(MANAGEMENT),store=changed(STORE);
  assert.equal(mgmt.length,32,'32 management-only files required');
  assert(mgmt.every(p=>p.startsWith('guest/')),'Management changed files outside guest/');
  assert.deepEqual(store,ROOT_STORE,'Storefront must touch exactly four GUEST root pages');
  assert.equal(new Set([...mgmt,...store]).size,36,'Overlapping patch or missing file');
  const current=tree(BASE),live=new Set(current);
  for(const p of [...mgmt,...store])live.add(p);
  const read=p=>blob(store.includes(p)?STORE:mgmt.includes(p)?MANAGEMENT:BASE,p).toString('utf8');
  // No accidental dependency on files from unrelated branches.
  for(const page of [...mgmt.filter(p=>/\.html$/.test(p)),...store.filter(p=>/\.html$/.test(p))]) {
    const html=read(page);
    const docDir=path.posix.dirname(page);
    const found=[...html.matchAll(/(?:href|src)\s*=\s*["']([^"'<>]+)["']/gi)].map(x=>x[1]);
    for(const v of found) {
      const item=v.split(/[?#]/,1)[0];
      if(!item||/^(?:[a-z][a-z\d+.-]*:|\/\/|#|data:|javascript:)/i.test(item))continue;
      const local=item.startsWith('/')?item.slice(1):path.posix.normalize(path.posix.join(docDir,item));
      if(!local||local.includes('..'))fail('Unsafe local href: '+page);
      if(!live.has(local)&&!live.has(local+'/index.html'))fail('Dangling href '+page+' -> '+local);
    }
  }
  // Test every replaced standalone JS file can be parsed by Node without browser globals.
  for(const p of mgmt.filter(p=>p.endsWith('.js'))) {
    const target=path.join(tmp,path.basename(p));
    fs.writeFileSync(target,blob(MANAGEMENT,p));
    const result=cp.spawnSync(process.execPath,['--check',target],{encoding:'utf8'});
    if(result.status!==0)fail('JavaScript syntax invalid: '+p+'; '+String(result.stderr).slice(0,250));
  }
  const ops=read('guest/guests-rsvp-operations-live.html');
  assert(ops.includes('guests-catalog-invitation-bridge-v1.js'),'missing final invitation bridge');
  assert(ops.includes('guests-rsvp-share-composer-v3.js'),'missing RSVP delivery composer');
  assert(ops.indexOf('guests-catalog-invitation-bridge-v1.js')<ops.indexOf('guests-rsvp-share-composer-v3.js'),'wrong script order');
  const bridge=read('guest/guests-catalog-invitation-bridge-v1.js');
  const composer=read('guest/guests-rsvp-share-composer-v3.js');
  assert(bridge.includes("action:'active_for_member'"),'GUEST delivery must come from active backend');
  assert(bridge.includes('catalog_invitation_unavailable'),'missing delivery must fail closed');
  assert(composer.includes('__GuestCatalogBridge.buildRecipientUrl'),'composer must use delivered design not legacy fallback');
  const storefront=read('guest.html');
  assert(storefront.includes('No son paquetes ni colecciones'),'individual designs were replaced with legacy tiers');
  assert(!/GUEST Essential|GUEST Signature/.test(storefront),'legacy catalog groups resurfaced');
  assert(storefront.includes('Próxima apertura')&&/noindex/i.test(storefront),'storefront may not go live in draft');
  assert.equal((storefront.match(/class="design-card individual"/g)||[]).length,15,'exact 15 sale candidates only');
  for(const p of ROOT_STORE.filter(x=>x!=='guest.html')){
    const html=read(p);
    assert(html.includes('catalogTemplateId'),'individual template identity missing in '+p);
    assert(/noindex/i.test(html),'draft GUEST checkout page must remain not indexed');
  }
  const result={
    status:'PASS',scope:'PREVIEW_READ_ONLY',sale:'NO_GO',
    publicMainCommit:PIN_MAIN,draftCommitManagement:PIN_MANAGEMENT,draftCommitStore:PIN_STORE,
    verifiedChanges:36,managementFiles:32,individualCheckoutFiles:4,
    mainUnmodified:true,cloudflareUnmodified:true,liveStripeUnmodified:true,
    coverage:'File identity, dependency URLs, script syntax and non-commercial integration contract; no remote or real end-to-end test'
  };
  process.stdout.write(JSON.stringify(result)+'\n');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
