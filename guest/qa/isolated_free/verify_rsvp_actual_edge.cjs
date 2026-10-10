#!/usr/bin/env node
'use strict';
// Real guest-rsvp v4 on disposable local Supabase only, no clients or cloud.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const env=Object.fromEntries(fs.readFileSync(process.argv[2]||'', 'utf8').split(/\r?\n/).map(l=>{const i=l.indexOf('=');return i>0?[l.slice(0,i),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]:[]}).filter(x=>x.length===2));
const url=new URL(env.GUEST_LOCAL_API_URL||'');
if(url.protocol!=='http:'||url.hostname!=='127.0.0.1'||url.port!=='54321')throw Error('LOCAL_ONLY_SAFETY_BOUNDARY');
const service=env.GUEST_LOCAL_SERVICE_ROLE_KEY,anon=env.GUEST_LOCAL_ANON_KEY;if(!service||!anon)throw Error('MISSING_EPHEMERAL_KEYS');
const base=url.origin,edge=base+'/functions/v1/guest-rsvp',wedding='22222222-3333-4444-8555-666666666666';
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
async function rest(path,{method='GET',data,query=''}={}){
 const r=await fetch(base+'/rest/v1/'+path+query,{method,headers:{apikey:service,Authorization:'Bearer '+service,Prefer:'return=representation','content-type':'application/json'},body:data?JSON.stringify(data):undefined,redirect:'error'});
 const v=await r.json().catch(()=>({}));if(!r.ok)throw Error('LOCAL_REST_'+path+'_status_'+r.status+'_code_'+String(v.code||'none'));return v;
}
async function edgeCall({method='GET',token,recipientType='',recipient='',data}){
 const u=new URL(edge);if(method==='GET'){u.searchParams.set('token',token);if(recipientType)u.searchParams.set(recipientType,recipient)}
 const r=await fetch(u,{method,headers:{apikey:anon,Authorization:'Bearer '+anon,'content-type':'application/json'},body:method==='POST'?JSON.stringify(data):undefined,redirect:'error'});
 const j=await r.json().catch(()=>({}));
 if(!r.ok||j.ok!==true)throw Error('GUEST_RSVP_'+method+'_status_'+r.status+'_error_'+String(j.error||'none'));
 return {status:r.status,data:j};
}
(async()=>{
 const tokens=['only-synthetic-rsvp-person-token','only-synthetic-rsvp-unit-token'];
 const forms=await rest('guest_rsvp_forms',{method:'POST',data:tokens.map((t,i)=>({wedding_id:wedding,public_token_hash:hash(t),manage_token_hash:hash('manage-'+t),status:'active',config:{questions:{meal:false,allergy:false,transport:false},qa:true}}))});
 assert.equal(forms.length,2);
 const g=await edgeCall({token:tokens[0],recipientType:'guest',recipient:'fictional-g-1'});
 assert.equal(g.data.guest.id,'fictional-g-1');
 const u=await edgeCall({token:tokens[1],recipientType:'unit',recipient:'fictional-u-1'});
 assert.equal(u.data.unit.id,'fictional-u-1');assert.equal(u.data.unit.members.length,2);
 const p=await edgeCall({method:'POST',data:{action:'submit',token:tokens[0],guest_key:'fictional-g-1',name:'Fictitious Person',attend:true,client_submission_id:'synthetic-person-submit-1'}});
 assert.equal(p.status,201);
 const grouped=await edgeCall({method:'POST',data:{action:'submit',token:tokens[1],guest_key:'fictional-g-2',name:'Fictitious Relative',attend:false,client_submission_id:'synthetic-unit-submit-1'}});
 assert.equal(grouped.status,201);
 const dup=await edgeCall({method:'POST',data:{action:'submit',token:tokens[0],guest_key:'fictional-g-1',name:'Fictitious Person',attend:true,client_submission_id:'synthetic-person-submit-1'}});
 assert.equal(dup.status,200);assert.equal(dup.data.duplicate,true);
 const stored=await rest('guest_rsvp_submissions',{query:'?select=client_submission_id,guest_key,attend&form_id=in.('+forms.map(f=>f.id).join(',')+')&order=client_submission_id'});
 assert.equal(stored.length,2,'duplicate must not create another RSVP record');
 assert(stored.some(x=>x.guest_key==='fictional-g-1'&&x.attend===true));
 assert(stored.some(x=>x.guest_key==='fictional-g-2'&&x.attend===false));
 const state=await rest('guest_app_state',{query:'?select=state,version&wedding_id=eq.'+wedding});
 assert.equal(state.length,1);
 assert.equal(state[0].state.guests['fictional-g-1'].rsvp,'confirmed');
 assert.equal(state[0].state.guests['fictional-g-2'].rsvp,'declined');
 assert(state[0].version>=2);
 console.log('PASS actual guest-rsvp v4 local Edge: person GET, unit GET with two members, two public submits persisted into guest_rsvp_submissions AND guest_app_state, duplicate idempotency. Fake data; no production/cloud.');
})().catch(e=>{console.error('LOCAL_REAL_RSVP_FAILED:',e.message);process.exitCode=1});
