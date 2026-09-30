const { chromium } = require('playwright');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const member='q'.repeat(64),publicToken='p'.repeat(48);
const baseState={meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12'},guests:{
 g1:{name:'Ana López',rsvp:'confirmed',group:'Amigos',unitId:'Universidad',invitationRecipientId:'g1',invitationUnitId:'u1',phone:'600111222'},
 g2:{name:'Mario López',rsvp:'pending',group:'Amigos',unitId:'Universidad',invitationRecipientId:'g1',invitationUnitId:'u1'},
 g3:{name:'Marta Ruiz',rsvp:'pending',group:'Familia',unitId:'Familia Jorge'}
},tables:{}};
const cfg={title:'Pilar & Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos, Murcia',transportOffered:true,accommodationOffered:true,questions:{meal:true,allergy:true,transport:true,children:false,plusone:true},customQuestions:[{id:'song',label:'¿Qué canción no puede faltar?',type:'text',options:[],required:false}]};

async function makePage(context,edition='essential'){
 const page=await context.newPage(),legacy=[],errors=[];
 let personalization={tier:edition,template:edition==='signature'?'sig01':'e01',fontPair:edition==='signature'?'moderno':'editorial',p1:'Pilar',p2:'Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos',city:'Murcia'};
 await page.addInitScript(({member,baseState})=>{localStorage.setItem('weddly_shared_wedding_token',member);localStorage.setItem('weddly_pro_v7',JSON.stringify({settings:{partner1:'Pilar',partner2:'Jorge',weddingDate:'2027-09-12',lang:'es'}}));localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(baseState));},{member,baseState});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{try{const u=new URL(r.url());if(u.hostname.includes('supabase.co')&&/\/functions\/v1\/weddly-/.test(u.pathname))legacy.push(u.pathname)}catch{}});
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
  const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();let body={};try{body=req.postDataJSON()||{}}catch{}
  let out={ok:true},status=200;
  if(slug==='guest-access-check')out=body.action==='entitlement'?{ok:true,product:'guests',edition,owner:false}:{ok:true,product:'guests',edition};
  else if(slug==='guest-rsvp-ensure')out={ok:true,publicToken};
  else if(slug==='guest-personalization'){
   if(req.method()==='POST')personalization=body.personalization||personalization;
   out={ok:true,personalization};
  }else if(slug==='guest-rsvp'){
   if(req.method()==='GET'&&u.searchParams.get('manage')==='1')out={ok:true,forms:[{id:'f1',public_token:publicToken,config:cfg}],submissions:[{guest_key:'g1',name:'Ana López',attend:true,meal:'Vegetariano',received_at:new Date().toISOString()}],contacts:[{guest_key:'g1',phone:'600111222'}],delivery:[{guest_key:'unit:u1',status:'sent'}]};
   else if(req.method()==='GET'&&u.searchParams.get('unit'))out={ok:true,form:{id:'f1',config:cfg},unit:{id:'u1',label:'Familia López',members:[{id:'g1',name:'Ana López',events:[]},{id:'g2',name:'Mario López',events:[]}]}};
   else if(req.method()==='GET'&&u.searchParams.get('token'))out={ok:true,form:{id:'f1',config:cfg},...(u.searchParams.get('guest')?{guest:{id:'g1',name:'Ana López'}}:{})};
   else if(req.method()==='POST')out={ok:true,submission:{id:'s1'},config:body.config||cfg};
  }else if(slug==='guest-rsvp-single-v2')out={ok:true,submission:{id:'s1'}};
  else if(slug==='guest-state')out=req.method()==='GET'?{ok:true,state:baseState,version:3}:{ok:true,state:body.state||baseState,version:Number(body.version||3)+1};
  else if(slug==='guest-license-access')out={ok:true,role:'primary',product:'guests',edition};
  else if(slug==='guest-event-state')out={ok:true,state:{events:{}},version:1};
  else if(slug==='guest-event-invite')out={ok:true};
  await route.fulfill({status,contentType:'application/json',body:JSON.stringify(out)});
 });
 return{page,legacy,errors};
}
async function noOverflow(page,label){
 const x=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));
 ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,label+' overflow '+JSON.stringify(x));
}
async function editorFrame(page,filename){
 for(let i=0;i<150;i++){
  const f=page.frames().find(x=>x.url().includes(filename));
  if(f){try{await f.waitForSelector('#tplGrid',{timeout:400});return f}catch{}}
  await page.waitForTimeout(100);
 }
 throw Error('editor frame missing '+filename);
}
async function testOperations(context){
 const {page,legacy,errors}=await makePage(context,'signature');
 await page.goto(base+'/guest/guests-rsvp-operations-v2.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.documentElement.dataset.guestB73Ops==='1',null,{timeout:15000});
 await page.waitForSelector('#metrics .metric',{timeout:10000});
 await noOverflow(page,'operations');
 const brand=await page.locator('.brand').innerText();ok(brand.includes('GUEST')&&brand.includes('by WeddlySmartDesign'),'operations branding hierarchy missing');
 const h1=await page.locator('h1').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));ok(h1>=34,'operations title hierarchy too weak: '+h1);
 const metrics=await page.locator('#metrics .metric').evaluateAll(xs=>xs.map(x=>({w:x.getBoundingClientRect().width,r:parseFloat(getComputedStyle(x).borderRadius)})));
 ok(metrics.length===3&&metrics.every(x=>x.w>70&&x.r>=17),'operations metrics hierarchy broken: '+JSON.stringify(metrics));
 const flow=page.locator('#wsdOpsFlow button');await flow.first().waitFor({state:'visible',timeout:8000});
 const flowH=await flow.evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));ok(flowH.every(h=>h>=42),'operations stepper tap target too small');
 const recipient=page.locator('[data-recipient="g1"]');await recipient.waitFor({state:'visible',timeout:8000});
 const chk=await recipient.evaluate(el=>el.getBoundingClientRect().width);ok(chk>=23,'recipient checkbox too small');
 ok(legacy.length===0,'ONE endpoint from operations: '+legacy.join(','));
 ok(errors.length===0,'operations browser errors: '+errors.join(' | '));
 await page.close();
}
async function testEditor(context,edition){
 const {page,legacy,errors}=await makePage(context,edition);
 await page.goto(base+'/guest/guests-rsvp-design-manage.html',{waitUntil:'domcontentloaded'});
 const filename=edition==='signature'?'weddly-personalizacion-signature.html':'weddly-personalizacion-essential.html';
 const f=await editorFrame(page,filename);
 await f.waitForSelector('#weddlyIntegrationBar',{timeout:15000});
 await f.waitForFunction(()=>document.documentElement.dataset.guestB73Editor==='1',null,{timeout:10000});
 await f.waitForSelector('#wsdInvitationFlow',{state:'visible',timeout:10000});
 await f.waitForFunction(()=>{const xs=[...document.querySelectorAll('#wsdInvitationFlow button')];return xs.length===3&&xs.every(x=>x.getBoundingClientRect().height>=43)},null,{timeout:5000});
 await noOverflow(f,edition+' editor');
 const stepper=await f.locator('#wsdInvitationFlow button').evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));ok(stepper.length===3&&stepper.every(h=>h>=43),edition+' editor stepper too small: '+stepper.join(','));
 const cards=await f.locator('#tplGrid > *').count();ok(cards>=(edition==='signature'?4:6),edition+' template collection changed');
 const save=await f.locator('.weddly-save-bottom [data-save-essential]').evaluate(el=>({h:el.getBoundingClientRect().height,r:parseFloat(getComputedStyle(el).borderRadius)}));
 ok(save.h>=51&&save.r>=13,edition+' bottom CTA hierarchy weak: '+JSON.stringify(save));
 const bar=await f.locator('#weddlyIntegrationBar').evaluate(el=>({top:getComputedStyle(el).position,h:el.getBoundingClientRect().height}));
 ok(bar.top==='sticky','editor action bar is not sticky');
 ok(legacy.length===0,'ONE endpoint from '+edition+' editor: '+legacy.join(','));
 ok(errors.length===0,edition+' editor browser errors: '+errors.join(' | '));
 await page.close();
}
async function testPublic(context,kind){
 const {page,legacy,errors}=await makePage(context,'signature');
 const url=kind==='single'?base+'/guest/guests-rsvp-v116-single-live.html?guest=1&t='+publicToken+'&g=g1&lang=es':base+'/guest/guests-rsvp-v115-wedding-flex-live.html?t='+publicToken+'&u=u1&lang=es';
 await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.documentElement.dataset.guestB73Public==='1',null,{timeout:12000});
 await page.waitForSelector(kind==='single'?'#yes':'.person[data-person="g1"]',{timeout:12000});
 await noOverflow(page,'public '+kind);
 const brand=await page.locator('#guestRsvpBrand').innerText();ok(brand.includes('GUEST')&&brand.includes('WeddlySmartDesign'),'public RSVP brand missing');
 const h1=await page.locator('h1').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));ok(h1>=34&&h1<=40,'public RSVP title hierarchy wrong: '+h1);
 const choices=page.locator(kind==='single'?'.choiceRow .choice':'.person[data-person="g1"] .choiceRow .choice');
 const hs=await choices.evaluateAll(xs=>xs.map(x=>x.getBoundingClientRect().height));ok(hs.length>=2&&hs.every(h=>h>=53),'public RSVP choices too small: '+hs.join(','));
 if(kind==='single')await page.locator('#yes').click();else await page.locator('.person[data-person="g1"] [data-answer="yes"]').click();
 const field=page.locator(kind==='single'?'#meal':'.person[data-person="g1"] .meal');
 await field.waitFor({state:'visible',timeout:5000});
 const fh=await field.evaluate(el=>el.getBoundingClientRect().height);ok(fh>=49,'public RSVP field too small: '+fh);
 ok(legacy.length===0,'ONE endpoint from public '+kind+': '+legacy.join(','));
 ok(errors.length===0,'public '+kind+' browser errors: '+errors.join(' | '));
 await page.close();
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 for(const [w,h] of [[320,700],[390,844]]){
  const context=await browser.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true});
  await testOperations(context);
  await testEditor(context,'essential');
  await testEditor(context,'signature');
  await testPublic(context,'single');
  await testPublic(context,'unit');
  await context.close();
 }
 await browser.close();
 console.log('B7.3 invitation + RSVP visual QA: PASS');
})().catch(e=>{console.error('B7.3 FAIL:',e.stack||e);process.exit(1)});
