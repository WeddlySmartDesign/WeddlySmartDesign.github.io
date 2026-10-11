/* Local owner Center V4.7 extension. Does NOT alter native VEIL renderer.
 * Runtime registry/pinned assets on Cloudflare determine future designs.
 */
let guestCatalogRemoteActive=false;
function guestCatalogRemote(order,cfg){
 const tid=String(order&& (order.template_id||order.templateId)||'');
 const version=String(order&&(order.template_version||order.templateVersion)||cfg&&cfg.template&&cfg.template.version||'');
 if(!/^[a-z][a-z0-9-]{0,40}$/.test(tid)||!(/^[a-zA-Z0-9._-]{1,30}$/).test(version)||
    !cfg||!cfg.template||cfg.template.id!==tid||String(cfg.template.version)!==version)
  throw new Error('catalog_template_config_invalid');
 if(window.__guestCatalogClose)window.__guestCatalogClose();
 const shell=document.createElement('section');shell.id='guestCatalogRemoteStage';
 shell.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#f6f1eb;color:#40342c;display:flex;flex-direction:column;font:16px system-ui,sans-serif;overflow:hidden';
 const bar=document.createElement('div');bar.style.cssText='min-height:62px;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 14px;border-bottom:1px solid #d6cabe';
 const title=document.createElement('b');title.textContent='Centro GUEST · '+tid.toUpperCase();title.style.cssText='font-size:14px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis';
 const back=document.createElement('button');back.type='button';back.textContent='Volver al Centro';back.style.cssText='background:#44352d;color:#fff;border:0;border-radius:9px;min-height:44px;padding:9px 12px;font-size:13px;font-weight:700';
 const iframe=document.createElement('iframe');iframe.title='Invitación '+tid;iframe.setAttribute('referrerpolicy','no-referrer');iframe.style.cssText='border:0;width:100%;flex:1;min-height:0;background:#f6f1eb';
 const msg=document.createElement('p');msg.textContent='Cargando diseño aprobado…';msg.style.cssText='padding:12px 16px;font-size:13px;line-height:1.4;text-align:center;margin:0';
 bar.append(title,back);shell.append(bar,msg,iframe);document.body.append(shell);
 guestCatalogRemoteActive=true;
 const target='https://guest-weddlysmartdesign.pages.dev';
 const nonce=Date.now().toString(36)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
 let active=true,ready=false,timeout;
 const cleanup=()=>{active=false;clearTimeout(timeout);window.removeEventListener('message',onMessage);shell.remove();guestCatalogRemoteActive=false;window.__guestCatalogClose=null};
 window.__guestCatalogClose=cleanup;
 back.onclick=()=>{const reviewAvailable=reviewSheet.classList.contains('on');cleanup();
  if(reviewAvailable){reopen.style.display='none';return}openCenter()};
 const onMessage=e=>{
  if(!active||e.origin!==target||e.source!==iframe.contentWindow)return;
  const d=e.data||{};
  if(d.type==='guest-catalog-ready-v1'&&!ready){
   ready=true;
   iframe.contentWindow.postMessage({type:'guest-catalog-config-v1',nonce,order:{template_id:tid,template_version:version,mode:order.mode},config:cfg},target);
  }else if(d.nonce===nonce&&d.type==='guest-catalog-rendered-v1'){
   msg.textContent='';
  }else if(d.nonce===nonce&&d.type==='guest-catalog-error-v1'){
   msg.textContent='Error al abrir diseño: '+String(d.reason||'visual_unavailable').slice(0,90);msg.style.color='#972f2b';
  }
 };
 window.addEventListener('message',onMessage);
 timeout=setTimeout(()=>{if(active&&msg.textContent==='Cargando diseño aprobado…')msg.textContent='No responde el visor. Comprueba conexión y vuelve al Centro.'},50000);
 iframe.src='https://guest-weddlysmartdesign.pages.dev/guest/catalog/owner-center-remote-bridge.html';
 return {mode:'remote',id:tid,close:cleanup}
}
