(()=>{
'use strict';
if(window.__wsdRsvpMainMealPendingV1)return;window.__wsdRsvpMainMealPendingV1=true;
const nativeFetch=window.fetch.bind(window);
window.fetch=async function(input,init){
  try{
    const url=typeof input==='string'?input:input?.url||'';
    const method=String(init?.method||(typeof input!=='string'?input?.method:'GET')||'GET').toUpperCase();
    if(method==='POST'&&url.includes('/weddly-rsvp')&&init?.body){
      const body=JSON.parse(String(init.body));
      const meal=document.getElementById('meal'),mealBlock=document.getElementById('mealBlock');
      if(body?.action==='submit'&&body?.guest_key&&body.attend===true&&meal&&mealBlock&&getComputedStyle(mealBlock).display!=='none'&&meal.value===''){
        body.meal_required=true;body.meal='';init={...init,body:JSON.stringify(body)};
      }
    }
  }catch{}
  return nativeFetch(input,init)
};
})();