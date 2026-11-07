#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm');
const {build,patch,BASE_SHA,BASE_BYTES,BOTANICA_SHA}=require('../tools/build_mobile_center_v50_from_v49.cjs');
assert.equal(BASE_SHA,'4a163fbb556dbe363b6765107a0e6c99dcd4cdf5b44f2fd2755cc2f69b0eab5c');
assert.equal(BASE_BYTES,45561955);
assert.equal(BOTANICA_SHA,'fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a');
assert.throws(()=>build(Buffer.from('different')),/FROZEN_V49_SHA_SIZE_MISMATCH/);
const original="function isTouchDone(id=current){if(!id)return false;return touchDoneData()[id]===true}"+
" $('wpOrders').onchange=()=>{current=$('wpOrders').value;ownerActivity();touchLabel();showSelected()};"+
" </style>\n\n</head>\n<body class=\"lock\">"+
" GUEST · Centro móvil · V4.9 · CATÁLOGO TEST";
const changed=patch(original);
assert.match(changed,/function remoteReviewComplete/);
assert.match(changed,/currentDetail=null;ownerActivity/);
assert.match(changed,/guest-v50-android-overflow-clearance/);
assert.match(changed,/V5\.0 · CATÁLOGO TEST/);
assert.throws(()=>patch(original+original),/SOURCE_DRIFT_/);
const fn=changed.match(/function remoteReviewComplete\(id=current\)\{[^}]+\}/)[0];
function closed(detailStatus,rowStatus,id='a'){
 const ctx={current:'a',currentDetail:detailStatus===null?null:{id,status:detailStatus},rows:rowStatus===null?[]:[{id,status:rowStatus}]};
 return vm.runInNewContext(fn+";remoteReviewComplete('a')",ctx);
}
assert.equal(closed('review_sent','designing'),true);
assert.equal(closed('approved','designing'),true);
assert.equal(closed('delivered','designing'),true);
assert.equal(closed('changes_requested','review_sent'),false,'current detail supersedes stale row');
assert.equal(closed(null,'review_sent'),true);
assert.equal(closed(null,'designing'),false);
assert.equal(closed(null,null),false);
console.log('PASS V5.0: remote review closes timer, returns from changes resume; native menu clearance and signed immutable base required. No Android or paid checkout claimed.');
