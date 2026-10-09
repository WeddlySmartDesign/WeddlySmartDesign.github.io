#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {assertPinnedInvitationConfig:gate}=require('../tools/invitation_runtime_gate_v1.cjs');
const {validate}=require('../qa/validate_invitation_config_v1.cjs');
const cfg={
 schemaVersion:'guest-invitation-config-v1',
 template:{id:'botanica',version:'14.7',typographyVariant:'classic'},
 locale:'es',
 couple:{name1:'Eva',name2:'Nico'},
 wedding:{date:'2027-09-11',time:'17:00',coverPlace:''},
 cover:{showPlace:false,showTime:false,photo:null},
 countdown:{enabled:false},
 story:{enabled:true,textMode:'none',body:'',photo:{src:'upload:story',fit:'crop',focusX:50,focusY:50,autoFrame:true}},
 locations:{mode:'shared',heroPhoto:null,items:[{type:'shared',time:'17:00',name:'Lugar',address:'',mapsUrl:null,websiteUrl:null}],dressCode:{enabled:false,text:''}},
 agenda:{enabled:false,moments:[]},
 practical:{
  bus:{enabled:false,pickupPoints:[],outboundTimes:[],returnTimes:[],note:'',mapsUrl:null},
  accommodation:{enabled:false,mode:'none',externalBookingUrl:null,mapsUrl:null,websiteUrl:null},
  gift:{enabled:false,mode:'none',externalUrl:null},
  playlist:{enabled:false,mode:'none',url:null}
 },
 rsvp:{route:'#',ctaLabel:'Confirmar asistencia'},
 gallery:{enabled:false,photos:[]},
 closing:{line:'Gracias'}
};
const order={template_id:'botanica',template_version:'14.7'};
const files=[{slot:'story',path:'synthetic/story.webp',url:'https://example.test/signed-story'}];
assert.deepEqual(validate(cfg),[]);
assert.strictEqual(gate(cfg,order,validate,files),cfg,'valid stored config');
assert.throws(()=>gate(cfg,{...order,template_version:'14.8'},validate,files),/invitation_template_pin_mismatch/);
assert.throws(()=>gate(cfg,order,validate,[]),/missing_invitation_upload/);
assert.throws(()=>gate(cfg,order,validate,files,'hydrated'),/missing_signed_asset/);
const x=structuredClone(cfg);
x.story.photo.src='https://example.test/signed-story';
assert.strictEqual(gate(x,order,validate,files,'hydrated'),x,'hydrated signed photo');
x.story.photo.src='';
assert.throws(()=>gate(x,order,validate,files,'hydrated'),/invalid_invitation_config/);
x.story.photo.src='javascript:alert(1)';
assert.throws(()=>gate(x,order,validate,files,'stored'),/invalid_invitation_media/);
x.story.photo.src='https://example.test/signed-story';
x.story.textMode='none';x.story.photo=null;
assert.throws(()=>gate(x,order,validate,files),/invalid_invitation_config/);
assert.throws(()=>gate({...cfg,template:{...cfg.template,id:'veil-light'}},order,validate,files),/invitation_template_pin_mismatch/);
const v={...cfg,story:{...cfg.story,enabled:false,photo:null}};
assert.strictEqual(gate(v,order,validate,files),v,'disabled optional story');
assert.throws(()=>gate({},order,validate,files),/invitation_template_pin_mismatch/);
const malicious=structuredClone(cfg);malicious.rsvp.route='https://attacker.example/rsvp';
assert.throws(()=>gate(malicious,order,validate,files),/invalid_invitation_rsvp_route/,'recipient URL cannot be stored by owner');
console.log('PASS strict GUEST lifecycle gate: template pin, schema, raw/signed media, disabled modules and mutation rejection. OFFLINE.');
