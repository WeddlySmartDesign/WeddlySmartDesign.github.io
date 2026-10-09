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
 const end=generated.stdout.indexOf('// Call assertCatalogOrderMode',start);
 if(start<0||end<start)throw Error('unexpected_generated_registry');
 const declaration=generated.stdout.slice(start,end).trimEnd();
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
