const fs=require('fs');
const { chromium }=require('playwright-core');

const assert=(ok,msg)=>{if(!ok) throw new Error(msg)};
const base='http://127.0.0.1:8765';
const ids=['01','02','03','04','05','06'];

for(const id of ids){
  const html=fs.readFileSync(`guests-rsvp-essential-${id}.html`,'utf8');
  assert(html.includes('guests-essential-one-v4.css?v=20261001a'),`E${id} loads ONE premium CSS`);
  assert(html.includes(`one-essential-premium essential-${id}`),`E${id} has scoped body class`);
}
const css=fs.readFileSync('guests-essential-one-v4.css','utf8');
assert(css.includes('font-size:clamp(17px,4.4vw,19px)!important'),'story copy minimum preserved');
assert(css.includes('font-size:13px!important;line-height:1.4!important'),'agenda place readable');
assert(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))!important'),'mobile agenda reflows');
assert(!css.includes('border-radius:50%!important'),'no forced generic circular cover photo');
const customizer=fs.readFileSync('weddly-personalizacion-essential.html','utf8');
assert(customizer.includes("premiumClass = 'one-essential-premium '"),'customizer preview uses ONE premium class');
assert(customizer.includes('guests-essential-one-v4.css?v=20261001a'),'customizer preview uses same ONE CSS');

const photoSvg='data:image/svg+xml;base64,'+Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d8c8b8"/><stop offset="1" stop-color="#879889"/></linearGradient></defs><rect width="900" height="1100" fill="url(#g)"/><circle cx="450" cy="390" r="170" fill="#f4ece5" opacity=".9"/><path d="M210 1040c30-250 170-380 240-380s210 130 240 380" fill="#efe3da" opacity=".9"/></svg>`).toString('base64');

