/* Limoneros D03 — schema V1 bridge, TEST-only. Run before the existing demo initializer. */
(function(){
'use strict';
const original=window.GUEST_APPLY_CONFIG;
if(typeof original!=='function')throw Error('GUEST_D03_ORIGINAL_RENDERER_MISSING');
const txt=v=>v==null?'':String(v).trim();
const byId=id=>document.getElementById(id);
function href(v){if(!v)return null;try{const u=new URL(v,document.baseURI);return u.protocol==='https:'||u.protocol==='http:'?u.href:null}catch{return null}}
function addLine(container,lines){let items=lines.map(txt).filter(Boolean);if(!items.length)return;const p=document.createElement('p');p.className='practical-details';for(const item of items){const s=document.createElement('span');s.className='practical-line'+(/^(?:Ida|Vuelta):/.test(item)?' d03-travel-time':'');
 if(/^(?:Ida|Vuelta):/.test(item)){
  const parts=item.match(/^(Ida|Vuelta):\s*(.*)$/);
  const label=document.createElement('span');label.className='d03-time-label';label.textContent=parts[1]+': ';
  const value=document.createElement('strong');value.className='d03-time-value';value.textContent=parts[2];
  s.append(label,value);
 }else{s.textContent=item}
 p.append(s)}container.append(p)}
function addBlock(root,title,lines,links=[],more=null,kind=''){
 if(!lines.some(x=>txt(x))&&!links.some(x=>href(x[0]))&&!more)return;
 const block=document.createElement('section');block.className='practical-item'+(kind?' d03-'+kind:'');
 const h=document.createElement('p');h.className='practical-title';h.textContent=title;block.append(h);addLine(block,lines);
 const row=document.createElement('div');row.className='location-links';
 for(const [link,label] of links){const url=href(link);if(!url)continue;const a=document.createElement('a');a.className='link';a.href=url;a.rel='noopener noreferrer';a.target='_blank';a.textContent=label;row.append(a)}
 if(row.childElementCount)block.append(row);
 if(more&&more.lines.some(x=>txt(x))){const d=document.createElement('details'),s=document.createElement('summary');s.textContent=more.label;d.append(s);addLine(d,more.lines);block.append(d)}
 root.append(block)
}
function applyPractical(config){
 const root=byId('practical-items'),scene=byId('practical'),p=config.practical||{};
 root.replaceChildren();
 const b=p.bus||{};
 if(b.enabled){
  const lines=[];
  if(b.pickupPoints?.length)lines.push('Paradas: '+b.pickupPoints.map(txt).filter(Boolean).join(' · '));
  if(b.outboundTimes?.length)lines.push('Ida: '+b.outboundTimes.map(txt).filter(Boolean).join(' · '));
  if(b.returnTimes?.length)lines.push('Vuelta: '+b.returnTimes.map(txt).filter(Boolean).join(' · '));
  if(b.note)lines.push(b.note);else if(!window.__GUEST_SUPPRESS_DEMO__&&b.message)lines.push(b.message);
  addBlock(root,'Transporte',lines,[[b.mapsUrl,'Cómo llegar']],null,'bus');
 }
 const a=p.accommodation||{};
 if(a.enabled&&a.mode!=='none'){
  // Extra details are hidden only when they genuinely add new information.
  // Never repeat note/discount/price already displayed below the hotel name.
  const more=[a.address&&'Dirección: '+a.address,a.bookingName&&a.bookingName!==a.bookingCode&&'Reserva a nombre de '+a.bookingName,a.bookingCode&&'Código: '+a.bookingCode,a.deadline&&'Hasta: '+a.deadline,a.phone&&'Teléfono: '+a.phone];
  const links=[[a.websiteUrl,'Ver hotel'],[a.mapsUrl,'Cómo llegar']];
  if(a.mode==='external_booking')links.push([a.externalBookingUrl,'Reservar']);
  addBlock(root,'Alojamiento',[a.name||(!window.__GUEST_SUPPRESS_DEMO__?a.message:null),a.note,a.discountText,a.priceText],links,{label:'Información adicional',lines:more.filter(Boolean)},'accommodation')
 }
 const g=p.gift||{};
 if(g.enabled&&g.mode!=='none'){
  const more=[g.details,g.accountHolder&&'Titular: '+g.accountHolder,g.iban&&'IBAN: '+g.iban,g.bicSwift&&'BIC/SWIFT: '+g.bicSwift,g.bizumRecipient&&'Destinatario: '+g.bizumRecipient,g.bizumPhone&&'Bizum: '+g.bizumPhone];
  addBlock(root,'Regalos',[g.displayText||(!window.__GUEST_SUPPRESS_DEMO__?g.message:null)],[[g.externalUrl,g.linkLabel||'Ver lista de regalos']],{label:'Ver datos',lines:more},'gift')
 }
 const m=p.playlist||{};
 if(m.enabled&&m.mode!=='none'){
  // Never infer a listening use-case from a question asking guests for a song.
  // A request CTA requires an actual questionnaire URL; no fake internal form.
  const action=m.mode==='guest_request'?'Pedir canción':'Ver playlist';
  addBlock(root,'Nuestra música',[m.prompt],[[m.url,action]],null,'playlist');
 }
 scene.classList.toggle('invisible',root.childElementCount===0);
 const hasGallery=Boolean(config.gallery?.enabled&&Array.isArray(config.gallery.photos)&&config.gallery.photos.length);
 scene.classList.toggle('d03-four-practical-gradient',!hasGallery&&root.childElementCount===4);
}

/* D03 non-destructive scene improvements: same canonical config, no bespoke inputs. */
let agendaObserver=null;
let practicalObserver=null;
function photoHref(value){
 const raw=typeof value==='string'?value:value?.src;
 if(!raw)return null;
 try{const u=new URL(raw,document.baseURI);return ['https:','http:','blob:'].includes(u.protocol)?u.href:null}catch{return null}
}
function installGalleryCarousel(){
 const scene=byId('gallery'),track=byId('gallery-items');
 if(!scene||!track)return;
 scene.querySelector('.d03-gallery-nav')?.remove();
 const images=Array.from(track.querySelectorAll('img'));
 if(!images.length)return;
 scene.classList.add('d03-gallery-carousel');
 track.setAttribute('role','region');
 track.setAttribute('aria-label','Galería de fotografías');
 images.forEach((im,i)=>{im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+images.length)});
 if(images.length===1)return;
 const nav=document.createElement('div');nav.className='d03-gallery-nav';
 const hint=document.createElement('span');hint.textContent='Desliza para ver';
 const dots=document.createElement('div');dots.className='d03-gallery-dots';
 const btns=images.map((im,i)=>{
  const b=document.createElement('button');b.type='button';b.className='d03-gallery-dot';
  b.setAttribute('aria-label','Ver foto '+(i+1));
  b.addEventListener('click',()=>track.scrollTo({left:i*track.clientWidth,behavior:'smooth'}));
  dots.append(b);return b;
 });
 const update=()=>{const idx=Math.max(0,Math.min(btns.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));btns.forEach((b,i)=>b.setAttribute('aria-current',i===idx?'true':'false'))};
 nav.append(hint,dots);scene.querySelector('.scene-inner').append(nav);
 track.addEventListener('scroll',update,{passive:true});update();track.scrollLeft=0;
}
function enhanceLimonerosScenes(config){
 const story=config.story||{},storyPhoto=byId('story-photo');
 // A cover photo must not silently impersonate an absent story photo.
 if(storyPhoto&&!photoHref(story.photo)){
   storyPhoto.removeAttribute('src');
   storyPhoto.classList.add('invisible');
 }
 const root=byId('locations'),items=byId('location-items'),pic=config.locations?.heroPhoto;
 // Web del lugar is an overlong label for the compact native venue action.
 // The link remains generated only when the questionnaire provides websiteUrl.
 for(const action of root?.querySelectorAll('.location-links a')||[]){
   if(action.textContent.trim()==='Web del lugar')action.textContent='Web';
 }
 const valid=photoHref(pic);
 let figure=byId('d03-location-photo');
 if(figure&&!valid){figure.remove();figure=null}
 if(valid&&root&&items&&items.parentNode){
   if(!figure){
     figure=document.createElement('figure');
     figure.id='d03-location-photo';
     figure.className='location-photo';
     const img=document.createElement('img');
     img.className='location-hero-photo';
     img.alt='Fotografía del lugar';
     img.loading='lazy';
     figure.append(img);
     items.parentNode.insertBefore(figure,items);
   }
   const img=figure.querySelector('img');
   img.src=valid;
   img.dataset.fit=pic?.fit==='full'?'full':'crop';
   const x=Math.max(0,Math.min(100,Number(pic?.focusX??50)));
   const y=Math.max(0,Math.min(100,Number(pic?.focusY??50)));
   img.style.objectPosition=x+'% '+y+'%';
 }

 // Deliberate editorial reveal on actual entry, without continuous movement.
 // Never conceal questionnaire content in browsers without observer support.
 if(practicalObserver){practicalObserver.disconnect();practicalObserver=null}
 const practicalItems=byId('practical-items');
 const modules=practicalItems?[...practicalItems.children]:[];
 const reducePracticalMotion=typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(modules.length&&!reducePracticalMotion&&typeof IntersectionObserver==='function'){
   practicalObserver=new IntersectionObserver(entries=>{
     for(const entry of entries){
       if(entry.isIntersecting){
         entry.target.classList.add('d03-practical-visible');
         practicalObserver?.unobserve(entry.target);
       }
     }
   },{threshold:.18,rootMargin:'0px 0px -5% 0px'});
   modules.forEach(item=>{
     item.classList.add('d03-practical-ready');
     practicalObserver.observe(item);
   });
 }
 // Scene-level reveal: a single visible sequence, not five independent
 // observers that can all finish before a person reaches the agenda.
 // Replays only if the user leaves and returns to the scene.
 if(agendaObserver){agendaObserver.disconnect();agendaObserver=null}
 const agenda=byId('agenda'),list=byId('moments'),rows=list?[...list.children]:[];
 if(agenda){
   agenda.classList.remove('d03-sequence-ready','d03-sequence-start');
 }
 if(agenda&&rows.length){
   const reduced=typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if(reduced){
     rows.forEach(row=>row.classList.remove('d03-ready','d03-visible'));
   }else{
     agenda.classList.add('d03-sequence-ready');
     rows.forEach((row,i)=>{
       row.classList.remove('d03-visible');
       row.classList.add('d03-ready');
       row.style.setProperty('--d03-step',String(i*560)+'ms');
     });
     if(typeof IntersectionObserver==='function'){
       let armed=true;
       agendaObserver=new IntersectionObserver(entries=>{
         for(const entry of entries){
           if(entry.intersectionRatio<.13){
             armed=true;
             continue;
           }
           if(armed&&entry.intersectionRatio>=.36){
             armed=false;
             agenda.classList.remove('d03-sequence-start');
             // Restart the visible five-step choreography if returning from
             // another section, never pulse continuously while stationary.
             void agenda.offsetWidth;
             agenda.classList.add('d03-sequence-start');
           }
         }
       },{threshold:[0,.12,.36,.55]});
       agendaObserver.observe(agenda);
     }else{
       // Never strand content invisible in an old embedded browser.
       agenda.classList.add('d03-sequence-start');
     }
   }
 }
}

window.GUEST_APPLY_CONFIG=function(config){
 // The original renderer allocates the author's graded backgrounds before its
 // Practical content is replaced. Supply real schema-derived placeholders to
 // make the scene visible without changing the questionnaire or user wording.
 const p=config.practical||{},b=p.bus||{},a=p.accommodation||{},g=p.gift||{};
 const proxy={...config,practical:{...p,
  bus:b.enabled?{...b,message:b.note||b.pickupPoints?.filter(Boolean).join(' · ')||b.outboundTimes?.filter(Boolean).join(' · ')||'Transporte'}:b,
  accommodation:a.enabled&&a.mode!=='none'?{...a,message:a.name||a.note||a.bookingCode||a.address||'Alojamiento'}:a,
  gift:g.enabled&&g.mode!=='none'?{...g,message:g.displayText||g.details||'Regalos'}:g
 }};
 const res=original(proxy);applyPractical(config);enhanceLimonerosScenes(config);installGalleryCarousel();
 const closingLine=byId('closing-line');if(closingLine&&config.closing?.line==null){closingLine.textContent='';closingLine.classList.add('invisible')}
 return {...res,visibleScenes:document.querySelectorAll('[data-bg]:not(.invisible)').length};
};

/* Explicit TEST-ONLY full/absent fixture for author visual review.
   Never activate in an authenticated order or regular public invitation. */
if(!window.__GUEST_SUPPRESS_DEMO__ && window.location && window.addEventListener){
 const fixtureMode=new URLSearchParams(window.location.search).get('qa');
 if(['full','reduced','without-gallery'].includes(fixtureMode)){
  const runFixture=()=>{
   // Public opt-in QA uses generated non-photographic media placeholders.
   // The five real author-supplied photographs remain only in the private Library QA file.
   const qaColors={'couple.jpg':['#f0dccb','#a67a73'],'couple2.jpg':['#e9d5c9','#8c9280'],'couple3.jpg':['#d7cbd5','#7e7187'],'venue.jpg':['#d6d2bd','#9d8f70'],'celebration.webp':['#ded0ce','#b18c9b']};
   const photo=(filename,fit='crop')=>{
     const colors=qaColors[filename]||qaColors['couple.jpg'];
     const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="850" viewBox="0 0 1280 850">'+
       '<rect width="1280" height="850" fill="'+colors[0]+'"/>'+
       '<circle cx="930" cy="200" r="168" fill="#fff8e7" opacity=".55"/>'+
       '<path d="M0 620Q280 420 640 655T1280 550V850H0Z" fill="'+colors[1]+'" opacity=".46"/>'+
       '<path d="M0 735Q330 635 770 770T1280 690V850H0Z" fill="'+colors[1]+'" opacity=".62"/>'+
       '</svg>';
     return {src:URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),fit,focusX:50,focusY:50};
   };
   const full=fixtureMode!=='reduced';
   const loc=(type,time,name,address)=>({type,time,name,address,
     mapsUrl:'https://www.google.com/maps/search/?api=1&query=Murcia',
     websiteUrl:'https://example.com/'});
   const config={
     schemaVersion:'guest-invitation-config-v1',locale:'es',
     template:{id:'design-03',version:'1.0.0',typographyVariant:'classic'},
     couple:{name1:'Lucía',name2:'Pablo'},
     wedding:{date:'2027-09-18',time:'18:30',coverPlace:'Murcia'},
     cover:{photo:null,showPlace:true,showTime:false},
     countdown:{enabled:true},
     story:{enabled:true,textMode:full?'custom':'preset',
       body:'No sabemos exactamente cuándo empezó todo. Solo sabemos que queremos seguir escribiendo nuestra historia con vosotros a nuestro lado.',
       photo:full?photo('couple.jpg'):null},
     locations:{mode:full?'split':'shared',heroPhoto:full?photo('venue.jpg'):null,
       dressCode:{enabled:full,text:full?'Elegante, con un toque de color':null},
       items:full?[
         loc('ceremony','18:30','Jardín de la Luz','Camino de los Olivos, Murcia'),
         loc('celebration','20:00','Finca de los Limoneros','Murcia')
       ]:[loc('shared','18:30','Jardín de la Luz','Murcia')]},
     agenda:{enabled:true,moments:full?[
       {time:'18:30',label:'Ceremonia'},
       {time:'19:30',label:'Cóctel de bienvenida'},
       {time:'21:00',label:'Cena'},
       {time:'23:30',label:'Baile'},
       {time:'02:00',label:'Último baile'}
     ]:[{time:'18:30',label:'Ceremonia'}]},
     practical:{
       bus:{enabled:full,pickupPoints:['Plaza de prueba'],outboundTimes:['17:15'],returnTimes:['02:00'],note:'Horario de transporte de muestra',mapsUrl:'https://www.google.com/maps/search/?api=1&query=Murcia'},
       accommodation:{enabled:full,mode:'recommended',name:'Hotel de ejemplo',address:null,websiteUrl:'https://example.com/',
         mapsUrl:'https://www.google.com/maps/search/?api=1&query=Murcia',externalBookingUrl:null,
         bookingCode:null,bookingName:null,note:null},
       gift:{enabled:full,mode:'short_text',displayText:'Vuestra presencia es nuestro mejor regalo',details:'Texto de muestra'},
       playlist:{enabled:full,mode:'guest_request',prompt:'¿Qué canción no puede faltar?',url:'https://example.com/pedir-cancion'}
     },
     gallery:{enabled:fixtureMode==='full',photos:fixtureMode==='full'?[
       photo('couple.jpg'),photo('couple2.jpg'),photo('couple3.jpg'),photo('celebration.webp','full')]:[]},
     rsvp:{ctaLabel:'Confirmar asistencia',route:null},
     closing:{line:'Lo más bonito será celebrarlo juntos.'}
   };
   window.GUEST_APPLY_CONFIG(config);
   document.documentElement.dataset.guestReviewFixture=fixtureMode;
   const ribbon=document.createElement('div');
   ribbon.id='guest-demo-fixture-notice';
   ribbon.textContent='DEMOSTRACIÓN TÉCNICA · IMÁGENES DE PRUEBA · NO VENTA';
   ribbon.setAttribute('role','note');
   Object.assign(ribbon.style,{position:'fixed',zIndex:'30',top:'0',left:'0',right:'0',padding:'5px 8px',
     background:'rgba(255,251,243,.93)',color:'#563d4b',font:'11px/1.2 sans-serif',
     textAlign:'center',letterSpacing:'.055em',pointerEvents:'none'});
   document.body.append(ribbon);
  };
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',runFixture,{once:true});
  else window.setTimeout(runFixture,0);
 }
}

})();
