'use strict';
const fs=require('fs'),assert=require('assert/strict');
const src=fs.readFileSync('guest/backend/guest-invitation-flow/index.ts','utf8');
const old=fs.readFileSync('guest/backend/guest-invitation-flow/DEPLOYED_LIVE_V20_READONLY_2026-10-20.ts','utf8');
const a='const CATALOG_TEMPLATES:any={',end='};\n// Call assertCatalogOrderMode';
const i=src.indexOf(a),j=src.indexOf(end,i),oi=old.indexOf(a),oj=old.indexOf(end,oi);
assert(i>=0&&j>i&&oi>=0&&oj>oi,'catalog registry boundaries changed');
const names=Array.from({length:13},(_,i)=>'design-'+String(i+4).padStart(2,'0'));
const originalText=old.slice(oi,j>i?oj:oj),newText=src.slice(i,j);
for(const id of names){
 const re=new RegExp('"'+id+'":\\s*\\{');
 assert(re.test(newText),'new test design missing '+id);
}
assert(src.slice(j)===old.slice(oj),'NO backend code outside TEST-only map may change in registration update');
const parse=o=>new Function('return ('+o.slice(o.indexOf('{'))+'})')();
const o=parse(originalText),c=parse(newText);
for(const id of Object.keys(o))assert.deepEqual(c[id],o[id],'Existing template changed: '+id);
for(const id of names){
 const spec=c[id];
 assert.equal(spec.id,id);assert.equal(spec.version,'1.0.0');assert.equal(spec.active,true);
 assert.equal(spec.testOnly,true,'Unsafe production template '+id);
 assert.equal(spec.renderer,id+'-v1-0-0');
}
assert.equal(Object.keys(c).length,16,'Expected 13 new + 3 historic');
assert(src.includes("if(spec?.testOnly===true&&mode!=='test')throw new Error('template_test_only')"),'Backend production gate was disabled');
const stripe=fs.readFileSync('guest/backend/guest-stripe-checkout/index.ts','utf8');
assert(stripe.includes("option.status!=='commercially-frozen'"),'Checkout accepts pending designs');
console.log('PASS 13 additional TEST-ONLY designs in invitation backend, original 3 preserved and all commercial gates intact.');
