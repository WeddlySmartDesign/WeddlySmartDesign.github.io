(()=>{
'use strict';
if(window.__oneContinuityV1)return;window.__oneContinuityV1=true;
const pay=document.getElementById('paymentsFrame');
if(!pay)return;
const low=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
const mode=()=>{try{const q=new URLSearchParams(location.search).get('ownerDemo');if(q==='es'||q==='en')return q;const m=localStorage.getItem('weddly_owner_demo_mode')||'';return m==='es'||m==='en'?m:''}catch{return''}};
const lang=()=>{try{const m=mode(),k=m?'weddly_pro_v7_owner_demo_'+m:'weddly_pro_v7',x=JSON.parse(localStorage.getItem(k)||'null'),v=x?.settings?.lang;if(v==='es'||v==='en')return v}catch{}return' es'.trim()};
function id(){try{const m=mode(),k=m?'weddly_pro_v7_owner_demo_'+m:'weddly_pro_v7',s=(JSON.parse(localStorage.getItem(k)||'null')||{}).settings||{};return{p1:String(s.partner1||'').trim(),p2:String(s.partner2||'').trim(),date:String(s.weddingDate||'')}}catch{return{p1:'',p2:'',date:''}}}
function hide(el){if(!el)return;el.style.setProperty('display','none','important');el.setAttribute('aria-hidden','true')}
function fmtDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return'';const a=s.split('-').map(Number),d=new Date(a[0],a[1]-1,a[2],12);return new Intl.DateTimeFormat(lang()==='en'?'en-GB':'es-ES',{day:'numeric',month:'long',year:'numeric'}).format(d)}
function patchPayments(){
 try{
  const d=pay.contentDocument;if(!d?.body)return;
  const els=[...d.querySelectorAll('body *')];
  hide(d.querySelector('.header .brand-group'));
  els.forEach(el=>{const t=low(el.textContent);if(t==='nuestra boda'||t==='our wedding')hide(el)});
  const sys=els.filter(el=>{const t=low(el.textContent);return((t.includes('guardado automáticamente')||t.includes('guardado automaticamente'))&&t.includes('sincron'))&&t.length<180}).sort((a,b)=>low(a.textContent).length-low(b.textContent).length)[0];if(sys)hide(sys);
  const note=els.filter(el=>{const t=low(el.textContent);return(
    t.includes('guardado automático activado')||
    t.includes('guardado automatico activado')||
    t.includes('automatic saving enabled')||
    t.includes('tus cambios se guardan solos')||
    t.includes('your changes save automatically')
  )&&t.length<420}).sort((a,b)=>low(a.textContent).length-low(b.textContent).length)[0];
  if(note){
    let box=note.closest('.toast,.notice,.card,.alert-card,.sync-card');
    if(!box){
      box=note;
      for(let i=0;i<4&&box?.parentElement&&box.parentElement!==d.body;i++){
        const p=box.parentElement,txt=low(p.textContent);
        if(txt.length>520)break;
        box=p;
        if(p.querySelector('button')||p.querySelector('[role="button"]'))break;
      }
    }
    hide(box||note);
  }
  const native=d.querySelector('#view-dashboard .wedding-identity');if(native)hide(native);
  let box=d.getElementById('onePaymentsIdentity');
  if(!box){
   box=d.createElement('div');box.id='onePaymentsIdentity';box.style.cssText='margin:8px 0 24px;text-align:left';
   box.innerHTML='<div id="onePaymentsLabel" style="font:800 11px/1.2 system-ui;letter-spacing:.15em;color:#77716b;text-transform:uppercase;margin-bottom:10px"></div><div id="onePaymentsNames" style="font:500 44px/1.02 Georgia,serif;color:#2C2A26;letter-spacing:-.02em"></div><div id="onePaymentsDate" style="font:500 18px/1.35 system-ui;color:#706b65;margin-top:14px"></div>';
   const view=d.querySelector('#view-dashboard')||d.querySelector('.view.active')||d.querySelector('.view')||d.querySelector('main')||d.body;
   const firstUseful=view.querySelector('.progress-container,.progress-ring,.summary-grid,.stats-grid,.dashboard-grid')||view.firstElementChild;
   view.insertBefore(box,firstUseful||null);
  }
  const x=id();box.querySelector('#onePaymentsLabel').textContent=lang()==='en'?'PAYMENTS':'PAGOS';box.querySelector('#onePaymentsNames').textContent=[x.p1,x.p2].filter(Boolean).join(' & ');box.querySelector('#onePaymentsDate').textContent=fmtDate(x.date);
 }catch{}
}
let observer=null,queued=false;
function schedulePayments(){
 if(queued)return;queued=true;
 requestAnimationFrame(()=>{queued=false;if(pay.classList.contains('on'))patchPayments()});
}
function observePayments(){
 try{
  observer?.disconnect();
  const d=pay.contentDocument;if(!d?.documentElement)return;
  patchPayments();
  observer=new MutationObserver(schedulePayments);
  observer.observe(d.documentElement,{childList:true,subtree:true,characterData:true});
 }catch{}
}
pay.addEventListener('load',()=>setTimeout(observePayments,250));
['focus','pageshow'].forEach(ev=>addEventListener(ev,schedulePayments));
addEventListener('storage',e=>{if(!e||e.key==='weddly_pro_v7'||e.key==='weddly_owner_demo_mode')schedulePayments()});
setTimeout(observePayments,500);
})();
