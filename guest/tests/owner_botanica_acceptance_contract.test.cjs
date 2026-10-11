#!/usr/bin/env node
'use strict';
/* Static security gate for the owner-authorized temporary TEST acceptance surface.
   Does NOT exercise a real manager login or create Cloud orders. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'guest/qa/owner-botanica-acceptance.html'),'utf8');
const builder=fs.readFileSync(path.join(root,'guest/tools/build_catalog_static_preview.cjs'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
assert.equal(scripts.length,1,'single inline QA-only script; no dependencies');
new vm.Script(scripts[0],{filename:'owner-botanica-acceptance.inline.js'});
assert.match(builder,/guest\/qa\/owner-botanica-acceptance\.html/,'one existing static builder must include the QA surface');
assert.match(html,/noindex,nofollow,noarchive/);
assert.match(html,/referrer.*no-referrer/);
assert.match(html,/connect-src https:\/\/dnjsxequwgtyyauuofxj\.supabase\.co/,'browser may call only official GUEST Supabase');
assert.match(html,/form-action 'none'/);
assert.match(html,/https:\/\/guest-weddlysmartdesign\.pages\.dev/);
assert.match(html,/action:'login',recoveryCode:code/,'must use real owner login, never fabricate manager auth');
assert.match(html,/action:'status'.*manager/,'must verify owner session before creating orders');
assert.doesNotMatch(html,/action:'create_test'|create_paid|new FormData/,'results viewer must not create any orders or upload files');
assert.match(html,/action:'list'/,'owner lists completed orders');
assert.match(html,/action:'detail'/,'capabilities must be recovered via authenticated owner');
assert.match(html,/qa-botanica@example\.invalid/,'viewer filters to synthetic QA orders only');
assert.match(html,/status==='delivered'/,'no drafts or production allowed');
assert.match(html,/action:'public_load',token:p/,'verify actual server-approved test order');
assert.match(html,/mode!=='test'/,'test-only final capability check');
assert.match(html,/manager=null;secret\.value=''/,'credentials erased after execution');
assert.doesNotMatch(html,/localStorage|sessionStorage|indexedDB|analytics|stripe\/checkout|actions?:'create_paid'|GUEST_CATALOG_SALE_OPTIONS/i,'no persistence, payment or other product');
assert.doesNotMatch(html,/<script\s+src=/i,'no third party scripts');
console.log('PASS Botánica Cloud delivered TEST results recovery UI syntax, no order writes, exact owner auth, no credential persistence; no live requests executed');
