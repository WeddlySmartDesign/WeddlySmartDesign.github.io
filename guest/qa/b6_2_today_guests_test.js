const { chromium } = require('playwright');
const assert=require('node:assert/strict');
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173',token='g'.repeat(64);
const now=Date.now(),iso=x=>new Date(x).toISOString();
let remoteState={
 meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12',todayRecentChangesReadAt:0,todaySeatChanges:[{name:'Carlos Ruiz',from:'Mesa 1',to:'Mesa 2',ts:now-6*60*1000}]},
 guests:{
  g1:{name:'Ana López',rsvp:'pending',meal:'',mealRequired:true,table:'',transport:false,group:'Amigos Pilar',unitId:'Universidad',invitationRecipientId:'g1',invitationUnitId:'u1',invitationUnitLabel:'Ana López'},
  g2:{name:'Bea Martín',rsvp:'confirmed',meal:'',mealRequired:true,table:'Mesa 1',transport:false,group:'Familia Jorge'},
  g3:{name:'Carlos Ruiz',rsvp:'confirmed',meal:'Estándar',mealRequired:true,table:'Mesa 1',transport:false,group:'Familia Jorge'},
  g4:{name:'Diana Sol',rsvp:'confirmed',meal:'Vegano',mealRequired:true,table:'',transport:true,group:'Amigos Pilar'}
 },
 tables:{t1:{name:'Mesa 1',cap:1},t2:{name:'Mesa 2',cap:8}}
};
const submissions=[
 {id:'s1n',form_id:'f1',client_submission_id:'c1n',guest_key:'g1',name:'Ana López',attend:true,meal:'Vegetariano',allergy:'',transport:true,plusone:null,payload:{custom_answers:{song:'Viva la vida'}},received_at:iso(now-2*60*1000)},
 {id:'s1p',form_id:'f1',client_submission_id:'c1p',guest_key:'g1',name:'Ana López',attend:false,meal:'',allergy:'',transport:false,plusone:null,payload:{custom_answers:{song:'Viva la vida'}},received_at:iso(now-62*60*1000)},
 {id:'s4n',form_id:'f1',client_submission_id:'c4n',guest_key:'g4',name:'Diana Sol',attend:true,meal:'Vegano',allergy:'',transport:true,plusone:null,payload:{custom_answers:{song:'September'}},received_at:iso(now-3*60*1000)},
 {id:'s4p',form_id:'f1',client_submission_id:'c4p',guest_key:'g4',name:'Diana Sol',attend:true,meal:'Vegano',allergy:'',transport:true,plusone:null,payload:{custom_answers:{song:'Dancing Queen'}},received_at:iso(now-65*60*1000)}
];
const form={id:'f1',public_token:'r'.repeat(48),config:{title:'Pilar & Jorge',customQuestions:[{id:'song',label:'Canción',type:'text',required:false}],questions:{meal:true,allergy:true,transport:true,plusone:true},transportOffered:true,accommodationOffered:false}};
const ok=(x,m)=>{if(!x)throw new Error(m)};
async function mock(page){
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
  const u=new URL(route.request().url()),slug=u.pathname.split('/').pop();let body={};try{body=route.request().postDataJSON()||{}}catch{}
  let out={ok:true},status=200;
  if(slug==='guest-state'){
   if(route.request().method()==='GET')out={ok:true,state:remoteState,version:11};
   else {if(body.state)remoteState=body.state;out={ok:true,state:remoteState,version:Number(body.version||11)+1}}
  }else if(slug==='guest-rsvp'){
   if(u.searchParams.get('manage')==='1')out={ok:true,forms:[form],submissions,contacts:[],delivery:[]};
   else out={ok:true,form:{id:'f1',config:form.config}};
  }else if(slug==='guest-license-access'&&body.action==='status')out={ok:true,role:'primary',partnerJoined:false,product:'guests',edition:'signature'};
  else if(slug==='guest-access-check')out={ok:true,product:'guests',edition:'signature'};
  else if(slug==='guest-rsvp-ensure')out={ok:true,publicToken:form.public_token};
  else if(slug==='guest-personalization')out={ok:true,personalization:null};
  else if(slug==='guest-event-state')out={ok:true,state:{events:{}},version:1};
  await route.fulfill({status,contentType:'application/json',body:JSON.stringify(out)});
 })
}
async function coreFrame(page){
 for(let i=0;i<120;i++){const f=page.frames().find(x=>/guests-v114-integrated\.html/.test(x.url()));if(f){try{await f.waitForSelector('#nav',{timeout:500});return f}catch{}}await page.waitForTimeout(100)}
 throw new Error('core frame unavailable')
}
async function noOverflow(f,label){const x=await f.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body.scrollWidth}));ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,label+' overflow '+JSON.stringify(x))}
async function run(){
 const browser=await chromium.launch({headless:true});
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage();await mock(page);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/guest/index.html?access='+token+'#hoy',{waitUntil:'domcontentloaded'});
 let core=await coreFrame(page);
 await noOverflow(core,'Hoy');

 // Hoy: base alerts + recent changes from remote RSVP/table-change history.
 await core.waitForSelector('#hoy .stats .stat',{timeout:10000});
 const hoy=await core.locator('#hoy').innerText();
 ok(hoy.includes('Confirmados')&&hoy.includes('Pendientes'),'Hoy summary missing');
 ok(hoy.includes('Bea Martín necesita menú'),'missing-menu alert absent');
 ok(hoy.includes('Mesa 1 supera su capacidad'),'over-capacity alert absent');
 await core.waitForSelector('#wsdRecentChanges',{timeout:10000});
 const recent=await core.locator('#wsdRecentChanges').innerText();
 ok(recent.includes('Ana López')&&/Ahora asiste|Ha respondido/.test(recent),'recent RSVP attendance change missing');
 ok(recent.includes('Diana Sol')&&recent.includes('Canción'),'custom-question recent change missing');
 ok(recent.includes('Carlos Ruiz')&&recent.includes('Mesa 1')&&recent.includes('Mesa 2'),'recent table move missing');
 ok(await core.locator('#wsdMarkRecentRead').isVisible(),'mark recent changes read missing');
 await core.locator('#wsdMarkRecentRead').click();
 await core.waitForFunction(()=>!document.getElementById('wsdRecentChanges'));
 const readAt=await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'{}').meta?.todayRecentChangesReadAt||0);
 ok(readAt>0,'recent changes read timestamp not persisted');

 // Invitados: create group/subgroup, people list, edit and decline behavior.
 await core.locator('#nav button[data-go="invitados"]').click();
 await core.waitForSelector('#createBtn');
 await noOverflow(core,'Invitados');
 let txt=await core.locator('#invitados').innerText();
 ok(txt.includes('Prepara tu lista'),'guest preparation step missing');
 ok(/Invitaciones y respuestas|Gestiona el RSVP|Envía y recoge RSVP/.test(txt),'guest RSVP step missing');
 ok(txt.includes('Ajusta las mesas'),'guest seating step missing');
 await core.locator('#createBtn').click();
 await core.locator('[data-g="Amigos Pilar"]').click();
 await core.locator('#next1').click();
 await core.locator('#subgroup').fill('Universidad');
 await core.locator('#next2').click();
 await core.locator('#names').fill('Marta Pérez\nLucía Torres');
 await core.locator('#saveOnly').click();
 await core.waitForFunction(()=>!document.getElementById('sheet').classList.contains('on'));
 let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'{}'));
 const added=Object.values(saved.guests||{}).filter(g=>['Marta Pérez','Lucía Torres'].includes(g.name));
 ok(added.length===2,'create-list did not add both people');
 ok(added.every(g=>g.group==='Amigos Pilar'&&g.unitId==='Universidad'),'group/subgroup not preserved');

 core=await coreFrame(page);
 await core.locator('#nav button[data-go="invitados"]').click();
 await core.locator('#peopleBtn').click();
 const peopleText=await core.locator('#panel').innerText();
 ok(peopleText.includes('Marta Pérez')&&peopleText.includes('Lucía Torres'),'people manager missing created guests');
 ok(!peopleText.includes('No hay personas activas'),'people list unexpectedly empty');
 const martaRow=core.locator('#panel .row').filter({hasText:'Marta Pérez'});
 await martaRow.locator('[data-pedit]').click();
 await core.locator('#eRsvp').selectOption('confirmed');
 await core.locator('#eMeal').selectOption({label:'Vegano'});
 await core.locator('#eTransport').selectOption('yes');
 await core.locator('#editSave').click();
 saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'{}'));
 const marta=Object.values(saved.guests).find(g=>g.name==='Marta Pérez');
 ok(marta?.rsvp==='confirmed'&&marta?.meal==='Vegano'&&marta?.transport===true,'guest edit did not persist');

 // Declining an assigned guest must remove active seating.
 core=await coreFrame(page);
 await core.locator('#nav button[data-go="invitados"]').click();
 await core.locator('#peopleBtn').click();
 const carlosRow=core.locator('#panel .row').filter({hasText:'Carlos Ruiz'});
 await carlosRow.locator('[data-pedit]').click();
 await core.locator('#eRsvp').selectOption('declined');
 await core.locator('#editSave').click();
 saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'{}'));
 ok(saved.guests.g3.rsvp==='declined'&&saved.guests.g3.table==='','declined guest retained active table');

 // Import pasted spreadsheet data and verify explicit states only.
 core=await coreFrame(page);
 await core.locator('#nav button[data-go="invitados"]').click();
 await core.locator('#importBtn').click();
 await core.locator('#paste').fill('Nombre\tRSVP\tMenú\tMesa\nPedro Gil\tConfirmado\tVegetariano\tMesa 2\nSara León\tPendiente\t\t');
 await core.locator('#importPaste').click();
 await core.waitForSelector('#importDone');
 const importText=await core.locator('#panel').innerText();
 ok(importText.includes('2 nuevos'),'import result count incorrect');
 await core.locator('#importDone').click();
 saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'{}'));
 const pedro=Object.values(saved.guests).find(g=>g.name==='Pedro Gil'),sara=Object.values(saved.guests).find(g=>g.name==='Sara León');
 ok(pedro?.rsvp==='confirmed'&&pedro?.meal==='Vegetariano'&&pedro?.table==='Mesa 2','imported confirmed guest incorrect');
 ok(sara?.rsvp==='pending','pending import was converted incorrectly');

 // Return to Hoy: updated local state must render without losing core alerts/counts.
 core=await coreFrame(page);
 await core.locator('#nav button[data-go="hoy"]').click();
 await core.waitForSelector('#hoy .stats');
 const after=await core.locator('#hoy').innerText();
 ok(after.includes('Marta Pérez')||after.includes('Todo al día')||after.includes('necesita menú'),'Hoy did not rerender after guest changes');
 await noOverflow(core,'Hoy after guest edits');

 ok(errors.length===0,'page errors: '+errors.join(' | '));
 await browser.close();
 console.log('B6.2 Today + Guests: PASS')
}
run().catch(e=>{console.error('B6.2 FAIL:',e.stack||e);process.exit(1)});