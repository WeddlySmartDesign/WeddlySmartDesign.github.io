(()=>{
'use strict';
if(window.__guestVisualExtraEventsV1)return;window.__guestVisualExtraEventsV1=true;
const CSS=`
:root{--guest-shadow:0 10px 30px rgba(44,42,38,.055)}
.wrap{padding-top:20px!important}
.brand{display:flex!important;align-items:baseline!important;gap:8px!important;min-height:27px!important;color:var(--dark)!important}
.brand b{font:750 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif!important;letter-spacing:.16em!important}
.brand span{font:600 17px/1 "Caveat","Segoe Print",cursive!important;color:var(--muted)!important;margin:0!important}
.eyebrow{letter-spacing:.145em!important;font-size:10px!important}
main.wrap>h1{font-size:36px!important;letter-spacing:-.025em!important;margin:6px 0 8px!important;max-width:560px}
main.wrap>.lead{font-size:14px!important;max-width:610px}
#status{
  display:inline-flex!important;align-items:center!important;min-height:28px!important;
  margin-top:13px!important;padding:5px 9px!important;border-radius:999px!important;
  background:#EAEDE5!important;color:var(--dark)!important;font-size:11px!important;font-weight:780!important
}
#app>.card.hero.guest-event-empty{
  padding:21px!important;margin-top:18px!important;border-radius:22px!important;
  box-shadow:var(--guest-shadow)!important
}
#app>.card.hero.guest-event-empty h2{font-size:25px!important;margin-bottom:7px!important}
#app>.card.hero.guest-event-empty .lead{font-size:14px!important}
#app>.card.hero.guest-event-empty .actions{display:grid!important;grid-template-columns:1fr!important}
#app>.card.hero.guest-event-empty #activate{width:100%!important}

.eventTabs{
  gap:7px!important;margin:18px 0 13px!important;padding:2px 1px 5px!important;
  scrollbar-width:none
}
.eventTabs::-webkit-scrollbar{display:none}
.eventTabs .btn{min-height:44px!important;border-radius:999px!important;padding:9px 13px!important;font-size:12px!important}
.eventTabs .btn.on{box-shadow:0 5px 14px rgba(44,42,38,.12)!important}
#app>.card.guest-event-details{margin-top:0!important;padding:18px!important;box-shadow:none!important}
#app>.card.guest-event-details .field label{font-size:12px!important}
#app>.card.guest-event-details .actions{margin-top:16px!important}
#app>.card.guest-event-details .actions .btn{min-height:44px!important;font-size:12px!important}
#disable.guest-event-activate{background:var(--soft)!important;color:var(--dark)!important;border-color:var(--line)!important}
#disable.guest-event-deactivate{background:transparent!important;color:#8A493E!important;border-color:#DDBCB5!important}

.summary.guest-event-summary{grid-template-columns:1fr!important;margin:12px 0 0!important}
.summary.guest-event-summary .stat{padding:15px 17px!important;border-radius:18px!important;background:#F8F5F0!important}
.summary.guest-event-summary .stat strong{font:650 29px/1 system-ui,-apple-system,"Segoe UI",sans-serif!important;letter-spacing:-.035em!important}
.summary.guest-event-summary .stat span{font-size:12px!important;font-weight:720!important}

.sectionTitle.guest-event-guests-title{margin-top:24px!important;align-items:flex-start!important}
.sectionTitle.guest-event-guests-title h2,
#wsdEventInviteSection .sectionTitle h2{font-size:25px!important;margin-bottom:5px!important}
.sectionTitle.guest-event-guests-title p,
#wsdEventInviteSection .sectionTitle p{font-size:13px!important;margin-top:0!important}
#guestListCard,.guest-event-guest-card{box-shadow:none!important;padding:17px!important}
#wsdEventGuestCompact{border:1px solid var(--line)!important;background:#F5F2EC!important;border-radius:16px!important;padding:13px!important}
#wsdEventGuestCompact button{min-height:42px!important;border-radius:12px!important}
#wsdEventGroupTools{
  margin:0 0 13px!important;padding:13px!important;border:1px solid var(--line)!important;
  border-radius:15px!important;background:#FBF8F3!important
}
#wsdEventGroupTools>label{display:block;font-size:11px!important;font-weight:800!important;letter-spacing:.02em;color:var(--muted)!important;margin-bottom:6px!important}
#wsdEventGroupSelect{width:100%!important;min-height:46px!important;border:1px solid var(--line)!important;border-radius:12px!important;background:#fff!important;padding:9px 11px!important;font-size:14px!important}
.wsd-eg-group-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin-top:8px!important}
.wsd-eg-group-actions button{min-height:42px!important;border-radius:12px!important}
#guestList .guest{padding:12px 0!important}
#guestList .guest input{width:24px!important;height:24px!important}

#wsdEventInviteSection{margin-top:26px!important}
#wsdEventInviteSection>.sectionTitle{margin-bottom:8px!important}
#wsdEventInviteSection .inviteCard{
  padding:18px!important;border-radius:20px!important;box-shadow:none!important;background:#fff!important
}
#wsdEventInviteSection .inviteHeroLine h3{font:500 19px/1.16 Georgia,serif!important}
#wsdEventInviteSection #inviteEdit{min-height:44px!important}
#wsdEventInviteSection .inviteStats{gap:8px!important}
#wsdEventInviteSection .inviteStat{border-radius:14px!important;padding:11px!important;background:#F5F2EC!important}
#wsdEventInviteSection .inviteStat b{font:650 22px/1 system-ui,-apple-system,"Segoe UI",sans-serif!important}
#wsdEventInviteSection .inviteRecipient{padding:14px 0!important}
#wsdEventInviteSection .inviteRecipientBtns .btn{min-height:42px!important;border-radius:12px!important}
#wsdEventInviteSection .empty{background:#FBF8F3!important}

.sheet,.inviteSheet{backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
.sheetCard,.inviteSheetCard{border-radius:28px 28px 0 0!important;box-shadow:0 -14px 48px rgba(44,42,38,.12)!important}
.sheetActions .btn,.inviteSheetActions .btn{min-height:48px!important}
@media(max-width:520px){
  main.wrap>h1{font-size:33px!important}
  #app>.card.guest-event-details{padding:16px!important}
  .eventTabs{margin-left:-2px!important;margin-right:-2px!important}
  #wsdEventInviteSection .inviteRecipientBtns{display:grid!important;grid-template-columns:1fr!important}
  #wsdEventInviteSection .inviteRecipientBtns .btn{width:100%!important}
}
@media(max-width:350px){
  .wrap{padding-left:13px!important;padding-right:13px!important}
  main.wrap>h1{font-size:31px!important}
  .wsd-eg-group-actions{grid-template-columns:1fr!important}
}
`;

function style(){
  let s=document.getElementById('guestVisualExtraEventsV1');
  if(!s){s=document.createElement('style');s.id='guestVisualExtraEventsV1';s.textContent=CSS;document.head.appendChild(s)}
}
function brand(){
  const b=document.querySelector('main.wrap>.brand');if(!b)return;
  const good=b.children.length===2&&b.children[0]?.tagName==='B'&&b.children[0]?.textContent.trim()==='GUEST'&&b.children[1]?.tagName==='SPAN';
  if(!good)b.innerHTML='<b>GUEST</b><span>by WeddlySmartDesign</span>';
}
function empty(){
  const hero=document.querySelector('#app>.card.hero');if(!hero)return;
  hero.classList.add('guest-event-empty');
  const p=hero.querySelector('.lead'),txt='Activad solo los eventos que necesitéis. Cada uno tendrá sus invitados y confirmaciones separadas.';
  if(p&&p.textContent!==txt)p.textContent=txt;
}
function active(){
  const app=document.getElementById('app');if(!app)return;
  const tabs=app.querySelector('.eventTabs');
  const details=tabs?.nextElementSibling;
  if(details?.classList.contains('card'))details.classList.add('guest-event-details');
  const disable=app.querySelector('#disable');
  if(disable){
    const on=/^Activar$/i.test((disable.textContent||'').trim());
    disable.classList.toggle('guest-event-activate',on);
    disable.classList.toggle('guest-event-deactivate',!on);
  }
  const summary=app.querySelector('.summary');if(summary)summary.classList.add('guest-event-summary');
  const guestTitle=[...app.querySelectorAll('.sectionTitle')].find(x=>/Lista de invitados|Guest list/i.test(x.textContent||''));
  if(guestTitle){
    guestTitle.classList.add('guest-event-guests-title');
    const card=guestTitle.nextElementSibling;if(card?.classList.contains('card'))card.classList.add('guest-event-guest-card');
  }
}
function patch(){
  style();brand();empty();active();
  document.documentElement.dataset.guestB75='1';
}
let raf=0;
new MutationObserver(()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;patch()})}).observe(document.documentElement,{childList:true,subtree:true});
addEventListener('load',()=>{[0,80,240,650].forEach(ms=>setTimeout(patch,ms))});
setInterval(patch,750);patch();
})();