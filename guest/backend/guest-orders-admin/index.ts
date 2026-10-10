import { createClient } from 'npm:@supabase/supabase-js@2';

const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, x-weddly-manager','Access-Control-Allow-Methods':'POST,OPTIONS','Cache-Control':'no-store'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
function secretKey(){const secrets=Deno.env.get('SUPABASE_SECRET_KEYS');return secrets?JSON.parse(secrets).default:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||''}
function admin(){return createClient(Deno.env.get('SUPABASE_URL')!,secretKey(),{auth:{persistSession:false}})}
async function sha256(v:string){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('')}
function b64url(s:string){return btoa(s).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'')}
function unb64url(s:string){let v=s.replaceAll('-','+').replaceAll('_','/');while(v.length%4)v+='=';return atob(v)}
async function hmac(data:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secretKey()),{name:'HMAC',hash:'SHA-256'},false,['sign']);const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('wsd-owner-manager-v1|'+data));return Array.from(new Uint8Array(sig)).map(x=>x.toString(16).padStart(2,'0')).join('')}
function safeEq(a:string,b:string){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
async function managerContext(db:any,req:Request){const token=String(req.headers.get('x-weddly-manager')||'').trim(),parts=token.split('.');if(parts.length!==3||parts[0]!=='v1')return null;const sig=await hmac(parts[1]);if(!safeEq(sig,parts[2]))return null;let p:any;try{p=JSON.parse(unb64url(parts[1]))}catch{return null}if(!p?.ownerId||!p?.exp||Date.now()>=Number(p.exp))return null;const {data:l,error}=await db.from('licenses').select('id,source,status,metadata').eq('id',String(p.ownerId)).maybeSingle();if(error)throw error;if(!l||l.source!=='internal_owner'||l.status!=='active'||l.metadata?.grant_type!=='owner')return null;return{license:l,payload:p}}
function randomToken(){return crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','')}
function origin(){return (Deno.env.get('WEDDLY_SITE_ORIGIN')||'https://weddlysmartdesign.github.io').replace(/\/$/,'')}
function esc(s:any){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c))}
async function resend(payload:any){
 const key=(Deno.env.get('RESEND_API_KEY')||'').trim(),from=(Deno.env.get('WEDDLY_RESEND_FROM')||'').trim();if(!key||!from)throw new Error('email_not_configured');
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key,...(payload.idempotencyKey?{'Idempotency-Key':payload.idempotencyKey}:{})},body:JSON.stringify({from,reply_to:'weddlysmartdesign@gmail.com',...payload.body})});
 if(!r.ok){console.warn('resend_failed',r.status,await r.text());throw new Error('email_failed')}return true
}
async function getOrder(db:any,id:string){
 const {data:l,error}=await db.from('licenses').select('id,source,status,wedding_id,purchase_hash,metadata,created_at,activated_at,updated_at').eq('id',id).maybeSingle();if(error)throw error;
 if(!l||l.source!=='stripe'||!['guest','guests'].includes(String(l.metadata?.product||'')))return null;
 return l
}
async function seedWedding(db:any,l:any,weddingId:string){
 const order=l.metadata?.guest_order||{},couple1=String(order.couple1||'').trim(),couple2=String(order.couple2||'').trim(),date=String(order.weddingDate||'').trim();
 const {data:w,error:we}=await db.from('weddings').select('settings').eq('id',weddingId).maybeSingle();if(we)throw we;
 const settings={...(w?.settings||{})};if(couple1&&couple2){settings.partner1=couple1;settings.partner2=couple2;settings.couple=[couple1,couple2]}if(/^\d{4}-\d{2}-\d{2}$/.test(date))settings.weddingDate=date;
 const {error:wue}=await db.from('weddings').update({settings,updated_at:new Date().toISOString()}).eq('id',weddingId);if(wue)throw wue;
 const {data:s,error:se}=await db.from('guest_app_state').select('version').eq('wedding_id',weddingId).maybeSingle();if(se)throw se;
 if(!s){
  const state={guests:{},tables:{t1:{name:'Mesa 1',cap:8}},sent:null,prepared:null,preparedV:1,sentV:1,activity:null,meta:{couple:(couple1&&couple2)?[couple1,couple2]:[],weddingDate:/^\d{4}-\d{2}-\d{2}$/.test(date)?date:''}};
  const {error:ie}=await db.from('guest_app_state').insert({wedding_id:weddingId,state,version:1,updated_at:new Date().toISOString()});if(ie)throw ie
 }
}
async function prepare(db:any,l:any){
 if(String(l.metadata?.guest_personalization_status||'')==='delivered')throw new Error('already_delivered');
 const memberToken=randomToken(),memberHash=await sha256(memberToken),now=new Date().toISOString();let weddingId=String(l.wedding_id||'');
 if(!weddingId){
  const {data,error}=await db.rpc('activate_weddly_license',{p_purchase_hash:String(l.purchase_hash||''),p_member_hash:memberHash,p_access_hash:await sha256(randomToken())});if(error)throw error;
  const row=data?.[0];if(!row?.wedding_id)throw new Error('activation_failed');weddingId=String(row.wedding_id)
 }else{
  const {data:m,error:me}=await db.from('wedding_members').select('id').eq('license_id',l.id).eq('wedding_id',weddingId).eq('role','primary').maybeSingle();if(me)throw me;
  if(!m?.id)throw new Error('primary_missing');
  const {error:ue}=await db.from('wedding_members').update({member_hash:memberHash,status:'active',last_seen_at:now}).eq('id',m.id);if(ue)throw ue
 }
 const fresh=await getOrder(db,l.id);if(!fresh)throw new Error('order_missing');await seedWedding(db,fresh,weddingId);
 const meta={...(fresh.metadata||{}),guest_personalization_status:'preparing',guest_preparation_started_at:fresh.metadata?.guest_preparation_started_at||now,guest_preparation_last_opened_at:now};
 const {error:le}=await db.from('licenses').update({metadata:meta,updated_at:now}).eq('id',l.id);if(le)throw le;
 return{weddingId,memberToken,prepUrl:origin()+'/guest/index.html?access='+encodeURIComponent(memberToken)+'&prep=1'}
}
function cleanUrl(v:any){const u=String(v||'').trim();if(!u)return'';try{const x=new URL(u);if(x.origin!==origin())throw 0;if(!x.pathname.startsWith('/guest/'))throw 0;return x.toString()}catch{throw new Error('invalid_invitation_url')}}
async function listOrders(db:any){
 const {data:rows,error}=await db.from('licenses').select('id,status,wedding_id,metadata,created_at,activated_at,updated_at').eq('source','stripe').in('metadata->>product',['guest','guests']).order('created_at',{ascending:false}).limit(100);if(error)throw error;
 const ids=(rows||[]).map((x:any)=>x.id);const deliveries=new Map<string,any>();
 if(ids.length){const {data:d,error:de}=await db.from('license_delivery_codes').select('license_id,buyer_email,delivered_at').in('license_id',ids);if(de)throw de;for(const x of d||[])deliveries.set(String(x.license_id),x)}
 return(rows||[]).map((x:any)=>{const m=x.metadata||{},o=m.guest_order||{},d=deliveries.get(String(x.id))||{};return{id:x.id,status:String(m.guest_personalization_status||'awaiting_details'),edition:String(m.edition||'essential'),buyerEmail:String(d.buyer_email||''),couple1:String(o.couple1||''),couple2:String(o.couple2||''),weddingDate:String(o.weddingDate||''),design:String(o.design||''),phone:String(o.contactPhone||''),createdAt:x.created_at,detailsAt:m.guest_order_submitted_at||null,preparingAt:m.guest_preparation_started_at||null,readyAt:m.guest_ready_at||null,deliveredAt:m.guest_delivered_at||d.delivered_at||null,weddingId:x.wedding_id||null,invitationUrl:String(m.guest_invitation_url||''),notes:String(o.notes||''),extraEvents:String(o.extraEvents||'')}})
}
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);
 try{
  const raw=await req.text();if(raw.length>65536)return json({ok:false,error:'body_too_large'},413);let b:any={};try{b=JSON.parse(raw||'{}')}catch{return json({ok:false,error:'invalid_json'},400)}
  const db=admin(),ctx=await managerContext(db,req);if(!ctx)return json({ok:false,error:'manager_required'},403);const action=String(b.action||'');
  if(action==='status')return json({ok:true,expiresAt:new Date(Number(ctx.payload.exp)).toISOString()});
  if(action==='list')return json({ok:true,orders:await listOrders(db)});
  if(action==='prepare'){
   const l=await getOrder(db,String(b.licenseId||''));if(!l)return json({ok:false,error:'order_not_found'},404);
   if(!l.metadata?.guest_order_submitted_at)return json({ok:false,error:'details_required'},409);
   return json({ok:true,...await prepare(db,l)})
  }
  if(action==='set_status'){
   const allowed=['awaiting_details','details_received','preparing','ready'];const next=String(b.status||'');if(!allowed.includes(next))return json({ok:false,error:'invalid_status'},400);
   const l=await getOrder(db,String(b.licenseId||''));if(!l)return json({ok:false,error:'order_not_found'},404);if(String(l.metadata?.guest_personalization_status||'')==='delivered')return json({ok:false,error:'already_delivered'},409);
   const now=new Date().toISOString(),meta={...(l.metadata||{}),guest_personalization_status:next};if(next==='ready')meta.guest_ready_at=now;if(next==='preparing')meta.guest_preparation_started_at=meta.guest_preparation_started_at||now;
   const {error}=await db.from('licenses').update({metadata:meta,updated_at:now}).eq('id',l.id);if(error)throw error;return json({ok:true,status:next})
  }
  if(action==='set_invitation_url'){
   const l=await getOrder(db,String(b.licenseId||''));if(!l)return json({ok:false,error:'order_not_found'},404);const url=cleanUrl(b.invitationUrl),now=new Date().toISOString(),meta={...(l.metadata||{}),guest_invitation_url:url};
   const {error}=await db.from('licenses').update({metadata:meta,updated_at:now}).eq('id',l.id);if(error)throw error;return json({ok:true,invitationUrl:url})
  }
  if(action==='send_delivery'){
   const l=await getOrder(db,String(b.licenseId||''));if(!l)return json({ok:false,error:'order_not_found'},404);
   if(String(l.metadata?.guest_personalization_status||'')!=='ready')return json({ok:false,error:'not_ready'},409);
   const {data:d,error:de}=await db.from('license_delivery_codes').select('activation_code,buyer_email').eq('license_id',l.id).maybeSingle();if(de)throw de;if(!d?.activation_code||!d?.buyer_email)throw new Error('delivery_missing');
   const order=l.metadata?.guest_order||{},accessUrl=origin()+'/guest/access.html#code='+encodeURIComponent(String(d.activation_code)),inviteUrl=String(l.metadata?.guest_invitation_url||''),names=[order.couple1,order.couple2].filter(Boolean).join(' & '),now=new Date().toISOString();
   const buttons=`<p><a href="${esc(accessUrl)}" style="display:inline-block;background:#282723;color:#fff;text-decoration:none;padding:13px 18px;border-radius:10px">Abrir vuestro GUEST</a></p>`+(inviteUrl?`<p><a href="${esc(inviteUrl)}" style="display:inline-block;border:1px solid #282723;color:#282723;text-decoration:none;padding:12px 18px;border-radius:10px">Abrir vuestra invitación</a></p>`:'');
   await resend({idempotencyKey:'guest-delivery/'+l.id,body:{to:[String(d.buyer_email)],subject:'Vuestra invitación GUEST está lista',html:`<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#2C2A26"><h1 style="font-family:Georgia,serif;font-weight:400">Ya está lista.</h1><p>${names?esc(names)+', ':''}vuestra invitación GUEST está preparada.</p>${buttons}<p>Desde GUEST podréis gestionar invitados, respuestas, acompañantes, menús, transporte, alojamiento, mesas, listados y eventos extra.</p><p style="font-size:13px;color:#736F63">Guarda este email. El enlace de GUEST también os permite recuperar el acceso del titular si cambiáis de dispositivo.</p><p style="font-size:13px;color:#736F63">WeddlySmartDesign · weddlysmartdesign@gmail.com</p></div>`}});
   const meta={...(l.metadata||{}),guest_personalization_status:'delivered',guest_delivered_at:now};const {error:ue}=await db.from('licenses').update({metadata:meta,updated_at:now}).eq('id',l.id);if(ue)throw ue;
   await db.from('license_delivery_codes').update({delivered_at:now}).eq('license_id',l.id);
   return json({ok:true,status:'delivered',deliveredAt:now})
  }
  return json({ok:false,error:'invalid_action'},400)
 }catch(e){const m=String((e as Error)?.message||'');console.warn(e);if(['already_delivered','details_required','invalid_invitation_url','not_ready'].includes(m))return json({ok:false,error:m},409);return json({ok:false,error:'server_error'},500)}
});