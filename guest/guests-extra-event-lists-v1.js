(()=>{
'use strict';
const G=window.__GuestsProd;if(!G)return;
const EVENT_API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-event-state';
const INVITE_API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-event-invite';
const TOKEN='weddly_shared_wedding_token',GKEY=G.KEY||'weddly_guests_qa_v67';
let reports=new Map(),busy=false,last=0,lastSig='';

function demo(){try{const d=new URLSearchParams(location.search).get('ownerDemo');return d==='es'||d==='en'?d:''}catch{return''}}
function en(){if(demo())return demo()==='en';try{if(localStorage.getItem('weddly_access_lang')==='en')return true;return JSON.parse(localStorage.getItem('weddly_pro_v7')||'null')?.settings?.lang==='en'}catch{return false}}
const T=(es,enText)=>en()?enText:es;
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function headers(){const h={'content-type':'application/json','x-weddly-token':localStorage.getItem(TOKEN)||''};if(demo())h['x-weddly-demo']=demo();return h}
function doc(){try{let d=G.f?.contentDocument;for(let i=0;i<8&&d;i++){if(d.getElementById('listados')&&d.getElementById('hoy'))return d;d=d.querySelector('iframe')?.contentDocument}return null}catch{return null}}
function guestMap(){try{const key=GKEY+(demo()?'_snapshot_demo_'+demo():'');const s=JSON.parse(localStorage.getItem(key)||localStorage.getItem(GKEY)||'{}')||{};return new Map(Object.entries(s.guests||{}).map(([id,g])=>[String(id),g]))}catch{return new Map()}}
async function getEventState(){const r=await fetch(EVENT_API,{headers:headers(),cache:'no-store'}),x=await r.json().catch(()=>({}));if(!r.ok||!x?.ok)throw 0;return x.state||{events:{}}}
async function getInvite(eventId){try{const r=await fetch(INVITE_API+'?event_id='+encodeURIComponent(eventId),{headers:headers(),cache:'no-store'}),x=await r.json().catch(()=>({}));return r.ok&&x?.ok?x:{recipients:[]}}catch{return{recipients:[]}}}
function build(ev,invite,gm){
 const selected=[...new Set((ev.guestIds||[]).map(String))],answers=new Map(),names=new Map();
 for(const r of invite?.recipients||[])for(const m of r.members||[]){const id=String(m.id||'');if(!id)continue;names.set(id,String(m.name||''));const a=r.response?.[m.id];if(a==='yes'||a==='no')answers.set(id,a)}
 const all=selected.map(id=>{const g=gm.get(id)||{},a=answers.get(id)||'pending';return{id,name:String(g.name||names.get(id)||T('Invitado','Guest')),group:String(g.group||''),status:a}});
 const yes=all.filter(x=>x.status==='yes'),no=all.filter(x=>x.status==='no').length,pending=all.filter(x=>x.status==='pending').length;
 const date=String(ev.date||''),summary=T(`${yes.length} confirmado${yes.length===1?'':'s'} · ${no} no asiste${no===1?'':'n'} · ${pending} pendiente${pending===1?'':'s'}`,`${yes.length} confirmed · ${no} not attending · ${pending} pending`)+(date?' · '+date:'');
 return{kind:'event:'+String(ev.id),title:T(`Evento extra · ${ev.name||'Evento'}`,`Extra event · ${ev.name||'Event'}`),code:'EVT',headers:[T('Nombre','Name'),T('Grupo','Group')],rows:yes.map(x=>[x.name,x.group]),summary,counts:{yes:yes.length,no,pending},event:ev};
}
function render(){
 const d=doc(),list=d?.getElementById('listados');if(!d||!list)return;
 const sig=JSON.stringify([...reports.values()].map(r=>[r.kind,r.title,r.summary,r.rows]));
 if(sig===lastSig&&list.querySelector('[data-wsd-event-list]'))return;lastSig=sig;
 list.querySelectorAll('[data-wsd-event-list]').forEach(x=>x.remove());
 const hist=d.getElementById('wsdCopyHistory');
 for(const r of reports.values()){
   const card=d.createElement('div');card.className='card';card.dataset.wsdEventList='1';card.dataset.eventId=r.kind.slice(6);
   card.innerHTML=`<b>${safe(r.title)}</b><p class="small">${safe(r.summary)}</p><div class="actions"><button class="btn" type="button" data-event-pdf="${safe(r.kind.slice(6))}">${T('Imprimir / PDF','Print / PDF')}</button><button class="btn soft" type="button" data-event-csv="${safe(r.kind.slice(6))}">Excel / CSV</button></div>`;
   hist?list.insertBefore(card,hist):list.appendChild(card);
 }
}
async function refresh(force=false){
 if(busy||(!force&&Date.now()-last<12000)){render();return}busy=true;
 try{
   const token=localStorage.getItem(TOKEN)||'';if(token.length<20)return;
   const s=await getEventState(),gm=guestMap(),events=Object.values(s.events||{}).filter(e=>e&&e.enabled!==false);
   const invites=await Promise.all(events.map(e=>getInvite(e.id)));
   reports=new Map(events.map((e,i)=>[String(e.id),build(e,invites[i],gm)]));last=Date.now();render();
 }catch{}finally{busy=false}
}
window.__WsdEventReports={get(id){return reports.get(String(id))||null},refresh(){return refresh(true)}};
G.f?.addEventListener('load',()=>setTimeout(()=>refresh(true),650));
addEventListener('guests-prod-open',()=>setTimeout(()=>refresh(true),450));
addEventListener('focus',()=>refresh(true));
addEventListener('storage',e=>{if(e.key===GKEY)setTimeout(()=>refresh(true),120)});
setInterval(()=>refresh(false),2500);setTimeout(()=>refresh(true),850);
})();