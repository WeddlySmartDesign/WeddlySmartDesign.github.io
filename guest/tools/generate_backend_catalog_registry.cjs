#!/usr/bin/env node
'use strict';
/** Deterministic, deployment-free backend registry generator.
 * Usage: node guest/tools/generate_backend_catalog_registry.cjs --root . --mode production|test-only [--output FILE]
 * Nothing touches Supabase. A controlled operator must separately verify backend
 * invariants, protection against production orders, regression and deploy authority.
 */
const fs=require('node:fs'),path=require('node:path');
const args=process.argv.slice(2),arg=k=>args.includes(k)?args[args.indexOf(k)+1]:null;
const root=path.resolve(arg('--root')||path.join(__dirname,'../..'));
const mode=arg('--mode')||'production';
if(!['production','test-only'].includes(mode))throw Error('Mode must be production or test-only');
const registry=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'),'utf8'));
const evidence=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json'),'utf8'));
const owner=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json'),'utf8'));
const output={};
for(const template of registry.templates){
 const id=template.id;
 if(!evidence.templates?.[id]||!owner.templates?.[id]||String(owner.templates[id].version)!==String(template.version))throw Error('Incomplete manifest for '+id);
 const certified=template.status==='commercially-frozen';
 if(evidence.templates[id].basis==='pre-existing-commercial-seal'&&(id!=='veil-light'||template.version!=='5.3.3'))throw Error('Historical VEIL seal cannot certify '+id);
 if(!certified&&template.status!=='certification-pending')throw Error('Unrecognized template status for '+id);
 if(!certified&&mode==='production')continue;
 const testOnly=!certified;
 if(certified && evidence.templates[id].basis==='new-template-gated'){
  const pass=Object.values(evidence.templates[id].gates||{}).every(x=>x.pass===true);
  if(!pass||Object.values(evidence.sharedBlockers||{}).some(x=>x!==true))throw Error('Unsafe certified record '+id);
 }
 output[id]={id,version:template.version,renderer:`${id}-v${template.version.replace(/[^a-z0-9-]/gi,'-')}`,active:true,...(testOnly?{testOnly:true}:{}),typographyVariants:template.typographyVariants,defaultTypographyVariant:template.defaultTypographyVariant};
}
const code=`/* GENERATED FROM GUEST CATALOG — ${mode.toUpperCase()}. NEVER DEPLOY WITHOUT AUTHORIZED REVIEW. */\nconst CATALOG_TEMPLATES:any=${JSON.stringify(output,null,2)};\n// Call assertCatalogOrderMode(spec,mode) inside ALL order-creation routes (test/checkout).\nfunction assertCatalogOrderMode(spec:any,mode:'test'|'production'){\n if(spec?.testOnly===true&&mode!=='test')throw new Error('template_test_only');\n}\n`;
const result={mode,templates:Object.keys(output),testOnly:Object.values(output).filter(x=>x.testOnly).map(x=>x.id),bytes:Buffer.byteLength(code)};
if(arg('--output')){const dst=path.resolve(arg('--output'));fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,code);}
else process.stdout.write(code);
process.stderr.write(JSON.stringify(result)+'\n');