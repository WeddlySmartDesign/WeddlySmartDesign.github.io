import {
  admin, env, siteOrigin, stripeGetSession, provisionPaidStripeSession, sha256
} from '../_shared/weddly-commerce.ts';

const allowedOrigin=siteOrigin();
const cors=(req:Request)=>({
  'Access-Control-Allow-Origin': req.headers.get('origin')===allowedOrigin?allowedOrigin:allowedOrigin,
  'Access-Control-Allow-Headers':'content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
  'Cache-Control':'no-store'
});
const json=(req:Request,body:unknown,status=200)=>new Response(JSON.stringify(body),{
  status,headers:{...cors(req),'Content-Type':'application/json'}
});
async function readBody(req:Request){
  const raw=await req.text();
  if(raw.length>32768)throw new Error('body_too_large');
  try{return JSON.parse(raw||'{}')}catch{throw new Error('invalid_json')}
}
function cleanCode(v:unknown){return String(v||'').trim().toLowerCase().slice(0,80)}
function termsVersion(){return '2026-09-19-v1'}

async function requireOwner(db:any,req:Request){
  const token=String(req.headers.get('x-weddly-member')||'').trim();
  if(token.length<40)return null;
  const memberHash=await sha256(token);
  const {data:m,error:me}=await db.from('wedding_members')
    .select('id,license_id,role,status').eq('member_hash',memberHash).eq('status','active').maybeSingle();
  if(me)throw me;
  if(!m||m.role!=='primary')return null;
  const {data:l,error:le}=await db.from('licenses')
    .select('id,source,status,metadata').eq('id',m.license_id).eq('status','active').maybeSingle();
  if(le)throw le;
  if(!l||l.source!=='internal_owner'||l.metadata?.grant_type!=='owner')return null;
  return {member:m,license:l};
}

