const { chromium } = require('playwright');
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const member='m'.repeat(64),publicToken='r'.repeat(48);
const ok=(x,m)=>{if(!x)throw new Error(m)};
const noOverflow=async(p,label)=>{const x=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,label+' overflow '+JSON.stringify(x))};

async function makePage(context,opts={}){
  const page=await context.newPage();
  const calls={config:[],personalization:[],single:[],submit:[],legacy:[],sameOrigin:[],errors:[]};
  page.on('pageerror',e=>calls.errors.push('pageerror: '+e.message));
  page.on('console',m=>{if(m.type()==='error')calls.errors.push('console: '+m.text())});
  let edition=opts.edition||'essential';
  let failConfig=!!opts.failConfig;
  let config=structuredClone(opts.config||{
    title:'Pilar & Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos, Murcia',
    transportOffered:true,accommodationOffered:false,questions:{meal:true,allergy:true,transport:true,children:false,plusone:true},customQuestions:[]
  });
  let personalization=structuredClone(opts.personalization||{tier:edition,template:edition==='signature'?'sig01':'e01',fontPair:edition==='signature'?'moderno':'editorial',p1:'Pilar',p2:'Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos',city:'Murcia'});
  await page.addInitScript(t=>localStorage.setItem('weddly_shared_wedding_token',t),member);
  page.on('request',r=>{try{const u=new URL(r.url()),b=new URL(base);if(u.origin===b.origin)calls.sameOrigin.push(u.pathname);if(u.hostname.includes('supabase.co')&&/\/functions\/v1\/weddly-/.test(u.pathname))calls.legacy.push(u.pathname)}catch{}});
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
    const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();let body={};try{body=req.postDataJSON()||{}}catch{}
    let out={ok:true},status=200;
    if(slug==='guest-access-check'){
      if(body.action==='entitlement')out={ok:true,product:'guests',edition,owner:false};
      else out={ok:true,product:'guests',edition};
    }else if(slug==='guest-rsvp-ensure'){
      out={ok:true,publicToken};
    }else if(slug==='guest-personalization'){
      if(req.method()==='POST'){calls.personalization.push(body);personalization=body.personalization||personalization;out={ok:true,personalization};}
      else out={ok:true,personalization};
    }else if(slug==='guest-rsvp'){
      if(req.method()==='GET'&&u.searchParams.get('manage')==='1'){
        out={ok:true,forms:[{id:'f1',public_token:publicToken,config}],submissions:[],contacts:[],delivery:[]};
      }else if(req.method()==='GET'&&u.searchParams.get('unit')){
        out={ok:true,form:{id:'f1',config},unit:{id:u.searchParams.get('unit'),label:'Familia López',members:[{id:'g1',name:'Ana López',events:[]},{id:'g2',name:'Mario López',events:[]}]}};
      }else if(req.method()==='GET'&&u.searchParams.get('token')){
        out={ok:true,form:{id:'f1',config},...(u.searchParams.get('guest')?{guest:{id:u.searchParams.get('guest'),name:'Ana López'}}:{})};
      }else if(req.method()==='POST'&&body.action==='config'){
        calls.config.push(body);config=structuredClone(body.config||config);
        if(failConfig){status=500;out={ok:false,error:'simulated_config_refresh_failure'};}else out={ok:true,config};
      }else if(req.method()==='POST'&&body.action==='claim'){
        out={ok:true,wedding_id:'w1',form_id:'f1'};
      }else if(req.method()==='POST'&&['submit','manual_submit'].includes(body.action)){
        calls.submit.push(body);out={ok:true,submission:{id:'s'+calls.submit.length}};
      }
    }else if(slug==='guest-rsvp-single-v2'){
      calls.single.push(body);out={ok:true,submission:{id:'single'+calls.single.length}};
    }else if(slug==='guest-state'){
      out=req.method()==='GET'?{ok:true,state:{meta:{},guests:{g1:{name:'Ana López'},g2:{name:'Mario López'}},tables:{}},version:1}:{ok:true,version:2};
    }else if(slug==='guest-event-state')out={ok:true,state:{events:{}},version:1};
    else if(slug==='guest-event-invite')out={ok:true};
    else if(slug==='guest-license-access')out={ok:true,role:'primary',product:'guests',edition};
    await route.fulfill({status,contentType:'application/json',body:JSON.stringify(out)});
  });
  return {page,calls,setFailConfig:v=>failConfig=v,getConfig:()=>config,setConfig:v=>{config=structuredClone(v)},setEdition:v=>edition=v};
}

