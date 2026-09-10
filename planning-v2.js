(()=>{
'use strict';
const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-planning-state';
const TOKEN='weddly_shared_wedding_token',PAY='weddly_pro_v7',GUEST='weddly_guests_qa_v67',THEME1='weddly_personal_theme_v51',THEME2='weddly_personal_theme_v20';
const $=id=>document.getElementById(id),MS=86400000;
let state={schema:2,tasks:{},events:{},dismissedSuggestions:{},updatedAt:new Date(0).toISOString()},version=0,dirty=false,syncTimer=0,syncing=false,editingEvent='',editingTask='',agendaFilter='upcoming',taskFilter='all',activeView='now';

const CATS={
 foundation:{es:'Base',en:'Foundation'},vendors:{es:'Proveedores',en:'Vendors'},guests:{es:'Invitados',en:'Guests'},
 style:{es:'Diseño y look',en:'Style & attire'},ceremony:{es:'Ceremonia',en:'Ceremony'},logistics:{es:'Logística',en:'Logistics'},final:{es:'Recta final',en:'Final stretch'}
};
const D=(id,days,cat,es,en,priority=2,signal='')=>({id,days,cat,es,en,priority,signal});
const DEFAULTS=[
D('vision',480,'foundation','Definir qué 3 cosas son realmente prioritarias para vuestra boda','Define the 3 things that matter most for your wedding',3),
D('budget',450,'foundation','Fijar un presupuesto operativo realista','Set a realistic working budget',3,'payments'),
D('guest_draft',430,'guests','Crear una primera lista realista de invitados','Build a realistic first guest list',3,'guests'),
D('venue',400,'vendors','Cerrar el lugar de celebración','Book the wedding venue',3),
D('ceremony_place',390,'ceremony','Confirmar lugar y formato de la ceremonia','Confirm ceremony location and format',3),
D('photo',365,'vendors','Contratar fotografía y/o vídeo','Book photography and/or video',3,'payments'),
D('catering',350,'vendors','Cerrar catering o restauración si no está incluido','Book catering if it is not included',3,'payments'),
D('music',335,'vendors','Cerrar DJ, banda o música principal','Book DJ, band or main music',2,'payments'),
D('save_date',320,'guests','Decidir si enviar Save the Date','Decide whether to send Save the Dates',1),
D('attire_start',300,'style','Empezar traje/vestido y tiempos de entrega','Start outfit shopping and check lead times',2),
D('flowers',285,'vendors','Definir flores y decoración principal','Define flowers and main décor',2,'payments'),
D('beauty',260,'style','Reservar peluquería y maquillaje si aplica','Book hair and makeup if needed',1,'payments'),
D('accommodation',240,'logistics','Resolver alojamiento para vosotros e invitados si hace falta','Plan accommodation for you and guests if needed',2),
D('transport',225,'logistics','Decidir transporte de invitados y pareja','Decide transport for guests and couple',2),
D('rings',210,'style','Elegir alianzas y comprobar plazos','Choose wedding rings and check lead times',2),
D('legal',200,'ceremony','Revisar requisitos legales y documentación necesaria','Check legal requirements and required documents',3),
D('guest_refine',190,'guests','Revisar lista de invitados antes de enviar invitaciones','Review guest list before invitations go out',3,'guests'),
D('invite_design',175,'guests','Cerrar diseño de invitación y RSVP','Finalise invitation design and RSVP',2,'guests'),
D('menu',165,'vendors','Definir menú, alternativas y necesidades especiales','Define menu, alternatives and special requirements',2,'payments'),
D('cake',155,'vendors','Decidir tarta/postre y confirmar proveedor','Choose cake/dessert and confirm supplier',1,'payments'),
D('ceremony_outline',145,'ceremony','Crear la estructura de la ceremonia','Create the ceremony outline',2),
D('invitations_send',120,'guests','Enviar invitaciones y abrir RSVP','Send invitations and open RSVP',3,'guests'),
D('attire_fitting',105,'style','Programar pruebas y arreglos de vestuario','Schedule fittings and alterations',2),
D('tasting',95,'vendors','Hacer degustación y cerrar decisiones de menú','Attend tasting and finalise menu choices',2,'payments'),
D('day_draft',90,'logistics','Crear primer cronograma realista del día','Create the first realistic wedding-day timeline',3),
D('stationery',80,'style','Definir papelería del día: minutas, seating, carteles','Define day-of stationery: menus, seating, signs',1),
D('rsvp_review',65,'guests','Revisar respuestas pendientes y contactar a quien falte','Review missing RSVPs and follow up',3,'guests'),
D('guest_final',50,'guests','Cerrar número de invitados con margen para cambios','Lock guest count with a small change buffer',3,'guests'),
D('seating_start',45,'guests','Preparar distribución de mesas y asientos','Build table and seating layout',3,'seating'),
D('supplier_balance',40,'vendors','Revisar pagos pendientes y vencimientos de proveedores','Review supplier balances and due dates',3,'payments'),
D('ceremony_detail',35,'ceremony','Cerrar lecturas, música, votos y orden de ceremonia','Finalise readings, music, vows and ceremony order',2),
D('dietary_final',30,'guests','Entregar al catering alergias, menús especiales y recuentos','Send allergies, special meals and final counts to catering',3,'guests'),
D('seating_final',25,'guests','Cerrar seating y generar listados definitivos','Finalise seating and generate final lists',3,'seating'),
D('vendor_confirm',21,'vendors','Confirmar por escrito horarios y servicios con cada proveedor','Confirm timings and services with every supplier in writing',3,'payments'),
D('day_final',18,'logistics','Cerrar cronograma del día con teléfonos y responsables','Finalise day timeline with contacts and owners',3),
D('weather_plan',14,'logistics','Revisar plan B de clima y decisiones que lo activan','Review weather backup plan and activation decisions',2),
D('documents_pack',12,'ceremony','Preparar documentos, contratos y justificantes que deban estar accesibles','Prepare documents, contracts and receipts you may need',2,'payments'),
D('emergency',10,'logistics','Preparar kit de emergencia y objetos que viajan con vosotros','Prepare emergency kit and items travelling with you',1),
D('final_payments',7,'vendors','Comprobar que pagos, justificantes y contratos están controlados','Check payments, receipts and contracts are under control',3,'payments'),
D('supplier_pack',5,'logistics','Compartir cronograma final y contactos con quien corresponda','Share final timeline and contacts with the right people',3),
D('rings_docs',3,'ceremony','Dejar preparados alianzas, documentación y elementos de ceremonia','Set aside rings, documents and ceremony items',3),
D('last_check',1,'final','Hacer una última revisión: nada nuevo, solo confirmar','Do one last check: add nothing new, only confirm',3),
D('wedding_day',0,'final','Hoy: delegar, comer, beber agua y disfrutar','Today: delegate, eat, drink water and enjoy it',3)
];

const I18N={
es:{
eyebrow:'Incluido con App completa',heroEyebrow:'Planning + Agenda',hero:'Lo importante, cuando toca.',heroSub:'Tareas, citas y vencimientos ordenados alrededor de vuestra boda.',
days:'días',day:'día',until:'hasta la boda',todayWedding:'Hoy es la boda',pastWedding:'La boda ya pasó',noDate:'Añade la fecha de la boda en Ajustes',
now:'Ahora',agenda:'Agenda',timeline:'Timeline',progress:'Progreso',synced:'Sincronizado',saving:'Guardando…',offline:'Sin conexión',
access:'Planning está incluido con la App completa. Este acceso no lo incluye.',
overdue:'Vencidas',next30:'Próx. 30 días',done:'Completado',reminders:'Recordatorios',remindersSub:'Lo que merece vuestra atención hoy',
priority:'Prioridad ahora',prioritySub:'Lo que más conviene resolver primero',nextAgenda:'Próximas citas',nextAgendaSub:'Agenda de los próximos días',
addEvent:'+ Cita',today:'Hoy',week:'7 días',upcoming:'Próximas',past:'Pasadas',all:'Todas',
suggest:'Sugerido por vuestra boda',suggestSub:'Fechas que ya existen en Payments o Planning y podéis llevar a la agenda con un toque.',
agendaTitle:'Vuestra agenda',agendaSub:'Citas, recordatorios y deadlines en un solo lugar.',
noAgenda:'No hay citas aquí todavía.',noPriority:'Nada urgente. Lo siguiente está bajo control.',noSuggest:'No hay nuevas sugerencias ahora.',
timelineTitle:'Checklist inteligente',timelineSub:'Se recoloca automáticamente según la fecha de boda.',addTask:'+ Tarea',
areas:'Progreso por áreas',areasSub:'Las tareas “No aplica” no cuentan.',progressTitle:'Progreso real',doneOf:'{a} de {b} completadas',
complete:'Completar',reopen:'Reabrir',edit:'Editar',calendar:'Calendario',dismiss:'Ocultar',add:'Añadir',
appointment:'Cita',reminder:'Recordatorio',deadline:'Deadline',manual:'Manual',
newEvent:'Nueva cita / recordatorio',editEvent:'Editar agenda',title:'Título',date:'Fecha',time:'Hora',type:'Tipo',reminderBefore:'Aviso',owner:'Responsable',
linkedTask:'Vincular a tarea',linkedProvider:'Vincular a proveedor',notes:'Notas',save:'Guardar',delete:'Eliminar',
none:'Ninguno',twoHours:'2 horas antes',oneDay:'1 día antes',threeDays:'3 días antes',sevenDays:'7 días antes',
both:'Ambos',unassigned:'Sin asignar',newTask:'Nueva tarea',editTask:'Editar tarea',area:'Área',notApplicable:'No aplica',toAgenda:'Crear cita',
detected:'Detectado en la app',paymentDue:'Pago previsto',taskDue:'Tarea con fecha',guestMilestone:'Hito de invitados',
dueToday:'Hoy',dueTomorrow:'Mañana',inDays:'En {n} días',daysLate:'Hace {n} días',at:'a las',noTime:'Sin hora',
nativeCalendar:'Añadir al calendario',calendarHelp:'El calendario del móvil puede encargarse del aviso incluso cuando la app esté cerrada.',
eventDone:'Realizada',eventPending:'Pendiente',sourcePayments:'Payments',sourcePlanning:'Planning',sourceGuests:'Guests',
filterAll:'Todas las áreas',statusOpen:'Pendientes',statusDone:'Completadas',statusNA:'No aplica'
},
en:{
eyebrow:'Included with Full app',heroEyebrow:'Planning + Agenda',hero:'What matters, when it matters.',heroSub:'Tasks, appointments and deadlines organised around your wedding.',
days:'days',day:'day',until:'until the wedding',todayWedding:'Wedding day is today',pastWedding:'The wedding date has passed',noDate:'Add your wedding date in Settings',
now:'Now',agenda:'Agenda',timeline:'Timeline',progress:'Progress',synced:'Synced',saving:'Saving…',offline:'Offline',
access:'Planning is included with the Full app. This access does not include it.',
overdue:'Overdue',next30:'Next 30 days',done:'Completed',reminders:'Reminders',remindersSub:'What deserves your attention today',
priority:'Priority now',prioritySub:'The best things to resolve first',nextAgenda:'Next appointments',nextAgendaSub:'Your agenda for the next few days',
addEvent:'+ Event',today:'Today',week:'7 days',upcoming:'Upcoming',past:'Past',all:'All',
suggest:'Suggested from your wedding',suggestSub:'Dates already present in Payments or Planning that you can add to your agenda in one tap.',
agendaTitle:'Your agenda',agendaSub:'Appointments, reminders and deadlines in one place.',
noAgenda:'No events here yet.',noPriority:'Nothing urgent. What comes next is under control.',noSuggest:'No new suggestions right now.',
timelineTitle:'Smart checklist',timelineSub:'Automatically reorganised around your wedding date.',addTask:'+ Task',
areas:'Progress by area',areasSub:'Tasks marked “Not applicable” are excluded.',progressTitle:'Real progress',doneOf:'{a} of {b} completed',
complete:'Complete',reopen:'Reopen',edit:'Edit',calendar:'Calendar',dismiss:'Hide',add:'Add',
appointment:'Appointment',reminder:'Reminder',deadline:'Deadline',manual:'Manual',
newEvent:'New appointment / reminder',editEvent:'Edit agenda',title:'Title',date:'Date',time:'Time',type:'Type',reminderBefore:'Alert',owner:'Owner',
linkedTask:'Link to task',linkedProvider:'Link to vendor',notes:'Notes',save:'Save',delete:'Delete',
none:'None',twoHours:'2 hours before',oneDay:'1 day before',threeDays:'3 days before',sevenDays:'7 days before',
both:'Both',unassigned:'Unassigned',newTask:'New task',editTask:'Edit task',area:'Area',notApplicable:'Not applicable',toAgenda:'Create event',
detected:'Detected in the app',paymentDue:'Scheduled payment',taskDue:'Dated task',guestMilestone:'Guest milestone',
dueToday:'Today',dueTomorrow:'Tomorrow',inDays:'In {n} days',daysLate:'{n} days ago',at:'at',noTime:'No time',
nativeCalendar:'Add to calendar',calendarHelp:'Your phone calendar can handle the alert even when the app is closed.',
eventDone:'Done',eventPending:'Pending',sourcePayments:'Payments',sourcePlanning:'Planning',sourceGuests:'Guests',
filterAll:'All areas',statusOpen:'Open',statusDone:'Completed',statusNA:'Not applicable'
}};

function mode(){try{const q=new URLSearchParams(location.search).get('ownerDemo');if(q==='es'||q==='en')return q;const m=localStorage.getItem('weddly_owner_demo_mode');return m==='es'||m==='en'?m:''}catch{return''}}
function localKey(){return 'weddly_planning_v2'+(mode()?'_owner_demo_'+mode():'')}
function readPay(){try{const k=mode()?PAY+'_owner_demo_'+mode():PAY;return JSON.parse(localStorage.getItem(k)||'null')||{}}catch{return{}}}
function readGuests(){try{const k=GUEST+(mode()?'_snapshot_demo_'+mode():'');return JSON.parse(localStorage.getItem(k)||localStorage.getItem(GUEST)||'null')||{}}catch{return{}}}
function lang(){const p=readPay(),v=p?.settings?.lang;if(v==='es'||v==='en')return v;if(mode())return mode();try{const x=localStorage.getItem('weddly_access_lang');if(x==='es'||x==='en')return x}catch{}return (navigator.language||'').toLowerCase().startsWith('es')?'es':'en'}
function t(k,vars={}){let s=(I18N[lang()]||I18N.es)[k]||k;Object.entries(vars).forEach(([a,b])=>s=s.replace('{'+a+'}',String(b)));return s}
function theme(){try{const v=localStorage.getItem(THEME1)||localStorage.getItem(THEME2)||'nordic';return ['nordic','blush','sand','slate','editorial'].includes(v)?v:'nordic'}catch{return'nordic'}}
function identity(){const p=readPay()?.settings||{};let date=/^\d{4}-\d{2}-\d{2}$/.test(String(p.weddingDate||''))?String(p.weddingDate):'';if(!date){const gd=String(readGuests()?.meta?.weddingDate||'');if(/^\d{4}-\d{2}-\d{2}$/.test(gd))date=gd}return{p1:String(p.partner1||'').trim(),p2:String(p.partner2||'').trim(),date}}
function parseDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s||'')))return null;const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d,12)}
function isoDay(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function today(){const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate(),12)}
function diffDays(a,b){return Math.round((a-b)/MS)}
function fmtDate(s,short=false){const d=parseDate(s);if(!d)return'';return new Intl.DateTimeFormat(lang()==='es'?'es-ES':'en-GB',short?{day:'numeric',month:'short'}:{weekday:'short',day:'numeric',month:'short'}).format(d)}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function nowIso(){return new Date().toISOString()}
function normalizeState(x){
 const out=x&&typeof x==='object'&&!Array.isArray(x)?x:{};
 out.schema=2;if(!out.tasks||typeof out.tasks!=='object')out.tasks={};if(!out.events||typeof out.events!=='object')out.events={};if(!out.dismissedSuggestions||typeof out.dismissedSuggestions!=='object')out.dismissedSuggestions={};if(!out.updatedAt)out.updatedAt=new Date(0).toISOString();return out
}
function itemTs(x){return Date.parse(x?.updatedAt||0)||0}
function mergeMap(a={},b={}){const out={};for(const k of new Set([...Object.keys(a),...Object.keys(b)])){const A=a[k],B=b[k];out[k]=!A?B:!B?A:(itemTs(B)>=itemTs(A)?B:A)}return out}
function mergeStates(a,b){a=normalizeState(a);b=normalizeState(b);return normalizeState({schema:2,tasks:mergeMap(a.tasks,b.tasks),events:mergeMap(a.events,b.events),dismissedSuggestions:mergeMap(a.dismissedSuggestions,b.dismissedSuggestions),updatedAt:new Date(Math.max(Date.parse(a.updatedAt||0)||0,Date.parse(b.updatedAt||0)||0)).toISOString()})}
function readLocal(){try{let raw=localStorage.getItem(localKey());if(!raw){const legacy='weddly_planning_v1'+(mode()?'_owner_demo_'+mode():'');raw=localStorage.getItem(legacy)}const x=JSON.parse(raw||'null');if(x?.state){state=normalizeState(x.state);version=Number(x.version||0);dirty=!!x.dirty}else if(x){state=normalizeState(x)}}catch{}}
function writeLocal(markDirty=true){state.updatedAt=nowIso();if(markDirty)dirty=true;try{localStorage.setItem(localKey(),JSON.stringify({state,version,dirty}))}catch{}if(markDirty)queueSync()}
function headers(){const h={'Content-Type':'application/json','x-weddly-token':localStorage.getItem(TOKEN)||''};if(mode())h['x-weddly-demo']=mode();return h}
function setSync(k){$('sync').textContent=t(k)}
async function loadRemote(){
 setSync('saving');
 try{
   const r=await fetch(API,{headers:headers(),cache:'no-store'}),x=await r.json().catch(()=>({}));
   if(r.status===401||r.status===403){$('accessText').textContent=t('access');$('access').classList.add('on');return false}
   if(!r.ok||!x.ok)throw 0;
   const remote=normalizeState(x.state||{}),rv=Number(x.version||0);
   if(dirty){state=mergeStates(remote,state);version=rv;writeLocal(true)}
   else{state=remote;version=rv;writeLocal(false)}
   return true
 }catch{setSync('offline');return true}
}
function queueSync(){clearTimeout(syncTimer);syncTimer=setTimeout(saveRemote,350)}
async function saveRemote(){
 if(syncing||!dirty)return;syncing=true;setSync('saving');
 try{
   const r=await fetch(API,{method:'PUT',headers:headers(),body:JSON.stringify({state,version}),cache:'no-store'}),x=await r.json().catch(()=>({}));
   if(r.ok&&x.ok){version=Number(x.version||version+1);dirty=false;try{localStorage.setItem(localKey(),JSON.stringify({state,version,dirty:false}))}catch{}setSync('synced')}
   else if(r.status===409&&x.server){state=mergeStates(normalizeState(x.server.state||{}),state);version=Number(x.server.version||0);dirty=true;syncing=false;return saveRemote()}
   else if(r.status===401||r.status===403){$('accessText').textContent=t('access');$('access').classList.add('on')}
   else throw 0
 }catch{setSync('offline')}finally{syncing=false}
}
function defaultDue(def,wedding){if(!wedding)return'';const d=new Date(wedding);d.setDate(d.getDate()-def.days);return isoDay(d)}
function signals(){
 const g=readGuests(),p=readPay();const gc=Object.keys(g?.guests||{}).length;
 let tables=0;if(Array.isArray(g?.tables))tables=g.tables.length;else if(g?.tables&&typeof g.tables==='object')tables=Object.keys(g.tables).length;
 const providers=Array.isArray(p?.providers)?p.providers.length:0;return{guests:gc>0,payments:providers>0,seating:tables>0}
}
function allTasks(){
 const wed=parseDate(identity().date),sg=signals();
 const defaults=DEFAULTS.map(d=>{const o=state.tasks[d.id]||{};return{...d,title:d[lang()],custom:false,status:o.status||'open',owner:o.owner||'both',notes:o.notes||'',due:o.due||defaultDue(d,wed),priority:Number(o.priority||d.priority||2),updatedAt:o.updatedAt||'',signalOn:!!(d.signal&&sg[d.signal])}});
 const custom=Object.entries(state.tasks).filter(([_,v])=>v?.custom&&!v?.deleted).map(([id,v])=>({id,cat:v.cat||'foundation',title:v.title||'',custom:true,status:v.status||'open',owner:v.owner||'both',notes:v.notes||'',due:v.due||'',priority:Number(v.priority||2),updatedAt:v.updatedAt||'',signalOn:false}));
 return [...defaults,...custom]
}
function saveTaskPatch(id,patch){const old=state.tasks[id]||{};state.tasks[id]={...old,...patch,updatedAt:nowIso()};writeLocal();render()}
function activeEvents(){return Object.entries(state.events).filter(([_,v])=>v&&!v.deleted).map(([id,v])=>({id,...v})).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||'')))}
function providers(){const p=readPay();return Array.isArray(p?.providers)?p.providers:[]}
function ownerLabel(v){const id=identity();if(v==='p1'&&id.p1)return id.p1;if(v==='p2'&&id.p2)return id.p2;return v==='both'?t('both'):t('unassigned')}
function dueLabel(date){const d=parseDate(date);if(!d)return'';const n=diffDays(d,today());if(n===0)return t('dueToday');if(n===1)return t('dueTomorrow');if(n>1)return t('inDays',{n});return t('daysLate',{n:Math.abs(n)})}
function statusClass(date){const d=parseDate(date);if(!d)return'';const n=diffDays(d,today());return n<0?'danger':n<=7?'warn':''}
function taskSort(a,b){const rank=x=>x.status==='open'?0:x.status==='done'?1:2;const ra=rank(a),rb=rank(b);if(ra!==rb)return ra-rb;return (a.due||'9999').localeCompare(b.due||'9999')||b.priority-a.priority}
function eventMoment(e){const d=parseDate(e.date);if(!d)return null;const [h,m]=(e.time||'09:00').split(':').map(Number);d.setHours(h||0,m||0,0,0);return d}
function eventReminderDue(e){if(e.status==='done')return false;const mins=Number(e.reminderMinutes||0);if(mins<=0)return false;const m=eventMoment(e);if(!m)return false;const alertAt=new Date(m.getTime()-mins*60000);return new Date()>=alertAt && new Date()<new Date(m.getTime()+24*3600000)}
function eventWhen(e){return `${fmtDate(e.date)}${e.time?` · ${e.time}`:''}`}
function sourceLabel(s){return s==='payments'?t('sourcePayments'):s==='guests'?t('sourceGuests'):t('sourcePlanning')}
function eventTypeLabel(type){return t(type==='deadline'?'deadline':type==='reminder'?'reminder':'appointment')}

