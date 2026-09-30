(()=>{
'use strict';
const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-rsvp';
const TOKEN_KEY='weddly_shared_wedding_token';
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').trim().toLowerCase();
let questionsByForm=new Map(),fallbackQuestions=[],submissions=[],loaded=false,loading=false;

function installStyle(){
  if(document.getElementById('wsdCustomAnswersStyle'))return;
  const s=document.createElement('style');
  s.id='wsdCustomAnswersStyle';
  s.textContent=`
    .wsd-custom-answers{margin:9px 0 0 33px;border:1px solid var(--line);background:var(--soft);border-radius:12px;padding:9px 11px}
    .wsd-custom-answers summary{list-style:none;cursor:pointer;color:var(--dark);font-size:12px;font-weight:850;display:flex;align-items:center;gap:6px;min-height:28px}
    .wsd-custom-answers summary::-webkit-details-marker{display:none}
    .wsd-custom-answers summary::after{content:'›';margin-left:auto;font-size:18px;font-weight:500;transform:rotate(90deg);transition:transform .14s ease}
    .wsd-custom-answers[open] summary::after{transform:rotate(-90deg)}
    .wsd-custom-list{padding:4px 0 0}
    .wsd-custom-row{padding:8px 0;border-top:1px solid var(--line)}
    .wsd-custom-row:first-child{border-top:0}
    .wsd-custom-label{display:block;color:var(--muted);font-size:11px;line-height:1.35;margin-bottom:2px}
    .wsd-custom-value{display:block;color:var(--ink);font-size:13px;line-height:1.4;font-weight:750;overflow-wrap:anywhere}
  `;
  document.head.appendChild(s);
}

function latestFor(id,name){
  return submissions
    .filter(x=>(x.guest_key&&String(x.guest_key)===String(id))||(!x.guest_key&&norm(x.name)===norm(name)))
    .sort((a,b)=>new Date(b.received_at||0)-new Date(a.received_at||0))[0]||null;
}

function defsFor(sub){
  const byForm=questionsByForm.get(String(sub?.form_id||''));
  return Array.isArray(byForm)&&byForm.length?byForm:fallbackQuestions;
}

function answerText(v){
  return typeof v==='boolean'?(v?'Sí':'No'):String(v);
}

function rowsFor(sub){
  const raw=sub?.payload?.custom_answers;
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return[];
  const defs=defsFor(sub),byId=new Map(defs.filter(q=>q?.id).map(q=>[String(q.id),q]));
  const out=[];
  for(const [id,v] of Object.entries(raw)){
    if(v===null||v===undefined||v==='')continue;
    const q=byId.get(String(id));
    out.push({label:String(q?.label||'Pregunta personalizada'),value:answerText(v)});
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
    d.innerHTML=`<summary>Respuestas personalizadas · ${rows.length}</summary><div class="wsd-custom-list">${rows.map(r=>`<div class="wsd-custom-row"><span class="wsd-custom-label">${safe(r.label)}</span><span class="wsd-custom-value">${safe(r.value)}</span></div>`).join('')}</div>`;
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
    questionsByForm=new Map();
    fallbackQuestions=[];
    for(const form of Array.isArray(x.forms)?x.forms:[]){
      const defs=Array.isArray(form?.config?.customQuestions)?form.config.customQuestions:[];
      questionsByForm.set(String(form?.id||''),defs);
      if(!fallbackQuestions.length&&defs.length)fallbackQuestions=defs;
    }
    submissions=Array.isArray(x.submissions)?x.submissions:[];
    loaded=true;
    document.querySelectorAll('[data-wsd-custom-answers]').forEach(el=>el.remove());
    decorate();
  }catch{}finally{loading=false}
}

const content=document.getElementById('content');
if(content){
  let queued=false;
  const obs=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{queued=false;decorate()});
  });
  obs.observe(content,{childList:true,subtree:true});
}
[30,180,650].forEach(ms=>setTimeout(()=>{decorate();if(!loaded)load()},ms));
addEventListener('focus',()=>load());
})();