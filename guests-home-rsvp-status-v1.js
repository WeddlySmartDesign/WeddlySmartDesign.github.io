(()=>{
  const G=window.__GuestsProd;if(!G)return;
  const KEY='weddly_guests_qa_v67',TOKEN_KEY='weddly_shared_wedding_token',API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-rsvp';
  let remote=null,lastFetch=0,busy=false;
  function docs(){const out=[];try{let d=G.f.contentDocument;for(let i=0;i<8&&d;i++){out.push(d);const f=d.querySelector('iframe');if(!f||!f.contentDocument)break;d=f.contentDocument}}catch{}return out}
  const appDoc=()=>docs().find(d=>d.getElementById('hoy')&&d.getElementById('invitados'))||null;
  function state(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null')||{};s.guests=s.guests||{};return s}catch{return{guests:{}}}}
  const norm=s=>String(s||'').trim().toLowerCase();
  function latestFor(g){if(!remote)return null;return(remote.submissions||[]).filter(x=>(x.guest_key&&x.guest_key===g.id)||(!x.guest_key&&norm(x.name)===norm(g.name))).sort((a,b)=>new Date(b.received_at)-new Date(a.received_at))[0]||null}
  function status(g){const a=latestFor(g);if(a)return a.attend?'confirmed':'declined';return g.rsvp==='confirmed'?'confirmed':g.rsvp==='declined'?'declined':'pending'}
  function inviteSent(g,S){if(!remote||!g.invitationRecipientId)return false;const r=S.guests?.[g.invitationRecipientId];if(!r)return false;const members=Object.entries(S.guests||{}).filter(([,x])=>x.invitationRecipientId===g.invitationRecipientId&&x.invitationUnitId===r.invitationUnitId);const key=members.length>1?'unit:'+r.invitationUnitId:g.invitationRecipientId;return(remote.delivery||[]).some(x=>x.guest_key===key&&x.status==='sent')}
  function render(){const d=appDoc(),card=d?.getElementById('wsdRsvpHome');if(!card)return;const p=card.querySelector('p.small');if(!p)return;const S=state(),gs=Object.entries(S.guests||{}).map(([id,g])=>({id,...g}));let yes=0,no=0,pendingSent=0,unsent=0;for(const g of gs){const st=status(g);if(st==='confirmed')yes++;else if(st==='declined')no++;else if(remote&&inviteSent(g,S))pendingSent++;else unsent++}if(remote)p.innerHTML=`${yes} confirmados · ${no} no asisten<br>${pendingSent} pendientes de respuesta${unsent?` · ${unsent} aún sin enviar`:''}.`;else p.textContent=`${yes} confirmados · ${no} no asisten · ${unsent} sin respuesta.`}
  async function refresh(force=false){const token=localStorage.getItem(TOKEN_KEY)||'';if(!token||busy||(!force&&Date.now()-lastFetch<12000)){render();return}busy=true;try{const r=await fetch(API+'?manage=1',{headers:{'x-weddly-token':token},cache:'no-store'}),x=await r.json().catch(()=>({}));if(r.ok&&x.ok){remote=x;lastFetch=Date.now()}}catch{}finally{busy=false;render()}}
  function tick(){render();refresh(false)}
  G.f.addEventListener('load',()=>setTimeout(()=>refresh(true),250));addEventListener('guests-prod-open',()=>setTimeout(()=>refresh(true),150));addEventListener('focus',()=>refresh(true));setInterval(tick,1800);setTimeout(()=>refresh(true),500);
})();
