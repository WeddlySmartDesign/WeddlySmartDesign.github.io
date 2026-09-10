(()=>{
  const G=window.__GuestsProd;if(!G)return;
  const SETTINGS_URL='weddly-settings.html?from=guests&v=shared-settings-20260910-3';
  const PLAN_URL='guests-plan-live.html?v=121';
  const THEMES={
    nordic:{bg:'#F2EFE9',paper:'#FBF8F3',line:'#E4DED2',soft:'#EEF0E9',accent:'#6E7A5C',dark:'#525C43',ink:'#2C2A26'},
    blush:{bg:'#F5EEEC',paper:'#FFF9F7',line:'#E9DAD6',soft:'#F5E9E7',accent:'#B48683',dark:'#825F5D',ink:'#2C2A26'},
    sand:{bg:'#F1EAE1',paper:'#FCF8F2',line:'#DED3C5',soft:'#F2E9DE',accent:'#9B7F62',dark:'#725A45',ink:'#302B26'},
    slate:{bg:'#EEF1F3',paper:'#F8FAFB',line:'#D8DEE2',soft:'#E9EEF1',accent:'#73808A',dark:'#4C5963',ink:'#252A2E'},
    editorial:{bg:'#F0ECE8',paper:'#FBF8F5',line:'#DED6D0',soft:'#EFE8E4',accent:'#6B5B52',dark:'#443833',ink:'#2A2421'}
  };

  function selectedTheme(){
    try{const x=localStorage.getItem('weddly_personal_theme_v51')||localStorage.getItem('weddly_personal_theme_v20')||'nordic';return THEMES[x]?x:'nordic'}catch{return'nordic'}
  }

  function walkDocs(){
    const out=[];
    try{
      let d=G.f.contentDocument;
      for(let i=0;i<40&&d;i++){
        out.push(d);
        const f=d.querySelector('iframe');
        if(!f||!f.contentDocument)break;
        d=f.contentDocument;
      }
    }catch{}
    return out;
  }

  function appDoc(){return walkDocs().find(d=>d.getElementById('invitados')&&d.querySelector('.nav'))||null}

  function openSettings(){try{window.top.location.assign(SETTINGS_URL)}catch{location.assign(SETTINGS_URL)}}
  function openPlan(d){try{d.defaultView.location.href=PLAN_URL}catch{try{window.top.location.href=PLAN_URL}catch{location.href=PLAN_URL}}}

  function applyTheme(d){
    if(!d?.head)return;
    const name=selectedTheme(),p=THEMES[name];d.documentElement.dataset.wsdTheme=name;
    let s=d.getElementById('wsdGuestsThemeCss');if(!s){s=d.createElement('style');s.id='wsdGuestsThemeCss';d.head.appendChild(s)}
    s.textContent=`
      html,body{background:${p.bg}!important;color:${p.ink}!important}
      iframe{background:${p.bg}!important}
      .wrap{background:${p.paper}!important;min-height:100vh}
      .card,.stat,.panel,.choice,.thead,.summaryIntro,.tableSummary,.personPick,.guestChip,.shapeChoice,.typeBtn,.rotateRow button,.line,.uploadBtn{border-color:${p.line}!important}
      .soft,.nav button.on,.pill,.badge,.feature{background:${p.soft}!important;color:${p.ink}!important}
      .btn:not(.soft):not(.line){background:${p.dark}!important;color:#fff!important}
      .rsvpBox,.selectionBar{background:${p.dark}!important}
      .alert{border-left-color:${p.accent}!important}
      .status,.moveNote{color:${p.dark}!important}
      .brand{color:${p.dark}!important}
      .tableSummary.target{outline-color:${p.accent}!important;background:${p.soft}!important}
      .nav{border-color:${p.line}!important}
    `;
  }

  function hijackSettings(d){
    if(!d?.documentElement||d.documentElement.dataset.wsdSharedSettingsHooked==='1')return;
    d.documentElement.dataset.wsdSharedSettingsHooked='1';
    d.addEventListener('click',e=>{
      const t=e.target?.closest?.('button,a');if(!t)return;
      const label=(t.textContent||'').trim().toLowerCase();
      if(t.id==='wsdAppSettings'||label==='ajustes'||label==='settings'){
        e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();openSettings();return;
      }
      if(/plano visual/i.test(label)){
        e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();openPlan(d);
      }
    },true);
  }

  function ensureSettings(d){
    const wrap=d.querySelector('.wrap')||d.body;if(!wrap)return;
    wrap.style.position='relative';
    let b=d.getElementById('wsdAppSettings');
    if(!b){b=d.createElement('button');b.id='wsdAppSettings';b.type='button';b.textContent='Ajustes';b.onclick=e=>{e.preventDefault();e.stopPropagation();openSettings()};wrap.appendChild(b)}
    let st=d.getElementById('wsdAppSettingsCss');if(!st){st=d.createElement('style');st.id='wsdAppSettingsCss';d.head.appendChild(st)}
    st.textContent=`#wsdAppSettings{position:absolute;z-index:30;top:0;right:0;border:1px solid #d7d0c6;background:#fff;color:#2c2a26;border-radius:999px;padding:9px 13px;font:700 13px system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 4px 16px #00000012}#wsdAppSettings:active{transform:translateY(1px)}@media(max-width:520px){#wsdAppSettings{top:0;right:0;padding:8px 11px;font-size:12px}}`;
  }

  function ensurePlanHero(d){
    const mesas=d.getElementById('mesas');if(!mesas)return;
    mesas.querySelectorAll('[data-v81-visual],[data-v81-plan-btn]').forEach(x=>x.style.display='none');
    if(d.getElementById('wsdPlanHero'))return;
    const h=mesas.querySelector('h2');if(!h)return;
    const p=THEMES[selectedTheme()],c=d.createElement('div');c.id='wsdPlanHero';c.className='card';
    c.style.cssText=`background:${p.dark};color:#fff;border-color:${p.dark};padding:22px;margin:14px 0 20px`;
    c.innerHTML='<div class="sectiontag" style="color:#dfe4e7">PLANO INTERACTIVO</div><h3 style="font:500 29px/1.1 Georgia,serif;margin:8px 0 10px">Diseña tu salón visualmente</h3><p style="margin:0 0 16px;color:#eef1f2;line-height:1.45">Crea el salón, coloca mesas y elementos, mueve invitados y comprueba la distribución de un vistazo.</p><button type="button" class="btn soft" data-wsd-open-plan style="width:100%;font-size:16px;min-height:50px">Abrir plano interactivo</button>';
    c.querySelector('[data-wsd-open-plan]').onclick=()=>openPlan(d);h.insertAdjacentElement('afterend',c);
  }

  function ensurePlanBack(d){
    const h=[...d.querySelectorAll('h1')].find(x=>(x.textContent||'').trim()==='Plano de mesas');
    if(!h||d.getElementById('wsdPlanBack'))return;
    const b=d.createElement('button');b.id='wsdPlanBack';b.type='button';b.textContent='← Volver a Mesas';
    b.style.cssText='border:1px solid #d5cdc2;background:#fff;color:#2c2a26;border-radius:999px;padding:10px 13px;font:700 13px system-ui,-apple-system,Segoe UI,sans-serif;margin:0 0 10px;min-height:42px';
    b.onclick=()=>{try{history.back()}catch{try{window.top.location.href='guests.html#mesas'}catch{location.href='guests.html#mesas'}}};
    const wrap=d.querySelector('.wrap')||h.parentElement;wrap?.insertBefore(b,wrap.firstChild);
  }

  function spanishUi(d){
    d.querySelectorAll('a,button').forEach(el=>{const t=(el.textContent||'').trim();if(t==='← Guests'||t==='Guests')el.textContent=t==='← Guests'?'← Invitados':'Invitados'});
    d.querySelectorAll('.brand').forEach(el=>{if(/Weddly Smart Design\s*·\s*Guests/i.test(el.textContent||''))el.textContent=(el.textContent||'').replace(/Guests/gi,'Invitados')});
  }

  function patch(){
    try{
      const docs=walkDocs();docs.forEach(d=>{applyTheme(d);hijackSettings(d);spanishUi(d);ensurePlanBack(d)});
      const d=appDoc();
      if(d){
        const b=d.querySelector('.brand');
        if(b&&!b.dataset.wsdBrand){b.dataset.wsdBrand='1';b.innerHTML='<span style="display:block;text-transform:none;letter-spacing:0;font:500 18px/1.02 Georgia,serif">Weddly</span><span style="display:block;text-transform:none;letter-spacing:0;font:500 13px/1.08 Georgia,serif;margin-top:2px">Smart Design</span>'}
        ensureSettings(d);ensurePlanHero(d);
        const id=(location.hash||'').slice(1),nav=id&&d.querySelector(`[data-go="${CSS.escape(id)}"]`);if(nav&&!nav.classList.contains('on'))nav.click();
      }
      for(const x of docs){const bar=x.getElementById('weddlyIntegrationBar');if(bar){const a=bar.querySelector('a');if(a){a.href='guests.html#invitados';a.target='_top';a.textContent='← Invitados'}break}}
    }catch{}
  }

  G.f.addEventListener('load',()=>setTimeout(patch,120));
  addEventListener('hashchange',patch);addEventListener('guests-prod-open',patch);
  addEventListener('storage',e=>{if(e.key==='weddly_personal_theme_v51'||e.key==='weddly_personal_theme_v20')patch()});
  setInterval(patch,450);
})();