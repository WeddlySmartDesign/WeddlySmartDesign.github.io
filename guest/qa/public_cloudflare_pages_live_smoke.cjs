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
const os=require('node:os');
const child=require('node:child_process');
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
function safeCanonicalRoute(original,finalUrl){
 const dst=new URL(finalUrl),expected=new URL(origin+original);
 assert.equal(dst.origin,expected.origin,'cross-origin redirect forbidden');
 assert.equal(dst.search,'','public staging assets must have no query parameters');
 assert.equal(dst.hash,'','no fragments on static files');
 const cleanHtml=original.endsWith('.html')?original.slice(0,-5):original;
 const cleanIndex=original.endsWith('/index.html')?original.slice(0,-10):original;
 const paths=new Set([original,cleanHtml,cleanIndex]);
 assert(paths.has(dst.pathname),'redirect to unrelated static path is forbidden: '+dst.pathname);
}
function getViaCurl(rel,maxBytes){
 const url=origin+rel;assertSiteUrl(url);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-pages-qa-'));
 const file=path.join(temp,'public.body'),headerFile=path.join(temp,'public.headers');
 try{
  const cli=child.spawnSync('curl',['--silent','--show-error','--fail','--max-time','25',
    '--max-filesize',String(maxBytes),'--proto','=https','--proto-redir','=https','--location','--max-redirs','2',
    '--dump-header',headerFile,'--output',file,'--write-out','%{url_effective}',url],
    {encoding:'utf8',timeout:29000});
  if(cli.status!==0)throw Error('curl_status_'+cli.status+' '+String(cli.stderr||'').trim().slice(0,170));
  safeCanonicalRoute(rel,String(cli.stdout||'').trim());
  const raw=fs.readFileSync(file);assert(raw.length>0&&raw.length<=maxBytes);
  const lines=fs.readFileSync(headerFile,'utf8').split('\n').map(line=>line.trim());
  const statusLine=lines.filter(line=>line.startsWith('HTTP/')).at(-1)||'';
  assert(statusLine.includes(' 200 '),'curl unexpected response: '+statusLine);
  const headers=new Headers();
  for(const line of lines){const sep=line.indexOf(':');if(sep>0)headers.set(line.slice(0,sep).trim(),line.slice(sep+1).trim())}
  return{data:raw,headers,code:200};
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
async function getWithRetry(rel,{retries=3,maxBytes=17000000}={}){
 const url=origin+rel;assertSiteUrl(url);
 let error;
 for(let i=0;i<retries;i++){
  try{
   const r=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(18000),headers:{'accept':'text/html,application/json,*/*','connection':'close'}});
   if(!r.ok)throw Error('HTTP_'+r.status);
   safeCanonicalRoute(rel,r.url);
   const length=Number(r.headers.get('content-length')||0);
   assert(!length||length<maxBytes,'unexpected remote file too large');
   const data=Buffer.from(await r.arrayBuffer());
   assert(data.length>0&&data.length<=maxBytes,'missing or unexpectedly large response');
   return {data,headers:r.headers,code:r.status};
  }catch(e){error=e;if(i===0)console.log('INFO undici transport '+rel+' '+String(e?.cause?.code||e?.message||'failed').slice(0,95));if(i+1<retries)await sleep(1600)}
 }
 console.log('INFO independent curl transport fallback for '+rel);
 try{return getViaCurl(rel,maxBytes)}catch(e){throw new Error('PUBLIC_FILE_UNAVAILABLE '+rel+' [node '+String(error?.message||error).slice(0,95)+', curl '+String(e?.message||e).slice(0,180)+']')}
}

