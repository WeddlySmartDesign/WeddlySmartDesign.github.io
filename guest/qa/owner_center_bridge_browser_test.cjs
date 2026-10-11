#!/usr/bin/env node
'use strict';
// Physical Chromium, real GUEST V4.7 extension + real Cloudflare bridge/viewer
// code. ALL HTTPS intercepted; no real Supabase, customer, email or sale.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ORIGIN='https://guest-weddlysmartdesign.pages.dev';
const extension=path.join(root,'guest/tools/owner_center_generic_extension_v47.js');
const sources=new Map([
 ['/guest/catalog/owner-center-remote-bridge.html',read('guest/catalog/owner-center-remote-bridge.html')],
 ['/guest/catalog/guest-catalog-owner-viewer-v2.js',read('guest/catalog/guest-catalog-owner-viewer-v2.js')],
 ['/guest/catalog-assets/botanica/14.7/index.html','<!doctype html><html><body><div id="visual"></div><script>window.BOTANICA_APPLY_CONFIG=c=>{document.getElementById("visual").textContent=c.couple.name1+" y "+c.couple.name2+" | "+c.locations.mode}</script></body></html>'],
 ['/guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',JSON.stringify({templates:{botanica:{id:'botanica',version:'14.7',status:'certification-pending',mode:'iframe',src:'/guest/catalog-assets/botanica/14.7/index.html',applyApi:'BOTANICA_APPLY_CONFIG'}}})]
]);
async function trial(b,mode){
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
 const page=await ctx.newPage(),requests=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>{
  const u=new URL(r.request().url());requests.push(u.origin+u.pathname);
  if(u.origin!==ORIGIN||!sources.has(u.pathname))return r.abort();
  return r.fulfill({status:200,contentType:u.pathname.endsWith('.json')?'application/json':u.pathname.endsWith('.js')?'text/javascript':'text/html',body:sources.get(u.pathname)});
 });
 try{
  await page.goto('about:blank');await page.setContent('<html><body><div id="reopen"></div><div id="reviewSheet"></div><div id="root"></div></body></html>');
  await page.evaluate(()=>{
    window.reopen=document.getElementById('reopen');
    window.reviewSheet=document.getElementById('reviewSheet');
    window.openCenter=()=>{document.getElementById('root').dataset.opened='true'};
  });
  await page.addScriptTag({path:extension});
  await page.evaluate(mode=>{
   guestCatalogRemote({template_id:'botanica',template_version:'14.7',mode}, {
     template:{id:'botanica',version:'14.7'},couple:{name1:'QA Integración',name2:'Botánica'},locations:{mode:'split'}
   });
  },mode);
  await page.locator('#guestCatalogRemoteStage iframe').waitFor({state:'attached',timeout:20000});
  if(mode==='test'){
   await page.frameLocator('#guestCatalogRemoteStage iframe').frameLocator('iframe').locator('#visual').waitFor({state:'visible',timeout:30000});
   const text=await page.frameLocator('#guestCatalogRemoteStage iframe').frameLocator('iframe').locator('#visual').innerText();
   assert.match(text,/QA Integración y Botánica \| split/,'real runtime must render synthetic GUEST config');
   assert.equal(await page.locator('#guestCatalogRemoteStage p').innerText(),'');
  }else{
   await page.waitForFunction(()=>document.querySelector('#guestCatalogRemoteStage p')?.textContent?.includes('test_only_template'),{timeout:15000});
   assert.equal(await page.frameLocator('#guestCatalogRemoteStage iframe').locator('iframe').count(),0,'production unapproved must NOT render');
  }
  await page.locator('#guestCatalogRemoteStage button').click();
  assert.equal(await page.locator('#guestCatalogRemoteStage').count(),0,'must close and return to center');
  assert.deepEqual(errors,[],'console errors: '+errors.join(';'));
  assert(requests.every(s=>s.startsWith(ORIGIN)),'no external calls');
  console.log('PASS actual generic V4.7 / Cloudflare bridge / viewer mobile Chromium: '+mode);
 }finally{await ctx.close()}
}
(async()=>{
 const b=await chromium.launch({headless:true});
 try{await trial(b,'test');await trial(b,'production')}
 finally{await b.close()}
})().catch(e=>{console.error('FAIL owner Center bridge '+(e.stack||e));process.exitCode=1});
