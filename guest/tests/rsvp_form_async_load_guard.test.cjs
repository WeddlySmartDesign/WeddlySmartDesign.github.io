#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../guests-rsvp-form-flex.html'),'utf8');
const ids=['mealQ','allergyQ','transportQ','accommodationQ','childrenQ','plusQ','addQuestion','save'];
for (const id of ids) {
 const tag=html.match(new RegExp('<(?:input|button)\\b[^>]*\\bid="'+id+'"[^>]*>', 'i'))?.[0];
 assert.ok(tag && /\bdisabled\b/.test(tag), 'must not expose edit control before config loads: '+id);
}
const loadAt=html.indexOf('async function load()'),saveAt=html.indexOf('async function save()');
assert.ok(loadAt>=0&&saveAt>loadAt,'async load must precede save');
const load=html.slice(loadAt,saveAt);
assert.ok(load.indexOf("cfg=f.config||{}")>=0,'remote config must be loaded');
assert.ok(load.indexOf("renderCustom();drawSummary();")>=0,'editor should hydrate before unlock');
const unlock="['mealQ','allergyQ','transportQ','accommodationQ','childrenQ','plusQ','addQuestion','save'].forEach(id=>{$(id).disabled=false})";
assert.ok(load.includes(unlock),'all editing controls must unlock only after async hydration');
assert.ok(load.indexOf(unlock)>load.indexOf("cfg=f.config||{}"),'unlock must follow remote load');
// Saving may re-enable its own button in finally; that is permitted only after boot unlocked it.
assert.ok(html.includes("children:$('childrenQ').checked"),'children opt-in must be persisted from hydrated UI');
assert.ok(html.includes("accommodationOffered:$('accommodationQ').checked"),'accommodation persisted');
console.log('PASS: RSVP form gates all edits until async remote hydration and keeps opt-in serialization. Offline contract; B6 browser QA must also PASS.');
