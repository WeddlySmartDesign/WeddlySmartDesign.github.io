import { createClient } from 'npm:@supabase/supabase-js@2';

const TEMPLATE_ID='7a755bcf-69b5-4934-8ef7-bcb3ed74e6d9';
const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'content-type,stripe-signature',
  'Access-Control-Allow-Methods':'POST,OPTIONS',
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
function activationCode(){
  const a=crypto.randomUUID().replaceAll('-','').toUpperCase();
  const b=crypto.randomUUID().replaceAll('-','').toUpperCase();
  return `WSD-ONE-${a.slice(0,8)}-${a.slice(8,16)}-${b.slice(0,8)}`;
}
function normalizeCode(v:string){return String(v||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'')}
function editionOf(v:unknown){return String(v||'').toLowerCase()==='signature'?'signature':'essential'}
function launchMode(){return !['0','false','off','no'].includes(env('WEDDLY_LAUNCH_MODE').toLowerCase())}
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
  const secret=env('STRIPE_SECRET_KEY');
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
  const amount=amountFor(edition),launch=launchMode(),base=origin();
  const p=new URLSearchParams();
  p.set('ui_mode','embedded');
  p.set('mode','payment');
  p.set('locale','es');
  p.set('submit_type','pay');
  p.set('billing_address_collection','auto');
  p.set('redirect_on_completion','always');
  p.set('return_url',base+'/checkout-return.html?session_id={CHECKOUT_SESSION_ID}');
  p.set('client_reference_id','one_'+crypto.randomUUID());
  p.set('line_items[0][quantity]','1');
  p.set('line_items[0][price_data][currency]','eur');
  p.set('line_items[0][price_data][unit_amount]',String(amount));
  p.set('line_items[0][price_data][product_data][name]',labelFor(edition));
  p.set('line_items[0][price_data][product_data][description]',descriptionFor(edition));
  p.set('metadata[product]','full');
  p.set('metadata[edition]',edition);
  p.set('metadata[pricing]',launch?'launch':'standard');
  p.set('metadata[amount_cents]',String(amount));
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
async function retrieveSession(id:string){
  if(!/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(id))throw new Error('invalid_session');
  return await stripeRequest('/checkout/sessions/'+encodeURIComponent(id));
}
async function sendActivationEmail(to:string,code:string,sessionId:string,edition:string){
  const apiKey=env('RESEND_API_KEY'),from=env('WEDDLY_RESEND_FROM');
  if(!apiKey||!from)return false;
  const activationUrl=origin()+'/access.html#code='+encodeURIComponent(code);
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
  const edition=editionOf(session.metadata?.edition),buyerEmail=String(session.customer_details?.email||session.customer_email||'').trim().toLowerCase();
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
    p_source:'stripe',
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
    edition,
    buyerEmail,
    activationCode:String(row.activation_code),
    activationUrl:origin()+'/access.html#code='+encodeURIComponent(String(row.activation_code)),
    emailSent
  };
}
async function deactivateByPaymentIntent(paymentIntent:string,reason:string){
  if(!paymentIntent)return;
  const db=admin();
  const {data:rows,error}=await db.from('licenses').select('id,metadata').eq('source','stripe').eq('metadata->>stripe_payment_intent',paymentIntent);
  if(error)throw error;
  for(const row of rows||[]){
    const metadata={...(row.metadata||{}),deactivated_reason:reason,deactivated_at:new Date().toISOString()};
    await db.from('licenses').update({status:'inactive',metadata,updated_at:new Date().toISOString()}).eq('id',row.id);
  }
}
async function verifyWebhook(raw:string,header:string){
  const secret=env('STRIPE_WEBHOOK_SECRET');
  if(!secret)return false;
  const parts=header.split(',').map(x=>x.trim());
  const ts=parts.find(x=>x.startsWith('t='))?.slice(2)||'';
  const sigs=parts.filter(x=>x.startsWith('v1=')).map(x=>x.slice(3));
  if(!/^\d+$/.test(ts)||!sigs.length)return false;
  const age=Math.abs(Date.now()/1000-Number(ts));if(age>300)return false;
  const expected=await hmacHex(secret,ts+'.'+raw);
  return sigs.some(x=>secureEqual(x,expected));
}
async function handleWebhook(raw:string,header:string){
  if(!await verifyWebhook(raw,header))return json({ok:false,error:'invalid_signature'},400);
  const evt=JSON.parse(raw||'{}'),type=String(evt.type||''),obj=evt.data?.object||{};
  if(type==='checkout.session.completed'&&obj.payment_status==='paid')await provisionPaidSession(obj);
  if(type==='checkout.session.async_payment_succeeded')await provisionPaidSession(obj);
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
  if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);
  try{
    const raw=await req.text(),sig=req.headers.get('stripe-signature')||'';
    if(sig)return await handleWebhook(raw,sig);
    const b=JSON.parse(raw||'{}'),action=String(b?.action||'');
    if(action==='config'){
      const pk=env('STRIPE_PUBLISHABLE_KEY');
      if(!pk)return json({ok:false,error:'stripe_not_configured'},503);
      const launch=launchMode();
      return json({
        ok:true,
        publishableKey:pk,
        launch,
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
      const provision=paid?await provisionPaidSession(session):null;
      return json({
        ok:true,
        status:session.status,
        paymentStatus:session.payment_status,
        paid,
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
    if(m==='stripe_not_configured')return json({ok:false,error:m},503);
    return json({ok:false,error:'server_error'},500);
  }
});