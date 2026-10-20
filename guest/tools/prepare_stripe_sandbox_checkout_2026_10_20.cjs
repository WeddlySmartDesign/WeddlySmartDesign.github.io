#!/usr/bin/env node
'use strict';
/* Build LOCAL-ONLY Stripe sandbox candidate from current checkout source.
 * Do not deploy this variant or publish credentials.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const argv=process.argv.slice(2),pos=argv.indexOf('--output'),output=pos>=0?argv[pos+1]:'';
const input=path.resolve(root,'guest/backend/guest-stripe-checkout/index.ts');
if(!output||!path.isAbsolute(output)||output===input||output.startsWith(root+path.sep))throw Error('OUTPUT_MUST_BE_SEPARATE_LOCAL_TEMP_FILE');
if(fs.existsSync(output))throw Error('OUTPUT_EXISTS_FAIL_CLOSED');
let s=fs.readFileSync(input,'utf8');
function once(before,after){
 const at=s.indexOf(before);
 if(at<0||s.indexOf(before,at+before.length)>=0)throw Error('SOURCE_DRIFT:'+before.slice(0,55));
 s=s.slice(0,at)+after+s.slice(at+before.length);
}
const marker="const env=(n:string)=>(Deno.env.get(n)||'').trim();";
const guard=[
'function assertStrictGuestSandbox(){',
" const secret=env('STRIPE_SECRET_KEY'),pub=env('STRIPE_PUBLISHABLE_KEY');",
" if(env('GUEST_STRIPE_SANDBOX_TEST_ONLY')!=='1'||!/^sk_test_[A-Za-z0-9_]+$/.test(secret)||!/^pk_test_[A-Za-z0-9_]+$/.test(pub))",
"  throw new Error('stripe_sandbox_keys_required');",
" if(env('WEDDLY_SITE_ORIGIN')!=='https://guest-ci-local.invalid'||env('GUEST_CATALOG_PUBLIC_ORIGIN')!=='https://guest-static-qa.pages.dev')",
"  throw new Error('sandbox_fake_hosts_required');",
" if(env('RESEND_API_KEY')||env('CLOUDFLARE_API_TOKEN')||env('SUPABASE_ACCESS_TOKEN'))",
"  throw new Error('sandbox_external_write_credentials_forbidden');",
'}',''].join('\n');
once(marker,marker+'\n'+guard);
once("async function stripeRequest(path:string,init:RequestInit={}){","async function stripeRequest(path:string,init:RequestInit={}){assertStrictGuestSandbox();");
once("const x=await r.json().catch(()=>({}));if(!r.ok){console.warn('stripe_error'","const x=await r.json().catch(()=>({}));if(r.ok&&x.livemode!==false)throw new Error('stripe_sandbox_livemode_violation');if(!r.ok){console.warn('stripe_error'");
once("Deno.serve(async req=>{","Deno.serve(async req=>{assertStrictGuestSandbox();");
if(!s.includes("Deno.env.get('RESEND_API_KEY')")||!s.includes("STRIPE_SECRET_KEY"))throw Error('EXPECTED_SOURCE_MISSING');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,s,{flag:'wx',mode:0o600});
assert(!fs.readFileSync(input,'utf8').includes('stripe_sandbox_livemode_violation'),'live source never modified');
console.log('PASS local-only Stripe sandbox adapter; LIVE source unchanged, fake hosts and external write credentials forbidden');
