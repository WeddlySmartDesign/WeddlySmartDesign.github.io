const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const TOKEN='z'.repeat(64),now=Date.now(),iso=n=>new Date(n).toISOString();
const replies=Array.from({length:20},(_,i)=>({id:'r'+i,form_id:'f01',client_submission_id:'c'+i,guest_key:'g'+i,name:'Invitado '+String(i+1),attend:i<16,meal:i<16?'Estándar':null,payload:{custom_answers:{}},received_at:iso(now-(i+1)*10000)}));
const wedding={meta:{couple:['Clara','Mateo'],weddingDate:'2027-06-12',todaySeatChanges:[{id:'g1',name:'Invitado 1',from:'Mesa 1',to:'Mesa 2',ts:now-5000,byDevice:'device-self'}]},guests:Object.fromEntries(replies.map((g,i)=>['g'+i,{name:g.name,rsvp:i<16?'confirmed':'declined',table:i===0?'Mesa 2':'',meal:i<16?'':'',mealRequired:true}])),tables:{a:{name:'Mesa 1',cap:8},b:{name:'Mesa 2',cap:8}}};
const form={id:'f01',config:{customQuestions:[],questions:{meal:true}},public_token:'r'.repeat(48)};
(async()=>{
 const browser=await chromium.launch({headless:true}),ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await ctx.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(t=>{localStorage.setItem('weddly_shared_wedding_token',t);localStorage.setItem('weddly_guests_device_id_v1','device-self')},TOKEN);
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
  const u=new URL(route.request().url()),slug=u.pathname.split('/').pop();let req={};try{req=route.request().postDataJSON()||{}}catch{}
  let body={ok:true};
  if(slug==='guest-state'){if(route.request().method()==='GET')body={ok:true,state:wedding,version:3};else body={ok:true,state:req.state||wedding,version:4}}
  else if(slug==='guest-rsvp')body={ok:true,forms:[form],submissions:replies,delivery:[],contacts:[]};
  else if(slug==='guest-event-state')body={ok:true,state:{events:{}},version:1};
  else if(slug==='guest-license-access')body={ok:true,role:'primary',partnerJoined:false};
  else if(slug==='guest-access-check')body={ok:true,product:'guests'};
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
 });
 try{
  await page.goto(BASE+'/guest/index.html#hoy',{waitUntil:'domcontentloaded'});
  let core;
  for(let i=0;i<100;i++){core=page.frames().find(f=>/guests-v114-integrated\.html/.test(f.url()));if(core)break;await page.waitForTimeout(100)}
  assert.ok(core,'actual ONE-derived GUEST guest core');
  await core.waitForSelector('#wsdRecentChanges',{timeout:12000});
  const inbox=core.locator('#wsdRecentChanges');
  assert.match(await inbox.innerText(),/20 sin leer/);
  assert.match(await inbox.innerText(),/20 respuestas de la boda/);
  assert.match(await inbox.innerText(),/16 asisten · 4 no asisten/);
  assert.equal(await inbox.getByRole('button',{name:'Ver 20 respuestas'}).count(),1);
  assert.equal(await inbox.getByText('Invitado 1',{exact:true}).count(),1,'self seating activity visible');
  assert.match(await inbox.innerText(),/Actividad de mesas/i);
  assert.match(await inbox.innerText(),/Este dispositivo/);
  assert.equal(await inbox.locator('.row').count(),2,'a bulk group and one activity only before opening details');
  await inbox.getByRole('button',{name:'Ver 20 respuestas'}).click();
  assert.ok(await inbox.locator('.row').count()>=22,'all 20 individual responses available');
  await inbox.locator('#wsdMarkRecentRead').click();
  await core.waitForFunction(()=>!document.getElementById('wsdMarkRecentRead'),{timeout:8000});
  const after=await core.locator('#hoy').innerText();
  assert.match(after,/Actividad de mesas/i,'own activity stays, not a new notice');
  assert.match(after,/necesita menú/i,'unresolved menu tasks remain even after marking read');
  assert.equal(Object.keys(await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')).meta.hoyReadNotificationIdsV1||{})).length,20);
  const newReply={id:'r_late',form_id:'f01',client_submission_id:'late',guest_key:'late',name:'Respuesta tardía',attend:true,received_at:iso(now-7200000),payload:{custom_answers:{}}};
  replies.push(newReply); // Older timestamp than all marked items, but newly arrived now.
  await page.bringToFront();await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await core.waitForFunction(()=>document.querySelector('#wsdRecentChanges')?.textContent?.includes('1 sin leer'),{timeout:12000});
  assert.match(await core.locator('#wsdRecentChanges').innerText(),/Respuesta tardía/);
  assert.deepEqual(errors,[],'no JS errors');
  console.log('PASS GUEST Hoy: 20 RSVP (16/4), one own seating activity, persistent tasks, stable-ID late response');
 }finally{await ctx.close();await browser.close()}
})().catch(e=>{console.error('FAIL GUEST Hoy 20 RSVP:',e.stack||e);process.exit(1)});
