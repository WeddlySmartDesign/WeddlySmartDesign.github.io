/* Shared, template-neutral owner preview host.
 * Frozen VEIL can use native renderer; new designs use separate iframe assets.
 * Never embeds template multimedia in the owner center, never rewrites guest data.
 */
(()=>{'use strict';
if(window.GUEST_CATALOG_OWNER_VIEWER_V2)return;
function fail(s){throw new Error('guest_owner_viewer:'+s)}
const sameOrigin=u=>{const x=new URL(u,location.href);if(x.protocol!=='https:'&&x.protocol!=='http:')fail('unsupported_protocol');if(x.origin!==location.origin)fail('cross_origin_template');return x.href};
const IFRAME_LOAD_TIMEOUT_MS=45000;
async function show({order,config,host,registry,signal}){
 if(!host||typeof host.replaceChildren!=='function')fail('host_missing');
 const id=String(order?.template_id||order?.templateId||'');
 if(!id)fail('order_template_id_missing');
 const pinned=order?.template_version||order?.templateVersion;
 if(typeof pinned!=='string'||!pinned.trim())fail('order_template_version_missing:'+id);
 const spec=registry?.templates?.[id];if(!spec)fail('unknown_template:'+id);
 if(String(spec.version)!==pinned)fail('version_mismatch:'+id);
 if(config?.template?.id!==id)fail('config_id_mismatch:'+id);
 if(String(config?.template?.version||'')!==pinned)fail('config_version_mismatch:'+id);
 if(spec.status!=='commercially-frozen'&&order?.mode!=='test')fail('pending_template_not_authorized_for_production:'+id);
 if(spec.mode==='native'){
   const apply=window[spec.applyApi];if(typeof apply!=='function')fail('native_adapter_missing:'+id);
   host.replaceChildren();apply(structuredClone(config));return {mode:'native',id,close(){}};
 }
 if(spec.mode!=='iframe'||!spec.src)fail('visual_asset_not_ready:'+id);
 if(signal?.aborted)fail('preview_cancelled');
 const url=sameOrigin(spec.src);
 const iframe=document.createElement('iframe');iframe.className='guest-catalog-owner-preview';iframe.title='Vista previa '+id;
 iframe.setAttribute('referrerpolicy','no-referrer');iframe.setAttribute('loading','eager');
 iframe.style.cssText='display:block;width:100%;height:100%;border:0;';
 host.replaceChildren(iframe);
 await new Promise((resolve,reject)=>{
  let completed=false,timer;
  const clean=()=>{clearTimeout(timer);signal?.removeEventListener('abort',onAbort);iframe.removeEventListener?.('load',onLoad);iframe.removeEventListener?.('error',onError)};
  const finish=(reason)=>{if(completed)return;completed=true;clean();if(reason){if(iframe.isConnected)iframe.remove();reject(new Error('guest_owner_viewer:'+reason))}else resolve()};
  const onLoad=()=>finish();
  const onError=()=>finish('iframe_load_failed');
  const onAbort=()=>finish('preview_cancelled');
  if(signal?.aborted){finish('preview_cancelled');return}
  iframe.addEventListener('load',onLoad,{once:true});iframe.addEventListener('error',onError,{once:true});
  signal?.addEventListener('abort',onAbort,{once:true});
  timer=setTimeout(()=>finish('iframe_load_timeout'),IFRAME_LOAD_TIMEOUT_MS);
  try{iframe.src=url}catch{finish('iframe_navigation_failed')}
 });
 if(signal?.aborted){if(iframe.isConnected)iframe.remove();fail('preview_cancelled')}
 if(!iframe.isConnected)fail('preview_detached');
 let apply;try{apply=iframe.contentWindow?.[spec.applyApi]}catch{if(iframe.isConnected)iframe.remove();fail('iframe_cross_origin')}
 if(typeof apply!=='function'){iframe.remove();fail('iframe_adapter_missing:'+id)}
 try{apply(structuredClone(config))}catch{iframe.remove();fail('iframe_apply_failed:'+id)}
 return {mode:'iframe',id,close(){if(iframe.isConnected)iframe.remove()}};
}
window.GUEST_CATALOG_OWNER_VIEWER_V2=Object.freeze({version:'2.0.0',show});
})();