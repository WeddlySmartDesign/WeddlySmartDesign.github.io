const fs=require('fs');
const {chromium}=require('playwright-core');
const assert=(v,m)=>{if(!v)throw new Error(m)};
const combos=['editorial','romantico','clasico','moderno','caligrafico'];
const expected={
 editorial:{display:'Cormorant Garamond',body:'Jost'},
 romantico:{display:'Cormorant Garamond',body:'Cormorant Garamond'},
 clasico:{display:'Playfair Display',body:'EB Garamond'},
 moderno:{display:'Fraunces',body:'Work Sans'},
 caligrafico:{display:'Marcellus',body:'Marcellus'}
};
const templates=['e07','e08'];
const widths=[360,390];
const svg=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100"><rect width="900" height="1100" fill="#d9d0c6"/><circle cx="330" cy="420" r="150" fill="#f6eee6"/><circle cx="570" cy="420" r="150" fill="#efe4da"/><path d="M120 1100c40-300 210-430 330-430s290 130 330 430" fill="#c7b7a9"/></svg>');

(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN,args:['--no-sandbox','--disable-dev-shm-usage']});
 fs.mkdirSync('qa-artifacts/essential-07-08-matrix',{recursive:true});
 for(const width of widths){
  for(const tpl of templates){
   for(const font of combos){
    const page=await browser.newPage({viewport:{width:1200,height:1000},deviceScaleFactor:1});
    const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
    await page.goto('http://127.0.0.1:8765/weddly-personalizacion-essential.html',{waitUntil:'load'});
    await page.locator('.phone-frame').evaluate((el,w)=>{el.style.width=(w+16)+'px';el.style.maxWidth='none'},width);
    await page.locator('#p1').fill('Alejandra');
    await page.locator('#p2').fill('Maximiliano');
    await page.locator('#venue').fill('Real Finca de Santa María de los Olivos');
    await page.locator('#city').fill('San Pedro del Pinatar · Murcia');
    await page.locator('#storyTitle').fill('Un sí que queremos celebrar contigo y recordar siempre.');
    await page.locator('#storyText').fill('Después de tantos momentos juntos, queremos celebrar este nuevo capítulo rodeados de las personas que forman parte de nuestra historia y que han caminado a nuestro lado durante todos estos años.');
    await page.locator('#heroPhotoInput').setInputFiles({name:'couple.svg',mimeType:'image/svg+xml',buffer:svg});
    await page.locator('.tpl-card[data-id="'+tpl+'"]').click();
    await page.locator('.font-card[data-id="'+font+'"]').click();
    const agendaPlaces=page.locator('.agenda-place');
    await agendaPlaces.nth(0).fill('REAL FINCA DE SANTA MARÍA DE LOS OLIVOS');
    await agendaPlaces.nth(1).fill('JARDÍN PRINCIPAL DE LOS NARANJOS');
    await page.waitForTimeout(500);
    const frames=page.frames().filter(f=>f!==page.mainFrame());
    const frame=frames[0];
    if(!frame)throw new Error('missing preview frame '+tpl+' '+font);
    await frame.waitForSelector(tpl==='e07'?'.hero-copy':'.hero',{timeout:5000});
    await frame.evaluate(async()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));await document.fonts.ready});
    const m=await frame.evaluate(({tpl,font,expected})=>{
      const q=s=>document.querySelector(s),cs=s=>getComputedStyle(q(s));
      const rect=s=>{const r=q(s).getBoundingClientRect();return{x:r.x,right:r.right,width:r.width,height:r.height}};
      const names=tpl==='e07'?'.names':'.hero-names';
      const bodyText=tpl==='e07'?'.intro':'.hero-line';
      const agenda=tpl==='e07'?'.agenda-row':'.moment';
      const locations=tpl==='e07'?'.place-item':'.location-item';
      return{
        innerWidth,scrollWidth:document.documentElement.scrollWidth,
        bodyClass:document.body.className,
        displayFont:cs(names).fontFamily,
        bodyFont:cs(bodyText).fontFamily,
        bodySize:parseFloat(cs(bodyText).fontSize),
        nameRect:rect(names),bodyRect:rect(bodyText),
        agendaCount:document.querySelectorAll(agenda).length,
        locationCount:document.querySelectorAll(locations).length,
        text:document.body.innerText,
        cta:!!q('#rsvpBtn'),
        photoDisplay:cs('#heroPhotoWrap').display,
        photoClip:cs('#heroPhoto').clipPath,
        targetDisplay:expected[font].display,targetBody:expected[font].body
      };
    },{tpl,font,expected});
    assert(errors.length===0,tpl+' '+font+' '+width+' page errors: '+errors.join(';'));
    assert(Math.abs(m.innerWidth-width)<=2,tpl+' '+font+' preview width expected '+width+' got '+m.innerWidth);
    assert(m.scrollWidth<=m.innerWidth+1,tpl+' '+font+' '+width+' horizontal overflow '+m.scrollWidth+'/'+m.innerWidth);
    assert(m.nameRect.x>=-1&&m.nameRect.right<=m.innerWidth+1,tpl+' '+font+' names overflow');
    assert(m.bodyRect.x>=-1&&m.bodyRect.right<=m.innerWidth+1,tpl+' '+font+' hero text overflow');
    assert(m.bodySize>=15,tpl+' '+font+' hero text too small '+m.bodySize);
    assert(m.bodyClass==='font-'+font,tpl+' '+font+' wrong font class '+m.bodyClass);
    assert(m.displayFont.includes(m.targetDisplay),tpl+' '+font+' wrong display font '+m.displayFont);
    assert(m.bodyFont.includes(m.targetBody),tpl+' '+font+' wrong body font '+m.bodyFont);
    assert(m.agendaCount===4,tpl+' '+font+' agenda count '+m.agendaCount);
    assert(m.locationCount===2,tpl+' '+font+' location count '+m.locationCount);
    assert(m.cta,tpl+' '+font+' missing RSVP CTA');
    assert(m.photoDisplay!=='none',tpl+' '+font+' uploaded photo hidden');
    assert(!/WeddlySmartDesign|Essential 0[78]/i.test(m.text),tpl+' '+font+' public branding leaked');
    assert(!m.photoClip||m.photoClip==='none',tpl+' '+font+' photo is masked '+m.photoClip);
    const storyHidden=await page.locator('#storyPhotoBlock').evaluate(el=>getComputedStyle(el).display==='none');
    assert(storyHidden,tpl+' '+font+' secondary photo editor should be hidden');
    assert(await page.locator('.agenda-icon').count()===0,tpl+' '+font+' icon control should be hidden');
    await frame.locator('body').screenshot({path:'qa-artifacts/essential-07-08-matrix/'+tpl+'-'+font+'-'+width+'.png',fullPage:true});
    console.log('PASS',tpl,font,width,m.bodySize,m.displayFont,m.bodyFont);
    await page.close();
   }
  }
 }
 await browser.close();
})().catch(e=>{console.error('FAIL',e.stack||e);process.exit(1)});