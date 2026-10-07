const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
function read(p){return fs.readFileSync(path.join(root,p),'utf8')}
function ok(v,msg){if(!v)throw new Error(msg)}

const registry=JSON.parse(read('GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'));
ok(registry.catalog.minimumLaunchTemplates===5,'minimum launch catalog must be 5');
ok(registry.catalog.targetLaunchTemplates===6,'target launch catalog must be 6');
ok(registry.catalog.ownerTouchTargetMinutes===5,'owner touch target must remain five minutes');
ok(registry.templates.some(x=>x.id==='veil-light'&&x.status==='commercially-frozen'&&x.scalabilityCertified===true),'VEIL LIGHT frozen registry entry missing');

const live=read('guests-rsvp-operations-live.html');
const iBridge=live.indexOf('guests-catalog-invitation-bridge-v1.js');
const iComposer=live.indexOf('guests-rsvp-share-composer-v3.js');
ok(iBridge>=0&&iComposer>iBridge,'catalog bridge must load before share composer v3');

const bridge=read('guests-catalog-invitation-bridge-v1.js');
ok(bridge.includes("action:'active_for_member'"),'bridge must resolve active invitation from backend');
ok(bridge.includes('shareBaseUrl'),'bridge must use stored final invitation URL');
ok(!bridge.includes('veil-light'),'management bridge must be template-agnostic');
ok(bridge.includes('legacyUrl'),'legacy fallback must remain available');

const composer=read('guests-rsvp-share-composer-v3.js');
ok(composer.includes('__GuestCatalogBridge.buildRecipientUrl'),'existing composer must use catalog bridge');
ok(!composer.includes("templateId:'veil-light'"),'share composer cannot know a template');
ok(composer.includes('invitationUnitId'),'invitation units must be preserved');
ok(composer.includes('wsdShareMessage'),'existing personalized message composer must be preserved');

const ctx=read('guest-catalog-recipient-context-v1.js');
for(const p of ["q.get('rt')","q.get('g')","q.get('u')","q.get('lang')"])ok(ctx.includes(p),'recipient context missing '+p);
ok(ctx.includes('cfg.rsvp.route=rsvpUrl(ctx)'),'catalog template must route CTA into existing RSVP');
ok(!ctx.includes('veil-light'),'recipient context must be template-agnostic');

const core=read('guests-v116-production.html');
ok(core.includes('guests-seating-v2.js'),'existing seating engine missing');
ok(core.includes('guests-people-manager-v1.js'),'existing people engine missing');
ok(core.includes('guests-extra-event-lists-v1.js'),'existing extra-event/list engine missing');

console.log('CATALOG BRIDGE CONTRACT PASS');
