import { createClient } from 'npm:@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, x-weddly-token, x-weddly-demo','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Cache-Control':'no-store'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
const admin=()=>{const secrets=Deno.env.get('SUPABASE_SECRET_KEYS');const key=secrets?JSON.parse(secrets).default:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');return createClient(Deno.env.get('SUPABASE_URL')!,key!,{auth:{persistSession:false}})};
async function hashToken(token:string){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('')}
function text(v:any,max=240){return String(v??'').trim().slice(0,max)}
function image(v:any,max=750000){const s=String(v??'');if(!s||s.length>max)return'';return /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(s)?s:''}
function agenda(v:any){const icons=new Set(['ring','glass','fork','note']);if(!Array.isArray(v))return[];return v.slice(0,6).map((x:any)=>({time:text(x?.time,20),title:text(x?.title,80),place:text(x?.place,120),icon:icons.has(String(x?.icon))?String(x.icon):'ring'}))}
function locations(v:any){if(!Array.isArray(v))return[];return v.slice(0,4).map((x:any)=>({title:text(x?.title,80),time:text(x?.time,20),place:text(x?.place,160),address:text(x?.address,260)}))}
function options(v:any){if(!v||typeof v!=='object'||Array.isArray(v))return{};const out:Record<string,string|number|boolean>={};for(const [k,val] of Object.entries(v).slice(0,40)){const key=text(k,48).replace(/[^a-zA-Z0-9_-]/g,'');if(!key)continue;if(typeof val==='boolean')out[key]=val;else if(typeof val==='number'&&Number.isFinite(val))out[key]=val;else if(typeof val==='string')out[key]=text(val,240)}return out}
function gallery(v:any){if(!Array.isArray(v))return[];return v.slice(0,3).map((x:any)=>image(x)).filter(Boolean)}
function venues(v:any){if(!Array.isArray(v))return[];return v.slice(0,4).map((x:any)=>({label:text(x?.label,80),name:text(x?.name,180),detail:text(x?.detail,180),address:text(x?.address,260),pos:text(x?.pos,80),photo:image(x?.photo)}))}
function transport(v:any){if(!Array.isArray(v))return[];return v.slice(0,8).map((x:any)=>({title:text(x?.title,100),detail:text(x?.detail,220),address:text(x?.address,260),link:text(x?.link,500)}))}
function smallObject(v:any,fields:string[]){const x=(v&&typeof v==='object'&&!Array.isArray(v))?v:{};const out:Record<string,string>={};for(const f of fields)out[f]=text(x?.[f],f==='text'?1800:500);return out}
function blocks(v:any){const x=(v&&typeof v==='object'&&!Array.isArray(v))?v:{};return{transporte:x.transporte===true,alojamiento:x.alojamiento===true,dresscode:x.dresscode===true,regalo:x.regalo===true,playlist:x.playlist===true,infoExtra:x.infoExtra===true,galeria:x.galeria!==false}}
function expiredLicense(source:string,metadata:any){if(source!=='tester')return false;const raw=metadata?.expires_at;if(!raw)return false;const t=Date.parse(String(raw));return Number.isFinite(t)&&Date.now()>=t}
function guestsAllowed(source:string,metadata:any){if(source==='internal_owner'&&metadata?.grant_type==='owner')return true;const p=String(metadata?.product||'');return p==='guests'||p==='full'}
async function activeGuestWedding(db:any,weddingId:string){const {data:l,error}=await db.from('licenses').select('id,source,status,metadata').eq('wedding_id',weddingId).maybeSingle();if(error)throw error;if(!l)return true;if(l.status!=='active')return false;if(expiredLicense(String(l.source||''),l.metadata)){await db.from('licenses').update({status:'inactive',updated_at:new Date().toISOString()}).eq('id',l.id).eq('status','active');return false}return guestsAllowed(String(l.source||''),l.metadata||{})}
async function resolveAccessByMember(db:any,token:string,demo=''){if(!token||token.length<40)return null;const h=await hashToken(token);const {data:member,error:me}=await db.from('wedding_members').select('wedding_id,license_id').eq('member_hash',h).eq('status','active').maybeSingle();if(me)throw me;if(!member)return null;const {data:license,error:le}=await db.from('licenses').select('id,status,wedding_id,source,metadata').eq('id',member.license_id).maybeSingle();if(le)throw le;if(!license||license.status!=='active'||license.wedding_id!==member.wedding_id)return null;if(expiredLicense(String(license.source||''),license.metadata)){await db.from('licenses').update({status:'inactive',updated_at:new Date().toISOString()}).eq('id',license.id).eq('status','active');return null}if(!guestsAllowed(String(license.source||''),license.metadata||{}))return null;let weddingId=member.wedding_id as string;const source=String(license.source||''),meta=license.metadata||{};if((demo==='es'||demo==='en')&&source==='internal_owner'&&meta?.grant_type==='owner'){const candidate=meta?.[demo==='es'?'marketing_demo_es':'marketing_demo_en'];if(typeof candidate==='string'&&candidate)weddingId=candidate}const edition=(source==='internal_owner'&&meta?.grant_type==='owner')||String(meta?.edition||'').toLowerCase()==='signature'?'signature':'essential';return{weddingId,edition,source,licenseId:license.id}}
function clean(x:any){
  const tier=String(x?.tier)==='signature'?'signature':'essential';
  const rawTemplate=String(x?.template||'');
  const template=tier==='signature'?(/^sig0[1-4]$/i.test(rawTemplate)?rawTemplate.toLowerCase():'sig01'):(/^e\d{2}$/i.test(rawTemplate)?rawTemplate.toLowerCase():'e01');
  const fonts=new Set(['editorial','romantico','clasico','moderno','caligrafico']);
  let wa=text(x?.whatsapp,300);const digits=wa.replace(/^https?:\/\/wa\.me\//i,'').replace(/\D/g,'');wa=digits?`https://wa.me/${digits}`:'';
  const common:any={tier,template,fontPair:fonts.has(String(x?.fontPair))?String(x.fontPair):'editorial',p1:text(x?.p1,100),p2:text(x?.p2,100),date:text(x?.date,20),time:text(x?.time,20),venue:text(x?.venue,180),city:text(x?.city,120),heroPhoto:image(x?.heroPhoto),storyPhoto:image(x?.storyPhoto),storyTitle:text(x?.storyTitle,180),storyText:text(x?.storyText,1800),agenda:agenda(x?.agenda),locations:locations(x?.locations),contactName:text(x?.contactName,100),contactPhone:text(x?.contactPhone,80),whatsapp:wa,options:options(x?.options),version:6};
  if(tier!=='signature')return common;
  return {...common,
    tagline:text(x?.tagline,260),
    storyQuote:text(x?.storyQuote,500),
    galeria:gallery(x?.galeria),
    venues:venues(x?.venues),
    transporte:transport(x?.transporte),
    hotel:{...smallObject(x?.hotel,['name','desc','code','link']),photo:image(x?.hotel?.photo)},
    dress:smallObject(x?.dress,['note']),
    gift:smallObject(x?.gift,['text','strong']),
    playlist:smallObject(x?.playlist,['text','linkText','link']),
    infoExtra:smallObject(x?.infoExtra,['text']),
    blocks:blocks(x?.blocks),
    contact1Name:text(x?.contact1Name,100),contact1Phone:text(x?.contact1Phone,80),
    contact2Name:text(x?.contact2Name,100),contact2Phone:text(x?.contact2Phone,80)
  }
}
Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  try{
    const db=admin(),url=new URL(req.url),demo=(req.headers.get('x-weddly-demo')||'').toLowerCase();
    if(req.method==='GET'){
      const token=text(url.searchParams.get('token'),220);if(!token)return json({ok:false,error:'missing_token'},400);
      const h=await hashToken(token);
      const {data:form,error:fe}=await db.from('guest_rsvp_forms').select('id,wedding_id,status').eq('public_token_hash',h).maybeSingle();if(fe)throw fe;
      if(!form||form.status!=='active'||!await activeGuestWedding(db,String(form.wedding_id)))return json({ok:false,error:'form_unavailable'},404);
      const {data,error}=await db.from('guest_rsvp_personalization').select('payload,updated_at').eq('form_id',form.id).maybeSingle();if(error)throw error;
      return json({ok:true,personalization:data?.payload||null,updated_at:data?.updated_at||null})
    }
    if(req.method==='POST'){
      const body=await req.json().catch(()=>null);if(!body)return json({ok:false,error:'invalid_json'},400);
      const memberToken=req.headers.get('x-weddly-token')||'',access=await resolveAccessByMember(db,memberToken,demo);if(!access)return json({ok:false,error:'invalid_access'},401);const weddingId=access.weddingId;
      const token=text(body.token,220);if(!token)return json({ok:false,error:'missing_token'},400);
      const h=await hashToken(token);
      const {data:form,error:fe}=await db.from('guest_rsvp_forms').select('id,wedding_id,status,config').eq('public_token_hash',h).maybeSingle();if(fe)throw fe;
      if(!form||form.status!=='active')return json({ok:false,error:'form_unavailable'},404);
      if(form.wedding_id!==weddingId)return json({ok:false,error:'invalid_access'},401);
      const payload=clean(body.personalization||{}),now=new Date().toISOString();if(payload.tier==='signature'&&access.edition!=='signature')return json({ok:false,error:'signature_not_in_license'},403);
      const {error}=await db.from('guest_rsvp_personalization').upsert({form_id:form.id,payload,updated_at:now},{onConflict:'form_id'});if(error)throw error;
      const old=form.config&&typeof form.config==='object'?form.config:{};
      const synced={...old,title:(payload.p1&&payload.p2)?`${payload.p1} & ${payload.p2}`:(old.title||'Nuestra boda'),date:payload.date||old.date||'',time:payload.time||old.time||'',venue:payload.city?`${payload.venue}, ${payload.city}`:(payload.venue||old.venue||'')};
      const {error:ce}=await db.from('guest_rsvp_forms').update({config:synced,updated_at:now}).eq('id',form.id);if(ce)throw ce;
      return json({ok:true,personalization:payload,updated_at:now})
    }
    return json({ok:false,error:'method_not_allowed'},405)
  }catch(e){console.error(e);return json({ok:false,error:'server_error'},500)}
});