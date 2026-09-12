(()=>{
'use strict';
const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-rsvp';
const TOKEN_KEY='weddly_shared_wedding_token';
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').trim().toLowerCase();
let questions=[],submissions=[],loaded=false,loading=false;

function installStyle(){
  if(document.getElementById('wsdCustomAnswersStyle'))return;
  const s=document.createElement('style');
  s.id='wsdCustomAnswersStyle';
  s.textContent=`
    .wsd-custom-answers{margin:9px 0 0 33px;border-top:1px solid var(--line);padding-top:8px}
    .wsd-custom-answers summary{list-style:none;cursor:pointer;color:var(--dark);font-size:12px;font-weight:800;display:flex;align-items:center;gap:6px;min-height:32px}
    .wsd-custom-answers summary::-webkit-details-marker{display:none}
    .wsd-custom-answers summary::after{content:'›';margin-left:auto;font-size:18px;font-weight:500;transform:rotate(90deg);transition:transform .14s ease}
    .wsd-custom-answers[open] summary::after{transform:rotate(-90deg)}
    .wsd-custom-list{padding:3px 0 2px}
    .wsd-custom-row{padding:8px 0;border-top:1px solid var(--line)}
    .wsd-custom-row:first-child{border-top:0}
    .wsd-custom-label{display:block;color:var(--muted);font-size:11px;line-height:1.35;margin-bottom:2px}
    .wsd-custom-value{display:block;color:var(--ink);font-size:13px;line-height:1.4;font-weight:700;overflow-wrap:anywhere}
  `;
  document.head.appendChild(s);
}

function latestFor(id,name){
  return submissions
    .filter(x=>(x.guest_key&&String(x.guest_key)===String(id))||(!x.guest_key&&norm(x.name)===norm(name)))
    .sort((a,b)=>new Date(b.received_at||0)-new Date(a.received_at||0))[0]||null;
}

function rowsFor(sub){
  const raw=sub?.payload?.custom_answers;
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return[];
  const out=[];
  for(const q of questions){
    if(!q?.id||!Object.prototype.hasOwnProperty.call(raw,q.id))continue;
    const v=raw[q.id];
    if(v===null||v===undefined||v==='')continue;
    out.push({label:String(q.label||'Pregunta'),value:typeof v==='boolean'?(v?'Sí':'No'):String(v)});
  }
  return out;
}

function decorate(){
  if(!loaded)return;
  installStyle();
  const content=document.getElementById('content');
  if(!content)return;
  content.querySelectorAll('.guest').forEach(guest=>{
    if(guest.querySelector('[data-wsd-custom-answers]'))return;
    const keyEl=guest.querySelector('[data-manual]');
    const id=keyEl?.dataset?.manual||'';
    const name=guest.querySelector('.guestName')?.textContent?.trim()||'';
    if(!id&&!name)return;
    const rows=rowsFor(latestFor(id,name));
    if(!rows.length)return;
    const d=document.createElement('details');
    d.className='wsd-custom-answers';
    d.dataset.wsdCustomAnswers='1';
    d.innerHTML=`<summary>Respuestas extra · ${rows.length}</summary><div class="wsd-custom-list">${rows.map(r=>`<div class="wsd-custom-row"><span class="wsd-custom-label">${safe(r.label)}</span><span class="wsd-custom-value">${safe(r.value)}</span></div>`).join('')}</div>`;
    const main=guest.querySelector('.guestMain');
    if(main)main.insertAdjacentElement('afterend',d);else guest.appendChild(d);
  });
}

async function load(){
  if(loading)return;
  loading=true;
  try{
    const token=localStorage.getItem(TOKEN_KEY)||'';
    if(token.length<40)return;
    const r=await fetch(API+'?manage=1',{headers:{'x-weddly-token':token},cache:'no-store'});
    const x=await r.json().catch(()=>({}));
    if(!r.ok||!x?.ok)return;
    questions=Array.isArray(x.forms?.[0]?.config?.customQuestions)?x.forms[0].config.customQuestions:[];
    submissions=Array.isArray(x.submissions)?x.submissions:[];
    loaded=true;
    decorate();
  }catch{}finally{loading=false}
}

const content=document.getElementById('content');
if(content){
  const obs=new MutationObserver(()=>queueMicrotask(decorate));
  obs.observe(content,{childList:true,subtree:true});
}
[30,180,650].forEach(ms=>setTimeout(()=>{decorate();if(!loaded)load()},ms));
})();