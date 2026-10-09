/* LOCAL STAGING ONLY. Generic owner preview, no backend/checkout access. */
(()=>{'use strict';
if(window.GUEST_STAGE_OWNER)return;
const reg=window.GUEST_STAGE_OWNER_REGISTRY;
if(!reg?.templates||!window.GUEST_CATALOG_OWNER_VIEWER_V2)throw Error('staging_missing_registry_or_shared_viewer');
const renderers=Object.fromEntries(Object.entries(reg.templates).map(([id,s])=>[id,{...s,label:id==='veil-light'?'VEIL LIGHT':id.toUpperCase().replaceAll('-',' ')}]));
let mode='native',seq=0,handle=null;
const layer=document.createElement('section');
layer.id='guestOwnerStagedPreview';
layer.style.cssText='display:none;position:fixed;inset:0;z-index:2147483000;background:#fff;overflow:hidden';
layer.innerHTML='<header style="height:48px;background:#f6f2ec;display:flex;align-items:center;justify-content:space-between;padding:0 15px;font:700 14px system-ui"><span>GUEST · VISTA DE PRUEBA</span><button id="guestOwnerStagedBack" type="button" style="min-height:38px;padding:8px 12px;border-radius:12px;background:#fff;color:#272522;border:1px solid #c9bcb0">CENTRO GUEST</button></header><div id="guestOwnerStagedHost" style="height:calc(100% - 48px)"></div>';
document.body.appendChild(layer);
const host=layer.querySelector('#guestOwnerStagedHost');
layer.querySelector('#guestOwnerStagedBack').addEventListener('click',()=>window.GUEST_STAGE_CLOSE?.());
function rendererFor(order){
 const id=String(order?.template_id||order?.templateId||'veil-light'),r=renderers[id];
 if(!r)throw Error('template_renderer_unavailable:'+id);
 if(r.status!=='commercially-frozen'&&order?.mode!=='test')throw Error('test_only_template:'+id);
 if(r.mode!=='native'&&String(order?.template_version||order?.templateVersion)!==String(r.version))throw Error('template_version_mismatch:'+id);
 return r;
}
function applyOrderConfig(order,config){
 const r=rendererFor(order),id=r.id;
 if(config?.template?.id&&config.template.id!==id)throw Error('template_config_id_mismatch:'+id);
 const generation=++seq;
 if(handle?.close){handle.close();handle=null}
 if(r.mode==='native'){
  mode='native';layer.style.display='none';
  const apply=window[r.applyApi];if(typeof apply!=='function')throw Error('renderer_unavailable:'+id);
  return apply(structuredClone(config));
 }
 if(r.mode!=='iframe'||!r.src||order.mode!=='test')throw Error('template_not_ready:'+id);
 mode='iframe';host.replaceChildren();
 const p=window.GUEST_CATALOG_OWNER_VIEWER_V2.show({order,config,host,registry:reg});
 p.then(h=>{if(generation!==seq){h.close();return}handle=h}).catch(e=>{
  if(generation!==seq)return;
  host.replaceChildren();
  const x=document.createElement('p');x.style.cssText='padding:20px;font:14px system-ui;color:#9f4039';x.textContent='Vista no disponible: '+String(e?.message||e);
  host.appendChild(x);
 });
 return p;
}
function open(){if(mode==='iframe')layer.style.display='block'}
function close(){seq++;layer.style.display='none';if(handle?.close){handle.close();handle=null}}
window.GUEST_STAGE_OWNER=Object.freeze({renderers,rendererFor,applyOrderConfig,open,close});
})();