#!/usr/bin/env node
'use strict';
// Produce a separate V4.7 GUEST mobile center COPY from an exact pinned V4.6.
// Do not edit, rewrite, or replace VEIL LIGHT original, ONE, Partner, STUDIO.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),path=require('node:path');
const BASE_SHA='a95984b658e560a9c3fca4bd92315b41c1b92cc4f6d47fffeed890da6f1f2133';
const BASE_LENGTH=30038021;
const NATIVE="const CATALOG_RENDERERS={'veil-light':{label:'VEIL LIGHT',apply:c=>{if(typeof window.VEIL_APPLY_CONFIG!=='function')throw new Error('renderer_unavailable');return window.VEIL_APPLY_CONFIG(c)}}};";
const RESOLVE="function rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(!r)throw new Error('template_renderer_unavailable:'+id);return r}";
const CENTER="function openCenter(){\n  closeTool();";
const HIDE="function hideCenter(){\n  root.classList.add('off');\n  reopen.style.display='block';\n}";
function replaceOnce(s,a,b,label){assert.equal(s.split(a).length,2,'PATCH_SOURCE_DRIFT:'+label);return s.replace(a,b)}
function patch(b){
 if(!Buffer.isBuffer(b)||b.length!==BASE_LENGTH||crypto.createHash('sha256').update(b).digest('hex')!==BASE_SHA)
  throw Error('FROZEN_V46_SHA_SIZE_MISMATCH_REFUSE');
 const ext=fs.readFileSync(path.join(__dirname,'owner_center_generic_extension_v47.js'),'utf8');
 assert(ext.includes('guestCatalogRemote(')&&ext.includes("guest-catalog-config-v1"));
 let s=b.toString('utf8');
 s=replaceOnce(s,NATIVE,NATIVE+'\n'+ext,'insert_generic_extension');
 s=replaceOnce(s,RESOLVE,"function rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(r)return r;if(!/^[a-z][a-z0-9-]{0,40}$/.test(id))throw new Error('invalid_template_id');return {label:id,apply:cfg=>guestCatalogRemote(order,cfg)}}",'generic_dispatch');
 s=replaceOnce(s,CENTER,"function openCenter(){\n  if(guestCatalogRemoteActive&&window.__guestCatalogClose)window.__guestCatalogClose();\n  closeTool();",'center_cleanup');
 s=replaceOnce(s,HIDE,"function hideCenter(){\n  root.classList.add('off');\n  reopen.style.display=guestCatalogRemoteActive?'none':'block';\n}",'generic_viewer_front');
 const out=Buffer.from(s,'utf8');assert(out.length>b.length&&out.includes(b.subarray(0,8192)),'byte integrity');
 return out;
}
if(require.main===module){
 const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node build_mobile_center_v47_generic.cjs FROZEN_V4_6.html NEW_V4_7.html');
 if(fs.existsSync(output))throw Error('OUTPUT_ALREADY_EXISTS');
 const b=patch(fs.readFileSync(input));fs.writeFileSync(output,b,{flag:'wx'});
 console.log(JSON.stringify({status:'PASS_NEW_COPY',size:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex'),baseSha256:BASE_SHA}));
}
module.exports={patch,BASE_SHA,BASE_LENGTH};
