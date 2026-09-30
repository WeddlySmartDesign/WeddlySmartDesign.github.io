const { chromium } = require('playwright');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const member='e'.repeat(64);
const guestState={
  meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12',todaySeatChanges:[]},
  guests:{
    g1:{name:'Ana López',rsvp:'confirmed',group:'Amigos',unitId:'Pilar',invitationUnitId:'u1',phone:'600111222'},
    g2:{name:'Luis Martín',rsvp:'confirmed',group:'Amigos',unitId:'Pilar',invitationUnitId:'u1',phone:'600111222'},
    g3:{name:'Marta Ruiz',rsvp:'pending',group:'Familia',unitId:'Jorge',invitationUnitId:'u2',phone:'600333444'},
    g4:{name:'Pedro Noasiste',rsvp:'declined',group:'Amigos',unitId:'Pilar',invitationUnitId:'u3',phone:'600999999'}
  },
  tables:{}
};
let eventState={schema:1,events:{},updatedAt:new Date(0).toISOString()},eventVersion=1;
const invitationByEvent=new Map(),recipientsByEvent=new Map();
let conflictOnce=false,failInviteSaveOnce=false;
const legacy=[],errors=[];

function clone(x){return JSON.parse(JSON.stringify(x))}
function recipientsFor(eventId,groups){
  const old=new Map((recipientsByEvent.get(eventId)||[]).map(r=>[String(r.recipient_key),r]));
  return groups.map((g,i)=>{
    const prev=old.get(String(g.key))||{};
    return {
      recipient_key:String(g.key),
      label:g.label,
      members:clone(g.members||[]),
      phone:g.phone||prev.phone||'',
      token:prev.token||('evt_'+eventId+'_'+String(i+1)+'_'+('t'.repeat(32))),
      response:prev.response||{},
      responded_at:prev.responded_at||null,
      sent_at:prev.sent_at||null,
      status:prev.status||'pending'
    };
  });
}
function updateStatus(r){
  const ms=r.members||[],resp=r.response||{};
  const vals=ms.map(m=>resp[m.id]).filter(Boolean);
  if(!r.responded_at||vals.length<ms.length)r.status='pending';
  else if(vals.every(x=>x==='yes'))r.status='yes';
  else if(vals.every(x=>x==='no'))r.status='no';
  else r.status='mixed';
}
function publicData(token){
  for(const [eventId,rs] of recipientsByEvent){
    const r=rs.find(x=>x.token===token);
    if(r)return {eventId,r};
  }
  return null;
}
async function noOverflow(frame){
  const x=await frame.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));
  ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,'horizontal overflow '+JSON.stringify(x));
}
async function coreFrame(page){
  for(let i=0;i<100;i++){
    const f=page.frames().find(x=>/guests-v114-integrated\.html/.test(x.url()));
    if(f){try{await f.waitForSelector('#nav',{timeout:400});return f}catch{}}
    await page.waitForTimeout(100);
  }
  throw new Error('core frame missing');
}
async function mock(page){
  page.on('request',r=>{try{const u=new URL(r.url());if(u.hostname.includes('supabase.co')&&/\/functions\/v1\/weddly-/.test(u.pathname))legacy.push(u.pathname)}catch{}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({member,guestState})=>{
    localStorage.setItem('weddly_shared_wedding_token',member);
    localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(guestState));
    localStorage.setItem('weddly_pro_v7',JSON.stringify({settings:{partner1:'Pilar',partner2:'Jorge',weddingDate:'2027-09-12',lang:'es'}}));
  },{member,guestState});
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
    const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();
    let body={};try{body=req.postDataJSON()||{}}catch{}
    if(slug.startsWith('weddly-')){
      await route.fulfill({status:500,contentType:'application/json',body:JSON.stringify({ok:false,error:'legacy_forbidden'})});return;
    }
    let out={ok:true},status=200;
    if(slug==='guest-event-state'){
      if(req.method()==='GET')out={ok:true,state:clone(eventState),version:eventVersion};
      else if(req.method()==='PUT'){
        if(conflictOnce){conflictOnce=false;status=409;out={ok:false,error:'version_conflict',server:{state:clone(eventState),version:eventVersion}}}
        else{eventState=clone(body.state||eventState);eventVersion++;out={ok:true,state:clone(eventState),version:eventVersion}}
      }
    }else if(slug==='guest-event-invite'){
      const eventId=u.searchParams.get('event_id');
      const token=u.searchParams.get('token');
      if(req.method()==='GET'&&token){
        const found=publicData(token);
        if(!found){status=404;out={ok:false,error:'not_found'}}
        else{
          const ev=eventState.events[found.eventId]||{};
          out={ok:true,event:clone(ev),invitation:clone(invitationByEvent.get(found.eventId)||{}),recipient:clone(found.r)};
        }
      }else if(req.method()==='GET'&&eventId){
        out={ok:true,invitation:clone(invitationByEvent.get(eventId)||{}),recipients:clone(recipientsByEvent.get(eventId)||[])};
      }else if(req.method()==='POST'){
        const id=String(body.event_id||'');
        if(body.action==='sync_recipients'){
          const rs=recipientsFor(id,body.recipients||[]);recipientsByEvent.set(id,rs);
          out={ok:true,recipients:clone(rs)};
        }else if(body.action==='save_payload'){
          if(failInviteSaveOnce){failInviteSaveOnce=false;status=503;out={ok:false,error:'temporary'}}
          else{invitationByEvent.set(id,clone(body.payload||{}));out={ok:true,invitation:clone(body.payload||{})}}
        }else if(body.action==='mark_sent'){
          const rs=recipientsByEvent.get(id)||[],r=rs.find(x=>String(x.recipient_key)===String(body.recipient_key));
          if(r)r.sent_at='2026-09-30T11:00:00Z';out={ok:true};
        }else if(body.action==='respond'){
          const found=publicData(String(body.token||''));
          if(!found){status=404;out={ok:false,error:'not_found'}}
          else{
            found.r.response=clone(body.response||{});found.r.responded_at='2026-09-30T11:01:00Z';updateStatus(found.r);
            out={ok:true,responded_at:found.r.responded_at};
          }
        }
      }
    }else if(slug==='guest-state'){
      if(req.method()==='GET')out={ok:true,state:clone(guestState),version:2};else out={ok:true,state:clone(body.state||guestState),version:3};
    }else if(slug==='guest-access-check')out={ok:true,product:'guests',edition:'signature'};
    else if(slug==='guest-license-access')out={ok:true,role:'primary',product:'guests',edition:'signature'};
    else if(slug==='guest-rsvp')out=u.searchParams.get('manage')==='1'?{ok:true,forms:[],submissions:[],contacts:[],delivery:[]}:{ok:true,form:{config:{}}};
    else out={ok:true};
    await route.fulfill({status,contentType:'application/json',body:JSON.stringify(out)});
  });
}

