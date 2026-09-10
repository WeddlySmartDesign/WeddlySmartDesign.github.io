(()=>{
  const G=window.__GuestsProd={};
  G.KEY='weddly_guests_qa_v67';
  G.API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-guests-state';
  G.APP='guests-v114-integrated.html?v=122-v129-core';
  G.f=document.getElementById('app');G.boot=document.getElementById('boot');G.msg=document.getElementById('msg');G.retry=document.getElementById('retry');G.note=document.getElementById('notice');
  G.token='';G.ver=0;G.last='';G.pushing=false;G.remote=false;G.identity='';G.identitySyncing=false;
  const read=()=>{try{return localStorage.getItem(G.KEY)||''}catch{return''}};
  const parse=s=>{try{const x=JSON.parse(s||'null');return x&&typeof x==='object'&&!Array.isArray(x)?x:null}catch{return null}};
  const write=x=>{try{localStorage.setItem(G.KEY,JSON.stringify(x));return 1}catch{return 0}};
  const has=x=>!!(x&&(Object.keys(x.guests||{}).length||Object.keys(x.tables||{}).length||x.activity||x.sent||x.prepared||Object.keys(x.meta||{}).length));
  const escReg=s=>String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  function sharedIdentity(){try{const x=JSON.parse(localStorage.getItem('weddly_pro_v7')||'null'),s=x?.settings||{};return{p1:String(s.partner1||'').trim(),p2:String(s.partner2||'').trim(),date:/^\d{4}-\d{2}-\d{2}$/.test(String(s.weddingDate||''))?String(s.weddingDate):''}}catch{return{p1:'',p2:'',date:''}}}
  function sharedIdentityKey(){const x=sharedIdentity();return x.p1&&x.p2?JSON.stringify([x.p1,x.p2,x.date]):''}
  function identityOf(state){const m=state?.meta||{},c=Array.isArray(m.couple)?m.couple:[];return JSON.stringify([String(c[0]||''),String(c[1]||''),String(m.weddingDate||'')])}
  function mergeSharedIdentity(state){
    if(!state||typeof state!=='object')return state;
    const id=sharedIdentity();if(!id.p1||!id.p2)return state;
    state.meta=state.meta||{};
    const old=Array.isArray(state.meta.couple)&&state.meta.couple.length>=2?[String(state.meta.couple[0]||''),String(state.meta.couple[1]||'')]:['',''];
    if(old[0]&&old[1]&&(old[0]!==id.p1||old[1]!==id.p2)){
      Object.values(state.guests||{}).forEach(g=>{if(!g?.group)return;let v=String(g.group);v=v.replace(new RegExp(`^(Familia|Amigos) ${escReg(old[0])}$`,'i'),(_,k)=>`${k} ${id.p1}`);v=v.replace(new RegExp(`^(Familia|Amigos) ${escReg(old[1])}$`,'i'),(_,k)=>`${k} ${id.p2}`);g.group=v})
    }
    state.meta.couple=[id.p1,id.p2];state.meta.weddingDate=id.date||'';return state
  }
  G.notice=t=>{G.note.textContent=t;G.note.style.display='block'};G.clearNotice=()=>G.note.style.display='none';
  async function api(method,body){const r=await fetch(G.API,{method,headers:{'x-weddly-token':G.token,...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store'}),x=await r.json().catch(()=>({}));return{r,x}}
  function reloadCore(reason='identity'){G.f.src=G.APP+'&'+reason+'='+Date.now();G.f.style.display='block';G.boot.style.display='none';window.dispatchEvent(new Event('guests-prod-open'))}
  function open(){G.f.src=G.APP;G.f.style.display='block';G.boot.style.display='none';window.dispatchEvent(new Event('guests-prod-open'))}
  async function start(){
    try{G.token=localStorage.getItem('weddly_shared_wedding_token')||''}catch{}
    let local=mergeSharedIdentity(parse(read()));if(local)write(local);
    if(!G.token){G.msg.textContent='Este dispositivo todavía no tiene acceso a vuestra boda.';G.retry.style.display='inline-block';return}
    try{
      const a=await api('GET');if(!a.r.ok||!a.x.ok)throw 0;G.ver=+a.x.version||0;
      if(a.x.state){
        const original=JSON.stringify(a.x.state),state=mergeSharedIdentity(a.x.state),merged=JSON.stringify(state);
        if(merged!==original){
          const p=await api('PUT',{version:G.ver,state});
          if(p.r.ok&&p.x.ok)G.ver=+p.x.version||G.ver+1;
          else if(p.r.status===409&&p.x.server?.state){const latest=mergeSharedIdentity(p.x.server.state),q=await api('PUT',{version:+p.x.server.version||G.ver,state:latest});if(q.r.ok&&q.x.ok){G.ver=+q.x.version||(+p.x.server.version||G.ver)+1;write(latest);G.last=JSON.stringify(latest);G.identity=identityOf(latest);open();return}}
        }
        write(state);G.last=JSON.stringify(state);G.identity=identityOf(state)
      }else if(has(local)){
        local=mergeSharedIdentity(local);const p=await api('PUT',{version:0,state:local});if(p.r.ok&&p.x.ok){G.ver=+p.x.version||1;G.last=JSON.stringify(local);G.identity=identityOf(local)}else{G.last=read();G.identity=identityOf(parse(G.last))}
      }else{G.last=read();G.identity=identityOf(parse(G.last))}
      open()
    }catch{
      if(has(local)){G.last=read();G.identity=identityOf(parse(G.last));G.msg.textContent='Sin conexión. Abriendo la copia guardada…';setTimeout(open,400)}else{G.msg.textContent='No hemos podido abrir Invitados. Comprueba la conexión.';G.retry.textContent='Reintentar';G.retry.href=location.href;G.retry.style.display='inline-block'}
    }
  }
  let timer=0;function queue(){clearTimeout(timer);timer=setTimeout(push,500)}
  function syncIdentityNow(){
    if(G.identitySyncing)return false;
    const wanted=sharedIdentityKey();if(!wanted||wanted===G.identity)return false;
    const state=mergeSharedIdentity(parse(read()));if(!state)return false;
    G.identitySyncing=true;write(state);G.identity=identityOf(state);reloadCore('identity');queue();setTimeout(()=>{G.identitySyncing=false},150);return true
  }
  async function push(){
    if(G.pushing||!G.token)return;let state=mergeSharedIdentity(parse(read()));if(!state)return;const raw=JSON.stringify(state);if(raw===G.last)return;write(state);G.pushing=true;G.notice('Guardando…');
    try{
      const a=await api('PUT',{version:G.ver,state});
      if(a.r.status===409&&a.x.server){try{localStorage.setItem('weddly_guests_conflict_backup',raw)}catch{}if(a.x.server.state){const latest=mergeSharedIdentity(a.x.server.state);write(latest);G.last=JSON.stringify(latest);G.identity=identityOf(latest)}G.ver=+a.x.server.version||G.ver;G.remote=true;reloadCore('remote');G.notice('Actualizado desde el otro dispositivo');setTimeout(G.clearNotice,2500)}
      else if(!a.r.ok||!a.x.ok)throw 0;
      else{G.ver=+a.x.version||G.ver+1;G.last=raw;G.identity=identityOf(state);G.clearNotice()}
    }catch{G.notice('Pendiente de conexión');setTimeout(()=>{G.pushing=false;queue()},2500);return}
    G.pushing=false
  }
  async function poll(){
    if(!G.token||G.pushing)return;if(syncIdentityNow())return;const raw=read();if(raw!==G.last){queue();return}
    try{const a=await api('GET');if(!a.r.ok||!a.x.ok)return;const v=+a.x.version||0;if(v>G.ver&&a.x.state){let state=mergeSharedIdentity(a.x.state);const merged=JSON.stringify(state);if(merged!==JSON.stringify(a.x.state)){const p=await api('PUT',{version:v,state});if(p.r.ok&&p.x.ok)G.ver=+p.x.version||v+1;else G.ver=v}else G.ver=v;write(state);G.last=merged;G.identity=identityOf(state);G.remote=true;reloadCore('remote');G.notice('Actualizado con los cambios de vuestra pareja');setTimeout(G.clearNotice,2500)}}catch{}
  }
  setInterval(()=>{if(syncIdentityNow())return;const raw=read();if(G.remote){G.remote=false;G.last=raw;return}if(raw!==G.last)queue()},350);
  addEventListener('storage',e=>{if(e.key==='weddly_pro_v7'||e.key===G.KEY)syncIdentityNow()});
  setInterval(poll,12000);addEventListener('online',()=>{syncIdentityNow();queue();poll()});start()
})();
