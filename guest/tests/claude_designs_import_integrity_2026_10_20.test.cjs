#!/usr/bin/env node
'use strict';
/* Immutable import integrity: pre-existing blob objects from Claude only.
   Pure filesystem checks; no network, publication, Stripe or customer data. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),manifest=require('../GUEST_CLAUDE_SOURCE_IMPORT_MANIFEST_2026-10-20.json');
assert.equal(manifest.noSale,true,'candidate import must remain test only');
assert.equal(manifest.sourceBranch,'claude/guest-skins-d04-d08');
assert.equal(manifest.files.length,127,'expected exact authenticated source files');
const allowed=/^guest\/(?:templates\/(?:_skin-engine|design-0[4-9])\/|catalog-assets\/design-0[4-9]\/|guest-catalog-template-design-0[4-9]-adapter-v1\.js$|tools\/build_skin_master\.cjs$)/;
for(const item of manifest.files){
 assert(allowed.test(item.path),'unapproved path in import '+item.path);
 const full=path.resolve(root,item.path);assert(full.startsWith(root+path.sep),'untrusted import path');
 const content=fs.readFileSync(full);
 assert.equal(content.length,item.bytes,'bytes mismatch: '+item.path);
 const actual=crypto.createHash('sha1').update(Buffer.from('blob '+content.length+'\0')).update(content).digest('hex');
 assert.equal(actual,item.gitBlobSha1,'immutable Claude source mismatch: '+item.path);
}
const old=fs.readFileSync(path.join(root,'guest/catalog-assets/design-03/1.0.0/index.html'));
const oldSha=crypto.createHash('sha1').update(Buffer.from('blob '+old.length+'\0')).update(old).digest('hex');
assert.equal(oldSha,manifest.historicD03BlobSha1,'historic design-03 changed');
const names={'design-04':'AZULEJO','design-05':'GALA','design-06':'INVERNADERO','design-07':'REFLEJO','design-08':'CAJA DE MÚSICA','design-09':'LIMONEROS · VERSIÓN CLAUDE'};
for(const [id,name] of Object.entries(names)){
 const skin=JSON.parse(fs.readFileSync(path.join(root,'guest/templates',id,'skin.json'),'utf8'));
 assert.equal(skin.id,id);assert.equal(skin.displayName,name);assert.equal(skin.version,'1.0.0');
 const candidate=fs.readFileSync(path.join(root,'guest/catalog-assets',id,'1.0.0/index.html'),'utf8');
 assert(candidate.includes('GUEST_APPLY_CONFIG'),'missing apply interface: '+id);
}
const registry=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'),'utf8'));
assert(registry.templates.some(x=>x.id==='design-03'&&x.status!=='commercially-frozen'),'old Limoneros must not be used for sale');
const listed=registry.templates.filter(x=>names[x.id]).filter(x=>x.status==='commercially-frozen');
assert.equal(listed.length,0,'Claude candidates were accidentally made purchasable');
console.log('PASS 127 exact Claude source files; D04-D08 recovered; D09 Limoneros distinctly preserved; historic D03 unchanged; all TEST-ONLY');
