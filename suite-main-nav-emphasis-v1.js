(()=>{
  if(document.getElementById('wsdMainNavEmphasisStyle'))return;
  const s=document.createElement('style');
  s.id='wsdMainNavEmphasisStyle';
  s.textContent=`
    .global{padding:calc(10px + env(safe-area-inset-top)) 14px 13px!important}
    .brandrow{margin-bottom:11px!important}
    .tabs{
      gap:7px!important;
      padding:6px!important;
      border:2px solid var(--line)!important;
      border-radius:18px!important;
      background:color-mix(in srgb,var(--soft) 82%,var(--paper))!important;
      box-shadow:0 4px 14px rgba(44,42,38,.07)!important;
    }
    .tab{
      min-height:56px!important;
      padding:14px 6px!important;
      border:2px solid color-mix(in srgb,var(--dark) 20%,var(--paper))!important;
      border-radius:14px!important;
      background:var(--paper)!important;
      color:var(--dark)!important;
      font-size:15px!important;
      line-height:1!important;
      font-weight:800!important;
      letter-spacing:-.01em!important;
      box-shadow:0 1px 0 rgba(44,42,38,.04)!important;
    }
    .tab.on{
      background:var(--dark)!important;
      color:#fff!important;
      border-color:var(--dark)!important;
      box-shadow:0 5px 14px color-mix(in srgb,var(--dark) 24%,transparent)!important;
    }
    @media(max-width:390px){
      .global{padding-left:10px!important;padding-right:10px!important}
      .tabs{gap:5px!important;padding:5px!important}
      .tab{font-size:14px!important;min-height:54px!important;padding-left:4px!important;padding-right:4px!important}
    }
  `;
  document.head.appendChild(s);
})();
(()=>{if(document.getElementById('wsdWeddingServicesLoader'))return;const s=document.createElement('script');s.id='wsdWeddingServicesLoader';s.src='suite-wedding-services-v1.js?v=2';document.head.appendChild(s)})();
(()=>{
  if(window.__wsdVisibleViewportFixV2)return;
  window.__wsdVisibleViewportFixV2=true;
  const payFrame=document.getElementById('paymentsFrame');
  const guestFrame=document.getElementById('guestsFrame');
  const planningFrame=document.getElementById('planningFrame');
  const shell=document.querySelector('.shell');
  let lastH=0,lastInset=-1;
  function metrics(){
    const vv=window.visualViewport;
    const h=Math.round(vv?.height||window.innerHeight||document.documentElement.clientHeight||0);
    const layout=Math.round(window.innerHeight||h);
    const top=Math.max(0,Math.round(vv?.offsetTop||0));
    const inset=Math.max(0,Math.min(120,layout-h-top));
    return{h,inset};
  }
  function liftNav(d,selector){
    try{
      const n=d?.querySelector(selector);if(!n)return;
      const {inset}=metrics(),cs=d.defaultView?.getComputedStyle(n);
      if(!cs||cs.display==='none')n.style.setProperty('display','grid','important');
      n.style.setProperty('visibility','visible','important');
      n.style.setProperty('opacity','1','important');
      n.style.setProperty('position','fixed','important');
      n.style.setProperty('left','0','important');
      n.style.setProperty('right','0','important');
      n.style.setProperty('bottom',inset+'px','important');
      n.style.setProperty('z-index','2147483000','important');
      if(d.body){const want=88+inset,cur=parseFloat(d.defaultView?.getComputedStyle(d.body)?.paddingBottom)||0;if(cur<want)d.body.style.setProperty('padding-bottom',want+'px','important')}
    }catch{}
  }
  function patchChildren(){
    try{const d=payFrame?.contentDocument;if(d?.body)liftNav(d,'nav')}catch{}
    try{
      const shellDoc=guestFrame?.contentDocument,inner=shellDoc?.getElementById('app'),d=inner?.contentDocument;
      if(d?.body)liftNav(d,'#nav');
    }catch{}
    try{const d=planningFrame?.contentDocument;if(d?.body)liftNav(d,'.nav')}catch{}
  }
  function fit(){
    const {h,inset}=metrics();
    if(shell&&h>320&&(h!==lastH||inset!==lastInset)){
      shell.style.setProperty('height',h+'px','important');
      shell.style.setProperty('max-height',h+'px','important');
      document.documentElement.style.setProperty('height',h+'px','important');
      document.body.style.setProperty('height',h+'px','important');
      lastH=h;lastInset=inset;
    }
    patchChildren();
  }
  [payFrame,guestFrame,planningFrame].forEach(f=>f?.addEventListener('load',()=>{setTimeout(fit,30);setTimeout(fit,250);setTimeout(fit,900)}));
  window.visualViewport?.addEventListener('resize',fit);
  window.visualViewport?.addEventListener('scroll',fit);
  addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,120));
  fit();[80,250,700,1600,3500].forEach(ms=>setTimeout(fit,ms));
  setInterval(patchChildren,1500);
})();
