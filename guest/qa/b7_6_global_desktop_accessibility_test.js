const { chromium } = require('playwright');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const member='z'.repeat(64),publicToken='p'.repeat(48);
const state={meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12'},guests:{
 g1:{name:'Ana López',rsvp:'confirmed',group:'Amigos',unitId:'Universidad',invitationRecipientId:'g1',invitationUnitId:'u1',phone:'600111222'},
 g2:{name:'Mario López',rsvp:'pending',group:'Amigos',unitId:'Universidad',invitationRecipientId:'g1',invitationUnitId:'u1'}
},tables:{t1:{name:'Mesa 1',cap:8}}};
const cfg={title:'Pilar & Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos, Murcia',transportOffered:true,accommodationOffered:true,questions:{meal:true,allergy:true,transport:true,children:false,plusone:true},customQuestions:[]};

function rgb(s){const m=String(s).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);return m?[+m[1],+m[2],+m[3]]:null}
function luminance([r,g,b]){return [r,g,b].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0)}
function contrast(a,b){const A=luminance(a),B=luminance(b);return (Math.max(A,B)+.05)/(Math.min(A,B)+.05)}
async function noOverflow(page,label){
 const x=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));
 ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,label+' horizontal overflow '+JSON.stringify(x));
}
async function centered(locator,maxWidth,label){
 const x=await locator.evaluate(el=>{const r=el.getBoundingClientRect();return{w:r.width,left:r.left,right:innerWidth-r.right,vw:innerWidth}});
 ok(x.w<=maxWidth+2,label+' too wide '+JSON.stringify(x));
 ok(Math.abs(x.left-x.right)<=3,label+' not centered '+JSON.stringify(x));
}
async function focusVisible(page,locator,label){
 // Seed the target, move to the previous focus stop with a trusted keyboard event,
 // then return with Tab. The final focus transition is entirely keyboard-driven.
 await locator.focus();
 await page.keyboard.press('Shift+Tab');
 await page.keyboard.press('Tab');
 const x=await locator.evaluate(el=>{const s=getComputedStyle(el);return{focused:el===el.ownerDocument.activeElement,visible:el.matches(':focus-visible'),style:s.outlineStyle,width:parseFloat(s.outlineWidth),offset:parseFloat(s.outlineOffset)}});
 ok(x.focused&&x.visible&&x.style!=='none'&&x.width>=2,label+' keyboard focus ring missing '+JSON.stringify(x));
}
async function makePage(context,edition='signature'){
 const page=await context.newPage();
 let personalization={tier:edition,template:edition==='signature'?'sig01':'e01',fontPair:'editorial',p1:'Pilar',p2:'Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos',city:'Murcia'};
 await page.addInitScript(({member,state})=>{
   localStorage.setItem('weddly_shared_wedding_token',member);
   localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(state));
   localStorage.setItem('weddly_pro_v7',JSON.stringify({settings:{partner1:'Pilar',partner2:'Jorge',weddingDate:'2027-09-12',lang:'es'}}));
 },{member,state});
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
  const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();let body={};try{body=req.postDataJSON()||{}}catch{}
  let out={ok:true};
  if(slug==='guest-state')out=req.method()==='GET'?{ok:true,state,version:3}:{ok:true,state:body.state||state,version:Number(body.version||3)+1};
  else if(slug==='guest-license-access')out={ok:true,role:'primary',partnerJoined:false,product:'guests',edition};
  else if(slug==='guest-access-check')out=body.action==='entitlement'?{ok:true,product:'guests',edition,owner:false}:{ok:true,product:'guests',edition};
  else if(slug==='guest-personalization'){if(req.method()==='POST')personalization=body.personalization||personalization;out={ok:true,personalization}}
  else if(slug==='guest-rsvp-ensure')out={ok:true,publicToken};
  else if(slug==='guest-rsvp'){
    if(req.method()==='GET'&&u.searchParams.get('manage')==='1')out={ok:true,forms:[{id:'f1',public_token:publicToken,config:cfg}],submissions:[],contacts:[],delivery:[]};
    else if(req.method()==='GET'&&u.searchParams.get('unit'))out={ok:true,form:{id:'f1',config:cfg},unit:{id:'u1',label:'Familia López',members:[{id:'g1',name:'Ana López',events:[]},{id:'g2',name:'Mario López',events:[]}]}};
    else if(req.method()==='GET'&&u.searchParams.get('token'))out={ok:true,form:{id:'f1',config:cfg},guest:{id:'g1',name:'Ana López'}};
    else out={ok:true,submission:{id:'s1'},config:body.config||cfg};
  }else if(slug==='guest-rsvp-single-v2')out={ok:true,submission:{id:'s1'}};
  else if(slug==='guest-event-state')out={ok:true,state:{events:{ev1:{id:'ev1',name:'Preboda',date:'2027-09-11',time:'20:00',venue:'Finca',enabled:true,guestIds:[],tasks:{},payments:{}}}},version:1};
  else if(slug==='guest-event-invite')out={ok:true,invitation:{},recipients:[]};
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(out)});
 });
 return page;
}
async function core(page){
 await page.waitForSelector('#app',{state:'visible',timeout:12000});
 for(let i=0;i<100;i++){const f=page.frames().find(x=>/guests-v114-integrated\.html/.test(x.url()));if(f){try{await f.waitForSelector('#nav',{timeout:400});return f}catch{}}await page.waitForTimeout(100)}
 throw Error('core missing');
}
async function editorFrame(page){
 for(let i=0;i<150;i++){const f=page.frames().find(x=>x.url().includes('weddly-personalizacion-essential.html'));if(f){try{await f.waitForSelector('#tplGrid',{timeout:400});return f}catch{}}await page.waitForTimeout(100)}
 throw Error('editor frame missing');
}

