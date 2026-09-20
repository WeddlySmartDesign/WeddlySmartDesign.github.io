(()=>{
'use strict';
const q=new URLSearchParams(location.search);
const publicFlow=q.has('g')||q.has('u')||q.has('unit')||q.get('guest')==='1';
if(!publicFlow)return;
const VERSION='2026-09-20';
const $=s=>document.querySelector(s);
const fields=()=>[...document.querySelectorAll('.allergy,#allergy,#rAllergy,#rPlusAllergy,[data-kid-allergy],input[id*="allergy" i],textarea[id*="allergy" i]')].filter((x,i,a)=>a.indexOf(x)===i);
const hasHealthData=()=>fields().some(x=>String(x.value||'').trim());
const lang=()=>String(document.documentElement.lang||'es').toLowerCase().startsWith('en')?'en':'es';
const copy=()=>lang()==='en'?{
  title:'Health information',
  body:'If you include allergy or intolerance information, confirm that you are the person concerned or have permission to provide it solely to organise the wedding service.',
  check:'I expressly consent to this health information being processed for this purpose.',
  err:'Please confirm consent before sending health information.'
}:{
  title:'Información de salud',
  body:'Si incluyes información sobre alergias o intolerancias, confirma que eres la persona interesada o que tienes autorización para facilitarla únicamente para organizar el servicio de la boda.',
  check:'Consiento expresamente el tratamiento de esta información de salud con esa finalidad.',
  err:'Confirma el consentimiento antes de enviar información de salud.'
};
function style(){
 if($('#wsdHealthConsentStyle'))return;
 const s=document.createElement('style');s.id='wsdHealthConsentStyle';s.textContent=
 '.wsd-health-consent{margin:16px 0 12px;padding:14px;border:1px solid rgba(94,83,76,.16);border-radius:14px;background:rgba(255,255,255,.66);font:13px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#655d57}.wsd-health-consent[hidden]{display:none!important}.wsd-health-consent strong{display:block;margin-bottom:5px;color:#403a36;font-size:13px}.wsd-health-consent p{margin:0 0 10px;font-size:12px;line-height:1.5}.wsd-health-consent label{display:grid;grid-template-columns:20px minmax(0,1fr);gap:9px;align-items:start;font-size:12px;line-height:1.45;cursor:pointer}.wsd-health-consent input{width:18px;height:18px;margin:1px 0 0;accent-color:#433d3b}.wsd-health-error{display:none;margin-top:8px;color:#9a4437;font-size:12px;font-weight:700}.wsd-health-consent.invalid .wsd-health-error{display:block}';
 document.head.appendChild(s);
}
function ensure(){
 style();
 const fs=fields();
 let box=$('#wsdHealthConsent');
 if(!fs.length){if(box)box.hidden=true;return}
 if(!box){
   const c=copy();box=document.createElement('section');box.id='wsdHealthConsent';box.className='wsd-health-consent';
   box.innerHTML='<strong>'+c.title+'</strong><p>'+c.body+'</p><label><input id="wsdHealthConsentCheck" type="checkbox"><span>'+c.check+'</span></label><div class="wsd-health-error">'+c.err+'</div>';
   const send=$('#send')||$('#rSend')||document.querySelector('button[type="submit"]');
   if(send?.parentNode)send.parentNode.insertBefore(box,send);else document.body.appendChild(box);
   $('#wsdHealthConsentCheck')?.addEventListener('change',()=>box.classList.remove('invalid'));
 }
 box.hidden=!hasHealthData();
 if(!hasHealthData())box.classList.remove('invalid');
}
function allowed(){
 ensure();
 if(!hasHealthData())return true;
 const ok=!!$('#wsdHealthConsentCheck')?.checked;
 if(!ok){
   const box=$('#wsdHealthConsent');box?.classList.add('invalid');box?.scrollIntoView({behavior:'smooth',block:'center'});$('#wsdHealthConsentCheck')?.focus();
 }
 return ok;
}
document.addEventListener('input',e=>{if(e.target&&fields().includes(e.target))ensure()},true);
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('#send,#rSend,button[type="submit"]');if(!b)return;
 if(!allowed()){e.preventDefault();e.stopImmediatePropagation()}
},true);
document.addEventListener('submit',e=>{if(!allowed()){e.preventDefault();e.stopImmediatePropagation()}},true);

const nativeFetch=window.fetch.bind(window);
window.fetch=async function(input,init){
 try{
   const url=typeof input==='string'?input:String(input?.url||'');
   if(/weddly-rsvp/.test(url)&&String(init?.method||'GET').toUpperCase()==='POST'&&typeof init?.body==='string'){
     const body=JSON.parse(init.body);
     const health=String(body?.allergy||'').trim()||
       (Array.isArray(body?.children)&&body.children.some(x=>String(x?.allergy||'').trim()))||
       String(body?.plusone_details?.allergy||'').trim();
     if(health){
       if(!$('#wsdHealthConsentCheck')?.checked)throw new Error('health_consent_required');
       body.health_consent=true;
       body.health_consent_version=VERSION;
       body.health_consent_recorded_at=new Date().toISOString();
       init={...init,body:JSON.stringify(body)};
     }
   }
 }catch(e){
   if(String(e?.message||'')==='health_consent_required'){allowed();return Promise.reject(e)}
 }
 return nativeFetch(input,init);
};
new MutationObserver(()=>ensure()).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(ensure,0);setTimeout(ensure,250);setTimeout(ensure,900);
})();