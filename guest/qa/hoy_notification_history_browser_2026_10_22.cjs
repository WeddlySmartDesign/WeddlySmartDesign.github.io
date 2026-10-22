const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173',TOKEN='h'.repeat(64),now=Date.now(),ts=ms=>new Date(now-ms).toISOString();
let state={meta:{couple:['Clara','Mateo'],weddingDate:'2027-06-12',todayRecentChangesReadAt:0,todaySeatChanges:[{name:'María Ruiz',from:'Mesa 1',to:'Mesa 2',ts:now-60000}]},guests:{g1:{name:'Ana Moreno',group:'Familia Clara',rsvp:'pending',meal:'',mealRequired:true,table:'Mesa 1',invitationRecipientId:'g1',invitationUnitId:'u1'},g2:{name:'María Ruiz',group:'Familia Clara',rsvp:'confirmed',meal:'Vegetariano',mealRequired:true,table:'Mesa 2'}},tables:{t1:{name:'Mesa 1',cap:6},t2:{name:'Mesa 2',cap:6}}};
const subms=Array.from({length:7},(_,i)=>({id:'s'+i,form_id:'form1',guest_key:'g1',name:'Ana Moreno',attend:i%2===0,meal:i%2===0?'Vegetariano':'',client_submission_id:'c'+i,payload:{custom_answers:{song:'Canción '+i}},received_at:ts((i+2)*100000)}));
const form={id:'form1',public_token:'r'.repeat(48),config:{customQuestions:[{id:'song',label:'Canción',type:'text'}],questions:{meal:true}}};
async function run(){
 const browser=await chromium.launch({headless:true});
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),errs=[];page.on('pageerror',e=>errs.push(e.message));
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
  const url=new URL(route.request().url()),slug=url.pathname.split('/').pop();let x={ok:true},body={};try{body=route.request().postDataJSON()||{}}catch{}
  if(slug==='guest-state'){if(route.request().method()==='GET')x={ok:true,state,version:1};else{x={ok:true,state:body.state||state,version:2};if(body.state)state=body.state}}
  else if(slug==='guest-rsvp'){x={ok:true,forms:[form],submissions:subms,contacts:[],delivery:[]}}
  else if(slug==='guest-license-access')x={ok:true,role:'primary',partnerJoined:false};
  else if(slug==='guest-access-check')x={ok:true,product:'guests'};
  else if(slug==='guest-event-state')x={ok:true,state:{events:{}},version:1};
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(x)});
 });
 try{
  await page.goto(BASE+'/guest/index.html?access='+TOKEN+'#hoy',{waitUntil:'domcontentloaded'});
  let core;
  for(let i=0;i<100;i++){core=page.frames().find(f=>/guests-v114-integrated\.html/.test(f.url()));if(core)break;await page.waitForTimeout(100)}
  assert.ok(core,'full original guest core loaded');
  await core.waitForSelector('#wsdRecentChanges',{timeout:15000});
  const panel=core.locator('#wsdRecentChanges'),title=await panel.innerText();
  assert.match(title,/Notificaciones recientes/);
  const count=await panel.locator('.pill').first().innerText();
  assert.equal(Number(count),8,'all seven RSVP changes and one table movement are unread');
  assert.equal(await panel.locator('.row').count(),5,'collapsed notifications must show five without flooding mobile');
  await panel.locator('#wsdToggleRecent').click();
  assert.equal(await panel.locator('.row').count(),8,'show all allows all unread notifications');
  await panel.locator('#wsdMarkRecentRead').click();
  await core.waitForFunction(()=>!document.getElementById('wsdRecentChanges'),{timeout:10000});
  assert.ok((await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'{}').meta.todayRecentChangesReadAt))>0,'mark-read persists');
  assert.deepEqual(errs,[],'runtime errors');
  console.log('GUEST Hoy notification feed PASS: real RSVP + seating history, expand, read');
 }finally{await ctx.close();await browser.close()}
}
run().catch(e=>{console.error('GUEST Hoy notification feed FAIL',e.stack||e);process.exit(1)});
