#!/usr/bin/env node
'use strict';
// GUEST skin engine (D04–D08): cada diseño es el motor común + su piel. Comprobación estructural offline.
// No sustituye pedidos TEST reales, RSVP ni la aprobación Android de la propietaria.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const status=JSON.parse(fs.readFileSync(path.join(root,'GUEST_PROJECT_STATUS_V1.json')));
const registry=JSON.parse(fs.readFileSync(path.join(root,'GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json')));
const engine=fs.readFileSync(path.join(root,'templates/_skin-engine/engine.html'),'utf8');
for(const rule of ['GUEST_APPLY_CONFIG','Pedir canción','Ver playlist','scroll-snap-type:x mandatory','STORY_PRESETS','aria-current','is-last'])assert(engine.includes(rule),'engine missing '+rule);
assert(!/gallery-grid/.test(engine),'gallery must be a carousel, never a collage grid');
const ids=fs.readdirSync(path.join(root,'templates')).filter(d=>fs.existsSync(path.join(root,'templates',d,'skin.json')));
assert(ids.length>=5,'expected D04–D08 skins');
for(const id of ids){
 const skin=JSON.parse(fs.readFileSync(path.join(root,'templates',id,'skin.json')));
 const plugin=JSON.parse(fs.readFileSync(path.join(root,'templates',id,'visual-plugin.json')));
 assert.equal(skin.id,id);assert.equal(plugin.id,id);assert.equal(plugin.rendererApi,'GUEST_APPLY_CONFIG');
 const master=fs.readFileSync(path.join(root,'templates',id,'master.html'));
 const asset=fs.readFileSync(path.join(root,'catalog-assets',id,skin.version,'index.html'));
 assert.equal(sha(master),sha(asset),id+' catalog asset must equal its master');
 assert.equal(status.designs[id]?.candidateSha256,sha(master),id+' status SHA pinned');
 const t=registry.templates.find(x=>x.id===id);assert(t&&t.status==='certification-pending',id+' must stay certification-pending / NO SALE');
 const html=master.toString('utf8');
 assert(!/\{\{[A-Z_]+\}\}/.test(html),id+' unresolved placeholder');
 assert(html.includes(`id:'${id}',version:'${skin.version}'`),id+' template guard');
 assert((html.match(/data:video\/mp4;base64,/g)||[]).length===2,id+' cover + closing video');
 assert(html.includes('noindex'),id+' noindex');
}
console.log('PASS skin engine masters '+ids.join(', ')+': common engine, SHA-pinned assets, carousel gallery, canonical CTAs, certification-pending; SYNTHETIC OFFLINE, NOT E2E');
