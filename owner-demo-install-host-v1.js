(()=>{
'use strict';
const root=document.documentElement;
const lang=(root.dataset.lang||'es').toLowerCase();
const product=(root.dataset.product||'full').toLowerCase();
const params=new URLSearchParams(location.search),installFlow=params.get('install')==='1';
const TOKEN='weddly_shared_wedding_token',MODE='weddly_owner_demo_mode';
const tokenKey='weddly_owner_demo_token_'+lang;
const copy={
  es:{loading:'Recuperando vuestra demo…',save:'Guardar demo',missing:'No encuentro el acceso de esta demo en este dispositivo. Ábrela de nuevo desde WSD Accesos.',access:'Abrir WSD Accesos',installed:'Esta demo ya está abierta como app.',installHelp:'Para guardar esta copia, debe estar abierta en una pestaña normal de Chrome. Si arriba ves una X, pulsa ⋮ → «Abrir en Chrome». Después vuelve a tocar «Guardar demo».',ios:'En iPhone: Compartir ↑ → «Añadir a pantalla de inicio».'},
  en:{loading:'Restoring your demo…',save:'Save demo',missing:'This demo access is not available on this device. Open it again from WSD Access.',access:'Open WSD Access',installed:'This demo is already open as an app.',installHelp:'To save this copy, open it in a normal Chrome tab. If you see an X at the top, tap ⋮ → “Open in Chrome”. Then tap “Save demo” again.',ios:'On iPhone: Share ↑ → “Add to Home Screen”.'}
};
const C=copy[lang]||copy.es;
if(!document.getElementById('demoFrame')){
  const style=document.createElement('style');
  style.textContent=':root{--ink:#2C2A26;--paper:#FBF8F3;--bg:#F2EFE9;--line:#E5DED2;--muted:#756F65}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--bg);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink)}#demoFrame{display:none;width:100%;height:100dvh;border:0;background:var(--bg)}#saveDemo{position:fixed;z-index:40;right:12px;top:calc(12px + env(safe-area-inset-top));border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--ink);padding:9px 12px;font-size:12px;font-weight:800;box-shadow:0 5px 18px #0002}.boot{position:fixed;z-index:30;inset:0;display:grid;place-items:center;padding:26px;background:var(--bg);text-align:center}.card{width:min(100%,440px);background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:26px}.brand{font-family:Georgia,serif;color:#596248;font-size:31px}.brand span{display:block;font:700 11px/1.2 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-top:8px;color:var(--muted)}#demoMsg{margin-top:22px;color:var(--muted);font-size:14px;line-height:1.55}#demoAccess{display:none;margin-top:16px;background:var(--ink);color:#fff;text-decoration:none;border-radius:11px;padding:12px 15px;font-weight:750;font-size:14px}.help{display:none;position:fixed;z-index:60;inset:0;background:#0007;place-items:center;padding:24px}.help.on{display:grid}.help .card{text-align:left}.help p{white-space:pre-line;color:var(--muted);line-height:1.55;font-size:14px}.btn{width:100%;border:0;border-radius:11px;padding:12px;background:var(--ink);color:#fff;font-weight:750}';
  document.head.appendChild(style);
  document.body.innerHTML='<button id="saveDemo" type="button"></button><div id="demoBoot" class="boot"><section class="card"><div class="brand">Weddly<span>Smart Design</span></div><div id="demoMsg"></div><a id="demoAccess" href="/tester-admin.html"></a></section></div><iframe id="demoFrame" title="Weddly Smart Design · Demo"></iframe><div id="demoHelp" class="help"><section class="card"><strong>Weddly Smart Design</strong><p id="demoHelpText"></p><button id="demoHelpClose" class="btn" type="button">OK</button></section></div>';
}
const $=id=>document.getElementById(id);
const frame=$('demoFrame'),boot=$('demoBoot'),msg=$('demoMsg'),save=$('saveDemo'),help=$('demoHelp'),helpText=$('demoHelpText'),access=$('demoAccess');
let promptEvent=null;
function standalone(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function ios(){return /iPad|iPhone|iPod/.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function showHelp(text){helpText.textContent=text;help.classList.add('on')}
function getToken(){try{return localStorage.getItem(tokenKey)||''}catch{return''}}
function prepare(){const token=getToken();if(token.length<40){msg.textContent=C.missing;access.textContent=C.access;access.style.display='inline-block';save.style.display='none';return false}try{localStorage.setItem(TOKEN,token);localStorage.setItem(MODE,lang);localStorage.setItem('weddly_access_lang',lang)}catch{}return true}
function launch(){if(!prepare())return;msg.textContent=C.loading;const u=new URL('/owner-demo-shell.html',location.origin);u.searchParams.set('lang',lang);u.searchParams.set('product',product);u.searchParams.set('embed','1');u.searchParams.set('_host',String(Date.now()));frame.src=u.href;frame.addEventListener('load',()=>{setTimeout(()=>{boot.style.display='none';frame.style.display='block'},100)},{once:true})}
async function install(){
  if(ios()){showHelp(C.ios);return}
  if(promptEvent){const p=promptEvent;promptEvent=null;try{await p.prompt();const choice=await p.userChoice;if(choice?.outcome==='accepted')save.style.display='none'}catch{}return}
  if(standalone()&&!installFlow){showHelp(C.installed);return}
  showHelp(C.installHelp)
}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;save.style.display='block'});
addEventListener('appinstalled',()=>{promptEvent=null;save.style.display='none'});
save.textContent=C.save;save.onclick=install;
$('demoHelpClose').onclick=()=>help.classList.remove('on');help.onclick=e=>{if(e.target===help)help.classList.remove('on')};
if(installFlow||!standalone())save.style.display='block';else save.style.display='none';
launch();
})();