function suggestions(){
 const out=[],evs=activeEvents(),existing=new Set(evs.map(e=>e.sourceKey).filter(Boolean)),dismissed=state.dismissedSuggestions||{},now=today(),limit=new Date(now.getTime()+365*MS);
 for(const p of providers()){
   for(const pay of (Array.isArray(p.payments)?p.payments:[])){
     const due=parseDate(pay?.dueDate);if(!due||due<now||due>limit||['paid','cancelled','canceled'].includes(String(pay?.status||'').toLowerCase()))continue;
     const key=`payment:${p.id||p.name}:${pay.id||pay.dueDate}:${pay.amount||''}`;if(existing.has(key)||dismissed[key])continue;
     const concept=String(pay.concept||'').trim();out.push({key,source:'payments',kind:'deadline',title:lang()==='es'?`Pago · ${p.name}${concept?' · '+concept:''}`:`Payment · ${p.name}${concept?' · '+concept:''}`,date:pay.dueDate,providerId:p.id||'',reminderMinutes:4320,meta:t('paymentDue')})
   }
 }
 for(const task of allTasks()){
   if(task.status!=='open'||!task.due)continue;const dd=parseDate(task.due),n=dd?diffDays(dd,now):999;if(n<0||n>60)continue;
   const key=`task:${task.id}`;if(existing.has(key)||dismissed[key])continue;
   const source=task.cat==='guests'?'guests':'planning';out.push({key,source,kind:'reminder',title:task.title,date:task.due,taskId:task.id,reminderMinutes:1440,meta:source==='guests'?t('guestMilestone'):t('taskDue')})
 }
 return out.sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6)
}
function dismissSuggestion(key){state.dismissedSuggestions[key]={hidden:true,updatedAt:nowIso()};writeLocal();render()}
function addSuggestion(key){const s=suggestions().find(x=>x.key===key);if(!s)return;const id='e_'+crypto.randomUUID();state.events[id]={title:s.title,date:s.date,time:'',type:s.kind,reminderMinutes:s.reminderMinutes,owner:'both',taskId:s.taskId||'',providerId:s.providerId||'',notes:'',source:s.source,sourceKey:s.key,status:'open',createdAt:nowIso(),updatedAt:nowIso()};writeLocal();render();openEvent(id)}

