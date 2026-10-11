#!/usr/bin/env node
'use strict';
// Regression harness for the actual V4.7 renderer engine from its pinned builder.
// Simulates only WebView DOM hooks. Not an Android physical or live Cloud test.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const src=fs.readFileSync(path.join(__dirname,'../tools/build_mobile_center_v47_from_library.py'),'utf8');
const engineTag=src.match(/ENGINE = r'''(<script id="guest-v47-renderer-engine">[\s\S]*?<\/script>)\s*'''/);
assert(engineTag,'real builder must expose its exact renderer engine');
const script=engineTag[1].replace(/^<script[^>]*>/,'').replace(/<\/script>$/,'');
new vm.Script(script);
const pin='fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a';
let received=[],frames=[],returnClicks=0;
function node(tag='div'){
 const o={tagName:tag.toUpperCase(),isConnected:true,style:{},children:[],listeners:{},append(...n){this.children.push(...n)},
 replaceChildren(...n){this.children=n},addEventListener(k,f){this.listeners[k]=f},
 remove(){this.isConnected=false},setAttribute(){},
 querySelector(sel){if(sel==='#guest-v47-content')return host;if(sel==='#guest-v47-back')return back;return null}};
 Object.defineProperty(o,'innerHTML',{get(){return this.html||''},set(v){this.html=v}});
 return o;
}
const host=node(),back=node('button'),panel=node('section');
const synthetic=Buffer.from('<!doctype html><script>window.BOTANICA_APPLY_CONFIG=()=>true;</script>').toString('base64');
const doc={
 getElementById(id){if(id==='guest-v47-botanica-master')return {dataset:{sha256:pin},textContent:synthetic};
  if(id==='wsdProdBtn')return {click(){returnClicks++;context.window.GUEST_CENTER_V47.close()}};
  return null;},
 createElement(tag){const o=tag==='section'?panel:node(tag);
  if(tag==='iframe'){frames.push(o);o.contentWindow={BOTANICA_APPLY_CONFIG(c){received.push(c)}};}
  return o;},body:{append(){}}
};
const context={window:{},document:doc,TextDecoder,Uint8Array,atob,structuredClone,Error};
vm.createContext(context);vm.runInContext(script,context,{timeout:2500});
const app=context.window.GUEST_CENTER_V47,valid={template_id:'botanica',template_version:'14.7',mode:'test'};
const shared={template:{id:'botanica',version:'14.7'},couple:{name1:'QA Una sede'},locations:{mode:'shared'}};
for(const wrong of [{...valid,mode:'production'},{...valid,template_id:'veil-light'},{...valid,template_version:'14.6'}])
 assert.throws(()=>app.apply(wrong,shared));
assert.throws(()=>app.apply(valid,{...shared,template:{id:'botanica',version:'14.6'}}));
app.apply(valid,shared);
const first=frames[0];assert(app.active());assert.match(first.srcdoc,/BOTANICA_APPLY_CONFIG/);
app.show();assert.equal(panel.style.display,'block');
const split={...shared,couple:{name1:'QA Dos sedes'},locations:{mode:'split'}};
app.apply(valid,split);
const second=frames[1];assert.equal(first.isConnected,false,'old iframe removed');
first.listeners.load();assert.equal(received.length,0,'stale previous load rejected');
second.listeners.load();assert.equal(received.length,1);assert.equal(received[0].couple.name1,'QA Dos sedes');
assert.equal(second.style.visibility,'visible');
received[0].couple.name1='EDITED_IN_IFRAME';
assert.equal(split.couple.name1,'QA Dos sedes','renderer receives clone, not source');
back.listeners.click();assert.equal(returnClicks,1);assert.equal(app.active(),false);assert.equal(second.isConnected,false);
app.apply(valid,shared);frames[2].listeners.load();
assert.equal(received[1].couple.name1,'QA Una sede');app.close();assert.equal(app.active(),false);
console.log('PASS V4.7 pinned builder JS: two distinct Botánica TEST orders, stale load, return and reopen, config clone, production/version guards (DOM simulated; Android still pending)');
