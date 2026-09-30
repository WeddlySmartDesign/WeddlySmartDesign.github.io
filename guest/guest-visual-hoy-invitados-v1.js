(()=>{
'use strict';
if(window.__guestVisualHoyInvitadosV1)return;window.__guestVisualHoyInvitadosV1=true;
const G=window.__GuestsProd;if(!G?.f)return;
const CSS=`
#hoy>.guest-hoy-intro{margin:2px 0 16px}
#hoy>.guest-hoy-intro h2{margin:4px 0 5px!important}
#hoy>.guest-hoy-intro p{margin:0;max-width:520px}
#hoy>.stats{gap:10px!important;margin-bottom:14px}
#hoy>.stats .stat{padding:17px 18px!important;box-shadow:none!important}
#hoy>.stats .num{font:650 34px/1 system-ui,-apple-system,"Segoe UI",sans-serif!important;letter-spacing:-.035em}
#hoy>.stats .stat>div:last-child{margin-top:5px;font-size:12px;font-weight:760;letter-spacing:.02em;color:#736F63}
#wsdRsvpHome{position:relative;overflow:hidden;padding:19px!important;margin:16px 0!important}
#wsdRsvpHome:before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:currentColor;opacity:.34}
#wsdRsvpHome .sectiontag{margin-bottom:7px}
#wsdRsvpHome b{font:500 21px/1.15 Georgia,serif!important}
#wsdRsvpHome p.small{margin-top:6px!important}
#wsdRsvpHome .actions{grid-template-columns:1fr!important;gap:8px!important}
#wsdRsvpHome .actions .btn{width:100%}
#hoy .guest-attention-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:24px 0 7px}
#hoy .guest-attention-head .pill{margin:0}
#hoy .alert{padding:18px!important}
#hoy .alert>b{display:block;font-size:16px;line-height:1.25}
#hoy .alert p.small{margin:6px 0 13px}
#wsdRecentChanges{margin-top:24px}
#wsdRecentChanges>.guest-recent-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:7px}
#wsdRecentChanges .card{padding:5px 16px!important;margin-top:0!important;box-shadow:none!important}
#wsdRecentChanges .row{padding:13px 0!important;align-items:flex-start!important}
#wsdRecentChanges .row b{font-size:14px;line-height:1.25}
#wsdRecentChanges .row .small{font-size:12px!important}
#wsdMarkRecentRead{
  min-height:42px!important;border:1px solid #D8D4CA!important;background:transparent!important;
  border-radius:999px!important;padding:9px 12px!important;font-size:12px!important;font-weight:760!important;
  color:inherit!important;box-shadow:none!important
}

#invitados>.guest-invitados-intro{margin:-7px 0 17px;max-width:540px}
#invitados .flow{gap:12px!important}
#invitados .step{padding:18px!important;box-shadow:none!important}
#invitados .stepHead{gap:13px!important}
#invitados .stepHead>div{min-width:0}
#invitados .step h3{font:500 20px/1.16 Georgia,serif!important;margin:1px 0 5px!important}
#invitados .step .small{margin-top:0}
#invitados .stepNum{
  width:32px!important;height:32px!important;min-width:32px!important;border-radius:50%!important;
  font-size:13px!important;box-shadow:none!important
}
#invitados .pill{font-size:12px!important;padding:6px 8px!important}
#invitados .actions{margin-top:13px!important}
#invitados .minor{margin-top:8px!important}
#invitados .minor .btn{min-height:44px!important}
#invitados #wsdEventsStep{background:transparent!important;border-style:dashed!important}
#invitados #wsdEventsStep #wsdEventsQuick{
  background:transparent!important;color:inherit!important;border:1px solid currentColor!important;opacity:.72
}
#invitados .wsdPlanGuestHero{box-shadow:0 14px 32px rgba(44,42,38,.12)!important}
#invitados .wsdPlanGuestHero h3{font-size:21px!important}
#invitados .wsdPlanGuestHero #planBtnGuest{border-radius:14px!important}
.wsd-people-tools{border-bottom-color:#EEE7DE!important}
.wsd-person-detail,.wsd-people-tables{min-height:44px!important}
@media(max-width:520px){
  #hoy>.stats .stat{padding:15px!important}
  #hoy>.stats .num{font-size:31px!important}
  #wsdRsvpHome{padding:17px!important}
  #invitados .step{padding:17px!important}
}
@media(max-width:350px){
  #wsdRecentChanges>.guest-recent-head{align-items:flex-start}
  #wsdRecentChanges>.guest-recent-head>div:last-child{width:100%;justify-content:space-between!important}
  #wsdMarkRecentRead{min-height:44px!important}
}
`;

function style(d){
  let s=d.getElementById('guestVisualHoyInvitadosV1');
  if(!s){s=d.createElement('style');s.id='guestVisualHoyInvitadosV1';s.textContent=CSS;d.head.appendChild(s)}
}
function introHoy(d){
  const h=d.getElementById('hoy');if(!h)return;
  let x=h.querySelector(':scope > .guest-hoy-intro');
  if(!x){x=d.createElement('div');x.className='guest-hoy-intro';x.innerHTML='<div class="sectiontag">RESUMEN</div><h2>Hoy</h2><p class="small">Lo que necesita vuestra atención, sin revisar toda la lista.</p>';h.insertBefore(x,h.firstChild)}
  const candidates=[...h.children].filter(el=>el!==x&&el.id!=='wsdRsvpHome'&&el.id!=='wsdRecentChanges');
  for(const el of candidates){
    if(el.matches('div')&&el.querySelector?.('.sectiontag')&&/Necesita tu atención/i.test(el.textContent||'')){el.classList.add('guest-attention-head');break}
  }
}
function introInvitados(d){
  const v=d.getElementById('invitados'),h=v?.querySelector(':scope > h2');if(!v||!h)return;
  let p=v.querySelector(':scope > .guest-invitados-intro');
  if(!p){p=d.createElement('p');p.className='small guest-invitados-intro';p.textContent='Preparad la lista, enviad la invitación y mantened cada respuesta conectada con mesas y eventos.';h.after(p)}
}
function recent(d){
  const r=d.getElementById('wsdRecentChanges');if(!r)return;
  const first=r.firstElementChild;if(first&&!first.classList.contains('guest-recent-head'))first.classList.add('guest-recent-head');
}
function patch(){
  let d;try{d=G.f.contentDocument}catch{return}
  if(!d?.body)return;
  style(d);introHoy(d);introInvitados(d);recent(d);
  d.documentElement.dataset.guestB72='1';
}
G.f.addEventListener('load',()=>{[60,180,420,900].forEach(ms=>setTimeout(patch,ms))});
addEventListener('guests-prod-open',patch);
setInterval(patch,650);
patch();
})();