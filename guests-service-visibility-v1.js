(()=>{
'use strict';
const G=window.__GuestsProd;if(!G)return;
const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-rsvp',TOKEN='weddly_shared_wedding_token',LOCAL='weddly_wedding_services_v1',GKEY=G.KEY||'weddly_guests_qa_v67';
let services=null,loading=false;
function en(){try{const x=JSON.parse(localStorage.getItem('weddly_pro_v7')||'null');if(x?.settings?.lang==='en')return true;if(x?.settings?.lang==='es')return false}catch{}try{return localStorage.getItem('weddly_access_lang')==='en'}catch{return false}}
const T=(es,enText)=>en()?enText:es;
function localServices(){try{const x=JSON.parse(localStorage.getItem(LOCAL)||'null');if(x&&typeof x.transport==='boolean')return{transport:x.transport,accommodation:!!x.accommodation}}catch{}return null}
async function refresh(){if(loading)return;loading=true;try{const t=localStorage.getItem(TOKEN)||'';if(t){const r=await fetch(API+'?manage=1',{headers:{'x-weddly-token':t},cache:'no-store'}),x=await r.json().catch(()=>({})),c=x.forms?.[0]?.config;if(r.ok&&x.ok&&c){services={transport:c.transportOffered!==false&&c.questions?.transport!==false,accommodation:c.accommodationOffered===true};try{localStorage.setItem(LOCAL,JSON.stringify({...services,updatedAt:Date.now()}))}catch{}}}}catch{}finally{loading=false;if(!services)services=localServices()||{transport:true,accommodation:false};retry()}}
function guestState(){try{return JSON.parse(localStorage.getItem(GKEY)||'{}')||{}}catch{return{}}}
function csv(rows){const txt=rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\uFEFF'+txt],{type:'text/csv;charset=utf-8'}));a.download=en()?'weddly-accommodation.csv':'weddly-alojamiento.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),800)}
function setField(d,id,on){const el=d.getElementById(id);if(!el)return;el.style.display=on?'':'none';const lab=el.previousElementSibling;if(lab&&lab.tagName==='LABEL')lab.style.display=on?'':'none'}
function patch(){let d;try{d=G.f?.contentDocument}catch{return}if(!d?.body||!services)return;
  if(!d.documentElement.dataset.wsdServiceVisibilityHook){d.documentElement.dataset.wsdServiceVisibilityHook='1';d.addEventListener('click',()=>{[0,60,180].forEach(ms=>setTimeout(patch,ms))},true)}
  const list=d.getElementById('listados');
  if(list){
    for(const card of list.querySelectorAll('.card')){const title=String(card.querySelector('b')?.textContent||'').trim().toLowerCase();if(title.startsWith('transporte')||title.startsWith('transport'))card.style.display=services.transport?'':'none'}
    if(services.accommodation){
      const S=guestState(),all=Object.values(S.guests||{}).filter(g=>g?.rsvp!=='declined'&&g?.accommodation===true),sig=JSON.stringify(all.map(g=>[g.id||'',g.name||'',g.group||'',g.unitId||'']));let card=d.getElementById('wsdAccommodationList');if(!card){card=d.createElement('div');card.id='wsdAccommodationList';card.className='card';list.appendChild(card)}
      if(card.dataset.sig!==sig){card.dataset.sig=sig;card.innerHTML=`<b>${T('Alojamiento · Boda principal','Accommodation · Main wedding')}</b><p class="small">${T(`${all.length} persona${all.length===1?'':'s'} se queda${all.length===1?'':'n'} a dormir o necesita${all.length===1?'':'n'} alojamiento.`,`${all.length} ${all.length===1?'person is':'people are'} staying overnight or need accommodation.`)}</p><button class="btn soft" type="button">${T('Descargar CSV','Download CSV')}</button>`;card.querySelector('button').onclick=()=>csv([[T('Nombre','Name'),T('Grupo','Group'),T('Subgrupo','Subgroup'),T('Alojamiento','Accommodation')],...all.map(g=>[g.name||'',g.group||'',g.unitId||'',T('Sí','Yes')])])}
    }else d.getElementById('wsdAccommodationList')?.remove();
  }
  setField(d,'eTransport',services.transport);
  setField(d,'eAccommodation',services.accommodation);
}
function retry(){[0,40,140,360,800].forEach(ms=>setTimeout(patch,ms))}
G.f?.addEventListener('load',()=>{services=localServices()||services;retry();refresh()});
addEventListener('guests-prod-open',()=>{services=localServices()||services;retry()});
addEventListener('wsd-services-changed',()=>{services=localServices()||services;retry();refresh()});
addEventListener('storage',e=>{if(e.key===LOCAL){services=localServices()||services;retry()}else if(e.key===GKEY)retry()});
services=localServices()||{transport:true,accommodation:false};refresh();retry();
})();
