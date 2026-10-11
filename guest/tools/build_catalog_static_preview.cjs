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
 'guest-review-v1.html',
 'guest/catalog-questionnaire.html',
 'guest/guest-catalog-delivery-runtime-v1.js',
 'guest/catalog/guest-catalog-owner-viewer-v2.js'
].map(name=>write(name,read(name)));
const viewRegistry=structuredClone(registry);
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
 files.push(write(dest,visual));
 viewRegistry.templates[name].src='/'+dest;
 designs.push({templateId:name,version:t.version,status:t.status,masterSha256:expected,visualIncluded:true});
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
