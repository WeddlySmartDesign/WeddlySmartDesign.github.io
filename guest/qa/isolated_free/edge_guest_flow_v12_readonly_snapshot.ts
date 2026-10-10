import { createClient } from 'npm:@supabase/supabase-js@2';

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'content-type, x-weddly-manager, x-weddly-token',
  'Access-Control-Allow-Methods':'POST,OPTIONS',
  'Cache-Control':'no-store'
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
const secretKey=()=>{const x=Deno.env.get('SUPABASE_SECRET_KEYS');return x?JSON.parse(x).default:(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'')};
const db=()=>createClient(Deno.env.get('SUPABASE_URL')!,secretKey(),{auth:{persistSession:false}});
const site=()=>String(Deno.env.get('WEDDLY_SITE_ORIGIN')||'https://weddlysmartdesign.github.io').replace(/\/$/,'');
const now=()=>new Date().toISOString();
const txt=(v:any,max=500)=>String(v??'').trim().slice(0,max);
const CATALOG_TEMPLATES:any={
  'veil-light':{id:'veil-light',version:'5.3.3',renderer:'veil-light-v5-3-3',active:true,typographyVariants:['classic','romantic','contemporary'],defaultTypographyVariant:'classic'}
};
function templateSpec(v:any){
  const id=txt(v,80).toLowerCase(),x=CATALOG_TEMPLATES[id];
  if(!x||x.active!==true)throw new Error('template_unavailable');
  return x;
}
const esc=(s:any)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
async function sha256(v:string){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('')}
async function hmac(v:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secretKey()),{name:'HMAC',hash:'SHA-256'},false,['sign']);const s=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(v));return Array.from(new Uint8Array(s)).map(x=>x.toString(16).padStart(2,'0')).join('')}
function safeEq(a:string,b:string){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0}
function b64url(s:string){return btoa(s).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'')}
function unb64url(s:string){let v=s.replaceAll('-','+').replaceAll('_','/');while(v.length%4)v+='=';return atob(v)}
async function managerContext(c:any,req:Request){
  const token=String(req.headers.get('x-weddly-manager')||'').trim(),parts=token.split('.');
  if(parts.length!==3||parts[0]!=='v1')return null;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secretKey()),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sigBytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('wsd-owner-manager-v1|'+parts[1]));
  const sig=Array.from(new Uint8Array(sigBytes)).map(x=>x.toString(16).padStart(2,'0')).join('');
  if(!safeEq(sig,parts[2]))return null;
  let p:any;try{p=JSON.parse(unb64url(parts[1]))}catch{return null}
  if(!p?.ownerId||!p?.exp||Date.now()>=Number(p.exp))return null;
  const {data:l,error}=await c.from('licenses').select('id,source,status,metadata').eq('id',String(p.ownerId)).maybeSingle();
  if(error)throw error;
  if(!l||l.source!=='internal_owner'||l.status!=='active'||l.metadata?.grant_type!=='owner')return null;
  return p;
}
async function memberContext(c:any,req:Request){
  const token=String(req.headers.get('x-weddly-token')||'').trim();
  if(token.length<40)return null;
  const h=await sha256(token);
  const {data:m,error:me}=await c.from('wedding_members').select('wedding_id,license_id,status').eq('member_hash',h).eq('status','active').maybeSingle();
  if(me)throw me;if(!m)return null;
  const {data:l,error:le}=await c.from('licenses').select('id,status,wedding_id,metadata').eq('id',m.license_id).maybeSingle();
  if(le)throw le;
  if(!l||l.status!=='active'||String(l.wedding_id||'')!==String(m.wedding_id||''))return null;
  return{weddingId:String(m.wedding_id),licenseId:String(m.license_id),license:l};
}
async function capability(id:string,purpose:string){
  const sig=await hmac('guest-invitation-flow-v1|'+purpose+'|'+id);
  return 'gif1_'+purpose+'_'+id+'_'+sig.slice(0,40);
}
async function findByToken(c:any,token:string,field:'questionnaire_token_hash'|'review_token_hash'|'public_token_hash'){
  if(!token||token.length<50)return null;
  const h=await sha256(token);
  const {data,error}=await c.from('guest_invitation_orders').select('*').eq(field,h).maybeSingle();
  if(error)throw error;return data||null;
}
async function resend(body:any,idempotencyKey?:string){
  const key=String(Deno.env.get('RESEND_API_KEY')||'').trim(),rawFrom=String(Deno.env.get('WEDDLY_RESEND_FROM')||'').trim();
  const m=rawFrom.match(/<([^>]+)>/),addr=(m?.[1]||(/^[^\\s<>]+@[^\\s<>]+$/.test(rawFrom)?rawFrom:'')).trim();
  const from=addr?('GUEST by WeddlySmartDesign <'+addr+'>'):rawFrom;
  if(!key||!from)return false;
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key,...(idempotencyKey?{'Idempotency-Key':idempotencyKey}:{})},body:JSON.stringify({from,reply_to:'weddlysmartdesign@gmail.com',...body})});
  if(!r.ok){console.warn('resend_failed',r.status,await r.text());return false}return true
}
function emailOf(q:any,fallback=''){return txt(q?.contact?.email||fallback,200).toLowerCase()}
function coupleGreeting(q:any){
  const a=txt(q?.couple?.name1,40),b=txt(q?.couple?.name2,40),n=[a,b].filter(Boolean).join(' & ');
  return n?('Gracias, '+esc(n)+'.'):'Gracias.';
}
function emailBox(kicker:string,title:string,lead:string,body:string){
  return '<div style="margin:0;background:#eee7e0;padding:24px 10px;font-family:Arial,sans-serif;color:#4a3e37">'
    +'<div style="max-width:600px;margin:auto;background:#fffdfc;border:1px solid #ded3ca;border-radius:24px;padding:30px 24px">'
    +'<div style="padding-bottom:22px;border-bottom:1px solid #ded3ca"><span style="font-size:13px;letter-spacing:.14em;font-weight:700">VUESTRA INVITACIÓN</span></div>'
    +'<div style="margin-top:26px;font-size:11px;letter-spacing:.17em;font-weight:700;color:#aa8472">'+esc(kicker)+'</div>'
    +'<h1 style="font-family:Georgia,serif;font-size:38px;line-height:1.06;font-weight:400;margin:10px 0 16px;color:#4a3e37">'+esc(title)+'</h1>'
    +'<p style="font-size:17px;line-height:1.6;margin:0 0 24px;color:#5d5049">'+lead+'</p>'
    +body
    +'<div style="margin-top:28px;padding-top:18px;border-top:1px solid #ded3ca;font-size:13px;line-height:1.55;color:#83756b"><b style="color:#4a3e37">¿Necesitáis ayuda?</b><br>Responded directamente a este correo y os ayudaremos.</div>'
    +'<div style="margin-top:20px;font-size:11px;line-height:1.5;color:#9a8c82">WeddlySmartDesign</div>'
    +'</div></div>';
}
function emailButton(url:string,label:string,secondary=false){
  const bg=secondary?'#fffdfc':'#4b4039',color=secondary?'#4b4039':'#ffffff',border=secondary?'1px solid #4b4039':'1px solid #4b4039';
  return '<p style="margin:12px 0"><a href="'+esc(url)+'" style="display:block;text-align:center;background:'+bg+';color:'+color+';border:'+border+';text-decoration:none;padding:15px 18px;border-radius:999px;font-size:15px;font-weight:700">'+esc(label)+'</a></p>';
}
function emailStep(n:string,title:string,body:string){
  return '<tr><td style="width:38px;padding:13px 10px 13px 0;border-top:1px solid #e8ded6;color:#aa8472;font-size:11px;font-weight:700;vertical-align:top">'+esc(n)+'</td><td style="padding:13px 0;border-top:1px solid #e8ded6"><div style="font-size:15px;font-weight:700;margin-bottom:4px;color:#4a3e37">'+esc(title)+'</div><div style="font-size:13px;line-height:1.5;color:#83756b">'+esc(body)+'</div></td></tr>';
}
function emailPanel(inner:string,soft=false){
  return '<div style="margin:20px 0;padding:18px;border:1px solid #ded3ca;border-radius:18px;background:'+(soft?'#f7f1ec':'#fffefd')+'">'+inner+'</div>';
}

