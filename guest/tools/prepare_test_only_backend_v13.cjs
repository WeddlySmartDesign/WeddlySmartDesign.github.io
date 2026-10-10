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
/* Pure cross-template verification: no Botánica-specific admission exceptions.
 * The generated registry must contain every pinned catalog entry exactly once.
 */
function assertGeneratedCatalog(declaration,templates){
 const prefix='const CATALOG_TEMPLATES:any=';
 const begin=declaration.indexOf(prefix),end=declaration.indexOf(';\n// Call assertCatalogOrderMode');
 if(begin<0||end<=begin)throw Error('unexpected_generated_catalog');
 let items;
 try{items=JSON.parse(declaration.slice(begin+prefix.length,end))}catch{throw Error('invalid_generated_catalog_json')}
 if(!Array.isArray(templates)||!templates.length||!items||typeof items!=='object')throw Error('invalid_expected_catalog');
 const ids=new Set();
 for(const t of templates){
  if(!t||typeof t.id!=='string'||ids.has(t.id))throw Error('duplicate_expected_catalog_id');
  ids.add(t.id);
  const spec=Object.hasOwn(items,t.id)?items[t.id]:null;
  if(!spec||spec.id!==t.id||String(spec.version)!==String(t.version))throw Error('catalog_id_or_version_mismatch:'+t.id);
  const candidate=t.status==='certification-pending';
  if(!candidate&&t.status!=='commercially-frozen')throw Error('unreviewed_catalog_status:'+t.id);
  if((spec.testOnly===true)!==candidate)throw Error('catalog_test_only_mismatch:'+t.id);
 }
 if(Object.keys(items).length!==ids.size)throw Error('unexpected_generated_catalog_entries');
 return items;
}

