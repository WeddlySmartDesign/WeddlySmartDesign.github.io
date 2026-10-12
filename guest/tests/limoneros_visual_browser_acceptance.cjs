#!/usr/bin/env node
'use strict';
/* D03 PRE-SALE reviewer screenshot acceptance.
 * Builds source from immutable master; opens the same Cloudflare-stage HTML
 * with explicit synthetic-image full, reduced and no-gallery fixtures. Does NOT create orders.
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
 const report={type:'D03 SYNTHETIC MEDIA browser, NOT author-photo preview / commercial / authenticated E2E',checkedAt:new Date().toISOString(),cases:[]};
 try{
  for(const width of [320,390,430]){
   for(const mode of ['full','reduced','without-gallery']){
    const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const url=origin+'/guest/catalog-assets/design-03/1.0.0/index.html?qa='+mode;
    const rich=mode!=='reduced',hasGallery=mode==='full';
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
       storyPhotoHeight:Math.round(sel('#story-photo').getBoundingClientRect().height),
       storyPhotoFit:sel('#story-photo').dataset.fit,
       storyMask:getComputedStyle(sel('#story-photo')).maskImage,
       storyShadow:getComputedStyle(sel('#story-photo')).boxShadow,
       storyRadius:getComputedStyle(sel('#story-photo')).borderRadius,
       placeImage:!!sel('#d03-location-photo img')&&sel('#d03-location-photo img').naturalWidth>0,
       places:all('#location-items .location').length,placeLinks:all('#location-items .link').length,
       venueLabels:all('#location-items .location .location-type').map(e=>({text:e.textContent,px:parseFloat(getComputedStyle(e).fontSize),weight:Number(getComputedStyle(e).fontWeight),color:getComputedStyle(e).color})),
       venueKicker:(()=>{const e=sel('#locations .section-kicker');const c=getComputedStyle(e);return{px:parseFloat(c.fontSize),weight:Number(c.fontWeight),color:c.color}})(),
       venueActions:all('#location-items .link').map(e=>{const c=getComputedStyle(e);return{text:e.textContent,px:parseFloat(c.fontSize),weight:Number(c.fontWeight),background:c.backgroundColor,border:parseFloat(c.borderTopWidth),radius:parseFloat(c.borderTopLeftRadius),target:e.href}}),
       placeImageMask:sel('#d03-location-photo img')?getComputedStyle(sel('#d03-location-photo img')).maskImage:'none',
       placeImageShadow:sel('#d03-location-photo img')?getComputedStyle(sel('#d03-location-photo img')).boxShadow:'none',
       moments:all('#agenda .moment').length,
       practical:all('#practical .practical-item').length,
       practicalArt:all('#practical .practical-item').map(e=>{
         const name=e.querySelector('.practical-title');
         const r=e.getBoundingClientRect();
         const links=[...e.querySelectorAll('a')].map(a=>{const ar=a.getBoundingClientRect();return {label:a.textContent,height:ar.height,href:a.href}});
         return {x:r.x,width:r.width,font:getComputedStyle(name).fontFamily,px:parseFloat(getComputedStyle(name).fontSize),background:getComputedStyle(e).backgroundColor,links}
       }),
       gallery:visible('#gallery'),galleryImages:all('#gallery-items img').length,
       galleryLoaded:all('#gallery-items img').every(e=>e.complete&&e.naturalWidth>0),
       galleryArt:(()=>{
         const g=sel('#gallery'),k=g?.querySelector('.section-kicker'),i=g?.querySelector('#gallery-items img');
         if(!g||!k||!i)return null;
         const c=getComputedStyle(i),gr=g.getBoundingClientRect(),kr=k.getBoundingClientRect();
         return {kickerOffset:kr.top-gr.top,mask:c.maskImage,shadow:c.boxShadow}
       })(),
       galleryFirstLoaded:(()=>{const e=sel('#gallery-items img');return !e||(e.complete&&e.naturalWidth>0)})(),
       gallerySources:all('#gallery-items img').every(e=>!!e.src),
       galleryCarousel:sel('#gallery-items')?{
         display:getComputedStyle(sel('#gallery-items')).display,
         scrollSnap:getComputedStyle(sel('#gallery-items')).scrollSnapType,
         viewport:sel('#gallery-items').clientWidth,
         scrollWidth:sel('#gallery-items').scrollWidth,
         widths:all('#gallery-items img').map(e=>Math.round(e.getBoundingClientRect().width)),
         navDots:all('#gallery .d03-gallery-dot').length,
         selected:all('#gallery .d03-gallery-dot[aria-current="true"]').length,
         hint:sel('#gallery .d03-gallery-nav span')?.textContent||null,
       }:null,
       arrows:all('#locations .link,#practical .link').map(e=>getComputedStyle(e,'::after').content),
       boxes:all('#practical .practical-item').map(e=>getComputedStyle(e).backgroundColor),
       timeline:getComputedStyle(sel('#agenda .agenda-list'),'::before').content,
       rhombi:all('#agenda .moment').map(e=>getComputedStyle(e,'::before').content),
       birdSpace:rect('#practical .section-kicker').top-rect('#practical').top,
       darkEnd:sel('#practical').classList.contains('d03-four-practical-gradient'),
       lastPracticalLinkColor:(()=>{const e=all('#practical .practical-item:last-child .link').at(-1);return e?getComputedStyle(e).color:null})()
      };
    });
    console.log('D03 scene QA',width,mode,JSON.stringify(data),'errors=',errors.join('|'));
    assert.equal(errors.length,0,'JavaScript errors: '+errors.join(' | '));
    assert.equal(data.pageWidth<=width,true,'horizontal overflow');
    assert.equal(data.places,rich?2:1);
    assert.equal(data.placeLinks,rich?4:2);
    assert.ok(data.venueKicker.px>=(width<=360?17:18)&&data.venueKicker.weight>=600,'Nos vemos aquí remains too thin or small');
    assert.ok(data.venueLabels.every(x=>x.px>=(width<=360?17:18)&&x.weight>=600),'Ceremonia / Celebración remain too thin or small');
    assert.ok(data.venueActions.every(x=>x.px>=16&&x.weight>=400&&x.border>=0.9&&x.radius>=20),'CTA must be an elegant, readable, understated touch target');
    assert.ok(data.venueActions.every(x=>x.background==='rgba(255, 249, 239, 0.14)'),'CTA fill must be delicate so the authored art remains dominant');
    assert.ok(data.venueActions.filter(x=>x.text==='Web').length===data.places,'Venue website button should be Web');
    assert.ok(data.venueActions.filter(x=>x.text==='Cómo llegar').length===data.places,'Each venue must keep its own map URL');
    if(rich){
      assert.ok((data.placeImageMask.match(/linear-gradient/g)||[]).length>=2,'Venue photo requires watercolor feathering');
      assert.equal(data.placeImageShadow,'none','Venue photo must not look like a card');
    }
    assert.equal(data.moments,rich?5:1);
    assert.equal(data.practical,rich?4:0);
    if(rich){
      assert.ok(data.practicalArt.every(i=>i.font.includes('GaramondSC')&&i.px>=19),'Práctico subheads must match Ceremony/Celebration with the original GaramondSC, not compete with main scene script');
      assert.ok(data.practicalArt.every(i=>i.background==='rgba(0, 0, 0, 0)'),'No rectangular card backgrounds in practical');
      assert.ok(data.practicalArt.flatMap(i=>i.links).every(l=>l.height>=42),'Practical actions must remain touchable');
      assert.ok(data.practicalArt.flatMap(i=>i.links).every(l=>!(/escuchar playlist/i).test(l.label)),'Do not invent a listening action for a song-request questionnaire');
      assert.equal(data.practicalArt[3].links[0]?.label,'Pedir canción','Music CTA must request a song when mode=guest_request');
      if(width>=390){
        assert.ok(data.practicalArt[1].x-data.practicalArt[0].x>=20,'Practical modules must have alternating editorial composition');
      }
    }
    assert.equal(data.storyImage,rich);
    if(rich){
      assert.equal(data.storyPhotoFit,'crop','QA must test visibly enlarged landscape crop, not unaffected full-fit');
      assert.ok(data.storyPhotoHeight>=270,'Historia photo remains visually too small');
    }
    // Historia art acceptance gate: real template must dissolve rectangular
    // photo edges to the painted background, without a frame or arc.
    if(rich){
      assert.ok((data.storyMask.match(/linear-gradient/g)||[]).length>=2,'Historia lacks independent soft horizontal/vertical edge masks');
      assert.equal(data.storyShadow,'none','Historia photo still looks like a framed card');
      assert.equal(data.storyRadius,'0px','Historia photo has a rounded frame');
    }
    assert.equal(data.placeImage,rich);
    assert.equal(data.gallery,hasGallery);
    assert.equal(data.galleryImages,hasGallery?4:0);
    if(hasGallery){
      assert.equal(data.galleryFirstLoaded,true,'Primary carousel slide image should load when scene enters view');
      assert.equal(data.gallerySources,true,'All optional photos must have a valid source');
    }else assert.equal(data.galleryLoaded,true);
    if(hasGallery){
      assert.ok(data.galleryArt.kickerOffset>=218,'Painted swallows must remain above Gallery title at mobile widths');
      assert.ok((data.galleryArt.mask.match(/linear-gradient/g)||[]).length>=2,'Gallery photos must blend into paper on ALL edges');
      assert.equal(data.galleryArt.shadow,'none','Carousel photo must not have a rectangular card shadow');
      assert.equal(data.galleryCarousel.display,'flex','Gallery must be a horizontal carousel, NOT collage');
      assert.ok(data.galleryCarousel.scrollSnap.includes('mandatory'),'Gallery swipe must snap to one photo');
      assert.ok(data.galleryCarousel.widths.every(x=>Math.abs(x-data.galleryCarousel.viewport)<=2),'Each slide must show one primary photo');
      assert.ok(data.galleryCarousel.scrollWidth>=3.9*data.galleryCarousel.viewport,'All four photos must be independently swipeable');
      assert.equal(data.galleryCarousel.navDots,4,'Visible photo position indicators required');
      assert.equal(data.galleryCarousel.selected,1,'Exactly one selected photo indicator');
    }else{
      assert.equal(data.galleryCarousel.navDots,0,'Disabled gallery must have no stray controls');
    }
    assert.ok(data.arrows.every(a=>a==='none'||a==='normal'),'forbidden arrow decorations');
    assert.ok(data.boxes.every(c=>c==='rgba(0, 0, 0, 0)'||c==='transparent'),'rectangular practical backgrounds');
    assert.ok(data.timeline==='none'||data.timeline==='normal','timeline reappeared');
    assert.ok(data.rhombi.every(c=>c==='none'||c==='normal'),'rhombi reappeared');
    if(rich)assert.ok(data.birdSpace>=180,'practical heading intrudes on painted birds');
    if(mode==='without-gallery'){
      assert.equal(data.darkEnd,true,'dark background safety class missing');
      assert.equal(data.lastPracticalLinkColor,'rgb(255, 248, 237)','last music link invisible against navy');
    }
    if(width===390&&hasGallery){
      const track=page.locator('#gallery-items');
      await page.locator('#gallery .d03-gallery-dot:nth-child(3)').click();
      await page.waitForTimeout(750);
      const move=await track.evaluate(e=>({left:e.scrollLeft,width:e.clientWidth}));
      assert.ok(move.left>move.width*1.75,'Carousel position indicators must navigate to third photo');
      assert.equal(await page.locator('#gallery .d03-gallery-dot[aria-current="true"]').count(),1);
      const select=await page.locator('#gallery .d03-gallery-dot[aria-current="true"]').getAttribute('aria-label');
      assert.equal(select,'Ver foto 3','Third photo indicator must become active');
      await page.locator('#gallery .d03-gallery-dot:first-child').click();
      await page.waitForTimeout(750);
      assert.ok(await track.evaluate(e=>e.scrollLeft<e.clientWidth*.2),'Carousel must return to first photo');
    }
    if(width===390&&rich){
      for(const section of (hasGallery?['story','locations','agenda','practical','gallery']:['practical'])){
       let el=page.locator('#'+section);
       await el.scrollIntoViewIfNeeded();
       await el.screenshot({path:path.join(out,'limoneros_v4_'+section+(hasGallery?'':'_no_gallery')+'_390.png'),animations:'disabled',timeout:25000});
      }
    }
    report.cases.push({width,mode,pass:true,data,jsErrors:errors});
    await page.close();
   }
  }
  // Explicitly exercise the NORMAL-MOTION choreography: the existing visual
  // screenshots use reduced motion and cannot prove the requested entrance.
  {
   const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'no-preference'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+'/guest/catalog-assets/design-03/1.0.0/index.html?qa=full',{waitUntil:'domcontentloaded',timeout:35000});
   await page.waitForFunction(()=>document.documentElement.dataset.guestReviewFixture==='full',{timeout:15000});
   const snapshot=async()=>await page.evaluate(()=>{
     const agenda=document.querySelector('#agenda');
     return {started:agenda.classList.contains('d03-sequence-start'),
       opacities:[...agenda.querySelectorAll('.moment')].map(el=>Number(getComputedStyle(el).opacity)),
       names:[...agenda.querySelectorAll('.moment')].map(el=>getComputedStyle(el).animationName)};
   });
   const initial=await snapshot();
   assert.equal(initial.started,false,'Agenda animation started before scrolling into view');
   await page.evaluate(()=>{
     const a=document.querySelector('#agenda'),r=a.getBoundingClientRect();
     window.scrollTo({top:window.scrollY+r.top-130,behavior:'instant'});
   });
   await page.waitForTimeout(140);
   const start=await snapshot();
   assert.equal(start.started,true,'Agenda scene intersection did not start the sequence');
   assert.ok(start.opacities.slice(1).every(x=>x<0.15),'later moments were visible before their turn');
   await page.screenshot({path:path.join(out,'limoneros_v9_agenda_sequence_start_390.png'),animations:'allow'});
   await page.waitForTimeout(950);
   const middle=await snapshot();
   assert.ok(middle.opacities[0]>.97,'first moment failed to enter');
   assert.ok(middle.opacities[4]<.2,'fifth moment entered too early');
   await page.screenshot({path:path.join(out,'limoneros_v9_agenda_sequence_middle_390.png'),animations:'allow'});
   await page.waitForTimeout(2450);
   const final=await snapshot();
   assert.ok(final.opacities.every(x=>x>.99),'all moments must finish fully visible');
   await page.screenshot({path:path.join(out,'limoneros_v9_agenda_sequence_final_390.png'),animations:'allow'});
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.waitForTimeout(420);
   await page.evaluate(()=>{
     const a=document.querySelector('#agenda'),r=a.getBoundingClientRect();
     window.scrollTo({top:window.scrollY+r.top-130,behavior:'instant'});
   });
   await page.waitForTimeout(140);
   const repeat=await snapshot();
   assert.ok(repeat.opacities[4]<.25,'Agenda sequence must replay after leaving and returning');
   assert.equal(errors.length,0,'Sequence JS must not throw');
   report.agendaSequence={pass:true,motion:'no-preference',start,middle,final,repeat};
   console.log('PASS D03 sequential Agenda reveal + re-entry',JSON.stringify(report.agendaSequence));
   await page.close();
  }
 }finally{await browser.close()}
 fs.writeFileSync(path.join(out,'limoneros_v4_browser_acceptance.json'),JSON.stringify(report,null,2)+'\n');
 console.log('PASS',report.cases.length,'D03 real Chromium cases, 5 images 390px, QA only');
})().catch(e=>{console.error('FAIL D03 Visual QA:',e.stack||e);process.exitCode=1}).finally(()=>server.close());
