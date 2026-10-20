'use strict';
/**
 * Rebuild ALL SOURCE-PINNED visual candidates via the actual Cloudflare static
 * preview packager. Test only. Never uploads, sets prices, publishes, or pays.
 *
 * Crucially catches real integration regressions hidden by per-skin smoke checks:
 * the unified stage must resolve all 13 Claude candidates + Botánica + archived
 * D03, and no Pages asset may exceed Cloudflare's 25MiB/file threshold.
 * VEIL is native and must not be represented falsely as an iframe candidate.
 */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'guest-full-stage-ci-'));
const output=path.join(temporary,'staged-offline');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
try{
 const p=spawnSync(process.execPath,['guest/tools/build_catalog_static_preview.cjs','--template','design-09','--output',output],{cwd:root,encoding:'utf8',maxBuffer:1024*1024*2,timeout:600000});
 assert.equal(p.status,0,'15 design staging command failed: '+p.stderr+'\n'+p.stdout);
 const manifest=JSON.parse(fs.readFileSync(path.join(output,'GUEST_STAGE_MANIFEST.json'),'utf8'));
 assert.equal(manifest.schemaVersion,'guest-static-catalog-stage-v1');
 assert.equal(manifest.status,'PREPRODUCTION_DO_NOT_SELL');
 assert.equal(manifest.commercialApproved,false);
 assert.equal(manifest.productionPromotionForbidden,true);
 assert.equal(manifest.designs.length,15,'13 Claude + Botánica + archived D03 = 15 preproduction registered iframe sources');
 const ids=manifest.designs.map(x=>x.templateId);
 assert(ids.includes('botanica')&&ids.includes('design-03'));
 for(let i=4;i<=16;i++){
  const id='design-'+String(i).padStart(2,'0');
  assert(ids.includes(id),'unbundled Claude candidate '+id);
  const meta=manifest.designs.find(x=>x.templateId===id);
  assert.equal(meta.sourcePinKind,'git-blob-sha1','unverified original SHA pin '+id);
  assert.equal(meta.status,'certification-pending');
  assert.equal(meta.visualIncluded,true);
 }
 assert.equal(manifest.designs.find(x=>x.templateId==='botanica').sourcePinKind,'sha256');
 assert(!ids.includes('veil-light'),'Do not silently pretend native VEIL has an iframe release');
 const files=manifest.files||[],bad=[];
 for(const f of files){
  const fp=path.join(output,f.name);
  if(!fs.existsSync(fp)||fs.statSync(fp).size!==f.size||sha(fs.readFileSync(fp))!==f.sha256)bad.push({path:f.name,kind:'tampered'});
  if(f.size>25*1024*1024)bad.push({path:f.name,kind:'Cloudflare asset over 25MiB',bytes:f.size});
 }
 assert.deepEqual(bad,[],'staging file checksum or size failed');
 const render=JSON.parse(fs.readFileSync(path.join(output,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json'),'utf8'));
 for(const id of ids){
  const spec=render.templates[id];
  assert(spec.src==='/guest/catalog-assets/'+id+'/'+spec.version+'/index.html','Missing staged same-origin renderer '+id);
  assert(spec.status==='certification-pending','Staging may NOT grant commercial authorization '+id);
 }
 assert.equal(render.templates['veil-light'].src,undefined);
 for(const p of ['guest-checkout.html','guest.html'])assert(!fs.existsSync(path.join(output,p)),'staging accidentally ships commercial checkout');
 console.log('PASS PREPRODUCTION 15 iframe masters, 13 source Git SHA pins, every emitted file SHA256 verified below 25 MiB, native VEIL not faked, NO sale or deployment');
}finally{
 fs.rmSync(temporary,{recursive:true,force:true});
}
