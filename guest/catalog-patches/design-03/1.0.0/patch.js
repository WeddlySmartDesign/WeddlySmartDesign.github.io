/* Limoneros D03 — schema V1 bridge, TEST-only. Run before the existing demo initializer. */
(function(){
'use strict';
const original=window.GUEST_APPLY_CONFIG;
if(typeof original!=='function')throw Error('GUEST_D03_ORIGINAL_RENDERER_MISSING');
const txt=v=>v==null?'':String(v).trim();
const byId=id=>document.getElementById(id);
function href(v){if(!v)return null;try{const u=new URL(v,document.baseURI);return u.protocol==='https:'||u.protocol==='http:'?u.href:null}catch{return null}}
function addLine(container,lines){let items=lines.map(txt).filter(Boolean);if(!items.length)return;const p=document.createElement('p');p.className='practical-details';for(const item of items){const s=document.createElement('span');s.className='practical-line';s.textContent=item;p.append(s)}container.append(p)}
function addBlock(root,title,lines,links=[],more=null){
 if(!lines.some(x=>txt(x))&&!links.some(x=>href(x[0]))&&!more)return;
 const block=document.createElement('section');block.className='practical-item';
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
  addBlock(root,'Transporte',lines,[[b.mapsUrl,'Cómo llegar']]);
 }
 const a=p.accommodation||{};
 if(a.enabled&&a.mode!=='none'){
  const more=[a.address&&'Dirección: '+a.address,a.bookingName&&'Reserva a nombre de '+a.bookingName,a.bookingCode&&'Código: '+a.bookingCode,a.discountText,a.deadline&&'Hasta: '+a.deadline,a.priceText,a.phone&&'Teléfono: '+a.phone,a.note];
  const links=[[a.websiteUrl,'Ver hotel'],[a.mapsUrl,'Cómo llegar']];
  if(a.mode==='external_booking')links.push([a.externalBookingUrl,'Reservar']);
  addBlock(root,'Alojamiento',[a.name||(!window.__GUEST_SUPPRESS_DEMO__?a.message:null),a.note,a.discountText,a.priceText],links,{label:'Datos del alojamiento',lines:more})
 }
 const g=p.gift||{};
 if(g.enabled&&g.mode!=='none'){
  const more=[g.details,g.accountHolder&&'Titular: '+g.accountHolder,g.iban&&'IBAN: '+g.iban,g.bicSwift&&'BIC/SWIFT: '+g.bicSwift,g.bizumRecipient&&'Destinatario: '+g.bizumRecipient,g.bizumPhone&&'Bizum: '+g.bizumPhone];
  addBlock(root,'Regalos',[g.displayText||(!window.__GUEST_SUPPRESS_DEMO__?g.message:null)],[[g.externalUrl,g.linkLabel||'Ver lista de regalos']],{label:'Ver datos',lines:more})
 }
 const m=p.playlist||{};
 if(m.enabled&&m.mode!=='none')addBlock(root,'Nuestra música',[m.prompt],[[m.url,m.mode==='guest_request'?'Proponer canción':'Escuchar playlist']]);
 scene.classList.toggle('invisible',root.childElementCount===0);
}

/* D03 non-destructive scene improvements: same canonical config, no bespoke inputs. */
let agendaObserver=null;
function photoHref(value){
 const raw=typeof value==='string'?value:value?.src;
 if(!raw)return null;
 try{const u=new URL(raw,document.baseURI);return ['https:','http:','blob:'].includes(u.protocol)?u.href:null}catch{return null}
}
function enhanceLimonerosScenes(config){
 const story=config.story||{},storyPhoto=byId('story-photo');
 // A cover photo must not silently impersonate an absent story photo.
 if(storyPhoto&&!photoHref(story.photo)){
   storyPhoto.removeAttribute('src');
   storyPhoto.classList.add('invisible');
 }
 const root=byId('locations'),items=byId('location-items'),pic=config.locations?.heroPhoto;
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
 // Motion begins when moments actually enter the viewport, rather than
 // animating out of sight on page load. All counts 1..5 use one renderer.
 if(agendaObserver){agendaObserver.disconnect();agendaObserver=null}
 const list=byId('moments');
 if(list&&typeof IntersectionObserver==='function'&&list.children.length){
   agendaObserver=new IntersectionObserver(entries=>{
     for(const entry of entries)if(entry.isIntersecting){
       entry.target.classList.add('d03-visible');
       agendaObserver?.unobserve(entry.target);
     }
   },{threshold:.16,rootMargin:'0px 0px -6% 0px'});
   [...list.children].forEach((row,i)=>{
     row.style.setProperty('--d03-delay',Math.min(i*105,420)+'ms');
     row.classList.add('d03-ready');
     agendaObserver.observe(row);
   });
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
 const res=original(proxy);applyPractical(config);enhanceLimonerosScenes(config);
 const closingLine=byId('closing-line');if(closingLine&&config.closing?.line==null){closingLine.textContent='';closingLine.classList.add('invisible')}
 return {...res,visibleScenes:document.querySelectorAll('[data-bg]:not(.invisible)').length};
};
})();