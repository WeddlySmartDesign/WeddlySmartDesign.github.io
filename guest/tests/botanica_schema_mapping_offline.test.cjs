#!/usr/bin/env node
'use strict';
// Run: node botanica_schema_mapping_offline.test.cjs <candidate.html>
// Executes ONLY the isolated pure questionnaire mapping, never the browser, media, remote backend or RSVP.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const htmlPath=process.argv[2];
if(!htmlPath){console.error('Usage: node botanica_schema_mapping_offline.test.cjs <candidate.html>');process.exit(2)}
const html=fs.readFileSync(htmlPath,'utf8');
const start=html.indexOf('const STORY_PRESET_COPY={');
const end=html.indexOf('window.BOTANICA_APPLY_CONFIG=',start);
assert(start!==-1&&end>start,'Cannot locate canonical questionnaire mapper');
const ctx={DEFAULT:{copy:{}},structuredClone};
vm.createContext(ctx);
vm.runInContext(html.slice(start,end)+'\nthis.map=fromQuestionnaire;',ctx,{timeout:3000});
const base={template:{id:'botanica',version:'14.5'},couple:{name1:'Lucía',name2:'Mateo'},wedding:{date:'2027-09-18',coverPlace:'Murcia',time:'17:00'},cover:{showPlace:true,showTime:false,photo:null},countdown:{enabled:true},story:{enabled:true,textMode:'preset',presetId:'story-03',body:'',photo:{src:'https://fixtures.example.test/story.webp',fit:'crop',focusX:50,focusY:50}},locations:{mode:'shared',items:[{type:'shared',time:'17:00',name:'Palacio Test',address:'Calle Ejemplo',mapsUrl:'https://maps.example.test/a',websiteUrl:'https://venue.example.test'}],dressCode:{enabled:true,text:'Formal'}},agenda:{enabled:true,moments:[{time:'17:00',label:'Ceremonia'}]},practical:{bus:{enabled:true,pickupPoints:['Plaza'],outboundTimes:['16:30'],returnTimes:['02:30']},accommodation:{enabled:true,mode:'recommended',name:'Hotel'},gift:{enabled:true,mode:'bank',details:'Titular: Ejemplo\nIBAN: ES00 TEST'},playlist:{enabled:true,mode:'external_link',url:'https://music.example.test'}},rsvp:{route:'https://rsvp.example.test/guest?t=TEST',ctaLabel:'Confirmar'},gallery:{enabled:true,photos:[{src:'https://fixtures.example.test/gallery.webp'}]},closing:{line:'Gracias por acompañarnos.'}};
const scenario=(patch)=>{const v=structuredClone(base);patch(v);return ctx.map(v)};
let passed=0;
function check(name,fun){fun();passed++;console.log('PASS '+name)}
check('backend output lacking schemaVersion is canonical',()=>{const r=scenario(()=>{});assert.equal(r.schemaResolved,true);assert.equal(r.couple.first,'Lucía');});
check('preset story without body uses canonical approved preset',()=>{const r=scenario(()=>{});assert.equal(r.storyEnabled,true);assert.match(r.copy.story,/Entre planes improvisados/);});
check('photo-only story with none text stays visible',()=>{const r=scenario(c=>{c.story.textMode='none';c.story.body=''});assert.equal(r.storyEnabled,true);assert.equal(r.copy.story,'');assert.equal(r.storyPhoto,base.story.photo.src);});
check('empty story with no photo hidden',()=>{const r=scenario(c=>{c.story.photo=null;c.story.textMode='none'});assert.equal(r.storyEnabled,false);});
check('disabled story hidden even if photo present',()=>{const r=scenario(c=>{c.story.enabled=false});assert.equal(r.storyEnabled,false);});
check('cover photo used as story photo when no story photo',()=>{const r=scenario(c=>{c.story.photo=null;c.story.textMode='none';c.cover.photo={src:'https://fixtures.example.test/cover.webp'}});assert.equal(r.storyEnabled,true);assert.equal(r.storyPhoto,'https://fixtures.example.test/cover.webp');});
check('shared venue and dress code fully mapped',()=>{const r=scenario(()=>{});assert.equal(r.venues.length,1);assert.equal(r.venues[0].websiteUrl,'https://venue.example.test');assert.equal(r.dressCode.text,'Formal');});
check('split venues, max agenda and no gallery respected',()=>{const r=scenario(c=>{c.locations.items=[{type:'ceremony',time:'16:30',name:'Iglesia',address:'Calle A'},{type:'celebration',time:'19:00',name:'Finca',address:'Calle B'}];c.agenda.moments=[1,2,3,4,5].map(x=>({time:`${x+16}:00`,label:'Momento '+x}));c.gallery.enabled=false;});assert.equal(r.venues.length,2);assert.equal(r.agenda.length,5);assert.equal(r.gallery.length,0);});
check('bus, hotel, gift and playlist data preserved',()=>{const r=scenario(()=>{});assert.equal(r.practical.gift.details,'Titular: Ejemplo\nIBAN: ES00 TEST');assert.equal(r.practical.playlist.url,'https://music.example.test');assert.equal(r.practical.bus.returnTimes[0],'02:30');});
check('RSVP route and closing kept as source data',()=>{const r=scenario(()=>{});assert.equal(r.rsvpUrl,base.rsvp.route);assert.equal(r.closingLine,'Gracias por acompañarnos.');});
check('disabled gallery, agenda and practical stay conditional',()=>{const r=scenario(c=>{c.agenda.enabled=false;c.gallery.enabled=false;for(const key of Object.keys(c.practical))c.practical[key].enabled=false});assert.equal(r.agenda.length,0);assert.equal(r.gallery.length,0);assert(Object.values(r.practical).every(m=>m.enabled===false));});
console.log('RESULT '+passed+'/'+passed+' isolated canonical mapping scenarios PASS (NOT real-order/visual E2E)');