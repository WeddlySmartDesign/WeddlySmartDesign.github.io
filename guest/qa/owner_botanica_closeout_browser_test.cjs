#!/usr/bin/env node
'use strict';
// Real owner QA HTML and shared owner viewer, mobile Chromium,
// all Supabase calls mocked; NEVER creates orders in live Cloud.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const BASE='http://127.0.0.1:4173',FLOW='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow',
 LOGIN='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-owner-manager';
const config={schemaVersion:'guest-invitation-config-v1',template:{id:'botanica',version:'14.7'},couple:{name1:'QA Interfaz',name2:'Botánica'},story:{textMode:'custom',customText:'Historia QA'},locations:{mode:'shared',shared:{name:'Sede QA',time:'17:00'}},rsvp:{route:'#'}};
const template={schemaVersion:'guest-catalog-owner-renderers-v2',templates:{botanica:{id:'botanica',version:'14.7',mode:'iframe',applyApi:'BOTANICA_APPLY_CONFIG',status:'certification-pending',src:'/guest/catalog-assets/botanica/14.7/index.html'}}};
const fakeAsset='<html><body><main id="rendered"></main><script>window.BOTANICA_APPLY_CONFIG=c=>{document.getElementById("rendered").textContent=c.couple.name1+" y "+c.couple.name2;}</script></body></html>';
async function test(browser,type){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
 const page=await ctx.newPage(),calls=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const token='v1.very-long-fake-token-never-authentic',ownerOrder='aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
 let orderStatus='submitted';
 await ctx.route('**/guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(template)}));
 await ctx.route('**/guest/catalog-assets/botanica/14.7/index.html',r=>r.fulfill({contentType:'text/html',body:fakeAsset}));
 await ctx.route(LOGIN,r=>r.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,managerToken:token})}));
 await ctx.route(FLOW,async r=>{
  const b=r.request().postDataJSON(),a=b.action;calls.push(a);
  let out={ok:true},status=200;
  if(a==='list')out.orders=type==='touch'?[]:[
   {id:ownerOrder,templateId:'botanica',mode:'test',status:'delivered',buyerEmail:'qa-botanica@example.invalid',deliveredAt:'2026-10-11T16:00:00Z'},
   {id:'ffffffff-aaaa-4bbb-8ccc-dddddddddddd',templateId:'botanica',mode:'test',status:'delivered',buyerEmail:'qa-botanica@example.invalid',deliveredAt:'2026-10-11T15:00:00Z'}];
  else if(a==='detail'){
   const mode=b.orderId===ownerOrder?'shared':'split';
   const mail=type==='touch'?'qa-touch-botanica@example.invalid':'qa-botanica@example.invalid';
   out.order={id:b.orderId,mode:'test',status:type==='touch'?orderStatus:'delivered',template_id:'botanica',buyer_email:mail,
    questionnaire:{locations:{mode}},hydratedConfig:config,reviewToken:'review-'+b.orderId,publicToken:'public-'+b.orderId};
  }else if(a==='create_test')out={ok:true,id:ownerOrder,qToken:'fictional-private-questionnaire-token'};
  else if(a==='save'||a==='submit')out={ok:true};
  else if(a==='start_design'){orderStatus='designing';out={ok:true,status:'designing'}}
  else if(a==='mark_review_ready'){orderStatus='review_ready';out={ok:true,status:'review_ready'}}
  else if(a==='send_review'){orderStatus='review_sent';out={ok:true,status:'review_sent',localTest:true}}
  else if(a==='review_load')out.order={id:b.token.slice(7),config,status:'delivered'};
  else if(a==='public_load')out.order={id:b.token.slice(7),config,mode:'test'};
  else if(a!=='status') {out={ok:false,error:'unexpected_'+a};status=400}
  await r.fulfill({status,contentType:'application/json',body:JSON.stringify(out)});
 });
 try{
  const url=BASE+'/guest/qa/owner-botanica-'+(type==='touch'?'touch-benchmark':'closeout')+'.html';
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator(type==='touch'?'#code':'#owner').fill('fictional-owner-code-without-any-real-secret-12345');
  await page.locator(type==='touch'?'#prepare':'#load').click();
  if(type==='touch'){
   await page.locator('#task').waitFor({state:'visible',timeout:15000});
   await page.frameLocator('iframe').locator('#rendered').waitFor({state:'visible'});
   await page.locator('#send').click();
   await page.locator('#done').waitFor({state:'visible',timeout:15000});
   assert.match(await page.locator('#final').innerText(),/revisión Botánica TEST enviada sin correo/i);
   assert.deepEqual(calls.filter(x=>['create_test','save','submit','start_design','mark_review_ready','send_review'].includes(x)),
    ['create_test','save','submit','start_design','mark_review_ready','send_review']);
  }else{
   await page.locator('#results .item').nth(1).waitFor({state:'visible',timeout:15000});
   assert.equal(await page.locator('#results .item').count(),2);
   assert.match(await page.locator('#state').innerText(),/misma configuración en revisión y final/i);
   await page.locator('#results .item').first().locator('button').click();
   await page.frameLocator('iframe').locator('#rendered').waitFor({state:'visible'});
   await page.locator('#start').click();await page.waitForTimeout(1200);await page.locator('#finish').click();
   assert.match(await page.locator('#touchResult').innerText(),/Tiempo activo observado/);
   assert(calls.every(a=>['list','detail','public_load','review_load'].includes(a)),'closeout must never write');
  }
  assert.deepEqual(errors,[],'JS runtime issues: '+errors.join('; '));
  console.log('PASS owner Botánica '+type+' mobile browser with actual shared viewer; all API calls isolated');
 }finally{await ctx.close()}
}
(async()=>{const browser=await chromium.launch({headless:true});try{await test(browser,'closeout');await test(browser,'touch')}finally{await browser.close()}})().catch(e=>{console.error('FAIL GUEST owner acceptance browser',e.stack||e);process.exitCode=1});
