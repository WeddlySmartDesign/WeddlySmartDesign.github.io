(()=>{
  'use strict';
  const G=window.__GuestsProd={};
  G.KEY='weddly_guests_qa_v67';
  G.META='weddly_guests_sync_meta_v2';
  G.API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-guests-state';
  G.APP='guests-v114-integrated.html?v=122-v129-core';
  G.f=document.getElementById('app');G.boot=document.getElementById('boot');G.msg=document.getElementById('msg');G.retry=document.getElementById('retry');G.note=document.getElementById('notice');
  G.token='';G.ver=0;G.last='';G.pushing=false;G.remote=false;G.identity='';G.identitySyncing=false;
  const MISSING=Symbol('missing');
  const read=()=>{try{return localStorage.getItem(G.KEY)||''}catch{return''}};
  const parse=s=>{try{const x=JSON.parse(s||'null');return x&&typeof x==='object'&&!Array.isArray(x)?x:null}catch{return null}};
  const writeRaw=x=>{try{localStorage.setItem(G.KEY,JSON.stringify(x));return 1}catch{return 0}};
  const readMeta=()=>{try{const x=JSON.parse(localStorage.getItem(G.META)||'null');return x&&typeof x==='object'?x:{}}catch{return{}}};
  const writeMeta=x=>{try{localStorage.setItem(G.META,JSON.stringify(x));return 1}catch{return 0}};
  const has=x=>!!(x&&(Object.keys(x.guests||{}).length||Object.keys(x.tables||{}).length||x.activity||x.sent||x.prepared||Object.keys(x.meta||{}).length));
  const clone=v=>v===MISSING?MISSING:(v===undefined?undefined:structuredClone(v));
  const obj=v=>v!==MISSING&&v&&typeof v==='object'&&!Array.isArray(v);
  const eq=(a,b)=>{if(a===MISSING||b===MISSING)return a===b;try{return JSON.stringify(a)===JSON.stringify(b)}catch{return a===b}};
  const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)};
  function merge3(base,local,remote,path='',conflicts=[]){
    if(eq(local,base))return clone(remote);
    if(eq(remote,base))return clone(local);
    if(eq(local,remote))return clone(local);
    if((base===MISSING||obj(base))&&(local===MISSING||obj(local))&&(remote===MISSING||obj(remote))&&(obj(base)||obj(local)||obj(remote))){
      const out={},keys=new Set([...Object.keys(obj(base)?base:{}),...Object.keys(obj(local)?local:{}),...Object.keys(obj(remote)?remote:{})]);
      for(const k of keys){
        const bv=obj(base)&&Object.prototype.hasOwnProperty.call(base,k)?base[k]:MISSING;
        const lv=obj(local)&&Object.prototype.hasOwnProperty.call(local,k)?local[k]:MISSING;
        const rv=obj(remote)&&Object.prototype.hasOwnProperty.call(remote,k)?remote[k]:MISSING;
        const mv=merge3(bv,lv,rv,path?path+'.'+k:k,conflicts);if(mv!==MISSING)out[k]=mv;
      }
      return out;
    }
    conflicts.push(path||'$');return clone(local);
  }
  function mergeWithoutBase(local,remote,conflicts=[]){
    const out=structuredClone(remote||{}),L=local||{};
    for(const section of ['guests','tables']){
      out[section]=out[section]&&typeof out[section]==='object'?out[section]:{};
      for(const [id,v] of Object.entries(L[section]||{})){
        if(Object.prototype.hasOwnProperty.call(out[section],id)&&!eq(out[section][id],v))conflicts.push(section+'.'+id);
        out[section][id]=structuredClone(v);
      }
    }
    for(const [k,v] of Object.entries(L))if(!['guests','tables'].includes(k)){if(Object.prototype.hasOwnProperty.call(out,k)&&!eq(out[k],v))conflicts.push(k);out[k]=structuredClone(v)}
    return out;
  }
  const escReg=s=>String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  function sharedIdentity(){try{const x=JSON.parse(localStorage.getItem('weddly_pro_v7')||'null'),s=x?.settings||{};return{p1:String(s.partner1||'').trim(),p2:String(s.partner2||'').trim(),date:/^\d{4}-\d{2}-\d{2}$/.test(String(s.weddingDate||''))?String(s.weddingDate):''}}catch{return{p1:'',p2:'',date:''}}}
  function sharedIdentityKey(){const x=sharedIdentity();return x.p1&&x.p2?JSON.stringify([x.p1,x.p2,x.date]):''}
  function identityOf(state){const m=state?.meta||{},c=Array.isArray(m.couple)?m.couple:[];return JSON.stringify([String(c[0]||''),String(c[1]||''),String(m.weddingDate||'')])}
  function mergeSharedIdentity(state){
    if(!state||typeof state!=='object')return state;
    const id=sharedIdentity();if(!id.p1||!id.p2)return state;
    state.meta=state.meta||{};
    const old=Array.isArray(state.meta.couple)&&state.meta.couple.length>=2?[String(state.meta.couple[0]||''),String(state.meta.couple[1]||'')]:['',''];
    if(old[0]&&old[1]&&(old[0]!==id.p1||old[1]!==id.p2))Object.values(state.guests||{}).forEach(g=>{if(!g?.group)return;let v=String(g.group);v=v.replace(new RegExp(`^(Familia|Amigos) ${escReg(old[0])}$`,'i'),(_,k)=>`${k} ${id.p1}`);v=v.replace(new RegExp(`^(Familia|Amigos) ${escReg(old[1])}$`,'i'),(_,k)=>`${k} ${id.p2}`);g.group=v});
    state.meta.couple=[id.p1,id.p2];state.meta.weddingDate=id.date||'';return state;
  }
  G.notice=t=>{if(!G.note)return;G.note.textContent=t;G.note.style.display='block'};G.clearNotice=()=>{if(G.note)G.note.style.display='none'};
  async function api(method,body){const r=await fetch(G.API,{method,headers:{'x-weddly-token':G.token,...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store'}),x=await r.json().catch(()=>({}));return{r,x}}
  function reloadCore(reason='sync'){G.f.src=G.APP+'&'+reason+'='+Date.now();G.f.style.display='block';G.boot.style.display='none';window.dispatchEvent(new Event('guests-prod-open'))}
  function open(){G.f.src=G.APP;G.f.style.display='block';G.boot.style.display='none';window.dispatchEvent(new Event('guests-prod-open'))}
  function cleanMeta(state){const raw=JSON.stringify(state||{});writeMeta({dirty:false,version:G.ver,lastHash:hash(raw),syncedAt:new Date().toISOString()})}
  function markDirty(raw=read()){
    if(!raw||raw===G.last)return;
    const m=readMeta();if(m.dirty)return;
    const base=parse(G.last);
    const next={dirty:true,baseVersion:G.ver,startedAt:new Date().toISOString(),pendingHash:hash(raw)};
    if(base)next.base=base;
    writeMeta(next);
  }
  function rememberConflict(server,conflicts){
    if(!conflicts.length)return;
    try{sessionStorage.setItem('weddly_guests_conflict_recovery_v2',JSON.stringify({at:new Date().toISOString(),serverVersion:G.ver,conflicts,server}))}catch{}
  }
  async function putMerged(state,version,baseForRetry,conflicts){
    let p=await api('PUT',{version,state});
    if(p.r.status!==409||!p.x.server?.state)return p;
    const latest=mergeSharedIdentity(structuredClone(p.x.server.state)),more=[],merged=merge3(baseForRetry,state,latest,'',more);conflicts.push(...more);rememberConflict(latest,more);
    writeRaw(merged);G.ver=+p.x.server.version||version;
    p=await api('PUT',{version:G.ver,state:merged});
    if(p.r.ok&&p.x.ok)return{...p,merged};
    return p;
  }
  async function reconcileDirty(local,server,serverVersion){
    const m=readMeta(),conflicts=[],base=m.base&&typeof m.base==='object'?m.base:null;
    let merged;
    if(base)merged=merge3(base,local,server,'',conflicts);
    else if(Number(m.baseVersion||0)===Number(serverVersion||0))merged=structuredClone(local);
    else merged=mergeWithoutBase(local,server,conflicts);
    rememberConflict(server,conflicts);
    writeRaw(merged);G.ver=Number(serverVersion||0);
    const p=await putMerged(merged,G.ver,server,conflicts);
    if(!p.r.ok||!p.x.ok)return false;
    const finalState=p.merged||merged;G.ver=+p.x.version||G.ver+1;writeRaw(finalState);G.last=JSON.stringify(finalState);G.identity=identityOf(finalState);cleanMeta(finalState);
    if(conflicts.length){G.notice(`Cambio simultáneo resuelto · ${conflicts.length} campo${conflicts.length===1?'':'s'} conservado${conflicts.length===1?'':'s'} desde este dispositivo`);setTimeout(G.clearNotice,4200)}
    return true;
  }
  async function start(){
    try{G.token=localStorage.getItem('weddly_shared_wedding_token')||''}catch{}
    let local=mergeSharedIdentity(parse(read()));if(local)writeRaw(local);
    if(!G.token){G.msg.textContent='Este dispositivo todavía no tiene acceso a vuestra boda.';G.retry.style.display='inline-block';return}
    try{
      const a=await api('GET');if(!a.r.ok||!a.x.ok)throw 0;const remote=a.x.state?mergeSharedIdentity(structuredClone(a.x.state)):null;G.ver=+a.x.version||0;let meta=readMeta();
      if(!meta.dirty&&local&&meta.lastHash&&hash(JSON.stringify(local))!==meta.lastHash){meta={dirty:true,baseVersion:Number(meta.version||0),startedAt:new Date().toISOString(),pendingHash:hash(JSON.stringify(local))};writeMeta(meta)}
      if(meta.dirty&&local&&remote){if(!await reconcileDirty(local,remote,G.ver))throw 0;open();return}
      if(meta.dirty&&local&&!remote){const p=await api('PUT',{version:0,state:local});if(!p.r.ok||!p.x.ok)throw 0;G.ver=+p.x.version||1;G.last=JSON.stringify(local);G.identity=identityOf(local);cleanMeta(local);open();return}
      if(remote){
        const original=JSON.stringify(a.x.state),mergedRaw=JSON.stringify(remote);
        if(mergedRaw!==original){const p=await api('PUT',{version:G.ver,state:remote});if(p.r.ok&&p.x.ok)G.ver=+p.x.version||G.ver+1;else if(p.r.status===409&&p.x.server?.state){const latest=mergeSharedIdentity(structuredClone(p.x.server.state));G.ver=+p.x.server.version||G.ver;writeRaw(latest);G.last=JSON.stringify(latest);G.identity=identityOf(latest);cleanMeta(latest);open();return}}
        writeRaw(remote);G.last=JSON.stringify(remote);G.identity=identityOf(remote);cleanMeta(remote);
      }else if(has(local)){
        local=mergeSharedIdentity(local);const p=await api('PUT',{version:0,state:local});if(p.r.ok&&p.x.ok){G.ver=+p.x.version||1;G.last=JSON.stringify(local);G.identity=identityOf(local);cleanMeta(local)}else throw 0;
      }else{G.last=read();G.identity=identityOf(parse(G.last));cleanMeta(parse(G.last)||{})}
      open();
    }catch{
      if(has(local)){G.last=G.last||'';G.identity=identityOf(local);G.msg.textContent='Sin conexión. Abriendo la copia guardada…';setTimeout(open,400)}
      else{G.msg.textContent='No hemos podido abrir Invitados. Comprueba la conexión.';G.retry.textContent='Reintentar';G.retry.href=location.href;G.retry.style.display='inline-block'}
    }
  }
  let timer=0;function queue(){clearTimeout(timer);timer=setTimeout(push,450)}
  function syncIdentityNow(){
    if(G.identitySyncing)return false;const wanted=sharedIdentityKey();if(!wanted||wanted===G.identity)return false;
    const state=mergeSharedIdentity(parse(read()));if(!state)return false;G.identitySyncing=true;writeRaw(state);markDirty(JSON.stringify(state));G.identity=identityOf(state);reloadCore('identity');queue();setTimeout(()=>{G.identitySyncing=false},150);return true;
  }
  async function push(){
    if(G.pushing||!G.token)return;let state=mergeSharedIdentity(parse(read()));if(!state)return;const raw=JSON.stringify(state);if(raw===G.last){cleanMeta(state);return}markDirty(raw);writeRaw(state);G.pushing=true;G.notice('Guardando…');
    try{
      let a=await api('PUT',{version:G.ver,state});
      if(a.r.status===409&&a.x.server?.state){
        const server=mergeSharedIdentity(structuredClone(a.x.server.state)),m=readMeta(),conflicts=[],base=m.base&&typeof m.base==='object'?m.base:(parse(G.last)||server),merged=merge3(base,state,server,'',conflicts);
        rememberConflict(server,conflicts);writeRaw(merged);G.ver=+a.x.server.version||G.ver;
        const p=await putMerged(merged,G.ver,server,conflicts);if(!p.r.ok||!p.x.ok)throw 0;
        const finalState=p.merged||merged;G.ver=+p.x.version||G.ver+1;writeRaw(finalState);G.last=JSON.stringify(finalState);G.identity=identityOf(finalState);cleanMeta(finalState);G.remote=true;reloadCore('merge');
        if(conflicts.length){G.notice(`Cambio simultáneo resuelto · ${conflicts.length}`);setTimeout(G.clearNotice,3500)}else{G.notice('Cambios combinados con el otro dispositivo');setTimeout(G.clearNotice,2500)}
      }else if(!a.r.ok||!a.x.ok)throw 0;
      else{G.ver=+a.x.version||G.ver+1;G.last=raw;G.identity=identityOf(state);cleanMeta(state);G.clearNotice()}
    }catch{G.notice('Pendiente de conexión');setTimeout(()=>{G.pushing=false;queue()},2500);return}
    G.pushing=false;
  }
  async function poll(){
    if(!G.token||G.pushing)return;if(syncIdentityNow())return;const raw=read();if(raw!==G.last){markDirty(raw);queue();return}
    try{const a=await api('GET');if(!a.r.ok||!a.x.ok)return;const v=+a.x.version||0;if(v>G.ver&&a.x.state){const state=mergeSharedIdentity(structuredClone(a.x.state));writeRaw(state);G.ver=v;G.last=JSON.stringify(state);G.identity=identityOf(state);cleanMeta(state);G.remote=true;reloadCore('remote');G.notice('Actualizado con los cambios de vuestra pareja');setTimeout(G.clearNotice,2500)}}catch{}
  }
  setInterval(()=>{if(syncIdentityNow())return;const raw=read();if(G.remote){G.remote=false;G.last=raw;return}if(raw!==G.last){markDirty(raw);queue()}},300);
  addEventListener('storage',e=>{if(e.key==='weddly_pro_v7')syncIdentityNow();if(e.key===G.KEY&&e.newValue!==null){markDirty(e.newValue);queue()}});
  setInterval(poll,5000);addEventListener('online',()=>{syncIdentityNow();queue();poll()});addEventListener('focus',poll);addEventListener('pageshow',poll);document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll()});
  start();
})();
