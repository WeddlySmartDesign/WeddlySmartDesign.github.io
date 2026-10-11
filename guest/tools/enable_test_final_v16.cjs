#!/usr/bin/env node
'use strict';
/* GUEST V15 -> V16: disclose only trusted order mode alongside a valid
 * public capability; allows customer browser to distinguish private TEST
 * delivery from PRODUCTION before enforcing catalog visual admission.
 * Commercial pending design remains forbidden. This cannot create orders.
 */
const fs=require('node:fs'),path=require('node:path');
const arg=k=>{const a=process.argv.slice(2);return a.includes(k)?a[a.indexOf(k)+1]:null};
function patch(src){
 const old="return json({ok:true,order:{id:order.id,label:orderLabel(order),config}});";
 const next="return json({ok:true,order:{id:order.id,mode:order.mode==='test'?'test':'production',label:orderLabel(order),config}});";
 if(src.split(old).length!==2||!src.includes("if(action==='public_load')")||
    !src.includes("const paidCatalogDelivery=")||src.includes("mode:order.mode==='test'?'test':'production',label:orderLabel(order)"))
   throw Error('GUEST_V15_PUBLIC_LOAD_SOURCE_DRIFT');
 return src.replace(old,next);
}
if(require.main===module){
 const from=arg('--input'),to=arg('--output');
 if(!from||!to||path.resolve(from)===path.resolve(to)||fs.existsSync(to))
   throw Error('Usage: --input reviewed-v15.ts --output NEW-v16.ts (never overwrite)');
 fs.mkdirSync(path.dirname(path.resolve(to)),{recursive:true});
 fs.writeFileSync(to,patch(fs.readFileSync(from,'utf8')),{flag:'wx'});
 console.log('Prepared GUEST V16 trustworthy test-only mode on capability-checked public_load. NO DEPLOY.');
}
module.exports={patch};
