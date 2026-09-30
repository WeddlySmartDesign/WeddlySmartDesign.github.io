(()=>{
'use strict';
if(window.__wsdRsvpPlusOneCoreLabelV1)return;window.__wsdRsvpPlusOneCoreLabelV1=true;
const KEY='weddly_guests_qa_v67';
function state(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{}}catch{return{}}}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function docs(){const out=[];try{let d=document.getElementById('app')?.contentDocument;for(let i=0;i<8&&d;i++){out.push(d);const f=d.querySelector('iframe');if(!f||!f.contentDocument)break;d=f.contentDocument}}catch{}return out}
function patch(){
  const gs=state().guests||{};
  for(const d of docs()){
    for(const [id,g] of Object.entries(gs)){
      if(!g||g.source!=='rsvp_plus_one')continue;
      const b=d.querySelector(`[data-pedit="${CSS.escape(id)}"]`),row=b?.closest('.row');if(!row)continue;
      const small=row.querySelector('.small');if(!small||small.dataset.wsdPlusSource==='1')continue;
      const main=gs[g.rsvpPlusOneOf]||{},label=g.rsvpSourceLabel||`Añadido por RSVP · +1 de ${main.name||'invitado'}`;
      small.dataset.wsdPlusSource='1';small.insertAdjacentHTML('afterbegin',`<span style="display:block;font-weight:750;color:#525c43;margin-bottom:2px">${esc(label)}</span>`);
    }
  }
}
setInterval(patch,400);addEventListener('guests-prod-open',()=>setTimeout(patch,100));
})();