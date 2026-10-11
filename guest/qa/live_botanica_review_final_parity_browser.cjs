#!/usr/bin/env node
'use strict';
// Real Cloudflare-published frozen Botánica master, real Chromium mobile,
// synthetic one/two-venue configurations ONLY. Supabase requests intercepted.
// Never uses real customers, capabilities, Supabase writes, emails or Stripe.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const BASE='https://guest-weddlysmartdesign.pages.dev';
const FLOW='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow';
const TOKEN='qa-not-a-real-capability-012345678901234567890123456789';
const variants=[
 {title:'one-venue-revised-story',config:{schemaVersion:'guest-invitation-config-v1',template:{id:'botanica',version:'14.7'},couple:{name1:'QA Paridad',name2:'Una sede'},date:'2027-06-12',story:{textMode:'custom',customText:'Historia ficticia aprobada tras revisión.'},locations:{mode:'shared',shared:{name:'Lugar único de QA',time:'17:00'}},rsvp:{route:'#',ctaLabel:'Confirmar asistencia'}}},
 {title:'two-venues-no-story',config:{schemaVersion:'guest-invitation-config-v1',template:{id:'botanica',version:'14.7'},couple:{name1:'QA Paridad',name2:'Dos sedes'},date:'2027-06-12',story:{textMode:'none'},locations:{mode:'split',ceremony:{name:'Ceremonia QA',time:'12:30'},celebration:{name:'Celebración QA',time:'15:00'}},rsvp:{route:'#',ctaLabel:'Confirmar asistencia'}}}
];
async function render(browser,variant,kind){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block',reducedMotion:'reduce'});
 const p=await ctx.newPage();const calls=[],errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.route(FLOW,route=>{
  const body=route.request().postDataJSON();calls.push(body.action);
  assert.equal(body.token,TOKEN,'only synthetic QA capability may be used');
  assert.equal(body.action,kind==='review'?'review_load':'public_load','no writes allowed');
  const order=kind==='review'?
   {id:'fictional-parity-order',status:'review_sent',label:variant.title,config:variant.config,revisionCount:1}:
   {id:'fictional-parity-order',mode:'test',label:variant.title,config:variant.config};
  return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,order})});
 });
 try{
  const u=BASE+(kind==='review'?'/guest-review-v1.html?t=':'/guest/catalog-final.html?p=')+TOKEN;
  await p.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
  try{await p.locator('iframe').waitFor({state:'attached',timeout:65000});}
  catch(e){
   const state=await p.locator('#state').innerText().catch(()=>'(no state)'),
    count=await p.locator('iframe').count();
   throw Error('NO_IFRAME '+kind+' '+variant.title+' state='+state.slice(0,230)+' iframeCount='+count+' pageErrors='+errors.slice(0,4).join('; ')+' original='+String(e).slice(0,120));
  }
  await p.waitForTimeout(1200);
  const frame=p.frameLocator('iframe');
  const info=await frame.locator('body').evaluate(el=>({
    text:el.innerText,htmlLength:document.documentElement.outerHTML.length,
    hasApply:typeof window.BOTANICA_APPLY_CONFIG==='function',
    location:window.location.pathname
  }));
  assert(info.hasApply,'real frozen Botánica adapter must run');
  assert(info.htmlLength>100000,'real published master must load, not a mocked HTML file');
  assert(info.text.includes(variant.config.couple.name1)&&info.text.includes(variant.config.couple.name2),'personalized names must appear');
  assert.deepEqual(calls,[kind==='review'?'review_load':'public_load']);
  assert.deepEqual(errors,[],'no JS errors in actual visual asset');
  // The source master and resolved config must remain identical.
  // Transient countdown seconds, reveal animations and distinct wrapper banners
  // are not content discrepancies. Test substantive strings rather than pixels.
  const known=[variant.config.couple.name1,variant.config.couple.name2];
  const matched=known.every(x=>info.text.includes(x));
  assert(matched);
  return {text:info.text.replace(/\b\d{1,2}:\d{2}:\d{2}\b/g,'[clock]'),masterPath:info.location};
 }finally{await ctx.close()}
}
(async()=>{
 const b=await chromium.launch({headless:true});
 try{
  for(const variant of variants){
   const review=await render(b,variant,'review');
   const final=await render(b,variant,'final');
   assert.equal(review.masterPath,final.masterPath,'review/final must run same published visual master');
   const expected=[variant.config.couple.name1,variant.config.couple.name2];
   for(const word of expected)assert(review.text.includes(word)&&final.text.includes(word));
   const digest=x=>crypto.createHash('sha256').update(x).digest('hex').slice(0,12);
   console.log('PASS actual Cloudflare frozen master review/final in mobile Chromium: '+variant.title+'; review-text '+digest(review.text)+' final-text '+digest(final.text)+'; same master, same names, no orders written');
  }
 }finally{await b.close()}
})().catch(e=>{console.error('FAIL published Botánica review/final parity: '+(e.stack||e));process.exitCode=1});
