const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
function read(p){return fs.readFileSync(path.join(root,p),'utf8')}
function ok(v,msg){if(!v)throw new Error(msg)}

(async()=>{
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

  // Behaviour QA: active catalog invitation preserves its own query string and only
  // receives recipient/RSVP context. No template knowledge is required by GUEST.
  const store=new Map([['weddly_shared_wedding_token','x'.repeat(60)]]);
  const context={
    window:{},
    location:{origin:'https://weddlysmartdesign.github.io',href:'https://weddlysmartdesign.github.io/guest/ops.html'},
    localStorage:{getItem:k=>store.get(k)||''},
    URL,
    AbortController,
    setTimeout,
    clearTimeout,
    Date,
    fetch:async()=>({
      ok:true,
      json:async()=>({ok:true,active:true,invitation:{shareBaseUrl:'https://cdn.example/final-invite.html?order=abc',templateId:'anything'}})
    })
  };
  context.window=context;
  vm.createContext(context);
  vm.runInContext(bridge,context);
  const single=await context.__GuestCatalogBridge.buildRecipientUrl({
    recipientId:'g_1',rsvpToken:'rsvp_public',lang:'es',name:'Ana',unitId:'',unitSize:1
  });
  const su=new URL(single);
  ok(su.origin==='https://cdn.example'&&su.pathname==='/final-invite.html','active catalog base URL not preserved');
  ok(su.searchParams.get('order')==='abc','existing invitation query lost');
  ok(su.searchParams.get('rt')==='rsvp_public','RSVP token missing from catalog URL');
  ok(su.searchParams.get('g')==='g_1','guest identity missing');
  ok(su.searchParams.get('n')==='Ana','guest label missing');

  context.__GuestCatalogBridge.clearCache();
  context.fetch=async()=>({ok:true,json:async()=>({ok:true,active:true,invitation:{shareBaseUrl:'https://cdn.example/final.html'}})});
  const unit=await context.__GuestCatalogBridge.buildRecipientUrl({
    recipientId:'g_2',rsvpToken:'r2',lang:'es',name:'B',unitId:'unit_9',unitSize:2
  });
  const uu=new URL(unit);
  ok(uu.searchParams.get('u')==='unit_9','invitation unit missing');
  ok(!uu.searchParams.has('g'),'unit URL must not also expose single guest id');


  const deliveryRuntime=read('guest-catalog-delivery-runtime-v1.js');
  ok(!deliveryRuntime.includes('veil-light'),'delivery runtime must be template-agnostic');
  ok(deliveryRuntime.includes("action:'public_load'"),'delivery runtime must load delivered order');
  ok(deliveryRuntime.includes("q.get('rt')"),'delivery runtime must read RSVP token');
  ok(deliveryRuntime.includes("q.get('g')"),'delivery runtime must read guest id');
  ok(deliveryRuntime.includes("q.get('u')"),'delivery runtime must read invitation unit');
  ok(deliveryRuntime.includes("cfg.rsvp.route=rsvpUrl()"),'delivery runtime must decorate RSVP route');

  const veilAdapter=read('guest-catalog-template-veil-light-adapter-v1.js');
  ok(veilAdapter.includes("root['veil-light']"),'VEIL LIGHT adapter missing');
  ok(veilAdapter.includes('VEIL_APPLY_CONFIG'),'VEIL LIGHT adapter must call frozen renderer interface');

  // Behaviour QA for the generic final-delivery runtime.
  const domNode={dataset:{},hidden:true};
  const dctx={
    window:{},
    document:{
      getElementById:()=>null,
      createElement:()=>domNode,
      body:{appendChild:()=>{}}
    },
    location:{origin:'https://weddlysmartdesign.github.io',href:'https://weddlysmartdesign.github.io/invite.html?rt=token_r&g=guest_7&n=Ana&lang=es'},
    URL,structuredClone,setTimeout,clearTimeout,
    fetch:async()=>({ok:true,json:async()=>({ok:true,order:{config:{rsvp:{route:'#',ctaLabel:'Confirmar asistencia'},couple:{name1:'A',name2:'B'}}}})})
  };
  dctx.window=dctx;
  vm.createContext(dctx);
  vm.runInContext(deliveryRuntime,dctx);
  let applied=null;
  const booted=await dctx.__GuestCatalogDeliveryRuntime.boot({publicToken:'public_order_token',applyConfig:c=>{applied=c}});
  ok(applied?.rsvp?.route.includes('/guest/guests-rsvp-v105.html'),'final delivery did not receive existing RSVP route');
  ok(applied.rsvp.route.includes('t=token_r'),'final delivery RSVP token missing');
  ok(applied.rsvp.route.includes('g=guest_7'),'final delivery guest id missing');
  ok(booted.recipient.guestId==='guest_7','recipient context not returned from delivery runtime');


  // Route isolation: guest product invitation must not lead to ONE's root RSVP.
  const legacy=context.__GuestCatalogBridge.legacyUrl({
    recipientId:'g_A',rsvpToken:'rsvp_person',lang:'en',name:'Marta',
    unitId:'',unitSize:1
  });
  const legacyParsed=new URL(legacy);
  ok(legacyParsed.pathname==='/guest/guests-rsvp-v105.html','legacy GUEST RSVP must stay under /guest/');
  ok(legacyParsed.searchParams.get('t')==='rsvp_person'&&legacyParsed.searchParams.get('g')==='g_A','legacy single RSVP context lost');
  const family=new URL(context.__GuestCatalogBridge.legacyUrl({
    recipientId:'ignored',rsvpToken:'rsvp_family',lang:'es',unitId:'u_7',unitSize:2
  }));
  ok(family.pathname==='/guest/guests-rsvp-v105.html'&&family.searchParams.get('u')==='u_7','legacy family route wrong');
  ok(!family.searchParams.has('g'),'family route must not add a person ID');

  const guestContext={window:{},location:new URL('https://weddlysmartdesign.github.io/guest/preview.html?rt=rsvp_family&u=u_7&lang=en'),URL,structuredClone};
  guestContext.window=guestContext;
  vm.createContext(guestContext);
  vm.runInContext(ctx,guestContext);
  const rc=new URL(guestContext.__GuestCatalogRecipientContext.rsvpUrl());
  ok(rc.pathname==='/guest/guests-rsvp-v105.html','generic recipient RSVP must use /guest/');
  ok(rc.searchParams.get('u')==='u_7'&&rc.searchParams.get('t')==='rsvp_family'&&rc.searchParams.get('lang')==='en','generic recipient RSVP context lost');

  const entry=read('guests-rsvp-v105.html');
  const gate=read('guests-rsvp-design-live.html');
  const clean=read('guests-rsvp-public-clean.html');
  ok(entry.includes("location.replace('guests-rsvp-design-live.html'"),'GUEST entrypoint must forward within its own directory');
  ok(gate.includes('/functions/v1/guest-personalization'),'GUEST public gate must use GUEST personalization');
  ok(!gate.includes('/functions/v1/weddly-personalization'),'GUEST must not read general/ONE personalization');
  ok(gate.includes("'guests-rsvp-public-clean.html'+location.search+location.hash"),'RSVP gate must preserve parameters');
  ok(clean.includes('/functions/v1/guest-personalization'),'GUEST clean invitation must use GUEST personalization');
  ok(clean.includes("guests-rsvp-signature-live.html")&&clean.includes("guests-rsvp-essential-live.html"),'GUEST invitation edition routing lost');
  ok(clean.includes("sp.get('u')")&&clean.includes("sp.get('g')"),'GUEST public RSVP must support person/family routes');
  ok(!deliveryRuntime.includes("location.origin+'/guests-rsvp-v105.html'"),'GUEST delivery cannot point to ONE root');

  console.log('CATALOG BRIDGE CONTRACT PASS');
})().catch(e=>{console.error(e);process.exit(1)});
