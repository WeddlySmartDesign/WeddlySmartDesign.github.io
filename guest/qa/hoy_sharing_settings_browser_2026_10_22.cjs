const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const TOKEN='k'.repeat(64);
async function scenario(browser,{name,status,joined,role,expectedEnabled}) {
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage();
 const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(t=>{
   localStorage.setItem('weddly_shared_wedding_token',t);
   window.__lastCopied='';
   try{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async s=>{window.__lastCopied=s}}})}catch{}
 },TOKEN);
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-license-access',async route=>{
   const body=route.request().postDataJSON()||{};requests.push(body.action);
   if(body.action==='status')return route.fulfill({status:status,contentType:'application/json',body:JSON.stringify(status===200?{ok:true,role,partnerJoined:joined}:{ok:false,error:'unauthorized'})});
   if(body.action==='invite')return route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,inviteCode:'A'.repeat(56)})});
   return route.fulfill({status:400,body:'{}'});
 });
 await page.goto(BASE+'/guest/guest-settings.html',{waitUntil:'domcontentloaded'});
 const share=page.locator('#share'),copy=page.locator('#copy'),hint=page.locator('#shareHint'),sync=page.locator('#syncText');
 await assertVisible(share,name+' share'),await assertVisible(copy,name+' copy');
 await page.waitForFunction(expected=>document.querySelector('#share').disabled===!expected,expectedEnabled,{timeout:10000});
 assert.equal(await share.isEnabled(),expectedEnabled,name+' enable share');
 assert.equal(await copy.isEnabled(),expectedEnabled,name+' enable copy');
 assert.ok((await hint.innerText()).length>25,name+' missing sharing explanation');
 if(expectedEnabled){
   await copy.click();
   await page.waitForFunction(()=>Boolean(window.__lastCopied),{timeout:7000});
   const clipboard=await page.evaluate(()=>window.__lastCopied);
   assert.match(clipboard,/\/guest\/access\.html\?invite=A{56}/,name+' partner link route');
   assert.equal(requests.filter(a=>a==='invite').length,1,'share creates one invite');
 }else assert.equal(requests.includes('invite'),false,name+' must not create inaccessible invite');
 assert.equal(errors.length,0,name+' page errors: '+errors.join('; '));
 await ctx.close();
 return {name,enabled:expectedEnabled,status:await sync.textContent().catch(()=>''),requestCount:requests.length};
}
async function assertVisible(locator,label){assert.equal(await locator.isVisible(),true,label+' must be visible')}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const checks=[];
  checks.push(await scenario(browser,{name:'primary_without_partner',status:200,role:'primary',joined:false,expectedEnabled:true}));
  checks.push(await scenario(browser,{name:'primary_with_partner',status:200,role:'primary',joined:true,expectedEnabled:false}));
  checks.push(await scenario(browser,{name:'partner_session',status:200,role:'partner',joined:true,expectedEnabled:false}));
  checks.push(await scenario(browser,{name:'server_unavailable',status:503,role:'',joined:false,expectedEnabled:false}));
  console.log('GUEST settings/partner sharing PASS',JSON.stringify(checks));
 }finally{await browser.close()}
})().catch(e=>{console.error('GUEST settings/partner sharing FAIL',e.stack||e);process.exit(1)});
