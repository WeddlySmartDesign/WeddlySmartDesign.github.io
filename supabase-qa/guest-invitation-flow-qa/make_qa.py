# Genera index.ts (copia QA de guest-invitation-flow v21) a partir de
# guest/backend/guest-invitation-flow/index.ts de la rama guest-independent.
# Uso: copiar ese archivo como flow.src.ts junto a este script y ejecutar.
import re
s=open('flow.src.ts').read()
def once(a,b):
    global s
    assert s.count(a)==1,a[:70]
    s=s.replace(a,b)
PREVIEW='https://guest-stripe-pago-2026-10-24.guest-invitaciones.pages.dev'
once("const site=()=>String(Deno.env.get('WEDDLY_SITE_ORIGIN')",
"""/* QA COPY of guest-invitation-flow v21 (live, untouched). Every catalog design is sellable here,
 * review/final links point to the branch preview, and emails only reach the owner's own addresses. */
const QA_PREVIEW='%s';
const QA_EMAILS=['weddlysmartdesign@gmail.com','pilarrodriguezbonilla@gmail.com','info@weddlysmartdesign.com'];
const qaEnv=(n:string)=>n==='GUEST_CATALOG_PUBLIC_ORIGIN'?QA_PREVIEW+'/':(Deno.env.get(n)||'');
const site=()=>String(Deno.env.get('WEDDLY_SITE_ORIGIN')""" % PREVIEW)
s=s.replace("Deno.env.get('GUEST_CATALOG_PUBLIC_ORIGIN')","qaEnv('GUEST_CATALOG_PUBLIC_ORIGIN')")
s=re.sub(r'"testOnly":\s*true','"testOnly": false',s)
once("  if(!key||!from)return false;\n",
"""  if(!key||!from)return false;
  const to=(Array.isArray(body?.to)?body.to:[]).map((x:string)=>String(x).toLowerCase());
  if(!to.length||!to.every((x:string)=>QA_EMAILS.includes(x))){console.warn('qa_email_blocked');return true}
  body={...body,subject:'[PRUEBA] '+String(body?.subject||'')};
""")
# Changes: the couple fixes the data themselves in the questionnaire, so hand back its link.
once("return json({ok:true,status:'changes_requested'});",
     "return json({ok:true,status:'changes_requested',questionnaireToken:await capability(order.id,'q')});")
once("link=site()+'/guest-orders-admin-v2.html'","link=QA_PREVIEW+'/guest/panel-pruebas.html'")
assert 'testOnly": true' not in s and '"testOnly":true' not in s
open('index.ts','w').write(s)
print('ok',len(s))
