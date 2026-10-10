#!/usr/bin/env node
'use strict';
/* CERTIFICATION-IN-PROGRESS. Runs ONLY against ephemeral 127.0.0.1 Supabase,
 * synthetic license, two synthetic couples. NO real cloud/service credentials.
 * The resulting fake invitationUrl is not a public working page. */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const lines=fs.readFileSync(process.argv[2]||'', 'utf8').split(/\r?\n/);
const env=Object.fromEntries(lines.map(l=>{const i=l.indexOf('=');return i>0?[l.slice(0,i),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]:[]}).filter(x=>x.length===2));
const base=new URL(env.GUEST_LOCAL_API_URL||env.API_URL||'');
if(base.protocol!=='http:'||!['localhost','127.0.0.1'].includes(base.hostname)||base.port!=='54321')throw Error('NO_REMOTE_API_ALLOWLIST');
const anon=env.GUEST_LOCAL_ANON_KEY||env.ANON_KEY;
if(!anon)throw Error('NO_RUNNER_LOCAL_ANON');
const API=base.origin+'/functions/v1/guest-invitation-flow';
const OWNER_ID='11111111-2222-4333-8444-555555555555';
const targetSite='https://guest-ci-local.invalid';
const fakeEmail='fake-couple@example.invalid';
async function call(action,data={},owner='',expect=200){
 const headers={'content-type':'application/json',apikey:anon,Authorization:'Bearer '+anon};
 if(owner)headers['x-weddly-manager']=owner;
 const res=await fetch(API,{method:'POST',headers,body:JSON.stringify({action,...data}),redirect:'error'});
 const body=await res.json().catch(()=>({}));
 if(res.status!==expect||body.ok!==true)throw Error('EDGE_'+action+'_expected_'+expect+'_got_'+res.status+'_error_'+String(body.error||'none').slice(0,100));
 return body;
}
function managerToken(key){
 const payload=Buffer.from(JSON.stringify({ownerId:OWNER_ID,exp:Date.now()+600000})).toString('base64url');
 const sig=crypto.createHmac('sha256',key).update('wsd-owner-manager-v1|'+payload).digest('hex');
 return 'v1.'+payload+'.'+sig;
}
async function chooseLocalOwner(){
 const candidates=[env.SECRET_KEY,env.GUEST_LOCAL_SECRET_KEY,env.SERVICE_ROLE_KEY,env.GUEST_LOCAL_SERVICE_ROLE_KEY].filter(Boolean);
 if(!candidates.length)throw Error('NO_LOCAL_SIGNING_KEY');
 for(const key of new Set(candidates)){
  const token=managerToken(key);
  try{await call('status',{},token);return token}catch{}
 }
 throw Error('SYNTHETIC_MANAGER_AUTH_FAILED');
}
function withoutShortLivedMediaSignature(value){return JSON.parse(JSON.stringify(value,(k,v)=>typeof v==='string'&&v.startsWith('https://guest-ci-signed.invalid/')?v.split('?')[0]:v));}
function questionnaire(which){
 const common={couple:{name1:'Prueba',name2:which===1?'Fotografía':'Editorial',date:'2027-06-12'},
  confirmation:{reviewed:true},agenda:{enabled:false},gallery:{enabled:false},practical:{bus:{enabled:false},gift:{enabled:false},playlist:{enabled:false}}};
 if(which===1)return {...common,story:{enabled:true,textMode:'none'},locations:{mode:'split',ceremony:{name:'Ceremonia ficticia',time:'12:30'},celebration:{name:'Celebración ficticia',time:'15:00'}}};
 return {...common,story:{enabled:true,textMode:'custom',customText:'Un texto de historia de prueba ficticia.'},locations:{mode:'shared',shared:{name:'Sede de prueba',time:'17:00'}}};
}
async function uploadStory(qToken){
 const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l7kAAAAASUVORK5CYII=','base64');
 const form=new FormData();form.set('action','upload');form.set('slot','story');form.set('token',qToken);form.set('file',new Blob([bytes],{type:'image/png'}),'synthetic-story.png');
 const res=await fetch(API,{method:'POST',headers:{apikey:anon,Authorization:'Bearer '+anon},body:form,redirect:'error'});
 const data=await res.json().catch(()=>({}));
 if(res.status!==200||data.ok!==true)throw Error('EDGE_upload_got_'+res.status+'_error_'+String(data.error||'none').slice(0,100));
 return data;
}
async function main(){
 const owner=await chooseLocalOwner();
 const completed=[];
 for(const number of [1,2]){
  const create=await call('create_test',{templateId:'botanica',email:fakeEmail},owner,201);
  assert(create.id&&create.qToken&&create.rToken&&create.pToken);
  const q=questionnaire(number);
  const loaded=await call('load',{token:create.qToken});
  assert.equal(loaded.order.templateId,'botanica');
  if(number===1)await uploadStory(create.qToken);
  await call('save',{token:create.qToken,questionnaire:q});
  await call('submit',{token:create.qToken,questionnaire:q});
  const started=await call('start_design',{orderId:create.id},owner);
  assert.equal(started.config.template.id,'botanica');assert.equal(String(started.config.template.version),'14.7');
  if(number===1)assert.equal(started.config.story.textMode,'none','photo-only story must remain NONE, never preset');
  await call('mark_review_ready',{orderId:create.id},owner);
  const review=await call('review_load',{token:create.rToken});
  assert.equal(review.order.config.template.id,'botanica');
  await call('review_respond',{token:create.rToken,decision:'approve'});
  const inviteUrl=targetSite+'/invitation/'+create.id;
  const delivered=await call('deliver',{orderId:create.id,invitationUrl:inviteUrl},owner);
  assert.equal(delivered.status,'delivered');
  const publicView=await call('public_load',{token:create.pToken});
  assert.equal(publicView.order.config.template.id,'botanica');
  assert.equal(String(publicView.order.config.template.version),'14.7');
  const columns=['template','story','locations','agenda','practical','rsvp'];
  for(const c of columns)assert.deepEqual(withoutShortLivedMediaSignature(publicView.order.config[c]),withoutShortLivedMediaSignature(review.order.config[c]),'review/final parity (exclude expiring media signature): '+c);
  completed.push({orderMode:'test',template:'botanica',storyMode:q.story.textMode,locations:q.locations.mode,review:true,approved:true,deliveryRecord:true,publicLoad:true});
 }
 assert.equal(completed.length,2);
 console.log('PASS actual local V13 lifecycle: TWO synthetic Botánica orders via manager auth, questionnaire/save/submit, design, review, approval, delivery and public_load, photo-only none and custom, review/final parity. NO working public pages, no real RSVP endpoint, no email/checkout/production.');
}
main().catch(e=>{console.error('LOCAL_V13_E2E_FAILED:',e.message);process.exitCode=1});
