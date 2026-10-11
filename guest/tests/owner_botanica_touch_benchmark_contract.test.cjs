#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),html=fs.readFileSync(path.join(root,'guest/qa/owner-botanica-touch-benchmark.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(Boolean);
assert.equal(scripts.length,1);new vm.Script(scripts[0],{filename:'owner-touch-real-qa.js'});
for(const re of [
 /noindex,nofollow,noarchive/,/frame-src 'self'/,/guest-catalog-owner-viewer-v2\.js/,
 /action:'login',recoveryCode:code/,
 /action:'create_test',templateId:'botanica',email:MAIL/,
 /MAIL='qa-touch-botanica@example\.invalid'/,
 /action:'save',token:created\.qToken/,
 /action:'submit',token:created\.qToken/,
 /action:'start_design',orderId:order\.id/,
 /GUEST_CATALOG_OWNER_VIEWER_V2\.show/,
 /action:'mark_review_ready',orderId:id/,
 /action:'send_review',orderId:id/,
 /sent\.localTest!==true/,
 /d\.order\?\.status!=='review_sent'/,
 /Date\.now\(\)-lastActivity<60000/,
 /document\.visibilityState==='visible'/,
 /active<=300/,
 /'review_sent'\)\{show\('Esta medición ya terminó/,
 /load|prepare\.addEventListener\('click',prepare\)/
 ])assert.match(html,re);
assert.equal((html.match(/<input type="checkbox" name="reviewCheck"/g)||[]).length,5,'exactly five mandatory mobile review checks');
assert.match(html,/12\/06\/2027/,'must show expected date explicitly');
assert.match(html,/Historia ficticia para una medición de propietario\./,'must show expected story');
assert.match(html,/Lugar ficticio para medición/,'must show expected venue');
assert.match(html,/Confirma[r]? asistencia/,'must explain final CTA');
assert.match(html,/function updateReviewReady\(\)/,'must gate actual review send');
assert.match(html,/if\(!reviewChecks\.every\(c=>c\.checked\)\)/,'must reject unreviewed send at handler');
assert.match(html,/Si detectas un fallo, no envíes la revisión/,'must warn before timer starts');
assert.doesNotMatch(html,/(?:localStorage|sessionStorage|indexedDB|stripe-checkout|create_paid|link_test_license)/i);
assert.match(html,/No se ha confirmado el envío; no asumir éxito/);
assert.match(fs.readFileSync(path.join(root,'guest/tools/build_catalog_static_preview.cjs'),'utf8'),/owner-botanica-touch-benchmark\.html/);
console.log('PASS owner-timing QA contract: 1 synthetic Botánica TEST, authentic manager review send, real mobile shared viewer, active visible time only, no payment/email');
