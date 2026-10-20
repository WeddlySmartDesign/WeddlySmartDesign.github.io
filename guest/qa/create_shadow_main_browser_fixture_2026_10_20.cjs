#!/usr/bin/env node
'use strict';
// Synthesize public MAIN + exactly two GUEST draft diffs into a private runner directory.
// Never git-push, deploy, use tokens or write back to the checked-out project.
const cp=require('node:child_process'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.env.GUEST_SHADOW_ROOT;
if(!root||!path.isAbsolute(root)||!fs.existsSync(root))throw Error('Absolute existing GUEST_SHADOW_ROOT required');
function git(...args){return cp.execFileSync('git',args,{encoding:'utf8'}).trim()}
const current=git('rev-parse','origin/main');
assert.equal(current,'1e7c81515b71f16105b68a928bb908cba702bebf','public main changed: halt and refresh review');
const groups=[
 {ref:'origin/guest-management-main-bridge-draft-2026-10-20',sha:'62cd8c85a12ac1d20fb798209f4b30e49a7d08ee',allowed:p=>p.startsWith('guest/')},
 {ref:'origin/guest-individual-storefront-draft-2026-10-20',sha:'aa95138f8000689ce39c3e57e9cbf62628cd7067',allowed:p=>['guest.html','guest-checkout.html','guest-checkout-return.html','guest-order.html'].includes(p)}
];
let count=0;
for(const group of groups){
 assert.equal(git('rev-parse',group.ref),group.sha,'draft branch changed: halt');
 const paths=git('diff','--name-only','origin/main',group.ref).split('\n').filter(Boolean);
 assert.equal(paths.length,count===0?32:4,'draft file count changed');
 for(const name of paths){
  if(!group.allowed(name))throw Error('Unexpected path '+name);
  const dest=path.join(root,name);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,cp.execFileSync('git',['show',group.ref+':'+name],{maxBuffer:64*1024*1024}));
  count++;
 }
}
console.log(JSON.stringify({status:'PASS',stagedGuestOnly:count,base:current,host:'127.0.0.1 only',sale:'NO_GO'}));
