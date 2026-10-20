#!/usr/bin/env node
'use strict';
/* PREVIEW-ONLY snapshot of GUEST management and individual storefront.
 * NEVER generates a production site: CSP blocks ALL API/network, payment and
 * remote access. No third party data, production orders, credentials or secret.
 * Must be deployed ONLY to a different Pages PREVIEW branch.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),args=process.argv.slice(2);
const arg=key=>{const i=args.indexOf(key);return i<0?null:args[i+1]};
const target=arg('--output');
if(!target||!path.isAbsolute(target)||target===root||target.startsWith(root+path.sep))throw Error('Provide absolute, separate --output directory');
if(fs.existsSync(target)&&fs.readdirSync(target).length)throw Error('Target must be empty');
if(arg('--template') && arg('--template')!=='botanica')throw Error('Unexpected configured Cloudflare template flag');
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest=[];
function add(file,data){
 const dst=path.join(target,file);
 if(!dst.startsWith(target+path.sep)||file.includes('..'))throw Error('Unsafe output path '+file);
 fs.mkdirSync(path.dirname(dst),{recursive:true});
 fs.writeFileSync(dst,data,{flag:'wx'});
 manifest.push({file,sha256:sha256(data),bytes:data.length});
}
const allow=/\.(html?|js|css|json|svg|webmanifest|png|jpg|jpeg|webp|ico|woff2?|mp4|webm|mp3|m4a)$/i;
for(const entry of fs.readdirSync(path.join(root,'guest'),{withFileTypes:true})){
 if(!entry.isFile()||!allow.test(entry.name))continue;
 const src='guest/'+entry.name;
 add(src,fs.readFileSync(path.join(root,src)));
}
for(const name of ['guest.html','guest-checkout.html','guest-checkout-return.html','guest-order.html']){
 const content=fs.readFileSync(path.join(root,name));
 add(name,content);
}
assert(manifest.length>120,'GUEST static frontend snapshot suspiciously incomplete');
const store=fs.readFileSync(path.join(root,'guest.html'),'utf8');
assert(store.includes('Próxima apertura')&&store.includes('No son paquetes ni colecciones'),'Public storefront leaked into test-only preview');
assert(!/GUEST Essential|GUEST Signature/.test(store),'Legacy bundle store must not be staged');
assert(!/href=["'][^"']*guest-checkout/i.test(store),'Unapproved checkout link from storefront');
const ops=fs.readFileSync(path.join(root,'guest/guests-rsvp-operations-live.html'),'utf8');
assert(ops.includes('guests-catalog-invitation-bridge-v1.js')&&ops.includes('guests-rsvp-share-composer-v3.js'),'Final delivery integration incomplete');
const title='GUEST · Vista previa de integración (sin datos ni cobros)';
const html='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>'+title+'</title><style>body{background:#faf7f1;color:#3d3530;font:16px system-ui;margin:0;min-height:100vh;display:grid;place-items:center}main{max-width:640px;padding:36px;text-align:center}h1{font:normal 36px Georgia,serif}a{display:inline-block;background:#3d3530;color:#fff;text-decoration:none;border-radius:7px;margin:10px;padding:14px}p{line-height:1.7}</style></head><body><main><h1>GUEST · Revisión de integración</h1><p>Solo para pruebas de interfaz. Sin acceso a datos de parejas, sin pagos ni envíos.</p><a href="/guest.html">Catálogo individual</a><a href="/guest/access.html">Pantalla de acceso</a><a href="/guest/guests-rsvp-operations-live.html">Gestión de RSVP (sin sesión)</a></main></body></html>';
add('index.html',Buffer.from(html,'utf8'));
const headers=[
 '/*',
 '  X-Robots-Tag: noindex, nofollow, noarchive',
 '  Referrer-Policy: no-referrer',
 '  X-Content-Type-Options: nosniff',
 '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
 '  Content-Security-Policy: default-src \'self\' data:; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob:; media-src \'self\' data: blob:; connect-src \'none\'; form-action \'none\'; frame-src \'none\'; worker-src \'none\'; object-src \'none\'; base-uri \'self\''
].join('\n')+'\n';
add('_headers',Buffer.from(headers));
const payload={schemaVersion:'guest-integration-preview-v1',status:'PREVIEW_NO_REMOTE_DATA_NO_SALE',commercialApproved:false,
 sourceBranch:'guest-independent',physicalDesignsExcluded:true,externalAPIsBlockedViaCSP:true,
 gitHubPagesMainUnchanged:true,rootFiles:['guest.html','guest-checkout.html','guest-checkout-return.html','guest-order.html'],
 files:manifest};
fs.writeFileSync(path.join(target,'GUEST_INTEGRATION_STAGE_MANIFEST.json'),JSON.stringify(payload,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',files:manifest.length,guestOnly:true,hasNoindex:true,remoteAPI:false,sale:'NO_GO'}));
