(()=>{
  const OUTER_ID='app';
  const MARK='wsdSeatingUxRepairsV1';
  function injectPlan(frame){
    try{
      const doc=frame.contentDocument;
      if(!doc||!doc.documentElement||doc.documentElement.dataset[MARK])return;
      const href=String(frame.contentWindow?.location?.href||'');
      if(!href.includes('guests-v081-visual-seating.html'))return;
      doc.documentElement.dataset[MARK]='1';
      const s=doc.createElement('script');
      s.textContent=`(()=>{
        if(window.__wsdSeatingUxRepairsV2)return;
        window.__wsdSeatingUxRepairsV2=true;
        const panelEl=document.getElementById('panel');
        const unseatedEl=document.getElementById('unseated');
        const isEn=()=>{try{return localStorage.getItem('weddly_access_lang')==='en'}catch{return false}};
        function cleanDuplicateHint(){
          const card=unseatedEl?.closest('.card');
          if(!card)return;
          const candidates=[...card.querySelectorAll('.hint')].filter(el=>/toca|tap/i.test(String(el.textContent||'')));
          if(!candidates.length)return;
          const keep=candidates[0];
          const wanted=isEn()?'Tap one or more guests to select them and assign them together.':'Toca uno o varios invitados para seleccionarlos y asignarlos juntos.';
          if(String(keep.textContent||'')!==wanted)keep.textContent=wanted;
          candidates.slice(1).forEach(el=>el.remove());
        }
        function ensureDeleteAction(){
          if(!panelEl||!panelEl.querySelector('#objSave')||panelEl.querySelector('#wsdDeleteSelected'))return;
          if(!selectedObj)return;
          const parts=String(selectedObj).split(':'),kind=parts[0],id=parts[1];
          const obj=kind==='t'?S.tables[id]:S.features[id];
          if(!obj)return;
          const wrap=document.createElement('div');
          wrap.style.marginTop='12px';
          const b=document.createElement('button');
          b.type='button';b.id='wsdDeleteSelected';b.className='btn line';b.style.width='100%';
          b.textContent=isEn()?(kind==='t'?'Delete table':'Delete element'):(kind==='t'?'Eliminar mesa':'Eliminar elemento');
          b.onclick=()=>{
            const current=kind==='t'?S.tables[id]:S.features[id];if(!current)return;
            let msg='';
            if(kind==='t'){
              const occ=peopleOn(current.name);
              msg=isEn()?('Delete '+current.name+'?'+(occ.length?' The '+occ.length+' assigned guest'+(occ.length===1?'':'s')+' will become unseated.':'')):('¿Eliminar '+current.name+'?'+(occ.length?' Los '+occ.length+' invitados asignados quedarán sin mesa.':''));
            }else msg=isEn()?('Delete '+current.name+'?'):('¿Eliminar '+current.name+'?');
            if(!confirm(msg))return;
            if(kind==='t'){
              const oldName=current.name;
              Object.values(S.guests).forEach(g=>{if(g.table===oldName)g.table=''});
              delete S.tables[id];
            }else delete S.features[id];
            selectedObj=null;
            closeSheet();
            render();
          };
          wrap.appendChild(b);panelEl.appendChild(wrap);
        }
        function repairCreateAndSeat(){
          if(!panelEl)return;
          const b=panelEl.querySelector('#createAndSeat');
          if(!b||b.dataset.wsdCreateSeatRepair==='1')return;
          b.dataset.wsdCreateSeatRepair='1';
          b.addEventListener('click',e=>{
            e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
            const ids=[...selected].filter(id=>S.guests[id]);
            if(!ids.length){closeSheet();return}
            const name=(document.getElementById('newTName')?.value||'').trim()||nextTableName();
            const raw=Number(document.getElementById('newTCap')?.value||0);
            const cap=Math.max(ids.length,Number.isFinite(raw)&&raw>0?raw:ids.length);
            const tid=createTable(name,cap);
            const t=S.tables[tid];
            ids.forEach(id=>{if(S.guests[id])S.guests[id].table=t.name});
            selected.clear();
            closeSheet();
            render();
          },true);
        }
        function patch(){cleanDuplicateHint();ensureDeleteAction();repairCreateAndSeat()}
        cleanDuplicateHint();
        if(panelEl){
          const mo=new MutationObserver(()=>queueMicrotask(()=>{ensureDeleteAction();repairCreateAndSeat()}));
          mo.observe(panelEl,{childList:true,subtree:true});
        }
        document.addEventListener('click',()=>setTimeout(()=>{ensureDeleteAction();repairCreateAndSeat()},0),true);
        patch();
      })();`;
      (doc.body||doc.documentElement).appendChild(s);s.remove();
    }catch(err){console.warn('[WSD seating UX repairs]',err)}
  }
  function hookCore(){
    const outer=document.getElementById(OUTER_ID);if(!outer)return;
    try{
      const doc=outer.contentDocument;if(!doc)return;
      const plan=doc.getElementById('planFrame');if(!plan)return;
      if(plan.dataset.wsdSeatingUxRepairHook!=='1'){
        plan.dataset.wsdSeatingUxRepairHook='1';
        plan.addEventListener('load',()=>injectPlan(plan));
      }
      injectPlan(plan);
    }catch(err){console.warn('[WSD seating UX hook]',err)}
  }
  function start(){
    const outer=document.getElementById(OUTER_ID);if(!outer)return;
    outer.addEventListener('load',hookCore);hookCore();
    const timer=setInterval(hookCore,1000);setTimeout(()=>clearInterval(timer),30000);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();
