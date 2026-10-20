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
const liveFlow=file('guest/backend/guest-invitation-flow/DEPLOYED_LIVE_V20_READONLY_2026-10-20.ts');
const stagedFlow=file('guest/backend/guest-invitation-flow/index.ts');
const names=(registry.templates||[]).map(t=>t.id);
const missing=[];
const fail=(id,message)=>missing.push({id,message});
const listed=Number(status.moduleContinuity2026_10_17?.catalogueDesignCountClaimedByOwner||8);
const intended=['veil-light','botanica','design-04','design-05','design-06','design-07','design-08','design-09'];
const recovery=json('guest/GUEST_CLAUDE_SOURCE_IMPORT_MANIFEST_2026-10-20.json');
const importedIds=recovery.selectedCandidateIds||[];
for(const id of intended.slice(2)){
 if(!importedIds.includes(id)||!fs.existsSync(path.join(root,'guest/catalog-assets',id,'1.0.0/index.html')))
  fail('design-assets:'+id,'No existe master importado desde rama Claude para '+id);
}
if(names.length<listed)fail('catalog-registry','Hay '+names.length+' registros de venta frente a '+listed+' diseños previstos; los masters Claude se recuperaron sin activar ventas ni registrarlos comercialmente.');
if(registry.templates.some(t=>t.id==='design-03'&&t.status==='commercially-frozen'))
 fail('wrong-limoneros','El Limoneros histórico design-03 no puede estar comercialmente aprobado: usar la alternativa Claude design-09 solo tras certificación.');
for(const t of registry.templates||[]){
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
if(liveFlow!==stagedFlow)fail('deployed-source','El código de invitación v20 activo y el index.ts histórico difieren: reconciliar antes de desplegar una nueva versión.');
if(status.moduleContinuity2026_10_17?.commerciallyReady!==true)fail('commercial-e2e','No hay certificación de compra y entrega comercial auténticas.');
if(status.moduleContinuity2026_10_17?.allDesignFilesIntegrated!==true)fail('renderers-e2e','Integración de todos los diseños pendiente.');
// External release checks are never assumed successful from repository files alone.
fail('external-verification','Falta verificación externa real de hosting Cloudflare, Stripe Live, correos Resend y dos dispositivos; no confundir GitHub QA con ello.');
const output={date:'2026-10-20',status:missing.length?'NO_GO':'GO',registeredDesigns:names,recoveredCandidateDesigns:intended,sourceBranch:recovery.sourceBranch,ownerDesignsClaimed:listed,blockingChecks:missing,context:'Code audit, not external publication or payment evidence'};
process.stdout.write(JSON.stringify(output,null,2)+'\n');
if(process.argv.includes('--launch-gate')&&missing.length)process.exitCode=1;
