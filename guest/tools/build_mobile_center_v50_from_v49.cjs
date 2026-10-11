#!/usr/bin/env node
'use strict';
/** GUEST V5.0 isolated candidate from verified V4.9, no changes to frozen invitation. */
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const BASE_SHA='4a163fbb556dbe363b6765107a0e6c99dcd4cdf5b44f2fd2755cc2f69b0eab5c';
const BASE_BYTES=45561955;
const BOTANICA_SHA='fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function one(s,a,b,label){const n=s.split(a).length-1;if(n!==1)throw Error("SOURCE_DRIFT_"+label+"_"+n);return s.replace(a,b)}
function patch(s){
 // The order can already be review_sent in Cloud when this browser lacks the local done key.
 // Keep old measurements intact; do not add new seconds to submitted/approved/delivered orders.
 s=one(s,
  "function isTouchDone(id=current){if(!id)return false;return touchDoneData()[id]===true}",
  "function remoteReviewComplete(id=current){if(!id)return false;const detail=currentDetail?.id===id?currentDetail:null;const order=detail||rows.find(x=>x.id===id);return ['review_sent','approved','delivered'].includes(order?.status)} function isTouchDone(id=current){if(!id)return false;return touchDoneData()[id]===true||remoteReviewComplete(id)}",
  'remote_review_timer_guard');
 // Ensure the newest known detail does not lag when changing orders before Cloud response.
 s=one(s,
  "$('wpOrders').onchange=()=>{current=$('wpOrders').value;ownerActivity();touchLabel();showSelected()};",
  "$('wpOrders').onchange=()=>{current=$('wpOrders').value;currentDetail=null;ownerActivity();touchLabel();showSelected()};",
  'stale_detail_guard');
 // Native Android 3-dot overflow is outside HTML; reserve clearance, don't pretend to move it.
 s=one(s, "</style>\n\n</head>\n<body class=\"lock\">",
  "</style><style id=\"guest-v50-android-overflow-clearance\">@media(max-width:600px){#wsdProd .box>.row:first-child>div:first-child{box-sizing:border-box;padding-right:clamp(72px,20vw,96px)!important;min-width:0}#wsdProd .box>.row:first-child h2{max-width:100%;overflow-wrap:break-word}}</style>\n\n</head>\n<body class=\"lock\">",
  'native_menu_clearance');
 s=one(s, 'GUEST · Centro móvil · V4.9 · CATÁLOGO TEST', 'GUEST · Centro móvil · V5.0 · CATÁLOGO TEST', 'version_label');
 return s;
}
function build(buffer){
 if(!Buffer.isBuffer(buffer)||buffer.length!==BASE_BYTES||sha(buffer)!==BASE_SHA)throw Error('FROZEN_V49_SHA_SIZE_MISMATCH');
 const output=Buffer.from(patch(buffer.toString('utf8')),'utf8');
 const m=output.toString('utf8').match(/<script id="guest-v47-botanica-master" type="application\/octet-stream" data-sha256="([a-f0-9]{64})">([A-Za-z0-9+/=]+)<\/script>/);
 assert(m&&m[1]===BOTANICA_SHA&&sha(Buffer.from(m[2],'base64'))===BOTANICA_SHA,'BOTANICA_MASTER_CHANGED');
 assert(output.includes(Buffer.from("if(id==='botanica'&&order?.mode!=='test')")),'TEST_ONLY_GUARD_CHANGED');
 assert(output.includes(Buffer.from('function guestCatalogRemote(order,cfg)')),'GENERIC_ROUTE_MISSING');
 return output;
}
if(require.main===module){
 const [source,dest]=process.argv.slice(2);
 if(!source||!dest)throw Error('usage: build_mobile_center_v50_from_v49.cjs /path/V4.9.html /path/NEW_V5.0.html');
 if(fs.existsSync(dest))throw Error('OUTPUT_ALREADY_EXISTS');
 const output=build(fs.readFileSync(source));fs.writeFileSync(dest,output,{flag:'wx'});
 console.log(JSON.stringify({bytes:output.length,sha256:sha(output),from:BASE_SHA,botanicaMaster:BOTANICA_SHA}));
}
module.exports={build,patch,one,sha,BASE_SHA,BASE_BYTES,BOTANICA_SHA};
