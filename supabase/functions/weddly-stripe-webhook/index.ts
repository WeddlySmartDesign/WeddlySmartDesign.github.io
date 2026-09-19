import { admin, env, provisionPaidStripeSession } from '../_shared/weddly-commerce.ts';

const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{
  status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}
});

function hex(bytes:ArrayBuffer){
  return Array.from(new Uint8Array(bytes)).map(x=>x.toString(16).padStart(2,'0')).join('');
}
async function hmacSha256(secret:string,message:string){
  const key=await crypto.subtle.importKey(
    'raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']
  );
  return hex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(message)));
}
function safeEq(a:string,b:string){
  if(a.length!==b.length)return false;
  let diff=0;
  for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);
  return diff===0;
}
async function verifyStripeSignature(raw:string,header:string,secret:string){
  const pieces=header.split(',').map(x=>x.trim());
  const t=pieces.find(x=>x.startsWith('t='))?.slice(2)||'';
  const signatures=pieces.filter(x=>x.startsWith('v1=')).map(x=>x.slice(3));
  const ts=Number(t);
  if(!Number.isFinite(ts)||!signatures.length)return false;
  if(Math.abs(Date.now()/1000-ts)>300)return false;
  const expected=await hmacSha256(secret,`${t}.${raw}`);
  return signatures.some(sig=>safeEq(sig,expected));
}

Deno.serve(async(req:Request)=>{
  if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405);
  try{
    const secret=env('STRIPE_WEBHOOK_SECRET');
    if(!secret)return json({ok:false,error:'webhook_not_configured'},503);

    const raw=await req.text();
    const sig=req.headers.get('stripe-signature')||'';
    if(!await verifyStripeSignature(raw,sig,secret)){
      return json({ok:false,error:'invalid_signature'},400);
    }

    const event=JSON.parse(raw||'{}');
    const eventId=String(event?.id||'');
    const eventType=String(event?.type||'');
    if(!eventId||!eventType)return json({ok:false,error:'invalid_event'},400);

    const db=admin();
    const inserted=await db.from('commerce_webhook_events').insert({
      provider:'stripe',event_id:eventId,event_type:eventType,payload:event
    });
    if(inserted.error){
      if(String(inserted.error.code)==='23505')return json({ok:true,duplicate:true});
      throw inserted.error;
    }

    const session=event?.data?.object;
    if(
      eventType==='checkout.session.completed' ||
      eventType==='checkout.session.async_payment_succeeded'
    ){
      if(session?.payment_status==='paid'){
        await provisionPaidStripeSession(db,session);
      }
    }else if(eventType==='checkout.session.expired'){
      if(session?.id){
        const upd=await db.from('commerce_orders').update({
          payment_status:'expired',updated_at:new Date().toISOString()
        }).eq('provider','stripe').eq('provider_session_id',String(session.id));
        if(upd.error)console.warn('expired_order_update_failed',upd.error);
      }
    }

    const done=await db.from('commerce_webhook_events').update({
      processed_at:new Date().toISOString()
    }).eq('provider','stripe').eq('event_id',eventId);
    if(done.error)console.warn('webhook_mark_processed_failed',done.error);

    return json({ok:true});
  }catch(e){
    console.warn('weddly-stripe-webhook',e);
    return json({ok:false,error:'server_error'},500);
  }
});
