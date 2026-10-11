#!/usr/bin/env node
'use strict';
/*
 * PUBLIC Cloudflare Pages precommercial smoke test only.
 * No customer tokens, no Stripe, no Supabase credentials, no real invitations.
 * Verifies public HTTPS files match the original isolated GitHub repository
 * and the visual frozen SHA before any product can be marked sale-ready.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const origin='https://guest-weddlysmartdesign.pages.dev';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const visualHash='fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a';
const visualBytes=11635635;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function assertSiteUrl(url){
 const u=new URL(url);
 assert.equal(u.origin,origin);
 assert.equal(u.protocol,'https:');
}
async function getWithRetry(rel,{retries=7,maxBytes=17000000}={}){
 const url=origin+rel;assertSiteUrl(url);
 let error;
 for(let i=0;i<retries;i++){
  try{
   const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(22000),headers:{'accept':'text/html,application/json,*/*'}});
   if(!r.ok)throw Error('HTTP_'+r.status);
   assert.equal(new URL(r.url).origin,origin,'redirected to a different origin');
   const length=Number(r.headers.get('content-length')||0);
   assert(!length||length<maxBytes,'unexpected remote file too large');
   const data=Buffer.from(await r.arrayBuffer());
   assert(data.length>0&&data.length<=maxBytes,'missing or unexpectedly large response');
   return {data,headers:r.headers,code:r.status};
  }catch(e){error=e;if(i+1<retries)await sleep(8000)}
 }
 throw new Error('PUBLIC_FILE_UNAVAILABLE '+rel+' '+String(error?.message||error).slice(0,140));
}
async function verify(){
 // Public page confirms preproduction ONLY. It is not a wedding checkout.
 const landing=await getWithRetry('/');
 const text=landing.data.toString('utf8');
 assert.match(text,/GUEST by WeddlySmartDesign/);
 assert.match(text,/Entorno de revisión visual/);
 assert.match(text,/Ver diseño en el móvil/);
 assert.doesNotMatch(text,/stripe\.com\/checkout|Stripe\(/i);
 const routes=[
  '/guest/catalog-questionnaire.html',
  '/guest-review-v1.html',
  '/guest/catalog-final.html',
  '/guest/guest-catalog-delivery-runtime-v1.js',
  '/guest/catalog/guest-catalog-owner-viewer-v2.js'
 ];
 for(const route of routes){
   const remote=await getWithRetry(route);
   const local=fs.readFileSync(path.join(root,route.slice(1)));
   assert.equal(sha(remote.data),sha(local),'public file does not match isolated repository: '+route);
   console.log('PASS exact public asset '+route+' bytes='+remote.data.length);
 }
 const graphic=await getWithRetry('/guest/catalog-assets/botanica/14.7/index.html',{maxBytes:15000000});
 assert.equal(graphic.data.length,visualBytes,'Botánica approved bytes mismatch');
 assert.equal(sha(graphic.data),visualHash,'Botánica visual is not the frozen master');
 assert(graphic.data.includes(Buffer.from('window.BOTANICA_APPLY_CONFIG')),'visual adapter missing');
 console.log('PASS Botánica frozen SHA256 '+visualHash+' bytes='+visualBytes);
 const [registryResponse,manifestResponse]=await Promise.all([
   getWithRetry('/guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json'),
   getWithRetry('/GUEST_STAGE_MANIFEST.json')
 ]);
 const registry=JSON.parse(registryResponse.data),manifest=JSON.parse(manifestResponse.data);
 assert.equal(registry.templates?.botanica?.status,'certification-pending','unapproved design improperly on sale');
 assert.equal(registry.templates?.botanica?.src,'/guest/catalog-assets/botanica/14.7/index.html','public preview path missing');
 assert.equal(manifest.status,'PREPRODUCTION_DO_NOT_SELL');
 assert.equal(manifest.commercialApproved,false);
 assert.equal(manifest.design?.visualIncluded,true);
 assert.equal(manifest.design?.masterSha256,visualHash);
 assert.equal(manifest.hosting?.includes('NOT CONNECTED'),true,'build manifest was unexpectedly replaced, inspect release script');
 console.log('PASS public manifest PREPRODUCTION_DO_NOT_SELL, catalog pending, no sale');
 // noindex must be applied by Cloudflare _headers to actual public pages.
 for(const [rel,response] of [['/',landing],['/guest/catalog-assets/botanica/14.7/index.html',graphic]]){
  const robots=response.headers.get('x-robots-tag')||'';
  assert.match(robots,/noindex/i,'staging is indexable: '+rel);
  const mime=response.headers.get('content-type')||'';
  assert.match(mime,/text\/html/i,'bad HTML MIME type: '+rel);
 }
 console.log('PASS public HTTPS, noindex, original master bytes, live common pages. Commercial certification remains NO-GO.');
}
verify().catch(e=>{console.error('CLOUDFLARE_PUBLIC_STAGE_SMOKE_FAILED:',e?.message||e);process.exitCode=1});
