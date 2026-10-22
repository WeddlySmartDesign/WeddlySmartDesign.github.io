const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE='https://775213e7.guest-weddlysmartdesign.pages.dev';
const TOKEN='m'.repeat(64);
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const base={meta:{couple:['Clara','Mateo'],weddingDate:'2027-06-12'},guests:{g1:{name:'Ana de prueba',rsvp:'pending',group:'Amigos'}},tables:{}};
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  const page=await ctx.newPage(),errors=[],consoleErrors=[],requestFailures=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});page.on('requestfailed',req=>requestFailures.push(req.url().split('?')[0]+' '+req.failure()?.errorText));
  await page.addInitScript(t=>{localStorage.setItem('weddly_shared_wedding_token',t)},TOKEN);
  const calls=[];
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
   const u=new URL(route.request().url()),n=u.pathname.split('/').pop();
   calls.push(n);let out={ok:true};
   if(n==='guest-state')out={ok:true,state:base,version:1};
   if(n==='guest-access-check')out={ok:true,product:'guests',edition:'signature'};
   if(n==='guest-license-access')out={ok:true,role:'primary',partnerJoined:false};
   if(n==='guest-rsvp')out={ok:true,forms:[],submissions:[],contacts:[],delivery:[]};
   if(n==='guest-event-state')out={ok:true,state:{events:{}},version:1};
   await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,PUT,OPTIONS','access-control-allow-headers':'*'},body:JSON.stringify(out)});
  });
  await page.goto(BASE+'/guest/index.html',{waitUntil:'domcontentloaded'});
  let core=null;
  for(let i=0;i<120;i++){
   core=page.frames().find(f=>/guests-v114-integrated(?:\.html)?/.test(f.url()));
   if(core){try{await core.waitForSelector('#nav',{timeout:500});break}catch{}}
   await page.waitForTimeout(100)
  }
  if(!core){const debug={frames:page.frames().map(f=>f.url()),boot:await page.locator('#msg').textContent(),requestFailures:requestFailures.slice(-8),consoleErrors:consoleErrors.slice(-10),pageErrors:errors};throw Error('GUEST original iframe unavailable: '+JSON.stringify(debug))}
  assert.ok(await core.locator('#nav').isVisible(),'Guest original navigation not visible');
  const hoy=await core.locator('#hoy').innerText();
  assert.match(hoy,/Confirmados|Pendientes/,'Hoy card not active');
  assert.ok(calls.includes('guest-state'),'Authenticated state was not loaded');
  assert.deepEqual(errors,[],'Runtime page errors: '+errors.join('; '));
  console.log('PASS: real Cloudflare HTTPS loaded 100% original GUEST iframe, Hoy, navigation and mocked authorized session. No customer data.');
  await ctx.close();
  const invalid=await browser.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:'block'});
  const p=await invalid.newPage();
  await p.addInitScript(({token,state})=>{localStorage.setItem('weddly_shared_wedding_token',token);localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(state))},{token:TOKEN,state:base});
  await p.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',r=>r.fulfill({status:403,contentType:'application/json',body:'{"ok":false}'}));
  await p.goto(BASE+'/guest/index.html',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>document.getElementById('msg')?.textContent?.includes('ya no está activo'),{timeout:9000});
  assert.equal(await p.locator('#app').isVisible(),false,'403 exposed cached wedding');
  console.log('PASS: revoked token 403 does not show cached wedding data.');
  await invalid.close();
 }finally{await browser.close()}
})().catch(e=>{console.error('FAIL live HTTPS GUEST:',e.stack||e);process.exit(1)});
