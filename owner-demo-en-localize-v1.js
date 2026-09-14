(()=>{
'use strict';
function isEnglishOwnerDemo(){
  try{const q=new URLSearchParams(location.search).get('ownerDemo');if(q==='en')return true;if(q==='es')return false}catch{}
  try{return localStorage.getItem('weddly_owner_demo_mode')==='en'}catch{return false}
}
if(!isEnglishOwnerDemo())return;
try{localStorage.setItem('weddly_access_lang','en')}catch{}

const EXACT=new Map(Object.entries({
'Invitados':'Guests','Invitado':'Guest','Hoy':'Today','Mesas':'Tables','Listados':'Reports','Ajustes':'Settings',
'Vuestra boda':'Your wedding','Nuestra boda':'Our wedding','Boda principal':'Main wedding','Fecha de boda pendiente':'Wedding date pending','Editar':'Edit',
'Confirmados':'Confirmed','Confirmado':'Confirmed','Pendientes':'Pending','Pendiente':'Pending','No asiste':'Not attending','Sin respuesta':'No response',
'Necesita tu atención':'Needs your attention','Todo al día':'All up to date','No hay acciones pendientes en este momento.':'There are no pending actions right now.',
'Prepara tu lista':'Prepare your list','Importa lo que ya tienes o crea personas por grupos y subgrupos.':'Import what you already have or create people by groups and subgroups.',
'Importar lista':'Import list','Crear mi lista':'Create my list','Ver personas':'View people','Envía y recoge RSVP':'Send and collect RSVPs',
'Las respuestas actualizan esta misma lista.':'Responses update this same list.','Gestionar RSVP':'Manage RSVPs','Ajusta las mesas':'Arrange tables',
'Puedes empezar de forma provisional antes de tener todos los RSVP.':'You can start provisionally before all RSVPs are in.','Abrir plano visual':'Open visual floor plan',
'Plano visual':'Visual floor plan','Diseña el salón':'Design the venue','Coloca mesas, invitados y elementos en el espacio real. Arrastra, gira y ajusta el tamaño directamente sobre el plano.':'Place tables, guests and elements in the real space. Drag, rotate and resize them directly on the plan.',
'+ Añadir mesa':'+ Add table','Sin mesa':'No table','Asignar':'Assign','Mover':'Move','Editar invitado':'Edit guest','Asignar mesa':'Assign table','+ Crear mesa':'+ Create table',
'NUEVA MESA':'NEW TABLE','Añadir mesa':'Add table','Nombre':'Name','Capacidad':'Capacity','Cancelar':'Cancel','Guardar':'Save','Añadir':'Add','Crear y asignar':'Create and assign',
'MESA':'TABLE','Volver':'Back','Cerrar':'Close','Hecho':'Done','PERSONAS':'PEOPLE','Invitados en gestión':'Guests being managed','Los “No asisten” se conservan fuera de la planificación activa.':'“Not attending” guests are kept outside active planning.',
'No hay personas activas.':'There are no active guests.','Sin nombre':'No name','IMPORTAR':'IMPORT','Trae tu lista':'Bring in your list','Subir archivo':'Upload file',
'O pega directamente desde Excel/Google Sheets:':'Or paste directly from Excel/Google Sheets:','Importar pegado':'Import pasted data','CREAR MI LISTA':'CREATE MY LIST',
'1 · ¿De qué parte vienen?':'1 · Which side/group are they from?','Elige un grupo grande o crea uno nuevo.':'Choose a main group or create a new one.','Grupo nuevo':'New group',
'Siguiente':'Next','2 · ¿Quieres un subgrupo?':'2 · Do you want a subgroup?','Úsalo solo si te ayuda a ordenar: Universidad, Familia de Canarias, Trabajo… Puedes dejarlo vacío.':'Use it only if it helps you organise: University, Family, Work… You can leave it blank.',
'3 · Añade las personas':'3 · Add people','Un nombre por línea. Puedes simplemente añadirlas o sentarlas juntas ahora.':'One name per line. You can simply add them or seat them together now.',
'Solo añadir':'Add only','Añadir y sentar':'Add and seat','SENTAR GRUPO':'SEAT GROUP','Seleccionados':'Selected','Elige una mesa con sitio suficiente para todos.':'Choose a table with enough room for everyone.',
'Aún no hay mesas.':'There are no tables yet.','O crea una mesa ahora':'Or create a table now','Crear mesa y asignar':'Create table and assign','Dejar sin mesa por ahora':'Leave unseated for now',
'Pon un nombre a la mesa.':'Give the table a name.','Ya existe una mesa con ese nombre.':'A table with that name already exists.','Los puedes sentar más tarde':'You can seat them later',
'RSVP':'RSVP','Menú':'Meal','Transporte':'Transport','Sí':'Yes','No':'No','Estándar':'Standard','Vegetariano':'Vegetarian','Vegano':'Vegan','Celíaco':'Gluten-free','Sin lactosa':'Lactose-free','Infantil':'Children’s menu','Sin menú':'No meal',
'Listados':'Reports','Mesas · Boda principal':'Tables · Main wedding','El plano y el resumen usan la misma información.':'The floor plan and summary use the same information.','Abrir plano':'Open floor plan',
'Catering · Boda principal':'Catering · Main wedding','Los invitados marcados “Sin menú” no se cuentan.':'Guests marked “No meal” are not counted.','Descargar CSV':'Download CSV',
'Transporte · Boda principal':'Transport · Main wedding','Plano de mesas':'Table plan','Toca uno o varios invitados para seleccionarlos':'Tap one or more guests to select them','← Volver':'← Back',
'Toca un invitado para seleccionarlo. Puedes tocar varios y moverlos juntos.':'Tap a guest to select them. You can select several and move them together.',
'PENDIENTE':'PENDING','LLENA':'FULL','Llena':'Full','Exceso':'Over capacity','Sin invitados asignados':'No guests assigned',
'PERSONALIZACIÓN':'CUSTOMISATION','Persona 1':'Partner 1','Persona 2':'Partner 2','Fecha de boda':'Wedding date',
'Familia':'Family','Amigos':'Friends','Trabajo':'Work','Otros':'Other','Sin grupo':'No group','Sin subgrupo':'No subgroup',
'Invitations & responses':'Invitations & responses','Envíos y respuestas':'Invitations & responses','Editar invitación':'Edit invitation','← Invitados':'← Guests','Cargando invitados…':'Loading guests…',
'La misma organización de tu lista: grupo, subgrupo y personas. Marca quién recibe una invitación y gestiona el envío desde ese contacto.':'The same structure as your guest list: group, subgroup and people. Choose who receives each invitation and manage sending from that contact.',
'Todos':'All','Todas':'All','Enviados':'Sent','Enviado':'Sent','Sin enviar':'Not sent','Seleccionar todos':'Select all','Deseleccionar todos':'Clear selection',
'Enviar invitación':'Send invitation','Enviar por WhatsApp':'Send via WhatsApp','Abrir WhatsApp':'Open WhatsApp','Copiar enlace':'Copy link','Copiar invitación':'Copy invitation','Marcar como enviado':'Mark as sent',
'Elegir contacto':'Choose contact','Añadir contacto':'Add contact','Editar contacto':'Edit contact','Teléfono':'Phone','Correo':'Email','Email':'Email','Guardar contacto':'Save contact',
'Familias y parejas':'Families & couples','Familia / pareja':'Family / couple','Persona':'Person','Personas':'People','Destinatario':'Recipient','Invitación':'Invitation','Invitaciones':'Invitations','Respuestas':'Responses',
'Formulario RSVP':'RSVP form','Preguntas de la boda':'Wedding questions','Preguntas personalizadas':'Custom questions','Eventos extra':'Extra events','Abrir eventos':'Open events','Guardar formulario':'Save form',
'Asistencia':'Attendance','Cada persona confirma si asistirá.':'Each person confirms whether they will attend.','Siempre incluido':'Always included','Tipo de menú de cada asistente.':'Meal type for each attendee.',
'Alergias e intolerancias':'Allergies and intolerances','Información para catering.':'Information for catering.','Actívalo solo si organizáis transporte.':'Enable only if you are organising transport.',
'Alojamiento':'Accommodation','Pregunta quién se queda a dormir o necesita alojamiento.':'Ask who will stay overnight or needs accommodation.','Invitado / +1':'Guest / +1','Permite acompañante cuando corresponda.':'Allow a plus-one when appropriate.',
'+ Pregunta':'+ Question','Pregunta':'Question','Tipo de respuesta':'Answer type','Opciones (una por línea)':'Options (one per line)','Obligatoria':'Required','Eliminar':'Remove','Texto libre':'Free text','Elegir una opción':'Choose an option','Sí / No':'Yes / No',
'Gestiona los eventos de vuestra boda':'Manage your wedding events','Elige qué eventos existen y quién está invitado a cada uno.':'Choose which events exist and who is invited to each one.',
'Servicios de vuestra boda':'Wedding services','Indicad solo lo que realmente existe. Lo que desactivéis dejará de preguntarse y de aparecer en Invitados.':'Only enable services you are actually offering. Disabled services will no longer be asked about or shown in Guests.',
'Autobús, traslado u otro transporte organizado por vosotros.':'Coach, shuttle or other transport organised by you.','Para saber quién se queda a dormir o necesita alojamiento.':'See who will stay overnight or needs accommodation.',
'Guardar servicios':'Save services','INSTALAR EN ESTE DISPOSITIVO':'INSTALL ON THIS DEVICE','Instalar en este dispositivo':'Install on this device','Añade Weddly Smart Design a tu pantalla de inicio para abrir vuestra boda como una app.':'Add Weddly Smart Design to your home screen to open your wedding like an app.',
'Guardando…':'Saving…','Guardando servicios…':'Saving services…','Guardado. Invitados y RSVP se adaptarán a estos servicios.':'Saved. Guests and RSVP will now follow these services.','No se ha podido guardar. Comprueba la conexión.':'Could not save. Check your connection.',
'Evento':'Event','Eventos':'Events','Crear evento':'Create event','Nuevo evento':'New event','Preboda':'Pre-wedding event','Invitados del evento':'Event guests','Seleccionar invitados':'Select guests','Invitación propia':'Own invitation','Confirmaciones':'Responses','Tareas':'Tasks','Calendario':'Calendar','Proveedores':'Suppliers','Pagos':'Payments',
'Ahora':'Now','Agenda':'Agenda','Cronología':'Timeline','Progreso':'Progress','Cita':'Appointment','Proveedor':'Supplier','Añadir al calendario':'Add to calendar',
'Abrir':'Open','Continuar':'Continue','Atrás':'Back','Guardar cambios':'Save changes','Borrar':'Delete','Buscar':'Search','Sin resultados':'No results','Cargando…':'Loading…','Reintentar':'Try again',
'Copiar':'Copy','Compartir':'Share','Enviar':'Send','Editar diseño':'Edit design','Diseño':'Design','Tipografía':'Typography','Fotos':'Photos','Agenda y lugares':'Schedule & locations','Ubicaciones':'Locations',
'Necesita menú':'Needs a meal','Está confirmado y aún no tiene menú.':'They are confirmed but do not have a meal selected yet.','Resolver':'Resolve','supera su capacidad':'is over capacity',
'plazas':'seats','libres':'available','con mesa':'seated','sin mesa':'unseated','invitados iniciales':'initial guests','en gestión':'being managed','no asisten':'not attending','pendientes':'pending','confirmados':'confirmed',
'Mesa':'Table','Grupo':'Group','Subgrupo':'Subgroup','Alojamiento · Boda principal':'Accommodation · Main wedding','Nombre':'Name'
}));

const MONTHS={enero:'January',febrero:'February',marzo:'March',abril:'April',mayo:'May',junio:'June',julio:'July',agosto:'August',septiembre:'September',octubre:'October',noviembre:'November',diciembre:'December'};
function translateString(input){
  if(input==null)return input;const s=String(input);const trimmed=s.trim();if(!trimmed)return s;
  let out=EXACT.get(trimmed)||trimmed;
  if(out===trimmed){
    out=out.replace(/^(\d+)\s+confirmados?$/i,'$1 confirmed')
      .replace(/^(\d+)\s+pendientes?$/i,'$1 pending')
      .replace(/^(\d+)\s+no asisten$/i,'$1 not attending')
      .replace(/^(\d+)\s+sin respuesta$/i,'$1 no response')
      .replace(/^(\d+)\s+pendientes de respuesta$/i,'$1 awaiting response')
      .replace(/^(\d+)\s+aún sin enviar\.?$/i,'$1 not sent yet')
      .replace(/^(\d+)\s+invitados? iniciales$/i,'$1 initial guests')
      .replace(/^(\d+)\s+en gestión$/i,'$1 being managed')
      .replace(/^(\d+)\s+con mesa$/i,'$1 seated')
      .replace(/^(\d+)\s+sin mesa$/i,'$1 unseated')
      .replace(/^(\d+)\s+plazas libres$/i,'$1 seats available')
      .replace(/^(\d+)\s+de\s+(\d+)\s+plazas$/i,'$1 of $2 seats')
      .replace(/^(\d+)\s+libres$/i,'$1 available')
      .replace(/^Exceso\s+(\d+)$/i,'Over by $1')
      .replace(/^(\d+)\s+invitados asignados\.?/i,'$1 guests assigned.')
      .replace(/^(\d+)\s+menús requeridos\.?/i,'$1 meals required.')
      .replace(/^(\d+)\s+personas usan transporte\.?/i,'$1 people use transport.')
      .replace(/^Caben los\s+(\d+)$/i,'Fits all $1')
      .replace(/^Faltan\s+(\d+)\s+plazas$/i,'Needs $1 more seats')
      .replace(/^Familia\s+(.+)$/i,'Family $1')
      .replace(/^Amigos\s+(.+)$/i,'Friends $1')
      .replace(/^Mesa\s+(\d+)$/i,'Table $1')
      .replace(/^(\d+)\s+invitados?$/i,'$1 guests')
      .replace(/^(\d+)\s+persona(s)?$/i,'$1 people')
      .replace(/^(\d+)\s+invitado(s)? añadido(s)?$/i,'$1 guests added')
      .replace(/^(\d+)\s+invitado(s)? sentado(s)?$/i,'$1 guests seated');
    out=out.replace(/^(\d{1,2}) de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre) de (\d{4})$/i,(m,d,mon,y)=>`${d} ${MONTHS[mon.toLowerCase()]} ${y}`);
    const phraseRules=[
      [/\bconfirmados\b/gi,'confirmed'],[/\bpendientes de respuesta\b/gi,'awaiting response'],[/\bpendientes\b/gi,'pending'],[/\bno asisten\b/gi,'not attending'],[/\baún sin enviar\b/gi,'not sent yet'],[/\bsin respuesta\b/gi,'no response'],
      [/\binvitados asignados\b/gi,'guests assigned'],[/\bmenús requeridos\b/gi,'meals required'],[/\bpersonas usan transporte\b/gi,'people use transport']
    ];
    for(const [re,repl] of phraseRules)out=out.replace(re,repl);
  }
  if(out===trimmed)return s;
  const lead=s.match(/^\s*/)?.[0]||'',tail=s.match(/\s*$/)?.[0]||'';return lead+out+tail;
}
function patchNodeText(node){
  if(node.nodeType!==3)return;const p=node.parentElement;if(!p||['SCRIPT','STYLE','NOSCRIPT','TEXTAREA'].includes(p.tagName))return;const n=translateString(node.nodeValue);if(n!==node.nodeValue)node.nodeValue=n;
}
function patchElement(el){
  if(!el||el.nodeType!==1)return;
  for(const a of ['placeholder','title','aria-label'])if(el.hasAttribute?.(a)){const old=el.getAttribute(a),n=translateString(old);if(n!==old)el.setAttribute(a,n)}
  if((el.tagName==='INPUT'&&(el.type==='button'||el.type==='submit'))&&el.value){const n=translateString(el.value);if(n!==el.value)el.value=n}
}
const observed=new WeakSet(), hookedFrames=new WeakSet();
function patchDoc(doc){
  if(!doc?.documentElement)return;doc.documentElement.lang='en';
  const walker=doc.createTreeWalker(doc.body||doc.documentElement,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode())patchNodeText(n);
  doc.querySelectorAll?.('*').forEach(patchElement);
  doc.querySelectorAll?.('iframe').forEach(hookFrame);
  if(observed.has(doc))return;observed.add(doc);
  const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')patchNodeText(m.target);for(const x of m.addedNodes){if(x.nodeType===3)patchNodeText(x);else if(x.nodeType===1){patchElement(x);const w=doc.createTreeWalker(x,NodeFilter.SHOW_TEXT);let t;while(t=w.nextNode())patchNodeText(t);x.querySelectorAll?.('*').forEach(patchElement);x.querySelectorAll?.('iframe').forEach(hookFrame)}}}});
  mo.observe(doc.documentElement,{subtree:true,childList:true,characterData:true,attributes:false});
}
function hookFrame(f){
  if(!f||hookedFrames.has(f))return;hookedFrames.add(f);const run=()=>{try{patchDoc(f.contentDocument)}catch{}};f.addEventListener('load',()=>{setTimeout(run,0);setTimeout(run,120);setTimeout(run,500)});run();
}
function sweep(){
  if(!isEnglishOwnerDemo())return;patchDoc(document);document.querySelectorAll('iframe').forEach(hookFrame);
  try{for(const f of document.querySelectorAll('iframe')){const d=f.contentDocument;if(d){patchDoc(d);d.querySelectorAll('iframe').forEach(hookFrame)}}}catch{}
}
addEventListener('DOMContentLoaded',()=>{sweep();[100,350,900,1800].forEach(ms=>setTimeout(sweep,ms))});
addEventListener('load',sweep);addEventListener('guests-prod-open',()=>setTimeout(sweep,50));
setInterval(sweep,700);
sweep();
})();
