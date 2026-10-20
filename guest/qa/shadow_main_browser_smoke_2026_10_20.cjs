#!/usr/bin/env node
'use strict';
// Browser exercise of unmerged GUEST-only shadow of public main. Intercepts all
// external network; no client accounts, messages, secrets, payment or write calls.
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const root=process.env.GUEST_SHADOW_ROOT;
if(!root||!path.isAbsolute(root))throw Error('GUEST_SHADOW_ROOT missing');
const binary=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
if(!binary)throw Error('No Chrome/Chromium on disposable QA runner');
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://127.0.0.1');
  let p=decodeURIComponent(u.pathname).replace(/^\//,'')||'index.html';
  if(p.endsWith('/'))p+='index.html';
  const full=path.resolve(root,p);
  if(!full.startsWith(root+path.sep)){res.writeHead(403);return res.end('blocked')}
  fs.readFile(full,(e,content)=>{
   if(e){res.writeHead(404);return res.end('not found')}
   res.writeHead(200,{'Content-Type':types[path.extname(full)]||'application/octet-stream','Cache-Control':'no-store'});
   res.end(content);
  });
 }catch{res.writeHead(400);res.end('bad request')}
});
async function check(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:binary,args:['--no-sandbox']});
 try{
  for(const [label,viewport] of [['desktop',{width:1280,height:800}],['mobile',{width:393,height:852}]]){
   const ctx=await browser.newContext({viewport,locale:'es-ES',serviceWorkers:'block'});
   const blocked=[];
   await ctx.route('**/*',route=>{
     if(route.request().url().startsWith(origin+'/'))return route.continue();
     blocked.push(route.request().url().split('?')[0]);
     return route.abort('blockedbyclient');
   });
   const page=await ctx.newPage();
   await page.goto(origin+'/guest.html',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('article.design-card.individual').count(),15,'incorrect count of candidate designs');
   assert((await page.locator('.topnav .buy').textContent()).includes('Próxima apertura'),'unexpected payment CTA');
   assert.equal(await page.locator('a[href*="guest-checkout"]').count(),0,'catalogue unexpectedly points to checkout');
   assert((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'),'noindex dropped');
   await page.goto(origin+'/guest-checkout.html',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('#consent').isDisabled(),true,'checkout without template opened consent');
   assert((await page.locator('#state').innerText()).includes('No se puede iniciar un pago'),'unsafe checkout without design');
   await page.goto(origin+'/guest-checkout.html?catalog_template=%2Fbad',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('#consent').isDisabled(),true,'malformed design enabled payment');
   assert((await page.locator('#state').innerText()).includes('El diseño solicitado no es válido'),'invalid design not refused');
   await page.goto(origin+'/guest/access.html',{waitUntil:'domcontentloaded'});
   await page.locator('#code').waitFor({state:'visible',timeout:5000});
   assert.equal(await page.locator('#activate').isVisible(),true,'GUEST license activation missing');
   await page.goto(origin+'/guest/guests-rsvp-operations-live.html',{waitUntil:'domcontentloaded'});
   await page.getByText('Este acceso ya no está activo',{exact:false}).waitFor({state:'visible',timeout:8000});
   assert.equal(await page.locator('script[src^="https://js.stripe.com"]').count(),0,'Stripe library injected unexpectedly');
   assert(!blocked.some(x=>x.includes('js.stripe.com')),'Live Stripe loaded');
   console.log(JSON.stringify({device:label,status:'PASS',checks:['15-design preview closed','no checkout without design','malformed design rejected','GUEST access code form','unauthorized operations fail-closed'],externalCallsBlocked:blocked.length,sale:'NO_GO'}));
   await ctx.close();
  }
 }finally{await browser.close();server.close()}
}
check().catch(e=>{console.error('GUEST_SHADOW_BROWSER_FAIL',e.stack||String(e));server.close();process.exit(1)});
