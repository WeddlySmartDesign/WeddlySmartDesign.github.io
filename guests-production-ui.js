(()=>{
  const G=window.__GuestsProd;if(!G)return;
  const SETTINGS_URL='weddly-settings.html?from=guests&v=122-v129-core';
  const RSVP_URL='guests-rsvp-v110.html?v=122-v129-core';
  const THEMES={
    nordic:{bg:'#F2EFE9',paper:'#FBF8F3',line:'#E4DED2',soft:'#EEF0E9',accent:'#6E7A5C',dark:'#525C43',ink:'#2C2A26'},
    blush:{bg:'#F5EEEC',paper:'#FFF9F7',line:'#E9DAD6',soft:'#F5E9E7',accent:'#B48683',dark:'#825F5D',ink:'#2C2A26'},
    sand:{bg:'#F1EAE1',paper:'#FCF8F2',line:'#DED3C5',soft:'#F2E9DE',accent:'#9B7F62',dark:'#725A45',ink:'#302B26'},
    slate:{bg:'#EEF1F3',paper:'#F8FAFB',line:'#D8DEE2',soft:'#E9EEF1',accent:'#73808A',dark:'#4C5963',ink:'#252A2E'},
    editorial:{bg:'#F0ECE8',paper:'#FBF8F5',line:'#DED6D0',soft:'#EFE8E4',accent:'#6B5B52',dark:'#443833',ink:'#2A2421'}
  };
  let hashApplied=false;
  const themeName=()=>{try{const x=localStorage.getItem('weddly_personal_theme_v51')||localStorage.getItem('weddly_personal_theme_v20')||'nordic';return THEMES[x]?x:'nordic'}catch{return'nordic'}};
  function docs(){const out=[];try{let d=G.f.contentDocument;for(let i=0;i<8&&d;i++){out.push(d);const f=d.querySelector('iframe');if(!f||!f.contentDocument)break;d=f.contentDocument}}catch{}return out}
  const appDoc=()=>docs().find(d=>d.getElementById('invitados')&&d.getElementById('mesas')&&d.getElementById('nav'))||null;
  function topGo(url){try{window.top.location.assign(url)}catch{location.assign(url)}}
  function setTopHash(id){try{const u=new URL(window.top.location.href);u.hash=id;window.top.history.replaceState(null,'',u.href)}catch{}}
  function applyTheme(d){if(!d?.head)return;const p=THEMES[themeName()];let s=d.getElementById('wsdGuestsThemeCss');if(!s){s=d.createElement('style');s.id='wsdGuestsThemeCss';d.head.appendChild(s)}s.textContent=`html,body{background:${p.bg}!important;color:${p.ink}!important}.wrap{background:${p.paper}!important;min-height:100vh}.card,.stat,.step,.panel,.choice,.thead,.tableSummary,.summaryIntro,.personPick,.guestChip,.shapeChoice,.typeBtn,.rotateRow button,.field,.select,.line{border-color:${p.line}!important}.soft,.nav button.on,.pill,.badge,.feature,.helper,.bulkNames{background:${p.soft}!important;color:${p.ink}!important}.btn:not(.soft):not(.line){background:${p.dark}!important;color:#fff!important}.alert{border-left-color:${p.accent}!important}.status,.moveNote,.brand{color:${p.dark}!important}.nav,.planBar{border-color:${p.line}!important}.planLaunch{background:${p.dark}!important;color:#fff!important}.planLaunchCopy{color:#f0f2f3!important}.wsdPlanGuestHero{background:${p.dark}!important;border-color:${p.dark}!important;color:#fff!important}.wsdPlanGuestHero h3,.wsdPlanGuestHero p,.wsdPlanGuestHero .small{color:#fff!important}.wsdPlanGuestHero .stepNum{background:#fff!important;color:${p.dark}!important}.wsdPlanGuestHero #planBtnGuest{background:#fff!important;color:${p.dark}!important;min-height:52px;font-size:16px}.wsdPlanGuestHero .pill{background:#ffffff20!important;color:#fff!important}`}
  function brand(d){const b=d.querySelector('main.wrap>.brand');if(b){b.innerHTML='<span style="display:block;text-transform:none;letter-spacing:0;font:500 18px/1.02 Georgia,serif">Weddly</span><span style="display:block;text-transform:none;letter-spacing:0;font:500 13px/1.08 Georgia,serif;margin-top:2px">Smart Design</span>';b.style.marginBottom='14px'}const title=d.getElementById('coupleTitle');if(title&&/^Guests$/i.test(title.textContent.trim()))title.textContent='Invitados'}
  function settings(d){d.getElementById('wsdAppSettings')?.remove();const b=d.getElementById('editWedding');if(!b)return;b.textContent='Ajustes';b.setAttribute('aria-label','Ajustes de la app');b.style.textDecoration='none';b.style.border='1px solid #d7d0c6';b.style.background='#fff';b.style.borderRadius='999px';b.style.padding='7px 11px'}
  function planPriority(d){const b=d.getElementById('planBtnGuest'),step=b?.closest('.step');if(step)step.classList.add('wsdPlanGuestHero')}
  function spanish(d){d.querySelectorAll('.brand').forEach(b=>{if(/Weddly Smart Design\s*·\s*Guests/i.test(b.textContent||''))b.textContent=(b.textContent||'').replace(/Guests/gi,'Invitados')});const back=d.getElementById('backGuests');if(back)back.textContent='← Volver'}
  function hook(d){if(!d?.documentElement||d.documentElement.dataset.wsdV129Prod==='1')return;d.documentElement.dataset.wsdV129Prod='1';d.addEventListener('click',e=>{const t=e.target?.closest?.('button,a');if(!t)return;const label=(t.textContent||'').trim();if(t.dataset?.go){setTimeout(()=>setTopHash(t.dataset.go),0);return}if(t.id==='editWedding'||label==='Ajustes'){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();topGo(SETTINGS_URL);return}if(t.id==='rsvpBtn'||/^Gestionar RSVP$/i.test(label)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();topGo(RSVP_URL)}},true)}
  function applyInitialHash(d){if(hashApplied)return;hashApplied=true;const id=(window.top.location.hash||'').slice(1);if(!['hoy','invitados','mesas','listados'].includes(id))return;const b=d.querySelector(`#nav button[data-go="${CSS.escape(id)}"]`);if(b&&!b.classList.contains('on'))b.click()}
  function patch(){try{const all=docs();all.forEach(d=>{applyTheme(d);spanish(d);hook(d)});const d=appDoc();if(!d)return;brand(d);settings(d);planPriority(d);applyInitialHash(d)}catch{}}
  G.f.addEventListener('load',()=>{hashApplied=false;setTimeout(patch,80);setTimeout(patch,300)});
  addEventListener('guests-prod-open',patch);addEventListener('storage',e=>{if(e.key==='weddly_personal_theme_v51'||e.key==='weddly_personal_theme_v20')patch()});
  addEventListener('hashchange',()=>{hashApplied=false;patch()});
  setInterval(patch,500);
})();
