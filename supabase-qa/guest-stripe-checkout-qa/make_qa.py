# Genera index.ts (copia QA, solo Stripe TEST) a partir de guest/backend/guest-stripe-checkout/index.ts
# de la rama guest-independent (= v26 en vivo). Uso: copiar ese archivo como index.ts junto a este script y ejecutar.
import sys
s=open('index.ts').read()
def once(a,b):
    global s
    assert s.count(a)==1,a[:60]
    s=s.replace(a,b)
PREVIEW='https://guest-stripe-pago-2026-10-24.guest-invitaciones.pages.dev'
once("const env=(n:string)=>(Deno.env.get(n)||'').trim();",
"""/* QA COPY — Stripe TEST only. Derived from guest-stripe-checkout v26 (live, untouched).
 * Reads only the GUEST_STRIPE_TEST_* secrets, refuses any live key or livemode object,
 * sells only the QA catalog below and emails only the owner's own addresses. */
const QA_PREVIEW='%s';
const QA_ENV:Record<string,string>={
 GUEST_CATALOG_SALE_OPTIONS:JSON.stringify(Object.fromEntries(Object.entries({'design-09':'Azahar','design-11':'Cristal','design-07':'Espejo','veil-light':'Seda','design-12':'Abanico','design-05':'Gala','design-06':'Invernadero','design-08':'Melodía','design-10':'Cuento','botanica':'Botánica','design-16':'Rumbo','design-04':'Brisa','design-13':'Viñeta','design-14':'Ellas','design-15':'Ellos'}).map(([id,displayName])=>[id,{version:id==='veil-light'?'5.3.3':id==='botanica'?'14.7':'1.0.0',status:'commercially-frozen',edition:'signature',amountCents:5990,displayName}]))),
 WEDDLY_SITE_ORIGIN:QA_PREVIEW,GUEST_CATALOG_PUBLIC_ORIGIN:QA_PREVIEW,
 STRIPE_WEBHOOK_SECRET:'',WEDDLY_STRIPE_AUTOMATIC_TAX:''
};
const QA_SECRET_NAMES:Record<string,string>={STRIPE_SECRET_KEY:'GUEST_STRIPE_TEST_SECRET_KEY',STRIPE_PUBLISHABLE_KEY:'GUEST_STRIPE_TEST_PUBLISHABLE_KEY'};
const QA_EMAILS=['weddlysmartdesign@gmail.com','pilarrodriguezbonilla@gmail.com','info@weddlysmartdesign.com'];
const env=(n:string)=>Object.prototype.hasOwnProperty.call(QA_ENV,n)?QA_ENV[n]:(Deno.env.get(QA_SECRET_NAMES[n]||n)||'').trim();
function assertTestKeys(){
 if(!/^sk_test_[A-Za-z0-9_]+$/.test(env('STRIPE_SECRET_KEY'))||!/^pk_test_[A-Za-z0-9_]+$/.test(env('STRIPE_PUBLISHABLE_KEY')))throw new Error('stripe_not_configured');
}""" % PREVIEW)
once("async function stripeRequest(path:string,init:RequestInit={}){","async function stripeRequest(path:string,init:RequestInit={}){assertTestKeys();")
once("const x=await r.json().catch(()=>({}));if(!r.ok){","const x=await r.json().catch(()=>({}));if(r.ok&&x.livemode!==false)throw new Error('stripe_not_configured');if(!r.ok){")
once("const response=await fetch(env('SUPABASE_URL')+'/functions/v1/guest-invitation-flow',{","const response=await fetch(env('SUPABASE_URL')+'/functions/v1/guest-invitation-flow-qa',{")
once("p.set('return_url',base+'/guest-checkout-return.html?session_id={CHECKOUT_SESSION_ID}');","p.set('return_url',base+'/gracias.html?session_id={CHECKOUT_SESSION_ID}');")
once("const key=env('RESEND_API_KEY'),from=env('WEDDLY_RESEND_FROM');if(!key||!from)return false;",
     "const key=env('RESEND_API_KEY'),from=env('WEDDLY_RESEND_FROM');if(!key||!from)return false;\n const to=(payload.body?.to||[]).map((x:string)=>String(x).toLowerCase());if(!to.length||!to.every((x:string)=>QA_EMAILS.includes(x))){console.warn('qa_email_blocked');return false}\n payload.body.subject='[PRUEBA] '+payload.body.subject;")
once("if(sig)return await handleWebhook(raw,sig);","if(sig)return json({ok:false,error:'qa_no_webhook'},400);")
import re
a=s.index("const pk=env('STRIPE_PUBLISHABLE_KEY')||'pk_live_");b=s.index(";",a)
s=s[:a]+"assertTestKeys();const pk=env('STRIPE_PUBLISHABLE_KEY')"+s[b:]
assert 'pk_live' not in s and 'sk_live' not in s
open('qa.ts','w').write(s)
print('ok',len(s))
