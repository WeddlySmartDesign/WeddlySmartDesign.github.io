(()=>{
'use strict';
if(window.__wsdRsvpPlusOnePublicV1)return;window.__wsdRsvpPlusOnePublicV1=true;
const ENDPOINT='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-rsvp-single-v2';
const T=(es,en)=>document.documentElement.lang==='en'?en:es;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let queued=false;

function visible(el){return !!el&&getComputedStyle(el).display!=='none'}
function hash(v){const data=JSON.stringify(v);let h=2166136261;for(let i=0;i<data.length;i++){h^=data.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
function style(){
  if(document.getElementById('wsdPlusOneStyle'))return;
  const s=document.createElement('style');s.id='wsdPlusOneStyle';s.textContent=`
  .wsd-plus-details{display:none;margin:9px 0 3px;padding:14px;border:1px solid var(--line,#ddd5c8);border-radius:15px;background:#faf8f4}
  .wsd-plus-details.on{display:block}.wsd-plus-title{font-weight:850;font-size:14px;margin-bottom:6px}.wsd-plus-help{font-size:11px;line-height:1.4;color:var(--muted,#706b65);margin-bottom:8px}
  .wsd-plus-custom{padding:10px 0;border-top:1px solid #eee}.wsd-plus-custom label{margin-top:0}
  `;document.head.appendChild(s)
}
function patchMainMeal(){
  const meal=document.getElementById('meal');if(!meal||meal.dataset.wsdPending==='1')return;
  meal.dataset.wsdPending='1';const op=document.createElement('option');op.value='';op.textContent=T('Elige una opción','Choose an option');meal.insertBefore(op,meal.firstChild);meal.value='';
}
function customClone(){
  return [...document.querySelectorAll('#details > .custom')].map(src=>{
    const q=src.cloneNode(true);q.classList.add('wsd-plus-custom');q.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));q.querySelectorAll('input').forEach(x=>x.value='');q.querySelectorAll('select').forEach(x=>x.selectedIndex=0);return q.outerHTML
  }).join('')
}
function build(){
  style();patchMainMeal();
  const wrap=document.getElementById('plusWrap'),name=document.getElementById('plusone');if(!wrap||!name||document.getElementById('wsdPlusDetails'))return;
  const mealOn=visible(document.getElementById('mealBlock')),allergyOn=visible(document.getElementById('allergyBlock')),transportOn=visible(document.getElementById('transportWrap')),accommodationOn=visible(document.getElementById('accommodationWrap'));
  const mainMeal=document.getElementById('meal');let mealOptions='';if(mainMeal){mealOptions=[...mainMeal.options].map(o=>`<option value="${esc(o.value)}">${esc(o.textContent)}</option>`).join('')}
  const box=document.createElement('div');box.id='wsdPlusDetails';box.className='wsd-plus-details';
  box.innerHTML=`<div class="wsd-plus-title" id="wsdPlusTitle">${T('Datos del acompañante','Guest details')}</div><div class="wsd-plus-help">${T('Estas respuestas se guardarán para esta persona de forma independiente.','These answers will be saved separately for this person.')}</div>
    ${mealOn?`<div id="wsdPlusMealBlock"><label>${T('Menú','Meal')}</label><select id="wsdPlusMeal" class="field">${mealOptions}</select><label id="wsdPlusHighWrap" class="toggle" style="display:none"><span>${T('Necesita trona','Needs a high chair')}</span><input id="wsdPlusHigh" type="checkbox"></label></div>`:''}
    ${allergyOn?`<div><label>${T('Alergias o intolerancias','Allergies or intolerances')}</label><input id="wsdPlusAllergy" class="field" placeholder="${T('Lo que debamos saber','Anything we should know')}"></div>`:''}
    ${transportOn?`<label class="toggle"><span>${T('Necesita transporte','Needs transport')}</span><input id="wsdPlusTransport" type="checkbox"></label>`:''}
    ${accommodationOn?`<label class="toggle"><span>${T('Se quedará a dormir / necesita alojamiento','Will stay overnight / needs accommodation')}</span><input id="wsdPlusAccommodation" type="checkbox"></label>`:''}
    ${customClone()}`;
  wrap.appendChild(box);
  const plusMeal=document.getElementById('wsdPlusMeal');if(plusMeal)plusMeal.value='';
  const updateHigh=()=>{const on=plusMeal?.value==='Infantil';const hw=document.getElementById('wsdPlusHighWrap');if(hw)hw.style.display=on?'flex':'none';if(!on){const h=document.getElementById('wsdPlusHigh');if(h)h.checked=false}};
  plusMeal?.addEventListener('change',updateHigh);updateHigh();
  box.querySelectorAll('[data-q][data-type="yesno"]').forEach(q=>q.querySelectorAll('[data-v]').forEach(b=>b.addEventListener('click',()=>{q.querySelectorAll('[data-v]').forEach(x=>x.classList.toggle('sel',x===b));q.dataset.wsdValue=b.dataset.v==='yes'?'true':'false'})));
  const update=()=>{const n=name.value.trim();box.classList.toggle('on',!!n);document.getElementById('wsdPlusTitle').textContent=n?T(`Datos de ${n}`,`${n}'s details`):T('Datos del acompañante','Guest details')};
  name.addEventListener('input',update);update();
}
function plusCustom(){
  const out={};for(const q of document.querySelectorAll('#wsdPlusDetails [data-q]')){
    const id=q.dataset.q;if(!id)continue;
    if(q.dataset.type==='yesno'){if(q.dataset.wsdValue==='true')out[id]=true;else if(q.dataset.wsdValue==='false')out[id]=false;continue}
    const v=q.querySelector('.cv')?.value?.trim()||'';if(v)out[id]=v
  }return out
}
function plusData(){
  const name=document.getElementById('plusone')?.value?.trim()||'';if(!name)return null;
  const mealEl=document.getElementById('wsdPlusMeal'),meal=mealEl?.value||'',mealOn=!!mealEl;
  return {name,meal_required:mealOn?(meal?meal!=='Sin menú':null):null,meal:mealOn&&meal&&meal!=='Sin menú'?meal:'',allergy:document.getElementById('wsdPlusAllergy')?.value?.trim()||'',highchair:meal==='Infantil'&&!!document.getElementById('wsdPlusHigh')?.checked,transport:!!document.getElementById('wsdPlusTransport')?.checked,accommodation:!!document.getElementById('wsdPlusAccommodation')?.checked,custom_answers:plusCustom()}
}
function validate(){
  const name=document.getElementById('plusone')?.value?.trim()||'';if(!name)return true;
  const meal=document.getElementById('wsdPlusMeal');if(meal&&!meal.value){const fb=document.getElementById('fb');if(fb){fb.className='notice on';fb.textContent=T(`Indica el menú de ${name}.`,`Choose ${name}'s meal.`)}meal.scrollIntoView({behavior:'smooth',block:'center'});meal.focus();return false}
  for(const q of document.querySelectorAll('#wsdPlusDetails [data-q][data-required="1"]')){
    let ok=false;if(q.dataset.type==='yesno')ok=q.dataset.wsdValue==='true'||q.dataset.wsdValue==='false';else ok=!!q.querySelector('.cv')?.value?.trim();
    if(!ok){const fb=document.getElementById('fb');if(fb){fb.className='notice on';fb.textContent=T(`Falta responder una pregunta obligatoria de ${name}.`,`${name} has an unanswered required question.`)}q.scrollIntoView({behavior:'smooth',block:'center'});return false}
  }return true
}
const nativeFetch=window.fetch.bind(window);
window.fetch=async function(input,init){
  try{
    const url=typeof input==='string'?input:input?.url||'',method=String(init?.method||(typeof input!=='string'?input?.method:'GET')||'GET').toUpperCase();
    if(method==='POST'&&url.includes('/weddly-rsvp')&&init?.body){
      const body=JSON.parse(String(init.body));
      if(body?.action==='submit'&&body?.guest_key){
        const p=body.attend===true?plusData():null;body.plusone_details=p;
        if(body.client_submission_id)body.client_submission_id=String(body.client_submission_id)+'_p'+hash(p||null);
        init={...init,body:JSON.stringify(body)};
        return nativeFetch(ENDPOINT,init)
      }
    }
  }catch(e){console.warn('WSD +1 bridge',e)}
  return nativeFetch(input,init)
};
function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;build()})}
document.addEventListener('click',e=>{if(e.target?.closest?.('#send')&&!validate()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}},true);
const app=document.getElementById('app');if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
[0,60,180,500].forEach(ms=>setTimeout(schedule,ms));
})();