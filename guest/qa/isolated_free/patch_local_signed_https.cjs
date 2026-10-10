#!/usr/bin/env node
'use strict';
/* CI ONLY. Simulate HTTPS host for otherwise-valid local signed Storage URLs.
 * This allows validation of invitation lifecycle without weakening candidate
 * V13's requirement that real media URLs use HTTPS. NEVER deploy output. */
const fs=require('node:fs'),path=require('node:path');
if(process.env.GITHUB_ACTIONS!=='true'||process.env.SUPABASE_ACCESS_TOKEN||process.env.SUPABASE_PROJECT_ID)throw Error('not_disposable_github_runner');
const [src,dst]=process.argv.slice(2);
if(!src||!dst||path.resolve(src)===path.resolve(dst)||fs.existsSync(dst))throw Error('expected_distinct_new_candidate_file');
let s=fs.readFileSync(src,'utf8');
const anchor="url=data?.signedUrl||''";
if(s.split(anchor).length!==2)throw Error('source_drift_ci_only_media');
const replacement=`url=data?.signedUrl||'';if(url){let u;try{u=new URL(url)}catch{throw new Error('ci_signed_url_invalid')}if(u.protocol==='http:'&&(['127.0.0.1','localhost'].includes(u.hostname))&&u.port==='54321'){url='https://guest-ci-signed.invalid'+u.pathname+u.search}else if(u.protocol!=='https:')throw new Error('ci_signed_url_outside_loopback')}`;
s=s.replace(anchor,replacement);
if(!s.includes("if(!inviteUrl)return json({ok:false,error:'missing_invitation_url'},400);"))throw Error('missing_production_url_rule');
if(!s.includes("finalUrl.protocol!=='https:'"))throw Error('missing_production_https_rule');
fs.mkdirSync(path.dirname(dst),{recursive:true});
fs.writeFileSync(dst,s,{flag:'wx'});
console.log('PASS isolated local-only URL protocol simulation prepared; pristine V13 remains separate; NO PRODUCTION SOURCE CHANGED.');
