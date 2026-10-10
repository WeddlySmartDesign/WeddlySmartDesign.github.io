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
const t=registry.templates?.botanica;
if(!t||t.version!=='14.7'||t.status!=='certification-pending'||t.mode!=='iframe'||t.applyApi!=='BOTANICA_APPLY_CONFIG')
  throw Error('Never build from a promoted/unknown Botanica status');
const expected='fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a';
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
viewRegistry.templates.botanica.src='/guest/catalog-assets/botanica/14.7/index.html';
files.push(write('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',Buffer.from(JSON.stringify(viewRegistry,null,2)+'\n')));
let visualIncluded=false;
if(master){
 const v=fs.readFileSync(master);
 if(sha(v)!==expected||v.length!==11635635||!v.includes(Buffer.from('window.BOTANICA_APPLY_CONFIG')))
   throw Error('BOTANICA_FROZEN_VISUAL_SHA256_MISMATCH - abort');
 files.push(write('guest/catalog-assets/botanica/14.7/index.html',v));
 visualIncluded=true;
}
// Noindex is intentional. NEVER deploy commercial catalog while pending certification.
const headers=`/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`;
files.push(write('_headers',Buffer.from(headers)));
const manifest={schemaVersion:'guest-static-catalog-stage-v1',status:'PREPRODUCTION_DO_NOT_SELL',
 commercialApproved:false,botanica:{templateId:'botanica',version:'14.7',status:'certification-pending',masterSha256:expected,visualIncluded},
 singleDesignAdditionProcedure:'Existing visual master and visual-plugin.json; no per-design backend or checkout',
 productionPromotionForbidden:true,
 pages:['/guest/catalog-final.html','/guest-review-v1.html','/guest/catalog-questionnaire.html'],
 hosting:'Platform-neutral static files; Cloudflare Pages free eligible, host NOT CONNECTED',
 files};
fs.writeFileSync(path.join(output,'GUEST_STAGE_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log('PASS: staged '+files.length+' immutable files, Visual master '+(visualIncluded?'VERIFIED':'NOT INCLUDED / inject with --visual-master')+'. NO SALE.');
