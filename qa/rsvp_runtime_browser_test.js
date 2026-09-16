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
  let p=decodeURIComponent(u.pathname.replace(/^\//,''))||'index.html';
  p=path.resolve(process.cwd(),p);
  if(!p.startsWith(process.cwd())){res.writeHead(403);return res.end('forbidden')}
  fs.readFile(p,(err,data)=>{if(err){res.writeHead(404);return res.end('not found')}res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)})
});

(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const port=server.address().port,origin=`http://127.0.0.1:${port}`;
  const browser=await chromium.launch({headless:true,executablePath:chrome,args:['--no-sandbox']});
  const context=await browser.newContext();
  const guestState={meta:{couple:['Ana','Luis'],weddingDate:'2027-06-12'},guests:{g1:{name:'Ana Test',group:'Familia',unitId:'Mesa A',rsvp:'pending'},g2:{name:'Luis Test',group:'Familia',unitId:'Mesa A',rsvp:'pending'}}};
  await context.addInitScript(({state})=>{
    localStorage.setItem('weddly_shared_wedding_token','T'.repeat(64));
    localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(state));
    localStorage.setItem('weddly_access_lang','es');
  },{state:guestState});
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

  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`${origin}/guests-rsvp-operations-live.html?suite=1`,{waitUntil:'domcontentloaded'});
  await page.getByText('Ana Test',{exact:true}).waitFor({state:'visible',timeout:10000});
  must(await page.getByText('Ana Test',{exact:true}).isVisible(),'Send runtime renders Guests');
  const cb=page.locator('[data-recipient="g1"]');
  await cb.click();
  await page.locator('[data-contact="g1"]').waitFor({state:'visible',timeout:5000});
  must(await page.locator('[data-contact="g1"]').isVisible(),'recipient checkbox remains interactive');
  const manual=page.locator('[data-manual="g1"]');
  await manual.click();
  await page.getByText('Respuesta manual',{exact:true}).waitFor({state:'visible',timeout:3000});
  await page.locator('#mc').click();
  must(!(await page.locator('#sheet').evaluate(el=>el.classList.contains('on'))),'manual RSVP sheet opens and closes');
  await page.locator('[data-wsd-step="rsvp"]').click();
  await page.getByText('Formulario RSVP',{exact:true}).waitFor({state:'visible',timeout:10000});
  must(await page.locator('#mealQ').isVisible(),'RSVP step navigates without freezing the runtime');
  await page.locator('#mealQ').click();
  must(errors.length===0,'no uncaught browser errors during Send → RSVP interaction');
  console.log('RSVP browser interaction regression suite passed');
  await browser.close();server.close();
})().catch(async e=>{console.error('FAIL',e);try{server.close()}catch{}process.exit(1)});
