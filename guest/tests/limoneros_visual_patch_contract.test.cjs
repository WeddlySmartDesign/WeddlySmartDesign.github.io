#!/usr/bin/env node
'use strict';
/* Contract QA: optional D03 corrections may never mutate author's source master,
   touch another template, invent questionnaire fields, or unlock commercial sale. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const dir=path.join(root,'guest/catalog-patches/design-03/1.0.0');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'patch-manifest.json'),'utf8'));
const css=fs.readFileSync(path.join(dir,'patch.css'),'utf8');
const js=fs.readFileSync(path.join(dir,'patch.js'),'utf8');
const schema=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json'),'utf8'));
const status=JSON.parse(fs.readFileSync(path.join(root,'guest/GUEST_PROJECT_STATUS_V1.json'),'utf8'));
const actual=status.designs['design-03'];
assert.equal(manifest.schemaVersion,'guest-visual-stage-patch-v1');
assert.equal(manifest.templateId,'design-03');
assert.equal(manifest.templateVersion,actual.version);
assert.equal(manifest.sourceMasterSha256,actual.candidateSha256||actual.visualMasterSha256);
assert.equal(manifest.commercialRelease,false);
assert.equal(actual.status,'certification-pending');
assert.equal(actual.commercialReady||false,false);
assert.ok(css.includes('.entry-button')&&css.includes('.rsvp-button')&&css.includes('.link'));
assert.ok(css.includes('limonerosClosingIntro'),'Closing bird ribbon must not overlap dynamic text');
assert.ok(!css.includes('background-image:'),'Authors background images must remain controlled by immutable master');
new vm.Script(js,{filename:'guest/catalog-patches/design-03/1.0.0/patch.js'});
assert.ok(js.includes('window.GUEST_APPLY_CONFIG=function(config)'));
const sections=schema.properties.practical.properties;
for(const key of ['bus','accommodation','gift','playlist']) assert.ok(sections[key]);
for(const key of ['pickupPoints','outboundTimes','returnTimes','note','mapsUrl']) assert.ok(js.includes(key)&&schema.$defs.bus.properties[key],key);
for(const key of ['mode','name','address','websiteUrl','externalBookingUrl','bookingCode','bookingName','deadline','discountText','phone','priceText']) assert.ok(js.includes(key)&&schema.$defs.accommodation.properties[key],key);
for(const key of ['displayText','details','iban','bicSwift','bizumPhone','bizumRecipient','externalUrl']) assert.ok(js.includes(key)&&schema.$defs.gift.properties[key],key);
for(const key of ['prompt','url','mode']) assert.ok(schema.$defs.playlist.properties[key],key);
const builder=fs.readFileSync(path.join(root,'guest/tools/build_catalog_static_preview.cjs'),'utf8');
assert.ok(builder.includes('applyOptionalVisualPatch(stage.html,name,t.version,expected)'));
assert.ok(builder.includes('meta.sourceMasterSha256!==sourceSha'));
console.log('PASS D03 author media untouched, premium CTA, closing animation, schema mapping, TEST-only SHA-pinned stage patch');
