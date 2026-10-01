const { chromium }=require('playwright');
const fs=require('fs'),path=require('path');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const root=path.resolve(__dirname,'..','..');
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';
const OWNER='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-owner-manager';
const ORDERS='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-orders-admin';

function staticAudit(){
 const html=fs.readFileSync(path.join(root,'guest-orders-admin.html'),'utf8');
 const backend=fs.readFileSync(path.join(root,'guest','backend','guest-orders-admin','index.ts'),'utf8');
 ok(html.includes('guest-orders-admin'),'fulfillment UI is not wired to GUEST orders backend');
 ok(html.includes('weddly_owner_manager_token_v1'),'manager session key missing');
 ok(html.includes("action:'prepare'"),'prepare action missing');
 ok(html.includes("action:'set_invitation_url'"),'invitation URL action missing');
 ok(html.includes("action:'set_status',status:'ready'"),'ready action missing');
 ok(html.includes("action:'send_delivery'"),'delivery action missing');
 ok(!/ONE Partner|STUDIO|one\.html|partner\.html/i.test(html),'foreign product dependency in fulfillment UI');
 for(const needle of ["action==='list'","action==='prepare'","action==='set_status'","action==='set_invitation_url'","action==='send_delivery'","managerContext"]){
   ok(backend.includes(needle),'fulfillment backend missing '+needle);
 }
 ok(backend.includes("guest_personalization_status:'delivered'"),'delivery does not freeze delivered status');
 ok(backend.includes("if(String(l.metadata?.guest_personalization_status||'')!=='ready')"),'delivery is not gated by ready status');
 ok(backend.includes("if(x.origin!==origin())"),'invitation URL origin validation missing');
 ok(backend.includes("if(!x.pathname.startsWith('/guest/'))"),'invitation URL GUEST path validation missing');
}

