const { chromium } = require('playwright');
const fs=require('fs'),path=require('path');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const root=path.resolve(__dirname,'..');
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const member='v'.repeat(64),publicToken='p'.repeat(48);
const state={meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12',todaySeatChanges:[]},guests:{
 g1:{name:'Ana López',rsvp:'confirmed',group:'Amigos',unitId:'Universidad',invitationRecipientId:'g1',invitationUnitId:'u1',phone:'600111222',table:'Mesa 1',meal:'Vegetariano',mealRequired:true},
 g2:{name:'Mario López',rsvp:'pending',group:'Familia',unitId:'Familia Jorge',table:''}
},tables:{t1:{name:'Mesa 1',cap:8}}};
const cfg={title:'Pilar & Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos, Murcia',transportOffered:true,accommodationOffered:true,questions:{meal:true,allergy:true,transport:true,children:false,plusone:true},customQuestions:[]};
const eventState={schema:1,events:{ev1:{id:'ev1',name:'Preboda',date:'2027-09-11',time:'20:00',venue:'Finca',enabled:true,guestIds:['g1'],tasks:{},payments:{}}}};

async function mock(page){
 let personalization={tier:'essential',template:'e01',fontPair:'editorial',p1:'Pilar',p2:'Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos',city:'Murcia'};
 await page.addInitScript(({member,state})=>{
   localStorage.setItem('weddly_shared_wedding_token',member);
   localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(state));
   localStorage.setItem('weddly_pro_v7',JSON.stringify({settings:{partner1:'Pilar',partner2:'Jorge',weddingDate:'2027-09-12',lang:'es'}}));
 },{member,state});
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
   const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();let body={};try{body=req.postDataJSON()||{}}catch{}
   let out={ok:true};
   if(slug==='guest-state')out=req.method()==='GET'?{ok:true,state,version:7}:{ok:true,state:body.state||state,version:Number(body.version||7)+1};
   else if(slug==='guest-license-access')out={ok:true,role:'primary',partnerJoined:false,product:'guests',edition:'essential'};
   else if(slug==='guest-access-check')out=body.action==='entitlement'?{ok:true,product:'guests',edition:'essential',owner:false}:{ok:true,product:'guests',edition:'essential'};
   else if(slug==='guest-rsvp-ensure')out={ok:true,publicToken};
   else if(slug==='guest-personalization'){if(req.method()==='POST')personalization=body.personalization||personalization;out={ok:true,personalization}}
   else if(slug==='guest-rsvp'){
     if(req.method()==='GET'&&u.searchParams.get('manage')==='1')out={ok:true,forms:[{id:'f1',public_token:publicToken,config:cfg}],submissions:[],contacts:[],delivery:[]};
     else if(req.method()==='GET'&&u.searchParams.get('unit'))out={ok:true,form:{id:'f1',config:cfg},unit:{id:'u1',label:'Familia López',members:[{id:'g1',name:'Ana López',events:[]}]}};
     else if(req.method()==='GET'&&u.searchParams.get('token'))out={ok:true,form:{id:'f1',config:cfg},guest:{id:'g1',name:'Ana López'}};
     else out={ok:true,submission:{id:'s1'},config:body.config||cfg};
   }else if(slug==='guest-rsvp-single-v2')out={ok:true,submission:{id:'s1'}};
   else if(slug==='guest-event-state')out={ok:true,state:eventState,version:1};
   else if(slug==='guest-event-invite')out={ok:true,invitation:{},recipients:[]};
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(out)});
 });
}
async function noOverflow(ctx,label){
 const x=await ctx.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));
 ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,label+' overflow '+JSON.stringify(x));
}
async function core(page){
 await page.waitForSelector('#app',{state:'visible',timeout:12000});
 for(let i=0;i<100;i++){
   const f=page.frames().find(x=>/guests-v114-integrated\.html/.test(x.url()));
   if(f){try{await f.waitForSelector('#nav',{timeout:400});return f}catch{}}
   await page.waitForTimeout(100);
 }
 throw Error('core missing');
}
async function mainAt(browser,w,h){
 const context=await browser.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
 const page=await context.newPage();await mock(page);
 await page.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});
 const f=await core(page);
 await f.waitForFunction(()=>document.documentElement.dataset.guestVisualPremium==='1'&&document.documentElement.dataset.guestB72==='1'&&document.documentElement.dataset.guestB74==='1',null,{timeout:12000});
 const brand=await f.locator('main.wrap>.brand').innerText();
 ok(brand.includes('GUEST')&&brand.includes('WeddlySmartDesign'),'main brand missing '+w);
 const nav=await f.locator('#nav button[data-go]').allTextContents();
 for(const x of ['Hoy','Invitados','Mesas','Listados'])ok(nav.some(n=>n.trim()===x),'nav missing '+x+' '+w);
 for(const id of ['hoy','invitados','mesas','listados']){
   await f.locator('#nav button[data-go="'+id+'"]').click();
   ok(await f.locator('#'+id).evaluate(el=>el.classList.contains('on')),'view did not activate '+id+' '+w);
   await noOverflow(f,'main '+id+' '+w);
 }
 const foreign=(await f.locator('body').innerText()).match(/\bPagos\b|\bPlanning\b|ONE Partner|STUDIO/g)||[];
 ok(foreign.length===0,'foreign product scope visible '+foreign.join(','));
 await context.close();
}
async function eventsAt(browser,w,h){
 const context=await browser.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
 const page=await context.newPage();await mock(page);
 await page.goto(base+'/guest/guests-events-v3.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.documentElement.dataset.guestB75==='1',null,{timeout:10000});
 await page.waitForSelector('.eventTabs [data-tab].on',{timeout:10000});
 await noOverflow(page,'events '+w);
 const text=await page.locator('body').innerText();
 ok(text.includes('GUEST')&&text.includes('by WeddlySmartDesign'),'events brand missing '+w);
 ok(!text.includes('Presupuesto y pagos')&&!text.includes('Tareas específicas'),'events legacy scope visible '+w);
 await context.close();
}
async function publicAt(browser,w,h){
 const context=await browser.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
 const page=await context.newPage();await mock(page);
 await page.goto(base+'/guest/guests-rsvp-v116-single-live.html?guest=1&t='+publicToken+'&g=g1&lang=es',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.documentElement.dataset.guestB73Public==='1',null,{timeout:12000});
 await page.waitForSelector('#yes',{timeout:10000});
 await noOverflow(page,'public RSVP '+w);
 const b=await page.locator('#guestRsvpBrand').innerText();ok(b.includes('GUEST')&&b.includes('WeddlySmartDesign'),'public RSVP brand missing '+w);
 await context.close();
}
function staticSeal(){
 const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const f of ['guest-visual-premium-v1.js','guest-visual-hoy-invitados-v1.js','guest-visual-tables-lists-v1.js'])ok(index.includes(f),'index missing visual layer '+f);
 const events=fs.readFileSync(path.join(root,'guests-events-v3.html'),'utf8');ok(events.includes('guest-visual-extra-events-v1.js'),'events visual layer missing');
 const visualFiles=['guest-visual-premium-v1.js','guest-visual-hoy-invitados-v1.js','guest-visual-tables-lists-v1.js','guest-visual-extra-events-v1.js','guest-visual-rsvp-operations-v1.js','guest-visual-public-rsvp-v1.js','guest-visual-invitation-editor-v1.js'];
 for(const f of visualFiles)ok(fs.existsSync(path.join(root,f)),'visual source missing '+f);
}
(async()=>{
 staticSeal();
 const browser=await chromium.launch({headless:true});
 for(const [w,h] of [[320,700],[390,844],[430,900],[1366,900]]){
   await mainAt(browser,w,h);
 }
 for(const [w,h] of [[390,844],[1366,900]])await eventsAt(browser,w,h);
 for(const [w,h] of [[390,844],[1366,900]])await publicAt(browser,w,h);
 await browser.close();
 console.log('B7.7 final visual seal: PASS');
})().catch(e=>{console.error('B7.7 FAIL:',e.stack||e);process.exit(1)});
