import { createClient } from 'npm:@supabase/supabase-js@2';

export function admin(){
  const packed=Deno.env.get('SUPABASE_SECRET_KEYS');
  const key=packed?JSON.parse(packed).default:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(Deno.env.get('SUPABASE_URL')!,key!,{auth:{persistSession:false}});
}

export function env(name:string, fallback=''){
  return (Deno.env.get(name)||fallback).trim();
}

export async function sha256(value:string){
  const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('');
}

export function normalizeCode(value:string){
  return String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
}

export function activationCode(){
  const a=crypto.randomUUID().replaceAll('-','').toUpperCase();
  const b=crypto.randomUUID().replaceAll('-','').toUpperCase();
  return `WSD-ONE-${a.slice(0,8)}-${a.slice(8,16)}-${b.slice(0,8)}-${b.slice(8,16)}`;
}

export function siteOrigin(){
  return env('WEDDLY_SITE_ORIGIN','https://weddlysmartdesign.github.io').replace(/\/$/,'');
}

export function activationUrl(code:string){
  return `${siteOrigin()}/access.html#code=${encodeURIComponent(code)}`;
}

export function maskEmail(email:string){
  const [local,domain]=String(email||'').split('@');
  if(!local||!domain)return '';
  const shown=local.length<=2?local[0]||'':local.slice(0,2);
  return `${shown}***@${domain}`;
}

export async function stripeGetSession(sessionId:string){
  const key=env('STRIPE_SECRET_KEY');
  if(!key)throw new Error('stripe_not_configured');
  if(!/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(sessionId))throw new Error('invalid_session');
  const r=await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,{
    headers:{Authorization:`Bearer ${key}`,Accept:'application/json'}
  });
  const body=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(body?.error?.message||`stripe_${r.status}`);
  return body;
}

function esc(value:unknown){
  return String(value??'')
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'","&#039;");
}

async function sendActivationEmail(args:{
  to:string, productName:string, code:string, licenseId:string
}){
  const apiKey=env('RESEND_API_KEY');
  const from=env('WEDDLY_FROM_EMAIL');
  if(!apiKey||!from||!args.to.includes('@'))return {status:'not_configured',id:null};

  const url=activationUrl(args.code);
  const subject='ONE ya está listo para vuestra boda';
  const html=`<!doctype html><html><body style="margin:0;background:#f7eee5;color:#4a3a36;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:auto;padding:38px 24px">
    <div style="font-size:14px;font-weight:700">WeddlySmartDesign</div>
    <h1 style="font-family:Georgia,serif;font-size:42px;line-height:1.02;font-weight:400;margin:34px 0 14px">Ya es vuestra.</h1>
    <p style="font-size:16px;line-height:1.6;color:#6c625d">Tu compra de <strong>${esc(args.productName)}</strong> está confirmada. Activa ONE en el móvil desde el que quieras empezar a organizar vuestra boda.</p>
    <p style="margin:30px 0"><a href="${esc(url)}" style="display:inline-block;background:#4a3a36;color:white;text-decoration:none;padding:16px 22px;border-radius:12px;font-weight:700">Activar ONE</a></p>
    <div style="border-top:1px solid #d9cdc4;padding-top:22px;margin-top:28px">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#9b675a;font-weight:700">Código de recuperación</div>
      <div style="font-family:monospace;font-size:14px;margin-top:8px;word-break:break-all">${esc(args.code)}</div>
      <p style="font-size:13px;line-height:1.55;color:#776c66">Guárdalo junto con tu email de compra. ONE es para una boda, hasta dos personas autorizadas y no requiere suscripción.</p>
    </div>
  </div></body></html>`;
  const plain=`WeddlySmartDesign\n\nYa es vuestra.\n\nActiva ONE: ${url}\n\nCódigo de recuperación: ${args.code}\n\nUna boda · hasta dos personas autorizadas · sin suscripción.`;

  const r=await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{
      Authorization:`Bearer ${apiKey}`,
      'Content-Type':'application/json',
      'Idempotency-Key':`weddly-activation-${args.licenseId}`
    },
    body:JSON.stringify({from,to:[args.to],subject,html,text:plain})
  });
  const body=await r.json().catch(()=>({}));
  if(!r.ok){
    console.warn('resend_failed',r.status,body);
    return {status:'failed',id:null};
  }
  return {status:'sent',id:String(body?.id||'')||null};
}

