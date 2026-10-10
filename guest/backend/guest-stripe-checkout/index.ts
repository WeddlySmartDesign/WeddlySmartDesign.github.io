import { createClient } from 'npm:@supabase/supabase-js@2';

const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type,stripe-signature','Access-Control-Allow-Methods':'POST,OPTIONS','Cache-Control':'no-store'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
const env=(n:string)=>(Deno.env.get(n)||'').trim();
const admin=()=>{const secrets=Deno.env.get('SUPABASE_SECRET_KEYS');const key=secrets?JSON.parse(secrets).default:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');return createClient(Deno.env.get('SUPABASE_URL')!,key!,{auth:{persistSession:false}})};
async function sha256(v:string){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('')}
async function hmacHex(secret:string,value:string){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value));
 return Array.from(new Uint8Array(sig)).map(x=>x.toString(16).padStart(2,'0')).join('')
}
function secureEqual(a:string,b:string){
 if(a.length!==b.length)return false;let d=0;
 for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);
 return d===0
}
function origin(){return env('WEDDLY_SITE_ORIGIN')||'https://weddlysmartdesign.github.io'}
function editionOf(v:unknown){return String(v||'').toLowerCase()==='signature'?'signature':'essential'}
function amountFor(e:string){return e==='signature'?4990:3990}
function normalFor(e:string){return e==='signature'?5990:4990}
function labelFor(e:string){return e==='signature'?'GUEST Signature':'GUEST Essential'}
function descriptionFor(e:string){return e==='signature'?'Invitación digital Signature personalizada + RSVP + gestión GUEST':'Invitación digital Essential personalizada + RSVP + gestión GUEST'}
// Optional certified-catalog purchases only. Existing Essential/Signature checkout is unchanged.
// The operator-owned GUEST_CATALOG_SALE_OPTIONS is a deployment gate, NOT client input:
// {"veil-light":{"version":"5.3.3","status":"commercially-frozen","edition":"signature","amountCents":4990}}
// Never configure pending Botánica; no GUEST catalog sale is enabled by default.
function catalogSaleOption(raw:any,edition:string){
 const id=String(raw||'').trim().toLowerCase();
 if(!id)return null;
 if(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id))throw new Error('catalog_template_not_for_sale');
 let published:any={};
 try{published=JSON.parse(env('GUEST_CATALOG_SALE_OPTIONS')||'{}')}catch{throw new Error('catalog_not_configured')}
 const option=published&&Object.prototype.hasOwnProperty.call(published,id)?published[id]:null;
 if(!option||option.status!=='commercially-frozen'||option.edition!==edition||
    option.amountCents!==amountFor(edition)||typeof option.version!=='string'||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,30}$/.test(option.version))
  throw new Error('catalog_template_not_for_sale');
 return {id,version:option.version};
}
function activationCode(){const a=crypto.randomUUID().replaceAll('-','').toUpperCase(),b=crypto.randomUUID().replaceAll('-','').toUpperCase();return `WSD-GUEST-${a.slice(0,8)}-${a.slice(8,16)}-${b.slice(0,8)}`}
function normalizeCode(v:string){return String(v||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'')}
async function stripeRequest(path:string,init:RequestInit={}){
 const secret=env('STRIPE_SECRET_KEY');if(!secret)throw new Error('stripe_not_configured');
 const r=await fetch('https://api.stripe.com/v1'+path,{...init,headers:{Authorization:'Bearer '+secret,...(init.headers||{})}});
 const x=await r.json().catch(()=>({}));if(!r.ok){console.warn('stripe_error',r.status,x);if(r.status===404)throw new Error('session_not_found');if(r.status===401||r.status===403)throw new Error('stripe_not_configured');if(r.status===429)throw new Error('stripe_temporarily_unavailable');throw new Error('stripe_request_failed')}return x
}
async function createSession(edition:string,consent:boolean,attempt:any,requestedTemplateId:any){
 if(!consent)throw new Error('consent_required');
 const key=String(attempt||'').trim();if(!/^[A-Za-z0-9-]{16,100}$/.test(key))throw new Error('invalid_checkout_attempt');
 const option=catalogSaleOption(requestedTemplateId,edition);
 const amount=amountFor(edition),base=origin(),p=new URLSearchParams();
 p.set('ui_mode','embedded_page');p.set('mode','payment');p.set('locale','es');p.set('submit_type','pay');
 p.set('billing_address_collection','auto');p.set('customer_creation','always');p.set('redirect_on_completion','always');
 p.set('return_url',base+'/guest-checkout-return.html?session_id={CHECKOUT_SESSION_ID}');
 p.set('client_reference_id','guest_'+crypto.randomUUID());
 p.set('line_items[0][quantity]','1');p.set('line_items[0][price_data][currency]','eur');
 p.set('line_items[0][price_data][unit_amount]',String(amount));
 p.set('line_items[0][price_data][product_data][name]',labelFor(edition)+' by WeddlySmartDesign');
 p.set('line_items[0][price_data][product_data][description]',descriptionFor(edition));
 p.set('metadata[product]','guest');p.set('metadata[edition]',edition);p.set('metadata[pricing]','launch');
 p.set('metadata[amount_cents]',String(amount));p.set('metadata[start_personalization_consent]','true');
 if(option){
  p.set('metadata[guest_catalog_template_id]',option.id);
  p.set('metadata[guest_catalog_template_version]',option.version);
  p.set('payment_intent_data[metadata][guest_catalog_template_id]',option.id);
  p.set('payment_intent_data[metadata][guest_catalog_template_version]',option.version);
 }
 p.set('payment_intent_data[metadata][product]','guest');p.set('payment_intent_data[metadata][edition]',edition);
 p.set('custom_text[submit][message]','Al pagar confirmas tu pedido GUEST. Después completarás los datos para que personalicemos vuestra invitación.');
 if(['1','true','on','yes'].includes(env('WEDDLY_STRIPE_AUTOMATIC_TAX').toLowerCase()))p.set('automatic_tax[enabled]','true');
 return await stripeRequest('/checkout/sessions',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','Idempotency-Key':'guest-checkout/'+key},body:p.toString()})
}
async function retrieveSession(id:string){
 if(!/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(id))throw new Error('invalid_session');
 return await stripeRequest('/checkout/sessions/'+encodeURIComponent(id)+'?expand[]=line_items.data.price.product')
}
function validatePaid(session:any){
 const edition=editionOf(session?.metadata?.edition);
 if(String(session?.metadata?.product||'')!=='guest')throw new Error('invalid_checkout_session');
 if(session?.status!=='complete'||session?.payment_status!=='paid')throw new Error('not_paid');
 if(Number(session?.amount_total||0)!==amountFor(edition)||String(session?.currency||'').toLowerCase()!=='eur')throw new Error('invalid_checkout_session');
 return edition
}
async function resend(payload:any){
 const key=env('RESEND_API_KEY'),from=env('WEDDLY_RESEND_FROM');if(!key||!from)return false;
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key,...(payload.idempotencyKey?{'Idempotency-Key':payload.idempotencyKey}:{})},body:JSON.stringify({from,reply_to:'weddlysmartdesign@gmail.com',...payload.body})});
 if(!r.ok){console.warn('resend_failed',r.status,await r.text());return false}return true
}
function esc(s:any){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c))}
async function startEmail(to:string,sessionId:string,edition:string){
 const link=origin()+'/guest-order.html?session_id='+encodeURIComponent(sessionId);
 return await resend({idempotencyKey:'guest-start/'+sessionId,body:{to:[to],subject:'Pago recibido · completa vuestra invitación GUEST',html:`<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#2C2A26"><h1 style="font-family:Georgia,serif;font-weight:400">GUEST by WeddlySmartDesign</h1><p>Hemos recibido correctamente el pago de <strong>${esc(labelFor(edition))}</strong>.</p><p>El siguiente paso es sencillo: completa los datos de vuestra invitación y empezaremos a personalizarla.</p><p><a href="${esc(link)}" style="display:inline-block;background:#2C2A26;color:#fff;text-decoration:none;padding:13px 18px;border-radius:10px">Completar datos de la invitación</a></p><p>La entrega prevista es de 24–48 h desde que recibamos los datos necesarios.</p><p style="color:#736F63;font-size:13px">Si tienes cualquier problema, responde a este correo o escribe a weddlysmartdesign@gmail.com.</p></div>`}})
}
/* Paid catalog handoff: reuse the V13 create_paid route after Stripe verification,
 * never create a second database or expose manager credentials to a browser.
 * An empty catalog pin takes the original Essential/Signature path unchanged.
 */
