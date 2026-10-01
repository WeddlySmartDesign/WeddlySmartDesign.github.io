const { chromium } = require('playwright');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const token='m'.repeat(64);
const state={
  meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12',todaySeatChanges:[]},
  guests:{
    g1:{name:'Ana López',rsvp:'confirmed',meal:'Vegetariano',mealRequired:true,table:'Mesa 1',transport:true,group:'Amigos'},
    g2:{name:'Luis Martín',rsvp:'confirmed',meal:'Estándar',mealRequired:true,table:'Mesa 1',transport:false,group:'Amigos'},
    g3:{name:'Marta Ruiz',rsvp:'pending',meal:'',mealRequired:true,table:'',transport:true,group:'Familia'},
    g4:{name:'Elena Torres',rsvp:'pending',meal:'',mealRequired:true,table:'',transport:false,group:'Familia'}
  },
  tables:{t1:{name:'Mesa 1',cap:2},t2:{name:'Mesa 2',cap:6}}
};
const eventState={events:{ev1:{id:'ev1',name:'Preboda',date:'2027-09-11',enabled:true,guestIds:['g1','g2']}}};
async function mock(page){
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
    const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();
    let body={};try{body=req.postDataJSON()||{}}catch{}
    let out={ok:true};
    if(slug==='guest-state')out=req.method()==='GET'?{ok:true,state,version:4}:{ok:true,state:body.state||state,version:Number(body.version||4)+1};
    else if(slug==='guest-license-access')out={ok:true,role:'primary',partnerJoined:false,product:'guests',edition:'signature'};
    else if(slug==='guest-access-check')out={ok:true,product:'guests',edition:'signature'};
    else if(slug==='guest-rsvp'){
      if(u.searchParams.get('manage')==='1')out={
        ok:true,
        forms:[{config:{customQuestions:[{id:'q1',label:'Canción favorita',type:'text'}]}}],
        submissions:[{guest_key:'g1',name:'Ana López',received_at:'2026-09-30T10:00:00Z',payload:{custom_answers:{q1:'Viva la vida'}}}],
        contacts:[],delivery:[]
      };
      else out={ok:true,form:{config:{}}};
    }else if(slug==='guest-event-state')out={ok:true,state:eventState,version:1};
    else if(slug==='guest-event-invite')out={
      ok:true,invitation:{},
      recipients:[{recipient_key:'u1',members:[{id:'g1',name:'Ana López'},{id:'g2',name:'Luis Martín'}],response:{g1:'yes',g2:'yes'},responded_at:'2026-09-30T10:30:00Z'}]
    };
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(out)});
  });
  await page.addInitScript(({token})=>{
    localStorage.setItem('weddly_shared_wedding_token',token);
    localStorage.setItem('weddly_pro_v7',JSON.stringify({settings:{partner1:'Pilar',partner2:'Jorge',weddingDate:'2027-09-12',lang:'es'}}));
  },{token});
}
async function core(page){
  await page.waitForSelector('#app',{state:'visible',timeout:12000});
  for(let i=0;i<100;i++){
    const f=page.frames().find(x=>/guests-v114-integrated\.html/.test(x.url()));
    if(f){try{await f.waitForSelector('#nav',{timeout:500});return f}catch{}}
    await page.waitForTimeout(100);
  }
  throw Error('core missing');
}
async function noOverflow(f){
  const x=await f.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body.scrollWidth}));
  ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,'horizontal overflow '+JSON.stringify(x));
}
async function runViewport(browser,width,height){
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,acceptDownloads:true});
  const page=await context.newPage();await mock(page);
  await page.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});
  const f=await core(page);
  await f.waitForFunction(()=>document.documentElement.dataset.guestB74==='1',null,{timeout:8000});

  // Mesas hierarchy.
  await f.locator('#nav button[data-go="mesas"]').click();
  await f.waitForSelector('#mesas .guest-tables-intro',{timeout:5000});
  const intro=await f.locator('#mesas .guest-tables-intro').innerText();
  ok(intro.includes('sin mesa'),'Mesas intro does not clarify the unresolved state');
  const launch=await f.locator('#planBtn').evaluate(el=>{
    const r=el.getBoundingClientRect(),s=getComputedStyle(el);
    return{w:r.width,radius:parseFloat(s.borderRadius),title:el.querySelector('.planLaunchTitle')?.textContent,copy:el.querySelector('.planLaunchCopy')?.textContent,action:el.querySelector('.planLaunchAction')?.textContent};
  });
  ok(launch.radius>=20&&launch.w<=width+1,'plan launch is not premium/mobile-safe: '+JSON.stringify(launch));
  ok(launch.title==='Diseña el salón'&&/capacidad, forma y posición/.test(launch.copy||'')&&/Abrir plano/.test(launch.action||''),'plan launch copy hierarchy wrong: '+JSON.stringify(launch));
  ok(await f.locator('#mesas .guest-table-kpis .pill').count()===3,'table KPIs not grouped');
  const mesa1=f.locator('#mesas .card.table').filter({hasText:'Mesa 1'}).first();
  await mesa1.waitFor({state:'visible'});
  ok(await mesa1.evaluate(el=>el.classList.contains('guest-table-full')),'full-table state is not visually classified');
  const targets=await mesa1.locator('button').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));
  ok(targets.every(h=>h>=39),'table actions too small: '+targets.join(','));
  const un=f.locator('#mesas .guest-unseated-card');
  await un.waitFor({state:'visible'});
  const unText=await un.innerText();
  ok(unText.includes('2 por colocar')&&unText.includes('Marta Ruiz')&&unText.includes('Elena Torres'),'unseated hierarchy/count wrong: '+unText);
  await noOverflow(f);

  // Listados hierarchy and categories.
  await f.locator('#nav button[data-go="listados"]').click();
  await f.waitForSelector('#listados .guest-lists-intro',{timeout:5000});
  await f.waitForFunction(()=>document.querySelectorAll('#listados .guest-report-main').length>=3,null,{timeout:10000});
  await f.waitForSelector('#listados [data-wsd-q-list]',{timeout:10000});
  await f.waitForSelector('#listados [data-wsd-event-list]',{timeout:10000});
  await f.waitForSelector('#wsdCopyHistory',{timeout:10000});
  const mainTags=await f.locator('#listados .guest-report-main>.guest-report-tag').allTextContents();
  ok(mainTags.length>=3&&mainTags.every(x=>x.trim()==='BODA PRINCIPAL'),'main report labels unclear: '+mainTags.join('|'));
  ok((await f.locator('#listados [data-wsd-q-list]>.guest-report-tag').first().innerText())==='RESPUESTAS RSVP','custom RSVP list not classified');
  ok((await f.locator('#listados [data-wsd-event-list]>.guest-report-tag').first().innerText())==='EVENTO EXTRA','extra-event list not classified');
  ok((await f.locator('#wsdCopyHistory>.guest-report-tag').innerText())==='CONTROL DE COPIAS','copy history not classified');
  await f.waitForSelector('#listados [data-copy-status]',{timeout:10000});
  const buttons=await f.locator('#listados .btn:visible').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));
  ok(buttons.every(h=>h>=41),'list output action too small: '+buttons.join(','));
  await noOverflow(f);

  // Functional smoke: visual layer must not block controlled CSV.
  const tableCard=f.locator('#listados .guest-report-main').filter({hasText:'Mesas · Boda principal'}).first();
  const csvBtn=tableCard.locator('#wsdCsvTables');
  await csvBtn.waitFor({state:'visible'});
  const [download]=await Promise.all([page.waitForEvent('download',{timeout:8000}),csvBtn.click()]);
  ok(/^MES_Rev\d+_C\d+\.csv$/i.test(download.suggestedFilename()),'controlled CSV broken by visual layer');

  await context.close();
}
(async()=>{
  const browser=await chromium.launch({headless:true});
  for(const [w,h] of [[320,700],[390,844],[430,900]])await runViewport(browser,w,h);
  await browser.close();
  console.log('B7.4 Mesas/Listados visual: PASS');
})().catch(e=>{console.error('B7.4 FAIL:',e.stack||e);process.exit(1)});
