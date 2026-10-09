#!/usr/bin/env node
'use strict';
/**
 * Compatibility entrypoint only. Historical scripts may still call this name.
 * ALL current state/registry/evidence checks live in handoff_gate.cjs.
 * Do not fork the continuity rules here.
 */
const {validate}=require('./handoff_gate.cjs');
try {
  const {errors,counts}=validate();
  if(errors.length){
    for(const error of errors) console.error('FAIL '+error);
    process.exitCode=1;
  }else{
    console.log('PASS GUEST continuity (via single handoff_gate.cjs); Botánica '+counts.passed+'/'+counts.total+' gates PASS — not live E2E');
  }
}catch(err){
  console.error('FAIL continuity compatibility delegate:',err.message);
  process.exitCode=1;
}
