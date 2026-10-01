const { chromium }=require('playwright');
const fs=require('fs'),path=require('path');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const root=path.resolve(__dirname,'..','..'),base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const TOKEN='m'.repeat(64),INV='i'.repeat(64),CODE='WSD-GUEST-12345678-12345678-12345678';
function staticAudit(){
 const access=fs.readFileSync(path.join(root,'guest','access.html'),'utf8');
 const stripe=fs.readFileSync(path.join(root,'guest','backend','guest-stripe-checkout','index.ts'),'utf8');
 ok(access.includes("guest-license-access"),'activation page uses wrong backend');
 ok(access.includes("localStorage.setItem(TOKEN"),'member token is not persisted');
 ok(access.includes("location.replace('index.html')"),'activation does not enter GUEST');
 ok(stripe.includes("activationCode()"),'paid provisioning does not create activation code');
 ok(stripe.includes("source_order_id"),'paid provisioning is not bound to Stripe session');
}
async function activation(browser){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage();let calls=[];
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-license-access',async route=>{
  let b={};try{b=route.request().postDataJSON()||{}}catch{};calls.push(b);
  if(b.action==='activate')return route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,weddingId:'w1',role:'primary',memberToken:TOKEN})});
  if(b.action==='status')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,weddingId:'w1',role:'primary',partnerJoined:false,edition:'essential'})});
  return route.fulfill({status:400,contentType:'application/json',body:'{}'});
 });
 await page.goto(base+'/guest/access.html#code='+encodeURIComponent(CODE),{waitUntil:'domcontentloaded'});
 await page.waitForURL(/guest\/index\.html$/,{timeout:6000});
 const saved=await page.evaluate(()=>localStorage.getItem('weddly_shared_wedding_token'));
 ok(saved===TOKEN,'activation token not persisted');
 ok(calls.some(x=>x.action==='activate'&&x.activationCode===CODE),'activation code not submitted');
 await ctx.close();
}
async function partner(browser){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage();
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-license-access',async route=>{
  let b={};try{b=route.request().postDataJSON()||{}}catch{};
  if(b.action==='join')return route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,weddingId:'w1',role:'partner',memberToken:TOKEN})});
  return route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({ok:false,error:'invalid_member'})});
 });
 await page.goto(base+'/guest/access.html?invite='+INV,{waitUntil:'domcontentloaded'});
 ok(await page.locator('#inviteBox').isVisible(),'partner invite UI missing');
 await page.locator('#join').click();await page.waitForURL(/guest\/index\.html$/,{timeout:6000});
 ok(await page.evaluate(()=>localStorage.getItem('weddly_shared_wedding_token'))===TOKEN,'partner token not persisted');
 await ctx.close();
}
async function invalid(browser){
 const ctx=await browser.newContext({viewport:{width:390,height:844}}),page=await ctx.newPage();
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-license-access',async route=>route.fulfill({status:404,contentType:'application/json',body:JSON.stringify({ok:false,error:'invalid_license'})}));
 await page.goto(base+'/guest/access.html',{waitUntil:'domcontentloaded'});await page.locator('#code').fill('BAD-CODE');await page.locator('#activate').click();
 await page.waitForFunction(()=>document.querySelector('#msg')?.textContent.includes('No encontramos'));
 ok(page.url().includes('/guest/access.html'),'invalid code escaped access page');await ctx.close();
}
(async()=>{staticAudit();const b=await chromium.launch({headless:true});await activation(b);await partner(b);await invalid(b);await b.close();console.log('B8.4 activation delivery access: PASS')})().catch(e=>{console.error('B8.4 FAIL:',e.stack||e);process.exit(1)});