export async function provisionPaidStripeSession(db:any, session:any){
  if(!session?.id||session.payment_status!=='paid')throw new Error('payment_not_complete');

  const productCode=String(session?.metadata?.weddly_product||'').trim();
  if(!productCode)throw new Error('product_missing');
  const {data:product,error:pe}=await db.from('commerce_products')
    .select('code,name,access_product,signature_included,metadata')
    .eq('code',productCode).maybeSingle();
  if(pe)throw pe;
  if(!product)throw new Error('product_unknown');

  const email=String(session?.customer_details?.email||session?.customer_email||'').trim().toLowerCase();
  const code=activationCode();
  const hash=await sha256(normalizeCode(code));
  const immediate=String(session?.metadata?.immediate_access||'')==='yes';
  const termsVersion=String(session?.metadata?.terms_version||'');
  const paidAt=new Date().toISOString();

  const licenseMeta={
    verified_by:'stripe_checkout',
    checkout_session_id:String(session.id),
    payment_intent:session.payment_intent?String(session.payment_intent):null,
    amount_total:Number(session.amount_total||0),
    currency:String(session.currency||'').toLowerCase(),
    product:String(product.access_product||'full'),
    signature_included:!!product.signature_included,
    immediate_access_acknowledged:immediate,
    terms_version:termsVersion||null,
    paid_at:paidAt
  };

  const {data:prov,error:provErr}=await db.rpc('provision_weddly_license',{
    p_source:'stripe',
    p_source_order_id:String(session.id),
    p_buyer_email:email||null,
    p_product_ref:String(product.code),
    p_metadata:licenseMeta,
    p_activation_code:code,
    p_purchase_hash:hash
  });
  if(provErr)throw provErr;
  const row=prov?.[0];
  if(!row?.license_id||!row?.activation_code)throw new Error('license_provision_failed');

  const existing=await db.from('commerce_orders')
    .select('email_status,email_id')
    .eq('provider','stripe').eq('provider_session_id',String(session.id)).maybeSingle();
  if(existing.error)throw existing.error;

  const orderPayload={
    provider:'stripe',
    provider_session_id:String(session.id),
    provider_payment_intent_id:session.payment_intent?String(session.payment_intent):null,
    product_code:String(product.code),
    buyer_email:email||null,
    amount_total:Number(session.amount_total||0),
    currency:String(session.currency||'').toLowerCase()||null,
    payment_status:String(session.payment_status||'paid'),
    license_id:String(row.license_id),
    terms_version:termsVersion||null,
    immediate_access_acknowledged:immediate,
    paid_at:paidAt,
    metadata:{livemode:!!session.livemode,customer_id:session.customer?String(session.customer):null},
    updated_at:new Date().toISOString()
  };
  const up=await db.from('commerce_orders').upsert(orderPayload,{onConflict:'provider_session_id'});
  if(up.error)throw up.error;

  let emailStatus=String(existing.data?.email_status||'pending');
  let emailId=existing.data?.email_id||null;
  if(emailStatus!=='sent'){
    const sent=await sendActivationEmail({
      to:email,productName:String(product.name),code:String(row.activation_code),licenseId:String(row.license_id)
    });
    emailStatus=sent.status;
    emailId=sent.id;
    const eu=await db.from('commerce_orders').update({
      email_status:emailStatus,email_id:emailId,updated_at:new Date().toISOString()
    }).eq('provider','stripe').eq('provider_session_id',String(session.id));
    if(eu.error)console.warn('order_email_status_update_failed',eu.error);
  }

  return {
    licenseId:String(row.license_id),
    activationCode:String(row.activation_code),
    activationUrl:activationUrl(String(row.activation_code)),
    productCode:String(product.code),
    productName:String(product.name),
    signatureIncluded:!!product.signature_included,
    buyerEmailMasked:maskEmail(email),
    emailStatus
  };
}