function taskCard(x,compact=false){
 const cls=statusClass(x.due),done=x.status==='done',na=x.status==='na';
 return `<div class="card"><div class="row"><button class="check ${done?'done':''}" data-task-toggle="${esc(x.id)}">${done?'✓':''}</button><div class="grow"><div class="title">${esc(x.title)}</div><div class="meta">${x.due?esc(fmtDate(x.due))+' · '+esc(dueLabel(x.due)):esc(t('noDate'))} · ${esc(ownerLabel(x.owner))}</div><span class="badge ${cls}">${esc(x.due?dueLabel(x.due):t('noDate'))}</span><span class="badge">${esc(CATS[x.cat]?.[lang()]||x.cat)}</span>${x.signalOn?`<span class="badge signal">${esc(t('detected'))}</span>`:''}${na?`<span class="badge">${esc(t('notApplicable'))}</span>`:''}${compact?'':`<div class="actions"><button class="tiny" data-task-edit="${esc(x.id)}">${esc(t('edit'))}</button>${x.due?`<button class="tiny" data-task-agenda="${esc(x.id)}">${esc(t('toAgenda'))}</button>`:''}</div>`}</div></div></div>`
}
function eventCard(e,compact=false){
 const past=parseDate(e.date)<today(),done=e.status==='done',p=providers().find(x=>String(x.id)===String(e.providerId)),task=allTasks().find(x=>x.id===e.taskId);
 let links=[];if(p)links.push(p.name);if(task)links.push(task.title);
 return `<div class="card event ${past?'past':''}"><div class="eventTime">${esc(eventWhen(e))}</div><div class="row"><button class="check ${done?'done':''}" data-event-toggle="${esc(e.id)}">${done?'✓':''}</button><div class="grow"><div class="title">${esc(e.title)}</div><div class="meta">${esc(eventTypeLabel(e.type))} · ${esc(ownerLabel(e.owner))}${links.length?' · '+esc(links.join(' · ')):''}</div><span class="badge ${statusClass(e.date)}">${esc(dueLabel(e.date))}</span>${e.source&&e.source!=='manual'?`<span class="badge signal">${esc(sourceLabel(e.source))}</span>`:''}${compact?'':`<div class="actions"><button class="tiny" data-event-edit="${esc(e.id)}">${esc(t('edit'))}</button><button class="tiny" data-event-cal="${esc(e.id)}">${esc(t('calendar'))}</button></div>`}</div></div></div>`
}
function renderHero(){
 const id=identity(),wed=parseDate(id.date),n=wed?diffDays(wed,today()):null;$('eyebrow').textContent=t('eyebrow');$('heroEyebrow').textContent=t('heroEyebrow');$('heroTitle').textContent=t('hero');$('heroSub').textContent=t('heroSub');
 if(n===null){$('countNum').textContent='—';$('countLabel').textContent=t('noDate')}else if(n===0){$('countNum').textContent='0';$('countLabel').textContent=t('todayWedding')}else if(n<0){$('countNum').textContent=Math.abs(n);$('countLabel').textContent=t('pastWedding')}else{$('countNum').textContent=n;$('countLabel').textContent=`${n===1?t('day'):t('days')} ${t('until')}`}
 const next=activeEvents().find(e=>e.status!=='done'&&parseDate(e.date)>=today());const box=$('nextEvent');if(!next){box.hidden=true}else{box.hidden=false;box.innerHTML=`<div><b>${esc(next.title)}</b><small>${esc(eventTypeLabel(next.type))} · ${esc(ownerLabel(next.owner))}</small></div><div class="when">${esc(fmtDate(next.date,true))}${next.time?`<br>${esc(next.time)}`:''}</div>`}
}
function renderNow(){
 const tasks=allTasks(),open=tasks.filter(x=>x.status==='open'),over=open.filter(x=>x.due&&parseDate(x.due)<today()).length,next=open.filter(x=>x.due&&diffDays(parseDate(x.due),today())>=0&&diffDays(parseDate(x.due),today())<=30).length,done=tasks.filter(x=>x.status==='done').length;
 $('nowStats').innerHTML=`<div class="stat"><strong>${over}</strong><span>${esc(t('overdue'))}</span></div><div class="stat"><strong>${next}</strong><span>${esc(t('next30'))}</span></div><div class="stat"><strong>${done}</strong><span>${esc(t('done'))}</span></div>`;
 const rem=activeEvents().filter(eventReminderDue);$('reminderSection').hidden=!rem.length;$('reminderTitle').textContent=t('reminders');$('reminderSub').textContent=t('remindersSub');$('reminderList').innerHTML=rem.map(e=>eventCard(e,true)).join('');
 $('priorityTitle').textContent=t('priority');$('prioritySub').textContent=t('prioritySub');const pri=open.filter(x=>x.due).sort((a,b)=>{const da=diffDays(parseDate(a.due),today()),db=diffDays(parseDate(b.due),today());const sa=da<0?-1000+da:da,sb=db<0?-1000+db:db;return sa-sb||b.priority-a.priority}).slice(0,5);$('priorityList').innerHTML=pri.length?pri.map(x=>taskCard(x,true)).join(''):`<div class="empty">${esc(t('noPriority'))}</div>`;
 $('nextAgendaTitle').textContent=t('nextAgenda');$('nextAgendaSub').textContent=t('nextAgendaSub');const ev=activeEvents().filter(e=>e.status!=='done'&&parseDate(e.date)>=today()).slice(0,4);$('nextAgendaList').innerHTML=ev.length?ev.map(e=>eventCard(e,true)).join(''):`<div class="empty">${esc(t('noAgenda'))}</div>`;
}
function renderAgenda(){
 const ev=activeEvents(),d0=today(),d7=new Date(d0.getTime()+7*MS),todayN=ev.filter(e=>e.date===isoDay(d0)&&e.status!=='done').length,weekN=ev.filter(e=>{const d=parseDate(e.date);return d>=d0&&d<=d7&&e.status!=='done'}).length,upN=ev.filter(e=>parseDate(e.date)>=d0&&e.status!=='done').length;
 $('agendaStats').innerHTML=`<div class="stat"><strong>${todayN}</strong><span>${esc(t('today'))}</span></div><div class="stat"><strong>${weekN}</strong><span>${esc(t('week'))}</span></div><div class="stat"><strong>${upN}</strong><span>${esc(t('upcoming'))}</span></div>`;
 $('suggestTitle').textContent=t('suggest');$('suggestSub').textContent=t('suggestSub');const sug=suggestions();$('suggestSection').hidden=!sug.length;$('suggestList').innerHTML=sug.map(s=>`<div class="card suggestion"><div class="source">${esc(sourceLabel(s.source))} · ${esc(s.meta)}</div><div class="title">${esc(s.title)}</div><div class="meta">${esc(fmtDate(s.date))}</div><div class="actions"><button class="tiny primary" data-suggest-add="${esc(s.key)}">${esc(t('add'))}</button><button class="tiny" data-suggest-hide="${esc(s.key)}">${esc(t('dismiss'))}</button></div></div>`).join('');
 $('agendaTitle').textContent=t('agendaTitle');$('agendaSub').textContent=t('agendaSub');
 const filters=[['upcoming',t('upcoming')],['today',t('today')],['past',t('past')],['all',t('all')]];$('agendaFilters').innerHTML=filters.map(([k,v])=>`<button class="chip ${agendaFilter===k?'on':''}" data-agenda-filter="${k}">${esc(v)}</button>`).join('');
 let list=ev;if(agendaFilter==='upcoming')list=ev.filter(e=>parseDate(e.date)>=d0);if(agendaFilter==='today')list=ev.filter(e=>e.date===isoDay(d0));if(agendaFilter==='past')list=ev.filter(e=>parseDate(e.date)<d0);
 if(!list.length){$('agendaList').innerHTML=`<div class="empty" style="margin-top:8px">${esc(t('noAgenda'))}</div>`;return}
 const groups={};for(const e of list){(groups[e.date]||(groups[e.date]=[])).push(e)}$('agendaList').innerHTML=Object.keys(groups).sort().map(date=>`<div class="dateGroup"><h3>${esc(fmtDate(date))}</h3>${groups[date].map(e=>eventCard(e)).join('')}</div>`).join('')
}
function renderTimeline(){
 $('timelineTitle').textContent=t('timelineTitle');$('timelineSub').textContent=t('timelineSub');$('addTask').textContent=t('addTask');
 const filters=[['all',t('filterAll')],...Object.entries(CATS).map(([k,v])=>[k,v[lang()]])];$('taskFilters').innerHTML=filters.map(([k,v])=>`<button class="chip ${taskFilter===k?'on':''}" data-task-filter="${k}">${esc(v)}</button>`).join('');
 let tasks=allTasks().sort(taskSort);if(taskFilter!=='all')tasks=tasks.filter(x=>x.cat===taskFilter);$('timelineList').innerHTML=tasks.map(x=>taskCard(x)).join('')
}
function renderProgress(){
 const tasks=allTasks().filter(x=>x.status!=='na'),done=tasks.filter(x=>x.status==='done').length,pct=tasks.length?Math.round(done/tasks.length*100):0;$('progressBox').innerHTML=`<div class="hero"><div class="eyebrow">${esc(t('progressTitle'))}</div><h1 style="font-size:38px">${pct}%</h1><p>${esc(t('doneOf',{a:done,b:tasks.length}))}</p><div class="progressBar"><i style="width:${pct}%"></i></div></div>`;
 $('areasTitle').textContent=t('areas');$('areasSub').textContent=t('areasSub');$('areasList').innerHTML=Object.entries(CATS).map(([k,v])=>{const xs=tasks.filter(x=>x.cat===k),d=xs.filter(x=>x.status==='done').length,p=xs.length?Math.round(d/xs.length*100):0;return `<div class="card areaRow"><div class="areaTop"><b>${esc(v[lang()])}</b><span>${d}/${xs.length} · ${p}%</span></div><div class="areaBar"><i style="width:${p}%"></i></div></div>`}).join('')
}
function renderStatic(){
 $('navNow').textContent=t('now');$('navAgenda').textContent=t('agenda');$('navTimeline').textContent=t('timeline');$('navProgress').textContent=t('progress');document.querySelectorAll('[data-add-event]').forEach(b=>b.textContent=t('addEvent'));
}
function render(){document.documentElement.lang=lang();document.documentElement.dataset.theme=theme();renderStatic();renderHero();renderNow();renderAgenda();renderTimeline();renderProgress();wireDynamic()}

