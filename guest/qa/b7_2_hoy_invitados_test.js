const { chromium } = require('playwright');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const token='h'.repeat(64);
const now=new Date().toISOString();
const state={
  meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12',todaySeatChanges:[{name:'Ana López',from:'Mesa 1',to:'Mesa 2',ts:Date.now()-60000}]},
  guests:{
    g1:{name:'Ana López',rsvp:'confirmed',meal:'Vegetariano',mealRequired:true,group:'Amigos Pilar',invitationRecipientId:'g1',invitationUnitId:'u1'},
    g2:{name:'Luis Martín',rsvp:'pending',group:'Familia Jorge',invitationRecipientId:'g2',invitationUnitId:'u2'},
    g3:{name:'Marta Ruiz',rsvp:'confirmed',meal:'',mealRequired:true,group:'Trabajo',invitationRecipientId:'g3',invitationUnitId:'u3'}
  },
  tables:{t1:{name:'Mesa 1',cap:8},t2:{name:'Mesa 2',cap:8}}
};
const remote={forms:[],delivery:[{guest_key:'g1',status:'sent'},{guest_key:'g2',status:'sent'}],contacts:[],submissions:[
  {guest_key:'g1',name:'Ana López',attend:true,meal:'Vegetariano',received_at:now,created_at:now},
  {guest_key:'g2',name:'Luis Martín',attend:false,received_at:now,created_at:now}
]};
async function mock(page){
  await page.addInitScript(({token})=>{
    localStorage.setItem('weddly_shared_wedding_token',token);
    localStorage.setItem('weddly_pro_v7',JSON.stringify({settings:{partner1:'Pilar',partner2:'Jorge',weddingDate:'2027-09-12',lang:'es'}}));
  },{token});
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
    const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();let body={};try{body=req.postDataJSON()||{}}catch{}
    let out={ok:true};
    if(slug==='guest-state')out=req.method()==='GET'?{ok:true,state,version:5}:{ok:true,state:body.state||state,version:Number(body.version||5)+1};
    else if(slug==='guest-license-access')out={ok:true,role:'primary',partnerJoined:false,product:'guests',edition:'signature'};
    else if(slug==='guest-access-check')out={ok:true,product:'guests',edition:'signature'};
    else if(slug==='guest-rsvp')out=u.searchParams.get('manage')==='1'?{ok:true,...remote}:{ok:true,form:{config:{}}};
    else if(slug==='guest-event-state')out={ok:true,state:{events:{}},version:1};
    else if(slug==='guest-event-invite')out={ok:true,recipients:[],invitation:{}};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(out)});
  });
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
  const ctx=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
  const page=await ctx.newPage();await mock(page);
  await page.goto(base+'/guest/index.html#hoy',{waitUntil:'domcontentloaded'});
  let f=await core(page);
  await f.waitForFunction(()=>document.documentElement.dataset.guestB72==='1');
  await f.waitForSelector('#wsdRsvpHome',{timeout:10000});
  await f.waitForSelector('#wsdRecentChanges',{timeout:10000});
  await noOverflow(f);

  const hoyOrder=await f.locator('#hoy').evaluate(h=>[...h.children].map(x=>x.className||x.id));
  ok(/guest-hoy-intro/.test(hoyOrder[0]||''),'Hoy intro is not first');
  ok(await f.locator('#hoy>.guest-hoy-intro h2').innerText()==='Hoy','Hoy title missing');
  const intro=await f.locator('#hoy>.guest-hoy-intro p').innerText();
  ok(intro.length>20&&intro.length<100,'Hoy intro is not concise: '+intro);

  const stats=await f.locator('#hoy>.stats .stat').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return{w:r.width,h:r.height}}));
  ok(stats.length===2&&stats.every(x=>x.w>90),'Hoy stats hierarchy broken: '+JSON.stringify(stats));

  const rsvp=await f.locator('#wsdRsvpHome').evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{w:r.width,pad:parseFloat(s.paddingLeft)}});
  ok(rsvp.w<=width-20&&rsvp.pad>=16,'RSVP focus card hierarchy broken: '+JSON.stringify(rsvp));
  const rsvpBtns=await f.locator('#wsdRsvpHome .actions .btn').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));
  ok(rsvpBtns.length>=2&&rsvpBtns.every(h=>h>=47),'RSVP actions below mobile target');

  const recent=await f.locator('#wsdRecentChanges').evaluate(el=>({head:!!el.querySelector('.guest-recent-head'),rows:el.querySelectorAll('.row').length}));
  ok(recent.head&&recent.rows>=1,'recent changes hierarchy missing: '+JSON.stringify(recent));
  const readBtn=await f.locator('#wsdMarkRecentRead').evaluate(el=>{const r=el.getBoundingClientRect();return{h:r.height,left:r.left,right:r.right}});
  ok(readBtn.h>=41&&readBtn.left>=0&&readBtn.right<=width+1,'mark-read control overflows: '+JSON.stringify(readBtn));

  await f.locator('#nav button[data-go="invitados"]').click();
  await f.waitForSelector('#invitados>.guest-invitados-intro',{timeout:5000});
  await noOverflow(f);
  const guestIntro=await f.locator('#invitados>.guest-invitados-intro').innerText();
  ok(guestIntro.length>40&&guestIntro.length<150,'Invitados intro not concise: '+guestIntro);
  await f.waitForSelector('#wsdEventsStep',{timeout:8000});
  const steps=await f.locator('#invitados .flow>.step').count();
  ok(steps>=4,'Invitados flow lost a validated step: '+steps);
  const eventStyle=await f.locator('#wsdEventsStep').evaluate(el=>({style:getComputedStyle(el).borderStyle,bg:getComputedStyle(el).backgroundColor}));
  ok(eventStyle.style==='dashed','Eventos extra is not visually optional: '+JSON.stringify(eventStyle));
  ok(await f.locator('.wsdPlanGuestHero').count()===1,'Mesas priority step lost its visual hierarchy');

  await f.locator('#peopleBtn').click();
  await f.waitForSelector('#wsdPeopleSearch',{timeout:5000});
  const search=await f.locator('#wsdPeopleSearch').evaluate(el=>{const r=el.getBoundingClientRect();return{w:r.width,left:r.left,right:r.right,h:r.height}});
  ok(search.h>=48&&search.left>=0&&search.right<=width+1,'people search is not mobile-safe: '+JSON.stringify(search));
  await noOverflow(f);

  await ctx.close();
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 for(const [w,h] of [[320,700],[390,844],[430,900]])await runViewport(browser,w,h);
 await browser.close();
 console.log('B7.2 Hoy + Invitados: PASS');
})().catch(e=>{console.error('B7.2 FAIL:',e.stack||e);process.exit(1)});
