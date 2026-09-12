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
    const q=new URLSearchParams(location.search),embedded=parent!==window||q.get('suite')==='1'||q.get('_wsd_suite')==='1';
    if(embedded){
      const style=document.createElement('style');style.id='wsdEventsEmbeddedBrand';style.textContent='main.wrap>.brand{display:none!important}';document.head.appendChild(style);
      document.querySelector('main.wrap>.brand')?.style.setProperty('display','none','important');
    }
  }catch{}
})();
