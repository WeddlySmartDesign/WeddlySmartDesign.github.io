#!/usr/bin/env node
'use strict';
// Disposable Supabase CI only. No live services, real customer data, or V13 claims.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const raw=fs.readFileSync(process.argv[2]||'', 'utf8');
const env=Object.fromEntries(raw.split(/\r?\n/).map(line=>{
 const i=line.indexOf('=');
 if(i<1)return [];
 return [line.slice(0,i),line.slice(i+1).trim().replace(/^["']|["']$/g,'')];
}).filter(x=>x.length===2));
const url=env.GUEST_LOCAL_API_URL,serviceKey=env.GUEST_LOCAL_SERVICE_ROLE_KEY,anonKey=env.GUEST_LOCAL_ANON_KEY;
if(!url||!serviceKey||!anonKey)throw Error('missing_local_supabase_test_credentials');
const base=new URL(url);
if(!['localhost','127.0.0.1'].includes(base.hostname)||base.protocol!=='http:'||base.port!=='54321'||base.username||base.password)throw Error('remote_supabase_url_is_never_allowed');
const hash=x=>crypto.createHash('sha256').update('guest-ci-isolated-'+x).digest('hex');
async function req(table,{method='GET',data,query='',role='service'}={}){
 const key=role==='anon'?anonKey:serviceKey;
 const headers={'apikey':key,'Authorization':'Bearer '+key,'Accept':'application/json','Prefer':'return=representation'};
 if(data!==undefined)headers['Content-Type']='application/json';
 const result=await fetch(base.origin+'/rest/v1/'+table+query,{method,headers,body:data===undefined?undefined:JSON.stringify(data),redirect:'error',cache:'no-store'});
 const payload=await result.json().catch(()=>null);
 return {code:result.status,data:payload};
}
(async()=>{
 const orders=[
  {mode:'test',buyer_email:'fictional-1@example.invalid',template_id:'botanica',template_version:'14.7',status:'review_ready',questionnaire_token_hash:hash('order-a'),questionnaire:{story:{textMode:'none'},locations:{count:2}},resolved_config:{template:{id:'botanica',version:'14.7'}}},
  {mode:'test',buyer_email:'fictional-2@example.invalid',template_id:'botanica',template_version:'14.7',status:'approved',questionnaire_token_hash:hash('order-b'),questionnaire:{story:{textMode:'custom'},locations:{count:1}},resolved_config:{template:{id:'botanica',version:'14.7'}}}
 ];
 const insert=await req('guest_invitation_orders',{method:'POST',data:orders});
 assert.equal(insert.code,201,'Two fully fictitious pinned orders must insert into disposable database');
 assert.equal(insert.data?.length,2);
 const orderIds=insert.data.map(x=>x.id);
 const reread=await req('guest_invitation_orders',{query:'?select=id,mode,status,template_id,template_version,questionnaire&id=in.('+orderIds.join(',')+')'});
 assert.equal(reread.code,200);assert.equal(reread.data.length,2);
 assert.deepEqual(reread.data.map(x=>x.template_id),['botanica','botanica']);
 const anon=await req('guest_invitation_orders',{role:'anon',query:'?select=id'});
 assert([401,403].includes(anon.code)||(anon.code===200&&Array.isArray(anon.data)&&anon.data.length===0),'anon access must not disclose test orders');
 const forms=[
  {public_token_hash:hash('pub-a'),manage_token_hash:hash('man-a'),config:{rsvp:{type:'person'}}},
  {public_token_hash:hash('pub-b'),manage_token_hash:hash('man-b'),config:{rsvp:{type:'unit'}}}
 ];
 const formResult=await req('guest_rsvp_forms',{method:'POST',data:forms});
 assert.equal(formResult.code,201);assert.equal(formResult.data.length,2);
 const people=[
  {form_id:formResult.data[0].id,client_submission_id:'synthetic-g',guest_key:'synthetic-guest-01',name:'Fictitious Guest',attend:true,payload:{recipient:{g:'synthetic-guest-01'}}},
  {form_id:formResult.data[1].id,client_submission_id:'synthetic-u',name:'Fictitious Unit',attend:false,payload:{recipient:{u:'synthetic-unit-01'}}}
 ];
 const submitted=await req('guest_rsvp_submissions',{method:'POST',data:people});
 assert.equal(submitted.code,201);assert.equal(submitted.data.length,2);
 const persisted=await req('guest_rsvp_submissions',{query:'?select=client_submission_id,payload&order=client_submission_id'});
 assert.equal(persisted.code,200);assert.equal(persisted.data.length,2);
 assert(persisted.data.some(x=>x.payload?.recipient?.g==='synthetic-guest-01'));
 assert(persisted.data.some(x=>x.payload?.recipient?.u==='synthetic-unit-01'));
 const anonRsvp=await req('guest_rsvp_submissions',{role:'anon',query:'?select=id'});
 assert([401,403].includes(anonRsvp.code)||(anonRsvp.code===200&&Array.isArray(anonRsvp.data)&&anonRsvp.data.length===0),'anon access must not disclose RSVP');
 console.log('PASS isolated free Supabase REST: two synthetic Botánica rows stored/reloaded; synthetic person g and unit u rows persisted; direct anon access blocked. NO V13 / NO REAL RSVP E2E / NO PROD.');
})().catch(e=>{console.error('LOCAL_ONLY_CI_FAILED:',e.message);process.exitCode=1});
