#!/usr/bin/env node
'use strict';
// INTERNAL GH public runner only: no credentials from user account, no real orders.
const assert=require('node:assert/strict'),fs=require('node:fs');
const env=Object.fromEntries(fs.readFileSync(process.argv[2]||'', 'utf8').split(/\r?\n/).map(l=>{const i=l.indexOf('=');return i>0?[l.slice(0,i),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]:[]}).filter(v=>v.length===2));
const u=new URL(env.GUEST_LOCAL_API_URL||'');
if(u.hostname!=='127.0.0.1'||u.port!=='54321'||u.protocol!=='http:')throw Error('local_only_boundary');
const url=u.origin+'/functions/v1/guest-invitation-flow';
const anonKey=env.GUEST_LOCAL_ANON_KEY;if(!anonKey||anonKey.length<30)throw Error('missing_ephemeral_anon_key');
async function query(action,extras={}){
 const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json','apikey':anonKey,'Authorization':'Bearer '+anonKey},body:JSON.stringify({action,...extras}),redirect:'error'});
 return {http:r.status,body:await r.json().catch(()=>({}))};
}
(async()=>{
 let r;for(let i=0;i<50;i++){try{r=await query('public_load',{token:'invalid-synthetic-token'});if(r.http===403&&r.body?.error==='invalid_token')break}catch{}await new Promise(ok=>setTimeout(ok,500))}
 assert(r,'local V13 function is not serving');
 assert.equal(r.http,403,JSON.stringify({http:r.http,error:r.body?.error}));
 assert.equal(r.body?.error,'invalid_token');
 const review=await query('review_load',{token:'invalid-synthetic-token'});
 assert.equal(review.http,403);assert.equal(review.body?.error,'invalid_token');
 const owner=await query('create_test',{templateId:'botanica',email:'synthetic@example.invalid'});
 assert.equal(owner.http,403,'anonymous caller cannot create a test order');
 assert.equal(owner.body?.error,'manager_required');
 console.log('PASS actual generated V13 local Edge runtime: public and review tokens checked; unauthorized Botánica create_test blocked. NO ORDERS, EMAIL, CLOUD, OR STUDIO.');
})().catch(e=>{console.error('LOCAL_V13_SMOKE_FAILURE:',e.message);process.exitCode=1});
