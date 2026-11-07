(()=>{
'use strict';
const G=window.__GuestsProd;if(!G)return;
const KEY=G.KEY||'weddly_guests_qa_v67';
const isEn=()=>{try{const x=JSON.parse(localStorage.getItem('weddly_pro_v7')||'null');if(x?.settings?.lang==='en')return true;if(x?.settings?.lang==='es')return false}catch{}try{return localStorage.getItem('weddly_access_lang')==='en'}catch{return false}};
const labels=()=>isEn()?{pending:'Pending',confirmed:'Confirmed',declined:'Not attending',unseated:'No table',table:'Table'}:{pending:'Pendiente',confirmed:'Confirmado',declined:'No asiste',unseated:'Sin mesa',table:'Mesa'};
function state(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}}
function tableLabel(v){const L=labels(),s=String(v||'').trim();if(!s)return L.unseated;if(/^\d+$/.test(s))return`${L.table} ${Number(s)}`;return s}
function statusLabel(v){const L=labels();return v==='confirmed'?L.confirmed:v==='declined'?L.declined:L.pending}
function patch(d){if(!d?.body)return;const S=state();d.querySelectorAll('.wsd-person-row[data-id]').forEach(r=>{const g=S.guests?.[r.dataset.id],m=r.querySelector('.wsd-person-meta');if(!g||!m)return;m.textContent=[statusLabel(g.rsvp),g.group||'',g.unitId||'',tableLabel(g.table)].filter(Boolean).join(' · ')});d.querySelectorAll('.wsd-readonly').forEach(x=>{const s=String(x.textContent||'').trim();if(/^\d+$/.test(s))x.textContent=tableLabel(s)})}
function install(){let d;try{d=G.f?.contentDocument}catch{}if(!d?.body)return false;if(d.documentElement.dataset.wsdPeoplePolish==='1'){patch(d);return true}d.documentElement.dataset.wsdPeoplePolish='1';let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patch(d)})}).observe(d.body,{childList:true,subtree:true});patch(d);return true}
G.f?.addEventListener('load',()=>[30,120,320,800].forEach(ms=>setTimeout(install,ms)));addEventListener('guests-prod-open',()=>[30,120,320].forEach(ms=>setTimeout(install,ms)));[50,180,500,1200].forEach(ms=>setTimeout(install,ms));
})();
