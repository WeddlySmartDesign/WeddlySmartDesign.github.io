#!/usr/bin/env node
'use strict';
/* Shared GUEST catalog QA invoked by GitHub Actions on every catalog change.
 * Verifies structural and generator invariants only. Real E2E/Android remain separate certification gates.
 */
const cp=require('node:child_process'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const tests=[
 'guest/qa/catalog_admission_gate.cjs',
 'guest/tests/catalog_admission_gate_test.cjs',
 'guest/qa/visual_plugin_system_contract.cjs',
 'guest/tests/visual_plugin_onboarding.test.cjs',
 'guest/tests/owner_viewer_generic.test.cjs',
 'guest/tests/backend_catalog_generation.test.cjs'
];
for(const file of tests){const run=cp.spawnSync(process.execPath,[path.join(root,file)],{encoding:'utf8',cwd:root,timeout:30000});process.stdout.write(`${file}:\n${run.stdout||''}`);if(run.status!==0){process.stderr.write(run.stderr||`Exit ${run.status}\n`);process.exit(1)}}
console.log('PASS GUEST visual-plugin system V2 structural preflight — NOT live E2E certification');