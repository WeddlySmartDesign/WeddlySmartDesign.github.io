#!/usr/bin/env node
'use strict';
/* MANUAL ONLY: creates one UNPAID Stripe TEST checkout session for GUEST
 * contract verification, then retrieves it. Does not confirm payment, provision
 * a license, send emails, or contact Supabase/Cloudflare. No LIVE permission.
 * GUEST_STRIPE_TEST_SECRET_KEY is supplied as an encrypted GitHub Actions secret.
 */
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const secret=process.env.GUEST_STRIPE_TEST_SECRET_KEY||'';
if(!/^sk_test_[A-Za-z0-9_]+$/.test(secret)||secret.length<20){
 console.error('BLOCKED: Stripe TEST secret is absent/invalid; no remote request attempted');
 process.exit(1);
}
for(const name of ['STRIPE_SECRET_KEY','SUPABASE_ACCESS_TOKEN','RESEND_API_KEY','CLOUDFLARE_API_TOKEN']){
 if(process.env[name]){console.error('BLOCKED: extraneous provider credential injected: '+name);process.exit(1)}
}
const code=fs.readFileSync('guest/backend/guest-stripe-checkout/index.ts','utf8');
for(const str of [
 "p.set('ui_mode','embedded_page')",
 "p.set('mode','payment')",
 "p.set('metadata[guest_catalog_template_id]',option.id)",
 "p.set('metadata[guest_catalog_template_version]',option.version)",
 "p.set('metadata[amount_cents]',String(amount))",
 "if(!consent)throw new Error('consent_required')"
]){
 if(!code.includes(str))throw Error('checkout_source_drift; manual test disabled');
}
const idempotency='guest-ci-unpaid/'+crypto.randomUUID();
const tag='ci-'+crypto.randomUUID();
const amount=1299; // Synthetic test-only amount; NOT an approved retail price.
const reference='https://f1b97db0.guest-weddlysmartdesign.pages.dev/guest-checkout-return.html?session_id={CHECKOUT_SESSION_ID}';
const params=new URLSearchParams();
for(const [k,v] of Object.entries({
 ui_mode:'embedded_page',mode:'payment',locale:'es',
 redirect_on_completion:'always',return_url:reference,
 'line_items[0][quantity]':'1','line_items[0][price_data][currency]':'eur',
 'line_items[0][price_data][unit_amount]':String(amount),
 'line_items[0][price_data][product_data][name]':'GUEST - PRUEBA INTERNA - NO VENTA',
 'metadata[product]':'guest','metadata[guest_catalog_template_id]':'veil-light',
 'metadata[guest_catalog_template_version]':'5.3.3',
 'metadata[amount_cents]':String(amount),'metadata[test_only]':'1',
 'metadata[ci_reference]':tag,
 client_reference_id:tag
}))params.set(k,v);
async function stripe(path,options={}){
 if(!/^\/checkout\/sessions(?:\/cs_test_[A-Za-z0-9_]+)?$/.test(path)){
  throw Error('REMOTE_STRIPE_PATH_REFUSED');
 }
 const headers={Authorization:'Bearer '+secret,...(options.headers||{})};
 const res=await fetch('https://api.stripe.com/v1'+path,{
  method:options.method||'GET',headers,body:options.body,
  signal:AbortSignal.timeout(20000),redirect:'error'
 });
 if(!res.ok)throw Error('STRIPE_TEST_HTTP_'+res.status);
 const payload=await res.json();
 if(payload?.livemode!==false)throw Error('STRIPE_LIVE_RESPONSE_BLOCKED');
 return payload;
}
(async()=>{
 const created=await stripe('/checkout/sessions',{
  method:'POST',headers:{'content-type':'application/x-www-form-urlencoded','Idempotency-Key':idempotency},
  body:params.toString()
 });
 if(!/^cs_test_[A-Za-z0-9_]+$/.test(created.id||''))throw Error('NOT_STRIPE_TEST_SESSION');
 if(!/^cs_test_/.test(created.client_secret||''))throw Error('NOT_STRIPE_TEST_EMBEDDED_CLIENT_SECRET');
 if(created.payment_status!=='unpaid'||created.status!=='open')throw Error('TEST_SESSION_NOT_UNPAID');
 const check=await stripe('/checkout/sessions/'+created.id);
 assert.equal(check.id,created.id);
 assert.equal(check.livemode,false);
 assert.equal(check.metadata?.guest_catalog_template_id,'veil-light');
 assert.equal(check.metadata?.guest_catalog_template_version,'5.3.3');
 assert.equal(check.metadata?.amount_cents,String(amount));
 assert.equal(check.metadata?.test_only,'1');
 assert.equal(check.currency,'eur');
 assert.equal(check.amount_subtotal,amount);
 assert.equal(check.payment_status,'unpaid');
 // Never print id, client secret, email, account identifiers or key.
 console.log(JSON.stringify({status:'PASS',integration:'STRIPE_REAL_SANDBOX_API',
  checkout:'embedded_page',templatePin:'veil-light/5.3.3',amount:'synthetic_not_commercial',
  testSession:true,livemode:false,paymentStatus:'unpaid',
  customerCharge:false,licenseProvisioned:false,emailSent:false,
  productionAffected:false,receipt:'no_token_or_session_id_logged'}));
})().catch(e=>{
 console.error('STRIPE_TEST_ONLY_CHECK_FAILED: '+String(e?.message||'unknown').slice(0,100).replace(/sk_[a-z]+_[A-Za-z0-9_]+/g,'[redacted]'));
 process.exitCode=1;
});
