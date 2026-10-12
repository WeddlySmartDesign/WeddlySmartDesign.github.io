#!/usr/bin/env node
'use strict';
/* D03 PRE-SALE reviewer screenshot acceptance.
 * Builds source from immutable master; opens the same Cloudflare-stage HTML
 * with opt-in /?qa=full and /?qa=reduced fixtures. Does NOT create orders.
 * Outputs evidence only. No screenshot can certify owner artistic acceptance. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const root=path.resolve(process.argv[2]||''),out=path.resolve(process.argv[3]||'');
if(!root||!out||!fs.existsSync(root))throw Error('Usage: node test.cjs STAGED_DIST OUTPUT_DIR');
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
 let u;try{u=new URL(req.url||'/', 'http://localhost')}catch{res.writeHead(400).end();return}
 const name=path.resolve(root,'.'+decodeURIComponent(u.pathname));
 if(name!==root&&!name.startsWith(root+path.sep)){res.writeHead(403).end();return}
 let stat;try{stat=fs.statSync(name)}catch{res.writeHead(404).end();return}
 if(!stat.isFile()){res.writeHead(404).end();return}
 res.writeHead(200,{'content-type':types[path.extname(name)]||'application/octet-stream','cache-control':'no-store'});
 fs.createReadStream(name).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const report={type:'D03 QAFULL browser, NOT commercial nor authenticated E2E',checkedAt:new Date().toISOString(),cases:[]};
 try{
  for(const width of [320,390,430]){
   for(const mode of ['full','reduced']){
    const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const url=origin+'/guest/catalog-assets/design-03/1.0.0/index.html?qa='+mode;
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:35000});
    await page.waitForFunction(expected=>document.documentElement.dataset.guestReviewFixture===expected,mode,{timeout:15000});
    await page.waitForTimeout(500);
    // Media in the real renderer are loaded lazily. View the original scenes
    // before asserting naturalWidth; offscreen pictures are intentionally deferred.
    if(mode==='full'){
      for(const sec of ['story','locations','gallery']){
        await page.locator('#'+sec).scrollIntoViewIfNeeded();
      }
      await page.waitForTimeout(500);
    }
    const data=await page.evaluate(()=>{
      const sel=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
      const visible=s=>{const e=sel(s);return !!e&&!e.classList.contains('invisible')&&getComputedStyle(e).display!=='none'};
      const rect=s=>{const e=sel(s);if(!e)return null;let r=e.getBoundingClientRect();return{top:r.top,bottom:r.bottom}};
      return {viewport:innerWidth,pageWidth:document.documentElement.scrollWidth,
       storyImage:visible('#story-photo')&&sel('#story-photo').naturalWidth>0,
       placeImage:!!sel('#d03-location-photo img')&&sel('#d03-location-photo img').naturalWidth>0,
       places:all('#location-items .location').length,placeLinks:all('#location-items .link').length,
       moments:all('#agenda .moment').length,
       practical:all('#practical .practical-item').length,
       gallery:visible('#gallery'),galleryImages:all('#gallery-items img').length,
       galleryLoaded:all('#gallery-items img').every(e=>e.complete&&e.naturalWidth>0),
       arrows:all('#locations .link,#practical .link').map(e=>getComputedStyle(e,'::after').content),
       boxes:all('#practical .practical-item').map(e=>getComputedStyle(e).backgroundColor),
       timeline:getComputedStyle(sel('#agenda .agenda-list'),'::before').content,
       rhombi:all('#agenda .moment').map(e=>getComputedStyle(e,'::before').content),
       birdSpace:rect('#practical .section-kicker').top-rect('#practical').top
      };
    });
    console.log('D03 scene QA',width,mode,JSON.stringify(data),'errors=',errors.join('|'));
    assert.equal(errors.length,0,'JavaScript errors: '+errors.join(' | '));
    assert.equal(data.pageWidth<=width,true,'horizontal overflow');
    assert.equal(data.places,mode==='full'?2:1);
    assert.equal(data.placeLinks,mode==='full'?4:2);
    assert.equal(data.moments,mode==='full'?5:1);
    assert.equal(data.practical,mode==='full'?4:0);
    assert.equal(data.storyImage,mode==='full');
    assert.equal(data.placeImage,mode==='full');
    assert.equal(data.gallery,mode==='full');
    assert.equal(data.galleryImages,mode==='full'?4:0);
    assert.equal(data.galleryLoaded,true);
    assert.ok(data.arrows.every(a=>a==='none'||a==='normal'),'forbidden arrow decorations');
    assert.ok(data.boxes.every(c=>c==='rgba(0, 0, 0, 0)'||c==='transparent'),'rectangular practical backgrounds');
    assert.ok(data.timeline==='none'||data.timeline==='normal','timeline reappeared');
    assert.ok(data.rhombi.every(c=>c==='none'||c==='normal'),'rhombi reappeared');
    if(mode==='full')assert.ok(data.birdSpace>=180,'practical heading intrudes on painted birds');
    if(width===390&&mode==='full'){
      for(const section of ['story','locations','agenda','practical','gallery']){
       let el=page.locator('#'+section);
       await el.scrollIntoViewIfNeeded();
       await el.screenshot({path:path.join(out,'limoneros_v4_'+section+'_390.png'),animations:'disabled',timeout:25000});
      }
    }
    report.cases.push({width,mode,pass:true,data,jsErrors:errors});
    await page.close();
   }
  }
 }finally{await browser.close()}
 fs.writeFileSync(path.join(out,'limoneros_v4_browser_acceptance.json'),JSON.stringify(report,null,2)+'\n');
 console.log('PASS',report.cases.length,'D03 real Chromium cases, 5 images 390px, QA only');
})().catch(e=>{console.error('FAIL D03 Visual QA:',e.stack||e);process.exitCode=1}).finally(()=>server.close());
