#!/usr/bin/env node
'use strict';
// Candidate only. Does not write SQL, deploy Edge Functions or create licenses.
// One-shot patch strictly retains all V17/V16 code outside the new QA branch.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),get=p=>fs.readFileSync(path.join(root,p),'utf8');
const {build}=require('../tools/prepare_test_only_backend_v13.cjs');
const {patch:to14}=require('../tools/allow_catalog_public_origin_v14.cjs');
const {patch:to15}=require('../tools/route_paid_catalog_urls_v15.cjs');
const {patch:to16}=require('../tools/enable_test_final_v16.cjs');
const {patch:to18}=require('../tools/prepare_test_license_pairing_v18.cjs');
const v16=to16(to15(to14(build(get('guest/qa/isolated_free/edge_guest_flow_v12_readonly_snapshot.ts')))));
const v18=to18(v16);
assert(v18.length>v16.length&&v18.length<v16.length+4200,'QA extension exceeds isolated scope');
assert.equal(v18.split("if(action==='link_test_license')").length,2,'single QA bridge only');
const start=v18.indexOf("if(action==='link_test_license')");
const end=v18.indexOf("if(action==='list')",start);
assert(start>0&&end>start);
const added=v18.slice(start,end);
assert.equal(v18.slice(0,start)+v18.slice(end),v16,'all prior code must be byte-identical');
assert(v18.indexOf("const ctx=await managerContext(c,req);if(!ctx)")<start,'owner must be authenticated first');
for(const [label,regex] of [
 ['license product GUEST only',/String\(lic\.metadata\?\.product\|\|''\)!=='guests'/],
 ['source tester only',/lic\.source!=='tester'/],
 ['active only',/lic\.status!=='active'/],
 ['dedicated synthetic QA label',/startsWith\('GUEST QA '\)/],
 ['activated wedding required',/uuid\.test\(String\(lic\.wedding_id\|\|''\)\)/],
 ['actual active member required',/wedding_members/],
 ['QA recipient fake email',/endsWith\('@example\.invalid'\)/],
 ['synthetic TEST mode',/order\.mode!=='test'/],
 ['delivered orders only',/order\.status!=='delivered'/],
 ['registered test-only template',/templateSpec\(order\.template_id\)\.testOnly!==true/],
 ['prevent duplicate license assignment',/guest_qa_license_already_has_order/],
 ['atomic unlinked-only write',/\.eq\('mode','test'\)\.eq\('status','delivered'\)\.is\('license_id',null\)/],
 ['writes license field alone',/update\(\{license_id:licenseId,updated_at:now\(\)\}\)/]
])assert.match(added,regex,label);
assert.doesNotMatch(added,/resend\(|send_email|stripe|update\(\{status:/,'no purchase, delivery or order-status mutation');
assert.match(v18,/mode:order\.mode==='test'\?'test':'production'/,'V16 TEST mode fix preserved');
assert.equal(v18.split("if(action==='create_paid')").length,2,'commercial path unchanged');
assert.throws(()=>to18(v18),/ALREADY_APPLIED/);
assert.throws(()=>to18(v16.replace("const ctx=await managerContext(c,req);if(!ctx)","")),/MISSING_OWNER_AUTH/);
console.log('PASS isolated GUEST-only test-license pairing candidate: existing manager auth, GUEST source, active member, QA only, atomic link; NO DEPLOY');