// Invitation design and RSVP form configuration are produced by WeddlySmartDesign,
// outside the post-delivery couple application. Legacy editing routes remain closed.
async function testRetiredEditors(context){
  const {page,calls}=await makePage(context);
  for(const path of ['/guest/guests-rsvp-design-manage.html','/guest/guests-rsvp-form-flow.html']){
    await page.goto(base+path,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('main a[href="index.html"]',{timeout:5000});
    ok(await page.locator('main a').count()===1,'customer editor guard missing on '+path);
    ok(await page.locator('#tplGrid,#childrenQ,#addQuestion,#save').count()===0,'legacy editor controls exposed on '+path);
    ok(await page.locator('a[href="index.html"]').isVisible(),'return to GUEST missing on '+path);
    await noOverflow(page,path);
  }
  ok(calls.config.length===0&&calls.personalization.length===0,'editor mutation invoked in customer view');
  await page.close();
}

async function testSinglePublic(context){
  const config={title:'Pilar & Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos, Murcia',transportOffered:true,accommodationOffered:true,questions:{meal:true,allergy:true,transport:true,children:true,plusone:true},customQuestions:[{id:'song',label:'¿Qué canción no puede faltar?',type:'text',options:[],required:true}]};
  const x=await makePage(context,{config});
  const {page,calls}=x;
  await page.goto(base+'/guest/guests-rsvp-v116-single-live.html?guest=1&t='+publicToken+'&g=g1&lang=es',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#yes',{timeout:15000});
  ok((await page.locator('h1').innerText()).includes('Ana López'),'single RSVP did not resolve real guest name');
  await page.locator('#yes').click();
  await page.waitForSelector('[data-wsd-kids]',{timeout:10000});
  ok(await page.locator('[data-wsd-kids]').isVisible(),'children block missing when enabled');
  await page.locator('#meal').selectOption('Vegetariano');
  await page.locator('#allergy').fill('Ninguna');
  await page.locator('#transport').check();
  await page.locator('#accommodation').check();
  const custom=page.locator('#details > .custom').first();
  await custom.locator('.cv').fill('Viva la vida');
  await page.locator('#plusone').fill('Luis Gómez');
  await page.waitForSelector('#wsdPlusDetails.on');
  ok((await page.locator('#wsdPlusMeal').inputValue())==='','+1 meal was invented instead of pending');
  await page.locator('[data-wsd-kids] .wsd-kids-check').check();
  await page.locator('[data-wsd-kids] [data-k="name"]').fill('Sofía');
  await page.locator('[data-wsd-kids] [data-k="age"]').fill('7');

  // +1 cannot be submitted with an invented meal/default.
  await page.locator('#send').click();
  await page.waitForTimeout(150);
  ok(calls.single.length===0,'single RSVP sent +1 before required meal was selected');
  ok(/menú de Luis Gómez/i.test(await page.locator('#fb').innerText()),'missing +1 meal validation feedback');

  await page.locator('#wsdPlusMeal').selectOption('Vegano');
  const plusCustom=page.locator('#wsdPlusDetails .wsd-plus-custom').first();
  await plusCustom.locator('.cv').fill('September');
  await page.locator('#send').click();
  for(let i=0;i<60&&!calls.single.length;i++)await page.waitForTimeout(100);
  ok(calls.single.length===1,'single RSVP did not reach isolated +1 endpoint');
  const body=calls.single[0];
  ok(body.guest_key==='g1'&&body.name==='Ana López'&&body.attend===true,'single RSVP identity/attendance incorrect');
  ok(body.meal==='Vegetariano','main meal incorrect');
  ok(body.plusone_details?.name==='Luis Gómez'&&body.plusone_details?.meal==='Vegano','+1 independent details missing');
  ok(body.plusone_details?.custom_answers?.song==='September','+1 custom answers missing');
  ok(body.custom_answers?.song==='Viva la vida','main custom answer missing');
  ok(Array.isArray(body.children)&&body.children.length===1&&body.children[0].name==='Sofía','children details missing');
  await page.waitForSelector('.success',{timeout:10000});
  await page.waitForSelector('#wsdCalendarBtn',{timeout:10000});
  await page.waitForSelector('#wsdCalendarDownload',{state:'visible',timeout:5000});
  ok(await page.locator('#wsdCalendarDownload').isVisible(),'secondary calendar action missing');
  ok(calls.legacy.length===0,'ONE backend called from public single RSVP: '+calls.legacy.join(','));
  await noOverflow(page,'public single RSVP');
  await page.close();
}

async function testUnitPublic(context){
  const config={title:'Pilar & Jorge',date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos, Murcia',transportOffered:true,accommodationOffered:false,questions:{meal:true,allergy:true,transport:true,children:false,plusone:false},customQuestions:[{id:'song',label:'Canción',type:'text',options:[],required:true}]};
  const x=await makePage(context,{config});
  const {page,calls}=x;
  await page.goto(base+'/guest/guests-rsvp-v115-wedding-flex-live.html?t='+publicToken+'&u=u1&lang=es',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.person[data-person="g1"]',{timeout:15000});
  ok(await page.locator('.person').count()===2,'unit RSVP did not show both invited people');
  const a=page.locator('.person[data-person="g1"]'),b=page.locator('.person[data-person="g2"]');
  await a.locator('[data-answer="yes"]').click();
  await a.locator('.meal').selectOption('Vegano');
  await a.locator('.customValue').fill('September');
  await b.locator('[data-answer="no"]').click();
  await page.locator('#send').click();
  for(let i=0;i<60&&calls.submit.length<2;i++)await page.waitForTimeout(100);
  ok(calls.submit.length===2,'unit RSVP did not submit one response per person');
  const ga=calls.submit.find(v=>v.guest_key==='g1'),gb=calls.submit.find(v=>v.guest_key==='g2');
  ok(ga?.attend===true&&ga.meal==='Vegano'&&ga.custom_answers?.song==='September','attending unit member payload incorrect');
  ok(gb?.attend===false,'declined unit member payload incorrect');
  await page.waitForSelector('.success',{timeout:10000});
  ok(calls.legacy.length===0,'ONE backend called from public unit RSVP: '+calls.legacy.join(','));
  await noOverflow(page,'public unit RSVP');
  await page.close();
}

(async()=>{
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  try{
    await testRetiredEditors(context);
    await testSinglePublic(context);
    await testUnitPublic(context);
    console.log('B6.3 managed invitations + public RSVP + editor exclusion: PASS');
  }finally{await browser.close()}
})().catch(e=>{console.error('B6.3 FAIL:',e.stack||e);process.exit(1)});