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
  assert.doesNotMatch(programSource,/https:\/\/api\.stripe\.com/);
  console.log('PASS: VEIL stage merge is fail-closed, no original changes, no sales, no partial write on invalid master');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
