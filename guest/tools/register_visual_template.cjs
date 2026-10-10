#!/usr/bin/env node
'use strict';
/**
 * Deterministic visual-plugin onboarding for GUEST.
 * Only new HTML+manifest are supplied for a new design. Commercial status stays
 * certification-pending, and no Edge Function, payments, or public site is touched.
 * Usage: node guest/tools/register_visual_template.cjs --root DIR --manifest plugin.json [--apply]
 * Default is a read-only plan. --apply may only write a distinct, new template ID.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const args=process.argv.slice(2),arg=k=>args.includes(k)?args[args.indexOf(k)+1]:null;
const root=path.resolve(arg('--root')||path.join(__dirname,'../..'));
const manifestPath=arg('--manifest');
const apply=args.includes('--apply');
const registryPath=path.join(root,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json');
const evidencePath=path.join(root,'guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json');
const ownerPath=path.join(root,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json');
function fail(s){throw new Error('GUEST onboarding: '+s)}
if(!manifestPath)fail('Missing --manifest');
const src=JSON.parse(fs.readFileSync(path.resolve(manifestPath),'utf8'));
const {id,displayName,version,rendererApi,masterHtml,typographyVariants}=src;
if(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id||''))fail('Invalid id');
if(!displayName||typeof displayName!=='string'||displayName.length>80)fail('Invalid displayName');
if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,30}$/.test(version||''))fail('Invalid version');
if(rendererApi!=='GUEST_APPLY_CONFIG')fail('New visual plugins must expose the same GUEST_APPLY_CONFIG API');
if(!Array.isArray(typographyVariants)||!typographyVariants.length||typographyVariants.some(x=>typeof x!=='string'))fail('Typography variants required');
const manifestDir=path.dirname(path.resolve(manifestPath));
const masterPath=path.resolve(manifestDir,masterHtml||'');
if(!masterPath.startsWith(manifestDir+path.sep)||!fs.realpathSync(manifestDir))fail('Visual master must be alongside manifest');
if(!masterHtml||!fs.existsSync(masterPath)||path.extname(masterPath)!=='.html')fail('Missing visual master HTML');
if(!fs.realpathSync(masterPath).startsWith(fs.realpathSync(manifestDir)+path.sep))fail('Master symlink leaves the plugin folder');
const html=fs.readFileSync(masterPath,'utf8');
if(!html.includes('GUEST_APPLY_CONFIG'))fail('Master must define GUEST_APPLY_CONFIG');
if(!html.includes('</body>'))fail('Incomplete visual master HTML');
if(html.length>40*1024*1024)fail('Visual master exceeds 40MB review cap');
const registry=JSON.parse(fs.readFileSync(registryPath,'utf8'));
const evidence=JSON.parse(fs.readFileSync(evidencePath,'utf8'));
const owner=JSON.parse(fs.readFileSync(ownerPath,'utf8'));
if(registry.templates.some(x=>x.id===id)||evidence.templates[id]||owner.templates[id])fail('Template ID already exists: '+id);
const statusPath=path.join(root,'guest/GUEST_PROJECT_STATUS_V1.json');
const projectStatus=fs.existsSync(statusPath)?JSON.parse(fs.readFileSync(statusPath,'utf8')):null;
if(projectStatus){
 if(!projectStatus.designs||projectStatus.schemaVersion!=='guest-project-status-v1')fail('Invalid canonical handoff state');
 if(projectStatus.designs[id]&&projectStatus.designs[id].status!=='not-started')fail('State already contains an active template: '+id);
}
if(!Array.isArray(evidence.policy.newTemplateRequirements))fail('Admission policy missing');
const assetPath=`guest/catalog-assets/${id}/${version}/index.html`;
const adapterPath=`guest/guest-catalog-template-${id}-adapter-v1.js`;
const adapter=`(()=>{\n'use strict';\nconst root=window.__GuestCatalogTemplateAdapters=window.__GuestCatalogTemplateAdapters||{};\nroot[${JSON.stringify(id)}]={id:${JSON.stringify(id)},version:${JSON.stringify(version)},applyConfig(config){\n if(typeof window.GUEST_APPLY_CONFIG!=='function')throw new Error('visual_renderer_unavailable:${id}');\n return window.GUEST_APPLY_CONFIG(config);\n}};\n})();\n`;
const newEntry={id,displayName,version,status:'certification-pending',scalabilityCertified:false,operationalPilotPass:false,visualRobustnessPass:false,ownerEditing:'bounded-safe-controls-only',publicDeliveryContract:'stable-final-url + shared recipient-context parameters',configSchema:'guest-invitation-config-v1',typographyVariants,defaultTypographyVariant:typographyVariants[0],versionPinnedPerOrder:true};
registry.templates.push(newEntry);
const gates={};
for(const k of evidence.policy.newTemplateRequirements)gates[k]={pass:false,source:'guest/GUEST_CATALOG_RELEASE_GATES_D02_D06_2026-10-09.md',why:'Not independently certified for '+id};
evidence.templates[id]={version,basis:'new-template-gated',gates};
// Pending designs have no public asset. The existing generic owner staging tool
// injects the locally SHA-pinned copy; an HTTPS asset is recorded only after release.
owner.templates[id]={id,version,mode:'iframe',src:null,applyApi:rendererApi,status:'certification-pending'};
if(projectStatus){
 projectStatus.designs[id]={version,status:'certification-pending',catalogAsset:assetPath,adapter:adapterPath,visualMasterSha256:crypto.createHash('sha256').update(html).digest('hex'),candidateSha256:crypto.createHash('sha256').update(html).digest('hex'),commerciallyCertified:false,requiredGates:evidence.policy.newTemplateRequirements.length};
}
const emitted=[
 [assetPath,html],
 [adapterPath,adapter],
 ['guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',JSON.stringify(registry,null,2)+'\n'],
 ['guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json',JSON.stringify(evidence,null,2)+'\n'],
 ['guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',JSON.stringify(owner,null,2)+'\n']
 ,...(projectStatus?[['guest/GUEST_PROJECT_STATUS_V1.json',JSON.stringify(projectStatus,null,2)+'\n']]:[])
];
const hash=crypto.createHash('sha256').update(html).digest('hex');
const report={ok:true,mode:apply?'applied':'dry-run',template:id,version,assetSha256:hash,assetBytes:Buffer.byteLength(html),files:emitted.map(([p])=>p),commerciallyCertified:false,backendDeployed:false};
if(apply){
 for(const [p] of emitted){const dst=path.join(root,p);if(!dst.startsWith(root+path.sep))fail('Invalid output');if(p===assetPath||p===adapterPath){if(fs.existsSync(dst))fail('Will not overwrite existing '+p)}}
 for(const [p,data] of emitted){const dst=path.join(root,p);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,data,{flag:(p===assetPath||p===adapterPath)?'wx':'w'});}
}
console.log(JSON.stringify(report,null,2));