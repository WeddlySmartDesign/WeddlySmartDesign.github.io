const { chromium } = require('playwright');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const token='x'.repeat(64);
const guestState={
  meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12'},
  guests:{
    g1:{name:'Ana López',rsvp:'confirmed',group:'Amigos',invitationUnitId:'u1',unitId:'Pilar',phone:'600111222'},
    g2:{name:'Luis Martín',rsvp:'pending',group:'Familia',invitationUnitId:'u2',unitId:'Jorge',phone:'600333444'}
  },
  tables:{}
};
async function noOverflow(page){
  const x=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body.scrollWidth}));
  ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,'horizontal overflow '+JSON.stringify(x));
}
async function runViewport(browser,width,height){
  let version=3;
  const eventState={schema:1,events:{
    ev1:{id:'ev1',name:'Preboda',date:'2027-09-11',time:'20:00',venue:'Finca Norte',address:'Murcia',enabled:true,guestIds:[],tasks:{},payments:{}},
    ev2:{id:'ev2',name:'Brunch',date:'2027-09-13',time:'12:00',venue:'Hotel Sur',address:'Murcia',enabled:false,guestIds:[],tasks:{},payments:{}}
  }};
  const invites=new Map();
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.addInitScript(({token,guestState})=>{
    localStorage.setItem('weddly_shared_wedding_token',token);
    localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(guestState));
    localStorage.setItem('weddly_pro_v7',JSON.stringify({settings:{partner1:'Pilar',partner2:'Jorge',weddingDate:'2027-09-12',lang:'es'}}));
  },{token,guestState});
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
    const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();
    let body={};try{body=req.postDataJSON()||{}}catch{}
    let out={ok:true},status=200;
    if(slug==='guest-event-state'){
      if(req.method()==='GET')out={ok:true,state:eventState,version};
      else{
        Object.assign(eventState,body.state||eventState);version++;
        out={ok:true,state:eventState,version};
      }
    }else if(slug==='guest-event-invite'){
      const id=u.searchParams.get('event_id');
      if(req.method()==='GET'&&id){
        out={ok:true,invitation:{},recipients:invites.get(id)||[]};
      }else if(req.method()==='POST'&&body.action==='sync_recipients'){
        const rs=(body.recipients||[]).map((r,i)=>({...r,token:'evt_'+i+'_'+('t'.repeat(30)),response:{},responded_at:null,sent_at:null,status:'pending'}));
        invites.set(String(body.event_id),rs);out={ok:true,recipients:rs};
      }else out={ok:true};
    }else out={ok:true};
    await route.fulfill({status,contentType:'application/json',body:JSON.stringify(out)});
  });

  await page.goto(base+'/guest/guests-events-v3.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.dataset.guestB75==='1',null,{timeout:8000});
  await page.waitForSelector('.eventTabs [data-tab].on',{timeout:10000});
  await noOverflow(page);

  const brand=await page.locator('main.wrap>.brand').evaluate(el=>({text:el.innerText,kids:[...el.children].map(x=>x.tagName+':'+x.textContent.trim())}));
  ok(brand.text.includes('GUEST')&&brand.text.includes('WeddlySmartDesign'),'event premium brand missing');
  ok(brand.kids.some(x=>x==='B:GUEST')&&brand.kids.some(x=>x==='SPAN:by WeddlySmartDesign'),'event brand hierarchy wrong');

  const tabs=await page.locator('.eventTabs .btn').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));
  ok(tabs.every(h=>h>=43),'event tab target too small: '+tabs.join(','));

  await page.waitForSelector('#app>.card.guest-event-details',{timeout:6000});
  const details=page.locator('#app>.card.guest-event-details');
  ok(await details.isVisible(),'event details card not classified');
  ok(await page.locator('#disable').evaluate(el=>el.classList.contains('guest-event-deactivate')),'active event disable state not visually classified');
  ok(await page.locator('.summary.guest-event-summary .stat').count()===1,'GUEST event summary should be simplified to invited count');
  ok(!(await page.locator('body').innerText()).includes('Presupuesto y pagos'),'payment scope leaked visually');
  ok(!(await page.locator('body').innerText()).includes('Tareas específicas'),'task scope leaked visually');

  await page.waitForSelector('.sectionTitle.guest-event-guests-title',{timeout:6000});
  await page.waitForSelector('.guest-event-guest-card',{timeout:6000});
  await page.waitForSelector('#wsdEventGuestCompact',{timeout:10000});
  await page.waitForSelector('#wsdEventGroupTools',{timeout:10000});
  const groupTargets=await page.locator('#wsdEventGroupTools button').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));
  ok(groupTargets.every(h=>h>=41),'group selection targets too small: '+groupTargets.join(','));

  // Select one real guest through the visible compact-list flow and verify the invitation block becomes a clear next step.
  await page.locator('#wsdEventGuestCompact [data-wsd-eg-toggle]').click();
  await page.waitForSelector('#guestList [data-guest="g1"]',{state:'visible',timeout:5000});
  const g1=page.locator('#guestList [data-guest="g1"]');
  await g1.check();
  await page.waitForFunction(()=>document.querySelector('#wsdEventInviteSection #inviteEdit'),null,{timeout:12000});
  const invite=page.locator('#wsdEventInviteSection .inviteCard');
  ok(await invite.isVisible(),'event invitation card missing');
  const editH=await page.locator('#inviteEdit').evaluate(el=>el.getBoundingClientRect().height);
  ok(editH>=43,'event invitation CTA too small');
  await page.locator('#inviteEdit').click();
  await page.waitForSelector('#wsdInviteSheet.on',{timeout:5000});
  const sheet=await page.locator('#wsdInviteSheetCard').evaluate(el=>({radius:parseFloat(getComputedStyle(el).borderTopLeftRadius),w:el.getBoundingClientRect().width}));
  ok(sheet.radius>=26&&sheet.w<=width+1,'event invitation sheet not premium/mobile-safe: '+JSON.stringify(sheet));
  await page.locator('.inviteClose').click();

  // Inactive event must read as activatable, not destructive.
  await page.locator('.eventTabs [data-tab="ev2"]').click();
  await page.waitForFunction(()=>document.getElementById('disable')?.textContent.trim()==='Activar',null,{timeout:5000});
  ok(await page.locator('#disable').evaluate(el=>el.classList.contains('guest-event-activate')),'inactive event activation state not visually clear');
  await noOverflow(page);

  await context.close();
}
(async()=>{
  const browser=await chromium.launch({headless:true});
  for(const [w,h] of [[320,700],[390,844],[430,900]])await runViewport(browser,w,h);
  await browser.close();
  console.log('B7.5 Extra Events visual: PASS');
})().catch(e=>{console.error('B7.5 FAIL:',e.stack||e);process.exit(1)});
