(()=>{
'use strict';
if(window.__GuestCatalogBridge)return;
const FLOW='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow-qa';
const MEMBER_KEY='weddly_shared_wedding_token';
let activePromise=null,activeCache=null,activeAt=0;

function legacyUrl({recipientId,rsvpToken,lang,name,unitId,unitSize}){
  const base=new URL(location.origin+'/guest/guests-rsvp-v105.html');
  base.searchParams.set('guest','1');
  base.searchParams.set('t',rsvpToken||'');
  base.searchParams.set('lang',lang||'es');
  base.searchParams.set('_rsvpv','46');
  if(unitId&&Number(unitSize)>1){
    base.searchParams.set('u',unitId);
  }else{
    base.searchParams.set('g',recipientId||'');
    if(name)base.searchParams.set('n',name);
  }
  return base.href;
}
async function fetchActive(force=false){
  if(!force&&activeCache&&Date.now()-activeAt<60000)return activeCache;
  if(!force&&activePromise)return activePromise;
  const member=localStorage.getItem(MEMBER_KEY)||'';
  if(member.length<40)return null;
  activePromise=(async()=>{
    try{
      const c=new AbortController(),timer=setTimeout(()=>c.abort(),6500);
      const r=await fetch(FLOW,{method:'POST',headers:{'content-type':'application/json','x-weddly-token':member},body:JSON.stringify({action:'active_for_member'}),cache:'no-store',signal:c.signal});
      clearTimeout(timer);
      const x=await r.json().catch(()=>({}));
      if(!r.ok||!x?.ok||x?.active!==true||!x?.invitation?.shareBaseUrl)return null;
      activeCache=x.invitation;activeAt=Date.now();return activeCache;
    }catch{return null}finally{activePromise=null}
  })();
  return activePromise;
}
async function buildRecipientUrl(ctx){
  // Each send revalidates the delivered order instead of trusting a prior local cache.
  const active=await fetchActive(true);
  if(!active)throw new Error('catalog_invitation_unavailable');
  if(!ctx?.rsvpToken||!ctx?.recipientId&&!ctx?.unitId)throw new Error('missing_recipient_context');
  let base;
  try{base=new URL(active.shareBaseUrl);}catch{throw new Error('invalid_delivered_invitation_url')}
  if(base.protocol!=='https:'||base.username||base.password||!base.hostname)throw new Error('invalid_delivered_invitation_url');
  base.searchParams.set('rt',ctx.rsvpToken||'');
  base.searchParams.set('lang',ctx.lang||'es');
  if(ctx.unitId&&Number(ctx.unitSize)>1)base.searchParams.set('u',ctx.unitId);
  else{
    base.searchParams.set('g',ctx.recipientId||'');
    if(ctx.name)base.searchParams.set('n',ctx.name);
  }
  return base.href;
}
// Names and date come from the invitation: fill them in once so the couple never types them twice.
function seedFromInvitation(inv){
  const c=inv?.couple||{};if(!c.name1||!c.name2)return false;
  let changed=false;
  try{
    const DATA='weddly_pro_v7',x=JSON.parse(localStorage.getItem(DATA)||'{}')||{},s=x.settings||{};
    if(!s.partner1&&!s.partner2){s.partner1=c.name1;s.partner2=c.name2;changed=true}
    if(!s.weddingDate&&c.date){s.weddingDate=c.date;changed=true}
    if(changed){x.settings=s;localStorage.setItem(DATA,JSON.stringify(x))}
    const KEY='weddly_guests_qa_v67',S=JSON.parse(localStorage.getItem(KEY)||'null');
    if(S&&typeof S==='object'){S.meta=S.meta||{};let ch=false;
      if(!(Array.isArray(S.meta.couple)&&S.meta.couple[0]&&S.meta.couple[1])){S.meta.couple=[c.name1,c.name2];ch=true}
      if(!S.meta.weddingDate&&c.date){S.meta.weddingDate=c.date;ch=true}
      if(ch){localStorage.setItem(KEY,JSON.stringify(S));changed=true}}
  }catch{}
  return changed;
}
if(window===window.top&&/\/guest\/(?:index(?:\.html)?)?$/.test(location.pathname)){
  setTimeout(async()=>{const inv=await fetchActive(true);if(seedFromInvitation(inv)){try{const f=document.getElementById('app');f?.contentWindow?.location.reload()}catch{}}},1500);
}
window.__GuestCatalogBridge={
  version:'catalog-bridge-v1',
  fetchActive,
  buildRecipientUrl,
  legacyUrl,
  clearCache(){activeCache=null;activeAt=0;activePromise=null}
};
})();