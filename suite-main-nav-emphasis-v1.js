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
  if(window.__wsdVisibleViewportFixV3)return;
  window.__wsdVisibleViewportFixV3=true;
  const payFrame=document.getElementById('paymentsFrame');
  const guestFrame=document.getElementById('guestsFrame');
  const planningFrame=document.getElementById('planningFrame');

  function editableFocused(d){
    try{
      const a=d?.activeElement;if(!a)return false;
      const tag=String(a.tagName||'').toLowerCase();
      return tag==='input'||tag==='textarea'||tag==='select'||a.isContentEditable===true;
    }catch{return false}
  }

  function patchNav(d,selector){
    try{
      const n=d?.querySelector(selector);if(!n)return;

      /* Keyboard open: do not move the app navigation into the form area. */
      if(editableFocused(d)){
        n.style.setProperty('display','none','important');
        n.style.removeProperty('z-index');
        return;
      }

      /* Restore navigation after editing. Keep each module's own horizontal
         geometry and stacking order; only anchor it to the visible bottom. */
      const cs=d.defaultView?.getComputedStyle(n);
      if(!cs||cs.display==='none')n.style.setProperty('display','grid','important');
      n.style.setProperty('visibility','visible','important');
      n.style.setProperty('opacity','1','important');
      n.style.setProperty('position','fixed','important');
      n.style.setProperty('top','auto','important');
      n.style.setProperty('bottom','0','important');
      n.style.removeProperty('left');
      n.style.removeProperty('right');
      n.style.removeProperty('z-index');

      /* The previous viewport hotfix could leave an oversized padding after
         the Android keyboard closed. Keep only the normal nav clearance. */
      if(d.body){
        const cur=parseFloat(d.defaultView?.getComputedStyle(d.body)?.paddingBottom)||0;
        if(cur>140)d.body.style.setProperty('padding-bottom','88px','important');
        else if(cur<88)d.body.style.setProperty('padding-bottom','88px','important');
      }
    }catch{}
  }

  function patchChildren(){
    try{const d=payFrame?.contentDocument;if(d?.body)patchNav(d,'nav')}catch{}
    try{
      const shellDoc=guestFrame?.contentDocument,inner=shellDoc?.getElementById('app'),d=inner?.contentDocument;
      if(d?.body)patchNav(d,'#nav');
    }catch{}
    try{const d=planningFrame?.contentDocument;if(d?.body)patchNav(d,'.nav')}catch{}
  }

  /* Never resize the outer shell to visualViewport.height. On Android that
     value collapses when the keyboard opens and was the cause of half-screen
     forms and clipped action buttons. The validated 100dvh shell remains in
     charge of viewport sizing. */
  function clearLegacyShellSizing(){
    try{
      const shell=document.querySelector('.shell');
      shell?.style.removeProperty('height');
      shell?.style.removeProperty('max-height');
      document.documentElement.style.removeProperty('height');
      document.body.style.removeProperty('height');
    }catch{}
  }

  function apply(){clearLegacyShellSizing();patchChildren()}
  [payFrame,guestFrame,planningFrame].forEach(f=>f?.addEventListener('load',()=>{[30,180,500,1000].forEach(ms=>setTimeout(apply,ms))}));
  window.visualViewport?.addEventListener('resize',apply);
  window.visualViewport?.addEventListener('scroll',apply);
  addEventListener('resize',apply);
  addEventListener('orientationchange',()=>setTimeout(apply,120));
  addEventListener('focusin',()=>setTimeout(apply,0),true);
  addEventListener('focusout',()=>setTimeout(apply,120),true);
  apply();[80,250,700,1600].forEach(ms=>setTimeout(apply,ms));
  setInterval(apply,900);
})();
