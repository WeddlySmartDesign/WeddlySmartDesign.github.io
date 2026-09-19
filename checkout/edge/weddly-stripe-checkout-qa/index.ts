import { createClient } from 'npm:@supabase/supabase-js@2';

const TEMPLATE_ID='7a755bcf-69b5-4934-8ef7-bcb3ed74e6d9';
const QA_TOKEN_HASH='c2991c1c758b5fe840bd7968d96f8c8d23e7f740bb4b92fb53ec259a809574ec';
const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'content-type,stripe-signature',
  'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
  'Cache-Control':'no-store'
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});

function env(name:string){return (Deno.env.get(name)||'').trim()}
function admin(){
  const secrets=Deno.env.get('SUPABASE_SECRET_KEYS');
  const key=secrets?JSON.parse(secrets).default:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(Deno.env.get('SUPABASE_URL')!,key!,{auth:{persistSession:false}});
}
async function sha256(value:string){
  const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('');
}
async function hmacHex(secret:string,value:string){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig)).map(x=>x.toString(16).padStart(2,'0')).join('');
}
function secureEqual(a:string,b:string){
  if(a.length!==b.length)return false;let d=0;
  for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);
  return d===0;
}
async function validQaToken(value:string){
  if(value.length<32)return false;
  return secureEqual(await sha256(value),QA_TOKEN_HASH);
}
function activationCode(){
  const a=crypto.randomUUID().replaceAll('-','').toUpperCase();
  const b=crypto.randomUUID().replaceAll('-','').toUpperCase();
  return `WSD-ONE-${a.slice(0,8)}-${a.slice(8,16)}-${b.slice(0,8)}`;
}
function normalizeCode(v:string){return String(v||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'')}
function editionOf(v:unknown){return String(v||'').toLowerCase()==='signature'?'signature':'essential'}
function launchMode(){return !['0','false','off','no'].includes(env('WEDDLY_LAUNCH_MODE').toLowerCase())}
const TEST_PRICE_IDS={
  essential:'price_1UHU0wK3yBy1nCpM7u7JPNSg',
  signature:'price_1UHU2bK3yBy1nCpMlsKxaOAy'
} as const;
function priceIdFor(edition:string){
  const configured=env(edition==='signature'?'STRIPE_PRICE_SIGNATURE':'STRIPE_PRICE_ESSENTIAL');
  if(configured)return configured;
  if(env('STRIPE_TEST_SECRET_KEY').startsWith('sk_test_'))return edition==='signature'?TEST_PRICE_IDS.signature:TEST_PRICE_IDS.essential;
  throw new Error('stripe_price_not_configured');
}
function amountFor(edition:string){
  const launch=launchMode();
  if(edition==='signature')return launch?4990:5990;
  return launch?3990:4990;
}
function labelFor(edition:string){return edition==='signature'?'ONE Signature':'ONE Essential'}
function descriptionFor(edition:string){
  return edition==='signature'
    ? 'ONE completo + 6 diseños Essential + 4 diseños Signature + personalización premium'
    : 'ONE completo + 6 diseños Essential';
}
function origin(){
  const x=env('WEDDLY_SITE_ORIGIN');
  return x||'https://weddlysmartdesign.github.io';
}
async function stripeRequest(path:string,init:RequestInit={}){
  const secret=env('STRIPE_TEST_SECRET_KEY');
  if(!secret)throw new Error('stripe_not_configured');
  const r=await fetch('https://api.stripe.com/v1'+path,{
    ...init,
    headers:{Authorization:'Bearer '+secret,...(init.headers||{})}
  });
  const x=await r.json().catch(()=>({}));
  if(!r.ok){console.warn('stripe_error',r.status,x);throw new Error('stripe_request_failed')}
  return x;
}
async function createSession(edition:string,consent:boolean){
  if(!consent)throw new Error('consent_required');
  const amount=amountFor(edition),priceId=priceIdFor(edition),launch=launchMode(),base=origin();
  const p=new URLSearchParams();
  p.set('ui_mode','embedded');
  p.set('mode','payment');
  p.set('locale','es');
  p.set('submit_type','pay');
  p.set('billing_address_collection','auto');
  p.set('redirect_on_completion','always');
  p.set('return_url','https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-stripe-checkout-qa?session_id={CHECKOUT_SESSION_ID}');
  p.set('client_reference_id','one_'+crypto.randomUUID());
  p.set('line_items[0][quantity]','1');
  p.set('line_items[0][price]',priceId);
  p.set('metadata[product]','full');
  p.set('metadata[edition]',edition);
  p.set('metadata[pricing]',launch?'launch':'standard');
  p.set('metadata[amount_cents]',String(amount));
  p.set('metadata[stripe_price_id]',priceId);
  p.set('metadata[immediate_access_consent]','true');
  p.set('metadata[consent_version]','2026-09-19');
  p.set('payment_intent_data[metadata][product]','full');
  p.set('payment_intent_data[metadata][edition]',edition);
  p.set('payment_intent_data[metadata][pricing]',launch?'launch':'standard');
  p.set('custom_text[submit][message]','Al pagar confirmas las condiciones de contratación y solicitas acceso inmediato a ONE.');
  if(['1','true','on','yes'].includes(env('WEDDLY_STRIPE_AUTOMATIC_TAX').toLowerCase()))p.set('automatic_tax[enabled]','true');
  return await stripeRequest('/checkout/sessions',{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:p.toString()
  });
}
async function createHostedSession(edition:string,qaToken:string){
  const amount=amountFor(edition),priceId=priceIdFor(edition),launch=launchMode();
  const p=new URLSearchParams();
  p.set('mode','payment');
  p.set('locale','es');
  p.set('submit_type','pay');
  p.set('billing_address_collection','auto');
  const qa=encodeURIComponent(qaToken);
  p.set('success_url','https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-stripe-checkout-qa?session_id={CHECKOUT_SESSION_ID}&qa='+qa);
  p.set('cancel_url','https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-stripe-checkout-qa?cancelled=1&qa='+qa);
  p.set('client_reference_id','one_qa_'+crypto.randomUUID());
  p.set('line_items[0][quantity]','1');
  p.set('line_items[0][price]',priceId);
  p.set('metadata[product]','full');
  p.set('metadata[edition]',edition);
  p.set('metadata[pricing]',launch?'launch':'standard');
  p.set('metadata[amount_cents]',String(amount));
  p.set('metadata[stripe_price_id]',priceId);
  p.set('metadata[qa]','true');
  p.set('metadata[immediate_access_consent]','true');
  p.set('metadata[consent_version]','sandbox-qa-2026-09-19');
  p.set('payment_intent_data[metadata][product]','full');
  p.set('payment_intent_data[metadata][edition]',edition);
  p.set('payment_intent_data[metadata][qa]','true');
  return await stripeRequest('/checkout/sessions',{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:p.toString()
  });
}
async function retrieveSession(id:string){
  if(!/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(id))throw new Error('invalid_session');
  return await stripeRequest('/checkout/sessions/'+encodeURIComponent(id)+'?expand[]=line_items.data.price');
}
function validatePaidSession(session:any){
  const rawEdition=String(session?.metadata?.edition||'').toLowerCase();
  if(String(session?.metadata?.product||'')!=='full'||String(session?.metadata?.qa||'')!=='true'||!['essential','signature'].includes(rawEdition))throw new Error('invalid_checkout_session');
  const expectedPrice=priceIdFor(rawEdition);
  const priceObj=session?.line_items?.data?.[0]?.price;
  const actualPrice=typeof priceObj==='string'?priceObj:String(priceObj?.id||'');
  if(actualPrice!==expectedPrice)throw new Error('invalid_checkout_session');
  if(Number(session?.amount_total||0)!==amountFor(rawEdition)||String(session?.currency||'').toLowerCase()!=='eur')throw new Error('invalid_checkout_session');
  return rawEdition;
}
async function sendActivationEmail(to:string,code:string,sessionId:string,edition:string){
  const apiKey=env('RESEND_API_KEY'),from=env('WEDDLY_RESEND_FROM');
  if(!apiKey||!from)return false;
  const activationUrl=origin()+'/access.html?purchase=stripe&lang=es#code='+encodeURIComponent(code);
  const productName=edition==='signature'?'ONE Signature by WeddlySmartDesign':'ONE Essential by WeddlySmartDesign';
  const r=await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer '+apiKey,
      'Idempotency-Key':'one-stripe/'+sessionId
    },
    body:JSON.stringify({
      from,to:[to],
      reply_to:'weddlysmartdesign@gmail.com',
      template:{id:TEMPLATE_ID,variables:{
        ACTIVATION_URL:activationUrl,
        ACTIVATION_CODE:code,
        ORDER_ID:sessionId,
        PRODUCT_NAME:productName
      }}
    })
  });
  if(!r.ok){console.warn('resend_failed',r.status,await r.text());return false}
  return true;
}
async function provisionPaidSession(session:any){
  if(!session||session.status!=='complete'||session.payment_status!=='paid')return null;
  const edition=validatePaidSession(session),buyerEmail=String(session.customer_details?.email||session.customer_email||'').trim().toLowerCase();
  if(!buyerEmail.includes('@'))throw new Error('missing_buyer_email');
  const sessionId=String(session.id||'');
  const paymentIntent=typeof session.payment_intent==='string'?session.payment_intent:String(session.payment_intent?.id||'');
  const code=activationCode(),hash=await sha256(normalizeCode(code)),db=admin();
  const metadata={
    product:'full',
    edition,
    access_kind:'paid',
    payment_provider:'stripe',
    stripe_session_id:sessionId,
    stripe_payment_intent:paymentIntent||null,
    amount_total:Number(session.amount_total||amountFor(edition)),
    currency:String(session.currency||'eur'),
    pricing:String(session.metadata?.pricing||''),
    immediate_access_consent:session.metadata?.immediate_access_consent==='true',
    consent_version:String(session.metadata?.consent_version||''),
    purchased_at:new Date((Number(session.created)||Math.floor(Date.now()/1000))*1000).toISOString()
  };
  const {data,error}=await db.rpc('provision_weddly_license',{
    p_source:'stripe_sandbox',
    p_source_order_id:sessionId,
    p_buyer_email:buyerEmail,
    p_product_ref:'one_'+edition,
    p_metadata:metadata,
    p_activation_code:code,
    p_purchase_hash:hash
  });
  if(error)throw error;
  const row=data?.[0];
  if(!row?.license_id||!row?.activation_code)throw new Error('license_provision_failed');

  const {data:license,error:le}=await db.from('licenses').select('metadata').eq('id',row.license_id).maybeSingle();
  if(le)throw le;
  let emailSent=!!license?.metadata?.activation_email_sent_at;
  if(!emailSent){
    emailSent=await sendActivationEmail(buyerEmail,String(row.activation_code),sessionId,edition);
    if(emailSent){
      const next={...(license?.metadata||{}),activation_email_sent_at:new Date().toISOString()};
      await db.from('licenses').update({metadata:next,updated_at:new Date().toISOString()}).eq('id',row.license_id);
    }
  }
  return {
    licenseId:String(row.license_id),
    edition,
    buyerEmail,
    activationCode:String(row.activation_code),
    activationUrl:origin()+'/access.html?purchase=stripe&lang=es#code='+encodeURIComponent(String(row.activation_code)),
    emailSent
  };
}
async function lookupProvisionedSession(session:any){
  const sessionId=String(session?.id||'');
  if(!sessionId)return null;
  const db=admin();
  const {data:l,error}=await db.from('licenses').select('id,status,metadata').eq('source','stripe_sandbox').eq('source_order_id',sessionId).maybeSingle();
  if(error)throw error;
  if(!l||l.status!=='active')return null;
  const {data:d,error:de}=await db.from('license_delivery_codes').select('activation_code,buyer_email').eq('license_id',l.id).maybeSingle();
  if(de)throw de;
  if(!d?.activation_code)return null;
  const edition=editionOf(l.metadata?.edition);
  return {
    licenseId:String(l.id),
    edition,
    activationCode:String(d.activation_code),
    activationUrl:origin()+'/access.html?purchase=stripe&lang=es#code='+encodeURIComponent(String(d.activation_code)),
    buyerEmail:String(d.buyer_email||l.metadata?.buyer_email||''),
    emailSent:!!l.metadata?.activation_email_sent_at
  };
}
async function deactivateByPaymentIntent(paymentIntent:string,reason:string){
  if(!paymentIntent)return;
  const db=admin();
  const {data:rows,error}=await db.from('licenses').select('id,metadata').eq('source','stripe_sandbox').eq('metadata->>stripe_payment_intent',paymentIntent);
  if(error)throw error;
  for(const row of rows||[]){
    const metadata={...(row.metadata||{}),deactivated_reason:reason,deactivated_at:new Date().toISOString()};
    await db.from('licenses').update({status:'inactive',metadata,updated_at:new Date().toISOString()}).eq('id',row.id);
  }
}
async function webhookSecret(){
  const direct=env('STRIPE_TEST_WEBHOOK_SECRET');
  if(direct)return direct;
  const {data,error}=await admin().rpc('get_weddly_stripe_qa_webhook_secret');
  if(error)throw error;
  return String(data||'').trim();
}
async function verifyWebhook(raw:string,header:string){
  const secret=await webhookSecret();
  if(!secret)return false;
  const parts=header.split(',').map(x=>x.trim());
  const ts=parts.find(x=>x.startsWith('t='))?.slice(2)||'';
  const sigs=parts.filter(x=>x.startsWith('v1=')).map(x=>x.slice(3));
  if(!/^\d+$/.test(ts)||!sigs.length)return false;
  const age=Math.abs(Date.now()/1000-Number(ts));if(age>300)return false;
  const expected=await hmacHex(secret,ts+'.'+raw);
  return sigs.some(x=>secureEqual(x,expected));
}
async function markWebhook(provision:any,evt:any,type:string){
  if(!provision?.licenseId)return;
  const db=admin();
  const {data:l,error}=await db.from('licenses').select('metadata').eq('id',provision.licenseId).maybeSingle();
  if(error)throw error;
  const metadata={...(l?.metadata||{}),stripe_webhook_seen_at:new Date().toISOString(),stripe_webhook_event_id:String(evt?.id||''),stripe_webhook_type:type};
  const {error:ue}=await db.from('licenses').update({metadata,updated_at:new Date().toISOString()}).eq('id',provision.licenseId);
  if(ue)throw ue;
}
async function handleWebhook(raw:string,header:string){
  if(!await verifyWebhook(raw,header))return json({ok:false,error:'invalid_signature'},400);
  const evt=JSON.parse(raw||'{}'),type=String(evt.type||''),obj=evt.data?.object||{};
  if(type==='checkout.session.completed'&&obj.payment_status==='paid'){
    const provision=await provisionPaidSession(await retrieveSession(String(obj.id||'')));
    await markWebhook(provision,evt,type);
  }
  if(type==='checkout.session.async_payment_succeeded'){
    const provision=await provisionPaidSession(await retrieveSession(String(obj.id||'')));
    await markWebhook(provision,evt,type);
  }
  if(type==='charge.refunded'&&obj.refunded===true){
    const pi=typeof obj.payment_intent==='string'?obj.payment_intent:String(obj.payment_intent?.id||'');
    await deactivateByPaymentIntent(pi,'full_refund');
  }
  if(type==='charge.dispute.created'){
    const pi=typeof obj.payment_intent==='string'?obj.payment_intent:String(obj.payment_intent?.id||'');
    await deactivateByPaymentIntent(pi,'dispute_created');
  }
  return json({received:true});
}


Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method==='GET'){
    try{
      const u=new URL(req.url),qaToken=String(u.searchParams.get('qa')||''),sessionId=String(u.searchParams.get('session_id')||''),requested=String(u.searchParams.get('edition')||'').toLowerCase();
      if(!await validQaToken(qaToken))return json({ok:false,error:'qa_forbidden'},403);
      if(sessionId){
        const session=await retrieveSession(sessionId);
        if(session.status!=='complete'||session.payment_status!=='paid')return json({ok:false,error:'payment_not_paid'},402);
        const provision=await provisionPaidSession(session);
        if(!provision?.activationUrl)return json({ok:false,error:'license_provision_failed'},500);
        return Response.redirect(provision.activationUrl,302);
      }
      if(u.searchParams.get('cancelled')==='1')return json({ok:true,cancelled:true,message:'Stripe Sandbox checkout cancelled. No charge was made.'});
      if(requested==='essential'||requested==='signature'){
        const session=await createHostedSession(requested,qaToken);
        if(!session?.url)return json({ok:false,error:'stripe_checkout_url_missing'},500);
        return Response.redirect(String(session.url),303);
      }
      return json({ok:true,sandbox:true,ready:!!env('STRIPE_TEST_SECRET_KEY'),prices:{essential:'39,90 EUR',signature:'49,90 EUR'}});
    }catch(e){
      const m=String((e as Error)?.message||'');
      if(m==='stripe_not_configured'||m==='stripe_price_not_configured')return json({ok:false,error:m},503);
      if(m==='invalid_session'||m==='invalid_checkout_session')return json({ok:false,error:m},400);
      console.warn(e);return json({ok:false,error:'server_error'},500);
    }
  }
  if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);
  try{
    const raw=await req.text(),sig=req.headers.get('stripe-signature')||'';
    if(sig)return await handleWebhook(raw,sig);
    const b=JSON.parse(raw||'{}'),action=String(b?.action||'');
    if(!await validQaToken(String(b?.qaToken||'')))return json({ok:false,error:'qa_forbidden'},403);
    if(action==='setup_webhook'){
      const url='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-stripe-checkout-qa';
      const listed=await stripeRequest('/webhook_endpoints?limit=100');
      const existing=(Array.isArray(listed?.data)?listed.data:[]).find((x:any)=>String(x?.url||'')===url);
      let haveSecret=false;
      try{haveSecret=!!(await webhookSecret())}catch{}
      if(existing&&haveSecret)return json({ok:true,configured:true,webhookId:String(existing.id),reused:true});
      if(existing&&!haveSecret)await stripeRequest('/webhook_endpoints/'+encodeURIComponent(String(existing.id)),{method:'DELETE'});
      const p=new URLSearchParams();
      p.set('url',url);
      ['checkout.session.completed','checkout.session.async_payment_succeeded','charge.refunded','charge.dispute.created'].forEach((e,i)=>p.set('enabled_events['+i+']',e));
      p.set('description','WeddlySmartDesign ONE Sandbox QA');
      const created=await stripeRequest('/webhook_endpoints',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:p.toString()});
      const whsec=String(created?.secret||'');
      if(!whsec)throw new Error('webhook_secret_missing');
      const {error:se}=await admin().rpc('set_weddly_stripe_qa_webhook_secret',{p_secret:whsec});
      if(se)throw se;
      return json({ok:true,configured:true,webhookId:String(created.id||''),reused:false});
    }
    if(action==='config'){
      const pk=env('STRIPE_TEST_PUBLISHABLE_KEY');
      if(!pk)return json({ok:false,error:'stripe_not_configured'},503);
      const launch=launchMode();
      const priceIds={essential:priceIdFor('essential'),signature:priceIdFor('signature')};
      return json({
        ok:true,
        publishableKey:pk,
        launch,
        priceIds,
        prices:{
          essential:{current:amountFor('essential'),normal:4990},
          signature:{current:amountFor('signature'),normal:5990}
        }
      });
    }
    if(action==='create'){
      const edition=editionOf(b.edition);
      const session=await createSession(edition,b.immediateAccessConsent===true);
      return json({ok:true,clientSecret:session.client_secret,sessionId:session.id,edition});
    }
    if(action==='status'){
      const session=await retrieveSession(String(b.sessionId||''));
      const paid=session.status==='complete'&&session.payment_status==='paid';
      if(paid)validatePaidSession(session);
      const provision=paid?await lookupProvisionedSession(session):null;
      return json({
        ok:true,
        status:session.status,
        paymentStatus:session.payment_status,
        paid,
        provisioned:!!provision,
        edition:editionOf(session.metadata?.edition),
        amountTotal:session.amount_total||null,
        currency:session.currency||'eur',
        activationCode:provision?.activationCode||null,
        activationUrl:provision?.activationUrl||null,
        email:provision?.buyerEmail||session.customer_details?.email||null,
        emailSent:provision?.emailSent||false
      });
    }
    return json({ok:false,error:'invalid_action'},400);
  }catch(e){
    const m=String((e as Error)?.message||'');
    console.warn(e);
    if(m==='consent_required')return json({ok:false,error:m},400);
    if(m==='invalid_session')return json({ok:false,error:m},400);
    if(m==='stripe_not_configured'||m==='stripe_price_not_configured')return json({ok:false,error:m},503);
    if(m==='invalid_checkout_session')return json({ok:false,error:m},400);
    return json({ok:false,error:'server_error'},500);
  }
});