#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-plugin-test-'));
const root=path.resolve(__dirname,'..','..');
const add=(p,s)=>{const dest=path.join(tmp,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,s)};
function run(args){return cp.spawnSync(process.execPath,[path.join(root,'guest/tools/register_visual_template.cjs'),...args],{encoding:'utf8'})}
try{
 add('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',JSON.stringify({schemaVersion:'guest-catalog-template-registry-v1',templates:[{id:'veil-light',version:'5.3.3',status:'commercially-frozen'}]}));
 add('guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json',JSON.stringify({policy:{newTemplateRequirements:['common-questionnaire','backend-test-only','renderer','two-real-test-orders','recipient-rsvp','owner-android']},templates:{'veil-light':{basis:'pre-existing-commercial-seal',version:'5.3.3'}}}));
 add('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',JSON.stringify({schemaVersion:'guest-catalog-owner-renderers-v2',templates:{'veil-light':{mode:'native',version:'5.3.3'}}}));
 add('guest/GUEST_PROJECT_STATUS_V1.json',JSON.stringify({schemaVersion:'guest-project-status-v1',designs:{'veil-light':{version:'5.3.3',status:'commercially-frozen'},'design-03':{status:'not-started'}}}));
 const original=fs.readFileSync(path.join(tmp,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'),'utf8');
 const example=path.join(root,'guest/templates/_example');
 let res=run(['--root',tmp,'--manifest',path.join(example,'visual-plugin.json')]);
 assert.equal(res.status,0,res.stderr);assert.equal(JSON.parse(res.stdout).mode,'dry-run');
 assert.equal(fs.readFileSync(path.join(tmp,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'),'utf8'),original,'Dry-run mutated files');
 res=run(['--root',tmp,'--manifest',path.join(example,'visual-plugin.json'),'--apply']);
 assert.equal(res.status,0,res.stderr);const report=JSON.parse(res.stdout);
 assert.equal(report.template,'design-03');assert.equal(report.commerciallyCertified,false);assert.equal(report.backendDeployed,false);
 const registry=JSON.parse(fs.readFileSync(path.join(tmp,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json')));
 const evidence=JSON.parse(fs.readFileSync(path.join(tmp,'guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json')));
 const owner=JSON.parse(fs.readFileSync(path.join(tmp,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json')));
 assert.equal(registry.templates.find(x=>x.id==='veil-light').status,'commercially-frozen');
 assert.equal(registry.templates.find(x=>x.id==='design-03').status,'certification-pending');
 assert.equal(evidence.templates['design-03'].gates['backend-test-only'].pass,false);
 assert.equal(evidence.templates['design-03'].gates['two-real-test-orders'].pass,false);
 const state=JSON.parse(fs.readFileSync(path.join(tmp,'guest/GUEST_PROJECT_STATUS_V1.json')));
 assert.equal(state.designs['design-03'].version,'1.0.0');
 assert.equal(state.designs['design-03'].status,'certification-pending');
 assert.equal(state.designs['design-03'].commerciallyCertified,false);
 assert.match(state.designs['design-03'].visualMasterSha256,/^[a-f0-9]{64}$/);
 assert.equal(owner.templates['design-03'].mode,'iframe');
 assert.equal(owner.templates['design-03'].applyApi,'GUEST_APPLY_CONFIG');
 assert.equal(owner.templates['design-03'].src,'/guest/catalog-assets/design-03/1.0.0/index.html');
 assert(fs.readFileSync(path.join(tmp,'guest/guest-catalog-template-design-03-adapter-v1.js'),'utf8').includes('window.GUEST_APPLY_CONFIG'));
 assert(fs.readFileSync(path.join(tmp,'guest/catalog-assets/design-03/1.0.0/index.html'),'utf8').includes('window.GUEST_APPLY_CONFIG'));
 res=run(['--root',tmp,'--manifest',path.join(example,'visual-plugin.json'),'--apply']);
 assert.notEqual(res.status,0,'Must forbid duplicate id');
 const malformed=path.join(tmp,'bad-plugin.json');fs.writeFileSync(malformed,JSON.stringify({...JSON.parse(fs.readFileSync(path.join(example,'visual-plugin.json'),'utf8')),id:'../bad',masterHtml:path.join(example,'master.html')}));
 res=run(['--root',tmp,'--manifest',malformed,'--apply']);assert.notEqual(res.status,0,'Must refuse traversal');
 const badApi=path.join(tmp,'bad-api.json');fs.writeFileSync(badApi,JSON.stringify({...JSON.parse(fs.readFileSync(path.join(example,'visual-plugin.json'),'utf8')),id:'design-04',masterHtml:path.join(example,'master.html'),rendererApi:'SPECIAL_PER_COUPLE'}));
 res=run(['--root',tmp,'--manifest',badApi,'--apply']);assert.notEqual(res.status,0,'Must enforce shared visual API');
 console.log('PASS visual plugin: dry-run immutable / onboard new design / owner manifest / shared adapter / pending gates / duplicates / traversal / bespoke API rejection');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}