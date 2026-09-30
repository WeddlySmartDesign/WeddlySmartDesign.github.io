(()=>{
'use strict';
if(window.__guestVisualTablesListsV1)return;window.__guestVisualTablesListsV1=true;
const G=window.__GuestsProd;if(!G?.f)return;
const CSS=`
#mesas>.guest-tables-intro,#listados>.guest-lists-intro{margin:-7px 0 17px;max-width:560px}
#mesas .planLaunch{
  margin:6px 0 14px!important;padding:22px!important;border-radius:22px!important;
  box-shadow:0 14px 32px rgba(44,42,38,.11)!important
}
#mesas .planLaunchTitle{font-size:29px!important;line-height:1.06!important;margin-top:4px!important}
#mesas .planLaunchCopy{font-size:13px!important;line-height:1.45!important;max-width:390px!important}
#mesas .planLaunchAction{font-size:14px!important}
#mesas .guest-table-kpis{display:flex!important;gap:7px!important;flex-wrap:wrap!important;margin:0 0 15px!important}
#mesas .guest-table-kpis .pill{margin:0!important;padding:6px 9px!important;font-size:12px!important}
#mesas .tableTools{margin:0 0 12px!important}
#mesas .tableTools .btn{min-width:0!important;min-height:44px!important;background:transparent!important;border:1px solid #D8D2C8!important;color:inherit!important}
#mesas .card.table{margin:0 0 12px!important;border-radius:20px!important;box-shadow:none!important;overflow:hidden!important}
#mesas .card.table .thead{padding:16px 17px!important;background:#F8F5F0!important;align-items:flex-start!important}
#mesas .card.table .thead>div:first-child b{font:500 19px/1.15 Georgia,serif!important}
#mesas .card.table .thead .small{font-size:12px!important;margin-top:4px}
#mesas .card.table .thead>div:last-child{text-align:right}
#mesas .card.table .thead .pill{font-size:11px!important;padding:5px 8px!important}
#mesas .card.table .thead [data-edittable]{min-height:40px!important;padding:8px 10px!important;font-size:12px!important}
#mesas .card.table .seat{padding:12px 17px!important}
#mesas .card.table .seat b{font-size:14px!important;line-height:1.2}
#mesas .card.table .seat [data-move]{min-height:42px!important;padding:8px 11px!important;font-size:12px!important}
#mesas .card.table.guest-table-over{border-color:#D9A89F!important}
#mesas .card.table.guest-table-full .thead{background:#F4F1EB!important}
#mesas .guest-unseated-card{
  margin-top:15px!important;padding:18px!important;border-style:dashed!important;
  background:#FBF8F3!important;box-shadow:none!important
}
#mesas .guest-unseated-card>.guest-unseated-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}
#mesas .guest-unseated-card>.guest-unseated-head b{font:500 19px/1.15 Georgia,serif!important}
#mesas .guest-unseated-card .row{padding:11px 0!important}
#mesas .guest-unseated-card .row [data-move]{min-height:42px!important;padding:8px 11px!important;font-size:12px!important}

#listados .card{
  position:relative;margin:0 0 12px!important;padding:18px!important;
  border-radius:20px!important;box-shadow:none!important
}
#listados .guest-report-tag{
  display:block;margin:0 0 7px;font-size:10px;font-weight:850;letter-spacing:.14em;
  text-transform:uppercase;color:#817B72
}
#listados .card>b,#listados .card>.guest-report-title{font:500 19px/1.18 Georgia,serif!important}
#listados .card p.small{margin:6px 0 13px!important}
#listados .card .actions{gap:8px!important;margin-top:12px!important}
#listados .card .actions .btn{min-height:44px!important;font-size:12px!important}
#listados [data-copy-status]{
  margin-top:12px!important;padding-top:10px!important;border-top:1px solid #ECE6DD!important;
  font-size:11px!important;line-height:1.45!important;color:#817B72!important
}
#listados [data-copy-status] .btn{min-height:42px!important;margin-top:8px!important;font-size:12px!important}
#listados [data-wsd-q-list]{border-left:3px solid rgba(82,92,67,.32)!important}
#listados [data-wsd-event-list]{border-left:3px solid rgba(124,91,70,.28)!important}
#listados #wsdCopyHistory{background:#F8F5F0!important;border-style:dashed!important}
#listados #wsdCopyHistory .row{padding:10px 0!important}
#listados #wsdCopyHistory .small{font-size:11px!important}
#listados .guest-report-main .btn.soft{background:#F0ECE5!important}
@media(max-width:520px){
  #mesas .planLaunch{padding:19px!important}
  #mesas .planLaunchTitle{font-size:27px!important}
  #mesas .card.table .thead{padding:15px!important}
  #mesas .card.table .seat{padding:12px 15px!important}
  #listados .card{padding:17px!important}
}
@media(max-width:350px){
  #mesas .planLaunch{padding:17px!important}
  #mesas .planLaunchTitle{font-size:25px!important}
  #mesas .planLaunchAction{font-size:13px!important}
  #mesas .card.table .thead{gap:8px!important}
  #mesas .card.table .thead>div:last-child{min-width:88px}
  #listados .card .actions{grid-template-columns:1fr!important}
}
`;

function style(d){
  let s=d.getElementById('guestVisualTablesListsV1');
  if(!s){s=d.createElement('style');s.id='guestVisualTablesListsV1';s.textContent=CSS;d.head.appendChild(s)}
}
function introTables(d){
  const v=d.getElementById('mesas'),h=v?.querySelector(':scope > h2');if(!v||!h)return;
  let p=v.querySelector(':scope > .guest-tables-intro');
  if(!p){p=d.createElement('p');p.className='small guest-tables-intro';p.textContent='Organizad el salón sin perder de vista quién sigue sin mesa.';h.after(p)}
  const launch=v.querySelector('#planBtn');
  if(launch){
    const copy=launch.querySelector('.planLaunchCopy'),action=launch.querySelector('.planLaunchAction');
    if(copy)copy.textContent='Colocad mesas e invitados en el plano y ajustad capacidad, forma y posición.';
    if(action)action.textContent='Abrir plano →';
    const k=launch.nextElementSibling;
    if(k&&k.querySelector?.('.pill'))k.classList.add('guest-table-kpis');
  }
}
function tables(d){
  const v=d.getElementById('mesas');if(!v)return;
  v.querySelectorAll('.card.table').forEach(card=>{
    const txt=card.querySelector('.thead .pill')?.textContent||'';
    card.classList.toggle('guest-table-full',/Llena/i.test(txt));
    card.classList.toggle('guest-table-over',/Exceso/i.test(txt));
  });
  const cards=[...v.querySelectorAll(':scope > .card:not(.table)')];
  for(const card of cards){
    const b=card.querySelector(':scope > b');
    if(!b||!/^Sin mesa$/i.test((b.textContent||'').trim()))continue;
    card.classList.add('guest-unseated-card');
    if(!card.querySelector(':scope > .guest-unseated-head')){
      const head=d.createElement('div');head.className='guest-unseated-head';
      const n=card.querySelectorAll(':scope > .row').length;
      head.innerHTML='<b>Sin mesa</b><span class="pill">'+n+' por colocar</span>';
      b.replaceWith(head);
    }else{
      const n=card.querySelectorAll(':scope > .row').length;
      const p=card.querySelector(':scope > .guest-unseated-head .pill');if(p)p.textContent=n+' por colocar';
    }
  }
}
function introLists(d){
  const v=d.getElementById('listados'),h=v?.querySelector(':scope > h2');if(!v||!h)return;
  let p=v.querySelector(':scope > .guest-lists-intro');
  if(!p){p=d.createElement('p');p.className='small guest-lists-intro';p.textContent='Generad solo lo que necesitáis entregar. Cada copia queda identificada con revisión y número de copia.';h.after(p)}
}
function tag(card,d,label,cls){
  if(cls)card.classList.add(cls);
  let t=card.querySelector(':scope > .guest-report-tag');
  if(!t){t=d.createElement('span');t.className='guest-report-tag';card.insertBefore(t,card.firstChild)}
  t.textContent=label;
}
function lists(d){
  const v=d.getElementById('listados');if(!v)return;
  v.querySelectorAll(':scope > .card').forEach(card=>{
    card.classList.remove('guest-report-main','guest-report-custom','guest-report-event','guest-report-history');
    if(card.id==='wsdCopyHistory'){tag(card,d,'CONTROL DE COPIAS','guest-report-history');return}
    if(card.dataset.wsdQList){tag(card,d,'RESPUESTAS RSVP','guest-report-custom');return}
    if(card.dataset.wsdEventList){tag(card,d,'EVENTO EXTRA','guest-report-event');return}
    const txt=card.textContent||'';
    if(/Boda principal/i.test(txt)){tag(card,d,'BODA PRINCIPAL','guest-report-main');return}
    if(card.id==='wsdAccommodationList'){tag(card,d,'BODA PRINCIPAL','guest-report-main')}
  });
}
function patch(){
  let d;try{d=G.f.contentDocument}catch{return}
  if(!d?.body)return;
  style(d);introTables(d);tables(d);introLists(d);lists(d);
  d.documentElement.dataset.guestB74='1';
  if(d.documentElement.dataset.guestB74Observer!=='1'){
    d.documentElement.dataset.guestB74Observer='1';
    new MutationObserver(()=>requestAnimationFrame(patch)).observe(d.body,{childList:true,subtree:true});
  }
}
G.f.addEventListener('load',()=>{[60,180,420,900].forEach(ms=>setTimeout(patch,ms))});
addEventListener('guests-prod-open',patch);
setInterval(patch,700);
patch();
})();