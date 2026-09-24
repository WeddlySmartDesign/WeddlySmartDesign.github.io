const fs=require('fs');
function text(p){return fs.readFileSync(p,'utf8')}
function must(ok,msg){if(!ok){console.error('FAIL',msg);process.exitCode=1}else console.log('PASS',msg)}
const live=text('guests-rsvp-operations-live.html');
const formFlow=text('guests-rsvp-form-flow.html');
const composer=text('guests-rsvp-share-composer-v2.js');
const contact=text('guests-rsvp-contact-picker-v1.js');
const plusOps=text('guests-rsvp-plusone-ops-v1.js');
const single=text('guests-rsvp-v116-single-live.html');
const unit=text('guests-rsvp-v115-wedding-flex-live.html');
const cal=text('guests-rsvp-postsubmit-calendar-v1.js');

must(live.includes('guests-rsvp-share-composer-v2.js'),'operations loads safe share composer v2');
must(live.includes('guests-rsvp-contact-picker-v1.js'),'operations loads contact-picker bridge');
must(live.includes('guests-rsvp-plusone-ops-v1.js?v=4'),'operations cache-busts the fixed plus-one layer');
must(!live.includes('document.open()')&&!live.includes('document.write('),'operations runtime no longer rewrites the active document');
must(live.includes('new Blob([h]')&&live.includes('location.replace(u)'),'operations assembles a fresh parser-driven runtime');
must(live.includes('render();const __manage'),'operations renders local Guests before remote RSVP refresh');
must(live.includes("setTimeout(()=>c.abort(),6000)"),'operations management and claim requests are bounded');
must(live.includes("show('Tus invitados están disponibles"),'operations keeps local Guests usable when remote refresh fails');
must(live.includes("if(migrateLegacy())syncFields().catch(()=>{})"),'legacy field sync cannot block interaction');
must(live.includes('rsvp_load_signature_mismatch'),'operations refuses to boot if source patch no longer matches');
must(live.includes("localStorage.setItem('weddly_rsvp_public_token_v1',PT)"),'operations caches validated public RSVP token');
must(plusOps.includes('assignment.dataset.wsdPlusLabel!==label'),'plus-one DOM patch is idempotent and cannot rewrite its own mutation forever');
must(plusOps.includes('requestAnimationFrame(()=>{scheduled=false;patch()})'),'plus-one mutation observer is frame-throttled');
must((formFlow.includes('new Blob([h]')&&formFlow.includes('location.replace(u)'))||(formFlow.includes('document.open()')&&formFlow.includes('document.write(h)')&&formFlow.includes('document.close()')),'RSVP form assembles the hardened runtime through a supported complete document handoff');
must(formFlow.includes("fetchBound('guests-rsvp-form-flex.html")&&formFlow.includes("cache:'no-store'"),'RSVP form loads its source fresh through the bounded wrapper');
// The form wrapper deliberately returned to document.write on 2026-09-18 for stable Events/mobile navigation. Real-browser QA below is the behavioral source of truth; this static test guards complete assembly + bounded/fail-closed loading without pinning one parser strategy.
must(formFlow.includes("setTimeout(()=>c.abort(),7000)"),'RSVP form wrapper and API requests are bounded');
must(formFlow.includes('rsvp_form_request_signature_mismatch'),'RSVP form fails closed if source hardening no longer matches');
must(composer.includes("target='_blank'")||composer.includes("a.target='_blank'"),'WhatsApp opens outside the suite instead of replacing it');
must(!composer.includes('window.top.location.assign'),'share composer does not navigate the top-level suite');
must(composer.includes('function markSent(')&&composer.includes("status:'sent'"),'share composer persists sent delivery state');
must(composer.includes('wsdShareMark'),'copied links can be explicitly marked as sent');
must(composer.includes("PTKEY='weddly_rsvp_public_token_v1'"),'share composer reuses the public-token cache');
must(composer.includes("setTimeout(()=>ctl.abort(),7000)"),'share composer cannot remain stuck waiting for manage API');
must(composer.includes("if(!t)throw new Error('missing_public_token')"),'share composer fails visibly instead of building a link without a public token');
must(contact.includes('window.top?.navigator?.contacts'),'contact picker targets the top-level browsing context');
must(contact.includes("autocomplete','tel")&&contact.includes("autocomplete','email"),'contact fields retain mobile autofill fallback');
must(single.includes('guests-rsvp-postsubmit-calendar-v1.js'),'single RSVP loads post-submit calendar recovery');
must(unit.includes('guests-rsvp-postsubmit-calendar-v1.js'),'group RSVP loads post-submit calendar recovery');
must(cal.includes('BEGIN:VCALENDAR')&&cal.includes('Añadir al calendario'),'calendar recovery generates an ICS action');
if(process.exitCode)process.exit(process.exitCode);console.log('RSVP runtime/send/agenda/calendar regression suite passed');
