#!/usr/bin/env node
'use strict';
/* Generic owner stage dispatcher contract. No deployment, fake DOM only.
 * Do not confuse this QA with the real Mobile Center or Android E2E.
 */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.resolve(__dirname,'../catalog/guest-owner-stage-overlay-v2.js'),'utf8');
const calls=[],previewCalls=[];
const registry={templates:{
 'veil-light':{id:'veil-light',version:'5.3.3',mode:'native',status:'commercially-frozen',applyApi:'VEIL_APPLY_CONFIG'},
 botanica:{id:'botanica',version:'14.7',mode:'iframe',status:'certification-pending',applyApi:'BOTANICA_APPLY_CONFIG',src:'/guest/catalog-assets/botanica/14.7/index.html'},
 'design-03':{id:'design-03',version:'1.0.0',mode:'iframe',status:'certification-pending',applyApi:'GUEST_APPLY_CONFIG',src:'/guest/catalog-assets/design-03/1.0.0/index.html'},
 'design-1000':{id:'design-1000',version:'10.0.0',mode:'iframe',status:'commercially-frozen',applyApi:'GUEST_APPLY_CONFIG',src:'/guest/catalog-assets/design-1000/10.0.0/index.html'}
}};
const host={children:[],replaceChildren(...nodes){this.children=nodes},appendChild(n){this.children.push(n)}};
const back={addEventListener(name,fn){if(name==='click')this.activate=fn}};
const layer={id:'',style:{},innerHTML:'',querySelector(selector){if(selector==='#guestOwnerStagedHost')return host;if(selector==='#guestOwnerStagedBack')return back;throw Error('unknown selector '+selector)}};
const document={body:{appendChild(){}},createElement(tag){if(tag==='section')return layer;if(tag==='p')return {style:{},textContent:''};throw Error('unexpected DOM creation '+tag)}};
const window={GUEST_STAGE_OWNER_REGISTRY:registry,GUEST_CATALOG_OWNER_VIEWER_V2:{
 show({order,config,host,registry}){previewCalls.push({order,config,host,registry});return Promise.resolve({close(){calls.push('iframe-close')}})}
 },VEIL_APPLY_CONFIG(config){calls.push({api:'veil',config});return 'legacy-native'}};
vm.runInNewContext(source,{window,document,structuredClone},{timeout:2000});
const o=window.GUEST_STAGE_OWNER;
const veil={template_id:'veil-light',template_version:'5.3.3',mode:'production'};
const bot={template_id:'botanica',template_version:'14.7',mode:'test'};
const d03={template_id:'design-03',template_version:'1.0.0',mode:'test'};
const d1000={template_id:'design-1000',template_version:'10.0.0',mode:'production'};
const cfg=(id,version)=>({template:{id,version},couple:{name1:'Ana',name2:'Luis'}});
async function main(){
 assert.equal(o.applyOrderConfig(veil,cfg('veil-light','5.3.3')),'legacy-native');
 assert.equal(calls[0].api,'veil');
 assert.throws(()=>o.rendererFor({mode:'test',template_version:'5.3.3'}),/order_template_id_missing/);
 assert.throws(()=>o.rendererFor({template_id:'veil-light',mode:'test'}),/order_template_version_missing/);
 assert.throws(()=>o.rendererFor({...veil,template_version:'14.7'}),/template_version_mismatch/);
 assert.throws(()=>o.rendererFor({...bot,mode:'production'}),/test_only_template/);
 assert.throws(()=>o.rendererFor({...d03,template_id:'unknown'}),/template_renderer_unavailable/);
 assert.throws(()=>o.applyOrderConfig(veil,cfg('botanica','5.3.3')),/template_config_id_mismatch/);
 assert.throws(()=>o.applyOrderConfig(veil,cfg('veil-light','1.0.0')),/template_config_version_mismatch/);
 assert.throws(()=>o.applyOrderConfig(d03,{template:{id:'design-03'}}),/template_config_version_mismatch/);
 assert.equal(calls.length,1,'Invalid orders never invoke frozen renderer');
 await o.applyOrderConfig(bot,cfg('botanica','14.7'));
 await o.applyOrderConfig(d03,cfg('design-03','1.0.0'));
 await o.applyOrderConfig(d1000,cfg('design-1000','10.0.0'));
 assert.equal(previewCalls.length,3,'A certified future iframe must use the exact same host in production');
 assert.equal(previewCalls[1].order.template_id,'design-03');
 assert.equal(previewCalls[2].order.template_id,'design-1000');
 assert.equal(previewCalls[2].order.mode,'production');
 assert.throws(()=>o.rendererFor({...d1000,template_version:'9.0.0'}),/template_version_mismatch/);
 assert.throws(()=>o.applyOrderConfig({...bot,mode:'production'},cfg('botanica','14.7')),/test_only_template/);
 o.open();assert.equal(layer.style.display,'block');
 o.close();assert.equal(layer.style.display,'none');
 console.log('PASS common owner staging: VEIL native production, pending Botanica/D03 test-only, certified D1000 iframe production, version-pinned. NO DEPLOYMENT');
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
