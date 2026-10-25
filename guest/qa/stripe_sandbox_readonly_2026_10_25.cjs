#!/usr/bin/env node
'use strict';
/* GUEST STRICT READ-ONLY REAL STRIPE SANDBOX AUDIT.
   Reads up to five test Checkout sessions and logs status aggregates only.
   No sessions, payments, keys, IDs, emails or payment methods are created/logged.
*/
const assert=require('node:assert/strict');
const secret=String(process.env.GUEST_STRIPE_TEST_SECRET_KEY||'');
if (!/^sk_test_[A-Za-z0-9_]+$/.test(secret)||secret.length<20) throw Error('BLOCKED_TEST_ONLY_KEY_REQUIRED');
for (const name of ['STRIPE_SECRET_KEY','SUPABASE_ACCESS_TOKEN','RESEND_API_KEY','CLOUDFLARE_API_TOKEN']) {
 if (process.env[name]) throw Error('BLOCKED_EXTERNAL_PROVIDER_CREDENTIAL_'+name);
}
(async()=>{
 const endpoint='https://api.stripe.com/v1/checkout/sessions?limit=5';
 const reply=await fetch(endpoint,{method:'GET',redirect:'error',
  headers:{Authorization:'Bearer '+secret,'Stripe-Version':'2024-06-20'},
  signal:AbortSignal.timeout(18000)});
 if(!reply.ok)throw Error('STRIPE_SANDBOX_READ_HTTP_'+reply.status);
 const json=await reply.json();
 assert.equal(json.object,'list','STRIPE_RESPONSE_NOT_A_SESSION_LIST');
 assert(Array.isArray(json.data),'STRIPE_DATA_MISSING');
 if(json.data.some(v=>v.livemode!==false||!String(v.id||'').startsWith('cs_test_')))throw Error('STRIPE_LIVE_OR_UNEXPECTED_SESSION');
 const group={};
 for(const x of json.data){
  const key=['open','complete','expired'].includes(x.status)?x.status:'other';
  group[key]=(group[key]||0)+1;
 }
 console.log(JSON.stringify({result:'PASS',verification:'LIVE_STRIPE_API_READ_ONLY_WITH_GUEST_SANDBOX_SECRET',
   livemode:false,checkoutSessionsInspected:json.data.length,checkoutStatuses:group,
   existsGuestSession:json.data.some(x=>x.metadata?.product==='guest'),
   moneyMoved:false,checkoutCreated:false,licensesChanged:false,emailSent:false,
   credentialExposed:false,limit:'Last five sessions only; no checkout to fulfillment claim'}));
})().catch(e=>{console.error('GUEST_STRIPE_TEST_READ_ONLY_FAIL:',String(e?.message||'unknown').slice(0,120).replace(/sk_[a-z]+_[A-Za-z0-9_]+/g,'[REDACTED]'));process.exitCode=1});
