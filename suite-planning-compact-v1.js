(()=>{
'use strict';
if(window.__wsdPlanningCompactUx)return;window.__wsdPlanningCompactUx=true;
const frame=document.getElementById('planningFrame');if(!frame)return;
function patch(){
  try{
    const d=frame.contentDocument;if(!d?.body)return;
    if(!d.getElementById('wsd-planning-compact-style')){
      const s=d.createElement('style');s.id='wsd-planning-compact-style';s.textContent=`
        .hero{padding:16px 18px!important;border-radius:18px!important;margin-bottom:10px!important;box-shadow:0 8px 22px rgba(44,42,38,.035)!important}
        .hero h1{font-size:28px!important;line-height:1.04!important;margin:4px 0 6px!important}
        .hero p{font-size:13px!important;line-height:1.4!important;margin:0!important}
        .count{margin-top:11px!important;gap:6px!important}
        .count strong{font-size:32px!important}
        .count span{font-size:12px!important}
        .nextEvent{margin-top:11px!important;padding-top:10px!important}
        .nextEvent b{font-size:13px!important}.nextEvent small{font-size:11.5px!important}
        body.wsd-planning-secondary .hero{display:none!important}
        body.wsd-planning-secondary .top{padding-bottom:8px!important}
        body.wsd-planning-secondary .view.on{padding-top:4px!important}
        .stats{gap:9px!important}
        .stats .stat{background:#fff!important;border:1px solid #d8d0c5!important;box-shadow:0 5px 16px rgba(44,42,38,.055)!important}
        .stats .stat strong{color:var(--dark)!important}
        @media(max-width:679px){
          .hero{padding:15px 16px!important}.hero h1{font-size:26px!important}.hero p{font-size:12.5px!important}
          .count strong{font-size:30px!important}.nextEvent{display:none!important}
          .stats .stat{padding:15px 13px!important}
        }
      `;d.head?.appendChild(s)
    }
    const sync=()=>{const active=d.querySelector('.nav button.on[data-view]')?.dataset.view||'now';d.body.classList.toggle('wsd-planning-secondary',active!=='now')};
    if(!d.documentElement.dataset.wsdPlanningCompactHook){
      d.documentElement.dataset.wsdPlanningCompactHook='1';
      d.querySelector('.nav')?.addEventListener('click',()=>requestAnimationFrame(sync),true);
      const nav=d.querySelector('.nav');if(nav)new MutationObserver(sync).observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});
    }
    sync();
  }catch{}
}
function retry(){[20,80,220,520,1100].forEach(ms=>setTimeout(patch,ms))}
frame.addEventListener('load',retry);patch();retry();
})();
