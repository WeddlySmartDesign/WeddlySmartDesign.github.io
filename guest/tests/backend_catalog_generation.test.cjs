#!/usr/bin/env node
'use strict';
/* Generic policy-driven backend admission regression: 2 real catalog entries
 * plus a purely synthetic third plugin. Never creates D03 or deploys anything.
 */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),os=require('node:os');
const tool=path.resolve(__dirname,'../tools/generate_backend_catalog_registry.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'guest-registries-'));
const base='guest/',pReg=base+'GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',
 pEvidence=base+'GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json',pOwner=base+'GUEST_CATALOG_OWNER_RENDERERS_V2.json';
const requirements=['common-questionnaire','two-real-test-orders','recipient-rsvp'];
const entry=(id,version,status='certification-pending')=>({id,version,status,
 scalabilityCertified:status==='commercially-frozen',operationalPilotPass:status==='commercially-frozen',
 visualRobustnessPass:status==='commercially-frozen',typographyVariants:['classic'],defaultTypographyVariant:'classic'});
const gate=(pass=false)=>Object.fromEntries(requirements.map(k=>[k,{pass,source:'guest/evidence.md'}]));
const init={
 registry:{schemaVersion:'guest-catalog-template-registry-v1',templates:[entry('veil-light','5.3.3','commercially-frozen'),entry('botanica','14.7')]},
 evidence:{schemaVersion:'guest-catalog-admission-evidence-v1',policy:{newTemplateRequirements:requirements},
  templates:{'veil-light':{version:'5.3.3',basis:'pre-existing-commercial-seal'},
    botanica:{version:'14.7',basis:'new-template-gated',gates:gate()}},sharedBlockers:{liveE2E:false}},
 owner:{schemaVersion:'guest-catalog-owner-renderers-v2',
  templates:{'veil-light':{id:'veil-light',version:'5.3.3',mode:'native',status:'commercially-frozen',applyApi:'VEIL_APPLY_CONFIG'},
   botanica:{id:'botanica',version:'14.7',mode:'iframe',status:'certification-pending',applyApi:'BOTANICA_APPLY_CONFIG',src:null}}}
};
const write=(p,obj)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(obj))};
const persist=()=>{write(pReg,init.registry);write(pEvidence,init.evidence);write(pOwner,init.owner)};
const run=mode=>cp.spawnSync(process.execPath,[tool,'--root',root,'--mode',mode],{encoding:'utf8'});
const reject=(why,mode='production')=>assert.notEqual(run(mode).status,0,why);
try{
 persist();
 let prod=run('production'),test=run('test-only');
 assert.equal(prod.status,0,prod.stderr);assert.equal(test.status,0,test.stderr);
 assert(prod.stdout.includes('"veil-light"'));assert(!prod.stdout.includes('"botanica"'));
 assert(test.stdout.includes('"botanica"'));assert(test.stdout.includes('"testOnly": true'));
 assert(test.stdout.includes("mode!=='test'"),'All order-creation routes must enforce testOnly');
 const synthetic='design-03';
 init.registry.templates.push(entry(synthetic,'1.0.0'));
 init.evidence.templates[synthetic]={version:'1.0.0',basis:'new-template-gated',gates:gate()};
 init.owner.templates[synthetic]={id:synthetic,version:'1.0.0',mode:'iframe',
  status:'certification-pending',applyApi:'GUEST_APPLY_CONFIG',
  src:'/guest/catalog-assets/design-03/1.0.0/index.html'};
 persist();
 prod=run('production');test=run('test-only');
 assert.equal(prod.status,0,prod.stderr);assert.equal(test.status,0,test.stderr);
 assert(!prod.stdout.includes('"design-03"'),'Uncertified template must be absent in production');
 assert(test.stdout.includes('"design-03"'),'Third candidate is automatically included in test');
 assert(test.stdout.includes('testOnly'),'The third candidate remains guarded');
 // All future designs use the SAME checks. Deliberately try unsupported promotions.
 init.registry.templates[2]=entry(synthetic,'1.0.0','commercially-frozen');
 init.owner.templates[synthetic].status='commercially-frozen';
 persist();reject('Cannot promote a template merely by flipping the status');
 init.evidence.templates[synthetic].gates={};persist();reject('Empty gates must not pass vacuously');
 init.evidence.templates[synthetic].gates=gate(true);
 init.evidence.templates[synthetic].basis='unknown';persist();reject('Unknown basis must never certify');
 init.evidence.templates[synthetic].basis='new-template-gated';
 init.evidence.sharedBlockers={};persist();reject('Missing shared safety blockers must not default to PASS');
 init.evidence.sharedBlockers={liveE2E:false};persist();reject('Unresolved shared E2E must block certification');
 init.evidence.sharedBlockers={liveE2E:true};
 init.owner.templates[synthetic].version='9.9';persist();reject('Owner version drift must block certification');
 init.owner.templates[synthetic].version='1.0.0';
 init.owner.templates[synthetic].src=null;persist();reject('Certified iframe must have an immutable asset');
 init.owner.templates[synthetic].src='/guest/catalog-assets/design-03/1.0.0/index.html';
 persist();prod=run('production');
 assert.equal(prod.status,0,prod.stderr);
 assert(prod.stdout.includes('"design-03"'),'Fully certified synthetic fixture should be admitted generically');
 // A deliberately incomplete PENDING candidate also fails instead of being silently skipped.
 init.registry.templates[2]=entry(synthetic,'1.0.0');
 init.owner.templates[synthetic].status='certification-pending';
 delete init.evidence.templates[synthetic].gates['recipient-rsvp'];
 persist();reject('Omitted gate on pending record must fail', 'test-only');
 reject('Omitted gate must fail even if record is excluded from production');
 // No command writes to external services or modifies an existing template master.
 console.log('PASS generic backend registry: strict data policy; 3 template IDs; testOnly isolation; false promotion/empty gates/unknown basis/missing blockers/version & asset drift rejected; no deploy');
}finally{fs.rmSync(root,{recursive:true,force:true})}
