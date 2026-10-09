#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..'),gate='guest/qa/catalog_admission_gate.cjs';
function run(cwd,args=[]){return cp.spawnSync(process.execPath,[path.join(cwd,gate),...args],{cwd,encoding:'utf8'});}
const original=run(root);
assert.equal(original.status,0,'Registered catalog must always be internally consistent: '+original.stderr+' '+original.stdout);
const reg=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json')));
const ev=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json')));
for(const t of reg.templates){
 const request=run(root,['--admit',t.id]);
 const e=ev.templates[t.id];
 const blocked=e.basis==='new-template-gated'&&(
 Object.values(e.gates).some(v=>v.pass!==true)||Object.values(ev.sharedBlockers||{}).some(v=>v!==true));
 assert.equal(request.status===0,!blocked,'Admission result disagrees with explicit evidence for '+t.id);
}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-catalog-gate-'));
try{
 const add=(file)=>{fs.mkdirSync(path.join(tmp,path.dirname(file)),{recursive:true});fs.copyFileSync(path.join(root,file),path.join(tmp,file))};
 add(gate);add('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json');add('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json');add('guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json');add('guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json');
 for(const t of reg.templates)add(`guest/guest-catalog-template-${t.id}-adapter-v1.js`);
 for(const e of Object.values(ev.templates)){
  if(e.source)add(e.source);
  if(e.gates)for(const g of Object.values(e.gates))if(g.source)add(g.source);
 }
 const registryFile=path.join(tmp,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json');
 const edited=JSON.parse(fs.readFileSync(registryFile));
 const bot=edited.templates.find(t=>t.id==='botanica');
 if(bot){bot.status='commercially-frozen';bot.scalabilityCertified=true;bot.operationalPilotPass=true;bot.visualRobustnessPass=true;fs.writeFileSync(registryFile,JSON.stringify(edited));assert.notEqual(run(tmp).status,0,'Falsely freezing Botanica must be rejected');}
 const owners=JSON.parse(fs.readFileSync(path.join(tmp,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json')));
 owners.templates.botanica.version='0.0.BAD';
 fs.writeFileSync(path.join(tmp,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json'),JSON.stringify(owners));
 assert.notEqual(run(tmp).status,0,'Version drift in generic owner preview must be rejected');
 owners.templates.botanica.version='14.7';
 fs.writeFileSync(path.join(tmp,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json'),JSON.stringify(owners));
 const again=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json')));
 again.templates.push({id:'design-03',version:'1.0',status:'certification-pending',scalabilityCertified:false,operationalPilotPass:false});
 fs.writeFileSync(registryFile,JSON.stringify(again));
 assert.notEqual(run(tmp).status,0,'New template without adapter/evidence must be rejected');
 console.log('PASS: registry coherence, strict admission, false certification mutation, new-template onboarding mutation and owner renderer version drift');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}