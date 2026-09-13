(()=>{
'use strict';
if(window.__wsdRsvpChildrenPublic)return;window.__wsdRsvpChildrenPublic=true;
const qs=new URLSearchParams(location.search),unitMode=!!qs.get('u');
const T=(es,en)=>document.documentElement.lang==='en'?en:es;
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let patchQueued=false;

function installStyle(){
  if(document.getElementById('wsdChildrenPublicStyle'))return;
  const s=document.createElement('style');s.id='wsdChildrenPublicStyle';
  s.textContent=`
    .wsd-kids{margin-top:12px;padding-top:11px;border-top:1px solid #eee}
    .wsd-kids.unit{margin:14px 0 2px;padding:14px;border:1px solid var(--line,#ddd5c8);border-radius:16px;background:#fff}
    .wsd-kids-toggle{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0;font-size:13px;font-weight:800}
    .wsd-kids-toggle input{width:22px;height:22px;flex:0 0 auto}
    .wsd-kids-body{display:none;padding-top:8px}.wsd-kids-body.on{display:block}
    .wsd-child{border:1px solid var(--line,#ddd5c8);border-radius:14px;padding:12px;margin:10px 0;background:#fff}
    .wsd-child b{display:block;margin-bottom:7px;font-size:14px}
    .wsd-kids-help{font-size:11px;line-height:1.4;color:var(--muted,#706b65);margin:2px 0 8px}
  `;
  document.head.appendChild(s);
}
function meals(selected='Infantil'){
  const xs=[['Estándar','Estándar','Standard'],['Vegetariano','Vegetariano','Vegetarian'],['Vegano','Vegano','Vegan'],['Celíaco','Celíaco','Gluten-free'],['Sin lactosa','Sin lactosa','Lactose-free'],['Infantil','Infantil','Child menu'],['Sin menú','Sin menú','No meal']];
  return xs.map(([v,es,en])=>`<option value="${v}"${v===selected?' selected':''}>${T(es,en)}</option>`).join('');
}
function currentRows(block){
  return [...block.querySelectorAll('.wsd-child')].map(row=>({
    name:row.querySelector('[data-k="name"]')?.value||'',age:row.querySelector('[data-k="age"]')?.value||'',meal:row.querySelector('[data-k="meal"]')?.value||'Infantil',allergy:row.querySelector('[data-k="allergy"]')?.value||''
  }));
}
function drawRows(block){
  const host=block.querySelector('.wsd-kids-rows'),n=Math.max(1,Math.min(8,Number(block.querySelector('.wsd-kids-count')?.value)||1)),old=currentRows(block);
  host.innerHTML=Array.from({length:n},(_,i)=>{const x=old[i]||{};return `<div class="wsd-child"><b>${T('Niño/a','Child')} ${i+1}</b><label>${T('Nombre','Name')} *</label><input class="field" data-k="name" maxlength="180" value="${safe(x.name||'')}"><label>${T('Edad','Age')}</label><input class="field" data-k="age" type="number" min="0" max="17" inputmode="numeric" value="${safe(x.age||'')}"><label>${T('Menú','Meal')}</label><select class="field" data-k="meal">${meals(x.meal||'Infantil')}</select><label>${T('Alergias o intolerancias','Allergies or intolerances')}</label><input class="field" data-k="allergy" maxlength="600" value="${safe(x.allergy||'')}"></div>`}).join('');
}
function blockHtml(){
  return `<div class="wsd-kids${unitMode?' unit':''}" data-wsd-kids><label class="wsd-kids-toggle"><span>${unitMode?T('¿Vendrán niños con vosotros?','Will any children be coming with you?'):T('¿Vendrán niños contigo?','Will any children be coming with you?')}</span><input class="wsd-kids-check" type="checkbox"></label><div class="wsd-kids-body"><div class="wsd-kids-help">${T('Indica sus datos para que la pareja pueda organizar menú y catering.','Add their details so the couple can plan meals and catering.')}</div><label>${T('Número de niños','Number of children')}</label><input class="field wsd-kids-count" type="number" min="1" max="8" value="1" inputmode="numeric"><div class="wsd-kids-rows"></div></div></div>`;
}
function attendanceTarget(){
  if(!unitMode)return document.getElementById('yes')?.classList.contains('sel')?(qs.get('g')||'single'):'';
  const p=[...document.querySelectorAll('.person')].find(x=>x.querySelector('[data-answer="yes"]')?.classList.contains('sel'));
  return p?.dataset?.person||'';
}
function block(){return document.querySelector('[data-wsd-kids]')}
function updateUnitVisibility(){if(!unitMode)return;const b=block();if(b)b.style.display=attendanceTarget()?'':'none'}
function wire(b){
  if(b.dataset.wsdWired)return;b.dataset.wsdWired='1';
  const check=b.querySelector('.wsd-kids-check'),body=b.querySelector('.wsd-kids-body'),count=b.querySelector('.wsd-kids-count');
  check.onchange=()=>{body.classList.toggle('on',check.checked);if(check.checked&&!b.querySelector('.wsd-child'))drawRows(b)};
  count.oninput=()=>drawRows(b);drawRows(b);updateUnitVisibility();
}
function patch(){
  patchQueued=false;installStyle();if(block()){updateUnitVisibility();return}
  if(unitMode){const people=document.getElementById('people');if(!people)return;people.insertAdjacentHTML('afterend',blockHtml())}
  else{const details=document.getElementById('details'),allergy=document.getElementById('allergyBlock');if(!details)return;(allergy||details.firstElementChild)?.insertAdjacentHTML?.('afterend',blockHtml());if(!block())details.insertAdjacentHTML('afterbegin',blockHtml())}
  const b=block();if(b)wire(b)
}
function schedulePatch(){if(patchQueued)return;patchQueued=true;queueMicrotask(patch)}
function children(){
  const b=block(),target=attendanceTarget();if(!b||!target||!b.querySelector('.wsd-kids-check')?.checked)return[];
  return [...b.querySelectorAll('.wsd-child')].map(row=>{const meal=row.querySelector('[data-k="meal"]')?.value||'Infantil';return{name:(row.querySelector('[data-k="name"]')?.value||'').trim(),age:row.querySelector('[data-k="age"]')?.value===''?null:Number(row.querySelector('[data-k="age"]')?.value),meal_required:meal!=='Sin menú',meal:meal==='Sin menú'?'':meal,allergy:(row.querySelector('[data-k="allergy"]')?.value||'').trim()}});
}
function hashKids(xs){const data=JSON.stringify(xs);let h=2166136261;for(let i=0;i<data.length;i++){h^=data.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
function validate(){
  const b=block(),target=attendanceTarget();if(!b||!target||!b.querySelector('.wsd-kids-check')?.checked)return true;
  const bad=[...b.querySelectorAll('.wsd-child')].find(row=>!(row.querySelector('[data-k="name"]')?.value||'').trim());if(!bad)return true;
  const fb=document.getElementById('fb');if(fb){fb.className='notice on';fb.textContent=T('Indica el nombre de cada niño antes de enviar.','Please add each child’s name before sending.')}
  bad.querySelector('[data-k="name"]')?.focus();bad.scrollIntoView({behavior:'smooth',block:'center'});return false;
}
const nativeFetch=window.fetch.bind(window);
window.fetch=async function(input,init){
  try{
    const url=typeof input==='string'?input:input?.url||'',method=String(init?.method||(typeof input!=='string'?input?.method:'GET')||'GET').toUpperCase();
    if(method==='POST'&&url.includes('/weddly-rsvp')&&init?.body){
      const body=JSON.parse(String(init.body));if(body?.action==='submit'){
        const xs=children(),target=attendanceTarget(),attach=!unitMode||String(body.guest_key||'')===String(target);
        body.children=attach?xs:[];
        if(attach&&body.client_submission_id)body.client_submission_id=String(body.client_submission_id)+'_k'+hashKids(xs);
        init={...init,body:JSON.stringify(body)};
      }
    }
  }catch{}
  return nativeFetch(input,init)
};
document.addEventListener('click',e=>{
  if(e.target?.closest?.('#send')&&!validate()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();return}
  if(unitMode&&e.target?.closest?.('[data-answer]'))setTimeout(updateUnitVisibility,0)
},true);
const app=document.getElementById('app');if(app){const obs=new MutationObserver(schedulePatch);obs.observe(app,{childList:true,subtree:true})}
[0,60,180,500].forEach(ms=>setTimeout(schedulePatch,ms));
})();