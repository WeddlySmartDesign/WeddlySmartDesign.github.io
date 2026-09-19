const fs=require('fs');
function read(p){return fs.readFileSync(p,'utf8')}
function must(ok,msg){if(!ok)throw new Error(msg);console.log('PASS',msg)}
const app=read('app.html'),ops=read('guests-rsvp-operations-live.html'),contact=read('guests-rsvp-contact-picker-v1.js'),share=read('guests-rsvp-share-composer-v2.js'),group=read('guests-rsvp-group-meal-pending-v1.js'),single=read('guests-rsvp-plusone-public-v1.js'),calendar=read('guests-rsvp-calendar-action-v2.js'),home=read('guests-home-rsvp-status-v1.js'),gwrap=read('guests-v116-production.html'),sync=read('guests-production-sync.js'),integrity=read('guests-state-integrity-v1.js'),sw=read('sw.js'),manifest=JSON.parse(read('manifest-suite.webmanifest'));
// shell/package
for(const x of ['paymentsFrame','guestsFrame','planningFrame','auxFrame']) must(app.includes(x),'suite shell contains '+x);
must(/serviceWorker\.register\(['"]\/sw\.js\?v=70/.test(app),'suite pins service worker v70');
must(Array.isArray(manifest.icons)&&manifest.icons.length>=2,'PWA manifest exposes install icons');
must(/weddly-v70-suite/.test(sw),'service worker cache release is v70');
// Guests integrity
for(const x of ['guests-production-sync.js','guests-state-integrity-v1.js','guests-seating-sync-hotfix-v1.js']) must(gwrap.includes(x),'Guests production wrapper loads '+x);
for(const x of ['function merge3(','function markDirty(','async function reconcileDirty(','a.r.status===409']) must(sync.includes(x),'Guests sync keeps invariant '+x);
for(const x of ['function merge3(','P.setItem=function','latest=parse(nativeGet.call(ls,KEY))']) must(integrity.includes(x),'Guests stale-write guard keeps '+x);
// RSVP owner send
must(ops.includes('guests-rsvp-contact-picker-v1.js'),'Send runtime loads contact picker');
must(ops.includes('guests-rsvp-share-composer-v2.js'),'Send runtime loads share composer');
must(contact.includes("legacy=document.getElementById('pick')")&&contact.includes("panel.querySelectorAll('#pick').forEach(x=>x.remove())"),'contact picker removes duplicate legacy action');
must(share.includes("'https://wa.me/'+(phone?phone:'')"),'WhatsApp uses saved phone when present');
must(!/wsdShareWhatsApp[^\n]{0,300}markSent\(/.test(share),'opening WhatsApp does not auto-mark sent');
must(share.includes("#wsdShareMark")&&share.includes('markSent(id,box)'),'sent state requires explicit action');
// meal integrity
must(group.includes("op.value=''" )&&group.includes("if(!attends)continue")&&group.includes("if(meal.value)continue"),'group RSVP starts blank and blocks missing meal');
must(single.includes("patchMainMeal")&&single.includes("plusMeal.value=''"),'single/+1 RSVP starts main and +1 meal blank');
must(single.includes("if(meal&&!meal.value)")&&single.includes('return false'),'single/+1 RSVP blocks unnamed meal for +1');
// calendar UX
must(calendar.includes("Añadir a Google Calendar")&&calendar.includes("Usar otro calendario (.ics)"),'calendar choices are explicit');
must(calendar.includes('https://calendar.google.com/calendar/render'),'primary calendar action targets Google Calendar');
must(calendar.includes("type:'text/calendar;charset=utf-8'")&&calendar.includes("a.download=lang()==='en'?'wedding.ics':'boda.ics'"),'ICS fallback remains available');
// Today / recent changes
for(const x of ['Cambios recientes','Ahora no asiste','Ahora asiste','Ha cambiado su menú','Ha añadido acompañante','Ahora necesita transporte']) must(home.includes(x),'Today recent changes covers '+x);
must(home.includes('slice(0,5)'),'Today limits recent changes to a bounded list');
console.log('Exhaustive static product invariants: PASS');