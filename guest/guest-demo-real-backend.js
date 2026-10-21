/* GUEST DEMO, intentionally isolated from production. All backend actions simulated in-browser. */
(()=>{'use strict';
const OWNER='weddly_guests_qa_v67',EVENT='guest_demo_event_v1',RECIP='guest_demo_event_recipients_v1',RSVP='guest_demo_rsvp_v1';
const storage={get:(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||structuredClone(f)}catch{return structuredClone(f)}},put:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const guests=()=>storage.get(OWNER,{guests:{}}).guests||{};
const demoEvent=()=>({schema:1,events:{e_preboda:{id:'e_preboda',name:'Cena de bienvenida',date:'2027-06-11',time:'20:30',venue:'Jardín de la Finca',address:'Murcia',enabled:true,budget:0,guestIds:Object.keys(guests()).filter((x,i)=>i<13),tasks:{},payments:{},responses:{},updatedAt:new Date().toISOString()}},updatedAt:new Date().toISOString()});
function eventState(){return storage.get(EVENT,{state:demoEvent(),version:1})}
function guestResponses(){return storage.get(RSVP,{forms:[{public_token:'demo-rsvp-ficticio'}],submissions:[],contacts:[],delivery:[]})}
function recipients(){return storage.get(RECIP,{invitation:{title:'Cena de bienvenida',subtitle:'Antes de nuestro gran día, brindamos juntos.',message:'¡Nos vemos en la preboda!',heroPhoto:'',secondPhoto:''},recipients:[]})}
function ok(data={},status=200){return Promise.resolve(new Response(JSON.stringify({ok:status>=200&&status<300,...data}),{status,headers:{'content-type':'application/json'}}))}
function guardedJSON(body){try{return JSON.parse(body||'{}')}catch{return {}}}
const previousFetch=window.fetch.bind(window);
window.fetch=(input,opts={})=>{
 const url=typeof input==='string'?input:input?.url||'';
 if(!url.includes('supabase.co/functions/v1/'))return previousFetch(input,opts);
 const method=(opts.method||'GET').toUpperCase(),body=guardedJSON(opts.body);
 if(url.includes('/guest-event-state')){
  const curr=eventState();if(method==='GET')return ok(curr);
  if(method==='PUT'){if(Number(body.version)!==curr.version)return ok({error:'conflict',server:curr},409);const next={state:body.state,version:curr.version+1};storage.put(EVENT,next);return ok({version:next.version,state:next.state});}
  return ok({error:'method'},405);
 }
 if(url.includes('/guest-event-invite')){
  const d=recipients();const action=body.action||'';
  if(method==='GET')return ok(d);
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
const block=(e)=>{const a=e.target.closest?.('a[href]');if(a&&/^https?:\/\//.test(a.href)&&new URL(a.href).origin!==location.origin){e.preventDefault();e.stopImmediatePropagation();alert('DEMOSTRACIÓN: no se realizan envíos reales ni se abre ninguna cuenta externa.')}};
document.addEventListener('click',block,true);
window.open=(url)=>{alert('DEMO: envío externo deshabilitado.');return null};
const style=document.createElement('style');style.textContent='body:before{content:"DEMO · DATOS FICTICIOS · SIN ENVÍOS REALES";position:sticky;top:0;z-index:999;display:block;padding:8px;background:#e9ede4;color:#3d5333;font-size:11px;font-weight:800;letter-spacing:.04em;text-align:center}';document.head.appendChild(style);
})();