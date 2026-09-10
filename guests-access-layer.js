(()=>{
  const BASE='weddly_guests_qa_v67',PAY='weddly_pro_v7',TOKEN='weddly_shared_wedding_token',MODE='weddly_owner_demo_mode',TRACK='weddly_guests_local_mode_v1';
  const rawGet=Storage.prototype.getItem,rawSet=Storage.prototype.setItem,rawRemove=Storage.prototype.removeItem;
  const params=new URLSearchParams(location.search),incoming=(params.get('ownerDemo')||'').toLowerCase();
  if(incoming==='es'||incoming==='en'){try{rawSet.call(localStorage,MODE,incoming)}catch{}}
  if(incoming==='real'){try{rawRemove.call(localStorage,MODE)}catch{}}
  let demo='';try{const x=rawGet.call(localStorage,MODE)||'';demo=x==='es'||x==='en'?x:''}catch{}
  const demoToken=demo?(rawGet.call(localStorage,'weddly_owner_demo_token_'+demo)||''):'',current=demo?'demo_'+demo:'real',snap=m=>BASE+'_snapshot_'+m;
  try{
    const previous=rawGet.call(localStorage,TRACK)||'real',base=rawGet.call(localStorage,BASE);
    if(previous!==current){if(base!==null)rawSet.call(localStorage,snap(previous),base);const next=rawGet.call(localStorage,snap(current));if(next!==null)rawSet.call(localStorage,BASE,next);else rawRemove.call(localStorage,BASE);rawSet.call(localStorage,TRACK,current)}
  }catch{}
  setInterval(()=>{try{const v=rawGet.call(localStorage,BASE);if(v!==null)rawSet.call(localStorage,snap(current),v)}catch{}},500);
  if(demo){
    Storage.prototype.getItem=function(key){if(this===localStorage&&key===PAY){const v=rawGet.call(this,PAY+'_owner_demo_'+demo);if(v!==null)return v}if(this===localStorage&&key===TOKEN&&demoToken.length>=40)return demoToken;return rawGet.call(this,key)};
  }
  function lock(){
    if(document.getElementById('wsdAccessLock'))return;
    const o=document.createElement('div');o.id='wsdAccessLock';o.style.cssText='position:fixed;z-index:999999;inset:0;background:#FBF8F3;display:grid;place-items:center;padding:28px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#2C2A26;text-align:center';
    o.innerHTML='<div style="max-width:420px"><div style="font:500 30px Georgia,serif;color:#525C43">Weddly Smart Design</div><h2 style="font:500 26px Georgia,serif;margin:34px 0 10px">Este acceso ya no está activo</h2><p style="color:#736F63;line-height:1.5;font-size:14px">Si era una prueba temporal, ha finalizado. Tus datos no se borran desde esta pantalla.</p><a href="/access.html" style="display:inline-block;margin-top:10px;background:#2C2A26;color:#fff;text-decoration:none;border-radius:12px;padding:13px 17px;font-weight:750">Abrir acceso</a></div>';
    document.body.appendChild(o);
  }
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){
    let url='';try{url=typeof input==='string'?input:input?.url||''}catch{}
    const r=await nativeFetch(input,init);
    if(url.includes('/weddly-guests-state')&&(r.status===401||r.status===403))setTimeout(lock,0);
    return r;
  };
})();