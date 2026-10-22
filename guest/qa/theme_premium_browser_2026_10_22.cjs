const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173',TOKEN='t'.repeat(64);
let state={meta:{couple:['Clara','Mateo'],weddingDate:'2027-06-12'},guests:{g1:{name:'Ana',rsvp:'pending',mealRequired:true,table:'',group:'Amigos'}},tables:{}};
const themeRGB={blush:'rgb(130, 95, 93)',slate:'rgb(76, 89, 99)',nordic:'rgb(82, 92, 67)'};
async function mock(page){
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
  const u=new URL(route.request().url()),slug=u.pathname.split('/').pop();let body={};try{body=route.request().postDataJSON()||{}}catch{}
  let data={ok:true};
  if(slug==='guest-state'){
   if(route.request().method()==='GET')data={ok:true,state,version:1};
   else{state=body.state||state;data={ok:true,state,version:2}}
  }
  if(slug==='guest-license-access')data={ok:true,role:'primary',partnerJoined:false};
  if(slug==='guest-access-check')data={ok:true,product:'guests'};
  if(slug==='guest-rsvp')data={ok:true,forms:[],delivery:[],contacts:[],submissions:[]};
  if(slug==='guest-event-state')data={ok:true,state:{events:{}},version:1};
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
 });
}
async function core(page){
 for(let i=0;i<100;i++){const f=page.frames().find(f=>/guests-v114-integrated(?:\.html)?/.test(f.url()));if(f){await f.waitForSelector('#nav button.on');return f}await page.waitForTimeout(100)}
 throw new Error('core not mounted');
}
async function checkTheme(f,key){
 try{await f.waitForFunction(expected=>getComputedStyle(document.querySelector('#nav button.on')).backgroundColor===expected,themeRGB[key],{timeout:6000})}catch(e){const debug=await f.evaluate(()=>({actual:getComputedStyle(document.querySelector('#nav button.on')).backgroundColor,root:getComputedStyle(document.documentElement).getPropertyValue('--guest-olive'),body:getComputedStyle(document.body).backgroundColor,styles:[...document.querySelectorAll('style')].map(x=>x.id).filter(Boolean),store:localStorage.getItem('weddly_personal_theme_v51')}));throw new Error('Theme '+key+' actual='+JSON.stringify(debug)+' '+e.message)}
 const values=await f.evaluate(()=>({selected:getComputedStyle(document.querySelector('#nav button.on')).backgroundColor,body:getComputedStyle(document.body).backgroundColor,root:getComputedStyle(document.documentElement).getPropertyValue('--guest-olive').trim()}));
 assert.equal(values.selected,themeRGB[key],key+' premium bottom navigation did not change theme');
}
(async()=>{
 const browser=await chromium.launch({headless:true}),ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await mock(page);
 await page.addInitScript(t=>{localStorage.setItem('weddly_shared_wedding_token',t);if(!sessionStorage.getItem('guestThemeTestBoot')){localStorage.setItem('weddly_personal_theme_v51','blush');sessionStorage.setItem('guestThemeTestBoot','1')}},TOKEN);
 try{
  await page.goto(BASE+'/guest/index.html#hoy',{waitUntil:'domcontentloaded'});
  let f=await core(page);await checkTheme(f,'blush');
  await f.locator('#editWedding').click();
  await page.waitForURL(/\/guest\/guest-settings\.html/,{timeout:8000});
  assert.equal(await page.locator('#theme').inputValue(),'blush');
  await page.locator('#theme').selectOption('slate');
  await page.locator('#save').click();
  assert.match(await page.locator('#saveMsg').innerText(),/guardados/i);
  await page.locator('#back').click();
  await page.waitForURL(/\/guest\/index\.html/,{timeout:8000});
  f=await core(page);await checkTheme(f,'slate');
  assert.deepEqual(errors,[],'premium/theme runtime errors');
  console.log('GUEST five-theme premium palette PASS: blush persisted to slate across Settings roundtrip');
 }finally{await ctx.close();await browser.close()}
})().catch(e=>{console.error('GUEST themes FAIL',e.stack||e);process.exit(1)});
