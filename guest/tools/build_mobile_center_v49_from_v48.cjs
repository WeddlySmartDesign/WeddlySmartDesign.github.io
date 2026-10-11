#!/usr/bin/env node
'use strict';
// V4.9 combined owner center: isolated upgrade of exactly signed V4.8.
// Botánica remains the proven embedded renderer; D03+ uses shared Cloudflare bridge.
// No checkout, Supabase write, original visual edit, or distribution from this builder.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const BASE_SHA='5a35f482bce23684496a227f3e9161093a9ef93dd6c9d9fc99dfc41ec7b56835';
const BASE_BYTES=45558028;
const MASTER_SHA='fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function once(s,a,b,label){const count=s.split(a).length-1;if(count!==1)throw Error('SOURCE_DRIFT_'+label+':'+count);return s.replace(a,b)}
function build(buffer,extensionSource){
 if(!Buffer.isBuffer(buffer)||buffer.length!==BASE_BYTES||sha(buffer)!==BASE_SHA)throw Error('FROZEN_V48_SHA_SIZE_MISMATCH_REFUSE');
 let ext=extensionSource.trimEnd()+'\n\n';
 assert(ext.includes('function guestCatalogRemote(order,cfg)'),'missing shared viewer extension');
 ext=ext.replace('Local owner Center V4.7 extension','Local owner Center V4.9 extension')
   .replace('min-height:62px;background:#fff;', 'min-height:86px;background:#fff;')
   .replace('padding:9px 14px;border-bottom','padding:32px 14px 8px;border-bottom');
 let s=buffer.toString('utf8');
 const native="const CATALOG_RENDERERS={'veil-light':{label:'VEIL LIGHT',apply:c=>{if(typeof window.VEIL_APPLY_CONFIG!=='function')throw new Error('renderer_unavailable');return window.VEIL_APPLY_CONFIG(c)}},'botanica':{label:'BOTÁNICA · SOLO PRUEBA',apply:(c,o)=>window.GUEST_CENTER_V47.apply(o,c)}};";
 s=once(s,native,native+'\n'+ext,'generic_extension');
 const oldRoute="function rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(!r)throw new Error('template_renderer_unavailable:'+id);if(id==='botanica'&&order?.mode!=='test')throw new Error('botanica_only_test_orders');return r}";
 const newRoute="function rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(r){if(id==='botanica'&&order?.mode!=='test')throw new Error('botanica_only_test_orders');return r}if(!/^[a-z][a-z0-9-]{0,40}$/.test(id))throw new Error('invalid_template_id');return {label:id,apply:cfg=>guestCatalogRemote(order,cfg)}}";
 s=once(s,oldRoute,newRoute,'generic_router');
 s=once(s,"function openCenter(){\n  window.GUEST_CENTER_V47.close();","function openCenter(){\n  if(guestCatalogRemoteActive&&window.__guestCatalogClose)window.__guestCatalogClose();\n  window.GUEST_CENTER_V47.close();",'shared_center_close');
 s=once(s,"reopen.style.display=window.GUEST_CENTER_V47.active()?'none':'block';","reopen.style.display=(window.GUEST_CENTER_V47.active()||guestCatalogRemoteActive)?'none':'block';",'no_duplicate_back');
 s=once(s,'GUEST · Centro móvil · V4.8 · Botánica TEST','GUEST · Centro móvil · V4.9 · CATÁLOGO TEST','version_label');
 const master=s.match(/<script id="guest-v47-botanica-master" type="application\/octet-stream" data-sha256="([a-f0-9]{64})">([A-Za-z0-9+/=]+)<\/script>/);
 assert(master&&master[1]===MASTER_SHA&&sha(Buffer.from(master[2],'base64'))===MASTER_SHA,'embedded approved Botánica bytes changed');
 assert(s.includes("if(id==='botanica'&&order?.mode!=='test')"),'commercial Botánica safety lost');
 return Buffer.from(s,'utf8');
}
if(require.main===module){
 const [input,output]=process.argv.slice(2);
 if(!input||!output)throw Error('Usage: node build_mobile_center_v49_from_v48.cjs V48.html NEW_V49.html');
 if(fs.existsSync(output))throw Error('OUTPUT_ALREADY_EXISTS');
 const ext=fs.readFileSync(path.join(__dirname,'owner_center_generic_extension_v47.js'),'utf8');
 const out=build(fs.readFileSync(input),ext);fs.writeFileSync(output,out,{flag:'wx'});
 console.log(JSON.stringify({bytes:out.length,sha256:sha(out),baseSha256:BASE_SHA,embeddedMasterSha256:MASTER_SHA}));
}
module.exports={build,BASE_SHA,BASE_BYTES,MASTER_SHA};