(async()=>{
 const exe=process.env.CHROME_BIN||'/usr/bin/google-chrome';
 const browser=await chromium.launch({headless:true,executablePath:exe,args:['--no-sandbox','--disable-dev-shm-usage']});
 fs.mkdirSync('qa-artifacts',{recursive:true});
 for(const width of [390,360]){
  for(const id of ids){
   const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(`${base}/guests-rsvp-essential-${id}.html`,{waitUntil:'load'});
   await page.evaluate(({photoSvg})=>{
     const t=(sel,val)=>{const e=document.querySelector(sel);if(e)e.textContent=val};
     t('#names','Alejandra y Maximiliano');
     t('#subtitle','Y nos gustaría invitarte a celebrar con nosotros este día tan especial');
     t('#dateVenueLine','12 de septiembre de 2027 · Real Finca de Santa María de los Olivos');
     t('#factDate','12 SEPTIEMBRE 2027');
     t('#factTime','18:30');
     t('#city','San Pedro del Pinatar · Murcia');
     t('#storyTitle','Nos encantará compartir este capítulo contigo.');
     t('#storyText','Después de tantos momentos juntos, queremos celebrar nuestro día rodeados de las personas que forman parte de nuestra historia. Aquí encontrarás toda la información importante sin perder la emoción de una invitación cuidada.');
     const hp=document.querySelector('#heroPhoto');
     if(hp){hp.src=photoSvg; const w=hp.closest('.photo-wrap,.cover-photo-wrap'); if(w)w.classList.add('has-photo')}
     const sp=document.querySelector('#storyPhoto');
     if(sp){sp.src=photoSvg; const w=sp.closest('.historia-photo-wrap'); if(w)w.classList.add('has-photo')}
     const row=document.querySelector('#agendaRow');
     if(row){
       const nodes=[...row.querySelectorAll('.agenda-node')];
       if(nodes.length && nodes.length<5){
         const sep=row.querySelector('.agenda-sep');
         if(sep) row.appendChild(sep.cloneNode(true));
         const n=nodes[nodes.length-1].cloneNode(true);
         const time=n.querySelector('.agenda-time'),title=n.querySelector('.agenda-title'),place=n.querySelector('.agenda-place');
         if(time)time.textContent='02:00';
         if(title)title.textContent='Recena';
         if(place)place.textContent='TERRAZA DE LOS NARANJOS';
         row.appendChild(n);
       }
     }
   },{photoSvg});
   await page.waitForTimeout(250);
   const m=await page.evaluate((id)=>{
     const num=s=>parseFloat(getComputedStyle(document.querySelector(s)).fontSize)||0;
     const rect=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
     const visible=r=>r&&r.w>0&&r.h>0&&r.x>=-1&&r.right<=innerWidth+1;
     const nodes=[...document.querySelectorAll('.agenda-node')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});
     const photo=document.querySelector('.cover-photo-wrap,.photo-wrap.has-photo');
     const pr=photo?photo.getBoundingClientRect():null;
     const rad=photo?getComputedStyle(photo).borderRadius:'';
     return {
       scrollWidth:document.documentElement.scrollWidth, innerWidth,
       subtitle:num(id==='01'?'.subtitle':'.cover-sub'),
       story:num('.historia-text'),
       agendaTitle:num('.agenda-title'),
       agendaPlace:num('.agenda-place'),
       cardDetail:num('.card-detail'),
       names:rect(id==='01'?'.names':'.cover-names'),
       photo:pr?{x:pr.x,y:pr.y,w:pr.width,h:pr.height,right:pr.right}:null,
       photoRadius:rad,
       visibleName:visible(rect(id==='01'?'.names':'.cover-names')),
       visibleStory:visible(rect('.historia-text')),
       visibleAgenda:visible(rect('#agendaSection')),
       nodes
     }
   },id);
   assert(errors.length===0,`E${id} ${width}px has no page errors: ${errors.join('; ')}`);
   assert(m.scrollWidth<=m.innerWidth+1,`E${id} ${width}px has no horizontal overflow (${m.scrollWidth}/${m.innerWidth})`);
   assert(m.subtitle>=13.9,`E${id} ${width}px subtitle >=14px (${m.subtitle})`);
   assert(m.story>=16.9,`E${id} ${width}px story >=17px (${m.story})`);
   assert(m.agendaPlace>=12.9,`E${id} ${width}px agenda place >=13px (${m.agendaPlace})`);
   assert(m.agendaTitle>=(id==='01'?26.9:19.9),`E${id} ${width}px agenda title readable (${m.agendaTitle})`);
   assert(m.cardDetail>=12.9,`E${id} ${width}px card detail >=13px (${m.cardDetail})`);
   assert(m.visibleName&&m.visibleStory,`E${id} ${width}px key copy remains inside viewport width`);
   assert(m.photo&&m.photo.w>=200,`E${id} ${width}px photo has editorial presence (${m.photo&&m.photo.w})`);
   if(id!=='01') assert(!/^50%(?:\\s+50%){0,3}$/.test(m.photoRadius.trim()),`E${id} cover photo is not generic circle (${m.photoRadius})`);
   assert(m.nodes.length>=5,`E${id} ${width}px renders 5 agenda moments for stress test`);
   if(id==='01'){
      const xs=m.nodes.map(n=>Math.round(n.x));
      assert(Math.max(...xs)-Math.min(...xs)<=2,`E01 ${width}px agenda is vertical editorial timeline`);
   }else{
      assert(Math.abs(m.nodes[0].y-m.nodes[1].y)<=2,`E${id} ${width}px first agenda row has 2 columns`);
      assert(m.nodes[2].y>m.nodes[0].y+20,`E${id} ${width}px agenda wraps instead of compressing`);
   }
   await page.screenshot({path:`qa-artifacts/essential-${id}-${width}.png`,fullPage:true});
   console.log('PASS',id,width,m);
   await page.close();
  }
 }
 await browser.close();
})().catch(e=>{console.error('FAIL',e.stack||e);process.exit(1)});
