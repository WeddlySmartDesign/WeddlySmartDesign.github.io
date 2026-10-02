import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base=process.env.GOLD01_BASE_URL || 'http://127.0.0.1:8765/guest/gold-01-gate-candidate.html';
const out=process.env.GOLD01_ARTIFACT_DIR || 'guest/qa/gold01-artifacts';
await fs.mkdir(out,{recursive:true});

const viewports=[
  ['360x800',360,800],['375x812',375,812],['390x844',390,844],
  ['412x915',412,915],['430x932',430,932],['desktop',1440,1000]
];
const variants=[
  ['a','Clara','Mateo',3],
  ['b','Alejandra','Guillermo',4]
];
const failures=[];
const report={started:new Date().toISOString(),cases:[],target:base};

function ok(cond,msg){if(!cond)throw new Error(msg)}
function safeName(s){return s.replace(/[^a-z0-9_-]+/gi,'-')}

async function getGuestFrame(page){
  await page.waitForSelector('iframe#gate',{timeout:15000});
  await page.waitForFunction(()=>document.querySelector('iframe#gate')?.contentWindow?.__GOLD01_GATE,{timeout:20000});
  const frame=page.frames().find(f=>/gold-01-qa-candidate\.html/.test(f.url()));
  if(!frame)throw new Error('guest iframe not found');
  await frame.waitForFunction(()=>!!window.__GOLD01_GATE,{timeout:15000});
  await frame.evaluate(()=>document.fonts?.ready);
  return frame;
}

