#!/usr/bin/env node
'use strict';
/* Strict structural preflight for the generic GUEST visual-plugin layer.
 * This DOES NOT certify deployments or real orders.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const registry=load('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json');
const owners=load('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json');
const evidence=load('guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json');
assert.equal(owners.schemaVersion,'guest-catalog-owner-renderers-v2');
for(const t of registry.templates){
 const spec=owners.templates[t.id];assert(spec,'No owner viewer for '+t.id);
 assert.equal(spec.version,t.version,'Pinned version mismatch for '+t.id);
 assert.equal(spec.status,t.status,'Sales-state drift for '+t.id);
 assert(evidence.templates[t.id],'No certification evidence for '+t.id);
 assert(['native','iframe'].includes(spec.mode),'Bad owner renderer kind for '+t.id);
 if(t.id==='veil-light')assert.equal(spec.applyApi,'VEIL_APPLY_CONFIG');
 if(spec.mode==='iframe'){
  assert.equal(typeof spec.applyApi,'string');
  assert(spec.src===null||(spec.src.startsWith('/guest/catalog-assets/')&&!spec.src.includes('..')),'Asset path must be pinned and same-origin');
  if(t.status==='commercially-frozen')assert(spec.src,'No public visual asset for certified '+t.id);
 }
}
for(const id of Object.keys(owners.templates))assert(registry.templates.some(x=>x.id===id),'Orphan owner viewer '+id);
console.log('PASS generic owner registry / commercial catalog parity (NOT real delivery certification)');