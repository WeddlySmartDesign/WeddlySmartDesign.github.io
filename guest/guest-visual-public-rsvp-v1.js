(()=>{
'use strict';
if(window.__guestB73PublicRsvp)return;window.__guestB73PublicRsvp=true;
const CSS=`
:root{--guest-rsvp-shadow:0 12px 34px rgba(44,42,38,.055)}
html[data-guest-b73-public='1'] .wrap{max-width:620px!important;padding:26px 16px calc(70px + env(safe-area-inset-bottom))!important}
html[data-guest-b73-public='1'] #guestRsvpBrand{margin:0 0 24px;color:var(--muted,#706b65)}
html[data-guest-b73-public='1'] #guestRsvpBrand b{display:block;font:750 11px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.16em;color:var(--ink,#2c2a26)}
html[data-guest-b73-public='1'] #guestRsvpBrand span{display:block;margin-top:4px;font-size:11px}
html[data-guest-b73-public='1'] h1{font-size:39px!important;line-height:1.03!important;letter-spacing:-.025em!important;margin-bottom:9px!important}
html[data-guest-b73-public='1'] .lead{font-size:14px!important;line-height:1.55!important;margin-bottom:20px!important}
html[data-guest-b73-public='1'] .card{border-radius:24px!important;padding:19px!important;box-shadow:var(--guest-rsvp-shadow)}
html[data-guest-b73-public='1'] .person{border-radius:19px!important;padding:16px!important;margin:12px 0!important}
html[data-guest-b73-public='1'] .personTitle{font:500 20px/1.15 Georgia,serif!important;margin-bottom:12px!important}
html[data-guest-b73-public='1'] .choiceRow{gap:9px!important}
html[data-guest-b73-public='1'] .choice{min-height:54px!important;border-radius:14px!important;padding:12px 10px!important;font-size:14px!important}
html[data-guest-b73-public='1'] .choice.sel{outline:0!important;background:var(--ink,#2c2a26)!important;color:#fff!important;border-color:var(--ink,#2c2a26)!important}
html[data-guest-b73-public='1'] .details{margin-top:16px!important;padding-top:15px!important}
html[data-guest-b73-public='1'] label{line-height:1.35!important;margin-top:11px!important}
html[data-guest-b73-public='1'] .field{min-height:50px!important;border-radius:14px!important}
html[data-guest-b73-public='1'] .toggle{min-height:50px!important;padding:12px 0!important}
html[data-guest-b73-public='1'] .toggle input{width:24px!important;height:24px!important;flex:0 0 auto}
html[data-guest-b73-public='1'] .custom,html[data-guest-b73-public='1'] .customQ{padding:14px 0!important}
html[data-guest-b73-public='1'] .btn{min-height:54px!important;border-radius:15px!important;font-size:15px!important}
html[data-guest-b73-public='1'] .notice{border-radius:14px!important;padding:13px!important}
html[data-guest-b73-public='1'] .success{padding:32px 0!important}
html[data-guest-b73-public='1'] .success .card{margin-top:18px!important}
html[data-guest-b73-public='1'] .postActions{margin-top:16px!important}
@media(max-width:440px){
 html[data-guest-b73-public='1'] .wrap{padding-left:14px!important;padding-right:14px!important}
 html[data-guest-b73-public='1'] h1{font-size:35px!important}
 html[data-guest-b73-public='1'] .card{padding:17px!important}
 html[data-guest-b73-public='1'] .person{padding:15px!important}
}
@media(max-width:350px){
 html[data-guest-b73-public='1'] .wrap{padding-left:11px!important;padding-right:11px!important}
 html[data-guest-b73-public='1'] .choice{font-size:13px!important}
}
`;
function patch(){
 if(!document.head||!document.body)return;
 let s=document.getElementById('guestB73PublicStyle');if(!s){s=document.createElement('style');s.id='guestB73PublicStyle';s.textContent=CSS;document.head.appendChild(s)}
 document.documentElement.dataset.guestB73Public='1';
 const wrap=document.querySelector('.wrap');if(wrap&&!document.getElementById('guestRsvpBrand')){
   const b=document.createElement('div');b.id='guestRsvpBrand';b.innerHTML='<b>GUEST</b><span>by WeddlySmartDesign</span>';wrap.prepend(b);
 }
}
new MutationObserver(()=>requestAnimationFrame(patch)).observe(document.documentElement,{childList:true,subtree:true});
patch();
})();