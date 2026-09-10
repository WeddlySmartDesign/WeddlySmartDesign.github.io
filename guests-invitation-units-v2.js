(()=>{
  const G=window.__GuestsProd;if(!G)return;
  const KEY='weddly_guests_qa_v67';
  let pending=null;
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{guests:{}}}catch{return{guests:{}}}};
  const write=s=>{try{localStorage.setItem(KEY,JSON.stringify(s));return true}catch{return false}};
  const uid=()=>`iu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function docs(){const out=[];try{let d=G.f.contentDocument;for(let i=0;i<8&&d;i++){out.push(d);const f=d.querySelector('iframe');if(!f||!f.contentDocument)break;d=f.contentDocument}}catch{}return out}
  const appDoc=()=>docs().find(d=>d.getElementById('invitados')&&d.getElementById('sheet')&&d.getElementById('panel'))||null;
  function reload(){try{G.f.src=G.APP+'&inviteunits='+Date.now();G.f.style.display='block';G.boot.style.display='none';dispatchEvent(new Event('guests-prod-open'))}catch{}}
  function setIndividual(S,id){const g=S.guests?.[id];if(!g)return;g.invitationUnitId=uid();g.invitationUnitLabel='';delete g.invitationRecipientId}
  function applyUnit(ids,mode,label=''){
    if(!ids?.length)return;
    const S=read();S.guests=S.guests||{};
    if(mode==='together'){
      const u=uid();ids.forEach(id=>{const g=S.guests[id];if(!g)return;g.invitationUnitId=u;g.invitationUnitLabel=label.trim();delete g.invitationRecipientId});
    }else ids.forEach(id=>setIndividual(S,id));
    if(write(S))reload();
  }
  function createdIds(before){const S=read(),b=new Set(before||[]);return Object.keys(S.guests||{}).filter(id=>!b.has(id))}
  function autoTitle(S,ids){const n=ids.map(id=>S.guests?.[id]?.name).filter(Boolean);if(n.length===2){const y=/^(i|hi)/i.test(n[1])?' e ':' y ';return n[0]+y+n[1]}if(n.length===1)return n[0];return''}
  function openPartition(d,ids){
    const S=read();let remaining=ids.filter(id=>S.guests?.[id]),made=[];
    const sheet=d.getElementById('sheet'),panel=d.getElementById('panel');if(!sheet||!panel){ids.forEach(id=>setIndividual(S,id));write(S);reload();return}
    const finish=()=>{remaining.forEach(id=>setIndividual(S,id));write(S);sheet.classList.remove('on');panel.innerHTML='';reload()};
    const draw=()=>{
      if(!remaining.length){write(S);sheet.classList.remove('on');panel.innerHTML='';reload();return}
      panel.innerHTML=`<div class="sectiontag">INVITACIONES</div><h2>Reparte estas personas</h2><p class="small">Selecciona a quienes recibirán el mismo enlace. El grupo y la mesa no cambian.</p>${made.length?`<div class="helper"><b>Ya creadas</b><div style="margin-top:6px">${made.map(x=>`<span class="pill">${esc(x)}</span>`).join('')}</div></div>`:''}<div class="helper"><b>${remaining.length} persona${remaining.length===1?'':'s'} pendiente${remaining.length===1?'':'s'}</b></div><div id="wsdPartitionPeople">${remaining.map(id=>{const g=S.guests[id];return `<label class="choice" style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-part="${esc(id)}" style="width:20px;height:20px"><span><b>${esc(g.name||'Sin nombre')}</b>${g.group?`<span class="muted">${esc(g.group)}</span>`:''}</span></label>`}).join('')}</div><label>Nombre de esta invitación <span class="small">(opcional)</span></label><input id="wsdPartitionLabel" class="field" placeholder="Ej. Juan y Laura"><div id="wsdPartitionErr" class="error"></div><div class="actions one"><button class="btn" id="wsdMakeInvite">Crear invitación con seleccionados</button></div><div class="actions"><button class="btn soft" id="wsdRestSingle">El resto, individual</button><button class="btn line" id="wsdLater">Terminar después</button></div>`;
      sheet.classList.add('on');panel.onclick=e=>e.stopPropagation();
      panel.querySelector('#wsdMakeInvite').onclick=()=>{const selected=[...panel.querySelectorAll('[data-part]:checked')].map(x=>x.dataset.part);if(selected.length<2){panel.querySelector('#wsdPartitionErr').textContent='Selecciona al menos dos personas que compartirán invitación.';return}const u=uid(),label=panel.querySelector('#wsdPartitionLabel').value.trim();selected.forEach(id=>{const g=S.guests[id];if(g){g.invitationUnitId=u;g.invitationUnitLabel=label;delete g.invitationRecipientId}});made.push(label||autoTitle(S,selected)||`${selected.length} personas`);remaining=remaining.filter(id=>!selected.includes(id));if(remaining.length===1){setIndividual(S,remaining[0]);remaining=[]}write(S);draw()};
      panel.querySelector('#wsdRestSingle').onclick=finish;
      panel.querySelector('#wsdLater').onclick=finish;
    };
    draw();
  }
  function finishPending(d){
    if(!pending)return;
    const ids=pending.ids?.length?pending.ids:createdIds(pending.before);if(!ids.length)return;
    const p=pending;pending=null;
    if(p.mode==='partition')openPartition(d,ids);else applyUnit(ids,p.mode,p.label)
  }
  function choiceUi(d){
    const names=d.getElementById('names');if(!names||d.getElementById('wsdInviteUnitChoice'))return;
    const actions=d.getElementById('saveOnly')?.parentElement;if(!actions)return;
    const box=d.createElement('div');box.id='wsdInviteUnitChoice';box.className='helper';box.style.margin='14px 0 4px';
    box.innerHTML=`<b style="display:block;margin-bottom:5px">¿Cómo se repartirán las invitaciones?</b><div id="wsdInviteChoices" style="display:none"><button type="button" class="choice" data-invite-mode="together"><b>Una invitación para todos</b><span class="muted">Todos compartirán el mismo enlace.</span></button><button type="button" class="choice" data-invite-mode="partition"><b>Varias invitaciones</b><span class="muted">Agrupa parejas, hogares o las personas que compartirán enlace.</span></button><button type="button" class="choice" data-invite-mode="separate"><b>Una por persona</b><span class="muted">Cada persona tendrá su propio enlace.</span></button><div id="wsdInviteLabelWrap" style="display:none"><label>Nombre de la invitación <span class="small">(opcional)</span></label><input id="wsdInviteLabel" class="field" placeholder="Ej. Familia Rodríguez"></div><div id="wsdInviteErr" class="error"></div></div><div id="wsdInviteSingle" class="small">Para una sola persona se creará una invitación individual.</div>`;
    actions.parentElement.insertBefore(box,actions);
    const update=()=>{const n=names.value.split(/\n+/).map(x=>x.trim()).filter(Boolean).length;box.querySelector('#wsdInviteChoices').style.display=n>1?'block':'none';box.querySelector('#wsdInviteSingle').style.display=n>1?'none':'block';if(n<=1){box.dataset.mode='single';box.querySelectorAll('[data-invite-mode]').forEach(x=>x.classList.remove('sel'))}else if(box.dataset.mode==='single')box.dataset.mode=''};
    names.addEventListener('input',update);update();
    box.querySelectorAll('[data-invite-mode]').forEach(b=>b.onclick=()=>{box.dataset.mode=b.dataset.inviteMode;box.querySelectorAll('[data-invite-mode]').forEach(x=>x.classList.toggle('sel',x===b));box.querySelector('#wsdInviteLabelWrap').style.display=b.dataset.inviteMode==='together'?'block':'none';box.querySelector('#wsdInviteErr').textContent=''});
  }
  function hook(d){
    if(d.documentElement.dataset.wsdInviteUnitsV2Hook==='1')return;d.documentElement.dataset.wsdInviteUnitsV2Hook='1';
    d.addEventListener('click',e=>{
      const t=e.target?.closest?.('button');if(!t)return;
      if(t.id==='saveOnly'||t.id==='saveSeat'){
        const names=d.getElementById('names'),box=d.getElementById('wsdInviteUnitChoice');if(!names||!box)return;
        const arr=names.value.split(/\n+/).map(x=>x.trim()).filter(Boolean);if(!arr.length)return;
        let mode=arr.length===1?'separate':box.dataset.mode;
        if(arr.length>1&&!['together','partition','separate'].includes(mode)){
          e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();const er=box.querySelector('#wsdInviteErr');if(er)er.textContent='Elige cómo se repartirán estas invitaciones.';return;
        }
        pending={before:Object.keys(read().guests||{}),mode,label:box.querySelector('#wsdInviteLabel')?.value||'',seat:t.id==='saveSeat',ids:[]};
        setTimeout(()=>{if(!pending)return;pending.ids=createdIds(pending.before);if(!pending.seat)finishPending(d)},25);return;
      }
      if(pending?.seat&&(t.id==='bulkLater'||t.id==='bulkCreate'||t.hasAttribute('data-bulk-table'))){setTimeout(()=>{const sheet=d.getElementById('sheet');if(sheet&&!sheet.classList.contains('on'))finishPending(d)},55)}
    },true)
  }
  function patch(){try{const d=appDoc();if(!d)return;hook(d);choiceUi(d)}catch{}}
  G.f.addEventListener('load',()=>{setTimeout(patch,90);setTimeout(patch,300)});addEventListener('guests-prod-open',patch);setInterval(patch,300);
})();
