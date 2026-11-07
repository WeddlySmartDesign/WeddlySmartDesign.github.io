#!/usr/bin/env node
'use strict';
// Independent GUEST commercial scope gate regression (offline only).
// There is deliberately no path to activate checkout from this test.
const cp=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict');
const script=path.resolve(__dirname,'../qa/catalog_commercial_go_no_go_2026_10_20.cjs');
function check(args=[]){
 const r=cp.spawnSync(process.execPath,[script,...args],{encoding:'utf8'});
 const payload=JSON.parse(r.stdout);
 return{status:r.status,payload,blocking:new Set(payload.blockingChecks.map(x=>x.id))};
}
const full=check();
assert.equal(full.status,0);
assert.equal(full.payload.status,'NO_GO');
assert.equal(full.payload.scope,'whole-catalog');
assert(full.blocking.has('certification:design-03'),'legacy whole-catalog still reveals D03 unapproved');
const veil=check(['--template=veil-light']);
assert.equal(veil.status,0);
assert.equal(veil.payload.status,'NO_GO');
assert.equal(veil.payload.scope,'individual-design');
assert.equal(veil.payload.requestedTemplateId,'veil-light');
assert(veil.blocking.has('external-verification'),'never trust offline tests as external evidence');
assert(!veil.blocking.has('certification:design-03'),'archived D03 must not block chosen VEIL');
assert(!veil.blocking.has('certification:botanica'),'other unfinished designs must not block VEIL');
assert(!veil.blocking.has('renderers-e2e'),'all-design completion must not block one-design certification');
const veilLaunch=check(['--template=veil-light','--launch-gate']);
assert.notEqual(veilLaunch.status,0,'VEIL cannot go live from an offline check');
const pending=check(['--template=botanica','--launch-gate']);
assert.notEqual(pending.status,0);
assert(pending.blocking.has('certification:botanica'),'BOTÁNICA remains gated');
const wrong=check(['--template=design-03','--launch-gate']);
assert.notEqual(wrong.status,0);
assert(wrong.blocking.has('selected-template'),'historical incorrect LIMONEROS must never be sold');
const unknown=check(['--template=does-not-exist','--launch-gate']);
assert.notEqual(unknown.status,0);
assert(unknown.blocking.has('selected-template'));
console.log('PASS independent design release scope: pending candidates do not block VEIL; historical D03 always refused; all sales remain NO_GO');
