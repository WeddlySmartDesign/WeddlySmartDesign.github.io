(()=>{
  const G=window.__GuestsProd;if(!G)return;
  const KEY='weddly_guests_qa_v67',TOKEN_KEY='weddly_shared_wedding_token',API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-rsvp',EVENTS='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-event-state',EVENT_INVITES='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-event-invite';
  let remote=null,eventNotices=[],lastFetch=0,busy=false,expandedNotifications=false;
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
  function changeLabel(now,prev){if(!prev){const base=now.attend?'Ha respondido · Asiste':'Ha respondido · No asiste',extra=customChange(now,null);return extra?base+' · '+extra:base}if(!!now.attend!==!!prev.attend)return now.attend?'Ahora asiste':'Ahora no asiste';if(now.attend&&String(now.meal||'')!==String(prev.meal||''))return now.meal?'Ha cambiado su menú · '+now.meal:'Ha cambiado su menú';const pn=plusName(now),pp=plusName(prev);if(pn!==pp)return pn?'Ha añadido acompañante · '+pn:'Ha eliminado acompañante';if(!!now.transport!==!!prev.transport)return now.transport?'Ahora necesita transporte':'Ya no necesita transporte';if(!!now.accommodation!==!!prev.accommodation)return now.accommodation?'Ahora necesita alojamiento':'Ya no necesita alojamiento';if(String(now.allergy||'')!==String(prev.allergy||''))return'Ha actualizado alergias o intolerancias';const extra=customChange(now,prev);if(extra)return'Ha actualizado · '+extra;return'Ha actualizado su respuesta'}
  function formatWhen(ts){try{return new Date(ts).toLocaleString(document.documentElement.lang==='en'?'en-GB':'es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}catch{return''}}
  function recentReadAt(S){return Number(S?.meta?.todayRecentChangesReadAt||0)||0}
  function recentChanges(S){const cutoff=Date.now()-7*86400000,seen=recentReadAt(S),out=[];for(const e of eventNotices)if(e.ts>seen&&e.ts>=cutoff)out.push(e);if(remote){const groups=new Map();for(const x of remote.submissions||[]){const k=x.guest_key?'id:'+x.guest_key:'name:'+norm(x.name);if(!k||k==='name:')continue;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(x)}for(const xs of groups.values()){xs.sort((a,b)=>when(b)-when(a));for(let i=0;i<xs.length;i++){const now=xs[i],ts=when(now);if(!now||ts<cutoff||ts<=seen)continue;const prev=xs[i+1]||null;out.push({name:now.name||'Invitado',label:changeLabel(now,prev),ts})}}}for(const x of S?.meta?.todaySeatChanges||[]){const ts=Number(x?.ts)||0;if(ts<cutoff||ts<=seen)continue;const from=String(x?.from||''),to=String(x?.to||'');let label='Ha cambiado de mesa';if(from&&to)label='Ha cambiado de '+from+' a '+to;else if(to)label='Asignado a '+to;else if(from)label='Ahora está sin mesa';out.push({name:x?.name||'Invitado',label,ts})}return out.sort((a,b)=>b.ts-a.ts).slice(0,60)}
  function markRecentRead(xs){if(!xs?.length)return;const S=state(),newest=Math.max(0,...xs.map(x=>Number(x.ts)||0));if(!newest)return;S.meta=S.meta||{};S.meta.todayRecentChangesReadAt=Math.max(Number(S.meta.todayRecentChangesReadAt)||0,newest);localStorage.setItem(KEY,JSON.stringify(S));render()}
  function renderRecent(d,S){
    const hoy=d?.getElementById('hoy');if(!hoy)return;
    const previous=hoy.querySelector('#wsdRecentChanges'),xs=recentChanges(S),items=expandedNotifications?xs:xs.slice(0,5);
    if(!xs.length){previous?.remove();return}
    const key=JSON.stringify([xs,expandedNotifications]);
    if(previous?.dataset.wsdRecentKey===key)return;
    previous?.remove();
    const section=d.createElement('div');section.id='wsdRecentChanges';section.dataset.wsdRecentKey=key;section.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-top:26px"><div class="sectiontag">Notificaciones recientes</div><div style="display:flex;align-items:center;gap:10px"><span class="pill">${xs.length}</span><button type="button" id="wsdMarkRecentRead" style="border:1px solid #d8d4ca;background:#f7f5ef;border-radius:999px;padding:9px 13px;font:inherit;font-size:12px;font-weight:700;line-height:1;color:#2c2a26;cursor:pointer;white-space:nowrap;box-shadow:0 1px 0 rgba(0,0,0,.03)">Marcar como leído</button></div></div><div class="card" style="padding-top:8px;padding-bottom:8px">${items.map(x=>`<div class="row"><div><b>${esc(x.name)}</b><div class="small">${esc(x.label)}</div></div><div class="small" style="white-space:nowrap;text-align:right">${esc(formatWhen(x.ts))}</div></div>`).join('')}</div>${xs.length>5?'<button type="button" id="wsdToggleRecent" class="btn line" style="width:100%;min-height:44px;margin-top:10px">'+(expandedNotifications?'Mostrar menos':'Ver todas las notificaciones ('+xs.length+')')+'</button>':''}`;hoy.appendChild(section);section.querySelector('#wsdMarkRecentRead').onclick=()=>markRecentRead(xs);section.querySelector('#wsdToggleRecent')?.addEventListener('click',()=>{expandedNotifications=!expandedNotifications;renderRecent(d,state())})}
  function render(){const d=appDoc(),card=d?.getElementById('wsdRsvpHome');if(!d)return;const p=card?.querySelector('p.small');const S=state(),gs=Object.entries(S.guests||{}).map(([id,g])=>({id,...g}));let yes=0,no=0,pendingSent=0,unsent=0;for(const g of gs){const st=status(g);if(st==='confirmed')yes++;else if(st==='declined')no++;else if(remote&&inviteSent(g,S))pendingSent++;else unsent++}if(p&&remote)p.innerHTML=`${yes} confirmados · ${no} no asisten<br>${pendingSent} pendientes de respuesta${unsent?` · ${unsent} aún sin enviar`:''}.`;else if(p)p.textContent=`${yes} confirmados · ${no} no asisten · ${unsent} sin respuesta.`;renderRecent(d,S)}
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
          notices.push({name:String(member.name||'Invitado'),label:String(ev.name||'Evento')+' · '+(answer==='yes'?'Ha confirmado asistencia':'No asistirá'),ts});
        }
      }
      return notices;
    }));
    return all.flat();
  }
  async function refresh(force=false){const token=localStorage.getItem(TOKEN_KEY)||'';if(!token||busy||(!force&&Date.now()-lastFetch<12000)){render();return}busy=true;try{const r=await fetch(API+'?manage=1',{headers:{'x-weddly-token':token},cache:'no-store'}),x=await r.json().catch(()=>({}));if(r.ok&&x.ok){remote=x;lastFetch=Date.now();try{eventNotices=await fetchEventNotices(token)}catch{/* Conserva el último estado de eventos sin bloquear el RSVP. */}}}catch{}finally{busy=false;render()}}
  function tick(){render();refresh(false)}
  G.f.addEventListener('load',()=>setTimeout(()=>refresh(true),250));addEventListener('guests-prod-open',()=>setTimeout(()=>refresh(true),150));addEventListener('focus',()=>refresh(true));addEventListener('visibilitychange',()=>{if(!document.hidden)refresh(true)});setInterval(tick,1800);setTimeout(()=>refresh(true),500);
})();
