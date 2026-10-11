#!/usr/bin/env node
'use strict';
/* Owner no-rework acceptance: THREE visual designs, TWO new ones supplied
 * only as master.html + visual-plugin.json. The EXACT already-configured
 * Cloudflare Pages build command automatically ships all HTML visual assets.
 * No production sales, no new design in real catalog, no Cloud writes.
 */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-drop-in-all-designs-'));
const sha=buf=>crypto.createHash('sha256').update(buf).digest('hex');
const copy=(rel)=>{const src=path.join(root,rel),dest=path.join(tmp,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest)};
const call=(script,args)=>cp.spawnSync(process.execPath,[path.join(tmp,script),...args],{cwd:tmp,encoding:'utf8',maxBuffer:1024*1024});
try{
 const common=[
  'guest/tools/register_visual_template.cjs','guest/tools/build_catalog_static_preview.cjs',
  'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json','guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json',
  'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json','guest/GUEST_PROJECT_STATUS_V1.json',
  'guest/catalog-final.html','guest-review-v1.html','guest/catalog-questionnaire.html',
  'guest/guest-catalog-delivery-runtime-v1.js','guest/catalog/guest-catalog-owner-viewer-v2.js'
 ];
 common.forEach(copy);
 const chunksRoot='guest/catalog-assets/botanica/14.7/source-chunks';
 const to=path.join(tmp,chunksRoot);fs.mkdirSync(path.dirname(to),{recursive:true});
 fs.cpSync(path.join(root,chunksRoot),to,{recursive:true});
 const masters={};
 for(const id of ['design-03','design-1000']){
  const plug=path.join(tmp,'visual-input',id);fs.mkdirSync(plug,{recursive:true});
  const html=Buffer.from('<!doctype html><html lang="es"><head><title>'+id+'</title></head><body><main>'+id+'</main><script>window.GUEST_APPLY_CONFIG=function(c){document.querySelector("main").dataset.config=String(Boolean(c))}</script></body></html>');
  const manifest={id,displayName:'Ficticio '+id,version:'1.0.0',rendererApi:'GUEST_APPLY_CONFIG',masterHtml:'master.html',typographyVariants:['classic']};
  fs.writeFileSync(path.join(plug,'master.html'),html);
  fs.writeFileSync(path.join(plug,'visual-plugin.json'),JSON.stringify(manifest));
  masters[id]=sha(html);
  const preview=call('guest/tools/register_visual_template.cjs',['--root',tmp,'--manifest',path.join(plug,'visual-plugin.json')]);
  assert.equal(preview.status,0,'dry-run '+id+' '+preview.stderr);
  assert.equal(JSON.parse(preview.stdout).mode,'dry-run');
  const added=call('guest/tools/register_visual_template.cjs',['--root',tmp,'--manifest',path.join(plug,'visual-plugin.json'),'--apply']);
  assert.equal(added.status,0,'onboard '+id+' '+added.stderr);
  assert.equal(JSON.parse(added.stdout).template,id);
  assert.equal(JSON.parse(added.stdout).commerciallyCertified,false);
 }
 const dest=path.join(tmp,'dist');
 // EXACT existing user Cloudflare build command, unchanged forever for D03-D1000.
 const built=call('guest/tools/build_catalog_static_preview.cjs',['--output',dest,'--template','botanica']);
 assert.equal(built.status,0,'unchanged multi-design Cloudflare build failed: '+built.stderr);
 const m=JSON.parse(fs.readFileSync(path.join(dest,'GUEST_STAGE_MANIFEST.json')));
 assert.equal(m.status,'PREPRODUCTION_DO_NOT_SELL');assert.equal(m.commercialApproved,false);
 assert.deepEqual(m.designs.map(x=>x.templateId).sort(),['botanica','design-03','design-1000']);
 const registry=JSON.parse(fs.readFileSync(path.join(dest,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json')));
 const canonical=JSON.parse(fs.readFileSync(path.join(tmp,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json')));
 for(const id of ['design-03','design-1000']){
   const file=path.join(dest,'guest/catalog-assets',id,'1.0.0','index.html');
   assert.equal(sha(fs.readFileSync(file)),masters[id],id+' not published exactly');
   assert.equal(registry.templates[id].src,'/guest/catalog-assets/'+id+'/1.0.0/index.html');
   assert.equal(registry.templates[id].status,'certification-pending');
   assert.equal(canonical.templates[id].src,null,'canonical unapproved preview leaked');
 }
 const b=fs.readFileSync(path.join(dest,'guest/catalog-assets/botanica/14.7/index.html'));
 assert.equal(sha(b),'fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a');
 assert.equal(m.designs.length,3);
 // Exactly one tampered new design must abort the ENTIRE build, never partially manifest.
 fs.appendFileSync(path.join(tmp,'guest/catalog-assets/design-1000/1.0.0/index.html'),'modified');
 const rejectedDir=path.join(tmp,'failed');
 const bad=call('guest/tools/build_catalog_static_preview.cjs',['--output',rejectedDir,'--template','botanica']);
 assert.notEqual(bad.status,0,'tampered design must block every publication');
 assert.match(bad.stderr,/FROZEN_VISUAL_SHA256_OR_RENDERER_MISMATCH/);
 assert(!fs.existsSync(path.join(rejectedDir,'GUEST_STAGE_MANIFEST.json')),'no successful manifest after failed visual');
 console.log('PASS D03 AND D1000: ONLY master.html + visual-plugin.json registered via REAL onboarding, unchanged Cloudflare command includes all visuals with original Botánica SHA, no new core, no sale.');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
