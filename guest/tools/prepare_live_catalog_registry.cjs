#!/usr/bin/env node
'use strict';
/* GUEST generic TEST-only registry updater for the *currently fetched* live Edge Function.
 * DO NOT deploy automatically. Usage:
 *   node guest/tools/prepare_live_catalog_registry.cjs --input /tmp/live-index.ts --output /tmp/live-index.candidate.ts --require-template <id>
 * Run only after the design is registered through register_visual_template.cjs.
 * Changes just the catalog JSON declaration; fails closed on drift and unintended promotion.
 */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const args=process.argv.slice(2),arg=k=>{const i=args.indexOf(k);return i===-1?null:args[i+1]};
const sha=t=>crypto.createHash('sha256').update(t).digest('hex');
function prepare(source,generated,requiredId){
 if(typeof source!=='string'||typeof generated!=='string')throw Error('SOURCE_MISSING');
 if(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(requiredId||''))throw Error('INVALID_REQUIRED_TEMPLATE_ID');
 const tag='const CATALOG_TEMPLATES:any=';
 const end=';\n// Call assertCatalogOrderMode(spec,mode) inside ALL order-creation routes (test/checkout).';
 const locate=(s,label)=>{
  const start=s.indexOf(tag),again=s.indexOf(tag,start+tag.length);
  if(start<0||again>=0)throw Error('CATALOG_ANCHOR_MISSING_OR_DUPLICATE_'+label);
  const finish=s.indexOf(end,start+tag.length);
  if(finish<0||s.indexOf(end,finish+end.length)>=0)throw Error('CATALOG_END_MISSING_OR_DUPLICATE_'+label);
  let obj;try{obj=JSON.parse(s.slice(start+tag.length,finish))}catch{throw Error('CATALOG_JSON_INVALID_'+label)}
  if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('CATALOG_INVALID_'+label);
  return {start,finish,obj};
 };
 const old=locate(source,'LIVE'),next=locate(generated,'GENERATED');
 if(!source.includes("function assertCatalogOrderMode(spec:any,mode:'test'|'production')")||
    !source.includes('function templateSpec(v:any)')||
    !source.includes("if(spec?.testOnly===true&&mode!=='test')")||
    !source.includes("if(!x||x.active!==true)throw new Error('template_unavailable')"))
  throw Error('BACKEND_GUARDS_DRIFT');
 if(!Object.hasOwn(next.obj,requiredId)||next.obj[requiredId].testOnly!==true)
  throw Error('REQUIRED_TEMPLATE_MUST_BE_TEST_ONLY');
 for(const [id,cur] of Object.entries(old.obj)){
  const replacement=next.obj[id];
  if(!replacement||cur.id!==replacement.id||
     String(cur.version)!==String(replacement.version)||
     cur.testOnly!==replacement.testOnly||
     cur.active!==replacement.active||
     JSON.stringify(cur.typographyVariants)!==JSON.stringify(replacement.typographyVariants)||
     cur.defaultTypographyVariant!==replacement.defaultTypographyVariant)
   throw Error('EXISTING_TEMPLATE_DRIFT:'+id);
 }
 for(const [id,info] of Object.entries(next.obj)){
  if(!Object.hasOwn(old.obj,id)&&info.testOnly!==true)
   throw Error('NEW_TEMPLATE_NOT_TEST_ONLY:'+id);
 }
 const out=source.slice(0,old.start)+tag+JSON.stringify(next.obj,null,2)+source.slice(old.finish);
 const verify=locate(out,'OUTPUT');
 if(Object.keys(verify.obj).length!==Object.keys(next.obj).length)throw Error('OUTPUT_COUNT_MISMATCH');
 const newIds=Object.keys(next.obj).filter(x=>!Object.hasOwn(old.obj,x));
 if(!newIds.includes(requiredId))throw Error('REQUIRED_TEMPLATE_ALREADY_IN_LIVE_OR_NOT_NEW');
 return {source:out,report:{before:Object.keys(old.obj),after:Object.keys(next.obj),addedTestOnly:newIds,
    sourceSha256:sha(source),outputSha256:sha(out),
    changedOnlyCatalog:true,deployPerformed:false,productionPromoted:false}};
}
function main(){
 const input=arg('--input'),output=arg('--output'),id=arg('--require-template');
 if(!input||!output||!id)throw Error('Usage: --input live-index.ts --output NEW-index.ts --require-template design-03');
 const from=path.resolve(input),to=path.resolve(output);
 if(from===to||fs.existsSync(to))throw Error('REFUSE_OVERWRITE_INPUT_OR_OUTPUT');
 const cmd=cp.spawnSync(process.execPath,[path.join(__dirname,'generate_backend_catalog_registry.cjs'),'--mode','test-only'],{encoding:'utf8',timeout:15000});
 if(cmd.status!==0)throw Error('CATALOG_GENERATION_FAILED:'+cmd.stderr);
 const result=prepare(fs.readFileSync(from,'utf8'),cmd.stdout,id);
 fs.writeFileSync(to,result.source,{flag:'wx'});
 console.log(JSON.stringify(result.report,null,2));
}
if(require.main===module)main();
module.exports={prepare};
