#!/usr/bin/env node
'use strict';
/**
 * Honest release preflight. Normal mode reports unmet conditions and exits 0.
 * --launch-gate exits 1 unless ALL sale requirements are independently met.
 * No calls to Stripe, Supabase, Cloudflare or public customers.
 */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const file=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(file(p));
const registry=json('guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json');
const renderers=json('guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json');
const evidence=json('guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json');
const status=json('guest/GUEST_PROJECT_STATUS_V1.json');
const marketing=file('guest.html'),final=file('guest/catalog-final.html');
const liveFlow=file('guest/backend/guest-invitation-flow/DEPLOYED_LIVE_V21_READONLY_2026-10-20.ts');
const stagedFlow=file('guest/backend/guest-invitation-flow/index.ts');
const checkoutActiveSnapshot=file('guest/backend/guest-stripe-checkout/DEPLOYED_LIVE_V26_READONLY_2026-10-20.ts');
const checkoutStaged=file('guest/backend/guest-stripe-checkout/index.ts');
const names=(registry.templates||[]).map(t=>t.id);
const missing=[];
const fail=(id,message)=>missing.push({id,message});
// Optional isolated launch scope: a certified design must not be blocked by
// a different design still in visual QA. The historic D03 is never eligible.
const scopeArg=process.argv.find(x=>x.startsWith('--template='));
const selectedTemplateId=scopeArg?scopeArg.slice('--template='.length).trim():null;
const inventory=status.designInventory2026_10_20;
const intended=inventory?.candidateIds||[];
if(intended.length!==15)fail('design-inventory','No existe catálogo auditado de 15 diseños sin contar D03 antiguo');
if(selectedTemplateId&&(selectedTemplateId==='design-03'||!intended.includes(selectedTemplateId)))
 fail('selected-template','Diseño inexistente o Limoneros histórico no vendible; el alcance individual se rechaza.');
const first=json('guest/GUEST_CLAUDE_SOURCE_IMPORT_MANIFEST_2026-10-20.json');
const second=json('guest/GUEST_CLAUDE_D10_D16_IMPORT_MANIFEST_2026-10-20.json');
const imported=new Set([...(first.selectedCandidateIds||[]),...(second.designs||[]).map(x=>x.id)]);
for(const id of intended){
 if(id==='veil-light'||id==='botanica')continue;
 if(!imported.has(id)||!fs.existsSync(path.join(root,'guest/catalog-assets',id,'1.0.0/index.html')))
  fail('design-assets:'+id,'Master de diseño pendiente: '+id);
}
for(const id of intended){
 if(!registry.templates.some(x=>x.id===id))fail('catalog-admission:'+id,'Master localizado pero pendiente de admisión/certificación comercial: '+id);
}
if(registry.templates.some(t=>t.id==='design-03'&&t.status==='commercially-frozen'))
 fail('wrong-limoneros','Limoneros histórico design-03 NUNCA debe habilitarse; revisar variante Claude design-09');
for(const t of (registry.templates||[]).filter(t=>!selectedTemplateId||t.id===selectedTemplateId)){
 const spec=renderers.templates?.[t.id],proof=evidence.templates?.[t.id];
 if(t.status!=='commercially-frozen'||t.scalabilityCertified!==true)fail('certification:'+t.id,'Diseño pendiente de congelación comercial y pruebas de escalabilidad.');
 if(!proof)fail('evidence:'+t.id,'Falta evidencia del diseño.');
 if(proof?.gates&&Object.values(proof.gates).some(x=>x.pass!==true))fail('gate:'+t.id,'Hay puertas de certificación no superadas.');
 if(!spec)fail('renderer:'+t.id,'El diseño carece de registro visual.');
 else if(spec.mode==='iframe'&&!spec.src)fail('public-asset:'+t.id,'El renderizador todavía no tiene URL de master publicado.');
 else if(spec.mode==='native'&&final.includes("spec.mode!=='iframe'"))fail('public-asset:'+t.id,'La ruta final pública no admite este master nativo; empaquetarlo/publicarlo y conectar renderer.');
}
if(/Elegís Essential o Signature|GUEST Essential|GUEST Signature/.test(marketing))fail('storefront','La página comercial sigue vendiendo colecciones antiguas; deben mostrarse diseños individuales.');
if(/<meta name="robots" content="noindex,nofollow">/.test(marketing))fail('public-index','La página comercial aún está marcada noindex.');
if(liveFlow!==stagedFlow)fail('deployed-source','Snapshot ACTIVE V21 y fuente invitación en GitHub difieren: NO desplegar sin reconciliar.');
if(checkoutActiveSnapshot!==checkoutStaged)fail('checkout-deployed-source','Snapshot ACTIVE checkout V26 y fuente en GitHub difieren: NO modificar cobros sin reconciliar.');
if(status.moduleContinuity2026_10_17?.commerciallyReady!==true)fail('commercial-e2e','No hay certificación de compra y entrega comercial auténticas.');
if(!selectedTemplateId&&status.moduleContinuity2026_10_17?.allDesignFilesIntegrated!==true)fail('renderers-e2e','Integración de todos los diseños pendiente.');
// External release checks are never assumed successful from repository files alone.
fail('external-verification','Falta verificación externa real de hosting Cloudflare, Stripe Live, correos Resend y dos dispositivos; no confundir GitHub QA con ello.');
const output={date:'2026-10-20',status:missing.length?'NO_GO':'GO',scope:selectedTemplateId?'individual-design':'whole-catalog',requestedTemplateId:selectedTemplateId||null,registeredDesigns:names,recoveredCandidateDesigns:intended,sourceBranch:first.sourceBranch,ownerDesignsClaimed:intended.length,blockingChecks:missing,context:'Code audit, not external publication or payment evidence'};
process.stdout.write(JSON.stringify(output,null,2)+'\n');
if(process.argv.includes('--launch-gate')&&missing.length)process.exitCode=1;
