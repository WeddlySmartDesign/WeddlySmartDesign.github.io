(()=>{
'use strict';
if(window.__wsdRsvpPlusOneOpsV1)return;window.__wsdRsvpPlusOneOpsV1=true;
const GAPI='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-guests-state',KEY='weddly_guests_qa_v67',TOKEN='weddly_shared_wedding_token',SAFE_PATCH_WRITE='wsd-safe-patch-write-v1';
function local(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&typeof x==='object'?x:{guests:{}}}catch{return{guests:{}}}}
function writeLatestPlusGuests(remote){
  const latest=local();latest.guests=latest.guests||{};let changed=false;
  for(const [id,g] of Object.entries(remote?.guests||{})){
    if(!g||typeof g!=='object'||(g.source!=='rsvp_plus_one'&&!g.rsvpPlusOneOf))continue;
    const cur=latest.guests[id],remoteAt=Date.parse(String(g.rsvpUpdatedAt||''))||0,localAt=Date.parse(String(cur?.rsvpUpdatedAt||''))||0;
    if(!cur||remoteAt>=localAt){latest.guests[id]=structuredClone(g);changed=true}
  }
  if(!changed)return false;try{Storage.prototype.setItem.call(localStorage,KEY,JSON.stringify(latest));void SAFE_PATCH_WRITE;return true}catch{return false}
}
async function refresh(){
  let token='';try{token=localStorage.getItem(TOKEN)||''}catch{}if(!token)return;
  try{
    const r=await fetch(GAPI,{headers:{'x-weddly-token':token},cache:'no-store'}),x=await r.json();if(!r.ok||!x?.ok||!x.state)return;
    const changed=writeLatestPlusGuests(x.state);if(!changed)return;
    const mark='wsd_plus_ops_state_'+String(x.version||'0');if(sessionStorage.getItem(mark)!=='1'){sessionStorage.setItem(mark,'1');location.reload()}
  }catch{}
}
function patch(){
  const s=local(),gs=s.guests||{};
  for(const [id,g] of Object.entries(gs)){
    if(!g||g.source!=='rsvp_plus_one')continue;
    const box=document.querySelector(`[data-recipient="${CSS.escape(id)}"]`),row=box?.closest('.guest');if(!row)continue;
    box.style.display='none';box.disabled=true;row.querySelector(`[data-manual="${CSS.escape(id)}"]`)?.style.setProperty('display','none');
    const main=gs[g.rsvpPlusOneOf]||{},label=g.rsvpSourceLabel||`Añadido por RSVP · +1 de ${main.name||'invitado'}`;
    const safeLabel=String(label).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    const meta=row.querySelector('.guestMeta');if(meta&&!meta.dataset.wsdPlus){meta.dataset.wsdPlus='1';meta.insertAdjacentHTML('afterbegin',`<span style="display:block;font-weight:750;color:var(--dark);margin-bottom:2px">${safeLabel}</span>`)}
    const assignment=row.querySelector('.assignment');if(assignment)assignment.innerHTML=`<div class="guestMeta">${safeLabel}</div>`;
  }
}
new MutationObserver(patch).observe(document.documentElement,{childList:true,subtree:true});[0,100,350,900].forEach(ms=>setTimeout(patch,ms));refresh();
})();
