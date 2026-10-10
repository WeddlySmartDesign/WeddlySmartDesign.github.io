#!/usr/bin/env node
'use strict';
// No browser, no real order, no Cloud. A wholly fictional Design 03 uses the
// exact same immutable static packager as Botanica, with no template-specific edits.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-next-design-'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
try{
 const guest=path.join(tmp,'guest');fs.mkdirSync(path.join(guest,'tools'),{recursive:true});
 fs.copyFileSync(path.join(root,'guest/tools/build_catalog_static_preview.cjs'),path.join(guest,'tools/build_catalog_static_preview.cjs'));
 const registry=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json')));
 const status=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_PROJECT_STATUS_V1.json')));
 const html=Buffer.from('<!doctype html><html><body><script>window.GUEST_APPLY_CONFIG=function(){return true}</script></body></html>');
 registry.templates['design-03']={id:'design-03',version:'1.0.0',mode:'iframe',src:null,applyApi:'GUEST_APPLY_CONFIG',status:'certification-pending'};
 status.designs['design-03']={version:'1.0.0',status:'certification-pending',candidateSha256:sha(html)};
 fs.writeFileSync(path.join(guest,'GUEST_CATALOG_OWNER_RENDERERS_V2.json'),JSON.stringify(registry));
 fs.writeFileSync(path.join(guest,'GUEST_PROJECT_STATUS_V1.json'),JSON.stringify(status));
 const asset=path.join(guest,'catalog-assets/design-03/1.0.0/index.html');fs.mkdirSync(path.dirname(asset),{recursive:true});fs.writeFileSync(asset,html);
 for(const p of ['guest/catalog-final.html','guest-review-v1.html','guest/catalog-questionnaire.html','guest/guest-catalog-delivery-runtime-v1.js','guest/catalog/guest-catalog-owner-viewer-v2.js']){
  const to=path.join(tmp,p);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(root,p),to);
 }
 const dest=path.join(tmp,'export');
 const res=cp.spawnSync(process.execPath,[path.join(guest,'tools/build_catalog_static_preview.cjs'),'--template','design-03','--output',dest],{encoding:'utf8'});
 assert.equal(res.status,0,'D03 common packager failed: '+res.stderr);
 const m=JSON.parse(fs.readFileSync(path.join(dest,'GUEST_STAGE_MANIFEST.json')));
 assert.equal(m.design.templateId,'design-03');assert.equal(m.design.visualIncluded,true);assert.equal(m.commercialApproved,false);
 assert.equal(m.status,'PREPRODUCTION_DO_NOT_SELL');
 assert.equal(sha(fs.readFileSync(path.join(dest,'guest/catalog-assets/design-03/1.0.0/index.html'))),sha(html));
 const render=JSON.parse(fs.readFileSync(path.join(dest,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json')));
 assert.equal(render.templates['design-03'].src,'/guest/catalog-assets/design-03/1.0.0/index.html');
 assert.equal(render.templates['design-03'].status,'certification-pending');
 assert.equal(registry.templates['design-03'].src,null,'original manifest must remain immutable');
 fs.appendFileSync(asset,'tampered');
 const fail=cp.spawnSync(process.execPath,[path.join(guest,'tools/build_catalog_static_preview.cjs'),'--template','design-03','--output',path.join(tmp,'tampered')],{encoding:'utf8'});
 assert.notEqual(fail.status,0,'tampered master should be refused');
 assert.match(fail.stderr,/FROZEN_VISUAL_SHA256_OR_RENDERER_MISMATCH/);
 assert(!fs.existsSync(path.join(tmp,'tampered','GUEST_STAGE_MANIFEST.json')),'never write release manifest on SHA failure');
 console.log('PASS fictional D03 generic STATIC host package, SHA-pin, pending sale block, zero per-template code and tampering refusal');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
