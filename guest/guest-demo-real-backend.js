/* GUEST DEMO, intentionally isolated from production. All backend actions simulated in-browser. */
(()=>{'use strict';
const OWNER='weddly_guests_qa_v67',EVENT='guest_demo_event_v1',RECIP='guest_demo_event_recipients_v1',RSVP='guest_demo_rsvp_v1';
const storage={get:(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||structuredClone(f)}catch{return structuredClone(f)}},put:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const guests=()=>storage.get(OWNER,{guests:{}}).guests||{};
const demoEvent=()=>({schema:1,events:{e_preboda:{id:'e_preboda',name:'Cena de bienvenida',date:'2027-06-11',time:'20:30',venue:'Jardín de la Finca',address:'Murcia',enabled:true,budget:0,guestIds:Object.keys(guests()).filter((x,i)=>i<13),tasks:{},payments:{},responses:{},updatedAt:new Date().toISOString()}},updatedAt:new Date().toISOString()});
function eventState(){return storage.get(EVENT,{state:demoEvent(),version:1})}
function guestResponses(){return storage.get(RSVP,{forms:[{public_token:'demo-rsvp-ficticio',config:{transportOffered:true,accommodationOffered:true,questions:{transport:true,meal:true},customQuestions:[{id:'q_song',label:'¿Qué canción te gustaría escuchar?',type:'text'},{id:'q_veg',label:'¿Necesitas alguna alternativa de menú?',type:'yesno'}]}}],submissions:[{guest_key:'demo_p01',name:'Ana Moreno',attend:true,received_at:'2026-10-20T12:00:00.000Z',payload:{custom_answers:{q_song:'Viva la vida',q_veg:false}}},{guest_key:'demo_p04',name:'María Ruiz',attend:true,received_at:'2026-10-20T13:00:00.000Z',payload:{custom_answers:{q_song:'Dancing Queen',q_veg:true}}},{guest_key:'demo_p11',name:'Lucía Vega',attend:true,received_at:'2026-10-20T14:00:00.000Z',payload:{custom_answers:{q_song:'La vida es un carnaval',q_veg:false}}}],contacts:[],delivery:[]})}
function recipients(){return storage.get(RECIP,{invitation:{title:'Cena de bienvenida',subtitle:'Antes de nuestro gran día, brindamos juntos.',message:'¡Nos vemos en la preboda!',heroPhoto:'',secondPhoto:''},recipients:[]})}
function ok(data={},status=200){return Promise.resolve(new Response(JSON.stringify({ok:status>=200&&status<300,...data}),{status,headers:{'content-type':'application/json'}}))}
function guardedJSON(body){try{return JSON.parse(body||'{}')}catch{return {}}}
const previousFetch=window.fetch.bind(window);
window.fetch=(input,opts={})=>{
 const url=typeof input==='string'?input:input?.url||'';
 if(!url.includes('supabase.co/functions/v1/')){try{if(new URL(url,location.href).origin===location.origin)return previousFetch(input,opts)}catch{}return ok({error:'external_network_disabled'},403)}
 const method=(opts.method||'GET').toUpperCase(),body=guardedJSON(opts.body);
 if(url.includes('/guest-event-state')){
  const curr=eventState();if(method==='GET')return ok(curr);
  if(method==='PUT'){if(Number(body.version)!==curr.version)return ok({error:'conflict',server:curr},409);const next={state:body.state,version:curr.version+1};storage.put(EVENT,next);return ok({version:next.version,state:next.state});}
  return ok({error:'method'},405);
 }
 if(url.includes('/guest-event-invite')){
  const d=recipients();const action=body.action||'';
  if(method==='GET'){
   if(new URL(url).searchParams.has('token')){
     const tk=new URL(url).searchParams.get('token');
     let rec=d.recipients.find(x=>x.token===tk);
     if(!rec){const gs=guests(),m=Object.entries(gs).slice(0,2).map(([id,g])=>({id,name:g.name}));rec={recipient_key:'demostracion',token:tk,members:m,response:{}}}
     const ev=eventState().state.events?.e_preboda||Object.values(eventState().state.events||{})[0]||{};
     return ok({event:ev,recipient:rec,invitation:d.invitation});
   }
   return ok(d);
  }
  if(action==='respond'){
    const rec=d.recipients.find(x=>x.token===body.token);
    if(rec){rec.response={...body.response};rec.responded_at=new Date().toISOString();storage.put(RECIP,d)}
    return ok({responded_at:new Date().toISOString()});
  }
  if(action==='sync_recipients'){const prev=new Map(d.recipients.map(x=>[x.recipient_key,x]));d.recipients=(body.recipients||[]).map((r,i)=>{const old=prev.get(String(r.key))||{};return {recipient_key:String(r.key),members:r.members||[],phone:r.phone||'',token:'demo-event-'+(i+1),response:old.response||{},status:old.status||'pending',sent_at:old.sent_at||null,responded_at:old.responded_at||null}});storage.put(RECIP,d);return ok({recipients:d.recipients,invitation:d.invitation});}
  if(action==='save_payload'){d.invitation={...d.invitation,...body.payload};storage.put(RECIP,d);return ok({invitation:d.invitation,recipients:d.recipients});}
  if(action==='mark_sent'){const r=d.recipients.find(x=>x.recipient_key===String(body.recipient_key));if(r){r.status='sent';r.sent_at=new Date().toISOString()}storage.put(RECIP,d);return ok({});}
  return ok({error:'unsupported_event_action'},400);
 }
 if(url.includes('/guest-rsvp')){
  const d=guestResponses();if(method==='GET')return ok(d);
  if(body.action==='claim')return ok({});
  if(body.action==='contact'){d.contacts=d.contacts.filter(x=>x.guest_key!==body.guest_key);d.contacts.push({guest_key:body.guest_key,phone:body.phone||'',email:body.email||''});storage.put(RSVP,d);return ok({});}
  if(body.action==='manual_submit'){
   d.submissions.push({...body,received_at:new Date().toISOString()});storage.put(RSVP,d);
   const main=storage.get(OWNER,{guests:{},tables:{}});if(main.guests?.[body.guest_key]){main.guests[body.guest_key].rsvp=body.attend?'confirmed':'declined';main.guests[body.guest_key].meal=body.meal||'';main.guests[body.guest_key].transport=!!body.transport;storage.put(OWNER,main)}
   return ok({});
  }
  return ok({error:'unsupported_rsvp_action'},400);
 }
 if(url.includes('/guest-state')){
  const state=storage.get(OWNER,{guests:{},tables:{}});if(method==='GET')return ok({state,version:1});if(method==='PUT'){if(body.state?.guests)storage.put(OWNER,body.state);return ok({state:body.state,version:2})}
 }
 return ok({error:'not_available_in_demo'},403);
};
const block=(e)=>{
 const b=e.target.closest?.('button');
 if(b?.id==='invitePreview'){
  e.preventDefault();e.stopImmediatePropagation();
  const d=recipients(); const t=d.recipients[0]?.token||'demo-event-1';
  location.assign('guest-demo-event-invite-real.html?t='+encodeURIComponent(t));return;
 }
 if(b?.matches('[data-wa],[data-remind]')){
  e.preventDefault();e.stopImmediatePropagation();
  const d=recipients();const key=b.dataset.wa||b.dataset.remind;
  const rec=d.recipients.find(x=>x.recipient_key===key);
  if(rec){rec.status='sent';rec.sent_at=new Date().toISOString();storage.put(RECIP,d)}
  alert('DEMO: invitación del evento preparada. No se ha enviado ningún mensaje real.');return;
 }
 const a=e.target.closest?.('a[href]');if(a&&/^https?:\/\//.test(a.href)&&new URL(a.href).origin!==location.origin){e.preventDefault();e.stopImmediatePropagation();alert('DEMOSTRACIÓN: no se realizan envíos reales ni se abre ninguna cuenta externa.')}};
document.addEventListener('click',block,true);
const safeOpen=window.open.bind(window);window.open=(url,...rest)=>{if(!url||url==='about:blank')return safeOpen(url,...rest);try{if(new URL(String(url),location.href).origin===location.origin)return safeOpen(url,...rest)}catch{}alert('No se abren servicios externos desde esta vista de muestra.');return null};
/* No visible test-data ribbon: screenshot controls and test isolation are handled by the demo wrapper. */
})();