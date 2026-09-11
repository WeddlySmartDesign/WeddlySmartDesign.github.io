(()=>{
'use strict';
if(window.__wsdPlanningBottomNav)return;window.__wsdPlanningBottomNav=true;
const frame=document.getElementById('planningFrame');if(!frame)return;
function patch(){
  try{
    const d=frame.contentDocument;if(!d?.body)return;
    let s=d.getElementById('wsd-planning-bottom-nav');
    if(!s){s=d.createElement('style');s.id='wsd-planning-bottom-nav';s.textContent=`
      .app{padding-bottom:calc(94px + env(safe-area-inset-bottom))!important}
      .nav{position:fixed!important;top:auto!important;left:50%!important;right:auto!important;bottom:0!important;transform:translateX(-50%)!important;width:min(680px,100%)!important;max-width:680px!important;margin:0!important;padding:8px 7px calc(8px + env(safe-area-inset-bottom))!important;gap:4px!important;background:rgba(255,255,255,.97)!important;backdrop-filter:blur(12px)!important;border-top:1px solid var(--line)!important;z-index:70!important;box-shadow:0 -7px 20px rgba(44,42,38,.05)!important}
      .nav button{min-height:48px!important;border-radius:13px!important;background:transparent!important;border:0!important;font-size:14px!important;color:var(--muted)!important}
      .nav button.on{background:var(--soft)!important;color:var(--dark)!important}
      @media(min-width:680px){.nav button{font-size:14px!important}}
    `;d.head?.appendChild(s)}
  }catch{}
}
function retry(){[25,100,260,650,1400].forEach(ms=>setTimeout(patch,ms))}
frame.addEventListener('load',retry);patch();retry();
})();