function sample(status='details_received'){
 return {
   id:'lic_guest_b84',status,edition:'signature',buyerEmail:'pareja@example.com',
   couple1:'Ana',couple2:'Luis',weddingDate:'2027-06-19',design:'Signature 02',
   createdAt:'2026-10-01T06:00:00Z',detailsAt:'2026-10-01T06:05:00Z',
   preparingAt:status==='preparing'||status==='ready'||status==='delivered'?'2026-10-01T06:10:00Z':null,
   readyAt:status==='ready'||status==='delivered'?'2026-10-01T06:20:00Z':null,
   deliveredAt:status==='delivered'?'2026-10-01T06:30:00Z':null,
   invitationUrl:'',notes:'Sin cambios extra',extraEvents:'Preboda viernes'
 };
}
async function setup(page){
 let state='details_received',url='',seen=[];
 await page.addInitScript(()=>{window.__opened='';window.open=(u)=>{window.__opened=String(u);return null};window.confirm=()=>true});
 await page.route(OWNER,async route=>{
   const b=route.request().postDataJSON()||{};seen.push({api:'owner',...b});
   if(b.action==='login')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,managerToken:'v1.qa.manager',expiresAt:'2026-11-01T00:00:00Z'})});
   return route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({ok:false,error:'unexpected_owner'})});
 });
 await page.route(ORDERS,async route=>{
   const b=route.request().postDataJSON()||{};seen.push({api:'orders',...b});
   const auth=route.request().headers()['x-weddly-manager']||'';
   if(auth!=='v1.qa.manager')return route.fulfill({status:403,contentType:'application/json',body:JSON.stringify({ok:false,error:'manager_required'})});
   if(b.action==='status')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,expiresAt:'2026-11-01T00:00:00Z'})});
   if(b.action==='list'){const x=sample(state);x.invitationUrl=url;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,orders:[x]})})}
   if(b.action==='prepare'){state='preparing';return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,weddingId:'wed_b84',memberToken:'t'.repeat(64),prepUrl:base+'/guest/index.html?access='+('t'.repeat(64))+'&prep=1'})}
   if(b.action==='set_invitation_url'){url=b.invitationUrl||'';return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,invitationUrl:url})})}
   if(b.action==='set_status'&&b.status==='ready'){state='ready';return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,status:'ready'})})}
   if(b.action==='send_delivery'){state='delivered';return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,status:'delivered',deliveredAt:'2026-10-01T06:30:00Z'})})}
   return route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({ok:false,error:'unexpected'})});
 });
 return {seen,getState:()=>state,getUrl:()=>url};
}
async function noOverflow(page,label){
 const x=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body.scrollWidth}));
 ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,label+' horizontal overflow '+JSON.stringify(x));
}
async function mobileFlow(browser){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage(),m=await setup(page);
 await page.goto(base+'/guest-orders-admin.html',{waitUntil:'domcontentloaded'});
 ok(!(await page.locator('#auth').evaluate(el=>el.classList.contains('hidden'))),'auth should be visible without session');
 await page.locator('#master').fill('WSD-QA-MASTER');
 await page.locator('#login').click();
 await page.waitForSelector('.order');
 ok(await page.locator('.order h2').innerText()==='Ana & Luis','order names missing');
 ok((await page.locator('.pill.status').innerText())==='Datos recibidos','initial order status wrong');
 ok(await page.locator('.prepare').isEnabled(),'prepare should be enabled after details');
 ok(!(await page.locator('.deliver').isEnabled()),'delivery enabled before ready');
 await noOverflow(page,'fulfillment mobile');

 await page.locator('.prepare').click();
 await page.waitForFunction(()=>window.__opened.includes('/guest/index.html?access='));
 ok(m.getState()==='preparing','prepare did not advance state');
 await page.waitForFunction(()=>document.querySelector('.pill.status')?.textContent.includes('En preparación'));

 const invite=base+'/guest/invitations/custom.html';
 await page.locator('.inviteUrl').fill(invite);
 await page.locator('.saveUrl').click();
 await page.waitForFunction(()=>document.querySelector('.inviteUrl')?.value.includes('/guest/invitations/custom.html'));
 ok(m.getUrl()===invite,'invitation URL not preserved');

 await page.locator('.markReady').click();
 await page.waitForFunction(()=>document.querySelector('.pill.status')?.textContent.includes('Lista para entregar'));
 ok(m.getState()==='ready','ready status not saved');
 ok(await page.locator('.deliver').isEnabled(),'delivery not enabled when ready');

 await page.locator('.deliver').click();
 await page.waitForFunction(()=>document.querySelector('.pill.status')?.textContent.includes('Entregada'));
 ok(m.getState()==='delivered','delivery did not finalize');
 ok(!(await page.locator('.prepare').isEnabled()),'prepare still enabled after delivery');
 ok(!(await page.locator('.saveUrl').isEnabled()),'URL editing still enabled after delivery');
 const orderCalls=m.seen.filter(x=>x.api==='orders');
 for(const a of ['list','prepare','set_invitation_url','set_status','send_delivery'])ok(orderCalls.some(x=>x.action===a),'missing live UI action '+a);
 await ctx.close();
}
async function desktop(browser){
 const ctx=await browser.newContext({viewport:{width:1366,height:900}});
 const page=await ctx.newPage();await setup(page);
 await page.addInitScript(()=>localStorage.setItem('weddly_owner_manager_token_v1','v1.qa.manager'));
 await page.goto(base+'/guest-orders-admin.html',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.order');
 await noOverflow(page,'fulfillment desktop');
 ok((await page.locator('.summary .metric').count())===4,'summary metrics missing');
 await ctx.close();
}
(async()=>{
 staticAudit();
 const browser=await chromium.launch({headless:true});
 await mobileFlow(browser);
 await desktop(browser);
 await browser.close();
 console.log('B8.4 fulfillment admin flow: PASS');
})().catch(e=>{console.error('B8.4 FAIL:',e.stack||e);process.exit(1)});