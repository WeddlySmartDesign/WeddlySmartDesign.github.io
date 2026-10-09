#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {build}=require('../tools/prepare_test_only_backend_v13.cjs');
const fixture=`
const CATALOG_TEMPLATES:any={
  'veil-light':{id:'veil-light',version:'5.3.3',renderer:'veil-light-v5-3-3',active:true,typographyVariants:['classic','romantic','contemporary'],defaultTypographyVariant:'classic'}
};
function buildConfig(){
  return {
    template:{id:spec.id,version:pinnedVersion},
    story:{
      textMode:story.textMode==='custom'?'custom':'preset',
    }
  };
}
function validateQuestionnaire(q:any,files:any[]){
  const e=[];
  if(q?.story?.enabled&&q?.story?.textMode==='custom'&&!txt(q?.story?.customText,450))e.push('custom');
}
async function createOrder(c:any,mode:'test'|'production'){
  const spec=templateSpec(templateId),id=crypto.randomUUID(),qToken=token;
  const {error}=await c.from('guest_invitation_orders').insert(row);
}
async function submit(order:any){
       await internalSubmittedEmail(fresh);
       if(email){
         const steps='here';
         await resend({to:[email],subject:'Hemos recibido vuestros datos',html:steps},'confirm');
       }
}
async function review(order:any){
         await resend({to:['weddlysmartdesign@gmail.com'],subject:'Invitación GUEST aprobada · '+orderLabel(order),html:'ok'},'approve');
       await resend({to:['weddlysmartdesign@gmail.com'],subject:'Cambios solicitados · '+orderLabel(order),html:'change'},'changes');
       const ok=await resend({to:[email],subject:localTest?'Revisión de prueba preparada':'Revisión real',html:'review'},'review');
}
async function deliver(order:any){
       const ok=await resend({to:[email],subject:localTest?'Entrega de prueba completada':'Entrega real',html:'delivery'},'delivery');
}
`;
const patched=build(fixture);
assert.match(patched,/schemaVersion:'guest-invitation-config-v1'/);
assert.match(patched,/textMode:story.textMode==='none'\?'none'/);
assert.match(patched,/historia solo fotográfica/);
assert.match(patched,/assertCatalogOrderMode\(spec,mode\)/);
assert.match(patched,/"botanica": \{/);
assert.match(patched,/"testOnly": true/);
assert.match(patched,/veil-light-v5-3-3/);
assert.match(patched,/if\(order.mode!=='test'\)await internalSubmittedEmail/);
assert.match(patched,/if\(email&&order.mode!=='test'\)/);
assert.match(patched,/if\(order.mode!=='test'\)await resend/);
assert.equal((patched.match(/const ok=order.mode==='test'\?true:await resend/g)||[]).length,2);
assert.ok(!patched.includes("renderer:'botanica-v14-5'"));
assert.equal(fixture.includes('testOnly'),false);
assert.throws(()=>build(patched),/source_drift_or_duplicate/);
assert.throws(()=>build(fixture.replace("template:{id:spec.id,version:pinnedVersion}","template:{id:other.id}")),/source_drift_or_duplicate:schema_version/);
assert.throws(()=>build(fixture.replace(".from('guest_invitation_orders').insert(row)","from('guest_invitation_orders').insert(row)")),/unreviewed_order_insert_paths/);
assert.throws(()=>build(fixture.replace("await internalSubmittedEmail(fresh);","return true;")),/source_drift_or_duplicate:submission_internal_email/);
assert.throws(()=>build(fixture.replace("'Revisión de prueba preparada'","'CHANGED'")),/source_drift_or_duplicate:review_outbound_email/);
console.log('PASS: generated guarded test-only backend candidate from shared catalog; schema/none/photo/email gates; VEIL retained; 5 drift mutations rejected. NO DEPLOY.');
