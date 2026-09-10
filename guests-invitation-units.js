(()=>{
  const G=window.__GuestsProd;if(!G)return;
  const KEY='weddly_guests_qa_v67';
  let pending=null;
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{guests:{}}}catch{return{guests:{}}}};
  const write=s=>{try{localStorage.setItem(KEY,JSON.stringify(s));return true}catch{return false}};
  const uid=()=>`iu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
  function docs(){const out=[];try{let d=G.f.contentDocument;for(let i=0;i<8&&d;i++){out.push(d);const f=d.querySelector('iframe');if(!f||!f.contentDocument)break;d=f.contentDocument}}catch{}return out}
  const appDoc=()=>docs().find(d=>d.getElementById('invitados')&&d.getElementById('sheet')&&d.getElementById('panel'))||null;
  function reload(){try{G.f.src=G.APP+'&inviteunits='+Date.now();G.f.style.display='block';G.boot.style.display='none';dispatchEvent(new Event('guests-prod-open'))}catch{}}
  function applyUnit(ids,mode,label=''){
    if(!ids?.length)return;
    const S=read();S.guests=S.guests||{};
    if(mode==='together'){
      const u=uid();
      ids.forEach(id=>{const g=S.guests[id];if(!g)return;g.invitationUnitId=u;g.invitationUnitLabel=label.trim()});
    }else{
      ids.forEach(id=>{const g=S.guests[id];if(!g)return;g.invitationUnitId=uid();g.invitationUnitLabel=g.name||''});
    }
    if(write(S))reload();
  }
  function createdIds(before){const S=read(),b=new Set(before||[]);return Object.keys(S.guests||{}).filter(id=>!b.has(id))}
  function finishPending(){
    if(!pending)return;
    const ids=pending.ids?.length?pending.ids:createdIds(pending.before);
    if(!ids.length)return;
    const p=pending;pending=null;applyUnit(ids,p.mode,p.label)
  }
  function choiceUi(d){
    const names=d.getElementById('names');if(!names||d.getElementById('wsdInviteUnitChoice'))return;
    const actions=d.getElementById('saveOnly')?.parentElement;if(!actions)return;
    const box=d.createElement('div');box.id='wsdInviteUnitChoice';box.className='helper';box.style.margin='14px 0 4px';
    box.innerHTML=`<b style="display:block;margin-bottom:5px">¿Cómo recibirán la invitación?</b><div id="wsdInviteChoices" style="display:none"><button type="button" class="choice" data-invite-mode="together"><b>Una invitación para todos</b><span class="muted">Una misma invitación, con respuesta individual para cada persona.</span></button><button type="button" class="choice" data-invite-mode="separate"><b>Una invitación por persona</b><span class="muted">Cada persona tendrá su propio enlace.</span></button><div id="wsdInviteLabelWrap" style="display:none"><label>Nombre para identificar esta invitación <span class="small">(opcional)</span></label><input id="wsdInviteLabel" class="field" placeholder="Ej. Familia Rodríguez"></div><div id="wsdInviteErr" class="error"></div></div><div id="wsdInviteSingle" class="small">Para una sola persona se creará una invitación individual.</div>`;
    actions.parentElement.insertBefore(box,actions);
    const update=()=>{const n=names.value.split(/\n+/).map(x=>x.trim()).filter(Boolean).length;box.querySelector('#wsdInviteChoices').style.display=n>1?'block':'none';box.querySelector('#wsdInviteSingle').style.display=n>1?'none':'block';if(n<=1){box.dataset.mode='single';box.querySelectorAll('[data-invite-mode]').forEach(x=>x.classList.remove('sel'))}else if(box.dataset.mode==='single'){box.dataset.mode=''}};
    names.addEventListener('input',update);update();
    box.querySelectorAll('[data-invite-mode]').forEach(b=>b.onclick=()=>{box.dataset.mode=b.dataset.inviteMode;box.querySelectorAll('[data-invite-mode]').forEach(x=>x.classList.toggle('sel',x===b));box.querySelector('#wsdInviteLabelWrap').style.display=b.dataset.inviteMode==='together'?'block':'none';box.querySelector('#wsdInviteErr').textContent=''});
  }
  function hook(d){
    if(d.documentElement.dataset.wsdInviteUnitsHook==='1')return;d.documentElement.dataset.wsdInviteUnitsHook='1';
    d.addEventListener('click',e=>{
      const t=e.target?.closest?.('button');if(!t)return;
      if(t.id==='saveOnly'||t.id==='saveSeat'){
        const names=d.getElementById('names'),box=d.getElementById('wsdInviteUnitChoice');if(!names||!box)return;
        const arr=names.value.split(/\n+/).map(x=>x.trim()).filter(Boolean);if(!arr.length)return;
        let mode=arr.length===1?'separate':box.dataset.mode;
        if(arr.length>1&&!['together','separate'].includes(mode)){
          e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();const er=box.querySelector('#wsdInviteErr');if(er)er.textContent='Elige si estas personas recibirán una invitación conjunta o separada.';return;
        }
        pending={before:Object.keys(read().guests||{}),mode,label:box.querySelector('#wsdInviteLabel')?.value||'',seat:t.id==='saveSeat',ids:[]};
        setTimeout(()=>{
          if(!pending)return;pending.ids=createdIds(pending.before);
          if(!pending.seat)finishPending();
        },20);
        return;
      }
      if(pending?.seat&&(t.id==='bulkLater'||t.id==='bulkCreate'||t.hasAttribute('data-bulk-table'))){
        setTimeout(()=>{const sheet=d.getElementById('sheet');if(sheet&&!sheet.classList.contains('on'))finishPending()},40)
      }
    },true)
  }
  function patch(){try{const d=appDoc();if(!d)return;hook(d);choiceUi(d)}catch{}}
  G.f.addEventListener('load',()=>{setTimeout(patch,90);setTimeout(patch,300)});addEventListener('guests-prod-open',patch);setInterval(patch,300);
})();
