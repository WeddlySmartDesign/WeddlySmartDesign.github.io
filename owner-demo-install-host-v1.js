(()=>{
'use strict';
const root=document.documentElement;
const lang=(root.dataset.lang||'es').toLowerCase();
const product=(root.dataset.product||'full').toLowerCase();
const params=new URLSearchParams(location.search),installFlow=params.get('install')==='1';
const TOKEN='weddly_shared_wedding_token',MODE='weddly_owner_demo_mode';
const tokenKey='weddly_owner_demo_token_'+lang;
const BROWSER_BRIDGE='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-browser-bridge';
const labels={es:{full:'Completa',payments:'Pagos',guests:'Invitados'},en:{full:'Full app',payments:'Payments',guests:'Guests'}};
const copy={
  es:{loading:'Recuperando vuestra demo…',missing:'No encuentro el acceso de esta demo en este dispositivo. Ábrela de nuevo desde WSD Accesos.',access:'Abrir WSD Accesos',gateTitle:'Guardar esta demo',gateText:'La demo está preparada. Primero guárdala como una app independiente; después la abriremos.',install:'Instalar esta demo',waiting:'Preparando instalación…',menu:'Chrome no ha mostrado todavía el aviso automático. Toca ⋮ en Chrome y elige «Instalar app» o «Añadir a pantalla de inicio». Esta pantalla se quedará aquí hasta que la guardes.',wrongWindow:'Esta pantalla sigue abierta dentro de una WSD instalada. Para poder guardar otra copia debe abrirse en Chrome.',openChrome:'Abrir Chrome para instalar',saved:'Demo guardada correctamente.',openDemo:'Abrir demo',cancelled:'La instalación no se ha completado. Puedes volver a intentarlo.',ios:'En iPhone: Compartir ↑ → «Añadir a pantalla de inicio».',product:'Demo'},
  en:{loading:'Restoring your demo…',missing:'This demo access is not available on this device. Open it again from WSD Access.',access:'Open WSD Access',gateTitle:'Save this demo',gateText:'The demo is ready. Save it first as a separate app, then we will open it.',install:'Install this demo',waiting:'Preparing installation…',menu:'Chrome has not shown the automatic prompt yet. Tap ⋮ in Chrome and choose “Install app” or “Add to Home Screen”. This screen will stay here until you save it.',wrongWindow:'This screen is still open inside an installed WSD. To save another copy it must open in Chrome.',openChrome:'Open Chrome to install',saved:'Demo saved successfully.',openDemo:'Open demo',cancelled:'Installation was not completed. You can try again.',ios:'On iPhone: Share ↑ → “Add to Home Screen”.',product:'Demo'}
};
const C=copy[lang]||copy.es;
if(!document.getElementById('demoFrame')){
  const style=document.createElement('style');
  style.textContent=':root{--ink:#2C2A26;--paper:#FBF8F3;--bg:#F2EFE9;--line:#E5DED2;--muted:#756F65;--sage:#596248}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--bg);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink)}#demoFrame{display:none;width:100%;height:100dvh;border:0;background:var(--bg)}#saveDemo{display:none}.boot{position:fixed;z-index:30;inset:0;display:grid;place-items:center;padding:26px;background:var(--bg);text-align:center}.card{width:min(100%,440px);background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:26px;box-shadow:0 12px 30px rgba(44,42,38,.05)}.brand{font-family:Georgia,serif;color:var(--sage);font-size:31px}.brand span{display:block;font:700 11px/1.2 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-top:8px;color:var(--muted)}#demoMsg{margin-top:22px;color:var(--muted);font-size:14px;line-height:1.55}#demoAccess{display:none;margin-top:16px;background:var(--ink);color:#fff;text-decoration:none;border-radius:11px;padding:12px 15px;font-weight:750;font-size:14px}.gate{display:none;margin-top:20px}.gate.on{display:block}.gateTitle{font:500 24px/1.2 Georgia,serif;margin:0 0 9px;color:var(--ink)}.gateMeta{font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:var(--muted);font-weight:800;margin-bottom:14px}.gateText{font-size:14px;line-height:1.55;color:var(--muted);margin:0 0 18px}.gateBtn{display:block;width:100%;border:0;border-radius:12px;padding:14px 15px;background:var(--ink);color:#fff;font-size:14px;font-weight:800;cursor:pointer}.gateBtn.secondary{margin-top:10px;background:#fff;color:var(--ink);border:1px solid var(--line)}.gateBtn:disabled{opacity:.55;cursor:wait}.help{display:none;position:fixed;z-index:60;inset:0;background:#0007;place-items:center;padding:24px}.help.on{display:grid}.help .card{text-align:left}.help p{white-space:pre-line;color:var(--muted);line-height:1.55;font-size:14px}.btn{width:100%;border:0;border-radius:11px;padding:12px;background:var(--ink);color:#fff;font-weight:750}';
  document.head.appendChild(style);
  document.body.innerHTML='<div id="demoBoot" class="boot"><section class="card"><div class="brand">Weddly<span>Smart Design</span></div><div id="demoMsg"></div><div id="installGate" class="gate"><div id="gateMeta" class="gateMeta"></div><h1 id="gateTitle" class="gateTitle"></h1><p id="gateText" class="gateText"></p><button id="gatePrimary" class="gateBtn" type="button"></button><button id="gateSecondary" class="gateBtn secondary" type="button" style="display:none"></button></div><a id="demoAccess" href="/tester-admin.html"></a></section></div><iframe id="demoFrame" title="Weddly Smart Design · Demo"></iframe><div id="demoHelp" class="help"><section class="card"><strong>Weddly Smart Design</strong><p id="demoHelpText"></p><button id="demoHelpClose" class="btn" type="button">OK</button></section></div>';
}
const $=id=>document.getElementById(id);
const frame=$('demoFrame'),boot=$('demoBoot'),msg=$('demoMsg'),access=$('demoAccess'),gate=$('installGate'),gateMeta=$('gateMeta'),gateTitle=$('gateTitle'),gateText=$('gateText'),primary=$('gatePrimary'),secondary=$('gateSecondary'),help=$('demoHelp'),helpText=$('demoHelpText');
let promptEvent=null,installed=false;
function standalone(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function ios(){return /iPad|iPhone|iPod/.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function android(){return /Android/i.test(navigator.userAgent||'')}
function showHelp(text){helpText.textContent=text;help.classList.add('on')}
function getToken(){try{return localStorage.getItem(tokenKey)||''}catch{return''}}
function prepare(){const token=getToken();if(token.length<40){msg.textContent=C.missing;access.textContent=C.access;access.style.display='inline-block';return false}try{localStorage.setItem(TOKEN,token);localStorage.setItem(MODE,lang);localStorage.setItem('weddly_access_lang',lang)}catch{}return true}
function cleanUrl(){const u=new URL(location.href);u.searchParams.delete('install');u.searchParams.delete('_from');u.searchParams.delete('_bridge');return u.href}
function bridgeUrl(){const b=new URL(BROWSER_BRIDGE);const target=new URL(location.href);target.searchParams.set('install','1');target.searchParams.set('_bridge',String(Date.now()));b.searchParams.set('to',target.href);return b.href}
function chromeIntent(url){const clean=url.replace(/^https?:\/\//,'');return `intent://${clean}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`}
function hideNestedInstall(){
  try{
    const shellDoc=frame.contentDocument,suiteFrame=shellDoc?.getElementById('demo'),suiteDoc=suiteFrame?.contentDocument,aux=suiteDoc?.getElementById('auxFrame'),settings=aux?.contentDocument;
    settings?.getElementById('wsdSuiteInstallTitle')?.remove();
    settings?.getElementById('wsdSuiteInstallCard')?.remove();
  }catch{}
}
function launch(){if(!prepare())return;gate.classList.remove('on');msg.style.display='block';msg.textContent=C.loading;const u=new URL('/owner-demo-shell.html',location.origin);u.searchParams.set('lang',lang);u.searchParams.set('product',product);u.searchParams.set('embed','1');u.searchParams.set('_host',String(Date.now()));frame.src=u.href;frame.addEventListener('load',()=>{setTimeout(()=>{boot.style.display='none';frame.style.display='block';hideNestedInstall()},100)},{once:true})}
function showGate(){
  if(!prepare())return;
  msg.style.display='none';gate.classList.add('on');gateMeta.textContent=`${C.product} · ${labels[lang]?.[product]||product}`;gateTitle.textContent=C.gateTitle;gateText.textContent=C.gateText;primary.textContent=C.install;primary.disabled=false;secondary.style.display='none';
  if(standalone()){
    gateText.textContent=C.wrongWindow;primary.textContent=C.openChrome;primary.onclick=()=>{const b=bridgeUrl();location.href=android()?chromeIntent(b):b};return;
  }
  primary.onclick=installDemo;
  setTimeout(()=>{if(!promptEvent&&!installed&&installFlow){primary.textContent=C.install;primary.disabled=false}},1200);
}
function markInstalled(){installed=true;promptEvent=null;gateTitle.textContent=C.saved;gateText.textContent='';primary.textContent=C.openDemo;primary.disabled=false;primary.onclick=()=>location.replace(cleanUrl());secondary.style.display='none'}
async function installDemo(){
  if(ios()){showHelp(C.ios);return}
  if(promptEvent){const p=promptEvent;promptEvent=null;primary.disabled=true;primary.textContent=C.waiting;try{await p.prompt();const choice=await p.userChoice;if(choice?.outcome==='accepted'){markInstalled();return}gateText.textContent=C.cancelled}catch{}primary.disabled=false;primary.textContent=C.install;return}
  showHelp(C.menu)
}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;if(installFlow&&!standalone()){primary.disabled=false;primary.textContent=C.install}});
addEventListener('appinstalled',markInstalled);
$('demoHelpClose').onclick=()=>help.classList.remove('on');help.onclick=e=>{if(e.target===help)help.classList.remove('on')};
if('serviceWorker'in navigator)navigator.serviceWorker.register('/demo-sw.js?v=1',{scope:location.pathname}).catch(()=>{});
setInterval(hideNestedInstall,400);
if(installFlow)showGate();else launch();
})();