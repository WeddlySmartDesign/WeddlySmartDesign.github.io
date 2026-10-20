#!/usr/bin/env node
'use strict';
// Stripe sandbox checkout contract against THE real checkout TypeScript
// transpiled into an isolated VM. All fetch calls are intercepted. No actual
// Stripe, Supabase, Resend, customers, deliveries, secrets or network.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto').webcrypto;
const ts=require('typescript');
const filename=process.argv[2];
if(!filename||!filename.startsWith('/tmp/'))throw Error('RUNNER_LOCAL_TEST_SOURCE_ONLY');
let source=fs.readFileSync(filename,'utf8');
for(const guard of ['stripe_sandbox_keys_required','stripe_sandbox_livemode_violation','sandbox_fake_hosts_required','sandbox_external_write_credentials_forbidden']){
 assert(source.includes(guard),'Missing security guard: '+guard);
}
source+='\n;globalThis.__guestSandboxContracts={validatePaid,catalogSaleOption};\n';
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const env={
 GUEST_STRIPE_SANDBOX_TEST_ONLY:'1',
 STRIPE_SECRET_KEY:'sk_test_FAKE_VM_NEVER_REAL',
 STRIPE_PUBLISHABLE_KEY:'pk_test_FAKE_VM_NEVER_REAL',
 GUEST_CATALOG_PUBLIC_ORIGIN:'https://guest-static-qa.pages.dev',
 WEDDLY_SITE_ORIGIN:'https://guest-ci-local.invalid',
 RESEND_API_KEY:'',CLOUDFLARE_API_TOKEN:'',SUPABASE_ACCESS_TOKEN:'',
 GUEST_CATALOG_SALE_OPTIONS:JSON.stringify({
   'veil-light':{status:'commercially-frozen',displayName:'VEIL LIGHT - PRUEBA SINTETICA',
     version:'5.3.3',amountCents:1299}
 }),
 GUEST_STRIPE_WEBHOOK_SECRET:'whsec_FAKE_VM_NEVER_REAL'
};
let handler,requests=[],stripeLive=false,blockEmails=0;
const safeFetch=async (raw,options={})=>{
 const url=String(raw);
 if(!url.startsWith('https://api.stripe.com/v1/checkout/sessions'))throw Error('NETWORK_DESTINATION_BLOCKED:'+url.slice(0,40));
 assert.equal(options.headers.Authorization,'Bearer '+env.STRIPE_SECRET_KEY);
 if(options.method!=='POST')throw Error('NO_REMOTE_GET');
 const form=new URLSearchParams(options.body);
 assert(form.get('line_items[0][price_data][unit_amount]')==='1299','Unexpected price');
 assert(form.get('metadata[guest_catalog_template_id]')==='veil-light','Wrong design');
 assert(form.get('metadata[guest_catalog_template_version]')==='5.3.3','Wrong frozen version');
 assert(form.get('metadata[pricing]')==='individual-design','Legacy package');
 assert(form.get('return_url').startsWith(env.WEDDLY_SITE_ORIGIN+'/'),'Production redirect forbidden');
 assert(!form.get('return_url').includes('weddlysmartdesign.github.io'),'Public origin unexpectedly used');
 assert(options.headers['Idempotency-Key'].startsWith('guest-checkout/'),'Missing idempotence');
 requests.push({idempotencyKey:options.headers['Idempotency-Key'],design:form.get('metadata[guest_catalog_template_id]')});
 return new Response(JSON.stringify({id:'cs_test_FAKE_VM',client_secret:'cs_test_FAKE_VM_secret',livemode:stripeLive}),{
  status:200,headers:{'content-type':'application/json'}
 });
};
const sandbox={exports:{},module:{exports:{}},require:n=>{
 if(n==='npm:@supabase/supabase-js@2')return{createClient(){throw Error('PRODUCTION_DB_FORBIDDEN')}};
 throw Error('UNEXPECTED_IMPORT:'+n);
},Deno:{env:{get:n=>env[n]||''},serve:fn=>{handler=fn}},fetch:safeFetch,
 URL,URLSearchParams,Request,Response,Headers,crypto,TextEncoder,AbortSignal,btoa,atob,
 console:{warn(){},error(){},log(){}},setTimeout,clearTimeout};
