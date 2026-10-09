#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {validate}=require('../qa/validate_invitation_config_v1.cjs');
const valid={
 schemaVersion:'guest-invitation-config-v1',
 template:{id:'botanica',version:'14.7',typographyVariant:'classic'},
 locale:'es',
 couple:{name1:'Eva',name2:'Nico'},
 wedding:{date:'2027-09-11',time:'17:00',coverPlace:'Lorca'},
 cover:{showPlace:true,showTime:false,photo:null},
 countdown:{enabled:false},
 story:{enabled:false,textMode:'none',body:'',photo:null,presetId:null},
 locations:{mode:'shared',items:[{type:'shared',time:'17:00',name:'Lugar de la boda',address:'Calle de prueba 1',mapsUrl:'https://example.test/maps'}],dressCode:{enabled:false,text:null}},
 agenda:{enabled:false,moments:[]},
 practical:{
  bus:{enabled:false,pickupPoints:[],outboundTimes:[],returnTimes:[],collectUsageInRSVP:false,collectRouteChoiceInRSVP:false,collectReturnChoiceInRSVP:false},
  accommodation:{enabled:false,mode:'none',collectAccommodationInRSVP:false},
  gift:{enabled:false,mode:'none'},
  playlist:{enabled:false,mode:'none'}
 },
 rsvp:{route:'#',ctaLabel:'Confirmar asistencia',plusOneEnabled:false,childrenEnabled:false,customQuestions:[],menu:{enabled:false,options:[]},dietary:{enabled:false,prompt:null}},
 gallery:{enabled:false,photos:[]},
 closing:{line:'Gracias por acompañarnos'}
};
assert.deepEqual(validate(valid),[],'minimum valid canonical config must pass');
const clone=x=>structuredClone(x);
{
 const x=clone(valid);delete x.schemaVersion;delete x.cover.photo;delete x.rsvp.plusOneEnabled;
 let errors=validate(x);
 for(let e of ['$.schemaVersion:required','$.cover.photo:required','$.rsvp.plusOneEnabled:required'])assert.ok(errors.includes(e),e);
}
{
 const x=clone(valid);x.story.photo={src:'upload:story',fit:'crop',focusX:50,focusY:50,autoFrame:true};
 assert.ok(validate(x).includes('$.story.photo.autoFrame:unexpected'));
}
{
 const x=clone(valid);x.locations.items[0].websiteUrl='';
 assert.ok(validate(x).includes('$.locations.items[0].websiteUrl:uri'));
}
{
 const x=clone(valid);x.wedding.coverPlace='';
 assert.ok(validate(x).includes('$.wedding.coverPlace:minLength'));
}
{
 const x=clone(valid);x.story.textMode='broken';
 assert.ok(validate(x).includes('$.story.textMode:enum'));
}
{
 const x=clone(valid);x.gallery.photos=Array.from({length:5},(_,i)=>({src:'https://example.test/'+i,fit:'crop',focusX:50,focusY:50}));
 assert.ok(validate(x).includes('$.gallery.photos:maxItems'));
}
{
 const x=clone(valid);x.rsvp.menu.enabled=true;x.rsvp.menu.options=['Vegetariano'];
 assert.deepEqual(validate(x),[]);
}
console.log('PASS: canonical GUEST schema validated and 6 real backend incompatibility classes rejected. NOT commercial E2E.');
