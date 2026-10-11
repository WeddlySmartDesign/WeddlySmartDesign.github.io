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
console.log('PASS trusted V16 pending-test final rendering only; production sale guard + V15 HTTPS guard preserved, no new design logic');