function sortedMoments(a:any[]){
  const k=(t:any)=>{const s=String(t||'');if(!/^\d{2}:\d{2}$/.test(s))return 99999;const [h,m]=s.split(':').map(Number);let v=h*60+m;if(v<360)v+=1440;return v};
  return [...(Array.isArray(a)?a:[])].slice(0,5).sort((x,y)=>k(x?.time)-k(y?.time));
}
function sanitizeQuestionnaire(v:any){
  if(!v||typeof v!=='object'||Array.isArray(v))return {};
  const raw=JSON.stringify(v);if(raw.length>140000)throw new Error('questionnaire_too_large');
  return JSON.parse(raw);
}
function validateQuestionnaire(q:any,files:any[]){
  const e:string[]=[];
  const n1=txt(q?.couple?.name1,30),n2=txt(q?.couple?.name2,30),date=txt(q?.couple?.date,20);
  if(!n1)e.push('Falta el primer nombre.');
  if(!n2)e.push('Falta el segundo nombre.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))e.push('Revisa la fecha de la boda.');
  if(q?.couple?.coverPlaceEnabled===true&&!txt(q?.couple?.coverPlace,36))e.push('Falta el lugar de portada.');
  if(q?.couple?.coverTimeEnabled===true&&!txt(q?.couple?.coverTime,10))e.push('Falta la hora de portada.');
  if(q?.story?.enabled&&q?.story?.textMode==='custom'&&!txt(q?.story?.customText,450))e.push('Escribe el texto de vuestra historia o elige uno de los textos propuestos.');
  if(q?.story?.enabled&&q?.story?.textMode==='custom'&&txt(q?.story?.customText,451).length>450)e.push('El texto de historia supera 450 caracteres.');
  const loc=q?.locations||{},mode=loc.mode==='split'?'split':'shared';
  if(mode==='shared'){
    if(!txt(loc?.shared?.name,55))e.push('Falta el lugar de la boda.');
    if(!txt(loc?.shared?.time,10))e.push('Falta la hora de inicio.');
  }else{
    if(!txt(loc?.ceremony?.name,55)||!txt(loc?.ceremony?.time,10))e.push('Completa ceremonia.');
    if(!txt(loc?.celebration?.name,55)||!txt(loc?.celebration?.time,10))e.push('Completa celebración.');
  }
  if(q?.agenda?.enabled){
    const m=Array.isArray(q.agenda.moments)?q.agenda.moments:[];
    if(m.length<1||m.length>5)e.push('Añade entre 1 y 5 momentos.');
    if(m.some((x:any)=>!txt(x?.time,10)||!txt(x?.label,28)))e.push('Completa hora y nombre de cada momento.');
  }
  const pr=q?.practical||{},bus=pr.bus||{},gift=pr.gift||{},playlist=pr.playlist||{};
  if(bus.enabled===true){
    if(!Array.isArray(bus.pickupPoints)||!bus.pickupPoints.some((x:any)=>txt(x,120)))e.push('Completa el punto de salida del bus.');
    if(!Array.isArray(bus.outboundTimes)||!bus.outboundTimes.some((x:any)=>txt(x,20)))e.push('Completa la hora de ida del bus.');
  }
  if(gift.enabled===true){
    const gm=txt(gift.mode||'',40);
    if(gm==='bank'&&!txt(gift.iban,80))e.push('Añade el IBAN para el regalo.');
    if(gm==='bizum'&&!txt(gift.phone,40))e.push('Añade el teléfono de Bizum.');
    if(gm==='external_link'&&!txt(gift.url,800))e.push('Añade el enlace de la lista de regalos.');
    if(gm==='short_text'&&!txt(gift.message,240))e.push('Escribe el mensaje de regalo.');
  }
  if(playlist.enabled===true&&!txt(playlist.url,800))e.push('Añade el enlace de la playlist.');
  if(q?.gallery?.enabled){
    const count=files.filter((x:any)=>String(x.slot||'').startsWith('gallery-')).length;
    if(count<1)e.push('Añade al menos una foto a la galería.');
  }
  if(q?.confirmation?.reviewed!==true)e.push('Confirma que habéis revisado los datos.');
  return e;
}
const STORY:any={
  'story-01':'Llevamos años compartiendo planes, viajes, domingos tranquilos y muchas risas. Ahora nos hace muchísima ilusión celebrar el siguiente capítulo con vosotros.',
  'story-02':'No sabemos exactamente cuándo empezó todo, pero sí sabemos que desde entonces la vida es mucho más divertida juntos. Y este día no tendría sentido sin vosotros.',
  'story-03':'Entre planes improvisados, viajes, cenas que se alargan y días de sofá, hemos ido construyendo lo nuestro. Ahora toca celebrarlo con nuestra gente.',
  'story-04':'Después de tantos momentos compartidos, ha llegado uno que queremos vivir rodeados de las personas que forman parte de nuestra historia: vosotros.',
  'story-05':'Nos elegimos hace tiempo y seguimos eligiéndonos cada día. Ahora queremos celebrarlo como más nos gusta: con nuestra familia y amigos cerca.'
};
function fileRef(slot:string){return 'upload:'+slot}
function buildConfig(q:any,files:any[],rsvpRoute='#',templateId='veil-light',templateVersion=''){
  const spec=templateSpec(templateId),pinnedVersion=txt(templateVersion,40)||spec.version;
  const couple=q?.couple||{},story=q?.story||{},loc=q?.locations||{},agenda=q?.agenda||{},p=q?.practical||{},r=q?.rsvp||{},gallery=q?.gallery||{},closing=q?.closing||{};
  const has=(slot:string)=>files.some((x:any)=>x.slot===slot);
  const mode=loc.mode==='split'?'split':'shared';
  const items=mode==='split'?
    [
      {type:'ceremony',time:txt(loc?.ceremony?.time,10),name:txt(loc?.ceremony?.name,55),address:txt(loc?.ceremony?.address,100),mapsUrl:txt(loc?.ceremony?.mapsUrl,800),websiteUrl:txt(loc?.ceremony?.websiteUrl,800)},
      {type:'celebration',time:txt(loc?.celebration?.time,10),name:txt(loc?.celebration?.name,55),address:txt(loc?.celebration?.address,100),mapsUrl:txt(loc?.celebration?.mapsUrl,800),websiteUrl:txt(loc?.celebration?.websiteUrl,800)}
    ]:
    [{type:'shared',time:txt(loc?.shared?.time,10),name:txt(loc?.shared?.name,55),address:txt(loc?.shared?.address,100),mapsUrl:txt(loc?.shared?.mapsUrl,800),websiteUrl:txt(loc?.shared?.websiteUrl,800)}];
  const bus=p?.bus||{},acc=p?.accommodation||{},gift=p?.gift||{},play=p?.playlist||{};
  let giftDetails='';
  if(gift.enabled){
    if(gift.mode==='bank')giftDetails=[gift.holder?('Titular: '+txt(gift.holder,120)):'',gift.iban?('IBAN: '+txt(gift.iban,80)):'',gift.bic?('BIC/SWIFT: '+txt(gift.bic,40)):''].filter(Boolean).join('\n');
    if(gift.mode==='bizum')giftDetails=[gift.phone?('Bizum: '+txt(gift.phone,40)):'',gift.reference?txt(gift.reference,120):''].filter(Boolean).join('\n');
    if(gift.mode==='short_text')giftDetails=txt(gift.message,240);
  }
  const galleryFiles=files.filter((x:any)=>String(x.slot||'').startsWith('gallery-')).sort((a:any,b:any)=>String(a.slot).localeCompare(String(b.slot))).slice(0,4);
  return {
    template:{id:spec.id,version:pinnedVersion,typographyVariant:(Array.isArray(spec.typographyVariants)&&spec.typographyVariants.includes(couple.typographyVariant))?couple.typographyVariant:spec.defaultTypographyVariant},
    locale:'es',
    couple:{name1:txt(couple.name1,30),name2:txt(couple.name2,30)},
    wedding:{date:txt(couple.date,20),time:couple.coverTimeEnabled?txt(couple.coverTime,10):(items[0]?.time||''),coverPlace:couple.coverPlaceEnabled?txt(couple.coverPlace,36):''},
    cover:{showPlace:couple.coverPlaceEnabled===true,showTime:couple.coverTimeEnabled===true},
    countdown:{enabled:q?.countdown?.enabled!==false},
    story:{
      enabled:story.enabled===true,
      textMode:story.textMode==='custom'?'custom':'preset',
      presetId:STORY[story.presetId]?story.presetId:'story-03',
      body:story.textMode==='custom'?txt(story.customText,450):'',
      photo:story.enabled&&has('story')?{src:fileRef('story'),fit:'crop',focusX:50,focusY:50,autoFrame:true,alt:'Foto de la pareja'}:null
    },
    locations:{
      mode,
      heroPhoto:has('venue')?{src:fileRef('venue'),fit:'crop',focusX:50,focusY:50,alt:'Lugar de celebración'}:null,
      items,
      dressCode:{enabled:loc.dressCodeEnabled===true,text:txt(loc.dressCode,60)}
    },
    agenda:{enabled:agenda.enabled===true,moments:sortedMoments(agenda.moments||[]).map((x:any)=>({time:txt(x.time,10),label:txt(x.label,28)}))},
    practical:{
      bus:{
        enabled:bus.enabled===true,
        pickupPoints:(Array.isArray(bus.pickupPoints)?bus.pickupPoints:[]).map((x:any)=>txt(x,120)).filter(Boolean).slice(0,3),
        outboundTimes:(Array.isArray(bus.outboundTimes)?bus.outboundTimes:[]).map((x:any)=>txt(x,20)).filter(Boolean).slice(0,3),
        returnTimes:(Array.isArray(bus.returnTimes)?bus.returnTimes:[]).map((x:any)=>txt(x,20)).filter(Boolean).slice(0,4),
        note:txt(bus.note,120),mapsUrl:txt(bus.mapsUrl,800)
      },
      accommodation:{
        enabled:acc.enabled===true,
        mode:txt(acc.mode||'recommended',40).toLowerCase(),
        name:txt(acc.name,140),address:txt(acc.address,180),websiteUrl:txt(acc.websiteUrl,800),
        bookingCode:txt(acc.bookingCode,100),bookingName:txt(acc.bookingName,120),discountText:txt(acc.discountText,160),
        deadline:txt(acc.deadline,40),externalBookingUrl:txt(acc.externalBookingUrl,800)||null,
        note:txt(acc.note,180),phone:txt(acc.phone,60),mapsUrl:txt(acc.mapsUrl,800)
      },
      gift:{
        enabled:gift.enabled===true,
        mode:txt(gift.mode||'short_text',40).toLowerCase(),
        displayText:txt(gift.displayText||'Si os apetece tener un detalle.',160),
        details:giftDetails,
        externalUrl:gift.mode==='external_link'?txt(gift.url,800):null
      },
      playlist:{
        enabled:play.enabled===true,
        mode:'external_link',
        prompt:txt(play.prompt||'Mandadnos esa canción que no puede faltar.',160),
        url:txt(play.url,800)
      }
    },
    rsvp:{route:rsvpRoute||'#',ctaLabel:'Confirmar asistencia'},
    gallery:{enabled:gallery.enabled===true,photos:galleryFiles.map((x:any)=>({src:fileRef(x.slot),fit:'crop',focusX:50,focusY:50,autoFrame:true,alt:'Foto de la pareja'}))},
    closing:{line:closing.mode==='custom'?txt(closing.customLine,80):'Gracias por formar parte de nuestra historia.'}
  };
}
async function signedFiles(c:any,order:any,ttl=3600){
  const out=[];for(const f of (Array.isArray(order.files)?order.files:[])){
    let url='';if(f.publicUrl)url=f.publicUrl;else if(f.path){const {data}=await c.storage.from('guest-invitation-uploads').createSignedUrl(f.path,ttl);url=data?.signedUrl||''}
    out.push({...f,url});
  }return out;
}
function hydrateConfig(config:any,files:any[]){
  const map=new Map(files.map((x:any)=>[String(x.slot),x.url||x.publicUrl||'']));
  const v=structuredClone(config||{});
  const walk=(x:any)=>{if(Array.isArray(x)){x.forEach(walk);return}if(!x||typeof x!=='object')return;for(const k of Object.keys(x)){if(typeof x[k]==='string'&&x[k].startsWith('upload:'))x[k]=map.get(x[k].slice(7))||'';else walk(x[k])}};
  walk(v);return v;
}
async function createOrder(c:any,mode:'test'|'production',buyerEmail:string,licenseId:string|null,checkoutSessionId:string|null,templateId='veil-light'){
  const spec=templateSpec(templateId),id=crypto.randomUUID(),qToken=await capability(id,'q'),rToken=await capability(id,'r'),pToken=await capability(id,'p');
  const row={id,mode,license_id:licenseId,checkout_session_id:checkoutSessionId,buyer_email:txt(buyerEmail,200).toLowerCase(),template_id:spec.id,template_version:spec.version,status:'draft',questionnaire_token_hash:await sha256(qToken),review_token_hash:await sha256(rToken),public_token_hash:await sha256(pToken),questionnaire:{},resolved_config:{},files:[],created_at:now(),updated_at:now()};
  const {error}=await c.from('guest_invitation_orders').insert(row);if(error)throw error;
  return{id,qToken,rToken,pToken};
}
async function copyPublicFiles(c:any,order:any){
  const files=Array.isArray(order.files)?order.files:[],next=[];for(const f of files){
    if(f.publicUrl){next.push(f);continue}
    const {data,error}=await c.storage.from('guest-invitation-uploads').download(f.path);if(error)throw error;
    const ext=String(f.path||'').split('.').pop()||'bin',dest=order.id+'/'+String(f.slot)+'-'+crypto.randomUUID().slice(0,8)+'.'+ext;
    const {error:ue}=await c.storage.from('guest-invitation-public').upload(dest,data,{contentType:f.mime||'application/octet-stream',upsert:false,cacheControl:'31536000'});if(ue)throw ue;
    const {data:pu}=c.storage.from('guest-invitation-public').getPublicUrl(dest);
    next.push({...f,publicPath:dest,publicUrl:pu.publicUrl});
  }
  return next;
}
async function getOrder(c:any,id:string){const {data,error}=await c.from('guest_invitation_orders').select('*').eq('id',id).maybeSingle();if(error)throw error;return data||null}
function orderLabel(o:any){const q=o.questionnaire||{};return [txt(q?.couple?.name1,30),txt(q?.couple?.name2,30)].filter(Boolean).join(' & ')||'Cuestionario sin completar'}
async function internalSubmittedEmail(order:any){
  const q=order.questionnaire||{},label=orderLabel(order),link=site()+'/guest-orders-admin-v2.html';
  const action=order.mode==='test'
    ? '<p><b>Piloto:</b> abre GUEST_PRODUCTION_MANAGER_V3.html para continuar con el encargo.</p>'
    : '<p><a href="'+esc(link)+'">Abrir gestor de encargos</a></p>';
  return resend({to:['weddlysmartdesign@gmail.com'],subject:'Nuevo encargo GUEST · '+label,html:`<div lang="es" style="font-family:Arial,sans-serif;color:#2c2a26"><h2>Nuevo encargo GUEST</h2><p><b>${esc(label)}</b></p><p>Estado: datos recibidos.</p>${action}<p style="font-size:12px;color:#736f63">ID ${esc(order.id)}</p></div>`},'guest-invitation-submitted/'+order.id)
}
Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);
  try{
    const c=db(),ct=req.headers.get('content-type')||'';
    if(ct.includes('multipart/form-data')){
      const fd=await req.formData(),action=String(fd.get('action')||'');
      if(action!=='upload')return json({ok:false,error:'invalid_action'},400);
      const token=String(fd.get('token')||''),slot=String(fd.get('slot')||''),file=fd.get('file');
      const allowedSlots=['story','venue','gallery-1','gallery-2','gallery-3','gallery-4'];
      if(!allowedSlots.includes(slot)||!(file instanceof File))return json({ok:false,error:'invalid_upload'},400);
      if(file.size<1||file.size>15728640)return json({ok:false,error:'file_too_large'},400);
      const mime=String(file.type||'').toLowerCase();if(!['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(mime))return json({ok:false,error:'invalid_file_type'},400);
      const order=await findByToken(c,token,'questionnaire_token_hash');if(!order)return json({ok:false,error:'invalid_token'},403);
      if(!['draft','changes_requested'].includes(order.status))return json({ok:false,error:'questionnaire_locked'},409);
      const ext=mime==='image/jpeg'?'jpg':mime==='image/png'?'png':mime==='image/webp'?'webp':mime==='image/heic'?'heic':'heif';
      const path=order.id+'/'+slot+'/'+crypto.randomUUID()+'.'+ext;
      const {error:up}=await c.storage.from('guest-invitation-uploads').upload(path,file,{contentType:mime,upsert:false});if(up)throw up;
      const existing=(Array.isArray(order.files)?order.files:[]).find((x:any)=>x.slot===slot);
      if(existing?.path)await c.storage.from('guest-invitation-uploads').remove([existing.path]);
      const entry={slot,path,name:txt(file.name,220),mime,size:file.size,uploadedAt:now()};
      const files=[...(Array.isArray(order.files)?order.files:[]).filter((x:any)=>x.slot!==slot),entry].sort((a:any,b:any)=>String(a.slot).localeCompare(String(b.slot)));
      const {error:ue}=await c.from('guest_invitation_orders').update({files,updated_at:now()}).eq('id',order.id);if(ue)throw ue;
      const {data:su}=await c.storage.from('guest-invitation-uploads').createSignedUrl(path,3600);
      return json({ok:true,file:{...entry,url:su?.signedUrl||''}});
    }
    const raw=await req.text();if(raw.length>220000)return json({ok:false,error:'body_too_large'},413);
    let b:any={};try{b=JSON.parse(raw||'{}')}catch{return json({ok:false,error:'invalid_json'},400)}
    const action=String(b.action||'');
    if(action==='load'){
      const order=await findByToken(c,String(b.token||''),'questionnaire_token_hash');if(!order)return json({ok:false,error:'invalid_token'},403);
      return json({ok:true,order:{id:order.id,mode:order.mode,status:order.status,buyerEmail:order.buyer_email,templateId:order.template_id,questionnaire:order.questionnaire||{},files:await signedFiles(c,order)}});
    }
    if(action==='save'){
      const order=await findByToken(c,String(b.token||''),'questionnaire_token_hash');if(!order)return json({ok:false,error:'invalid_token'},403);
      if(!['draft','changes_requested'].includes(order.status))return json({ok:false,error:'questionnaire_locked'},409);
      const questionnaire=sanitizeQuestionnaire(b.questionnaire||{}),email=emailOf(questionnaire,order.buyer_email),ts=now();
      const {error}=await c.from('guest_invitation_orders').update({questionnaire,buyer_email:email,updated_at:ts}).eq('id',order.id);if(error)throw error;
      return json({ok:true,savedAt:ts});
    }
    if(action==='remove_file'){
      const order=await findByToken(c,String(b.token||''),'questionnaire_token_hash');if(!order)return json({ok:false,error:'invalid_token'},403);
      if(!['draft','changes_requested'].includes(order.status))return json({ok:false,error:'questionnaire_locked'},409);
      const slot=String(b.slot||''),old=(Array.isArray(order.files)?order.files:[]).find((x:any)=>x.slot===slot);if(old?.path)await c.storage.from('guest-invitation-uploads').remove([old.path]);
      const files=(Array.isArray(order.files)?order.files:[]).filter((x:any)=>x.slot!==slot);
      const {error}=await c.from('guest_invitation_orders').update({files,updated_at:now()}).eq('id',order.id);if(error)throw error;
      return json({ok:true});
    }
    if(action==='submit'){
      const order=await findByToken(c,String(b.token||''),'questionnaire_token_hash');if(!order)return json({ok:false,error:'invalid_token'},403);
      if(!['draft','changes_requested'].includes(order.status))return json({ok:false,error:'questionnaire_locked'},409);
      const questionnaire=sanitizeQuestionnaire(b.questionnaire||{}),errors=validateQuestionnaire(questionnaire,order.files||[]);if(errors.length)return json({ok:false,error:'validation_failed',errors},400);
      const config=buildConfig(questionnaire,order.files||[],'#',order.template_id,order.template_version),ts=now(),email=emailOf(questionnaire,order.buyer_email);
      const {error}=await c.from('guest_invitation_orders').update({questionnaire,resolved_config:config,buyer_email:email,status:'submitted',submitted_at:ts,updated_at:ts}).eq('id',order.id);if(error)throw error;
      const fresh={...order,questionnaire,resolved_config:config,buyer_email:email,status:'submitted',submitted_at:ts};
      await internalSubmittedEmail(fresh);
      if(email){
        const steps='<div style="font-size:11px;letter-spacing:.15em;font-weight:700;color:#aa8472;margin-bottom:8px">QUÉ PASA A PARTIR DE AHORA</div>'
          +'<table role="presentation" width="100%" cellspacing="0" cellpadding="0">'
          +emailStep('01','Datos recibidos','Ya tenemos la información que nos habéis enviado.')
          +emailStep('02','Preparamos','Montamos vuestra invitación con el diseño que habéis elegido.')
          +emailStep('03','Revisáis','Os enviaremos la invitación completa para comprobar todos los detalles.')
          +emailStep('04','Entrega','Cuando la aprobéis, recibiréis la versión definitiva para compartir.')
          +'</table>';
        const html=emailBox(
          'PEDIDO RECIBIDO',
          'Ya tenemos vuestros datos.',
          coupleGreeting(questionnaire)+' Hemos recibido correctamente la información de vuestra invitación.',
          emailPanel(steps)+'<p style="font-size:14px;line-height:1.6;color:#83756b">Por ahora no tenéis que hacer nada más. Os escribiremos cuando vuestra invitación esté preparada para revisar.</p>'
        );
        await resend({to:[email],subject:'Hemos recibido vuestros datos',html},'guest-questionnaire-confirm/'+order.id);
      }
      return json({ok:true,submittedAt:ts});
    }
    if(action==='review_load'){
      const order=await findByToken(c,String(b.token||''),'review_token_hash');if(!order)return json({ok:false,error:'invalid_token'},403);
      if(!['review_ready','review_sent','changes_requested','approved','delivered'].includes(order.status))return json({ok:false,error:'review_not_ready'},409);
      const files=await signedFiles(c,order,7200),config=hydrateConfig(order.resolved_config||{},files);
      return json({ok:true,order:{id:order.id,status:order.status,label:orderLabel(order),config,revisionCount:order.revision_count||0}});
    }
    if(action==='review_respond'){
      const order=await findByToken(c,String(b.token||''),'review_token_hash');if(!order)return json({ok:false,error:'invalid_token'},403);
      const decision=String(b.decision||'');if(!['approve','changes'].includes(decision))return json({ok:false,error:'invalid_decision'},400);
      if(!['review_ready','review_sent','changes_requested'].includes(order.status))return json({ok:false,error:'review_locked'},409);
      const ts=now();
      if(decision==='approve'){
        const {error}=await c.from('guest_invitation_orders').update({status:'approved',approved_at:ts,updated_at:ts}).eq('id',order.id);if(error)throw error;
        await resend({to:['weddlysmartdesign@gmail.com'],subject:'Invitación GUEST aprobada · '+orderLabel(order),html:'<p>La pareja ha aprobado la invitación. Pedido <b>'+esc(order.id)+'</b>.</p>'},'guest-review-approved/'+order.id);
        return json({ok:true,status:'approved'});
      }
      const note=txt(b.note,1500);if(!note)return json({ok:false,error:'changes_note_required'},400);
      const history=[...(Array.isArray(order.revision_requests)?order.revision_requests:[]),{at:ts,note}];
      const {error}=await c.from('guest_invitation_orders').update({status:'changes_requested',revision_count:Number(order.revision_count||0)+1,revision_requests:history,updated_at:ts}).eq('id',order.id);if(error)throw error;
      await resend({to:['weddlysmartdesign@gmail.com'],subject:'Cambios solicitados · '+orderLabel(order),html:'<p><b>'+esc(orderLabel(order))+'</b></p><p>'+esc(note).replaceAll('\n','<br>')+'</p>'},'guest-review-changes/'+order.id+'/'+String(order.revision_count||0));
      return json({ok:true,status:'changes_requested'});
    }
    if(action==='public_load'){
      const order=await findByToken(c,String(b.token||''),'public_token_hash');if(!order)return json({ok:false,error:'invalid_token'},403);
      if(order.status!=='delivered')return json({ok:false,error:'not_delivered'},409);
      const files=await signedFiles(c,order,86400),config=hydrateConfig(order.resolved_config||{},files);
      return json({ok:true,order:{id:order.id,label:orderLabel(order),config}});
    }

    if(action==='active_for_member'){
      const mc=await memberContext(c,req);if(!mc)return json({ok:false,error:'member_required'},403);
      const {data:order,error}=await c.from('guest_invitation_orders')
        .select('id,template_id,template_version,status,questionnaire,delivery_url,delivered_at,updated_at')
        .eq('license_id',mc.licenseId).eq('status','delivered')
        .order('delivered_at',{ascending:false}).limit(1).maybeSingle();
      if(error)throw error;
      if(!order||!txt(order.delivery_url,1200))return json({ok:true,active:false});
      const spec=templateSpec(order.template_id),token=await capability(order.id,'p');
      return json({ok:true,active:true,invitation:{
        orderId:order.id,
        templateId:spec.id,
        templateVersion:order.template_version||spec.version,
        renderer:spec.renderer,
        publicToken:token,
        shareBaseUrl:txt(order.delivery_url,1200),
        label:orderLabel(order)
      }});
    }
    const ctx=await managerContext(c,req);if(!ctx)return json({ok:false,error:'manager_required'},403);
    if(action==='status')return json({ok:true});
    if(action==='create_test'){
      const o=await createOrder(c,'test',txt(b.email,200),null,null,txt(b.templateId||'veil-light',80));return json({ok:true,...o},201);
    }
    if(action==='list'){
      const {data:rows,error}=await c.from('guest_invitation_orders').select('id,mode,buyer_email,template_id,status,questionnaire,created_at,updated_at,submitted_at,designing_at,review_sent_at,approved_at,delivered_at,revision_count').order('updated_at',{ascending:false}).limit(200);if(error)throw error;
      return json({ok:true,orders:(rows||[]).map((x:any)=>({id:x.id,mode:x.mode,buyerEmail:x.buyer_email,templateId:x.template_id,status:x.status,label:orderLabel(x),weddingDate:txt(x.questionnaire?.couple?.date,20),createdAt:x.created_at,updatedAt:x.updated_at,submittedAt:x.submitted_at,reviewSentAt:x.review_sent_at,approvedAt:x.approved_at,deliveredAt:x.delivered_at,revisionCount:x.revision_count||0}))});
    }
    if(action==='detail'){
      const order=await getOrder(c,String(b.orderId||''));if(!order)return json({ok:false,error:'order_not_found'},404);
      const files=await signedFiles(c,order,7200),config=hydrateConfig(order.resolved_config||{},files);
      return json({ok:true,order:{...order,files,hydratedConfig:config,questionnaireToken:await capability(order.id,'q'),reviewToken:await capability(order.id,'r'),publicToken:await capability(order.id,'p')}});
    }
    if(action==='start_design'){
      const order=await getOrder(c,String(b.orderId||''));if(!order)return json({ok:false,error:'order_not_found'},404);
      if(!['submitted','changes_requested','designing'].includes(order.status))return json({ok:false,error:'invalid_status'},409);
      const config=buildConfig(order.questionnaire||{},order.files||[],'#',order.template_id,order.template_version),ts=now();
      const {error}=await c.from('guest_invitation_orders').update({status:'designing',designing_at:order.designing_at||ts,resolved_config:config,updated_at:ts}).eq('id',order.id);if(error)throw error;
      const files=await signedFiles(c,{...order,resolved_config:config},7200);
      return json({ok:true,status:'designing',config:hydrateConfig(config,files),reviewToken:await capability(order.id,'r')});
    }
    if(action==='set_config'){
      const order=await getOrder(c,String(b.orderId||''));if(!order)return json({ok:false,error:'order_not_found'},404);
      if(!['designing','changes_requested','submitted'].includes(order.status))return json({ok:false,error:'invalid_status'},409);
      const config=b.config&&typeof b.config==='object'?b.config:null;if(!config)return json({ok:false,error:'invalid_config'},400);
      const rawCfg=JSON.stringify(config);if(rawCfg.length>120000)return json({ok:false,error:'config_too_large'},400);
      const {error}=await c.from('guest_invitation_orders').update({resolved_config:config,status:'designing',updated_at:now()}).eq('id',order.id);if(error)throw error;return json({ok:true});
    }
    if(action==='mark_review_ready'){
      const order=await getOrder(c,String(b.orderId||''));if(!order)return json({ok:false,error:'order_not_found'},404);
      if(!['designing','changes_requested','submitted'].includes(order.status))return json({ok:false,error:'invalid_status'},409);
      const missing=validateQuestionnaire(order.questionnaire||{},order.files||[]).filter((x:string)=>x!=='Confirma que habéis revisado los datos.');
      if(missing.length)return json({ok:false,error:'incomplete_order',errors:missing},400);
      const ts=now(),config=Object.keys(order.resolved_config||{}).length?order.resolved_config:buildConfig(order.questionnaire||{},order.files||[],'#',order.template_id,order.template_version);
      const {error}=await c.from('guest_invitation_orders').update({status:'review_ready',resolved_config:config,updated_at:ts}).eq('id',order.id);if(error)throw error;
      return json({ok:true,status:'review_ready',reviewToken:await capability(order.id,'r')});
    }
    if(action==='send_review'){
      const order=await getOrder(c,String(b.orderId||''));if(!order)return json({ok:false,error:'order_not_found'},404);
      if(!['review_ready','review_sent'].includes(order.status))return json({ok:false,error:'invalid_status'},409);
      const email=emailOf(order.questionnaire,order.buyer_email);if(!email)return json({ok:false,error:'missing_email'},400);
      const token=await capability(order.id,'r'),supplied=txt(b.reviewUrl,1200),localTest=order.mode==='test'&&!supplied,reviewUrl=supplied||(!localTest?site()+'/guest-review-v1.html?t='+encodeURIComponent(token):''),ts=now();
      const reviewSteps='<div style="font-size:11px;letter-spacing:.15em;font-weight:700;color:#aa8472;margin-bottom:8px">REVISAD ESTOS DETALLES</div>'
        +'<table role="presentation" width="100%" cellspacing="0" cellpadding="0">'
        +emailStep('01','Datos principales','Nombres, fecha y horarios.')
        +emailStep('02','Lugares y enlaces','Direcciones, mapas, alojamiento, transporte y enlaces.')
        +emailStep('03','Textos','Historia, agenda, regalo, playlist y cualquier texto personal.')
        +'</table>';
      const content=localTest
        ? emailBox('REVISIÓN DE PRUEBA','Vuestra invitación ya está preparada.','La revisión del pedido de prueba está lista.',emailPanel(reviewSteps)+'<p style="font-size:14px;line-height:1.6;color:#83756b">Revisadla completa en el entorno de validación y desde allí podréis aprobarla o solicitar cambios.</p>')
        : emailBox(
            'REVISIÓN',
            'Vuestra invitación ya está preparada.',
            'Ya podéis verla completa y comprobar con calma que todo está exactamente como queréis.',
            emailPanel(reviewSteps)
              +'<div style="margin:18px 0;padding:16px;border-radius:16px;background:#f7f1ec;font-size:14px;line-height:1.55"><b>Si todo está bien</b>, la aprobáis desde la misma pantalla.<br><br><b>Si queréis cambiar algo</b>, nos indicáis allí mismo qué necesitáis modificar.</div>'
              +emailButton(reviewUrl,'Revisar nuestra invitación')
              +'<p style="font-size:13px;line-height:1.55;color:#83756b">No hace falta responder a este correo para pedir cambios: la pantalla de revisión os guía en todo el proceso.</p>'
          );
      const ok=await resend({to:[email],subject:localTest?'Revisión de prueba preparada':'Vuestra invitación está lista para revisar',html:content},'guest-review-send/'+order.id+'/'+String(order.revision_count||0));
      if(!ok)return json({ok:false,error:'email_failed'},502);
      const {error}=await c.from('guest_invitation_orders').update({status:'review_sent',review_sent_at:ts,updated_at:ts}).eq('id',order.id);if(error)throw error;
      return json({ok:true,status:'review_sent',reviewUrl,reviewToken:token,localTest});
    }
    if(action==='deliver'){
      const order=await getOrder(c,String(b.orderId||''));if(!order)return json({ok:false,error:'order_not_found'},404);
      if(order.status!=='approved')return json({ok:false,error:'approval_required'},409);
      const email=emailOf(order.questionnaire,order.buyer_email);if(!email)return json({ok:false,error:'missing_email'},400);
      const files=await copyPublicFiles(c,order),publicFiles=files.map((x:any)=>({...x,url:x.publicUrl||''})),config=hydrateConfig(order.resolved_config||{},publicFiles),ts=now(),token=await capability(order.id,'p'),supplied=txt(b.invitationUrl,1200),localTest=order.mode==='test'&&!supplied,inviteUrl=supplied;
      if(order.mode==='production'&&!inviteUrl)return json({ok:false,error:'missing_invitation_url'},400);
      let accessUrl='';
      if(order.license_id){
        const {data:d}=await c.from('license_delivery_codes').select('activation_code').eq('license_id',order.license_id).maybeSingle();
        if(d?.activation_code)accessUrl=site()+'/guest/access.html#code='+encodeURIComponent(String(d.activation_code));
      }
      if(order.mode==='production'&&!order.license_id)return json({ok:false,error:'missing_management_license'},409);
      if(order.mode==='production'&&!accessUrl)return json({ok:false,error:'missing_management_access'},409);
      const deliveryBody=localTest
        ? emailPanel('<div style="font-size:14px;line-height:1.6">La entrega final de esta prueba está disponible en el archivo final del entorno de validación.</div>',true)
        : emailButton(inviteUrl,'Ver nuestra invitación')
          +emailPanel(
             '<div style="font-size:11px;letter-spacing:.15em;font-weight:700;color:#aa8472;margin-bottom:8px">GESTIÓN DE INVITADOS INCLUIDA</div>'
             +'<div style="font-family:Georgia,serif;font-size:24px;line-height:1.15;margin:0 0 10px;color:#4a3e37">Todo lo que viene después, en el mismo sitio.</div>'
             +'<p style="font-size:14px;line-height:1.6;color:#5d5049;margin:0 0 12px">Con vuestra invitación tenéis incluida una app para organizar a vuestros invitados y enviarles esta misma invitación sin tener que llevar respuestas, mesas y cambios por separado.</p>'
             +'<table role="presentation" width="100%" cellspacing="0" cellpadding="0">'
             +emailStep('01','Añadid o importad invitados','Podéis crear personas, grupos y subgrupos.')
             +emailStep('02','Preparad el mensaje','Personalizad el texto que acompañará a la invitación.')
             +emailStep('03','Elegid destinatarios y enviad','Seleccionad personas o unidades de invitación y compartidla desde la gestión.')
             +emailStep('04','Las respuestas llegan solas','Asistencia, acompañantes, menús, transporte y demás datos quedan reunidos automáticamente.')
             +'</table>'
             +'<p style="font-size:13px;line-height:1.55;color:#83756b;margin:14px 0 0">Después, desde el mismo sitio, podréis organizar mesas, mover varios invitados, preparar listados PDF para catering y gestionar eventos extra.</p>'
             ,true)
          +emailButton(accessUrl,'Organizar invitados y enviarla',true)
          +'<p style="font-size:13px;line-height:1.55;color:#83756b">Guardad este correo: será vuestro acceso rápido tanto a la invitación como a la gestión de invitados.</p>';
      const deliveryHtml=emailBox(
        localTest?'ENTREGA DE PRUEBA':'ENTREGA FINAL',
        'Lista para compartir.',
        localTest?'La entrega final de prueba está completada.':'Vuestra invitación está aprobada y terminada. Ya podéis enviarla a vuestros invitados.',
        deliveryBody
      );
      const ok=await resend({to:[email],subject:localTest?'Entrega de prueba completada':'Vuestra invitación está lista para compartir',html:deliveryHtml},'guest-deliver-v3/'+order.id);
      if(!ok)return json({ok:false,error:'email_failed'},502);
      const {error}=await c.from('guest_invitation_orders').update({files,resolved_config:config,delivery_url:inviteUrl||null,status:'delivered',delivered_at:ts,updated_at:ts}).eq('id',order.id);if(error)throw error;
      return json({ok:true,status:'delivered',inviteUrl,accessUrl,publicToken:token,localTest});
    }
    if(action==='owner_note'){
      const order=await getOrder(c,String(b.orderId||''));if(!order)return json({ok:false,error:'order_not_found'},404);
      const {error}=await c.from('guest_invitation_orders').update({owner_notes:txt(b.note,5000),updated_at:now()}).eq('id',order.id);if(error)throw error;return json({ok:true});
    }
    if(action==='reopen'){
      const order=await getOrder(c,String(b.orderId||''));if(!order)return json({ok:false,error:'order_not_found'},404);
      if(order.status==='delivered')return json({ok:false,error:'already_delivered'},409);
      const {error}=await c.from('guest_invitation_orders').update({status:'designing',updated_at:now()}).eq('id',order.id);if(error)throw error;return json({ok:true,status:'designing'});
    }
    return json({ok:false,error:'invalid_action'},400);
  }catch(e){const m=String((e as Error)?.message||'');console.error(e);if(['questionnaire_too_large','invalid_file_type','file_too_large','invalid_upload','changes_note_required','missing_email','invalid_config','config_too_large','template_unavailable','missing_invitation_url','missing_management_license','missing_management_access'].includes(m))return json({ok:false,error:m},400);return json({ok:false,error:'server_error'},500)}
});