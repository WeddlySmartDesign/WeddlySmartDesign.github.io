(()=>{
'use strict';
if(window.__wsdInvitationEditorFeedback)return;window.__wsdInvitationEditorFeedback=true;
const by=id=>document.getElementById(id),B=window.__WEDDLY_BOOT||{};
const tier=typeof TEMPLATES==='object'&&TEMPLATES.sig01?'signature':'essential';
const DRAFT='weddly_invitation_draft_v2_'+(B.token||'local')+'_'+tier;
const LEGACY_DRAFT='weddly_invitation_draft_v1_'+(B.token||'local');
let timer=0,locationBackup=[];
const fields=['p1','p2','date','time','venue','city','storyTitle','storyText','contactName','contactPhone','whatsapp','tagline','storyQuote','hotelName','hotelDesc','hotelCode','hotelLink','dressNote','giftText','giftStrong','playlistText','playlistLinkText','playlistLink','infoExtraText','contact1Name','contact1Phone','contact2Name','contact2Phone','blockTransporte','blockAlojamiento','blockDresscode','blockRegalo','blockPlaylist','blockInfoExtra'];
const en=()=>{try{const x=JSON.parse(localStorage.getItem('weddly_pro_v7')||'null');if(x?.settings?.lang==='en')return true;if(x?.settings?.lang==='es')return false}catch{}try{return localStorage.getItem('weddly_access_lang')==='en'}catch{return false}};
const T=(es,enText)=>en()?enText:es;
function addStyle(){if(by('wsdif-style'))return;const s=document.createElement('style');s.id='wsdif-style';s.textContent=`
.wsdif-draft{display:flex;align-items:center;gap:7px;margin:-8px 0 16px;color:#6f6a61;font:500 11px/1.3 'Jost',system-ui}.wsdif-dot{width:7px;height:7px;border-radius:50%;background:#b8b1a7}.wsdif-draft.on .wsdif-dot{background:#6E7A5C}.wsdif-tools{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.wsdif-mini{border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--ink);padding:7px 10px;font:600 10px 'Jost',system-ui;cursor:pointer}.wsdif-mini.danger{color:#9a4537}.wsdif-mini:disabled{opacity:.38;cursor:default}.wsdif-add{width:100%;border:1px dashed var(--accent);border-radius:12px;background:#fff;color:var(--ink);padding:12px;font:600 12px 'Jost',system-ui;cursor:pointer;margin:9px 0 2px}.wsdif-same{display:flex;align-items:flex-start;gap:10px;border:1px solid var(--line);border-radius:13px;padding:12px;margin:8px 0 12px;background:#fff;font:500 12px/1.4 'Jost',system-ui}.wsdif-same input{width:20px;height:20px;flex:0 0 auto;margin-top:1px}.wsdif-note{font:500 10px/1.35 'Jost',system-ui;color:#6f6a61;margin-top:5px}.wsdif-section-help{margin:-3px 0 12px;padding:10px 12px;border-radius:11px;background:#f3f1eb;color:#6f6a61;font:500 11px/1.45 'Jost',system-ui}`;document.head.appendChild(s)}
function snapshot(){
  const values={};for(const id of fields){const el=by(id);if(el)values[id]=el.type==='checkbox'?el.checked:el.value}
  return{ts:Date.now(),tier,state:JSON.parse(JSON.stringify(state)),fields:values};
}
function status(text,on=true){let n=by('wsdif-draft');if(!n){const fb=by('weddlyIntegrationFeedback'),bar=by('weddlyIntegrationBar');if(!bar)return;n=document.createElement('div');n.id='wsdif-draft';n.className='wsdif-draft';n.innerHTML='<span class="wsdif-dot"></span><span></span>';(fb||bar).insertAdjacentElement('afterend',n)}n.classList.toggle('on',on);n.querySelector('span:last-child').textContent=text}
function persistDraft(){
  let raw;try{raw=JSON.stringify(snapshot())}catch{return false}
  try{localStorage.setItem(DRAFT,raw);try{sessionStorage.removeItem(DRAFT)}catch{}return true}catch{}
  try{sessionStorage.setItem(DRAFT,raw);return true}catch{return false}
}
window.__weddlyPersistInvitationDraft=persistDraft;
function readDraft(){
  let result=null;
  for(const storage of [localStorage,sessionStorage]){
    try{const x=JSON.parse(storage.getItem(DRAFT)||'null');if(x?.tier===tier&&x.ts&&(!result||x.ts>result.ts))result=x}catch{}
  }
  if(!result&&tier==='essential'){
    try{
      const x=JSON.parse(localStorage.getItem(LEGACY_DRAFT)||'null');
      if(x?.ts&&TEMPLATES[x.template]){
        const data={};for(const key of Object.keys(state))if(Object.hasOwn(x,key))data[key]=x[key];
        const values={};for(const id of fields)if(Object.hasOwn(x,id))values[id]=x[id];
        result={ts:x.ts,tier,state:data,fields:values};
      }
    }catch{}
  }
  return result;
}
function clearDraft(){
  clearTimeout(timer);
  for(const storage of [localStorage,sessionStorage])try{storage.removeItem(DRAFT)}catch{}
  if(tier==='essential')try{localStorage.removeItem(LEGACY_DRAFT)}catch{}
}
function saveDraft(){
  clearTimeout(timer);timer=setTimeout(()=>{
    const ok=persistDraft();
    status(ok?T('Borrador guardado en este dispositivo','Draft saved on this device'):T('No se ha podido proteger el borrador. Guarda antes de salir.','The draft could not be protected. Save before leaving.'),ok);
  },250);
}
function restore(){
  const x=readDraft();if(!x?.state)return false;
  for(const id of fields){const el=by(id);if(!el||!Object.hasOwn(x.fields||{},id))continue;if(el.type==='checkbox')el.checked=x.fields[id]===true;else el.value=x.fields[id]}
  for(const key of Object.keys(state)){
    if(key==='template'||key==='fontPair'||!Object.hasOwn(x.state,key))continue;
    const value=x.state[key];if(value!==null&&typeof value===typeof state[key]&&Array.isArray(value)===Array.isArray(state[key]))state[key]=JSON.parse(JSON.stringify(value));
  }
  if(TEMPLATES[x.state.template])state.template=x.state.template;
  if(FONT_PAIRS.some(f=>f.id===x.state.fontPair))state.fontPair=x.state.fontPair;
  buildTemplateGrid();buildFontGrid();
  if(typeof syncTemplateFields==='function')syncTemplateFields();else buildAgendaFields();
  if(typeof buildLocationFields==='function')buildLocationFields();
  if(typeof buildVenueFields==='function')buildVenueFields();
  if(typeof buildTransporteFields==='function')buildTransporteFields();
  for(const [a,z] of [['blockTransporte','bodyTransporte'],['blockAlojamiento','bodyAlojamiento'],['blockDresscode','bodyDresscode'],['blockRegalo','bodyRegalo'],['blockPlaylist','bodyPlaylist'],['blockInfoExtra','bodyInfoExtra']])if(by(z)&&by(a))by(z).classList.toggle('off',!by(a).checked);
  renderPreview();window.__weddlyRefreshPhotoControls?.();
  status(T('Borrador recuperado · no has perdido los cambios','Draft restored · your changes are safe'),true);return true;
}
function collectionControls(){
  const access=window.__WSD_INVITATION_COLLECTIONS;
  if(!access?.signature||!B.token||!B.memberToken||by('wsdInvitationCollections'))return;
  const grid=by('tplGrid');if(!grid)return;
  const style=document.createElement('style');style.textContent='.wsdif-collections{margin:0 0 16px}.wsdif-collections p{margin:0 0 9px;font:500 12px/1.4 Jost,system-ui;color:#6f6a61}.wsdif-collection-buttons{display:flex;gap:8px}.wsdif-collection-buttons button{flex:1;min-width:0;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--ink);padding:12px 10px;font:600 13px Jost,system-ui;cursor:pointer}.wsdif-collection-buttons button[aria-pressed=\"true\"]{background:var(--ink);color:#fff;border-color:var(--ink)}.wsdif-collection-buttons button:disabled{opacity:.55;cursor:wait}';document.head.appendChild(style);
  const row=document.createElement('div');row.id='wsdInvitationCollections';row.className='wsdif-collections';
  const note=document.createElement('p');note.textContent=T('Tu acceso Signature incluye Essential y Signature.','Your Signature access includes Essential and Signature.');row.appendChild(note);
  const group=document.createElement('div');group.className='wsdif-collection-buttons';group.setAttribute('role','group');group.setAttribute('aria-label',T('Colección de invitaciones','Invitation collection'));
  for(const collection of ['essential','signature']){
    const button=document.createElement('button');button.type='button';button.dataset.wsdCollection=collection;
    button.textContent=collection==='essential'?'Essential':'Signature';button.setAttribute('aria-pressed',String(collection===tier));
    button.onclick=()=>{
      if(collection===tier||button.disabled)return;
      clearTimeout(timer);
      if(!persistDraft()){status(T('No se ha podido proteger el borrador. Guarda antes de cambiar de colección.','The draft could not be protected. Save before switching collections.'),false);return}
      const host=window.parent,u=new URL('guests-rsvp-design-manage.html',host.location.href);u.search=host.location.search;u.searchParams.set('collection',collection);u.searchParams.set('v','3-included-collections-20261002');u.hash='';
      try{localStorage.setItem('weddly_invitation_collection_'+B.memberToken,collection)}catch{}
      if((u.searchParams.get('suite')==='1'||u.searchParams.get('_wsd_suite')==='1')&&host.parent!==host)host.parent.postMessage({type:'wsd-suite-open',view:'guests-design',url:u.href},host.location.origin);
      else host.location.assign(u.href);
    };
    group.appendChild(button);
  }
  row.appendChild(group);grid.before(row);
}
function sectionHelp(){const agenda=by('agendaFields'),loc=by('locationFields');if(agenda&&!by('wsdif-agenda-help')){const n=document.createElement('div');n.id='wsdif-agenda-help';n.className='wsdif-section-help';n.textContent=T('Añade tantos momentos como necesitéis — ceremonia, cóctel, cena, fiesta, after party o brunch— y ordénalos como ocurrirán ese día.','Add as many moments as you need — ceremony, cocktails, dinner, party, after party or brunch — and order them as they will happen.');agenda.before(n)}if(loc&&!by('wsdif-location-help')){const n=document.createElement('div');n.id='wsdif-location-help';n.className='wsdif-section-help';n.textContent=T('Si toda la boda ocurre en el mismo espacio, activa la opción de ubicación única. Si cambia de lugar, mantén cada ubicación por separado.','If the whole wedding takes place at one venue, use the single-location option. If the venue changes, keep each location separate.');loc.before(n)}}
function enhanceAgenda(){const wrap=by('agendaFields');if(!wrap)return;[...wrap.querySelectorAll('.repeat-card')].forEach((card,i)=>{if(card.querySelector('.wsdif-tools'))return;const tools=document.createElement('div');tools.className='wsdif-tools';tools.innerHTML=`<button type="button" class="wsdif-mini" data-move="up">↑ ${T('Subir','Move up')}</button><button type="button" class="wsdif-mini" data-move="down">↓ ${T('Bajar','Move down')}</button><button type="button" class="wsdif-mini danger" data-remove>${T('Eliminar','Remove')}</button>`;tools.querySelector('[data-move="up"]').disabled=i===0;tools.querySelector('[data-move="down"]').disabled=i===state.agenda.length-1;tools.querySelector('[data-remove]').disabled=state.agenda.length<=1;tools.onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;e.preventDefault();if(b.hasAttribute('data-remove')){state.agenda.splice(i,1)}else{const j=b.dataset.move==='up'?i-1:i+1;if(j<0||j>=state.agenda.length)return;[state.agenda[i],state.agenda[j]]=[state.agenda[j],state.agenda[i]]}buildAgendaFields();renderPreview();setTimeout(()=>{sectionHelp();enhanceAgenda();saveDraft()},0)};card.appendChild(tools)});if(!by('wsdif-add-moment')){const b=document.createElement('button');b.id='wsdif-add-moment';b.type='button';b.className='wsdif-add';b.textContent=T('+ Añadir otro momento','+ Add another moment');b.onclick=()=>{const last=state.agenda[state.agenda.length-1]||{};state.agenda.push({time:last.time||'',title:T('Nuevo momento','New moment'),place:'',icon:'note'});buildAgendaFields();renderPreview();setTimeout(()=>{sectionHelp();enhanceAgenda();saveDraft()},0)};wrap.insertAdjacentElement('afterend',b)}}
function sameLocationControl(){const wrap=by('locationFields');if(!wrap)return;let row=by('wsdif-same-location');if(!row){row=document.createElement('label');row.id='wsdif-same-location';row.className='wsdif-same';row.innerHTML=`<input type="checkbox"><span><b>${T('Toda la boda en el mismo lugar','Whole wedding at the same venue')}</b><div class="wsdif-note">${T('Ceremonia y celebración compartirán una única ubicación en la invitación. No repetiremos la misma dirección.','Ceremony and reception will share one location in the invitation. The address will not be repeated.')}</div></span>`;wrap.before(row);row.querySelector('input').onchange=e=>{if(e.target.checked){locationBackup=(state.locations||[]).map(x=>({...x}));const first=locationBackup[0]||{time:by('time')?.value||'',place:by('venue')?.value||'',address:[by('venue')?.value,by('city')?.value].filter(Boolean).join(', ')};state.locations=[{...first,title:T('Boda','Wedding'),place:first.place||by('venue')?.value||'',address:first.address||[by('venue')?.value,by('city')?.value].filter(Boolean).join(', ')}]}else if(locationBackup.length>=2){state.locations=locationBackup.map(x=>({...x}));locationBackup=[]}else if(state.locations.length<2){state.locations=[{...(state.locations[0]||{}),title:T('Ceremonia','Ceremony')},{title:T('Celebración','Reception'),time:by('time')?.value||'',place:by('venue')?.value||'',address:[by('venue')?.value,by('city')?.value].filter(Boolean).join(', ')}]}buildLocationFields();renderPreview();setTimeout(()=>{sectionHelp();sameLocationControl();saveDraft()},0)}}row.querySelector('input').checked=(state.locations||[]).length===1}
function selectDefaults(){const defaults={venue:['Finca Los Olivos'],city:['Murcia'],storyTitle:['Nos encantará celebrarlo contigo.'],storyText:['Hemos preparado este espacio para que tengas toda la información del día, sin perder el carácter de una invitación diseñada para nosotros.'],contactName:['Ana']};for(const [id,vals] of Object.entries(defaults)){const el=by(id);if(!el||el.dataset.wsdSelectDefault)return;el.dataset.wsdSelectDefault='1';el.addEventListener('focus',()=>{if(vals.includes(el.value)&&!el.dataset.wsdTouched){try{el.select()}catch{}}},{once:false});el.addEventListener('input',()=>el.dataset.wsdTouched='1',{once:true})}}
function wrapSave(){
  if(!window.__weddlySaveEssential||window.__weddlySaveEssential.__wsdDraftWrap)return false;
  const orig=window.__weddlySaveEssential;
  const f=async(...args)=>{
    clearTimeout(timer);const buttons=[...document.querySelectorAll('[data-wsd-collection]')];buttons.forEach(b=>b.disabled=true);
    try{const r=await orig(...args);clearDraft();status(T('Guardado · borrador local actualizado','Saved · local draft updated'),true);return r}
    finally{buttons.forEach(b=>b.disabled=false)}
  };
  f.__wsdDraftWrap=true;window.__weddlySaveEssential=f;return true;
}
function listen(){
  const changed=e=>{if(e.target?.closest?.('.panel')&&!e.target?.closest?.('[data-wsd-collection]'))saveDraft()};
  document.addEventListener('input',changed,true);document.addEventListener('change',changed,true);document.addEventListener('click',changed,true);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){clearTimeout(timer);persistDraft()}});
}
async function boot(){
  for(let i=0;i<50&&(!by('agendaFields')||!by('weddlyIntegrationBar'));i++)await new Promise(r=>setTimeout(r,80));
  if(!by('agendaFields')||!by('weddlyIntegrationBar'))return;
  addStyle();restore();collectionControls();
  if(tier==='essential'){sectionHelp();enhanceAgenda();sameLocationControl();selectDefaults()}
  listen();status(readDraft()?T('Borrador protegido automáticamente','Draft protected automatically'):T('Los cambios se guardan como borrador mientras editas','Changes are kept as a draft while you edit'),true);
  for(let i=0;i<40&&!wrapSave();i++)await new Promise(r=>setTimeout(r,100));
  if(tier==='essential'){
    const obs=new MutationObserver(()=>{sectionHelp();enhanceAgenda();sameLocationControl()});
    for(const id of ['agendaFields','locationFields'])if(by(id))obs.observe(by(id),{childList:true});
  }
}
boot();
})();