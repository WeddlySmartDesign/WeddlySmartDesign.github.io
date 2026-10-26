(()=>{
'use strict';
if(window.__wsdGuestsStateIntegrityV1)return;window.__wsdGuestsStateIntegrityV1=true;
const G=window.__GuestsProd,KEY='weddly_guests_qa_v67',MISSING=Symbol('missing');
if(!G?.f)return;
const clone=v=>v===MISSING?MISSING:(v===undefined?undefined:structuredClone(v));
const obj=v=>v!==MISSING&&v&&typeof v==='object'&&!Array.isArray(v);
const eq=(a,b)=>{if(a===MISSING||b===MISSING)return a===b;try{return JSON.stringify(a)===JSON.stringify(b)}catch{return a===b}};
function merge3(base,local,remote,path='',conflicts=[]){
  if(eq(local,base))return clone(remote);
  if(eq(remote,base))return clone(local);
  if(eq(local,remote))return clone(local);
  if(obj(base)||obj(local)||obj(remote)){
    if((base===MISSING||obj(base))&&(local===MISSING||obj(local))&&(remote===MISSING||obj(remote))){
      const out={},keys=new Set([
        ...Object.keys(obj(base)?base:{}),...Object.keys(obj(local)?local:{}),...Object.keys(obj(remote)?remote:{})
      ]);
      for(const k of keys){
        const bv=obj(base)&&Object.prototype.hasOwnProperty.call(base,k)?base[k]:MISSING;
        const lv=obj(local)&&Object.prototype.hasOwnProperty.call(local,k)?local[k]:MISSING;
        const rv=obj(remote)&&Object.prototype.hasOwnProperty.call(remote,k)?remote[k]:MISSING;
        const mv=merge3(bv,lv,rv,path?path+'.'+k:k,conflicts);
        if(mv!==MISSING)out[k]=mv;
      }
      return out;
    }
  }
  conflicts.push(path||'$');
  return clone(local);
}
function parse(raw){try{const x=JSON.parse(raw||'null');return x&&typeof x==='object'&&!Array.isArray(x)?x:null}catch{return null}}
function hook(){
  let w,d;try{w=G.f.contentWindow;d=G.f.contentDocument}catch{return}if(!w||!d?.documentElement||d.documentElement.dataset.wsdStateIntegrityV1==='1')return;
  const P=w.Storage?.prototype,ls=w.localStorage;if(!P||!ls)return;
  const nativeGet=P.getItem,nativeSet=P.setItem;
  let coreBase=parse(nativeGet.call(ls,KEY));
  d.documentElement.dataset.wsdStateIntegrityV1='1';
  P.setItem=function(k,v){
    if(this!==ls||String(k)!==KEY)return nativeSet.call(this,k,v);
    const candidate=parse(String(v));if(!candidate)return nativeSet.call(this,k,v);
    const latest=parse(nativeGet.call(ls,KEY))||candidate;
    if(!coreBase)coreBase=structuredClone(candidate);
    const conflicts=[],merged=merge3(coreBase,candidate,latest,'',conflicts),raw=JSON.stringify(merged),candidateRaw=JSON.stringify(candidate);
    coreBase=structuredClone(candidate);
    try{window.__wsdGuestsCoreLastOutput=raw;window.__wsdGuestsCoreLastWriteAt=Date.now()}catch{}
    const result=nativeSet.call(this,k,raw);
    if(raw!==candidateRaw){
      try{window.__wsdGuestsCoreRebasedAt=Date.now()}catch{}
      setTimeout(()=>{
        try{
          const pd=G.f.contentDocument;
          if(pd?.getElementById('plan')?.classList.contains('on'))return;
          if(G.f.contentWindow===w&&typeof window.__wsdGuestsIntegrityReload==='function')window.__wsdGuestsIntegrityReload('rebase');
        }catch{}
      },0);
    }
    return result;
  };
}
let reloadLock=false;
window.__wsdGuestsIntegrityReload=(reason='external')=>{
  if(reloadLock)return;reloadLock=true;
  try{const d=G.f.contentDocument;if(d?.getElementById('plan')?.classList.contains('on')){reloadLock=false;return}}catch{}
  try{G.f.src=G.APP+'&integrity='+encodeURIComponent(reason)+'_'+Date.now();window.dispatchEvent(new Event('guests-prod-open'))}catch{}
  setTimeout(()=>{reloadLock=false},250);
};
G.f.addEventListener('load',()=>{setTimeout(hook,0);setTimeout(hook,80)});
addEventListener('storage',e=>{
  if(e.key!==KEY||!e.newValue)return;
  if(e.newValue===window.__wsdGuestsCoreLastOutput)return;
  try{const d=G.f.contentDocument;if(d?.getElementById('plan')?.classList.contains('on'))return}catch{}
  setTimeout(()=>window.__wsdGuestsIntegrityReload?.('external'),20);
});
setInterval(hook,500);
})();
