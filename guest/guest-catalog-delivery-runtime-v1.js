(()=>{
'use strict';
if(window.__GuestCatalogDeliveryRuntime)return;

const FLOW='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow';

function context(){
  const u=new URL(location.href),q=u.searchParams;
  return{
    rsvpToken:q.get('rt')||'',
    guestId:q.get('g')||'',
    unitId:q.get('u')||'',
    name:q.get('n')||'',
    lang:q.get('lang')==='en'?'en':'es'
  };
}
function rsvpUrl(ctx=context()){
  if(!ctx.rsvpToken)return '#';
  const u=new URL(location.origin+'/guests-rsvp-v105.html');
  u.searchParams.set('guest','1');
  u.searchParams.set('t',ctx.rsvpToken);
  u.searchParams.set('lang',ctx.lang||'es');
  u.searchParams.set('_rsvpv','46');
  if(ctx.unitId)u.searchParams.set('u',ctx.unitId);
  else{
    if(ctx.guestId)u.searchParams.set('g',ctx.guestId);
    if(ctx.name)u.searchParams.set('n',ctx.name);
  }
  return u.href;
}
function decorateConfig(input){
  const cfg=structuredClone(input||{});
  cfg.rsvp=cfg.rsvp&&typeof cfg.rsvp==='object'?cfg.rsvp:{};
  cfg.rsvp.route=rsvpUrl();
  return cfg;
}
function statusNode(){
  let n=document.getElementById('wsdCatalogDeliveryStatus');
  if(n)return n;
  n=document.createElement('div');
  n.id='wsdCatalogDeliveryStatus';
  n.hidden=true;
  document.body.appendChild(n);
  return n;
}
async function boot({publicToken,applyConfig}){
  if(typeof applyConfig!=='function')throw new Error('renderer_unavailable');
  if(!publicToken)throw new Error('missing_public_token');
  const node=statusNode();
  node.dataset.state='loading';
  const r=await fetch(FLOW,{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({action:'public_load',token:publicToken}),
    cache:'no-store'
  });
  const x=await r.json().catch(()=>({}));
  if(!r.ok||!x?.ok)throw new Error(x?.error||'request_failed');
  const cfg=decorateConfig(x.order?.config||{});
  applyConfig(cfg);
  node.dataset.state='ready';
  return{order:x.order,config:cfg,recipient:context()};
}
window.__GuestCatalogDeliveryRuntime={version:'catalog-delivery-runtime-v1',context,rsvpUrl,decorateConfig,boot};
})();