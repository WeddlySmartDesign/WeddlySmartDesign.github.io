#!/usr/bin/env node
'use strict';
// One disposable Supabase instance, actual generated V13 and actual guest-rsvp v4.
// Synthetic weddings, licenses, members and responses only; NOTHING touches cloud.
// Not proof of public HTTPS, photo downloads, mobile rendering, mail or checkout.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm'),path=require('node:path');
const env=Object.fromEntries(fs.readFileSync(process.argv[2]||'','utf8').split(/\r?\n/).map(l=>{const i=l.indexOf('=');return i>0?[l.slice(0,i),l.slice(i+1).trim().replace(/^["']|["']$/g,'')]:[]}).filter(x=>x.length===2));
const api=new URL(env.GUEST_LOCAL_API_URL||'');
if(api.protocol!=='http:'||!['127.0.0.1','localhost'].includes(api.hostname)||api.port!=='54321')throw Error('LOCAL_ONLY_SAFETY_BOUNDARY');
const service=env.GUEST_LOCAL_SERVICE_ROLE_KEY,anon=env.GUEST_LOCAL_ANON_KEY;
if(!service||!anon)throw Error('MISSING_DISPOSABLE_LOCAL_KEYS');
const origin=api.origin,hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const site='https://guest-ci-local.invalid',bridgeFile=path.resolve(__dirname,'../../guests-catalog-invitation-bridge-v1.js'),runtimeFile=path.resolve(__dirname,'../../guest-catalog-delivery-runtime-v1.js');
const weddingIds=['33333333-4444-4555-8666-777777777777','33333333-4444-4555-8666-888888888888'];
const licenseIds=['aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaaa','bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbbb'];
const cases=[{id:'A',guest:'synthetic-a-g',unit:'synthetic-a-u',language:'es'},{id:'B',guest:'synthetic-b-g',unit:'synthetic-b-u',language:'en'}];
async function rest(table,{method='GET',query='',data}={}){
 const res=await fetch(origin+'/rest/v1/'+table+query,{method,redirect:'error',headers:{apikey:service,Authorization:'Bearer '+service,'content-type':'application/json',Prefer:'return=representation'},body:data===undefined?undefined:JSON.stringify(data)});
 const j=await res.json().catch(()=>({}));
 if(!res.ok)throw Error('LOCAL_REST_'+table+'_'+res.status+'_'+String(j.code||j.message||'unknown').slice(0,90));
 return j;
}
async function edge(pathPart,{method='GET',qs='',body,member}={}){
 const u=origin+'/functions/v1/'+pathPart+(qs?'?'+qs:'');
 const res=await fetch(u,{method,redirect:'error',headers:{apikey:anon,Authorization:'Bearer '+anon,'content-type':'application/json',...(member?{'x-weddly-token':member}:{})},body:body===undefined?undefined:JSON.stringify(body)});
 const j=await res.json().catch(()=>({}));
 return {status:res.status,data:j};
}
function localBrowser(member,publicLink=''){
 const page={window:{},URL,structuredClone,AbortController,setTimeout,clearTimeout,Date,
   location:new URL(publicLink||site+'/guest/guests-rsvp-operations-live.html'),
   localStorage:{getItem:k=>k==='weddly_shared_wedding_token'?member:''},
   fetch:async(u,opts)=>{const v=new URL(u);assert.equal(v.origin,'https://dnjsxequwgtyyauuofxj.supabase.co','expected only official GUEST endpoint in unmodified browser code');
     assert.equal(v.pathname,'/functions/v1/guest-invitation-flow');
     return fetch(origin+v.pathname,{...opts,headers:{...opts.headers,apikey:anon,Authorization:'Bearer '+anon},redirect:'error'});}
 };
 page.window=page;return page;
}
async function main(){
 const rows=await rest('guest_invitation_orders',{query:'?select=id,mode,template_id,template_version,status,delivery_url,license_id&status=eq.delivered&template_id=eq.botanica&mode=eq.test&order=created_at.asc'});
 assert.equal(rows.length,2,'reuse the TWO real V13 synthetic Botánica orders already created');
 for(let i=0;i<2;i++){
   const c=cases[i],order=rows[i],wid=weddingIds[i],lid=licenseIds[i];
   assert.equal(order.license_id,null);
   assert.equal(order.template_version,'14.7');
   assert.equal(new URL(order.delivery_url).origin,site);
   c.member='synthetic-member-'+c.id+'-'+'x'.repeat(56);
   c.rsvpToken='synthetic-linked-rsvp-'+c.id+'-'+ 'z'.repeat(24);
   await rest('licenses',{method:'POST',data:{id:lid,source:'manual',status:'active',wedding_id:wid,metadata:{local_only:true}}});
   await rest('wedding_members',{method:'POST',data:{wedding_id:wid,license_id:lid,member_hash:hash(c.member),status:'active'}});
   const changed=await rest('guest_invitation_orders',{method:'PATCH',query:'?id=eq.'+order.id,data:{license_id:lid}});
   assert.equal(changed.length,1);
   await rest('guest_app_state',{method:'POST',data:{wedding_id:wid,version:0,state:{guests:{
       [c.guest]:{name:'Synthetic '+c.id+' One',invitationUnitId:c.unit,invitationUnitLabel:'Fictitious Household '+c.id},
       [c.guest+'-2']:{name:'Synthetic '+c.id+' Two',invitationUnitId:c.unit,invitationUnitLabel:'Fictitious Household '+c.id}
   }}}});
   const forms=await rest('guest_rsvp_forms',{method:'POST',data:{wedding_id:wid,status:'active',public_token_hash:hash(c.rsvpToken),manage_token_hash:hash('manage-'+c.rsvpToken),public_token:c.rsvpToken,config:{qa:true,questions:{meal:false,allergy:false,transport:false}}}});
   assert.equal(forms.length,1);c.formId=forms[0].id;
   // No member must never discover a couple's delivered order.
   const forbidden=await edge('guest-invitation-flow',{method:'POST',body:{action:'active_for_member'}});
   assert.equal(forbidden.status,403);
   const p=localBrowser(c.member);vm.createContext(p);
   vm.runInContext(fs.readFileSync(bridgeFile,'utf8'),p,{timeout:2500});
   const a=await p.__GuestCatalogBridge.fetchActive();
   assert.equal(a.orderId,order.id,'member must resolve only its own licensed order');
   assert.equal(a.templateId,'botanica');
   assert.equal(a.templateVersion,'14.7');
   assert.equal(a.shareBaseUrl,order.delivery_url);
   c.publicToken=a.publicToken;
   const isFamily=i===1;
   const url=await p.__GuestCatalogBridge.buildRecipientUrl({
     recipientId:c.guest,rsvpToken:c.rsvpToken,lang:c.language,name:'Synthetic '+c.id,
     unitId:isFamily?c.unit:'',unitSize:isFamily?2:1
   });
   const shared=new URL(url);
   assert.equal(shared.origin,site);assert.equal(shared.pathname,'/invitation/'+order.id);
   assert.equal(shared.searchParams.get('rt'),c.rsvpToken);
   assert.equal(shared.searchParams.get('lang'),c.language);
   assert.equal(shared.searchParams.get(isFamily?'u':'g'),isFamily?c.unit:c.guest);
   assert.equal(shared.searchParams.get(isFamily?'g':'u'),null);
   // Delivered runtime public_load is the REAL generated V13 function, not a mock.
   const delivery=localBrowser('',url);delivery.document={getElementById:()=>null,createElement:()=>({hidden:true,dataset:{}}),body:{appendChild:()=>{}}};
   vm.createContext(delivery);vm.runInContext(fs.readFileSync(runtimeFile,'utf8'),delivery,{timeout:2500});
   let applied=null;
   const loaded=await delivery.__GuestCatalogDeliveryRuntime.boot({publicToken:c.publicToken,applyConfig:v=>{applied=v}});
   assert.equal(loaded.order.id,order.id);
   assert.equal(applied.template.id,'botanica');
   const rsvpLink=new URL(applied.rsvp.route);
   assert.equal(rsvpLink.origin,site);
   assert.equal(rsvpLink.pathname,'/guest/guests-rsvp-v105.html');
   assert.equal(rsvpLink.searchParams.get('t'),c.rsvpToken);
   assert.equal(rsvpLink.searchParams.get(isFamily?'u':'g'),isFamily?c.unit:c.guest);
   // A real GET to the real guest-rsvp v4, driven exclusively by invitation CTA.
   const q=new URLSearchParams({token:rsvpLink.searchParams.get('t')});
   q.set(isFamily?'unit':'guest',rsvpLink.searchParams.get(isFamily?'u':'g'));
   const resolved=await edge('guest-rsvp',{qs:q.toString()});
   assert.equal(resolved.status,200,JSON.stringify(resolved.data));
   assert.equal(resolved.data.ok,true);
   if(isFamily){assert.equal(resolved.data.unit.id,c.unit);assert.equal(resolved.data.unit.members.length,2);}
   else assert.equal(resolved.data.guest.id,c.guest);
   const post=await edge('guest-rsvp',{method:'POST',body:{action:'submit',token:c.rsvpToken,guest_key:c.guest,name:'Synthetic '+c.id+' One',attend:i===0,client_submission_id:'linked-synthetic-submit-'+c.id}});
   assert.equal(post.status,201,JSON.stringify(post.data));
   assert.equal(post.data.ok,true);
   const stored=await rest('guest_rsvp_submissions',{query:'?select=form_id,guest_key,attend&form_id=eq.'+c.formId});
   assert.equal(stored.length,1);assert.equal(stored[0].guest_key,c.guest);assert.equal(stored[0].attend,i===0);
   const state=await rest('guest_app_state',{query:'?select=version,state&wedding_id=eq.'+wid});
   assert.equal(state.length,1);assert(state[0].version>=1);
   assert.equal(state[0].state.guests[c.guest].rsvp,i===0?'confirmed':'declined');
   // Couple's management read must see the response under their own license.
   const managed=await edge('guest-rsvp',{qs:'manage=1',member:c.member});
   assert.equal(managed.status,200,JSON.stringify(managed.data));
   assert(managed.data.forms.some(f=>f.id===c.formId));
   assert(managed.data.submissions.some(x=>x.form_id===c.formId&&x.guest_key===c.guest));
   assert(managed.data.forms.every(f=>f.id===c.formId),'cross-wedding forms must be inaccessible');
   c.orderId=order.id;
 }
 assert.notEqual(cases[0].orderId,cases[1].orderId);
 // Cross-tenant token/identity cannot disclose the OTHER wedding's guest or unit.
 const otherG=await edge('guest-rsvp',{qs:new URLSearchParams({token:cases[0].rsvpToken,guest:cases[1].guest}).toString()});
 assert.equal(otherG.status,404,'foreign person must remain isolated');
 const otherU=await edge('guest-rsvp',{qs:new URLSearchParams({token:cases[0].rsvpToken,unit:cases[1].unit}).toString()});
 assert.equal(otherU.status,404,'foreign invitation unit must remain isolated');
 const badMember=await edge('guest-invitation-flow',{method:'POST',member:'synthetic-invalid-'+ 'z'.repeat(55),body:{action:'active_for_member'}});
 assert.equal(badMember.status,403,'unlicensed member must not resolve invitation');
 console.log('PASS V13 + GUEST catalog bridge + final delivery runtime + ACTUAL RSVP v4 GET/POST + guest_app_state + licensed management, TWO distinct synthetic weddings with tenant isolation. ALL .invalid delivery pages are FAKE; no external HTTPS link, no actual Android, no production.');
}
main().catch(e=>{console.error('LOCAL_V13_GUEST_HANDOFF_FAILED:',e.stack||e);process.exitCode=1});
