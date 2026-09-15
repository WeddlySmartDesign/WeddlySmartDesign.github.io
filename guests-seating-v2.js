(()=>{
  const OUTER_ID='app';
  const MARK='wsdSeatingV2';

  function install(){
    if(window.__wsdSeatingV2)return;
    window.__wsdSeatingV2=true;

    const chosen=new Set();
    const panelEl=document.getElementById('panel');
    const unseatedEl=document.getElementById('unseated');
    const summaryEl=document.getElementById('summary');
    const summaryIntro=document.querySelector('#summarySection .summaryIntro');
    const isEn=()=>{try{return localStorage.getItem('weddly_access_lang')==='en'}catch{return false}};

    function fixPlanLayer(){
      try{
        const pd=window.parent.document;
        const plan=pd.getElementById('plan');
        if(plan){
          plan.style.setProperty('z-index','2147483640','important');
          plan.style.setProperty('inset','0','important');
        }
      }catch{}
    }

    function removeLegacyTip(){
      document.getElementById('v127tip')?.remove();
    }

    function tableForCard(card){
      const cards=[...summaryEl.querySelectorAll('.tableSummary')];
      const entries=Object.entries(S.tables);
      const i=cards.indexOf(card);
      return i>=0&&entries[i]?entries[i]:null;
    }

    function guestForChip(chip,card){
      const entry=tableForCard(card);if(!entry)return null;
      const [,t]=entry;
      const chips=[...card.querySelectorAll('.guestChip')];
      const i=chips.indexOf(chip),occ=peopleOn(t.name);
      return i>=0&&occ[i]?occ[i][0]:null;
    }

    let status=document.getElementById('wsdMultiMoveStatus');
    let actionRow=document.getElementById('wsdMultiMoveActions');
    if(summaryIntro){
      if(!status){
        status=document.createElement('div');
        status.id='wsdMultiMoveStatus';
        status.className='moveNote';
        status.style.marginTop='10px';
        summaryIntro.appendChild(status);
      }
      if(!actionRow){
        actionRow=document.createElement('div');
        actionRow.id='wsdMultiMoveActions';
        actionRow.style.cssText='display:none;gap:8px;flex-wrap:wrap;margin-top:10px';
        actionRow.innerHTML='<button type="button" class="btn" id="wsdCreateTableForChosen"></button><button type="button" class="btn soft" id="wsdClearChosen"></button>';
        summaryIntro.appendChild(actionRow);
        const createBtn=actionRow.querySelector('#wsdCreateTableForChosen');
        const clearBtn=actionRow.querySelector('#wsdClearChosen');
        createBtn.textContent=isEn()?'Create new table':'Crear mesa nueva';
        clearBtn.textContent=isEn()?'Cancel selection':'Cancelar selección';
        clearBtn.onclick=()=>{chosen.clear();paint()};
        createBtn.onclick=()=>openCreateForChosen();
      }
    }

    function paint(message){
      if(!summaryEl)return;
      summaryEl.querySelectorAll('.tableSummary').forEach(card=>card.classList.toggle('target',chosen.size>0));
      summaryEl.querySelectorAll('.guestChip').forEach(chip=>chip.classList.remove('selected'));
      if(chosen.size){
        summaryEl.querySelectorAll('.tableSummary').forEach(card=>{
          card.querySelectorAll('.guestChip').forEach(chip=>{
            const gid=guestForChip(chip,card);
            if(gid&&chosen.has(gid))chip.classList.add('selected');
          });
        });
      }
      if(actionRow)actionRow.style.display=chosen.size?'flex':'none';
      if(status){
        if(message)status.textContent=message;
        else if(chosen.size===1){
          const gid=[...chosen][0];
          status.textContent=(S.guests[gid]?.name||'1 invitado')+(isEn()?' selected · tap the destination table.':' seleccionado · toca la mesa de destino.');
        }else if(chosen.size>1){
          status.textContent=chosen.size+(isEn()?' guests selected · tap the destination table or create a new one.':' invitados seleccionados · toca la mesa de destino o crea una nueva.');
        }else status.textContent='';
      }
    }

    function openCreateForChosen(){
      const ids=[...chosen].filter(id=>S.guests[id]);
      const n=ids.length;if(!n)return;
      const title=isEn()?'Create table and move':'Crear mesa y mover';
      const nameLabel=isEn()?'Name':'Nombre';
      const capLabel=isEn()?'Capacity':'Capacidad';
      const cancel=isEn()?'Cancel':'Cancelar';
      const create=isEn()?'Create and move':'Crear y mover';
      openSheet('<h2>'+title+' '+n+'</h2><label>'+nameLabel+'</label><input id="wsdChosenTName" class="field"><label>'+capLabel+'</label><input id="wsdChosenTCap" class="field" type="number" min="'+n+'" value="'+Math.max(8,n)+'"><div id="wsdChosenTErr" class="moveNote"></div><div class="actions"><button class="btn soft" id="wsdChosenCancel">'+cancel+'</button><button class="btn" id="wsdChosenCreate">'+create+'</button></div>');
      const nameInput=document.getElementById('wsdChosenTName');
      const capInput=document.getElementById('wsdChosenTCap');
      const err=document.getElementById('wsdChosenTErr');
      if(nameInput)nameInput.value=nextTableName();
      document.getElementById('wsdChosenCancel').onclick=closeSheet;
      document.getElementById('wsdChosenCreate').onclick=()=>{
        const name=(nameInput?.value||'').trim()||nextTableName();
        const raw=Number(capInput?.value||0);
        const cap=Math.max(n,Number.isFinite(raw)&&raw>0?raw:n);
        const exists=Object.values(S.tables).some(t=>String(t.name||'').trim().toLowerCase()===name.toLowerCase());
        if(exists){if(err)err.textContent=isEn()?'A table with that name already exists.':'Ya existe una mesa con ese nombre.';return}
        const tid=createTable(name,cap),t=S.tables[tid];
        ids.forEach(id=>{if(S.guests[id])S.guests[id].table=t.name});
        chosen.clear();closeSheet();render();
      };
    }

    if(summaryEl){
      summaryEl.addEventListener('click',e=>{
        const chip=e.target.closest('.guestChip');
        const card=e.target.closest('.tableSummary');
        if(!card)return;
        if(chip){
          e.preventDefault();e.stopImmediatePropagation();moveGuestId=null;
          const gid=guestForChip(chip,card);if(!gid)return;
          chosen.has(gid)?chosen.delete(gid):chosen.add(gid);paint();return;
        }
        if(!chosen.size)return;
        e.preventDefault();e.stopImmediatePropagation();moveGuestId=null;
        const entry=tableForCard(card);if(!entry)return;
        const [,t]=entry,current=peopleOn(t.name).length;
        const incoming=[...chosen].filter(gid=>S.guests[gid]&&S.guests[gid].table!==t.name);
        if(current+incoming.length>t.cap){
          const free=Math.max(0,t.cap-current);
          paint(t.name+': '+(isEn()?(free===1?'only 1 seat left':'only '+free+' seats left'):(free===1?'solo queda 1 plaza':'solo quedan '+free+' plazas'))+'.');
          return;
        }
        chosen.forEach(gid=>{if(S.guests[gid])S.guests[gid].table=t.name});
        chosen.clear();render();queueMicrotask(()=>paint(isEn()?'Guests moved to '+t.name+'.':'Invitados movidos a '+t.name+'.'));
      },true);
      const mo=new MutationObserver(()=>queueMicrotask(()=>paint()));
      mo.observe(summaryEl,{childList:true,subtree:true});
    }

    function ensureDeleteAction(){
      if(!panelEl||!panelEl.querySelector('#objSave')||panelEl.querySelector('#wsdDeleteSelected')||!selectedObj)return;
      const [kind,id]=String(selectedObj).split(':'),obj=kind==='t'?S.tables[id]:S.features[id];if(!obj)return;
      const wrap=document.createElement('div');wrap.style.marginTop='12px';
      const b=document.createElement('button');b.type='button';b.id='wsdDeleteSelected';b.className='btn line';b.style.width='100%';
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
          const old=current.name;Object.values(S.guests).forEach(g=>{if(g.table===old)g.table=''});delete S.tables[id];
        }else delete S.features[id];
        selectedObj=null;closeSheet();render();
      };
      wrap.appendChild(b);panelEl.appendChild(wrap);
    }

    function applyTableShape(o,nextType){
      const oldType=o.type||'round';
      if(nextType===oldType)return;
      const oldW=Math.max(1,Number(o.w)||150),oldH=Math.max(1,Number(o.h)||150);
      const cx=(Number(o.x)||0)+oldW/2,cy=(Number(o.y)||0)+oldH/2;
      let w=oldW,h=oldH;
      if(nextType==='round'){
        const side=Math.max(110,Math.min(260,Math.sqrt(oldW*oldH)));
        w=side;h=side;
      }else if(oldType==='round'){
        const area=Math.max(12000,oldW*oldH);
        w=Math.max(160,Math.min(340,Math.sqrt(area*1.9)));
        h=Math.max(90,Math.min(220,w/1.9));
      }
      o.type=nextType;o.w=Math.round(w);o.h=Math.round(h);
      o.x=Math.round(cx-o.w/2);o.y=Math.round(cy-o.h/2);
    }

    function ensureTableShapeEditor(){
      if(!panelEl||!selectedObj||panelEl.querySelector('#wsdTableShapeEditor'))return;
      const saveBtn=panelEl.querySelector('#objSave');if(!saveBtn)return;
      const [kind,id]=String(selectedObj).split(':');if(kind!=='t')return;
      const table=S.tables[id];if(!table)return;
      let chosenType=['round','rect','pres'].includes(table.type)?table.type:'round';
      const box=document.createElement('div');box.id='wsdTableShapeEditor';
      box.innerHTML='<label>'+(isEn()?'Shape':'Forma')+'</label><div class="typeRow"><button type="button" class="typeBtn" data-wsd-shape="round">'+(isEn()?'Round':'Redonda')+'</button><button type="button" class="typeBtn" data-wsd-shape="rect">'+(isEn()?'Rectangular':'Rectangular')+'</button><button type="button" class="typeBtn" data-wsd-shape="pres">'+(isEn()?'Head table':'Presidencial')+'</button></div>';
      const cap=panelEl.querySelector('#objCap'),anchor=cap?.previousElementSibling||cap||panelEl.querySelector('.rotateRow');
      if(anchor)panelEl.insertBefore(box,anchor);else panelEl.insertBefore(box,saveBtn.parentElement||saveBtn);
      const buttons=[...box.querySelectorAll('[data-wsd-shape]')];
      const refresh=()=>buttons.forEach(b=>b.classList.toggle('sel',b.dataset.wsdShape===chosenType));
      buttons.forEach(b=>b.onclick=e=>{e.preventDefault();chosenType=b.dataset.wsdShape;refresh()});
      refresh();
      saveBtn.addEventListener('click',()=>applyTableShape(table,chosenType),true);
    }

    function repairCreateAndSeat(){
      if(!panelEl)return;
      const b=panelEl.querySelector('#createAndSeat');
      if(!b||b.dataset.wsdCreateSeatV2==='1')return;
      b.dataset.wsdCreateSeatV2='1';
      b.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
        const ids=[...selected].filter(id=>S.guests[id]);if(!ids.length)return;
        const nameInput=document.getElementById('newTName'),capInput=document.getElementById('newTCap');
        const name=(nameInput?.value||'').trim()||nextTableName();
        const exists=Object.values(S.tables).some(t=>String(t.name||'').trim().toLowerCase()===name.toLowerCase());
        if(exists){
          let err=panelEl.querySelector('#wsdCreateSeatErr');
          if(!err){err=document.createElement('div');err.id='wsdCreateSeatErr';err.className='moveNote';b.parentElement?.parentElement?.insertBefore(err,b.parentElement)}
          err.textContent=isEn()?'A table with that name already exists.':'Ya existe una mesa con ese nombre.';return;
        }
        const raw=Number(capInput?.value||0),cap=Math.max(ids.length,Number.isFinite(raw)&&raw>0?raw:ids.length);
        const tid=createTable(name,cap),t=S.tables[tid];
        ids.forEach(id=>{if(S.guests[id])S.guests[id].table=t.name});
        selected.clear();closeSheet();render();
      },true);
    }

    function patchPanel(){ensureTableShapeEditor();ensureDeleteAction();repairCreateAndSeat()}
    if(panelEl){
      const mo=new MutationObserver(()=>queueMicrotask(patchPanel));
      mo.observe(panelEl,{childList:true,subtree:true});
    }
    document.addEventListener('click',()=>setTimeout(patchPanel,0),true);

    fixPlanLayer();removeLegacyTip();patchPanel();paint();
    [0,80,250,700,1500].forEach(ms=>setTimeout(()=>{fixPlanLayer();removeLegacyTip()},ms));
  }

  function injectPlan(frame){
    try{
      const doc=frame.contentDocument;
      if(!doc||!doc.documentElement||doc.documentElement.dataset[MARK])return;
      const href=String(frame.contentWindow?.location?.href||'');
      if(!href.includes('guests-v081-visual-seating.html'))return;
      doc.documentElement.dataset[MARK]='1';
      const s=doc.createElement('script');
      s.textContent='('+install.toString()+')();';
      (doc.body||doc.documentElement).appendChild(s);s.remove();
    }catch(err){console.warn('[WSD seating v2]',err)}
  }

  function hookCore(){
    const outer=document.getElementById(OUTER_ID);if(!outer)return;
    try{
      const doc=outer.contentDocument;if(!doc)return;
      const plan=doc.getElementById('planFrame');if(!plan)return;
      if(plan.dataset.wsdSeatingV2Hook!=='1'){
        plan.dataset.wsdSeatingV2Hook='1';
        plan.addEventListener('load',()=>injectPlan(plan));
      }
      injectPlan(plan);
    }catch(err){console.warn('[WSD seating v2 hook]',err)}
  }

  function start(){
    const outer=document.getElementById(OUTER_ID);if(!outer)return;
    outer.addEventListener('load',hookCore);hookCore();
    const timer=setInterval(hookCore,1000);setTimeout(()=>clearInterval(timer),30000);
  }

  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();
