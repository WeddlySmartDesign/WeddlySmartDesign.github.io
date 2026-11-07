#!/usr/bin/env node
'use strict';
// Runtime negative tests for GUEST VEIL offline merge. All data synthetic.
// Real VEIL binary remains only in the owner's Library; never ship or alter it.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const program=path.join(root,'guest/tools/merge_veil_stage.cjs');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-veil-stage-guard-'));
const source=path.join(tmp,'source'),stage=path.join(tmp,'stage');
const base=path.join(source,'guest/catalog-assets/veil-light/5.3.3');
function invoke(a){return cp.spawnSync(process.execPath,[program,...a],{encoding:'utf8'});}
try{
  const bad=invoke(['--stage',stage]);assert.notEqual(bad.status,0,'cannot infer owner media');
  fs.mkdirSync(base,{recursive:true});fs.mkdirSync(path.join(stage,'guest'),{recursive:true});
  // The sole accepted starting point for the merge is a PREPRODUCTION_ONLY stage.
  const registry={schemaVersion:'guest-catalog-owner-renderers-v2',templates:{'veil-light':{id:'veil-light',mode:'native',version:'5.3.3',status:'commercially-frozen'}}};
  const manifest={status:'PREPRODUCTION_DO_NOT_SELL',commercialApproved:false,productionPromotionForbidden:true,designs:[],files:[]};
  const manifestPath=path.join(stage,'GUEST_STAGE_MANIFEST.json'),registryPath=path.join(stage,'guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json');
  fs.writeFileSync(registryPath,JSON.stringify(registry));
  fs.writeFileSync(manifestPath,JSON.stringify(manifest));
  const manifestBefore=fs.readFileSync(manifestPath,'utf8'),registryBefore=fs.readFileSync(registryPath,'utf8');
  fs.writeFileSync(path.join(base,'index.html'),'<html>fake master</html>');
  fs.writeFileSync(path.join(base,'manifest.json'),JSON.stringify({source_sha256:'fake',output_html_sha256:'fake',public_sale_approved:false,assets:[]}));
  const refused=invoke(['--source',source,'--stage',stage]);
  assert.notEqual(refused.status,0,'modified or missing VEIL master must fail');
  assert.match(refused.stderr,/VEIL_PILOT_SOURCE_MISMATCH/);
  assert.equal(fs.readFileSync(manifestPath,'utf8'),manifestBefore,'stage manifest must remain unchanged on failed integrity gate');
  assert.equal(fs.readFileSync(registryPath,'utf8'),registryBefore,'published registry must remain unchanged on failed integrity gate');
  assert(!fs.existsSync(path.join(stage,'guest/catalog-assets/veil-light/5.3.3')),'no partial visual staging');
  const badRoot=invoke(['--source',source,'--stage',source]);assert.notEqual(badRoot.status,0,'must not overwrite source');
  const programSource=fs.readFileSync(program,'utf8');
  assert.match(programSource,/PREPRODUCTION_DO_NOT_SELL/);
  assert.match(programSource,/GUEST_APPLY_CONFIG/);
  assert.match(programSource,/VEIL_APPLY_CONFIG/);
  // Derived VEIL metadata must be covered by the same immutable file-integrity report.
  assert.match(programSource,/newReport\.files\.push\(entry\(sub\+'\/bridge-manifest\.json'/);
  assert.doesNotMatch(programSource,/https:\/\/api\.stripe\.com/);
  // The cover-unlock fix is applied to the derived stage copy, fail-closed, never to the frozen master.
  assert.match(programSource,/patchVeilUnlock\(html\)/);
  assert.match(programSource,/VEIL_UNLOCK_PATCH_NOT_APPLIED/);
  const {patchVeilUnlock,MARK}=require(path.join(root,'guest/tools/patch_veil_unlock_2026_10_22.cjs'));
  assert.throws(()=>patchVeilUnlock('<html>no anchors</html>'),/VEIL_UNLOCK_ANCHOR_MISSING/);
  const anchors="body.lock{overflow:hidden}\n entry.addEventListener('ended',()=>{entry.currentTime=CLEAN_VEIL_START;entry.play().catch(()=>{})});\n $('#openBtn').onclick=()=>{\n   setTimeout(()=>entry.play().catch(()=>{}),230);\n };";
  const once=patchVeilUnlock(anchors);
  assert(once.changed&&once.html.includes(MARK)&&once.html.includes('setTimeout(openNow,6500)'),'unlock patch applies to the known anchors');
  assert.deepEqual(patchVeilUnlock(once.html),{html:once.html,changed:false},'unlock patch is idempotent');
  console.log('PASS: VEIL stage merge is fail-closed, no original changes, no sales, no partial write on invalid master');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
