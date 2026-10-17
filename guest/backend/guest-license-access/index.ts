import { createClient } from 'npm:@supabase/supabase-js@2';

const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, x-weddly-member','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
function secretKey(){const x=Deno.env.get('SUPABASE_SECRET_KEYS');return x?JSON.parse(x).default:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||''}
function admin(){return createClient(Deno.env.get('SUPABASE_URL')!,secretKey(),{auth:{persistSession:false}})}
async function sha256(v:string){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('')}
function norm(v:unknown){return String(v||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'')}
function secret(){return crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','')}
function allowed(l:any){if(!l)return false;if(l.source==='internal_owner'&&l.metadata?.grant_type==='owner')return true;return String(l.metadata?.product||'')==='guests'}
function expired(l:any){if(l?.source!=='tester'||l?.metadata?.permanent===true)return false;const raw=l?.metadata?.expires_at;if(!raw)return false;const t=Date.parse(String(raw));return Number.isFinite(t)&&Date.now()>=t}
async function deactivateExpired(db:any,l:any){if(!expired(l))return false;await db.from('licenses').update({status:'inactive',metadata:{...(l.metadata||{}),deactivated_reason:'trial_expired',deactivated_at:new Date().toISOString()},updated_at:new Date().toISOString()}).eq('id',l.id).eq('status','active');return true}
async function body(req:Request){const t=await req.text();if(t.length>32768)throw new Error('body_too_large');try{return JSON.parse(t||'{}')}catch{throw new Error('invalid_json')}}
async function memberContext(db:any,req:Request,b:any){const token=String(req.headers.get('x-weddly-member')||b?.memberToken||'').trim();if(token.length<40)return null;const hash=await sha256(token);const {data:m,error:me}=await db.from('wedding_members').select('id,wedding_id,license_id,role,status').eq('member_hash',hash).eq('status','active').maybeSingle();if(me)throw me;if(!m)return null;const {data:l,error:le}=await db.from('licenses').select('id,source,status,wedding_id,metadata').eq('id',m.license_id).maybeSingle();if(le)throw le;if(!l||l.status!=='active'||l.wedding_id!==m.wedding_id||!allowed(l))return null;if(await deactivateExpired(db,l))return null;return{token,member:m,license:l}}
function rpcError(e:any){const m=String(e?.message||'');if(m.includes('not_primary'))return json({ok:false,error:'not_primary'},403);if(m.includes('partner_exists'))return json({ok:false,error:'partner_exists'},409);if(m.includes('invite_expired'))return json({ok:false,error:'invite_expired'},410);if(m.includes('invite_unavailable'))return json({ok:false,error:'invite_unavailable'},409);if(m.includes('invalid_invite'))return json({ok:false,error:'invalid_invite'},404);console.warn(e);return json({ok:false,error:'server_error'},500)}
async function activate(db:any,raw:any){
  const code=norm(raw);if(code.length<20)return json({ok:false,error:'invalid_license'},404);
  const hash=await sha256(code);
  const {data:l,error:le}=await db.from('licenses').select('id,purchase_hash,source,status,wedding_id,metadata').eq('purchase_hash',hash).maybeSingle();if(le)throw le;
  if(!l||l.status!=='active'||!allowed(l))return json({ok:false,error:'invalid_license'},404);
  if(await deactivateExpired(db,l))return json({ok:false,error:'license_inactive'},403);
  // A paid invitation grants GUEST access ONLY on final approved delivery.
  const {data:latestOrder,error:orderError}=await db.from('guest_invitation_orders').select('status').eq('license_id',l.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
  if(orderError)throw orderError;
  if(latestOrder&&latestOrder.status!=='delivered')return json({ok:false,error:'invitation_not_delivered'},409);
  const memberToken=secret(),memberHash=await sha256(memberToken),now=new Date().toISOString();
  if(!l.wedding_id){
    const legacyToken=secret();
    const {data,error}=await db.rpc('activate_weddly_license',{p_purchase_hash:hash,p_member_hash:memberHash,p_access_hash:await sha256(legacyToken)});
    if(error){console.warn(error);return json({ok:false,error:'activation_failed'},409)}
    const row=data?.[0];if(!row?.wedding_id)return json({ok:false,error:'activation_failed'},409);
    return json({ok:true,weddingId:row.wedding_id,role:'primary',memberToken,recovered:false},201)
  }
  const {data:m,error:me}=await db.from('wedding_members').select('id').eq('license_id',l.id).eq('wedding_id',l.wedding_id).eq('role','primary').maybeSingle();if(me)throw me;
  if(m?.id){
    const {error:ue}=await db.from('wedding_members').update({member_hash:memberHash,status:'active',last_seen_at:now}).eq('id',m.id);if(ue)throw ue
  }else{
    const {error:ie}=await db.from('wedding_members').insert({license_id:l.id,wedding_id:l.wedding_id,role:'primary',member_hash:memberHash,status:'active',last_seen_at:now});if(ie)throw ie
  }
  return json({ok:true,weddingId:l.wedding_id,role:'primary',memberToken,recovered:true},201)
}

Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);
  try{
    const b=await body(req),action=String(b?.action||''),db=admin();
    if(action==='activate')return await activate(db,b.activationCode);
    if(action==='status'){
      const c=await memberContext(db,req,b);if(!c)return json({ok:false,error:'invalid_member'},401);
      const {count,error}=await db.from('wedding_members').select('id',{head:true,count:'exact'}).eq('license_id',c.member.license_id).eq('role','partner').eq('status','active');if(error)throw error;
      await db.from('wedding_members').update({last_seen_at:new Date().toISOString()}).eq('id',c.member.id);
      return json({ok:true,weddingId:c.member.wedding_id,role:c.member.role,partnerJoined:(count||0)>0,tester:c.license.source==='tester',expiresAt:c.license.metadata?.expires_at||null,edition:String(c.license.metadata?.edition||'essential')==='signature'?'signature':'essential'})
    }
    if(action==='invite'){
      const c=await memberContext(db,req,b);if(!c)return json({ok:false,error:'invalid_member'},401);if(c.member.role!=='primary')return json({ok:false,error:'not_primary'},403);
      const inviteCode=secret(),expiresAt=new Date(Date.now()+7*86400000).toISOString();
      const {data,error}=await db.rpc('create_weddly_partner_invite',{p_member_hash:await sha256(c.token),p_invite_hash:await sha256(inviteCode),p_expires_at:expiresAt});if(error)return rpcError(error);
      const row=data?.[0];if(!row)return json({ok:false,error:'server_error'},500);return json({ok:true,inviteCode,expiresAt:row.expires_at},201)
    }
    if(action==='join'){
      const inviteCode=String(b.inviteCode||'').trim();if(inviteCode.length<40)return json({ok:false,error:'invalid_invite'},404);const inviteHash=await sha256(inviteCode);
      const {data:inv,error:ie}=await db.from('wedding_invites').select('id,license_id,wedding_id,status,expires_at,used_at').eq('invite_hash',inviteHash).maybeSingle();if(ie)throw ie;
      if(!inv||inv.status!=='active'||inv.used_at||Date.now()>=Date.parse(String(inv.expires_at)))return json({ok:false,error:'invalid_invite'},404);
      const {data:l,error:le}=await db.from('licenses').select('id,source,status,wedding_id,metadata').eq('id',inv.license_id).maybeSingle();if(le)throw le;if(!l||l.status!=='active'||!allowed(l)||l.wedding_id!==inv.wedding_id)return json({ok:false,error:'invalid_invite'},404);
      const memberToken=secret();const {data,error}=await db.rpc('join_weddly_partner_invite',{p_invite_hash:inviteHash,p_member_hash:await sha256(memberToken)});if(error)return rpcError(error);
      const row=data?.[0];if(!row)return json({ok:false,error:'server_error'},500);return json({ok:true,weddingId:row.wedding_id,role:'partner',memberToken},201)
    }
    return json({ok:false,error:'invalid_action'},400)
  }catch(e){
    const m=String((e as Error)?.message||'');if(m==='body_too_large')return json({ok:false,error:m},413);if(m==='invalid_json')return json({ok:false,error:m},400);console.warn(e);return json({ok:false,error:'server_error'},500)
  }
});