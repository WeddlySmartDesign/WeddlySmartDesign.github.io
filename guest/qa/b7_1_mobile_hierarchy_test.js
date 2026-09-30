const { chromium } = require('playwright');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const token='v'.repeat(64);
const state={
  meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12',todaySeatChanges:[]},
  guests:{
    g1:{name:'Ana López',rsvp:'confirmed',meal:'Vegetariano',mealRequired:true,group:'Amigos Pilar'},
    g2:{name:'Luis Martín',rsvp:'pending',group:'Familia Jorge'}
  },
  tables:{t1:{name:'Mesa 1',cap:8}}
};
async function mock(page){
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
    const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();let body={};try{body=req.postDataJSON()||{}}catch{}
    let out={ok:true};
    if(slug==='guest-state')out=req.method()==='GET'?{ok:true,state,version:4}:{ok:true,state:body.state||state,version:Number(body.version||4)+1};
    else if(slug==='guest-license-access')out={ok:true,role:'primary',partnerJoined:false,product:'guests',edition:'signature'};
    else if(slug==='guest-access-check')out={ok:true,product:'guests',edition:'signature'};
    else if(slug==='guest-rsvp')out=u.searchParams.get('manage')==='1'?{ok:true,forms:[],submissions:[],contacts:[],delivery:[]}:{ok:true,form:{config:{}}};
    else if(slug==='guest-event-state')out={ok:true,state:{events:{}},version:1};
    else if(slug==='guest-event-invite')out={ok:true,recipients:[],invitation:{}};
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
async function noOverflow(frame){
  const x=await frame.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body.scrollWidth}));
  ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,'horizontal overflow '+JSON.stringify(x));
}
async function runViewport(browser,width,height){
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
  const page=await context.newPage();await mock(page);
  await page.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});
  const f=await core(page);
  await f.waitForFunction(()=>document.documentElement.dataset.guestVisualPremium==='1');
  await noOverflow(f);

  const brand=await f.locator('main.wrap>.brand').evaluate(el=>({
    text:el.innerText,
    children:[...el.children].map(x=>x.tagName+':'+x.textContent.trim()),
    gap:getComputedStyle(el).gap
  }));
  ok(brand.text.includes('GUEST')&&brand.text.includes('by WeddlySmartDesign'),'premium brand text missing');
  ok(brand.children.some(x=>x==='B:GUEST')&&brand.children.some(x=>x==='SPAN:by WeddlySmartDesign'),'premium brand hierarchy missing');

  const title=await f.locator('#coupleTitle').evaluate(el=>{const s=getComputedStyle(el);return{size:parseFloat(s.fontSize),line:parseFloat(s.lineHeight),marginBottom:parseFloat(s.marginBottom)}});
  ok(title.size>=35&&title.size<=40,'mobile couple title size outside hierarchy: '+JSON.stringify(title));

  const nav=await f.locator('#nav').evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{w:r.width,left:r.left,right:r.right,bottom:innerHeight-r.bottom,radius:parseFloat(s.borderRadius),position:s.position}});
  ok(nav.position==='fixed'&&nav.radius>=20,'premium floating nav not applied: '+JSON.stringify(nav));
  ok(nav.left>=5&&nav.right<=width-5&&nav.w<=width-12,'floating nav escapes viewport: '+JSON.stringify(nav));
  const navButtons=await f.locator('#nav button').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect(),s=getComputedStyle(x);return{h:r.height,radius:parseFloat(s.borderRadius),bg:s.backgroundColor,color:s.color,on:x.classList.contains('on')}}));
  ok(navButtons.every(x=>x.h>=48),'nav tap target below 48px: '+JSON.stringify(navButtons));
  const active=navButtons.find(x=>x.on);ok(active&&active.radius>=15,'active nav hierarchy weak');
  ok(active.bg!=='rgba(0, 0, 0, 0)'&&active.bg!=='transparent','active nav lacks a visible selected state: '+active.bg);

  const visibleBtns=await f.locator('.view.on .btn:visible').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));
  ok(visibleBtns.every(h=>h>=47),'visible action below premium tap target: '+visibleBtns.join(','));

  // Sheet hierarchy: use an in-product sheet; Ajustes intentionally navigates to its own screen.
  await f.locator('#nav button[data-go="invitados"]').click();
  await f.waitForSelector('#createBtn',{timeout:5000});
  await f.locator('#createBtn').click();
  await f.waitForSelector('#sheet.on',{timeout:5000});
  const panel=await f.locator('#panel').evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{w:r.width,h:r.height,radius:parseFloat(s.borderTopLeftRadius),maxHeight:s.maxHeight,pad:parseFloat(s.paddingLeft)}});
  ok(panel.radius>=27&&panel.w<=width+1&&panel.pad>=17,'premium sheet hierarchy missing: '+JSON.stringify(panel));
  await noOverflow(f);

  await context.close();
}
(async()=>{
  const browser=await chromium.launch({headless:true});
  for(const [w,h] of [[320,700],[390,844],[430,900]])await runViewport(browser,w,h);
  await browser.close();
  console.log('B7.1 mobile hierarchy: PASS');
})().catch(e=>{console.error('B7.1 FAIL:',e.stack||e);process.exit(1)});
