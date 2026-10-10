#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),{patch}=require('../tools/allow_catalog_public_origin_v14.cjs');
const source="if(action==='create_paid'){};if(spec.testOnly===true)return json({ok:false,error:'template_test_only'},409);"+
"if(finalUrl.protocol!=='https:'||finalUrl.origin!==configuredSite.origin||finalUrl.username||finalUrl.password)return json({ok:false,error:'invalid_invitation_url'},400);";
const converted=patch(source);
assert.match(converted,/GUEST_CATALOG_PUBLIC_ORIGIN/);
assert.match(converted,/finalUrl\.pathname==='\/guest\/catalog-final\.html'/);
assert.match(converted,/searchParams\.get\('p'\)===token/);
assert.throws(()=>patch(converted),/SOURCE_DRIFT/,'never patch twice');
const start=converted.indexOf('const publicOriginRaw=');
const fn=new Function('finalUrl','configuredSite','token','Deno','json',converted.slice(start));
const check=(value,secondary='')=>{
 const Deno={env:{get:k=>k==='GUEST_CATALOG_PUBLIC_ORIGIN'?secondary:''}};
 return fn(new URL(value),new URL('https://weddlysmartdesign.github.io'), 'TOKEN123', Deno,(body,status)=>({body,status}));
};
assert.equal(check('https://weddlysmartdesign.github.io/guest/legacy-invitation.html'),undefined,'legacy site behavior preserved');
assert.equal(check('https://newguest.pages.dev/guest/catalog-final.html?p=TOKEN123').status,400,'secondary blocked until configured');
assert.equal(check('https://newguest.pages.dev/guest/catalog-final.html?p=TOKEN123','https://newguest.pages.dev'),undefined);
for(const url of [
 'http://newguest.pages.dev/guest/catalog-final.html?p=TOKEN123',
 'https://evilnewguest.pages.dev/guest/catalog-final.html?p=TOKEN123',
 'https://newguest.pages.dev/guest/other.html?p=TOKEN123',
 'https://newguest.pages.dev/guest/catalog-final.html?p=WRONG',
 'https://newguest.pages.dev/guest/catalog-final.html?p=TOKEN123&bad=1',
 'https://newguest.pages.dev/guest/catalog-final.html?p=TOKEN123#wrong'
]) assert.equal(check(url,'https://newguest.pages.dev').status,400,'unsafe URL '+url);
assert.equal(check('https://newguest.pages.dev/guest/catalog-final.html?p=TOKEN123','http://newguest.pages.dev').status,503,'unsafe env fails closed');
assert.equal(check('https://newguest.pages.dev/guest/catalog-final.html?p=TOKEN123','https://newguest.pages.dev/arbitrary').status,503,'subpath env fails closed');
console.log('PASS V14 origin bridge: explicit HTTPS, exact /guest/catalog-final.html?p=token, no spoof/extra params, original origin preserved, deny by default.');
