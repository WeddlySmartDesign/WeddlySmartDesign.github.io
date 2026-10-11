#!/usr/bin/env node
'use strict';
// GUEST-only manager-authorized TEST order <-> GUEST tester license pairing candidate.
// Not deployed. No credentials, no SQL writes in this preparer; fail on source drift.
const assert=require('node:assert/strict');
const ANCHOR="    if(action==='list'){\n      const {data:rows,error}=await c.from('guest_invitation_orders')";
const HANDLER="    if(action==='link_test_license'){\n      // Owner HMAC managerContext is checked before this branch.\n      const orderId=txt(b.orderId,80),licenseId=txt(b.licenseId,80);\n      const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;\n      if(!uuid.test(orderId)||!uuid.test(licenseId))return json({ok:false,error:'invalid_test_link_identifiers'},400);\n      const order=await getOrder(c,orderId);\n      if(!order||order.mode!=='test'||order.status!=='delivered'||\n         !String(order.buyer_email||'').toLowerCase().endsWith('@example.invalid')||\n         templateSpec(order.template_id).testOnly!==true)\n        return json({ok:false,error:'test_only_order_required'},409);\n      if(order.license_id){\n        if(String(order.license_id)===licenseId)return json({ok:true,alreadyLinked:true});\n        return json({ok:false,error:'order_already_linked'},409);\n      }\n      const {data:lic,error:le}=await c.from('licenses')\n        .select('id,source,status,wedding_id,metadata').eq('id',licenseId).maybeSingle();\n      if(le)throw le;\n      if(!lic||lic.source!=='tester'||lic.status!=='active'||\n         String(lic.metadata?.product||'')!=='guests'||\n         !String(lic.metadata?.tester_label||'').startsWith('GUEST QA ')||\n         !uuid.test(String(lic.wedding_id||''))||\n         (lic.metadata?.expires_at&&Date.now()>=Date.parse(String(lic.metadata.expires_at))))\n        return json({ok:false,error:'active_guest_qa_license_required'},409);\n      const {count,error:me}=await c.from('wedding_members')\n        .select('license_id',{count:'exact',head:true})\n        .eq('license_id',licenseId).eq('wedding_id',lic.wedding_id).eq('status','active');\n      if(me)throw me;\n      if(!count)return json({ok:false,error:'guest_qa_wedding_member_required'},409);\n      const {data:existing,error:ee}=await c.from('guest_invitation_orders')\n        .select('id').eq('license_id',licenseId).neq('id',orderId).limit(1);\n      if(ee)throw ee;\n      if(existing?.length)return json({ok:false,error:'guest_qa_license_already_has_order'},409);\n      const {data:linked,error:ue}=await c.from('guest_invitation_orders')\n        .update({license_id:licenseId,updated_at:now()}).eq('id',orderId)\n        .eq('mode','test').eq('status','delivered').is('license_id',null)\n        .select('id').maybeSingle();\n      if(ue)throw ue;\n      if(!linked)return json({ok:false,error:'test_link_race_or_changed'},409);\n      return json({ok:true,status:'linked_test_guest_management',alreadyLinked:false});\n    }\n";
function patch(source){
 assert.equal(typeof source,'string');
 if(source.includes("if(action==='link_test_license')"))throw Error('ALREADY_APPLIED');
 if(source.split(ANCHOR).length!==2)throw Error('SOURCE_DRIFT');
 if(source.split("if(action==='create_test')").length!==2)throw Error('SOURCE_DRIFT_TEST_BRANCH');
 if(!source.includes("const ctx=await managerContext(c,req);if(!ctx)"))throw Error('MISSING_OWNER_AUTH');
 return source.replace(ANCHOR,HANDLER+ANCHOR);
}
if(require.main===module){
 const fs=require('node:fs');
 const input=process.argv[2],output=process.argv[3];
 if(!input)throw Error('Usage: node prepare_test_license_pairing_v18.cjs input.ts [new-output.ts]');
 const out=patch(fs.readFileSync(input,'utf8'));
 if(output)fs.writeFileSync(output,out,{flag:'wx'});else process.stdout.write(out);
}
module.exports={patch};
