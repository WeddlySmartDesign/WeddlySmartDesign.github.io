#!/usr/bin/env node
'use strict';
// Reproducible *source* QA. The private 30 MB frozen inputs are stored in
// Library, not in this public repository; no private data or master HTML here.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../tools/build_mobile_center_v47_from_library.py'),'utf8');
for(const [label,pattern] of [
 ['center V4.6 pinned SHA',/a95984b658e560a9c3fca4bd92315b41c1b92cc4f6d47fffeed890da6f1f2133/],
 ['Botanica frozen master pinned SHA',/fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a/],
 ['exact copy source verification',/sha256\(center_bytes\).*CENTER_SHA/],
 ['exact visual master verification',/sha256\(bot_bytes\).*BOTANICA_SHA/],
 ['one Android importable HTML file',/OUTFILE = 'GUEST_MOBILE_CENTER_V4_7_BOTANICA_TEST_INTEGRATED_2026-10-11.html'/],
 ['embedded frozen adapter',/guest-v47-botanica-master/],
 ['same-origin srcdoc iframe',/iframe\.srcdoc=text\(\)/],
 ['Botanica test-only',/botanica_only_test_orders/],
 ['design version freeze',/botanica_config_version_mismatch/],
 ['VEIL native legacy renderer retained',/VEIL_APPLY_CONFIG/],
 ['generic design selection',/guest-v47-template/],
 ['unchanged frozen center on disk',/Will not overwrite prior V4\.7 release/],
 ['read-only base input source',/center_file\.read_bytes\(\)/],
 ['source-drift guard for every replace',/SOURCE_DRIFT/]
])assert.match(source,pattern,label);
assert.doesNotMatch(source,/guest-stripe-checkout|deploy_edge_function|CREATE TABLE|\bUPDATE public\./,
  'no payment, DB migration or shared service mutation');
console.log('PASS GUEST Android V4.7 builder source contract: pinned source, TEST only, VEIL untouched, reproducible isolated integration');
