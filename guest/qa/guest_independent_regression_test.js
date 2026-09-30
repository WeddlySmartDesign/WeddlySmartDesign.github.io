const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..'),repoRoot=path.resolve(root,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const readRepo=p=>fs.readFileSync(path.join(repoRoot,p),'utf8');
const existsRepo=p=>fs.existsSync(path.join(repoRoot,p));
const ok=(c,m)=>{if(!c)throw new Error(m)};
const required=[
'index.html','guests-v116-production.html','guests-v114-integrated.html','guest-settings.html','access.html','guest.webmanifest','guest-sw.js','guest-icon.svg','guest-one-parity-v1.js','guests-personalizacion-essential.html','guests-personalizacion-signature-integrated.html',
'guests-home-rsvp-status-v1.js','guests-seating-v2.js','guests-seating-sync-hotfix-v1.js','guests-rsvp-form-flow.html','guests-rsvp-form-flex.html',
'guests-rsvp-custom-answers-v1.js','guests-rsvp-children-public-v1.js','guests-extra-event-lists-v1.js','guests-service-visibility-v1.js',
'guests-rsvp-essential-live.html','guests-rsvp-signature-live.html','weddly-personalizacion-essential.html','weddly-personalizacion-signature.html','event-invite.html','event-invite-v2.html'
];required.forEach(p=>ok(exists(p),'missing '+p));

const shell=read('index.html');
ok(shell.includes('GUEST by WeddlySmartDesign'),'shell brand missing');
ok(shell.includes('guest.webmanifest'),'manifest not linked');
ok(shell.includes('guest-sw.js'),'service worker not registered');
ok(shell.includes('guest-one-parity-v1.js'),'latest ONE Guests UX parity layer not loaded');
for(const forbidden of ['payments.html','planning.html','one.html','ONE Partner','STUDIO'])ok(!shell.includes(forbidden),'shell leaks '+forbidden);
for(const critical of ['guests-home-rsvp-status-v1.js?v=137-table-changes','guests-extra-event-lists-v1.js','guests-seating-sync-hotfix-v1.js','guests-rsvp-plusone-core-label-v1.js','guests-state-integrity-v1.js'])ok(shell.includes(critical),'latest ONE Guests layer missing: '+critical);

const form=read('guests-rsvp-form-flex.html');
ok(form.includes("cfg.questions?.children===true"),'children is no longer opt-in');
ok(form.includes('customQuestions'),'custom RSVP questions missing');
ok(form.includes('accommodationOffered===true'),'accommodation opt-in behavior missing');
ok(form.includes('plusone'),'plus-one config missing');

const home=read('guests-home-rsvp-status-v1.js');
ok(home.includes('todaySeatChanges')&&home.includes('recentChanges'),'Today table-change behavior missing');
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


