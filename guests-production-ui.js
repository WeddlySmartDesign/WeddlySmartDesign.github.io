(()=>{
  const G=window.__GuestsProd;if(!G)return;

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

  function appDoc(){
    return walkDocs().find(d=>d.getElementById('invitados')&&d.querySelector('.nav'))||null;
  }

  function closeSheet(d){
    const sh=d.getElementById('sheet'),p=d.getElementById('panel');
    if(sh)sh.classList.remove('on');
    if(p)p.innerHTML='';
    const nav=d.querySelector('.nav');if(nav)nav.style.pointerEvents='auto';
  }

  function openSettings(d){
    const sh=d.getElementById('sheet'),p=d.getElementById('panel');
    if(!sh||!p)return;
    const title=d.getElementById('coupleTitle')?.textContent?.trim()||'Vuestra boda';
    const date=d.querySelector('#weddingMeta span')?.textContent?.trim()||'Fecha pendiente';
    p.innerHTML=`
      <div class="sectiontag">AJUSTES</div>
      <h2>Ajustes de la app</h2>
      <div class="row">
        <div><b>Datos de la boda</b><div class="small">${title} · ${date}</div></div>
        <button class="btn soft" data-wsd-edit-boda>Editar</button>
      </div>
      <div class="row">
        <div><b>Idioma</b><div class="small">Esta versión está en español.</div></div>
        <span class="pill">Español</span>
      </div>
      <div class="row">
        <div><b>Sincronización</b><div class="small">Los cambios se comparten entre los dos accesos autorizados de la pareja.</div></div>
        <span class="pill">Activa</span>
      </div>
      <p class="small" style="margin-top:18px">Estos son ajustes generales de Weddly Smart Design. Cuando varios módulos estén juntos, usarán este mismo menú; no habrá un menú distinto para Pagos y otro para Invitados.</p>
      <div class="actions one"><button class="btn soft" data-wsd-close-ajustes>Hecho</button></div>`;
    sh.classList.add('on');
    const nav=d.querySelector('.nav');if(nav)nav.style.pointerEvents='none';
    p.querySelector('[data-wsd-close-ajustes]')?.addEventListener('click',()=>closeSheet(d));
    p.querySelector('[data-wsd-edit-boda]')?.addEventListener('click',()=>{
      closeSheet(d);
      setTimeout(()=>d.getElementById('editWedding')?.click(),50);
    });
  }

  function ensureSettings(d){
    if(d.getElementById('wsdAppSettings'))return;
    const st=d.createElement('style');
    st.id='wsdAppSettingsCss';
    st.textContent=`#wsdAppSettings{position:fixed;z-index:49;top:14px;right:16px;border:1px solid #d7d0c6;background:#fff;color:#2c2a26;border-radius:999px;padding:9px 13px;font:700 13px system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 4px 16px #00000012}#wsdAppSettings:active{transform:translateY(1px)}@media(max-width:520px){#wsdAppSettings{top:12px;right:12px;padding:8px 11px;font-size:12px}}`;
    d.head.appendChild(st);
    const b=d.createElement('button');
    b.id='wsdAppSettings';b.type='button';b.textContent='Ajustes';
    b.addEventListener('click',()=>openSettings(d));
    d.body.appendChild(b);
  }

  function ensurePlanBack(d){
    const h=[...d.querySelectorAll('h1')].find(x=>(x.textContent||'').trim()==='Plano de mesas');
    if(!h||d.getElementById('wsdPlanBack'))return;
    const brand=d.querySelector('.brand')||h.parentElement;
    const b=d.createElement('button');
    b.id='wsdPlanBack';b.type='button';b.textContent='← Volver a Mesas';
    b.style.cssText='border:1px solid #d5cdc2;background:#fff;color:#2c2a26;border-radius:999px;padding:10px 13px;font:700 13px system-ui,-apple-system,Segoe UI,sans-serif;margin:0 0 10px;min-height:42px';
    b.onclick=()=>{
      try{
        let w=d.defaultView?.parent;
        for(let i=0;i<20&&w;i++){
          const pb=w.document?.getElementById('planBack');
          if(pb){pb.click();return}
          if(w===w.parent)break;w=w.parent;
        }
      }catch{}
      try{window.top.location.href='guests.html#mesas'}catch{location.href='guests.html#mesas'}
    };
    brand?.parentNode?.insertBefore(b,brand);
  }

  function spanishUi(d){
    d.querySelectorAll('a,button').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(t==='← Guests'||t==='Guests')el.textContent=t==='← Guests'?'← Invitados':'Invitados';
    });
    d.querySelectorAll('.brand').forEach(el=>{
      if(/Weddly Smart Design\s*·\s*Guests/i.test(el.textContent||''))
        el.textContent=(el.textContent||'').replace(/Guests/gi,'Invitados');
    });
  }

  function patch(){
    try{
      const docs=walkDocs();
      docs.forEach(d=>{spanishUi(d);ensurePlanBack(d)});
      const d=appDoc();
      if(d){
        const b=d.querySelector('.brand');
        if(b&&!b.dataset.wsdBrand){
          b.dataset.wsdBrand='1';
          b.innerHTML='<span style="display:block;text-transform:none;letter-spacing:0;font:500 18px/1.02 Georgia,serif;color:#525c43">Weddly</span><span style="display:block;text-transform:none;letter-spacing:0;font:500 13px/1.08 Georgia,serif;color:#525c43;margin-top:2px">Smart Design</span>';
        }
        ensureSettings(d);
        const id=(location.hash||'').slice(1),nav=id&&d.querySelector(`[data-go="${CSS.escape(id)}"]`);
        if(nav&&!nav.classList.contains('on'))nav.click();
      }
      for(const x of docs){
        const bar=x.getElementById('weddlyIntegrationBar');
        if(bar){
          const a=bar.querySelector('a');
          if(a){a.href='guests.html#invitados';a.target='_top';a.textContent='← Invitados'}
          break;
        }
      }
    }catch{}
  }

  G.f.addEventListener('load',()=>setTimeout(patch,120));
  addEventListener('hashchange',patch);
  addEventListener('guests-prod-open',patch);
  setInterval(patch,500);
})();
