(()=>{
'use strict';
const G=window.__GuestsProd;if(!G)return;
function lang(){try{const x=JSON.parse(localStorage.getItem('weddly_pro_v7')||'null'),v=x?.settings?.lang;if(v==='es'||v==='en')return v}catch{}try{const v=localStorage.getItem('weddly_access_lang');if(v==='es'||v==='en')return v}catch{}return'es'}
const T=(es,en)=>lang()==='en'?en:es;
function d(){try{return G.f?.contentDocument||null}catch{return null}}
let observed=null,scheduled=false;
function patch(){const doc=d();if(!doc?.body)return;const b=doc.getElementById('rsvpBtn');if(b){const step=b.closest('.step');const h=step?.querySelector('h3'),p=step?.querySelector('.stepHead .small');if(h)h.textContent=T('Invitaciones y respuestas','Invitations & responses');if(p)p.textContent=T('Crea, comparte y recoge las respuestas desde un mismo sitio.','Create, share and collect responses from one place.');b.textContent=T('Abrir invitaciones y respuestas','Open invitations & responses')}if(observed!==doc){observed=doc;new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;patch()})}).observe(doc.body,{childList:true,subtree:true})}}
function retry(){[30,120,320,750].forEach(ms=>setTimeout(patch,ms))}
G.f?.addEventListener('load',retry);addEventListener('guests-prod-open',retry);retry();
})();