const browser=await chromium.launch({headless:true});
try{
  for(const [variant,p1,p2,eventCount] of variants){
    for(const [vpName,width,height] of viewports){
      const context=await browser.newContext({viewport:{width,height},acceptDownloads:true});
      const page=await context.newPage();
      const consoleErrors=[],pageErrors=[],localRequestFailures=[],localHttpErrors=[];
      page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
      page.on('pageerror',e=>pageErrors.push(String(e)));
      page.on('requestfailed',req=>{if(req.url().startsWith('http://127.0.0.1:8765/'))localRequestFailures.push(req.url())});
      page.on('response',res=>{if(res.url().startsWith('http://127.0.0.1:8765/')&&res.status()>=400)localHttpErrors.push(`${res.status()} ${res.url()}`)});
      const rec={variant,viewport:vpName,width,height,status:'PASS',checks:{}};
      try{
        await page.goto(`${base}?demo=${variant==='b'?2:1}`,{waitUntil:'domcontentloaded',timeout:30000});
        const frame=await getGuestFrame(page);
        await page.waitForTimeout(1200);

        const identity=await frame.evaluate(()=>({
          gate:window.__GOLD01_GATE?.variant,
          title:document.title,
          names:document.querySelector('.hero-names')?.textContent?.replace(/\s+/g,' ').trim(),
          panels:document.querySelectorAll('.intro-panel').length,
          shutters:document.querySelectorAll('.gate-closing-shutters i').length,
          interlude:!!document.querySelector('.gate-interlude'),
          events:document.querySelectorAll('.timeline .event').length,
          copySize:parseFloat(getComputedStyle(document.querySelector('.copy')).fontSize),
          enterHeight:document.getElementById('enter')?.getBoundingClientRect().height||0,
          submitHeight:document.querySelector('.submit')?.getBoundingClientRect().height||0
        }));
        ok(identity.gate===variant,'wrong active variant');
        ok(identity.names?.includes(p1)&&identity.names?.includes(p2),'pair identity not applied');
        ok(identity.panels===3,'opening must have exactly three editorial shutters');
        ok(identity.shutters===3,'closing must mirror three-shutter language');
        ok(identity.interlude,'editorial photo bridge missing');
        ok(identity.events===eventCount,`expected ${eventCount} program events, got ${identity.events}`);
        ok(identity.copySize>=15.5,'body copy below 16px visual target');
        ok(identity.enterHeight>=44&&identity.submitHeight>=44,'primary touch target below 44px');
        rec.checks.identity=identity;

        const overflowBefore=await frame.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
        ok(overflowBefore<=1,`horizontal overflow before open: ${overflowBefore}px`);

        if(vpName==='390x844')await page.screenshot({path:path.join(out,`${variant}-01-opening-390x844.png`),fullPage:false});

        await frame.locator('#enter').click();
        if(vpName==='390x844'){
          await page.waitForTimeout(750);
          await page.screenshot({path:path.join(out,`${variant}-01b-opening-motion-0750-390x844.png`),fullPage:false});
          await page.waitForTimeout(850);
          await page.screenshot({path:path.join(out,`${variant}-01c-opening-motion-1600-390x844.png`),fullPage:false});
          await page.waitForTimeout(2250);
        }else{
          await page.waitForTimeout(3850);
        }
        const opened=await frame.evaluate(()=>({
          done:document.getElementById('intro')?.classList.contains('done'),
          inert:document.getElementById('invitation')?.inert,
          active:document.activeElement?.className||''
        }));
        ok(opened.done===true,'opening did not complete');
        ok(opened.inert===false,'main remained inert after opening');
        rec.checks.opening=opened;

        const overflowAfter=await frame.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
        ok(overflowAfter<=1,`horizontal overflow after open: ${overflowAfter}px`);
        if(vpName==='390x844')await page.screenshot({path:path.join(out,`${variant}-02-hero-390x844.png`),fullPage:false});
        if(variant==='a'&&vpName==='desktop'){
          await page.screenshot({path:path.join(out,'a-desktop-01-hero-1440x1000.png'),fullPage:false});
          for(const [n,sel] of [['02-interlude','.gate-interlude'],['03-venue','.venue'],['04-program','.program'],['05-rsvp','.rsvp']]){
            await frame.locator(sel).scrollIntoViewIfNeeded();await page.waitForTimeout(650);
            await page.screenshot({path:path.join(out,`a-desktop-${n}-1440x1000.png`),fullPage:false});
          }
          await frame.locator('.closing').scrollIntoViewIfNeeded();await page.waitForTimeout(1550);
          await page.screenshot({path:path.join(out,'a-desktop-06-closing-1440x1000.png'),fullPage:false});
        }

        if(vpName==='390x844'){
          for(const [n,sel] of [['03-interlude','.gate-interlude'],['04-venue','.venue'],['05-program','.program'],['06-rsvp','.rsvp']]){
            await frame.locator(sel).scrollIntoViewIfNeeded();await page.waitForTimeout(900);
            await page.screenshot({path:path.join(out,`${variant}-${n}-390x844.png`),fullPage:false});
          }
          await frame.locator('#guest-name').fill('Invitada de prueba');
          await frame.locator('input[name=attendance][value=yes]').check();
          ok(!(await frame.locator('#meal-fields').isHidden()),'meal fields did not appear for yes');
          await frame.locator('.submit').click();
          await frame.locator('#done').waitFor({state:'visible'});
          ok(await frame.locator('.rsvp').evaluate(el=>el.classList.contains('gate-complete')),'RSVP visual progress did not complete');

          const downloadPromise=page.waitForEvent('download');
          await frame.locator('#calendar').click();
          const download=await downloadPromise;
          const p=await download.path();
          const ics=p?await fs.readFile(p,'utf8'):'';
          ok(ics.includes(`Boda de ${p1} y ${p2}`),'calendar download did not use active pair');
          ok(ics.includes('BEGIN:VCALENDAR'),'calendar payload invalid');
          rec.checks.calendar={filename:download.suggestedFilename(),valid:true};

          await frame.locator('.closing').scrollIntoViewIfNeeded();
          await page.waitForTimeout(450);
          await page.screenshot({path:path.join(out,`${variant}-06b-closing-motion-0450-390x844.png`),fullPage:false});
          await page.waitForTimeout(1100);
          const closing=await frame.evaluate(()=>({
            gateCloseIn:document.querySelector('.closing')?.classList.contains('gate-close-in'),
            final:document.querySelector('.final-text')?.textContent?.trim(),
            ctaHidden:document.querySelector('.gate-closing-cta')?.hidden
          }));
          ok(closing.gateCloseIn,'dedicated closing reveal did not trigger');
          ok(closing.ctaHidden===true,'closing RSVP CTA must hide after confirmation');
          rec.checks.closing=closing;
          await page.screenshot({path:path.join(out,`${variant}-07-closing-390x844.png`),fullPage:false});
        }

        ok(pageErrors.length===0,`page errors: ${pageErrors.join(' | ')}`);
        ok(localRequestFailures.length===0,`local request failures: ${localRequestFailures.join(' | ')}`);
        ok(localHttpErrors.length===0,`local HTTP errors: ${localHttpErrors.join(' | ')}`);
        rec.checks.consoleErrors=consoleErrors;
      }catch(e){
        rec.status='FAIL';rec.error=String(e?.stack||e);failures.push(`${variant}/${vpName}: ${e.message||e}`);
      }finally{
        report.cases.push(rec);
        await context.close();
      }
    }
  }

  // Decline path, keyboard activation, and reduced-motion contract.
  {
    const context=await browser.newContext({viewport:{width:390,height:844}});
    const page=await context.newPage();await page.goto(base+'?demo=1',{waitUntil:'domcontentloaded'});
    const frame=await getGuestFrame(page);
    await frame.locator('#enter').focus();await frame.locator('#enter').press('Enter');await page.waitForTimeout(3850);
    await frame.locator('#guest-name').fill('Invitado de prueba');
    await frame.locator('input[name=attendance][value=no]').check();
    ok(await frame.locator('#meal-fields').isHidden(),'meal fields remain visible after decline');
    await frame.locator('.submit').click();await frame.locator('#done').waitFor({state:'visible'});
    report.keyboardAndDecline='PASS';await context.close();
  }
  {
    const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
    const page=await context.newPage();await page.goto(base+'?demo=2',{waitUntil:'domcontentloaded'});
    const frame=await getGuestFrame(page);await frame.locator('#enter').click();await page.waitForTimeout(150);
    const reducedOk=await frame.evaluate(()=>document.getElementById('intro')?.classList.contains('done')&&!document.getElementById('invitation')?.inert);
    ok(reducedOk,'reduced-motion opening did not complete immediately');
    await frame.locator('.closing').scrollIntoViewIfNeeded();await page.waitForTimeout(100);
    await page.screenshot({path:path.join(out,'b-08-reduced-motion-closing-390x844.png'),fullPage:false});
    report.reducedMotion='PASS';await context.close();
  }
}catch(e){
  failures.push(`global: ${e.message||e}`);
}finally{
  report.finished=new Date().toISOString();
  report.status=failures.length?'FAIL':'PASS';
  report.failures=failures;
  await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));
  await browser.close();
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('GOLD 01 visual gate functional QA: PASS');
