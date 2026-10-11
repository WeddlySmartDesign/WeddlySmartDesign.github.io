#!/usr/bin/env node
'use strict';
// Run on the EXISTING Playwright CI job. Actual shared HTML + mobile Chromium,
// but every API request is intercepted in-browser. No customer accounts, uploads,
// Stripe, actual Cloud writes, or private capabilities. TEST only.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const BASE='http://127.0.0.1:4173';
const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow';
const TOKEN='fictional-questionnaire-capability-for-offline-browser-only-0123456789';
const PNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l7kAAAAASUVORK5CYII=','base64');

async function test(browser,{split,none}){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
 const page=await ctx.newPage(),calls=[],errors=[],blocked=[];
 page.on('pageerror',e=>errors.push(e.message));
 await ctx.route('**/*',async route=>{
  const req=route.request(),url=req.url();
  if(url.startsWith(BASE+'/'))return route.continue();
  if(url!==API){blocked.push(new URL(url).origin);return route.abort();}
  const mime=req.headers()['content-type']||'';
  let action,body;
  if(mime.includes('multipart/form-data')){
   const data=req.postData()||'';
   assert(data.includes('name="slot"')&&data.includes('story'),'only synthetic Story photo is allowed');
   action='upload';
   body={ok:true,file:{slot:'story',name:'qa-photo.png',url:'data:image/png;base64,'+PNG.toString('base64')}};
  }else{
   const data=req.postDataJSON();action=data.action;
   assert.equal(data.token,TOKEN,'every request must preserve the synthetic capability');
   body=action==='load'?{ok:true,order:{id:'fictional-order',mode:'test',templateId:'botanica',status:'draft',files:[],questionnaire:{}}}:
    action==='save'?{ok:true,savedAt:'2026-10-11T00:00:00Z'}:
    action==='submit'?{ok:true,submittedAt:'2026-10-11T00:00:00Z'}:
    {ok:false,error:'unsupported_action'};
   if(action==='save'||action==='submit')assert.equal(data.questionnaire?.couple?.name1,split?'Prueba Dos':'Prueba Una');
  }
  calls.push({action,...(action==='save'||action==='submit'?{q:req.postDataJSON().questionnaire}:{})});
  await route.fulfill({status:body.ok?200:400,contentType:'application/json',headers:{'Cache-Control':'no-store'},body:JSON.stringify(body)});
 });
 const next=async step=>{
  await page.locator('#next').click();
  await page.waitForFunction(n=>document.querySelector('.step.on')?.getAttribute('data-step')===String(n),step,{timeout:10000});
 };
 try{
  await page.goto(BASE+'/guest/catalog-questionnaire.html?t='+encodeURIComponent(TOKEN),{waitUntil:'domcontentloaded'});
  await page.locator('#name1').fill(split?'Prueba Dos':'Prueba Una');
  await page.locator('#name2').fill('Botanica');
  await page.locator('#date').fill('2027-06-12');
  await page.locator('#email').fill('test@example.invalid');
  await next(1);
  if(none){
   await page.locator('label.choice:has(input[name="storyPreset"][value="none"])').click();
   await page.locator('#next').click();
   assert.equal(await page.locator('.step.on').getAttribute('data-step'),'1','photo-only cannot advance without image');
   assert.match(await page.locator('#msg').innerText(),/solo una fotografía/i);
   await page.locator('#storyFile').setInputFiles({name:'qa-photo.png',mimeType:'image/png',buffer:PNG});
   await page.waitForFunction(()=>document.getElementById('storyFileInfo')?.textContent.includes('qa-photo.png'));
  }else{
   await page.locator('label.choice:has(input[name="storyPreset"][value="custom"])').click();
   await page.locator('#storyCustom').fill('Historia modificada y aprobada.');
  }
  await next(2);
  if(split){
   await page.locator('label.choice:has(input[name="locMode"][value="split"])').click();
   await page.locator('#cerName').fill('Ceremonia de prueba');
   await page.locator('#cerTime').fill('12:30');
   await page.locator('#celName').fill('Celebración de prueba');
   await page.locator('#celTime').fill('15:00');
  }else{
   await page.locator('#sharedName').fill('Lugar único de prueba');
   await page.locator('#sharedTime').fill('17:00');
  }
  await next(3);
  await page.locator('label.switchrow:has(#agendaEnabled)').click();
  await next(4);
  await next(5);
  await page.locator('label.switchrow:has(#galleryEnabled)').click();
  await next(6);
  const review=await page.locator('#review').innerText();
  if(split){assert(review.includes('Ceremonia de prueba')&&review.includes('Celebración de prueba'));}
  else{assert(review.includes('Lugar único de prueba')&&review.includes('Historia modificada y aprobada.'));}
  await page.locator('label.confirm:has(#reviewed)').click();
  await page.locator('#submit').click();
  await page.waitForFunction(()=>document.getElementById('done')?.classList.contains('on'));
  const submitted=calls.filter(c=>c.action==='submit');assert.equal(submitted.length,1);
  const q=submitted[0].q;
  assert.equal(q.locations.mode,split?'split':'shared');
  assert.equal(q.story.textMode,none?'none':'custom');
  assert.equal(q.gallery.enabled,false);
  assert.equal(q.confirmation.reviewed,true);
  assert.equal(q.contact.email,'test@example.invalid');
  if(none)assert.equal(calls.filter(c=>c.action==='upload').length,1);
  assert(calls.filter(c=>c.action==='save').length>=4,'must autosave each completed stage');
  assert.equal(errors.length,0,'browser errors: '+errors.join('; '));
  assert(blocked.every(origin=>origin==='https://fonts.googleapis.com'||origin==='https://fonts.gstatic.com'),'unexpected external request '+blocked);
  console.log('PASS real shared QUESTIONNAIRE mobile Chromium '+(split?'TWO venues + photo only':'ONE venue + custom Story')+': seven steps, validation, review, synthetic upload, save and submit. API fully intercepted; NO LIVE Cloud.');
 }finally{await ctx.close()}
}
(async()=>{const b=await chromium.launch({headless:true});try{await test(b,{split:false,none:false});await test(b,{split:true,none:true})}finally{await b.close()}})().catch(e=>{console.error('GUEST shared questionnaire mobile QA FAILED:',e.stack||e);process.exitCode=1;});
