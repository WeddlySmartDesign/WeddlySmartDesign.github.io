#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {build,stage,stageWithExpectedCenterSha,CENTER_FILE}=require('../tools/stage_owner_center_v2.cjs');
const registry={
 templates:{
  'veil-light':{id:'veil-light',version:'5.3.3',mode:'native',status:'commercially-frozen',applyApi:'VEIL_APPLY_CONFIG'},
  botanica:{id:'botanica',version:'14.7',mode:'iframe',status:'certification-pending',applyApi:'BOTANICA_APPLY_CONFIG',src:null}
 }
};
const legacy="const CATALOG_RENDERERS={'veil-light':{label:'VEIL LIGHT',apply:c=>{if(typeof window.VEIL_APPLY_CONFIG!=='function')throw new Error('renderer_unavailable');return window.VEIL_APPLY_CONFIG(c)}}};\nfunction rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(!r)throw new Error('template_renderer_unavailable:'+id);return r}\nfunction applyOrderConfig(order,cfg){return rendererFor(order).apply(cfg)}";
const html='<!doctype html><html><head></head><body><script id="wsd-production-workbench-script">'+legacy+
 "\nfunction openCenter(){\n  closeTool();\n}\nfunction hideCenter(){\n  root.classList.add('off');\n}\n"+
 "const x=await call(FLOW,{action:'create_test',email:'',templateId:'veil-light'});"+
 "\nconst reopen=document.createElement('button');reopen.id='wsdProdBtn';"+
 "</script></body></html>";
