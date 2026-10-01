const { chromium } = require('playwright');
const fs=require('fs'),path=require('path');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const repoRoot=path.resolve(__dirname,'..','..');
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const session='cs_test_GUESTB83XYZ';

function staticAudit(){
 const src=fs.readFileSync(path.join(repoRoot,'guest-order.html'),'utf8');
 ok(src.includes("action:'status'"),'order purchase validation missing');
 ok(src.includes("action:'submit_order'"),'order submit action missing');
 ok(src.includes("x.paid"),'order does not require paid purchase');
 ok(src.includes("x.edition==='signature'"),'edition-specific design selection missing');
 ok(src.includes("guest-stripe-checkout"),'order uses wrong backend');
 for(const f of ['couple1','couple2','weddingDate','design'])ok(src.includes('name="'+f+'"'),'required order field missing '+f);
}

async function orderCase(browser,edition,alreadySubmitted=false){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage();const seen=[];
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout',async route=>{
   let body={};try{body=route.request().postDataJSON()||{}}catch{};seen.push(body);
   if(body.action==='status')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
     ok:true,paid:true,provisioned:true,edition,orderSubmittedAt:alreadySubmitted?'2026-10-01T06:00:00Z':null
   })});
   if(body.action==='submit_order')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
     ok:true,submittedAt:'2026-10-01T06:10:00Z',edition,email:'qa@example.com'
   })});
   return route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({ok:false,error:'unexpected'})});
 });
 await page.goto(base+'/guest-order.html?session_id='+session,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('#edition')?.textContent.includes('GUEST')||document.querySelector('#done')?.classList.contains('on'));
 if(alreadySubmitted){
   ok(await page.locator('#done').evaluate(el=>el.classList.contains('on')),'submitted order not recognized');
   ok(await page.locator('#form').evaluate(el=>el.classList.contains('off')),'submitted order form still visible');
   await ctx.close();return;
 }
 const options=await page.locator('#design option').allTextContents();
 for(const x of ['Essential 01','Essential 06'])ok(options.includes(x),'essential design missing '+x);
 if(edition==='signature'){
   for(const x of ['Signature 01','Signature 04'])ok(options.includes(x),'signature design missing '+x);
 }else{
   ok(!options.some(x=>x.startsWith('Signature')),'Essential can select Signature');
 }
 await page.locator('[name=couple1]').fill('Pilar');
 await page.locator('[name=couple2]').fill('Jorge');
 await page.locator('[name=weddingDate]').fill('2027-09-12');
 await page.locator('[name=contactPhone]').fill('600000000');
 await page.locator('[name=ceremonyVenue]').fill('Iglesia');
 await page.locator('[name=celebrationVenue]').fill('Finca');
 await page.locator('#form').evaluate(form=>form.requestSubmit());
 await page.waitForFunction(()=>document.querySelector('#done')?.classList.contains('on'));
 const sub=seen.find(x=>x.action==='submit_order');
 ok(!!sub,'submit_order not sent');
 ok(sub.sessionId===session,'submit lost session');
 ok(sub.details.couple1==='Pilar'&&sub.details.couple2==='Jorge','couple data lost');
 ok(sub.details.weddingDate==='2027-09-12','wedding date lost');
 ok(typeof sub.details.transport==='boolean'&&typeof sub.details.children==='boolean','RSVP toggles not normalized');
 await ctx.close();
}
async function invalidPurchase(browser){
 const ctx=await browser.newContext({viewport:{width:390,height:844}});
 const page=await ctx.newPage();
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout',async route=>{
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,paid:false,provisioned:false,edition:'essential'})});
 });
 await page.goto(base+'/guest-order.html?session_id='+session,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('#form')?.classList.contains('off'));
 ok((await page.locator('#msg').innerText()).includes('validar esta compra'),'unpaid purchase not blocked');
 await ctx.close();
}
(async()=>{
 staticAudit();
 const browser=await chromium.launch({headless:true});
 await orderCase(browser,'essential');
 await orderCase(browser,'signature');
 await orderCase(browser,'signature',true);
 await invalidPurchase(browser);
 await browser.close();
 console.log('B8.3 order personalization flow: PASS');
})().catch(e=>{console.error('B8.3 FAIL:',e.stack||e);process.exit(1)});
