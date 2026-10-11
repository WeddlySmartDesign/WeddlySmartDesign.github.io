#!/usr/bin/env node
'use strict';
/** GUEST-only V14 -> V15 release delta. No Cloud write or new hosting account.
 * Paid catalog production orders must use exactly ONE externally verified HTTPS
 * static host for review and final; legacy VEIL and test orders unaffected.
 * Never use WEDDLY_SITE_ORIGIN as fallback for a new catalog payment.
 */
const fs=require('node:fs'),path=require('node:path');
const argv=process.argv.slice(2),arg=k=>argv.includes(k)?argv[argv.indexOf(k)+1]:null;
function patch(s){
 const original=`const token=await capability(order.id,'r'),supplied=txt(b.reviewUrl,1200),localTest=order.mode==='test'&&!supplied,reviewUrl=supplied||(!localTest?site()+'/guest-review-v1.html?t='+encodeURIComponent(token):''),ts=now();`;
 const replacement=`const token=await capability(order.id,'r'),supplied=txt(b.reviewUrl,1200),localTest=order.mode==='test'&&!supplied,ts=now();
      // Paid catalog: review uses the SAME externally configured static host
      // as the eventual final URL. Legacy/test reviews keep historic behavior.
      const paidCatalogReview=order.mode==='production'&&Boolean(order.checkout_session_id);
      let reviewBase=site();
      if(paidCatalogReview){
        const raw=String(Deno.env.get('GUEST_CATALOG_PUBLIC_ORIGIN')||'').trim();
        if(!raw)return json({ok:false,error:'catalog_host_not_configured'},503);
        try{
          const host=new URL(raw);
          if(host.protocol!=='https:'||host.username||host.password||
             host.pathname!=='/'||host.search||host.hash)
            throw Error('invalid');
          reviewBase=host.origin;
        }catch{return json({ok:false,error:'catalog_host_misconfigured'},503)}
      }
      const expectedReviewUrl=reviewBase+'/guest-review-v1.html?t='+encodeURIComponent(token);
      if(paidCatalogReview&&supplied&&supplied!==expectedReviewUrl)
        return json({ok:false,error:'invalid_review_url'},400);
      const reviewUrl=supplied||(!localTest?expectedReviewUrl:'');`;
 if(s.split(original).length!==2)throw Error('V14_REVIEW_CONTRACT_DRIFT_OR_ALREADY_APPLIED');
 s=s.replace(original,replacement);
 const old=`if(finalUrl.protocol!=='https:'||finalUrl.username||finalUrl.password||
         !(onPrimary||onSecondary))return json({ok:false,error:'invalid_invitation_url'},400);`;
 const next=`const paidCatalogDelivery=order.mode==='production'&&Boolean(order.checkout_session_id);
      if(finalUrl.protocol!=='https:'||finalUrl.username||finalUrl.password||
         !(paidCatalogDelivery?onSecondary:(onPrimary||onSecondary)))
        return json({ok:false,error:'invalid_invitation_url'},400);`;
 if(s.split(old).length!==2||!s.includes('GUEST_CATALOG_PUBLIC_ORIGIN')||
    !s.includes("if(action==='create_paid')"))
   throw Error('V14_DELIVERY_CONTRACT_DRIFT_OR_NO_PAID_ORDERS');
 return s.replace(old,next);
}
if(require.main===module){
 const input=arg('--input'),output=arg('--output');
 if(!input||!output||path.resolve(input)===path.resolve(output)||fs.existsSync(output))
   throw Error('Specify --input /tmp/v14.ts --output /tmp/new-v15.ts (never overwrite)');
 const source=patch(fs.readFileSync(input,'utf8'));
 fs.writeFileSync(output,source,{flag:'wx'});
 console.log('PASS GUEST V15 paid catalog review/final share one HTTPS host; source staged, NOT DEPLOYED');
}
module.exports={patch};
