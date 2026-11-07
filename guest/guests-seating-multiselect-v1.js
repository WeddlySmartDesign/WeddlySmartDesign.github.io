(()=>{
  const OUTER_ID='app';
  const MARK='wsdSeatingMultiV1';
  function injectPlan(frame){
    try{
      const doc=frame.contentDocument;
      if(!doc||!doc.documentElement||doc.documentElement.dataset[MARK]) return;
      const href=String(frame.contentWindow?.location?.href||'');
      if(!href.includes('guests-v081-visual-seating.html')) return;
      doc.documentElement.dataset[MARK]='1';
      const s=doc.createElement('script');
      s.textContent=`(()=>{
        if(window.__wsdSeatingMultiV1)return;
        window.__wsdSeatingMultiV1=true;
        const chosen=new Set();
        const intro=document.querySelector('#summarySection .summaryIntro .small');
        if(intro) intro.textContent='Toca uno o varios nombres y después toca la mesa de destino.';
        const introBox=document.querySelector('#summarySection .summaryIntro');
        let status=document.getElementById('wsdMultiMoveStatus');
        if(!status&&introBox){
          status=document.createElement('div');
          status.id='wsdMultiMoveStatus';
          status.className='moveNote';
          status.style.marginTop='10px';
          introBox.appendChild(status);
        }
        function tableForCard(card){
          const cards=[...summary.querySelectorAll('.tableSummary')];
          const entries=Object.entries(S.tables);
          const i=cards.indexOf(card);
          return i>=0&&entries[i]?entries[i]:null;
        }
        function guestForChip(chip,card){
          const entry=tableForCard(card);
          if(!entry)return null;
          const [,t]=entry;
          const chips=[...card.querySelectorAll('.guestChip')];
          const i=chips.indexOf(chip);
          const occ=peopleOn(t.name);
          return i>=0&&occ[i]?occ[i][0]:null;
        }
        function paint(message){
          summary.querySelectorAll('.tableSummary').forEach(card=>card.classList.toggle('target',chosen.size>0));
          summary.querySelectorAll('.guestChip').forEach(chip=>chip.classList.remove('selected'));
          if(chosen.size){
            summary.querySelectorAll('.tableSummary').forEach(card=>{
              card.querySelectorAll('.guestChip').forEach(chip=>{
                const gid=guestForChip(chip,card);
                if(gid&&chosen.has(gid))chip.classList.add('selected');
              });
            });
          }
          if(status){
            if(message) status.textContent=message;
            else if(chosen.size===1){
              const gid=[...chosen][0];
              status.textContent=(S.guests[gid]?.name||'1 invitado')+' seleccionado · toca la mesa de destino.';
            }else if(chosen.size>1){
              status.textContent=chosen.size+' invitados seleccionados · toca la mesa de destino.';
            }else status.textContent='';
          }
        }
        summary.addEventListener('click',e=>{
          const chip=e.target.closest('.guestChip');
          const card=e.target.closest('.tableSummary');
          if(!card)return;
          if(chip){
            e.preventDefault();
            e.stopImmediatePropagation();
            moveGuestId=null;
            const gid=guestForChip(chip,card);
            if(!gid)return;
            chosen.has(gid)?chosen.delete(gid):chosen.add(gid);
            paint();
            return;
          }
          if(!chosen.size)return;
          e.preventDefault();
          e.stopImmediatePropagation();
          moveGuestId=null;
          const entry=tableForCard(card);
          if(!entry)return;
          const [,t]=entry;
          const current=peopleOn(t.name).length;
          const incoming=[...chosen].filter(gid=>S.guests[gid]&&S.guests[gid].table!==t.name);
          if(current+incoming.length>t.cap){
            const free=Math.max(0,t.cap-current);
            paint(t.name+': '+(free===1?'solo queda 1 plaza':'solo quedan '+free+' plazas')+'.');
            return;
          }
          chosen.forEach(gid=>{if(S.guests[gid])S.guests[gid].table=t.name});
          chosen.clear();
          render();
          queueMicrotask(()=>paint('Invitados movidos a '+t.name+'.'));
        },true);
        const mo=new MutationObserver(()=>queueMicrotask(()=>paint()));
        mo.observe(summary,{childList:true,subtree:true});
        paint();
      })();`;
      (doc.body||doc.documentElement).appendChild(s);
      s.remove();
    }catch(err){console.warn('[WSD seating multiselect]',err)}
  }
  function hookCore(){
    const outer=document.getElementById(OUTER_ID);
    if(!outer)return;
    try{
      const doc=outer.contentDocument;
      if(!doc)return;
      const plan=doc.getElementById('planFrame');
      if(!plan||plan.dataset.wsdMultiHook==='1')return;
      plan.dataset.wsdMultiHook='1';
      plan.addEventListener('load',()=>injectPlan(plan));
      injectPlan(plan);
    }catch(err){console.warn('[WSD seating hook]',err)}
  }
  function start(){
    const outer=document.getElementById(OUTER_ID);
    if(!outer)return;
    outer.addEventListener('load',hookCore);
    hookCore();
    const timer=setInterval(()=>{
      hookCore();
      try{
        const doc=outer.contentDocument;
        const plan=doc?.getElementById('planFrame');
        if(plan)injectPlan(plan);
      }catch{}
    },1000);
    setTimeout(()=>clearInterval(timer),30000);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();