function build(source){
 if(typeof source!=='string'||!source.includes("function buildConfig("))throw Error('missing_backend_source');
 const generated=cp.spawnSync(process.execPath,[path.join(root,'guest/tools/generate_backend_catalog_registry.cjs'),'--mode','test-only'],{cwd:root,encoding:'utf8',timeout:10000});
 if(generated.status!==0)throw Error('registry_generation_failed:'+generated.stderr);
 const start=generated.stdout.indexOf('const CATALOG_TEMPLATES:any=');
 if(start<0||!generated.stdout.includes('function assertCatalogOrderMode'))throw Error('unexpected_generated_registry');
 const declaration=generated.stdout.slice(start).trimEnd();
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'),'utf8'));
 assertGeneratedCatalog(declaration,catalog.templates);
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
   .replace('function assertLegacyDeliveredTestRead(config,order,files)', 'function assertLegacyDeliveredTestRead(config:any,order:any,files:any[])')
   .replaceAll('  const media=[];','  const media:any[]=[];');
 const schemaRuntime='const schema:any='+JSON.stringify(schema)+';\n'+validator+'\n'+typedGate+
   "\nfunction checkInvitationConfig(config:any,order:any,files:any[]=order.files||[],phase:string='stored'){\n"+
   " return assertPinnedInvitationConfig(config,order,validate,files,phase);\n}\n"+
   "function checkInvitationRead(config:any,order:any,files:any[]){\n"+
   " if(order?.mode==='test'&&order?.status==='delivered'&&config?.schemaVersion===undefined)\n"+
   "  return assertLegacyDeliveredTestRead(config,order,files);\n"+
   " return checkInvitationConfig(config,order,files,'hydrated');\n}\n";
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
   "if(!['review_ready','review_sent','changes_requested','approved','delivered'].includes(order.status))return json({ok:false,error:'review_not_ready'},409);\n      const files=await signedFiles(c,order,7200),config=checkInvitationRead(hydrateConfig(order.resolved_config||{},files),order,files);",
   'signed_review_gate');
 // Previous anchor occurs twice (review_load and detail); first is the
 // user-visible review, second is manager detail. Only review_load needs a
 // strict gate; once(...) insists it has exactly one occurrence.
 source=once(source,
   "const files=await signedFiles(c,order,86400),config=hydrateConfig(order.resolved_config||{},files);",
   "const files=await signedFiles(c,order,86400),config=checkInvitationRead(hydrateConfig(order.resolved_config||{},files),order,files);",
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

 // Existing V12 allows test orders to say "delivered" with empty delivery_url.
 // An empty test delivery cannot prove end-to-end invitation sharing or RSVP.
 // Require an actual final link for BOTH modes in the isolated V13 candidate.
 // This does not update V12 or any pre-existing delivered rows.
 source=once(source,
   "if(order.mode==='production'&&!inviteUrl)return json({ok:false,error:'missing_invitation_url'},400);",
   "if(!inviteUrl)return json({ok:false,error:'missing_invitation_url'},400);",
   'test_delivery_requires_final_url');

 // The final URL is sent to users and later decorated with recipient RSVP context.
 // Reject untrusted destinations (including javascript/http/lookalike domains).
 // The authorized canonical origin comes from WEDDLY_SITE_ORIGIN in the target
 // environment; an isolated staging site MUST set that variable explicitly.
 source=once(source,
   "if(!inviteUrl)return json({ok:false,error:'missing_invitation_url'},400);",
   "if(!inviteUrl)return json({ok:false,error:'missing_invitation_url'},400);\n"+
   "      let finalUrl:any;try{finalUrl=new URL(inviteUrl)}catch{return json({ok:false,error:'invalid_invitation_url'},400)}\n"+
   "      let configuredSite:any;try{configuredSite=new URL(site())}catch{return json({ok:false,error:'invalid_site_origin'},500)}\n"+
   "      if(finalUrl.protocol!=='https:'||finalUrl.origin!==configuredSite.origin||finalUrl.username||finalUrl.password)return json({ok:false,error:'invalid_invitation_url'},400);",
   'delivery_url_origin_guard');


 // Paid GUEST licenses can enter the EXISTING invitation workflow only after
 // the checkout has pinned an independently certified catalog template/version.
 // Manager-only, idempotent: never re-label legacy purchases or sell Botánica early.
 source=once(source,
   "    if(action==='create_test'){",
   `    if(action==='create_paid'){
      const licenseId=txt(b.licenseId,80);
      if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(licenseId))return json({ok:false,error:'invalid_license_id'},400);
      const spec=templateSpec(txt(b.templateId,80));
      assertCatalogOrderMode(spec,'production');
      const {data:license,error:le}=await c.from('licenses')
        .select('id,source,source_order_id,status,metadata').eq('id',licenseId).maybeSingle();
      if(le)throw le;
      const checkoutId=String(license?.source_order_id||''),meta=license?.metadata||{};
      if(!license||license.source!=='stripe'||license.status!=='active'||
         meta.product!=='guest'||!/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(checkoutId)||
         meta.guest_catalog_template_id!==spec.id||
         String(meta.guest_catalog_template_version||'')!==String(spec.version))
        return json({ok:false,error:'paid_catalog_template_not_purchased'},409);
      const {data:existing,error:xe}=await c.from('guest_invitation_orders')
        .select('id,mode,license_id,checkout_session_id,template_id,template_version')
        .eq('license_id',licenseId).maybeSingle();
      if(xe)throw xe;
      if(existing){
        if(existing.mode!=='production'||existing.checkout_session_id!==checkoutId||
           existing.template_id!==spec.id||String(existing.template_version)!==String(spec.version))
          return json({ok:false,error:'paid_catalog_order_conflict'},409);
        return json({ok:true,id:existing.id,alreadyCreated:true,
          qToken:await capability(existing.id,'q'),rToken:await capability(existing.id,'r'),
          pToken:await capability(existing.id,'p')});
      }
      const {data:delivery,error:de}=await c.from('license_delivery_codes')
        .select('buyer_email').eq('license_id',licenseId).maybeSingle();
      if(de)throw de;
      const email=txt(delivery?.buyer_email,200).toLowerCase();
      if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email))
        return json({ok:false,error:'paid_buyer_email_missing'},409);
      const created=await createOrder(c,'production',email,licenseId,checkoutId,spec.id);
      return json({ok:true,...created,alreadyCreated:false},201);
    }
    if(action==='create_test'){`,
   'paid_checkout_license_order_bridge');
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
 source=once(source,
   "}catch(e){const m=String((e as Error)?.message||'');console.error(e);if(['questionnaire_too_large'",
   "}catch(e){const m=String((e as Error)?.message||'');console.error(e);"+
   "if(['missing_signed_asset','missing_invitation_upload','missing_order_template_pin'].includes(m))return json({ok:false,error:m},409);"+
   "if(['invalid_invitation_config','invitation_template_pin_mismatch','invalid_invitation_media','invalid_invitation_rsvp_route','untrusted_legacy_invitation'].includes(m))return json({ok:false,error:m},400);"+
   "if(['questionnaire_too_large'",
   'safe_api_error_codes');
 // Fail closed: the existing order system has a single insert entry point. Every
 // creation path must continue to pass through that guarded function.
 if((source.match(/\.from\('guest_invitation_orders'\)\.insert\(/g)||[]).length!==1)
   throw Error('unreviewed_order_insert_paths');
 if((source.match(/await resend\(/g)||[]).length!==5)
   throw Error('unreviewed_email_paths');
 // Production VEIL logic is still subject to separate real regression.
 if(!source.includes("spec?.testOnly===true&&mode!=='test'"))throw Error('missing_test_only_guard');
 if(!source.includes('return normalizeBackendInvitationConfig({'))throw Error('missing_config_normalization');
 if((source.match(/checkInvitationConfig\(/g)||[]).length!==10)throw Error('missing_lifecycle_validation_paths');
 if((source.match(/checkInvitationRead\(/g)||[]).length!==3)throw Error('missing_legacy_read_paths');
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
module.exports={build,assertGeneratedCatalog};
