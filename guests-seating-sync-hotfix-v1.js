(()=>{
  const CORE_ID='app';
  const MARK='wsdSeatingSyncHotfixV1';

  function restoreView(frame,view,scrollY){
    const finish=()=>{
      try{
        const doc=frame.contentDocument;
        const win=frame.contentWindow;
        const tab=doc?.querySelector(`#nav [data-go="${view}"]`);
        if(tab)tab.click();
        if(win&&Number.isFinite(scrollY))requestAnimationFrame(()=>win.scrollTo(0,scrollY));
      }catch(err){console.warn('[WSD seating sync restore]',err)}
    };
    setTimeout(finish,0);
    setTimeout(finish,120);
  }

  function reloadCoreFromCanonicalState(frame,view,scrollY){
    if(!frame||frame.dataset.wsdSeatingSyncReloading==='1')return;
    frame.dataset.wsdSeatingSyncReloading='1';
    const onLoad=()=>{
      frame.removeEventListener('load',onLoad);
      frame.dataset.wsdSeatingSyncReloading='0';
      hookCore();
      restoreView(frame,view,scrollY);
    };
    frame.addEventListener('load',onLoad);
    try{
      const current=frame.getAttribute('src')||frame.src;
      const url=new URL(current,location.href);
      url.searchParams.set('_seatingSync',Date.now().toString(36));
      frame.src=url.href;
    }catch(err){
      frame.removeEventListener('load',onLoad);
      frame.dataset.wsdSeatingSyncReloading='0';
      console.warn('[WSD seating sync reload]',err);
    }
  }

  function hookCore(){
    const frame=document.getElementById(CORE_ID);
    if(!frame)return;
    try{
      const doc=frame.contentDocument;
      if(!doc||!doc.documentElement||doc.documentElement.dataset[MARK]==='1')return;
      const back=doc.getElementById('planBack');
      const plan=doc.getElementById('plan');
      if(!back||!plan)return;
      doc.documentElement.dataset[MARK]='1';

      // Capture at document level so this runs BEFORE the frozen core's
      // #planBack handler. That handler calls render(), and render() saves its
      // old in-memory snapshot. Letting it run would overwrite the seating
      // changes the visual plan has just written to canonical localStorage.
      doc.addEventListener('click',e=>{
        const target=e.target?.closest?.('#planBack');
        if(!target||!plan.classList.contains('on'))return;
        const active=doc.querySelector('#nav [data-go].on')?.dataset.go||'mesas';
        const y=frame.contentWindow?.scrollY||0;
        e.preventDefault();
        e.stopImmediatePropagation();
        reloadCoreFromCanonicalState(frame,active,y);
      },true);
    }catch(err){console.warn('[WSD seating sync hook]',err)}
  }

  function start(){
    const frame=document.getElementById(CORE_ID);
    if(!frame)return;
    frame.addEventListener('load',hookCore);
    hookCore();
    const timer=setInterval(hookCore,700);
    setTimeout(()=>clearInterval(timer),30000);
  }

  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();
