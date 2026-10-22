#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),stage=process.env.GUEST_STAGE_DIR||root;
const sw=fs.readFileSync(path.join(root,'guest/guest-sw.js'),'utf8');
const core=JSON.parse(sw.match(/const CORE=(\[[\s\S]*?\]);/)?.[1]||'null');
assert.ok(Array.isArray(core)&&core.length>=40,'PWA cache missing complete current app runtime');
assert.equal(core.length,new Set(core).size,'duplicate PWA resources');
const index=fs.readFileSync(path.join(root,'guest/index.html'),'utf8');
const scripts=[...index.matchAll(/<script src="([^"?]+)/g)].map(x=>x[1]);
assert.ok(scripts.length>=25,'unexpected changed licensed app surface');
for(const name of scripts)assert.ok(core.includes(name),'PWA app script is not precached: '+name);
for(const name of ['index.html','access.html','guest-settings.html','guests-v114-integrated.html','guests-v081-visual-seating.html','guests-events-v3.html','guest.webmanifest']){
 assert.ok(core.includes(name),'missing offline essential: '+name);
}
for(const name of core){assert.match(name,/^[a-z0-9][a-z0-9.-]*$/i,'unsafe cache filename');assert.ok(fs.existsSync(path.join(stage,'guest',name)),'PWA cached path missing from published stage: '+name)}
assert.ok(!core.includes('guests-v116-production.html'),'retired frontend in PWA cache');
assert.ok(sw.includes('cleanRoutes.has(url.pathname)')&&sw.includes('cleanRoutes.get(url.pathname)'),'Cloudflare extensionless HTML routes must resolve to precached .html files offline');
assert.ok(sw.includes("cleanRoutes.set(ROOT.pathname,publicPath('index.html'))"),'offline canonical guest directory must point to authorized app shell');
assert.ok(sw.includes('cacheKey(u)')&&sw.includes('url.pathname'),'PWA cache must strip all token/query strings');
assert.ok(!sw.includes('cache.put(e.request'),'PWA must not key by private query');
assert.ok(sw.includes('url.origin===ROOT.origin')&&sw.includes('staticFile.test'),'cross-origin API must never enter service worker cache');
assert.ok(!sw.includes('catch(()=>caches.match(\'./index.html\'))'),'offline must not rewrite unrelated URLs to fake GUEST app');
console.log('PASS GUEST PWA contract: '+core.length+' exact precached current resources, '+scripts.length+' core scripts, no token storage, no old v116 shell.');
