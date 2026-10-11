#!/usr/bin/env node
'use strict';
/* Contract only. No service calls, no Supabase changes. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {prepare}=require('../tools/prepare_live_catalog_registry.cjs');
const generation=cp.spawnSync(process.execPath,[path.join(__dirname,'../tools/generate_backend_catalog_registry.cjs'),'--mode','test-only'],{encoding:'utf8'});
assert.equal(generation.status,0,generation.stderr);
const tag='const CATALOG_TEMPLATES:any=';
const marker=';\n// Call assertCatalogOrderMode(spec,mode) inside ALL order-creation routes (test/checkout).';
const generated=generation.stdout;
const json=JSON.parse(generated.slice(generated.indexOf(tag)+tag.length,generated.indexOf(marker)));
assert(json['veil-light']&&json.botanica);
const old={'veil-light':json['veil-light'],botanica:json.botanica};
const live=
 "/* unrelated existing backend must remain byte-identical */\n"+
 tag+JSON.stringify(old,null,2)+marker+
 "\nfunction assertCatalogOrderMode(spec:any,mode:'test'|'production'){\n if(spec?.testOnly===true&&mode!=='test')throw new Error('template_test_only');\n}\n"+
 "function templateSpec(v:any){const id=String(v),x=CATALOG_TEMPLATES[id];if(!x||x.active!==true)throw new Error('template_unavailable');return x;}\n"+
 "const IMMUTABLE_CANARY='GUEST-DO-NOT-EDIT-ORDER-FLOW';\n";
const next={...json,'synthetic-future-03':{id:'synthetic-future-03',version:'1.0.0',active:true,testOnly:true,typographyVariants:['classic'],defaultTypographyVariant:'classic',renderer:'synthetic-future-03-v1-0-0'}};
const target=generated.replace(tag+JSON.stringify(json,null,2),tag+JSON.stringify(next,null,2));
const success=prepare(live,target,'synthetic-future-03');
assert(success.source.includes('GUEST-DO-NOT-EDIT-ORDER-FLOW'));
assert(success.source.includes("if(spec?.testOnly===true&&mode!=='test')"));
assert.deepEqual(success.report.addedTestOnly,['synthetic-future-03']);
assert(!success.report.deployPerformed);
assert.equal(success.source.slice(0,live.indexOf(tag)),live.slice(0,live.indexOf(tag)));
assert.equal(success.source.slice(success.source.indexOf(marker)),live.slice(live.indexOf(marker)));
const broken=tag+JSON.stringify({...next,botanica:{...json.botanica,testOnly:false}},null,2)+marker;
assert.throws(()=>prepare(live,broken+' trailing','synthetic-future-03'),/EXISTING_TEMPLATE_DRIFT/);
assert.throws(()=>prepare(live,target.replace('"testOnly": true','"testOnly": false'),'synthetic-future-03'),/EXISTING_TEMPLATE_DRIFT|REQUIRED_TEMPLATE_MUST_BE_TEST_ONLY/);
assert.throws(()=>prepare(live,target,'veil-light'),/REQUIRED_TEMPLATE_MUST_BE_TEST_ONLY/);
assert.throws(()=>prepare(live.replace("if(spec?.testOnly===true&&mode!=='test')","if(false)"),target,'synthetic-future-03'),/BACKEND_GUARDS_DRIFT/);
assert.throws(()=>prepare(live+live,target,'synthetic-future-03'),/CATALOG_ANCHOR_MISSING_OR_DUPLICATE/);
assert.throws(()=>prepare(live,target.replace(marker,''),'synthetic-future-03'),/CATALOG_END_MISSING_OR_DUPLICATE/);
console.log('PASS read-only reusable Supabase TEST registry updater: new template accepted, guards unchanged, existing ID/version/mode safe, drift and attempts to promote rejected');
