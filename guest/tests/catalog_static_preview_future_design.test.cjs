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
 // Aislar el escenario sintético: los diseños reales ya registrados (D04+) no forman parte
 // de esta copia temporal y no deben hacer fallar la prueba genérica del empaquetador.
 for(const k of Object.keys(registry.templates))if(!['botanica','veil-light'].includes(k))delete registry.templates[k];
 for(const k of Object.keys(status.designs))if(!['botanica','veil-light'].includes(k)&&status.designs[k].status!=='not-started')delete status.designs[k];
 const html=Buffer.from('<!doctype html><html><body><script>window.GUEST_APPLY_CONFIG=function(){return true}</script></body></html>');
 registry.templates['design-03']={id:'design-03',version:'1.0.0',mode:'iframe',src:null,applyApi:'GUEST_APPLY_CONFIG',status:'certification-pending'};
 status.designs['design-03']={version:'1.0.0',status:'certification-pending',candidateSha256:sha(html)};
 const html1000=Buffer.from('<!doctype html><html><body><h1>Independent synthetic design</h1><script>window.GUEST_APPLY_CONFIG=function(c){document.body.dataset.ready=String(Boolean(c))}</script></body></html>');
 registry.templates['design-1000']={id:'design-1000',version:'1.0.0',mode:'iframe',src:null,applyApi:'GUEST_APPLY_CONFIG',status:'certification-pending'};
 status.designs['design-1000']={version:'1.0.0',status:'certification-pending',candidateSha256:sha(html1000)};
 fs.writeFileSync(path.join(guest,'GUEST_CATALOG_OWNER_RENDERERS_V2.json'),JSON.stringify(registry));
 fs.writeFileSync(path.join(guest,'GUEST_PROJECT_STATUS_V1.json'),JSON.stringify(status));
 const asset=path.join(guest,'catalog-assets/design-03/1.0.0/index.html');fs.mkdirSync(path.dirname(asset),{recursive:true});fs.writeFileSync(asset,html);
 const asset1000=path.join(guest,'catalog-assets/design-1000/1.0.0/index.html');fs.mkdirSync(path.dirname(asset1000),{recursive:true});fs.writeFileSync(asset1000,html1000);
 const chunksSrc=path.join(root,'guest/catalog-assets/botanica/14.7/source-chunks');
 const chunksDst=path.join(guest,'catalog-assets/botanica/14.7/source-chunks');
 fs.mkdirSync(path.dirname(chunksDst),{recursive:true});fs.cpSync(chunksSrc,chunksDst,{recursive:true});
 for(const p of ['guest/catalog-final.html','guest-review-v1.html','guest/catalog-questionnaire.html','guest/qa/owner-botanica-acceptance.html','guest/qa/owner-botanica-rsvp-e2e.html',
  'guest/qa/owner-botanica-closeout.html',
  'guest/qa/owner-botanica-touch-benchmark.html','guest/guest-catalog-delivery-runtime-v1.js','guest/catalog/guest-catalog-owner-viewer-v2.js',
  'guest/catalog/owner-center-remote-bridge.html']){
  const to=path.join(tmp,p);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(root,p),to);
 }
 const dest=path.join(tmp,'export');
 const res=cp.spawnSync(process.execPath,[path.join(guest,'tools/build_catalog_static_preview.cjs'),'--template','botanica','--output',dest],{encoding:'utf8'});
 assert.equal(res.status,0,'D03 common packager failed: '+res.stderr);
 const m=JSON.parse(fs.readFileSync(path.join(dest,'GUEST_STAGE_MANIFEST.json')));
 assert.equal(m.design.templateId,'botanica');assert.equal(m.design.visualIncluded,true);assert.equal(m.commercialApproved,false);
 assert.deepEqual(m.designs.map(x=>x.templateId).sort(),['botanica','design-03','design-1000'],'unchanged Cloudflare command must publish all three registered visual files');
 assert.equal(m.status,'PREPRODUCTION_DO_NOT_SELL');
 assert.equal(sha(fs.readFileSync(path.join(dest,'guest/catalog-assets/design-03/1.0.0/index.html'))),sha(html));
 assert.equal(sha(fs.readFileSync(path.join(dest,'guest/catalog-assets/design-1000/1.0.0/index.html'))),sha(html1000));
 assert.equal(sha(fs.readFileSync(path.join(dest,'guest/catalog-assets/botanica/14.7/index.html'))),status.designs.botanica.candidateSha256);
 const render=JSON.parse(fs.readFileSync(path.join(dest,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json')));
 assert.equal(render.templates['design-03'].src,'/guest/catalog-assets/design-03/1.0.0/index.html');
 assert.equal(render.templates['design-1000'].src,'/guest/catalog-assets/design-1000/1.0.0/index.html');
 assert.equal(render.templates['botanica'].src,'/guest/catalog-assets/botanica/14.7/index.html');
 assert.equal(render.templates['design-03'].status,'certification-pending');
 assert.equal(registry.templates['design-03'].src,null,'original manifest must remain immutable');
 fs.appendFileSync(asset1000,'tampered');
 const fail=cp.spawnSync(process.execPath,[path.join(guest,'tools/build_catalog_static_preview.cjs'),'--template','botanica','--output',path.join(tmp,'tampered')],{encoding:'utf8'});
 assert.notEqual(fail.status,0,'tampered master should be refused');
 assert.match(fail.stderr,/FROZEN_VISUAL_SHA256_OR_RENDERER_MISMATCH/);
 assert(!fs.existsSync(path.join(tmp,'tampered','GUEST_STAGE_MANIFEST.json')),'never write release manifest on SHA failure');
 console.log('PASS untouched Cloudflare build command bundles frozen Botanica and synthetic D03/D1000 from manifests, all SHA pinned and tampering refused; NO SALE');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