async function testMain(browser){
 const context=await browser.newContext({viewport:{width:1366,height:900}});
 const page=await makePage(context);
 await page.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});
 const f=await core(page);
 await f.waitForFunction(()=>document.documentElement.dataset.guestVisualPremium==='1');
 await centered(f.locator('.wrap'),760,'main wrap');
 const nav=await f.locator('#nav').evaluate(el=>el.getBoundingClientRect().width);ok(nav<=522,'desktop nav too wide '+nav);
 await noOverflow(f,'main desktop');
 const bodyColors=await f.evaluate(()=>{const s=getComputedStyle(document.body);return{fg:s.color,bg:s.backgroundColor}});
 ok(contrast(rgb(bodyColors.fg),rgb(bodyColors.bg))>=4.5,'main body contrast below AA '+JSON.stringify(bodyColors));
 await f.locator('#nav button[data-go="invitados"]').click();
 await f.locator('#createBtn').click();
 await f.waitForSelector('#sheet.on');
 const panel=f.locator('#panel');
 const p=await panel.evaluate(el=>{const r=el.getBoundingClientRect();return{w:r.width,left:r.left,right:innerWidth-r.right,top:r.top,bottom:innerHeight-r.bottom,radius:parseFloat(getComputedStyle(el).borderRadius)}});
 ok(p.w<=682&&Math.abs(p.left-p.right)<=3&&p.top>20&&p.bottom>20&&p.radius>=27,'desktop sheet not centered/premium '+JSON.stringify(p));
 await f.locator('#sheet').click({position:{x:5,y:5}});
 await focusVisible(page,f.locator('#createBtn'),'main create button');
 await context.close();

 const reduced=await browser.newContext({viewport:{width:1024,height:800},reducedMotion:'reduce'});
 const rp=await makePage(reduced);await rp.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});const rf=await core(rp);
 await rf.waitForFunction(()=>document.documentElement.dataset.guestVisualPremium==='1');
 await rf.locator('#nav button[data-go="invitados"]').click();
 const td=await rf.locator('#createBtn').evaluate(el=>getComputedStyle(el).transitionDuration);
 ok(td==='0s'||td.split(',').every(x=>x.trim()==='0s'),'main reduced-motion not honored: '+td);
 await reduced.close();
}
async function testEvents(browser){
 const context=await browser.newContext({viewport:{width:1366,height:900}});
 const page=await makePage(context);
 await page.goto(base+'/guest/guests-events-v3.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.documentElement.dataset.guestB75==='1',null,{timeout:10000});
 await centered(page.locator('.wrap'),760,'events wrap');await noOverflow(page,'events desktop');
 await focusVisible(page,page.locator('.eventTabs [data-tab="ev1"]'),'event tab');
 await page.locator('#addEvent').click();await page.waitForSelector('#sheet.on');
 const sh=await page.locator('#sheetCard').evaluate(el=>{const r=el.getBoundingClientRect();return{w:r.width,left:r.left,right:innerWidth-r.right,top:r.top,bottom:innerHeight-r.bottom,radius:parseFloat(getComputedStyle(el).borderRadius)}});
 ok(sh.w<=682&&Math.abs(sh.left-sh.right)<=3&&sh.top>20&&sh.bottom>20&&sh.radius>=27,'event desktop sheet not centered '+JSON.stringify(sh));
 await context.close();
}
async function testOperations(browser){
 const context=await browser.newContext({viewport:{width:1366,height:900}});
 const page=await makePage(context);
 await page.goto(base+'/guest/guests-rsvp-operations-v2.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.documentElement.dataset.guestB73Ops==='1',null,{timeout:12000});
 await page.waitForSelector('#metrics .metric',{timeout:10000});
 await centered(page.locator('.app'),760,'operations app');await noOverflow(page,'operations desktop');
 await focusVisible(page,page.locator('#back'),'operations back action');
 await context.close();
}
async function testPublic(browser){
 const context=await browser.newContext({viewport:{width:1366,height:900}});
 const page=await makePage(context);
 await page.goto(base+'/guest/guests-rsvp-v116-single-live.html?guest=1&t='+publicToken+'&g=g1&lang=es',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.documentElement.dataset.guestB73Public==='1',null,{timeout:12000});
 await page.waitForSelector('#yes',{timeout:10000});
 await centered(page.locator('.wrap'),660,'public RSVP wrap');await noOverflow(page,'public RSVP desktop');
 await focusVisible(page,page.locator('#yes'),'public RSVP yes');
 const colors=await page.locator('.lead').evaluate(el=>{const s=getComputedStyle(el),bg=getComputedStyle(document.body);return{fg:s.color,bg:bg.backgroundColor}});
 ok(contrast(rgb(colors.fg),rgb(colors.bg))>=4.5,'public RSVP muted contrast below AA '+JSON.stringify(colors));
 await context.close();
}
async function testEditor(browser){
 const context=await browser.newContext({viewport:{width:1366,height:900}});
 const page=await makePage(context,'essential');
 await page.goto(base+'/guest/guests-rsvp-design-manage.html',{waitUntil:'domcontentloaded'});
 const f=await editorFrame(page);
 await f.waitForFunction(()=>document.documentElement.dataset.guestB73Editor==='1',null,{timeout:10000});
 await f.waitForSelector('.weddly-save-bottom [data-save-essential]',{timeout:10000});
 await noOverflow(f,'editor desktop');
 await focusVisible(page,f.locator('.weddly-save-bottom [data-save-essential]'),'editor save');
 await context.close();
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 await testMain(browser);
 await testEvents(browser);
 await testOperations(browser);
 await testPublic(browser);
 await testEditor(browser);
 await browser.close();
 console.log('B7.6 global desktop/accessibility: PASS');
})().catch(e=>{console.error('B7.6 FAIL:',e.stack||e);process.exit(1)});