const endpointFiles=[
'index.html','guests-v116-production.html','guests-production-sync.js','guests-access-layer.js','guests-production-ui.js','guests-production-ops.js',
'guests-rsvp-route-v1.js','guests-home-rsvp-status-v1.js','guests-smart-actions-v1.js','guests-rsvp-operations-feedback-v1.js','guests-rsvp-share-primary-v1.js','guests-rsvp-share-composer-v2.js','guests-rsvp-plusone-ops-v1.js','guests-rsvp-manual-parity-v1.js','guests-v114-integrated.html',
'guests-rsvp-operations-v2.html','guests-rsvp-operations-live.html','guests-rsvp-operations-v3.html','guests-rsvp-design-manage.html',
'guests-rsvp-form-flow.html','guests-rsvp-form-flex.html','guests-rsvp-public-clean.html','guests-rsvp-essential-live.html','guests-rsvp-signature-live.html','guests-personalizacion-essential.html','guests-personalizacion-signature-integrated.html',
'guests-rsvp-services-hotfix-v1.js','guests-rsvp-services-hotfix-v1.js','guests-rsvp-children-public-v1.js','guests-rsvp-plusone-public-v1.js','guests-rsvp-postsubmit-calendar-v1.js','guests-rsvp-calendar-action-v2.js','guests-rsvp-custom-answers-v1.js','guests-rsvp-children-answers-v1.js','guests-rsvp-v112-wedding-flex.html','guests-rsvp-v114-single-flex.html','guests-rsvp-v105-mobile.html','guests-rsvp-operations-feedback-v1.js','guests-rsvp-share-primary-v1.js','guests-rsvp-share-composer-v2.js','guests-rsvp-plusone-ops-v1.js','guests-rsvp-manual-parity-v1.js',
'guests-events-v3.html','guests-events-v3.js','guests-events-invite-addon-v2.js','guests-events-share-composer-v1.js','event-invite.html','event-invite-v2.html',
'guest-settings.html','access.html'
];
const legacyApis=['/weddly-guests-state','/weddly-rsvp-ensure','/weddly-rsvp-single-v2','/weddly-rsvp','/weddly-personalization','/weddly-event-state','/weddly-event-invite','/weddly-test-access','/weddly-access'];
for(const p of endpointFiles){if(!exists(p))continue;const body=read(p);const leaks=legacyApis.filter(x=>body.includes(x));ok(!leaks.length,p+' still uses shared ONE backend: '+leaks.join(', '))}


