#!/usr/bin/env node
'use strict';
/* LOCAL STAGING ONLY. Does not deploy, send emails, or change original files. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'../..');
const CENTER_SHA='0832f4fac4ae51f5a3e305a0d06284a3ff4bb1a121ece4a4e8b01e5368605c7a';
const BOTANICA_SHA='fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a';
const BOT_FILE='GUEST_BOTANICA_V14_7_TEST_ONLY_ASSET.html';
const CENTER_FILE='GUEST_MOBILE_CENTER_V2_TEST_ONLY_NOT_PUBLISHED.html';
const legacy="const CATALOG_RENDERERS={'veil-light':{label:'VEIL LIGHT',apply:c=>{if(typeof window.VEIL_APPLY_CONFIG!=='function')throw new Error('renderer_unavailable');return window.VEIL_APPLY_CONFIG(c)}}};\nfunction rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(!r)throw new Error('template_renderer_unavailable:'+id);return r}\nfunction applyOrderConfig(order,cfg){return rendererFor(order).apply(cfg)}";
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function replaceOne(s,from,to,label){
 const at=s.indexOf(from);if(at<0||s.indexOf(from,at+from.length)>=0)throw Error('source_drift:'+label);
 return s.slice(0,at)+to+s.slice(at+from.length);
}
function build(center,rawRegistry,viewer,overlay,stagedAssets={'botanica':BOT_FILE}){
 if(!center.includes('<script id="wsd-production-workbench-script">')||!viewer.includes('GUEST_CATALOG_OWNER_VIEWER_V2')||!overlay.includes('GUEST_STAGE_OWNER'))throw Error('unexpected_source_files');
 const registry=structuredClone(rawRegistry);
 if(registry.schemaVersion&&registry.schemaVersion!=='guest-catalog-owner-renderers-v2')throw Error('owner_registry_schema_drift');
 if(!registry.templates||!registry.templates['veil-light']||registry.templates['veil-light'].status!=='commercially-frozen'||registry.templates['veil-light'].version!=='5.3.3'||registry.templates['veil-light'].mode!=='native')throw Error('veil_manifest_drift');
 if(!stagedAssets||typeof stagedAssets!=='object')throw Error('missing_staged_assets');
 for(const [id,name] of Object.entries(stagedAssets)){
  const t=registry.templates[id];
  if(!t||t.id&&t.id!==id||t.mode!=='iframe'||!['certification-pending','commercially-frozen'].includes(t.status)||((t.status==='certification-pending'&&t.src!==null)||(t.status==='commercially-frozen'&&!t.src)))throw Error('unsafe_staged_asset:'+id);
  if(typeof name!=='string'||!/^[a-zA-Z0-9_.-]+\.html$/.test(name)||name.includes('..'))throw Error('unsafe_staged_filename:'+id);
  t.src='./'+name;
 }
 const init='<script id="guest-owner-staged-registry">window.GUEST_STAGE_OWNER_REGISTRY='+JSON.stringify(registry)+';</script>\n';
 const s1='<script id="guest-owner-v2-viewer">'+viewer+'\n</script>\n';
 const s2='<script id="guest-owner-v2-staging">'+overlay+'\n</script>\n';
 let out=replaceOne(center,'<head>',"<head>\n<meta http-equiv=\"Content-Security-Policy\" content=\"connect-src 'none'; form-action 'none'\">",'offline_csp');
 out=replaceOne(out,'<script id="wsd-production-workbench-script">',init+s1+s2+'<script id="wsd-production-workbench-script">','inject_pre_workbench_shared_modules');
 out=replaceOne(out,legacy,"const CATALOG_RENDERERS=window.GUEST_STAGE_OWNER.renderers;\nfunction rendererFor(order){return window.GUEST_STAGE_OWNER.rendererFor(order)}\nfunction applyOrderConfig(order,cfg){return window.GUEST_STAGE_OWNER.applyOrderConfig(order,cfg)}",'replace_veil_only_dispatcher');
 out=replaceOne(out,'function openCenter(){\n  closeTool();',"function openCenter(){\n  window.GUEST_STAGE_OWNER.close();\n  closeTool();",'center_return');
 out=replaceOne(out,"function hideCenter(){\n  root.classList.add('off');","function hideCenter(){\n  window.GUEST_STAGE_OWNER.open();\n  root.classList.add('off');",'center_preview');
 out=replaceOne(out,"const x=await call(FLOW,{action:'create_test',email:'',templateId:'veil-light'});","const x=await call(FLOW,{action:'create_test',email:'',templateId:String(document.getElementById('guestStageTemplateId')?.value||'veil-light')});",'generic_test_creation');
 const pick=[
  "const guestStageTemplateChoice=document.createElement('select');guestStageTemplateChoice.id='guestStageTemplateId';",
  "guestStageTemplateChoice.setAttribute('aria-label','Diseño de prueba');guestStageTemplateChoice.style.cssText='font-size:15px;padding:11px;border-radius:12px;margin:8px 0;max-width:100%';",
  "for(const [id,spec] of Object.entries(window.GUEST_STAGE_OWNER_REGISTRY.templates)){",
  " if(!['commercially-frozen','certification-pending'].includes(spec.status)||spec.mode==='iframe'&&!spec.src)continue;",
  " const opt=document.createElement('option');opt.value=id;opt.textContent=id.toUpperCase().replaceAll('-',' ')+' · '+(spec.status==='commercially-frozen'?'CONGELADO':'SOLO PRUEBA');guestStageTemplateChoice.appendChild(opt);",
  "}",
  "document.getElementById('wpNewTest')?.insertAdjacentElement('beforebegin',guestStageTemplateChoice);",
  "window.GUEST_STAGE_CLOSE=()=>openCenter();"
 ].join('\n')+'\n';
 out=replaceOne(out,"const reopen=document.createElement('button');reopen.id='wsdProdBtn';",pick+"const reopen=document.createElement('button');reopen.id='wsdProdBtn';",'generic_template_picker');
 if(!out.includes("connect-src 'none'"))throw Error('offline_network_guard_missing');
 return out;
}
function stageWithExpectedCenterSha(centerFile,assetFiles,outDir,root,expectedCenterSha){
 const files=typeof assetFiles==='string'?{botanica:assetFiles}:assetFiles;
 if(!centerFile||!files||!Object.keys(files).length||!outDir)throw Error('usage: --center FILE --asset template-id=FILE --out-dir NEW_DIR');
 const center=fs.readFileSync(centerFile);
 if(sha(center)!==expectedCenterSha)throw Error('preproduction_center_sha256_mismatch');
 if(fs.existsSync(outDir))throw Error('output_dir_must_not_exist');
 const registry=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json'),'utf8'));
 const project=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_PROJECT_STATUS_V1.json'),'utf8'));
 const viewer=fs.readFileSync(path.join(root,'guest/catalog/guest-catalog-owner-viewer-v2.js'),'utf8');
 const overlay=fs.readFileSync(path.join(root,'guest/catalog/guest-owner-stage-overlay-v2.js'),'utf8');
 const names={},assets=[],uniqueSources=new Set([path.resolve(centerFile)]);
 for(const [id,filename] of Object.entries(files)){
  const t=registry.templates?.[id],record=project.designs?.[id];
  if(!t||!['certification-pending','commercially-frozen'].includes(t.status)||t.mode!=='iframe'||((t.status==='certification-pending'&&t.src!==null)||(t.status==='commercially-frozen'&&!t.src))||record?.version!==t.version||record?.status!==t.status)throw Error('asset_unregistered_or_registry_drift:'+id);
  const reference=record.candidateSha256||record.visualMasterSha256;
  if(!/^[a-f0-9]{64}$/.test(reference||''))throw Error('missing_catalog_artifact_sha256:'+id);
  const source=path.resolve(filename),actual=sha(fs.readFileSync(source));
  if(actual!==reference)throw Error('asset_sha256_mismatch:'+id);
  if(uniqueSources.has(source))throw Error('duplicate_asset_source:'+id);uniqueSources.add(source);
  const safe=id.replace(/[^a-z0-9-]/g,'-'),version=t.version.replace(/[^a-z0-9-]/gi,'-');
  const output=id==='botanica'?BOT_FILE:'GUEST_STAGE_'+safe+'_v'+version+'.html';
  if(Object.values(names).includes(output))throw Error('duplicate_asset_output:'+id);
  names[id]=output;assets.push({id,version:t.version,source,output,sha256:actual});
 }
 const dest=path.resolve(outDir);
 for(const source of uniqueSources)if(source.startsWith(dest+path.sep))throw Error('source_inside_output_dir');
 const html=build(center.toString('utf8'),registry,viewer,overlay,names);
 fs.mkdirSync(dest,{recursive:false});
 fs.writeFileSync(path.join(dest,CENTER_FILE),html,{flag:'wx'});
 for(const a of assets)fs.copyFileSync(a.source,path.join(dest,a.output),fs.constants.COPYFILE_EXCL);
 const manifest={schemaVersion:'guest-owner-preproduction-stage-v2',state:'LOCAL TEST ONLY: NOT DEPLOYED OR COMMERCIAL CERTIFIED',
  network:'connect-src none; form-action none; live order operations disabled by CSP',
  centerCandidateOriginalSha256:expectedCenterSha,stagedCenterFile:CENTER_FILE,stagedCenterSha256:sha(Buffer.from(html)),
  assets:assets.map(({id,version,output,sha256})=>({id,version,file:output,sha256})),
  registry:'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',sharedViewer:'guest/catalog/guest-catalog-owner-viewer-v2.js',
  stagingAdapter:'guest/catalog/guest-owner-stage-overlay-v2.js',
  verification:'offline artifact only; production backend, Stripe, emails and frozen files untouched'};
 fs.writeFileSync(path.join(dest,'STAGING_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
 return manifest;
}
// Public operator path ALWAYS requires the frozen candidate's exact SHA.
// Override is exported ONLY for synthetic local tests; never accepted by CLI.
function stage(centerFile,assetFiles,outDir,root=ROOT){return stageWithExpectedCenterSha(centerFile,assetFiles,outDir,root,CENTER_SHA)}
if(require.main===module){
 const args=process.argv.slice(2),arg=k=>args.includes(k)?args[args.indexOf(k)+1]:null;
 const assets={};
 if(arg('--botanica'))assets.botanica=arg('--botanica'); // historical CLI alias; not required by new designs
 for(let i=0;i<args.length;i++)if(args[i]==='--asset'){
  const pair=String(args[++i]||''),split=pair.indexOf('=');if(split<=0)throw Error('asset_usage_id_equals_path');
  const id=pair.slice(0,split);if(Object.hasOwn(assets,id))throw Error('duplicate_asset_id:'+id);assets[id]=pair.slice(split+1);
 }
 console.log(JSON.stringify(stage(arg('--center'),assets,arg('--out-dir'),arg('--root')?path.resolve(arg('--root')):ROOT),null,2));
}
module.exports={build,stage,stageWithExpectedCenterSha,CENTER_SHA,BOTANICA_SHA,CENTER_FILE,BOT_FILE};
