(()=>{
  'use strict';
  const TOKEN='wsd_guest_access_token_v1';
  const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-state';
  const q=new URLSearchParams(location.search);
  const incoming=(q.get('access')||q.get('token')||'').trim();
  if(incoming.length>=40){try{localStorage.setItem(TOKEN,incoming)}catch{}}
  const getToken=()=>{try{return localStorage.getItem(TOKEN)||''}catch{return''}};
  function lock(title='Necesitas acceso a GUEST',copy='Abre el enlace de acceso que has recibido con tu invitación.'){
    if(document.getElementById('guestAccessLock'))return;
    const o=document.createElement('div');o.id='guestAccessLock';
    o.style.cssText='position:fixed;z-index:999999;inset:0;background:#FBF8F3;display:grid;place-items:center;padding:28px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#2C2A26;text-align:center';
    o.innerHTML='<div style="max-width:430px"><div style="font:500 34px Georgia,serif;color:#525C43">GUEST</div><div style="margin-top:5px;font:500 20px Georgia,serif;color:#525C43">by WeddlySmartDesign</div><h2 style="font:500 26px Georgia,serif;margin:34px 0 10px">'+title+'</h2><p style="color:#736F63;line-height:1.5;font-size:14px">'+copy+'</p><a href="mailto:weddlysmartdesign@gmail.com" style="display:inline-block;margin-top:10px;background:#2C2A26;color:#fff;text-decoration:none;border-radius:12px;padding:13px 17px;font-weight:750">Contactar con soporte</a></div>';
    document.body.appendChild(o);
  }
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){
    let url='';try{url=typeof input==='string'?input:input?.url||''}catch{}
    if(url.includes('/weddly-guests-state')){
      const token=getToken();
      if(token.length<40){lock();throw new Error('guest-access-required')}
      init={...(init||{})};
      const h=new Headers(init.headers||(typeof input!=='string'?input.headers:undefined)||{});
      h.set('x-weddly-token',token);init.headers=h;
    }
    const r=await nativeFetch(input,init);
    if(url.includes('/weddly-guests-state')&&(r.status===401||r.status===403))lock('Este acceso ya no está activo','Si tu acceso debería seguir vigente, escríbenos y lo revisamos.');
    return r;
  };
})();