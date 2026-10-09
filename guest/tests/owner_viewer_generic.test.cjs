#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../catalog/guest-catalog-owner-viewer-v2.js'),'utf8');
function makeEnv(){
 const timers=new Map();let nextTimer=0,behavior='load';
 const calls=[],host={replaceChildren(...nodes){for(const n of this.nodes||[])n.isConnected=false;this.nodes=nodes;for(const n of nodes)n.isConnected=true}};
 const env={calls,host,URL,AbortController,structuredClone,
  setTimeout(fn){const id=++nextTimer;timers.set(id,fn);return id},clearTimeout(id){timers.delete(id)},
  fireTimeout(){const [id,fn]=timers.entries().next().value||[];if(fn){timers.delete(id);fn()}},get pendingTimers(){return timers.size},setBehavior(v){behavior=v},
  location:{origin:'https://guest.example',href:'https://guest.example/owner.html'},
  document:{createElement(tag){assert.equal(tag,'iframe');const el={isConnected:false,style:{},attrs:{},listeners:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(t,cb){this.listeners[t]=cb},removeEventListener(t,cb){if(this.listeners[t]===cb)delete this.listeners[t]},remove(){this.isConnected=false}};
  Object.defineProperty(el,'src',{set(v){if(behavior==='navigationThrow')throw Error('bad_navigation');this.url=v;el.contentWindow=behavior==='crossOrigin'?new Proxy({},{get(){throw Error('SecurityError')}}):behavior==='missingAdapter'?{}:{GUEST_APPLY_CONFIG(c){if(behavior==='applyThrow')throw Error('application_failure');calls.push({api:'guest',config:c})},BOTANICA_APPLY_CONFIG(c){calls.push({api:'botanica',config:c})}};if(behavior==='error')queueMicrotask(()=>el.listeners.error?.());else if(behavior!=='hang')queueMicrotask(()=>el.listeners.load?.())}});return el}}};
 env.window={VEIL_APPLY_CONFIG(c){calls.push({api:'veil',config:c})},GUEST_APPLY_CONFIG(c){calls.push({api:'guest',config:c})}};
 vm.runInNewContext(source,env,{timeout:1000});return env;
}
const order=(id,version,mode='test')=>({template_id:id,template_version:version,mode});
const config=(id,version)=>({template:{id,version},couple:{name1:'Ana',name2:'Luis'}});
(async()=>{
 const e=makeEnv(),v=e.window.GUEST_CATALOG_OWNER_VIEWER_V2;
 const registry={templates:{'veil-light':{version:'5.3.3',mode:'native',status:'commercially-frozen',applyApi:'VEIL_APPLY_CONFIG'},'botanica':{version:'14.7',mode:'iframe',status:'certification-pending',src:'/guest/catalog-assets/botanica/14.7/index.html',applyApi:'BOTANICA_APPLY_CONFIG'},'design-03':{version:'1.0.0',mode:'iframe',status:'certification-pending',src:'/guest/catalog-assets/design-03/1.0.0/index.html',applyApi:'GUEST_APPLY_CONFIG'},'design-1000':{version:'10.0.0',mode:'iframe',status:'commercially-frozen',src:'/guest/catalog-assets/design-1000/10.0.0/index.html',applyApi:'GUEST_APPLY_CONFIG'}}};
 let r=await v.show({order:order('veil-light','5.3.3'),config:config('veil-light','5.3.3'),host:e.host,registry});
 assert.equal(r.mode,'native');assert.equal(e.calls[0].api,'veil');
 r=await v.show({order:order('botanica','14.7'),config:config('botanica','14.7'),host:e.host,registry});
 assert.equal(r.mode,'iframe');assert.equal(e.calls[1].api,'botanica');assert(e.host.nodes[0].url.includes('/botanica/14.7/'));
 r=await v.show({order:order('design-03','1.0.0'),config:config('design-03','1.0.0'),host:e.host,registry});
 assert.equal(r.mode,'iframe');assert.equal(e.calls[2].api,'guest');assert(e.host.nodes[0].url.includes('/design-03/1.0.0/'));
 r.close();assert.equal(e.host.nodes[0].isConnected,false);
 r=await v.show({order:order('design-1000','10.0.0','production'),config:config('design-1000','10.0.0'),host:e.host,registry});
 assert.equal(r.mode,'iframe');assert.equal(e.calls[3].api,'guest');assert(e.host.nodes[0].url.includes('/design-1000/10.0.0/'));
 r.close();assert.equal(e.host.nodes[0].isConnected,false);
 await assert.rejects(()=>v.show({order:order('design-03','9.9'),config:config('design-03','9.9'),host:e.host,registry}),/version_mismatch/);
 await assert.rejects(()=>v.show({order:order('design-unknown','1.0'),config:config('design-unknown','1.0'),host:e.host,registry}),/unknown_template/);
 await assert.rejects(()=>v.show({order:order('botanica','14.7'),config:config('botanica','14.7'),host:e.host,registry:{templates:{'botanica':{version:'14.7',mode:'iframe',status:'certification-pending',src:null}}}}),/visual_asset_not_ready/);
 await assert.rejects(()=>v.show({order:order('botanica','14.7'),config:config('botanica','14.7'),host:e.host,registry:{templates:{'botanica':{version:'14.7',mode:'iframe',status:'certification-pending',src:'https://another-origin.example/test.html'}}}}),/cross_origin_template/);
 await assert.rejects(()=>v.show({order:order('botanica','14.7'),config:config('veil-light','14.7'),host:e.host,registry}),/config_id_mismatch/);
 await assert.rejects(()=>v.show({order:{template_id:'veil-light',mode:'test'},config:config('veil-light','5.3.3'),host:e.host,registry}),/order_template_version_missing/);
 await assert.rejects(()=>v.show({order:{template_version:'5.3.3',mode:'test'},config:config('veil-light','5.3.3'),host:e.host,registry}),/order_template_id_missing/);
 await assert.rejects(()=>v.show({order:order('veil-light','5.3.3'),config:{template:{id:'veil-light'}},host:e.host,registry}),/config_version_mismatch/);
 await assert.rejects(()=>v.show({order:order('design-03','1.0.0'),config:{template:{id:'design-03',version:'0.8.0'}},host:e.host,registry}),/config_version_mismatch/);
 await assert.rejects(()=>v.show({order:order('botanica','14.7'),config:{couple:{name1:'Ana'}},host:e.host,registry}),/config_id_mismatch/);
 await assert.rejects(()=>v.show({order:order('botanica','14.7','production'),config:config('botanica','14.7'),host:e.host,registry}),/pending_template_not_authorized/);
 assert.equal(e.calls.length,4,'Failed requests must never be applied');
 // Unknown/slow iframe does not leave an endless blank preview on mobile.
 const slow=makeEnv();slow.setBehavior('hang');
 const pending=slow.window.GUEST_CATALOG_OWNER_VIEWER_V2.show({order:order('botanica','14.7'),config:config('botanica','14.7'),host:slow.host,registry});
 assert.equal(slow.pendingTimers,1);slow.fireTimeout();
 await assert.rejects(()=>pending,/iframe_load_timeout/);
 assert.equal(slow.pendingTimers,0);assert.equal(slow.host.nodes[0].isConnected,false);
 // Returning to GUEST aborts pending loads, immediately removing the inactive iframe.
 const abortedEnv=makeEnv();abortedEnv.setBehavior('hang');const ctl=new AbortController();
 const aborted=abortedEnv.window.GUEST_CATALOG_OWNER_VIEWER_V2.show({order:order('botanica','14.7'),config:config('botanica','14.7'),host:abortedEnv.host,registry,signal:ctl.signal});
 ctl.abort();await assert.rejects(()=>aborted,/preview_cancelled/);
 assert.equal(abortedEnv.pendingTimers,0);assert.equal(abortedEnv.host.nodes[0].isConnected,false);
 // A denied load, blocked navigation, missing adapter or broken apply also removes the iframe.
 for(const [behavior,error] of [['error','iframe_load_failed'],['navigationThrow','iframe_navigation_failed'],['missingAdapter','iframe_adapter_missing'],['crossOrigin','iframe_cross_origin'],['applyThrow','iframe_apply_failed']]){
  const env=makeEnv();env.setBehavior(behavior);
  await assert.rejects(()=>env.window.GUEST_CATALOG_OWNER_VIEWER_V2.show({order:order('design-03','1.0.0'),config:config('design-03','1.0.0'),host:env.host,registry}),new RegExp(error),behavior);
  assert.equal(env.host.nodes[0].isConnected,false,behavior+' must not leave broken iframe');assert.equal(env.pendingTimers,0);
 }
 const already=new AbortController();already.abort();const noCreate=makeEnv();
 await assert.rejects(()=>noCreate.window.GUEST_CATALOG_OWNER_VIEWER_V2.show({order:order('botanica','14.7'),config:config('botanica','14.7'),host:noCreate.host,registry,signal:already.signal}),/preview_cancelled/);
 assert.equal(noCreate.host.nodes,undefined,'pre-aborted preview must not change host');
 console.log('PASS generic owner: VEIL/pending/certified designs plus bounded iframe timeout, cancellation, load/adapter/apply failures and cleanup');
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});