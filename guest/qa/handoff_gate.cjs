#!/usr/bin/env node
'use strict';
/*
 * One GUEST current-state/continuity gate. Read-only, offline, non-deploying.
 * Old historical documents are never used to infer today's release state.
 */
const fs=require('node:fs'),path=require('node:path');
const args=process.argv.slice(2), opt=(name)=>args.includes(name)?args[args.indexOf(name)+1]:null;
const root=path.resolve(opt('--root')||path.join(__dirname,'../..'));
const file=(p)=>path.join(root,p);
const load=(p)=>JSON.parse(fs.readFileSync(file(p),'utf8'));
const exists=(p)=>fs.existsSync(file(p));
function validate(){
 const errors=[];
 const requireIt=(condition,message)=>{if(!condition)errors.push(message)};
 const s=load('guest/GUEST_PROJECT_STATUS_V1.json');
 const reg=load('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json');
 const e=load('guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json');
 const owner=load('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json');
 const manifest=load('guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V3_2026-10-09.json');
 requireIt(s.schemaVersion==='guest-project-status-v1','invalid state schema');
 requireIt(s.entryPoint==='guest/START_HERE.md','unknown current entrypoint');
 requireIt(s.branch==='guest-independent','wrong branch scope');
 requireIt(s.repository==='WeddlySmartDesign/WeddlySmartDesign.github.io','wrong repo');
 requireIt(s.scope.noTouch.includes('ONE')&&s.scope.noTouch.includes('ONE Partner')&&s.scope.noTouch.includes('STUDIO'),'protected projects missing');
 requireIt(s.scope.neverModifyFrozenMasters===true&&s.scope.commercialSaleRequiresIndependentApproval===true,'frozen/sale protections missing');
 requireIt(typeof s.system.deploymentCertified==='boolean','system deployment status must be explicit boolean');
 requireIt(typeof s.runtime.botanicaTestOnlyDeployed==='boolean'&&typeof s.runtime.ownerGenericV2Deployed==='boolean','runtime deployment statuses must be explicit booleans');
 const front=fs.readFileSync(file(s.entryPoint),'utf8');
 requireIt(front.startsWith('# GUEST by WeddlySmartDesign — EMPEZAR AQUÍ'),'entrypoint does not identify itself');
 const files=[
  s.policySource,s.system.visualDocumentation,s.system.catalogAdmission,s.system.evidenceFile,s.system.registryFile,
  s.system.ownerViewerRegistry,s.system.pluginOnboarding,s.system.commonSchema,
  'guest/DESIGN_NEW_RUNBOOK.md',
  'guest/GUEST_DESIGN_PRODUCTION_QA_MASTER_D03_D06_2026-10-09.md',
  'guest/GUEST_PLATFORM_VISUAL_V2_READ_FIRST_2026-10-09.md',
  'guest/GUEST_CATALOGO_VISUAL_SISTEMA_COMUN_V2_2026-10-09.md',
  'guest/GUEST_D02_BOTANICA_READ_FIRST.md',
  'guest/CURRENT_STATE.md',
  s.designs['botanica'].manifest
 ];
 for(const p of new Set(files))requireIt(exists(p),'unrecoverable documented file: '+p);
 for(const p of ['guest/CURRENT_STATE.md','guest/GUEST_D02_BOTANICA_READ_FIRST.md','guest/GUEST_PLATFORM_VISUAL_V2_READ_FIRST_2026-10-09.md','guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md']){
  const h=exists(p)?fs.readFileSync(file(p),'utf8').slice(0,850):'';
  requireIt(h.includes('guest/START_HERE.md'),'historical/canonical document missing live index banner: '+p);
 }
 const ids=new Set((reg.templates||[]).map(t=>t.id));
 const get=(id)=>reg.templates.find(t=>t.id===id);
 requireIt(s.designs['veil-light'].version==='5.3.3'&&s.designs['veil-light'].status==='commercially-frozen','original seal changed in handoff');
 requireIt(get('veil-light')?.version==='5.3.3'&&get('veil-light')?.status==='commercially-frozen','frozen VEIL registry drift');
 requireIt(e.templates['veil-light']?.basis==='pre-existing-commercial-seal','VEIL historical seal missing');
 const b=s.designs.botanica,c=get('botanica'),be=e.templates.botanica;
 requireIt(c?.version===b.version && be?.version===b.version && owner.templates.botanica?.version===b.version,'Botánica version drift across registries');
 requireIt(c?.status===b.status&&owner.templates.botanica?.status===b.status,'Botánica status drift');
 requireIt(['certification-pending','commercially-frozen'].includes(b.status),'Unknown Botánica catalog status');
 requireIt(manifest.technicalCandidate?.version===b.version&&manifest.technicalCandidate?.sha256===b.candidateSha256,'candidate hash/version drift');
 requireIt(manifest.visualApproval?.sha256===b.frozenSha256&&manifest.visualApproval?.version===b.visuallyApprovedFrozenVersion,'approved visual master drift');
 requireIt(manifest.catalog?.commerciallyCertified===(b.status==='commercially-frozen'),'manifest and commercial status disagree');
 requireIt(manifest.recoveryArchive?.sha256===b.artifacts.archivedV3Sha256,'recovery archive hash drift');
 const gates=be?.gates||{},reqs=e.policy.newTemplateRequirements||[];
 const pass=reqs.filter(k=>gates[k]?.pass===true).length;
 requireIt(reqs.length===s.commercialGate.requiredPerNewTemplate,'required-gates count differs');
 requireIt(pass===s.commercialGate.currentBotanicaPass&&reqs.length-pass===s.commercialGate.currentBotanicaPending,'gate counts stale; update handoff after evidences');
 const complete=(b.status==='commercially-frozen');
 for(const k of reqs){
  requireIt(!!gates[k],'missing required commercial gate '+k);
  if(gates[k]?.pass===true)requireIt(typeof gates[k].source==='string'&&exists(gates[k].source),'PASS without persistent evidence source: '+k);
 }
 const completionEvidence=[
  ['two-real-test-orders','realOrderE2e'],
  ['recipient-rsvp','recipientRsvpPersistence'],
  ['owner-android','ownerAndroid']
 ];
 for(const [gateKey,statusKey] of completionEvidence){
  requireIt((s.commercialGate[statusKey]==='PASS')===(gates[gateKey]?.pass===true),'current-state/evidence disagreement: '+statusKey);
 }
 if(s.runtime.botanicaTestOnlyDeployed)requireIt(gates['backend-test-only']?.pass===true,'test backend falsely marked deployed');
 if(s.runtime.ownerGenericV2Deployed)requireIt(gates.renderer?.pass===true,'owner viewer falsely marked deployed');
 if(complete){
  requireIt(pass===reqs.length,'sale claimed with unfinished Botánica gates');
  requireIt(!Object.values(e.sharedBlockers||{}).some(x=>x!==true),'sale claimed with common backend blockers');
  requireIt(s.system.deploymentCertified===true,'sale claimed without deployed common system');
  requireIt(s.runtime.botanicaTestOnlyDeployed===true&&s.runtime.ownerGenericV2Deployed===true,'sale claimed with undeployed backend or owner viewer');
  requireIt(s.runtime.lastObservedSupports.includes('botanica'),'sale claimed without observed backend template support');
 }
 for(const [id,data] of Object.entries(s.designs))if(id.startsWith('design-')&&data.status==='not-started'){
  requireIt(!ids.has(id),'not-started design already registered: '+id);
 }
 for(const t of reg.templates||[]){
  const record=s.designs[t.id];
  requireIt(!!record,'catalog template missing from machine state: '+t.id);
  if(record){requireIt(record.version===t.version,'machine state version differs for '+t.id);requireIt(record.status===t.status,'machine state status differs for '+t.id)}
 }
 requireIt(Array.isArray(s.runtime.lastObservedSupports)&&s.runtime.lastObservedSupports.includes('veil-light'),'certified VEIL no longer supported by last-observed backend');
 const counts={passed:pass,pending:reqs.length-pass,total:reqs.length};
 return {errors,counts,liveE2E:s.commercialGate.realOrderE2e};
}
if(require.main===module){try{const {errors,counts,liveE2E}=validate();if(errors.length){for(const e of errors)console.error('FAIL '+e);process.exit(1)}console.log('PASS GUEST handoff single source of truth, frozen checksums, 2 registries, evidence and archival banners; Botánica '+counts.passed+'/'+counts.total+' PASS, '+counts.pending+' PENDING; E2E state: '+liveE2E)}catch(e){console.error('FAIL GUEST handoff gate: '+e.message);process.exit(1)}}
module.exports={validate};