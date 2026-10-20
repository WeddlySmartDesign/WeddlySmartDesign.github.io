const { chromium } = require('playwright');
const fs=require('fs'),path=require('path');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const repoRoot=path.resolve(__dirname,'..','..');
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';

function staticAudit(){
 const landing=fs.readFileSync(path.join(repoRoot,'guest.html'),'utf8');
 const checkout=fs.readFileSync(path.join(repoRoot,'guest-checkout.html'),'utf8');
 const catalog=JSON.parse(fs.readFileSync(path.join(repoRoot,'guest/GUEST_PROJECT_STATUS_V1.json'),'utf8')).designInventory2026_10_20;
 ok(catalog?.candidateIds?.length===15,'expected 15 individual design candidates');
 for(const id of catalog.candidateIds)ok(landing.includes('data-template-id="'+id+'"'),'individual design missing from storefront: '+id);
 for(const obsolete of ['Colección Essential','Colección Signature','guest-checkout.html?edition=essential','guest-checkout.html?edition=signature','Elegís Essential o Signature']){
   ok(!landing.includes(obsolete),'obsolete collection checkout advertised: '+obsolete);
 }
 ok(!/data-price=|data-gallery=/.test(landing),'unverified prices or fake previews must not be sold');
 ok(landing.includes('48–72 h'),'advertised delivery must match actual reviewed-delivery window');
 for(const p of ['guest.html','guest-checkout.html','guest-checkout-return.html','guest-order.html','guest-legal.html'])
   ok(fs.existsSync(path.join(repoRoot,p)),'missing commercial file '+p);
 ok(checkout.includes('guest-legal.html#contratacion')&&checkout.includes('guest-legal.html#privacidad'),'legal routes missing');
 ok(checkout.includes("if(!catalogSelectionRequested)")&&checkout.includes("||!catalogTemplateId)return;"),'legacy no-design checkout not guarded');
 ok(!/ONE Partner|STUDIO|one\.html|partner\.html/i.test(landing+'\n'+checkout),'foreign products in GUEST sale');
 ok(checkout.includes('/functions/v1/guest-stripe-checkout'),'payment endpoint missing');
}

async function mockConfig(page){
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout',async route=>{
    let body={}; try{body=route.request().postDataJSON()||{}}catch{}
    if(body.action==='config'){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
        ok:true,publishableKey:'pk_test_guest',
        prices:{essential:{current:3990},signature:{current:4990}}
      })});
      return;
    }
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})});
  });
}
async function noOverflow(page,label){
  const x=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));
  ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,label+' overflow '+JSON.stringify(x));
}
async function verifyLegacyBlocked(browser,edition,w,h){
 const ctx=await browser.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
 const page=await ctx.newPage(),payments=[];
 await mockConfig(page);
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout',async route=>{
  try{if(route.request().postDataJSON()?.action==='create')payments.push(true)}catch{}
  await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});
 });
 await page.goto(base+'/guest.html',{waitUntil:'domcontentloaded'});
 await noOverflow(page,'15-design landing '+w);
 ok(await page.locator('.design-card.individual').count()===15,'individual catalog count mismatch');
 ok(await page.locator('a.buychoice').count()===0,'legacy collection checkout still publicly linked');
 await page.goto(base+'/guest-checkout.html?edition='+edition,{waitUntil:'domcontentloaded'});
 ok(await page.locator('#consent').isDisabled(),'legacy '+edition+' checkout consent not blocked');
 ok((await page.locator('#state').innerText()).includes('sin elegir una invitación individual'),'legacy '+edition+' should not accept money');
 ok(payments.length===0,'Stripe session was improperly created for legacy checkout');
 ok(await page.locator('a.back').getAttribute('href')==='guest.html#comprar','back to catalogue missing');
 await noOverflow(page,'legacy blocked checkout '+w);
 await ctx.close();
}

async function verifyCatalogSelection(browser){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),submitted=[];
 await page.addInitScript(()=>{window.Stripe=()=>({initEmbeddedCheckout:async({fetchClientSecret})=>{
  await fetchClientSecret();return{mount(){window.__guestStripeMockMounted=true},destroy(){}}
 }})});
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout',async route=>{
  const body=route.request().postDataJSON();if(body.action==='create')submitted.push(body);
  const result=body.action==='config'?{ok:true,publishableKey:'pk_test_offline',prices:{essential:{current:3990},signature:{current:4990}}}:
    {ok:true,clientSecret:'cs_test_no_real_payment',sessionId:'offline'};
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(result)});
 });
 await page.goto(base+'/guest-checkout.html?edition=signature&catalog_template=veil-light',{waitUntil:'domcontentloaded'});
 ok(await page.locator('#guestCatalogCheckoutNotice').count()===1,'catalog selected design label missing');
 ok(await page.locator('.edition[data-edition="essential"]').isDisabled(),'catalog edition must be locked');
 await page.locator('#consent').check();
 await page.waitForFunction(()=>window.__guestStripeMockMounted===true);
 ok(submitted.length===1,'unexpected payment session count');
 ok(submitted[0].edition==='signature','catalog edition changed');
 ok(submitted[0].catalogTemplateId==='veil-light','catalog template ID did not reach Stripe creator');
 ok(submitted[0].startPersonalizationConsent===true,'consent not preserved');
 await page.goto(base+'/guest-checkout.html?edition=signature&catalog_template=..%2Fbotanica',{waitUntil:'domcontentloaded'});
 ok(await page.locator('#consent').isDisabled(),'malformed catalog URL must block payment consent');
 ok((await page.locator('#state').innerText()).includes('no es válido'),'invalid catalog reason missing');
 ok(submitted.length===1,'malformed URL must never call Stripe');
 await ctx.close();
}
(async()=>{
  staticAudit();
  const browser=await chromium.launch({headless:true});
  for(const [w,h] of [[390,844],[1366,900]]){
    await verifyLegacyBlocked(browser,'essential',w,h);
    await verifyLegacyBlocked(browser,'signature',w,h);
  }
  await verifyCatalogSelection(browser);
  await browser.close();
  console.log('B8.1 commercial entry flow: PASS');
})().catch(e=>{console.error('B8.1 FAIL:',e.stack||e);process.exit(1)});
