const fs=require('fs');
const {chromium}=require('playwright-core');

const fonts={
  editorial:{display:'Cormorant Garamond',body:'Jost'},
  romantico:{display:'Cormorant Garamond',body:'Cormorant Garamond'},
  clasico:{display:'Playfair Display',body:'EB Garamond'},
  moderno:{display:'Fraunces',body:'Work Sans'},
  caligrafico:{display:'Marcellus',body:'Marcellus'}
};
const widths=[360,390];
const assert=(v,m)=>{if(!v)throw new Error(m)};

(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN,args:['--no-sandbox','--disable-dev-shm-usage']});
 fs.mkdirSync('qa-artifacts/e08-fonts',{recursive:true});
 for(const [mode,expected] of Object.entries(fonts)){
  for(const width of widths){
   const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1});
   const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(`http://127.0.0.1:8765/preview-essential-08-modernist.html?font=${mode}`,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{await document.fonts.ready;
     document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));
     const names=document.querySelector('.hero-names');
     names.innerHTML='Alejandra<span class="and">&amp;</span>Maximiliano';
     document.querySelector('.hero-line').textContent='Hay días que se recuerdan toda la vida. Queremos que formes parte del nuestro y compartir contigo cada momento de esta celebración.';
     document.querySelector('.story-copy').textContent='Después de tantos momentos juntos, queremos celebrar este nuevo capítulo rodeados de las personas que forman parte de nuestra historia y que han caminado a nuestro lado durante todos estos años.';
   });
   await page.waitForTimeout(200);
   const m=await page.evaluate(()=>{
     const r=e=>{const x=e.getBoundingClientRect();return {x:x.x,right:x.right,width:x.width,height:x.height}};
     const cs=s=>getComputedStyle(document.querySelector(s));
     return {
       htmlScroll:document.documentElement.scrollWidth,
       w:innerWidth,
       name:r(document.querySelector('.hero-names')),
       line:r(document.querySelector('.hero-line')),
       displayFont:cs('.hero-names').fontFamily,
       bodyFont:cs('.hero-line').fontFamily,
       lineSize:parseFloat(cs('.hero-line').fontSize),
       lineHeight:parseFloat(cs('.hero-line').lineHeight),
       storySize:parseFloat(cs('.story-copy').fontSize),
       bodyClass:document.body.className
     };
   });
   assert(errors.length===0,`${mode} ${width}: page errors ${errors.join(';')}`);
   assert(m.htmlScroll<=width+1,`${mode} ${width}: horizontal overflow ${m.htmlScroll}`);
   assert(m.name.x>=-1&&m.name.right<=width+1,`${mode} ${width}: names overflow`);
   assert(m.line.x>=-1&&m.line.right<=width+1,`${mode} ${width}: hero copy overflow`);
   assert(m.lineSize>=15.4,`${mode} ${width}: hero copy too small ${m.lineSize}`);
   assert(m.storySize>=14.9,`${mode} ${width}: story copy too small ${m.storySize}`);
   assert(m.displayFont.includes(expected.display),`${mode}: display font not loaded (${m.displayFont})`);
   assert(m.bodyFont.includes(expected.body),`${mode}: body font not loaded (${m.bodyFont})`);
   assert(m.bodyClass===`font-${mode}`,`${mode}: wrong body mode ${m.bodyClass}`);
   await page.screenshot({path:`qa-artifacts/e08-fonts/${mode}-${width}.png`,fullPage:true});
   console.log('PASS',mode,width,m);
   await page.close();
  }
 }
 await browser.close();
})().catch(e=>{console.error('FAIL',e.stack||e);process.exit(1)});