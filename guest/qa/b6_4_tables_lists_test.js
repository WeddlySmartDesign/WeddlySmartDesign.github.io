const { chromium } = require('playwright');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const member='m'.repeat(64);
const seed={
  meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12',todaySeatChanges:[]},
  guests:{
    g1:{name:'Ana López',rsvp:'confirmed',meal:'Vegetariano',mealRequired:true,table:'Mesa 1',transport:true,accommodation:true,phone:'600111222',group:'Amigos Pilar'},
    g2:{name:'Mario Ruiz',rsvp:'confirmed',meal:'Estándar',mealRequired:true,table:'Mesa 1',transport:false,accommodation:false,phone:'600111333',group:'Familia Jorge'},
    g3:{name:'Lucía Pérez',rsvp:'pending',meal:'',mealRequired:true,table:'',transport:true,accommodation:true,phone:'600111444',group:'Amigos Pilar'},
    g4:{name:'Pedro Noasiste',rsvp:'declined',meal:'Estándar',mealRequired:true,table:'',transport:true,accommodation:true,phone:'600111555',group:'Otros'},
    g5:{name:'Sara Sinmenú',rsvp:'confirmed',meal:'',mealRequired:false,table:'Mesa 2',transport:false,accommodation:false,phone:'600111666',group:'Familia Jorge'},
    g6:{name:'Elena Torres',rsvp:'pending',meal:'',mealRequired:true,table:'',transport:false,accommodation:false,phone:'600111777',group:'Amigos Pilar'}
  },
  tables:{t1:{name:'Mesa 1',cap:2},t2:{name:'Mesa 2',cap:4}},
  activity:null,meta2:{}
};
let server=structuredClone(seed);
function csvText(s){return String(s||'').replace(/^\uFEFF/,'')}
async function downloadText(download){
  const stream=await download.createReadStream();const chunks=[];for await(const c of stream)chunks.push(c);return Buffer.concat(chunks).toString('utf8')
}
async function coreFrame(page){
  for(let i=0;i<100;i++){const f=page.frames().find(x=>/guests-v114-integrated\.html/.test(x.url()));if(f){try{await f.waitForSelector('#nav',{timeout:400});return f}catch{}}await page.waitForTimeout(100)}
  throw new Error('core frame missing')
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,acceptDownloads:true});
 const page=await context.newPage();const legacy=[],errors=[];
 page.on('request',r=>{try{const u=new URL(r.url());if(u.hostname.includes('supabase.co')&&/\/functions\/v1\/weddly-/.test(u.pathname))legacy.push(u.pathname)}catch{}});
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({t})=>localStorage.setItem('weddly_shared_wedding_token',t),{t:member});
 await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
   const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();let body={};try{body=req.postDataJSON()||{}}catch{}
   let out={ok:true},status=200;
   if(slug==='guest-state'){
     if(req.method()==='GET')out={ok:true,state:server,version:7};
     else{server=structuredClone(body.state||server);out={ok:true,state:server,version:Number(body.version||7)+1}}
   }else if(slug==='guest-rsvp'){
     if(u.searchParams.get('manage')==='1')out={ok:true,forms:[{id:'f1',public_token:'r'.repeat(48),config:{accommodationOffered:true,questions:{transport:true},customQuestions:[{id:'song',label:'Canción favorita',type:'text'}]}}],submissions:[{id:'s1',form_id:'f1',guest_key:'g1',name:'Ana López',attend:true,payload:{custom_answers:{song:'September'},accommodation:true},received_at:'2026-09-30T08:00:00Z'}],contacts:[],delivery:[]};
     else out={ok:true,form:{config:{}}};
   }else if(slug==='guest-access-check')out={ok:true,product:'guests',edition:'signature'};
   else if(slug==='guest-license-access')out={ok:true,role:'primary',product:'guests',edition:'signature'};
   else out={ok:true};
   await route.fulfill({status,contentType:'application/json',body:JSON.stringify(out)});
 });
 await page.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});
 let core=await coreFrame(page);

 // Mesas overview and capacity.
 await core.locator('#nav button[data-go="mesas"]').click();
 await core.waitForSelector('#mesas .table');
 ok((await core.locator('#mesas').innerText()).includes('2 con mesa')===false,'sanity: assigned count should include three initial guests');
 const mesasText=await core.locator('#mesas').innerText();
 ok(mesasText.includes('3 con mesa')&&mesasText.includes('2 sin mesa'),'table summary counts are wrong: '+mesasText.slice(0,500));
 const mesa1=core.locator('#mesas .card.table').filter({hasText:'Mesa 1'}).first();
 ok((await mesa1.innerText()).includes('2 de 2 plazas')&&(await mesa1.innerText()).includes('Llena'),'full table capacity not clear');
 ok(!(await core.locator('#mesas').innerText()).includes('Pedro Noasiste'),'declined guest leaked into seating');

 // Visual plan: multi-select two people and move together.
 await core.locator('#planBtn').click();
 let plan=page.frames().find(x=>/guests-v081-visual-seating\.html/.test(x.url()));
 for(let i=0;i<80&&!plan;i++){await page.waitForTimeout(100);plan=page.frames().find(x=>/guests-v081-visual-seating\.html/.test(x.url()))}
 ok(plan,'visual seating frame missing');
 await plan.waitForSelector('#unseated .personPick',{timeout:10000});
 const planBrand=await plan.locator('.brand').first().innerText();
 ok(planBrand.toLowerCase().includes('guest by weddlysmartdesign'),'visual seating not branded GUEST '+JSON.stringify({url:plan.url(),brand:planBrand,title:await plan.title()}));
 const unText=await plan.locator('#unseated').innerText();
 ok(unText.includes('Lucía Pérez')&&unText.includes('Elena Torres')&&!unText.includes('Pedro Noasiste'),'visual unseated list incorrect: '+unText);
 await plan.getByRole('button',{name:/Lucía Pérez/}).click();
 await plan.getByRole('button',{name:/Elena Torres/}).click();
 ok(await plan.locator('#bulkCount').innerText()==='2','multi-select count incorrect');
 await plan.locator('#seatSelected').click();
 const target=plan.locator('#panel [data-seat]').filter({hasText:'Mesa 2'}).first();
 ok(await target.isEnabled(),'valid destination table disabled for two selected guests');
 const full=plan.locator('#panel [data-seat]').filter({hasText:'Mesa 1'}).first();
 ok(await full.isDisabled(),'full table should be disabled for bulk seating');
 await target.click();
 await page.waitForTimeout(100);
 let local=await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'{}'));
 ok(local.guests.g3.table==='Mesa 2'&&local.guests.g6.table==='Mesa 2','visual multi-seat did not persist canonical state');

 // Return must reload core from canonical plan state rather than overwrite it.
 await core.locator('#planBack').click();
 await page.waitForTimeout(600);
 core=await coreFrame(page);
 await core.locator('#nav button[data-go="mesas"]').click();
 await core.waitForSelector('#mesas');
 local=await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'{}'));
 ok(local.guests.g3.table==='Mesa 2'&&local.guests.g6.table==='Mesa 2','return from plan overwrote seating changes');
 ok((await core.locator('#mesas').innerText()).includes('5 con mesa')&&(await core.locator('#mesas').innerText()).includes('0 sin mesa'),'core did not refresh seating counts after plan');

 // Rename table: every assigned guest must follow the table rename.
 const mesa2=core.locator('#mesas .card.table').filter({hasText:'Mesa 2'}).first();
 await mesa2.locator('[data-edittable]').click();
 await core.locator('#etName').fill('Mesa Jardín');
 await core.locator('#etCap').fill('5');
 await core.locator('#etSave').click();
 local=await page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'{}'));
 for(const id of ['g3','g5','g6'])ok(local.guests[id].table==='Mesa Jardín','table rename did not propagate to '+id);
 ok(Object.values(local.tables).some(t=>t.name==='Mesa Jardín'&&Number(t.cap)===5),'renamed table/capacity not persisted');

 // Listados: generated cards and exact filtering.
 await core.locator('#nav button[data-go="listados"]').click();
 await core.waitForSelector('#wsdCsvTables',{timeout:10000});
 const listText=await core.locator('#listados').innerText();
 ok(listText.includes('Mesas · Boda principal')&&listText.includes('Catering · Boda principal')&&listText.includes('Transporte · Boda principal'),'core reports missing');

 async function csv(id){
   const [d]=await Promise.all([page.waitForEvent('download'),core.locator(id).click()]);
   return {name:d.suggestedFilename(),text:csvText(await downloadText(d))}
 }
 const tables=await csv('#wsdCsvTables');
 ok(/Mesas_Boda_principal\.csv/i.test(tables.name),'tables filename unclear: '+tables.name);
 ok(tables.text.includes('Ana López')&&tables.text.includes('Lucía Pérez')&&tables.text.includes('Mesa Jardín'),'tables CSV missing current seating');
 ok(!tables.text.includes('Pedro Noasiste'),'declined guest leaked into tables CSV');
 const catering=await csv('#wsdCsvCatering');\n ok(/^CAT_Rev1_C\\d{3}\\.csv$/i.test(catering.name),'catering controlled-copy filename unclear: '+catering.name);
 ok(catering.text.includes('Ana López')&&catering.text.includes('Vegetariano')&&catering.text.includes('Mario Ruiz'),'catering CSV missing confirmed meals');
 ok(!catering.text.includes('Sara Sinmenú')&&!catering.text.includes('Lucía Pérez'),'catering CSV included no-menu or pending guest');
 ok(catering.text.includes('TOTAL'),'catering CSV missing total summary');
 const transport=await csv('#wsdCsvTransport');\n ok(/^TRA_Rev1_C\\d{3}\\.csv$/i.test(transport.name),'transport controlled-copy filename unclear: '+transport.name);
 ok(transport.text.includes('Ana López')&&transport.text.includes('Lucía Pérez'),'transport CSV missing active transport users');
 ok(!transport.text.includes('Pedro Noasiste'),'declined guest leaked into transport CSV');

 // Printable table report must use GUEST brand and current seating.
 const popupPromise=page.waitForEvent('popup');
 await core.locator('#wsdPrintTables').click();
 const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded').catch(()=>{});
 const printText=await popup.locator('body').innerText();
 ok(printText.includes('GUEST by WeddlySmartDesign')&&printText.includes('Mesa Jardín')&&printText.includes('Lucía Pérez'),'print/PDF table report not current or not branded');\n ok(/Rev\\. 1/.test(printText)&&/WSD-MES-R01-C\\d{3}/.test(printText),'print/PDF table report missing controlled-copy metadata');
 await popup.close();

 // Custom RSVP list must remain isolated and exportable.
 await core.waitForSelector('[data-wsd-q-list]',{timeout:10000});
 const qcard=core.locator('[data-wsd-q-list]').filter({hasText:'Canción favorita'}).first();
 ok(await qcard.isVisible(),'custom RSVP list missing');
 const [qd]=await Promise.all([page.waitForEvent('download'),qcard.locator('[data-qcsv]').click()]);
 const qtext=csvText(await downloadText(qd));
 ok(qtext.includes('Ana López')&&qtext.includes('September'),'custom-answer CSV content incorrect');

 ok(legacy.length===0,'ONE backend called during Mesas/Listados QA: '+legacy.join(','));
 ok(errors.length===0,'browser errors: '+errors.join(' | '));
 await browser.close();
 console.log('B6.4 tables/lists: PASS');
})().catch(e=>{console.error('B6.4 FAIL:',e.stack||e);process.exit(1)});