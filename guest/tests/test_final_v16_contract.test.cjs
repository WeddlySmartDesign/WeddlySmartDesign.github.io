#!/usr/bin/env node
'use strict';
/* GUEST catalog reusable pending-TEST final view; no private tokens and no Cloud. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),get=p=>fs.readFileSync(path.join(root,p),'utf8');
const {build}=require('../tools/prepare_test_only_backend_v13.cjs');
const {patch:to14}=require('../tools/allow_catalog_public_origin_v14.cjs');
const {patch:to15}=require('../tools/route_paid_catalog_urls_v15.cjs');
const {patch:to16}=require('../tools/enable_test_final_v16.cjs');
const v15=to15(to14(build(get('guest/qa/isolated_free/edge_guest_flow_v12_readonly_snapshot.ts'))));
const v16=to16(v15);
assert.equal(v16.split("mode:order.mode==='test'?'test':'production',label:orderLabel(order)").length,2,'exactly one mode emission behind signed public token');
assert.equal(v16.split("if(action==='public_load')").length,2,'no second public load');
assert.match(v16,/findByToken\(c,String\(b\.token\|\|''\),'public_token_hash'\)/,'only signed recipient capability can read mode');
assert.match(v16,/if\(order\.status!=='delivered'\)return json\(\{ok:false,error:'not_delivered'\},409\)/,'final cannot be shown before delivery');
assert.equal(v16.split("if(action==='create_paid')").length,2,'production checkout still gated');
assert.equal(v16.split("const paidCatalogDelivery=").length,2,'V15 host control retained');
assert.throws(()=>to16(v16),/SOURCE_DRIFT/,'patching twice forbidden');
const delivery=get('guest/catalog-final.html');
const runtime=get('guest/guest-catalog-delivery-runtime-v1.js');
const viewer=get('guest/catalog/guest-catalog-owner-viewer-v2.js');
assert.match(runtime,/await applyConfig\(cfg,x\.order\)/,'server mode passed through generic delivery runtime');
assert.match(delivery,/const isTest=verifiedOrder\?\.mode==='test'/,'UI never trusts query to grant TEST');
assert.match(delivery,/isTest&&spec\.status==='certification-pending'/,'test capability permits pending visual');
assert.match(delivery,/spec\.status==='commercially-frozen'/,'production still needs commercial seal');
assert.match(delivery,/VISTA DE PRUEBA · NO ENVIAR A INVITADOS/,'test-order deliveries visibly marked');
assert.match(viewer,/spec\.status!=='commercially-frozen'&&order\?\.mode!=='test'/,'shared viewer retains no production pending');

// Cross-surface PARITY CONTRACT (not a live Cloud parity certification):
// Both APIs must resolve the SAME saved config. Media URLs are deliberately
// issued with different TTLs and are therefore not comparable as literal text.
const take=(name,next)=>{
 const begin=v16.indexOf("if(action==='"+name+"')");
 const end=v16.indexOf("if(action==='"+next+"')",begin+1);
 assert(begin>=0&&end>begin,'missing contiguous API action branch '+name);
 return v16.slice(begin,end);
};
const reviewApi=take('review_load','review_respond');
const finalApi=take('public_load','active_for_member');
for(const [label,segment] of [['review',reviewApi],['final',finalApi]]){
 assert.match(segment,/findByToken\(c,String\(b\.token\|\|''\),'(?:review|public)_token_hash'\)/,
  label+' must be capability-scoped');
 assert.match(segment,/hydrateConfig\(order\.resolved_config\|\|\{\},files\)/,
  label+' must hydrate the same persisted resolved_config');
 assert.match(segment,/config\}\}/,label+' must return the hydrated config');
}
assert.match(reviewApi,/signedFiles\(c,order,7200\)/,'review-media TTL remains bounded');
assert.match(finalApi,/signedFiles\(c,order,86400\)/,'final-media TTL remains bounded');
const reviewPage=get('guest-review-v1.html');
for(const [label,page] of [['review',reviewPage],['final',delivery]]){
 assert.match(page,/guest-catalog-owner-viewer-v2\.js/,'same owner renderer for '+label);
 assert.match(page,/GUEST_CATALOG_OWNER_VIEWER_V2\.show\(/,'same shared viewer call for '+label);
 assert.match(page,/GUEST_CATALOG_OWNER_RENDERERS_V2\.json/,'same registry for '+label);
}
assert.match(finalApi,/order\.status!=='delivered'/,'final may not load before delivery');
assert.match(reviewApi,/review_not_ready/,'review gated until order reaches review');
assert.match(runtime,/if\(!ctx\.rsvpToken\)return '#'/,
 'unlicensed demo/TEST must not be presented as live RSVP');

console.log('PASS offline shared review/final config-source and renderer parity contract; trusted V16 pending-test final rendering only; production sale guard + V15 HTTPS guard preserved, no new design logic');