async function paidCatalogQuestionnaire(licenseId:string,metadata:any){
 const templateId=String(metadata?.guest_catalog_template_id||'');
 const version=String(metadata?.guest_catalog_template_version||'');
 if(!templateId)return null;
 if(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(templateId)||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,30}$/.test(version))throw new Error('catalog_invalid_pin');
 const c=admin();
 const {data:owners,error}=await c.from('licenses').select('id,metadata')
   .eq('source','internal_owner').eq('status','active').limit(10);
 if(error)throw error;
 const matches=(owners||[]).filter((x:any)=>x.metadata?.grant_type==='owner');
 if(matches.length!==1)throw new Error('catalog_owner_unavailable');
 const payload=btoa(JSON.stringify({ownerId:matches[0].id,exp:Date.now()+120000}))
   .replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
 const secrets=Deno.env.get('SUPABASE_SECRET_KEYS');
 const key=secrets?String(JSON.parse(secrets).default||''):String(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'');
 if(!key)throw new Error('catalog_manager_unavailable');
 const token='v1.'+payload+'.'+await hmacHex(key,'wsd-owner-manager-v1|'+payload);
 const response=await fetch(env('SUPABASE_URL')+'/functions/v1/guest-invitation-flow',{
   method:'POST',headers:{'content-type':'application/json','x-weddly-manager':token},
   body:JSON.stringify({action:'create_paid',licenseId,templateId}),
   signal:AbortSignal.timeout(15000)});
 const data=await response.json().catch(()=>({}));
 if(!response.ok||!data?.ok||!data?.id||!data?.qToken)throw new Error('catalog_paid_handoff_failed');
 const qToken=String(data.qToken);
 if(qToken.length<32||qToken.length>200)throw new Error('catalog_invalid_questionnaire_token');
 return {templateId,version,orderId:String(data.id),
   questionnaireUrl:origin()+'/guest/catalog-questionnaire.html?t='+encodeURIComponent(qToken)};
}
async function startCatalogEmail(to:string,sessionId:string,edition:string,catalog:any){
 if(!catalog?.questionnaireUrl)throw new Error('catalog_questionnaire_unavailable');
 return await resend({idempotencyKey:'guest-catalog-start/'+sessionId,body:{to:[to],
  subject:'Pago recibido · completa los datos de vuestra invitación',
  html:`<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#2C2A26"><h1 style="font-family:Georgia,serif;font-weight:400">Vuestra invitación empieza aquí.</h1><p>Hemos recibido el pago de <strong>${esc(labelFor(edition))}</strong>.</p><p>El diseño elegido está reservado para vuestro pedido. Rellenad el cuestionario y adjuntad allí las fotografías que queráis incluir.</p><p><a href="${esc(catalog.questionnaireUrl)}" style="display:inline-block;background:#2C2A26;color:#fff;text-decoration:none;padding:13px 18px;border-radius:10px">Completar vuestro cuestionario</a></p><p>Después recibiréis la invitación para revisarla antes de la entrega final.</p><p style="font-size:13px;color:#736F63">Si necesitáis ayuda, responded a este correo o escribid a weddlysmartdesign@gmail.com.</p></div>`}})
}
async function provision(session:any){
 const edition=validatePaid(session),sessionId=String(session.id||''),buyer=String(session.customer_details?.email||session.customer_email||'').trim().toLowerCase();
 if(!buyer.includes('@'))throw new Error('missing_buyer_email');
 const db=admin();
 let {data:existing,error:ee}=await db.from('licenses').select('id,status,metadata').eq('source','stripe').eq('source_order_id',sessionId).maybeSingle();if(ee)throw ee;
 if(existing?.id&&existing.status==='active'){
   const catalog=await paidCatalogQuestionnaire(String(existing.id),existing.metadata);
   if(!existing.metadata?.guest_order_email_sent_at){
     const ok=catalog?await startCatalogEmail(buyer,sessionId,edition,catalog):await startEmail(buyer,sessionId,edition);
     if(ok){const m={...(existing.metadata||{}),guest_order_email_sent_at:new Date().toISOString()};
       await db.from('licenses').update({metadata:m,updated_at:new Date().toISOString()}).eq('id',existing.id);existing.metadata=m}
   }
   return {licenseId:String(existing.id),edition,buyerEmail:buyer,metadata:existing.metadata||{},
     catalogQuestionnaireUrl:catalog?.questionnaireUrl||null}
 }
 const code=activationCode(),hash=await sha256(normalizeCode(code)),created=new Date((Number(session.created)||Math.floor(Date.now()/1000))*1000).toISOString();
 // Pin exactly the catalog template/version that Stripe actually charged for.
 // Never add catalog pins retroactively to legacy Essential/Signature purchases.
 const templateId=String(session.metadata?.guest_catalog_template_id||'').trim();
 const templateVersion=String(session.metadata?.guest_catalog_template_version||'').trim();
 if((templateId||templateVersion)&&(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(templateId)||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,30}$/.test(templateVersion)))
  throw new Error('invalid_checkout_session');
 const metadata={product:'guest',edition,access_kind:'paid',payment_provider:'stripe',stripe_session_id:sessionId,stripe_payment_intent:typeof session.payment_intent==='string'?session.payment_intent:null,amount_total:Number(session.amount_total||amountFor(edition)),currency:'eur',pricing:'launch',guest_personalization_status:'awaiting_details',purchased_at:created,
   ...(templateId?{guest_catalog_template_id:templateId,guest_catalog_template_version:templateVersion}:{})};
 const {data,error}=await db.rpc('provision_weddly_license',{p_source:'stripe',p_source_order_id:sessionId,p_buyer_email:buyer,p_product_ref:'guest_'+edition,p_metadata:metadata,p_activation_code:code,p_purchase_hash:hash});if(error)throw error;
 const row=data?.[0];if(!row?.license_id)throw new Error('license_provision_failed');
 const catalog=await paidCatalogQuestionnaire(String(row.license_id),metadata);
 const sent=catalog?await startCatalogEmail(buyer,sessionId,edition,catalog):await startEmail(buyer,sessionId,edition);
 if(sent){const next={...metadata,guest_order_email_sent_at:new Date().toISOString()};await db.from('licenses').update({metadata:next,updated_at:new Date().toISOString()}).eq('id',row.license_id);metadata.guest_order_email_sent_at=next.guest_order_email_sent_at}
 return {licenseId:String(row.license_id),edition,buyerEmail:buyer,metadata,
   catalogQuestionnaireUrl:catalog?.questionnaireUrl||null}
}
function text(v:any,max=500){return String(v??'').trim().slice(0,max)}
function cleanDetails(x:any,edition:string){
 const designs=edition==='signature'?['Signature 01','Signature 02','Signature 03','Signature 04','Essential 01','Essential 02','Essential 03','Essential 04','Essential 05','Essential 06']:['Essential 01','Essential 02','Essential 03','Essential 04','Essential 05','Essential 06'];
 const design=designs.includes(String(x?.design||''))?String(x.design):'';
 return {couple1:text(x?.couple1,100),couple2:text(x?.couple2,100),weddingDate:text(x?.weddingDate,20),contactPhone:text(x?.contactPhone,40),design,ceremonyTime:text(x?.ceremonyTime,30),ceremonyVenue:text(x?.ceremonyVenue,220),celebrationTime:text(x?.celebrationTime,30),celebrationVenue:text(x?.celebrationVenue,220),invitationText:text(x?.invitationText,1600),rsvpDeadline:text(x?.rsvpDeadline,20),transport:x?.transport===true,accommodation:x?.accommodation===true,children:x?.children===true,menu:x?.menu!==false,allergies:x?.allergies!==false,extraEvents:text(x?.extraEvents,900),notes:text(x?.notes,1800)}
}
async function submitOrder(session:any,raw:any){
 const p=await provision(session),db=admin();
 const {data:l,error}=await db.from('licenses').select('metadata').eq('id',p.licenseId).single();if(error)throw error;
 if(l.metadata?.guest_catalog_template_id)throw new Error('catalog_uses_common_questionnaire');
 if(l.metadata?.guest_order_submitted_at)return {ok:true,submittedAt:l.metadata.guest_order_submitted_at,edition:p.edition,email:p.buyerEmail,alreadySubmitted:true};
 const details=cleanDetails(raw,p.edition);if(!details.design)throw new Error('invalid_design');if(!details.couple1||!details.couple2||!details.weddingDate)throw new Error('missing_order_fields');
 const now=new Date().toISOString();
 const metadata={...(l.metadata||{}),guest_personalization_status:'details_received',guest_order:details,guest_order_submitted_at:now};
 const {error:ue}=await db.from('licenses').update({metadata,updated_at:now}).eq('id',p.licenseId);if(ue)throw ue;
 const internal=`<div style="font-family:Arial,sans-serif;color:#222"><h2>NUEVO PEDIDO GUEST · ${esc(p.edition.toUpperCase())}</h2><p><b>Cliente:</b> ${esc(p.buyerEmail)}<br><b>Pedido:</b> ${esc(session.id)}</p><p><b>Pareja:</b> ${esc(details.couple1)} &amp; ${esc(details.couple2)}<br><b>Fecha:</b> ${esc(details.weddingDate)}<br><b>Teléfono:</b> ${esc(details.contactPhone)}<br><b>Diseño:</b> ${esc(details.design)}</p><p><b>Ceremonia:</b> ${esc(details.ceremonyTime)} · ${esc(details.ceremonyVenue)}<br><b>Celebración:</b> ${esc(details.celebrationTime)} · ${esc(details.celebrationVenue)}</p><p><b>Texto:</b><br>${esc(details.invitationText).replaceAll('\n','<br>')}</p><p><b>RSVP hasta:</b> ${esc(details.rsvpDeadline)}<br><b>Transporte:</b> ${details.transport?'Sí':'No'} · <b>Alojamiento:</b> ${details.accommodation?'Sí':'No'} · <b>Niños:</b> ${details.children?'Sí':'No'} · <b>Menú:</b> ${details.menu?'Sí':'No'} · <b>Alergias:</b> ${details.allergies?'Sí':'No'}</p><p><b>Eventos extra:</b><br>${esc(details.extraEvents).replaceAll('\n','<br>')}</p><p><b>Notas:</b><br>${esc(details.notes).replaceAll('\n','<br>')}</p><p><b>License ID:</b> ${esc(p.licenseId)}</p></div>`;
 await resend({idempotencyKey:'guest-order-internal/'+session.id,body:{to:['weddlysmartdesign@gmail.com'],subject:'Nuevo pedido GUEST · '+details.couple1+' & '+details.couple2,html:internal}});
 await resend({idempotencyKey:'guest-order-confirm/'+session.id,body:{to:[p.buyerEmail],subject:'Ya tenemos los datos de vuestra invitación GUEST',html:`<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#2C2A26"><h1 style="font-family:Georgia,serif;font-weight:400">Ya estamos con vuestra invitación.</h1><p>Hemos recibido los datos de <strong>${esc(details.couple1)} &amp; ${esc(details.couple2)}</strong>.</p><p>Prepararemos vuestra ${esc(labelFor(p.edition))} y os enviaremos la entrega por email. El plazo previsto es de 24–48 h.</p><p>Si el diseño necesita fotografías, os indicaremos cómo enviarlas respondiendo a este correo.</p><p style="color:#736F63;font-size:13px">WeddlySmartDesign · weddlysmartdesign@gmail.com</p></div>`}});
 return {ok:true,submittedAt:now,edition:p.edition,email:p.buyerEmail}
}


