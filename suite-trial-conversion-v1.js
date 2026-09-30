(()=>{
'use strict';
const TOKEN='weddly_shared_wedding_token';
const RECOVERY='weddly_trial_recovery_token';
const ACCESS='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-access-trial-upgrade-qa';
const DISMISS='weddly_trial_expiry_notice_dismissed';
const DAY=86400000;

function token(){
  try{return localStorage.getItem(TOKEN)||localStorage.getItem(RECOVERY)||''}catch{return''}
}
function lang(){
  try{const v=localStorage.getItem('weddly_access_lang');if(v==='es'||v==='en')return v}catch{}
  return (navigator.language||'').toLowerCase().startsWith('es')?'es':'en';
}
function alreadyDismissed(key){
  try{return localStorage.getItem(DISMISS)===key}catch{return false}
}
function markDismissed(key){
  try{localStorage.setItem(DISMISS,key)}catch{}
}
function styles(){
  if(document.getElementById('wsdTrialExpiryStyle'))return;
  const s=document.createElement('style');s.id='wsdTrialExpiryStyle';
  s.textContent=`
  .wsd-trial-expiry{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:22px;background:rgba(35,31,28,.48);backdrop-filter:blur(4px)}
  .wsd-trial-expiry[hidden]{display:none}
  .wsd-trial-expiry-card{width:min(100%,440px);background:var(--paper,#FBF8F3);color:var(--ink,#2C2A26);border:1px solid var(--line,#E4DED2);border-radius:22px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,.22)}
  .wsd-trial-expiry-kicker{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#736F63);font-weight:850}
  .wsd-trial-expiry h2{margin:8px 0 10px;font:500 30px/1.02 Georgia,serif;color:var(--dark,#525C43)}
  .wsd-trial-expiry p{margin:0;font-size:14px;line-height:1.55;color:var(--muted,#736F63)}
  .wsd-trial-expiry-actions{display:grid;grid-template-columns:1fr 1.35fr;gap:9px;margin-top:20px}
  .wsd-trial-expiry button{min-height:46px;border-radius:12px;font-weight:800;font-size:13px;cursor:pointer}
  .wsd-trial-expiry .later{background:transparent;color:var(--ink,#2C2A26);border:1px solid var(--line,#E4DED2)}
  .wsd-trial-expiry .buy{background:var(--ink,#2C2A26);color:#fff;border:0}
  @media(max-width:390px){.wsd-trial-expiry-actions{grid-template-columns:1fr}.wsd-trial-expiry h2{font-size:27px}}
  `;
  document.head.appendChild(s);
}
function render(info){
  styles();
  const es=lang()==='es';
  const exp=String(info.expiresAt||'');
  const key=(info.weddingId||'trial')+'|'+exp;
  if(alreadyDismissed(key))return;
  const left=Math.max(0,Number(info.remainingMs||0));
  const hours=Math.ceil(left/3600000);
  const title=es?(hours<=24?'Tu prueba termina mañana':'Tu prueba está a punto de terminar'):(hours<=24?'Your trial ends tomorrow':'Your trial is about to end');
  const text=es
    ?'Si compras ONE, seguirás usando esta misma boda. Tus invitados, mesas, pagos, tareas y demás información se mantendrán.'
    :'If you buy ONE, you will keep using this same wedding. Your guests, tables, payments, tasks and other information will stay in place.';
  const wrap=document.createElement('div');wrap.className='wsd-trial-expiry';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');
  wrap.innerHTML=`<section class="wsd-trial-expiry-card">
    <div class="wsd-trial-expiry-kicker">ONE · ${es?'prueba':'trial'}</div>
    <h2>${title}</h2>
    <p>${text}</p>
    <div class="wsd-trial-expiry-actions">
      <button class="later" type="button">${es?'Ahora no':'Not now'}</button>
      <button class="buy" type="button">${es?'Comprar ONE':'Buy ONE'}</button>
    </div>
  </section>`;
  wrap.querySelector('.later').onclick=()=>{markDismissed(key);wrap.remove()};
  wrap.querySelector('.buy').onclick=()=>{
    try{localStorage.setItem(RECOVERY,token())}catch{}
    location.href='/one.html?trial=1#comprar';
  };
  document.body.appendChild(wrap);
}
async function check(){
  const t=token();if(t.length<40)return;
  try{
    const r=await fetch(ACCESS,{method:'POST',headers:{'Content-Type':'application/json','x-weddly-member':t},body:JSON.stringify({action:'trial_status'}),cache:'no-store'});
    const x=await r.json().catch(()=>({}));
    if(!r.ok||!x?.ok||!x.tester||x.expired||!x.expiresAt)return;
    const left=Date.parse(x.expiresAt)-Date.now();
    if(left<=0||left>DAY)return;
    render({...x,remainingMs:left});
  }catch{}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(check,900),{once:true});else setTimeout(check,900);
})();