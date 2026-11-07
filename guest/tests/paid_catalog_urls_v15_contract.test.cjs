#!/usr/bin/env node
'use strict';
// GUEST-exclusive: checkout and V15 generated from real V12->V13->V14->V15.
// NO deployed functions, credentials, real buyer email or Stripe calls.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const {build}=require('../tools/prepare_test_only_backend_v13.cjs');
const {patch:v14Patch}=require('../tools/allow_catalog_public_origin_v14.cjs');
const {patch:v15Patch}=require('../tools/route_paid_catalog_urls_v15.cjs');
const v12=read('guest/qa/isolated_free/edge_guest_flow_v12_readonly_snapshot.ts');
const v13=build(v12),v14=v14Patch(v13),v15=v15Patch(v14);
const checkout=read('guest/backend/guest-stripe-checkout/index.ts');
assert(v15.length>v14.length&&v15.length<1.04*v14.length,'scope widened unexpectedly');
assert.equal(v15.split("if(action==='create_paid')").length,2,'paid order path duplicated');
assert.equal(v15.split('const paidCatalogReview=').length,2,'review guard must be exactly one');
assert.equal(v15.split('const paidCatalogDelivery=').length,2,'final delivery guard must be exactly one');
assert.match(v15,/order\.mode==='production'&&Boolean\(order\.checkout_session_id\)/,'only genuine paid production catalog orders get changed rules');
assert.match(v15,/const reviewUrl=supplied\|\|\(!localTest\?expectedReviewUrl:''\)/,'legacy and test review behavior remains unchanged');
assert.match(v15,/reviewBase=host\.origin/,'review pinned to exact configured static host');
assert.match(v15,/if\(paidCatalogReview&&supplied&&supplied!==expectedReviewUrl\)/,'owner cannot spoof paid review link');
assert.match(v15,/paidCatalogDelivery\?onSecondary:\(onPrimary\|\|onSecondary\)/,'paid final must never fall back to the legacy site');
assert.match(v15,/host\.protocol!=='https:'/,'HTTPS only');
assert.throws(()=>v15Patch(v15),/DRIFT_OR_ALREADY_APPLIED/,'cannot apply release patch twice');
assert.match(checkout,/function catalogStaticHost\(/,'checkout must enforce same common host');
assert.match(checkout,/questionnaireUrl:host\+'\/guest\/catalog-questionnaire.html/,'questionnaire must use configured static host');
assert.match(checkout,/GUEST_CATALOG_PUBLIC_ORIGIN/,'same exact env key in both guest services');
assert.match(checkout,/if\(!raw\)throw new Error\('catalog_host_not_configured'\)/,'never charge without host');
assert.match(v15,/if\(!raw\)return json\(\{ok:false,error:'catalog_host_not_configured'\},503\)/,'never send paid review without host');
assert.match(v15,/if\(finalUrl\.protocol!=='https:'/);
assert.equal(v15.includes("const site=()=>String(Deno.env.get('WEDDLY_SITE_ORIGIN')"),true,'preserve original license/activation site');
console.log('PASS: generated V15 from actual V12 snapshot through validated V13/V14; paid host required for questionnaire/review/final, legacy unchanged. OFFLINE ONLY.');
