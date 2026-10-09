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
/* Production is a strict admission gate, not a filtered view of untrusted flags.
 * Validate ALL entries, including candidates excluded from production.
 * Every future template uses these same rules; VEIL is the only historical seal.
 */
if(registry.schemaVersion!=='guest-catalog-template-registry-v1'||
 evidence.schemaVersion!=='guest-catalog-admission-evidence-v1'||
 owner.schemaVersion!=='guest-catalog-owner-renderers-v2')throw Error('Catalog registry schema mismatch');
const required=evidence.policy?.newTemplateRequirements;
if(!Array.isArray(registry.templates)||!Array.isArray(required)||required.length===0||
 new Set(required).size!==required.length||required.some(k=>typeof k!=='string'||!k))throw Error('Missing or malformed admission requirements');
if(!evidence.templates||!owner.templates||!evidence.sharedBlockers||
 !Object.keys(evidence.sharedBlockers).length)throw Error('Incomplete catalog admission manifests');
const output=Object.create(null),seen=new Set();
for(const template of registry.templates){
 const id=template.id,entry=evidence.templates[id],view=owner.templates[id];
 if(typeof id!=='string'||!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id)||seen.has(id))throw Error('Duplicate or invalid catalog ID: '+id);
 seen.add(id);
 if(!entry||!view||!template.version||typeof template.version!=='string'||
  String(view.version)!==String(template.version)||String(entry.version)!==String(template.version)||
  view.status!==template.status||view.id!==id)throw Error('Incomplete or drifting manifest for '+id);
 if(!['native','iframe'].includes(view.mode)||typeof view.applyApi!=='string'||
  !/^[_A-Z][_A-Z0-9]*$/.test(view.applyApi))throw Error('Invalid renderer for '+id);
 if(!Array.isArray(template.typographyVariants)||!template.typographyVariants.length||
  template.typographyVariants.some(x=>typeof x!=='string'||!x)||
  !template.typographyVariants.includes(template.defaultTypographyVariant))throw Error('Invalid typography manifest for '+id);
 const certified=template.status==='commercially-frozen';
 if(!certified&&template.status!=='certification-pending')throw Error('Unrecognized template status for '+id);
 if(entry.basis==='pre-existing-commercial-seal'){
  if(id!=='veil-light'||template.version!=='5.3.3'||!certified)throw Error('Historical VEIL seal cannot certify '+id);
 }else{
  if(entry.basis!=='new-template-gated')throw Error('Unknown admission basis for '+id);
  const gates=entry.gates;
  if(!gates||required.some(k=>!gates[k]||typeof gates[k].pass!=='boolean'||
   typeof gates[k].source!=='string'||!gates[k].source)||
   Object.keys(gates).length!==required.length)throw Error('Missing or malformed admission evidence for '+id);
  if(certified){
   if(required.some(k=>gates[k].pass!==true)||
    Object.values(evidence.sharedBlockers).some(v=>v!==true)||
    template.scalabilityCertified!==true||
    template.operationalPilotPass!==true||
    template.visualRobustnessPass!==true)throw Error('Unsafe certified record '+id);
  }else if(template.scalabilityCertified===true||template.operationalPilotPass===true||
    template.visualRobustnessPass===true)throw Error('Pending template falsely certified '+id);
 }
 if(certified&&view.mode==='iframe'&&!view.src)throw Error('Certified template asset unavailable '+id);
 if(view.mode==='iframe'&&view.src!==null&&
  (typeof view.src!=='string'||!view.src.startsWith('/guest/catalog-assets/')||view.src.includes('..')))throw Error('Unsafe catalog asset '+id);
 if(!certified&&mode==='production')continue;
 output[id]={id,version:template.version,renderer:id+'-v'+template.version.replace(/[^a-z0-9-]/gi,'-'),
  active:true,...(!certified?{testOnly:true}:{}),
  typographyVariants:template.typographyVariants,defaultTypographyVariant:template.defaultTypographyVariant};
}
for(const id of Object.keys(evidence.templates))if(!seen.has(id))throw Error('Orphan evidence '+id);
for(const id of Object.keys(owner.templates))if(!seen.has(id))throw Error('Orphan renderer '+id);
const code=`/* GENERATED FROM GUEST CATALOG — ${mode.toUpperCase()}. NEVER DEPLOY WITHOUT AUTHORIZED REVIEW. */\nconst CATALOG_TEMPLATES:any=${JSON.stringify(output,null,2)};\n// Call assertCatalogOrderMode(spec,mode) inside ALL order-creation routes (test/checkout).\nfunction assertCatalogOrderMode(spec:any,mode:'test'|'production'){\n if(spec?.testOnly===true&&mode!=='test')throw new Error('template_test_only');\n}\n`;
const result={mode,templates:Object.keys(output),testOnly:Object.values(output).filter(x=>x.testOnly).map(x=>x.id),bytes:Buffer.byteLength(code)};
if(arg('--output')){const dst=path.resolve(arg('--output'));fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,code);}
else process.stdout.write(code);
process.stderr.write(JSON.stringify(result)+'\n');