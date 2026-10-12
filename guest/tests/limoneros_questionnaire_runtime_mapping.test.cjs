#!/usr/bin/env node
'use strict';
/* D03 TEST-only renderer behavior in a deterministic DOM substitute.
   Two real-schema-shaped synthetic questionnaires; NOT an authenticated E2E order
   and NOT a substitute for Android/owner review. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const js=fs.readFileSync(path.join(__dirname,'../catalog-patches/design-03/1.0.0/patch.js'),'utf8');
const schema=JSON.parse(fs.readFileSync(path.join(__dirname,'../GUEST_INVITATION_CONFIG_SCHEMA_V1.json'),'utf8'));
for(const key of ['bus','accommodation','gift','playlist'])assert.ok(schema.properties.practical.properties[key]);

class Element {
 constructor(tag,id=''){
  this.tag=tag;this.id=id;this.children=[];this.className='';this._text='';this.href='';
  const set=new Set();
  this.classList={add:x=>set.add(x),remove:x=>set.delete(x),contains:x=>set.has(x),toggle:(x,on)=>{if(on)set.add(x);else set.delete(x)}};
 }
 set textContent(v){this._text=String(v);this.children=[];}
 get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
 get childElementCount(){return this.children.length;}
 append(...items){this.children.push(...items)}
 replaceChildren(...items){this.children=items;this._text=''}
}
function allNodes(root){return [root,...root.children.flatMap(allNodes)];}
function init(){
 const elements={'practical-items':new Element('div','practical-items'),'practical':new Element('section','practical'),'closing-line':new Element('p','closing-line')};
 elements['closing-line'].textContent='FRASE DE DEMO QUE NO DEBE APARECER';
 const calls=[];
 const document={baseURI:'https://guest-weddlysmartdesign.pages.dev/',
   getElementById:id=>elements[id]||null,
   createElement:tag=>new Element(tag),
   querySelectorAll:selector=>{assert.equal(selector,'[data-bg]:not(.invisible)');return [{},{}]}};
 const window={__GUEST_SUPPRESS_DEMO__:true,GUEST_APPLY_CONFIG:config=>{calls.push(config);return {original:true}}};
 vm.runInNewContext(js,{window,document,URL,Error});
 return {window,elements,calls};
}
function richConfig(){
 return {
  closing:{line:'Hasta pronto'},
  practical:{
   bus:{enabled:true,pickupPoints:['Plaza Mayor','Estación'],outboundTimes:['16:30'],returnTimes:['02:30','04:00'],note:'Reserva plaza',mapsUrl:'https://maps.example.invalid/bus'},
   accommodation:{enabled:true,mode:'room_block',name:'Hotel Limoneros',address:'Calle Test 12',websiteUrl:'https://hotel.example.invalid',mapsUrl:'https://maps.example.invalid/hotel',externalBookingUrl:'https://hotel.example.invalid/reservas',bookingCode:'BODA-PRUEBA',bookingName:'Pareja de prueba',discountText:'Descuento para invitados',deadline:'31/05/2027',priceText:'Desde 90€',phone:'600000000',note:'Consultar disponibilidad'},
   gift:{enabled:true,mode:'bank',displayText:'Vuestra compañía es el mejor regalo',details:'Información opcional',accountHolder:'Titular Test',iban:'ES0000000000000000000000',bicSwift:'TESTESMM',bizumPhone:'600000001',bizumRecipient:'Persona Test',externalUrl:null},
   playlist:{enabled:true,mode:'guest_request',prompt:'¿Qué canción no puede faltar?',url:'https://music.example.invalid/playlist'}
  }
 };
}
{
 const {window,elements,calls}=init(),c=richConfig(),snapshot=JSON.stringify(c);
 const result=window.GUEST_APPLY_CONFIG(c),items=elements['practical-items'].children;
 assert.equal(calls.length,1);assert.equal(JSON.stringify(c),snapshot,'Original config mutated');
 assert.equal(result.original,true);assert.equal(result.visibleScenes,2);
 assert.equal(items.length,4,'Enabled schema sections must render');
 assert.equal(items[0].textContent.includes('Paradas: Plaza Mayor · Estación'),true);
 assert.equal(items[0].textContent.includes('Vuelta: 02:30 · 04:00'),true);
 assert.equal(items[1].textContent.includes('Hotel Limoneros'),true);
 assert.equal(items[2].textContent.includes('Vuestra compañía es el mejor regalo'),true);
 assert.equal(items[3].textContent.includes('¿Qué canción no puede faltar?'),true);
 const nodes=allNodes(elements['practical-items']),links=nodes.filter(n=>n.tag==='a'),details=nodes.filter(n=>n.tag==='details');
 assert.equal(links.length,4,'Room block exposes hotel/map, not a Reservar CTA');assert.equal(details.length,2);
 assert.equal(details.some(n=>n.textContent.includes('Código: BODA-PRUEBA')),true);
 assert.equal(details.some(n=>n.textContent.includes('IBAN: ES0000000000000000000000')),true);
 assert.equal(details.some(n=>n.textContent.includes('Bizum: 600000001')),true);
 assert.equal(elements['practical'].classList.contains('invisible'),false);
}
{
 const {window,elements}=init(),c=richConfig();
 c.practical.accommodation.mode='external_booking';
 window.GUEST_APPLY_CONFIG(c);
 const links=allNodes(elements['practical-items']).filter(n=>n.tag==='a');
 assert.equal(links.length,5,'External booking must expose live Reservar link');
 assert.ok(links.some(n=>n.textContent==='Reservar'));
}
/* Universal sparse states: no fixed four-element visual layout. */
for(const count of [1,2,3]){
 const {window,elements}=init(),c=richConfig();
 Object.values(c.practical).forEach((part,index)=>{part.enabled=index<count});
 const oldSnapshot=JSON.stringify(c);
 window.GUEST_APPLY_CONFIG(c);
 assert.equal(elements['practical-items'].childElementCount,count,'Exactly active modules must render: '+count);
 assert.equal(elements['practical'].classList.contains('invisible'),false);
 assert.equal(JSON.stringify(c),oldSnapshot,'Rendering changed questionnaire fixture');
 const rendered=elements['practical-items'].children.map(n=>n.textContent);
 assert.ok(rendered.every(t=>t.length>0),'No blank visual block when optional fields absent');
}
{
 const {window,elements}=init(),c=richConfig();
 c.practical.bus.mapsUrl=null;
 c.practical.accommodation.websiteUrl=null;
 c.practical.accommodation.mapsUrl=null;
 c.practical.playlist.url=null;
 window.GUEST_APPLY_CONFIG(c);
 const links=allNodes(elements['practical-items']).filter(n=>n.tag==='a');
 assert.equal(links.length,0,'Do not invent map/hotel/playlist links when questionnaire has none');
}
{
 const {window,elements}=init(),c=richConfig();
 for(const part of Object.values(c.practical)){part.enabled=false;}
 c.closing.line=null;
 window.GUEST_APPLY_CONFIG(c);
 assert.equal(elements['practical-items'].childElementCount,0);
 assert.equal(elements['practical'].classList.contains('invisible'),true);
 assert.equal(elements['closing-line'].textContent,'','Closing must not invent wording');
 assert.equal(elements['closing-line'].classList.contains('invisible'),true);
}
{
 const {window,elements}=init(),c=richConfig();
 c.practical.bus.mapsUrl='javascript:alert(1)';
 c.practical.accommodation.externalBookingUrl='data:text/html,bad';
 c.practical.gift.externalUrl='javascript:alert(1)';
 c.practical.playlist.url='javascript:alert(1)';
 window.GUEST_APPLY_CONFIG(c);
 const links=allNodes(elements['practical-items']).filter(n=>n.tag==='a');
 assert.equal(links.length,2,'Only valid website and map URLs may open');
 assert.ok(links.every(n=>n.href.startsWith('https://')),'Untrusted URL rendered');
}
console.log('PASS D03 schema-shaped practical mapping: 4 sections, disabled states, closing/null, HTTP-only links, hidden booking and gift details; SYNTHETIC OFFLINE, NOT E2E');