vm.createContext(sandbox);
vm.runInContext(compiled,sandbox,{timeout:15000,filename:'guest-stripe-checkout-sandbox.js'});
assert.equal(typeof handler,'function');
async function post(data,headers={}){
 const req=new Request('https://guest-ci-local.invalid/functions/v1/guest-stripe-checkout',{
  method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(data)
 });
 const response=await handler(req),json=await response.json();
 return {status:response.status,...json};
}
(async()=>{
 const config=await post({action:'config'});
 assert.equal(config.status,200);
 assert.equal(config.publishableKey,env.STRIPE_PUBLISHABLE_KEY);
 assert.equal(config.catalog['veil-light'].status,'available');
 assert.equal(config.catalog['veil-light'].priceCents,1299);
 assert(!config.catalog.botanica,'Pending BOTÁNICA must not appear');
 for(const input of [
  {action:'create',startPersonalizationConsent:false,checkoutAttemptId:'1234567890123456',catalogTemplateId:'veil-light'},
  {action:'create',startPersonalizationConsent:true,checkoutAttemptId:'1234567890123456',catalogTemplateId:'botanica'},
  {action:'create',startPersonalizationConsent:true,checkoutAttemptId:'1234567890123456',catalogTemplateId:'design-03'},
  {action:'create',startPersonalizationConsent:true,checkoutAttemptId:'1234567890123456'},
  {action:'create',startPersonalizationConsent:true,checkoutAttemptId:'bad',catalogTemplateId:'veil-light'}
 ]){
  const result=await post(input);
  assert.notEqual(result.ok,true,'Unsafe checkout unexpectedly passed: '+JSON.stringify(input));
  assert.equal(result.status,400);
 }
 assert.equal(requests.length,0,'Stripe should never be called for invalid checkout');
 const id='0123456789abcdef-9999';
 const a=await post({action:'create',edition:'signature',startPersonalizationConsent:true,checkoutAttemptId:id,catalogTemplateId:'veil-light'});
 assert.equal(a.status,200);assert.equal(a.ok,true);assert.equal(a.clientSecret,'cs_test_FAKE_VM_secret');
 const b=await post({action:'create',edition:'signature',startPersonalizationConsent:true,checkoutAttemptId:id,catalogTemplateId:'veil-light'});
 assert.equal(b.ok,true);
 assert.equal(requests.length,2);
 assert.equal(requests[0].idempotencyKey,requests[1].idempotencyKey,'Retries must use identical Stripe idempotence');
 stripeLive=true;
 const wrongMode=await post({action:'create',startPersonalizationConsent:true,checkoutAttemptId:'abcdef0123456789',catalogTemplateId:'veil-light'});
 assert.notEqual(wrongMode.ok,true,'A Stripe LIVE-mode response was accepted');
 stripeLive=false;
 for(const [key,value] of [
  ['STRIPE_SECRET_KEY','sk_live_NEVER'],
  ['STRIPE_PUBLISHABLE_KEY','pk_live_NEVER'],
  ['GUEST_STRIPE_SANDBOX_TEST_ONLY','0'],
  ['WEDDLY_SITE_ORIGIN','https://weddlysmartdesign.github.io'],
  ['GUEST_CATALOG_PUBLIC_ORIGIN','https://guest-weddlysmartdesign.pages.dev'],
  ['RESEND_API_KEY','re_fake'],
  ['CLOUDFLARE_API_TOKEN','cf_fake']
 ]){
  const previous=env[key];env[key]=value;
  let rejected=false;
  try{await post({action:'config'})}catch(e){rejected=String(e).includes('sandbox_')||String(e).includes('stripe_')}
  assert(rejected,'Fail-closed mode/isolation guard did not reject '+key);
  env[key]=previous;
 }
 const paid=sandbox.__guestSandboxContracts.validatePaid;
 const base={status:'complete',payment_status:'paid',currency:'eur',amount_subtotal:1299,amount_total:1299,
  metadata:{product:'guest',edition:'signature',amount_cents:'1299',guest_catalog_template_id:'veil-light'}};
 assert.equal(paid(base),'signature');
 for(const wrong of [
  {...base,status:'open'},
  {...base,payment_status:'unpaid'},
  {...base,currency:'usd'},
  {...base,amount_subtotal:1199},
  {...base,metadata:{...base.metadata,product:'one'}}
 ]){
  assert.throws(()=>paid(wrong),'Invalid settled payment state/currency/amount was accepted');
 }
 assert.equal(blockEmails,0);
 console.log(JSON.stringify({status:'PASS',mode:'VM_NETWORK_BLOCKED',validMockSandboxCreations:2,
  invalidCheckoutRefusals:5,liveResponseRejected:true,liveCredentialsHostEmailGuards:7,
  invalidPaidStates:5,idempotencyPinned:true,publicLiveDbUntouched:true,sale:'NO_GO'}));
})().catch(e=>{console.error('STRIPE_SANDBOX_CONTRACT_FAIL:',e.stack||e);process.exit(1)});
