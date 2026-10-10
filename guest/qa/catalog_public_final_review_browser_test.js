#!/usr/bin/env node
'use strict';
/* Entirely mocked browser QA. Never touches Stripe, Cloud data, media or clients.
 * Synthetic certified registry only within browser intercept; LIVE Botánica remains
 * certification-pending and must not be promoted by this test.
 */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const t='fictional-private-capability-token-for-browser-tests-only-123456789';
const config={schemaVersion:'guest-invitation-config-v1',template:{id:'botanica',version:'14.7'},
 couple:{name1:'Prueba',name2:'SinDatosReales'},rsvp:{route:'#',ctaLabel:'Confirmar asistencia'}};
const registry={schemaVersion:'guest-catalog-owner-renderers-v2',templates:{
 botanica:{id:'botanica',version:'14.7',mode:'iframe',applyApi:'BOTANICA_APPLY_CONFIG',status:'commercially-frozen',src:'/guest/catalog-assets/botanica/14.7/index.html'}
}};
const mockAsset='<html><body><main id="rendered"></main><script>window.BOTANICA_APPLY_CONFIG=c=>{window.__received=c;document.querySelector("#rendered").textContent=c.couple.name1+" + "+c.couple.name2+" RSVP "+c.rsvp.route};</script></body></html>';
async function intercept(page,actions,{certified=true}={}){
 await page.route('**/guest/catalog-assets/botanica/14.7/index.html',r=>r.fulfill({status:200,contentType:'text/html',body:mockAsset}));
 if(certified)await page.route('**/guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(registry)}));
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow',async r=>{
   const b=r.request().postDataJSON();actions.push(b);
   const body=b.action==='public_load'?{ok:true,order:{id:'fake',config}}:
       b.action==='review_load'?{ok:true,order:{id:'fake',status:'review_sent',config,revisionCount:0}}:
       b.action==='review_respond'?{ok:true,status:b.decision==='approve'?'approved':'changes_requested'}:{ok:false,error:'blocked'};
   await r.fulfill({status:body.ok?200:400,contentType:'application/json',body:JSON.stringify(body)});
 });
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const actions=[];await intercept(p,actions);
  await p.goto(base+'/guest/catalog-final.html?p='+encodeURIComponent(t)+'&rt=fictional-rsvp-token&g=guest-xyz&lang=es',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>document.getElementById('wsdCatalogDeliveryStatus')?.dataset.state==='ready');
  assert(await p.locator('#state').isHidden(),'final loader must dismiss only after iframe renders');
  const frame=p.frameLocator('iframe');
  const text=await frame.locator('#rendered').innerText();
  assert(text.includes('Prueba + SinDatosReales'),'selected template did not apply config');
  assert(text.includes('/guest/guests-rsvp-v105.html?'),'shared RSVP route was not attached');
  assert(text.includes('g=guest-xyz'),'recipient identity lost');
  assert.equal(actions.length,1);assert.equal(actions[0].action,'public_load');
  await p.close();
  // No capability token = no request.
  const missing=await browser.newPage(),denied=[];await intercept(missing,denied);
  await missing.goto(base+'/guest/catalog-final.html',{waitUntil:'domcontentloaded'});
  await missing.waitForSelector('#state strong');
  assert.equal(denied.length,0,'invalid final link must not call backend');
  await missing.close();
  // LIVE pending catalog must reject customer view even if backend returns a config.
  const forbidden=await browser.newPage(),forbiddenActions=[];
  await intercept(forbidden,forbiddenActions,{certified:false});
  await forbidden.goto(base+'/guest/catalog-final.html?p='+encodeURIComponent(t),{waitUntil:'domcontentloaded'});
  await forbidden.waitForFunction(()=>document.getElementById('state').textContent.includes('No hemos podido abrir'));
  assert.equal(await forbidden.locator('iframe').count(),0,'pending Botánica cannot be shown as commercial final');
  await forbidden.close();
  // Common client approval on a safely mocked certified asset.
  const approved=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),reviewActions=[];
  await intercept(approved,reviewActions);
  await approved.goto(base+'/guest-review-v1.html?t='+encodeURIComponent(t),{waitUntil:'domcontentloaded'});
  await approved.locator('iframe').waitFor();
  await approved.waitForFunction(()=>document.getElementById('state')?.hidden===true);
  assert(await approved.locator('#review').isVisible());
  await approved.locator('#approve').click();
  await approved.waitForFunction(()=>document.getElementById('done')?.textContent.includes('aprobada'));
  assert(reviewActions.some(x=>x.action==='review_respond'&&x.decision==='approve'),'approval not sent to V13');
  await approved.close();
  // Common changes path requires note and never approves silently.
  const changes=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),changeActions=[];
  await intercept(changes,changeActions);
  await changes.goto(base+'/guest-review-v1.html?t='+encodeURIComponent(t),{waitUntil:'domcontentloaded'});
  await changes.waitForFunction(()=>document.getElementById('state')?.hidden===true);
  await changes.locator('#request').click();
  await changes.locator('#send').click();
  assert.equal(changeActions.filter(x=>x.action==='review_respond').length,0,'empty change note submitted');
  await changes.locator('#note').fill('Cambiad la hora');
  await changes.locator('#send').click();
  await changes.waitForFunction(()=>document.getElementById('done')?.textContent.includes('recibido los cambios'));
  assert(changeActions.some(x=>x.action==='review_respond'&&x.decision==='changes'&&x.note==='Cambiad la hora'));
  await changes.close();
  console.log('PASS generic final/review browser: real shared runtime, same-origin iframe, RSVP context, pending-sale block, approve/change API, empty-note block. NO LIVE data.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
