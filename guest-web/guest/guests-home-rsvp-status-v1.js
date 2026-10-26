(()=>{
  const G=window.__GuestsProd;if(!G)return;
  const KEY='weddly_guests_qa_v67',TOKEN_KEY='weddly_shared_wedding_token',API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-rsvp',EVENTS='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-event-state',EVENT_INVITES='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-event-invite';
  let remote=null,eventNotices=[],lastFetch=0,lastEventFetch=0,busy=false,expandedNotifications=false;
  function docs(){const out=[];try{let d=G.f.contentDocument;for(let i=0;i<8&&d;i++){out.push(d);const f=d.querySelector('iframe');if(!f||!f.contentDocument)break;d=f.contentDocument}}catch{}return out}
  const appDoc=()=>docs().find(d=>d.getElementById('hoy')&&d.getElementById('invitados'))||null;
  function state(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null')||{};s.guests=s.guests||{};return s}catch{return{guests:{}}}}
  const norm=s=>String(s||'').trim().toLowerCase(),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function latestFor(g){if(!remote)return null;return(remote.submissions||[]).filter(x=>(x.guest_key&&x.guest_key===g.id)||(!x.guest_key&&norm(x.name)===norm(g.name))).sort((a,b)=>when(b)-when(a))[0]||null}
  function status(g){const a=latestFor(g);if(a)return a.attend?'confirmed':'declined';return g.rsvp==='confirmed'?'confirmed':g.rsvp==='declined'?'declined':'pending'}
  function inviteSent(g,S){if(!remote||!g.invitationRecipientId)return false;const r=S.guests?.[g.invitationRecipientId];if(!r)return false;const members=Object.entries(S.guests||{}).filter(([,x])=>x.invitationRecipientId===g.invitationRecipientId&&x.invitationUnitId===r.invitationUnitId);const key=members.length>1?'unit:'+r.invitationUnitId:g.invitationRecipientId;return(remote.delivery||[]).some(x=>x.guest_key===key&&x.status==='sent')}
  function when(x){const n=new Date(x?.received_at||x?.created_at||x?.updated_at||0).getTime();return Number.isFinite(n)?n:0}
  function plusName(x){return String(x?.plusone_details?.name||x?.plusone||'').trim()}
  function questionsFor(sub){const f=(remote?.forms||[]).find(x=>String(x?.id||'')===String(sub?.form_id||''));const qs=Array.isArray(f?.config?.customQuestions)?f.config.customQuestions:[];return new Map(qs.filter(q=>q?.id).map(q=>[String(q.id),q]))}
  function customAnswers(sub){const x=sub?.payload?.custom_answers;return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
  function customChange(now,prev){const a=customAnswers(now),b=customAnswers(prev),ids=[...new Set([...Object.keys(a),...Object.keys(b)])];const id=ids.find(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));if(!id)return'';const q=questionsFor(now).get(String(id)),label=String(q?.label||'Pregunta personalizada').trim();const v=a[id];const val=v===true?'Sí':v===false?'No':String(v??'').trim();return val?label+' · '+val:label+' · respuesta eliminada'}
  function changeLabel(now,prev){
    if(!prev){const parts=[now.attend?'Ha respondido · Asiste':'Ha respondido · No asiste'];const pn=plusName(now);if(now.attend&&pn)parts.push('con '+pn);const extra=customChange(now,null);if(extra)parts.push(extra);return parts.join(' · ')}
    if(!!now.attend!==!!prev.attend)return now.attend?'Ahora asiste':'Ahora no asiste';
    const parts=[];
    if(now.attend&&String(now.meal||'')!==String(prev.meal||''))parts.push(now.meal?'Menú: '+now.meal:'Ha quitado el menú');
    const pn=plusName(now),pp=plusName(prev);if(pn!==pp)parts.push(pn?'Acompañante: '+pn:'Sin acompañante');
    if(!!now.transport!==!!prev.transport)parts.push(now.transport?'Necesita transporte':'Ya no necesita transporte');
    if(!!now.accommodation!==!!prev.accommodation)parts.push(now.accommodation?'Necesita alojamiento':'Ya no necesita alojamiento');
    if(String(now.allergy||'')!==String(prev.allergy||''))parts.push(now.allergy?'Alergias: '+now.allergy:'Sin alergias');
    const extra=customChange(now,prev);if(extra)parts.push(extra);
    return parts.length?'Ha cambiado · '+parts.join(' · '):'Ha actualizado su respuesta'}
  function dayLabel(day){const p=String(day).split('-').map(Number);if(p.length!==3)return'';const d=new Date(p[0],p[1]-1,p[2]),t=new Date();t.setHours(0,0,0,0);const diff=Math.round((t-d)/86400000);if(diff===0)return'Hoy';if(diff===1)return'Ayer';try{return d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'short'})}catch{return day}}
  function formatWhen(ts){try{return new Date(ts).toLocaleString(document.documentElement.lang==='en'?'en-GB':'es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}catch{return''}}
  
  const groupExpanded=new Set();
  let activityExpanded=false;
  function recentReadAt(S){return Number(S?.meta?.todayRecentChangesReadAt||0)||0}
  function readIds(S){const x=S?.meta?.hoyReadNotificationIdsV1;return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
  function idText(x){return String(x||'').replace(/[^a-zA-Z0-9_\-.:]/g,'_').slice(0,180)}
  function entries(S){
    const cutoff=Date.now()-7*86400000,out=[],legacy=recentReadAt(S),read=readIds(S);
    if(remote){
      const groups=new Map();
      for(const sub of remote.submissions||[]){
        const k=sub.guest_key?'id:'+sub.guest_key:'name:'+norm(sub.name);
        if(k==='name:')continue;
        if(!groups.has(k))groups.set(k,[]);
        groups.get(k).push(sub)
      }
      for(const arr of groups.values()){
        arr.sort((x,y)=>when(y)-when(x));
        for(let i=0;i<arr.length;i++){
          const sub=arr[i],ts=when(sub);
          if(!ts||ts<cutoff)continue;
          const origin=String(sub.id||sub.client_submission_id||ts+'_'+i);
          const id='rsvp:'+idText(sub.form_id)+':'+idText(origin);
          out.push({id,name:String(sub.name||'Invitado'),label:changeLabel(sub,arr[i+1]||null),ts,
            type:'rsvp',attend:!!sub.attend,read:!!read[id]||ts<=legacy})
        }
      }
    }
    for(const ev of eventNotices){
      if(!ev.ts||ev.ts<cutoff)continue;
      const id=ev.id||'event:'+idText(ev.name)+'_'+ev.ts;
      out.push({...ev,id,type:'event',read:!!read[id]||ev.ts<=legacy})
    }
    return out.sort((x,y)=>y.ts-x.ts)
  }
  function activityEntries(S){
    const cutoff=Date.now()-7*86400000;
    const device=localStorage.getItem('weddly_guests_device_id_v1')||'';
    return (S?.meta?.todaySeatChanges||[]).filter(x=>Number(x?.ts)>cutoff).map(x=>{
      const from=String(x.from||''),to=String(x.to||'');
      const actor=x.byDevice?(x.byDevice===device?'Este dispositivo':'El otro dispositivo'):'La pareja';
      const label=from&&to?'De '+from+' a '+to:to?'Asignado a '+to:from?'Ahora sin mesa':'Mesa actualizada';
      return {id:String(x.id||x.name)+'_'+x.ts,name:String(x.name||'Invitado'),label:label+' · '+actor,ts:Number(x.ts)}
    }).sort((x,y)=>y.ts-x.ts)
  }
  function groupEntries(xs){
    const m=new Map();
    for(const x of xs){
      const d=new Date(x.ts);
      const day=Number.isFinite(d.getTime())?d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'):'unknown';
      const k=day+'|'+x.type+'|'+(x.type==='event'?x.eventName||'Evento':'boda');
      if(!m.has(k))m.set(k,{key:k,type:x.type,eventName:x.eventName||'',day,items:[],ts:x.ts});
      m.get(k).items.push(x);
    }
    return [...m.values()].sort((x,y)=>y.ts-x.ts);
  }
  function markRecentRead(xs){
    if(!xs.length)return;
    const S=state();S.meta=S.meta||{};
    const map=readIds(S);
    for(const x of xs)map[x.id]=Number(x.ts)||Date.now();
    const cutoff=Date.now()-90*86400000;
    const pairs=Object.entries(map).filter(([,ts])=>Number(ts)>=cutoff).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,3000);
    S.meta.hoyReadNotificationIdsV1=Object.fromEntries(pairs);
    localStorage.setItem(KEY,JSON.stringify(S));
    render();
  }
  let attentionExpanded=false;
  function renderAttention(d,S){
    const hoy=d?.getElementById('hoy');if(!hoy)return;
    const meals=Object.entries(S.guests||{}).filter(([,g])=>g?.rsvp==='confirmed'&&g.mealRequired!==false&&!g.meal);
    const over=Object.values(S.tables||{}).filter(t=>Object.values(S.guests||{}).filter(g=>g&&g.rsvp!=='declined'&&g.table===t.name).length>Number(t.cap||0));
    const extraMeals=meals.slice(3),extraOver=over.slice(2),more=extraMeals.length+extraOver.length;
    const prev=hoy.querySelector('#wsdExtraAttention');
    if(!more){prev?.remove();return}
    const signature=JSON.stringify([extraMeals.map(([id])=>id),extraOver.map(t=>t.name),attentionExpanded]);
    if(prev?.dataset.signature===signature)return;
    prev?.remove();
    const section=d.createElement('section');section.id='wsdExtraAttention';section.dataset.signature=signature;section.style.marginTop='12px';
    const button=d.createElement('button');button.type='button';button.className='btn line';button.id='wsdAttentionToggle';
    button.style.cssText='width:100%;min-height:44px';
    button.textContent=attentionExpanded?'Ocultar incidencias adicionales':'Ver las '+more+' incidencias restantes';
    button.onclick=()=>{attentionExpanded=!attentionExpanded;renderAttention(d,state())};
    section.appendChild(button);
    if(attentionExpanded){
      const list=d.createElement('div');list.className='card';list.style.marginTop='9px';
      const rowFor=(title,desc,where)=>{
        const row=d.createElement('div');row.className='row';row.style.cssText='display:flex;justify-content:space-between;gap:9px;align-items:center;flex-wrap:wrap';
        const info=d.createElement('div');info.innerHTML='<b>'+esc(title)+'</b><div class="small">'+esc(desc)+'</div>';row.appendChild(info);
        const act=d.createElement('button');act.type='button';act.className='btn soft';act.style.cssText='min-height:44px';act.textContent='Resolver';
        act.onclick=()=>d.querySelector('#nav button[data-go="'+where+'"]')?.click();
        row.appendChild(act);list.appendChild(row)
      };
      extraMeals.forEach(([,g])=>rowFor(String(g.name||'Invitado'),'Confirmado sin menú','invitados'));
      extraOver.forEach(t=>rowFor(String(t.name||'Mesa'),'Se ha superado la capacidad','mesas'));
      section.appendChild(list);
    }
    const inbox=hoy.querySelector('#wsdRecentChanges');
    if(inbox)hoy.insertBefore(section,inbox);else hoy.appendChild(section)
  }
  function renderRecent(d,S){
    const hoy=d?.getElementById('hoy');if(!hoy)return;
    const all=entries(S),unread=all.filter(x=>!x.read),activity=activityEntries(S),groups=groupEntries(unread);
    const old=hoy.querySelector('#wsdRecentChanges');
    if(!unread.length&&!activity.length){old?.remove();return}
    const signature=JSON.stringify([unread.map(x=>x.id),activity.map(x=>x.id),[...groupExpanded],activityExpanded]);
    if(old?.dataset.wsdRecentKey===signature)return;
    old?.remove();
    const section=d.createElement('section');section.id='wsdRecentChanges';section.dataset.wsdRecentKey=signature;
    const header=d.createElement('div');header.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:26px';
    header.innerHTML='<div class="sectiontag">Novedades</div><span class="pill">'+unread.length+' sin leer</span>';
    section.appendChild(header);
    if(unread.length){
      const info=d.createElement('p');info.className='small';info.textContent='Respuestas recibidas, incluidas las rectificaciones. Los totales de asistentes usan la última respuesta de cada persona; leer los avisos no resuelve tareas.';
      section.appendChild(info);
      const cards=d.createElement('div');cards.className='card';cards.style.padding='10px 14px';
      groups.forEach((g,i)=>{
        const many=g.items.length>5,expanded=groupExpanded.has(g.key);
        const visible=(!many||expanded)?g.items:g.items.slice(0,0);
        const yes=g.items.filter(x=>x.attend===true).length;
        const no=g.items.filter(x=>x.attend===false).length;
        const one=g.items.length===1,title=g.type==='rsvp'?(one?'respuesta de la boda':'respuestas de la boda'):(one?'respuesta de ':'respuestas de ')+g.eventName;
        const row=d.createElement('div');row.className='row';row.style.cssText='display:block;padding:13px 0;border-bottom:1px solid #eee7de';
        const label=d.createElement('div');label.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap';
        label.innerHTML='<div><b>'+g.items.length+' '+esc(title)+'</b><div class="small">'+yes+' sí · '+no+' no · '+esc(dayLabel(g.day))+'</div></div>';
        if(many){
          const btn=d.createElement('button');btn.type='button';btn.className='btn line';btn.style.cssText='min-height:44px;padding:8px 12px';
          btn.textContent=expanded?'Ocultar detalles':'Ver '+g.items.length+' respuestas';
          btn.onclick=()=>{expanded?groupExpanded.delete(g.key):groupExpanded.add(g.key);renderRecent(d,state())};
          label.appendChild(btn)
        }
        row.appendChild(label);
        visible.forEach(x=>{
          const person=d.createElement('div');person.className='row';person.style.cssText='display:flex;justify-content:space-between;gap:10px;padding:9px 0';
          person.innerHTML='<div><b>'+esc(x.name)+'</b><div class="small">'+esc(x.label)+'</div></div><div class="small">'+esc(formatWhen(x.ts))+'</div>';
          row.appendChild(person)
        });
        cards.appendChild(row)
      });
      section.appendChild(cards);
      const done=d.createElement('button');done.type='button';done.id='wsdMarkRecentRead';done.className='btn line';
      done.style.cssText='width:100%;min-height:44px;margin-top:9px';
      done.textContent='Marcar novedades como leídas';
      done.onclick=()=>markRecentRead(unread);
      section.appendChild(done)
    }else{
      const clean=d.createElement('p');clean.className='small';clean.textContent='No hay novedades sin leer.';section.appendChild(clean)
    }
    if(activity.length){
      const activityBox=d.createElement('div');activityBox.style.marginTop='20px';
      activityBox.innerHTML='<div class="sectiontag">Actividad de mesas</div><p class="small">Los movimientos realizados no son respuestas nuevas ni tareas pendientes.</p>';
      const list=d.createElement('div');list.className='card';list.style.padding='7px 14px';
      (activityExpanded?activity:activity.slice(0,3)).forEach(x=>{
        const row=d.createElement('div');row.className='row';row.style.cssText='display:flex;justify-content:space-between;gap:9px';
        row.innerHTML='<div><b>'+esc(x.name)+'</b><div class="small">'+esc(x.label)+'</div></div><div class="small">'+esc(formatWhen(x.ts))+'</div>';
        list.appendChild(row)
      });
      activityBox.appendChild(list);
      if(activity.length>3){
        const more=d.createElement('button');more.type='button';more.className='btn line';more.style.cssText='min-height:44px;margin-top:9px;width:100%';more.textContent=activityExpanded?'Mostrar menos actividad':'Ver toda la actividad ('+activity.length+')';
        more.onclick=()=>{activityExpanded=!activityExpanded;renderRecent(d,state())};activityBox.appendChild(more)
      }
      section.appendChild(activityBox)
    }
    hoy.appendChild(section)
  }
function render(){const d=appDoc(),card=d?.getElementById('wsdRsvpHome');if(!d)return;const p=card?.querySelector('p.small');const S=state(),gs=Object.entries(S.guests||{}).map(([id,g])=>({id,...g}));let yes=0,no=0,pendingSent=0,unsent=0;for(const g of gs){const st=status(g);if(st==='confirmed')yes++;else if(st==='declined')no++;else if(remote&&inviteSent(g,S))pendingSent++;else unsent++}if(p&&remote)p.innerHTML=`${yes} confirmados · ${no} no asisten<br>${pendingSent} pendientes de respuesta${unsent?` · ${unsent} aún sin enviar`:''}.`;else if(p)p.textContent=`${yes} confirmados · ${no} no asisten · ${unsent} sin respuesta.`;renderAttention(d,S);renderRecent(d,S)}
  async function fetchEventNotices(token){
    const headers={'x-weddly-token':token};
    const r=await fetch(EVENTS,{headers,cache:'no-store'}),data=await r.json().catch(()=>({}));
    if(!r.ok||!data.ok)throw new Error('event_state');
    const evs=Object.values(data.state?.events||{}).filter(e=>e&&e.enabled!==false).slice(0,15);
    const all=await Promise.all(evs.map(async ev=>{
      const url=EVENT_INVITES+'?event_id='+encodeURIComponent(String(ev.id||''));
      const x=await fetch(url,{headers,cache:'no-store'}),response=await x.json().catch(()=>({}));
      if(!x.ok||!response.ok)throw new Error('event_invites');
      const notices=[];
      for(const recipient of response.recipients||[]){
        const ts=Date.parse(String(recipient.responded_at||''))||0;
        if(!ts)continue;
        for(const member of recipient.members||[]){
          const answer=recipient.response?.[member.id];
          if(answer!=='yes'&&answer!=='no')continue;
          notices.push({id:'event:'+idText(ev.id)+':'+idText(recipient.recipient_key)+':'+idText(member.id)+':'+ts,name:String(member.name||'Invitado'),label:(answer==='yes'?'Ha confirmado asistencia':'No asistirá'),eventName:String(ev.name||'Evento'),attend:answer==='yes',ts});
        }
      }
      return notices;
    }));
    return all.flat();
  }
  async function refresh(force=false){const token=localStorage.getItem(TOKEN_KEY)||'';if(!token||busy||(!force&&Date.now()-lastFetch<12000)){render();return}busy=true;try{const r=await fetch(API+'?manage=1',{headers:{'x-weddly-token':token},cache:'no-store'}),x=await r.json().catch(()=>({}));if(r.ok&&x.ok){remote=x;lastFetch=Date.now();if(Date.now()-lastEventFetch>=60000){lastEventFetch=Date.now();try{eventNotices=await fetchEventNotices(token)}catch{/* Conserva el último estado de eventos sin bloquear el RSVP. */}}}}catch{}finally{busy=false;render()}}
  function tick(){render();refresh(false)}
  G.f.addEventListener('load',()=>setTimeout(()=>refresh(true),250));addEventListener('guests-prod-open',()=>setTimeout(()=>refresh(true),150));addEventListener('focus',()=>refresh(true));addEventListener('visibilitychange',()=>{if(!document.hidden)refresh(true)});setInterval(tick,1800);setTimeout(()=>refresh(true),500);
})();
