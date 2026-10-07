(()=>{
'use strict';
if(window.__GuestCatalogRecipientContext)return;
function params(url=location.href){
  const u=new URL(url,location.href),q=u.searchParams;
  return{
    rsvpToken:q.get('rt')||'',
    guestId:q.get('g')||'',
    unitId:q.get('u')||'',
    name:q.get('n')||'',
    lang:q.get('lang')==='en'?'en':'es'
  };
}
function rsvpUrl(ctx=params()){
  if(!ctx.rsvpToken)return'#';
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
function decorateConfig(input,ctx=params()){
  const cfg=structuredClone(input||{});
  cfg.rsvp=cfg.rsvp&&typeof cfg.rsvp==='object'?cfg.rsvp:{};
  cfg.rsvp.route=rsvpUrl(ctx);
  return cfg;
}
window.__GuestCatalogRecipientContext={version:'recipient-context-v1',params,rsvpUrl,decorateConfig};
})();