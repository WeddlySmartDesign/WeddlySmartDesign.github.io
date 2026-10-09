/* Shared, template-neutral owner preview host.
 * Frozen VEIL can use native renderer; new designs use separate iframe assets.
 * Never embeds template multimedia in the owner center, never rewrites guest data.
 */
(()=>{'use strict';
if(window.GUEST_CATALOG_OWNER_VIEWER_V2)return;
function fail(s){throw new Error('guest_owner_viewer:'+s)}
const sameOrigin=u=>{const x=new URL(u,location.href);if(x.protocol!=='https:'&&x.protocol!=='http:')fail('unsupported_protocol');if(x.origin!==location.origin)fail('cross_origin_template');return x.href};
async function show({order,config,host,registry}){
 if(!host||typeof host.replaceChildren!=='function')fail('host_missing');
 const id=String(order?.template_id||order?.templateId||config?.template?.id||'');
 const spec=registry?.templates?.[id];if(!spec)fail('unknown_template:'+id);
 if(String(spec.version)!==String(order?.template_version||order?.templateVersion||config?.template?.version))fail('version_mismatch:'+id);
 if(config?.template?.id && config.template.id!==id)fail('config_id_mismatch:'+id);
 if(spec.status!=='commercially-frozen'&&order?.mode!=='test')fail('pending_template_not_authorized_for_production:'+id);
 if(spec.mode==='native'){
   const apply=window[spec.applyApi];if(typeof apply!=='function')fail('native_adapter_missing:'+id);
   host.replaceChildren();apply(structuredClone(config));return {mode:'native',id,close(){}};
 }
 if(spec.mode!=='iframe'||!spec.src)fail('visual_asset_not_ready:'+id);
 const url=sameOrigin(spec.src);
 const iframe=document.createElement('iframe');iframe.className='guest-catalog-owner-preview';iframe.title='Vista previa '+id;
 iframe.setAttribute('referrerpolicy','no-referrer');iframe.setAttribute('loading','eager');
 iframe.style.cssText='display:block;width:100%;height:100%;border:0;';
 host.replaceChildren(iframe);
 await new Promise((resolve,reject)=>{let resolved=false;iframe.addEventListener('load',()=>{if(!resolved){resolved=true;resolve()}},{once:true});iframe.addEventListener('error',()=>{if(!resolved){resolved=true;reject(new Error('guest_owner_viewer:iframe_load_failed'))}},{once:true});iframe.src=url});
 if(!iframe.isConnected)fail('preview_detached');
 let child;try{child=iframe.contentWindow}catch{fail('iframe_cross_origin')}
 const apply=child?.[spec.applyApi];if(typeof apply!=='function')fail('iframe_adapter_missing:'+id);
 apply(structuredClone(config));
 return {mode:'iframe',id,close(){if(iframe.isConnected)iframe.remove()}};
}
window.GUEST_CATALOG_OWNER_VIEWER_V2=Object.freeze({version:'2.0.0',show});
})();