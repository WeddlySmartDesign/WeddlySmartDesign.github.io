import { createClient } from 'npm:@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, x-weddly-token','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
function admin(){const secrets=Deno.env.get('SUPABASE_SECRET_KEYS');const key=secrets?JSON.parse(secrets).default:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');return createClient(Deno.env.get('SUPABASE_URL')!,key!,{auth:{persistSession:false}})}
async function sha256(value:string){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('')}
const secret=()=>crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');
function expired(source:string,meta:any){if(source!=='tester')return false;const raw=meta?.expires_at;if(!raw)return false;const t=Date.parse(String(raw));return Number.isFinite(t)&&Date.now()>=t}
function allowed(source:string,meta:any){if(source==='internal_owner'&&meta?.grant_type==='owner')return true;if(source==='internal_demo'&&meta?.grant_type==='owner_demo')return true;const p=String(meta?.product||'');return p==='guests'||p==='full'}
async function weddingFor(db:any,token:string){if(!token||token.length<40)return null;const h=await sha256(token);const {data:m,error:me}=await db.from('wedding_members').select('wedding_id,license_id').eq('member_hash',h).eq('status','active').maybeSingle();if(me)throw me;if(!m)return null;const {data:l,error:le}=await db.from('licenses').select('id,wedding_id,status,source,metadata').eq('id',m.license_id).maybeSingle();if(le)throw le;if(!l||l.status!=='active'||l.wedding_id!==m.wedding_id)return null;if(expired(String(l.source||''),l.metadata)){await db.from('licenses').update({status:'inactive',updated_at:new Date().toISOString()}).eq('id',l.id).eq('status','active');return null}if(!allowed(String(l.source||''),l.metadata||{}))return null;return{weddingId:String(m.wedding_id),licenseId:String(m.license_id)}}
// The customer answers this once in the purchase questionnaire; no RSVP editor in GUEST.
function catalogueRsvpConfig(order:any){
 const q=order.questionnaire&&typeof order.questionnaire==='object'?order.questionnaire:{};
 const r=q.rsvp&&typeof q.rsvp==='object'?q.rsvp:{};
 const loc=q.locations&&typeof q.locations==='object'?q.locations:{};
 const venue=(loc.mode==='split'?loc.ceremony:loc.shared)||{};
 const bus=q.practical?.bus||{},accommodation=q.practical?.accommodation||{};
 const name1=String(q.couple?.name1||'').trim().slice(0,30),name2=String(q.couple?.name2||'').trim().slice(0,30);
 const questions=Array.isArray(r.customQuestions)?r.customQuestions.slice(0,6):[];
 const customQuestions=questions.map((raw:any,i:number)=>({id:'catalog_q_'+(i+1),label:String(raw||'').trim().slice(0,160),type:'text',options:[],required:false})).filter((x:any)=>x.label);
 return {
  title:[name1,name2].filter(Boolean).join(' & ')||'Nuestra boda',
  date:String(q.couple?.date||'').trim().slice(0,20),
  time:String(venue.time||'').trim().slice(0,10),
  venue:String(venue.name||'').trim().slice(0,180),
  intro:'Nos encantará celebrar este día contigo.',
  transportOffered:bus.enabled===true,
  accommodationOffered:accommodation.enabled===true,
  customQuestions,
  questions:{meal:r.menu!==false,allergy:r.allergies!==false,transport:bus.enabled===true,children:r.children===true,plusone:r.plusOne!==false},
  catalogOrderId:String(order.id)
 };
}
Deno.serve(async req=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors});if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);try{const db=admin(),member=req.headers.get('x-weddly-token')||'',access=await weddingFor(db,member),weddingId=access?.weddingId;if(!weddingId)return json({ok:false,error:'invalid_access'},401);
const {data:catalog,error:orderError}=await db.from('guest_invitation_orders').select('id,status,questionnaire').eq('license_id',access.licenseId).order('created_at',{ascending:false}).limit(1).maybeSingle();if(orderError)throw orderError;
if(catalog&&catalog.status!=='delivered')return json({ok:false,error:'invitation_not_delivered'},409);
const catalogConfig=catalog?catalogueRsvpConfig(catalog):null;
const {data:existing,error:ee}=await db.from('guest_rsvp_forms').select('id,public_token,config,status').eq('wedding_id',weddingId).eq('status','active').order('updated_at',{ascending:false}).limit(1).maybeSingle();if(ee)throw ee;if(existing?.id&&existing.public_token){
 if(catalogConfig&&existing.config?.catalogOrderId!==catalog.id){
  const {count,error:countError}=await db.from('guest_rsvp_submissions').select('id',{count:'exact',head:true}).eq('form_id',existing.id);if(countError)throw countError;
  if(Number(count||0)>0)return json({ok:false,error:'existing_rsvp_answers_require_review'},409);
  const {data:synced,error:updateError}=await db.from('guest_rsvp_forms').update({config:catalogConfig,updated_at:new Date().toISOString()}).eq('id',existing.id).eq('wedding_id',weddingId).select('config').maybeSingle();if(updateError)throw updateError;
  if(!synced)return json({ok:false,error:'rsvp_config_sync_failed'},409);
  return json({ok:true,created:false,formId:existing.id,publicToken:existing.public_token,config:synced.config});
 }
 return json({ok:true,created:false,formId:existing.id,publicToken:existing.public_token,config:existing.config||{}});
}
const publicToken=secret(),manageToken=secret(),now=new Date().toISOString(),config={title:'Nuestra boda',date:'',time:'',venue:'',intro:'Nos encantará celebrar este día contigo.',transportOffered:false,accommodationOffered:false,customQuestions:[],questions:{meal:true,allergy:true,transport:false,plusone:true}};
const row={wedding_id:weddingId,public_token:publicToken,public_token_hash:await sha256(publicToken),manage_token_hash:await sha256(manageToken),status:'active',config:catalogConfig||config,created_at:now,updated_at:now,claimed_at:now};
const {data:created,error:ce}=await db.from('guest_rsvp_forms').insert(row).select('id,public_token,config').maybeSingle();if(ce){const {data:retry}=await db.from('guest_rsvp_forms').select('id,public_token,config').eq('wedding_id',weddingId).eq('status','active').order('updated_at',{ascending:false}).limit(1).maybeSingle();if(retry?.id&&retry.public_token)return json({ok:true,created:false,formId:retry.id,publicToken:retry.public_token,config:retry.config||{}});throw ce}
return json({ok:true,created:true,formId:created?.id,publicToken:created?.public_token||publicToken,config:created?.config||config},201)}catch(e){console.error(e);return json({ok:false,error:'server_error'},500)}});