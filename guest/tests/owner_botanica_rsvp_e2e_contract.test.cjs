#!/usr/bin/env node
'use strict';
// Static gate only. No owner tokens, production requests, licenses or writes here.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'guest/qa/owner-botanica-rsvp-e2e.html'),'utf8');
const builder=fs.readFileSync(path.join(root,'guest/tools/build_catalog_static_preview.cjs'),'utf8');
const js=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
assert.equal(js.length,1);
new vm.Script(js[0],{filename:'botanica-owner-rsvp-qa.js'});
assert.match(builder,/guest\/qa\/owner-botanica-rsvp-e2e\.html/);
assert.match(html,/noindex,nofollow,noarchive/);
assert.match(html,/referrer.*no-referrer/);
assert.match(html,/connect-src https:\/\/dnjsxequwgtyyauuofxj\.supabase\.co/);
assert.match(html,/action:'login',recoveryCode:code/,'actual owner login required');
assert.match(html,/action:'grant',product:'guests',kind:'7',label:LABEL/,'only 7-day GUEST tester license');
assert.match(html,/action:'reissue',licenseId:existing.id/,'repeat visit reuses tester, never grants duplicates');
assert.match(html,/action:'activate',activationCode:activation/,'activation through official GUEST license');
assert.match(html,/action:'link_test_license',orderId:order.id,licenseId:licensed.licenseId/,'authorized link to existing order only');
assert.match(html,/action:'active_for_member'/,'must show member-owned order');
assert.match(html,/method:'PUT',member/,'management update requires isolated member token');
assert.match(html,/method:'GET',member/,'read-after-write must check state');
assert.match(html,/action:'submit',token,guest_key:id,name,attend/,'two RSVP submissions');
assert.match(html,/RSVP\+'\?manage=1'/,'read-after-write must verify management');
assert.match(html,/template_id!=='botanica'/);
assert.match(html,/o\.mode!=='test'\|\|o\.status!=='delivered'/);
assert.doesNotMatch(html,/create_test|create_paid|fetch\([^)]*stripe|localStorage|sessionStorage|indexedDB|gtag\(/i,'no orders/checkout, no secrets persisted');
assert.match(html,/activation='';member='';manager='';field\.value=''/,'clear secrets after run');
console.log('PASS owner-only GUEST TEST 7-day RSVP E2E page: syntax, isolation, authorization, no duplicate orders or paid actions; no live API calls');
