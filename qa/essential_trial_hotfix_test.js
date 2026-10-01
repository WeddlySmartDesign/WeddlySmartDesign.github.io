const fs=require('fs');
const {chromium}=require('playwright-core');
const assert=(v,m)=>{if(!v)throw new Error(m)};
const base='http://127.0.0.1:8765';
const photo='data:image/svg+xml;base64,'+Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="700" height="1000"><rect width="700" height="1000" fill="#d8c8b8"/><circle cx="470" cy="340" r="120" fill="#f6eee8"/><circle cx="300" cy="360" r="110" fill="#e5ddd4"/></svg>').toString('base64');
const fonts=['editorial','romantico','clasico','moderno','caligrafico'];

(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN,args:['--no-sandbox','--disable-dev-shm-usage']});
 fs.mkdirSync('qa-artifacts/essential-hotfix',{recursive:true});

 // Editor: 8 templates, legacy photo-free, 07/08 with photo + five fonts.
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errs=[];page.on('pageerror',e=>errs.push(String(e)));
 await page.goto(base+'/weddly-personalizacion-essential.html',{waitUntil:'networkidle'});
 await page.waitForSelector('.tpl-card');
 assert(await page.locator('.tpl-card').count()===8,'editor exposes 8 Essentials');
 await page.locator('.tpl-card[data-id="e01"]').click();
 await page.waitForTimeout(250);
 assert(await page.locator('#photoSection').evaluate(e=>getComputedStyle(e).display)==='none','legacy Essential photo section hidden');
 await page.evaluate(p=>{state.heroPhoto=p;renderPreview()},photo);
 await page.waitForTimeout(250);
 const legacyHasPhoto=await page.locator('#preview').evaluate(f=>{
   const d=f.contentDocument; if(!d)return false;
   return !![...d.querySelectorAll('img')].find(x=>x.src&&x.src.startsWith('data:image/svg+xml'));
 });
 assert(!legacyHasPhoto,'legacy Essential ignores saved photo');

 for(const tpl of ['e07','e08']){
   await page.locator('.tpl-card[data-id="'+tpl+'"]').click();
   await page.waitForTimeout(350);
   assert(await page.locator('#photoSection').evaluate(e=>getComputedStyle(e).display)!=='none',tpl+' photo section visible');
   assert(await page.locator('#storyPhotoBlock').evaluate(e=>getComputedStyle(e).display)==='none',tpl+' secondary photo hidden');
   await page.fill('#p1','Alejandra');
   await page.fill('#p2','Maximiliano');
   await page.evaluate(p=>{state.heroPhoto=p;renderPreview()},photo);
   for(const font of fonts){
     await page.locator('.font-card[data-id="'+font+'"]').click();
     await page.waitForTimeout(280);
     const m=await page.locator('#preview').evaluate(f=>{
       const d=f.contentDocument,w=f.contentWindow;
       if(!d||!w)return null;
       const root=d.documentElement;
       const body=d.body;
       const names=d.querySelector('.hero-names,.names');
       const r=names?.getBoundingClientRect();
       return {bodyClass:body.className,scroll:root.scrollWidth,width:w.innerWidth,nameRight:r?.right||0,nameX:r?.x||0,text:body.innerText};
     });
     assert(m, tpl+' '+font+' preview exists');
     assert(m.bodyClass.includes('font-'+font),tpl+' '+font+' applied');
     assert(m.scroll<=m.width+1,tpl+' '+font+' no horizontal overflow');
     assert(m.nameX>=-1&&m.nameRight<=m.width+1,tpl+' '+font+' names inside viewport');
     assert(!/WeddlySmartDesign|Weddly Smart Design/i.test(m.text),tpl+' '+font+' no vendor branding');
   }
 }
 assert(errs.length===0,'editor page errors: '+errs.join('; '));
 await page.screenshot({path:'qa-artifacts/essential-hotfix/editor-e08.png',fullPage:true});
 await page.close();

 // Public live fallback: 07/08 render with saved payload and real RSVP CTA.
 for(const tpl of ['e07','e08']){
   const p=await browser.newPage({viewport:{width:390,height:844}});
   const e=[];p.on('pageerror',x=>e.push(String(x)));
   await p.addInitScript(({tpl,photo})=>{
     localStorage.setItem('weddly_guests_design',JSON.stringify({
       tier:'essential',template:tpl,fontPair:'editorial',
       p1:'Alejandra',p2:'Maximiliano',date:'2027-09-12',time:'18:00',
       venue:'Finca La Alquería',city:'Murcia',heroPhoto:photo,storyPhoto:'',
       storyTitle:'Un sí que queremos celebrar contigo.',
       storyText:'Queremos celebrar este día rodeados de las personas que forman parte de nuestra historia.',
       agenda:[{time:'18:00',title:'Ceremonia',place:'Finca La Alquería',icon:'ring'},{time:'19:00',title:'Cóctel',place:'Jardín principal',icon:'glass'},{time:'21:00',title:'Cena',place:'Salón principal',icon:'fork'},{time:'00:00',title:'Fiesta',place:'Hasta que el cuerpo aguante',icon:'note'}],
       locations:[{title:'Celebración',time:'18:00',place:'Finca La Alquería',address:'Finca La Alquería, Murcia'}],
       contactName:'Ana',contactPhone:'600123123',whatsapp:'https://wa.me/34600123123'
     }));
   },{tpl,photo});
   await p.goto(base+'/guests-rsvp-essential-live.html',{waitUntil:'networkidle'});
   await p.waitForSelector('#ctaBtn',{timeout:8000});
   const m=await p.evaluate(()=>({
     text:document.body.innerText,
     cta:document.getElementById('ctaBtn')?.getAttribute('href')||'',
     imgs:[...document.images].filter(x=>x.src.startsWith('data:image')).length,
     scroll:document.documentElement.scrollWidth,width:innerWidth
   }));
   assert(m.text.includes('Alejandra')&&m.text.includes('Maximiliano'),tpl+' public uses saved names');
   assert(m.imgs>=1,tpl+' public shows main photo');
   assert(m.cta.includes('guests-rsvp-v108-mobile.html'),tpl+' public CTA goes to RSVP');
   assert(m.scroll<=m.width+1,tpl+' public no horizontal overflow');
   assert(!/WeddlySmartDesign|Weddly Smart Design/i.test(m.text),tpl+' public no branding');
   assert(e.length===0,tpl+' public page errors: '+e.join('; '));
   await p.screenshot({path:'qa-artifacts/essential-hotfix/public-'+tpl+'.png',fullPage:true});
   await p.close();
 }

 // Legacy public: even if a saved photo exists, it is suppressed.
 const old=await browser.newPage({viewport:{width:390,height:844}});
 await old.addInitScript(({photo})=>{
   localStorage.setItem('weddly_guests_design',JSON.stringify({
     tier:'essential',template:'e01',fontPair:'editorial',p1:'Ana',p2:'Carlos',
     date:'2027-09-12',time:'18:00',venue:'Finca Los Olivos',city:'Murcia',
     heroPhoto:photo,storyPhoto:photo,agenda:[],locations:[]
   }));
 },{photo});
 await old.goto(base+'/guests-rsvp-essential-live.html',{waitUntil:'networkidle'});
 await old.waitForTimeout(700);
 const oldImgs=await old.evaluate(()=>[...document.images].filter(x=>x.src.startsWith('data:image/svg+xml')).length);
 assert(oldImgs===0,'legacy public Essential suppresses saved photos');
 await old.close();

 await browser.close();
 console.log('PASS Essential trial hotfix');
})().catch(e=>{console.error('FAIL',e.stack||e);process.exit(1)});