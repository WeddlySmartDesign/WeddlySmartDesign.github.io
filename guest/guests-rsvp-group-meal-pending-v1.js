(()=>{
'use strict';
if(window.__wsdGroupMealPendingV1)return;window.__wsdGroupMealPendingV1=true;
const T=(es,en)=>(document.documentElement.lang||'es').toLowerCase().startsWith('en')?en:es;
function patch(){document.querySelectorAll('.person .meal').forEach(meal=>{if(meal.dataset.wsdPending==='1')return;meal.dataset.wsdPending='1';const op=document.createElement('option');op.value='';op.textContent=T('Elige una opción','Choose an option');meal.insertBefore(op,meal.firstChild);meal.value=''})}
function validate(){for(const person of document.querySelectorAll('.person')){const attends=person.querySelector('[data-answer="yes"]')?.classList.contains('sel');if(!attends)continue;const meal=person.querySelector('.meal'),block=person.querySelector('.mealBlock');if(!meal||!block||getComputedStyle(block).display==='none')continue;if(meal.value)continue;const name=person.querySelector('.personTitle')?.textContent?.trim()||T('esta persona','this person'),fb=document.getElementById('fb');if(fb){fb.className='notice on';fb.textContent=T(`Indica el menú de ${name}.`,`Choose ${name}'s meal.`)}meal.scrollIntoView({behavior:'smooth',block:'center'});meal.focus();return false}return true}
document.addEventListener('click',e=>{if(!e.target?.closest?.('#send'))return;if(validate())return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()},true);
let queued=false;const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;patch()})};const app=document.getElementById('app');if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});[0,60,180,500].forEach(ms=>setTimeout(patch,ms));
})();
