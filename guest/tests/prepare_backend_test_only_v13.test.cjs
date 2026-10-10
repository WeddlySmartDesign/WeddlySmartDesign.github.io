#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {build,assertGeneratedCatalog}=require('../tools/prepare_test_only_backend_v13.cjs');
const {stripTypeScriptTypes}=require('node:module');
const fixture="const CATALOG_TEMPLATES:any={\n  'veil-light':{id:'veil-light',version:'5.3.3',renderer:'veil-light-v5-3-3',active:true,typographyVariants:['classic','romantic','contemporary'],defaultTypographyVariant:'classic'}\n};\nfunction buildConfig(){\n  return {\n    template:{id:spec.id,version:pinnedVersion},\n    story:{textMode:story.textMode==='custom'?'custom':'preset',},\n    closing:{line:closing.mode==='custom'?txt(closing.customLine,80):'Gracias por formar parte de nuestra historia.'}\n  };\n}\nfunction validateQuestionnaire(q:any,files:any[]){\n  const e=[];\n  if(q?.story?.enabled&&q?.story?.textMode==='custom'&&!txt(q?.story?.customText,450))e.push('custom');\n}\nfunction hydrateConfig(config:any,files:any[]){\n  const map=new Map();\n  const walk=(x:any)=>{if(typeof x[k]==='string'&&x[k].startsWith('upload:'))x[k]=map.get(x[k].slice(7))||'';else walk(x[k])};\n  return config;\n}\nasync function createOrder(c:any,mode:'test'|'production'){\n  const spec=templateSpec(templateId),id=crypto.randomUUID(),qToken=token;\n  const {error}=await c.from('guest_invitation_orders').insert(row);\n}\nasync function submit(){\n      const config=buildConfig(questionnaire,order.files||[],'#',order.template_id,order.template_version),ts=now();\n      await internalSubmittedEmail(fresh);\n      if(email){\n        const steps='test';\n        await resend({to:[email],subject:'Hemos recibido vuestros datos',html:steps},'confirm');\n      }\n}\nasync function startDesign(){\n      const config=buildConfig(order.questionnaire||{},order.files||[],'#',order.template_id,order.template_version),ts=now();\n}\nasync function setConfig(){\n      const config=b.config&&typeof b.config==='object'?b.config:null;if(!config)return json({ok:false,error:'invalid_config'},400);\n      const rawCfg=JSON.stringify(config);if(rawCfg.length>120000)return json({ok:false,error:'config_too_large'},400);\n}\nasync function markReviewReady(){\n      const ts=now(),config=Object.keys(order.resolved_config||{}).length?order.resolved_config:buildConfig(order.questionnaire||{},order.files||[],'#',order.template_id,order.template_version);\n}\nasync function reviewLoad(){\n      if(!['review_ready','review_sent','changes_requested','approved','delivered'].includes(order.status))return json({ok:false,error:'review_not_ready'},409);\n      const files=await signedFiles(c,order,7200),config=hydrateConfig(order.resolved_config||{},files);\n}\nasync function reviewRespond(){\n      if(decision==='approve'){\n        const {error}=await c.from('guest_invitation_orders').update({status:'approved'});\n        await resend({to:['weddlysmartdesign@gmail.com'],subject:'Invitación GUEST aprobada',html:'ok'},'approve');\n      }\n      await resend({to:['weddlysmartdesign@gmail.com'],subject:'Cambios solicitados',html:'change'},'changes');\n}\nasync function publicLoad(){\n      const files=await signedFiles(c,order,86400),config=hydrateConfig(order.resolved_config||{},files);\n}\nasync function sendReview(){\n      const email=emailOf(order.questionnaire,order.buyer_email);if(!email)return json({ok:false,error:'missing_email'},400);\n      const token=await capability(order.id,'r'),supplied=txt(b.reviewUrl,1200),localTest=order.mode==='test'&&!supplied;\n      const ok=await resend({to:[email],subject:localTest?'Revisión de prueba preparada':'Revisión real',html:'review'},'review');\n}\nasync function deliver(){\n      const files=await copyPublicFiles(c,order),publicFiles=files.map((x:any)=>({...x,url:x.publicUrl||''})),config=hydrateConfig(order.resolved_config||{},publicFiles),ts=now();\n      if(order.mode==='production'&&!inviteUrl)return json({ok:false,error:'missing_invitation_url'},400);\n      const ok=await resend({to:[email],subject:localTest?'Entrega de prueba completada':'Entrega real',html:'delivery'},'delivery');\n      const {error}=await c.from('guest_invitation_orders').update({files,resolved_config:config,delivery_url:inviteUrl||null,status:'delivered',delivered_at:ts,updated_at:ts});\n}\nfunction outer(){try{}catch(e){const m=String((e as Error)?.message||'');console.error(e);if(['questionnaire_too_large','invalid_config'].includes(m))return json({ok:false,error:m},400)}}";
const patched=build(fixture);
assert.doesNotThrow(()=>new Function(stripTypeScriptTypes(patched)), 'staged Edge Function TypeScript must be syntactically valid after stripping types');
assert.match(patched,/schemaVersion:'guest-invitation-config-v1'/);
assert.match(patched,/function assertPinnedInvitationConfig\(config:any/);
assert.match(patched,/function validate\(data:any,contract:any=schema\)/);
assert.match(patched,/return normalizeBackendInvitationConfig\(\{/);
assert.match(patched,/function normalizeBackendInvitationConfig\(input:any\)/);
assert.match(patched,/textMode:story.textMode==='none'\?'none'/);
assert.match(patched,/assertCatalogOrderMode\(spec,mode\)/);
assert.match(patched,/"botanica": \{/);
assert.match(patched,/"testOnly": true/);
assert.match(patched,/veil-light-v5-3-3/);
assert.equal((patched.match(/checkInvitationConfig\(/g)||[]).length,10);
assert.equal((patched.match(/checkInvitationRead\(/g)||[]).length,3);
assert.match(patched,/function assertLegacyDeliveredTestRead\(config:any/);
assert.match(patched,/const files=order.mode==='test'\?/);
assert.match(patched,/missing_signed_asset','missing_invitation_upload','missing_order_template_pin'/);
assert.match(patched,/invalid_invitation_config','invitation_template_pin_mismatch'/);
assert.match(patched,/resolved_config:order.mode==='test'\?order.resolved_config:config/);
assert.match(patched,/if\(!inviteUrl\)return json\(\{ok:false,error:'missing_invitation_url'\},400\);/,'V13 must reject all deliveries with no final URL');
assert.ok(!patched.includes("if(order.mode==='production'&&!inviteUrl)"),'Test orders must not bypass URL requirement');
// Execute the ACTUAL generated V13 delivery URL guard rather than only matching source.
const guardMatch=patched.match(/if\(!inviteUrl\)return json\(\{ok:false,error:'missing_invitation_url'\},400\);[\s\S]*?if\(finalUrl\.protocol!=='https:'[\s\S]*?return json\(\{ok:false,error:'invalid_invitation_url'\},400\);/);
assert(guardMatch,'shared V13 deliver guard must include scheme, configured origin and credentials checks');
const compiledGuard=stripTypeScriptTypes('function __check(){'+guardMatch[0]+'\nreturn {ok:true};}');
const judge=new Function('inviteUrl','site','URL','json',compiledGuard+';return __check();');
const site=()=> 'https://weddlysmartdesign.github.io';
const json=(obj,status)=>({...obj,status});
for(const url of [
 'https://weddlysmartdesign.github.io/guest/invitacion.html',
 'https://weddlysmartdesign.github.io/guest/invitacion.html?rt=fake&g=someone',
 'https://weddlysmartdesign.github.io/guest/invitacion.html#record'
]){assert.equal(judge(url,site,URL,json).ok,true,'legitimate origin and HTTPS required: '+url)}
for(const url of [
 '',
 'http://weddlysmartdesign.github.io/guest/invitacion.html',
 'https://weddlysmartdesign.github.io.evil.example/guest/invitacion.html',
 'https://example.com/botanica',
 'javascript:alert(1)',
 '/guest/invitacion.html',
 'https://user:secret@weddlysmartdesign.github.io/guest/invitacion.html'
]){assert.equal(judge(url,site,URL,json).ok,false,'untrusted/missing final URL rejected: '+url)}
assert.equal(judge('https://staging.guest.invalid/botanica',()=> 'https://staging.guest.invalid',URL,json).ok,true,'legitimate isolated staging origin supported');
assert.equal(judge('https://weddlysmartdesign.github.io/guest/botanica',()=> 'https://staging.guest.invalid',URL,json).ok,false,'staging may not accidentally deliver production site URLs');
assert.match(patched,/checkInvitationConfig\(config,order\);/);
assert.match(patched,/checkInvitationRead\(hydrateConfig\(order.resolved_config/);
assert.match(patched,/if\(!resolved\)throw new Error\('missing_signed_asset'\)/);
assert.match(patched,/if\(order.mode!=='test'\)await internalSubmittedEmail/);
assert.equal((patched.match(/const ok=order.mode==='test'\?true:await resend/g)||[]).length,2);
assert.ok(!patched.includes("renderer:'botanica-v14-5'"));
assert.throws(()=>build(patched),/source_drift_or_duplicate/);
assert.throws(()=>build(fixture.replace("template:{id:spec.id,version:pinnedVersion}","template:{id:other.id}")),/source_drift_or_duplicate:schema_version/);
assert.throws(()=>build(fixture.replace("const rawCfg=JSON.stringify(config);", "const rawCfg=serialize(config);")),/source_drift_or_duplicate:set_config_gate/);
assert.throws(()=>build(fixture.replace("if(decision==='approve'){", "if(decision==='approve' && allowed){")),/source_drift_or_duplicate:review_approve_gate/);
assert.throws(()=>build(fixture.replace("x[k]=map.get(x[k].slice(7))||''", "x[k]=null")),/source_drift_or_duplicate:signed_media_fail_closed/);
assert.throws(()=>build(fixture.replace("const files=await copyPublicFiles(c,order)", "const files=await copyOtherFiles(c,order)")),/source_drift_or_duplicate:delivery_pre_post_gates/);
assert.throws(()=>build(fixture.replace(".from('guest_invitation_orders').insert(row)","from('guest_invitation_orders').insert(row)")),/unreviewed_order_insert_paths/);
assert.throws(()=>build(fixture.replace("await internalSubmittedEmail(fresh);","return true;")),/source_drift_or_duplicate:submission_internal_email/);
assert.throws(()=>build(fixture.replace("if(order.mode==='production'&&!inviteUrl)","if(false&&!inviteUrl)")),/source_drift_or_duplicate:test_delivery_requires_final_url/);
// The SAME preparer must work with any future template without hard-coded IDs.
const manifest=[
 {id:'veil-light',version:'5.3.3',status:'commercially-frozen'},
 {id:'botanica',version:'14.7',status:'certification-pending'},
 {id:'design-03',version:'1.0.0',status:'certification-pending'},
 {id:'design-1000',version:'25.0.0',status:'certification-pending'}
];
const specs={
 'veil-light':{id:'veil-light',version:'5.3.3'},
 botanica:{id:'botanica',version:'14.7',testOnly:true},
 'design-03':{id:'design-03',version:'1.0.0',testOnly:true},
 'design-1000':{id:'design-1000',version:'25.0.0',testOnly:true}
};
const sourceOf=entries=>'const CATALOG_TEMPLATES:any='+JSON.stringify(entries,null,2)+';\n// Call assertCatalogOrderMode(spec,mode) inside ALL order-creation routes.';
assert.equal(Object.keys(assertGeneratedCatalog(sourceOf(specs),manifest)).length,4);
const missing={...specs};delete missing['design-03'];
assert.throws(()=>assertGeneratedCatalog(sourceOf(missing),manifest),/catalog_id_or_version_mismatch:design-03/);
const promoted={...specs,'design-03':{...specs['design-03'],testOnly:false}};
assert.throws(()=>assertGeneratedCatalog(sourceOf(promoted),manifest),/catalog_test_only_mismatch:design-03/);
const drift={...specs,'design-1000':{...specs['design-1000'],version:'99.0'}};
assert.throws(()=>assertGeneratedCatalog(sourceOf(drift),manifest),/catalog_id_or_version_mismatch:design-1000/);
const orphan={...specs,unreviewed:{id:'unreviewed',version:'1',testOnly:true}};
assert.throws(()=>assertGeneratedCatalog(sourceOf(orphan),manifest),/unexpected_generated_catalog_entries/);
assert.throws(()=>assertGeneratedCatalog(sourceOf(specs),[manifest[0],manifest[1],manifest[1]]),/duplicate_expected_catalog_id/);
assert.throws(()=>assertGeneratedCatalog('not a catalog',manifest),/unexpected_generated_catalog/);
assert.equal(require('node:fs').readFileSync(require('node:path').resolve(__dirname,'../tools/prepare_test_only_backend_v13.cjs'),'utf8').includes('botanica_test_only_missing'),false,'Preparer must not require Botánica by name');

console.log('PASS: guarded v13 generated with pinned strict schema, 11 lifecycle checks, signed-media fail closed and 7 drift mutations plus 7 generic multi-template regressions. NO DEPLOY.');
