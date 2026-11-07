'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('guest/backend/guest-rsvp-ensure/index.ts','utf8');
const start=source.indexOf('function catalogueRsvpConfig(order:any){'),end=source.indexOf('Deno.serve(',start);
assert(start>=0&&end>start,'common questionnaire mapper missing');
const js=source.slice(start,end).replace('order:any','order').replaceAll('raw:any,i:number','raw,i').replaceAll('x:any','x');
const map=vm.runInNewContext(js+';catalogueRsvpConfig',{});
const create=(r,bus=false,acc=false,split=false)=>map({
 id:'test-order-uuid',questionnaire:{couple:{name1:'Ana',name2:'Pablo',date:'2027-09-12'},
 locations:split?{mode:'split',ceremony:{name:'Iglesia',time:'17:00'},celebration:{name:'Finca',time:'19:00'}}:{mode:'shared',shared:{name:'Finca Olivos',time:'18:30'}},
 rsvp:r,practical:{bus:{enabled:bus},accommodation:{enabled:acc}}}
});
const simple=create({menu:false,allergies:false,plusOne:false,children:false,customQuestions:[]});
assert.equal(simple.title,'Ana & Pablo');assert.equal(simple.date,'2027-09-12');
assert.equal(simple.time,'18:30');assert.equal(simple.venue,'Finca Olivos');
assert.equal(simple.questions.meal,false);assert.equal(simple.questions.allergy,false);
assert.equal(simple.questions.plusone,false);assert.equal(simple.questions.children,false);
assert.equal(simple.questions.transport,false);assert.equal(simple.transportOffered,false);
assert.equal(simple.accommodationOffered,false);assert.equal(simple.catalogOrderId,'test-order-uuid');
assert.equal(simple.customQuestions.length,0);
const full=create({menu:true,allergies:true,plusOne:true,children:true,customQuestions:['Canción favorita','¿Preferís menú vegano?']},true,true,true);
assert.equal(full.questions.meal,true);assert.equal(full.questions.allergy,true);
assert.equal(full.questions.plusone,true);assert.equal(full.questions.children,true);
assert.equal(full.questions.transport,true);assert.equal(full.transportOffered,true);
assert.equal(full.accommodationOffered,true);
assert.equal(full.venue,'Iglesia');assert.equal(full.time,'17:00');
assert.equal(full.customQuestions.length,2);
assert.equal(full.customQuestions[0].id,'catalog_q_1');
assert.equal(full.customQuestions[1].label,'¿Preferís menú vegano?');
assert.equal(full.customQuestions[0].type,'text');
assert.equal(full.customQuestions[0].required,false);
assert.equal(create({}).questions.meal,true,'existing default menu on');
assert.equal(create({}).questions.children,false,'children opt-in default');
const q=source.slice(source.indexOf('Deno.serve('));
for(const t of ["eq('license_id',access.licenseId)","catalog.status!=='delivered'","error:'invitation_not_delivered'","existing.config?.catalogOrderId!==catalog.id","from('guest_rsvp_submissions')","error:'existing_rsvp_answers_require_review'","config:catalogConfig||config"])
 assert(q.includes(t),'missing post-delivery creation guard '+t);
assert(q.indexOf("catalog.status!=='delivered'")<q.indexOf("from('guest_rsvp_forms').select("),'undelivered form must be blocked first');
const shell=fs.readFileSync('guest/guests-rsvp-operations-live.html','utf8');
assert(shell.includes("/functions/v1/guest-rsvp-ensure"),'customer ops must automatically initialize questionnaire RSVP');
assert(!shell.includes('await __claim()'),'operations cannot claim a fallback generic RSVP form');
console.log('PASS questionnaire RSVP mapping, optional questions, delivery gate, no overwrite with responses and first-use initialization');
