const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const base = process.env.GUEST_QA_BASE || 'http://127.0.0.1:4173';
const token = 'g'.repeat(64);
const state = {
  meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12',todaySeatChanges:[]},
  guests:{
    g1:{name:'Ana López',rsvp:'pending',group:'Amigos Pilar',invitationRecipientId:'g1',invitationUnitId:'u1',invitationUnitLabel:'Ana López'},
    g2:{name:'Carlos Ruiz',rsvp:'confirmed',group:'Familia Jorge',table:'Mesa 1'}
  },
  tables:{t1:{name:'Mesa 1',capacity:8,guestIds:['g2']}}
};
const errors=[];
const failures=[];
const ok=(cond,msg)=>{if(!cond)throw new Error(msg)};
const noOverflow=async pageOrFrame=>{
  const x=await pageOrFrame.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));
  ok(x.sw<=x.cw+2 && x.bw<=x.cw+2,'horizontal overflow '+JSON.stringify(x));
};
async function mockApis(page){
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
    const url=new URL(route.request().url());
    const slug=url.pathname.split('/').pop();
    let body={};try{body=route.request().postDataJSON()||{}}catch{}
    let payload={ok:true};
    let status=200;
    if(slug==='guest-state'){
      if(route.request().method()==='GET')payload={ok:true,state,version:7};
      else payload={ok:true,state:body.state||state,version:Number(body.version||7)+1};
    }else if(slug==='guest-license-access'){
      if(body.action==='status')payload={ok:true,role:'primary',partnerJoined:false,product:'guests',edition:'signature'};
      else if(body.action==='invite')payload={ok:true,inviteCode:'INVITE-B6-PRIMARY'};
      else if(body.action==='activate'){status=404;payload={ok:false,error:'invalid_activation'};}
      else if(body.action==='join')payload={ok:true,memberToken:'p'.repeat(64)};
    }else if(slug==='guest-access-check'){
      payload={ok:true,product:'guests',edition:'signature'};
    }else if(slug==='guest-rsvp'){
      if(url.searchParams.get('manage')==='1')payload={ok:true,forms:[],submissions:[],contacts:[],delivery:[]};
      else payload={ok:true,form:{config:{questions:{meal:true,allergy:true,transport:true,plusone:true},customQuestions:[]}}};
    }else if(slug==='guest-rsvp-ensure')payload={ok:true,publicToken:'r'.repeat(48)};
    else if(slug==='guest-personalization')payload={ok:true,personalization:null};
    else if(slug==='guest-event-state')payload={ok:true,state:{events:{}},version:1};
    else if(slug==='guest-event-invite')payload={ok:true};
    await route.fulfill({status,contentType:'application/json',body:JSON.stringify(payload)});
  });
}
async function waitCore(page){
  await page.waitForSelector('#app',{state:'visible',timeout:15000});
  for(let i=0;i<80;i++){
    const f=page.frames().find(x=>/guests-v114-integrated\.html/.test(x.url()));
    if(f){
      try{await f.waitForSelector('#nav button[data-go="hoy"]',{timeout:1000});return f}catch{}
    }
    await page.waitForTimeout(100);
  }
  throw new Error('integrated Guests core did not load');
}
async function run(){
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/fonts\.googleapis|favicon/i.test(m.text()))errors.push('console: '+m.text())});
  await mockApis(page);

  // Bootstrap + shell + latest ONE Guests navigation parity.
  await page.goto(base+'/guest/index.html?access='+token+'#hoy',{waitUntil:'domcontentloaded'});
  ok(await page.title()==='GUEST by WeddlySmartDesign','wrong shell title');
  ok(!(new URL(page.url())).searchParams.has('access'),'secure bootstrap token remains in URL');
  ok(await page.evaluate(()=>localStorage.getItem('weddly_shared_wedding_token')?.length>=40),'member token not persisted');
  ok(await page.getAttribute('link[rel="manifest"]','href')==='guest.webmanifest','manifest link missing');
  await noOverflow(page);
  const core=await waitCore(page);
  ok((await core.locator('#nav button[data-go]').count())>=4,'core navigation incomplete');
  const navNames=await core.locator('#nav button[data-go]').allTextContents();
  for(const expected of ['Hoy','Invitados','Mesas','Listados'])ok(navNames.some(x=>x.trim()===expected),'missing nav '+expected);
  const heights=await core.locator('#nav button[data-go]').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));
  ok(heights.every(h=>h>=47),'mobile nav target below 48px: '+heights.join(','));
  ok(await core.evaluate(()=>document.documentElement.dataset.guestSwipeParity==='1'),'swipe parity layer not active');
  ok(await core.locator('#nav').getAttribute('data-guest-fast-nav')==='1','fast navigation not active');

  await core.locator('#nav button[data-go="invitados"]').click();
  ok(await core.locator('#invitados').evaluate(x=>x.classList.contains('on')),'Invitados did not open immediately');
  await core.locator('#nav button[data-go="mesas"]').click();
  ok(await core.locator('#mesas').evaluate(x=>x.classList.contains('on')),'Mesas did not open immediately');
  await core.locator('#nav button[data-go="hoy"]').click();
  ok(await core.locator('#hoy').evaluate(x=>x.classList.contains('on')),'Hoy did not reopen');
  await noOverflow(core);

  const brand=await core.locator('main.wrap>.brand').innerText().catch(()=>core.locator('.brand').first().innerText());
  ok(/GUEST/i.test(brand)&&/WeddlySmartDesign/i.test(brand),'GUEST brand missing in core');
  const bodyText=(await core.locator('body').innerText()).slice(0,5000);
  ok(!/\bPagos\b|\bPlanning\b|ONE Partner|STUDIO/.test(bodyText),'foreign product leaked into core shell');

  // Settings route + persisted identity/theme + partner access + install guidance.
  const settings=core.locator('#editWedding');
  ok(await settings.isVisible(),'Ajustes action not visible');
  await Promise.all([page.waitForURL('**/guest-settings.html'),settings.click()]);
  ok(await page.locator('h1').innerText()==='Ajustes','settings page did not open');
  await noOverflow(page);
  await page.locator('#p1').fill('Pilar');
  await page.locator('#p2').fill('Jorge');
  await page.locator('#date').fill('2027-09-12');
  await page.locator('#theme').selectOption('editorial');
  await page.locator('#save').click();
  ok((await page.locator('#saveMsg').innerText()).includes('Cambios guardados'),'settings save feedback missing');
  const saved=await page.evaluate(()=>({d:JSON.parse(localStorage.getItem('weddly_pro_v7')||'{}'),theme:localStorage.getItem('weddly_personal_theme_v51')}));
  ok(saved.d.settings.partner1==='Pilar'&&saved.d.settings.partner2==='Jorge'&&saved.d.settings.weddingDate==='2027-09-12','identity settings not persisted');
  ok(saved.theme==='editorial','theme not persisted');

  await page.waitForFunction(()=>document.getElementById('syncText')?.textContent!=='Comprobando acceso…');
  ok(await page.locator('#syncText').innerText()==='Sincronización activa','partner sync status incorrect');
  ok(await page.locator('#share').isVisible() && await page.locator('#copy').isVisible(),'partner invite controls unavailable to primary');
  await page.locator('#copy').click();
  await page.waitForFunction(()=>document.getElementById('shareMsg')?.textContent.includes('copiada'));
  ok((await page.locator('#shareMsg').innerText()).includes('copiada'),'partner invite copy feedback missing');

  await page.locator('#install').click();
  const installText=await page.locator('#installMsg').innerText();
  ok(/Instalar app|Añadir a pantalla de inicio|instalado/i.test(installText),'install fallback guidance missing');
  const manifest=await page.evaluate(async()=>await (await fetch('guest.webmanifest')).json());
  ok(manifest.name==='GUEST by WeddlySmartDesign'&&manifest.start_url==='./index.html'&&manifest.scope==='./'&&manifest.display==='standalone','PWA manifest not isolated/correct');
  const sw=await page.evaluate(async()=>{if(!('serviceWorker'in navigator))return false;await navigator.serviceWorker.ready;return !!(await navigator.serviceWorker.getRegistration())});
  ok(sw,'GUEST service worker did not register');

  // Back from Settings returns to own GUEST, not ONE.
  await page.locator('#back').click();
  await page.waitForURL('**/guest/index.html#hoy');
  const core2=await waitCore(page);
  ok(await core2.locator('#hoy').evaluate(x=>x.classList.contains('on')),'return from settings did not restore Hoy');

  // Access page states.
  await page.evaluate(()=>localStorage.removeItem('weddly_shared_wedding_token'));
  await page.goto(base+'/guest/access.html',{waitUntil:'domcontentloaded'});
  ok(await page.locator('#title').innerText()==='Activa vuestro GUEST','activation title wrong');
  ok(await page.locator('#activate').isVisible(),'activation control missing');
  await page.locator('#code').fill('INVALID');
  await page.locator('#activate').click();
  await page.waitForFunction(()=>{const t=document.getElementById('msg')?.textContent||'';return t.length>0&&t!=='Activando…'});
  ok((await page.locator('#msg').innerText()).includes('No encontramos una compra válida'),'invalid activation feedback unclear: '+await page.locator('#msg').innerText());
  await page.goto(base+'/guest/access.html?invite=INVITE-B6-PRIMARY',{waitUntil:'domcontentloaded'});
  ok(await page.locator('#join').isVisible(),'partner join state missing');
  ok(/ambos dispositivos|dos dispositivos/i.test(await page.locator('#lead').innerText()),'partner join explanation missing');

  // Desktop sanity: no stretched mobile layout / overflow.
  const desktop=await context.newPage();
  await mockApis(desktop);
  await desktop.setViewportSize({width:1366,height:900});
  await desktop.goto(base+'/guest/guest-settings.html',{waitUntil:'domcontentloaded'});
  await noOverflow(desktop);
  const width=await desktop.locator('.wrap').evaluate(x=>x.getBoundingClientRect().width);
  ok(width<=702,'settings desktop layout stretches beyond intended max width: '+width);
  await desktop.close();

  ok(errors.length===0,'browser errors: '+errors.join(' | '));
  await browser.close();
  console.log('B6.1 shell/install/navigation/settings: PASS');
}
run().catch(async e=>{console.error('B6.1 FAIL:',e.stack||e);process.exit(1)});