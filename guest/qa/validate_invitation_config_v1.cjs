#!/usr/bin/env node
'use strict';
/*
 * Strict, dependency-free validator for the existing GUEST JSON schema.
 * QA-only: no writes, no network, no deploys. Check the config emitted by
 * the LIVE backend, not a manually massaged demo. Return error paths.
 */
const fs=require('node:fs'),path=require('node:path');
const schemaFile=path.resolve(__dirname,'../GUEST_INVITATION_CONFIG_SCHEMA_V1.json');
const schema=JSON.parse(fs.readFileSync(schemaFile,'utf8'));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function validate(data,contract=schema){
 const errors=[];
 const got=x=>x===null?'null':Array.isArray(x)?'array':typeof x;
 function walk(value,node,p){
  if(!node||typeof node!=='object')return;
  if(node.$ref){
   if(!node.$ref.startsWith('#/$defs/')){errors.push(p+':unsupported_ref');return}
   const key=node.$ref.slice('#/$defs/'.length),target=contract.$defs?.[key];
   if(!target){errors.push(p+':unknown_ref_'+key);return}
   walk(value,target,p);return;
  }
  if(node.anyOf){if(!node.anyOf.some(branch=>{const n=errors.length;walk(value,branch,p);const valid=errors.length===n;errors.length=n;return valid}))errors.push(p+':anyOf');return}
  if(Object.hasOwn(node,'const')&&!equal(value,node.const))errors.push(p+':const');
  if(Array.isArray(node.enum)&&!node.enum.some(x=>equal(x,value)))errors.push(p+':enum');
  if(node.type){
   const allowed=Array.isArray(node.type)?node.type:[node.type],actual=got(value);
   const ok=allowed.some(t=>t===actual||(t==='integer'&&actual==='number'&&Number.isInteger(value)));
   if(!ok){errors.push(p+':type_'+actual);return}
  }
  if(typeof value==='string'){
   if(node.minLength!==undefined&&value.length<node.minLength)errors.push(p+':minLength');
   if(node.maxLength!==undefined&&value.length>node.maxLength)errors.push(p+':maxLength');
   if(node.format==='date'&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number.isNaN(Date.parse(value+'T00:00:00Z'))))errors.push(p+':date');
   if(node.format==='uri'&&!/^https?:\/\/\S+$/i.test(value))errors.push(p+':uri');
  }
  if(typeof value==='number'){
   if(node.minimum!==undefined&&value<node.minimum)errors.push(p+':minimum');
   if(node.maximum!==undefined&&value>node.maximum)errors.push(p+':maximum');
  }
  if(Array.isArray(value)){
   if(node.minItems!==undefined&&value.length<node.minItems)errors.push(p+':minItems');
   if(node.maxItems!==undefined&&value.length>node.maxItems)errors.push(p+':maxItems');
   value.forEach((v,i)=>walk(v,node.items||{},p+'['+i+']'));
  }
  if(value!==null&&typeof value==='object'&&!Array.isArray(value)){
   for(const key of node.required||[])if(!Object.hasOwn(value,key))errors.push(p+'.'+key+':required');
   for(const [key,v] of Object.entries(value)){
    if(node.properties?.[key])walk(v,node.properties[key],p+'.'+key);
    else if(node.additionalProperties===false)errors.push(p+'.'+key+':unexpected');
   }
  }
 }
 walk(data,contract,'$');
 return errors;
}
if(require.main===module){
 const argv=process.argv.slice(2),input=argv[0];
 if(!input)throw Error('Usage: node guest/qa/validate_invitation_config_v1.cjs CONFIG.json');
 const candidate=JSON.parse(fs.readFileSync(input,'utf8'));
 const errors=validate(candidate);
 if(errors.length){console.error('FAIL GUEST schema validation:\n'+errors.map(e=>' - '+e).join('\n'));process.exitCode=1}
 else console.log('PASS GUEST config schema v1 (offline): '+input);
}
module.exports={validate,schema};
