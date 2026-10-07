(()=>{
'use strict';
if(window.__GuestCatalogBridge)return;
const FLOW='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow';
const MEMBER_KEY='weddly_shared_wedding_token';
let activePromise=null,activeCache=null,activeAt=0;

function legacyUrl({recipientId,rsvpToken,lang,name,unitId,unitSize}){
  const base=new URL(location.origin+'/guests-rsvp-v105.html');
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
  const active=await fetchActive(false);
  if(!active)return legacyUrl(ctx);
  const base=new URL(active.shareBaseUrl,location.href);
  base.searchParams.set('rt',ctx.rsvpToken||'');
  base.searchParams.set('lang',ctx.lang||'es');
  if(ctx.unitId&&Number(ctx.unitSize)>1)base.searchParams.set('u',ctx.unitId);
  else{
    base.searchParams.set('g',ctx.recipientId||'');
    if(ctx.name)base.searchParams.set('n',ctx.name);
  }
  return base.href;
}
window.__GuestCatalogBridge={
  version:'catalog-bridge-v1',
  fetchActive,
  buildRecipientUrl,
  legacyUrl,
  clearCache(){activeCache=null;activeAt=0;activePromise=null}
};
})();