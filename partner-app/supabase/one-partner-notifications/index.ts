import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

function admin(){
  const secretJson=Deno.env.get("SUPABASE_SECRET_KEYS");
  const key=secretJson?JSON.parse(secretJson).default:Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(Deno.env.get("SUPABASE_URL")!,key!,{auth:{persistSession:false}});
}
function envState(){
  return {
    resend:!!Deno.env.get("RESEND_API_KEY"),
    from:true,
    cronSecret:true,
    appUrl:true
  };
}
function json(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}})}
function esc(s:string){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]||c))}

Deno.serve(async(req)=>{
  const state=envState();
  if(req.method==="GET") return json({configured:state.resend&&state.from&&state.cronSecret,state});
  if(req.method!=="POST") return json({error:"method_not_allowed"},405);

  const sb=admin();
  const supplied=req.headers.get("x-partner-cron-secret")||"";
  const envExpected=Deno.env.get("PARTNER_NOTIFICATION_CRON_SECRET")||"";
  let valid=false;
  if(envExpected) valid=supplied===envExpected;
  else {
    const {data,error}=await sb.rpc("partner_validate_notification_cron",{p_secret:supplied});
    valid=!error && data===true;
  }
  if(!valid) return json({error:"forbidden"},403);

  const apiKey=Deno.env.get("RESEND_API_KEY")||"";
  const from=Deno.env.get("PARTNER_NOTIFICATION_FROM")||"ONE Partner <avisos@weddlysmartdesign.com>";
  if(!apiKey) return json({error:"email_not_configured"},503);
  const {data:batch,error:batchError}=await sb.rpc("partner_notification_email_batch",{p_limit:50});
  if(batchError) return json({error:"batch_failed"},500);

  let sent=0,failed=0;
  const appUrl=Deno.env.get("PARTNER_APP_URL")||"https://one-partner-production.up.railway.app/";
  for(const item of batch||[]){
    const subject="ONE Partner · "+String(item.title||"Revisión necesaria");
    const detail=String(item.detail||"");
    const wedding=String(item.wedding_name||"");
    const text=[
      wedding?"Boda: "+wedding:"",
      String(item.title||""),
      detail,
      "",
      appUrl?"Abre ONE Partner: "+appUrl:"Abre ONE Partner para revisarlo."
    ].filter(Boolean).join("\n");
    const html="<div style=\"font-family:Arial,sans-serif;color:#1d1a17;line-height:1.5\"><p style=\"font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#766f68\">ONE Partner by WeddlySmartDesign</p>"+
      (wedding?"<h2 style=\"font-size:22px\">"+esc(wedding)+"</h2>":"")+
      "<p><strong>"+esc(String(item.title||""))+"</strong></p><p>"+esc(detail)+"</p>"+
      (appUrl?"<p><a href=\""+esc(appUrl)+"\">Abrir ONE Partner</a></p>":"")+
      "<p style=\"font-size:12px;color:#766f68\">Este aviso se envía porque requiere una acción profesional. Puedes cambiar tus preferencias desde ONE Partner.</p></div>";

    const r=await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json","Idempotency-Key":"one-partner-"+String(item.signature||"").slice(0,40)},
      body:JSON.stringify({from,to:[item.email],subject,text,html})
    });
    if(r.ok){
      sent++;
      await sb.rpc("partner_mark_notification_emailed",{p_user_id:item.user_id,p_alert_key:item.alert_key,p_signature:item.signature});
    }else failed++;
  }

  return json({processed:(batch||[]).length,sent,failed});
});