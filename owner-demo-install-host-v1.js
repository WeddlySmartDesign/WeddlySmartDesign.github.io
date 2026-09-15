(()=>{
'use strict';
const root=document.documentElement;
const lang=(root.dataset.lang||'es').toLowerCase();
const product=(root.dataset.product||'full').toLowerCase();
const TOKEN='weddly_shared_wedding_token',MODE='weddly_owner_demo_mode';
const tokenKey='weddly_owner_demo_token_'+lang;
const copy={
  es:{loading:'Recuperando vuestra demo…',save:'Guardar demo',ready:'Demo lista',missing:'No encuentro el acceso de esta demo en este dispositivo. Ábrela de nuevo desde WSD Accesos.',access:'Abrir WSD Accesos',installed:'Esta demo ya está abierta como app.',installHelp:'Esta copia tiene una identidad propia. En Chrome usa el menú ⋮ → «Instalar app» o «Añadir a pantalla de inicio».',ios:'En iPhone: Compartir ↑ → «Añadir a pantalla de inicio».',failed:'No hemos podido abrir la demo.'},
  en:{loading:'Restoring your demo…',save:'Save demo',ready:'Demo ready',missing:'This demo access is not available on this device. Open it again from WSD Access.',access:'Open WSD Access',installed:'This demo is already open as an app.',installHelp:'This copy has its own app identity. In Chrome use ⋮ → “Install app” or “Add to Home Screen”.',ios:'On iPhone: Share ↑ → “Add to Home Screen”.',failed:'We could not open the demo.'}
};
const C=copy[lang]||copy.es;
const $=id=>document.getElementById(id);
const frame=$('demoFrame'),boot=$('demoBoot'),msg=$('demoMsg'),save=$('saveDemo'),help=$('demoHelp'),helpText=$('demoHelpText'),access=$('demoAccess');
let promptEvent=null;
function standalone(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function ios(){return /iPad|iPhone|iPod/.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function showHelp(text){helpText.textContent=text;help.classList.add('on')}
function getToken(){try{return localStorage.getItem(tokenKey)||''}catch{return''}}
function prepare(){const token=getToken();if(token.length<40){msg.textContent=C.missing;access.textContent=C.access;access.style.display='inline-block';save.style.display='none';return false}try{localStorage.setItem(TOKEN,token);localStorage.setItem(MODE,lang);localStorage.setItem('weddly_access_lang',lang)}catch{}return true}
function launch(){if(!prepare())return;msg.textContent=C.loading;const u=new URL('/owner-demo-shell.html',location.origin);u.searchParams.set('lang',lang);u.searchParams.set('product',product);u.searchParams.set('embed','1');u.searchParams.set('_host',String(Date.now()));frame.src=u.href;frame.addEventListener('load',()=>{setTimeout(()=>{boot.style.display='none';frame.style.display='block'},100)},{once:true})}
async function install(){if(standalone()){showHelp(C.installed);return}if(ios()){showHelp(C.ios);return}if(promptEvent){const p=promptEvent;promptEvent=null;try{await p.prompt();const choice=await p.userChoice;if(choice?.outcome==='accepted')save.style.display='none'}catch{}return}showHelp(C.installHelp)}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;if(!standalone())save.style.display='block'});
addEventListener('appinstalled',()=>{promptEvent=null;save.style.display='none'});
save.textContent=C.save;save.onclick=install;
$('demoHelpClose').onclick=()=>help.classList.remove('on');help.onclick=e=>{if(e.target===help)help.classList.remove('on')};
if(standalone())save.style.display='none';else save.style.display='block';
launch();
})();