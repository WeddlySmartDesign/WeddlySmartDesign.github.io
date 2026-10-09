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
 'guest/GUEST_CATALOGO_VISUAL_SISTEMA_COMUN_V2_2026-10-09.md',
 'guest/DESIGN_NEW_RUNBOOK.md',
 'guest/qa/catalog_admission_gate.cjs','guest/tools/register_visual_template.cjs',
 'guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json'
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
 ['new registered while not started',(r)=>mutate(r,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',j=>{j.templates.push({id:'design-03',version:'1',status:'certification-pending'})})]
];
{
 const s=sandbox();try{assert.equal(run(s).status,0, 'baseline handoff gate must PASS')}finally{fs.rmSync(s,{recursive:true,force:true})}
}
for(const [name,alter] of cases){const s=sandbox();try{alter(s);const r=run(s);assert.notEqual(r.status,0,'should reject '+name);assert.match(r.stderr,/FAIL/,'should explain '+name)}finally{fs.rmSync(s,{recursive:true,force:true})}}
console.log('PASS GUEST handoff gate baseline and '+cases.length+' anti-regression mutations (offline only)');