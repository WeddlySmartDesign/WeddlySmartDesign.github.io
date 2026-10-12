#!/usr/bin/env node
'use strict';
/** Pure static GUEST PRE-COMMERCIAL stage. No ONE/STUDIO, no auto-production or sale.
 * A signed, immutable full visual master is injected only after local SHA check.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const args=process.argv.slice(2),flag=k=>args.includes(k)?args[args.indexOf(k)+1]:null;
const output=flag('--output'),master=flag('--visual-master');
if(!output||!path.isAbsolute(output)||path.resolve(output)===root||output.length<8)
  throw Error('Provide absolute safe output directory: --output /tmp/guest-stage');
if(fs.existsSync(output)&&fs.readdirSync(output).length)throw Error('Output must be an empty directory');
const status=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_PROJECT_STATUS_V1.json'),'utf8'));
const registry=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json'),'utf8'));
const id=flag('--template')||'botanica'; // legacy Cloudflare command selects landing only, NEVER filters build
const candidates=Object.entries(registry.templates||{}).filter(([,t])=>
   t?.mode==='iframe'&&['certification-pending','commercially-frozen'].includes(t.status));
if(!candidates.length||!candidates.some(([name])=>name===id))
  throw Error('Unknown or unsupported visual landing design: '+id);
for(const [name,t] of candidates){
 const entry=status.designs?.[name];
 if(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)||
    !t||t.id!==name||!/^[_A-Z][_A-Z0-9]*$/.test(t.applyApi||'')||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,30}$/.test(t.version||'')||
    !entry||entry.version!==t.version||entry.status!==t.status)
    throw Error('CATALOG_TEMPLATE_UNCERTIFIED_OR_DRIFT:'+name);
 const expected=String(entry.candidateSha256||entry.visualMasterSha256||'');
 if(!/^[0-9a-f]{64}$/.test(expected))throw Error('MISSING_IMMUTABLE_SHA:'+name);
}
if(master&&candidates.length>1)throw Error('MASTER_OVERRIDE_CANNOT_BYPASS_MULTI_DESIGN_SOURCE_CHECK');
const read=(file)=>fs.readFileSync(path.join(root,file));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function write(name,bytes){
 const p=path.join(output,name);fs.mkdirSync(path.dirname(p),{recursive:true});
 fs.writeFileSync(p,bytes,{flag:'wx'});
 return{name,size:bytes.length,sha256:sha(bytes)};
}
fs.mkdirSync(output,{recursive:true});
const files=[
 'guest/catalog-final.html',
 // Securely owner-authorized acceptance tool: TEST only, not linked from storefront.
 'guest/qa/owner-botanica-acceptance.html',
 'guest/qa/owner-botanica-rsvp-e2e.html',
 'guest/qa/owner-limoneros-full-e2e.html',
 'guest/qa/owner-botanica-closeout.html',
 'guest/qa/owner-botanica-touch-benchmark.html',
 'guest-review-v1.html',
 'guest/catalog-questionnaire.html',
 'guest/guest-catalog-delivery-runtime-v1.js',
 'guest/catalog/guest-catalog-owner-viewer-v2.js',
 'guest/catalog/owner-center-remote-bridge.html'
].map(name=>write(name,read(name)));
const viewRegistry=structuredClone(registry);
// Cloudflare Pages has a per-file size cap. Large premium visual masters often
// contain base64-embedded author videos/images: externalize only at staging time.
// The registered SOURCE remains byte-identical and SHA-pinned in GitHub.
// This works for D03, D04... without updating a design-specific upload workflow.
function stageLargeVisualLosslessly(original,id,version){
 const limit=24*1024*1024; // below Cloudflare Pages' 25 MiB per-asset limit
 if(original.length<=limit)return{html:original,mediaCount:0,externalized:false};
 const html=original.toString('utf8');
 if(Buffer.byteLength(html,'utf8')!==original.length)
   throw Error('VISUAL_SOURCE_NOT_UTF8:'+id);
 const assets=new Map();
 const regex=/data:(image\/(?:jpeg|png|webp)|video\/mp4);base64,([A-Za-z0-9+/=]+)/g;
 let count=0;
 const rewritten=html.replace(regex,(_,mime,encoded)=>{
   const bytes=Buffer.from(encoded,'base64');
   if(!bytes.length||bytes.toString('base64')!==encoded)
     throw Error('VISUAL_MEDIA_BASE64_NOT_CANONICAL:'+id);
   const ext=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4'})[mime];
   const filename=sha(bytes).slice(0,24)+'.'+ext;
   const rel='guest/catalog-assets/'+id+'/'+version+'/media/'+filename;
   const previous=assets.get(rel);
   if(previous&&!previous.bytes.equals(bytes))
     throw Error('VISUAL_MEDIA_DIGEST_COLLISION:'+id);
   assets.set(rel,{bytes,mime});
   count++;
   return './media/'+filename;
 });
 if(count===0)throw Error('VISUAL_TOO_LARGE_WITHOUT_SPLITTABLE_MEDIA:'+id);
 const output=Buffer.from(rewritten,'utf8');
 if(output.length>limit)throw Error('VISUAL_SPLIT_STILL_EXCEEDS_HOST_LIMIT:'+id);
 // Lossless round-trip is mandatory: the author's immutable SOURCE must be
 // reconstructible byte-for-byte from the files produced for Cloudflare.
 const restored=rewritten.replace(/\.\/media\/([0-9a-f]{24}\.(?:jpg|png|webp|mp4))/g,(ref,filename)=>{
   const asset=assets.get('guest/catalog-assets/'+id+'/'+version+'/media/'+filename);
   return asset?'data:'+asset.mime+';base64,'+asset.bytes.toString('base64'):ref;
 });
 if(sha(Buffer.from(restored,'utf8'))!==sha(original))
   throw Error('VISUAL_MEDIA_SPLIT_NOT_LOSSLESS:'+id);
 for(const [rel,asset] of assets)files.push(write(rel,asset.bytes));
 return{html:output,mediaCount:assets.size,externalized:true};
}
// Optional *staging-only* visual corrections. Immutable uploaded author masters stay byte-identical.
// Patch is pinned to the SHA of the original; a new master requires explicit re-review.
// No other design is affected unless it explicitly ships a manifest and both patch files.
function applyOptionalVisualPatch(stagedHtml,name,version,sourceSha){
 const dir=path.join(root,'guest/catalog-patches',name,version);
 const manifest=path.join(dir,'patch-manifest.json');
 if(!fs.existsSync(manifest))return stagedHtml;
 const meta=JSON.parse(fs.readFileSync(manifest,'utf8'));
 if(meta.schemaVersion!=='guest-visual-stage-patch-v1'||meta.templateId!==name||
    meta.templateVersion!==version||meta.sourceMasterSha256!==sourceSha||
    meta.commercialRelease!==false)throw Error('UNAPPROVED_VISUAL_PATCH_SOURCE:'+name);
 const cssPath=path.join(dir,'patch.css'),jsPath=path.join(dir,'patch.js');
 if(!fs.existsSync(cssPath)||!fs.existsSync(jsPath))throw Error('INCOMPLETE_VISUAL_PATCH:'+name);
 const css=fs.readFileSync(cssPath,'utf8'),js=fs.readFileSync(jsPath,'utf8');
 if(!css||!js||js.includes('</script>'))throw Error('INVALID_VISUAL_PATCH:'+name);
 let html=stagedHtml.toString('utf8');
 if(html.split('</style>').length!==2)throw Error('VISUAL_PATCH_STYLE_ANCHOR:'+name);
 const hook='window.GUEST_APPLY_CONFIG=render;';
 if(html.split(hook).length!==2)throw Error('VISUAL_PATCH_RENDER_HOOK:'+name);
 html=html.replace('</style>',css+'\n</style>').replace(hook,hook+'\n'+js);
 return Buffer.from(html,'utf8');
}
const designs=[];
for(const [name,t] of candidates){
 const entry=status.designs[name];
 const expected=String(entry.candidateSha256||entry.visualMasterSha256||'');
 const assetRoot=path.join(root,'guest/catalog-assets',name,t.version);
 const registeredAsset=path.join(assetRoot,'index.html');
 const chunksFile=path.join(assetRoot,'source-chunks','manifest.json');
 let visual=null;
 if(master)visual=fs.readFileSync(master);
 else if(fs.existsSync(registeredAsset))visual=fs.readFileSync(registeredAsset);
 else if(fs.existsSync(chunksFile)){
  const meta=JSON.parse(fs.readFileSync(chunksFile,'utf8'));
  if(meta.schemaVersion!=='guest-immutable-visual-chunks-v1'||meta.id!==name||
     meta.version!==t.version||meta.sha256!==expected||
     !Array.isArray(meta.parts)||meta.parts.length<2||meta.parts.length>100||
     new Set(meta.parts).size!==meta.parts.length)
    throw Error('INVALID_FROZEN_VISUAL_CHUNK_MANIFEST:'+name);
  const chunkDirectory=path.join(assetRoot,'source-chunks');
  const parts=meta.parts.map(part=>{
    if(typeof part!=='string'||!/^[0-9]{3}\.txt$/.test(part))
      throw Error('INVALID_CHUNK_PATH:'+name);
    const file=path.join(chunkDirectory,part);
    if(!fs.existsSync(file))throw Error('MISSING_FROZEN_VISUAL_CHUNK:'+name+':'+part);
    return fs.readFileSync(file);
  });
  visual=Buffer.concat(parts);
  if(visual.length!==meta.bytes)throw Error('FROZEN_VISUAL_CHUNK_SIZE_MISMATCH:'+name);
 }
 // This is intentionally strict: once a new design is registered the whole
 // Cloudflare build must fail unless its untouched HTML is present.
 if(!visual)throw Error('MISSING_REGISTERED_VISUAL_MASTER:'+name);
 if(sha(visual)!==expected||!visual.includes(Buffer.from('window.'+t.applyApi)))
    throw Error('FROZEN_VISUAL_SHA256_OR_RENDERER_MISMATCH:'+name);
 const dest='guest/catalog-assets/'+name+'/'+t.version+'/index.html';
 const stage=stageLargeVisualLosslessly(visual,name,t.version);
 stage.html=applyOptionalVisualPatch(stage.html,name,t.version,expected);
 files.push(write(dest,stage.html));
 viewRegistry.templates[name].src='/'+dest;
 designs.push({templateId:name,version:t.version,status:t.status,masterSha256:expected,deployedHtmlSha256:sha(stage.html),mediaAssets:stage.mediaCount,losslessMediaExternalization:stage.externalized,visualIncluded:true});
}
// Only staging copies get temporary src pointers. Canonical registry remains
// certification-gated; published HTML never by itself authorizes a purchase.
files.push(write('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',Buffer.from(JSON.stringify(viewRegistry,null,2)+'\n')));
const selected=designs.find(x=>x.templateId===id);
const visualIncluded=Boolean(selected);
// Public QA entry is intentionally inert: never advertises or accepts checkout.
// One template-neutral URL per catalog design; owner can inspect the exact frozen HTML.
const href='/guest/catalog-assets/'+encodeURIComponent(id)+'/'+encodeURIComponent(selected.version)+'/index.html';
const landing='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><title>GUEST · preproducción</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f8f5f0;color:#38312d;font-family:system-ui,sans-serif}main{padding:30px;max-width:500px;text-align:center}h1{font:400 38px Georgia,serif}p{line-height:1.65}a{display:inline-block;padding:14px 18px;background:#41362f;color:#fff;border-radius:10px;text-decoration:none}</style></head><body><main><h1>GUEST by WeddlySmartDesign</h1><p>Entorno de revisión visual. No es una tienda ni una invitación entregada a una pareja.</p>'+ (visualIncluded?'<a href="'+href+'">Ver diseño en el móvil</a>':'<p>Diseño pendiente de instalar.</p>')+'</main></body></html>';
files.push(write('index.html',Buffer.from(landing)));
// Noindex is intentional. NEVER deploy commercial catalog while pending certification.
const headers=`/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`;
files.push(write('_headers',Buffer.from(headers)));
const design=selected;
const manifest={schemaVersion:'guest-static-catalog-stage-v1',status:'PREPRODUCTION_DO_NOT_SELL',
 commercialApproved:false,design,designs,...(id==='botanica'?{botanica:design}:{}),
 singleDesignAdditionProcedure:'Existing visual master and visual-plugin.json; no per-design backend or checkout',
 productionPromotionForbidden:true,
 pages:['/guest/catalog-final.html','/guest-review-v1.html','/guest/catalog-questionnaire.html'],
 hosting:'Platform-neutral static files; Cloudflare Pages free eligible, host NOT CONNECTED',
 files};
fs.writeFileSync(path.join(output,'GUEST_STAGE_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log('PASS: staged '+files.length+' immutable files for '+designs.length+' catalog designs, landing '+id+'@'+selected.version+', every visual SHA verified. NO SALE.');
