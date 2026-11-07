'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const inventory=require('../GUEST_CLAUDE_D10_D16_IMPORT_MANIFEST_2026-10-20.json');
assert.equal(inventory.sourceFiles,84,'Expected exactly 84 Claude blobs');
assert.equal(inventory.designs.length,7,'Expected D10-D16');
assert.equal(inventory.commercialApproval,false,'Premature sales approval');
assert.equal(inventory.allTemplatesTestOnly,true,'Imported originals must stay TEST-ONLY');
const allowed=/^guest\/(?:templates\/design-(?:10|11|12|13|14|15|16)\/|catalog-assets\/design-(?:10|11|12|13|14|15|16)\/1\.0\.0\/index\.html$|guest-catalog-template-design-(?:10|11|12|13|14|15|16)-adapter-v1\.js$)/;
let bytes=0;
for(const f of inventory.files){
 assert(allowed.test(f.path),'Unapproved Git path: '+f.path);
 assert(!f.path.endsWith('/master.html'),'Avoid duplicated bundled huge HTML');
 const abs=path.resolve(root,f.path);
 assert(abs.startsWith(root+path.sep),'Path traversal');
 const b=fs.readFileSync(abs);
 bytes+=b.length;
 assert.equal(b.length,f.bytes,'Blob size changed '+f.path);
 const sha=crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
 assert.equal(sha,f.gitBlobSha1,'Claude source modified '+f.path);
}
assert.equal(bytes,inventory.bytes,'Total imported original bytes mismatch');
const registry=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'),'utf8'));
for(const d of inventory.designs){
 assert(!registry.templates.some(t=>t.id===d.id&&t.status==='commercially-frozen'),'Claude designs cannot be sold before QA: '+d.id);
 const f=JSON.parse(fs.readFileSync(path.join(root,'guest/templates',d.id,'skin.json'),'utf8'));
 assert.equal(f.id,d.id);
 assert.equal(f.displayName,d.displayName);
 assert.equal(f.version,'1.0.0');
 assert.equal(typeof f.media.coverVideo,'string');
 assert.equal(typeof f.media.closingVideo,'string');
 const idx=path.join(root,'guest/catalog-assets',d.id,'1.0.0/index.html');
 assert(fs.statSync(idx).size>1000000,'Incomplete self-contained candidate: '+d.id);
}
const old=fs.readFileSync(path.join(root,'guest/catalog-assets/design-03/1.0.0/index.html'));
const oldHash=crypto.createHash('sha1').update(Buffer.from('blob '+old.length+'\0')).update(old).digest('hex');
assert.equal(oldHash,'020c46846403a77574b71a92cd22c3d00408b235','Wrong Limoneros D03 was changed');
const claude=fs.readFileSync(path.join(root,'guest/catalog-assets/design-09/1.0.0/index.html'));
assert.notDeepEqual(old,claude,'Both Limoneros variants must remain separate');
console.log('PASS 84 original Claude blobs D10-D16, 7 additional premium design identities, source unchanged, incorrect D03 preserved, zero sales authorization');
