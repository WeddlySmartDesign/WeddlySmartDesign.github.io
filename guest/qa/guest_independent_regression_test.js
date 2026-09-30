const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const ok=(c,m)=>{if(!c)throw new Error(m)};
const required=[
'index.html','guests-v116-production.html','guests-v114-integrated.html','guest-settings.html','access.html','guest.webmanifest','guest-sw.js','guest-icon.svg',
'guests-home-rsvp-status-v1.js','guests-seating-v2.js','guests-seating-sync-hotfix-v1.js','guests-rsvp-form-flow.html','guests-rsvp-form-flex.html',
'guests-rsvp-custom-answers-v1.js','guests-rsvp-children-public-v1.js','guests-extra-event-lists-v1.js','guests-service-visibility-v1.js',
'guests-rsvp-essential-live.html','guests-rsvp-signature-live.html','weddly-personalizacion-essential.html','weddly-personalizacion-signature.html','event-invite.html','event-invite-v2.html'
];required.forEach(p=>ok(exists(p),'missing '+p));

const shell=read('index.html');
ok(shell.includes('GUEST by WeddlySmartDesign'),'shell brand missing');
ok(shell.includes('guest.webmanifest'),'manifest not linked');
ok(shell.includes('guest-sw.js'),'service worker not registered');
for(const forbidden of ['payments.html','planning.html','one.html','ONE Partner','STUDIO'])ok(!shell.includes(forbidden),'shell leaks '+forbidden);
for(const critical of ['guests-home-rsvp-status-v1.js?v=137-table-changes','guests-extra-event-lists-v1.js','guests-seating-sync-hotfix-v1.js','guests-rsvp-plusone-core-label-v1.js','guests-state-integrity-v1.js'])ok(shell.includes(critical),'latest ONE Guests layer missing: '+critical);

const form=read('guests-rsvp-form-flex.html');
ok(form.includes("cfg.questions?.children===true"),'children is no longer opt-in');
ok(form.includes('customQuestions'),'custom RSVP questions missing');
ok(form.includes('accommodationOffered===true'),'accommodation opt-in behavior missing');
ok(form.includes('plusone'),'plus-one config missing');

const home=read('guests-home-rsvp-status-v1.js');
ok(/table/i.test(home)&&/activity|change|recent/i.test(home),'Today table-change behavior missing');
const seating=read('guests-seating-v2.js');
ok(/activity|table/i.test(seating),'seating change registration missing');
const sync=read('guests-seating-sync-hotfix-v1.js');
ok(sync.length>500,'seating sync hotfix unexpectedly empty');

const settings=read('guest-settings.html');
for(const s of ['GUEST para los dos','Invitar a mi pareja','Instalar GUEST','weddlysmartdesign@gmail.com'])ok(settings.includes(s),'settings flow missing: '+s);
ok(settings.includes("action:'invite'"),'partner invite API flow missing');

const events=read('guests-events-v3.html'),eventProduct=read('guest-events-product-v1.js');
ok(events.includes('guest-events-product-v1.js'),'GUEST event simplification layer not loaded');
ok(eventProduct.includes('Presupuesto y pagos')&&eventProduct.includes('Tareas específicas'),'event non-GUEST sections are not actively removed');
const smart=read('guests-smart-actions-v1.js');
ok(!smart.includes('Invitados, tareas, pagos y calendario'),'ONE event copy leaked into GUEST');

const essential=read('guests-rsvp-essential-live.html'),signature=read('guests-rsvp-signature-live.html');
for(let i=1;i<=6;i++)ok(essential.includes('guests-rsvp-essential-0'+i+'.html'),'Essential 0'+i+' missing');
for(let i=1;i<=4;i++)ok(signature.includes('guests-signature-0'+i+'.html'),'Signature 0'+i+' missing');
ok(essential.includes('GUEST · by WeddlySmartDesign'),'Essential public branding not GUEST');
ok(signature.includes('GUEST · by WeddlySmartDesign'),'Signature public branding not GUEST');

const activeRouteFiles=['guests-access-layer.js','guests-rsvp-operations-v3.html','guests-events-invite-addon-v2.js','guests-events-share-composer-v1.js'];
for(const p of activeRouteFiles){
  const c=read(p);
  const bad=[...c.matchAll(/['"`](\/[^'"`?#]+\.(?:html|js))(?:\?[^'"`]*)?['"`]/g)].map(m=>m[1]);
  ok(bad.length===0,p+' escapes /guest via '+bad.join(', '));
}
const manifest=JSON.parse(read('guest.webmanifest'));
ok(manifest.name==='GUEST by WeddlySmartDesign','wrong manifest name');
ok(manifest.start_url==='./index.html'&&manifest.scope==='./','PWA scope is not isolated');
ok(manifest.display==='standalone','PWA is not standalone');

const lock=JSON.parse(read('SOURCE_LOCK.json'));
ok(lock.captured_from_commit==='6e054a21480624c7f04c6879c7ad72ed55c7307d','source lock does not point to verified latest ONE baseline');
console.log('GUEST independent regression gate: PASS');