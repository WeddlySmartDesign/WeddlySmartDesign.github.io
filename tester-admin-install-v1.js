(()=>{
let deferredPrompt=null,box=null,button=null,help=null;
const isiOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
const standalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
function text(t){if(help)help.textContent=t}
function hide(){if(box)box.style.display='none'}
function mount(){if(standalone())return;const status=document.getElementById('status');if(!status||document.getElementById('wsdInstallManager'))return;box=document.createElement('div');box.id='wsdInstallManager';box.style.cssText='margin-top:16px;padding:16px;border:1px solid #E5DED2;border-radius:14px;background:#F3F0EA';box.innerHTML='<strong style="display:block;font-size:14px;margin-bottom:5px">Acceso directo al gestor</strong><div id="wsdInstallHelp" style="font-size:12px;line-height:1.45;color:#756F65;margin-bottom:10px">Instálalo en la pantalla de inicio para abrirlo como una app.</div><button id="wsdInstallManagerBtn" type="button" style="border:0;border-radius:11px;padding:12px 14px;background:#2C2A26;color:white;font-size:13px;font-weight:750;cursor:pointer">Instalar gestor</button>';status.insertAdjacentElement('afterend',box);button=document.getElementById('wsdInstallManagerBtn');help=document.getElementById('wsdInstallHelp');button.addEventListener('click',install)}
async function install(){if(standalone()){hide();return}if(deferredPrompt){button.disabled=true;try{deferredPrompt.prompt();const choice=await deferredPrompt.userChoice;if(choice?.outcome==='accepted'){text('Instalado. Ya puedes abrirlo desde tu pantalla de inicio.');setTimeout(hide,1400)}else{text('No se ha instalado. Puedes volver a intentarlo cuando quieras.')}}catch{text('No se pudo abrir la instalación. Usa el menú del navegador y elige “Añadir a pantalla de inicio”.')}finally{deferredPrompt=null;button.disabled=false}return}if(isiOS){text('En iPhone/iPad: abre esta página en Safari → Compartir → Añadir a pantalla de inicio → activa “Abrir como app” → Añadir.');return}text('En Chrome/Android: abre el menú ⋮ y elige “Instalar aplicación” o “Añadir a pantalla de inicio”.')}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;mount();text('Pulsa “Instalar gestor” y quedará como una app en tu pantalla de inicio.')});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;hide()});
if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
