'use strict';
// Browser-only GUEST route integration. All cloud endpoints stubbed; no real orders or credentials.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const ORIGIN='http://127.0.0.1:4173';
const API_HOST='dnjsxequwgtyyauuofxj.supabase.co';
async function check(browser,{edition,recipient,param,lang,hash}){
  const ctx=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  const page=await ctx.newPage();
  let guestPers=0,onePers=0,unexpectedNetwork=0;
  await ctx.route('**/*',route=>{
    const u=new URL(route.request().url());
    if(u.origin===ORIGIN)return route.continue();
    if(u.hostname===API_HOST&&u.pathname==='/functions/v1/guest-personalization'){
      guestPers++;
      return route.fulfill({status:200,contentType:'application/json',
        body:JSON.stringify({ok:true,personalization:{tier:edition}})});
    }
    if(u.hostname===API_HOST&&u.pathname==='/functions/v1/guest-rsvp'){
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,form:{config:{}}})});
    }
    if(u.pathname.includes('weddly-personalization'))onePers++;
    else if(/supabase\.co/.test(u.hostname))unexpectedNetwork++;
    return route.abort();
  });
  const src=new URL('/guest/guests-rsvp-v105.html',ORIGIN);
  src.searchParams.set('guest','1');
  src.searchParams.set('t','synthetic-token');
  src.searchParams.set(param,recipient);
  src.searchParams.set('lang',lang);
  src.hash=hash;
  try{
    await page.goto(src.href,{waitUntil:'commit',timeout:20000});
    await page.waitForURL(u=>u.pathname==='/guest/guests-rsvp-public-clean.html',
      {timeout:20000,waitUntil:'domcontentloaded'});
    await page.waitForFunction(edition=>{
      const iframe=document.querySelector('#invite');
      return !!iframe?.getAttribute('src')?.includes('guests-rsvp-'+edition+'-live.html');
    },edition,{timeout:20000});
    const actual=new URL(page.url());
    assert.equal(actual.pathname,'/guest/guests-rsvp-public-clean.html');
    assert.equal(actual.searchParams.get('t'),'synthetic-token');
    assert.equal(actual.searchParams.get(param),recipient);
    assert.equal(actual.searchParams.get('lang'),lang);
    assert.equal(actual.hash,hash);
    assert.equal(actual.searchParams.get(param==='u'?'g':'u'),null);
    const iframeUrl=new URL(await page.locator('#invite').getAttribute('src'),page.url());
    assert.equal(iframeUrl.pathname,'/guest/guests-rsvp-'+edition+'-live.html');
    assert.equal(iframeUrl.searchParams.get(param),recipient);
    assert(guestPers>=2,'gate and design selector must call own GUEST API');
    assert.equal(onePers,0,'ONE personalization API must never be called');
    assert.equal(unexpectedNetwork,0,'Unexpected Supabase call from public RSVP route');
    console.log('PASS browser route',edition,param,lang);
  }finally{await ctx.close();}
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  await check(browser,{edition:'essential',param:'g',recipient:'fictional-person',lang:'es',hash:'#story'});
  await check(browser,{edition:'signature',param:'u',recipient:'fictional-family',lang:'en',hash:'#rsvp'});
 }finally{await browser.close();}
})().catch(e=>{console.error('GUEST browser route FAIL',e.stack||e);process.exitCode=1;});
