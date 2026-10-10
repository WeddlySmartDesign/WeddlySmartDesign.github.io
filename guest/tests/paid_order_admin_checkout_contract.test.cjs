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
assert.match(checkout,/async function paidCatalogQuestionnaire\(/,'Stripe-verified license must enter the existing invitation-flow V13');
assert.match(checkout,/functions\/v1\/guest-invitation-flow/,'Checkout must use existing V13, not a parallel backend');
assert.match(checkout,/action:'create_paid'/,'V13 paid order bridge only');
assert.match(checkout,/if\(l\.metadata\?\.guest_catalog_template_id\)throw new Error\('catalog_uses_common_questionnaire'\)/,'catalog purchases must never repeat legacy order form');
assert.match(checkout,/catalogQuestionnaireUrl:p\?\.catalogQuestionnaireUrl\|\|null/,'paid buyer receives common questionnaire route');
assert.match(flow,/async function createOrder\(/,'existing GUEST order pipeline still used');
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

// Exercise real production handoff logic with a fake DB and fake HTTP response,
// including manager signature envelope, idempotent local request and denials.
const bridgeStart=checkout.indexOf('async function paidCatalogQuestionnaire(');
const bridgeEnd=checkout.indexOf('async function provision(',bridgeStart);
assert(bridgeStart>0&&bridgeEnd>bridgeStart);
const bridgeCode=stripTypeScriptTypes(checkout.slice(bridgeStart,bridgeEnd));
let calls=0,mailCalls=0,owners=[{id:'00000000-0000-4000-8000-000000000001',metadata:{grant_type:'owner'}}];
const mockAdmin=()=>({from(name){assert.equal(name,'licenses');return{select(){return this},eq(){return this},limit(){return Promise.resolve({data:owners,error:null})}}}});
const mockDeno={env:{get:name=>name==='SUPABASE_SERVICE_ROLE_KEY'?'offline-fake-role-secret':name==='SUPABASE_URL'?'https://private-qa.supabase.co':''}};
const mockFetch=async(url,opt)=>{
 calls++;assert.equal(url,'https://private-qa.supabase.co/functions/v1/guest-invitation-flow');
 assert.equal(opt.method,'POST');
 const body=JSON.parse(opt.body);
 assert.deepEqual(body,{action:'create_paid',licenseId:'fake-uuid',templateId:'veil-light'});
 assert.match(opt.headers['x-weddly-manager'],/^v1\.[A-Za-z0-9_-]+\.OFFLINE_SIGNATURE$/);
 return {ok:true,json:async()=>({ok:true,id:'fake-order',qToken:'fictional-purchase-token-that-is-at-least-32-bytes-long'})};
};
const bridge=new Function('admin','Deno','hmacHex','fetch','AbortSignal','env','origin','btoa','resend','esc','labelFor',
 bridgeCode+';return {paidCatalogQuestionnaire,startCatalogEmail};')(
 mockAdmin,mockDeno,async()=> 'OFFLINE_SIGNATURE',mockFetch,AbortSignal,
 name=>name==='SUPABASE_URL'?'https://private-qa.supabase.co':'',
 ()=> 'https://weddlysmartdesign.github.io',btoa,
 async()=>{mailCalls++;return true},x=>String(x),x=>x);
(async()=>{
 assert.equal(await bridge.paidCatalogQuestionnaire('fake-uuid',{}),null,'legacy purchase does not invoke V13');
 const a=await bridge.paidCatalogQuestionnaire('fake-uuid',{guest_catalog_template_id:'veil-light',guest_catalog_template_version:'5.3.3'});
 assert.equal(a.orderId,'fake-order');
 assert.match(a.questionnaireUrl,/^https:\/\/weddlysmartdesign.github.io\/guest\/catalog-questionnaire.html\?t=/);
 assert.equal(calls,1,'only one V13 request');
 assert(await bridge.startCatalogEmail('fake@example.invalid','cs_test_offline','signature',a));
 assert.equal(mailCalls,1);
 await assert.rejects(()=>bridge.paidCatalogQuestionnaire('fake-uuid',{guest_catalog_template_id:'botanica',guest_catalog_template_version:'###'}),/catalog_invalid_pin/);
 owners=[];await assert.rejects(()=>bridge.paidCatalogQuestionnaire('fake-uuid',{guest_catalog_template_id:'veil-light',guest_catalog_template_version:'5.3.3'}),/catalog_owner_unavailable/);
 assert.equal(calls,1,'unauthorized owner lookup must never call V13');
 console.log('PASS GUEST Stripe purchase → V13 paid catalog order and common questionnaire, server-only signed manager context; legacy-safe; no cloud or billing');
})().catch(e=>{console.error(e);process.exitCode=1});
