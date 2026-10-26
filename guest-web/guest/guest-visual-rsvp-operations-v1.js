(()=>{
'use strict';
if(window.__guestB73Ops)return;window.__guestB73Ops=true;
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap');
html[data-guest-b73-ops='1'] body{background:var(--bg)}
html[data-guest-b73-ops='1'] .app{max-width:720px;padding:calc(20px + env(safe-area-inset-top)) 18px calc(52px + env(safe-area-inset-bottom));box-shadow:none}
html[data-guest-b73-ops='1'] .top{margin-bottom:16px;align-items:center}
html[data-guest-b73-ops='1'] .brand b{font:750 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.16em}
html[data-guest-b73-ops='1'] .brand span{font:600 17px/1 "Caveat","Segoe Print",cursive;margin-top:4px;color:var(--muted)}
html[data-guest-b73-ops='1'] .topActions .btn{min-height:44px}
html[data-guest-b73-ops='1'] .eyebrow{letter-spacing:.16em}
html[data-guest-b73-ops='1'] h1{font-size:39px;line-height:1.02;letter-spacing:-.025em;margin:5px 0 7px}
html[data-guest-b73-ops='1'] .lead{max-width:560px;margin-bottom:20px}
html[data-guest-b73-ops='1'] .metrics{gap:9px;margin-bottom:16px}
html[data-guest-b73-ops='1'] .metric{border-radius:18px;padding:14px;box-shadow:0 7px 22px rgba(44,42,38,.035)}
html[data-guest-b73-ops='1'] .metric b{font-size:27px;line-height:1}
html[data-guest-b73-ops='1'] .metric span{display:block;margin-top:5px;line-height:1.25}
html[data-guest-b73-ops='1'] .toolbar{gap:7px;margin:0 -2px 16px;padding:2px 2px 5px}
html[data-guest-b73-ops='1'] .filter{min-height:42px;padding:9px 13px}
html[data-guest-b73-ops='1'] .group{margin-top:22px}
html[data-guest-b73-ops='1'] .groupTitle{margin-bottom:9px;letter-spacing:.13em}
html[data-guest-b73-ops='1'] .subgroup{border-radius:20px;box-shadow:0 8px 26px rgba(44,42,38,.035)}
html[data-guest-b73-ops='1'] .subhead{padding:14px 16px}
html[data-guest-b73-ops='1'] .guest{padding:15px 16px}
html[data-guest-b73-ops='1'] .recipientCheck{width:24px;height:24px}
html[data-guest-b73-ops='1'] .manualLink{min-height:40px;padding:8px 0}
html[data-guest-b73-ops='1'] .sendBox{border-radius:16px;padding:14px}
html[data-guest-b73-ops='1'] .contactBtn{min-height:48px;border-radius:14px}
html[data-guest-b73-ops='1'] .btn{min-height:46px;border-radius:14px}
html[data-guest-b73-ops='1'] .btn.mini{min-height:44px}
html[data-guest-b73-ops='1'] .smallSelect{min-height:46px}
html[data-guest-b73-ops='1'] .panel{border-radius:28px 28px 0 0;padding:24px 18px calc(28px + env(safe-area-inset-bottom))}
html[data-guest-b73-ops='1'] .field{min-height:50px;border-radius:14px}
html[data-guest-b73-ops='1'] .wsd-flow button{min-height:43px!important}
@media(max-width:480px){
 html[data-guest-b73-ops='1'] .app{padding-left:15px;padding-right:15px}
 html[data-guest-b73-ops='1'] h1{font-size:35px}
 html[data-guest-b73-ops='1'] .top{align-items:flex-start}
 html[data-guest-b73-ops='1'] .topActions{gap:5px}
 html[data-guest-b73-ops='1'] .topActions .btn{padding:10px 11px;font-size:12px}
 html[data-guest-b73-ops='1'] .metrics{grid-template-columns:repeat(3,minmax(0,1fr))}
 html[data-guest-b73-ops='1'] .metric{padding:12px 10px}
 html[data-guest-b73-ops='1'] .metric b{font-size:24px}
 html[data-guest-b73-ops='1'] .metric span{font-size:10px}
 html[data-guest-b73-ops='1'] .guest{padding:14px}
 html[data-guest-b73-ops='1'] .assignment,html[data-guest-b73-ops='1'] .sendBox{margin-left:0}
}
@media(max-width:350px){
 html[data-guest-b73-ops='1'] .app{padding-left:12px;padding-right:12px}
 html[data-guest-b73-ops='1'] .metrics{gap:6px}
 html[data-guest-b73-ops='1'] .metric{padding:11px 8px}
 html[data-guest-b73-ops='1'] .metric span{font-size:9px}
}
@media(min-width:760px){
 html[data-guest-b73-ops='1'] .app{max-width:760px;padding:30px 28px 54px}
 html[data-guest-b73-ops='1'] .sheet{align-items:center;padding:24px}
 html[data-guest-b73-ops='1'] .panel{width:min(680px,calc(100vw - 48px));max-width:680px;margin:auto;border-radius:28px;max-height:86dvh}
}
html[data-guest-b73-ops='1'] button:focus-visible,
html[data-guest-b73-ops='1'] a:focus-visible,
html[data-guest-b73-ops='1'] input:focus-visible,
html[data-guest-b73-ops='1'] select:focus-visible,
html[data-guest-b73-ops='1'] textarea:focus-visible{outline:3px solid rgba(82,92,67,.30);outline-offset:2px}
@media(prefers-reduced-motion:reduce){
 html[data-guest-b73-ops='1'] *,html[data-guest-b73-ops='1'] *::before,html[data-guest-b73-ops='1'] *::after{scroll-behavior:auto!important}
 html[data-guest-b73-ops='1'] .btn,html[data-guest-b73-ops='1'] .panel{transition:none!important;animation:none!important}
}
`;
function patch(){
 if(!document.head||!document.body)return;
 let s=document.getElementById('guestB73OpsStyle');if(!s){s=document.createElement('style');s.id='guestB73OpsStyle';s.textContent=CSS;document.head.appendChild(s)}
 document.documentElement.dataset.guestB73Ops='1';
 const lead=document.querySelector('.app>.lead'),copy='Selecciona destinatarios, envía la invitación y revisa las respuestas desde un mismo sitio.';if(lead&&document.documentElement.lang!=='en'&&lead.textContent!==copy)lead.textContent=copy;
 const brand=document.querySelector('.brand');if(brand&&!brand.querySelector('span')?.textContent?.includes('WeddlySmartDesign'))brand.innerHTML='<b>GUEST</b><span>by WeddlySmartDesign</span>';
}
let raf=0;new MutationObserver(()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;patch()})}).observe(document.documentElement,{childList:true,subtree:true});
patch();
})();