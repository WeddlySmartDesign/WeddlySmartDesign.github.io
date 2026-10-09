#!/usr/bin/env node
'use strict';
/**
 * Common GUEST admission gate, Design 01–06.
 * Run: node guest/qa/catalog_admission_gate.cjs [--admit <template-id>] [--json]
 * Normal mode validates current truthful status and passes with pending candidates.
 * --admit mode FAILS if there is no evidence for every sale-readiness gate.
 * Does NOT connect to Supabase, deploy, use secrets, send mail, publish or charge.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const registry=read('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json');
const evidence=read('guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json');
const schema=read('guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json');
const admitIndex=process.argv.indexOf('--admit');
const candidate=admitIndex>=0?process.argv[admitIndex+1]:null;
const problems=[];const warnings=[];const perTemplate={};
function check(ok,msg){if(!ok)problems.push(msg)}
function fileExists(f){return Boolean(f&&typeof f==='string'&&f.startsWith('guest/')&&fs.existsSync(path.join(root,f)))}
check(registry.schemaVersion==='guest-catalog-template-registry-v1','Invalid registry schemaVersion');
check(evidence.schemaVersion==='guest-catalog-admission-evidence-v1','Invalid evidence schemaVersion');
check(schema.properties?.schemaVersion?.const==='guest-invitation-config-v1','Unexpected shared config schemaVersion');
check(schema.properties?.story?.properties?.textMode?.enum?.includes('none'),'Shared schema does not permit story textMode=none');
check(schema.properties?.locations?.properties?.items?.maxItems===2,'Shared schema lost two-venue support');
check(schema.properties?.gallery?.properties?.photos?.maxItems===4,'Shared schema lost supported gallery count');
const ids=new Set();
for(const t of registry.templates||[]){
  check(!ids.has(t.id),'Duplicate catalog id: '+t.id);ids.add(t.id);
  const e=evidence.templates[t.id];
  check(!!e,'No evidence entry for '+t.id);
  if(!e)continue;
  check(String(e.version)===String(t.version),'Version drift: '+t.id+' registry '+t.version+' vs evidence '+e.version);
  const adapter=`guest/guest-catalog-template-${t.id}-adapter-v1.js`;
  check(fileExists(adapter),'Missing adapter: '+adapter);
  if(fileExists(adapter)){
    const s=fs.readFileSync(path.join(root,adapter),'utf8');
    check(s.includes(`id:'${t.id}'`)||s.includes(`id:"${t.id}"`),'Adapter id mismatch '+t.id);
    check(s.includes(`version:'${t.version}'`)||s.includes(`version:"${t.version}"`),'Adapter version mismatch '+t.id);
    check(s.includes('applyConfig(config)'),'Adapter missing applyConfig '+t.id);
  }
  if(e.basis==='pre-existing-commercial-seal'){
    check(t.status==='commercially-frozen','Previous commercial seal changed '+t.id);
    check(fileExists(e.source),'Historical certification missing '+t.id);
    perTemplate[t.id]={status:t.status,evidence:'historical-seal',missing:[]};
    continue;
  }
  check(e.basis==='new-template-gated','Missing new-template gating marker for '+t.id);
  const missing=[];
  for(const gate of evidence.policy.newTemplateRequirements){
    const g=e.gates?.[gate];
    check(!!g,`Missing gate definition for ${t.id}/${gate}`);
    if(!g)continue;
    check(typeof g.pass==='boolean',`Non-boolean gate ${t.id}/${gate}`);
    check(fileExists(g.source),`No evidence file for ${t.id}/${gate}: ${g.source}`);
    if(!g.pass)missing.push(gate);
  }
  if(t.status==='commercially-frozen'){
    check(missing.length===0,'Commercial status without all PASS gates: '+t.id+' / '+missing.join(', '));
    check(t.scalabilityCertified===true&&t.operationalPilotPass===true&&t.visualRobustnessPass===true,
      'Certified flags not all true for '+t.id);
  }else{
    check(t.status==='certification-pending','Unsupported noncommercial status for '+t.id+': '+t.status);
    check(t.scalabilityCertified!==true&&t.operationalPilotPass!==true,'Pending template incorrectly claims certification '+t.id);
  }
  perTemplate[t.id]={status:t.status,missing,passed:evidence.policy.newTemplateRequirements.length-missing.length,total:evidence.policy.newTemplateRequirements.length};
}
for(const id of Object.keys(evidence.templates))check(ids.has(id),'Evidence for missing catalog template '+id);
if(candidate){
  check(ids.has(candidate),'Unknown template for admission: '+candidate);
  const status=perTemplate[candidate];
  if(status?.missing?.length)problems.push('NOT ADMISSIBLE '+candidate+': '+status.missing.join(', '));
  // New templates must also have an explicit shared compatibility check, not only the local QA report.
  if(evidence.templates[candidate]?.basis==='new-template-gated'){
    const unresolved=Object.entries(evidence.sharedBlockers||{}).filter(([,v])=>v!==true).map(([k])=>k);
    if(unresolved.length)problems.push('SHARED CONTRACT NOT READY: '+unresolved.join(', '));
  }
}
const result={ok:problems.length===0,mode:candidate?'admission':'consistency',candidate,templates:perTemplate,sharedBlockers:evidence.sharedBlockers,errors:problems,warnings};
if(process.argv.includes('--json'))console.log(JSON.stringify(result,null,2));
else{
 console.log('GUEST CATALOG — '+result.mode.toUpperCase()+' CHECK');
 for(const [id,v] of Object.entries(perTemplate))console.log(`  ${id}: ${v.status} / ${v.missing?.length?`PENDING ${v.missing.length} gates`:'PASS baseline'}`);
 for(const s of problems)console.error('FAIL '+s);
 console.log(result.ok?'PASS: registry, adapter, version and certification safeguards coherent':'FAIL: certification gate not met');
}
process.exitCode=result.ok?0:1;