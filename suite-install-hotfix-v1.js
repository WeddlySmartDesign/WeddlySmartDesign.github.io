(()=>{
  const paymentsFrame=document.getElementById('paymentsFrame');
  const auxFrame=document.getElementById('auxFrame');
  if(!paymentsFrame||!auxFrame)return;

  let deferredPrompt=null;
  const ua=()=>navigator.userAgent||'';
  const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const isIOS=()=>/iPad|iPhone|iPod/.test(ua())||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const isChromeIOS=()=>isIOS()&&/CriOS/i.test(ua());
  const isEdgeIOS=()=>isIOS()&&/EdgiOS/i.test(ua());
  const isFirefoxIOS=()=>isIOS()&&/FxiOS/i.test(ua());
  const isSafariIOS=()=>isIOS()&&!isChromeIOS()&&!isEdgeIOS()&&!isFirefoxIOS();
  const lang=()=>{
    try{const x=JSON.parse(localStorage.getItem('weddly_pro_v7')||'null'),v=x?.settings?.lang;if(v==='es'||v==='en')return v}catch{}
    try{const v=localStorage.getItem('weddly_access_lang');if(v==='es'||v==='en')return v}catch{}
    return (navigator.language||'').toLowerCase().startsWith('es')?'es':'en';
  };
  const C={
    es:{
      title:'Instalar en este dispositivo',
      body:'Añade Weddly Smart Design a tu pantalla de inicio para abrir vuestra boda como una app.',
      button:'Instalar Weddly',
      iosButton:'Cómo instalar en iPhone',
      installed:'Weddly Smart Design ya está instalada en este dispositivo.',
      iosHint:'En iPhone se instala desde Compartir ↑ → «Añadir a pantalla de inicio».',
      chrome:'Estás usando Chrome en iPhone.\n\n1. Toca Compartir ↑, a la derecha de la barra de direcciones.\n2. Elige «Añadir a pantalla de inicio».\n3. Pulsa «Añadir».\n\nNo necesitas abrir Safari.',
      safari:'Estás usando Safari en iPhone.\n\n1. Toca Compartir ↑.\n2. Elige «Añadir a pantalla de inicio».\n3. Deja activado «Abrir como app web».\n4. Pulsa «Añadir».',
      otherIOS:'En iPhone la instalación se hace desde el menú Compartir del navegador.\n\n1. Toca Compartir ↑.\n2. Elige «Añadir a pantalla de inicio».\n3. Pulsa «Añadir».\n\nSi tu navegador no muestra esa opción, abre el enlace en Safari.',
      other:'Si no aparece la ventana de instalación, abre el menú del navegador y elige «Instalar app» o «Añadir a pantalla de inicio».'
    },
    en:{
      title:'Install on this device',
      body:'Add Weddly Smart Design to your Home Screen to open your wedding like an app.',
      button:'Install Weddly',
      iosButton:'How to install on iPhone',
      installed:'Weddly Smart Design is already installed on this device.',
      iosHint:'On iPhone, install from Share ↑ → “Add to Home Screen”.',
      chrome:'You are using Chrome on iPhone.\n\n1. Tap Share ↑ to the right of the address bar.\n2. Choose “Add to Home Screen”.\n3. Tap “Add”.\n\nYou do not need to open Safari.',
      safari:'You are using Safari on iPhone.\n\n1. Tap Share ↑.\n2. Choose “Add to Home Screen”.\n3. Keep “Open as Web App” enabled.\n4. Tap “Add”.',
      otherIOS:'On iPhone, installation starts from your browser Share menu.\n\n1. Tap Share ↑.\n2. Choose “Add to Home Screen”.\n3. Tap “Add”.\n\nIf your browser does not show that option, open the link in Safari.',
      other:'If the install prompt does not appear, open your browser menu and choose “Install app” or “Add to Home Screen”.'
    }
  };

  function iosInstructions(c){
    if(isChromeIOS())return c.chrome;
    if(isSafariIOS())return c.safari;
    return c.otherIOS;
  }

  function hidePaymentsInstall(){
    try{
      const d=paymentsFrame.contentDocument;if(!d)return;
      const exact=d.getElementById('install-action');if(exact)exact.style.setProperty('display','none','important');
      d.querySelectorAll('button,a,[role="button"]').forEach(el=>{
        const t=String(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
        if(t==='instalar app'||t==='instalar weddly'||t==='install app'||t==='install weddly')el.style.setProperty('display','none','important');
      });
    }catch{}
  }

  function showInstructions(text){
    let box=document.getElementById('wsdInstallHelp');
    if(!box){
      box=document.createElement('div');box.id='wsdInstallHelp';
      box.style.cssText='position:fixed;z-index:9999;inset:0;background:#0007;display:grid;place-items:center;padding:22px';
      box.innerHTML='<div style="max-width:440px;background:#fff;border-radius:20px;padding:22px;color:#2C2A26;font:14px/1.5 system-ui,-apple-system,sans-serif;box-shadow:0 18px 60px #0003"><div id="wsdInstallHelpText" style="white-space:pre-line"></div><button id="wsdInstallHelpClose" style="width:100%;margin-top:18px;border:0;border-radius:11px;padding:13px;background:#525C43;color:#fff;font-weight:750">OK</button></div>';
      document.body.appendChild(box);box.querySelector('#wsdInstallHelpClose').onclick=()=>box.remove();box.onclick=e=>{if(e.target===box)box.remove()};
    }
    box.querySelector('#wsdInstallHelpText').textContent=text;
  }

  async function install(){
    const c=C[lang()]||C.es;
    if(isStandalone()){showInstructions(c.installed);return}
    if(isIOS()){
      showInstructions(iosInstructions(c));
      return;
    }
    if(deferredPrompt){const p=deferredPrompt;deferredPrompt=null;try{await p.prompt();await p.userChoice}catch{}return}
    showInstructions(c.other);
  }

  function patchSettings(){
    try{
      const d=auxFrame.contentDocument;if(!d||!d.getElementById('content')||!d.getElementById('save'))return;
      if(d.getElementById('wsdSuiteInstallCard'))return;
      const c=C[lang()]||C.es;
      const h=d.createElement('h2');h.id='wsdSuiteInstallTitle';h.textContent=c.title;
      const card=d.createElement('section');card.id='wsdSuiteInstallCard';card.className='card';
      card.innerHTML=`<div class="security-note" id="wsdSuiteInstallBody"></div><button class="btn" id="wsdSuiteInstallAction"></button><div class="helper" id="wsdSuiteInstallHint" style="margin-top:9px"></div>`;
      card.querySelector('#wsdSuiteInstallBody').textContent=c.body;
      const b=card.querySelector('#wsdSuiteInstallAction');
      b.textContent=isStandalone()?c.installed:(isIOS()?c.iosButton:c.button);
      b.disabled=isStandalone();
      b.onclick=install;
      card.querySelector('#wsdSuiteInstallHint').textContent=isStandalone()?'':(isIOS()?c.iosHint:c.other);
      const security=d.querySelector('[data-k="securityTitle"]');
      if(security)security.before(h,card);else d.getElementById('content').append(h,card);
    }catch{}
  }

  function patchEssentialSave(){
    try{
      const outer=auxFrame.contentDocument,editor=outer?.getElementById('editor'),w=editor?.contentWindow,B=w?.__WEDDLY_BOOT;
      if(!w||!B?.persApi||!B?.rsvpApi||!w.__weddlySaveEssential||w.__wsdEssentialSaveHotfix)return;
      const nativeFetch=w.fetch.bind(w);let personalizationSaved=false;
      w.fetch=async function(input,init){
        const url=typeof input==='string'?input:input?.url||'',method=String(init?.method||(typeof input!=='string'?input?.method:'GET')||'GET').toUpperCase();
        let action='';if(method==='POST'&&init?.body){try{action=JSON.parse(String(init.body))?.action||''}catch{}}
        if(url===B.persApi&&method==='POST'){
          const r=await nativeFetch(input,init);personalizationSaved=r.ok;return r;
        }
        if(url===B.rsvpApi&&method==='POST'&&action==='config'&&personalizationSaved){
          personalizationSaved=false;
          try{const r=await nativeFetch(input,init);if(r.ok)return r;console.warn('Weddly: RSVP config refresh failed after personalization was saved',r.status)}catch(e){console.warn('Weddly: RSVP config refresh failed after personalization was saved',e)}
          return new w.Response(JSON.stringify({ok:true,resilient:true}),{status:200,headers:{'Content-Type':'application/json'}});
        }
        return nativeFetch(input,init);
      };
      w.__wsdEssentialSaveHotfix=true;
    }catch{}
  }

  addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;patchSettings()});
  addEventListener('appinstalled',()=>{deferredPrompt=null;patchSettings()});
  paymentsFrame.addEventListener('load',()=>{setTimeout(hidePaymentsInstall,60);setTimeout(hidePaymentsInstall,350)});
  auxFrame.addEventListener('load',()=>{setTimeout(()=>{patchSettings();patchEssentialSave()},80);setTimeout(()=>{patchSettings();patchEssentialSave()},400)});
  setInterval(()=>{hidePaymentsInstall();patchSettings();patchEssentialSave()},500);
})();
(()=>{if(document.getElementById('wsdSuiteVisualLoader'))return;const s=document.createElement('script');s.id='wsdSuiteVisualLoader';s.src='suite-visual-coherence-v1.js?v=3';document.head.appendChild(s)})();
(()=>{if(document.getElementById('wsdSuiteSwipeLoader'))return;const s=document.createElement('script');s.id='wsdSuiteSwipeLoader';s.src='suite-swipe-navigation-v1.js?v=5';document.head.appendChild(s)})();
(()=>{if(document.getElementById('wsdPlanningBottomNavLoader'))return;const s=document.createElement('script');s.id='wsdPlanningBottomNavLoader';s.src='suite-planning-bottomnav-v1.js?v=1';document.head.appendChild(s)})();
(()=>{if(document.getElementById('wsdPlanningCompactLoader'))return;const s=document.createElement('script');s.id='wsdPlanningCompactLoader';s.src='suite-planning-compact-v1.js?v=1';document.head.appendChild(s)})();
(()=>{if(document.getElementById('wsdMainNavEmphasisLoader'))return;const s=document.createElement('script');s.id='wsdMainNavEmphasisLoader';s.src='suite-main-nav-emphasis-v1.js?v=2';document.head.appendChild(s)})();
