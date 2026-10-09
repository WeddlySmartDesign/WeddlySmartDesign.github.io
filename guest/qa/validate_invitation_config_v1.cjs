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
  if(node.anyOf){
   const failures=[];let valid=false;
   for(const branch of node.anyOf){
    const start=errors.length;walk(value,branch,p);
    const issues=errors.splice(start);
    if(!issues.length){valid=true;break}
    failures.push(issues);
   }
   if(!valid)errors.push(...(failures.sort((a,b)=>a.length-b.length)[0]||[p+':anyOf']));
   return;
  }
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
 walk(data,contract,'
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
);
 // Semantic invariants from the *shared* questionnaire, not per-template rules.
 // Structural errors remain in the list; these conditions never add defaults.
 if (data && typeof data === 'object' && !Array.isArray(data)) {
  if (data.cover?.showPlace === true && !String(data.wedding?.coverPlace || '').trim())
   errors.push('$.wedding.coverPlace:required_when_shown');
  if (data.story?.enabled === true && data.story.textMode === 'none' && !data.story.photo)
   errors.push('$.story.photo:required_for_photo_only');
  if (data.story?.enabled === true && data.story.textMode === 'custom' && !String(data.story.body || '').trim())
   errors.push('$.story.body:required_for_custom');
  if (data.locations?.mode === 'shared' && Array.isArray(data.locations.items) && data.locations.items.length !== 1)
   errors.push('$.locations.items:shared_requires_one');
  if (data.locations?.mode === 'split' && Array.isArray(data.locations.items) && data.locations.items.length !== 2)
   errors.push('$.locations.items:split_requires_two');
  if (data.agenda?.enabled === true && Array.isArray(data.agenda.moments) && data.agenda.moments.length === 0)
   errors.push('$.agenda.moments:required_when_enabled');
  if (data.gallery?.enabled === true && Array.isArray(data.gallery.photos) && data.gallery.photos.length === 0)
   errors.push('$.gallery.photos:required_when_enabled');
  if (data.practical?.bus?.enabled === true &&
      (!data.practical.bus.pickupPoints?.length || !data.practical.bus.outboundTimes?.length))
   errors.push('$.practical.bus:pickup_and_outbound_required');
  if (data.practical?.playlist?.enabled === true && !data.practical.playlist.url)
   errors.push('$.practical.playlist.url:required_when_enabled');
 }
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
