const fs=require('fs');
const path=require('path');
const http=require('http');
const {chromium}=require('playwright-core');

function must(ok,msg){if(!ok)throw new Error(msg);console.log('PASS',msg)}
const chrome=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
if(!chrome)throw new Error('No system Chromium/Chrome found on QA runner');

const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://127.0.0.1');
  if(u.pathname==='/__rsvp_suite_test.html'){
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
    return res.end(`<!doctype html><html><body style="margin:0"><iframe id="aux" src="/guests-rsvp-operations-live.html?suite=1" style="width:100vw;height:100vh;border:0"></iframe><script>addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='wsd-suite-open')return;const f=document.getElementById('aux');if(e.data.view==='guests-rsvp'){const x=new URL(e.data.url||'/guests-rsvp-operations-live.html',location.href);x.searchParams.set('suite','1');f.src=x.href}else if(e.data.view==='guests-design'){f.dataset.design='1'}})<\/script></body></html>`);
  }
  let p=decodeURIComponent(u.pathname.replace(/^\//,''))||'index.html';
  p=path.resolve(process.cwd(),p);
  if(!p.startsWith(process.cwd())){res.writeHead(403);return res.end('forbidden')}
  fs.readFile(p,(err,data)=>{if(err){res.writeHead(404);return res.end('not found')}res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)})
});

(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const port=server.address().port,origin=`http://127.0.0.1:${port}`;
  const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:393,height:852},screen:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const guestState={meta:{couple:['Ana','Luis'],weddingDate:'2027-06-12'},guests:{
    g1:{name:'Ana Test',group:'Familia',unitId:'Mesa A',rsvp:'pending'},
    g2:{name:'Luis Test',group:'Familia',unitId:'Mesa A',rsvp:'pending'},
    g3:{name:'Invitado +1',group:'Familia',unitId:'Mesa A',rsvp:'confirmed',source:'rsvp_plus_one',rsvpPlusOneOf:'g1',rsvpSourceLabel:'Añadido por RSVP · +1 de Ana Test'}
  }};
  await context.addInitScript(({state})=>{try{localStorage.setItem('weddly_shared_wedding_token','T'.repeat(64));localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(state));localStorage.setItem('weddly_access_lang','es')}catch{}},{state:guestState});
  const page=await context.newPage();
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/**',async route=>{
    const req=route.request(),url=new URL(req.url()),p=url.pathname,method=req.method();
    const reply=x=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(x)});
    if(p.endsWith('/weddly-test-access'))return reply({ok:true,product:'guests',owner:false});
    if(p.endsWith('/weddly-rsvp')&&method==='GET')return reply({ok:true,forms:[{public_token:'qa_public_token',config:{questions:{meal:true,allergy:true,transport:true,plusone:true},transportOffered:true,accommodationOffered:false}}],submissions:[],contacts:[],delivery:[]});
    if(p.endsWith('/weddly-rsvp'))return reply({ok:true});
    if(p.endsWith('/weddly-guests-state')&&method==='GET')return reply({ok:true,version:1,state:guestState});
    if(p.endsWith('/weddly-guests-state'))return reply({ok:true,version:2});
    if(p.endsWith('/weddly-personalization'))return reply({ok:true,personalization:{p1:'Ana',p2:'Luis',date:'2027-06-12'}});
    return reply({ok:true});
  });

  const errors=[];page.on('pageerror',e=>{errors.push(String(e));console.log('PAGEERROR',String(e))});
  await page.goto(`${origin}/__rsvp_suite_test.html`,{waitUntil:'domcontentloaded'});
  const aux=page.frameLocator('#aux');
  await aux.getByText('Ana Test',{exact:true}).waitFor({state:'visible',timeout:10000});
  must(await aux.getByText('Ana Test',{exact:true}).isVisible(),'Send runtime renders Guests inside suite iframe on mobile profile');
  const frame=page.frames().find(f=>f.parentFrame());
  console.log('SEND_RUNTIME',await frame.evaluate(()=>({href:location.href,origin:location.origin,base:document.baseURI,token:!!localStorage.getItem('weddly_shared_wedding_token'),guests:!!localStorage.getItem('weddly_guests_qa_v67')})));
  await page.waitForTimeout(600);
  const heartbeat=await Promise.race([
    frame.evaluate(()=>new Promise(resolve=>setTimeout(()=>resolve('alive'),120))),
    new Promise(resolve=>setTimeout(()=>resolve('blocked'),1500))
  ]);
  must(heartbeat==='alive','mobile event loop remains responsive with an RSVP +1 guest present');
  await aux.locator('[data-manual="g1"]').tap();
  await aux.getByRole('heading',{name:'Respuesta manual',exact:true}).waitFor({state:'visible',timeout:3000});
  must(await aux.locator('#sheet').evaluate(el=>el.classList.contains('on')),'manual RSVP sheet opens by touch');
  await aux.locator('#wsdManualCancel').tap();
  must(!(await aux.locator('#sheet').evaluate(el=>el.classList.contains('on'))),'manual RSVP sheet closes by touch');
  await aux.locator('[data-contact="g1"]').tap();
  await aux.locator('#cp').waitFor({state:'visible',timeout:3000});
  must(await aux.locator('#sheet').evaluate(el=>el.classList.contains('on')),'contact sheet opens by touch');
  await aux.locator('#cc').tap();
  await aux.locator('[data-recipient="g1"]').tap();
  await aux.locator('[data-contact="g1"]').waitFor({state:'visible',timeout:5000});
  must(await aux.locator('[data-contact="g1"]').isVisible(),'recipient checkbox remains interactive by touch');
  await aux.locator('[data-wsd-step="rsvp"]').tap();
  await aux.locator('#mealQ').waitFor({state:'visible',timeout:12000});
  must(await aux.locator('#mealQ').isVisible(),'RSVP step opens inside suite without blocking shell');
  await aux.locator('#mealQ').tap();
  const liveFrame=page.frames().find(f=>f.parentFrame());
  console.log('RSVP_RUNTIME',await liveFrame.evaluate(()=>({href:location.href,origin:location.origin,base:document.baseURI,token:!!localStorage.getItem('weddly_shared_wedding_token')})));
  must(errors.length===0,'no uncaught browser errors during mobile Send → RSVP interaction');
  console.log('RSVP mobile interaction regression suite passed');
  await browser.close();server.close();
})().catch(async e=>{console.error('FAIL',e);try{server.close()}catch{}process.exit(1)});
