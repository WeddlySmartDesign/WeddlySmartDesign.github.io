(()=>{
  const PALETTE=['#a9744d','#6b7f72','#8b7aa6','#b28a56','#8f726f','#708996','#8a806d','#7c7894','#768c7e'];
  function colorFor(group){const k=String(group||'Otros');let h=0;for(const c of k)h=(h*31+c.charCodeAt(0))>>>0;return PALETTE[h%PALETTE.length]}
  function ensureStyle(){if(document.getElementById('wsdRsvpPolishStyle'))return;const s=document.createElement('style');s.id='wsdRsvpPolishStyle';s.textContent=`
    .manualLink{border:1px solid var(--line)!important;background:#fff!important;color:var(--ink)!important;border-radius:10px!important;padding:8px 10px!important;font-size:12px!important;font-weight:800!important;box-shadow:0 1px 0 #2c2a2605;cursor:pointer}
    .manualLink:active{transform:translateY(1px)}
    .groupTitle{display:flex;align-items:center;gap:7px}
    .groupDot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--group-color);flex:0 0 auto}
    .filter .groupDot{margin-right:7px;vertical-align:0}
    .subgroup{border-left:4px solid var(--group-color)!important}
  `;document.head.appendChild(s)}
  function patchMetrics(){document.querySelectorAll('.metric span').forEach(x=>{if(x.textContent.trim()==='personas respondidas')x.textContent='respuestas'})}
  function patchManual(){document.querySelectorAll('.manualLink').forEach(b=>{b.setAttribute('role','button');b.setAttribute('aria-label',`Registrar respuesta manual${b.closest('.guest')?.querySelector('.guestName')?.textContent?` de ${b.closest('.guest').querySelector('.guestName').textContent}`:''}`)})}
  function patchFilters(){document.querySelectorAll('.filter[data-filter]').forEach(b=>{const g=b.dataset.filter;if(!g||g==='__all__')return;const c=colorFor(g);b.style.setProperty('--group-color',c);b.style.borderColor=c;if(b.classList.contains('on')){b.style.background=c;b.style.color='#fff'}else{b.style.background='#fff';b.style.color='var(--ink)'}if(!b.querySelector('.groupDot'))b.insertAdjacentHTML('afterbegin','<span class="groupDot" aria-hidden="true"></span>')})}
  function patchGroups(){document.querySelectorAll('.group').forEach(sec=>{const t=sec.querySelector('.groupTitle');if(!t)return;const group=t.textContent.trim();const c=colorFor(group);sec.style.setProperty('--group-color',c);if(!t.querySelector('.groupDot'))t.insertAdjacentHTML('afterbegin','<span class="groupDot" aria-hidden="true"></span>')})}
  let scheduled=false;function apply(){scheduled=false;ensureStyle();patchMetrics();patchManual();patchFilters();patchGroups()}
  function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply)}
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  queue();
})();
