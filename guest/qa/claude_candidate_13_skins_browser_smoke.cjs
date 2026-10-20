'use strict';
/** Real Chromium smoke of RECOVERED CANDIDATE MEDIA, not production approval.
 * Runs only against temporary local unlisted files. No backend, guests or payments.
 */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process'),{chromium}=require('playwright');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),stage=fs.mkdtempSync(path.join(os.tmpdir(),'guest-claude-browser-')),out=path.join(stage,'candidates');
const ids=Array.from({length:13},(_,i)=>'design-'+String(i+4).padStart(2,'0'));
const types={'.html':'text/html; charset=utf-8','.mp4':'video/mp4','.webm':'video/webm','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.woff':'font/woff','.woff2':'font/woff2','.otf':'font/otf','.ttf':'font/ttf','.svg':'image/svg+xml','.m4a':'audio/mp4','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav'};
let server, browser, failures=[];
async function main(){
 const run=spawnSync(process.execPath,['guest/tools/stage_claude_candidate_media.cjs','--out',out],{cwd:root,encoding:'utf8',maxBuffer:1024*1024*4,timeout:180000});
 assert.equal(run.status,0,'staging failed: '+String(run.stderr).slice(0,1000));
 const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8'));
 assert.equal(manifest.designs.length,13);
 server=http.createServer((req,res)=>{
  let f;try{f=path.resolve(out,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname))}catch{res.writeHead(400).end();return}
  if(!f.startsWith(out+path.sep)){res.writeHead(403).end();return}
  let stat;try{stat=fs.statSync(f)}catch{res.writeHead(404).end();return}
  if(!stat.isFile()){res.writeHead(404).end();return}
  res.setHeader('Content-Type',types[path.extname(f).toLowerCase()]||'application/octet-stream');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Length',stat.size);
  fs.createReadStream(f).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port;
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const targets=[{qa:'full',width:390,height:844},{qa:'reduced',width:320,height:700}];
 for(const id of ids){
  for(const scenario of targets){
   const context=await browser.newContext({viewport:{width:scenario.width,height:scenario.height},reducedMotion:'reduce',serviceWorkers:'block'});
   const page=await context.newPage(),errors=[],badResponses=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:'+port+'/'))badResponses.push(r.status()+' '+r.url().slice(-80))});
   try{
    const url='http://127.0.0.1:'+port+'/'+id+'/index.html?qa='+scenario.qa;
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
    assert.equal(response.status(),200);
    await page.waitForFunction(()=>document.documentElement.dataset.guestReviewFixture!==undefined,{timeout:12000});
    const data=await page.evaluate(()=>{
     const c=document.querySelector('#cover-video source'),d=document.querySelector('#closing-video source');
     const sceneNames=[...document.querySelectorAll('main [data-scene]')].filter(x=>!x.classList.contains('invisible')).map(x=>x.id);
     return {api:typeof window.GUEST_APPLY_CONFIG,variant:document.documentElement.dataset.guestReviewFixture,
      template:document.querySelector('html')?.dataset.skin,cover:c?.getAttribute('src'),closing:d?.getAttribute('src'),
      sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
      ns:document.getElementById('name-1')?.textContent,dt:document.getElementById('cover-date')?.textContent,
      scenes:sceneNames,agenda:document.querySelectorAll('#agenda [role="group"][aria-label="Momentos del día"] button[aria-label]').length,notice:document.getElementById('stage-notice')?.textContent||'',
      covers:document.querySelector('#cover-video')?.readyState||0,
      gallery:document.querySelectorAll('#gallery-items img').length};
    });
    assert.equal(data.api,'function','GUEST_APPLY_CONFIG missing');
    assert.equal(data.variant,scenario.qa,'fixture did not run');
    assert(data.cover?.startsWith('media/')&&data.closing?.startsWith('media/'),'original MP4 references not externalized');
    assert(data.ns==='Lucía'&&data.dt,'common config did not render');
    assert(data.scenes.includes('cover')&&data.scenes.includes('closing'),'key scenes missing');
    assert.equal(data.agenda,scenario.qa==='full'?5:1,'agenda config mismatch');
    assert.equal(data.gallery,scenario.qa==='full'?4:0,'gallery config mismatch');
    assert(data.sw<=data.cw+3,'mobile overflow '+JSON.stringify({sw:data.sw,cw:data.cw}));
    assert.equal(badResponses.length,0,'missing staged media '+badResponses.join(';'));
    assert.equal(errors.length,0,'JS runtime '+errors.join(';'));
    console.log('PASS '+id+' '+scenario.qa+' '+scenario.width+'px: config, scene, cover/closing media paths, agenda, gallery, no overflow or script errors');
   }catch(err){failures.push({id,scenario:scenario.qa,error:String(err.message).slice(0,500),runtimeErrors:errors.slice(0,3),missing:badResponses.slice(0,3)})}
   await context.close();
  }
 }
 if(failures.length){console.error('GUEST BROWSER CANDIDATES FAIL',JSON.stringify(failures,null,2));process.exitCode=1}
 else console.log('PASS all 13 recovered Claude candidates / 26 physical Chromium viewport+fixture smoke checks; offline TEST ONLY, not commercial certification.');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{
 try{await browser?.close()}catch{}
 try{await new Promise(resolve=>server?.close(resolve)||resolve())}catch{}
 fs.rmSync(stage,{recursive:true,force:true});
});
