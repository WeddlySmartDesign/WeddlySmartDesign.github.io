#!/usr/bin/env node
'use strict';
// GUEST-only checkout/admin producer-consumer drift guard; never hits Stripe or Supabase.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'..');
const checkout=fs.readFileSync(path.join(dir,'backend/guest-stripe-checkout/index.ts'),'utf8');
const admin=fs.readFileSync(path.join(dir,'backend/guest-orders-admin/index.ts'),'utf8');
const flow=fs.readFileSync(path.join(dir,'backend/guest-invitation-flow/index.ts'),'utf8');
assert.match(checkout,/const metadata=\{product:'guest',edition,/,'paid checkout must issue product GUEST license');
assert.match(checkout,/p_product_ref:'guest_'\+edition/,'license must remain explicitly GUEST product');
assert.match(admin,/!\['guest','guests'\]\.includes\(String\(l\.metadata\?\.product\|\|''\)\)/,'detail must accept current guest and historic guests metadata');
assert.match(admin,/\.eq\('source','stripe'\)\.in\('metadata->>product',\['guest','guests'\]\)/,'admin list must accept both GUEST formats without including ONE');
assert.match(admin,/l\.source!=='stripe'/,'admin detail must never accept arbitrary/internal owner licenses');
assert.match(checkout,/guest-order\.html\?session_id=/,'existing checkout still uses LEGACY order form');
assert.doesNotMatch(checkout,/guest_invitation_orders|functions\/v1\/guest-invitation-flow/,'do not misrepresent direct checkout/new flow integration as implemented');
assert.match(flow,/async function createOrder\(/,'new guest_invitation_orders pipeline remains independent and requires explicit commercial wiring');
// Prove catalog pins travel Stripe checkout metadata -> license and remain gated.
assert.match(checkout,/function catalogSaleOption\(/,'certified catalog selection is reusable across design IDs');
assert.match(checkout,/GUEST_CATALOG_SALE_OPTIONS/,'operator-owned allowlist is required');
assert.match(checkout,/option\.status!=='commercially-frozen'/,'pending Botánica cannot be sold');
assert.match(checkout,/option\.amountCents!==amountFor\(edition\)/,'client may not choose price');
assert.match(checkout,/p\.set\('metadata\[guest_catalog_template_id\]',option\.id\)/,'Stripe Checkout pins catalog id');
assert.match(checkout,/p\.set\('metadata\[guest_catalog_template_version\]',option\.version\)/,'Stripe Checkout pins version');
assert.match(checkout,/payment_intent_data\[metadata\]\[guest_catalog_template_id\]/,'payment intent also pins catalog choice');
assert.match(checkout,/guest_catalog_template_id:templateId,guest_catalog_template_version:templateVersion/,'license metadata persists Stripe pins');
assert.match(checkout,/b\.catalogTemplateId/,'Checkout requests may explicitly choose certified catalog design');
assert.match(checkout,/catalogTemplateVersion:p\?\.metadata\?\.guest_catalog_template_version/,'Checkout status exposes paid version pin for downstream');
assert.match(checkout,/if\(!id\)return null/,'Legacy Essential/Signature checkout must remain valid without design pin');
// Exercise exact production allowlist code, offline and with no Stripe calls.
const {stripTypeScriptTypes}=require('node:module');
const start=checkout.indexOf('function catalogSaleOption('),end=checkout.indexOf('function activationCode()',start);
assert(start>0&&end>start,'Could not isolate production selection contract');
const functionText=stripTypeScriptTypes(checkout.slice(start,end));
function options(value){
  const env=name=>name==='GUEST_CATALOG_SALE_OPTIONS'?JSON.stringify(value):'';
  const amountFor=edition=>edition==='signature'?4990:3990;
  return new Function('env','amountFor',functionText+'; return catalogSaleOption;')(env,amountFor);
}
const catalog=options({'veil-light':{version:'5.3.3',status:'commercially-frozen',edition:'signature',amountCents:4990},
 botanica:{version:'14.7',status:'certification-pending',edition:'signature',amountCents:4990}});
assert.deepEqual(catalog('veil-light','signature'),{id:'veil-light',version:'5.3.3'});
assert.equal(catalog('', 'essential'),null,'legacy purchases remain untouched');
assert.throws(()=>catalog('botanica','signature'),/catalog_template_not_for_sale/);
assert.throws(()=>catalog('veil-light','essential'),/catalog_template_not_for_sale/);
assert.throws(()=>catalog('../veil-light','signature'),/catalog_template_not_for_sale/);
assert.throws(()=>options({'veil-light':{version:'5.3.3',status:'commercially-frozen',edition:'signature',amountCents:1}})('veil-light','signature'),/catalog_template_not_for_sale/);
assert.throws(()=>options({})('veil-light','signature'),/catalog_template_not_for_sale/);
assert.match(flow,/async function createOrder\(/,'new guest_invitation_orders pipeline remains independent until deliberate Cloud release');
console.log('PASS GUEST checkout catalog Stripe/license pin, certified allowlist, price and edition gates, legacy fallback, and no unintended live billing. Offline only.');
