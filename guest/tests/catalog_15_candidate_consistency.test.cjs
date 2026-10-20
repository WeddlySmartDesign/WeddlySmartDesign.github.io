'use strict';
/** No commerce, backend deployment or production status is granted by source recovery. */
const fs=require('node:fs'),assert=require('node:assert/strict');
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const reg=load('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json');
const ev=load('guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json');
const view=load('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json');
const state=load('guest/GUEST_PROJECT_STATUS_V1.json');
const one=['veil-light','botanica','design-09',...Array.from({length:5},(_,i)=>'design-0'+(i+4)),...Array.from({length:7},(_,i)=>'design-'+(i+10))];
const expected=new Set(one),listed=state.designInventory2026_10_20.candidateIds;
assert.equal(expected.size,15);
assert.deepEqual(new Set(listed),expected);
const ids=reg.templates.map(x=>x.id);
assert.equal(new Set(ids).size,ids.length);
assert.equal(ids.length,16,'The incorrectly sourced Limoneros remains a historical record, not a 16th sellable design');
assert.deepEqual(new Set(ids),new Set([...expected,'design-03']));
const historic=reg.templates.find(x=>x.id==='design-03');
assert(historic&&historic.status==='certification-pending'&&historic.scalabilityCertified===false);
assert.equal(reg.catalog.historicExcludedFromSale,'design-03');
for(const id of one){
 const t=reg.templates.find(x=>x.id===id),p=ev.templates[id],v=view.templates[id];
 assert(t&&p&&v,'Unregistered candidate '+id);
 assert.equal(t.id,v.id);assert.equal(t.version,v.version);assert.equal(t.version,p.version);
 if(id==='veil-light')continue; // Preserve original frozen commercial seal.
 assert.equal(t.status,'certification-pending','Uncertified template must not be sellable: '+id);
 assert.equal(t.scalabilityCertified,false);
 assert.equal(t.operationalPilotPass,false);
 assert.equal(t.visualRobustnessPass,false);
 assert.equal(v.status,'certification-pending');
 if(id.startsWith('design-')&&id!=='design-03'){
  assert.equal(v.mode,'iframe');
  assert.equal(v.src,null,'Unknown publication URL must never be invented');
  assert.equal(v.applyApi,'GUEST_APPLY_CONFIG');
  assert(fs.existsSync('guest/catalog-assets/'+id+'/1.0.0/index.html'),'Original source missing '+id);
  assert(fs.existsSync('guest/guest-catalog-template-'+id+'-adapter-v1.js'),'Adapter missing '+id);
  for(const gate of ev.policy.newTemplateRequirements)assert.equal(p.gates[gate]?.pass,false,'No invented certification evidence for '+id+'/'+gate);
 }
}
assert.equal(ev.policy.publicSaleAuthorized,false);
assert.equal(state.designInventory2026_10_20.salesEnabled,false);
const server=fs.readFileSync('guest/backend/guest-invitation-flow/index.ts','utf8');
for(const id of one.filter(x=>x.startsWith('design-'))){
 assert(server.includes('"'+id+'"'),'Staged TEST backend candidate missing '+id);
}
assert(server.includes("if(spec?.testOnly===true&&mode!=='test')throw new Error('template_test_only')"));
console.log('PASS GUEST 15 candidate identities + historical Limoneros separation + 13 noncommercial renderers/11 gates + no public URLs/no payment activation');