// B5: byte-level provenance and controlled-diff gate against the exact ONE source snapshot on this branch.
const sourceFiles=fs.readdirSync(repoRoot,{withFileTypes:true}).filter(x=>x.isFile()&&(x.name.startsWith('guests')||['weddly-personalizacion-essential.html','weddly-personalizacion-signature.html','event-invite.html','event-invite-v2.html'].includes(x.name))).map(x=>x.name).sort();
ok(sourceFiles.length===179,'unexpected ONE Guests source inventory: '+sourceFiles.length);
const allowedModified=new Set([
  'event-invite-v2.html','guests-access-layer.js','guests-events-invite-addon-v2.js','guests-events-share-composer-v1.js','guests-events-v3.html','guests-events-v3.js',
  'guests-home-rsvp-status-v1.js','guests-production-ops.js','guests-production-sync.js','guests-production-ui.js','guests-rsvp-design-manage.html','guests-rsvp-essential-live.html',
  'guests-rsvp-form-flex.html','guests-rsvp-form-flow.html','guests-rsvp-operations-live.html','guests-rsvp-operations-v3.html','guests-rsvp-public-clean.html','guests-rsvp-signature-live.html',
  'guests-smart-actions-v1.js','guests-v114-integrated.html','guests-v116-production.html','guests-personalizacion-essential.html','guests-personalizacion-signature-integrated.html',
  'guests-rsvp-children-public-v1.js','guests-rsvp-plusone-public-v1.js','guests-rsvp-postsubmit-calendar-v1.js','guests-rsvp-calendar-action-v2.js','guests-rsvp-custom-answers-v1.js','guests-rsvp-children-answers-v1.js','guests-rsvp-v112-wedding-flex.html','guests-rsvp-v114-single-flex.html','guests-rsvp-v105-mobile.html','guests-rsvp-services-hotfix-v1.js','guests-rsvp-operations-feedback-v1.js','guests-rsvp-share-primary-v1.js','guests-rsvp-share-composer-v2.js','guests-rsvp-plusone-ops-v1.js','guests-rsvp-manual-parity-v1.js','guests-invitation-editor-feedback-inner-v1.js'
]);
const namedFns=s=>[...new Set([...s.matchAll(/(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]))];
for(const p of sourceFiles){
  ok(exists(p),'source copy missing in /guest: '+p);
  const src=readRepo(p),dst=read(p);
  if(!allowedModified.has(p))ok(src===dst,'unexpected modification vs latest ONE source: '+p);
  else for(const fn of namedFns(src))ok(namedFns(dst).includes(fn),'source function lost in '+p+': '+fn);
}

// B5: ONE-shell improvements that directly affected Guests must be preserved or explicitly mapped.
const parity=read('guest-one-parity-v1.js');
const oneVisual=readRepo('suite-visual-coherence-v1.js'),oneSwipe=readRepo('suite-swipe-navigation-v1.js'),oneInstall=readRepo('suite-install-one-v1.js'),oneToday=readRepo('suite-today-v1.js'),oneServices=readRepo('suite-wedding-services-v1.js');
ok(oneVisual.includes('function patchGuests'),'ONE visual Guests layer missing from source baseline');
ok(parity.includes('min-height:48px')&&parity.includes('guestOneParityStyle'),'GUEST did not port ONE Guests visual navigation treatment');
ok(oneSwipe.includes('function bindGuestDirect'),'ONE direct Guests swipe layer missing from source baseline');
ok(parity.includes('guestSwipeParity')&&parity.includes('guestFastNav'),'GUEST did not port ONE Guests swipe/fast-nav behavior');
ok(oneInstall.includes('__wsdEssentialSaveHotfix'),'ONE Essential save resilience source missing');
const essentialEditor=read('guests-personalizacion-essential.html'),signatureEditor=read('guests-personalizacion-signature-integrated.html');
for(const editor of [essentialEditor,signatureEditor]){
  ok(editor.includes('/guest-rsvp')&&editor.includes('/guest-personalization'),'invitation editor still points outside isolated GUEST APIs');
  ok(editor.includes('RSVP config refresh failed after personalization was saved'),'ONE save resilience was not preserved in GUEST invitation editor');
  ok(!editor.includes('/weddly-rsvp')&&!editor.includes('/weddly-personalization'),'invitation editor leaks ONE APIs');
}
ok(oneToday.includes('guestRecentRemote')&&oneToday.includes('todaySeatChanges'),'ONE Today guest aggregation source missing');
ok(home.includes('customChange')&&home.includes('todaySeatChanges')&&home.includes('markRecentRead'),'GUEST internal Today does not preserve guest-relevant Today behavior');
ok(oneServices.includes('transportOffered')&&oneServices.includes('accommodationOffered'),'ONE service controls source missing');
ok(form.includes('transportOffered')&&form.includes('accommodationOffered'),'GUEST RSVP editor lost transport/accommodation controls');

const lock=JSON.parse(read('SOURCE_LOCK.json'));
ok(lock.captured_from_commit==='6e054a21480624c7f04c6879c7ad72ed55c7307d','source lock does not point to verified latest ONE baseline');

for(const p of ['guest.html','guest-checkout.html','guest-checkout-return.html','guest-order.html','guest-legal.html'])ok(existsRepo(p),'missing commercial file '+p);
const market=readRepo('guest.html'),checkout=readRepo('guest-checkout.html'),ret=readRepo('guest-checkout-return.html'),order=readRepo('guest-order.html'),legal=readRepo('guest-legal.html');
ok(market.includes('Vuestra invitación.')&&market.includes('Nosotros nos ocupamos.'),'invitation-first positioning missing');
ok(market.includes('24–48 h')&&market.includes('personalización incluida'),'managed personalization promise missing');
ok((market.match(/guests-rsvp-essential-0/g)||[]).length>=1&&market.includes('guests-signature-0'),'real design viewer missing');
for(const body of [checkout,ret,order])ok(body.includes('/guest-stripe-checkout'),'commercial flow is not using isolated GUEST checkout');
ok(checkout.includes('startPersonalizationConsent:true'),'personalization-start consent missing from checkout');
ok(order.includes('Essential 06')&&order.includes('Signature 04'),'order form does not expose all design families');
ok(order.includes("fd.has('children')")&&order.includes("fd.has('transport')")&&order.includes("fd.has('accommodation')"),'RSVP intake options missing');
for(const body of [market,checkout,ret,order,legal])ok(!/ONE by WeddlySmartDesign|Comprar ONE|ONE Essential|ONE Signature/.test(body),'commercial GUEST page leaks ONE branding');

console.log('GUEST independent regression gate: PASS');