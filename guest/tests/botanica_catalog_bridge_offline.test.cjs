'use strict';
// Offline contract smoke test: never contacts a real backend, Stripe or customers.
// Run from repository root: node guest/tests/botanica_catalog_bridge_offline.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {spawnSync} = require('node:child_process');
const {mkdtempSync,rmSync,writeFileSync} = require('node:fs');
const os=require('node:os');

const root=path.resolve(__dirname,'..');
const read=(name)=>fs.readFileSync(path.join(root,name),'utf8');
const registry=JSON.parse(read('GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'));
const registered=registry.templates.find(t=>t.id==='botanica');
assert(registered,'Botánica must exist in catalog registry');
assert.equal(registered.status,'certification-pending','Do not bypass commercial gate');
assert.equal(registered.scalabilityCertified,false);
assert.equal(registered.version,'14.7');
assert.equal(registry.templates.find(t=>t.id==='veil-light').status,'commercially-frozen');
console.log('PASS: registry is pending, VEIL LIGHT remains certified');

let applied=null;
const context = {
  window:{ BOTANICA_APPLY_CONFIG:cfg=>{applied=cfg;return true;}},
  structuredClone,
};
context.window.window=context.window;
vm.createContext(context);
vm.runInContext(read('guest-catalog-template-botanica-adapter-v1.js'),context,{timeout:3000});
const adapter=context.window.__GuestCatalogTemplateAdapters?.botanica;
assert(adapter,'Adapter not installed');
assert.equal(adapter.id,'botanica');
assert.equal(adapter.version,'14.7');
const forwarded={couple:{name1:'Alba',name2:'Nicolás'},agenda:{enabled:true,moments:[]}};
assert.equal(adapter.applyConfig(forwarded),true);
assert.equal(applied,forwarded,'Adapter should forward original config');
console.log('PASS: Botánica adapter works with unchanged shared config');

async function bootScenario(query, expectedRoute, opts={}){
  const calls=[];
  const guestConfig={
    template:{id:'botanica',version:'14.7'},
    couple:{name1:'Alba',name2:'Nicolás'},rsvp:{route:'#',ctaLabel:'Confirmar asistencia'},
    practical:{bus:{enabled:false},accommodation:{enabled:false},gift:{enabled:false},playlist:{enabled:false}}
  };
  const url='https://example.invalid/botanica.html'+query;
  const status={hidden:true,dataset:{}};
  const page={
    window:{},
    location:new URL(url),
    document:{getElementById:id=>id==='wsdCatalogDeliveryStatus'?status:null,
      createElement:()=>({hidden:true,dataset:{}}),body:{appendChild:()=>{}}},
    URL,
    structuredClone,
    fetch:async (u,payload)=>{
      calls.push({u,payload});
      return {ok: !opts.serverError, json:async()=>opts.serverError?{ok:false,error:'test_rejected'}:{ok:true,order:{id:'fictional-order',config:guestConfig}}};
    }
  };
  page.window.window=page.window;
  vm.createContext(page);
  vm.runInContext(read('guest-catalog-delivery-runtime-v1.js'),page,{timeout:3000});
  const runtime=page.window.__GuestCatalogDeliveryRuntime;
  assert(runtime,'shared catalog runtime must boot');
  const inspected=runtime.context();
  assert.equal(inspected.lang,query.includes('lang=en')?'en':'es');
  if(opts.serverError){
    await assert.rejects(()=>runtime.boot({publicToken:'fictional-token',applyConfig:()=>{}}),/test_rejected/);
    return;
  }
  let rendered=null;
  await runtime.boot({publicToken:'fictional-token',applyConfig:cfg=>{rendered=cfg;return true;}});
  assert(rendered,'Renderer must receive config');
  assert.equal(rendered.rsvp.route,expectedRoute,'Shared recipient URL was not propagated');
  assert.equal(guestConfig.rsvp.route,'#','Backend config object should not be mutated');
  assert.equal(status.dataset.state,'ready');
  assert.equal(calls.length,1);
  assert.equal(calls[0].u,'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow');
  assert.equal(JSON.parse(calls[0].payload.body).action,'public_load');
  assert.equal(JSON.parse(calls[0].payload.body).token,'fictional-token');
  return {rendered,inspected};
}
(async()=>{
  await bootScenario('?rt=demo-token-1&g=guest%2F1&lang=es',
    'https://example.invalid/guest/guests-rsvp-v105.html?guest=1&t=demo-token-1&lang=es&_rsvpv=46&g=guest%2F1');
  console.log('PASS: personalized single-guest RSVP link');
  await bootScenario('?rt=demo-token-2&u=unit%2F9&g=ignored&lang=en',
    'https://example.invalid/guest/guests-rsvp-v105.html?guest=1&t=demo-token-2&lang=en&_rsvpv=46&u=unit%2F9');
  console.log('PASS: invitation-unit RSVP precedence and language');
  await bootScenario('?lang=es','#');
  console.log('PASS: missing token falls back to non-bookable #');
  await bootScenario('?rt=demo-token', '#',{serverError:true});
  console.log('PASS: a rejected backend response stops delivery');

  const tmp=mkdtempSync(path.join(os.tmpdir(),'botanica-qa-'));
  try {
    const fakeHtml=path.join(tmp,'master.html'),out=path.join(tmp,'output.html');
    writeFileSync(fakeHtml,'<!doctype html><body><script>window.BOTANICA_APPLY_CONFIG=function(){};</script></body>');
    const run=spawnSync(process.execPath,[path.join(root,'tools','build_catalog_delivery.js'),fakeHtml,out,'fictional-token','botanica'],{encoding:'utf8'});
    assert.notEqual(run.status,0,'Commercial packaging MUST reject non-certified Botánica');
    assert.match(run.stderr,/not commercially frozen/i);
    assert(!fs.existsSync(out),'No output should be generated for blocked template');
    console.log('PASS: commercial packager refuses pending Botánica');
  }finally{rmSync(tmp,{recursive:true,force:true});}
  console.log('PASS: ALL SEVEN Botánica isolated bridge contract checks');
})().catch(e=>{console.error('FAIL:',e.stack||e);process.exitCode=1;});