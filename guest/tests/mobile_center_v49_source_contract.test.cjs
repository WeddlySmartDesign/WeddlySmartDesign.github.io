#!/usr/bin/env node
'use strict';
// Static and negative-test contract for source-only CI; real V4.8 bytes live in Drive.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),script=fs.readFileSync(path.join(root,'tools/build_mobile_center_v49_from_v48.cjs'),'utf8');
const ext=fs.readFileSync(path.join(root,'tools/owner_center_generic_extension_v47.js'),'utf8');
const v=fs.readFileSync(path.join(root,'catalog/guest-catalog-owner-viewer-v2.js'),'utf8');
const {build,BASE_SHA,BASE_BYTES,MASTER_SHA}=require('../tools/build_mobile_center_v49_from_v48.cjs');
assert.equal(BASE_BYTES,45558028);assert.equal(BASE_SHA,'5a35f482bce23684496a227f3e9161093a9ef93dd6c9d9fc99dfc41ec7b56835');
assert.equal(MASTER_SHA,'fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a');
assert.throws(()=>build(Buffer.alloc(BASE_BYTES),ext),/FROZEN_V48_SHA_SIZE_MISMATCH_REFUSE/);
assert.throws(()=>build(Buffer.from('bad'),ext),/FROZEN_V48_SHA_SIZE_MISMATCH_REFUSE/);
new vm.Script(ext,{filename:'shared-center-bridge-extension.js'});
new vm.Script(v,{filename:'shared-owner-viewer.js'});
assert.match(script,/SOURCE_DRIFT_/);assert.match(script,/botanica_only_test_orders/);
assert.match(script,/guestCatalogRemote\(order,cfg\)/);
assert.match(script,/if\(guestCatalogRemoteActive&&window\.__guestCatalogClose\)/);
assert.match(ext,/e\.origin!==target\|\|e\.source!==iframe\.contentWindow/);
assert.match(v,/win\.location\.href==='about:blank'/);
assert.match(v,/typeof win\[spec\.applyApi\]!=='function'/);
assert.doesNotMatch(v,/iframe\.addEventListener\('load',onLoad,\{once:true\}\)/);
assert(v.indexOf("iframe.src=url;host.replaceChildren(iframe)")>0,'set src before attach');
console.log('PASS V4.9 isolated builder pinned V4.8, VEIL and embedded Botánica protected, generic bridge readiness and about:blank race guard (no Android inference)');