function fillOwnerSelect(el,val='both'){const id=identity();el.innerHTML=`<option value="both">${esc(t('both'))}</option>${id.p1?`<option value="p1">${esc(id.p1)}</option>`:''}${id.p2?`<option value="p2">${esc(id.p2)}</option>`:''}<option value="">${esc(t('unassigned'))}</option>`;el.value=val}
function fillEventLinks(taskId='',providerId=''){const tasks=allTasks();$('eventTask').innerHTML=`<option value="">—</option>`+tasks.map(x=>`<option value="${esc(x.id)}">${esc(x.title)}</option>`).join('');$('eventTask').value=taskId||'';const ps=providers();$('eventProvider').innerHTML=`<option value="">—</option>`+ps.map(p=>`<option value="${esc(p.id||'')}">${esc(p.name||'')}</option>`).join('');$('eventProvider').value=providerId||''}
function openEvent(id='',prefill=null){
 editingEvent=id;const e=id?state.events[id]:(prefill||{});$('eventSheetTitle').textContent=id?t('editEvent'):t('newEvent');$('eventTitle').value=e?.title||'';$('eventDate').value=e?.date||isoDay(today());$('eventTime').value=e?.time||'';$('eventType').innerHTML=`<option value="appointment">${esc(t('appointment'))}</option><option value="reminder">${esc(t('reminder'))}</option><option value="deadline">${esc(t('deadline'))}</option>`;$('eventType').value=e?.type||'appointment';$('eventReminder').innerHTML=`<option value="0">${esc(t('none'))}</option><option value="120">${esc(t('twoHours'))}</option><option value="1440">${esc(t('oneDay'))}</option><option value="4320">${esc(t('threeDays'))}</option><option value="10080">${esc(t('sevenDays'))}</option>`;$('eventReminder').value=String(e?.reminderMinutes||0);fillOwnerSelect($('eventOwner'),e?.owner||'both');fillEventLinks(e?.taskId||'',e?.providerId||'');$('eventNotes').value=e?.notes||'';$('deleteEvent').hidden=!id;$('calendarEvent').hidden=!id;
 const labels=[['eventTitleLabel','title'],['eventDateLabel','date'],['eventTimeLabel','time'],['eventTypeLabel','type'],['eventReminderLabel','reminderBefore'],['eventOwnerLabel','owner'],['eventTaskLabel','linkedTask'],['eventProviderLabel','linkedProvider'],['eventNotesLabel','notes'],['saveEvent','save'],['calendarEvent','nativeCalendar'],['deleteEvent','delete']];labels.forEach(([a,b])=>$(a).textContent=t(b));$('eventSheet').classList.add('on')
}
function openTask(id=''){editingTask=id;const x=allTasks().find(x=>x.id===id)||{};$('taskSheetTitle').textContent=id?t('editTask'):t('newTask');$('taskTitle').value=x.title||'';$('taskTitle').disabled=!!id&&!x.custom;$('taskDate').value=x.due||'';$('taskArea').innerHTML=Object.entries(CATS).map(([k,v])=>`<option value="${k}">${esc(v[lang()])}</option>`).join('');$('taskArea').value=x.cat||'foundation';$('taskArea').disabled=!!id&&!x.custom;fillOwnerSelect($('taskOwner'),x.owner||'both');$('taskNotes').value=x.notes||'';$('deleteTask').hidden=!id||!x.custom;$('naTask').hidden=!id;$('taskToAgenda').hidden=!$('taskDate').value;const labels=[['taskTitleLabel','title'],['taskDateLabel','date'],['taskAreaLabel','area'],['taskOwnerLabel','owner'],['taskNotesLabel','notes'],['saveTask','save'],['taskToAgenda','toAgenda'],['naTask','notApplicable'],['deleteTask','delete']];labels.forEach(([a,b])=>$(a).textContent=t(b));$('taskSheet').classList.add('on')}
function closeSheet(id){$(id).classList.remove('on')}
function saveEventForm(e){e.preventDefault();const id=editingEvent||'e_'+crypto.randomUUID(),old=state.events[id]||{};state.events[id]={...old,title:$('eventTitle').value.trim(),date:$('eventDate').value,time:$('eventTime').value,type:$('eventType').value,reminderMinutes:Number($('eventReminder').value||0),owner:$('eventOwner').value,taskId:$('eventTask').value,providerId:$('eventProvider').value,notes:$('eventNotes').value.trim(),source:old.source||'manual',sourceKey:old.sourceKey||'',status:old.status||'open',createdAt:old.createdAt||nowIso(),updatedAt:nowIso()};writeLocal();closeSheet('eventSheet');render()}
function saveTaskForm(e){e.preventDefault();const id=editingTask||'c_'+crypto.randomUUID(),existing=allTasks().find(x=>x.id===id),old=state.tasks[id]||{};const isCustom=!existing||existing.custom;state.tasks[id]={...old,custom:isCustom,title:isCustom?$('taskTitle').value.trim():undefined,due:$('taskDate').value,cat:isCustom?$('taskArea').value:undefined,owner:$('taskOwner').value,notes:$('taskNotes').value.trim(),status:old.status||existing?.status||'open',updatedAt:nowIso()};Object.keys(state.tasks[id]).forEach(k=>state.tasks[id][k]===undefined&&delete state.tasks[id][k]);writeLocal();closeSheet('taskSheet');render()}
function toggleTask(id){const x=allTasks().find(x=>x.id===id);if(!x)return;saveTaskPatch(id,{status:x.status==='done'?'open':'done'})}
function toggleEvent(id){const e=state.events[id];if(!e)return;state.events[id]={...e,status:e.status==='done'?'open':'done',updatedAt:nowIso()};writeLocal();render()}
function taskToAgenda(id){const x=allTasks().find(x=>x.id===id);if(!x||!x.due)return;closeSheet('taskSheet');openEvent('',{title:x.title,date:x.due,type:'reminder',reminderMinutes:1440,owner:x.owner,taskId:x.id,source:x.cat==='guests'?'guests':'planning'})}
function deleteCurrentEvent(){if(!editingEvent)return;state.events[editingEvent]={...state.events[editingEvent],deleted:true,updatedAt:nowIso()};writeLocal();closeSheet('eventSheet');render()}
function deleteCurrentTask(){if(!editingTask)return;state.tasks[editingTask]={...state.tasks[editingTask],deleted:true,updatedAt:nowIso()};writeLocal();closeSheet('taskSheet');render()}
function notApplicableTask(){if(!editingTask)return;saveTaskPatch(editingTask,{status:'na'});closeSheet('taskSheet')}
function icsEscape(s){return String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')}
function downloadICS(e){
 const time=(e.time||'09:00').replace(':',''),start=e.date.replace(/-/g,'')+'T'+time+'00',endDate=new Date(eventMoment(e).getTime()+60*60000),end=isoDay(endDate).replace(/-/g,'')+'T'+String(endDate.getHours()).padStart(2,'0')+String(endDate.getMinutes()).padStart(2,'0')+'00';
 const alarm=Number(e.reminderMinutes||0)>0?`\r\nBEGIN:VALARM\r\nTRIGGER:-PT${Number(e.reminderMinutes)}M\r\nACTION:DISPLAY\r\nDESCRIPTION:${icsEscape(e.title)}\r\nEND:VALARM`:'';
 const p=providers().find(x=>String(x.id)===String(e.providerId));const desc=[e.notes,p?.name?`${t('linkedProvider')}: ${p.name}`:''].filter(Boolean).join('\n');
 const ics=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Weddly Smart Design//Planning//EN\r\nCALSCALE:GREGORIAN\r\nBEGIN:VEVENT\r\nUID:${e.id}@weddlysmartdesign\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}\r\nDTSTART:${start}\r\nDTEND:${end}\r\nSUMMARY:${icsEscape(e.title)}\r\nDESCRIPTION:${icsEscape(desc)}${alarm}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
 const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`weddly-${e.date}-${(e.title||'agenda').toLowerCase().replace(/[^a-z0-9]+/gi,'-').slice(0,40)}.ics`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
function wireDynamic(){
 document.querySelectorAll('[data-task-toggle]').forEach(b=>b.onclick=()=>toggleTask(b.dataset.taskToggle));
 document.querySelectorAll('[data-task-edit]').forEach(b=>b.onclick=()=>openTask(b.dataset.taskEdit));
 document.querySelectorAll('[data-task-agenda]').forEach(b=>b.onclick=()=>taskToAgenda(b.dataset.taskAgenda));
 document.querySelectorAll('[data-event-toggle]').forEach(b=>b.onclick=()=>toggleEvent(b.dataset.eventToggle));
 document.querySelectorAll('[data-event-edit]').forEach(b=>b.onclick=()=>openEvent(b.dataset.eventEdit));
 document.querySelectorAll('[data-event-cal]').forEach(b=>b.onclick=()=>{const e=state.events[b.dataset.eventCal];if(e)downloadICS({id:b.dataset.eventCal,...e})});
 document.querySelectorAll('[data-suggest-add]').forEach(b=>b.onclick=()=>addSuggestion(b.dataset.suggestAdd));
 document.querySelectorAll('[data-suggest-hide]').forEach(b=>b.onclick=()=>dismissSuggestion(b.dataset.suggestHide));
 document.querySelectorAll('[data-agenda-filter]').forEach(b=>b.onclick=()=>{agendaFilter=b.dataset.agendaFilter;renderAgenda();wireDynamic()});
 document.querySelectorAll('[data-task-filter]').forEach(b=>b.onclick=()=>{taskFilter=b.dataset.taskFilter;renderTimeline();wireDynamic()});
}
function setView(v){activeView=v;document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.view===v));document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id==='view'+v[0].toUpperCase()+v.slice(1)));if(v==='agenda')renderAgenda();if(v==='timeline')renderTimeline();wireDynamic()}
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>setView(b.dataset.view));document.querySelectorAll('[data-add-event]').forEach(b=>b.onclick=()=>openEvent());$('addTask').onclick=()=>openTask();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeSheet(b.dataset.close));$('eventForm').onsubmit=saveEventForm;$('taskForm').onsubmit=saveTaskForm;$('deleteEvent').onclick=deleteCurrentEvent;$('deleteTask').onclick=deleteCurrentTask;$('naTask').onclick=notApplicableTask;$('taskToAgenda').onclick=()=>taskToAgenda(editingTask);$('calendarEvent').onclick=()=>{if(editingEvent){const e=state.events[editingEvent];if(e)downloadICS({id:editingEvent,...e})}};
addEventListener('keydown',e=>{if(e.key==='Escape'){closeSheet('eventSheet');closeSheet('taskSheet')}});
async function init(){readLocal();document.documentElement.dataset.theme=theme();const ok=await loadRemote();if(!ok)return;$('access').classList.remove('on');$('app').hidden=false;setSync(dirty?'saving':'synced');render();if(dirty)queueSync();setInterval(()=>{document.documentElement.dataset.theme=theme();render()},60000);addEventListener('storage',e=>{if(e.key&&[PAY,GUEST,THEME1,THEME2,'weddly_owner_demo_mode'].some(k=>e.key.startsWith(k)))render()})}
init();
})();