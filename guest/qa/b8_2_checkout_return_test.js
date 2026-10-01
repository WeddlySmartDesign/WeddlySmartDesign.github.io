const { chromium } = require('playwright');
const fs=require('fs'),path=require('path');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const repoRoot=path.resolve(__dirname,'..','..');
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const session='cs_test_GUESTB82ABC123';

function staticAudit(){
  const checkout=fs.readFileSync(path.join(repoRoot,'guest-checkout.html'),'utf8');
  const ret=fs.readFileSync(path.join(repoRoot,'guest-checkout-return.html'),'utf8');
  ok(checkout.includes("action:'create'"),'checkout create action missing');
  ok(checkout.includes('startPersonalizationConsent:true'),'checkout consent payload missing');
  ok(checkout.includes('/functions/v1/guest-stripe-checkout'),'checkout not using GUEST endpoint');
  ok(ret.includes("action:'status'"),'return status action missing');
  ok(ret.includes("guest-order.html?session_id="),'return → order route missing');
  ok(!/weddly-stripe-checkout|checkout-return\.html\?session_id=/i.test(checkout.replace(/guest-checkout-return\.html/g,'')),'foreign ONE checkout route detected');
}

async function mockConfigAndCreate(page,seen){
  await page.addInitScript(()=>{
    window.Stripe=function(){
      return {initEmbeddedCheckout:async opts=>{
        await opts.fetchClientSecret();
        return {mount(sel){document.querySelector(sel).dataset.qaMounted='1'},destroy(){}};
      }};
    };
  });
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout',async route=>{
    let body={};try{body=route.request().postDataJSON()||{}}catch{}
    seen.push(body);
    if(body.action==='config'){
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
        ok:true,publishableKey:'pk_test_guest',prices:{essential:{current:3990},signature:{current:4990}}
      })});
    }
    if(body.action==='create'){
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
        ok:true,clientSecret:'cs_test_secret_GUEST',sessionId:session,edition:body.edition
      })});
    }
    return route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({ok:false,error:'unexpected'})});
  });
}

async function checkoutAt(browser,edition){
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),seen=[];await mockConfigAndCreate(page,seen);
  await page.goto(base+'/guest-checkout.html?edition='+edition,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.edition.selected');
  ok(await page.locator('.edition.selected').getAttribute('data-edition')===edition,'wrong selected edition '+edition);
  ok(!(await page.locator('#consent').isChecked()),'consent prechecked '+edition);
  ok(!seen.some(x=>x.action==='create'),'payment session created before consent '+edition);
  await page.locator('#consent').check();
  await page.waitForFunction(()=>document.querySelector('#mount')?.dataset.qaMounted==='1');
  const creates=seen.filter(x=>x.action==='create');
  ok(creates.length===1,'expected one create request '+edition+' got '+creates.length);
  ok(creates[0].edition===edition,'create lost edition '+edition);
  ok(creates[0].startPersonalizationConsent===true,'create lost consent '+edition);
  await ctx.close();
}

async function returnCase(browser,submitted){
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await ctx.newPage();
  let calls=0;
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout',async route=>{
    let body={};try{body=route.request().postDataJSON()||{}}catch{}
    calls++;
    ok(body.action==='status','return called unexpected action');
    ok(body.sessionId===session,'return lost session id');
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
      ok:true,paid:true,provisioned:true,edition:'signature',
      orderSubmittedAt:submitted?'2026-10-01T06:00:00Z':null
    })});
  });
  await page.goto(base+'/guest-checkout-return.html?session_id='+encodeURIComponent(session),{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#next')?.classList.contains('on'));
  ok(calls===1,'return status should settle in one successful call');
  ok((await page.locator('#title').innerText())==='Pago confirmado.','return confirmation missing');
  const href=await page.locator('#next').getAttribute('href');
  if(submitted){
    ok(href==='guest.html','submitted order should return to GUEST');
    ok((await page.locator('#next').innerText())==='Volver a GUEST','submitted order label wrong');
  }else{
    ok(href==='guest-order.html?session_id='+encodeURIComponent(session),'paid order route wrong '+href);
  }
  await ctx.close();
}

async function missingSession(browser){
  const ctx=await browser.newContext({viewport:{width:390,height:844}});
  const page=await ctx.newPage();
  let network=false;
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout',async route=>{network=true;await route.abort()});
  await page.goto(base+'/guest-checkout-return.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#title')?.textContent.includes('No hemos podido'));
  ok(!network,'missing session must not call backend');
  ok((await page.locator('#lead').innerText()).includes('No encontramos la referencia'),'missing session message absent');
  await ctx.close();
}

(async()=>{
  staticAudit();
  const browser=await chromium.launch({headless:true});
  await checkoutAt(browser,'essential');
  await checkoutAt(browser,'signature');
  await returnCase(browser,false);
  await returnCase(browser,true);
  await missingSession(browser);
  await browser.close();
  console.log('B8.2 checkout/return contract: PASS');
})().catch(e=>{console.error('B8.2 FAIL:',e.stack||e);process.exit(1)});
