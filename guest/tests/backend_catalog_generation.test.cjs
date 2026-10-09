#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),os=require('node:os');
const tool=path.resolve(__dirname,'../tools/generate_backend_catalog_registry.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'guest-registries-'));
try{
 const add=(p,obj)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(obj))};
 add('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',{templates:[{id:'veil-light',version:'5.3.3',status:'commercially-frozen',typographyVariants:['classic'],defaultTypographyVariant:'classic'},{id:'botanica',version:'14.7',status:'certification-pending',typographyVariants:['classic'],defaultTypographyVariant:'classic'}]});
 add('guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json',{templates:{'veil-light':{basis:'pre-existing-commercial-seal'},botanica:{basis:'new-template-gated',gates:{one:{pass:false}}}},sharedBlockers:{e2e:false}});
 add('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json',{templates:{'veil-light':{version:'5.3.3'},botanica:{version:'14.7'}}});
 const run=mode=>cp.spawnSync(process.execPath,[tool,'--root',root,'--mode',mode],{encoding:'utf8'});
 const prod=run('production'),test=run('test-only');assert.equal(prod.status,0,prod.stderr);assert.equal(test.status,0,test.stderr);
 assert(prod.stdout.includes('"veil-light"'));assert(!prod.stdout.includes('"botanica"'));assert(test.stdout.includes('"botanica"'));assert(test.stdout.includes('"testOnly": true'));
 assert(test.stdout.includes("mode!=='test'"),'All routes require a production order guard');
 assert(!prod.stdout.includes('testOnly": true'));
 const broken=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json')));broken.templates[1].status='commercially-frozen';add('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json',broken);
 assert.notEqual(run('production').status,0,'False certification must not produce production backend registry');
 console.log('PASS backend registry generator: certified-only production / guarded test-only Botánica / false certification rejected / no deploy');
}finally{fs.rmSync(root,{recursive:true,force:true})}