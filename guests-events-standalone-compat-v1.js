(()=>{
  const PAY='weddly_pro_v7';
  const rawGet=Storage.prototype.getItem;
  Storage.prototype.getItem=function(key){
    const value=rawGet.call(this,key);
    if(this===localStorage&&key===PAY&&value===null){
      let lang=(rawGet.call(localStorage,'weddly_access_lang')||'').toLowerCase();
      if(lang!=='es'&&lang!=='en')lang=(navigator.language||'').toLowerCase().startsWith('es')?'es':'en';
      return JSON.stringify({settings:{lang}});
    }
    return value;
  };
  try{
    const q=new URLSearchParams(location.search),embedded=parent!==window||q.get('suite')==='1'||q.get('_wsd_suite')==='1',fromRsvp=q.get('from')==='rsvp';
    if(embedded){
      const style=document.createElement('style');style.id='wsdEventsEmbeddedBrand';style.textContent='main.wrap>.brand{display:none!important}';document.head.appendChild(style);
      document.querySelector('main.wrap>.brand')?.style.setProperty('display','none','important');
    }
    if(fromRsvp){
      const main=document.querySelector('main.wrap');
      if(main&&!document.getElementById('wsdEventsBack')){
        const box=document.createElement('div');box.style.cssText='display:flex;justify-content:flex-start;margin:0 0 12px';
        const b=document.createElement('button');b.type='button';b.id='wsdEventsBack';b.className='btn secondary small';
        const lang=(()=>{try{const p=JSON.parse(localStorage.getItem(PAY)||'null'),v=p?.settings?.lang;if(v==='en')return'en'}catch{}try{if(localStorage.getItem('weddly_access_lang')==='en')return'en'}catch{}return'es'})();
        b.textContent=lang==='en'?'← Back to RSVP':'← Volver al RSVP';
        b.onclick=()=>{const target='guests-rsvp-form-flow.html?v=6-stable-runtime';if(embedded&&parent!==window){try{parent.postMessage({type:'wsd-suite-open',view:'guests-rsvp',url:target},location.origin);return}catch{}}const u=new URL(target,location.href);const demo=q.get('ownerDemo');if(demo)u.searchParams.set('ownerDemo',demo);location.assign(u.href)};
        box.appendChild(b);main.insertBefore(box,main.firstChild);
      }
    }
  }catch{}
})();
