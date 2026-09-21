(()=>{
'use strict';
const G=window.__GuestsProd;if(!G)return;
const GKEY=G.KEY||'weddly_guests_qa_v67';
const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-rsvp';
const ACCESS='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-test-access';
const TOKEN='weddly_shared_wedding_token',MODE='weddly_owner_demo_mode';
let remote={forms:[],submissions:[]},loading=false,lastLoad=0;

const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').trim().toLowerCase();
function docs(){const out=[];try{let d=G.f?.contentDocument;for(let i=0;i<8&&d;i++){out.push(d);const f=d.querySelector('iframe');if(!f||!f.contentDocument)break;d=f.contentDocument}}catch{}return out}
const appDoc=()=>docs().find(d=>d.getElementById('listados')&&d.getElementById('hoy'))||null;
function state(){try{const S=JSON.parse(localStorage.getItem(GKEY)||'{}')||{};S.guests=S.guests||{};S.tables=S.tables||{};S.meta=S.meta||{};return S}catch{return{guests:{},tables:{},meta:{}}}}
function write(S){try{localStorage.setItem(GKEY,JSON.stringify(S));return true}catch{return false}}
const people=S=>Object.entries(S.guests||{}),tables=S=>Object.entries(S.tables||{}),active=g=>g&&g.rsvp!=='declined',confirmed=g=>g&&g.rsvp==='confirmed';
function hash(x){const s=typeof x==='string'?x:JSON.stringify(x);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
function formatDate(v){if(!v)return'—';try{return new Date(v).toLocaleString('es-ES',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch{return String(v)}}
function couple(S){const c=S.meta?.couple;return Array.isArray(c)&&c.length>=2&&c[0]&&c[1]?c[0]+' & '+c[1]:'Nuestra boda'}
function reportStore(S){S.meta=S.meta||{};S.meta.controlledReports=S.meta.controlledReports&&typeof S.meta.controlledReports==='object'?S.meta.controlledReports:{};return S.meta.controlledReports}
function currentHash(def){return hash([def.label,def.headers,def.rows])}
function controlFor(S,key){const store=reportStore(S);store[key]=store[key]&&typeof store[key]==='object'?store[key]:{history:[],sentV:null};store[key].history=Array.isArray(store[key].history)?store[key].history:[];return store[key]}
function findVersion(control,v){return(control.history||[]).find(x=>Number(x.version)===Number(v))||null}
function prepare(def){
  const S=state(),control=controlFor(S,def.key),h=currentHash(def),history=control.history,last=history[history.length-1];
  if(last&&last.hash===h)return last;
  const version=history.reduce((m,x)=>Math.max(m,Number(x.version)||0),0)+1;
  const rec={version,hash:h,label:def.label,summary:def.summary,headers:def.headers,rows:def.rows,preparedAt:new Date().toISOString(),sentAt:null,printCount:0,lastPrintedAt:null};
  history.push(rec);control.preparedV=version;control.preparedAt=rec.preparedAt;write(S);return rec
}
function touchPrint(key,version){
  const S=state(),c=controlFor(S,key),r=findVersion(c,version);if(!r)return;
  r.printCount=(Number(r.printCount)||0)+1;r.lastPrintedAt=new Date().toISOString();write(S)
}
function markSent(key,version){
  const S=state(),c=controlFor(S,key),r=findVersion(c,version);if(!r)return false;
  r.sentAt=new Date().toISOString();c.sentV=r.version;c.sentAt=r.sentAt;c.sentHash=r.hash;write(S);return true
}
function status(def){
  const S=state(),c=controlFor(S,def.key),history=c.history||[],last=history[history.length-1],h=currentHash(def),sent=c.sentV?findVersion(c,c.sentV):null;
  if(!last)return{html:'<b>Sin copia controlada</b> · la próxima salida será V1',pending:null};
  const prepared='Preparada V'+last.version;
  const sentTxt=sent?'Enviada V'+sent.version:'Sin versión enviada';
  const freshness=sent?(sent.hash===h?' · <b>La versión enviada coincide con los datos actuales</b>':' · <b>Hay cambios posteriores a la versión enviada</b>'):'';
  return{html:prepared+' · '+sentTxt+freshness,pending:last.sentAt?null:last.version}
}
function tableRows(S){const rows=[];tables(S).forEach(([,t])=>people(S).filter(([,g])=>active(g)&&g.table===t.name).forEach(([,g])=>rows.push([t.name,g.name||'',g.rsvp==='confirmed'?'Confirmado':'Pendiente'])));people(S).filter(([,g])=>active(g)&&!g.table).forEach(([,g])=>rows.push(['SIN MESA',g.name||'',g.rsvp==='confirmed'?'Confirmado':'Pendiente']));return rows}
function cateringRows(S){const rows=[];tables(S).forEach(([,t])=>{const ps=people(S).filter(([,g])=>confirmed(g)&&g.table===t.name&&g.mealRequired!==false).map(([,g])=>g),sum={};ps.forEach(g=>{const m=g.meal||'PENDIENTE';sum[m]=(sum[m]||0)+1;rows.push([t.name,g.name||'',m])});if(ps.length)rows.push([t.name+' · RESUMEN',ps.length+' personas',Object.entries(sum).map(([k,v])=>v+' '+k).join(' · ')])});const total={};people(S).filter(([,g])=>confirmed(g)&&g.mealRequired!==false).forEach(([,g])=>{const m=g.meal||'PENDIENTE';total[m]=(total[m]||0)+1});rows.push(['TOTAL','',Object.entries(total).map(([k,v])=>v+' '+k).join(' · ')]);return rows}
function transportRows(S){return people(S).filter(([,g])=>active(g)&&g.transport).map(([,g])=>[g.name||'',g.phone||'',g.table||''])}
function accommodationRows(S){return people(S).filter(([,g])=>active(g)&&g.accommodation===true).map(([,g])=>[g.name||'',g.phone||'',g.group||'',g.unitId||'',g.table||''])}
function baseDefs(S){
  const assigned=people(S).filter(([,g])=>active(g)&&g.table).length;
  const meals=people(S).filter(([,g])=>confirmed(g)&&g.mealRequired!==false).length;
  const transport=people(S).filter(([,g])=>active(g)&&g.transport).length;
  const accommodation=people(S).filter(([,g])=>active(g)&&g.accommodation===true).length;
  return{
    tables:{key:'tables',label:'Mesas · Boda principal',slug:'Mesas_Boda_principal',headers:['Mesa','Nombre','RSVP'],rows:tableRows(S),summary:assigned+' invitados con mesa'},
    catering:{key:'catering',label:'Catering · Boda principal',slug:'Catering_Boda_principal',headers:['Mesa','Nombre','Menú'],rows:cateringRows(S),summary:meals+' menús confirmados'},
    transport:{key:'transport',label:'Transporte · Boda principal',slug:'Transporte_Boda_principal',headers:['Nombre','Teléfono','Mesa'],rows:transportRows(S),summary:transport+' personas usan transporte'},
    accommodation:{key:'accommodation',label:'Alojamiento · Boda principal',slug:'Alojamiento_Boda_principal',headers:['Nombre','Teléfono','Grupo','Subgrupo','Mesa'],rows:accommodationRows(S),summary:accommodation+' personas se quedan a dormir o necesitan alojamiento'}
  }
}
function latestSubmissionFor(id,name){
  return(remote.submissions||[]).filter(x=>(x.guest_key&&String(x.guest_key)===String(id))||(!x.guest_key&&norm(x.name)===norm(name))).sort((a,b)=>new Date(b.received_at||0)-new Date(a.received_at||0))[0]||null
}
function answerFor(id,g,qid){
  const local=g?.rsvpCustomAnswers;
  if(local&&typeof local==='object'&&Object.prototype.hasOwnProperty.call(local,qid))return local[qid];
  const sub=latestSubmissionFor(id,g?.name||''),raw=sub?.payload?.custom_answers;
  return raw&&typeof raw==='object'&&Object.prototype.hasOwnProperty.call(raw,qid)?raw[qid]:undefined
}
function currentQuestions(){return Array.isArray(remote.forms?.[0]?.config?.customQuestions)?remote.forms[0].config.customQuestions:[]}
function customDef(q,S){
  const eligible=people(S).filter(([,g])=>confirmed(g)),rows=[],counts=new Map();let answered=0;
  for(const [id,g] of eligible){const v=answerFor(id,g,String(q.id));if(v===undefined||v===null||v==='')continue;answered++;const txt=typeof v==='boolean'?(v?'Sí':'No'):String(v);counts.set(txt,(counts.get(txt)||0)+1);rows.push([g.name||'',txt,g.group||'',g.unitId||'',g.table||''])}
  const missing=Math.max(0,eligible.length-answered);
  let summary='';
  if(q.type==='yesno')summary=(counts.get('Sí')||0)+' Sí · '+(counts.get('No')||0)+' No · '+missing+' sin respuesta';
  else if(q.type==='select')summary=[...counts.entries()].map(([k,v])=>v+' '+k).join(' · ')+(missing?' · '+missing+' sin respuesta':'');
  else summary=answered+' respuestas · '+missing+' sin respuesta';
  return{key:'custom:'+q.id,label:'Pregunta RSVP · '+q.label,slug:'RSVP_'+String(q.label||'Pregunta').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,60),headers:['Nombre','Respuesta','Grupo','Subgrupo','Mesa'],rows,summary}
}
function printReport(def){
  const rec=prepare(def);touchPrint(def.key,rec.version);
  const S=state(),c=controlFor(S,def.key),saved=findVersion(c,rec.version)||rec,w=window.open('','_blank');if(!w)return;
  const sent=saved.sentAt?'Enviada '+formatDate(saved.sentAt):'Preparada · todavía no marcada como enviada';
  const printed='Impresión '+formatDate(new Date().toISOString());
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safe(def.slug+'_V'+saved.version)}</title><style>body{font-family:Arial,sans-serif;color:#222;margin:28px}h1{font-family:Georgia,serif;font-weight:500;margin:6px 0}.brand{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#666}.meta{color:#666;margin:4px 0 8px}.control{margin:14px 0 22px;padding:10px 12px;border:1px solid #bbb;background:#f7f5ef;font-size:12px}.control b{font-size:14px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border-bottom:1px solid #ddd;padding:8px 7px;text-align:left;vertical-align:top}th{background:#f5f2ed;text-transform:uppercase;font-size:10px;letter-spacing:.06em}@media print{body{margin:12mm}}</style></head><body><div class="brand">Weddly Smart Design · ONE</div><h1>${safe(saved.label)}</h1><div class="meta">${safe(couple(S))} · ${safe(saved.summary||'')}</div><div class="control"><b>COPIA CONTROLADA · V${saved.version}</b><br>Preparada ${safe(formatDate(saved.preparedAt))} · ${safe(sent)}<br>${safe(printed)}</div><table><thead><tr>${saved.headers.map(h=>'<th>'+safe(h)+'</th>').join('')}</tr></thead><tbody>${saved.rows.map(r=>'<tr>'+r.map(x=>'<td>'+safe(x)+'</td>').join('')+'</tr>').join('')}</tbody></table><script>setTimeout(()=>window.print(),250)<\/script></body></html>`);
  w.document.close();setTimeout(patch,100)
}
function escCsv(v){return '"'+String(v??'').replaceAll('"','""')+'"'}
function csvReport(def){
  const rec=prepare(def),csv='\ufeffsep=;\r\n'+[rec.headers,...rec.rows].map(r=>r.map(escCsv).join(';')).join('\r\n'),blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=def.slug+'_V'+rec.version+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);setTimeout(patch,100)
}
function addStyle(d){
  if(d.getElementById('wsdControlledReportsStyle'))return;
  const s=d.createElement('style');s.id='wsdControlledReportsStyle';s.textContent=`
  .wsd-copy-control{margin-top:12px;padding-top:11px;border-top:1px solid var(--line);font-size:11.5px;color:var(--muted);line-height:1.45}
  .wsd-copy-control b{color:var(--dark)}.wsd-copy-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.wsd-copy-actions button{border:1px solid var(--line);background:#fff;color:var(--ink);border-radius:10px;padding:8px 10px;font-size:11.5px;font-weight:750}
  .wsd-report-heading{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dark);font-weight:850;margin:25px 2px 8px}
  .wsd-history{position:fixed;z-index:9999;inset:0;background:#0006;display:flex;align-items:flex-end}.wsd-history-card{width:100%;max-width:700px;max-height:88vh;overflow:auto;margin:auto;background:#fff;border-radius:24px 24px 0 0;padding:20px 18px calc(24px + env(safe-area-inset-bottom))}
  .wsd-history-row{padding:12px 0;border-top:1px solid var(--line)}.wsd-history-row:first-of-type{border-top:0}.wsd-history-actions{display:flex;gap:7px;margin-top:8px}.wsd-history-actions button{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 10px;font-weight:750}
  `;d.head.appendChild(s)
}
function openHistory(d,def){
  d.getElementById('wsdReportHistory')?.remove();
  const S=state(),c=controlFor(S,def.key),history=[...(c.history||[])].reverse(),ov=d.createElement('div');ov.id='wsdReportHistory';ov.className='wsd-history';
  ov.innerHTML=`<div class="wsd-history-card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><div><div class="sectiontag">COPIAS CONTROLADAS</div><h2 style="margin:5px 0">${safe(def.label)}</h2></div><button class="btn soft" id="wsdHistoryClose">Cerrar</button></div>${history.length?history.map(r=>`<div class="wsd-history-row"><b>V${r.version}</b><div class="small">Preparada ${safe(formatDate(r.preparedAt))} · ${r.sentAt?'Enviada '+safe(formatDate(r.sentAt)):'No marcada como enviada'}${r.printCount?' · '+r.printCount+' impresión'+(r.printCount===1?'':'es'):''}</div><div class="wsd-history-actions"><button data-reprint="${r.version}">Reimprimir V${r.version}</button>${r.sentAt?'':`<button data-sent="${r.version}">Marcar V${r.version} como enviada</button>`}</div></div>`).join(''):'<p class="small">Todavía no hay ninguna copia preparada.</p>'}</div>`;
  d.body.appendChild(ov);ov.onclick=e=>{if(e.target===ov)ov.remove()};ov.querySelector('#wsdHistoryClose').onclick=()=>ov.remove();
  ov.querySelectorAll('[data-reprint]').forEach(b=>b.onclick=()=>{const S2=state(),cc=controlFor(S2,def.key),r=findVersion(cc,Number(b.dataset.reprint));if(!r)return;ov.remove();printReport({key:def.key,label:r.label,slug:def.slug,headers:r.headers,rows:r.rows,summary:r.summary})});
  ov.querySelectorAll('[data-sent]').forEach(b=>b.onclick=()=>{const v=Number(b.dataset.sent);if(!confirm('¿Confirmar que V'+v+' se ha enviado o entregado?'))return;markSent(def.key,v);ov.remove();patch()})
}
function decorateControl(d,card,def){
  if(!card)return;
  let box=card.querySelector('[data-wsd-copy-control]');if(!box){box=d.createElement('div');box.dataset.wsdCopyControl='1';box.className='wsd-copy-control';card.appendChild(box)}
  const st=status(def);box.innerHTML=`<div>${st.html}</div><div class="wsd-copy-actions"><button type="button" data-history>Historial</button>${st.pending?`<button type="button" data-mark-sent>Marcar V${st.pending} como enviada</button>`:''}</div>`;
  box.querySelector('[data-history]').onclick=()=>openHistory(d,def);
  box.querySelector('[data-mark-sent]')?.addEventListener('click',()=>{if(!confirm('¿Confirmar que V'+st.pending+' se ha enviado o entregado?'))return;markSent(def.key,st.pending);patch()})
}
function wireStandard(d){
  const S=state(),defs=baseDefs(S),map=[
    ['tables','#wsdPrintTables','#wsdCsvTables'],
    ['catering','#wsdPrintCatering','#wsdCsvCatering'],
    ['transport','#wsdPrintTransport','#wsdCsvTransport']
  ];
  for(const [k,pSel,cSel] of map){const p=d.querySelector(pSel),c=d.querySelector(cSel),card=p?.closest('.card')||c?.closest('.card');if(!card)continue;const def=defs[k];if(p)p.onclick=()=>printReport(baseDefs(state())[k]);if(c)c.onclick=()=>csvReport(baseDefs(state())[k]);decorateControl(d,card,def)}
  const aCard=d.getElementById('wsdAccommodationList');
  if(aCard){
    let actions=aCard.querySelector('[data-wsd-accommodation-actions]');
    if(!actions){const old=aCard.querySelector('button');actions=d.createElement('div');actions.dataset.wsdAccommodationActions='1';actions.className='actions';actions.innerHTML='<button class="btn" type="button" id="wsdPrintAccommodation">Imprimir / PDF</button><button class="btn soft" type="button" id="wsdCsvAccommodation">Excel / CSV</button>';old?.replaceWith(actions)}
    actions.querySelector('#wsdPrintAccommodation').onclick=()=>printReport(baseDefs(state()).accommodation);
    actions.querySelector('#wsdCsvAccommodation').onclick=()=>csvReport(baseDefs(state()).accommodation);
    decorateControl(d,aCard,defs.accommodation)
  }
}
function renderCustom(d){
  const list=d.getElementById('listados');if(!list)return;
  const qs=currentQuestions().filter(q=>q?.id&&q?.label),valid=new Set(qs.map(q=>'wsdCustomReport_'+String(q.id).replace(/[^a-zA-Z0-9_-]/g,'')));
  list.querySelectorAll('[data-wsd-custom-report]').forEach(el=>{if(!valid.has(el.id))el.remove()});
  let head=d.getElementById('wsdCustomReportsHeading');
  if(qs.length&&!head){head=d.createElement('div');head.id='wsdCustomReportsHeading';head.className='wsd-report-heading';head.textContent='Preguntas personalizadas del RSVP';list.appendChild(head)}
  if(!qs.length){head?.remove();return}
  const S=state();
  for(const q of qs){
    const def=customDef(q,S),id='wsdCustomReport_'+String(q.id).replace(/[^a-zA-Z0-9_-]/g,''),sig=hash([def.summary,def.rows]);
    let card=d.getElementById(id);if(!card){card=d.createElement('div');card.id=id;card.dataset.wsdCustomReport='1';card.className='card';list.appendChild(card)}
    if(card.dataset.sig!==sig){card.dataset.sig=sig;card.innerHTML=`<b>${safe(q.label)}</b><p class="small">${safe(def.summary)}</p><div class="actions"><button class="btn" type="button" data-custom-print>Imprimir / PDF</button><button class="btn soft" type="button" data-custom-csv>Excel / CSV</button></div>`}
    card.querySelector('[data-custom-print]').onclick=()=>printReport(customDef(q,state()));
    card.querySelector('[data-custom-csv]').onclick=()=>csvReport(customDef(q,state()));
    decorateControl(d,card,def)
  }
}
async function memberToken(){
  const raw=localStorage.getItem(TOKEN)||'',m=(localStorage.getItem(MODE)||'').toLowerCase();if(!m||!['es','en'].includes(m)||raw.length<40)return raw;
  const cached=localStorage.getItem('weddly_owner_demo_token_'+m)||'';if(cached.length>=40)return cached;
  try{const r=await fetch(ACCESS,{method:'POST',headers:{'Content-Type':'application/json','x-weddly-member':raw},body:JSON.stringify({action:'owner_demo_token',lang:m}),cache:'no-store'}),x=await r.json().catch(()=>({}));if(r.ok&&x?.memberToken){localStorage.setItem('weddly_owner_demo_token_'+m,x.memberToken);return x.memberToken}}catch{}return raw
}
async function refresh(force=false){
  if(loading||(!force&&Date.now()-lastLoad<12000))return;loading=true;
  try{const t=await memberToken();if(t.length<40)return;const r=await fetch(API+'?manage=1',{headers:{'x-weddly-token':t},cache:'no-store'}),x=await r.json().catch(()=>({}));if(r.ok&&x?.ok){remote={forms:Array.isArray(x.forms)?x.forms:[],submissions:Array.isArray(x.submissions)?x.submissions:[]};lastLoad=Date.now()}}catch{}finally{loading=false;patch()}
}
function patch(){try{const d=appDoc();if(!d)return;addStyle(d);wireStandard(d);renderCustom(d)}catch{}}
G.f?.addEventListener('load',()=>{setTimeout(()=>{patch();refresh(true)},350)});
addEventListener('guests-prod-open',()=>setTimeout(()=>{patch();refresh(true)},250));
addEventListener('focus',()=>refresh(true));
addEventListener('storage',e=>{if(e.key===GKEY)setTimeout(patch,80)});
setInterval(()=>{patch();refresh(false)},900);
setTimeout(()=>{patch();refresh(true)},700);
})();