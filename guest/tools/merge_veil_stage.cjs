#!/usr/bin/env node
'use strict';
/** Merge VEIL LIGHT into a verified offline GUEST static preproduction stage.
 * Source: extracted verified pilot from Biblioteca; NEVER modify visual master.
 * node guest/tools/merge_veil_stage.cjs --source /abs/extracted --stage /abs/offline-stage
 * Never publish automatically; never modify ONE, Partner or STUDIO.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const args=process.argv.slice(2);
const arg=k=>{const i=args.indexOf(k);return i<0?null:args[i+1]};
const source=arg('--source'),stage=arg('--stage');
if(!source||!stage||!path.isAbsolute(source)||!path.isAbsolute(stage)||path.resolve(source)===path.resolve(stage))
  throw Error('ABSOLUTE_DIFFERENT_SOURCE_AND_STAGE_REQUIRED');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sub='guest/catalog-assets/veil-light/5.3.3';
const base=path.join(source,sub),target=path.join(stage,sub);
const read=p=>fs.readFileSync(p),json=p=>JSON.parse(read(p).toString('utf8'));
const pilot=json(path.join(base,'manifest.json'));
const original=read(path.join(base,'index.html'));
if(pilot.source_sha256!=='977d275d22c609aeb87c88115f6deca6ab2cfd32bd7487c6f4b425e2ae3e0440'||
   pilot.output_html_sha256!=='8f09e6bb3c0d975108b8c985266eadf339c11bedc50abd189445af040714ad30'||
   pilot.output_html_bytes!==original.length||sha(original)!==pilot.output_html_sha256||
   pilot.public_sale_approved!==false||!Array.isArray(pilot.assets)||pilot.assets.length!==10)
  throw Error('VEIL_PILOT_SOURCE_MISMATCH');
const media=[];
for(const a of pilot.assets){
 if(!/^[0-9a-f]{20}\.(?:png|webp|jpg|mp4)$/.test(a.file)||
    !/^[a-f0-9]{64}$/.test(a.sha256)||a.file.slice(0,20)!==a.sha256.slice(0,20))
   throw Error('VEIL_ASSET_NAME_NOT_HASHED');
 const b=read(path.join(base,'media',a.file));
 if(a.bytes!==b.length||a.sha256!==sha(b))throw Error('VEIL_MEDIA_INTEGRITY_FAILURE:'+a.file);
 media.push({name:a.file,bytes:b});
}
const stageManifestPath=path.join(stage,'GUEST_STAGE_MANIFEST.json');
const regPath=path.join(stage,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json');
const report=json(stageManifestPath),reg=json(regPath);
if(report.status!=='PREPRODUCTION_DO_NOT_SELL'||report.commercialApproved!==false||
   report.productionPromotionForbidden!==true||
   reg.schemaVersion!=='guest-catalog-owner-renderers-v2'||
   reg.templates?.['veil-light']?.mode!=='native'||
   reg.templates['veil-light']?.version!=='5.3.3'||
   reg.templates['veil-light']?.status!=='commercially-frozen'||fs.existsSync(target))
  throw Error('NOT_A_CLEAN_PRECOMMERCIAL_GUEST_STAGE');
let html=original.toString('utf8');
const anchor='<script id="guest-catalog-delivery-boot">(()=>{';
if(html.split(anchor).length!==2||html.split('window.VEIL_APPLY_CONFIG=function(next)').length!==2||
   html.split('<style id="wsd-veil-protect-before-boot">').length!==2)
  throw Error('VEIL_ORIGINAL_HOOKS_MISSING');
const bridge=[
 '<script id="guest-veil-common-stage-bridge">(()=>{',
 "'use strict';",
 'window.GUEST_APPLY_CONFIG=function(config){',
 "  if(window.parent===window)throw Error('veil_direct_link_must_use_public_token');",
 "  if(!window.frameElement || window.frameElement.ownerDocument.location.origin!==location.origin)throw Error('veil_parent_origin_required');",
 '  window.VEIL_APPLY_CONFIG(structuredClone(config));',
 "  document.getElementById('wsd-veil-protect-before-boot')?.remove();",
 '};',
 '})();</script>'
].join('\n')+'\n';
html=html.replace(anchor,bridge+'<script id="guest-catalog-delivery-boot">(()=>{if(window.parent!==window)return;');
if(!html.includes('window.GUEST_APPLY_CONFIG=function(config)'))throw Error('VEIL_BRIDGE_INVALID');
const render={...reg,templates:{...reg.templates,'veil-light':{...reg.templates['veil-light'],mode:'iframe',src:'/'+sub+'/index.html',applyApi:'GUEST_APPLY_CONFIG'}}};
const renderText=JSON.stringify(render,null,2)+'\n';
const newReport={...report,designs:[
 {templateId:'veil-light',version:'5.3.3',status:'commercially-frozen',
  sourcePinKind:'pilot-verified-sha256',deployedHtmlSha256:sha(Buffer.from(html)),
  visualIncluded:true,commercialApproved:false},...(report.designs||[])
],veilBridge:{testOnly:true,sourceFrozenMasterSha256:pilot.source_sha256,
 derivedHtmlSha256:sha(Buffer.from(html)),assets:media.length,remoteVerified:false}};
if(new Set(newReport.designs.map(x=>x.templateId)).size!==newReport.designs.length)
  throw Error('DUPLICATE_DESIGN_IN_STAGE');
const entry=(name,buf)=>({name,size:buf.length,sha256:sha(buf)});
newReport.files=(report.files||[]).filter(x=>x.name!=='guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json');
newReport.files.push(entry('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',Buffer.from(renderText)));
newReport.files.push(entry(sub+'/index.html',Buffer.from(html)));
for(const m of media)newReport.files.push(entry(sub+'/media/'+m.name,m.bytes));
const meta={schemaVersion:'guest-veil-common-iframe-stage-v1',
 status:'PREPRODUCTION_DO_NOT_SELL',originalMasterSha256:pilot.source_sha256,
 originalPilotHtmlSha256:pilot.output_html_sha256,derivedSha256:sha(Buffer.from(html)),
 mediaCount:media.length,commercialApproved:false};
// Inputs and integrity must pass before any stage write; failures never touch the visual SOURCE.
// If a disk write fails, discard the derived stage and regenerate it from the two verified inputs.
fs.mkdirSync(path.join(target,'media'),{recursive:true});
fs.writeFileSync(path.join(target,'index.html'),html,{flag:'wx'});
for(const m of media)fs.writeFileSync(path.join(target,'media',m.name),m.bytes,{flag:'wx'});
fs.writeFileSync(path.join(target,'bridge-manifest.json'),JSON.stringify(meta,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(regPath,renderText);
fs.writeFileSync(stageManifestPath,JSON.stringify(newReport,null,2)+'\n');
console.log('PASS VEIL into PREPRODUCTION ONLY: '+sha(Buffer.from(html))+'; 0 sales');