async function guestWebhookSecret(){
 const direct=env('GUEST_STRIPE_WEBHOOK_SECRET');if(direct)return direct;
 const url=env('SUPABASE_URL'),key=env('SUPABASE_SERVICE_ROLE_KEY');
 if(!url||!key)return '';
 try{
  const r=await fetch(url+'/rest/v1/rpc/guest_webhook_secret',{method:'POST',headers:{'apikey':key,'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:'{}'});
  if(!r.ok)return '';
  const x=await r.json().catch(()=>null);return typeof x==='string'?x:''
 }catch{return ''}
}
async function verifyWebhook(raw:string,header:string){
 const secret=await guestWebhookSecret();
 if(!secret)throw new Error('webhook_not_configured');
 const parts=header.split(',').map(x=>x.trim());
 const ts=parts.find(x=>x.startsWith('t='))?.slice(2)||'';
 const sigs=parts.filter(x=>x.startsWith('v1=')).map(x=>x.slice(3));
 if(!/^\d+$/.test(ts)||!sigs.length)return false;
 const age=Math.abs(Date.now()/1000-Number(ts));if(age>300)return false;
 const expected=await hmacHex(secret,ts+'.'+raw);
 return sigs.some(x=>secureEqual(x,expected))
}
async function handleWebhook(raw:string,header:string){
 if(!await verifyWebhook(raw,header))return json({ok:false,error:'invalid_signature'},400);
 const evt=JSON.parse(raw||'{}'),type=String(evt.type||''),obj=evt.data?.object||{};
 if((type==='checkout.session.completed'&&obj.payment_status==='paid')||type==='checkout.session.async_payment_succeeded'){
   const session=await retrieveSession(String(obj.id||''));
   const p=await provision(session);
   return json({received:true,provisioned:!!p})
 }
 return json({received:true})
}

Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);
 try{
  const raw=await req.text(),sig=req.headers.get('stripe-signature')||'';
  if(sig)return await handleWebhook(raw,sig);
  let b:any=null;try{b=JSON.parse(raw||'')}catch{}
  if(!b)return json({ok:false,error:'invalid_json'},400);
  const action=String(b.action||'');
  if(action==='config'){
   const pk=env('STRIPE_PUBLISHABLE_KEY')||'pk_live_51UHSpGGsLCo0tfLrCEFrbgR8GuH08Ug3czX35u4W2HUoCjKQSvzOC3ZfRleCXg67h05eytwFeE31ycgw7ozHHLvK00CPs5ZG8P';if(!pk)return json({ok:false,error:'stripe_not_configured'},503);
   return json({ok:true,publishableKey:pk,launch:true,prices:{essential:{current:amountFor('essential'),normal:normalFor('essential')},signature:{current:amountFor('signature'),normal:normalFor('signature')}}})
  }
  if(action==='create'){const edition=editionOf(b.edition),session=await createSession(edition,b.startPersonalizationConsent===true,b.checkoutAttemptId,b.catalogTemplateId);return json({ok:true,clientSecret:session.client_secret,sessionId:session.id,edition})}
  if(action==='status'){
   const session=await retrieveSession(String(b.sessionId||'')),paid=session.status==='complete'&&session.payment_status==='paid';let p=null;if(paid)p=await provision(session);
   return json({ok:true,status:session.status,paymentStatus:session.payment_status,paid,provisioned:!!p,edition:editionOf(session.metadata?.edition),amountTotal:session.amount_total||null,currency:session.currency||'eur',email:p?.buyerEmail||session.customer_details?.email||null,orderSubmittedAt:p?.metadata?.guest_order_submitted_at||null,catalogTemplateId:p?.metadata?.guest_catalog_template_id||null,catalogTemplateVersion:p?.metadata?.guest_catalog_template_version||null,catalogQuestionnaireUrl:p?.catalogQuestionnaireUrl||null})
  }
  if(action==='submit_order'){const session=await retrieveSession(String(b.sessionId||''));validatePaid(session);return json(await submitOrder(session,b.details||{}))}
  return json({ok:false,error:'invalid_action'},400)
 }catch(e){const m=String((e as Error)?.message||'');console.warn(e);if(['consent_required','invalid_checkout_attempt','invalid_session','invalid_checkout_session','not_paid','missing_order_fields','invalid_design','catalog_template_not_for_sale','catalog_uses_common_questionnaire'].includes(m))return json({ok:false,error:m},400);if(m==='session_not_found')return json({ok:false,error:m},404);if(m==='stripe_request_failed')return json({ok:false,error:m},502);if(['stripe_not_configured','webhook_not_configured','stripe_temporarily_unavailable'].includes(m))return json({ok:false,error:m},503);return json({ok:false,error:'server_error'},500)}
});