// Public API NEGATIVE tests: never send a real token or manager credential.
// These prove an anonymous caller cannot load invitations or act as owner.
function verifyAnonymousGuards(){
 const endpoint='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow';
 const cases=[
  {action:'public_load',token:'not-a-real-guest-capability-for-negative-qa',expected:'invalid_token'},
  {action:'status',expected:'manager_required'}
 ];
 for(const c of cases){
  const call=child.spawnSync('curl',['--silent','--show-error','--max-time','20',
   '--proto','=https','--request','POST','--header','Content-Type: application/json',
   '--data-binary',JSON.stringify({action:c.action,token:c.token}),
   '--write-out','\\n%{http_code}',endpoint],{encoding:'utf8',timeout:24000,maxBuffer:200000});
  assert.equal(call.status,0,'negative access request unavailable: '+String(call.stderr||'').slice(0,120));
  const marker=call.stdout.lastIndexOf('\n'),code=call.stdout.slice(marker+1).trim();
  assert.equal(code,'403','anonymous '+c.action+' must deny with HTTP 403');
  const response=JSON.parse(call.stdout.slice(0,marker));
  assert.equal(response.ok,false);
  assert.equal(response.error,c.expected);
  assert.equal(response.order,undefined,'anonymous response must not leak an order');
  console.log('PASS anonymous GUEST '+c.action+' denied HTTP 403');
 }
}

async function verify(){
 // Public page confirms preproduction ONLY. It is not a wedding checkout.
 const recovery=fs.readFileSync(path.join(root,'guest/qa/owner-botanica-acceptance.html'),'utf8');
 assert.match(recovery,/Recuperar mis pruebas finalizadas/);
 assert.match(recovery,/action:'list'/);
 assert.match(recovery,/action:'detail'/);
 assert.doesNotMatch(recovery,/action:'create_test'/,'Recovery page must NEVER create duplicate orders');
 const landing=await getWithRetry('/');
 const text=landing.data.toString('utf8');
 assert.match(text,/GUEST by WeddlySmartDesign/);
 assert.match(text,/Entorno de revisión visual/);
 assert.match(text,/Ver diseño en el móvil/);
 assert.doesNotMatch(text,/stripe\.com\/checkout|Stripe\(/i);
 const routes=[
  '/guest/catalog-questionnaire.html',
  '/guest/qa/owner-botanica-acceptance.html',
  '/guest/qa/owner-botanica-rsvp-e2e.html',
  '/guest/qa/owner-botanica-closeout.html',
  '/guest/qa/owner-botanica-touch-benchmark.html',
  '/guest-review-v1.html',
  '/guest/catalog-final.html',
  '/guest/guest-catalog-delivery-runtime-v1.js',
  '/guest/catalog/guest-catalog-owner-viewer-v2.js',
  '/guest/catalog/owner-center-remote-bridge.html'
 ];
 for(const route of routes){
   const remote=await getWithRetry(route);
   const local=fs.readFileSync(path.join(root,route.slice(1)));
   assert.equal(sha(remote.data),sha(local),'public file does not match isolated repository: '+route);
   console.log('PASS exact public asset '+route+' bytes='+remote.data.length);
 }
 const closeout=fs.readFileSync(path.join(root,'guest/qa/owner-botanica-closeout.html'),'utf8');
 assert.match(closeout,/review_load/);
 assert.match(closeout,/public_load/);
 assert.match(closeout,/GUEST_CATALOG_OWNER_VIEWER_V2\.show/);
 assert.doesNotMatch(closeout,/action:'create_test'/,'parity screen must not create orders');
 const touch=fs.readFileSync(path.join(root,'guest/qa/owner-botanica-touch-benchmark.html'),'utf8');
 assert.match(touch,/qa-touch-botanica@example\.invalid/);
 assert.match(touch,/action:'send_review'/);
 assert.match(touch,/No se ha confirmado el envío/);
 assert.match(touch,/Antes de iniciar el cronómetro/,'owner must know expected content before starting');
 assert.match(touch,/Marca cada comprobación/,'five-point real review checklist included in deployed HTML');
 assert.equal((touch.match(/<input type="checkbox" name="reviewCheck"/g)||[]).length,5,'five mobile owner review assertions deployed');
 // These two exact-byte comparisons above are mandatory before asking the
 // owner to exercise the visual and active-work closeout in Android.
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
 verifyAnonymousGuards();
 console.log('PASS public HTTPS, noindex, original master bytes, live common pages. Commercial certification remains NO-GO.');
}
verify().catch(e=>{console.error('CLOUDFLARE_PUBLIC_STAGE_SMOKE_FAILED:',e?.message||e);process.exitCode=1});
