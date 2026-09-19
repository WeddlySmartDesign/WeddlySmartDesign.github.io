import { createClient } from 'npm:@supabase/supabase-js@2';

const TEMPLATE_ID='7a755bcf-69b5-4934-8ef7-bcb3ed74e6d9';
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
function admin(){
  const secrets=Deno.env.get('SUPABASE_SECRET_KEYS');
  const key=secrets?JSON.parse(secrets).default:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(Deno.env.get('SUPABASE_URL')!,key!,{auth:{persistSession:false}});
}
async function sha256(value:string){
  const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('');
}
function normalize(v:unknown){return String(v||'').trim();}
function normalizeCode(v:unknown){return normalize(v).toUpperCase().replace(/[^A-Z0-9]/g,'');}
function email(v:unknown){return normalize(v).toLowerCase().slice(0,254);}
async function parse(req:Request){
  const type=(req.headers.get('content-type')||'').toLowerCase();
  if(type.includes('application/json')) return await req.json();
  const raw=await req.text();
  const p=new URLSearchParams(raw);
  return Object.fromEntries(p.entries());
}
async function verifyGumroad(productId:string,licenseKey:string){
  const form=new URLSearchParams({product_id:productId,license_key:licenseKey,increment_uses_count:'false'});
  const r=await fetch('https://api.gumroad.com/v2/licenses/verify',{
    method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form.toString()
  });
  if(!r.ok)return null;
  const j=await r.json().catch(()=>null);
  if(!j?.success||!j?.purchase)return null;
  const p=j.purchase;
  if(p.refunded||p.disputed||p.chargebacked||p.subscription_ended_at||p.subscription_cancelled_at||p.subscription_failed_at)return null;
  return p;
}
async function sendActivationEmail(to:string,code:string,orderId:string,productName:string){
  const apiKey=Deno.env.get('RESEND_API_KEY')||'';
  const from=Deno.env.get('WEDDLY_RESEND_FROM')||'';
  if(!apiKey||!from) return {sent:false,reason:'email_not_configured'};
  const activationUrl='https://weddlysmartdesign.github.io/access.html#code='+encodeURIComponent(code);
  const r=await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey,'Idempotency-Key':'one-purchase/'+orderId},
    body:JSON.stringify({
      from,to:[to],
      template:{id:TEMPLATE_ID,variables:{
        ACTIVATION_URL:activationUrl,
        ACTIVATION_CODE:code,
        ORDER_ID:orderId,
        PRODUCT_NAME:productName||'ONE by WeddlySmartDesign'
      }}
    })
  });
  if(!r.ok){
    console.warn('resend_failed',r.status,await r.text());
    return {sent:false,reason:'email_failed'};
  }
  return {sent:true};
}

Deno.serve(async req=>{
  if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);
  try{
    const b:any=await parse(req);
    const db=admin();

    const productId=normalize(b.product_id||b.productId);
    const licenseKey=normalize(b.license_key||b.licenseKey);
    const orderId=normalize(b.sale_id||b.saleId||b.order_number||b.orderNumber);
    const buyerEmail=email(b.email||b.purchase_email||b.buyer_email);

    if(!productId||!licenseKey||!orderId||!buyerEmail.includes('@')) return json({ok:false,error:'invalid_payload'},400);

    const {data:allowed,error:ae}=await db.from('marketplace_products')
      .select('product_ref,metadata').eq('source','gumroad').eq('active',true).eq('product_ref',productId).maybeSingle();
    if(ae)throw ae;
    if(!allowed)return json({ok:false,error:'unknown_product'},403);

    const purchase:any=await verifyGumroad(productId,licenseKey);
    if(!purchase)return json({ok:false,error:'purchase_not_verified'},403);
    const verifiedEmail=email(purchase.email);
    if(verifiedEmail&&verifiedEmail!==buyerEmail)return json({ok:false,error:'email_mismatch'},403);

    const code=licenseKey;
    const purchaseHash=await sha256(normalizeCode(code));
    const metadata={
      verified_by:'gumroad_license_api',
      sale_id:purchase.sale_id??purchase.id??orderId,
      order_number:purchase.order_number??null,
      currency:purchase.currency??b.currency??null,
      price:purchase.price??b.price??null,
      verified_at:new Date().toISOString()
    };
    const {data:prov,error:pe}=await db.rpc('provision_weddly_license',{
      p_source:'gumroad',
      p_source_order_id:orderId,
      p_buyer_email:buyerEmail,
      p_product_ref:productId,
      p_metadata:metadata,
      p_activation_code:code,
      p_purchase_hash:purchaseHash
    });
    if(pe)throw pe;
    const row=prov?.[0];
    if(!row?.activation_code)throw new Error('activation_code_missing');

    const productName=String(allowed.metadata?.product||allowed.metadata?.name||'ONE by WeddlySmartDesign');
    const mail=await sendActivationEmail(buyerEmail,row.activation_code,orderId,productName);
    return json({ok:true,provisioned:!!row.created,emailSent:mail.sent},201);
  }catch(e){
    console.warn(e);
    return json({ok:false,error:'server_error'},500);
  }
});