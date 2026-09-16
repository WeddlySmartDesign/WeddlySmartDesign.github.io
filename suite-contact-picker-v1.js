(()=>{
'use strict';
if(window.top!==window||window.__WSD_CONTACT_PICKER_V1)return;
window.__WSD_CONTACT_PICKER_V1=async function(){
  const c=navigator.contacts;
  if(!c?.select)return{ok:false,unsupported:true};
  try{
    const items=await c.select(['name','tel','email'],{multiple:false});
    if(!items?.length)return{ok:false,cancelled:true};
    const x=items[0]||{};
    return{ok:true,contact:{name:x.name?.[0]||'',tel:x.tel?.[0]||'',email:x.email?.[0]||''}};
  }catch(e){
    return{ok:false,cancelled:e?.name==='AbortError',error:e?.name||'contact_picker_failed'};
  }
};
})();
