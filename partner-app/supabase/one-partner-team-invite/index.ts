import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL=Deno.env.get("SUPABASE_URL")||"";
const ANON_KEY=Deno.env.get("SUPABASE_ANON_KEY")||"";
const RESEND_API_KEY=Deno.env.get("RESEND_API_KEY")||"";
const FROM=Deno.env.get("PARTNER_NOTIFICATION_FROM")||"ONE Partner <avisos@weddlysmartdesign.com>";
const APP_URL=Deno.env.get("PARTNER_APP_URL")||"https://one-partner-production.up.railway.app/";

const allowed=new Set([
  "https://one-partner-production.up.railway.app",
  "https://partner.weddlysmartdesign.com"
]);

function cors(origin:string|null){
  const o=origin&&allowed.has(origin)?origin:"https://one-partner-production.up.railway.app";
  return {
    "Access-Control-Allow-Origin":o,
    "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Vary":"Origin"
  };
}
function json(body:unknown,status=200,origin:string|null=null){
  return new Response(JSON.stringify(body),{
    status,
    headers:{...cors(origin),"Content-Type":"application/json","Cache-Control":"no-store"}
  });
}

Deno.serve(async(req)=>{
  const origin=req.headers.get("origin");
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers:cors(origin)});
  if(req.method!=="POST") return json({error:"method_not_allowed"},405,origin);
  if(origin&&!allowed.has(origin)) return json({error:"origin_not_allowed"},403,origin);

  const auth=req.headers.get("authorization")||"";
  if(!auth.startsWith("Bearer ")) return json({error:"unauthorized"},401,origin);
  if(!SUPABASE_URL||!ANON_KEY) return json({error:"not_configured"},503,origin);

  let body:any={};
  try{body=await req.json()}catch{return json({error:"invalid_json"},400,origin)}
  const email=String(body.email||"").trim().toLowerCase();
  const role=body.role==="assistant"?"assistant":"planner";
  if(!email||!email.includes("@")) return json({error:"invalid_email"},400,origin);

  const commonHeaders={
    "apikey":ANON_KEY,
    "authorization":auth,
    "content-type":"application/json"
  };

  const teamRes=await fetch(SUPABASE_URL+"/rest/v1/rpc/partner_team",{
    method:"POST",headers:commonHeaders,body:"{}"
  });
  if(!teamRes.ok){
    return json({error:"team_not_available",detail:await teamRes.text()},teamRes.status,origin);
  }
  const team=await teamRes.json();
  if(team?.me?.role!=="admin") return json({error:"forbidden"},403,origin);

  const inviteRes=await fetch(SUPABASE_URL+"/rest/v1/rpc/partner_create_team_invite",{
    method:"POST",headers:commonHeaders,body:JSON.stringify({p_email:email,p_role:role})
  });
  if(!inviteRes.ok){
    return json({error:"invite_failed",detail:await inviteRes.text()},inviteRes.status,origin);
  }
  const invite=await inviteRes.json();
  const base=APP_URL.endsWith("/")?APP_URL:APP_URL+"/";
  const link=base+"?team_invite="+encodeURIComponent(invite.inviteToken);
  const studioName=team?.studio?.name||"tu estudio";

  let sent=false;
  let emailError="";
  if(RESEND_API_KEY){
    const mail=await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{
        "Authorization":"Bearer "+RESEND_API_KEY,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        from:FROM,
        to:[email],
        subject:"Te han invitado a ONE Partner",
        html:`<div style="font-family:Arial,sans-serif;color:#211e1b;line-height:1.55">
          <h2 style="font-family:Georgia,serif;font-weight:400">Te han invitado a ONE Partner</h2>
          <p><strong>${studioName}</strong> te ha invitado a formar parte de su equipo como ${role==="assistant"?"asistente":"wedding planner"}.</p>
          <p><a href="${link}" style="display:inline-block;background:#211e1b;color:white;text-decoration:none;padding:12px 18px;border-radius:10px">Aceptar invitación</a></p>
          <p style="font-size:12px;color:#706a64">La invitación caduca en 7 días. Utiliza este mismo email para crear o acceder a tu cuenta.</p>
        </div>`
      })
    });
    sent=mail.ok;
    if(!mail.ok) emailError=await mail.text();
  }

  return json({
    ok:true,
    sent,
    inviteId:invite.inviteId,
    email,
    role,
    link,
    emailError:sent?"":emailError
  },200,origin);
});