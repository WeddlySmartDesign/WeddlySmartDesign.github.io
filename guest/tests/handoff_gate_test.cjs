#!/usr/bin/env node
'use strict';
/* Offline mutation tests: prevent incorrect current-state assertions in future chats. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),cp=require('node:child_process');
const sourceRoot=path.resolve(__dirname,'../..'),script=path.join(sourceRoot,'guest/qa/handoff_gate.cjs');
const required=[
 'guest/GUEST_PROJECT_STATUS_V1.json','guest/START_HERE.md','guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',
 'guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json','guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',
 'guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V3_2026-10-09.json',
 'guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md','guest/CURRENT_STATE.md',
 'guest/GUEST_D02_BOTANICA_READ_FIRST.md','guest/GUEST_PLATFORM_VISUAL_V2_READ_FIRST_2026-10-09.md',
 'guest/GUEST_DESIGN_PRODUCTION_QA_MASTER_D03_D06_2026-10-09.md',
 'guest/GUEST_D02_BOTANICA_CHECKPOINT_V14_7_2026-10-09.md',
 'guest/GUEST_D02_BOTANICA_CIERRE_TECNICO_GATES_PENDIENTES_2026-10-09.md',
 'guest/GUEST_D02_BOTANICA_ESTADO_BLOQUEO_REAL_2026-10-09.md',
 'guest/GUEST_CATALOGO_VISUAL_SISTEMA_COMUN_V2_2026-10-09.md',
 'guest/DESIGN_NEW_RUNBOOK.md',
 'guest/qa/catalog_admission_gate.cjs','guest/tools/register_visual_template.cjs',
 'guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json',
 '.github/workflows/guest-botanica-contract-qa.yml'
];
function sandbox(){const temp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-handoff-'));for(const p of required){const dst=path.join(temp,p);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(path.join(sourceRoot,p),dst)}return temp}
function run(root){return cp.spawnSync(process.execPath,[script,'--root',root],{encoding:'utf8',timeout:10000})}
function mutate(root,rel,fn){const f=path.join(root,rel),obj=JSON.parse(fs.readFileSync(f,'utf8'));fn(obj);fs.writeFileSync(f,JSON.stringify(obj,null,2)+'\n')}
const cases=[
 ['wrong candidate version',(r)=>mutate(r,'guest/GUEST_PROJECT_STATUS_V1.json',j=>{j.designs.botanica.version='14.6'})],
 ['false commercial status',(r)=>mutate(r,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',j=>{j.templates.find(x=>x.id==='botanica').status='commercially-frozen'})],
 ['missing source file',(r)=>fs.rmSync(path.join(r,'guest/DESIGN_NEW_RUNBOOK.md'))],
 ['historical masquerades as current',(r)=>fs.writeFileSync(path.join(r,'guest/CURRENT_STATE.md'),'# D02 V14.6 — ESTADO VIGENTE\n')],
 ['candidate hash replaced',(r)=>mutate(r,'guest/GUEST_PROJECT_STATUS_V1.json',j=>{j.designs.botanica.candidateSha256='0'.repeat(64)})],
 ['unverified E2E claimed',(r)=>mutate(r,'guest/GUEST_PROJECT_STATUS_V1.json',j=>{j.commercialGate.realOrderE2e='PASS'})],
 ['new registered while not started',(r)=>mutate(r,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',j=>{j.templates.push({id:'design-03',version:'1',status:'certification-pending'})})],
 ['unknown extra design without snapshot',(r)=>mutate(r,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',j=>{j.templates.push({id:'design-1000',version:'1.0.0',status:'certification-pending'})})],
 ['false production without gates',(r)=>mutate(r,'guest/GUEST_PROJECT_STATUS_V1.json',j=>{j.system.deploymentCertified=true;j.runtime.botanicaTestOnlyDeployed=true})],
 ['missing none mode in shared schema',(r)=>mutate(r,'guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json',j=>{j.properties.story.properties.textMode.enum=['preset','custom']})],
 ['offline CI no longer runs handoff',(r)=>{const p=path.join(r,'.github/workflows/guest-botanica-contract-qa.yml');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('node guest/qa/handoff_gate.cjs','# removed handoff'))}]
];
{
 const s=sandbox();try{assert.equal(run(s).status,0, 'baseline handoff gate must PASS')}finally{fs.rmSync(s,{recursive:true,force:true})}
}
for(const [name,alter] of cases){const s=sandbox();try{alter(s);const r=run(s);assert.notEqual(r.status,0,'should reject '+name);assert.match(r.stderr,/FAIL/,'should explain '+name)}finally{fs.rmSync(s,{recursive:true,force:true})}}
// Forward compatibility: a later FULLY VERIFIED release must not require editing the gate itself.
{
 const s=sandbox();
 try{
  mutate(s,'guest/GUEST_PROJECT_STATUS_V1.json',j=>{
   j.designs.botanica.status='commercially-frozen';j.system.deploymentCertified=true;
   j.runtime.botanicaTestOnlyDeployed=true;j.runtime.ownerGenericV2Deployed=true;
   j.runtime.lastObservedSupports.push('botanica');
   j.commercialGate.currentBotanicaPass=11;j.commercialGate.currentBotanicaPending=0;
   j.commercialGate.realOrderE2e='PASS';j.commercialGate.recipientRsvpPersistence='PASS';j.commercialGate.ownerAndroid='PASS';
  });
  mutate(s,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',j=>{j.templates.find(x=>x.id==='botanica').status='commercially-frozen'});
  mutate(s,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',j=>{j.templates.botanica.status='commercially-frozen'});
  mutate(s,'guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json',j=>{
   for(const g of Object.values(j.templates.botanica.gates))g.pass=true;
   for(const key of Object.keys(j.sharedBlockers))j.sharedBlockers[key]=true;
  });
  mutate(s,'guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V3_2026-10-09.json',j=>{j.catalog.commerciallyCertified=true});
  assert.equal(run(s).status,0,'fully evidenced future Botánica release should PASS without changing gate source');
 }finally{fs.rmSync(s,{recursive:true,force:true})}
}
console.log('PASS GUEST handoff gate baseline and '+cases.length+' anti-regression mutations + future-state compatibility (offline only)');