(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,acceptDownloads:true});
 const page=await context.newPage();await mock(page);

 // Direct extra-events product: empty state, branding and GUEST-only scope.
 await page.goto(base+'/guest/guests-events-v3.html',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#activate',{timeout:10000});
 await noOverflow(page);
 const topText=(await page.locator('body').innerText()).slice(0,4000);
 ok(/GUEST/i.test(topText)&&/by WeddlySmartDesign/i.test(topText),'event product brand missing');
 ok(topText.includes('¿Haréis preboda?'),'empty extra-event state missing');
 await page.waitForTimeout(500);
 const simplified=(await page.locator('body').innerText()).slice(0,5000);
 ok(!simplified.includes('Presupuesto y pagos')&&!simplified.includes('Tareas específicas'),'ONE planning/payment scope leaked into GUEST event product');

 // Preboda activation must be explicit and active.
 await page.locator('#activate').click();
 await page.waitForSelector('#newEventName');
 ok(await page.locator('#newEventName').inputValue()==='Preboda','pre-wedding default name wrong');
 ok(await page.locator('#newEventDate').inputValue()==='2027-09-11','pre-wedding default date should be wedding-1');
 await page.locator('#eventCreate').click();
 await page.waitForSelector('.eventTabs [data-tab].on',{timeout:10000});
 let preId=Object.keys(eventState.events)[0];
 ok(!!preId,'pre-wedding event not persisted');
 ok(eventState.events[preId].enabled===true,'pre-wedding should activate explicitly');
 ok(eventState.events[preId].guestIds.length===0,'new event inherited guests unexpectedly');
 await noOverflow(page);

 // Declined guest must not be selectable.
 await page.waitForSelector('#wsdEventGuestCompact',{timeout:10000});
 const countText=await page.locator('#wsdEventGuestCompact [data-wsd-eg-count]').innerText();
 ok(/0 seleccionados de 3/.test(countText),'active guest count wrong: '+countText);
 await page.locator('#wsdEventGuestCompact [data-wsd-eg-toggle]').click();
 const guestText=await page.locator('#guestList').innerText();
 ok(guestText.includes('Ana López')&&guestText.includes('Luis Martín')&&guestText.includes('Marta Ruiz'),'active guests missing');
 ok(!guestText.includes('Pedro Noasiste'),'declined guest leaked into event selection');

 // Group selection must use GUEST state API and survive one conflict retry.
 await page.waitForSelector('#wsdEventGroupSelect',{timeout:10000});
 const opts=await page.locator('#wsdEventGroupSelect option').allTextContents();
 const amigoIndex=opts.findIndex(x=>x.includes('Grupo · Amigos'));
 ok(amigoIndex>0,'Amigos group selector missing: '+opts.join(' | '));
 conflictOnce=true;
 await page.locator('#wsdEventGroupSelect').selectOption({index:amigoIndex});
 await page.locator('.wsd-eg-group-add').click();
 await page.waitForFunction(()=>document.getElementById('wsdEventGroupStatus')?.textContent.includes('añadid'),null,{timeout:10000});
 ok(new Set(eventState.events[preId].guestIds).has('g1')&&new Set(eventState.events[preId].guestIds).has('g2'),'group add did not persist after conflict retry');
 ok(!new Set(eventState.events[preId].guestIds).has('g4'),'declined guest added through group selector');

 // Event invitation is generated per selected invitation unit.
 await page.waitForSelector('#wsdEventInviteSection',{timeout:12000});
 await page.waitForSelector('#inviteEdit',{timeout:12000});
 let rs=recipientsByEvent.get(preId)||[];
 ok(rs.length===1&&rs[0].members.length===2,'selected unit not grouped into one event invitation');
 ok(rs[0].members.some(x=>x.id==='g1')&&rs[0].members.some(x=>x.id==='g2'),'event recipient members wrong');

 // Editor is one-photo only. First save failure must remain recoverable.
 await page.locator('#inviteEdit').click();
 await page.waitForSelector('#wsdInviteSheet.on #invTitle',{timeout:6000});
 await page.waitForTimeout(350);
 ok(await page.locator('#photo1').count()===1,'event invitation cover photo input missing');
 ok(await page.locator('#photo2').count()===0,'second event photo should not be exposed');
 const photoLabel=await page.locator('#photo1').locator('xpath=ancestor::*[contains(@class,"inviteField")]').locator('label').innerText();
 ok(/Foto de portada/i.test(photoLabel),'single-photo label not applied');
 await page.locator('#invTitle').fill('Cena de bienvenida');
 await page.locator('#invSubtitle').fill('Nos vemos la víspera');
 await page.locator('#invMessage').fill('Tenemos muchas ganas de veros.');
 failInviteSaveOnce=true;
 await page.locator('#invSave').click();
 await page.waitForFunction(()=>document.getElementById('invSaveStatus')?.textContent.includes('No se ha podido guardar'),null,{timeout:6000});
 ok(await page.locator('#wsdInviteSheet').evaluate(x=>x.classList.contains('on')),'failed invitation save closed editor unexpectedly');
 await page.locator('#invSave').click();
 await page.waitForFunction(()=>!document.getElementById('wsdInviteSheet')?.classList.contains('on'),null,{timeout:8000});
 const payload=invitationByEvent.get(preId)||{};
 ok(payload.title==='Cena de bienvenida'&&payload.subtitle==='Nos vemos la víspera','event invitation payload not saved');
 ok(payload.secondPhoto===''||payload.secondPhoto==null,'event invitation retained forbidden second photo');
 await page.waitForFunction(()=>document.querySelectorAll('#wsdEventInviteSection .inviteRecipient').length===1,null,{timeout:12000});

 // Public event invitation + independent RSVP.
 rs=recipientsByEvent.get(preId)||[];
 const token=rs[0]?.token;ok(token,'public event token missing');
 const publicPage=await context.newPage();await mock(publicPage);
 await publicPage.goto(base+'/guest/event-invite.html?t='+encodeURIComponent(token),{waitUntil:'domcontentloaded'});
 await publicPage.waitForSelector('#cover.on',{timeout:10000});
 await noOverflow(publicPage);
 ok((await publicPage.locator('#coverTitle').innerText())==='Cena de bienvenida','public event title wrong');
 await publicPage.locator('#detailsBtn').click();
 await publicPage.waitForSelector('#details.on');
 const memberNames=await publicPage.locator('#members .member b').allTextContents();
 ok(memberNames.includes('Ana López')&&memberNames.includes('Luis Martín'),'public event invitation lost recipient members');
 for(const row of await publicPage.locator('#members .member').all())await row.locator('[data-answer="yes"]').click();
 await publicPage.locator('#sendBtn').click();
 await publicPage.waitForSelector('#success',{state:'visible',timeout:7000});
 ok(rs[0].response.g1==='yes'&&rs[0].response.g2==='yes','event RSVP did not persist independently');
 ok(rs[0].responded_at,'event RSVP timestamp missing');
 await publicPage.close();

 // Owner UI refresh must expose confirmed event RSVP.
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForSelector('.eventTabs [data-tab].on',{timeout:10000});
 await page.waitForSelector('#wsdEventInviteSection',{timeout:12000});
 await page.waitForFunction(()=>document.querySelector('#wsdEventInviteSection')?.innerText.includes('Confirmado'),null,{timeout:12000});
 const inviteSection=await page.locator('#wsdEventInviteSection').innerText();
 ok(inviteSection.includes('2')&&inviteSection.includes('Sí'),'event confirmation stats not refreshed');

 // "Otro evento" must start inactive.
 await page.locator('#addEvent').click();
 await page.waitForSelector('#newEventName');
 ok(await page.locator('#newEventName').inputValue()==='Otro evento','generic event default name wrong');
 await page.locator('#newEventName').fill('Brunch');
 await page.locator('#newEventDate').fill('2027-09-13');
 await page.locator('#eventCreate').click();
 await page.waitForSelector('.eventTabs [data-tab].on',{timeout:8000});
 const otherId=Object.keys(eventState.events).find(id=>id!==preId);
 ok(otherId&&eventState.events[otherId].enabled===false,'"Other event must be inactive by default');
 ok((await page.locator('#disable').innerText())==='Activar','inactive extra event does not show Activate');
 await page.locator('#disable').click();
 await page.waitForFunction(()=>document.getElementById('disable')?.textContent.trim()==='Desactivar',null,{timeout:8000});
 ok(eventState.events[otherId].enabled===true,'manual activation of extra event failed');

 // Main GUEST Listados must expose event report and confirmed-only export.
 const main=await context.newPage();await mock(main);
 await main.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});
 const core=await coreFrame(main);
 await core.locator('#nav button[data-go="listados"]').click();
 await core.waitForSelector('[data-wsd-event-list]',{timeout:12000});
 const eventCards=core.locator('[data-wsd-event-list]');
 const preCard=eventCards.filter({hasText:'Preboda'}).first();
 ok(await preCard.isVisible(),'Preboda report missing from Listados');
 const cardText=await preCard.innerText();
 ok(cardText.includes('2 confirmados')&&cardText.includes('0 pendientes'),'event report counts wrong: '+cardText);
 const [download]=await Promise.all([main.waitForEvent('download'),preCard.locator('[data-event-csv]').click()]);
 const stream=await download.createReadStream(),chunks=[];for await(const b of stream)chunks.push(b);
 const csv=Buffer.concat(chunks).toString('utf8');
 ok(csv.includes('Ana López')&&csv.includes('Luis Martín'),'confirmed event attendees missing from CSV');
 ok(!csv.includes('Marta Ruiz')&&!csv.includes('Pedro Noasiste'),'pending/declined guest leaked into event confirmed CSV');
 ok(/^EVT_Rev1_C\d{3}\.csv$/i.test(download.suggestedFilename()),'event controlled-copy filename wrong: '+download.suggestedFilename());

 // Brand, mobile scope and isolation.
 await noOverflow(core);
 ok(legacy.length===0,'ONE backend called during extra-events QA: '+legacy.join(','));
 ok(errors.length===0,'browser errors: '+errors.join(' | '));

 await main.close();await page.close();await browser.close();
 console.log('B6.5 extra events: PASS');
})().catch(e=>{console.error('B6.5 FAIL:',e.stack||e);process.exit(1)});
