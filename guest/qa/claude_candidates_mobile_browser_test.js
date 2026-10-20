'use strict';
const {chromium}=require('playwright');
const fs=require('fs'),assert=require('assert/strict'),path=require('path');
const stage=process.env.GUEST_CLAUDE_STAGE_DIR||'/tmp/guest-claude-designs-stage';
const manifest=JSON.parse(fs.readFileSync(path.join(stage,'GUEST_DESIGN_STAGE_MANIFEST.json'),'utf8'));
const origin=process.env.GUEST_CLAUDE_PREVIEW_ORIGIN||'http://127.0.0.1:4183';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage','--no-sandbox']});
 let passed=0,failed=[];
 try{
  for(const d of manifest.designs){
   const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
   const page=await ctx.newPage(),errs=[],notFound=[];
   page.on('pageerror',e=>errs.push(e.message));
   page.on('response',r=>{if(r.status()>=400&&!r.url().includes('favicon'))notFound.push(r.status()+':'+r.url().slice(-110))});
   try{
    await page.goto(origin+d.href+'?qa=full',{waitUntil:'domcontentloaded',timeout:25000});
    await page.waitForFunction(()=>typeof window.GUEST_APPLY_CONFIG==='function',null,{timeout:18000});
    await page.waitForSelector('#cover',{timeout:6000});
    const s=await page.evaluate(()=>({width:document.documentElement.scrollWidth,inner:innerWidth,name:document.querySelector('#name-1')?.textContent?.trim(),scenes:document.querySelectorAll('section').length,cover:!!document.querySelector('#cover-video'),final:!!document.querySelector('#closing-video'),mode:document.documentElement.dataset.guestReviewFixture}));
    assert(s.name,'Missing dynamic fixture names '+d.id);
    assert(s.cover,'Missing video cover '+d.id);
    assert(s.width<=s.inner+14,'Horizontal overflow mobile '+d.id+' '+s.width+'/'+s.inner);
    assert(s.scenes>=5,'Missing standard invitation scenes '+d.id+' '+s.scenes);
    assert.equal(s.mode,'full','Full questionnaire test fixture was not applied '+d.id);
    assert.equal(errs.length,0,'JS errors '+d.id+' '+errs.join(' | '));
    assert.equal(notFound.length,0,'Asset HTTP failures '+d.id+' '+notFound.join(' | '));
    // Real delivery injects an order-specific config; it must override every demo name.
    const unique='QA_'+d.id.replaceAll('-','_');
    const config={
      schemaVersion:'guest-invitation-config-v1',locale:'es',
      template:{id:d.id,version:d.version,typographyVariant:'classic'},
      couple:{name1:unique,name2:'PAREJA_PRUEBA'},
      wedding:{date:'2027-09-18',time:'19:30',coverPlace:'Lugar de prueba'},
      cover:{showPlace:true,showTime:false},countdown:{enabled:false},
      story:{enabled:false,textMode:'none',body:'',photo:null},
      locations:{mode:'shared',items:[{type:'ceremony',name:'Sede de pruebas',time:'18:30',address:'Murcia',mapsUrl:null}],dressCode:{enabled:false}},
      agenda:{enabled:true,moments:[{time:'18:30',label:'Ceremonia'},{time:'20:00',label:'Cena'}]},
      practical:{bus:{enabled:false},accommodation:{enabled:false},gift:{enabled:false},playlist:{enabled:false}},
      gallery:{enabled:false,photos:[]},
      rsvp:{ctaLabel:'Confirmar prueba',route:'https://example.test/rsvp?rt=QA-ONLY'},
      closing:{line:'Nos vemos en la prueba'}
    };
    const payload=await page.evaluate(cfg=>{
       const response=window.GUEST_APPLY_CONFIG(cfg);
       return{response,n1:document.querySelector('#name-1')?.textContent,n2:document.querySelector('#name-2')?.textContent,
       rsvp:document.querySelector('#rsvp-link')?.getAttribute('href'),rsvpLabel:document.querySelector('#rsvp-link')?.textContent,
       scenes:[...document.querySelectorAll('[data-bg]:not(.invisible)')].length,
       hiddenStory:document.querySelector('#story')?.classList.contains('invisible')};
    },config);
    assert.equal(payload.n1,unique,'Customer names did not overwrite test/demo '+d.id);
    assert.equal(payload.n2,'PAREJA_PRUEBA','Partner name not personalized '+d.id);
    assert.equal(payload.rsvpLabel,'Confirmar prueba','RSVP CTA not set from order '+d.id);
    assert.equal(payload.rsvp,'https://example.test/rsvp?rt=QA-ONLY','RSVP destination from order lost '+d.id);
    assert.equal(payload.response?.id,d.id,'Wrong template adapter on personalisation '+d.id);
    assert(payload.scenes>=1,'No scene after custom questionnaire with optional blocks off '+d.id);
    assert.equal(errs.length,0,'JS errors after personalization '+d.id+' '+errs.join(' | '));
    passed++;console.log('PASS',d.id,d.name,'390px mobile | hero | full + minimal personalized order | RSVP CTA | no errors/overflow');
   }catch(e){failed.push({id:d.id,error:e.message});console.error('FAIL',d.id,e.message)}
   finally{await ctx.close()}
  }
 }finally{await browser.close()}
 if(failed.length)throw Error('GUEST_CLAUDE_MOBILE_QA_FAIL:'+JSON.stringify(failed));
 console.log('PASS',passed,'of',manifest.designs.length,'Claude designs on mobile browser. TEST ONLY; NOT VISUAL APPROVAL OR LIVE PURCHASE.');
})().catch(e=>{console.error(e);process.exit(1)});
