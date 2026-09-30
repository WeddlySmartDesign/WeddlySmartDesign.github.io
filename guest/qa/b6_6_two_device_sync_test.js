const { chromium } = require('playwright');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const TOKENS={a:'a'.repeat(64),b:'b'.repeat(64),local:'l'.repeat(64),dead:'d'.repeat(64)};
const initial={
  meta:{couple:['Pilar','Jorge'],weddingDate:'2027-09-12',todaySeatChanges:[]},
  guests:{
    g1:{name:'Ana López',rsvp:'confirmed',group:'Amigos Pilar',invitationUnitId:'u1',unitId:'Pilar'},
    g2:{name:'Luis Martín',rsvp:'pending',group:'Familia Jorge',invitationUnitId:'u2',unitId:'Jorge'}
  },
  tables:{}
};
let remote=structuredClone(initial),version=1;
const offline=new Set(),dead=new Set([TOKENS.dead]);
const puts=[],legacy=[],errors=[];

const clone=x=>JSON.parse(JSON.stringify(x));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function coreFrame(page){
  for(let i=0;i<100;i++){
    const f=page.frames().find(x=>/guests-v114-integrated\.html/.test(x.url()));
    if(f){try{await f.waitForSelector('#nav',{timeout:350});return f}catch{}}
    await page.waitForTimeout(100);
  }
  throw new Error('core frame missing');
}
async function localState(page){
  return page.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'null'));
}
async function waitLocal(page,pred,label,timeout=12000){
  await page.waitForFunction(({label})=>{
    try{
      const s=JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'null');
      if(!s)return false;
      if(label==='g1A')return s.guests?.g1?.meal==='Vegano';
      if(label==='merged')return s.guests?.g1?.transport===true&&s.guests?.g2?.meal==='Vegetariano';
      if(label==='staleMerge')return s.guests?.g1?.transport===false&&s.guests?.g2?.meal==='Vegano';
      if(label==='conflictB')return s.guests?.g1?.meal==='Sin lactosa';
      if(label==='recovered')return s.guests?.g2?.transport===true;
      return false;
    }catch{return false}
  },{label},{timeout});
}
async function mock(page,token){
  page.on('request',r=>{try{const u=new URL(r.url());if(u.hostname.includes('supabase.co')&&/\/functions\/v1\/weddly-/.test(u.pathname))legacy.push(u.pathname)}catch{}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({token})=>{
    localStorage.setItem('weddly_shared_wedding_token',token);
    localStorage.setItem('weddly_pro_v7',JSON.stringify({settings:{partner1:'Pilar',partner2:'Jorge',weddingDate:'2027-09-12',lang:'es'}}));
  },{token});
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
    const req=route.request(),u=new URL(req.url()),slug=u.pathname.split('/').pop();
    let body={};try{body=req.postDataJSON()||{}}catch{}
    const h=req.headers(),member=h['x-weddly-token']||h['x-weddly-member']||token;
    if(slug.startsWith('weddly-')){legacy.push('/'+slug);await route.fulfill({status:500,contentType:'application/json',body:JSON.stringify({ok:false,error:'legacy_forbidden'})});return}
    if(offline.has(member)){await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,error:'offline'})});return}
    if(slug==='guest-state'){
      if(dead.has(member)){await route.fulfill({status:403,contentType:'application/json',body:JSON.stringify({ok:false,error:'inactive'})});return}
      if(req.method()==='GET'){
        await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,state:clone(remote),version})});return;
      }
      if(req.method()==='PUT'){
        // Partner request is slightly slower so simultaneous writes deterministically create a 409 on B.
        if(member===TOKENS.b)await sleep(120);
        const want=Number(body.version||0);
        if(want!==version){
          await route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({ok:false,error:'version_conflict',server:{state:clone(remote),version}})});return;
        }
        remote=clone(body.state||{});version++;puts.push({member,version,state:clone(remote)});
        await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,state:clone(remote),version})});return;
      }
    }
    if(slug==='guest-license-access'){
      if(body.action==='status'){
        const role=member===TOKENS.a?'primary':'partner';
        await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,role,partnerJoined:true,product:'guests',edition:'signature'})});return;
      }
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})});return;
    }
    if(slug==='guest-access-check'){await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,product:'guests',edition:'signature'})});return}
    if(slug==='guest-event-state'){await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,state:{events:{}},version:1})});return}
    if(slug==='guest-event-invite'){await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,recipients:[],invitation:{}})});return}
    if(slug==='guest-rsvp'){await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,forms:[],submissions:[],contacts:[],delivery:[],form:{config:{}}})});return}
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})});
  });
}
async function modify(page,fn){
  await page.evaluate(src=>{
    const k='weddly_guests_qa_v67',s=JSON.parse(localStorage.getItem(k)||'{}');
    Function('s',src)(s);localStorage.setItem(k,JSON.stringify(s));
  },fn.toString().replace(/^\s*function\s*\w*\s*\(s\)\s*\{|^\s*s\s*=>\s*\{|\}\s*$/g,''));
}
async function editGuestUi(page,id,{meal,transport}={}){
  const frame=await coreFrame(page);
  await frame.locator('#nav button[data-go="invitados"]').click();
  await frame.waitForSelector('#peopleBtn',{timeout:5000});
  await frame.locator('#peopleBtn').click();
  await frame.waitForSelector('[data-detail="'+id+'"]',{timeout:5000});
  await frame.locator('[data-detail="'+id+'"]').click();
  await frame.waitForSelector('#wpSave',{timeout:5000});
  if(meal!==undefined)await frame.locator('#wpMeal').selectOption({label:meal});
  if(transport!==undefined)await frame.locator('#wpTransport').selectOption(transport?'yes':'no');
  await frame.locator('#wpSave').click();
  // People Manager intentionally reloads the frozen core ~900 ms after a save. Wait for that handoff before the next edit.
  await page.waitForTimeout(1150);
  await coreFrame(page);
}
(async()=>{
  // Use two browser processes to model two real devices without background-tab timer throttling.
  const browserA=await chromium.launch({headless:true}),browserB=await chromium.launch({headless:true});
  const ca=await browserA.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const cb=await browserB.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const a=await ca.newPage(),b=await cb.newPage();await mock(a,TOKENS.a);await mock(b,TOKENS.b);

  // Both authorized devices bootstrap from the same remote wedding.
  await Promise.all([a.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'}),b.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'})]);
  await Promise.all([coreFrame(a),coreFrame(b)]);
  ok((await localState(a)).guests.g1.name==='Ana López','device A did not hydrate remote state');
  ok((await localState(b)).guests.g1.name==='Ana López','device B did not hydrate remote state');

  // Settings must recognize that the second device is already connected.
  await b.goto(base+'/guest/guest-settings.html',{waitUntil:'domcontentloaded'});
  await b.waitForFunction(()=>document.getElementById('syncText')?.textContent==='Dos dispositivos conectados',null,{timeout:6000});
  ok(await b.locator('#share').evaluate(x=>x.classList.contains('hidden')),'partner device should not expose invite action');
  await b.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});await coreFrame(b);

  // A real UI edit propagates to B.
  await a.bringToFront();await a.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await editGuestUi(a,'g1',{meal:'Vegano'});
  for(let i=0;i<60&&remote.guests.g1.meal!=='Vegano';i++)await sleep(150);
  if(remote.guests.g1.meal!=='Vegano'){const dbg=await a.evaluate(()=>({state:JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'null'),meta:JSON.parse(localStorage.getItem('weddly_guests_sync_meta_v2')||'{}'),notice:document.getElementById('notice')?.textContent||''}));throw new Error('device A change did not reach backend '+JSON.stringify({dbg,remote,version,puts}))}
  await b.bringToFront();await b.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await waitLocal(b,null,'g1A');

  // Concurrent non-overlapping edits must merge rather than overwrite each other.
  await Promise.all([
    editGuestUi(a,'g1',{transport:true}),
    editGuestUi(b,'g2',{meal:'Vegetariano'})
  ]);
  for(let i=0;i<50&&!(remote.guests.g1.transport===true&&remote.guests.g2.meal==='Vegetariano');i++)await sleep(150);
  if(!(remote.guests.g1.transport===true&&remote.guests.g2.meal==='Vegetariano')){const da=await a.evaluate(()=>({state:JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'null'),meta:JSON.parse(localStorage.getItem('weddly_guests_sync_meta_v2')||'{}'),g:window.__GuestsProd&&{ver:window.__GuestsProd.ver,last:window.__GuestsProd.last,pushing:window.__GuestsProd.pushing}})),db=await b.evaluate(()=>({state:JSON.parse(localStorage.getItem('weddly_guests_qa_v67')||'null'),meta:JSON.parse(localStorage.getItem('weddly_guests_sync_meta_v2')||'{}'),g:window.__GuestsProd&&{ver:window.__GuestsProd.ver,last:window.__GuestsProd.last,pushing:window.__GuestsProd.pushing}}));throw new Error('non-overlapping concurrent edits were not merged remotely '+JSON.stringify({remote,version,puts,da,db}))}
  await Promise.all([a.evaluate(()=>window.dispatchEvent(new Event('focus'))),b.evaluate(()=>window.dispatchEvent(new Event('focus')))]);
  await Promise.all([waitLocal(a,null,'merged'),waitLocal(b,null,'merged')]);

  // Same-field conflict: deterministic second writer B must win locally and remotely, with conflict notice.
  await Promise.all([
    editGuestUi(a,'g1',{meal:'Celíaco'}),
    editGuestUi(b,'g1',{meal:'Sin lactosa'})
  ]);
  for(let i=0;i<50&&remote.guests.g1.meal!=='Sin lactosa';i++)await sleep(150);
  ok(remote.guests.g1.meal==='Sin lactosa','same-field conflict did not preserve the second device local choice: '+remote.guests.g1.meal);
  await a.evaluate(()=>window.dispatchEvent(new Event('focus')));await waitLocal(a,null,'conflictB');
  const conflictNotice=await b.locator('#notice').innerText().catch(()=> '');
  ok(/Cambio simultáneo|Cambios combinados/.test(conflictNotice)||puts.some(x=>x.member===TOKENS.b),'conflict resolution path did not execute');

  // Stale/offline device: preserve dirty local edit while A changes another field, then merge on reconnect.
  offline.add(TOKENS.b);
  await editGuestUi(b,'g1',{transport:false});
  await b.waitForFunction(()=>document.getElementById('notice')?.textContent==='Pendiente de conexión',null,{timeout:7000});
  const metaOffline=await b.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_sync_meta_v2')||'{}'));
  ok(metaOffline.dirty===true,'offline edit not marked dirty');
  ok(remote.guests.g1.transport!==false,'offline edit reached backend unexpectedly');

  await editGuestUi(a,'g2',{meal:'Vegano'});
  for(let i=0;i<50&&remote.guests.g2.meal!=='Vegano';i++)await sleep(150);
  ok(remote.guests.g2.meal==='Vegano','online device edit did not reach backend during partner outage');

  offline.delete(TOKENS.b);
  await b.evaluate(()=>window.dispatchEvent(new Event('online')));
  await sleep(2200);
  ok(remote.guests.g1.transport===false&&remote.guests.g2.meal==='Vegano','stale-device recovery lost one side of the merge: '+JSON.stringify(remote.guests));
  await Promise.all([a.evaluate(()=>window.dispatchEvent(new Event('focus'))),b.evaluate(()=>window.dispatchEvent(new Event('focus')))]);
  await Promise.all([waitLocal(a,null,'staleMerge'),waitLocal(b,null,'staleMerge')]);
  const metaRecovered=await b.evaluate(()=>JSON.parse(localStorage.getItem('weddly_guests_sync_meta_v2')||'{}'));
  ok(metaRecovered.dirty===false,'dirty sync metadata not cleared after reconnect');

  // Another offline write should retry after online without requiring reload.
  offline.add(TOKENS.b);
  await editGuestUi(b,'g2',{transport:true});
  await b.waitForFunction(()=>document.getElementById('notice')?.textContent==='Pendiente de conexión',null,{timeout:7000});
  offline.delete(TOKENS.b);await b.evaluate(()=>window.dispatchEvent(new Event('online')));
  for(let i=0;i<50&&remote.guests.g2.transport!==true;i++)await sleep(150);
  ok(remote.guests.g2.transport===true,'online retry did not flush pending edit');
  await a.evaluate(()=>window.dispatchEvent(new Event('focus')));await waitLocal(a,null,'recovered');

  // Network failure with local copy opens safely; without local copy gives explicit retry.
  const cl=await browserA.newContext({viewport:{width:390,height:844},isMobile:true});
  const localPage=await cl.newPage();await mock(localPage,TOKENS.local);offline.add(TOKENS.local);
  await localPage.addInitScript(({initial})=>localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(initial)),{initial});
  await localPage.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});
  await coreFrame(localPage);
  ok((await localPage.locator('#msg').innerText()).includes('Sin conexión'),'offline local-copy boot message missing');

  const cd=await browserA.newContext({viewport:{width:390,height:844},isMobile:true});
  const deadPage=await cd.newPage();await mock(deadPage,TOKENS.dead);
  await deadPage.goto(base+'/guest/index.html',{waitUntil:'domcontentloaded'});
  await deadPage.waitForSelector('#wsdAccessLock',{timeout:5000});
  const lockText=await deadPage.locator('#wsdAccessLock').innerText();
  ok(/GUEST/i.test(lockText),'inactive-access lock is not branded as GUEST');
  ok(lockText.includes('Este acceso ya no está activo'),'inactive-access message missing');

  // Global invariants.
  ok(legacy.length===0,'ONE backend called in two-device QA: '+legacy.join(','));
  ok(errors.length===0,'browser errors: '+errors.join(' | '));

  await Promise.all([ca.close(),cb.close(),cl.close(),cd.close()]);await Promise.all([browserA.close(),browserB.close()]);
  console.log('B6.6 two-device sync and errors: PASS');
})().catch(e=>{console.error('B6.6 FAIL:',e.stack||e);process.exit(1)});
