#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),html=fs.readFileSync(path.join(root,'guest/qa/owner-botanica-closeout.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(Boolean);
assert.equal(scripts.length,1,'one controlled inline certification script');
new vm.Script(scripts[0],{filename:'guest-owner-closeout.js'});
for(const re of [
 /noindex,nofollow,noarchive/,/referrer.*no-referrer/,
 /frame-src 'self'/,
 /\/guest\/catalog\/guest-catalog-owner-viewer-v2\.js/,
 /action:'login',recoveryCode:code/,
 /action:'list'/,/action:'detail'/,/action:'review_load'/,/action:'public_load'/,
 /GUEST_CATALOG_OWNER_VIEWER_V2\.show/,
 /spec\.src='\/guest\/catalog-assets\/botanica\/14\.7\/index\.html'/,
 /compareConfig|cleanSignedConfig/,
 /guest-invitation-uploads\//,/startsWith\('https:\/\/dnjsxequwgtyyauuofxj\.supabase\.co\/storage\/v1\/object\/sign/,
 /document\.visibilityState==='visible'/,/Date\.now\(\)-lastActivity<60000/,
 /activeSeconds\+\+/,/No equivale al tiempo completo del encargo/
])assert.match(html,re);
assert.doesNotMatch(html,/action:\s*['\"](?:create_test|create_paid|link_test_license|grant|set_config|mark_review_ready|send_review|deliver)['\"]|localStorage|sessionStorage|indexedDB/,'read-only and credential-minimized');
assert.match(html,/load\.addEventListener\('click',run\)/,'must require explicit owner click');
const build=fs.readFileSync(path.join(root,'guest/tools/build_catalog_static_preview.cjs'),'utf8');
assert(build.includes('guest/qa/owner-botanica-closeout.html'),'QA asset must ship via existing stage');
console.log('PASS GUEST actual owner shared renderer read-only, review/final signed-media normalized parity, active visual time only, no test writes');
