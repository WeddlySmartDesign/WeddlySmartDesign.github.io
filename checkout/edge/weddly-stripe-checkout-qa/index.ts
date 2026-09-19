import { createClient } from 'npm:@supabase/supabase-js@2';

const TEMPLATE_ID='7a755bcf-69b5-4934-8ef7-bcb3ed74e6d9';
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
async function retrieveSession(id:string){
  if(!/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(id))throw new Error('invalid_session');
  return await stripeRequest('/checkout/sessions/'+encodeURIComponent(id)+'?expand[]=line_items.data.price');
}
function validatePaidSession(session:any){
  const rawEdition=String(session?.metadata?.edition||'').toLowerCase();
  if(String(session?.metadata?.product||'')!=='full'||!['essential','signature'].includes(rawEdition))throw new Error('invalid_checkout_session');
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
  const {data:rows,error}=await db.from('licenses').select('id,metadata').eq('source','stripe_sandbox').eq('metadata->>stripe_payment_intent',paymentIntent);
  if(error)throw error;
  for(const row of rows||[]){
    const metadata={...(row.metadata||{}),deactivated_reason:reason,deactivated_at:new Date().toISOString()};
    await db.from('licenses').update({status:'inactive',metadata,updated_at:new Date().toISOString()}).eq('id',row.id);
  }
}
async function verifyWebhook(raw:string,header:string){
  const secret=env('STRIPE_TEST_WEBHOOK_SECRET');
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
  if(type==='checkout.session.completed'&&obj.payment_status==='paid')await provisionPaidSession(await retrieveSession(String(obj.id||'')));
  if(type==='checkout.session.async_payment_succeeded')await provisionPaidSession(await retrieveSession(String(obj.id||'')));
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


function qaPage(){
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><title>WeddlySmartDesign · Stripe Sandbox QA</title>
<style>
:root{--paper:#f7eee5;--ink:#4a3a36;--terra:#b97a5c;--line:#daccc3}
*{box-sizing:border-box}body{margin:0;background:#2f2927;color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:620px;min-height:100vh;margin:auto;background:var(--paper);padding:28px 18px 48px}
.badge{display:inline-block;padding:7px 10px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:12px;font-weight:800}
h1{font-family:Georgia,serif;font-weight:500;font-size:34px;margin:22px 0 8px}.lead{line-height:1.55;color:#6d5d58;margin:0 0 22px}
.editions{display:grid;gap:10px}.edition{width:100%;text-align:left;border:1px solid var(--line);border-radius:16px;background:#fffaf5;padding:16px;color:var(--ink);display:flex;justify-content:space-between;gap:14px}
.edition.sel{outline:2px solid var(--terra);border-color:transparent}.edition b{font-size:16px}.edition span{font-weight:800}
.consent{display:flex;gap:10px;align-items:flex-start;margin:18px 2px;font-size:13px;line-height:1.45}.consent input{margin-top:3px}
#mount{min-height:70px}.msg{padding:16px;border:1px dashed var(--line);border-radius:14px;background:#fff8f2;line-height:1.5}
.ok{border-style:solid}.code{display:block;margin:12px 0;padding:12px;background:#fff;border:1px solid var(--line);border-radius:10px;word-break:break-all;font-family:ui-monospace,monospace}
a.btn{display:block;text-align:center;background:var(--ink);color:#fff;text-decoration:none;padding:14px;border-radius:12px;font-weight:800;margin-top:12px}
small{display:block;margin-top:18px;color:#7c6d67;line-height:1.45}
</style>
<script src="https://js.stripe.com/clover/stripe.js"></script></head>
<body><main><span class="badge">SANDBOX · NO COBRA DINERO REAL</span><h1>Prueba de compra de ONE</h1>
<p class="lead">Esta página está aislada de la web comercial. Sirve únicamente para validar Stripe antes de tocar producción.</p>
<div id="checkout">
  <div class="editions">
    <button class="edition sel" data-edition="essential"><b>ONE Essential</b><span>39,90 €</span></button>
    <button class="edition" data-edition="signature"><b>ONE Signature</b><span>49,90 €</span></button>
  </div>
  <label class="consent"><input id="consent" type="checkbox"><span>Solicito acceso inmediato tras el pago de prueba y acepto las condiciones de contratación para esta validación.</span></label>
  <div id="msg" class="msg">Marca la casilla para cargar Stripe Sandbox.</div>
  <div id="mount"></div>
</div>
<div id="result" style="display:none"></div>
<small>La licencia generada queda marcada como <b>stripe_sandbox</b> para separarla de futuras ventas reales.</small>
<script>
const API=location.origin+location.pathname;
let edition='essential',embedded=null,stripe=null,cfg=null;
const msg=document.getElementById('msg'),mount=document.getElementById('mount');
async function api(body){const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||'error');return j}
async function reset(){try{embedded?.destroy?.()}catch{}embedded=null;mount.innerHTML=''}
async function start(){
  await reset();msg.textContent='Preparando pago seguro de prueba…';
  try{
    cfg=cfg||await api({action:'config'});stripe=stripe||Stripe(cfg.publishableKey);
    embedded=await stripe.initEmbeddedCheckout({fetchClientSecret:async()=>{const x=await api({action:'create',edition,immediateAccessConsent:true});return x.clientSecret}});
    msg.style.display='none';embedded.mount('#mount');
  }catch(e){msg.style.display='block';msg.textContent='No se puede iniciar todavía: '+e.message}
}
document.querySelectorAll('[data-edition]').forEach(b=>b.onclick=async()=>{edition=b.dataset.edition;document.querySelectorAll('[data-edition]').forEach(x=>x.classList.toggle('sel',x===b));if(document.getElementById('consent').checked)await start()});
document.getElementById('consent').onchange=async e=>{if(e.target.checked)await start();else{await reset();msg.style.display='block';msg.textContent='Marca la casilla para cargar Stripe Sandbox.'}};
(async()=>{
 const sid=new URLSearchParams(location.search).get('session_id');
 if(!sid)return;
 document.getElementById('checkout').style.display='none';const out=document.getElementById('result');out.style.display='block';out.innerHTML='<div class="msg">Comprobando el pago de prueba…</div>';
 try{
   const x=await api({action:'status',sessionId:sid});
   if(!x.paid)throw new Error('payment_not_paid');
   out.innerHTML='<div class="msg ok"><b>Pago de prueba confirmado.</b><br>Edición: '+x.edition+'<span class="code">'+x.activationCode+'</span><a class="btn" href="'+x.activationUrl+'">Activar ONE</a></div>';
 }catch(e){out.innerHTML='<div class="msg">No se ha podido validar: '+e.message+'</div>'}
})();
</script></main></body></html>`;
}

Deno.serve(async req=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method==='GET')return new Response(qaPage(),{headers:{...cors,'Content-Type':'text/html; charset=utf-8'}});
  if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);
  try{
    const raw=await req.text(),sig=req.headers.get('stripe-signature')||'';
    if(sig)return await handleWebhook(raw,sig);
    const b=JSON.parse(raw||'{}'),action=String(b?.action||'');
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
    if(m==='stripe_not_configured'||m==='stripe_price_not_configured')return json({ok:false,error:m},503);
    if(m==='invalid_checkout_session')return json({ok:false,error:m},400);
    return json({ok:false,error:'server_error'},500);
  }
});