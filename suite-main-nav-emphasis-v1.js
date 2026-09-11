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
