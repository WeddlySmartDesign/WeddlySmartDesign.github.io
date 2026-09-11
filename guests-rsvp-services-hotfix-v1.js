(()=>{
'use strict';
if(window.__wsdRsvpServicesHotfix)return;window.__wsdRsvpServicesHotfix=true;
const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-rsvp',TOKEN='weddly_shared_wedding_token',LOCAL='weddly_wedding_services_v1';
function en(){try{const x=JSON.parse(localStorage.getItem('weddly_pro_v7')||'null'),v=x?.settings?.lang;if(v==='en')return true;if(v==='es')return false}catch{}return false}
const T=(es,enText)=>en()?enText:es;
function ensureRow(){let q=document.getElementById('accommodationQ');if(q)return q;const plus=document.getElementById('plusQ'),ref=plus?.closest('.question');if(!ref)return null;const row=document.createElement('label');row.className='question';row.innerHTML=`<div><b>${T('Alojamiento','Accommodation')}</b><span>${T('Pregunta quién se queda a dormir o necesita alojamiento.','Ask who will stay overnight or needs accommodation.')}</span></div><input id="accommodationQ" type="checkbox">`;ref.before(row);return row.querySelector('input')}
function local(){try{return JSON.parse(localStorage.getItem(LOCAL)||'{}')||{}}catch{return{}}}
async function sync(){const q=ensureRow();if(!q)return;const l=local();if(l.accommodation===true)q.checked=true;try{const token=localStorage.getItem(TOKEN)||'';if(!token)return;const r=await fetch(API+'?manage=1',{headers:{'x-weddly-token':token},cache:'no-store'}),x=await r.json().catch(()=>({})),c=x.forms?.[0]?.config;if(r.ok&&x.ok&&c){q.checked=c.accommodationOffered===true;if(c.accommodationOffered===true||c.transportOffered!==undefined)try{localStorage.setItem(LOCAL,JSON.stringify({transport:c.transportOffered!==false&&c.questions?.transport!==false,accommodation:c.accommodationOffered===true,updatedAt:Date.now()}))}catch{}}}catch{}}
[20,120,420].forEach(ms=>setTimeout(sync,ms));
})();