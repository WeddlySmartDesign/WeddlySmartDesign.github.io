#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const { normalizeBackendInvitationConfig: normalize } = require('../tools/backend_config_contract_v1.cjs');
const { validate } = require('../qa/validate_invitation_config_v1.cjs');

// Shape transcribed from deployed guest-invitation-flow v12 buildConfig.
// SYNTHETIC values only; NOT a captured order or live E2E response.
function producerShape() {
  return {
    schemaVersion:'guest-invitation-config-v1', // added by v13 preparer
    template:{id:'veil-light',version:'5.3.3',typographyVariant:'classic'},
    locale:'es',couple:{name1:'Eva',name2:'Nico'},
    wedding:{date:'2027-09-11',time:'17:00',coverPlace:''},
    cover:{showPlace:false,showTime:false}, // v12 lacks photo
    countdown:{enabled:true},
    story:{enabled:false,textMode:'preset',presetId:'story-03',body:'',photo:null},
    locations:{mode:'shared',
      heroPhoto:null,
      items:[{type:'shared',time:'17:00',name:'Finca ficticia',address:'',mapsUrl:'',websiteUrl:''}],
      dressCode:{enabled:false,text:''}
    },
    agenda:{enabled:false,moments:[]},
    practical:{
      bus:{enabled:false,pickupPoints:[],outboundTimes:[],returnTimes:[],note:'',mapsUrl:''},
      accommodation:{enabled:false,mode:'recommended',name:'',address:'',websiteUrl:'',
        bookingCode:'',bookingName:'',discountText:'',deadline:'',externalBookingUrl:null,
        note:'',phone:'',mapsUrl:''},
      gift:{enabled:false,mode:'short_text',displayText:'Si os apetece tener un detalle.',details:'',externalUrl:null},
      playlist:{enabled:false,mode:'external_link',prompt:'Mandadnos esa canción que no puede faltar.',url:''}
    },
    rsvp:{route:'#',ctaLabel:'Confirmar asistencia'}, // owned by the separate GUEST engine
    gallery:{enabled:false,photos:[]},
    closing:{line:'Gracias por formar parte de nuestra historia.'}
  };
}
const original = producerShape(), n = normalize(original);
assert.deepEqual(validate(n), [], 'single-venue VEIL shaped v13 config');
assert.equal(original.cover.photo,undefined,'normalizer must not mutate producer input');
assert.equal(n.cover.photo,null);
assert.equal(n.locations.items[0].mapsUrl,null);
assert.equal(n.locations.items[0].websiteUrl,null);
assert.equal(n.practical.bus.mapsUrl,null);
assert.equal(n.practical.playlist.url,null);
assert.equal(n.practical.accommodation.websiteUrl,null);
assert.equal(n.practical.accommodation.mapsUrl,null);
assert.equal(Object.hasOwn(n.rsvp,'plusOneEnabled'),false,'never invent RSVP entitlements');
assert.equal(Object.hasOwn(n.practical.bus,'collectUsageInRSVP'),false,'never invent transport RSVP state');
assert.deepEqual(normalize(n),n,'normalization must be idempotent');

const botanica = producerShape();
botanica.template={id:'botanica',version:'14.7',typographyVariant:'classic'};
botanica.couple={name1:'Alejandra María',name2:'Sebastián'};
botanica.wedding.coverPlace='Murcia';
botanica.cover.showPlace=true;
botanica.story={enabled:true,textMode:'none',presetId:'story-03',body:'',
 photo:{src:'upload:story',fit:'crop',focusX:50,focusY:50,autoFrame:true,alt:'Foto de la pareja'}};
botanica.locations.mode='split';
botanica.locations.items=[
 {type:'ceremony',time:'16:00',name:'Lugar uno',address:'',mapsUrl:'',websiteUrl:''},
 {type:'celebration',time:'19:00',name:'Lugar dos',address:'',mapsUrl:'',websiteUrl:''}
];
botanica.practical.bus={enabled:true,pickupPoints:['Parada de prueba'],outboundTimes:['15:00'],returnTimes:['01:00'],note:'',mapsUrl:''};
botanica.gallery={enabled:true,photos:[
 {src:'upload:gallery-1',fit:'crop',focusX:50,focusY:50,autoFrame:true,alt:'Foto'}
]};
assert.deepEqual(validate(normalize(botanica)),[],'photo-only and two-venue Botánica shaped candidate config');

for(const mode of ['preset','custom','none']){
 const s=structuredClone(botanica);
 s.story.textMode=mode;
 s.story.body=mode==='custom'?'Nuestro texto de prueba':'';
 assert.deepEqual(validate(normalize(s)),[], 'story '+mode);
}
const badUrl=producerShape();badUrl.practical.playlist.url='javascript:alert(1)';
assert.ok(validate(normalize(badUrl)).includes('$.practical.playlist.url:uri'),
 'nonempty unsafe URL must NEVER be hidden by normalizer');
const missingPhoto=structuredClone(botanica);missingPhoto.story.photo=null;
assert.ok(validate(normalize(missingPhoto)).includes('$.story.photo:required_for_photo_only'));
const hiddenCover=structuredClone(botanica);hiddenCover.wedding.coverPlace='';
assert.ok(validate(normalize(hiddenCover)).includes('$.wedding.coverPlace:required_when_shown'));
assert.throws(()=>normalize(null),/invalid_backend_config/);
assert.throws(()=>normalize({}),/invalid_cover/);
console.log('PASS: v12 producer-shaped synthetic VEIL/Botánica fixtures, 3 story modes, idempotence, URL and semantic mutations. Offline only; no real E2E.');
