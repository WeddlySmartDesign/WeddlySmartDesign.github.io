#!/usr/bin/env node
'use strict';
// Real Chromium visual/DOM contract of stage-only BOTÁNICA edit.
// Does NOT modify master, production, catalog sale status or external services.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
const root=path.resolve(__dirname,'../..');
const destination=process.env.GUEST_STAGE_ROOT;
if(!destination||!path.isAbsolute(destination)||!destination.startsWith('/tmp/'))throw Error('TEST_STAGE_MUST_BE_TEMP');
const sourceDir=path.join(root,'guest/catalog-assets/botanica/14.7/source-chunks');
const manifest=JSON.parse(fs.readFileSync(path.join(sourceDir,'manifest.json'),'utf8'));
const raw=Buffer.concat(manifest.parts.map(name=>fs.readFileSync(path.join(sourceDir,name))));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(sha(raw),'fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a','MASTER SHA altered');
const local=path.join(destination,'guest/catalog-assets/botanica/14.7/index.html');
const published=fs.readFileSync(local,'utf8');
const original=raw.toString('utf8');
const css=fs.readFileSync(path.join(root,'guest/catalog-patches/botanica/14.7/patch.css'),'utf8');
const fragment='<style id="guest-botanica-practical-seam-preview">\n'+css+'\n</style>\n';
assert.equal(published.split('guest-botanica-practical-seam-preview').length,2,'Must inject exactly one style');
assert.equal(published.replace(fragment,''),original,'Any visual change outside CSS patch is forbidden');
assert.equal(published.split('<style id="guest-botanica-practical-seam-preview">').length-1,1);
assert(!/display\s*:\s*none|opacity\s*:\s*0;|filter\s*:\s*blur\(/.test(css),'Patch must not disable film, text or blur opaque panel');
assert(css.includes('.late-world > .film-breath')&&css.includes('min-width:700px'),'Scoped desktop only');

async function main(){
 const browser=await chromium.launch({executablePath:fs.existsSync('/usr/bin/google-chrome')?'/usr/bin/google-chrome':'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const runs=[];
 try{
  for(const [device,width,height] of [['desktop',1440,900],['desktop-small',768,900],['mobile',390,844],['mobile-narrow',320,680]]){
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
    await page.route(/^https?:\/\//,route=>route.abort());
    const failures=[];
    page.on('pageerror',e=>failures.push(String(e?.message||e)));
    await page.goto('file://'+local,{waitUntil:'domcontentloaded',timeout:45000});
    const result=await page.evaluate(()=>{
      const practical=document.getElementById('practical');
      const layer=document.querySelector('.late-world > .film-breath');
      const cover=document.getElementById('cover');
      const finale=document.getElementById('finale');
      const getMask=x=>{const c=getComputedStyle(x);return c.webkitMaskImage||c.maskImage};
      const rect=x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
      return {bodyWidth:document.documentElement.scrollWidth,viewportWidth:window.innerWidth,
        practicalVisible:!practical.hidden,sectionHeight:rect(practical).height,
        practicalText:practical.innerText.slice(0,600),actions:practical.querySelectorAll('a,button').length,
        layerMask:getMask(layer),layerPosition:rect(layer),
        coverMask:getMask(cover),finaleMask:finale?getMask(finale):'not-found',
        layerVideoCount:layer.querySelectorAll('video').length,
        stylePresent:!!document.getElementById('guest-botanica-practical-seam-preview')};
    });
    assert(result.stylePresent,'Patch stylesheet missing');
    assert(result.practicalVisible && result.sectionHeight>100,'Practical section missing');
    assert(result.practicalText.includes('esencial'),'Practical title disappeared');
    assert(result.actions>=1,'Practical clickable actions removed');
    assert(result.layerVideoCount===1,'Moving decorative video was removed');
    assert(result.bodyWidth<=result.viewportWidth+3,'Unexpected horizontal overflow');
    if(width>=700)assert(/radial-gradient/.test(result.layerMask),'Desktop decorative film edge was not masked');
    else assert(result.layerMask==='none','Approved mobile cinematic layer unexpectedly modified');
    assert(!/radial-gradient/.test(result.coverMask),'Cover changed unintentionally');
    if(result.finaleMask!=='not-found')assert(!/radial-gradient/.test(result.finaleMask),'Closing mask unexpectedly changed');
    assert.equal(failures.length,0,'JS errors: '+failures.slice(0,2).join('; '));
    // Screenshot for human visual audit, 4 cases as optional CI artifact.
    await page.locator('#practical').screenshot({path:path.join('/tmp','guest-botanica-practical-'+device+'.png'),animations:'disabled',timeout:30000});
    runs.push({device,width,mask:result.layerMask.startsWith('radial-gradient')?'radial':'none',actions:result.actions,overflow:false,errors:failures.length});
    await page.close();
  }
 }finally{await browser.close()}
 console.log(JSON.stringify({status:'PASS',masterSha:sha(raw),patchedFromExactMaster:true,cssOnly:true,commercialRelease:false,movingFilmKept:true,runs}));
}
main().catch(e=>{console.error('BOTANICA_PRATICAL_VISUAL_TEST_FAIL',e.stack||e);process.exitCode=1;});
