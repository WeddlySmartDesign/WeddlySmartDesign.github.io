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
const id=flag('--template')||'botanica';
const t=registry.templates?.[id],entry=status.designs?.[id];
if(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id)||!t||t.id!==id||
   t.mode!=='iframe'||t.status!=='certification-pending'||
   !/^[_A-Z][_A-Z0-9]*$/.test(t.applyApi||'')||
   !entry||entry.version!==t.version||entry.status!=='certification-pending')
  throw Error('Only known pending iframe designs can be staged without sale authorization');
const expected=String(entry.candidateSha256||entry.visualMasterSha256||'');
if(!/^[0-9a-f]{64}$/.test(expected))throw Error('Missing immutable candidate SHA for '+id);
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
 'guest-review-v1.html',
 'guest/catalog-questionnaire.html',
 'guest/guest-catalog-delivery-runtime-v1.js',
 'guest/catalog/guest-catalog-owner-viewer-v2.js'
].map(name=>write(name,read(name)));
const viewRegistry=structuredClone(registry);
// QA web assets are available for review only. Never mutate canonical registry.
viewRegistry.templates[id].src='/guest/catalog-assets/'+id+'/'+t.version+'/index.html';
files.push(write('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',Buffer.from(JSON.stringify(viewRegistry,null,2)+'\n')));
let visualIncluded=false;
const registeredAsset=path.join(root,'guest/catalog-assets',id,t.version,'index.html');
const masterPath=master|| (fs.existsSync(registeredAsset)?registeredAsset:null);
if(masterPath){
 const v=fs.readFileSync(masterPath);
 if(sha(v)!==expected||!v.includes(Buffer.from('window.'+t.applyApi)))
   throw Error('FROZEN_VISUAL_SHA256_OR_RENDERER_MISMATCH:'+id);
 files.push(write('guest/catalog-assets/'+id+'/'+t.version+'/index.html',v));
 visualIncluded=true;
}
// Noindex is intentional. NEVER deploy commercial catalog while pending certification.
const headers=`/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`;
files.push(write('_headers',Buffer.from(headers)));
const design={templateId:id,version:t.version,status:t.status,masterSha256:expected,visualIncluded};
const manifest={schemaVersion:'guest-static-catalog-stage-v1',status:'PREPRODUCTION_DO_NOT_SELL',
 commercialApproved:false,design,...(id==='botanica'?{botanica:design}:{}),
 singleDesignAdditionProcedure:'Existing visual master and visual-plugin.json; no per-design backend or checkout',
 productionPromotionForbidden:true,
 pages:['/guest/catalog-final.html','/guest-review-v1.html','/guest/catalog-questionnaire.html'],
 hosting:'Platform-neutral static files; Cloudflare Pages free eligible, host NOT CONNECTED',
 files};
fs.writeFileSync(path.join(output,'GUEST_STAGE_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log('PASS: staged '+files.length+' immutable files for '+id+'@'+t.version+', Visual master '+(visualIncluded?'VERIFIED':'NOT INCLUDED / inject with --visual-master')+'. NO SALE.');
