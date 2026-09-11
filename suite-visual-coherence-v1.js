(()=>{
'use strict';
if(window.__wsdSuiteVisualCoherence)return;window.__wsdSuiteVisualCoherence=true;
const payFrame=document.getElementById('paymentsFrame'),guestFrame=document.getElementById('guestsFrame'),planningFrame=document.getElementById('planningFrame'),auxFrame=document.getElementById('auxFrame');
if(!payFrame||!guestFrame||!planningFrame||!auxFrame)return;
const lang=()=>document.documentElement.lang==='en'?'en':'es';
const copy={es:{payments:'Pagos',paySub:'PRESUPUESTO Y PAGOS',guests:'INVITADOS'},en:{payments:'Payments',paySub:'BUDGET & PAYMENTS',guests:'GUESTS'}};
function addGlobalHierarchy(){
  document.getElementById('wsdPrimaryNavLabel')?.remove();
  if(document.getElementById('wsdSuiteHierarchyStyle'))return;
  const s=document.createElement('style');s.id='wsdSuiteHierarchyStyle';s.textContent=`
    .global{padding-bottom:10px!important;box-shadow:0 1px 0 var(--line)}
    .brandrow{margin-bottom:9px!important}
    .tabs{padding:4px!important;background:var(--soft)!important;border:1px solid var(--line)!important;border-radius:14px!important;gap:3px!important}
    .tab{border:0!important;background:transparent!important;color:var(--muted)!important;border-radius:10px!important;min-height:38px!important;padding:8px 4px!important;font-size:12px!important;font-weight:780!important;box-shadow:none!important}
    .tab.on{background:var(--dark)!important;color:#fff!important;box-shadow:0 2px 8px rgba(44,42,38,.12)!important}
    @media(min-width:760px){.tab{font-size:13px!important}}
  `;document.head.appendChild(s)
}
function ensureStyle(d,id,css){if(!d||d.getElementById(id))return;const s=d.createElement('style');s.id=id;s.textContent=css;d.head?.appendChild(s)}
function patchPayments(){
  try{
    const d=payFrame.contentDocument;if(!d?.body)return;
    const c=copy[lang()]||copy.es;
    ensureStyle(d,'wsd-suite-payments-coherence',`
      body{background:var(--bg)!important}
      .app-container{max-width:680px!important;background:var(--bg)!important;box-shadow:none!important}
      .header{position:relative!important;top:auto!important;background:var(--bg)!important;border-bottom:0!important;padding:20px 22px 10px!important;align-items:flex-end!important}
      .brand-group{line-height:1.03!important}
      .brand-title{font-family:ui-serif,Georgia,Cambria,"Times New Roman",serif!important;font-size:34px!important;font-weight:500!important;color:var(--ink)!important;letter-spacing:0!important}
      .brand-subtitle{font-family:system-ui,-apple-system,"Segoe UI",sans-serif!important;font-size:10px!important;letter-spacing:.16em!important;color:#77716b!important;font-weight:800!important;margin-top:7px!important}
      .header-actions{align-self:center!important}
      .view{padding:12px 22px 28px!important}
      #view-dashboard .wedding-identity{text-align:left!important;margin:0 0 17px!important;padding:0!important}
      #view-dashboard .wedding-eyebrow{font-size:11px!important;letter-spacing:.12em!important;color:#77716b!important;margin-bottom:7px!important}
      #view-dashboard .wedding-names{font-family:ui-serif,Georgia,Cambria,"Times New Roman",serif!important;font-size:44px!important;line-height:1.02!important;font-weight:500!important;color:var(--ink)!important}
      #view-dashboard .wedding-date{font-size:18px!important;color:#706b65!important;font-weight:500!important;margin-top:12px!important}
      #view-dashboard .wedding-countdown{font-size:14px!important;color:#706b65!important;margin-top:4px!important}
      #view-dashboard #autosave-note{text-align:left!important;margin:0 0 20px!important;font-size:12px!important}
      .stat-card{border-radius:18px!important;padding:18px!important}
      .stat-card .label{font-size:14px!important;color:#706b65!important}
      .stat-card .val{font-family:ui-serif,Georgia,Cambria,"Times New Roman",serif!important;font-size:27px!important;font-weight:500!important}
      .alert-card,.provider-card,.sync-card{border-radius:18px!important}
      h3{font-size:11px!important;letter-spacing:.12em!important;color:#77716b!important;border-bottom:0!important;padding-bottom:0!important}
      nav{background:#fff!important;border-top:1px solid var(--paper-line)!important;padding:8px 6px calc(8px + env(safe-area-inset-bottom))!important;gap:4px!important}
      nav button{font-size:15px!important;font-weight:700!important;color:var(--ink)!important;min-height:48px!important;border-radius:13px!important;gap:0!important}
      nav button svg{display:none!important}
      nav button.active{background:var(--sage-light)!important;color:var(--sage-dark)!important}
      @media(max-width:420px){.header{padding-left:18px!important;padding-right:18px!important}.view{padding-left:18px!important;padding-right:18px!important}#view-dashboard .wedding-names{font-size:40px!important}.brand-title{font-size:31px!important}.stat-card .val{font-size:24px!important}}
    `);
    const title=d.querySelector('.brand-title');if(title&&title.textContent!==c.payments)title.textContent=c.payments;
    const sub=d.querySelector('.brand-subtitle');if(sub&&sub.textContent!==c.paySub)sub.textContent=c.paySub;
    const settings=d.getElementById('nav-settings');if(settings)settings.style.setProperty('display','none','important');
  }catch{}
}
function patchGuests(){
  try{
    const shell=guestFrame.contentDocument,inner=shell?.getElementById('app');if(!inner)return;
    if(!inner.dataset.wsdVisualHook){inner.dataset.wsdVisualHook='1';inner.addEventListener('load',()=>setTimeout(patchGuests,40));}
    const d=inner.contentDocument;if(!d?.body)return;
    ensureStyle(d,'wsd-suite-guests-coherence',`
      .wrap{max-width:680px!important;padding-top:20px!important}
      .brand{font-size:0!important;line-height:1!important;min-height:13px!important;color:#77716b!important}
      .brand::after{content:var(--wsd-guests-label);font-size:11px!important;line-height:1!important;letter-spacing:.15em!important;color:#77716b!important;font-weight:800!important;text-transform:uppercase}
      h1{font-family:ui-serif,Georgia,Cambria,"Times New Roman",serif!important;font-weight:500!important}
      .card,.stat,.step{border-radius:20px!important}
      .nav{background:#fff!important;padding:8px 6px calc(8px + env(safe-area-inset-bottom))!important;gap:4px!important}
      .nav button{min-height:48px!important;border-radius:13px!important;color:#2c2a26!important}
      .nav button.on{background:#eef0e9!important;color:#525c43!important}
    `);
    const label=(copy[lang()]||copy.es).guests;
    const cssValue='"'+label.replace(/"/g,'\\"')+'"';
    if(d.documentElement.style.getPropertyValue('--wsd-guests-label')!==cssValue)d.documentElement.style.setProperty('--wsd-guests-label',cssValue);
  }catch{}
}
function patchPlanning(){
  try{
    const d=planningFrame.contentDocument;if(!d?.body)return;
    ensureStyle(d,'wsd-suite-planning-coherence',`
      .app{max-width:680px!important}
      .top{padding-top:20px!important}
      #eyebrow{display:none!important}
      .brand,.hero h1,.section h2,.sheetHead h2{font-family:ui-serif,Georgia,Cambria,"Times New Roman",serif!important;font-weight:500!important}
      .nav{gap:8px!important}
      .nav button{border-radius:18px!important}
    `);
  }catch{}
}
function patchSettings(){
  try{
    const d=auxFrame.contentDocument;if(!d?.body||!d.getElementById('content')||!d.getElementById('save'))return;
    ensureStyle(d,'wsd-suite-settings-coherence',`
      .app{max-width:680px!important;background:var(--bg)!important;box-shadow:none!important;padding-top:20px!important}
      .top{display:none!important}
      .eyebrow{font-size:11px!important;letter-spacing:.15em!important;color:var(--muted)!important}
      h1{font-family:ui-serif,Georgia,Cambria,"Times New Roman",serif!important;font-size:40px!important;font-weight:500!important}
      .card,.sync{border-radius:18px!important}
    `);
  }catch{}
}
function patchAll(){addGlobalHierarchy();patchPayments();patchGuests();patchPlanning();patchSettings()}
function retry(fn){[40,180,500,1200,2600].forEach(ms=>setTimeout(fn,ms))}
payFrame.addEventListener('load',()=>retry(patchPayments));
guestFrame.addEventListener('load',()=>retry(patchGuests));
planningFrame.addEventListener('load',()=>retry(patchPlanning));
auxFrame.addEventListener('load',()=>retry(patchSettings));
new MutationObserver(()=>patchAll()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
patchAll();retry(patchPayments);retry(patchGuests);retry(patchPlanning);retry(patchSettings);
})();
