#!/usr/bin/env node
'use strict';
/** Isolated release-delta from validated V13.
 * All existing WEDDLY_SITE_ORIGIN legacy review/access behavior stays unchanged.
 * Secondary catalog CDN origin requires an explicit operator env and an exact
 * V13 public capability in /guest/catalog-final.html?p=TOKEN.
 * No target host configured => current production behavior is identical.
 */
const fs=require('node:fs'),path=require('node:path');
const argv=process.argv.slice(2),val=name=>argv.includes(name)?argv[argv.indexOf(name)+1]:null;
function patch(s){
 const before="if(finalUrl.protocol!=='https:'||finalUrl.origin!==configuredSite.origin||finalUrl.username||finalUrl.password)return json({ok:false,error:'invalid_invitation_url'},400);";
 const after=`// SECONDARY STATIC CATALOG HOST: one operator-configured HTTPS origin, fail closed.
      // Keep existing site() for activation codes and historic VEIL orders.
      const publicOriginRaw=String(Deno.env.get('GUEST_CATALOG_PUBLIC_ORIGIN')||'').trim();
      let secondaryOrigin='';
      if(publicOriginRaw){
        try{
          const configured=new URL(publicOriginRaw);
          if(configured.protocol!=='https:'||configured.username||configured.password||
             configured.pathname!=='/'||configured.search||configured.hash)
            throw Error('invalid_catalog_public_origin');
          secondaryOrigin=configured.origin;
        }catch{return json({ok:false,error:'catalog_host_misconfigured'},503)}
      }
      const onPrimary=finalUrl.origin===configuredSite.origin;
      const onSecondary=secondaryOrigin!==''&&finalUrl.origin===secondaryOrigin&&
        finalUrl.pathname==='/guest/catalog-final.html'&&
        finalUrl.searchParams.get('p')===token&&
        Array.from(finalUrl.searchParams.keys()).length===1&&
        finalUrl.hash==='';
      if(finalUrl.protocol!=='https:'||finalUrl.username||finalUrl.password||
         !(onPrimary||onSecondary))return json({ok:false,error:'invalid_invitation_url'},400);`;
 if(s.split(before).length!==2||s.includes('GUEST_CATALOG_PUBLIC_ORIGIN')||
   !s.includes("if(spec.testOnly===true)return json({ok:false,error:'template_test_only'},409)")||
   !s.includes("if(action==='create_paid')"))throw Error('V13_SOURCE_DRIFT_OR_ALREADY_PATCHED');
 return s.replace(before,after);
}
if(require.main===module){
 const input=val('--input'),output=val('--output');
 if(!input||!output||path.resolve(input)===path.resolve(output)||fs.existsSync(output))
  throw Error('--input verified-v13.ts --output NEW-v14.ts, never overwrite');
 fs.writeFileSync(output,patch(fs.readFileSync(input,'utf8')),{flag:'wx'});
 console.log('Generated one guarded CDN-origin delta from V13. Not deployed.');
}
module.exports={patch};
