#!/usr/bin/env node
'use strict';
/*
 * Prepare a review-only GUEST invitation-flow candidate from the CURRENT
 * deployed v12 index.ts, without deploying it, sending emails or modifying
 * originals. The source must be inspected against the live Supabase function
 * before applying this operation. Fail closed on any unexpected changes.
 *
 * node guest/tools/prepare_test_only_backend_v13.cjs --input /tmp/index.ts --output /tmp/index.candidate.ts
 */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..');
function once(source,before,after,label){
 const first=source.indexOf(before);
 if(first<0||source.indexOf(before,first+before.length)!==-1)
  throw Error('source_drift_or_duplicate:'+label);
 return source.slice(0,first)+after+source.slice(first+before.length);
}
function build(source){
 if(typeof source!=='string'||!source.includes("function buildConfig("))throw Error('missing_backend_source');
 const generated=cp.spawnSync(process.execPath,[path.join(root,'guest/tools/generate_backend_catalog_registry.cjs'),'--mode','test-only'],{cwd:root,encoding:'utf8',timeout:10000});
 if(generated.status!==0)throw Error('registry_generation_failed:'+generated.stderr);
 const start=generated.stdout.indexOf('const CATALOG_TEMPLATES:any=');
 if(start<0||!generated.stdout.includes('function assertCatalogOrderMode'))throw Error('unexpected_generated_registry');
 const declaration=generated.stdout.slice(start).trimEnd();
 if(!declaration.includes('"botanica"')||!declaration.includes('"testOnly": true'))throw Error('botanica_test_only_missing');
 if(!declaration.includes('"veil-light"'))throw Error('veil_light_missing');
 source=once(source,`const CATALOG_TEMPLATES:any={
  'veil-light':{id:'veil-light',version:'5.3.3',renderer:'veil-light-v5-3-3',active:true,typographyVariants:['classic','romantic','contemporary'],defaultTypographyVariant:'classic'}
};`,declaration,'catalog_v12');
 source=once(source,
   "const spec=templateSpec(templateId),id=crypto.randomUUID(),qToken=",
   "const spec=templateSpec(templateId);assertCatalogOrderMode(spec,mode);const id=crypto.randomUUID(),qToken=",
   'central_order_creation_guard');
 source=once(source,
   "  return {\n    template:{id:spec.id,",
   "  return {\n    schemaVersion:'guest-invitation-config-v1',\n    template:{id:spec.id,",
   'schema_version');
 // Embed exactly the same pure normalization used by the Node contract QA.
 // Do not import Node/CJS in Deno; no per-template or per-order branches.
 const contract=fs.readFileSync(path.join(root,'guest/tools/backend_config_contract_v1.cjs'),'utf8');
 const fnStart=contract.indexOf('function normalizeBackendInvitationConfig(');
 const fnEnd=contract.indexOf('// Deno source can inline',fnStart);
 if(fnStart<0||fnEnd<0)throw Error('backend_normalizer_source_drift');
 const typed=contract.slice(fnStart,fnEnd)
  .replace('function normalizeBackendInvitationConfig(input)', 'function normalizeBackendInvitationConfig(input:any)')
  .replace('const optionalUrl = (object, key) =>', 'const optionalUrl = (object:any, key:string) =>');
 source=once(source,'function buildConfig(',typed+'\nfunction buildConfig(','inject_shared_normalizer');
 source=once(source,
   "  return {\n    schemaVersion:'guest-invitation-config-v1',",
   "  return normalizeBackendInvitationConfig({\n    schemaVersion:'guest-invitation-config-v1',",
   'normalize_build_config');
 source=once(source,
   "    closing:{line:closing.mode==='custom'?txt(closing.customLine,80):'Gracias por formar parte de nuestra historia.'}\n  };\n}",
   "    closing:{line:closing.mode==='custom'?txt(closing.customLine,80):'Gracias por formar parte de nuestra historia.'}\n  });\n}",
   'normalize_build_config_close');
 // Embed the EXACT canonical JSON Schema and the same strict validator as Node QA.
 // Prevent any set_config/manual path from bypassing the shared contract.
 const schema=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json'),'utf8'));
 const validatorSource=fs.readFileSync(path.join(root,'guest/qa/validate_invitation_config_v1.cjs'),'utf8');
 const vStart=validatorSource.indexOf('const equal=');
 const vEnd=validatorSource.indexOf('if(require.main===module)',vStart);
 if(vStart<0||vEnd<0)throw Error('validator_source_drift');
 const validator=validatorSource.slice(vStart,vEnd)
   .replace('const equal=(a,b)=>','const equal=(a:any,b:any)=>')
   .replace('function validate(data,contract=schema){','function validate(data:any,contract:any=schema){')
   .replace(' const errors=[];',' const errors:string[]=[];')
   .replace('const got=x=>','const got=(x:any)=>')
   .replace(' function walk(value,node,p){',' function walk(value:any,node:any,p:string){')
   .replace('const failures=[];','const failures:any[]=[];');
 if(!validator.includes('required_for_photo_only')||!validator.includes('return errors;'))
   throw Error('validator_semantics_drift');
 const gates=fs.readFileSync(path.join(root,'guest/tools/invitation_runtime_gate_v1.cjs'),'utf8');
 const gStart=gates.indexOf('function assertPinnedInvitationConfig(');
 const gEnd=gates.indexOf('if (typeof module',gStart);
 if(gStart<0||gEnd<0)throw Error('runtime_gate_source_drift');
 const typedGate=gates.slice(gStart,gEnd)
   .replace("function assertPinnedInvitationConfig(config, order, validateConfig, files, phase='stored')",
     "function assertPinnedInvitationConfig(config:any, order:any, validateConfig:(v:any)=>string[], files:any[], phase:string='stored')")
   .replace('  const media=[];','  const media:any[]=[];');
 const schemaRuntime='const schema:any='+JSON.stringify(schema)+';\n'+validator+'\n'+typedGate+
   "\nfunction checkInvitationConfig(config:any,order:any,files:any[]=order.files||[],phase:string='stored'){\n"+
   " return assertPinnedInvitationConfig(config,order,validate,files,phase);\n}\n";
 source=once(source,'function buildConfig(',schemaRuntime+'function buildConfig(','inject_shared_strict_runtime_gate');
 // Single guard applied at every lifecycle boundary. Only a new test-only
 // candidate is produced; existing live v12 must not be modified here.
 source=once(source,
   "const config=buildConfig(questionnaire,order.files||[],'#',order.template_id,order.template_version),ts=now()",
   "const config=checkInvitationConfig(buildConfig(questionnaire,order.files||[],'#',order.template_id,order.template_version),order),ts=now()",
   'submit_canonical_config_gate');
 source=once(source,
   "const config=buildConfig(order.questionnaire||{},order.files||[],'#',order.template_id,order.template_version),ts=now()",
   "const config=checkInvitationConfig(buildConfig(order.questionnaire||{},order.files||[],'#',order.template_id,order.template_version),order),ts=now()",
   'start_design_config_gate');
 source=once(source,
   "const rawCfg=JSON.stringify(config);if(rawCfg.length>120000)return json({ok:false,error:'config_too_large'},400);",
   "const rawCfg=JSON.stringify(config);if(rawCfg.length>120000)return json({ok:false,error:'config_too_large'},400);\n      checkInvitationConfig(config,order);",
   'set_config_gate');
 source=once(source,
   "const ts=now(),config=Object.keys(order.resolved_config||{}).length?order.resolved_config:buildConfig(order.questionnaire||{},order.files||[],'#',order.template_id,order.template_version);",
   "const ts=now(),config=checkInvitationConfig(Object.keys(order.resolved_config||{}).length?order.resolved_config:buildConfig(order.questionnaire||{},order.files||[],'#',order.template_id,order.template_version),order);",
   'mark_review_ready_gate');
 source=once(source,
   "if(decision==='approve'){\n        const {error}",
   "if(decision==='approve'){\n        checkInvitationConfig(order.resolved_config||{},order);\n        const {error}",
   'review_approve_gate');
 source=once(source,
   "const email=emailOf(order.questionnaire,order.buyer_email);if(!email)return json({ok:false,error:'missing_email'},400);\n      const token=await capability(order.id,'r')",
   "const email=emailOf(order.questionnaire,order.buyer_email);if(!email)return json({ok:false,error:'missing_email'},400);\n      checkInvitationConfig(order.resolved_config||{},order);\n      const token=await capability(order.id,'r')",
   'send_review_gate');
 source=once(source,
   "if(!['review_ready','review_sent','changes_requested','approved','delivered'].includes(order.status))return json({ok:false,error:'review_not_ready'},409);\n      const files=await signedFiles(c,order,7200),config=hydrateConfig(order.resolved_config||{},files);",
   "if(!['review_ready','review_sent','changes_requested','approved','delivered'].includes(order.status))return json({ok:false,error:'review_not_ready'},409);\n      const files=await signedFiles(c,order,7200),config=checkInvitationConfig(hydrateConfig(order.resolved_config||{},files),order,files,'hydrated');",
   'signed_review_gate');
 // Previous anchor occurs twice (review_load and detail); first is the
 // user-visible review, second is manager detail. Only review_load needs a
 // strict gate; once(...) insists it has exactly one occurrence.
 source=once(source,
   "const files=await signedFiles(c,order,86400),config=hydrateConfig(order.resolved_config||{},files);",
   "const files=await signedFiles(c,order,86400),config=checkInvitationConfig(hydrateConfig(order.resolved_config||{},files),order,files,'hydrated');",
   'public_final_gate');
 source=once(source,
   "const files=await copyPublicFiles(c,order),publicFiles=files.map((x:any)=>({...x,url:x.publicUrl||''})),config=hydrateConfig(order.resolved_config||{},publicFiles),ts=now()",
   "checkInvitationConfig(order.resolved_config||{},order);\n      const files=await copyPublicFiles(c,order),publicFiles=files.map((x:any)=>({...x,url:x.publicUrl||''})),config=checkInvitationConfig(hydrateConfig(order.resolved_config||{},publicFiles),order,publicFiles,'hydrated'),ts=now()",
   'delivery_pre_post_gates');
 // TEST orders must NEVER promote uploaded media into the permanent public
 // storage bucket. Serve private, expiring signed assets through public_load;
 // the token URL remains stable while signatures are refreshed per request.
 source=once(source,
   "const files=await copyPublicFiles(c,order),publicFiles=files.map((x:any)=>({...x,url:x.publicUrl||''})),config=checkInvitationConfig(",
   "const files=order.mode==='test'?(Array.isArray(order.files)?order.files:[]):await copyPublicFiles(c,order),publicFiles=order.mode==='test'?await signedFiles(c,order,7200):files.map((x:any)=>({...x,url:x.publicUrl||''})),config=checkInvitationConfig(",
   'test_private_media_no_public_storage');
 source=once(source,
   "update({files,resolved_config:config,delivery_url:inviteUrl||null,status:'delivered'",
   "update({files,resolved_config:order.mode==='test'?order.resolved_config:config,delivery_url:inviteUrl||null,status:'delivered'",
   'test_delivery_keep_upload_refs');

 // Failing signatures from the signing API must NOT become blank images.
 source=once(source,
   "if(typeof x[k]==='string'&&x[k].startsWith('upload:'))x[k]=map.get(x[k].slice(7))||'';else walk(x[k])",
   "if(typeof x[k]==='string'&&x[k].startsWith('upload:')){const resolved=map.get(x[k].slice(7));if(!resolved)throw new Error('missing_signed_asset');x[k]=resolved;}else walk(x[k])",
   'signed_media_fail_closed');
 source=once(source,
   "textMode:story.textMode==='custom'?'custom':'preset',",
   "textMode:story.textMode==='none'?'none':(story.textMode==='custom'?'custom':'preset'),",
   'story_none');
 source=once(source,
   "  if(q?.story?.enabled&&q?.story?.textMode==='custom'&&!txt(q?.story?.customText,450))",
   "  if(q?.story?.enabled&&q?.story?.textMode==='none'&&!files.some((f:any)=>f.slot==='story'))e.push('Añade una foto para la historia solo fotográfica.');\n  if(q?.story?.enabled&&q?.story?.textMode==='custom'&&!txt(q?.story?.customText,450))",
   'photo_required');
 source=once(source,
   "      await internalSubmittedEmail(fresh);",
   "       if(order.mode!=='test')await internalSubmittedEmail(fresh);",
   'submission_internal_email');
 source=once(source,
   "      if(email){\n        const steps=",
   "       if(email&&order.mode!=='test'){\n         const steps=",
   'submission_customer_email');
 source=once(source,
   "        await resend({to:['weddlysmartdesign@gmail.com'],subject:'Invitación GUEST aprobada",
   "         if(order.mode!=='test')await resend({to:['weddlysmartdesign@gmail.com'],subject:'Invitación GUEST aprobada",
   'approval_internal_email');
 source=once(source,
   "      await resend({to:['weddlysmartdesign@gmail.com'],subject:'Cambios solicitados",
   "       if(order.mode!=='test')await resend({to:['weddlysmartdesign@gmail.com'],subject:'Cambios solicitados",
   'changes_internal_email');
 source=once(source,
   "      const ok=await resend({to:[email],subject:localTest?'Revisión de prueba preparada'",
   "      const ok=order.mode==='test'?true:await resend({to:[email],subject:localTest?'Revisión de prueba preparada'",
   'review_outbound_email');
 source=once(source,
   "      const ok=await resend({to:[email],subject:localTest?'Entrega de prueba completada'",
   "      const ok=order.mode==='test'?true:await resend({to:[email],subject:localTest?'Entrega de prueba completada'",
   'delivery_outbound_email');
 // Fail closed: the existing order system has a single insert entry point. Every
 // creation path must continue to pass through that guarded function.
 if((source.match(/\.from\('guest_invitation_orders'\)\.insert\(/g)||[]).length!==1)
   throw Error('unreviewed_order_insert_paths');
 if((source.match(/await resend\(/g)||[]).length!==5)
   throw Error('unreviewed_email_paths');
 // Production VEIL logic is still subject to separate real regression.
 if(!source.includes("spec?.testOnly===true&&mode!=='test'"))throw Error('missing_test_only_guard');
 if(!source.includes('return normalizeBackendInvitationConfig({'))throw Error('missing_config_normalization');
 if((source.match(/checkInvitationConfig\(/g)||[]).length!==11)throw Error('missing_lifecycle_validation_paths');
 if(!source.includes("const files=order.mode==='test'?(Array.isArray(order.files)?order.files:[]):await copyPublicFiles"))
   throw Error('missing_test_private_media_barrier');
 if(!source.includes("resolved_config:order.mode==='test'?order.resolved_config:config"))
   throw Error('test_frozen_upload_ref_barrier_missing');
 return source;
}
if(require.main===module){
 const args=process.argv.slice(2),arg=k=>args.includes(k)?args[args.indexOf(k)+1]:null;
 const input=arg('--input'),output=arg('--output');
 if(!input||!output)throw Error('Usage: --input deployed-v12-index.ts --output NEW-candidate.ts');
 if(path.resolve(input)===path.resolve(output))throw Error('cannot_overwrite_input');
 if(fs.existsSync(output))throw Error('cannot_overwrite_candidate');
 const result=build(fs.readFileSync(input,'utf8'));
 fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});
 fs.writeFileSync(output,result,{flag:'wx'});
 console.log('PREPARED TEST-ONLY CANDIDATE, NOT DEPLOYED. Verify all paths and snapshot before any authorized release.');
}
module.exports={build};
