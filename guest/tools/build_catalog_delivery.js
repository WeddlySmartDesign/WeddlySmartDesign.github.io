#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
function fail(m){console.error(m);process.exit(1)}
const [input,output,publicToken,templateId,...flags]=process.argv.slice(2);
const testOnly=flags.includes('--test-only'),flowIndex=flags.indexOf('--flow-url');
const stagingFlow=flowIndex>=0?flags[flowIndex+1]:null;
if(flowIndex>=0&&!testOnly)fail('flow_url_override_requires_test_only');
if(testOnly&&(!stagingFlow||flowIndex<0))fail('test_only_requires_isolated_flow_url');
if(!input||!output||!publicToken||!templateId)fail('Usage: build_catalog_delivery.js <input.html> <output.html> <publicToken> <templateId>');
const guestDir=path.resolve(__dirname,'..');
const registry=JSON.parse(fs.readFileSync(path.join(guestDir,'GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'),'utf8'));
const spec=(registry.templates||[]).find(x=>x.id===templateId);
if(!spec)fail('Unknown catalog template: '+templateId);
if(!testOnly&&spec.status!=='commercially-frozen')fail('Template is not commercially frozen: '+templateId);
if(testOnly){
 if(spec.status!=='certification-pending')fail('test_only_requires_pending_template');
 const project=JSON.parse(fs.readFileSync(path.join(guestDir,'GUEST_PROJECT_STATUS_V1.json'),'utf8'));
 const pin=project.designs?.[templateId];
 if(pin?.version!==spec.version||pin?.status!==spec.status||!/^[a-f0-9]{64}$/.test(pin.candidateSha256||''))fail('test_candidate_pin_missing_or_mismatch');
 const sourceHash=crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex');
 if(sourceHash!==pin.candidateSha256)fail('test_candidate_sha256_mismatch');
}
function checkedIsolatedFlow(raw){
 let u;try{u=new URL(raw)}catch{fail('isolated_flow_url_invalid')}
 const host=u.hostname.toLowerCase();
 if(u.protocol!=='https:'||!/^([a-z0-9-]+)\.supabase\.co$/.test(host)||
   host==='dnjsxequwgtyyauuofxj.supabase.co'||host==='kijigxprredusnaaazow.supabase.co'||
   u.pathname!=='/functions/v1/guest-invitation-flow'||u.search||u.hash||u.username||u.password)
  fail('isolated_flow_url_invalid_or_protected_project');
 return u.href;
}
const isolatedFlow=testOnly?checkedIsolatedFlow(stagingFlow):null;
let html=fs.readFileSync(input,'utf8');
let runtime=fs.readFileSync(path.join(guestDir,'guest-catalog-delivery-runtime-v1.js'),'utf8');
if(testOnly){
 const oldFlow="const FLOW='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow';";
 if(runtime.split(oldFlow).length!==2)fail('shared_delivery_runtime_source_drift');
 runtime=runtime.replace(oldFlow,'const FLOW='+JSON.stringify(isolatedFlow)+';');
}
const adapterName='guest-catalog-template-'+templateId+'-adapter-v1.js';
const adapterPath=path.join(guestDir,adapterName);
if(!fs.existsSync(adapterPath))fail('Missing template adapter: '+adapterName);
const adapter=fs.readFileSync(adapterPath,'utf8');
if(templateId==='veil-light'&&!html.includes('VEIL_APPLY_CONFIG'))fail('VEIL LIGHT renderer interface not found in source master');
if(testOnly&&!html.includes('BOTANICA_APPLY_CONFIG')&&templateId==='botanica')fail('botanica_candidate_renderer_unavailable');
html=html.replace(/\s*<script id=["']wsd-final-script["']>[\s\S]*?<\/script>\s*/g,'\n');
html=html.replace(/\s*<script id=["']guest-catalog-delivery-runtime["']>[\s\S]*?<\/script>\s*/g,'\n');
html=html.replace(/\s*<script id=["']guest-catalog-template-adapter["']>[\s\S]*?<\/script>\s*/g,'\n');
html=html.replace(/\s*<script id=["']guest-catalog-delivery-boot["']>[\s\S]*?<\/script>\s*/g,'\n');
const boot='<script id="guest-catalog-delivery-runtime">'+runtime+'</script>\n'+'<script id="guest-catalog-template-adapter">'+adapter+'</script>\n'+'<script id="guest-catalog-delivery-boot">(()=>{const templateId='+JSON.stringify(templateId)+';const publicToken='+JSON.stringify(publicToken)+';const adapter=window.__GuestCatalogTemplateAdapters?.[templateId];if(!adapter)throw new Error("catalog_template_adapter_unavailable:"+templateId);window.__GuestCatalogDeliveryRuntime.boot({publicToken,applyConfig:cfg=>adapter.applyConfig(cfg)}).catch(e=>{console.error("[GUEST catalog delivery]",e);let m=document.getElementById("wsdCatalogDeliveryError");if(!m){m=document.createElement("div");m.id="wsdCatalogDeliveryError";m.hidden=true;document.body.appendChild(m)}m.dataset.error=String(e?.message||"request_failed")});})();</script>';
if(!html.includes('</body>'))fail('Source HTML has no closing body');
if(testOnly){
 // This file is an INTERNAL, UNPUBLISHED final-delivery preview, not a sellable asset.
 const marker='<aside id="guestCatalogCertificationBanner" role="note" style="position:fixed;right:10px;bottom:10px;z-index:2147483000;padding:7px 11px;background:#252323;color:#fff;font:600 12px system-ui;border-radius:7px;pointer-events:none">SOLO PRUEBA · NO PUBLICAR</aside>';
 html=html.replace('</body>',marker+'</body>');
 const robots='<meta name="robots" content="noindex,nofollow,noarchive">';
 html=html.includes('</head>')?html.replace('</head>',robots+'</head>'):robots+html;
}
html=html.replace('</body>',boot+'\n</body>');
if(testOnly&&(/dnjsxequwgtyyauuofxj|kijigxprredusnaaazow/.test(html)))fail('staging_contains_protected_production_or_studio_reference');
if(html.includes('id="wsd-final-script"')||html.includes("id='wsd-final-script'"))fail('Legacy final loader was not removed');
if(!html.includes('guest-catalog-delivery-runtime'))fail('Catalog delivery runtime was not injected');
if(!html.includes(publicToken))fail('Public token was not embedded');
fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});
fs.writeFileSync(output,html);
console.log(JSON.stringify({ok:true,input:path.resolve(input),output:path.resolve(output),templateId,templateVersion:spec.version,testOnly,isolatedFlowHost:testOnly?new URL(isolatedFlow).hostname:null,bytes:Buffer.byteLength(html)}));
