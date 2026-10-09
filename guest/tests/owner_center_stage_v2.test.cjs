#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {build,stagedRegistry}=require('../tools/stage_owner_center_v2.cjs');
const registry={
 templates:{
  'veil-light':{id:'veil-light',version:'5.3.3',mode:'native',status:'commercially-frozen',applyApi:'VEIL_APPLY_CONFIG'},
  botanica:{id:'botanica',version:'14.7',mode:'iframe',status:'certification-pending',applyApi:'BOTANICA_APPLY_CONFIG',src:null}
 }
};
const legacy="const CATALOG_RENDERERS={'veil-light':{label:'VEIL LIGHT',apply:c=>{if(typeof window.VEIL_APPLY_CONFIG!=='function')throw new Error('renderer_unavailable');return window.VEIL_APPLY_CONFIG(c)}}};\nfunction rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(!r)throw new Error('template_renderer_unavailable:'+id);return r}\nfunction applyOrderConfig(order,cfg){return rendererFor(order).apply(cfg)}";
const html='<!doctype html><html><body><script id="wsd-production-workbench-script">'+legacy+
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
const r=stagedRegistry(registry);
assert.equal(registry.templates.botanica.src,null,'do not mutate production registry');
assert.equal(r.templates.botanica.src,'./GUEST_BOTANICA_V14_7_TEST_ONLY_ASSET.html');
assert.throws(()=>build(html.replace("templateId:'veil-light'","templateId:'botanica'"),registry,viewer,overlay),/source_drift:generic_test_creation/);
assert.throws(()=>build(html.replace("function hideCenter()","function closeCenter()"),registry,viewer,overlay),/source_drift:center_preview/);
assert.throws(()=>build(html,{templates:{...registry.templates,botanica:{...registry.templates.botanica,status:'commercially-frozen'}}},viewer,overlay),/botanica_manifest_drift/);
assert.throws(()=>build(html,registry,'wrong viewer',overlay),/unexpected_source_files/);
console.log('PASS generic owner V2 local-only staging: two designs, frozen native VEIL, Botánica iframe, no registry mutation, 4 fail-closed mutations. NOT DEPLOYED.');
