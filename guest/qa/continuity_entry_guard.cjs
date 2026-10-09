#!/usr/bin/env node
'use strict';
/* GUEST continuity documentation guard.
 * Offline structural check only: no network, no production access, no E2E certification.
 * It intentionally checks pointers, not frozen visual artifacts or deployed status.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const get=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const entry='guest/START_HERE.md';
const runbook='guest/DESIGN_NEW_RUNBOOK.md';
const mustExist=[entry,runbook,
 'guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md',
 'guest/GUEST_PLATFORM_VISUAL_V2_READ_FIRST_2026-10-09.md',
 'guest/GUEST_CATALOGO_VISUAL_SISTEMA_COMUN_V2_2026-10-09.md',
 'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',
 'guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json',
 'guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json',
 'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',
 'guest/GUEST_D02_BOTANICA_READ_FIRST.md',
 'guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V3_2026-10-09.json',
 'guest/GUEST_DESIGN_PRODUCTION_QA_MASTER_D03_D06_2026-10-09.md',
 'guest/qa/catalog_preflight_v2.cjs',
 'guest/qa/catalog_admission_gate.cjs',
 'guest/tools/register_visual_template.cjs',
 'guest/tools/generate_backend_catalog_registry.cjs',
 'guest/CURRENT_STATE.md'];
for(const p of mustExist)assert(exists(p),'Broken continuity reference / missing file '+p);
const doc=get(entry),run=get(runbook);
assert(doc.startsWith('# GUEST by WeddlySmartDesign — EMPEZAR AQUÍ'),'Wrong sole entrypoint');
for(const ref of mustExist.filter(x=>x!==entry)){
 if(['guest/CURRENT_STATE.md','guest/GUEST_PLATFORM_VISUAL_V2_READ_FIRST_2026-10-09.md'].includes(ref))continue;
 assert(doc.includes(path.basename(ref)),'Entry point omits required reference '+ref);
}
const registry=JSON.parse(get('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'));
const evidence=JSON.parse(get('guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json'));
const owner=JSON.parse(get('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json'));
for(const template of registry.templates){
 assert(evidence.templates[template.id],'Missing evidence for '+template.id);
 assert(owner.templates[template.id],'Missing viewer for '+template.id);
 assert.equal(String(owner.templates[template.id].version),String(template.version),'Owner version drift '+template.id);
 if(template.status==='commercially-frozen'&&evidence.templates[template.id].basis==='new-template-gated'){
  assert(Object.values(evidence.templates[template.id].gates).every(x=>x.pass===true),'False certification '+template.id);
 }
}
const canonical=get('guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md');
const current=get('guest/CURRENT_STATE.md');
assert(canonical.slice(0,1500).includes('guest/START_HERE.md'),'Canonical file must lead to sole recovery index');
assert(current.slice(0,1500).includes('guest/START_HERE.md'),'CURRENT_STATE must lead to sole recovery index');
const schema=JSON.parse(get('guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json'));
assert.equal(schema.properties.schemaVersion.const,'guest-invitation-config-v1');
assert(schema.properties.story.properties.textMode.enum.includes('none'));
for(const marker of ['node guest/qa/catalog_preflight_v2.cjs','--admit botanica','guest-independent','RSVP','Botánica','VEIL LIGHT','NO DESPLEGADOS'])assert(doc.includes(marker),'Missing key safety statement '+marker);
for(const marker of ['GUEST_APPLY_CONFIG','--apply','--admit <id>','320/360/390/430'])assert(run.includes(marker),'Runbook missing '+marker);
console.log('PASS: one recovery entrypoint, '+mustExist.length+' references, canonical links, template states, QA and design runbook');
console.log('NOTE: structural documentation check only; does NOT certify deployments, commercial orders or Android');