const viewer='/* GUEST_CATALOG_OWNER_VIEWER_V2 */ const sameOrigin=u=>u;';
const overlay='/* GUEST_STAGE_OWNER */ const iframeAdapter=true;';
const output=build(html,registry,viewer,overlay);
assert.ok(!output.includes(legacy),'frozen single-renderer hardcoding must be replaced');
assert.match(output,/GUEST_STAGE_OWNER_REGISTRY/);
assert.match(output,/GUEST_STAGE_OWNER\.rendererFor/);
assert.match(output,/GUEST_STAGE_OWNER\.applyOrderConfig/);
assert.match(output,/GUEST_STAGE_OWNER\.open\(\)/);
assert.match(output,/GUEST_STAGE_OWNER\.close\(\)/);
assert.match(output,/guestStageTemplateId/);
assert.match(output,/GUEST_BOTANICA_V14_7_TEST_ONLY_ASSET.html/);
assert.ok(output.includes('VEIL_APPLY_CONFIG'),'legacy VEIL remains native');
assert.ok(output.includes('BOTANICA_APPLY_CONFIG'),'Botánica renderer resolved generically');
assert.equal(registry.templates.botanica.src,null,'do not mutate production registry');
assert.match(output,/Content-Security-Policy/);
assert.match(output,/connect-src 'none'/);
assert.match(output,/form-action 'none'/);
assert.match(output,/"src":"\.\/GUEST_BOTANICA_V14_7_TEST_ONLY_ASSET.html"/);
assert.throws(()=>build(html.replace("templateId:'veil-light'","templateId:'botanica'"),registry,viewer,overlay),/source_drift:generic_test_creation/);
assert.throws(()=>build(html.replace("function hideCenter()","function closeCenter()"),registry,viewer,overlay),/source_drift:center_preview/);
assert.throws(()=>build(html,{templates:{...registry.templates,botanica:{...registry.templates.botanica,status:'commercially-frozen'}}},viewer,overlay),/unsafe_staged_asset:botanica/);
const third=structuredClone(registry);
third.templates['design-03']={id:'design-03',version:'1.0.0',mode:'iframe',status:'certification-pending',applyApi:'GUEST_APPLY_CONFIG',src:null};
const staged=build(html,third,viewer,overlay,{botanica:'GUEST_BOTANICA_V14_7_TEST_ONLY_ASSET.html','design-03':'GUEST_STAGE_design-03_v1-0-0.html'});
assert.match(staged,/GUEST_STAGE_design-03_v1-0-0\.html/,'third design must stage without code per-template');
assert.equal(third.templates['design-03'].src,null,'never mutate canonical registry');
const fourth=structuredClone(third);
fourth.templates['design-1000']={id:'design-1000',version:'10.0.0',mode:'iframe',status:'commercially-frozen',applyApi:'GUEST_APPLY_CONFIG',src:'/guest/catalog-assets/design-1000/10.0.0/index.html'};
const mature=build(html,fourth,viewer,overlay,{botanica:'GUEST_BOTANICA_V14_7_TEST_ONLY_ASSET.html','design-03':'GUEST_STAGE_design-03_v1-0-0.html','design-1000':'GUEST_STAGE_design-1000_v10-0-0.html'});
assert.match(mature,/GUEST_STAGE_design-1000_v10-0-0\.html/,'offline regression of any future certified iframe');
assert.equal(fourth.templates['design-1000'].src,'/guest/catalog-assets/design-1000/10.0.0/index.html','published manifest must stay immutable');
assert.throws(()=>build(html,third,viewer,overlay,{botanica:'GUEST_BOTANICA_V14_7_TEST_ONLY_ASSET.html','veil-light':'GUEST_STAGE_legacy.html'}),/unsafe_staged_asset:veil-light/);
const fakeApproved=structuredClone(third);fakeApproved.templates['design-03'].src='/guest/catalog-assets/design-03/fake.html';
assert.throws(()=>build(html,fakeApproved,viewer,overlay,{'design-03':'GUEST_STAGE_design-03_v1-0-0.html'}),/unsafe_staged_asset:design-03/);
assert.throws(()=>build(html,third,viewer,overlay,{bogus:'bogus.html'}),/unsafe_staged_asset:bogus/);
assert.throws(()=>build(html,third,viewer,overlay,{'design-03':'../escape.html'}),/unsafe_staged_filename:design-03/);
assert.throws(()=>build(html,third,viewer,overlay,{botanica:'https://evil.example'}),/unsafe_staged_filename:botanica/);
assert.throws(()=>build(html.replace('<head>','<head data-drift>'),registry,viewer,overlay),/source_drift:offline_csp/);
assert.throws(()=>build(html,registry,'wrong viewer',overlay),/unexpected_source_files/);
// Positive file-IO integration: generate an entire generic local package from
// synthetic, checksum-pinned HTML assets (never the published masters).
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-stage-pack-'));
const put=(name,data)=>{const p=path.join(tmp,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,data);return p};
try{
 const centerFile=put('center-original.html',html);
 const sources={botanica:put('botanica.html','<html>Botánica ficticia</html>'),
  'design-03':put('design03.html','<html>Design 03 ficticio</html>'),
  'design-1000':put('design1000.html','<html>Design 1000 ficticio</html>')};
 put('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',JSON.stringify({schemaVersion:'guest-catalog-owner-renderers-v2',templates:fourth.templates}));
 put('guest/GUEST_PROJECT_STATUS_V1.json',JSON.stringify({designs:{
  botanica:{status:'certification-pending',version:'14.7',candidateSha256:sha(fs.readFileSync(sources.botanica))},
  'design-03':{status:'certification-pending',version:'1.0.0',visualMasterSha256:sha(fs.readFileSync(sources['design-03']))},
  'design-1000':{status:'commercially-frozen',version:'10.0.0',visualMasterSha256:sha(fs.readFileSync(sources['design-1000']))}
 }}));
 put('guest/catalog/guest-catalog-owner-viewer-v2.js',viewer);
 put('guest/catalog/guest-owner-stage-overlay-v2.js',overlay);
 const outputDir=path.join(tmp,'new-pack');
 const result=stageWithExpectedCenterSha(centerFile,sources,outputDir,tmp,sha(Buffer.from(html)));
 assert.equal(result.assets.length,3,'all candidate and frozen iframe assets copied');
 assert.equal(result.stagedCenterFile,CENTER_FILE);
 assert(fs.existsSync(path.join(outputDir,'STAGING_MANIFEST.json')));
 const stagedHtml=fs.readFileSync(path.join(outputDir,CENTER_FILE),'utf8');
 assert(stagedHtml.includes("connect-src 'none'"),'pack cannot reach live backend');
 assert(stagedHtml.includes('GUEST_STAGE_design-03_v1-0-0.html'));
 assert(stagedHtml.includes('GUEST_STAGE_design-1000_v10-0-0.html'));
 for(const asset of result.assets)assert.equal(sha(fs.readFileSync(path.join(outputDir,asset.file))),asset.sha256,'copied resource must match original SHA');
 assert.equal(fs.readFileSync(centerFile,'utf8'),html,'original center is immutable');
 assert.throws(()=>stageWithExpectedCenterSha(centerFile,sources,outputDir,tmp,sha(Buffer.from(html))),/output_dir_must_not_exist/);
 assert.throws(()=>stage(centerFile,sources,path.join(tmp,'must-not-be-created'),tmp),/preproduction_center_sha256_mismatch/,'CLI entry always insists on historical actual center SHA');
 const wrong={...sources,botanica:put('tampered.html','<html>wrong bytes</html>')};
 assert.throws(()=>stageWithExpectedCenterSha(centerFile,wrong,path.join(tmp,'wrong-pack'),tmp,sha(Buffer.from(html))),/asset_sha256_mismatch:botanica/);
 assert(!fs.existsSync(path.join(tmp,'wrong-pack')),'no partial output on digest failure');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
console.log('PASS generic owner stage: 3 synthetic iframe copies incl certified D1000, physical ZIP-input-style pack creation, SHA gates, no overwrites, CSP/no network. NO DEPLOY.');