async function createStripeCheckout(product:any, acceptedTerms:boolean, acceptedImmediate:boolean){
  const key=env('STRIPE_SECRET_KEY');
  if(!key)throw new Error('stripe_not_configured');

  const form=new URLSearchParams();
  form.set('mode','payment');
  form.set('success_url',`${siteOrigin()}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`);
  form.set('cancel_url',`${siteOrigin()}/checkout.html?cancelled=1`);
  form.set('customer_creation','always');
  form.set('billing_address_collection','required');
  form.set('locale','auto');
  form.set('submit_type','pay');

  form.set('line_items[0][quantity]','1');
  form.set('line_items[0][price_data][currency]',String(product.currency));
  form.set('line_items[0][price_data][unit_amount]',String(product.price_cents));
  form.set('line_items[0][price_data][product_data][name]',String(product.name));
  if(product.description)form.set('line_items[0][price_data][product_data][description]',String(product.description).slice(0,500));
  const taxBehavior=String(product.metadata?.tax_behavior||'').toLowerCase();
  if(taxBehavior==='inclusive'||taxBehavior==='exclusive')form.set('line_items[0][price_data][tax_behavior]',taxBehavior);
  if(product.metadata?.automatic_tax===true)form.set('automatic_tax[enabled]','true');

  form.set('metadata[weddly_product]',String(product.code));
  form.set('metadata[access_product]',String(product.access_product||'full'));
  form.set('metadata[signature_included]',product.signature_included?'yes':'no');
  form.set('metadata[accepted_terms]',acceptedTerms?'yes':'no');
  form.set('metadata[immediate_access]',acceptedImmediate?'yes':'no');
  form.set('metadata[terms_version]',termsVersion());
  form.set('metadata[checkout_origin]','one_web');

  const r=await fetch('https://api.stripe.com/v1/checkout/sessions',{
    method:'POST',
    headers:{
      Authorization:`Bearer ${key}`,
      'Content-Type':'application/x-www-form-urlencoded',
      Accept:'application/json'
    },
    body:form.toString()
  });
  const body=await r.json().catch(()=>({}));
  if(!r.ok){
    console.warn('stripe_create_checkout_failed',r.status,body);
    throw new Error(body?.error?.message||`stripe_${r.status}`);
  }
  if(!body?.id||!body?.url)throw new Error('stripe_session_missing');
  return body;
}

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors(req)});
  if(req.method!=='POST')return json(req,{ok:false,error:'method_not_allowed'},405);

  try{
    const b=await readBody(req);
    const action=String(b?.action||'');
    const db=admin();

    if(action==='admin_orders'){
      const owner=await requireOwner(db,req);
      if(!owner)return json(req,{ok:false,error:'owner_required'},403);

      const {data:orders,error}=await db.from('commerce_orders')
        .select('id,provider,provider_session_id,product_code,buyer_email,amount_total,currency,payment_status,license_id,email_status,email_id,paid_at,created_at,updated_at')
        .order('created_at',{ascending:false}).limit(100);
      if(error)throw error;

      const licenseIds=(orders||[]).map((x:any)=>x.license_id).filter(Boolean);
      let licenseMap=new Map<string,any>();
      if(licenseIds.length){
        const {data:licenses,error:le}=await db.from('licenses')
          .select('id,status,wedding_id,activated_at,metadata').in('id',licenseIds);
        if(le)throw le;
        for(const l of licenses||[])licenseMap.set(String(l.id),l);
      }

      return json(req,{ok:true,orders:(orders||[]).map((o:any)=>{
        const l=o.license_id?licenseMap.get(String(o.license_id)):null;
        return {
          id:o.id,provider:o.provider,sessionId:o.provider_session_id,productCode:o.product_code,
          buyerEmail:o.buyer_email,amountTotal:o.amount_total,currency:o.currency,
          paymentStatus:o.payment_status,emailStatus:o.email_status,
          createdAt:o.created_at,paidAt:o.paid_at,
          licenseStatus:l?.status||null,weddingId:l?.wedding_id||null,activatedAt:l?.activated_at||null
        };
      })});
    }

    if(action==='catalog'){
      const {data,error}=await db.from('commerce_products')
        .select('code,name,description,price_cents,currency,signature_included,metadata')
        .eq('active',true).gt('price_cents',0).order('price_cents',{ascending:true});
      if(error)throw error;
      return json(req,{ok:true,products:(data||[]).map((p:any)=>({
        code:p.code,name:p.name,description:p.description,
        priceCents:p.price_cents,currency:p.currency,
        signatureIncluded:!!p.signature_included
      }))});
    }

    if(action==='create_checkout'){
      const productCode=cleanCode(b?.productCode||'one');
      const acceptedTerms=b?.acceptedTerms===true;
      const acceptedImmediate=b?.acceptedImmediateAccess===true;
      if(!acceptedTerms)return json(req,{ok:false,error:'terms_required'},400);
      if(!acceptedImmediate)return json(req,{ok:false,error:'immediate_access_required'},400);

      const {data:product,error}=await db.from('commerce_products')
        .select('*').eq('code',productCode).eq('active',true).gt('price_cents',0).maybeSingle();
      if(error)throw error;
      if(!product)return json(req,{ok:false,error:'product_unavailable'},409);

      const session=await createStripeCheckout(product,acceptedTerms,acceptedImmediate);
      return json(req,{ok:true,sessionId:session.id,url:session.url},201);
    }

    if(action==='checkout_status'){
      const sessionId=String(b?.sessionId||'').trim();
      if(sessionId.length<12)return json(req,{ok:false,error:'invalid_session'},400);
      const session=await stripeGetSession(sessionId);
      if(session.payment_status!=='paid'){
        return json(req,{ok:true,paid:false,status:String(session.payment_status||session.status||'pending')});
      }
      const fulfilled=await provisionPaidStripeSession(db,session);
      return json(req,{ok:true,paid:true,...fulfilled});
    }

    return json(req,{ok:false,error:'invalid_action'},400);
  }catch(e){
    const m=String((e as Error)?.message||'server_error');
    console.warn('weddly-commerce',m);
    if(m==='body_too_large')return json(req,{ok:false,error:m},413);
    if(m==='invalid_json'||m==='invalid_session')return json(req,{ok:false,error:m},400);
    if(m==='stripe_not_configured')return json(req,{ok:false,error:'checkout_not_configured'},503);
    return json(req,{ok:false,error:'server_error'},500);
  }
});
